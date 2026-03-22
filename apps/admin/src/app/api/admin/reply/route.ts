import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY not configured. Add it to admin Vercel env vars." }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const { to, name, subject, message, lang } = await request.json();

  if (!to || !message) {
    return NextResponse.json({ error: "Missing to or message" }, { status: 400 });
  }

  const isNl = lang === "nl";

  try {
    await resend.emails.send({
      from: "PayWatch <noreply@paywatch.app>",
      to,
      subject: subject ? `Re: ${subject}` : (isNl ? "Reactie van PayWatch" : "Reply from PayWatch"),
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
          <h2 style="color:#0A2540;margin:0 0 12px">${isNl ? `Hoi ${name},` : `Hi ${name},`}</h2>
          <div style="color:#0F172A;line-height:1.7;font-size:14px;white-space:pre-wrap">${message}</div>
          <hr style="border:none;border-top:1px solid #E2E8F0;margin:24px 0" />
          <p style="color:#64748B;font-size:13px;margin:0">${isNl ? "Met vriendelijke groet," : "Kind regards,"}<br><strong>Team PayWatch</strong></p>
          <p style="font-size:11px;color:#94A3B8;margin:16px 0 0">PayWatch — Rotterdam, Nederland<br>paywatch.app</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reply email error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
