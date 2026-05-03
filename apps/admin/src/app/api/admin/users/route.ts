import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin.isAdmin) return admin.response;

  try {
    const supabase = getAdmin();

    const [usersRes, billCountsRes, authRes] = await Promise.all([
      supabase
        .from("user_settings")
        .select("user_id, display_name, first_name, last_name, language, onboarding_complete, gemeente, dark_mode, created_at, last_active_at, plan, voice_seconds_used")
        .order("created_at", { ascending: false }),
      // Count bills per user (detect bots = 0 bills)
      supabase.from("bills").select("user_id").limit(10000),
      supabase.auth.admin.listUsers({ perPage: 1000 }),
    ]);

    const billCounts: Record<string, number> = {};
    (billCountsRes.data || []).forEach((b: any) => {
      billCounts[b.user_id] = (billCounts[b.user_id] || 0) + 1;
    });

    const emailMap: Record<string, string> = {};
    (authRes.data?.users || []).forEach((u: any) => {
      emailMap[u.id] = u.email || "";
    });

    const users = (usersRes.data || []).map((u: any) => ({
      ...u,
      email: emailMap[u.user_id] || "",
      bill_count: billCounts[u.user_id] || 0,
      // Bot heuristic: no name, onboarding incomplete, no bills, older than 7 days
      likely_bot:
        !u.display_name && !u.first_name && !u.last_name &&
        !u.onboarding_complete &&
        (billCounts[u.user_id] || 0) === 0 &&
        new Date(u.created_at) < new Date(Date.now() - 7 * 86400000),
    }));

    return NextResponse.json({ users });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin.isAdmin) return admin.response;

  // Single delete: ?userId=xxx
  const singleId = request.nextUrl.searchParams.get("userId");
  let userIds: string[] = [];

  if (singleId) {
    userIds = [singleId];
  } else {
    // Bulk delete: JSON body { userIds: string[] }
    try {
      const body = await request.json();
      userIds = body.userIds || [];
    } catch {
      return NextResponse.json({ error: "Missing userId or userIds" }, { status: 400 });
    }
  }

  if (userIds.length === 0) return NextResponse.json({ error: "No users specified" }, { status: 400 });
  if (userIds.includes(admin.userId!)) {
    return NextResponse.json({ error: "Cannot delete own account" }, { status: 400 });
  }

  const supabase = getAdmin();
  const tables = [
    "ai_usage_log", "user_achievements", "user_feedback", "mood_log",
    "mood_analytics", "notification_log", "push_subscriptions", "scan_processed",
    "bills", "gmail_accounts", "recurring_patterns", "vendor_directory",
    "rate_limits", "consent_log", "custom_categories", "referrals",
    "user_finances", "user_expenses", "user_settings",
  ];

  let deleted = 0;
  let errors = 0;

  for (const userId of userIds) {
    try {
      for (const table of tables) {
        await supabase.from(table).delete().eq("user_id", userId);
      }
      await supabase.auth.admin.deleteUser(userId);
      deleted++;
    } catch (err) {
      console.error(`[Admin] Failed to delete ${userId}:`, err);
      errors++;
    }
  }

  console.log(`[Admin] Bulk delete: ${deleted} deleted, ${errors} errors — by ${admin.email}`);
  return NextResponse.json({ ok: true, deleted, errors });
}

export async function PATCH(request: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin.isAdmin) return admin.response;

  try {
    const { userId, plan } = await request.json();
    if (!userId || !plan) return NextResponse.json({ error: "userId and plan required" }, { status: 400 });
    const valid = ["gratis", "pro_monthly", "pro_yearly", "premium_monthly", "premium_yearly"];
    if (!valid.includes(plan)) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

    const supabase = getAdmin();
    const { error } = await supabase
      .from("user_settings")
      .update({ plan })
      .eq("user_id", userId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Admin PATCH user]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
