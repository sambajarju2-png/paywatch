"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";

interface AnalyticsChartsProps {
  escalationData: { stage: string; count: number; color: string }[];
  monthlyData: { month: string; count: number }[];
  stats: {
    total_users: number;
    active_users: number;
    activation_rate: number;
    users_with_payment_plans: number;
    payment_plan_rate: number;
  };
  tenantColor: string;
}

export default function AnalyticsCharts({ escalationData, monthlyData, stats, tenantColor }: AnalyticsChartsProps) {
  const pieData = escalationData.filter(d => d.count > 0);

  return (
    <div>
      {/* KPI cards */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {[
          { label: "Totaal", value: stats.total_users },
          { label: "Actief", value: stats.active_users },
          { label: "Activatiegraad", value: `${Math.round(stats.activation_rate * 100)}%` },
          { label: "Met regeling", value: stats.users_with_payment_plans },
          { label: "Regelingsgraad", value: `${Math.round(stats.payment_plan_rate * 100)}%` },
        ].map((stat) => (
          <div key={stat.label} className="bg-pw-surface border border-pw-border rounded-card p-4">
            <div className="text-caption text-pw-muted mb-1">{stat.label}</div>
            <div className="text-hero text-pw-navy">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Escalation bar chart */}
        <div className="bg-pw-surface border border-pw-border rounded-card p-5">
          <h2 className="text-section-head text-pw-text mb-4">Escalatieverdeling</h2>
          {escalationData.every(d => d.count === 0) ? (
            <p className="text-label text-pw-muted">Nog geen data</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={escalationData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="stage" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Bar dataKey="count" name="Gebruikers" radius={[4, 4, 0, 0]}>
                  {escalationData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Escalation pie chart */}
        <div className="bg-pw-surface border border-pw-border rounded-card p-5">
          <h2 className="text-section-head text-pw-text mb-4">Verdeling (%)</h2>
          {pieData.length === 0 ? (
            <p className="text-label text-pw-muted">Nog geen data</p>
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%" cy="50%"
                    innerRadius={40} outerRadius={70}
                    dataKey="count"
                    paddingAngle={2}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {escalationData.map((d) => (
                  <div key={d.stage} className="flex items-center gap-2 text-label">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: d.color }} />
                    <span className="text-pw-text capitalize">{d.stage}</span>
                    <span className="text-pw-muted ml-auto font-semibold">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Onboarding trend */}
      <div className="bg-pw-surface border border-pw-border rounded-card p-5">
        <h2 className="text-section-head text-pw-text mb-4">Onboarding over tijd</h2>
        {monthlyData.length === 0 ? (
          <p className="text-label text-pw-muted">Nog geen data</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }} />
              <Area
                type="monotone" dataKey="count" name="Nieuwe gebruikers"
                stroke={tenantColor} fill={tenantColor} fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-4 p-4 bg-pw-amber-light border border-amber-200 rounded-card">
        <p className="text-label text-pw-amber">
          <strong>Privacy:</strong> Alle data is geaggregeerd. Individuele gegevens zijn niet zichtbaar zonder toestemming.
        </p>
      </div>
    </div>
  );
}
