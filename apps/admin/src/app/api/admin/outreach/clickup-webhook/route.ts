import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CLICKUP_WEBHOOK_SECRET = process.env.CLICKUP_WEBHOOK_SECRET || "";

// ClickUp status names → b2b_contacts status values (1:1 lowercase mapping)
const STATUS_MAP: Record<string, string> = {
  new: "new",
  researched: "researched",
  contacted: "contacted",
  replied: "replied",
  meeting: "meeting",
  won: "won",
  lost: "lost",
  complete: "won",
};

function verifySignature(body: string, signature: string): boolean {
  if (!CLICKUP_WEBHOOK_SECRET) return true; // skip if not configured
  const hmac = crypto
    .createHmac("sha256", CLICKUP_WEBHOOK_SECRET)
    .update(body)
    .digest("hex");
  return hmac === signature;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature") || "";

    // Verify webhook signature
    if (CLICKUP_WEBHOOK_SECRET && !verifySignature(rawBody, signature)) {
      console.error("[ClickUp Webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    console.log(`[ClickUp Webhook] Received event: ${event}`);

    if (event !== "taskStatusUpdated") {
      return NextResponse.json({ ok: true, skipped: "not a status event" });
    }

    const taskId = payload.task_id;
    const historyItems = payload.history_items || [];

    // Find the status change in history
    const statusChange = historyItems.find(
      (item: any) => item.field === "status"
    );

    if (!statusChange) {
      console.log("[ClickUp Webhook] No status field in history_items");
      return NextResponse.json({ ok: true, skipped: "no status change" });
    }

    const newClickUpStatus = statusChange.after?.status?.toLowerCase();
    const newAdminStatus = STATUS_MAP[newClickUpStatus] || newClickUpStatus;

    if (!newAdminStatus) {
      console.log(`[ClickUp Webhook] Unknown status: ${newClickUpStatus}`);
      return NextResponse.json({ ok: true, skipped: "unknown status" });
    }

    console.log(
      `[ClickUp Webhook] Task ${taskId}: ${statusChange.before?.status} → ${newClickUpStatus} (admin: ${newAdminStatus})`
    );

    // Update b2b_contacts where clickup_task_id matches
    const { data, error } = await supabase
      .from("b2b_contacts")
      .update({ status: newAdminStatus, updated_at: new Date().toISOString() })
      .eq("clickup_task_id", taskId)
      .select("id, organization_name, status");

    if (error) {
      console.error("[ClickUp Webhook] Supabase update error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      console.log(
        `[ClickUp Webhook] No b2b_contact found for task ${taskId} — skipping`
      );
      return NextResponse.json({ ok: true, skipped: "no matching contact" });
    }

    console.log(
      `[ClickUp Webhook] Updated ${data[0].organization_name} → ${newAdminStatus}`
    );

    return NextResponse.json({
      ok: true,
      updated: data[0].organization_name,
      status: newAdminStatus,
    });
  } catch (err) {
    console.error("[ClickUp Webhook] Error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
