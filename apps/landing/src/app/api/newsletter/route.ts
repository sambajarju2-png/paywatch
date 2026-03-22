import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

/**
 * POST /api/newsletter
 *
 * Subscribes a contact to the newsletter.
 * Saves to: 1) Supabase newsletter_subscribers  2) Resend Audience
 *
 * Body: { email, name?, companyName?, audienceType, language?, marketingConsent }
 * audienceType: "consumer" | "gemeente" | "aid_org" | "company"
 */

const RESEND_AUDIENCES: Record<string, string> = {
  consumer: "065fa004-bc05-4d75-abaf-67ed1e41872d",     // Consumers
  gemeente: "113aa5e0-31d8-4db4-bffd-1ddc42dd675e",     // B2B Partners
  aid_org: "113aa5e0-31d8-4db4-bffd-1ddc42dd675e",      // B2B Partners (same)
  company: "113aa5e0-31d8-4db4-bffd-1ddc42dd675e",      // B2B Partners (same)
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
  try {
    const body = await request.json();
    const { email, name, companyName, audienceType, language, marketingConsent } = body;

    if (!email || !audienceType) {
      return NextResponse.json({ error: "Email and audienceType are required" }, { status: 400 });
    }

    if (!["consumer", "gemeente", "aid_org", "company"].includes(audienceType)) {
      return NextResponse.json({ error: "Invalid audienceType" }, { status: 400 });
    }

    if (!marketingConsent) {
      return NextResponse.json({ error: "Marketing consent is required" }, { status: 400 });
    }

    const resendAudienceId = RESEND_AUDIENCES[audienceType];
    let resendContactId: string | null = null;

    // 1. Add to Resend Audience
    const resend = getResend();
    if (resend && resendAudienceId) {
      try {
        const { data } = await resend.contacts.create({
          audienceId: resendAudienceId,
          email,
          firstName: name?.split(" ")[0] || undefined,
          lastName: name?.split(" ").slice(1).join(" ") || undefined,
          unsubscribed: false,
        });
        resendContactId = data?.id || null;
      } catch (err) {
        console.error("Resend contact create error:", err);
        // Continue — Supabase save is more important
      }
    }

    // 2. Save to Supabase
    const supabase = getSupabase();
    if (supabase) {
      const { error: dbError } = await supabase.from("newsletter_subscribers").upsert(
        {
          email,
          name: name || null,
          company_name: companyName || null,
          audience_type: audienceType,
          resend_audience_id: resendAudienceId,
          resend_contact_id: resendContactId,
          marketing_consent: true,
          language: language || "nl",
          source: "website",
          unsubscribed_at: null, // Re-subscribe if previously unsubscribed
        },
        { onConflict: "email,audience_type" }
      );
      if (dbError) {
        console.error("Supabase newsletter insert error:", dbError);
      }
    }

    // 3. Send welcome/confirmation email
    if (resend) {
      const isNl = (language || "nl") === "nl";
      const firstName = name?.split(" ")[0] || "";

      await resend.emails.send({
        from: "PayWatch <noreply@paywatch.app>",
        reply_to: "info@paywatch.nl",
        to: email,
        subject: isNl ? "Welkom bij de PayWatch nieuwsbrief!" : "Welcome to the PayWatch newsletter!",
        html: buildConfirmationEmail(firstName, isNl, audienceType),
      });
    }

    return NextResponse.json({ ok: true, resendContactId });
  } catch (err) {
    console.error("Newsletter subscribe error:", err);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}

function buildConfirmationEmail(name: string, isNl: boolean, type: string): string {
  const typeLabel = isNl
    ? { consumer: "consument", gemeente: "gemeente", aid_org: "hulporganisatie", company: "bedrijf" }[type] || "abonnee"
    : { consumer: "consumer", gemeente: "municipality", aid_org: "aid organization", company: "business" }[type] || "subscriber";

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F4F7FB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
<tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:540px;background:#FFFFFF;border-radius:20px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.04)">
  <tr><td style="padding:32px 32px 0;text-align:center">
    <p style="margin:0;font-size:12px;font-weight:800;color:#0A2540">PayWatch</p>
  </td></tr>
  <tr><td style="padding:24px 32px 0">
    <p style="margin:0;font-size:16px;color:#2563EB;font-weight:600">${isNl ? `Hoi ${name}!` : `Hi ${name}!`}</p>
  </td></tr>
  <tr><td style="padding:16px 32px;font-size:14px;color:#0A2540;line-height:1.7">
    <p>${isNl
      ? `Bedankt voor je aanmelding als <strong>${typeLabel}</strong>! Je ontvangt vanaf nu onze nieuwsbrieven en updates.`
      : `Thanks for signing up as a <strong>${typeLabel}</strong>! You'll now receive our newsletters and updates.`}</p>
    <div style="margin:20px 0;padding:20px;background:linear-gradient(135deg,#EFF6FF,#F0FDF4);border-radius:16px;text-align:center">
      <p style="margin:0;font-size:14px;color:#0A2540;font-weight:600;line-height:1.5">${isNl
        ? "Jij houdt de regie, wij houden de wacht."
        : "You stay in control; we keep watch."}</p>
    </div>
  </td></tr>
  <tr><td style="padding:0 32px 32px;text-align:center">
    <p style="margin:0;font-size:13px;color:#64748B">${isNl ? "Met vriendelijke groet," : "Best regards,"}<br><strong style="color:#0A2540">Team PayWatch</strong></p>
  </td></tr>
  <tr><td style="padding:0 32px"><hr style="border:none;border-top:1px solid #E2E8F0;margin:0"></td></tr>
  <tr><td style="padding:24px 32px;text-align:center">
    <p style="margin:0;font-size:12px;font-weight:800;color:#0A2540">PayWatch</p>
    <p style="margin:8px 0 0;font-size:10px;color:#64748B;line-height:1.5">Rotterdam, Nederland | GDPR/AVG compliant<br>paywatch.app | info@paywatch.nl</p>
  </td></tr>
</table>
</td></tr></table></body></html>`;
}
