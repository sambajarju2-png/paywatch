import { getTenant } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import PageShell from "@/components/PageShell";
import RightsClient from "./RightsClient";

export default async function MembersPage() {
  const [tenant, user] = await Promise.all([getTenant(), getAuthUser()]);
  if (!user) redirect("/login");
  if (!tenant.orgId) redirect("/");

  const supabase = createSupabaseAdmin();
  const { data: members } = await supabase
    .from("organization_members")
    .select("id, role, invite_email, full_name, invite_status, created_at, user_id, permissions")
    .eq("organization_id", tenant.orgId)
    .order("created_at");

  return (
    <PageShell tenant={tenant} userEmail={user.email || ""}>
      <RightsClient
        members={members || []}
        orgId={tenant.orgId}
        currentUserEmail={user.email || ""}
        tenantColor={tenant.primaryColor}
        canManage={["owner", "admin", "super_admin"].includes(tenant.memberRole || "")}
      />
    </PageShell>
  );
}
