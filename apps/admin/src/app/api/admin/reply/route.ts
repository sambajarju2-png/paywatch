import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  try {
    const { to, name, subject, message } = await request.json();
    if (!to || !subject || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "PayWatch <noreply@paywatch.app>",
      reply_to: "info@paywatch.nl",
      to,
      subject,
      html: `
        <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
          <div style="background: #0A2540; border-radius: 12px 12px 0 0; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 20px;">PayWatch</h1>
          </div>
          <div style="background: white; border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 12px 12px; padding: 32px;">
            <p style="color: #0F172A; font-size: 15px; margin: 0 0 8px;">Hoi ${name || ""},</p>
            <div style="color: #334155; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
            <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0;" />
            <p style="color: #94A3B8; font-size: 12px; margin: 0;">PayWatch — Jouw rekeningen onder controle</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Reply error:", err);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}
