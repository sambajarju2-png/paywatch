import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    /* Email to PayWatch team */
    await resend.emails.send({
      from: "PayWatch <noreply@paywatch.app>",
      to: "info@paywatch.nl",
      subject: `Nieuwe sollicitatie: ${jobTitle} — ${name}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
          <h2 style="color:#0A2540;margin:0 0 16px">Nieuwe sollicitatie</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#64748B;font-size:13px;width:120px">Vacature</td><td style="padding:8px 0;font-weight:600">${jobTitle}</td></tr>
            <tr><td style="padding:8px 0;color:#64748B;font-size:13px">Naam</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#64748B;font-size:13px">E-mail</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#2563EB">${email}</a></td></tr>
            ${phone ? `<tr><td style="padding:8px 0;color:#64748B;font-size:13px">Telefoon</td><td style="padding:8px 0">${phone}</td></tr>` : ""}
          </table>
          ${message ? `<div style="margin-top:16px;padding:12px;background:#F4F7FB;border-radius:8px"><p style="margin:0;font-size:13px;color:#0F172A">${message}</p></div>` : ""}
          <p style="margin-top:24px;font-size:12px;color:#94A3B8">Via paywatch.app/jobs/${jobId}</p>
        </div>
      `,
    });

    /* Thank-you email to applicant */
    await resend.emails.send({
      from: "PayWatch <noreply@paywatch.app>",
      to: email,
      subject: isNl ? "Bedankt voor je sollicitatie bij PayWatch!" : "Thanks for applying at PayWatch!",
      html: isNl ? `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
          <h2 style="color:#0A2540;margin:0 0 8px">Bedankt, ${name}!</h2>
          <p style="color:#0F172A;line-height:1.6;margin:0 0 16px">We hebben je sollicitatie voor <strong>${jobTitle}</strong> ontvangen. We bekijken je aanmelding en nemen zo snel mogelijk contact met je op.</p>
          <div style="padding:16px;background:#F4F7FB;border-radius:12px;margin:16px 0">
            <h3 style="color:#0A2540;margin:0 0 8px;font-size:14px">Over PayWatch</h3>
            <p style="color:#64748B;line-height:1.6;margin:0;font-size:13px">PayWatch is een Nederlands bedrijf dat mensen helpt grip te krijgen op hun rekeningen. We zijn een klein team met grote ambities, gevestigd in Rotterdam. Bij ons draait het om vertrouwen, eigenaarschap en een relaxte werksfeer — we geloven dat goede mensen het beste werk leveren als ze zich op hun gemak voelen.</p>
          </div>
          <p style="color:#64748B;font-size:13px;margin:16px 0 0">Tot snel,<br><strong>Team PayWatch</strong></p>
          <hr style="border:none;border-top:1px solid #E2E8F0;margin:24px 0" />
          <p style="font-size:11px;color:#94A3B8;margin:0">PayWatch — Rotterdam, Nederland<br>paywatch.app</p>
        </div>
      ` : `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
          <h2 style="color:#0A2540;margin:0 0 8px">Thanks, ${name}!</h2>
          <p style="color:#0F172A;line-height:1.6;margin:0 0 16px">We've received your application for <strong>${jobTitle}</strong>. We'll review it and get back to you as soon as possible.</p>
          <div style="padding:16px;background:#F4F7FB;border-radius:12px;margin:16px 0">
            <h3 style="color:#0A2540;margin:0 0 8px;font-size:14px">About PayWatch</h3>
            <p style="color:#64748B;line-height:1.6;margin:0;font-size:13px">PayWatch is a Dutch company helping people take control of their bills. We're a small team with big ambitions, based in Rotterdam. We value trust, ownership and a relaxed work culture — we believe great people do their best work when they feel comfortable.</p>
          </div>
          <p style="color:#64748B;font-size:13px;margin:16px 0 0">Talk soon,<br><strong>Team PayWatch</strong></p>
          <hr style="border:none;border-top:1px solid #E2E8F0;margin:24px 0" />
          <p style="font-size:11px;color:#94A3B8;margin:0">PayWatch — Rotterdam, Netherlands<br>paywatch.app</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Job application error:", error);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
