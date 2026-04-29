import { Suspense } from "react";
import { getTenant, isSuperAdmin } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import OrgDashboard from "./OrgDashboard";

export default async function DashboardPage() {
  const [tenant, user] = await Promise.all([getTenant(), getAuthUser()]);
  if (!user) redirect("/login");
  const supabase = createSupabaseAdmin();

  if (tenant.mode === "super-admin") {
    // Parallel queries — never waterfall
    const [orgsResult, totalUsersResult] = await Promise.all([
      supabase.from("organizations").select("id, name, slug, type, status, primary_color, logo_url, tier, created_at").order("created_at", { ascending: false }),
      supabase.from("user_organizations").select("id", { count: "exact", head: true }),
    ]);
    const orgs = orgsResult.data;
    const totalUsers = totalUsersResult.count;

    return (
      <PageShell tenant={tenant} userEmail={user.email || ""}>
        <div style={{ padding: "32px 40px", maxWidth: 1100 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-[22px] font-extrabold text-pw-navy tracking-tight">Organisaties</h1>
              <p className="text-sm text-pw-muted mt-1">{orgs?.length || 0} organisaties &middot; {totalUsers || 0} totaal gebruikers</p>
            </div>
            <Link href="/organizations/new" className="px-4 py-2 bg-pw-blue text-white text-sm font-semibold rounded no-underline hover:bg-blue-700 transition-colors">
              + Organisatie toevoegen
            </Link>
          </div>
          <div className="space-y-2">
            {(!orgs || orgs.length === 0) ? (
              <div className="bg-white border border-pw-border rounded-2xl p-12 text-center">
                <p className="text-pw-muted mb-2">Nog geen organisaties</p>
                <Link href="/organizations/new" className="text-pw-blue text-sm font-semibold">Maak je eerste organisatie aan</Link>
              </div>
            ) : (
              orgs.map((org: any) => (
                <Link key={org.id} href={`/organizations/${org.id}`}
                  className="bg-white border border-pw-border rounded-2xl p-5 flex items-center justify-between hover:border-pw-blue/30 transition-all no-underline group">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: org.primary_color || "#2563EB" }}>
                      {org.logo_url
                        ? <img src={org.logo_url} alt="" className="w-7 h-7 object-contain" />
                        : org.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-pw-navy group-hover:text-pw-blue transition-colors">{org.name}</div>
                      <div className="text-xs text-pw-muted mt-0.5">{org.slug}.paywatch.app &middot; {org.type} &middot; {org.tier}</div>
                    </div>
                  </div>
                  <span className={"text-[10px] px-2.5 py-1 rounded font-bold uppercase tracking-wide " + (org.status === "active" ? "bg-green-50 text-pw-green" : "bg-pw-bg text-pw-muted")}>
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

  // Org admin — split into client component for charts
  const orgId = tenant.orgId;
  if (!orgId) redirect("/login");

  // Parallel: analytics + recent audit log + recent invites
  const [analyticsResult, auditResult, invitesResult] = await Promise.all([
    supabase.rpc("get_org_analytics", { p_organization_id: orgId }),
    supabase.from("b2b_audit_log").select("id, action, actor_type, metadata, created_at").eq("organization_id", orgId).order("created_at", { ascending: false }).limit(5),
    supabase.from("b2b_invites").select("id, status").eq("organization_id", orgId),
  ]);

  const a = analyticsResult.data || {};
  const recentActivity = auditResult.data || [];
  const invites = invitesResult.data || [];
  const pendingInvites = invites.filter((i: any) => i.status === "pending").length;

  return (
    <PageShell tenant={tenant} userEmail={user.email || ""}>
      <OrgDashboard
        analytics={a}
        recentActivity={recentActivity}
        pendingInvites={pendingInvites}
        tenantColor={tenant.primaryColor}
        orgName={tenant.orgName || "Organisatie"}
      />
    </PageShell>
  );
}
