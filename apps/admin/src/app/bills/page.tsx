"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadialBarChart, RadialBar,
} from "recharts";
import { shimmerStyle } from "@/components/Shimmer";

const C = {
  blue: "#2563EB", green: "#059669", amber: "#D97706", orange: "#EA580C",
  red: "#DC2626", darkRed: "#991B1B", navy: "#0A2540", muted: "#64748B",
  border: "#E2E8F0", borderLight: "#F1F5F9", surface: "#FFFFFF",
  blueLight: "#EFF6FF", greenLight: "#F0FDF4", redLight: "#FEF2F2",
};

const STAGE_COLORS: Record<string, string> = {
  factuur: C.blue, herinnering: C.amber, aanmaning: C.orange,
  incasso: C.red, deurwaarder: C.darkRed,
};
const STAGE_LABELS: Record<string, string> = {
  factuur: "Factuur", herinnering: "Herinnering", aanmaning: "Aanmaning",
  incasso: "Incasso", deurwaarder: "Deurwaarder",
};

function formatEuro(cents: number): string {
  return `€ ${(cents / 100).toLocaleString("nl-NL", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

// Custom tooltip for bar chart
function BarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-3 min-w-[120px]">
      <p className="text-[11px] text-[#64748B] font-medium mb-1">{label}</p>
      <p className="text-[18px] font-bold" style={{ color: d.payload?.fill || C.navy }}>{d.value}</p>
      <p className="text-[10px] text-[#94A3B8]">rekeningen</p>
    </div>
  );
}

// Custom tooltip for pie
function PieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.payload.color }} />
        <p className="text-[11px] font-semibold text-[#0A2540]">{d.name}</p>
      </div>
      <p className="text-[18px] font-bold text-[#0A2540]">{d.value}</p>
    </div>
  );
}

export default function BillsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    bills: { total: number; totalPaidCents: number; totalOutstandingCents: number; paid: number; outstanding: number; overdue: number };
    escalation: { stage: string; count: number }[];
    sources: { source: string; count: number }[];
    categories: { category: string; count: number }[];
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <style>{shimmerStyle}</style>
        <div className="mb-1.5 h-7 w-32 rounded-lg bg-[#F1F5F9]" style={{ animation: "shimmer 1.5s infinite", backgroundImage: "linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 50%,#F1F5F9 75%)", backgroundSize: "200% 100%" }} />
        <div className="mb-6 h-4 w-48 rounded bg-[#F1F5F9]" style={{ animation: "shimmer 1.5s infinite", backgroundImage: "linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 50%,#F1F5F9 75%)", backgroundSize: "200% 100%" }} />
        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{ flex: 1, background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0", padding: 20 }}>
              <div style={{ width: 80, height: 11, borderRadius: 4, backgroundImage: "linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 50%,#F1F5F9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", marginBottom: 12 }} />
              <div style={{ width: 56, height: 28, borderRadius: 4, backgroundImage: "linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 50%,#F1F5F9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0", padding: 20, height: 280 }}>
              <div style={{ width: 140, height: 14, borderRadius: 4, backgroundImage: "linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 50%,#F1F5F9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", marginBottom: 20 }} />
              <div style={{ width: "100%", height: 200, borderRadius: 8, backgroundImage: "linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 50%,#F1F5F9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return <div style={{ padding: 40, color: C.red }}>Kon data niet laden</div>;

  const b = stats.bills;
  const paidRatio = b.total > 0 ? Math.round((b.paid / b.total) * 100) : 0;

  const escalationData = (stats.escalation || []).map((e) => ({
    name: STAGE_LABELS[e.stage] || e.stage,
    value: e.count,
    fill: STAGE_COLORS[e.stage] || C.blue,
  }));

  const statusData = [
    { name: "Betaald", value: b.paid, color: C.green },
    { name: "Openstaand", value: b.outstanding, color: C.blue },
    { name: "Achterstallig", value: b.overdue, color: C.red },
  ].filter((d) => d.value > 0);

  const sourceData = (stats.sources || []).map((s) => ({
    name: s.source === "gmail_scan" ? "Gmail scan" : s.source === "camera_scan" ? "Camera scan" : "Handmatig",
    value: s.count,
  }));

  const catData = (stats.categories || []).slice(0, 8).map((c) => ({
    name: c.category.charAt(0).toUpperCase() + c.category.slice(1),
    value: c.count,
  }));

  const sourceMax = Math.max(...sourceData.map((d) => d.value), 1);
  const catMax = Math.max(...catData.map((d) => d.value), 1);

  return (
    <div>
      {/* Header */}
      <h1 className="text-[22px] font-extrabold text-[#0A2540] tracking-tight">Rekeningen</h1>
      <p className="text-sm text-[#64748B] mt-1 mb-6">Analyse van alle rekeningen</p>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Totaal", value: b.total, color: C.navy, bg: "#F8FAFC" },
          { label: "Betaald", value: b.paid, color: C.green, bg: C.greenLight },
          { label: "Openstaand", value: b.outstanding, color: C.blue, bg: C.blueLight },
          { label: "Achterstallig", value: b.overdue, color: C.red, bg: C.redLight },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-5 hover:border-[#2563EB]/20 transition-all group">
            <p className="text-[12px] font-medium text-[#64748B] uppercase tracking-wide mb-2">{s.label}</p>
            <p className="text-[32px] font-extrabold tracking-tight leading-none" style={{ color: s.color }}>{s.value}</p>
            {s.label !== "Totaal" && b.total > 0 && (
              <p className="text-[11px] text-[#94A3B8] mt-1.5">
                {Math.round((s.value / b.total) * 100)}% van totaal
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Betaalratio */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[14px] font-semibold text-[#0A2540]">Betaalratio</span>
          <span className="text-[14px] font-bold text-[#0A2540]">{paidRatio}%</span>
        </div>
        <div className="h-3 bg-[#F1F5F9] rounded-full overflow-hidden flex">
          <div style={{ width: `${(b.paid / Math.max(b.total, 1)) * 100}%`, background: C.green, transition: "width 1s ease", borderRadius: "4px 0 0 4px" }} />
          <div style={{ width: `${(b.outstanding / Math.max(b.total, 1)) * 100}%`, background: C.blue, transition: "width 1s ease" }} />
          <div style={{ width: `${(b.overdue / Math.max(b.total, 1)) * 100}%`, background: C.red, transition: "width 1s ease", borderRadius: "0 4px 4px 0" }} />
        </div>
        <div className="flex gap-5 mt-3">
          {statusData.map((s) => (
            <div key={s.name} className="flex items-center gap-1.5 text-[12px] text-[#64748B]">
              <div className="w-2 h-2 rounded-sm" style={{ background: s.color }} />
              {s.name} ({s.value})
            </div>
          ))}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Escalation bar chart */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
          <h2 className="text-[14px] font-semibold text-[#0A2540] mb-4">Escalatie verdeling</h2>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={escalationData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barCategoryGap="28%">
                <CartesianGrid strokeDasharray="2 4" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: C.muted, fontWeight: 500 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#CBD5E1" }} allowDecimals={false} />
                <Tooltip content={<BarTooltip />} cursor={{ fill: "#F8FAFC", radius: 6 }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={48} animationDuration={800} animationEasing="ease-out">
                  {escalationData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status donut */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
          <h2 className="text-[14px] font-semibold text-[#0A2540] mb-4">Status verdeling</h2>
          <div className="flex items-center gap-6 h-[220px]">
            <div style={{ width: 180, height: 180, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={56}
                    outerRadius={80}
                    dataKey="value"
                    stroke="none"
                    paddingAngle={4}
                    animationBegin={0}
                    animationDuration={800}
                    animationEasing="ease-out"
                  >
                    {statusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-3 flex-1">
              {statusData.map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                    <span className="text-[13px] text-[#64748B]">{s.name}</span>
                  </div>
                  <span className="text-[15px] font-bold text-[#0A2540]">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Source + Categories */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
          <h2 className="text-[14px] font-semibold text-[#0A2540] mb-4">Bron</h2>
          <div className="space-y-3">
            {sourceData.map((s) => {
              const pct = Math.round((s.value / sourceMax) * 100);
              return (
                <div key={s.name}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[13px] text-[#0A2540]">{s.name}</span>
                    <span className="text-[13px] font-semibold text-[#0A2540]">{s.value}</span>
                  </div>
                  <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: C.blue }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
          <h2 className="text-[14px] font-semibold text-[#0A2540] mb-4">Categorieën</h2>
          <div className="space-y-3">
            {catData.map((s) => {
              const pct = Math.round((s.value / catMax) * 100);
              return (
                <div key={s.name}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[13px] text-[#0A2540]">{s.name}</span>
                    <span className="text-[13px] font-semibold text-[#0A2540]">{s.value}</span>
                  </div>
                  <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: C.green }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
