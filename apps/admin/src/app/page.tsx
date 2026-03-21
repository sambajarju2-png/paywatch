"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Stats {
  users: { total: number; completed: number; recentWeek: number };
  bills: { total: number; paid: number; overdue: number; totalOutstandingEur: string; stages: Record<string, number> };
  contacts: number;
  error?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton />;

  const s = stats!;
  const stageColors: Record<string, string> = {
    factuur: "#2563EB", herinnering: "#D97706", aanmaning: "#EA580C", incasso: "#DC2626", deurwaarder: "#991B1B",
  };
  const stageLabels: Record<string, string> = {
    factuur: "Factuur", herinnering: "Herinnering", aanmaning: "Aanmaning", incasso: "Incasso", deurwaarder: "Deurwaarder",
  };
  const maxStage = Math.max(...Object.values(s.bills.stages), 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">PayWatch admin overview</p>
        </div>
        <span className="text-xs text-gray-400">Last updated: {new Date().toLocaleString("nl-NL")}</span>
      </div>

      {s.error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 mb-6 text-sm text-amber-800">
          {s.error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users" value={s.users.total} sub={`${s.users.completed} completed onboarding`} color="#2563EB" />
        <StatCard label="New This Week" value={s.users.recentWeek} sub="signups in last 7 days" color="#059669" />
        <StatCard label="Total Bills" value={s.bills.total} sub={`${s.bills.paid} paid · ${s.bills.overdue} overdue`} color="#D97706" />
        <StatCard label="Outstanding" value={`€ ${s.bills.totalOutstandingEur}`} sub="total across all users" color="#DC2626" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Escalation stages chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Escalation Stage Distribution</h3>
          {Object.keys(s.bills.stages).length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No bill data yet</p>
          ) : (
            <div className="flex flex-col gap-3">
              {Object.entries(s.bills.stages).map(([stage, count]) => (
                <div key={stage} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-24 text-right">{stageLabels[stage] || stage}</span>
                  <div className="flex-1 h-7 bg-gray-100 rounded overflow-hidden">
                    <div
                      className="h-full rounded flex items-center px-2"
                      style={{ width: `${Math.max(8, (count / maxStage) * 100)}%`, background: stageColors[stage] || "#64748B" }}
                    >
                      <span className="text-xs font-semibold text-white">{count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick stats */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="flex flex-col gap-4">
            <QuickStat label="Onboarding completion" value={s.users.total > 0 ? `${Math.round((s.users.completed / s.users.total) * 100)}%` : "0%"} />
            <QuickStat label="Bill payment rate" value={s.bills.total > 0 ? `${Math.round((s.bills.paid / s.bills.total) * 100)}%` : "0%"} />
            <QuickStat label="Contact submissions" value={String(s.contacts)} />
            <QuickStat label="Avg outstanding per user" value={s.users.total > 0 ? `€ ${(parseFloat(s.bills.totalOutstandingEur) / s.users.total).toFixed(2)}` : "€ 0.00"} />
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { href: "/users", label: "Manage Users", desc: `${s.users.total} total users`, color: "#2563EB" },
          { href: "/bills", label: "Bill Analytics", desc: `${s.bills.total} total bills`, color: "#D97706" },
          { href: "/contacts", label: "Contact Inbox", desc: `${s.contacts} submissions`, color: "#059669" },
        ].map((link) => (
          <Link key={link.href} href={link.href} className="rounded-xl border border-gray-200 bg-white p-5 hover:border-blue-300 transition-colors">
            <div className="w-8 h-8 rounded-lg mb-3 flex items-center justify-center" style={{ background: `${link.color}15` }}>
              <div className="w-3 h-3 rounded-full" style={{ background: link.color }} />
            </div>
            <p className="text-sm font-semibold text-gray-900">{link.label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{link.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub: string; color: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="w-2 h-8 rounded-full mb-3" style={{ background: color }} />
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div>
      <div className="h-8 w-48 bg-gray-200 rounded mb-2 animate-pulse" />
      <div className="h-4 w-32 bg-gray-100 rounded mb-8 animate-pulse" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />)}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        {[1,2].map(i => <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />)}
      </div>
    </div>
  );
}
