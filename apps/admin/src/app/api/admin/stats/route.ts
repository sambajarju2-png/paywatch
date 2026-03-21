import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";

export async function GET() {
  try {
    const sb = getAdminClient();

    /* User stats — user_settings uses user_id as PK */
    const [totalUsers, completedUsers, recentUsers] = await Promise.all([
      sb.from("user_settings").select("user_id", { count: "exact", head: true }),
      sb.from("user_settings").select("user_id", { count: "exact", head: true }).eq("onboarding_complete", true),
      sb.from("user_settings").select("user_id", { count: "exact", head: true }).gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString()),
    ]);

    /* Bill stats — uses 'vendor', 'amount', status: outstanding/action/settled/failed/review */
    const [totalBills, paidBills, actionBills] = await Promise.all([
      sb.from("bills").select("id", { count: "exact", head: true }),
      sb.from("bills").select("id", { count: "exact", head: true }).eq("status", "settled"),
      sb.from("bills").select("id", { count: "exact", head: true }).in("status", ["action", "failed"]),
    ]);

    /* Outstanding amount — 'amount' column (cents) */
    const { data: outstandingData } = await sb.from("bills").select("amount").neq("status", "settled");
    const totalOutstandingCents = (outstandingData ?? []).reduce((sum: number, b: { amount: number }) => sum + (b.amount || 0), 0);

    /* Escalation stages */
    const { data: stageData } = await sb.from("bills").select("escalation_stage").neq("status", "settled");
    const stageCounts: Record<string, number> = {};
    (stageData ?? []).forEach((b: { escalation_stage: string | null }) => {
      const s = b.escalation_stage || "factuur";
      stageCounts[s] = (stageCounts[s] || 0) + 1;
    });

    /* Mood stats */
    const { data: moodData } = await sb.from("mood_log").select("mood").order("created_at", { ascending: false }).limit(100);
    const moodCounts: Record<string, number> = {};
    (moodData ?? []).forEach((m: { mood: string }) => {
      moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
    });

    /* Contact submissions count */
    const contactRes = await sb.from("contact_submissions").select("id", { count: "exact", head: true });

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
    });
  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json({
      users: { total: 0, completed: 0, recentWeek: 0 },
      bills: { total: 0, paid: 0, overdue: 0, totalOutstandingEur: "0.00", stages: {} },
      moods: {},
      contacts: 0,
      error: "Failed to fetch stats. Check Supabase env vars (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY).",
    });
  }
}
