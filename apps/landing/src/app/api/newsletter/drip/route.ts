import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

/**
 * GET /api/newsletter/drip
 *
 * Called by a cron job (e.g., cron-job.org) once daily.
 * Checks newsletter_subscribers for people who signed up X days ago
 * and haven't received their drip email yet.
 *
 * Drip sequences:
 *   B2B (gemeente, aid_org, company):
 *     - Day 2: "Bedankt voor uw interesse" follow-up
 *     - Day 7: Feature/value deep-dive
 *     - Day 14: Pilot/partnership proposal
 *
 *   Consumer:
 *     - Day 2: "Wist je dat?" tips email
 *     - Day 7: Social proof / how others use it
 *
 * Protect with a secret key in query param: ?key=YOUR_SECRET
 */

const CRON_SECRET = process.env.CRON_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(-12) || "";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend && process.env.RESEND_API_KEY) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ── Drip email definitions ──────────────────────────────────

interface DripStep {
  key: string;
  daysAfterSignup: number;
  subject: { nl: string; en: string };
  buildHtml: (name: string, isNl: boolean, audienceType: string) => string;
}

const B2B_DRIPS: DripStep[] = [
  {
    key: "b2b_day2_thankyou",
    daysAfterSignup: 2,
    subject: {
      nl: "Bedankt voor uw interesse in PayWatch",
      en: "Thanks for your interest in PayWatch",
    },
    buildHtml: (name, isNl, type) => {
      const firstName = name?.split(" ")[0] || "";
      const typeLabel = isNl
        ? { gemeente: "gemeente", aid_org: "hulporganisatie", company: "bedrijf" }[type] || "organisatie"
        : { gemeente: "municipality", aid_org: "aid organization", company: "business" }[type] || "organization";
      return wrapB2B(`
        <tr><td style="padding:28px 32px 0">
          <p style="margin:0;font-size:15px;color:#0A2540;font-weight:600">${isNl ? `Beste ${firstName},` : `Dear ${firstName},`}</p>
        </td></tr>
        <tr><td style="padding:16px 32px;font-size:14px;color:#0A2540;line-height:1.7">
          <p style="margin:0 0 16px">${isNl
            ? `Bedankt dat u zich als ${typeLabel} heeft aangemeld voor onze updates. We waarderen uw interesse in hoe technologie kan bijdragen aan schuldenpreventie.`
            : `Thank you for signing up as a ${typeLabel} for our updates. We appreciate your interest in how technology can contribute to debt prevention.`}</p>
          <p style="margin:0 0 16px">${isNl
            ? "PayWatch helpt mensen grip te krijgen op hun rekeningen voordat de kosten oplopen. Als partner kunt u uw cliënten of inwoners een gratis tool bieden die vroegsignalering ondersteunt."
            : "PayWatch helps people take control of their bills before costs escalate. As a partner, you can offer your clients or residents a free tool that supports early detection."}</p>
          <div style="margin:20px 0;padding:20px;background:linear-gradient(135deg,#EFF6FF,#F0FDF4);border-radius:12px;text-align:center">
            <p style="margin:0;font-size:14px;color:#0A2540;font-weight:600">${isNl
              ? "Preventie is altijd goedkoper dan curatie."
              : "Prevention is always cheaper than cure."}</p>
          </div>
          <p style="margin:0">${isNl
            ? "In de komende weken delen we meer over hoe PayWatch werkt en hoe een samenwerking eruit kan zien. Mocht u in de tussentijd vragen hebben, neem gerust contact op."
            : "In the coming weeks, we'll share more about how PayWatch works and what a partnership could look like. If you have questions in the meantime, don't hesitate to reach out."}</p>
        </td></tr>
        ${signatureHtml()}
      `);
    },
  },
  {
    key: "b2b_day7_deepdive",
    daysAfterSignup: 7,
    subject: {
      nl: "Hoe PayWatch schuldenpreventie ondersteunt",
      en: "How PayWatch supports debt prevention",
    },
    buildHtml: (name, isNl) => {
      const firstName = name?.split(" ")[0] || "";
      return wrapB2B(`
        <tr><td style="padding:28px 32px 0">
          <p style="margin:0;font-size:15px;color:#0A2540;font-weight:600">${isNl ? `Beste ${firstName},` : `Dear ${firstName},`}</p>
        </td></tr>
        <tr><td style="padding:16px 32px;font-size:14px;color:#0A2540;line-height:1.7">
          <p style="margin:0 0 16px">${isNl
            ? "Een week geleden heeft u zich aangemeld. Vandaag willen we u laten zien wat PayWatch concreet doet."
            : "A week ago you signed up. Today we want to show you what PayWatch concretely does."}</p>

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:16px 0;border:1px solid #E2E8F0;border-radius:12px;overflow:hidden">
            <tr><td style="padding:20px 24px">
              <p style="margin:0 0 12px;font-size:11px;font-weight:700;color:#2563EB;text-transform:uppercase;letter-spacing:1px">${isNl ? "WAT PAYWATCH DOET" : "WHAT PAYWATCH DOES"}</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr><td style="padding:6px 0;font-size:13px;color:#0A2540">📧 ${isNl ? "Scant Gmail op facturen en herkent escalatiestadia" : "Scans Gmail for invoices and detects escalation stages"}</td></tr>
                <tr><td style="padding:6px 0;font-size:13px;color:#0A2540">📸 ${isNl ? "Fotografeert papieren rekeningen en extraheert data met AI" : "Photographs paper bills and extracts data with AI"}</td></tr>
                <tr><td style="padding:6px 0;font-size:13px;color:#0A2540">⚖️ ${isNl ? "Berekent WIK-incassokosten per escalatiefase" : "Calculates WIK collection costs per escalation stage"}</td></tr>
                <tr><td style="padding:6px 0;font-size:13px;color:#0A2540">🔔 ${isNl ? "Stuurt meldingen voordat rekeningen escaleren" : "Sends alerts before bills escalate"}</td></tr>
                <tr><td style="padding:6px 0;font-size:13px;color:#0A2540">📍 ${isNl ? "Verbindt gebruikers met lokale schuldhulp (335 gemeentes)" : "Connects users to local debt aid (335 municipalities)"}</td></tr>
              </table>
            </td></tr>
          </table>

          <div style="margin:20px 0;padding:24px;background:linear-gradient(135deg,#EFF6FF,#F0FDF4);border-radius:12px;text-align:center">
            <p style="margin:0;font-size:32px;font-weight:800;color:#0A2540">60%</p>
            <p style="margin:4px 0 0;font-size:13px;color:#64748B">${isNl
              ? "van de mensen zoekt pas hulp bij de deurwaarder"
              : "of people only seek help at the bailiff stage"}</p>
          </div>

          <p style="margin:0">${isNl
            ? "Volgende week delen we hoe een samenwerking concreet kan werken — van doorverwijzing tot pilot."
            : "Next week we'll share how a partnership can work concretely — from referrals to a pilot program."}</p>
        </td></tr>
        ${signatureHtml()}
      `);
    },
  },
  {
    key: "b2b_day14_proposal",
    daysAfterSignup: 14,
    subject: {
      nl: "Voorstel: gratis pilot met PayWatch",
      en: "Proposal: free pilot with PayWatch",
    },
    buildHtml: (name, isNl) => {
      const firstName = name?.split(" ")[0] || "";
      return wrapB2B(`
        <tr><td style="padding:28px 32px 0">
          <p style="margin:0;font-size:15px;color:#0A2540;font-weight:600">${isNl ? `Beste ${firstName},` : `Dear ${firstName},`}</p>
        </td></tr>
        <tr><td style="padding:16px 32px;font-size:14px;color:#0A2540;line-height:1.7">
          <p style="margin:0 0 16px">${isNl
            ? "De afgelopen twee weken hebben we gedeeld wat PayWatch doet. Nu willen we een concrete stap voorstellen."
            : "Over the past two weeks we've shared what PayWatch does. Now we'd like to propose a concrete step."}</p>

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:16px 0;border:2px solid #2563EB;border-radius:12px;overflow:hidden">
            <tr><td style="padding:24px">
              <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#2563EB;text-transform:uppercase;letter-spacing:1px">${isNl ? "PILOT VOORSTEL" : "PILOT PROPOSAL"}</p>
              <p style="margin:0 0 12px;font-size:18px;font-weight:800;color:#0A2540">${isNl ? "3 maanden, volledig gratis" : "3 months, completely free"}</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr><td style="padding:4px 0;font-size:13px;color:#0A2540">✅ ${isNl ? "100 gebruikers (uw cliënten of inwoners)" : "100 users (your clients or residents)"}</td></tr>
                <tr><td style="padding:4px 0;font-size:13px;color:#0A2540">✅ ${isNl ? "Wij faciliteren alles — onboarding, support, data" : "We facilitate everything — onboarding, support, data"}</td></tr>
                <tr><td style="padding:4px 0;font-size:13px;color:#0A2540">✅ ${isNl ? "Evaluatierapport na afloop" : "Evaluation report afterwards"}</td></tr>
                <tr><td style="padding:4px 0;font-size:13px;color:#0A2540">✅ ${isNl ? "Geen verplichtingen" : "No obligations"}</td></tr>
              </table>
            </td></tr>
          </table>

          <p style="margin:0">${isNl
            ? "Heeft u 20 minuten voor een kennismakingsgesprek? Ik licht het graag persoonlijk toe."
            : "Do you have 20 minutes for an introductory meeting? I'd be happy to explain in person."}</p>
        </td></tr>
        <tr><td style="padding:0 32px 8px">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:20px auto">
            <tr><td style="background:#2563EB;border-radius:8px">
              <a href="mailto:samba@paywatch.nl?subject=Pilot%20PayWatch" style="display:inline-block;padding:14px 32px;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none">${isNl ? "Plan een gesprek" : "Schedule a meeting"}</a>
            </td></tr>
          </table>
        </td></tr>
        ${signatureHtml()}
      `);
    },
  },
];

const CONSUMER_DRIPS: DripStep[] = [
  {
    key: "consumer_day2_tips",
    daysAfterSignup: 2,
    subject: {
      nl: "3 tips om grip te krijgen op je rekeningen",
      en: "3 tips to take control of your bills",
    },
    buildHtml: (name, isNl) => {
      const firstName = name?.split(" ")[0] || "";
      return wrapConsumer(`
        <tr><td style="padding:24px 32px 0">
          <p style="margin:0;font-size:16px;color:#2563EB;font-weight:600">${isNl ? `Hoi ${firstName},` : `Hi ${firstName},`}</p>
        </td></tr>
        <tr><td style="padding:16px 32px;font-size:14px;color:#0A2540;line-height:1.7">
          <p style="margin:0 0 16px">${isNl
            ? "Welkom bij de PayWatch community! Hier zijn drie tips die direct verschil maken:"
            : "Welcome to the PayWatch community! Here are three tips that make an immediate difference:"}</p>

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:16px 0">
            <tr><td style="padding:12px 16px;background:#EFF6FF;border-radius:12px;margin-bottom:8px">
              <p style="margin:0;font-size:14px;color:#0A2540"><strong style="color:#2563EB">1.</strong> ${isNl
                ? "Wist je dat je vaak recht hebt op een 14-dagen brief voordat incassokosten mogen worden berekend?"
                : "Did you know you often have the right to a 14-day letter before collection fees can be charged?"}</p>
            </td></tr>
            <tr><td style="height:8px"></td></tr>
            <tr><td style="padding:12px 16px;background:#ECFDF5;border-radius:12px">
              <p style="margin:0;font-size:14px;color:#0A2540"><strong style="color:#059669">2.</strong> ${isNl
                ? "Betaal altijd eerst de rekening met de hoogste escalatie. Factuur kan wachten, incasso niet."
                : "Always pay the bill with the highest escalation first. An invoice can wait, a collection notice can't."}</p>
            </td></tr>
            <tr><td style="height:8px"></td></tr>
            <tr><td style="padding:12px 16px;background:#FDF4FF;border-radius:12px">
              <p style="margin:0;font-size:14px;color:#0A2540"><strong style="color:#7C3AED">3.</strong> ${isNl
                ? "Stel je gemeente in de app in — dan krijg je lokale hulplinks als het nodig is."
                : "Set your municipality in the app — you'll get local help links when needed."}</p>
            </td></tr>
          </table>

          <div style="margin:20px 0;padding:20px;background:linear-gradient(135deg,#EFF6FF,#F0FDF4);border-radius:16px;text-align:center">
            <p style="margin:0;font-size:14px;color:#0A2540;font-weight:600;line-height:1.5">${isNl
              ? "Kennis is macht. En jij hebt nu de kennis."
              : "Knowledge is power. And now you have the knowledge."}</p>
          </div>
        </td></tr>
        <tr><td style="padding:0 32px 8px">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:16px auto">
            <tr><td style="background:#2563EB;border-radius:50px;box-shadow:0 4px 14px rgba(37,99,235,0.2)">
              <a href="https://app.paywatch.app" style="display:inline-block;padding:14px 36px;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none">${isNl ? "Open PayWatch" : "Open PayWatch"}</a>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:0 32px 32px;text-align:center">
          <p style="margin:0;font-size:13px;color:#64748B">${isNl ? "Samen sterk," : "Stronger together,"}<br><strong style="color:#0A2540">Team PayWatch</strong></p>
        </td></tr>
      `);
    },
  },
  {
    key: "consumer_day7_social",
    daysAfterSignup: 7,
    subject: {
      nl: "Zo gebruiken anderen PayWatch",
      en: "How others use PayWatch",
    },
    buildHtml: (name, isNl) => {
      const firstName = name?.split(" ")[0] || "";
      return wrapConsumer(`
        <tr><td style="padding:24px 32px 0">
          <p style="margin:0;font-size:16px;color:#2563EB;font-weight:600">${isNl ? `Hoi ${firstName},` : `Hi ${firstName},`}</p>
        </td></tr>
        <tr><td style="padding:16px 32px;font-size:14px;color:#0A2540;line-height:1.7">
          <p style="margin:0 0 16px">${isNl
            ? "Een week geleden ben je begonnen. Wist je dat de meeste PayWatch-gebruikers binnen de eerste week al geld besparen?"
            : "A week ago you got started. Did you know most PayWatch users save money within the first week?"}</p>

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:16px 0">
            <tr>
              <td style="padding:6px;width:50%">
                <div style="background:#ECFDF5;border-radius:12px;padding:16px 12px;text-align:center">
                  <p style="margin:0;font-size:28px;font-weight:800;color:#059669">€760</p>
                  <p style="margin:4px 0 0;font-size:11px;color:#64748B">${isNl ? "Gem. bespaard" : "Avg. saved"}</p>
                </div>
              </td>
              <td style="padding:6px;width:50%">
                <div style="background:#EFF6FF;border-radius:12px;padding:16px 12px;text-align:center">
                  <p style="margin:0;font-size:28px;font-weight:800;color:#2563EB">335</p>
                  <p style="margin:4px 0 0;font-size:11px;color:#64748B">${isNl ? "Gemeentes" : "Municipalities"}</p>
                </div>
              </td>
            </tr>
          </table>

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:16px 0;border:1px solid #E2E8F0;border-radius:16px;overflow:hidden;background:#FFFFFF">
            <tr><td style="padding:20px 24px">
              <p style="margin:0 0 8px;font-size:13px;color:#0A2540;line-height:1.6;font-style:italic">"${isNl
                ? "Ik vergat altijd mijn rekeningen. Nu heb ik alles op één plek en weet ik precies wat ik moet doen."
                : "I always forgot my bills. Now I have everything in one place and know exactly what to do."}"</p>
              <p style="margin:0;font-size:12px;color:#64748B">— PayWatch ${isNl ? "gebruiker" : "user"}</p>
            </td></tr>
          </table>

          <div style="margin:20px 0;padding:20px;background:linear-gradient(135deg,#EFF6FF,#F0FDF4);border-radius:16px;text-align:center">
            <p style="margin:0;font-size:14px;color:#0A2540;font-weight:600;line-height:1.5">${isNl
              ? "Jij kunt dit ook. Eén scan en je bent op weg."
              : "You can do this too. One scan and you're on your way."}</p>
          </div>
        </td></tr>
        <tr><td style="padding:0 32px 8px">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:16px auto">
            <tr><td style="background:#2563EB;border-radius:50px;box-shadow:0 4px 14px rgba(37,99,235,0.2)">
              <a href="https://app.paywatch.app" style="display:inline-block;padding:14px 36px;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none">${isNl ? "Scan je eerste rekening" : "Scan your first bill"}</a>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:0 32px 32px;text-align:center">
          <p style="margin:0;font-size:13px;color:#64748B">${isNl ? "Je staat er niet alleen voor," : "You're not alone in this,"}<br><strong style="color:#0A2540">Samba & Mariama</strong></p>
        </td></tr>
      `);
    },
  },
];

// ── HTML wrappers ───────────────────────────────────────────

function wrapConsumer(content: string): string {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head><body style="margin:0;padding:0;background:#F4F7FB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td align="center" style="padding:32px 16px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:540px;background:#FFFFFF;border-radius:20px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.04)"><tr><td style="padding:32px 32px 0;text-align:center"><p style="margin:0;font-size:12px;font-weight:800;color:#0A2540">PayWatch</p></td></tr>${content}<tr><td style="padding:0 32px"><hr style="border:none;border-top:1px solid #E2E8F0;margin:0"></td></tr><tr><td style="padding:24px 32px;text-align:center"><p style="margin:0;font-size:12px;font-weight:800;color:#0A2540">PayWatch</p><p style="margin:8px 0 0;font-size:10px;color:#64748B;line-height:1.5">Gebouwd in Nederland | GDPR/AVG compliant<br>Je gegevens blijven van jou.</p></td></tr></table></td></tr></table></body></html>`;
}

function wrapB2B(content: string): string {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head><body style="margin:0;padding:0;background:#F4F7FB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td align="center" style="padding:32px 16px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background:#FFFFFF;border-radius:20px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.04)"><tr><td style="background:#0A2540;padding:28px 32px;text-align:center"><p style="margin:0;font-size:14px;font-weight:800;color:#FFFFFF;letter-spacing:0.5px">PayWatch</p><p style="margin:6px 0 0;font-size:11px;color:rgba(255,255,255,0.5)">Partner communicatie</p></td></tr>${content}<tr><td style="padding:0 32px"><hr style="border:none;border-top:1px solid #E2E8F0;margin:0"></td></tr><tr><td style="padding:24px 32px;text-align:center"><p style="margin:0;font-size:12px;font-weight:800;color:#0A2540">PayWatch</p><p style="margin:8px 0 0;font-size:10px;color:#64748B;line-height:1.5">Rotterdam, Nederland | GDPR/AVG compliant<br>paywatch.app | info@paywatch.nl</p></td></tr></table></td></tr></table></body></html>`;
}

function signatureHtml(): string {
  return `<tr><td style="padding:0 32px 32px"><table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td><div style="display:inline-block;width:40px;height:40px;border-radius:50%;background:#2563EB;color:white;text-align:center;line-height:40px;font-size:15px;font-weight:700">S</div></td><td style="padding-left:12px"><p style="margin:0;font-size:14px;font-weight:600;color:#0A2540">Samba Jarju</p><p style="margin:2px 0 0;font-size:12px;color:#64748B">CTO & Medeoprichter, PayWatch</p><p style="margin:2px 0 0;font-size:12px;color:#2563EB">samba@paywatch.nl</p></td></tr></table></td></tr>`;
}

// ── Main handler ────────────────────────────────────────────

export async function GET(request: NextRequest) {
  // Verify cron secret
  const key = request.nextUrl.searchParams.get("key");
  if (!key || key !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabase();
  const resend = getResend();
  if (!resend) {
    return NextResponse.json({ error: "Resend not configured" }, { status: 500 });
  }

  const now = new Date();
  let sent = 0;
  const errors: string[] = [];

  // Get all active subscribers
  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("email, name, audience_type, language, subscribed_at")
    .is("unsubscribed_at", null)
    .eq("marketing_consent", true);

  if (!subscribers || subscribers.length === 0) {
    return NextResponse.json({ message: "No subscribers", sent: 0 });
  }

  for (const sub of subscribers) {
    const daysSinceSignup = Math.floor(
      (now.getTime() - new Date(sub.subscribed_at).getTime()) / (1000 * 60 * 60 * 24)
    );
    const isNl = (sub.language || "nl") === "nl";
    const isB2B = ["gemeente", "aid_org", "company"].includes(sub.audience_type);
    const drips = isB2B ? B2B_DRIPS : CONSUMER_DRIPS;

    for (const drip of drips) {
      // Check if this drip is due
      if (daysSinceSignup < drip.daysAfterSignup) continue;

      // Check if already sent
      const { data: existing } = await supabase
        .from("newsletter_drip_log")
        .select("id")
        .eq("subscriber_email", sub.email)
        .eq("audience_type", sub.audience_type)
        .eq("drip_step", drip.key)
        .maybeSingle();

      if (existing) continue; // Already sent

      // Send the email
      try {
        const html = drip.buildHtml(sub.name || "", isNl, sub.audience_type);
        await resend.emails.send({
          from: isB2B
            ? "Samba van PayWatch <noreply@paywatch.app>"
            : "PayWatch <noreply@paywatch.app>",
          reply_to: "info@paywatch.nl",
          to: sub.email,
          subject: drip.subject[isNl ? "nl" : "en"],
          html,
        });

        // Log it
        await supabase.from("newsletter_drip_log").insert({
          subscriber_email: sub.email,
          audience_type: sub.audience_type,
          drip_step: drip.key,
        });

        sent++;
      } catch (err) {
        errors.push(`${sub.email}: ${err instanceof Error ? err.message : "Unknown"}`);
      }
    }
  }

  return NextResponse.json({
    sent,
    subscribers: subscribers.length,
    errors: errors.length > 0 ? errors : undefined,
  });
}
