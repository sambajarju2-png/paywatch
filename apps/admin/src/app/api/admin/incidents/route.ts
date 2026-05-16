import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdmin } from "@/lib/admin-auth";
import { Resend } from "resend";

function db() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

/** GET — list all incidents */
export async function GET() {
  const admin = await verifyAdmin();
  if (!admin.isAdmin) return admin.response;

  const supabase = db();
  const { data } = await supabase
    .from("security_incidents")
    .select("*")
    .order("detected_at", { ascending: false });

  return NextResponse.json({ incidents: data || [] });
}

/** POST — create a new incident */
export async function POST(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin.isAdmin) return admin.response;

  const body = await req.json();
  const supabase = db();

  const { data: incident, error } = await supabase
    .from("security_incidents")
    .insert({
      title: body.title,
      description: body.description,
      severity: body.severity || "medium",
      affected_scope: body.affected_scope || "unknown",
      affected_service: body.affected_service,
      reported_by: admin.email,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Audit log
  await supabase.from("admin_data_access_log").insert({
    admin_email: admin.email,
    action: "create_security_incident",
    metadata: { incident_id: incident.id, title: body.title, severity: body.severity },
  });

  return NextResponse.json({ ok: true, incident_id: incident.id });
}

/**
 * PATCH — update incident (status, notify AP, notify users)
 * Body: { incident_id, action, ... }
 * Actions: "update_status", "notify_ap", "notify_users", "count_affected"
 */
export async function PATCH(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin.isAdmin) return admin.response;

  const { incident_id, action, ...rest } = await req.json();
  if (!incident_id || !action) {
    return NextResponse.json({ error: "incident_id and action required" }, { status: 400 });
  }

  const supabase = db();

  const { data: incident } = await supabase
    .from("security_incidents")
    .select("*")
    .eq("id", incident_id)
    .single();

  if (!incident) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    switch (action) {
      case "update_status": {
        const updates: Record<string, any> = { status: rest.status, updated_at: new Date().toISOString() };
        if (rest.status === "contained") updates.contained_at = new Date().toISOString();
        if (rest.status === "resolved") updates.resolved_at = new Date().toISOString();
        if (rest.action_taken) updates.action_taken = rest.action_taken;
        if (rest.root_cause) updates.root_cause = rest.root_cause;

        await supabase.from("security_incidents").update(updates).eq("id", incident_id);
        return NextResponse.json({ ok: true, message: `Status bijgewerkt naar ${rest.status}` });
      }

      case "count_affected": {
        // Count potentially affected users based on scope
        let count = 0;
        if (incident.affected_scope === "all_users") {
          const { count: c } = await supabase.from("user_settings").select("*", { count: "exact", head: true });
          count = c || 0;
        } else if (incident.affected_scope === "specific_service" && incident.affected_service) {
          const serviceTable: Record<string, string> = {
            email_scan: "gmail_accounts",
            bank: "bank_connections",
            voice: "user_settings", // all users with voice_seconds_used > 0
          };
          const table = serviceTable[incident.affected_service];
          if (table) {
            const { count: c } = await supabase.from(table).select("*", { count: "exact", head: true });
            count = c || 0;
          }
        }

        await supabase.from("security_incidents")
          .update({ affected_count: count, updated_at: new Date().toISOString() })
          .eq("id", incident_id);

        return NextResponse.json({ ok: true, affected_count: count });
      }

      case "mark_ap_notified": {
        await supabase.from("security_incidents").update({
          ap_notified: true,
          ap_notified_at: new Date().toISOString(),
          ap_reference: rest.reference || null,
          updated_at: new Date().toISOString(),
        }).eq("id", incident_id);
        return NextResponse.json({ ok: true, message: "AP-melding geregistreerd" });
      }

      case "notify_users": {
        // Send breach notification to all affected users
        if (!process.env.RESEND_API_KEY) {
          return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
        }

        const resend = new Resend(process.env.RESEND_API_KEY);
        const { data: emailRows } = await supabase.rpc("get_user_emails");
        const emails = (emailRows || []).map((u: any) => u.email).filter(Boolean);

        const htmlBody = `<div style="font-family:-apple-system,sans-serif;max-width:540px;margin:0 auto;padding:32px">
                <p style="font-size:12px;font-weight:800;color:#0A2540">PayWatch — Beveiligingsmelding</p>
                <div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:12px;padding:16px 20px;margin:16px 0">
                  <p style="margin:0;font-size:15px;font-weight:600;color:#DC2626">Beveiligingsincident</p>
                  <p style="margin:8px 0 0;font-size:13px;color:#0A2540">${incident.title}</p>
                  <p style="margin:8px 0 0;font-size:13px;color:#0A2540">${incident.description || ""}</p>
                </div>
                <p style="font-size:14px;color:#0A2540;line-height:1.7">Wij informeren je over een beveiligingsincident bij PayWatch. Wij nemen je privacy serieus en willen je transparant informeren.</p>
                <p style="font-size:14px;color:#0A2540;line-height:1.7">${incident.action_taken ? `<strong>Genomen maatregelen:</strong> ${incident.action_taken}` : ""}</p>
                <p style="font-size:14px;color:#0A2540;line-height:1.7">Voor vragen kun je contact opnemen via <a href="mailto:privacy@paywatch.nl" style="color:#2563EB">privacy@paywatch.nl</a>.</p>
                <hr style="border:none;border-top:1px solid #E2E8F0;margin:24px 0">
                <p style="font-size:11px;color:#94A3B8">Dit bericht is verstuurd conform Art. 34 AVG. PayWatch · Rotterdam · KVK 83474889</p>
              </div>`;

        // CRITICAL: Send INDIVIDUAL emails — never put multiple recipients in to: field
        // Using Resend batch API: each recipient gets their own email, no one sees others
        let sent = 0;
        const batchSize = 100; // Resend batch.send supports up to 100
        for (let i = 0; i < emails.length; i += batchSize) {
          const batch = emails.slice(i, i + batchSize);
          try {
            await resend.batch.send(
              batch.map((email: string) => ({
                from: "PayWatch <noreply@paywatch.app>",
                to: [email],
                subject: `Belangrijk: beveiligingsmelding van PayWatch`,
                html: htmlBody,
              }))
            );
            sent += batch.length;
          } catch (err) {
            console.error("[Incident notify] Batch error:", err);
          }
        }

        await supabase.from("security_incidents").update({
          users_notified: true,
          users_notified_at: new Date().toISOString(),
          users_notified_count: sent,
          updated_at: new Date().toISOString(),
        }).eq("id", incident_id);

        return NextResponse.json({ ok: true, notified: sent });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err) {
    console.error("[Incident]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
