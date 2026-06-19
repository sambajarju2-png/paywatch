import { getTenant } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import PageShell from "@/components/PageShell";
import CommunityClient from "./CommunityClient";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const [tenant, user] = await Promise.all([getTenant(), getAuthUser()]);
  if (!user) redirect("/login");
  if (!tenant.orgId) redirect("/");

  const supabase = createSupabaseAdmin();

  const [groupsRes, uoRes, settingsRes] = await Promise.all([
    supabase
      .from("community_groups")
      .select("id, name, description, is_default, created_at")
      .eq("organization_id", tenant.orgId)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: true }),
    supabase
      .from("user_organizations")
      .select("id, user_id, status")
      .eq("organization_id", tenant.orgId)
      .neq("status", "exited"),
    supabase.from("user_settings").select("user_id, display_name, first_name, last_name"),
  ]);

  const groups = groupsRes.data || [];
  const groupIds = groups.map((g: { id: string }) => g.id);
  const { data: memberRows } = groupIds.length
    ? await supabase.from("community_group_members").select("group_id, user_id").in("group_id", groupIds)
    : { data: [] as { group_id: string; user_id: string }[] };

  const counts: Record<string, number> = {};
  for (const m of (memberRows || []) as { group_id: string }[]) {
    counts[m.group_id] = (counts[m.group_id] || 0) + 1;
  }

  const settingsMap = new Map((settingsRes.data || []).map((s: { user_id: string }) => [s.user_id, s]));
  const users = (uoRes.data || []).map((uo: { id: string; user_id: string }) => {
    const s = settingsMap.get(uo.user_id) as { display_name?: string; first_name?: string; last_name?: string } | undefined;
    const name =
      s?.display_name || [s?.first_name, s?.last_name].filter(Boolean).join(" ") || "Gebruiker";
    return { user_org_id: uo.id, name };
  });

  const initialGroups = groups.map((g: { id: string; name: string; description: string | null; is_default: boolean }) => ({
    id: g.id,
    name: g.name,
    description: g.description,
    is_default: g.is_default,
    member_count: counts[g.id] || 0,
  }));

  return (
    <PageShell tenant={tenant} userEmail={user.email || ""}>
      <CommunityClient initialGroups={initialGroups} users={users} primaryColor={tenant.primaryColor} />
    </PageShell>
  );
}
