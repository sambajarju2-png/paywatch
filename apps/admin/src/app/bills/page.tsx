"use client";

import { useState, useEffect } from "react";

interface Stats {
  bills: {
    total: number;
    paid: number;
    overdue: number;
    totalOutstandingEur: string;
    stages: Record<string, number>;
  };
}

export default function BillsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse"><div className="h-8 w-48 bg-gray-200 rounded mb-8" /><div className="grid grid-cols-3 gap-4">{[1,2,3].map(i=><div key={i} className="h-32 bg-gray-100 rounded-xl"/>)}</div></div>;

  const b = stats?.bills || { total: 0, paid: 0, overdue: 0, totalOutstandingEur: "0.00", stages: {} };
  const stageOrder = ["factuur", "herinnering", "aanmaning", "incasso", "deurwaarder"];
  const stageColors: Record<string, string> = { factuur: "#2563EB", herinnering: "#D97706", aanmaning: "#EA580C", incasso: "#DC2626", deurwaarder: "#991B1B" };
  const stageLabels: Record<string, string> = { factuur: "Factuur", herinnering: "Herinnering", aanmaning: "Aanmaning", incasso: "Incasso", deurwaarder: "Deurwaarder" };
  const totalStaged = Object.values(b.stages).reduce((a, b2) => a + b2, 0) || 1;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Bill Analytics</h1>
      <p className="text-sm text-gray-500 mb-8">Aggregated bill data across all users</p>

      {/* Top stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card label="Total Bills" value={b.total} color="#2563EB" />
        <Card label="Paid" value={b.paid} color="#059669" />
        <Card label="Overdue" value={b.overdue} color="#DC2626" />
        <Card label="Outstanding" value={`€ ${b.totalOutstandingEur}`} color="#D97706" />
      </div>

      {/* Escalation pipeline */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-6">Escalation Pipeline</h3>

        {/* Visual pipeline */}
        <div className="flex gap-1 h-12 rounded-lg overflow-hidden mb-6">
          {stageOrder.map((stage) => {
            const count = b.stages[stage] || 0;
            const pct = (count / totalStaged) * 100;
            if (pct === 0) return null;
            return (
              <div
                key={stage}
                className="flex items-center justify-center text-xs font-semibold text-white transition-all"
                style={{ width: `${Math.max(pct, 5)}%`, background: stageColors[stage] }}
                title={`${stageLabels[stage]}: ${count}`}
              >
                {pct > 10 && count}
              </div>
            );
          })}
          {totalStaged <= 1 && Object.keys(b.stages).length === 0 && (
            <div className="flex-1 bg-gray-100 flex items-center justify-center text-xs text-gray-400">No data</div>
          )}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {stageOrder.map((stage) => (
            <div key={stage} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ background: stageColors[stage] }} />
              <div>
                <p className="text-xs font-medium text-gray-900">{stageLabels[stage]}</p>
                <p className="text-xs text-gray-400">{b.stages[stage] || 0} bills</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment stats */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Payment Overview</h3>
        <div className="grid sm:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-gray-500 mb-1">Payment Rate</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900">{b.total > 0 ? Math.round((b.paid / b.total) * 100) : 0}%</span>
              <span className="text-xs text-gray-400 mb-1">of all bills paid</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full mt-3 overflow-hidden">
              <div className="h-2 bg-green-500 rounded-full" style={{ width: `${b.total > 0 ? (b.paid / b.total) * 100 : 0}%` }} />
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Overdue Rate</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-red-600">{b.total > 0 ? Math.round((b.overdue / b.total) * 100) : 0}%</span>
              <span className="text-xs text-gray-400 mb-1">currently overdue</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full mt-3 overflow-hidden">
              <div className="h-2 bg-red-500 rounded-full" style={{ width: `${b.total > 0 ? (b.overdue / b.total) * 100 : 0}%` }} />
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Avg Outstanding / User</p>
            <p className="text-3xl font-bold text-gray-900">
              € {stats?.users?.total ? (parseFloat(b.totalOutstandingEur) / stats.users.total).toFixed(0) : "0"}
            </p>
            <p className="text-xs text-gray-400 mt-1">per active user</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="w-2 h-8 rounded-full mb-3" style={{ background: color }} />
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}
