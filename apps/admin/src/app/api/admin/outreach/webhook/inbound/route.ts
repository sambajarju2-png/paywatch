import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

function verifyMailgun(timestamp: string, token: string, signature: string): boolean {
  const signingKey = process.env.MAILGUN_WEBHOOK_SIGNING_KEY;
  if (!signingKey) return false;
  const hmac = crypto.createHmac("sha256", signingKey).update(timestamp + token).digest("hex");
  return hmac === signature;
}

/** Forward inbound email to personal inboxes based on recipient */
async function forwardToPersonalInbox(recipient: string, sender: string, subject: string, bodyHtml: string) {
  const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
  if (!MAILGUN_API_KEY) {
    console.log("[Forward] MAILGUN_API_KEY not set, skipping forward");
    return;
  }

  const FORWARD_MAP: Record<string, string[]> = {
    "samba@paywatch.nl": ["sambajarju2@gmail.com"],
    "mariama@paywatch.nl": ["mariama_kl@hotmail.com"],
    "info@paywatch.nl": ["sambajarju2@gmail.com", "mariama_kl@hotmail.com"],
  };

  // Find which addresses to forward to
  const targets = new Set<string>();
  const recipientLower = recipient.toLowerCase();
  for (const [addr, forwards] of Object.entries(FORWARD_MAP)) {
    if (recipientLower.includes(addr)) {
      forwards.forEach((f) => targets.add(f));
    }
  }

  if (targets.size === 0) {
    console.log(`[Forward] No forward target for recipient: ${recipient}`);
    return;
  }

  const auth = Buffer.from(`api:${MAILGUN_API_KEY}`).toString("base64");

  for (const target of targets) {
    const form = new URLSearchParams();
    form.append("from", `PayWatch Inbox <noreply@paywatch.nl>`);
    form.append("to", target);
    form.append("subject", `[Fwd] ${subject}`);
    form.append("html", `<div style="font-family:system-ui;padding:12px;border-left:3px solid #2563EB;margin-bottom:16px;font-size:13px;color:#64748B">Van: ${sender}<br>Aan: ${recipient}<br>Onderwerp: ${subject}</div>${bodyHtml}`);
    form.append("h:Reply-To", sender);

    try {
      const res = await fetch("https://api.eu.mailgun.net/v3/paywatch.nl/messages", {
        method: "POST",
        headers: { Authorization: `Basic ${auth}` },
        body: form,
      });
      console.log(`[Forward] Sent to ${target}: ${res.status} ${res.statusText}`);
    } catch (err) {
      console.error(`[Forward] Failed to forward to ${target}:`, err);
    }
  }
}

/**
 * POST — Mailgun inbound email webhook (for reply tracking)
 * 
 * Mailgun sends inbound emails as multipart/form-data.
 * We match replies to sent emails using the In-Reply-To header.
 * 
 * Mailgun inbound route config needed:
 *   Match: match_recipient(".*@paywatch.nl")
 *   Action: store() and notify("https://admin.paywatch.app/api/admin/outreach/webhook/inbound")
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Mailgun signature verification
    const timestamp = formData.get("timestamp") as string;
    const token = formData.get("token") as string;
    const signature = formData.get("signature") as string;

    if (timestamp && token && signature) {
      if (!verifyMailgun(timestamp, token, signature)) {
        console.error("[Inbound] Invalid signature");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    // Parse inbound email fields
    const sender = formData.get("sender") as string || "";
    const from = formData.get("from") as string || "";
    const recipient = formData.get("recipient") as string || "";
    const subject = formData.get("subject") as string || "";
    const bodyPlain = formData.get("body-plain") as string || "";
    const bodyHtml = formData.get("body-html") as string || "";
    const strippedText = formData.get("stripped-text") as string || "";
    const strippedHtml = formData.get("stripped-html") as string || "";
    const inReplyTo = formData.get("In-Reply-To") as string || "";
    const references = formData.get("References") as string || "";
    const messageId = formData.get("Message-Id") as string || "";

    console.log(`[Inbound] Reply from ${sender} to ${recipient}, subject: "${subject}", In-Reply-To: ${inReplyTo}`);

    const supabase = createServiceRoleClient();
    const now = new Date().toISOString();

    // ── Extract attachments ──
    const attachmentCount = parseInt(formData.get("attachment-count") as string || "0", 10);
    // Bucket is private — store path only, signed URLs generated at read time
    const attachments: Array<{ name: string; size: number; type: string; path: string }> = [];

    for (let i = 1; i <= attachmentCount; i++) {
      const file = formData.get(`attachment-${i}`) as File | null;
      if (!file) continue;
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const storagePath = `inbound/${Date.now()}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("email-attachments")
          .upload(storagePath, buffer, {
            contentType: file.type || "application/octet-stream",
            upsert: false,
          });

        if (!uploadError) {
          attachments.push({
            name: file.name,
            size: file.size,
            type: file.type || "application/octet-stream",
            path: storagePath,
          });
          console.log(`[Inbound] Saved attachment: ${file.name} (${file.size} bytes)`);
        } else {
          console.error(`[Inbound] Attachment upload failed:`, uploadError);
        }
      } catch (err) {
        console.error(`[Inbound] Attachment ${i} processing failed:`, err);
      }
    }

    // Use the stripped version (without quoted text) if available, fall back to full body
    const replyContent = strippedHtml || strippedText || bodyHtml || bodyPlain;

    // Strategy 0: Parse reply+{emailLogId}@reply.paywatch.nl from recipient (most reliable)
    let matchedEmail = null;
    const replyMatch = recipient.match(/reply\+([a-f0-9-]+)@/i);
    if (replyMatch) {
      const emailLogId = replyMatch[1];
      console.log(`[Inbound] Matched reply+ pattern, emailLogId: ${emailLogId}`);
      const { data } = await supabase
        .from("b2b_email_log")
        .select("id, contact_id, campaign_id")
        .eq("id", emailLogId)
        .single();
      matchedEmail = data;
    }

    // Strategy 1: Match by In-Reply-To header
    if (!matchedEmail && inReplyTo) {
      const cleanId = inReplyTo.trim().replace(/^<|>$/g, "");
      const { data } = await supabase
        .from("b2b_email_log")
        .select("id, contact_id, campaign_id")
        .or(`mailtrap_message_id.eq.<${cleanId}>,mailtrap_message_id.eq.${cleanId}`)
        .single();
      matchedEmail = data;
    }

    // Strategy 2: If no In-Reply-To match, try References header
    if (!matchedEmail && references) {
      const refIds = references.split(/\s+/).map((r) => r.trim().replace(/^<|>$/g, ""));
      for (const refId of refIds) {
        const { data } = await supabase
          .from("b2b_email_log")
          .select("id, contact_id, campaign_id")
          .or(`mailtrap_message_id.eq.<${refId}>,mailtrap_message_id.eq.${refId}`)
          .single();
        if (data) { matchedEmail = data; break; }
      }
    }

    // Strategy 3: Match by sender email → contact email + recent send
    if (!matchedEmail && sender) {
      const senderEmail = sender.toLowerCase().trim();
      const { data } = await supabase
        .from("b2b_email_log")
        .select("id, contact_id, campaign_id")
        .eq("to_email", senderEmail)
        .eq("direction", "outbound")
        .order("sent_at", { ascending: false })
        .limit(1)
        .single();
      matchedEmail = data;
    }

    if (!matchedEmail) {
      console.log(`[Inbound] No matching outbound email found for reply from ${sender}`);
      // Still store it as an unmatched inbound for audit
      await supabase.from("b2b_email_log").insert({
        direction: "inbound",
        from_email: sender,
        from_name: from.replace(/<[^>]+>/, "").trim(),
        to_email: recipient,
        subject,
        body_html: replyContent,
        status: "received",
        sent_at: now,
        sequence_step: 0,
        attachments: attachments.length > 0 ? attachments : [],
      });

      // Forward to personal inbox (fire-and-forget)
      await forwardToPersonalInbox(recipient, sender, subject, replyContent);

      return NextResponse.json({ received: true, matched: false });
    }

    // Update the original outbound email with reply data
    await supabase
      .from("b2b_email_log")
      .update({
        replied_at: now,
        status: "replied",
        reply_body: replyContent,
        reply_from: sender,
        reply_subject: subject,
      })
      .eq("id", matchedEmail.id);

    // Also insert a separate inbound record for the thread view
    await supabase.from("b2b_email_log").insert({
      contact_id: matchedEmail.contact_id,
      campaign_id: matchedEmail.campaign_id,
      direction: "inbound",
      from_email: sender,
      from_name: from.replace(/<[^>]+>/, "").trim(),
      to_email: recipient,
      subject,
      body_html: replyContent,
      status: "received",
      sent_at: now,
      mailtrap_message_id: messageId || null,
      sequence_step: 0,
      attachments: attachments.length > 0 ? attachments : [],
      thread_id: matchedEmail.id,
    });

    // Update contact status to replied
    if (matchedEmail.contact_id) {
      await supabase
        .from("b2b_contacts")
        .update({ status: "replied", updated_at: now })
        .eq("id", matchedEmail.contact_id);

      // Post reply activity to ClickUp (fire-and-forget)
      const CLICKUP_API_KEY = process.env.CLICKUP_API_KEY;
      if (CLICKUP_API_KEY) {
        const { data: contactData } = await supabase
          .from("b2b_contacts")
          .select("clickup_task_id, organization_name")
          .eq("id", matchedEmail.contact_id)
          .single();
        if (contactData?.clickup_task_id) {
          const stripped = replyContent.replace(/<[^>]+>/g, "").slice(0, 200);
          fetch(`https://api.clickup.com/api/v2/task/${contactData.clickup_task_id}/comment`, {
            method: "POST",
            headers: { Authorization: CLICKUP_API_KEY, "Content-Type": "application/json" },
            body: JSON.stringify({
              comment_text: `💬 Reply received from ${sender} on ${new Date().toLocaleDateString("nl-NL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} — "${stripped}"`,
            }),
          }).catch((err) => console.error("[ClickUp Reply Comment]", err));

          // Also update ClickUp task status to replied
          fetch(`https://api.clickup.com/api/v2/task/${contactData.clickup_task_id}`, {
            method: "PUT",
            headers: { Authorization: CLICKUP_API_KEY, "Content-Type": "application/json" },
            body: JSON.stringify({ status: "replied" }),
          }).catch((err) => console.error("[ClickUp Status Update]", err));
        }
      }
    }

    console.log(`[Inbound] Reply matched to email ${matchedEmail.id}, contact ${matchedEmail.contact_id}`);

    // Forward to personal inbox (fire-and-forget)
    await forwardToPersonalInbox(recipient, sender, subject, replyContent);

    return NextResponse.json({ received: true, matched: true, emailLogId: matchedEmail.id });
  } catch (err) {
    console.error("[Inbound]", err);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
