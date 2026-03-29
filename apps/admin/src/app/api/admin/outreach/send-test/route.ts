import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// POST — Send a single email immediately (for testing)
// Body: { emailLogId }
export async function POST(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const { emailLogId } = await req.json();

    if (!emailLogId) {
      return NextResponse.json({ error: "emailLogId required" }, { status: 400 });
    }

    const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
    if (!MAILGUN_API_KEY) {
      return NextResponse.json({ error: "MAILGUN_API_KEY not configured" }, { status: 500 });
    }

    // Fetch the email
    const { data: email, error: fetchError } = await supabase
      .from("b2b_email_log")
      .select("*")
      .eq("id", emailLogId)
      .single();

    if (fetchError || !email) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    // Find the sending account
    const { data: account } = await supabase
      .from("b2b_sending_accounts")
      .select("*")
      .eq("email", email.from_email)
      .single();

    if (!account) {
      return NextResponse.json({ error: "Sending account not found" }, { status: 404 });
    }

    // Mark as sending
    await supabase
      .from("b2b_email_log")
      .update({ status: "sending" })
      .eq("id", emailLogId);

    // Send via Mailgun EU
    const form = new FormData();
    form.append("from", `${account.display_name} <${account.email}>`);
    form.append(
      "to",
      email.to_name
        ? `${email.to_name} <${email.to_email}>`
        : email.to_email
    );
    form.append("subject", email.subject);
    form.append("html", email.body_html);
    if (email.body_text) form.append("text", email.body_text);
    if (email.campaign_id) form.append("o:tag", `campaign-${email.campaign_id}`);
    form.append("o:tracking-opens", "yes");
    form.append("o:tracking-clicks", "htmlonly");
    form.append(
      "h:List-Unsubscribe",
      `<mailto:unsubscribe@paywatch.nl?subject=unsubscribe-${email.contact_id || "test"}>`
    );
    form.append("v:email_log_id", emailLogId);

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
      // Revert status
      await supabase
        .from("b2b_email_log")
        .update({ status: "queued" })
        .eq("id", emailLogId);
      return NextResponse.json(
        { error: `Mailgun error: ${errText}` },
        { status: 500 }
      );
    }

    const data = await res.json();

    // Update email log
    await supabase
      .from("b2b_email_log")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        mailtrap_message_id: data.id || null,
      })
      .eq("id", emailLogId);

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
      to: email.to_email,
      subject: email.subject,
    });
  } catch (err) {
    console.error("[Send Test]", err);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}
