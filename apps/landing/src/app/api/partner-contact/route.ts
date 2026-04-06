import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export const maxDuration = 15;

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

function getResend() {
  return process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
}

/* ── Audience labels ── */
const AUDIENCE_LABELS: Record<string, string> = {
  gemeente: "Gemeente",
  incasso: "Incassobureau",
  hulporg: "Hulporganisatie",
  zakelijk: "Bedrijf",
};

const AUDIENCE_NEXT_STEPS: Record<string, string> = {
  gemeente: "We nemen contact op om te bespreken hoe PayWatch past binnen uw gemeentelijke schuldhulpverlening en vroegsignaleringsbeleid.",
  incasso: "We bespreken graag hoe PayWatch kan bijdragen aan minder vermijdbare incassodossiers en betere betalingsmoraal.",
  hulporg: "We vertellen u graag meer over hoe PayWatch uw clienten kan ondersteunen met financieel overzicht en escalatiepreventie.",
  zakelijk: "We bespreken graag hoe PayWatch uw klanten kan helpen om rekeningen op tijd te betalen.",
};

/* ── Branded thank-you email HTML ── */
function buildThankYouEmail(data: {
  firstName: string;
  companyName?: string;
  audience: string;
  brandColor: string;
  logoUrl?: string;
  companyDomain?: string;
}): string {
  const label = AUDIENCE_LABELS[data.audience] || "Partner";
  const nextSteps = AUDIENCE_NEXT_STEPS[data.audience] || "We nemen zo snel mogelijk contact op.";
  const accent = data.brandColor || "#2563EB";
  const proxyLogo = data.companyDomain
    ? `https://paywatch.app/api/logo-proxy?domain=${encodeURIComponent(data.companyDomain)}`
    : data.logoUrl;

  return `
<!DOCTYPE html>
<html lang="nl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F4F7FB;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F7FB;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;">
        
        <!-- Brand header -->
        <tr><td style="background:${accent};padding:32px 32px 24px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="background:rgba(255,255,255,0.2);border-radius:10px;padding:6px 6px;">
                    <img src="https://paywatch.app/icon-192.png" alt="PayWatch" width="28" height="28" style="display:block;border-radius:6px;" />
                  </td>
                  <td style="padding-left:10px;color:rgba(255,255,255,0.7);font-size:13px;font-weight:600;">PayWatch</td>
                  ${proxyLogo ? `
                  <td style="padding-left:8px;color:rgba(255,255,255,0.4);font-size:14px;">&times;</td>
                  <td style="padding-left:8px;">
                    <img src="${proxyLogo}" alt="" width="28" height="28" style="display:block;border-radius:6px;background:rgba(255,255,255,0.15);" />
                  </td>
                  <td style="padding-left:8px;color:white;font-size:13px;font-weight:700;">${data.companyName || ""}</td>
                  ` : ""}
                </tr></table>
              </td>
            </tr>
            <tr><td style="padding-top:20px;">
              <p style="margin:0;color:white;font-size:24px;font-weight:800;line-height:1.2;">Bedankt voor je interesse, ${data.firstName}</p>
            </td></tr>
          </table>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px;">
          <p style="margin:0 0 16px;color:#0A2540;font-size:15px;line-height:1.6;">
            We hebben je bericht ontvangen en nemen zo snel mogelijk contact op.
          </p>
          
          <div style="background:#F4F7FB;border-radius:12px;padding:20px;margin:24px 0;">
            <p style="margin:0 0 4px;color:#64748B;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Volgende stap</p>
            <p style="margin:0;color:#0A2540;font-size:14px;line-height:1.5;">
              ${nextSteps}
            </p>
          </div>

          <p style="margin:24px 0 0;color:#64748B;font-size:13px;line-height:1.5;">
            Mocht je in de tussentijd vragen hebben, mail ons gerust op 
            <a href="mailto:business@paywatch.nl" style="color:${accent};text-decoration:none;font-weight:600;">business@paywatch.nl</a>
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:0 32px 32px;border-top:1px solid #E2E8F0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="padding-top:20px;">
            <tr>
              <td>
                <p style="margin:0;color:#0A2540;font-size:13px;font-weight:700;">PayWatch</p>
                <p style="margin:4px 0 0;color:#94A3B8;font-size:11px;">Grip op je rekeningen</p>
              </td>
              <td align="right">
                <a href="https://paywatch.app" style="color:${accent};font-size:12px;text-decoration:none;font-weight:600;">paywatch.app</a>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>

      <p style="margin:24px 0 0;color:#94A3B8;font-size:11px;text-align:center;">
        PayWatch &middot; Rotterdam, Nederland &middot; KVK 83474889
      </p>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, message, companyName, companyDomain, audience, brandColor, logoUrl } = body;

    // Validation
    if (!firstName || !lastName || !email || !audience) {
      return NextResponse.json({ error: "Verplichte velden ontbreken" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Ongeldig e-mailadres" }, { status: 400 });
    }

    const supabase = getSupabase();

    // 1. Save to Supabase
    const { error: dbError } = await supabase
      .from("b2b_contact_submissions")
      .insert({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.toLowerCase().trim(),
        message: message?.trim() || null,
        company_name: companyName || null,
        company_domain: companyDomain || null,
        audience,
        brand_color: brandColor || null,
        logo_url: logoUrl || null,
      });

    if (dbError) {
      console.error("[PartnerContact] DB:", dbError);
      return NextResponse.json({ error: "Opslaan mislukt" }, { status: 500 });
    }

    // 2. Send branded thank-you email to the contact
    const resend = getResend();
    if (resend) {
      try {
        await resend.emails.send({
          from: "PayWatch <noreply@paywatch.app>",
          reply_to: "business@paywatch.nl",
          to: email,
          subject: `Bedankt ${firstName} - we nemen snel contact op`,
          html: buildThankYouEmail({
            firstName,
            companyName,
            audience,
            brandColor: brandColor || "#2563EB",
            logoUrl,
            companyDomain,
          }),
        });
      } catch (e) {
        console.error("[PartnerContact] Thank you email:", e);
        // Don't fail the request if email fails
      }

      // 3. Notify PayWatch team
      try {
        const label = AUDIENCE_LABELS[audience] || audience;
        await resend.emails.send({
          from: "PayWatch <noreply@paywatch.app>",
          to: ["samba@paywatch.nl", "mariama@paywatch.nl"],
          subject: `Nieuwe ${label} lead: ${companyName || "Onbekend"} — ${firstName} ${lastName}`,
          html: `
            <h2>Nieuwe B2B lead via ${label} pagina</h2>
            <table style="font-size:14px;line-height:1.6;">
              <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Naam:</td><td>${firstName} ${lastName}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Email:</td><td><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Bedrijf:</td><td>${companyName || "Niet opgegeven"} (${companyDomain || "-"})</td></tr>
              <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Type:</td><td>${label}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Bericht:</td><td>${message || "Geen bericht"}</td></tr>
            </table>
            <p style="margin-top:16px;"><a href="https://admin.paywatch.app/outreach">Bekijk in admin dashboard</a></p>
          `,
        });
      } catch (e) {
        console.error("[PartnerContact] Team notification:", e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PartnerContact]", error);
    return NextResponse.json({ error: "Interne fout" }, { status: 500 });
  }
}
