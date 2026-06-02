import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { checkPublicRateLimit } from "@/lib/rate-limit";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend && process.env.RESEND_API_KEY) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(request: NextRequest) {
  const limited = await checkPublicRateLimit("speaking", 3, 60);
  if (limited) return limited;

  try {
    const body = await request.json();
    const { name, email, organization, role, type, topic, audience, date_preference, message, website, _t } = body;

    if (!name || !email || !organization) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Bot checks
    if (website) return NextResponse.json({ ok: true });
    if (_t && Date.now() - Number(_t) < 3000) return NextResponse.json({ ok: true });

    const supabase = getSupabase();
    if (supabase) {
      await supabase.from("speaking_requests").insert({
        name, email, organization, role: role || null,
        type: type || null, topic: topic || null,
        audience: audience || null, date_preference: date_preference || null,
        message: message || null,
      });
    }

    const resend = getResend();
    if (resend) {
      const typeLabels: Record<string, string> = { gastcollege: "Gastcollege", keynote: "Keynote", panel: "Paneldiscussie", workshop: "Workshop", anders: "Anders" };
      await resend.emails.send({
        from: "PayWatch <noreply@paywatch.app>",
        reply_to: "samba@paywatch.nl",
        to: ["samba@paywatch.nl", "mariama@paywatch.nl"],
        subject: `🎓 Gastcollege aanvraag — ${organization}`,
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
            <div style="background:#2563EB;color:white;padding:12px 16px;border-radius:8px 8px 0 0">
              <h2 style="margin:0;font-size:16px">Nieuwe gastcollege aanvraag</h2>
            </div>
            <div style="border:1px solid #E2E8F0;border-top:none;border-radius:0 0 8px 8px;padding:20px">
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:6px 0;color:#64748B;font-size:13px;width:120px">Organisatie</td><td style="padding:6px 0;font-weight:600">${organization}</td></tr>
                <tr><td style="padding:6px 0;color:#64748B;font-size:13px">Naam</td><td style="padding:6px 0">${name}</td></tr>
                ${role ? `<tr><td style="padding:6px 0;color:#64748B;font-size:13px">Functie</td><td style="padding:6px 0">${role}</td></tr>` : ""}
                <tr><td style="padding:6px 0;color:#64748B;font-size:13px">E-mail</td><td style="padding:6px 0"><a href="mailto:${email}" style="color:#2563EB">${email}</a></td></tr>
                ${type ? `<tr><td style="padding:6px 0;color:#64748B;font-size:13px">Format</td><td style="padding:6px 0">${typeLabels[type] || type}</td></tr>` : ""}
                ${topic ? `<tr><td style="padding:6px 0;color:#64748B;font-size:13px">Onderwerp</td><td style="padding:6px 0">${topic}</td></tr>` : ""}
                ${audience ? `<tr><td style="padding:6px 0;color:#64748B;font-size:13px">Doelgroep</td><td style="padding:6px 0">${audience}</td></tr>` : ""}
                ${date_preference ? `<tr><td style="padding:6px 0;color:#64748B;font-size:13px">Voorkeur datum</td><td style="padding:6px 0">${date_preference}</td></tr>` : ""}
              </table>
              ${message ? `<div style="margin-top:14px;padding:12px;background:#F4F7FB;border-radius:6px"><p style="margin:0;font-size:12px;color:#64748B;font-weight:600">Bericht:</p><p style="margin:6px 0 0;font-size:13px;color:#0F172A;line-height:1.5;white-space:pre-wrap">${message}</p></div>` : ""}
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Speaking request error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
