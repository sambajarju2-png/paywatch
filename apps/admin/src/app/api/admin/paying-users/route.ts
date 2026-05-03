import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
function getAdmin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

const PRICES_MONTHLY_CENTS: Record<string, number> = {
  pro_monthly: 499, pro_yearly: 416,       // 49.90/12
  premium_monthly: 999, premium_yearly: 833, // 99.90/12
};

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin.isAdmin) return admin.response;
  const supabase = getAdmin();

  // Get all users with paid plans
  const { data: paid } = await supabase
    .from("user_settings")
    .select("user_id, plan, voice_seconds_used, voice_seconds_reset_at, first_name, last_name, display_name, created_at, last_active_at")
    .not("plan", "eq", "gratis")
    .not("plan", "is", null)
    .order("created_at", { ascending: false });

  if (!paid || paid.length === 0) {
    return NextResponse.json({ users: [], mrr: 0, totalPaying: 0 });
  }

  // Get emails
  const { data: auth } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  const emailMap: Record<string, string> = {};
  for (const u of auth?.users || []) emailMap[u.id] = u.email || "";

  // Get subscription records if any
  const userIds = paid.map(u => u.user_id);
  const { data: subs } = await supabase
    .from("paywatch_subscriptions")
    .select("*")
    .in("user_id", userIds);
  const subMap: Record<string, typeof subs extends null ? never : typeof subs[0]> = {};
  for (const s of subs || []) subMap[s.user_id] = s;

  const users = paid.map(u => {
    const sub = subMap[u.user_id];
    const name = u.display_name || [u.first_name, u.last_name].filter(Boolean).join(" ") || "—";
    const mrr = PRICES_MONTHLY_CENTS[u.plan] || 0;
    return {
      user_id: u.user_id,
      name,
      email: emailMap[u.user_id] || "",
      plan: u.plan,
      voice_seconds_used: u.voice_seconds_used || 0,
      voice_seconds_reset_at: u.voice_seconds_reset_at,
      last_active_at: u.last_active_at,
      created_at: u.created_at,
      payment_provider: sub?.payment_provider || "manual",
      sub_status: sub?.sub_status || "active",
      period_end: sub?.period_end || null,
      cancel_at_end: sub?.cancel_at_end || false,
      mrr_cents: mrr,
    };
  });

  const mrr = users.reduce((s, u) => s + u.mrr_cents, 0);

  return NextResponse.json({ users, mrr, totalPaying: users.length });
}

// Manually set a subscription record (until Stripe/RevenueCat webhooks are wired)
export async function POST(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin.isAdmin) return admin.response;

  const body = await req.json();
  const { user_id, plan_id, payment_provider, sub_status, notes } = body;
  if (!user_id || !plan_id) return NextResponse.json({ error: "user_id and plan_id required" }, { status: 400 });

  const supabase = getAdmin();

  // Update user_settings.plan
  await supabase.from("user_settings").update({ plan: plan_id }).eq("user_id", user_id);

  // Upsert subscription record
  await supabase.from("paywatch_subscriptions").upsert({
    user_id,
    plan_id,
    payment_provider: payment_provider || "manual",
    sub_status: sub_status || "active",
    notes: notes || null,
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id,payment_provider" });

  return NextResponse.json({ ok: true });
}
