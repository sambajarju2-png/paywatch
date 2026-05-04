import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
function getAdmin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin.isAdmin) return admin.response;
  const supabase = getAdmin();

  const [rulesRes, statsRes] = await Promise.all([
    supabase.from("plan_rules").select("*").order("id"),
    supabase.from("user_settings").select("plan").not("plan", "is", null),
  ]);

  const planCounts: Record<string, number> = {};
  for (const u of (statsRes.data || [])) {
    planCounts[u.plan] = (planCounts[u.plan] || 0) + 1;
  }

  // Revenue estimate — actual Stripe prices
  const PRICES: Record<string, number> = {
    pro_monthly: 400, pro_yearly: Math.round(4000/12),
    premium_monthly: 800, premium_yearly: Math.round(8000/12),
  };
  const revenue = Object.entries(planCounts).reduce((sum, [plan, count]) => {
    return sum + (PRICES[plan] || 0) * count;
  }, 0);

  return NextResponse.json({ rules: rulesRes.data || [], planCounts, revenue });
}

export async function PATCH(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin.isAdmin) return admin.response;

  const body = await req.json();
  const { plan_id, ...fields } = body;
  if (!plan_id) return NextResponse.json({ error: "plan_id required" }, { status: 400 });

  const allowed = [
    "voice_seconds_per_month", "chat_messages_per_day", "dispute_letters_per_month",
    "ai_insights_enabled", "ai_chat_enabled", "dispute_letters_enabled",
    "bank_sync_enabled", "export_reports_enabled",
    "enforce_voice_limits", "enforce_chat_limits",
  ];
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const k of allowed) {
    if (k in fields) update[k] = fields[k];
  }

  const supabase = getAdmin();
  const { error } = await supabase.from("plan_rules").update(update).eq("plan_id", plan_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
