import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;

function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(req: NextRequest) {
  try {
    const { leadId, to, subject, body, from } = await req.json();

    if (!to || !subject || !body) {
      return NextResponse.json(
        { error: "to, subject, and body are required" },
        { status: 400 }
      );
    }

    const senderEmail = from || "business@paywatch.nl";
    const senderName =
      senderEmail.startsWith("mariama") || senderEmail.startsWith("sesay")
        ? "Mariama Sesay"
        : "Samba Jarju";

    // Send via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${senderName} <${senderEmail}>`,
        to: [to],
        subject,
        html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; line-height: 1.6; color: #1a1a2e;">${body.replace(/\n/g, "<br/>")}</div>`,
        reply_to: senderEmail,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("[Send Email]", err);
      return NextResponse.json(
        { error: err.message || "Failed to send" },
        { status: 500 }
      );
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
