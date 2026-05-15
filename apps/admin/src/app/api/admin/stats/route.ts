import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

function getAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key);
}

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin.isAdmin) return admin.response;

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

    const usersWithBills = await Promise.all(
      (recentUsers || []).map(async (u) => {
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

    // ── Digest subscriptions ─────────────────────────────
    const { data: digestUsers } = await supabase
      .from("user_settings")
      .select("user_id, display_name, first_name, last_name, notify_email_digest, created_at")
      .order("created_at", { ascending: false });

    const allDigest = digestUsers || [];
    const unsubscribed = allDigest.filter((u) => u.notify_email_digest === false);
    const subscribed = allDigest.filter((u) => u.notify_email_digest !== false);

    // ── Unsubscribe feedback ─────────────────────────────
    const { data: unsubFeedback } = await supabase
      .from("user_feedback")
      .select("user_id, message, created_at")
      .eq("type", "unsubscribe")
      .order("created_at", { ascending: false })
      .limit(20);

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
      digest: {
        subscribed: subscribed.length,
        unsubscribed: unsubscribed.length,
        unsubscribedUsers: unsubscribed.map((u) => ({
          user_id: u.user_id,
          name: `Gebruiker #${u.user_id.slice(0, 6).toUpperCase()}`,
        })),
        feedback: (unsubFeedback || []).map((f) => ({
          user_id: f.user_id,
          message: f.message,
          date: f.created_at,
        })),
      },
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
