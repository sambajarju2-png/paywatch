import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Cascading delete: bills, mood_log, then user_settings, then auth user
  const tables = [
    "ai_usage_log",
    "user_achievements",
    "user_feedback",
    "notification_log",
    "push_subscriptions",
    "scan_processed",
    "mood_log",
    "bills",
    "gmail_accounts",
    "user_settings",
  ];

  for (const table of tables) {
    await supabase.from(table).delete().eq("user_id", userId);
  }

  // Delete auth user
  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
