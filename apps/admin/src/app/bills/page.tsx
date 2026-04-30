"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { shimmerStyle } from "@/components/Shimmer";

const C = {
  blue: "#2563EB", green: "#059669", amber: "#D97706", orange: "#EA580C",
  red: "#DC2626", darkRed: "#991B1B", navy: "#0A2540", muted: "#64748B",
  border: "#E2E8F0", borderLight: "#F1F5F9", surface: "#FFFFFF",
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
  return `€ ${(cents / 100).toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ flex: 1, background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0", padding: 20 }}>
              <div style={{ width: 80, height: 11, borderRadius: 4, background: "linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 50%,#F1F5F9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", marginBottom: 12 }} />
              <div style={{ width: 56, height: 28, borderRadius: 4, background: "linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 50%,#F1F5F9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[0,1].map(i => (
            <div key={i} style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0", padding: 20, height: 280 }}>
              <div style={{ width: 140, height: 14, borderRadius: 4, background: "linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 50%,#F1F5F9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", marginBottom: 20 }} />
              <div style={{ width: "100%", height: 200, borderRadius: 8, background: "linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 50%,#F1F5F9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
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

  const catMax = Math.max(...catData.map((d) => d.value), 1);

  return (
    <div>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: C.navy, letterSpacing: "-0.03em" }}>Rekeningen</h1>
      <p style={{ margin: "4px 0 24px", fontSize: 14, color: C.muted }}>Analyse van alle rekeningen</p>

      {/* Top stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Totaal", value: String(b.total), color: C.navy },
          { label: "Betaald", value: String(b.paid), color: C.green },
          { label: "Openstaand", value: String(b.outstanding), color: C.blue },
          { label: "Achterstallig", value: String(b.overdue), color: C.red },
        ].map((s) => (
          <div key={s.label} style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: C.muted }}>{s.label}</p>
            <p style={{ margin: "6px 0 0", fontSize: 28, fontWeight: 700, color: s.color, letterSpacing: "-0.03em", lineHeight: 1 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Betaalratio bar */}
      <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: C.navy }}>Betaalratio</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>{paidRatio}%</span>
        </div>
        <div style={{ height: 10, background: C.borderLight, borderRadius: 5, overflow: "hidden", display: "flex" }}>
          <div style={{ width: `${(b.paid / Math.max(b.total, 1)) * 100}%`, background: C.green, borderRadius: 5, transition: "width 0.6s ease" }} />
          <div style={{ width: `${(b.outstanding / Math.max(b.total, 1)) * 100}%`, background: C.blue }} />
          <div style={{ width: `${(b.overdue / Math.max(b.total, 1)) * 100}%`, background: C.red }} />
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
          {statusData.map((s) => (
            <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.muted }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
              {s.name} ({s.value})
            </div>
          ))}
        </div>
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        {/* Escalation */}
        <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: "20px 20px 12px" }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: C.navy }}>Escalatie verdeling</h2>
          <div style={{ height: 240, marginTop: 16 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={escalationData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barCategoryGap="24%">
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: C.muted }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: C.muted }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13 }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={44}>
                  {escalationData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut */}
        <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: C.navy }}>Status verdeling</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 24, height: 240 }}>
            <div style={{ width: 160, height: 160, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={72} dataKey="value" stroke="none" paddingAngle={3}>
                    {statusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {statusData.map((s) => (
                <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />
                  <span style={{ fontSize: 13, color: C.muted, flex: 1 }}>{s.name}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Source + Category */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 16 }}>Bron</h2>
          {sourceData.map((s) => (
            <div key={s.name} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: C.navy }}>{s.name}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{s.value}</span>
              </div>
              <div style={{ height: 6, background: C.borderLight, borderRadius: 3 }}>
                <div style={{ height: "100%", width: `${(s.value / Math.max(...sourceData.map((d) => d.value), 1)) * 100}%`, background: C.blue, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 16 }}>Categorieën</h2>
          {catData.map((s) => (
            <div key={s.name} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: C.navy }}>{s.name}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{s.value}</span>
              </div>
              <div style={{ height: 6, background: C.borderLight, borderRadius: 3 }}>
                <div style={{ height: "100%", width: `${(s.value / catMax) * 100}%`, background: C.green, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
