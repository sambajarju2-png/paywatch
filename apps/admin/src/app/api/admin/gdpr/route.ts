import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdmin } from "@/lib/admin-auth";
import { Resend } from "resend";

function db() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

/** GET /api/admin/gdpr — list all requests */
export async function GET() {
  const admin = await verifyAdmin();
  if (!admin.isAdmin) return admin.response;

  const supabase = db();
  const { data: requests } = await supabase
    .from("gdpr_requests")
    .select("id, user_id, request_type, status, details, action_taken, fulfilled_by, completed_at, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const { data: emailRows } = await supabase.rpc("get_user_emails");
  const emailMap: Record<string, string> = {};
  (emailRows || []).forEach((u: any) => { emailMap[u.id] = u.email || ""; });

  const enriched = (requests || []).map(r => ({
    ...r,
    user_email: emailMap[r.user_id] || "onbekend",
    ref: r.id.slice(0, 8).toUpperCase(),
    days_open: Math.floor((Date.now() - new Date(r.created_at).getTime()) / 86400000),
  }));

  await supabase.from("admin_data_access_log").insert({
    admin_email: admin.email || "unknown",
    action: "view_gdpr_requests",
  });

  return NextResponse.json({ requests: enriched });
}

/**
 * PATCH /api/admin/gdpr — execute an action on a request
 * Body: { request_id, action, note? }
 * 
 * Actions:
 *   "delete_account"  — permanently deletes the user's account (verwijdering)
 *   "restrict_account" — freezes the user's account (beperking)
 *   "unrestrict_account" — unfreezes (after beperking review)
 *   "complete"         — marks as done with optional note (rectificatie, bezwaar)
 *   "generate_export"  — generates data export for admin to send (inzage, overdracht)
 */
export async function PATCH(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin.isAdmin) return admin.response;

  const { request_id, action, note } = await req.json();
  if (!request_id || !action) {
    return NextResponse.json({ error: "request_id and action required" }, { status: 400 });
  }

  const supabase = db();

  const { data: request } = await supabase
    .from("gdpr_requests")
    .select("id, user_id, request_type, status")
    .eq("id", request_id)
    .single();

  if (!request) return NextResponse.json({ error: "Request not found" }, { status: 404 });

  const userId = request.user_id;
  let actionTaken = "";
  let resultMessage = "";

  try {
    switch (action) {
      case "delete_account": {
        // Call the comprehensive deletion function
        const { error: delErr } = await supabase.rpc("delete_all_user_data", { target_user_id: userId });
        if (delErr) throw new Error(`delete_all_user_data failed: ${delErr.message}`);
        
        // Delete auth user
        await supabase.auth.admin.deleteUser(userId);
        
        actionTaken = "Account en alle gegevens permanent verwijderd via delete_all_user_data()";
        resultMessage = "Account verwijderd";
        break;
      }

      case "restrict_account": {
        const { error: restrictErr } = await supabase
          .from("user_settings")
          .update({ is_restricted: true })
          .eq("user_id", userId);
        if (restrictErr) throw new Error(`restrict failed: ${restrictErr.message}`);

        actionTaken = "Account bevroren — verwerking gepauzeerd";
        resultMessage = "Account bevroren";
        break;
      }

      case "unrestrict_account": {
        await supabase.from("user_settings").update({ is_restricted: false }).eq("user_id", userId);
        actionTaken = "Account ontdooid — verwerking hervat";
        resultMessage = "Account ontdooid";
        break;
      }

      case "generate_export": {
        // Generate export data for the user (admin-triggered)
        const [settings, bills, transactions, finances, expenses] = await Promise.all([
          supabase.from("user_settings").select("*").eq("user_id", userId).single(),
          supabase.from("bills").select("vendor, amount, status, escalation_stage, due_date, paid_at, source, category").eq("user_id", userId),
          supabase.from("bank_transactions").select("booking_date, amount, creditor_name, pw_category").eq("user_id", userId),
          supabase.from("user_finances").select("*").eq("user_id", userId).single(),
          supabase.from("user_expenses").select("*").eq("user_id", userId),
        ]);

        const exportData = {
          exported_at: new Date().toISOString(),
          exported_by: "admin_gdpr_request",
          user_settings: settings.data,
          bills: bills.data,
          bank_transactions: transactions.data,
          finances: finances.data,
          expenses: expenses.data,
        };

        // Store export temporarily so admin can send it
        actionTaken = `Data-export gegenereerd (${(bills.data?.length || 0)} rekeningen, ${(transactions.data?.length || 0)} transacties)`;
        resultMessage = "Export gegenereerd";

        // Mark completed and return export data
        await supabase.from("gdpr_requests").update({
          status: "completed",
          completed_at: new Date().toISOString(),
          action_taken: actionTaken,
          fulfilled_by: admin.email,
          details: { note, export_summary: actionTaken },
        }).eq("id", request_id);

        await supabase.from("admin_data_access_log").insert({
          admin_email: admin.email || "unknown",
          action: `gdpr_${action}`,
          target_user_id: userId,
          metadata: { request_id, note },
        });

        // Send email with export notice
        await sendCompletionEmail(supabase, userId, request.request_type, request_id, note || actionTaken);

        return NextResponse.json({ ok: true, action: actionTaken, message: resultMessage, export: exportData });
      }

      case "complete": {
        actionTaken = note || "Handmatig afgerond door admin";
        resultMessage = "Afgerond";
        break;
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

    // Update request status
    await supabase.from("gdpr_requests").update({
      status: "completed",
      completed_at: new Date().toISOString(),
      action_taken: actionTaken,
      fulfilled_by: admin.email,
      details: { note, action },
    }).eq("id", request_id);

    // Audit log
    await supabase.from("admin_data_access_log").insert({
      admin_email: admin.email || "unknown",
      action: `gdpr_${action}`,
      target_user_id: userId,
      metadata: { request_id, request_type: request.request_type, note },
    });

    // Send completion email (skip for delete — user no longer exists)
    if (action !== "delete_account") {
      await sendCompletionEmail(supabase, userId, request.request_type, request_id, note || actionTaken);
    }

    return NextResponse.json({ ok: true, action: actionTaken, message: resultMessage });
  } catch (err) {
    console.error("[GDPR action]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

async function sendCompletionEmail(supabase: any, userId: string, requestType: string, requestId: string, note: string) {
  try {
    const { data: authUser } = await supabase.auth.admin.getUserById(userId);
    const email = authUser?.user?.email;
    if (!email || !process.env.RESEND_API_KEY) return;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const labels: Record<string, string> = {
      inzage: "Recht op inzage", overdracht: "Recht op overdracht",
      toestemming_intrekken: "Toestemming intrekken", rectificatie: "Recht op correctie",
      beperking: "Recht op beperking", bezwaar: "Recht op bezwaar", verwijdering: "Recht op verwijdering",
    };
    const ref = requestId.slice(0, 8).toUpperCase();

    await resend.emails.send({
      from: "PayWatch <noreply@paywatch.app>",
      to: email,
      subject: `Privacyverzoek afgerond — ${labels[requestType] || requestType} (ref: ${ref})`,
      html: `<div style="font-family:-apple-system,sans-serif;max-width:540px;margin:0 auto;padding:32px">
        <p style="font-size:12px;font-weight:800;color:#0A2540">PayWatch</p>
        <p style="font-size:14px;color:#0A2540;margin-top:16px">Hoi,</p>
        <p style="font-size:14px;color:#0A2540;line-height:1.7">Je privacyverzoek is afgerond.</p>
        <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;padding:16px 20px;margin:16px 0">
          <p style="margin:0;font-size:15px;font-weight:600;color:#059669">✓ Verzoek afgerond</p>
          <p style="margin:8px 0 0;font-size:13px;color:#0A2540">${labels[requestType] || requestType}</p>
          <p style="margin:4px 0 0;font-size:13px;color:#64748B">Ref: ${ref}</p>
          ${note ? `<p style="margin:8px 0 0;font-size:13px;color:#0A2540">${note}</p>` : ""}
        </div>
        <p style="font-size:14px;color:#0A2540;line-height:1.7">Vragen? Mail naar <a href="mailto:privacy@paywatch.nl" style="color:#2563EB">privacy@paywatch.nl</a>.</p>
        <hr style="border:none;border-top:1px solid #E2E8F0;margin:24px 0">
        <p style="font-size:11px;color:#94A3B8">PayWatch · Rotterdam · KVK 83474889</p>
      </div>`,
    });
  } catch (err) {
    console.error("[GDPR email]", err);
  }
}
