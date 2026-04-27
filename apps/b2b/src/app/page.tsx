import { getTenant, isSuperAdmin } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const [tenant, user] = await Promise.all([getTenant(), getAuthUser()]);
  if (!user) redirect("/login");

  const supabase = createSupabaseAdmin();

  if (tenant.mode === "super-admin") {
    // Super admin: show all organizations
    const { data: orgs } = await supabase
      .from("organizations")
      .select("id, name, slug, type, status, primary_color, logo_url, tier, created_at")
      .order("created_at", { ascending: false });

    const { count: totalUsers } = await supabase
      .from("user_organizations")
      .select("id", { count: "exact", head: true });

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight">PayWatch</span>
              <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded">PLATFORM</span>
            </div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Organisaties</h1>
              <p className="text-sm text-gray-500 mt-1">{orgs?.length || 0} organisaties &middot; {totalUsers || 0} totaal gebruikers</p>
            </div>
            <Link href="/organizations/new" className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700">
              + Organisatie toevoegen
            </Link>
          </div>

          <div className="grid gap-3">
            {(!orgs || orgs.length === 0) ? (
              <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                <p className="text-gray-500 mb-2">Nog geen organisaties</p>
                <Link href="/organizations/new" className="text-blue-600 text-sm font-medium hover:underline">
                  Maak je eerste organisatie aan
                </Link>
              </div>
            ) : (
              orgs.map((org: any) => (
                <Link
                  key={org.id}
                  href={`/organizations/${org.id}`}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: org.primary_color || "#2563EB" }}
                    >
                      {org.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{org.name}</div>
                      <div className="text-xs text-gray-500">{org.slug}.paywatch.app &middot; {org.type} &middot; {org.tier}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={"px-2 py-0.5 text-[10px] font-semibold rounded " + (org.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500")}>
                      {org.status}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </main>
      </div>
    );
  }

  // Org admin mode: show org dashboard
  const orgId = tenant.orgId;
  if (!orgId) redirect("/login");

  const analyticsResult = await supabase.rpc("get_org_analytics", { p_organization_id: orgId });
  const analytics = analyticsResult.data || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4" style={{ borderTopColor: tenant.primaryColor, borderTopWidth: 3, borderTopStyle: "solid" }}>
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            {tenant.logoUrl && <img src={tenant.logoUrl} alt="" className="h-8 w-auto" />}
            <span className="text-lg font-bold" style={{ color: tenant.primaryColor }}>{tenant.orgName}</span>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/" className="font-medium text-gray-900">Dashboard</Link>
            <Link href="/users" className="text-gray-500 hover:text-gray-900">Gebruikers</Link>
            <Link href="/invites" className="text-gray-500 hover:text-gray-900">Uitnodigen</Link>
            <Link href="/buddies" className="text-gray-500 hover:text-gray-900">Coaches</Link>
            <Link href="/analytics" className="text-gray-500 hover:text-gray-900">Rapportage</Link>
            <Link href="/settings" className="text-gray-500 hover:text-gray-900">Instellingen</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Totaal gebruikers", value: analytics.total_users || 0 },
            { label: "Actief", value: analytics.active_users || 0 },
            { label: "Activatiegraad", value: `${Math.round((analytics.activation_rate || 0) * 100)}%` },
            { label: "Met betalingsregeling", value: analytics.users_with_payment_plans || 0 },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
              <div className="text-2xl font-bold" style={{ color: tenant.primaryColor }}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Escalatieverdeling</h2>
          <div className="grid grid-cols-5 gap-3">
            {["factuur", "herinnering", "aanmaning", "incasso", "deurwaarder"].map((stage) => {
              const count = analytics.escalation_distribution?.[stage] || 0;
              const colors: Record<string, string> = { factuur: "#2563EB", herinnering: "#D97706", aanmaning: "#EA580C", incasso: "#DC2626", deurwaarder: "#7C3AED" };
              return (
                <div key={stage} className="text-center">
                  <div className="text-2xl font-bold" style={{ color: colors[stage] }}>{count}</div>
                  <div className="text-[11px] text-gray-500 capitalize">{stage}</div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
