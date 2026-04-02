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
  Co-founder &amp; CTO · PayWatch<br/>
  <a href="https://paywatch.app" style="color: #2563EB; text-decoration: none;">paywatch.app</a>
</div>`,
  "mariama@paywatch.nl": `
<br/><br/>
<div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 13px; color: #64748B; border-top: 1px solid #E2E8F0; padding-top: 16px; margin-top: 16px;">
  <strong style="color: #0A2540;">Mariama Sesay</strong><br/>
  Co-founder &amp; CMO · PayWatch<br/>
  <a href="https://paywatch.app" style="color: #2563EB; text-decoration: none;">paywatch.app</a>
</div>`,
  "info@paywatch.nl": `
<br/><br/>
<div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 13px; color: #64748B; border-top: 1px solid #E2E8F0; padding-top: 16px; margin-top: 16px;">
  <strong style="color: #0A2540;">PayWatch</strong><br/>
  Grip op je rekeningen<br/>
  <a href="https://paywatch.app" style="color: #2563EB; text-decoration: none;">paywatch.app</a>
</div>`,
};

/**
 * GET — returns available senders with display names
 */
export async function GET() {
  const senders = [
    { email: "samba@paywatch.nl", name: "Samba Jarju", role: "Co-founder & CTO" },
    { email: "mariama@paywatch.nl", name: "Mariama Sesay", role: "Co-founder & CMO" },
    { email: "info@paywatch.nl", name: "PayWatch", role: "General" },
  ];
  return NextResponse.json({ senders });
}

/**
 * POST — send a single email with auto-appended signature
 * Body: { sender, to_email, to_name?, subject, body_html, contact_id? }
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const body = await req.json();
    const { sender, to_email, to_name, subject, body_html, contact_id } = body;

    if (!sender || !to_email || !subject || !body_html) {
      return NextResponse.json(
        { error: "sender, to_email, subject, and body_html required" },
        { status: 400 }
      );
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

    // Send via Mailgun EU
    const form = new FormData();
    form.append("from", `${account.display_name} <${account.email}>`);
    form.append("to", to_name ? `${to_name} <${to_email}>` : to_email);
    form.append("subject", subject);
    form.append("html", fullHtml);
    form.append("o:tracking-opens", "yes");
    form.append("o:tracking-clicks", "htmlonly");
    form.append("o:tag", "quick-email");

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
      const errText = await res.text();
      return NextResponse.json({ error: `Mailgun error: ${errText}` }, { status: 500 });
    }

    const data = await res.json();

    // Log in b2b_email_log if contact_id is provided
    if (contact_id) {
      await supabase.from("b2b_email_log").insert({
        contact_id,
        direction: "outbound",
        to_email,
        to_name: to_name || null,
        from_email: account.email,
        from_name: account.display_name,
        subject,
        body_html: fullHtml,
        status: "sent",
        sent_at: new Date().toISOString(),
        mailtrap_message_id: data.id || null,
        sequence_step: 0,
      });
    }

    // Update daily sends
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
        .update({ emails_sent: existing.emails_sent + 1 })
        .eq("id", existing.id);
    } else {
      await supabase.from("b2b_daily_sends").insert({
        account_id: account.id,
        emails_sent: 1,
        date: today,
      });
    }

    return NextResponse.json({
      success: true,
      messageId: data.id,
      from: `${account.display_name} <${account.email}>`,
      to: to_email,
      subject,
    });
  } catch (err) {
    console.error("[Quick Email]", err);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}
