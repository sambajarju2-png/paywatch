import { getTenant } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import PageShell from "@/components/PageShell";
import UsersClient from "./UsersClient";

export default async function UsersPage() {
  const [tenant, user] = await Promise.all([getTenant(), getAuthUser()]);
  if (!user) redirect("/login");
  if (!tenant.orgId) redirect("/");

  const supabase = createSupabaseAdmin();

  const [usersResult, settingsResult, buddiesResult, membersResult, authUsersResult, groupsResult] = await Promise.all([
    supabase.from("user_organizations").select("id, user_id, status, external_id, onboarded_at").eq("organization_id", tenant.orgId).neq("status", "exited").order("created_at", { ascending: false }),
    supabase.from("user_settings").select("user_id, display_name, first_name, last_name, gemeente, last_active_at"),
    supabase.from("b2b_buddies").select("user_id, buddy_member_id").eq("organization_id", tenant.orgId).eq("status", "active"),
    supabase.from("organization_members").select("id, invite_email").eq("organization_id", tenant.orgId),
    supabase.auth.admin.listUsers({ perPage: 1000 }),
    supabase.from("community_groups").select("id, name, is_default").eq("organization_id", tenant.orgId).order("is_default", { ascending: false }).order("created_at", { ascending: true }),
  ]);

  const userOrgs = usersResult.data || [];
  const settings = settingsResult.data || [];
  const buddies = buddiesResult.data || [];
  const members = membersResult.data || [];
  const authUsers = authUsersResult.data?.users || [];
  const groups = (groupsResult.data || []) as { id: string; name: string; is_default: boolean }[];

  // Map each user to the groups they already belong to (for chips + dedup on bulk-add).
  const groupIds = groups.map((g) => g.id);
  const { data: memberRows } = groupIds.length
    ? await supabase.from("community_group_members").select("group_id, user_id").in("group_id", groupIds)
    : { data: [] as { group_id: string; user_id: string }[] };
  const groupNameById = new Map(groups.map((g) => [g.id, g.name]));
  const userGroups = new Map<string, { id: string; name: string }[]>();
  for (const m of (memberRows || []) as { group_id: string; user_id: string }[]) {
    const arr = userGroups.get(m.user_id) || [];
    arr.push({ id: m.group_id, name: groupNameById.get(m.group_id) || "Groep" });
    userGroups.set(m.user_id, arr);
  }

  const settingsMap = new Map(settings.map((s: any) => [s.user_id, s]));
  const memberMap = new Map(members.map((m: any) => [m.id, m.invite_email]));
  const authMap = new Map(authUsers.map((u: any) => [u.id, u.email]));

  // Build coach lookup: user_id -> coach email
  const coachMap = new Map<string, string>();
  buddies.forEach((b: any) => {
    const coachEmail = memberMap.get(b.buddy_member_id) || null;
    if (coachEmail) coachMap.set(b.user_id, coachEmail);
  });

  const users = userOrgs.map((uo: any) => {
    const s = settingsMap.get(uo.user_id);
    const name = s?.display_name || [s?.first_name, s?.last_name].filter(Boolean).join(" ") || "";
    const email = authMap.get(uo.user_id) || "";
    return {
      id: uo.id,
      name,
      email,
      status: uo.status,
      external_id: uo.external_id || "",
      last_active: s?.last_active_at || null,
      coach_email: coachMap.get(uo.user_id) || null,
      gemeente: s?.gemeente || null,
      groups: userGroups.get(uo.user_id) || [],
    };
  });

  return (
    <PageShell tenant={tenant} userEmail={user.email || ""}>
      <UsersClient users={users} groups={groups} />
    </PageShell>
  );
}
