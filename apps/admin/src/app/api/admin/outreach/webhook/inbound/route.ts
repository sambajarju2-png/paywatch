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
      });
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
    });

    // Update contact status to replied
    if (matchedEmail.contact_id) {
      await supabase
        .from("b2b_contacts")
        .update({ status: "replied", updated_at: now })
        .eq("id", matchedEmail.contact_id);
    }

    console.log(`[Inbound] Reply matched to email ${matchedEmail.id}, contact ${matchedEmail.contact_id}`);

    return NextResponse.json({ received: true, matched: true, emailLogId: matchedEmail.id });
  } catch (err) {
    console.error("[Inbound]", err);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
