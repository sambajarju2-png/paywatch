import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

/**
 * GET /api/admin/gdpr/deadline-check
 * Vercel cron — runs daily at 9:00 AM.
 * Checks for GDPR requests approaching the 30-day deadline.
 * Sends email alerts to admin at day 20, 25, and 30+.
 */
export const dynamic = "force-dynamic";

const ADMIN_EMAILS = ["sambajarju2@gmail.com", "samba@paywatch.nl"];

export async function GET(req: Request) {
  // Verify this is a Vercel cron call
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && !process.env.VERCEL_URL?.includes("localhost")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Find open GDPR requests
  const { data: openRequests } = await supabase
    .from("gdpr_requests")
    .select("id, user_id, request_type, created_at")
    .in("status", ["pending", "processing"])
    .order("created_at", { ascending: true });

  if (!openRequests || openRequests.length === 0) {
    return NextResponse.json({ ok: true, message: "No open requests" });
  }

  const now = Date.now();
  const alerts: Array<{ ref: string; type: string; daysOpen: number; level: string }> = [];

  for (const req of openRequests) {
    const daysOpen = Math.floor((now - new Date(req.created_at).getTime()) / 86400000);
    const ref = req.id.slice(0, 8).toUpperCase();

    if (daysOpen >= 30) {
      alerts.push({ ref, type: req.request_type, daysOpen, level: "OVERDUE" });
    } else if (daysOpen >= 25) {
      alerts.push({ ref, type: req.request_type, daysOpen, level: "CRITICAL" });
    } else if (daysOpen >= 20) {
      alerts.push({ ref, type: req.request_type, daysOpen, level: "WARNING" });
    }
  }

  if (alerts.length === 0) {
    return NextResponse.json({ ok: true, message: "No deadline alerts", open: openRequests.length });
  }

  // Send alert email
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const rows = alerts.map(a =>
      `<tr><td style="padding:8px 12px;border-bottom:1px solid #E2E8F0;font-family:monospace;color:#2563EB">${a.ref}</td>` +
      `<td style="padding:8px 12px;border-bottom:1px solid #E2E8F0">${a.type}</td>` +
      `<td style="padding:8px 12px;border-bottom:1px solid #E2E8F0;font-weight:600;color:${a.level === 'OVERDUE' ? '#DC2626' : a.level === 'CRITICAL' ? '#EA580C' : '#D97706'}">${a.level} — dag ${a.daysOpen}</td></tr>`
    ).join("");

    try {
      await resend.emails.send({
        from: "PayWatch <noreply@paywatch.app>",
        to: ADMIN_EMAILS,
        subject: `⚠ ${alerts.length} privacyverzoek${alerts.length > 1 ? 'en' : ''} naderen deadline`,
        html: `<div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:32px">
          <p style="font-size:12px;font-weight:800;color:#0A2540">PayWatch — GDPR Deadline Alert</p>
          <p style="font-size:14px;color:#0A2540;margin-top:16px">${alerts.length} privacyverzoek${alerts.length > 1 ? 'en' : ''} ${alerts.some(a => a.level === 'OVERDUE') ? 'zijn over de deadline!' : 'naderen de 30-dagen deadline.'}</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13px">
            <tr style="background:#F4F7FB"><th style="padding:8px 12px;text-align:left">Ref</th><th style="padding:8px 12px;text-align:left">Type</th><th style="padding:8px 12px;text-align:left">Status</th></tr>
            ${rows}
          </table>
          <a href="https://admin.paywatch.app/gdpr" style="display:inline-block;padding:12px 24px;background:#2563EB;color:white;text-decoration:none;border-radius:8px;font-size:13px;font-weight:600;margin-top:8px">Open GDPR Dashboard</a>
          <hr style="border:none;border-top:1px solid #E2E8F0;margin:24px 0">
          <p style="font-size:11px;color:#94A3B8">AVG Art. 12(3): verzoeken moeten binnen 30 dagen worden afgehandeld.</p>
        </div>`,
      });
    } catch (err) {
      console.error("[GDPR deadline] Email error:", err);
    }
  }

  console.log(`[GDPR deadline] ${alerts.length} alerts sent`);
  return NextResponse.json({ ok: true, alerts: alerts.length, details: alerts });
}
