import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

const SENDER_NAMES: Record<string, string> = {
  "samba@paywatch.nl": "Samba Jarju",
  "mariama@paywatch.nl": "Mariama Sesay",
  "info@paywatch.nl": "PayWatch",
};

export async function POST(req: NextRequest) {
  try {
    const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
    if (!MAILGUN_API_KEY) {
      return NextResponse.json({ error: "MAILGUN_API_KEY not set" }, { status: 500 });
    }

    const { leadId, to, subject, body, from } = await req.json();

    if (!to || !subject || !body) {
      return NextResponse.json(
        { error: "to, subject, and body are required" },
        { status: 400 }
      );
    }

    const senderEmail = from || "samba@paywatch.nl";
    const senderName = SENDER_NAMES[senderEmail] || "Samba Jarju";

    const form = new FormData();
    form.append("from", `${senderName} <${senderEmail}>`);
    form.append("to", to);
    form.append("subject", subject);
    form.append(
      "html",
      `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; line-height: 1.6; color: #1a1a2e;">${body.replace(/\n/g, "<br/>")}</div>`
    );

    const res = await fetch("https://api.eu.mailgun.net/v3/paywatch.nl/messages", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString("base64")}`,
      },
      body: form,
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[Send Email]", err);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    // Update lead status to "contacted" if it was "new"
    if (leadId) {
      const supabase = createServiceRoleClient();
      await supabase
        .from("b2b_contact_submissions")
        .update({ status: "contacted", updated_at: new Date().toISOString() })
        .eq("id", leadId)
        .eq("status", "new");
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Send Email]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
