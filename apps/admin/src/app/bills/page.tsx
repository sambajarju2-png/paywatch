"use client";

import { useState, useEffect } from "react";
import AuthGate from "@/components/AuthGate";
import AdminSidebar from "@/components/AdminSidebar";
import { Card, BarChart, DonutChart, BarList, CategoryBar, Badge } from "@tremor/react";

interface Stats {
  totalBills: number;
  paidBills: number;
  outstandingBills: number;
  overdueCount: number;
  totalAmountCents: number;
  paidAmountCents: number;
  escalation: Record<string, number>;
  sources: Record<string, number>;
  categories: Record<string, number>;
}

const STAGE_LABELS: Record<string, string> = { factuur: "Factuur", herinnering: "Herinnering", aanmaning: "Aanmaning", incasso: "Incasso", deurwaarder: "Deurwaarder" };

const currencyFmt = (c: number) => new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(c / 100);
const numberFmt = (n: number) => Intl.NumberFormat("nl-NL").format(n);

export default function BillsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch("/api/admin/stats").then(r => r.json()).then(d => setStats(d)).catch(() => {}).finally(() => setLoading(false)); }, []);

  const escalationData = stats
    ? Object.entries(stats.escalation).map(([s, c]) => ({ name: STAGE_LABELS[s] || s, Rekeningen: c }))
    : [];

  const donutData = stats
    ? [
        { name: "Betaald", value: stats.paidBills },
        { name: "Openstaand", value: stats.outstandingBills },
        { name: "Achterstallig", value: stats.overdueCount },
      ]
    : [];

  const sourceBarList = stats
    ? Object.entries(stats.sources || {}).map(([src, count]) => ({
        name: src === "gmail_scan" ? "Gmail scan" : src === "manual" ? "Handmatig" : src === "camera_scan" ? "Camera scan" : src,
        value: count as number,
      }))
    : [];

  const categoryBarList = stats
    ? Object.entries(stats.categories || {}).sort((a, b) => (b[1] as number) - (a[1] as number)).slice(0, 8).map(([cat, count]) => ({ name: cat || "Overig", value: count as number }))
    : [];

  const paidPct = stats && stats.totalBills > 0 ? Math.round((stats.paidBills / stats.totalBills) * 100) : 0;
  const openPct = stats && stats.totalBills > 0 ? Math.round((stats.outstandingBills / stats.totalBills) * 100) : 0;
  const overduePct = stats && stats.totalBills > 0 ? Math.round((stats.overdueCount / stats.totalBills) * 100) : 0;

  return (
    <AuthGate><AdminSidebar />
      <main className="ml-[220px] min-h-screen p-6 bg-tremor-background dark:bg-dark-tremor-background">
        <h1 className="text-tremor-title font-bold text-tremor-content-strong dark:text-dark-tremor-content-strong mb-1">Rekeningen</h1>
        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content mb-6">Analyse van alle rekeningen</p>

        {loading ? <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-tremor-brand border-t-transparent rounded-full animate-spin" /></div> : stats && (
          <div className="space-y-6">
            {/* KPI row */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Totaal", metric: stats.totalBills, badge: null },
                { title: "Betaald", metric: stats.paidBills, badge: { text: `${paidPct}%`, color: "emerald" as const } },
                { title: "Openstaand", metric: stats.outstandingBills, badge: { text: `${openPct}%`, color: "blue" as const } },
                { title: "Achterstallig", metric: stats.overdueCount, badge: stats.overdueCount > 0 ? { text: "actie", color: "red" as const } : null },
              ].map((c) => (
                <Card key={c.title}>
                  <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">{c.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">{c.metric}</p>
                    {c.badge && <Badge color={c.badge.color}>{c.badge.text}</Badge>}
                  </div>
                </Card>
              ))}
            </div>

            {/* Amount cards + CategoryBar */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Card>
                <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">Totaal bedrag</p>
                <p className="mt-1 text-2xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">{currencyFmt(stats.totalAmountCents)}</p>
              </Card>
              <Card>
                <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">Betaald bedrag</p>
                <p className="mt-1 text-2xl font-semibold text-emerald-600 dark:text-emerald-400">{currencyFmt(stats.paidAmountCents)}</p>
                <CategoryBar
                  values={[paidPct, openPct, overduePct, Math.max(0, 100 - paidPct - openPct - overduePct)]}
                  colors={["emerald", "blue", "red", "gray"]}
                  className="mt-3"
                />
                <div className="flex gap-4 mt-2 text-tremor-label text-tremor-content dark:text-dark-tremor-content">
                  <span>Betaald {paidPct}%</span><span>Open {openPct}%</span><span>Achterstallig {overduePct}%</span>
                </div>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <h3 className="text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">Escalatie verdeling</h3>
                <BarChart
                  className="mt-4 h-64"
                  data={escalationData}
                  index="name"
                  categories={["Rekeningen"]}
                  colors={["blue"]}
                  showLegend={false}
                  yAxisWidth={32}
                  valueFormatter={(n: number) => `${numberFmt(n)}`}
                />
              </Card>
              <Card>
                <h3 className="text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">Status verdeling</h3>
                <DonutChart
                  className="mt-4 h-56"
                  data={donutData}
                  category="value"
                  index="name"
                  colors={["emerald", "blue", "red"]}
                  showLabel={true}
                  valueFormatter={(n: number) => `${n} rekeningen`}
                />
              </Card>
            </div>

            {/* BarLists */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <h3 className="text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">Bron</h3>
                <BarList data={sourceBarList} className="mt-4" color="blue" valueFormatter={(n: number) => `${numberFmt(n)}`} />
              </Card>
              <Card>
                <h3 className="text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">Categorie</h3>
                <BarList data={categoryBarList} className="mt-4" color="emerald" valueFormatter={(n: number) => `${numberFmt(n)}`} />
              </Card>
            </div>
          </div>
        )}
      </main>
    </AuthGate>
  );
}
