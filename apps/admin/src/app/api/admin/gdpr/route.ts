import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdmin } from "@/lib/admin-auth";
import { Resend } from "resend";

function getAdmin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

/**
 * GET /api/admin/gdpr — list all GDPR requests
 */
export async function GET() {
  const admin = await verifyAdmin();
  if (!admin.isAdmin) return admin.response;

  const supabase = getAdmin();
  const { data: requests } = await supabase
    .from("gdpr_requests")
    .select("id, user_id, request_type, status, details, completed_at, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  // Get user emails for each request
  const userIds = [...new Set((requests || []).map(r => r.user_id))];
  const { data: emailRows } = await supabase.rpc("get_user_emails");
  const emailMap: Record<string, string> = {};
  (emailRows || []).forEach((u: any) => { emailMap[u.id] = u.email || ""; });

  const enriched = (requests || []).map(r => ({
    ...r,
    user_email: emailMap[r.user_id] || "onbekend",
    ref: r.id.slice(0, 8).toUpperCase(),
  }));

  // Audit log
  await supabase.from("admin_data_access_log").insert({
    admin_email: admin.email || "unknown",
    action: "view_gdpr_requests",
    metadata: { count: enriched.length },
  });

  return NextResponse.json({ requests: enriched });
}

/**
 * PATCH /api/admin/gdpr — mark a request as completed
 * Body: { request_id: string, note?: string }
 * Sends completion email to the user.
 */
export async function PATCH(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin.isAdmin) return admin.response;

  const { request_id, note } = await req.json();
  if (!request_id) return NextResponse.json({ error: "request_id required" }, { status: 400 });

  const supabase = getAdmin();

  // Get the request
  const { data: request } = await supabase
    .from("gdpr_requests")
    .select("id, user_id, request_type, status")
    .eq("id", request_id)
    .single();

  if (!request) return NextResponse.json({ error: "Request not found" }, { status: 404 });

  // Update status
  await supabase.from("gdpr_requests").update({
    status: "completed",
    completed_at: new Date().toISOString(),
    details: { note, completed_by: admin.email },
  }).eq("id", request_id);

  // Get user email and send completion notification
  const { data: authUser } = await supabase.auth.admin.getUserById(request.user_id);
  const userEmail = authUser?.user?.email;

  if (userEmail && process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const typeLabels: Record<string, string> = {
        inzage: "Recht op inzage", overdracht: "Recht op overdracht",
        toestemming_intrekken: "Toestemming intrekken", rectificatie: "Recht op correctie",
        beperking: "Recht op beperking", bezwaar: "Recht op bezwaar", verwijdering: "Recht op verwijdering",
      };
      const refCode = request_id.slice(0, 8).toUpperCase();

      await resend.emails.send({
        from: "PayWatch <noreply@paywatch.app>",
        to: userEmail,
        subject: `Privacyverzoek afgerond — ${typeLabels[request.request_type] || request.request_type} (ref: ${refCode})`,
        html: `<div style="font-family:-apple-system,sans-serif;max-width:540px;margin:0 auto;padding:32px">
          <p style="font-size:12px;font-weight:800;color:#0A2540">PayWatch</p>
          <p style="font-size:14px;color:#0A2540;margin-top:16px">Hoi,</p>
          <p style="font-size:14px;color:#0A2540;line-height:1.7">Je privacyverzoek is afgerond.</p>
          <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;padding:16px 20px;margin:16px 0">
            <p style="margin:0;font-size:15px;font-weight:600;color:#059669">✓ Verzoek afgerond</p>
            <p style="margin:8px 0 0;font-size:13px;color:#0A2540">${typeLabels[request.request_type] || request.request_type}</p>
            <p style="margin:4px 0 0;font-size:13px;color:#64748B">Ref: ${refCode}</p>
            ${note ? `<p style="margin:8px 0 0;font-size:13px;color:#0A2540">${note}</p>` : ""}
          </div>
          <p style="font-size:14px;color:#0A2540;line-height:1.7">Heb je nog vragen? Mail naar <a href="mailto:privacy@paywatch.nl" style="color:#2563EB">privacy@paywatch.nl</a>.</p>
          <p style="font-size:13px;color:#64748B;margin-top:24px">Met vriendelijke groet,<br><strong style="color:#0A2540">PayWatch Privacy Team</strong></p>
          <hr style="border:none;border-top:1px solid #E2E8F0;margin:24px 0">
          <p style="font-size:11px;color:#94A3B8">PayWatch · Rotterdam · KVK 83474889</p>
        </div>`,
      });
    } catch (emailErr) {
      console.error("[GDPR] Completion email error:", emailErr);
    }
  }

  // Audit log
  await supabase.from("admin_data_access_log").insert({
    admin_email: admin.email || "unknown",
    action: "complete_gdpr_request",
    target_user_id: request.user_id,
    metadata: { request_id, request_type: request.request_type, note },
  });

  return NextResponse.json({ ok: true });
}
