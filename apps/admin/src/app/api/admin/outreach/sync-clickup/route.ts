import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CLICKUP_API_KEY = process.env.CLICKUP_API_KEY!;

/* ── ClickUp list IDs per contact type ── */
const CLICKUP_LISTS: Record<string, string> = {
  journalist: "901522469792",
  aid_org: "901522316053",
  incasso: "901522459761",
  gemeente: "901522459767",
  billing_vendor: "901522560378",
};

/* ── Custom field IDs (shared across all lists) ── */
const CF = {
  website: "091deb29-c134-43ac-99fc-19f0a11cfef9",
  linkedin_url: "3f7046d4-bb97-4c91-a0ea-e4d480e1cfa3",
  city: "c03e8fe3-cce1-4222-9587-6efb31b90587",
  contact_email: "dce4d614-0f59-4c71-aa6d-f8dc399710aa",
  first_name: "f901b412-b674-4251-a24a-96207fcb65a3",
  last_name: "f288c48a-75d3-45d4-8ff7-8003246e5c65",
  category: "f7e43f07-8273-472e-99e4-ad23e8931c53",
};

/* ── Reverse lookup: field ID → supabase column ── */
const CF_TO_COLUMN: Record<string, string> = {
  [CF.website]: "website",
  [CF.linkedin_url]: "linkedin_url",
  [CF.city]: "city",
  [CF.contact_email]: "contact_email",
  [CF.first_name]: "first_name",
  [CF.last_name]: "last_name",
  [CF.category]: "beat",
};

/* ── Extract custom field value from ClickUp task ── */
function extractFieldValue(
  task: { custom_fields?: Array<{ id: string; value?: unknown; type?: string }> },
  fieldId: string
): string | null {
  const field = task.custom_fields?.find((f) => f.id === fieldId);
  if (!field || field.value === undefined || field.value === null || field.value === "") return null;

  // Location fields have nested structure
  if (field.type === "location" && typeof field.value === "object") {
    const loc = field.value as { formatted_address?: string };
    return loc?.formatted_address?.replace(/, Netherlands$/i, "")?.trim() || null;
  }

  return String(field.value);
}

/* ── Build custom fields array for ClickUp API ── */
function buildCustomFields(contact: Record<string, unknown>): Array<{ id: string; value: unknown }> {
  const fields: Array<{ id: string; value: unknown }> = [];

  if (contact.website) fields.push({ id: CF.website, value: contact.website });
  if (contact.linkedin_url) fields.push({ id: CF.linkedin_url, value: contact.linkedin_url });
  if (contact.contact_email) fields.push({ id: CF.contact_email, value: contact.contact_email });
  if (contact.first_name) fields.push({ id: CF.first_name, value: contact.first_name });
  if (contact.last_name) fields.push({ id: CF.last_name, value: contact.last_name });
  if (contact.beat) fields.push({ id: CF.category, value: contact.beat });

  // City needs location format
  if (contact.city) {
    fields.push({
      id: CF.city,
      value: { location: { formatted_address: `${contact.city}, Netherlands` } },
    });
  }

  return fields;
}

/**
 * GET /api/admin/outreach/sync-clickup
 * Pull from ClickUp → Supabase (status + all custom fields)
 * Query: ?type=journalist (optional, defaults to all types)
 */
export async function GET(req: NextRequest) {
  try {
    if (!CLICKUP_API_KEY) {
      return NextResponse.json({ error: "CLICKUP_API_KEY not configured" }, { status: 500 });
    }

    const typeFilter = req.nextUrl.searchParams.get("type");

    // Get all contacts with clickup_task_id
    let query = supabase
      .from("b2b_contacts")
      .select("id, organization_name, type, status, clickup_task_id, website, linkedin_url, city, contact_email, first_name, last_name, beat")
      .not("clickup_task_id", "is", null);

    if (typeFilter) query = query.eq("type", typeFilter);

    const { data: contacts, error: fetchErr } = await query;

    if (fetchErr || !contacts) {
      return NextResponse.json({ error: fetchErr?.message || "No contacts" }, { status: 500 });
    }

    console.log(`[Sync] Pulling ${contacts.length} contacts from ClickUp${typeFilter ? ` (type: ${typeFilter})` : ""}...`);

    let synced = 0;
    let unchanged = 0;
    let errors = 0;
    const changes: Array<{ org: string; field: string; from: string | null; to: string | null }> = [];

    for (const contact of contacts) {
      try {
        const res = await fetch(
          `https://api.clickup.com/api/v2/task/${contact.clickup_task_id}`,
          { headers: { Authorization: CLICKUP_API_KEY } }
        );

        if (!res.ok) {
          console.error(`[Sync] Failed to fetch task ${contact.clickup_task_id}: ${res.status}`);
          errors++;
          continue;
        }

        const task = await res.json();
        const updates: Record<string, string | null> = {};

        // Check status
        const clickUpStatus = task.status?.status?.toLowerCase();
        if (clickUpStatus && clickUpStatus !== contact.status) {
          const mapped = clickUpStatus === "complete" ? "won" : clickUpStatus;
          updates.status = mapped;
          changes.push({ org: contact.organization_name, field: "status", from: contact.status, to: mapped });
        }

        // Check each custom field
        for (const [fieldId, column] of Object.entries(CF_TO_COLUMN)) {
          const clickUpValue = extractFieldValue(task, fieldId);
          const supabaseValue = (contact as Record<string, unknown>)[column] as string | null;

          // Only update if ClickUp has a value and it's different from Supabase
          if (clickUpValue && clickUpValue !== supabaseValue) {
            updates[column] = clickUpValue;
            changes.push({ org: contact.organization_name, field: column, from: supabaseValue, to: clickUpValue });
          }
        }

        if (Object.keys(updates).length > 0) {
          updates.updated_at = new Date().toISOString();
          const { error: updateErr } = await supabase
            .from("b2b_contacts")
            .update(updates)
            .eq("id", contact.id);

          if (updateErr) {
            console.error(`[Sync] Update error for ${contact.organization_name}:`, updateErr.message);
            errors++;
          } else {
            synced++;
          }
        } else {
          unchanged++;
        }
      } catch (err) {
        console.error(`[Sync] Error for ${contact.organization_name}:`, err);
        errors++;
      }
    }

    console.log(`[Sync] Pull done. Synced: ${synced}, Unchanged: ${unchanged}, Errors: ${errors}`);

    return NextResponse.json({ total: contacts.length, synced, unchanged, errors, changes });
  } catch (err) {
    console.error("[Sync] Fatal error:", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}

/**
 * POST /api/admin/outreach/sync-clickup
 * Push from Supabase → ClickUp
 * 
 * Actions:
 * - { action: "push", contact_id: string } — push single contact (create or update)
 * - { action: "push_status", contact_id: string, status: string } — push status only
 * - { action: "push_all", type: string } — push all contacts of a type that don't have clickup_task_id
 */
export async function POST(req: NextRequest) {
  try {
    if (!CLICKUP_API_KEY) {
      return NextResponse.json({ error: "CLICKUP_API_KEY not configured" }, { status: 500 });
    }

    const body = await req.json();
    const action = body.action || "push_status"; // backwards compatible

    // Legacy support: { contact_id, status } without action
    if (!body.action && body.contact_id && body.status) {
      return pushStatus(body.contact_id, body.status);
    }

    switch (action) {
      case "push":
        return pushContact(body.contact_id);
      case "push_status":
        return pushStatus(body.contact_id, body.status);
      case "push_all":
        return pushAll(body.type);
      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err) {
    console.error("[Sync] Push error:", err);
    return NextResponse.json({ error: "Push failed" }, { status: 500 });
  }
}

/* ── Push single contact (create or update in ClickUp) ── */
async function pushContact(contactId: string) {
  if (!contactId) return NextResponse.json({ error: "contact_id required" }, { status: 400 });

  const { data: contact, error } = await supabase
    .from("b2b_contacts")
    .select("*")
    .eq("id", contactId)
    .single();

  if (error || !contact) return NextResponse.json({ error: "Contact not found" }, { status: 404 });

  const listId = CLICKUP_LISTS[contact.type];
  if (!listId) return NextResponse.json({ error: `No ClickUp list for type: ${contact.type}` }, { status: 400 });

  const customFields = buildCustomFields(contact);

  if (contact.clickup_task_id) {
    // UPDATE existing task
    const res = await fetch(`https://api.clickup.com/api/v2/task/${contact.clickup_task_id}`, {
      method: "PUT",
      headers: { Authorization: CLICKUP_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        name: contact.organization_name,
        status: contact.status,
        custom_fields: customFields,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: errText }, { status: 500 });
    }

    return NextResponse.json({ ok: true, action: "updated", task_id: contact.clickup_task_id });
  } else {
    // CREATE new task
    const res = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
      method: "POST",
      headers: { Authorization: CLICKUP_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        name: contact.organization_name,
        status: contact.status || "new",
        custom_fields: customFields,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: errText }, { status: 500 });
    }

    const task = await res.json();
    const taskId = task.id;

    // Save task ID back to Supabase
    await supabase
      .from("b2b_contacts")
      .update({ clickup_task_id: taskId })
      .eq("id", contactId);

    return NextResponse.json({ ok: true, action: "created", task_id: taskId });
  }
}

/* ── Push status only (backwards compatible) ── */
async function pushStatus(contactId: string, status: string) {
  if (!contactId || !status) return NextResponse.json({ error: "contact_id and status required" }, { status: 400 });

  const { data: contact, error } = await supabase
    .from("b2b_contacts")
    .select("id, organization_name, clickup_task_id")
    .eq("id", contactId)
    .single();

  if (error || !contact) return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  if (!contact.clickup_task_id) return NextResponse.json({ ok: true, clickup: false, reason: "no clickup_task_id" });

  const res = await fetch(`https://api.clickup.com/api/v2/task/${contact.clickup_task_id}`, {
    method: "PUT",
    headers: { Authorization: CLICKUP_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const errText = await res.text();
    return NextResponse.json({ ok: false, error: errText }, { status: 500 });
  }

  return NextResponse.json({ ok: true, clickup: true, organization: contact.organization_name, status });
}

/* ── Push all unlinked contacts of a type ── */
async function pushAll(type: string) {
  if (!type) return NextResponse.json({ error: "type required" }, { status: 400 });

  const listId = CLICKUP_LISTS[type];
  if (!listId) return NextResponse.json({ error: `No ClickUp list for type: ${type}` }, { status: 400 });

  const { data: contacts, error } = await supabase
    .from("b2b_contacts")
    .select("*")
    .eq("type", type)
    .is("clickup_task_id", null)
    .order("organization_name");

  if (error || !contacts) return NextResponse.json({ error: error?.message || "No contacts" }, { status: 500 });

  let created = 0;
  let errors = 0;

  for (const contact of contacts) {
    try {
      const customFields = buildCustomFields(contact);

      const res = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
        method: "POST",
        headers: { Authorization: CLICKUP_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contact.organization_name,
          status: contact.status || "new",
          custom_fields: customFields,
        }),
      });

      if (!res.ok) {
        console.error(`[Sync] Failed to create task for ${contact.organization_name}: ${res.status}`);
        errors++;
        continue;
      }

      const task = await res.json();

      await supabase
        .from("b2b_contacts")
        .update({ clickup_task_id: task.id })
        .eq("id", contact.id);

      created++;

      // Rate limit protection
      await new Promise((r) => setTimeout(r, 200));
    } catch (err) {
      console.error(`[Sync] Error creating task for ${contact.organization_name}:`, err);
      errors++;
    }
  }

  return NextResponse.json({ ok: true, type, created, errors, total: contacts.length });
}
