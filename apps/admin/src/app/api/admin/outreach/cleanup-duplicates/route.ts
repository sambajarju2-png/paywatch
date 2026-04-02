import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CLICKUP_API_KEY = process.env.CLICKUP_API_KEY!;

const CLICKUP_LISTS: Record<string, string> = {
  journalist: "901522469792",
  aid_org: "901522316053",
  incasso: "901522459761",
  gemeente: "901522459767",
  billing_vendor: "901522560378",
};

/**
 * GET /api/admin/outreach/cleanup-duplicates?type=gemeente
 * 
 * Finds and deletes orphan ClickUp tasks (tasks in ClickUp that are NOT
 * linked to any Supabase contact). This happens when a push is interrupted
 * and task IDs are cleared for a re-push.
 * 
 * Add &dry_run=true to preview without deleting.
 */
export async function GET(req: NextRequest) {
  try {
    const type = req.nextUrl.searchParams.get("type");
    const dryRun = req.nextUrl.searchParams.get("dry_run") === "true";

    if (!type || !CLICKUP_LISTS[type]) {
      return NextResponse.json({ error: "type required (journalist|aid_org|incasso|gemeente|billing_vendor)" }, { status: 400 });
    }

    const listId = CLICKUP_LISTS[type];

    // Step 1: Get all valid clickup_task_ids from Supabase
    const { data: contacts, error } = await supabase
      .from("b2b_contacts")
      .select("clickup_task_id")
      .eq("type", type)
      .not("clickup_task_id", "is", null);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const validIds = new Set((contacts || []).map((c) => c.clickup_task_id));
    console.log(`[Cleanup] ${type}: ${validIds.size} valid task IDs in Supabase`);

    // Step 2: Get ALL tasks from the ClickUp list (paginated, max 100 per page)
    const allClickUpIds: string[] = [];
    let page = 0;
    while (true) {
      const res = await fetch(
        `https://api.clickup.com/api/v2/list/${listId}/task?page=${page}&include_closed=true&subtasks=false`,
        { headers: { Authorization: CLICKUP_API_KEY } }
      );

      if (!res.ok) {
        console.error(`[Cleanup] Failed to fetch page ${page}: ${res.status}`);
        break;
      }

      const data = await res.json();
      const tasks = data.tasks || [];

      for (const task of tasks) {
        allClickUpIds.push(task.id);
      }

      console.log(`[Cleanup] Page ${page}: ${tasks.length} tasks`);

      if (tasks.length < 100) break;
      page++;
    }

    console.log(`[Cleanup] Total tasks in ClickUp ${type} list: ${allClickUpIds.length}`);

    // Step 3: Find orphans
    const orphanIds = allClickUpIds.filter((id) => !validIds.has(id));
    console.log(`[Cleanup] Orphan tasks to delete: ${orphanIds.length}`);

    if (dryRun) {
      return NextResponse.json({
        dry_run: true,
        type,
        valid_in_supabase: validIds.size,
        total_in_clickup: allClickUpIds.length,
        orphans_to_delete: orphanIds.length,
        orphan_ids: orphanIds.slice(0, 20),
      });
    }

    // Step 4: Delete orphans
    let deleted = 0;
    let errors = 0;

    for (const taskId of orphanIds) {
      try {
        const res = await fetch(`https://api.clickup.com/api/v2/task/${taskId}`, {
          method: "DELETE",
          headers: { Authorization: CLICKUP_API_KEY },
        });

        if (res.ok || res.status === 204) {
          deleted++;
        } else {
          console.error(`[Cleanup] Failed to delete ${taskId}: ${res.status}`);
          errors++;
        }

        // Rate limit: 150ms between deletes
        await new Promise((r) => setTimeout(r, 150));
      } catch (err) {
        console.error(`[Cleanup] Error deleting ${taskId}:`, err);
        errors++;
      }
    }

    return NextResponse.json({
      type,
      valid_in_supabase: validIds.size,
      total_in_clickup: allClickUpIds.length,
      orphans_found: orphanIds.length,
      deleted,
      errors,
    });
  } catch (err) {
    console.error("[Cleanup] Fatal:", err);
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
  }
}
