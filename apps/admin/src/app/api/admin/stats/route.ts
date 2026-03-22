import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key);
}

export async function GET() {
  try {
    const supabase = getAdmin();

    // ── Users ────────────────────────────────────────────
    const { count: userCount } = await supabase
      .from("user_settings")
      .select("*", { count: "exact", head: true });

    const { data: recentUsers } = await supabase
      .from("user_settings")
      .select("display_name, first_name, last_name, onboarding_complete, created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    // Get bill counts per user for recent users
    const usersWithBills = await Promise.all(
      (recentUsers || []).map(async (u) => {
        // We need user_id to count bills — get it from created_at match
        return { ...u, bill_count: 0 };
      })
    );

    // ── Bills ────────────────────────────────────────────
    const { data: allBills } = await supabase
      .from("bills")
      .select("amount, status, escalation_stage, source, category, due_date, paid_at");

    const bills = allBills || [];
    const totalBills = bills.length;
    const paidBills = bills.filter((b) => b.status === "settled");
    const outstandingBills = bills.filter(
      (b) => b.status !== "settled" && b.status !== "failed"
    );
    const overdueBills = outstandingBills.filter(
      (b) => b.due_date && new Date(b.due_date + "T00:00:00") < new Date()
    );

    const totalPaidCents = paidBills.reduce((sum, b) => sum + (b.amount || 0), 0);
    const totalOutstandingCents = outstandingBills.reduce(
      (sum, b) => sum + (b.amount || 0),
      0
    );

    // ── Escalation breakdown ─────────────────────────────
    const escalationMap: Record<string, number> = {};
    for (const b of bills) {
      if (b.escalation_stage) {
        escalationMap[b.escalation_stage] =
          (escalationMap[b.escalation_stage] || 0) + 1;
      }
    }
    const escalationOrder = [
      "factuur",
      "herinnering",
      "aanmaning",
      "incasso",
      "deurwaarder",
    ];
    const escalation = escalationOrder
      .filter((s) => escalationMap[s])
      .map((s) => ({ stage: s, count: escalationMap[s] }));

    // ── Sources breakdown ────────────────────────────────
    const sourceMap: Record<string, number> = {};
    for (const b of bills) {
      if (b.source) {
        sourceMap[b.source] = (sourceMap[b.source] || 0) + 1;
      }
    }
    const sources = Object.entries(sourceMap)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);

    // ── Categories breakdown ─────────────────────────────
    const catMap: Record<string, number> = {};
    for (const b of bills) {
      if (b.category) {
        catMap[b.category] = (catMap[b.category] || 0) + 1;
      }
    }
    const categories = Object.entries(catMap)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    // ── Contacts ─────────────────────────────────────────
    const { count: contactsTotal } = await supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true });

    const { count: contactsNew } = await supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true })
      .eq("status", "new");

    // ── Applications ─────────────────────────────────────
    const { count: appsTotal } = await supabase
      .from("job_applications")
      .select("*", { count: "exact", head: true });

    const { count: appsNew } = await supabase
      .from("job_applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "new");

    return NextResponse.json({
      users: {
        total: userCount || 0,
        recent: usersWithBills,
      },
      bills: {
        total: totalBills,
        totalPaidCents,
        totalOutstandingCents,
        paid: paidBills.length,
        outstanding: outstandingBills.length,
        overdue: overdueBills.length,
      },
      escalation,
      sources,
      categories,
      contacts: { total: contactsTotal || 0, new: contactsNew || 0 },
      applications: { total: appsTotal || 0, new: appsNew || 0 },
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
