import { NextResponse } from "next/server";
import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend && process.env.RESEND_API_KEY) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

export async function POST(request: Request) {
  try {
    const { to, subject, message, name } = await request.json();
    if (!to || !message) return NextResponse.json({ error: "Missing to or message" }, { status: 400 });

    const resend = getResend();
    if (!resend) return NextResponse.json({ error: "Resend not configured" }, { status: 500 });

    await resend.emails.send({
      from: "PayWatch <noreply@paywatch.app>",
      to,
      reply_to: "info@paywatch.nl",
      subject: subject || "Bericht van PayWatch",
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
          <h2 style="color:#0A2540;margin:0 0 16px;font-size:18px">Hallo${name ? ` ${name}` : ""},</h2>
          <div style="color:#0F172A;font-size:14px;line-height:1.6;white-space:pre-wrap">${message}</div>
          <hr style="border:none;border-top:1px solid #E2E8F0;margin:24px 0" />
          <p style="font-size:12px;color:#64748B;margin:0">Met vriendelijke groet,<br><strong>Team PayWatch</strong></p>
          <p style="font-size:11px;color:#94A3B8;margin:12px 0 0">PayWatch — Rotterdam, Nederland<br>paywatch.app</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reply error:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
