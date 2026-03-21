import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("search") || "";
  const page = parseInt(request.nextUrl.searchParams.get("page") || "0");
  const sb = getAdminClient();

  let query = sb
    .from("user_settings")
    .select("id, display_name, language, onboarding_complete, created_at, updated_at")
    .order("created_at", { ascending: false })
    .range(page * 20, (page + 1) * 20 - 1);

  if (search) query = query.ilike("display_name", `%${search}%`);

  const { data, error } = await query;
  return NextResponse.json({ users: data ?? [], error: error?.message });
}

export async function DELETE(request: NextRequest) {
  const { userId } = await request.json();
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const sb = getAdminClient();

  // Cascade delete dependent data
  await sb.from("bills").delete().eq("user_id", userId);
  await sb.from("gmail_accounts").delete().eq("user_id", userId);
  await sb.from("push_subscriptions").delete().eq("user_id", userId);
  await sb.from("notification_log").delete().eq("user_id", userId);
  await sb.from("user_settings").delete().eq("id", userId);

  const { error } = await sb.auth.admin.deleteUser(userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
