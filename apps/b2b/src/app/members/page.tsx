import { getTenant } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import PageShell from "@/components/PageShell";
import MemberInviteForm from "./MemberInviteForm";

export default async function MembersPage() {
  const [tenant, user] = await Promise.all([getTenant(), getAuthUser()]);
  if (!user) redirect("/login");
  if (!tenant.orgId) redirect("/");

  const supabase = createSupabaseAdmin();
  const { data: members } = await supabase
    .from("organization_members")
    .select("id, role, invite_email, invite_status, created_at, user_id, permissions")
    .eq("organization_id", tenant.orgId)
    .order("created_at");

  const roleLabels: Record<string, string> = { owner: "Eigenaar", admin: "Admin", viewer: "Viewer", coach: "Coach" };

  return (
    <PageShell tenant={tenant} userEmail={user.email || ""}>
      <div style={{ padding: "32px 40px", maxWidth: 900 }}>
        <h1 className="text-page-heading text-pw-text mb-2">Teamleden</h1>
        <p className="text-label text-pw-muted mb-6">{members?.length || 0} leden</p>

        <MemberInviteForm orgId={tenant.orgId} tenantColor={tenant.primaryColor} />

        <div className="bg-pw-surface border border-pw-border rounded-card overflow-hidden">
          {(!members || members.length === 0) ? (
            <div className="p-12 text-center text-pw-muted text-label">Nog geen teamleden</div>
          ) : (
            members.map((m: any) => (
              <div key={m.id} className="px-5 py-3 border-b border-pw-border/50 flex items-center justify-between text-label">
                <div>
                  <div className="font-medium text-pw-text">{m.invite_email || "Onbekend"}</div>
                  <div className="text-caption text-pw-muted">{m.invite_status}</div>
                </div>
                <span className="px-2.5 py-1 bg-pw-bg text-pw-muted text-tiny font-semibold rounded-badge">{roleLabels[m.role] || m.role}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </PageShell>
  );
}
