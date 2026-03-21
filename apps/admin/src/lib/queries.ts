import { getAdminClient } from "./supabase";

/* ─── User Stats ─── */
export async function getUserStats() {
  const sb = getAdminClient();
  
  const [totalRes, completedRes, recentRes] = await Promise.all([
    sb.from("user_settings").select("id", { count: "exact", head: true }),
    sb.from("user_settings").select("id", { count: "exact", head: true }).eq("onboarding_complete", true),
    sb.from("user_settings").select("id", { count: "exact", head: true }).gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  return {
    total: totalRes.count ?? 0,
    completed: completedRes.count ?? 0,
    recentWeek: recentRes.count ?? 0,
  };
}

/* ─── Users List ─── */
export async function getUsers(search?: string, page = 0, limit = 20) {
  const sb = getAdminClient();
  let query = sb
    .from("user_settings")
    .select("id, display_name, language, onboarding_complete, created_at, updated_at")
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  if (search) {
    query = query.ilike("display_name", `%${search}%`);
  }

  const { data, error } = await query;
  return { users: data ?? [], error };
}

/* ─── Delete User (cascading) ─── */
export async function deleteUser(userId: string) {
  const sb = getAdminClient();

  // Delete in order: dependent tables first
  await sb.from("bills").delete().eq("user_id", userId);
  await sb.from("gmail_accounts").delete().eq("user_id", userId);
  await sb.from("push_subscriptions").delete().eq("user_id", userId);
  await sb.from("notification_log").delete().eq("user_id", userId);
  await sb.from("user_settings").delete().eq("id", userId);

  // Delete from Supabase Auth
  const { error } = await sb.auth.admin.deleteUser(userId);
  return { error };
}

/* ─── Bill Stats ─── */
export async function getBillStats() {
  const sb = getAdminClient();

  const [totalRes, paidRes, overdueRes] = await Promise.all([
    sb.from("bills").select("id", { count: "exact", head: true }),
    sb.from("bills").select("id", { count: "exact", head: true }).eq("status", "settled"),
    sb.from("bills").select("id", { count: "exact", head: true }).eq("status", "overdue"),
  ]);

  // Escalation stage distribution
  const { data: stageData } = await sb.rpc("get_escalation_distribution").select("*");

  // Total outstanding
  const { data: outstandingData } = await sb
    .from("bills")
    .select("amount_cents")
    .neq("status", "settled");

  const totalOutstandingCents = (outstandingData ?? []).reduce((sum, b) => sum + (b.amount_cents || 0), 0);

  return {
    total: totalRes.count ?? 0,
    paid: paidRes.count ?? 0,
    overdue: overdueRes.count ?? 0,
    totalOutstandingCents,
    stageDistribution: stageData ?? [],
  };
}

/* ─── Mood Stats ─── */
export async function getMoodStats() {
  const sb = getAdminClient();

  // This query works if you have a mood_log or mood tracking table
  // Adjust table/column names to match your actual schema
  const { data, error } = await sb
    .from("user_settings")
    .select("id, display_name, updated_at")
    .order("updated_at", { ascending: false })
    .limit(100);

  return { data: data ?? [], error };
}

/* ─── Contact Submissions ─── */
export async function getContactSubmissions(page = 0, limit = 20) {
  const sb = getAdminClient();

  const { data, error } = await sb
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  return { submissions: data ?? [], error };
}

/* ─── Dashboard Summary ─── */
export async function getDashboardSummary() {
  const [users, bills] = await Promise.all([
    getUserStats(),
    getBillStats(),
  ]);

  return { users, bills };
}
