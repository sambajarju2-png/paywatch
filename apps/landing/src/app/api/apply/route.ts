import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jobId, jobTitle, name, email, phone, message, lang } = body;

    if (!name || !email || !jobId || !jobTitle) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const isNl = lang === "nl";

    /* Save to Supabase */
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase.from("job_applications").insert({
        job_id: jobId,
        job_title: jobTitle,
        name,
        email,
        phone: phone || null,
        message: message || null,
        lang: lang || "nl",
      });
    }

    /* Send emails via Resend */
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      /* 1. Notify PayWatch team */
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
        body: JSON.stringify({
          from: "PayWatch Jobs <jobs@paywatch.app>",
          to: "info@paywatch.nl",
          subject: `Nieuwe sollicitatie: ${jobTitle} — ${name}`,
          html: `
            <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto">
              <h2 style="color:#0A2540;margin-bottom:4px">Nieuwe sollicitatie</h2>
              <p style="color:#64748B;font-size:14px">Via paywatch.app/jobs/${jobId}</p>
              <hr style="border:none;border-top:1px solid #E2E8F0;margin:16px 0"/>
              <table style="width:100%;font-size:14px;color:#0F172A">
                <tr><td style="padding:6px 0;color:#64748B;width:100px">Functie</td><td style="padding:6px 0;font-weight:600">${jobTitle}</td></tr>
                <tr><td style="padding:6px 0;color:#64748B">Naam</td><td style="padding:6px 0;font-weight:600">${name}</td></tr>
                <tr><td style="padding:6px 0;color:#64748B">Email</td><td style="padding:6px 0"><a href="mailto:${email}" style="color:#2563EB">${email}</a></td></tr>
                ${phone ? `<tr><td style="padding:6px 0;color:#64748B">Telefoon</td><td style="padding:6px 0">${phone}</td></tr>` : ""}
              </table>
              ${message ? `<hr style="border:none;border-top:1px solid #E2E8F0;margin:16px 0"/><p style="font-size:14px;color:#0F172A;line-height:1.6">${message}</p>` : ""}
              <hr style="border:none;border-top:1px solid #E2E8F0;margin:16px 0"/>
              <p style="font-size:12px;color:#94A3B8">Ontvangen via paywatch.app — ${new Date().toLocaleString("nl-NL")}</p>
            </div>
          `,
        }),
      });

      /* 2. Thank-you email to applicant */
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
        body: JSON.stringify({
          from: "PayWatch <jobs@paywatch.app>",
          to: email,
          subject: isNl ? `Bedankt voor je sollicitatie bij PayWatch` : `Thanks for applying at PayWatch`,
          html: isNl ? `
            <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#0F172A">
              <h2 style="color:#0A2540">Hoi ${name},</h2>
              <p style="font-size:15px;line-height:1.7">Bedankt voor je sollicitatie als <strong>${jobTitle}</strong> bij PayWatch! We hebben je aanmelding ontvangen en nemen zo snel mogelijk contact met je op.</p>
              <p style="font-size:15px;line-height:1.7">Bij PayWatch bouwen we aan een tool die mensen helpt grip te krijgen op hun rekeningen. We geloven in eigenaarschap, vertrouwen en een relaxte werksfeer — waar je als mens wordt gezien, niet als resource.</p>
              <p style="font-size:15px;line-height:1.7">We kijken ernaar uit om kennis met je te maken.</p>
              <p style="font-size:15px;line-height:1.7;margin-top:24px">Groetjes,<br/><strong>Team PayWatch</strong></p>
              <hr style="border:none;border-top:1px solid #E2E8F0;margin:24px 0"/>
              <p style="font-size:12px;color:#94A3B8">PayWatch — Rotterdam, Nederland<br/>paywatch.app</p>
            </div>
          ` : `
            <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#0F172A">
              <h2 style="color:#0A2540">Hi ${name},</h2>
              <p style="font-size:15px;line-height:1.7">Thanks for applying as <strong>${jobTitle}</strong> at PayWatch! We've received your application and will get back to you as soon as possible.</p>
              <p style="font-size:15px;line-height:1.7">At PayWatch, we're building a tool that helps people take control of their bills. We believe in ownership, trust and a relaxed work culture — where you're seen as a person, not a resource.</p>
              <p style="font-size:15px;line-height:1.7">We look forward to getting to know you.</p>
              <p style="font-size:15px;line-height:1.7;margin-top:24px">Best,<br/><strong>Team PayWatch</strong></p>
              <hr style="border:none;border-top:1px solid #E2E8F0;margin:24px 0"/>
              <p style="font-size:12px;color:#94A3B8">PayWatch — Rotterdam, Netherlands<br/>paywatch.app</p>
            </div>
          `,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Apply API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
