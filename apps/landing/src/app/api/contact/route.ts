import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, type, companyName, subject, message, lang } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const isNl = lang === "nl";

    /* Save to Supabase */
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error } = await supabase.from("contact_submissions").insert({
        name,
        email,
        type: type || "consumer",
        company_name: companyName || null,
        subject: subject || "",
        message,
        lang: lang || "nl",
      });
      if (error) console.error("Supabase insert error:", error);
    }

    /* Email to PayWatch team */
    await resend.emails.send({
      from: "PayWatch <noreply@paywatch.app>",
      to: "info@paywatch.nl",
      subject: `Nieuw bericht: ${subject || "Contact"} — ${name}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
          <h2 style="color:#0A2540;margin:0 0 16px">Nieuw contactbericht</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#64748B;font-size:13px;width:120px">Type</td><td style="padding:8px 0;font-weight:600">${type === "business" ? "Bedrijf / Gemeente" : "Particulier"}</td></tr>
            ${companyName ? `<tr><td style="padding:8px 0;color:#64748B;font-size:13px">Bedrijf</td><td style="padding:8px 0;font-weight:600">${companyName}</td></tr>` : ""}
            <tr><td style="padding:8px 0;color:#64748B;font-size:13px">Naam</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#64748B;font-size:13px">E-mail</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#2563EB">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#64748B;font-size:13px">Onderwerp</td><td style="padding:8px 0">${subject || "—"}</td></tr>
            <tr><td style="padding:8px 0;color:#64748B;font-size:13px">Taal</td><td style="padding:8px 0">${isNl ? "Nederlands" : "English"}</td></tr>
          </table>
          <div style="margin-top:16px;padding:14px;background:#F4F7FB;border-radius:8px">
            <p style="margin:0;font-size:13px;color:#0F172A;line-height:1.6;white-space:pre-wrap">${message}</p>
          </div>
          <p style="margin-top:20px;font-size:12px;color:#94A3B8">Via paywatch.app/contact</p>
        </div>
      `,
    });

    /* Confirmation email to sender */
    await resend.emails.send({
      from: "PayWatch <noreply@paywatch.app>",
      to: email,
      subject: isNl ? "We hebben je bericht ontvangen" : "We received your message",
      html: isNl ? `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
          <h2 style="color:#0A2540;margin:0 0 8px">Bedankt, ${name}!</h2>
          <p style="color:#0F172A;line-height:1.6;margin:0 0 16px">We hebben je bericht ontvangen en nemen zo snel mogelijk contact met je op. Meestal reageren we binnen 24 uur.</p>
          <div style="padding:14px;background:#F4F7FB;border-radius:8px;margin:16px 0">
            <p style="margin:0;font-size:12px;color:#64748B"><strong>Je bericht:</strong></p>
            <p style="margin:6px 0 0;font-size:13px;color:#0F172A;line-height:1.5">${message.length > 200 ? message.slice(0, 200) + "..." : message}</p>
          </div>
          <p style="color:#64748B;font-size:13px;margin:16px 0 0">Met vriendelijke groet,<br><strong>Team PayWatch</strong></p>
          <hr style="border:none;border-top:1px solid #E2E8F0;margin:24px 0" />
          <p style="font-size:11px;color:#94A3B8;margin:0">PayWatch — Rotterdam, Nederland<br>paywatch.app</p>
        </div>
      ` : `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
          <h2 style="color:#0A2540;margin:0 0 8px">Thanks, ${name}!</h2>
          <p style="color:#0F172A;line-height:1.6;margin:0 0 16px">We've received your message and will get back to you as soon as possible. We usually respond within 24 hours.</p>
          <div style="padding:14px;background:#F4F7FB;border-radius:8px;margin:16px 0">
            <p style="margin:0;font-size:12px;color:#64748B"><strong>Your message:</strong></p>
            <p style="margin:6px 0 0;font-size:13px;color:#0F172A;line-height:1.5">${message.length > 200 ? message.slice(0, 200) + "..." : message}</p>
          </div>
          <p style="color:#64748B;font-size:13px;margin:16px 0 0">Kind regards,<br><strong>Team PayWatch</strong></p>
          <hr style="border:none;border-top:1px solid #E2E8F0;margin:24px 0" />
          <p style="font-size:11px;color:#94A3B8;margin:0">PayWatch — Rotterdam, Netherlands<br>paywatch.app</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
