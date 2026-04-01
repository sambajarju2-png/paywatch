import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CLICKUP_API_KEY = process.env.CLICKUP_API_KEY!;
const BILLING_VENDORS_LIST_ID = "901522560378";

// b2b_contacts status → ClickUp status (1:1 mapping)
const ADMIN_TO_CLICKUP: Record<string, string> = {
  new: "new",
  researched: "researched",
  contacted: "contacted",
  replied: "replied",
  meeting: "meeting",
  won: "won",
  lost: "lost",
};

/**
 * GET /api/admin/outreach/sync-clickup
 * Fallback "Sync All" — pulls all ClickUp task statuses and updates Supabase
 */
export async function GET() {
  try {
    if (!CLICKUP_API_KEY) {
      return NextResponse.json({ error: "CLICKUP_API_KEY not configured" }, { status: 500 });
    }

    // 1. Get all b2b_contacts that have a clickup_task_id
    const { data: contacts, error: fetchErr } = await supabase
      .from("b2b_contacts")
      .select("id, organization_name, status, clickup_task_id")
      .not("clickup_task_id", "is", null);

    if (fetchErr || !contacts) {
      return NextResponse.json({ error: fetchErr?.message || "No contacts" }, { status: 500 });
    }

    console.log(`[Sync ClickUp] Syncing ${contacts.length} linked contacts...`);

    let synced = 0;
    let unchanged = 0;
    let errors = 0;
    const changes: { org: string; from: string; to: string }[] = [];

    // 2. For each linked contact, fetch ClickUp task status
    for (const contact of contacts) {
      try {
        const res = await fetch(
          `https://api.clickup.com/api/v2/task/${contact.clickup_task_id}`,
          { headers: { Authorization: CLICKUP_API_KEY } }
        );

        if (!res.ok) {
          console.error(`[Sync ClickUp] Failed to fetch task ${contact.clickup_task_id}: ${res.status}`);
          errors++;
          continue;
        }

        const task = await res.json();
        const clickUpStatus = task.status?.status?.toLowerCase();

        if (!clickUpStatus) {
          errors++;
          continue;
        }

        // Map ClickUp status to admin status
        const mappedStatus = clickUpStatus === "complete" ? "won" : clickUpStatus;

        // Only update if different
        if (mappedStatus !== contact.status) {
          const { error: updateErr } = await supabase
            .from("b2b_contacts")
            .update({ status: mappedStatus, updated_at: new Date().toISOString() })
            .eq("id", contact.id);

          if (updateErr) {
            console.error(`[Sync ClickUp] Update error for ${contact.organization_name}:`, updateErr.message);
            errors++;
          } else {
            changes.push({
              org: contact.organization_name,
              from: contact.status,
              to: mappedStatus,
            });
            synced++;
          }
        } else {
          unchanged++;
        }
      } catch (err) {
        console.error(`[Sync ClickUp] Error for ${contact.organization_name}:`, err);
        errors++;
      }
    }

    console.log(`[Sync ClickUp] Done. Synced: ${synced}, Unchanged: ${unchanged}, Errors: ${errors}`);

    return NextResponse.json({
      total: contacts.length,
      synced,
      unchanged,
      errors,
      changes,
    });
  } catch (err) {
    console.error("[Sync ClickUp] Fatal error:", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}

/**
 * POST /api/admin/outreach/sync-clickup
 * Push a single contact's status from Admin → ClickUp
 * Body: { contact_id: string, status: string }
 */
export async function POST(req: NextRequest) {
  try {
    if (!CLICKUP_API_KEY) {
      return NextResponse.json({ error: "CLICKUP_API_KEY not configured" }, { status: 500 });
    }

    const { contact_id, status } = await req.json();

    if (!contact_id || !status) {
      return NextResponse.json({ error: "contact_id and status required" }, { status: 400 });
    }

    // 1. Get the contact's clickup_task_id
    const { data: contact, error: fetchErr } = await supabase
      .from("b2b_contacts")
      .select("id, organization_name, clickup_task_id, status")
      .eq("id", contact_id)
      .single();

    if (fetchErr || !contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    if (!contact.clickup_task_id) {
      // No ClickUp link — just update Supabase
      return NextResponse.json({ ok: true, clickup: false, reason: "no clickup_task_id" });
    }

    // 2. Map admin status to ClickUp status
    const clickUpStatus = ADMIN_TO_CLICKUP[status];
    if (!clickUpStatus) {
      return NextResponse.json({ ok: true, clickup: false, reason: `unmapped status: ${status}` });
    }

    // 3. Update ClickUp task
    const res = await fetch(
      `https://api.clickup.com/api/v2/task/${contact.clickup_task_id}`,
      {
        method: "PUT",
        headers: {
          Authorization: CLICKUP_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: clickUpStatus }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[Sync ClickUp] Failed to update task ${contact.clickup_task_id}:`, errText);
      return NextResponse.json({ ok: false, error: errText }, { status: 500 });
    }

    console.log(
      `[Sync ClickUp] Pushed ${contact.organization_name} → ClickUp status: ${clickUpStatus}`
    );

    return NextResponse.json({
      ok: true,
      clickup: true,
      organization: contact.organization_name,
      status: clickUpStatus,
    });
  } catch (err) {
    console.error("[Sync ClickUp] Push error:", err);
    return NextResponse.json({ error: "Push failed" }, { status: 500 });
  }
}
