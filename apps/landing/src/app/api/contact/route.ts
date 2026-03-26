import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { checkPublicRateLimit } from "@/lib/rate-limit";

/**
 * POST /api/contact
 *
 * Saves contact submission to Supabase, optionally adds to Resend Audience,
 * sends notification to PayWatch team + confirmation to sender.
 *
 * Body: {
 *   name, email, type ("consumer" | "gemeente" | "aid_org" | "company"),
 *   companyName?, subject, message, lang,
 *   subscribeNewsletter?: boolean  ← if true, also adds to Resend audience
 * }
 */

const RESEND_AUDIENCES: Record<string, string> = {
  consumer: "065fa004-bc05-4d75-abaf-67ed1e41872d",
  gemeente: "113aa5e0-31d8-4db4-bffd-1ddc42dd675e",
  aid_org: "113aa5e0-31d8-4db4-bffd-1ddc42dd675e",
  company: "113aa5e0-31d8-4db4-bffd-1ddc42dd675e",
};

let _resend: Resend | null = null;
function getResend() {
  if (!_resend && process.env.RESEND_API_KEY) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(request: NextRequest) {
  // Rate limit: max 5 contact submissions per IP per hour
  const limited = await checkPublicRateLimit("contact", 5, 60);
  if (limited) return limited;

  try {
    const body = await request.json();
    const { name, email, type, companyName, subject, message, lang, subscribeNewsletter } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const isNl = (lang || "nl") === "nl";
    const contactType = type || "consumer";

    // 1. Save to Supabase contact_submissions
    const supabase = getSupabase();
    if (supabase) {
      const { error: dbError } = await supabase.from("contact_submissions").insert({
        name,
        email,
        type: contactType,
        company_name: companyName || null,
        subject: subject || "",
        message,
        lang: lang || "nl",
        status: "new",
      });
      if (dbError) console.error("Contact DB error:", dbError);
    }

    const resend = getResend();

    // 2. If they opted into newsletter, add to Resend Audience + newsletter_subscribers
    if (subscribeNewsletter && resend) {
      const audienceId = RESEND_AUDIENCES[contactType];
      if (audienceId) {
        try {
          await resend.contacts.create({
            audienceId,
            email,
            firstName: name.split(" ")[0] || undefined,
            lastName: name.split(" ").slice(1).join(" ") || undefined,
            unsubscribed: false,
          });
        } catch (err) {
          console.error("Resend audience add error:", err);
        }
      }

      // Save to newsletter_subscribers table
      if (supabase) {
        await supabase.from("newsletter_subscribers").upsert(
          {
            email,
            name,
            company_name: companyName || null,
            audience_type: contactType,
            resend_audience_id: audienceId,
            marketing_consent: true,
            language: lang || "nl",
            source: "contact_form",
            unsubscribed_at: null,
          },
          { onConflict: "email,audience_type" }
        );
      }
    }

    // 3. Notify PayWatch team
    if (resend) {
      const typeLabels: Record<string, string> = {
        consumer: "Consument",
        gemeente: "Gemeente",
        aid_org: "Hulporganisatie",
        company: "Bedrijf",
      };

      await resend.emails.send({
        from: "PayWatch <noreply@paywatch.app>",
        reply_to: "info@paywatch.nl",
        to: "info@paywatch.nl",
        subject: `[${typeLabels[contactType] || contactType}] ${subject || "Contact"} — ${name}`,
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
            <h2 style="color:#0A2540;margin:0 0 16px">Nieuw contactbericht</h2>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:#64748B;font-size:13px;width:120px">Type</td><td style="padding:8px 0;font-weight:600">${typeLabels[contactType] || contactType}</td></tr>
              ${companyName ? `<tr><td style="padding:8px 0;color:#64748B;font-size:13px">Organisatie</td><td style="padding:8px 0;font-weight:600">${companyName}</td></tr>` : ""}
              <tr><td style="padding:8px 0;color:#64748B;font-size:13px">Naam</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#64748B;font-size:13px">E-mail</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#2563EB">${email}</a></td></tr>
              <tr><td style="padding:8px 0;color:#64748B;font-size:13px">Onderwerp</td><td style="padding:8px 0">${subject || "—"}</td></tr>
              <tr><td style="padding:8px 0;color:#64748B;font-size:13px">Taal</td><td style="padding:8px 0">${isNl ? "Nederlands" : "English"}</td></tr>
              <tr><td style="padding:8px 0;color:#64748B;font-size:13px">Nieuwsbrief</td><td style="padding:8px 0">${subscribeNewsletter ? "✅ Ja" : "—"}</td></tr>
            </table>
            <div style="margin-top:16px;padding:14px;background:#F4F7FB;border-radius:8px">
              <p style="margin:0;font-size:13px;color:#0F172A;line-height:1.6;white-space:pre-wrap">${message}</p>
            </div>
          </div>
        `,
      });

      // 4. Confirmation to sender
      await resend.emails.send({
        from: "PayWatch <noreply@paywatch.app>",
        reply_to: "info@paywatch.nl",
        to: email,
        subject: isNl ? "We hebben je bericht ontvangen" : "We received your message",
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
            <h2 style="color:#0A2540;margin:0 0 8px">${isNl ? `Bedankt, ${name.split(" ")[0]}!` : `Thanks, ${name.split(" ")[0]}!`}</h2>
            <p style="color:#0F172A;line-height:1.6;margin:0 0 16px">${isNl
              ? "We hebben je bericht ontvangen en nemen zo snel mogelijk contact met je op. Meestal reageren we binnen 24 uur."
              : "We've received your message and will get back to you as soon as possible. We usually respond within 24 hours."}</p>
            <div style="padding:14px;background:#F4F7FB;border-radius:8px;margin:16px 0">
              <p style="margin:0;font-size:12px;color:#64748B"><strong>${isNl ? "Je bericht:" : "Your message:"}</strong></p>
              <p style="margin:6px 0 0;font-size:13px;color:#0F172A;line-height:1.5">${message.length > 200 ? message.slice(0, 200) + "..." : message}</p>
            </div>
            <p style="color:#64748B;font-size:13px;margin:16px 0 0">${isNl ? "Met vriendelijke groet," : "Best regards,"}<br><strong style="color:#0A2540">Team PayWatch</strong></p>
            <hr style="border:none;border-top:1px solid #E2E8F0;margin:24px 0" />
            <p style="font-size:11px;color:#94A3B8;margin:0">PayWatch — Rotterdam, Nederland<br>paywatch.app</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
