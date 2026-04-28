import { getTenant } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import PageShell from "@/components/PageShell";
import InviteForm from "./InviteForm";

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

  const statusColors: Record<string, string> = {
    pending: "bg-pw-amber-light text-pw-amber",
    opened: "bg-pw-blue-light text-pw-blue",
    activated: "bg-pw-green-light text-pw-green",
    expired: "bg-pw-bg text-pw-muted",
    revoked: "bg-pw-red-light text-pw-red",
  };

  return (
    <PageShell tenant={tenant} userEmail={user.email || ""}>
      <div style={{ padding: "32px 40px", maxWidth: 1100 }}>
        <h1 className="text-page-heading text-pw-text mb-6">Uitnodigingen</h1>

        <InviteForm orgId={tenant.orgId} tenantColor={tenant.primaryColor} />

        <div className="bg-pw-surface border border-pw-border rounded-card overflow-hidden">
          {(!invites || invites.length === 0) ? (
            <div className="p-12 text-center text-pw-muted text-label">Nog geen uitnodigingen verstuurd.</div>
          ) : (
            invites.map((inv: any) => (
              <div key={inv.id} className="px-5 py-3 border-b border-pw-border/50 flex items-center justify-between text-label">
                <div>
                  <div className="font-medium text-pw-text">{inv.email || "Geen e-mail"}</div>
                  {inv.external_id && <div className="text-caption text-pw-muted">Ref: {inv.external_id}</div>}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-caption text-pw-muted font-mono">
                    app.paywatch.app/invite/{inv.token?.substring(0, 8)}...
                  </span>
                  <span className={"px-2 py-0.5 text-tiny font-semibold rounded-badge " + (statusColors[inv.status] || "bg-pw-bg text-pw-muted")}>
                    {inv.status}
                  </span>
                  <span className="text-caption text-pw-muted">
                    {new Date(inv.created_at).toLocaleDateString("nl-NL")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PageShell>
  );
}
