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

  // Parallel: users + their settings + their highest escalation stage
  const [usersResult, settingsResult] = await Promise.all([
    supabase.from("user_organizations")
      .select("id, user_id, status, external_id, onboarded_at, created_at")
      .eq("organization_id", tenant.orgId)
      .order("created_at", { ascending: false }),
    supabase.from("user_settings")
      .select("user_id, display_name, first_name, last_name, gemeente, last_active_at"),
  ]);

  const userOrgs = usersResult.data || [];
  const settings = settingsResult.data || [];
  const settingsMap = new Map(settings.map((s: any) => [s.user_id, s]));

  // Get escalation stages per user
  const userIds = userOrgs.map((u: any) => u.user_id);
  let escalationMap = new Map<string, string>();
  if (userIds.length > 0) {
    const { data: bills } = await supabase
      .from("bills")
      .select("user_id, escalation_stage")
      .in("user_id", userIds)
      .neq("status", "settled");

    // Get the highest escalation stage per user
    const stageOrder = ["factuur", "herinnering", "aanmaning", "incasso", "deurwaarder"];
    (bills || []).forEach((b: any) => {
      const current = escalationMap.get(b.user_id);
      const currentIdx = current ? stageOrder.indexOf(current) : -1;
      const newIdx = stageOrder.indexOf(b.escalation_stage);
      if (newIdx > currentIdx) escalationMap.set(b.user_id, b.escalation_stage);
    });
  }

  const users = userOrgs.map((uo: any) => {
    const s = settingsMap.get(uo.user_id);
    const name = s?.display_name || [s?.first_name, s?.last_name].filter(Boolean).join(" ") || "";
    return {
      id: uo.id,
      name,
      email: name || uo.user_id.substring(0, 8),
      status: uo.status,
      external_id: uo.external_id || "",
      onboarded_at: uo.onboarded_at,
      last_active: s?.last_active_at || null,
      escalation_stage: escalationMap.get(uo.user_id) || null,
      gemeente: s?.gemeente || null,
    };
  });

  return (
    <PageShell tenant={tenant} userEmail={user.email || ""}>
      <UsersClient users={users} />
    </PageShell>
  );
}
