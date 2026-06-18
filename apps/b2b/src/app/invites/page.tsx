import { getTenant } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import PageShell from "@/components/PageShell";
import InviteForm from "./InviteForm";
import InviteTable from "./InviteTable";

export default async function InvitesPage() {
  const [tenant, user] = await Promise.all([getTenant(), getAuthUser()]);
  if (!user) redirect("/login");
  if (!tenant.orgId) redirect("/");

  const supabase = createSupabaseAdmin();
  const { data: invites } = await supabase
    .from("b2b_invites")
    .select("id, email, external_id, token, status, invite_type, created_at, expires_at, activated_at, qr_code_url, language")
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
          <InviteTable invites={all} />
        </div>
      </div>
    </PageShell>
  );
}
