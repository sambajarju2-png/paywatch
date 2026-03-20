import { createAdminClient } from "@paywatch/database";
import { Card, Title, Text, Metric, Flex, Grid, BarList, DonutChart, AreaChart } from "@tremor/react";

// This line tells Next.js to fetch fresh data on every page load
export const dynamic = "force-dynamic";

async function getStats() {
  const supabase = createAdminClient();

  const [
    { count: totalUsers },
    { count: activeUsers },
    { data: usersByCity },
    { data: billsByStage },
    { data: recentSignups },
  ] = await Promise.all([
    supabase.from("user_settings").select("*", { count: "exact", head: true }).eq("onboarding_complete", true),
    supabase.from("mood_log").select("user_id", { count: "exact", head: true }).gte("logged_at", new Date(Date.now() - 7 * 86400000).toISOString()),
    supabase.from("user_settings").select("gemeente").eq("onboarding_complete", true).not("gemeente", "is", null),
    supabase.from("bills").select("escalation_stage").neq("status", "settled"),
    supabase.from("user_settings").select("created_at").eq("onboarding_complete", true).order("created_at", { ascending: false }).limit(30),
  ]);

  // Aggregate users by city
  const cityMap: Record<string, number> = {};
  usersByCity?.forEach((u: any) => {
    if (u.gemeente) cityMap[u.gemeente] = (cityMap[u.gemeente] || 0) + 1;
  });
  const topCities = Object.entries(cityMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Aggregate bills by stage
  const stageMap: Record<string, number> = {};
  billsByStage?.forEach((b: any) => {
    if (b.escalation_stage) stageMap[b.escalation_stage] = (stageMap[b.escalation_stage] || 0) + 1;
  });
  const stageData = Object.entries(stageMap).map(([name, value]) => ({ name, value }));

  // Signups over time (last 30 days grouped by date)
  const signupMap: Record<string, number> = {};
  recentSignups?.forEach((u: any) => {
    const date = new Date(u.created_at).toLocaleDateString("nl-NL", { day: "2-digit", month: "short" });
    signupMap[date] = (signupMap[date] || 0) + 1;
  });
  const signupData = Object.entries(signupMap)
    .map(([date, count]) => ({ date, "New users": count }))
    .reverse();

  return {
    totalUsers: totalUsers || 0,
    activeUsers: activeUsers || 0,
    topCities,
    stageData,
    signupData,
  };
}

export default async function AdminDashboard() {
  const { totalUsers, activeUsers, topCities, stageData, signupData } = await getStats();

  return (
    <main className="min-h-screen bg-pw-bg">
      {/* Admin header */}
      <header className="sticky top-0 z-40 bg-pw-navy text-white">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg">PayWatch</span>
            <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded">Admin</span>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium text-white/70">
            <a href="/" className="text-white">Dashboard</a>
            <a href="/users" className="hover:text-white transition-colors">Users</a>
            <a href="/studio" className="hover:text-white transition-colors">CMS Studio</a>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-page-heading text-pw-navy mb-6">Dashboard</h1>

        {/* Metric cards */}
        <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-4 mb-8">
          <Card decoration="top" decorationColor="blue">
            <Text>Total users</Text>
            <Metric>{totalUsers}</Metric>
          </Card>
          <Card decoration="top" decorationColor="green">
            <Text>Active this week</Text>
            <Metric>{activeUsers}</Metric>
          </Card>
          <Card decoration="top" decorationColor="amber">
            <Text>Outstanding bills</Text>
            <Metric>{stageData.reduce((sum, s) => sum + s.value, 0)}</Metric>
          </Card>
          <Card decoration="top" decorationColor="purple">
            <Text>Cities covered</Text>
            <Metric>{topCities.length}</Metric>
          </Card>
        </Grid>

        <Grid numItems={1} numItemsLg={2} className="gap-6">
          {/* Signups chart */}
          <Card>
            <Title>New signups (last 30 days)</Title>
            {signupData.length > 0 ? (
              <AreaChart
                className="h-48 mt-4"
                data={signupData}
                index="date"
                categories={["New users"]}
                colors={["blue"]}
                showAnimation
              />
            ) : (
              <Text className="mt-4 text-pw-muted">No signup data yet</Text>
            )}
          </Card>

          {/* Users by city */}
          <Card>
            <Title>Users by gemeente</Title>
            {topCities.length > 0 ? (
              <BarList data={topCities} className="mt-4" color="blue" />
            ) : (
              <Text className="mt-4 text-pw-muted">No city data yet</Text>
            )}
          </Card>

          {/* Bills by escalation stage */}
          <Card>
            <Title>Bills by escalation stage</Title>
            {stageData.length > 0 ? (
              <DonutChart
                className="h-48 mt-4"
                data={stageData}
                category="value"
                index="name"
                colors={["green", "amber", "orange", "red", "rose"]}
              />
            ) : (
              <Text className="mt-4 text-pw-muted">No bill data yet</Text>
            )}
          </Card>
        </Grid>
      </div>
    </main>
  );
}
