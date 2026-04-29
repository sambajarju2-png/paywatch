import { getTenant } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import PageShell from "@/components/PageShell";
import InviteForm from "./InviteForm";

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: "In afwachting", bg: "bg-pw-bg", text: "text-pw-muted" },
  opened: { label: "Geopend", bg: "bg-blue-50", text: "text-pw-blue" },
  activated: { label: "Geactiveerd", bg: "bg-green-50", text: "text-pw-green" },
  expired: { label: "Verlopen", bg: "bg-red-50", text: "text-pw-red" },
  revoked: { label: "Ingetrokken", bg: "bg-red-50", text: "text-pw-red" },
};

export default async function InvitesPage() {
  const [tenant, user] = await Promise.all([getTenant(), getAuthUser()]);
  if (!user) redirect("/login");
  if (!tenant.orgId) redirect("/");

  const supabase = createSupabaseAdmin();
  const { data: invites } = await supabase
    .from("b2b_invites")
    .select("id, email, external_id, token, status, invite_type, created_at, expires_at, activated_at, qr_code_url")
    .eq("organization_id", tenant.orgId)
    .order("created_at", { ascending: false })
    .limit(100);

  const all = invites || [];
  const counts = {
    total: all.length,
    pending: all.filter((i: any) => i.status === "pending").length,
    opened: all.filter((i: any) => i.status === "opened").length,
    activated: all.filter((i: any) => i.status === "activated").length,
    expired: all.filter((i: any) => i.status === "expired").length,
  };

  return (
    <PageShell tenant={tenant} userEmail={user.email || ""}>
      <div style={{ padding: "32px 40px", maxWidth: 1100 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[22px] font-extrabold text-pw-navy tracking-tight">Uitnodigingen</h1>
            <p className="text-sm text-pw-muted mt-1">Nodig gebruikers uit via e-mail of QR code</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            { label: "Totaal", value: counts.total, color: "text-pw-navy" },
            { label: "In afwachting", value: counts.pending + counts.opened, color: "text-pw-amber" },
            { label: "Geactiveerd", value: counts.activated, color: "text-pw-green" },
            { label: "Verlopen", value: counts.expired, color: "text-pw-red" },
          ].map(s => (
            <div key={s.label} className="bg-white border border-pw-border rounded-2xl p-4">
              <div className="text-xs font-semibold text-pw-muted mb-1">{s.label}</div>
              <div className={`text-[24px] font-extrabold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        <InviteForm orgId={tenant.orgId} tenantColor={tenant.primaryColor} />

        <div className="bg-white border border-pw-border rounded-2xl overflow-hidden">
          {all.length === 0 ? (
            <div className="p-12 text-center text-sm text-pw-muted">Nog geen uitnodigingen verstuurd</div>
          ) : (
            <table className="w-full">
              <thead className="bg-pw-bg border-b border-pw-border">
                <tr>
                  <th className="text-left py-3 px-5 text-[11px] font-bold text-pw-muted uppercase tracking-wider">Ontvanger</th>
                  <th className="text-left py-3 px-5 text-[11px] font-bold text-pw-muted uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-5 text-[11px] font-bold text-pw-muted uppercase tracking-wider">Link</th>
                  <th className="text-left py-3 px-5 text-[11px] font-bold text-pw-muted uppercase tracking-wider">Datum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pw-border">
                {all.map((inv: any) => {
                  const sc = STATUS_CONFIG[inv.status] || STATUS_CONFIG.pending;
                  const shortToken = inv.token?.substring(0, 8) || "";
                  return (
                    <tr key={inv.id} className="hover:bg-pw-bg/30 transition-colors group">
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pw-blue to-pw-purple text-white flex items-center justify-center text-xs font-bold">
                            {inv.email ? inv.email[0].toUpperCase() : "?"}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-pw-navy">{inv.email || "Geen e-mail"}</div>
                            {inv.external_id && <div className="text-[10px] text-pw-muted font-mono">Ref: {inv.external_id}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded ${sc.bg} ${sc.text}`}>{sc.label}</span>
                      </td>
                      <td className="py-3 px-5">
                        <code className="text-[11px] text-pw-muted font-mono">...{shortToken}</code>
                      </td>
                      <td className="py-3 px-5 text-sm text-pw-muted">
                        {new Date(inv.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </PageShell>
  );
}
