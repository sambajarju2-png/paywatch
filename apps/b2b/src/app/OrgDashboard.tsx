"use client";

import Link from "next/link";
import {
  AreaChart, Area, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell,
} from "recharts";

const ACTION_LABELS: Record<string, string> = {
  "invite.created": "Uitnodiging verstuurd",
  "invite.activated": "Gebruiker geactiveerd",
  "member.invited": "Teamlid uitgenodigd",
  "buddy.assigned": "Coach toegewezen",
  "user.consent_granted": "Toestemming verleend",
  "user.data_accessed": "Gegevens bekeken",
  "settings.updated": "Instellingen bijgewerkt",
  "api_key.created": "API key aangemaakt",
};

const ACTION_COLORS: Record<string, string> = {
  "invite.created": "#2563EB",
  "invite.activated": "#059669",
  "member.invited": "#7C3AED",
  "buddy.assigned": "#D97706",
  "user.consent_granted": "#059669",
  "user.data_accessed": "#64748B",
  "settings.updated": "#64748B",
  "api_key.created": "#7C3AED",
};

interface Props {
  analytics: any;
  recentActivity: any[];
  pendingInvites: number;
  tenantColor: string;
  orgName: string;
}

export default function OrgDashboard({ analytics, recentActivity, pendingInvites, tenantColor, orgName }: Props) {
  const a = analytics;
  const totalUsers = a.total_users || 0;
  const activeUsers = a.active_users || 0;
  const activationRate = Math.round((a.activation_rate || 0) * 100);
  const plansCount = a.users_with_payment_plans || 0;
  const dist = a.escalation_distribution || {};

  const criticalCount = (dist.incasso || 0) + (dist.deurwaarder || 0);
  const totalBills = Object.values(dist).reduce((sum: number, v: any) => sum + (v || 0), 0) as number;

  const stages = [
    { label: "Factuur", key: "factuur", count: dist.factuur || 0, color: "#2563EB" },
    { label: "Herinnering", key: "herinnering", count: dist.herinnering || 0, color: "#D97706" },
    { label: "Aanmaning", key: "aanmaning", count: dist.aanmaning || 0, color: "#EA580C" },
    { label: "Incasso", key: "incasso", count: dist.incasso || 0, color: "#DC2626" },
    { label: "Deurwaarder", key: "deurwaarder", count: dist.deurwaarder || 0, color: "#7C3AED" },
  ];

  // Mini sparkline data (simulated trend — in prod, pull from time-series)
  const sparkData = [3, 5, 4, 7, 6, 8, totalUsers].map((v, i) => ({ v }));

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1100 }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-extrabold text-pw-navy tracking-tight">Dashboard</h1>
          <p className="text-sm text-pw-muted mt-1">{orgName}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/analytics" className="px-4 py-2 bg-white border border-pw-border rounded-lg text-sm font-medium text-pw-text hover:bg-pw-bg transition-colors no-underline">
            Rapportage
          </Link>
          <Link href="/invites" className="px-4 py-2 bg-pw-blue rounded text-sm font-semibold text-white hover:bg-blue-700 transition-colors no-underline">
            + Uitnodigen
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {/* Total users */}
        <div className="bg-white border border-pw-border rounded-2xl p-5 hover:border-pw-blue/30 transition-all">
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-semibold text-pw-muted uppercase tracking-wider">Gebruikers</p>
          </div>
          <div className="text-[28px] font-extrabold text-pw-navy tracking-tighter">{totalUsers}</div>
          <div className="h-10 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData}>
                <defs>
                  <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="#2563EB" fill="url(#sparkGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active users */}
        <div className="bg-white border border-pw-border rounded-2xl p-5 hover:border-pw-blue/30 transition-all">
          <p className="text-xs font-semibold text-pw-muted uppercase tracking-wider mb-3">Actief</p>
          <div className="text-[28px] font-extrabold text-pw-navy tracking-tighter mb-2">{activeUsers}</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-pw-bg rounded-full overflow-hidden">
              <div className="h-full bg-pw-green rounded-full" style={{ width: `${activationRate}%` }} />
            </div>
            <span className="text-xs font-bold text-pw-green">{activationRate}%</span>
          </div>
        </div>

        {/* Payment plans */}
        <div className="bg-white border border-pw-border rounded-2xl p-5 hover:border-pw-blue/30 transition-all">
          <p className="text-xs font-semibold text-pw-muted uppercase tracking-wider mb-3">Met regeling</p>
          <div className="text-[28px] font-extrabold text-pw-navy tracking-tighter mb-2">{plansCount}</div>
          <p className="text-xs text-pw-muted">
            {activeUsers > 0 ? Math.round((plansCount / activeUsers) * 100) : 0}% van actieve gebruikers
          </p>
        </div>

        {/* Critical — Risk Card */}
        <div className={`bg-white border rounded-2xl p-5 transition-all ${criticalCount > 0 ? "border-red-200 hover:border-red-300" : "border-pw-border hover:border-pw-blue/30"}`}>
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-semibold text-pw-muted uppercase tracking-wider">Kritiek</p>
            {criticalCount > 0 && (
              <span className="text-[10px] font-bold uppercase tracking-wide bg-red-50 text-pw-red px-2 py-0.5 rounded">Actie</span>
            )}
          </div>
          <div className={`text-[28px] font-extrabold tracking-tighter ${criticalCount > 0 ? "text-pw-red" : "text-pw-navy"}`}>{criticalCount}</div>
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-pw-muted">Incasso</span>
              <span className="font-bold text-pw-red">{dist.incasso || 0}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-pw-muted">Deurwaarder</span>
              <span className="font-bold text-pw-purple">{dist.deurwaarder || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Escalation Triage Bar + Activity Feed */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Escalation — 2 cols */}
        <div className="col-span-2 bg-white border border-pw-border rounded-2xl p-6">
          <div className="flex justify-between items-end mb-5">
            <div>
              <h2 className="text-base font-bold text-pw-navy">Escalatieverdeling</h2>
              <p className="text-xs text-pw-muted mt-0.5">Status van alle actieve dossiers</p>
            </div>
            <span className="text-xs font-bold text-pw-muted">Totaal: {totalBills}</span>
          </div>

          {/* Horizontal triage bar */}
          {totalBills > 0 && (
            <div className="flex h-3 w-full rounded-full overflow-hidden bg-pw-bg mb-6">
              {stages.map((stage, i) => (
                <div
                  key={stage.key}
                  style={{ width: `${(stage.count / totalBills) * 100}%`, backgroundColor: stage.color }}
                  className="h-full transition-all"
                />
              ))}
            </div>
          )}

          {/* Stage breakdown */}
          <div className="grid grid-cols-5 gap-4">
            {stages.map((stage) => (
              <div key={stage.key}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                  <span className="text-[11px] font-bold text-pw-muted uppercase">{stage.label}</span>
                </div>
                <span className="text-xl font-extrabold text-pw-navy">{stage.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed — 1 col */}
        <div className="bg-white border border-pw-border rounded-2xl p-6">
          <h2 className="text-base font-bold text-pw-navy mb-4">Recente activiteit</h2>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-pw-muted">Nog geen activiteit</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((log: any) => (
                <div key={log.id} className="flex gap-3">
                  <div className="mt-1 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: ACTION_COLORS[log.action] || "#64748B" }} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-pw-text truncate">{ACTION_LABELS[log.action] || log.action}</p>
                    <p className="text-xs text-pw-muted mt-0.5">
                      {new Date(log.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}
                      {" "}&middot; {log.actor_type === "system" ? "Systeem" : log.actor_type === "api_key" ? "API" : "Medewerker"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link href="/audit-log"
            className="block mt-4 py-2 text-center text-sm font-semibold text-pw-blue border border-pw-border rounded-lg hover:bg-pw-bg transition-colors no-underline">
            Alle activiteiten
          </Link>
        </div>
      </div>

      {/* Quick stats row */}
      {pendingInvites > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-pw-amber/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-pw-text">{pendingInvites} openstaande uitnodiging{pendingInvites > 1 ? "en" : ""}</p>
              <p className="text-xs text-pw-muted">Wachtend op activatie</p>
            </div>
          </div>
          <Link href="/invites" className="text-sm font-semibold text-pw-amber hover:underline no-underline">
            Bekijken
          </Link>
        </div>
      )}
    </div>
  );
}
