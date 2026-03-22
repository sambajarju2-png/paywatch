import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET() {
  try {
    const supabase = getAdmin();
    const { data: users } = await supabase
      .from("user_settings")
      .select("user_id, display_name, first_name, last_name, language, onboarding_complete, gemeente, dark_mode, created_at")
      .order("created_at", { ascending: false });

    return NextResponse.json({ users: users || [] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  try {
    const supabase = getAdmin();

    // Cascade delete in order (17 tables)
    const tables = [
      "ai_usage_log", "user_achievements", "user_feedback", "mood_log",
      "mood_analytics", "notification_log", "push_subscriptions", "scan_processed",
      "bills", "gmail_accounts", "recurring_patterns", "vendor_directory",
      "rate_limits", "consent_log", "custom_categories", "referrals", "user_settings",
    ];

    for (const table of tables) {
      await supabase.from(table).delete().eq("user_id", userId);
    }

    // Delete auth user
    await supabase.auth.admin.deleteUser(userId);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
