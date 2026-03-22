import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return NextResponse.json({
      users: { total: 0, completed: 0, recentWeek: 0 },
      bills: { total: 0, paid: 0, overdue: 0, totalOutstandingEur: "0.00", stages: {} },
      moods: {},
      contacts: 0,
      applications: 0,
      error: `Missing env vars: ${!url ? "NEXT_PUBLIC_SUPABASE_URL" : ""} ${!key ? "SUPABASE_SERVICE_ROLE_KEY" : ""}`.trim(),
    });
  }

  try {
    const sb = createClient(url, key);

    /* Users */
    const [totalUsers, completedUsers, recentUsers] = await Promise.all([
      sb.from("user_settings").select("user_id", { count: "exact", head: true }),
      sb.from("user_settings").select("user_id", { count: "exact", head: true }).eq("onboarding_complete", true),
      sb.from("user_settings").select("user_id", { count: "exact", head: true }).gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString()),
    ]);

    if (totalUsers.error) {
      console.error("Admin stats - user_settings query error:", totalUsers.error);
    }

    /* Bills */
    const [totalBills, paidBills, actionBills] = await Promise.all([
      sb.from("bills").select("id", { count: "exact", head: true }),
      sb.from("bills").select("id", { count: "exact", head: true }).eq("status", "settled"),
      sb.from("bills").select("id", { count: "exact", head: true }).in("status", ["action", "failed"]),
    ]);

    if (totalBills.error) {
      console.error("Admin stats - bills query error:", totalBills.error);
    }

    /* Outstanding amount */
    const { data: outstandingData, error: outErr } = await sb.from("bills").select("amount").neq("status", "settled");
    if (outErr) console.error("Admin stats - outstanding query error:", outErr);
    const totalOutstandingCents = (outstandingData ?? []).reduce((sum: number, b: { amount: number }) => sum + (b.amount || 0), 0);

    /* Escalation stages */
    const { data: stageData } = await sb.from("bills").select("escalation_stage").neq("status", "settled");
    const stageCounts: Record<string, number> = {};
    (stageData ?? []).forEach((b: { escalation_stage: string | null }) => {
      const s = b.escalation_stage || "factuur";
      stageCounts[s] = (stageCounts[s] || 0) + 1;
    });

    /* Moods */
    const { data: moodData } = await sb.from("mood_log").select("mood").order("created_at", { ascending: false }).limit(100);
    const moodCounts: Record<string, number> = {};
    (moodData ?? []).forEach((m: { mood: string }) => {
      moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
    });

    /* Contacts + Applications */
    const contactRes = await sb.from("contact_submissions").select("id", { count: "exact", head: true });
    const appRes = await sb.from("job_applications").select("id", { count: "exact", head: true });

    return NextResponse.json({
      users: {
        total: totalUsers.count ?? 0,
        completed: completedUsers.count ?? 0,
        recentWeek: recentUsers.count ?? 0,
      },
      bills: {
        total: totalBills.count ?? 0,
        paid: paidBills.count ?? 0,
        overdue: actionBills.count ?? 0,
        totalOutstandingEur: (totalOutstandingCents / 100).toFixed(2),
        stages: stageCounts,
      },
      moods: moodCounts,
      contacts: contactRes.count ?? 0,
      applications: appRes.count ?? 0,
    });
  } catch (error) {
    console.error("Admin stats exception:", error);
    return NextResponse.json({
      users: { total: 0, completed: 0, recentWeek: 0 },
      bills: { total: 0, paid: 0, overdue: 0, totalOutstandingEur: "0.00", stages: {} },
      moods: {},
      contacts: 0,
      applications: 0,
      error: `Exception: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}
