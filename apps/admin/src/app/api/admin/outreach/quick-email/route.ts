import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

/* ── Sender signatures ── */
const SIGNATURES: Record<string, string> = {
  "samba@paywatch.nl": `
<br/><br/>
<div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 13px; color: #64748B; border-top: 1px solid #E2E8F0; padding-top: 16px; margin-top: 16px;">
  <strong style="color: #0A2540;">Samba Jarju</strong><br/>
  Co-founder · PayWatch<br/>
  <em style="font-size: 12px; color: #94A3B8;">PayWatch: De slimme buffer tussen jou en incassokosten.</em><br/>
  <a href="https://paywatch.app" style="color: #2563EB; text-decoration: none;">paywatch.app</a> · <a href="https://www.linkedin.com/in/sambajarju/" style="color: #2563EB; text-decoration: none;">LinkedIn</a>
</div>`,
  "mariama@paywatch.nl": `
<br/><br/>
<div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 13px; color: #64748B; border-top: 1px solid #E2E8F0; padding-top: 16px; margin-top: 16px;">
  <strong style="color: #0A2540;">Mariama Sesay</strong><br/>
  Co-founder · PayWatch<br/>
  <em style="font-size: 12px; color: #94A3B8;">PayWatch: De slimme buffer tussen jou en incassokosten.</em><br/>
  <a href="https://paywatch.app" style="color: #2563EB; text-decoration: none;">paywatch.app</a> · <a href="https://www.linkedin.com/in/hadja-mariama-sesay-3a5392228/" style="color: #2563EB; text-decoration: none;">LinkedIn</a>
</div>`,
  "info@paywatch.nl": `
<br/><br/>
<div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 13px; color: #64748B; border-top: 1px solid #E2E8F0; padding-top: 16px; margin-top: 16px;">
  <strong style="color: #0A2540;">PayWatch</strong><br/>
  <em style="font-size: 12px; color: #94A3B8;">De slimme buffer tussen jou en incassokosten.</em><br/>
  <a href="https://paywatch.app" style="color: #2563EB; text-decoration: none;">paywatch.app</a>
</div>`,
};

/**
 * GET — returns available senders with display names
 */
export async function GET() {
  const senders = [
    { email: "samba@paywatch.nl", name: "Samba Jarju", role: "Co-founder" },
    { email: "mariama@paywatch.nl", name: "Mariama Sesay", role: "Co-founder" },
    { email: "info@paywatch.nl", name: "PayWatch", role: "General" },
  ];
  return NextResponse.json({ senders });
}

/**
 * POST — send a single email with auto-appended signature
 * Accepts FormData (with attachments) or JSON (backwards compatible)
 * FormData fields: sender, to_email, to_name?, subject, body_html, contact_id?, attachment (File, multiple)
 * JSON body: { sender, to_email, to_name?, subject, body_html, contact_id? }
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient();

    // Parse body — FormData or JSON
    let sender: string, to_email: string, to_name: string | null, subject: string, body_html: string, contact_id: string | null;
    let attachments: File[] = [];
    let thread_id: string | null = null;

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      sender = formData.get("sender") as string || "";
      to_email = formData.get("to_email") as string || "";
      to_name = formData.get("to_name") as string || null;
      subject = formData.get("subject") as string || "";
      body_html = formData.get("body_html") as string || "";
      contact_id = formData.get("contact_id") as string || null;
      thread_id = formData.get("thread_id") as string || null;
      // Collect all attachment files
      const files = formData.getAll("attachment");
      for (const f of files) {
        if (f instanceof File && f.size > 0) attachments.push(f);
      }
    } else {
      const body = await req.json();
      sender = body.sender || "";
      to_email = body.to_email || "";
      to_name = body.to_name || null;
      subject = body.subject || "";
      body_html = body.body_html || "";
      contact_id = body.contact_id || null;
      thread_id = body.thread_id || null;
    }

    if (!sender || !to_email || !subject || !body_html) {
      return NextResponse.json(
        { error: "sender, to_email, subject, and body_html required" },
        { status: 400 }
      );
    }

    // Support multiple recipients: comma, semicolon, or newline separated
    const recipients = to_email
      .split(/[,;\n]+/)
      .map((e: string) => e.trim().toLowerCase())
      .filter((e: string) => e.includes("@"));

    if (recipients.length === 0) {
      return NextResponse.json({ error: "No valid email addresses" }, { status: 400 });
    }
    if (recipients.length > 50) {
      return NextResponse.json({ error: "Maximum 50 recipients per batch" }, { status: 400 });
    }

    // Limit: max 5 attachments, 10MB each
    for (const att of attachments) {
      if (att.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: `Attachment "${att.name}" is too large (max 10MB)` }, { status: 400 });
      }
    }
    if (attachments.length > 5) {
      return NextResponse.json({ error: "Maximum 5 attachments allowed" }, { status: 400 });
    }

    const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
    if (!MAILGUN_API_KEY) {
      return NextResponse.json({ error: "MAILGUN_API_KEY not configured" }, { status: 500 });
    }

    // Look up sending account
    const { data: account } = await supabase
      .from("b2b_sending_accounts")
      .select("*")
      .eq("email", sender)
      .single();

    if (!account) {
      return NextResponse.json({ error: `Sending account ${sender} not found` }, { status: 404 });
    }

    // Append signature
    const signature = SIGNATURES[sender] || "";
    const fullHtml = `<div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 14px; color: #0F172A; line-height: 1.6;">${body_html}${signature}</div>`;

    // Send to each recipient
    const results: { email: string; success: boolean; messageId?: string }[] = [];

    for (const recipientEmail of recipients) {
      const emailLogId = crypto.randomUUID();

      const form = new FormData();
      form.append("from", `${account.display_name} <${account.email}>`);
      form.append("to", to_name ? `${to_name} <${recipientEmail}>` : recipientEmail);
      form.append("subject", subject);
      form.append("html", fullHtml);
      form.append("h:Reply-To", `${account.display_name} <${account.email}>`);
      form.append("o:tracking-opens", "yes");
      form.append("o:tracking-clicks", "htmlonly");
      form.append("o:tag", "quick-email");
      form.append("v:email_log_id", emailLogId);

      for (const att of attachments) {
        form.append("attachment", att, att.name);
      }

      const res = await fetch(
        `https://api.eu.mailgun.net/v3/${account.domain}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString("base64")}`,
          },
          body: form,
        }
      );

      if (!res.ok) {
        results.push({ email: recipientEmail, success: false });
        continue;
      }

      const data = await res.json();
      results.push({ email: recipientEmail, success: true, messageId: data.id });

      // Always log to b2b_email_log (find contact_id if available)
      let resolvedContactId = contact_id;
      if (!resolvedContactId) {
        const { data: contactMatch } = await supabase
          .from("b2b_contacts")
          .select("id")
          .eq("email", recipientEmail)
          .single();
        resolvedContactId = contactMatch?.id || null;
      }

      // Upload attachments to storage for tracking
      const attachmentMeta: Array<{ name: string; size: number; type: string; path: string }> = [];
      for (const att of attachments) {
        try {
          const bytes = await att.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const safeName = att.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          const storagePath = `outbound/${emailLogId}-${safeName}`;
          const { error: uploadError } = await supabase.storage
            .from("email-attachments")
            .upload(storagePath, buffer, {
              contentType: att.type || "application/octet-stream",
              upsert: false,
            });
          if (!uploadError) {
            attachmentMeta.push({ name: att.name, size: att.size, type: att.type, path: storagePath });
          }
        } catch (e) {
          console.error("[Quick Email] Attachment upload failed:", e);
        }
      }

      await supabase.from("b2b_email_log").insert({
        id: emailLogId,
        contact_id: resolvedContactId,
        direction: "outbound",
        to_email: recipientEmail,
        to_name: to_name || null,
        from_email: account.email,
        from_name: account.display_name,
        subject,
        body_html: fullHtml,
        status: "sent",
        sent_at: new Date().toISOString(),
        mailtrap_message_id: data.id || null,
        sequence_step: 0,
        attachments: attachmentMeta.length > 0 ? attachmentMeta : [],
        thread_id: thread_id || emailLogId,
      }).then(({ error }) => {
        if (error) console.error("[Quick Email] Log failed:", error.message);
      });

      // Post to ClickUp if contact found
      if (resolvedContactId) {
        const CLICKUP_API_KEY = process.env.CLICKUP_API_KEY;
        if (CLICKUP_API_KEY) {
          const { data: contactData } = await supabase
            .from("b2b_contacts")
            .select("clickup_task_id")
            .eq("id", resolvedContactId)
            .single();
          if (contactData?.clickup_task_id) {
            fetch(`https://api.clickup.com/api/v2/task/${contactData.clickup_task_id}/comment`, {
              method: "POST",
              headers: { Authorization: CLICKUP_API_KEY, "Content-Type": "application/json" },
              body: JSON.stringify({
                comment_text: `📧 ${account.email} emailed on ${new Date().toLocaleDateString("nl-NL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} — Subject: "${subject}"`,
              }),
            }).catch((err) => console.error("[ClickUp Comment]", err));
          }
        }
      }
    }

    // Update daily sends count
    const totalSent = results.filter(r => r.success).length;
    const today = new Date().toISOString().split("T")[0];
    const { data: existing } = await supabase
      .from("b2b_daily_sends")
      .select("id, emails_sent")
      .eq("account_id", account.id)
      .eq("date", today)
      .single();

    if (existing) {
      await supabase
        .from("b2b_daily_sends")
        .update({ emails_sent: existing.emails_sent + totalSent })
        .eq("id", existing.id);
    } else {
      await supabase.from("b2b_daily_sends").insert({
        account_id: account.id,
        emails_sent: totalSent,
        date: today,
      });
    }

    const failed = results.filter(r => !r.success);
    return NextResponse.json({
      success: true,
      sent: totalSent,
      failed: failed.length,
      recipients: results,
    });
  } catch (err) {
    console.error("[Quick Email]", err);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}
