import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    /* Users */
    const { data: users } = await supabase.from("user_settings").select("user_id, display_name, first_name, last_name, gemeente, onboarding_complete, created_at").order("created_at", { ascending: false });
    const totalUsers = users?.length || 0;
    const recentUsers = (users || []).slice(0, 5);

    /* Bills */
    const { data: bills } = await supabase.from("bills").select("id, amount, status, escalation_stage, source, category, due_date, paid_at");
    const totalBills = bills?.length || 0;
    const paidBills = bills?.filter((b) => b.status === "settled").length || 0;
    const outstandingBills = bills?.filter((b) => b.status === "outstanding" || b.status === "action").length || 0;
    const totalAmountCents = bills?.reduce((s, b) => s + (b.amount || 0), 0) || 0;
    const paidAmountCents = bills?.filter((b) => b.status === "settled").reduce((s, b) => s + (b.amount || 0), 0) || 0;

    /* Overdue: outstanding + due_date in past */
    const now = new Date().toISOString().split("T")[0];
    const overdueCount = bills?.filter((b) => (b.status === "outstanding" || b.status === "action") && b.due_date && b.due_date < now).length || 0;

    /* Escalation pipeline */
    const escalation: Record<string, number> = {};
    for (const b of bills || []) {
      const stage = b.escalation_stage || "factuur";
      escalation[stage] = (escalation[stage] || 0) + 1;
    }

    /* Sources */
    const sources: Record<string, number> = {};
    for (const b of bills || []) {
      const src = b.source || "manual";
      sources[src] = (sources[src] || 0) + 1;
    }

    /* Categories */
    const categories: Record<string, number> = {};
    for (const b of bills || []) {
      const cat = b.category || "Overig";
      categories[cat] = (categories[cat] || 0) + 1;
    }

    /* Contacts / Applications counts */
    const { count: newContacts } = await supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("status", "new");
    const { count: newApplications } = await supabase.from("job_applications").select("id", { count: "exact", head: true }).eq("status", "new");

    return NextResponse.json({
      totalUsers,
      totalBills,
      paidBills,
      outstandingBills,
      totalAmountCents,
      paidAmountCents,
      overdueCount,
      escalation,
      sources,
      categories,
      recentUsers,
      newContacts: newContacts || 0,
      newApplications: newApplications || 0,
    });
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
