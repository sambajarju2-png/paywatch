import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createHmac } from "crypto";

const WEBHOOK_SECRET = process.env.SUPABASE_WEBHOOK_SECRET || "";

export async function POST(request: NextRequest) {
  // Verify the request comes from Supabase
  const incomingSecret = request.headers.get("x-webhook-secret") || "";
  if (!WEBHOOK_SECRET || incomingSecret !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Supabase DB webhook payload: { type, table, schema, record, old_record }
  const { type, table, record, old_record } = body;
  if (!type || !table || !record) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Determine event name based on table + operation
  const eventMap: Record<string, Record<string, string>> = {
    user_organizations: {
      INSERT: "user.onboarded",
      UPDATE: "user.status_changed",
      DELETE: "user.removed",
    },
    b2b_consents: {
      INSERT: "consent.granted",
      UPDATE: "consent.updated",
      DELETE: "consent.revoked",
    },
    bills: {
      INSERT: "bill.created",
      UPDATE: "bill.updated",
    },
    payment_plans: {
      INSERT: "payment_plan.created",
      UPDATE: "payment_plan.updated",
    },
    b2b_buddies: {
      INSERT: "buddy.assigned",
      UPDATE: "buddy.updated",
      DELETE: "buddy.removed",
    },
  };

  const eventName = eventMap[table]?.[type];
  if (!eventName) {
    // Table/event combo not mapped — skip silently
    return NextResponse.json({ skipped: true, reason: "unmapped event" });
  }

  // Get organization_id from the record
  const orgId = record.organization_id;
  if (!orgId) {
    return NextResponse.json({ skipped: true, reason: "no org_id in record" });
  }

  // Find all active webhooks for this org that subscribe to this event
  const { data: webhooks } = await supabase
    .from("b2b_webhooks")
    .select("id, url, secret, events")
    .eq("organization_id", orgId)
    .eq("status", "active");

  if (!webhooks || webhooks.length === 0) {
    return NextResponse.json({ delivered: 0, reason: "no webhooks registered" });
  }

  // Filter webhooks that subscribe to this event
  const matching = webhooks.filter(
    (wh: any) => wh.events.includes(eventName) || wh.events.includes("*")
  );

  if (matching.length === 0) {
    return NextResponse.json({ delivered: 0, reason: "no matching subscriptions" });
  }

  // Build payload — strip sensitive fields
  const sanitized = { ...record };
  delete sanitized.encrypted_password;

  const eventPayload = {
    event: eventName,
    table,
    timestamp: new Date().toISOString(),
    data: sanitized,
    old_data: old_record || null,
  };

  // Deliver to each webhook
  const results = [];
  for (const wh of matching) {
    const payloadStr = JSON.stringify(eventPayload);

    // Sign payload with webhook secret
    const signature = wh.secret
      ? createHmac("sha256", wh.secret).update(payloadStr).digest("hex")
      : null;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": "PayWatch-Webhooks/1.0",
      "X-PayWatch-Event": eventName,
      "X-PayWatch-Delivery": crypto.randomUUID(),
    };
    if (signature) headers["X-PayWatch-Signature"] = `sha256=${signature}`;

    let status = 0;
    let responseBody = "";
    try {
      const res = await fetch(wh.url, {
        method: "POST",
        headers,
        body: payloadStr,
        signal: AbortSignal.timeout(8000),
      });
      status = res.status;
      responseBody = (await res.text()).substring(0, 500);
    } catch (err: any) {
      status = 0;
      responseBody = err.message || "Connection failed";
    }

    const success = status >= 200 && status < 300;

    // Log delivery
    await supabase.from("b2b_webhook_log").insert({
      webhook_id: wh.id,
      event: eventName,
      payload: eventPayload,
      response_status: status,
      response_body: responseBody,
      attempt: 1,
    });

    // Update webhook stats
    if (success) {
      await supabase.from("b2b_webhooks")
        .update({ last_triggered_at: new Date().toISOString(), last_success_at: new Date().toISOString(), failure_count: 0 })
        .eq("id", wh.id);
    } else {
      await supabase.from("b2b_webhooks")
        .update({ last_triggered_at: new Date().toISOString(), last_failure_at: new Date().toISOString() })
        .eq("id", wh.id);
    }

    results.push({ webhook_id: wh.id, status, success });
  }

  return NextResponse.json({
    event: eventName,
    delivered: results.length,
    results,
  });
}
