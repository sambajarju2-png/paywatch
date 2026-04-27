import { getTenant } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import OrgNav from "@/components/OrgNav";

export default async function AnalyticsPage() {
  const [tenant, user] = await Promise.all([getTenant(), getAuthUser()]);
  if (!user) redirect("/login");
  if (!tenant.orgId) redirect("/");

  const supabase = createSupabaseAdmin();
  const orgId = tenant.orgId;

  // Aggregated analytics
  const analyticsResult = await supabase.rpc("get_org_analytics", { p_organization_id: orgId });
  const a = analyticsResult.data || {};

  // Monthly onboarding trend (last 6 months)
  const { data: monthlyData } = await supabase
    .from("user_organizations")
    .select("onboarded_at")
    .eq("organization_id", orgId)
    .not("onboarded_at", "is", null)
    .order("onboarded_at", { ascending: true });

  const monthCounts: Record<string, number> = {};
  (monthlyData || []).forEach((row) => {
    const month = new Date(row.onboarded_at).toLocaleDateString("nl-NL", { month: "short", year: "numeric" });
    monthCounts[month] = (monthCounts[month] || 0) + 1;
  });

  const escalationStages = ["factuur", "herinnering", "aanmaning", "incasso", "deurwaarder"];
  const stageColors: Record<string, string> = {
    factuur: "#2563EB",
    herinnering: "#D97706",
    aanmaning: "#EA580C",
    incasso: "#DC2626",
    deurwaarder: "#7C3AED",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <OrgNav tenant={tenant} userEmail={user.email} active="analytics" />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Rapportage</h1>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Totaal gebruikers", value: a.total_users || 0 },
            { label: "Actief", value: a.active_users || 0 },
            { label: "Activatiegraad", value: `${Math.round((a.activation_rate || 0) * 100)}%` },
            { label: "Met betalingsregeling", value: a.users_with_payment_plans || 0 },
            { label: "Regelingsgraad", value: `${Math.round((a.payment_plan_rate || 0) * 100)}%` },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-[11px] text-gray-500 mb-1">{stat.label}</div>
              <div className="text-2xl font-bold" style={{ color: tenant.primaryColor }}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Escalation distribution */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Escalatieverdeling</h2>
            <div className="space-y-3">
              {escalationStages.map((stage) => {
                const count = a.escalation_distribution?.[stage] || 0;
                const total = Object.values(a.escalation_distribution || {}).reduce((s: number, v: any) => s + (v as number), 0) as number;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={stage}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize text-gray-700">{stage}</span>
                      <span className="font-semibold" style={{ color: stageColors[stage] }}>{count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: stageColors[stage] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly onboarding */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Onboarding per maand</h2>
            {Object.keys(monthCounts).length === 0 ? (
              <p className="text-sm text-gray-400">Nog geen onboarding data</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(monthCounts).map(([month, count]) => (
                  <div key={month} className="flex items-center justify-between py-1">
                    <span className="text-sm text-gray-600">{month}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(100, (count / Math.max(...Object.values(monthCounts))) * 100)}%`,
                            backgroundColor: tenant.primaryColor,
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Compliance note */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm text-amber-800">
            <strong>Privacy:</strong> Alle data is geanonimiseerd en geaggregeerd. Individuele gebruikersdata is niet zichtbaar zonder expliciete toestemming van de gebruiker.
          </p>
        </div>
      </main>
    </div>
  );
}
