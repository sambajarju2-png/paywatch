import { getTenant } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import PageShell from "@/components/PageShell";

export default async function AnalyticsPage() {
  const [tenant, user] = await Promise.all([getTenant(), getAuthUser()]);
  if (!user) redirect("/login");
  if (!tenant.orgId) redirect("/");

  const supabase = createSupabaseAdmin();
  const analyticsResult = await supabase.rpc("get_org_analytics", { p_organization_id: tenant.orgId });
  const a = analyticsResult.data || {};

  const { data: monthlyData } = await supabase
    .from("user_organizations").select("onboarded_at")
    .eq("organization_id", tenant.orgId).not("onboarded_at", "is", null)
    .order("onboarded_at", { ascending: true });

  const monthCounts: Record<string, number> = {};
  (monthlyData || []).forEach((row: { onboarded_at: string }) => {
    const month = new Date(row.onboarded_at).toLocaleDateString("nl-NL", { month: "short", year: "numeric" });
    monthCounts[month] = (monthCounts[month] || 0) + 1;
  });

  const stageColors: Record<string, string> = { factuur: "#2563EB", herinnering: "#D97706", aanmaning: "#EA580C", incasso: "#DC2626", deurwaarder: "#7C3AED" };

  return (
    <PageShell tenant={tenant} userEmail={user.email || ""}>
      <div style={{ padding: "32px 40px", maxWidth: 1100 }}>
        <h1 className="text-page-heading text-pw-text mb-6">Rapportage</h1>

        <div className="grid grid-cols-5 gap-3 mb-6">
          {[
            { label: "Totaal", value: a.total_users || 0 },
            { label: "Actief", value: a.active_users || 0 },
            { label: "Activatiegraad", value: `${Math.round((a.activation_rate || 0) * 100)}%` },
            { label: "Met regeling", value: a.users_with_payment_plans || 0 },
            { label: "Regelingsgraad", value: `${Math.round((a.payment_plan_rate || 0) * 100)}%` },
          ].map((stat) => (
            <div key={stat.label} className="bg-pw-surface border border-pw-border rounded-card p-4">
              <div className="text-caption text-pw-muted mb-1">{stat.label}</div>
              <div className="text-hero text-pw-navy">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-pw-surface border border-pw-border rounded-card p-5">
            <h2 className="text-section-head text-pw-text mb-4">Escalatieverdeling</h2>
            <div className="space-y-3">
              {["factuur", "herinnering", "aanmaning", "incasso", "deurwaarder"].map((stage) => {
                const count = a.escalation_distribution?.[stage] || 0;
                const total = Object.values(a.escalation_distribution || {}).reduce((s: number, v: any) => s + (v as number), 0) as number;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={stage}>
                    <div className="flex justify-between text-label mb-1">
                      <span className="capitalize text-pw-text">{stage}</span>
                      <span className="font-semibold" style={{ color: stageColors[stage] }}>{count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-pw-bg rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: stageColors[stage] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-pw-surface border border-pw-border rounded-card p-5">
            <h2 className="text-section-head text-pw-text mb-4">Onboarding per maand</h2>
            {Object.keys(monthCounts).length === 0 ? (
              <p className="text-label text-pw-muted">Nog geen data</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(monthCounts).map(([month, count]) => (
                  <div key={month} className="flex items-center justify-between py-1">
                    <span className="text-label text-pw-muted">{month}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-pw-bg rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-pw-blue" style={{ width: `${Math.min(100, (count / Math.max(...Object.values(monthCounts))) * 100)}%` }} />
                      </div>
                      <span className="text-label font-semibold text-pw-text w-6 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 p-4 bg-pw-amber-light border border-amber-200 rounded-card">
          <p className="text-label text-pw-amber">
            <strong>Privacy:</strong> Alle data is geaggregeerd. Individuele gegevens zijn niet zichtbaar zonder toestemming.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
