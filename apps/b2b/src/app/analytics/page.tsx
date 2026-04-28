import { getTenant } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import PageShell from "@/components/PageShell";
import AnalyticsCharts from "./AnalyticsCharts";

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

  const stageColors: Record<string, string> = {
    factuur: "#2563EB", herinnering: "#D97706", aanmaning: "#EA580C",
    incasso: "#DC2626", deurwaarder: "#7C3AED",
  };

  const escalationData = ["factuur", "herinnering", "aanmaning", "incasso", "deurwaarder"].map((stage) => ({
    stage,
    count: a.escalation_distribution?.[stage] || 0,
    color: stageColors[stage],
  }));

  const monthlyChartData = Object.entries(monthCounts).map(([month, count]) => ({
    month,
    count,
  }));

  return (
    <PageShell tenant={tenant} userEmail={user.email || ""}>
      <div style={{ padding: "32px 40px", maxWidth: 1100 }}>
        <h1 className="text-page-heading text-pw-text mb-6">Rapportage</h1>
        <AnalyticsCharts
          escalationData={escalationData}
          monthlyData={monthlyChartData}
          stats={{
            total_users: a.total_users || 0,
            active_users: a.active_users || 0,
            activation_rate: a.activation_rate || 0,
            users_with_payment_plans: a.users_with_payment_plans || 0,
            payment_plan_rate: a.payment_plan_rate || 0,
          }}
          tenantColor={tenant.primaryColor}
        />
      </div>
    </PageShell>
  );
}
