import { getTenant } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import PageShell from "@/components/PageShell";
import MemberInviteForm from "./MemberInviteForm";

const ROLE_CONFIG: Record<string, { label: string; desc: string; variant: string }> = {
  owner: { label: "Eigenaar", desc: "Volledige toegang", variant: "bg-pw-navy text-white" },
  admin: { label: "Admin", desc: "Beheer gebruikers en instellingen", variant: "bg-blue-50 text-pw-blue" },
  coach: { label: "Coach", desc: "Clienten begeleiden", variant: "bg-green-50 text-pw-green" },
  viewer: { label: "Viewer", desc: "Alleen bekijken", variant: "bg-pw-bg text-pw-muted" },
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  accepted: { label: "Actief", color: "text-pw-green" },
  pending: { label: "Uitgenodigd", color: "text-pw-amber" },
};

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

  return (
    <PageShell tenant={tenant} userEmail={user.email || ""}>
      <div style={{ padding: "32px 40px", maxWidth: 900 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[22px] font-extrabold text-pw-navy tracking-tight">Teamleden</h1>
            <p className="text-sm text-pw-muted mt-1">{members?.length || 0} leden</p>
          </div>
        </div>

        <MemberInviteForm orgId={tenant.orgId} tenantColor={tenant.primaryColor} />

        <div className="bg-white border border-pw-border rounded-2xl overflow-hidden">
          {(!members || members.length === 0) ? (
            <div className="p-12 text-center text-sm text-pw-muted">Nog geen teamleden</div>
          ) : members.map((m: any, i: number) => {
            const role = ROLE_CONFIG[m.role] || ROLE_CONFIG.viewer;
            const status = STATUS_CONFIG[m.invite_status] || STATUS_CONFIG.pending;
            return (
              <div key={m.id} className={`px-5 py-4 flex items-center justify-between ${i < members.length - 1 ? "border-b border-pw-border" : ""} hover:bg-pw-bg/30 transition-colors`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pw-navy text-white flex items-center justify-center text-xs font-bold">
                    {(m.invite_email || "?").substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-pw-navy">{m.invite_email || "Onbekend"}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${status.color === "text-pw-green" ? "bg-pw-green" : "bg-pw-amber"}`} />
                      <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
                      <span className="text-[10px] text-pw-muted">&middot; Sinds {new Date(m.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded ${role.variant}`}>{role.label}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Role explanation */}
        <div className="mt-6 bg-white border border-pw-border rounded-2xl p-6">
          <h2 className="text-base font-bold text-pw-navy mb-3">Rollen</h2>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(ROLE_CONFIG).map(([key, config]) => (
              <div key={key} className="flex items-center gap-3 p-3 bg-pw-bg rounded-xl">
                <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded ${config.variant}`}>{config.label}</span>
                <span className="text-xs text-pw-muted">{config.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
