import { getTenant } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import PageShell from "@/components/PageShell";
import AuditLogClient from "./AuditLogClient";

export default async function AuditLogPage() {
  const [tenant, user] = await Promise.all([getTenant(), getAuthUser()]);
  if (!user) redirect("/login");
  if (!tenant.orgId) redirect("/");

  const supabase = createSupabaseAdmin();

  const { data: logs } = await supabase
    .from("b2b_audit_log")
    .select("id, actor_id, actor_type, action, target_type, target_id, metadata, created_at")
    .eq("organization_id", tenant.orgId)
    .order("created_at", { ascending: false })
    .limit(200);

  // Get actor emails
  const actorIds = [...new Set((logs || []).filter((l: any) => l.actor_id).map((l: any) => l.actor_id))];
  let actorEmails: Record<string, string> = {};
  if (actorIds.length > 0) {
    const { data: members } = await supabase
      .from("organization_members")
      .select("user_id, invite_email")
      .eq("organization_id", tenant.orgId)
      .in("user_id", actorIds);
    if (members) members.forEach((m: any) => { actorEmails[m.user_id] = m.invite_email; });
  }

  const enriched = (logs || []).map((l: any) => ({
    ...l,
    actorEmail: actorEmails[l.actor_id] || null,
  }));

  return (
    <PageShell tenant={tenant} userEmail={user.email || ""}>
      <AuditLogClient logs={enriched} />
    </PageShell>
  );
}
