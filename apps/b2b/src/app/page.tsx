import { getTenant, isSuperAdmin } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export default async function DashboardPage() {
  const [tenant, user] = await Promise.all([getTenant(), getAuthUser()]);
  if (!user) redirect("/login");
  const supabase = createSupabaseAdmin();

  if (tenant.mode === "super-admin") {
    const { data: orgs } = await supabase
      .from("organizations")
      .select("id, name, slug, type, status, primary_color, logo_url, tier, created_at")
      .order("created_at", { ascending: false });

    const { count: totalUsers } = await supabase
      .from("user_organizations")
      .select("id", { count: "exact", head: true });

    return (
      <PageShell tenant={tenant} userEmail={user.email || ""}>
        <div style={{ padding: "32px 40px", maxWidth: 1100 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <h1 className="text-page-heading text-pw-text">Organisaties</h1>
              <p className="text-label text-pw-muted mt-1">{orgs?.length || 0} organisaties &middot; {totalUsers || 0} totaal gebruikers</p>
            </div>
            <Link href="/organizations/new" className="px-4 py-2 bg-pw-navy text-white text-label font-semibold rounded-button">
              + Organisatie toevoegen
            </Link>
          </div>
          <div className="grid gap-2">
            {(!orgs || orgs.length === 0) ? (
              <div className="bg-pw-surface border border-pw-border rounded-card p-12 text-center">
                <p className="text-pw-muted mb-2">Nog geen organisaties</p>
                <Link href="/organizations/new" className="text-pw-blue text-label font-semibold">Maak je eerste organisatie aan</Link>
              </div>
            ) : (
              orgs.map((org: any) => (
                <Link key={org.id} href={`/organizations/${org.id}`}
                  className="bg-pw-surface border border-pw-border rounded-card p-4 flex items-center justify-between hover:border-pw-blue/30 transition-colors no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-white font-bold text-label"
                      style={{ backgroundColor: org.primary_color || "#2563EB" }}>
                      {org.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-card-title text-pw-text">{org.name}</div>
                      <div className="text-caption text-pw-muted">{org.slug}.paywatch.app &middot; {org.type} &middot; {org.tier}</div>
                    </div>
                  </div>
                  <span className={"text-tiny px-2.5 py-1 rounded-badge font-semibold " + (org.status === "active" ? "bg-pw-green-light text-pw-green" : "bg-pw-bg text-pw-muted")}>
                    {org.status}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </PageShell>
    );
  }

  // Org admin dashboard
  const orgId = tenant.orgId;
  if (!orgId) redirect("/login");
  const analyticsResult = await supabase.rpc("get_org_analytics", { p_organization_id: orgId });
  const a = analyticsResult.data || {};
  const stageColors: Record<string, string> = { factuur: "#2563EB", herinnering: "#D97706", aanmaning: "#EA580C", incasso: "#DC2626", deurwaarder: "#7C3AED" };

  return (
    <PageShell tenant={tenant} userEmail={user.email || ""}>
      <div style={{ padding: "32px 40px", maxWidth: 1100 }}>
        <h1 className="text-page-heading text-pw-text mb-6">Dashboard</h1>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Totaal gebruikers", value: a.total_users || 0 },
            { label: "Actief", value: a.active_users || 0 },
            { label: "Activatiegraad", value: `${Math.round((a.activation_rate || 0) * 100)}%` },
            { label: "Met betalingsregeling", value: a.users_with_payment_plans || 0 },
          ].map((stat) => (
            <div key={stat.label} className="bg-pw-surface border border-pw-border rounded-card p-4">
              <div className="text-caption text-pw-muted mb-1">{stat.label}</div>
              <div className="text-hero text-pw-navy">{stat.value}</div>
            </div>
          ))}
        </div>
        <div className="bg-pw-surface border border-pw-border rounded-card p-5">
          <h2 className="text-section-head text-pw-text mb-4">Escalatieverdeling</h2>
          <div className="grid grid-cols-5 gap-4">
            {["factuur", "herinnering", "aanmaning", "incasso", "deurwaarder"].map((stage) => {
              const count = a.escalation_distribution?.[stage] || 0;
              return (
                <div key={stage} className="text-center">
                  <div className="text-hero" style={{ color: stageColors[stage] }}>{count}</div>
                  <div className="text-caption text-pw-muted capitalize">{stage}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
