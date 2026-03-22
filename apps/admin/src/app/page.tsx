"use client";

import { useState, useEffect } from "react";
import AuthGate from "@/components/AuthGate";
import AdminSidebar from "@/components/AdminSidebar";
import { Card, BarChart, DonutChart, BarList, SparkAreaChart } from "@tremor/react";

interface Stats {
  totalUsers: number;
  totalBills: number;
  paidBills: number;
  outstandingBills: number;
  totalAmountCents: number;
  paidAmountCents: number;
  overdueCount: number;
  escalation: Record<string, number>;
  recentUsers: { display_name: string; created_at: string; gemeente: string }[];
  newContacts: number;
  newApplications: number;
  sources: Record<string, number>;
  categories: Record<string, number>;
}

const STAGE_LABELS: Record<string, string> = {
  factuur: "Factuur", herinnering: "Herinnering", aanmaning: "Aanmaning", incasso: "Incasso", deurwaarder: "Deurwaarder",
};

const fmt = (cents: number) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(cents / 100);

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => { if (d.error) throw new Error(d.error); setStats(d); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  /* Build chart data from stats */
  const escalationData = stats
    ? Object.entries(stats.escalation).map(([stage, count]) => ({
        name: STAGE_LABELS[stage] || stage,
        Rekeningen: count,
      }))
    : [];

  const donutData = stats
    ? [
        { name: "Betaald", amount: stats.paidBills },
        { name: "Openstaand", amount: stats.outstandingBills },
        { name: "Achterstallig", amount: stats.overdueCount },
      ]
    : [];

  const sourceBarList = stats
    ? Object.entries(stats.sources || {}).map(([src, count]) => ({
        name: src === "gmail_scan" ? "Gmail scan" : src === "manual" ? "Handmatig" : src === "camera_scan" ? "Camera scan" : src,
        value: count as number,
      }))
    : [];

  const categoryBarList = stats
    ? Object.entries(stats.categories || {})
        .sort((a, b) => (b[1] as number) - (a[1] as number))
        .slice(0, 6)
        .map(([cat, count]) => ({ name: cat || "Overig", value: count as number }))
    : [];

  /* Spark data for stat cards (simple placeholder trend) */
  const sparkData = [
    { date: "1", v: 2 }, { date: "2", v: 4 }, { date: "3", v: 3 },
    { date: "4", v: 6 }, { date: "5", v: 5 }, { date: "6", v: 8 }, { date: "7", v: 7 },
  ];

  return (
    <AuthGate>
      <AdminSidebar />
      <main className="ml-[220px] min-h-screen p-6 bg-tremor-background dark:bg-dark-tremor-background">
        <div className="mb-6">
          <h1 className="text-tremor-title font-bold text-tremor-content-strong dark:text-dark-tremor-content-strong">Dashboard</h1>
          <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content mt-1">Overzicht van PayWatch data</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-tremor-brand border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <Card className="text-center">
            <p className="text-sm text-red-600">{error}</p>
            <a href="/api/admin/debug" target="_blank" className="text-xs text-tremor-brand mt-2 inline-block hover:underline">Debug →</a>
          </Card>
        )}

        {stats && (
          <>
            {/* Stat cards with sparklines */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              {[
                { name: "Gebruikers", stat: String(stats.totalUsers), color: "blue" as const },
                { name: "Rekeningen", stat: String(stats.totalBills), color: "slate" as const },
                { name: "Betaald", stat: fmt(stats.paidAmountCents), color: "emerald" as const },
                { name: "Openstaand", stat: fmt(stats.totalAmountCents - stats.paidAmountCents), color: "amber" as const },
              ].map((item) => (
                <Card key={item.name} className="!p-4">
                  <dt className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">{item.name}</dt>
                  <div className="flex items-center justify-between mt-1">
                    <dd className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                      {item.stat}
                    </dd>
                    <SparkAreaChart
                      data={sparkData}
                      index="date"
                      categories={["v"]}
                      colors={[item.color]}
                      showGradient={false}
                      className="h-10 w-20"
                    />
                  </div>
                </Card>
              ))}
            </div>

            {/* Mini stat row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card className="!p-4">
                <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">Betaalratio</p>
                <p className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                  {stats.totalBills > 0 ? Math.round((stats.paidBills / stats.totalBills) * 100) : 0}%
                </p>
                <p className="text-tremor-label text-tremor-content dark:text-dark-tremor-content mt-1">{stats.paidBills} van {stats.totalBills}</p>
              </Card>
              <Card className="!p-4">
                <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">Nieuwe berichten</p>
                <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mt-1">{stats.newContacts}</p>
              </Card>
              <Card className="!p-4">
                <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">Sollicitaties</p>
                <p className="text-2xl font-semibold text-violet-600 dark:text-violet-400 mt-1">{stats.newApplications}</p>
              </Card>
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Escalation BarChart */}
              <Card>
                <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Escalatie Pipeline</h3>
                <BarChart
                  className="mt-4 h-60"
                  data={escalationData}
                  index="name"
                  categories={["Rekeningen"]}
                  colors={["blue"]}
                  showLegend={false}
                  showGridLines={true}
                  yAxisWidth={32}
                />
              </Card>

              {/* Payment DonutChart */}
              <Card>
                <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Betaalstatus</h3>
                <div className="flex items-center justify-center gap-8 mt-4">
                  <DonutChart
                    className="h-44"
                    data={donutData}
                    category="amount"
                    index="name"
                    colors={["emerald", "blue", "red"]}
                    showLabel={true}
                    valueFormatter={(v) => `${v}`}
                  />
                  <div className="space-y-3">
                    {[
                      { color: "bg-emerald-500", label: "Betaald", value: stats.paidBills },
                      { color: "bg-blue-500", label: "Openstaand", value: stats.outstandingBills },
                      { color: "bg-red-500", label: "Achterstallig", value: stats.overdueCount },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2 text-tremor-default">
                        <span className={`h-3 w-3 rounded-tremor-small ${item.color}`} />
                        <span className="text-tremor-content dark:text-dark-tremor-content">{item.label}</span>
                        <span className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong ml-auto">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* BarLists row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Bron van rekeningen</h3>
                <BarList data={sourceBarList} className="mt-4" color="blue" />
              </Card>
              <Card>
                <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Top categorieën</h3>
                <BarList data={categoryBarList} className="mt-4" color="emerald" />
              </Card>
            </div>

            {/* Recent users + Quick links */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Recente gebruikers</h3>
                  <a href="/users" className="text-tremor-label font-medium text-tremor-brand hover:underline">Alle →</a>
                </div>
                <div className="space-y-3">
                  {(stats.recentUsers || []).slice(0, 5).map((u, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-tremor-border dark:border-dark-tremor-border last:border-0">
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">
                        {(u.display_name || "?")[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong truncate">{u.display_name || "Onbekend"}</p>
                        <p className="text-tremor-label text-tremor-content dark:text-dark-tremor-content">{u.gemeente || "—"}</p>
                      </div>
                      <p className="text-tremor-label text-tremor-content dark:text-dark-tremor-content">{u.created_at ? new Date(u.created_at).toLocaleDateString("nl-NL") : "—"}</p>
                    </div>
                  ))}
                  {(!stats.recentUsers || stats.recentUsers.length === 0) && (
                    <p className="text-tremor-default text-tremor-content py-4 text-center">Nog geen gebruikers</p>
                  )}
                </div>
              </Card>

              <Card>
                <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong mb-4">Snelkoppelingen</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { href: "/users", label: "Gebruikers beheren" },
                    { href: "/contacts", label: "Berichten bekijken" },
                    { href: "/applications", label: "Sollicitaties" },
                    { href: "/bills", label: "Rekening analyse" },
                    { href: "https://paywatch.sanity.studio", label: "Sanity Studio", external: true },
                    { href: "/api/admin/debug", label: "Debug info", external: true },
                  ].map((link) => (
                    <a key={link.href} href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="rounded-tremor-default border border-tremor-border dark:border-dark-tremor-border px-3 py-2.5 text-tremor-label font-medium text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis hover:bg-tremor-background-muted dark:hover:bg-dark-tremor-background-muted transition-colors"
                    >
                      {link.label} →
                    </a>
                  ))}
                </div>
              </Card>
            </div>
          </>
        )}
      </main>
    </AuthGate>
  );
}
