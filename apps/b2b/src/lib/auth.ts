import { createSupabaseServer } from "./supabase-server";
import { getTenant } from "./tenant";

export async function getAuthUser() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function requireAuth() {
  const user = await getAuthUser();
  if (!user) throw new Error("Not authenticated");
  return user;
}

export async function requireOrgAccess() {
  const [user, tenant] = await Promise.all([getAuthUser(), getTenant()]);
  if (!user) throw new Error("Not authenticated");
  if (!tenant.orgId && tenant.mode !== "super-admin") throw new Error("No organization context");
  return { user, tenant };
}
