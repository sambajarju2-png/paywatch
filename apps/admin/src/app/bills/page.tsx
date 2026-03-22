"use client";

import { useState, useEffect } from "react";
import AuthGate from "@/components/AuthGate";
import AdminSidebar from "@/components/AdminSidebar";
import { Card, BarChart, DonutChart, BarList, CategoryBar } from "@tremor/react";

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
const fmt = (c: number) => new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(c / 100);

export default function BillsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch("/api/admin/stats").then(r => r.json()).then(d => setStats(d)).catch(() => {}).finally(() => setLoading(false)); }, []);

  const escalationData = stats
    ? Object.entries(stats.escalation).map(([s, c]) => ({ name: STAGE_LABELS[s] || s, Rekeningen: c }))
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
          <>
            {/* Top stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Totaal", value: stats.totalBills, css: "text-tremor-content-strong dark:text-dark-tremor-content-strong" },
                { label: "Betaald", value: stats.paidBills, css: "text-emerald-600 dark:text-emerald-400" },
                { label: "Openstaand", value: stats.outstandingBills, css: "text-blue-600 dark:text-blue-400" },
                { label: "Achterstallig", value: stats.overdueCount, css: "text-red-600 dark:text-red-400" },
              ].map((c) => (
                <Card key={c.label} className="!p-4">
                  <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">{c.label}</p>
                  <p className={`text-tremor-metric font-semibold mt-1 ${c.css}`}>{c.value}</p>
                </Card>
              ))}
            </div>

            {/* Amount cards + progress */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card>
                <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">Totaal bedrag</p>
                <p className="text-2xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong mt-1">{fmt(stats.totalAmountCents)}</p>
              </Card>
              <Card>
                <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">Betaald bedrag</p>
                <p className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400 mt-1">{fmt(stats.paidAmountCents)}</p>
                <CategoryBar
                  values={[paidPct, openPct, overduePct, Math.max(0, 100 - paidPct - openPct - overduePct)]}
                  colors={["emerald", "blue", "red", "gray"]}
                  className="mt-3"
                />
                <div className="flex gap-4 mt-2 text-tremor-label text-tremor-content dark:text-dark-tremor-content">
                  <span>Betaald {paidPct}%</span>
                  <span>Open {openPct}%</span>
                  <span>Achterstallig {overduePct}%</span>
                </div>
              </Card>
            </div>

            {/* Escalation chart + Donut */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Escalatie verdeling</h3>
                <BarChart
                  className="mt-4 h-64"
                  data={escalationData}
                  index="name"
                  categories={["Rekeningen"]}
                  colors={["blue"]}
                  showLegend={false}
                  yAxisWidth={32}
                />
              </Card>
              <Card>
                <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Status verdeling</h3>
                <DonutChart
                  className="mt-4 h-56"
                  data={donutData}
                  category="amount"
                  index="name"
                  colors={["emerald", "blue", "red"]}
                  showLabel={true}
                  valueFormatter={(v) => `${v} rekeningen`}
                />
              </Card>
            </div>

            {/* BarLists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Bron</h3>
                <BarList data={sourceBarList} className="mt-4" color="blue" />
              </Card>
              <Card>
                <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Categorie</h3>
                <BarList data={categoryBarList} className="mt-4" color="emerald" />
              </Card>
            </div>
          </>
        )}
      </main>
    </AuthGate>
  );
}
