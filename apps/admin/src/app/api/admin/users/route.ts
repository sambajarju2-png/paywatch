import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("search") || "";
  const sb = getAdminClient();

  let query = sb
    .from("user_settings")
    .select("user_id, display_name, first_name, last_name, language, onboarding_complete, gemeente, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (search) {
    query = query.or(`display_name.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
  }

  const { data, error } = await query;
  return NextResponse.json({ users: data ?? [], error: error?.message });
}

export async function DELETE(request: NextRequest) {
  const { userId } = await request.json();
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const sb = getAdminClient();

  // Cascade delete in correct order
  await sb.from("ai_usage_log").delete().eq("user_id", userId);
  await sb.from("user_achievements").delete().eq("user_id", userId);
  await sb.from("user_feedback").delete().eq("user_id", userId);
  await sb.from("mood_log").delete().eq("user_id", userId);
  await sb.from("mood_analytics").delete().eq("user_id", userId);
  await sb.from("notification_log").delete().eq("user_id", userId);
  await sb.from("push_subscriptions").delete().eq("user_id", userId);
  await sb.from("scan_processed").delete().eq("user_id", userId);
  await sb.from("bills").delete().eq("user_id", userId);
  await sb.from("gmail_accounts").delete().eq("user_id", userId);
  await sb.from("recurring_patterns").delete().eq("user_id", userId);
  await sb.from("vendor_directory").delete().eq("user_id", userId);
  await sb.from("rate_limits").delete().eq("user_id", userId);
  await sb.from("consent_log").delete().eq("user_id", userId);
  await sb.from("custom_categories").delete().eq("user_id", userId);
  await sb.from("referrals").delete().eq("referrer_id", userId);
  await sb.from("user_settings").delete().eq("user_id", userId);

  // Delete auth user
  const { error } = await sb.auth.admin.deleteUser(userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
