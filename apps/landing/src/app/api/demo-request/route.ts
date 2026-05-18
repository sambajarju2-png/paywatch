import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { checkPublicRateLimit } from "@/lib/rate-limit";

/**
 * POST /api/demo-request
 *
 * Handles B2B demo/access requests from the pricing page.
 * Used by both Gemeente/Incasso (demo request) and Hulporganisaties (free access).
 *
 * Bot protection: honeypot, timing check, gibberish detection, rate limiting.
 */

const B2B_AUDIENCE = "113aa5e0-31d8-4db4-bffd-1ddc42dd675e";

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

function isGibberish(text: string): boolean {
  if (!text || text.length < 3) return false;
  const upperInMiddle = (text.match(/[a-z][A-Z]/g) || []).length;
  if (upperInMiddle >= 3) return true;
  if (text.length > 15 && !text.includes(" ")) return true;
  if (/[bcdfghjklmnpqrstvwxyz]{5}/i.test(text)) return true;
  const caseChanges = (text.match(/[a-z][A-Z]|[A-Z][a-z]/g) || []).length;
  if (caseChanges > text.length * 0.4 && text.length > 8) return true;
  return false;
}

export async function POST(request: NextRequest) {
  // Rate limit: 3 demo requests per IP per hour
  const limited = await checkPublicRateLimit("demo-request", 3, 60);
  if (limited) return limited;

  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      organization,
      role,
      request_type,
      estimated_users,
      message,
      lang,
      // Anti-bot fields
      website,  // honeypot
      _t,       // timestamp
    } = body;

    // ── Validation ──
    if (!name || !email || !organization || !request_type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const validTypes = ["gemeente", "incasso", "hulporganisatie"];
    if (!validTypes.includes(request_type)) {
      return NextResponse.json({ error: "Invalid request type" }, { status: 400 });
    }

    // ── Anti-bot checks ──
    // 1. Honeypot
    if (website) {
      return NextResponse.json({ ok: true });
    }

    // 2. Time check: form submitted in under 3 seconds = bot
    if (_t && Date.now() - Number(_t) < 3000) {
      return NextResponse.json({ ok: true });
    }

    // 3. Gibberish detection
    if (isGibberish(name) || isGibberish(organization)) {
      return NextResponse.json({ ok: true });
    }

    const isNl = (lang || "nl") === "nl";

    // ── Save to Supabase ──
    const supabase = getSupabase();
    if (supabase) {
      const { error: dbError } = await supabase.from("demo_requests").insert({
        name,
        email,
        phone: phone || null,
        organization,
        role: role || null,
        request_type,
        estimated_users: estimated_users || null,
        message: message || null,
        lang: lang || "nl",
      });
      if (dbError) console.error("Demo request DB error:", dbError);

      // Also add to B2B Resend audience
      const resend = getResend();
      if (resend) {
        try {
          await resend.contacts.create({
            audienceId: B2B_AUDIENCE,
            email,
            firstName: name.split(" ")[0] || undefined,
            lastName: name.split(" ").slice(1).join(" ") || undefined,
            unsubscribed: false,
          });
        } catch (err) {
          console.error("Resend audience add error:", err);
        }
      }
    }

    // ── Notify team ──
    const resend = getResend();
    if (resend) {
      const typeLabels: Record<string, string> = {
        gemeente: "Gemeente",
        incasso: "Incassobureau",
        hulporganisatie: "Hulporganisatie",
      };
      const isHulp = request_type === "hulporganisatie";

      await resend.emails.send({
        from: "PayWatch <noreply@paywatch.app>",
        reply_to: "info@paywatch.nl",
        to: ["samba@paywatch.nl", "mariama@paywatch.nl"],
        subject: `🏢 ${isHulp ? "Gratis toegang" : "Demo"} aanvraag — ${organization} (${typeLabels[request_type]})`,
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
            <div style="background:${isHulp ? "#059669" : "#2563EB"};color:white;padding:12px 16px;border-radius:8px 8px 0 0">
              <h2 style="margin:0;font-size:16px">${isHulp ? "Nieuwe aanvraag gratis toegang" : "Nieuwe demo aanvraag"}</h2>
            </div>
            <div style="border:1px solid #E2E8F0;border-top:none;border-radius:0 0 8px 8px;padding:20px">
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:6px 0;color:#64748B;font-size:13px;width:130px">Type</td><td style="padding:6px 0;font-weight:600">${typeLabels[request_type]}</td></tr>
                <tr><td style="padding:6px 0;color:#64748B;font-size:13px">Organisatie</td><td style="padding:6px 0;font-weight:600">${organization}</td></tr>
                <tr><td style="padding:6px 0;color:#64748B;font-size:13px">Naam</td><td style="padding:6px 0">${name}</td></tr>
                ${role ? `<tr><td style="padding:6px 0;color:#64748B;font-size:13px">Functie</td><td style="padding:6px 0">${role}</td></tr>` : ""}
                <tr><td style="padding:6px 0;color:#64748B;font-size:13px">E-mail</td><td style="padding:6px 0"><a href="mailto:${email}" style="color:#2563EB">${email}</a></td></tr>
                ${phone ? `<tr><td style="padding:6px 0;color:#64748B;font-size:13px">Telefoon</td><td style="padding:6px 0"><a href="tel:${phone}">${phone}</a></td></tr>` : ""}
                ${estimated_users ? `<tr><td style="padding:6px 0;color:#64748B;font-size:13px">Geschat aantal gebruikers</td><td style="padding:6px 0">${estimated_users}</td></tr>` : ""}
              </table>
              ${message ? `
                <div style="margin-top:14px;padding:12px;background:#F4F7FB;border-radius:6px">
                  <p style="margin:0;font-size:12px;color:#64748B;font-weight:600">Bericht:</p>
                  <p style="margin:6px 0 0;font-size:13px;color:#0F172A;line-height:1.5;white-space:pre-wrap">${message}</p>
                </div>
              ` : ""}
              <div style="margin-top:16px;padding:10px;background:#FFF7ED;border-radius:6px;text-align:center">
                <p style="margin:0;font-size:12px;color:#C2410C;font-weight:600">⏳ Neem binnen 24 uur contact op</p>
              </div>
            </div>
          </div>
        `,
      });

      // ── Confirmation to requester ──
      await resend.emails.send({
        from: "PayWatch <noreply@paywatch.app>",
        reply_to: "info@paywatch.nl",
        to: email,
        subject: isNl
          ? (isHulp ? "Je aanvraag voor gratis toegang is ontvangen" : "Je demo-aanvraag is ontvangen")
          : (isHulp ? "Your free access request has been received" : "Your demo request has been received"),
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
            <h2 style="color:#0A2540;margin:0 0 8px">${isNl ? `Bedankt, ${name.split(" ")[0]}!` : `Thanks, ${name.split(" ")[0]}!`}</h2>
            <p style="color:#0F172A;line-height:1.6;margin:0 0 16px">${isNl
              ? (isHulp
                ? `We hebben je aanvraag voor gratis toegang tot PayWatch voor ${organization} ontvangen. We nemen zo snel mogelijk contact met je op om alles in te richten.`
                : `We hebben je demo-aanvraag voor ${organization} ontvangen. We nemen zo snel mogelijk contact op om een demo in te plannen.`)
              : (isHulp
                ? `We've received your free access request for ${organization}. We'll be in touch shortly to set everything up.`
                : `We've received your demo request for ${organization}. We'll reach out shortly to schedule a demo.`)
            }</p>
            <div style="padding:14px;background:#F4F7FB;border-radius:8px">
              <p style="margin:0;font-size:13px;color:#64748B">${isNl ? "Wat je kunt verwachten:" : "What to expect:"}</p>
              <ul style="margin:8px 0 0;padding-left:18px;font-size:13px;color:#0F172A;line-height:1.8">
                <li>${isNl ? "Reactie binnen 24 uur" : "Response within 24 hours"}</li>
                <li>${isNl
                  ? (isHulp ? "Uitleg over de onboarding" : "Persoonlijke demo van 30 minuten")
                  : (isHulp ? "Onboarding walkthrough" : "30-minute personalized demo")}</li>
                <li>${isNl ? "Geen verplichtingen" : "No obligations"}</li>
              </ul>
            </div>
            <p style="color:#64748B;font-size:13px;margin:16px 0 0">${isNl ? "Met vriendelijke groet," : "Best regards,"}<br><strong style="color:#0A2540">Samba & Mariama</strong><br><span style="font-size:12px">Co-founders, PayWatch</span></p>
            <hr style="border:none;border-top:1px solid #E2E8F0;margin:24px 0" />
            <p style="font-size:11px;color:#94A3B8;margin:0">PayWatch — Rotterdam, Nederland<br>paywatch.app</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Demo request error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
