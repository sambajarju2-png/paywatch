import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function getAdmin() {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function GET() {
  try {
    const supabase = getAdmin();
    const { data, error } = await supabase
      .from("user_settings")
      .select("user_id, display_name, first_name, last_name, language, gemeente, onboarding_complete, created_at")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ users: data || [] });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    const supabase = getAdmin();

    /* Cascade delete from all 17 tables */
    const tables = [
      "ai_usage_log", "user_achievements", "user_feedback", "mood_log",
      "mood_analytics", "notification_log", "push_subscriptions", "scan_processed",
      "bills", "gmail_accounts", "recurring_patterns", "vendor_directory",
      "rate_limits", "consent_log", "custom_categories", "referrals", "user_settings",
    ];

    const errors: string[] = [];
    for (const table of tables) {
      const { error } = await supabase.from(table).delete().eq("user_id", userId);
      if (error && !error.message.includes("does not exist")) {
        errors.push(`${table}: ${error.message}`);
      }
    }

    /* Delete auth user */
    const { error: authErr } = await supabase.auth.admin.deleteUser(userId);
    if (authErr) errors.push(`auth: ${authErr.message}`);

    if (errors.length > 0) {
      return NextResponse.json({ success: true, warnings: errors });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
