"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// ── Design tokens (match PayWatch design system) ─────────────
const COLORS = {
  blue: "#2563EB",
  green: "#059669",
  amber: "#D97706",
  orange: "#EA580C",
  red: "#DC2626",
  darkRed: "#991B1B",
  navy: "#0A2540",
  muted: "#64748B",
  border: "#E2E8F0",
  borderLight: "#F1F5F9",
  surface: "#FFFFFF",
  bg: "#F8FAFC",
  blueLight: "#EFF6FF",
  greenLight: "#ECFDF5",
  amberLight: "#FFFBEB",
};

const ESCALATION_COLORS: Record<string, string> = {
  factuur: COLORS.blue,
  herinnering: COLORS.amber,
  aanmaning: COLORS.orange,
  incasso: COLORS.red,
  deurwaarder: COLORS.darkRed,
};

const STAGE_LABELS: Record<string, string> = {
  factuur: "Factuur",
  herinnering: "Herinnering",
  aanmaning: "Aanmaning",
  incasso: "Incasso",
  deurwaarder: "Deurwaarder",
};

// ── Types ────────────────────────────────────────────────────
interface DashboardData {
  users: { total: number; recent: UserRow[] };
  bills: {
    total: number;
    totalPaidCents: number;
    totalOutstandingCents: number;
    paid: number;
    outstanding: number;
    overdue: number;
  };
  escalation: { stage: string; count: number }[];
  sources: { source: string; count: number }[];
  categories: { category: string; count: number }[];
  contacts: { total: number; new: number };
  applications: { total: number; new: number };
  digest?: {
    subscribed: number;
    unsubscribed: number;
    unsubscribedUsers: { user_id: string; name: string }[];
    feedback: { user_id: string; message: string; date: string }[];
  };
}

interface UserRow {
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  onboarding_complete: boolean;
  created_at: string;
  bill_count: number;
}

// ── Helpers ──────────────────────────────────────────────────
function formatEuro(cents: number): string {
  return `€ ${(cents / 100).toLocaleString("nl-NL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getInitials(user: UserRow): string {
  const name =
    user.display_name ||
    [user.first_name, user.last_name].filter(Boolean).join(" ") ||
    "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getUserName(user: UserRow): string {
  return (
    user.display_name ||
    [user.first_name, user.last_name].filter(Boolean).join(" ") ||
    "Onbekend"
  );
}

// ── Custom Tooltip ───────────────────────────────────────────
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; color?: string; fill?: string; name?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 8,
        padding: "8px 12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {label && (
        <p style={{ margin: 0, fontSize: 11, color: COLORS.muted, marginBottom: 4 }}>
          {label}
        </p>
      )}
      {payload.map((p, i) => (
        <p
          key={i}
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 600,
            color: p.color || p.fill || COLORS.navy,
          }}
        >
          {p.value}
        </p>
      ))}
    </div>
  );
}

// ── Mini Sparkline ───────────────────────────────────────────
function Spark({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((v, i) => ({ v, i }));
  const gradientId = `spark-${color.replace("#", "")}`;
  return (
    <div style={{ width: 80, height: 32 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#${gradientId})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Stat Card ────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sparkData,
  sparkColor,
}: {
  label: string;
  value: string;
  sparkData?: number[];
  sparkColor?: string;
}) {
  return (
    <div
      style={{
        background: COLORS.surface,
        borderRadius: 12,
        border: `1px solid ${COLORS.border}`,
        padding: "20px 20px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <div>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: COLORS.muted }}>
          {label}
        </p>
        <p
          style={{
            margin: "6px 0 0",
            fontSize: 28,
            fontWeight: 700,
            color: COLORS.navy,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          {value}
        </p>
      </div>
      {sparkData && sparkColor && <Spark data={sparkData} color={sparkColor} />}
    </div>
  );
}

// ── Compact Stat ─────────────────────────────────────────────
function CompactStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div
      style={{
        background: COLORS.surface,
        borderRadius: 12,
        border: `1px solid ${COLORS.border}`,
        padding: 20,
      }}
    >
      <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: COLORS.muted }}>
        {label}
      </p>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 4 }}>
        <span
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: COLORS.navy,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        {accent && (
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: COLORS.green,
              background: COLORS.greenLight,
              padding: "2px 8px",
              borderRadius: 6,
            }}
          >
            {accent}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Horizontal Bar List ──────────────────────────────────────
function HBarList({
  data,
  color = COLORS.blue,
}: {
  data: { name: string; value: number }[];
  color?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {data.map((item) => (
        <div key={item.name}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 500, color: COLORS.navy }}>
              {item.name}
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.navy }}>
              {item.value}
            </span>
          </div>
          <div
            style={{
              height: 6,
              background: COLORS.borderLight,
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(item.value / max) * 100}%`,
                background: color,
                borderRadius: 3,
                transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Section Header ───────────────────────────────────────────
function SectionHeader({ title }: { title: string }) {
  return (
    <h2
      style={{
        margin: 0,
        fontSize: 15,
        fontWeight: 600,
        color: COLORS.navy,
        letterSpacing: "-0.01em",
      }}
    >
      {title}
    </h2>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ══════════════════════════════════════════════════════════════
export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (!res.ok) throw new Error(`${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError("Kon data niet laden");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, color: COLORS.muted }}>
          <div
            style={{
              width: 20,
              height: 20,
              border: `2px solid ${COLORS.border}`,
              borderTopColor: COLORS.blue,
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <span style={{ fontSize: 14 }}>Dashboard laden...</span>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: 40, color: COLORS.red, fontSize: 14 }}>
        {error || "Geen data beschikbaar"}
      </div>
    );
  }

  // ── Derived values ─────────────────────────────────────────
  const totalBills = data.bills.total;
  const paidCount = data.bills.paid;
  const paidRatio = totalBills > 0 ? Math.round((paidCount / totalBills) * 100) : 0;

  const escalationChartData = (data.escalation || []).map((e) => ({
    name: STAGE_LABELS[e.stage] || e.stage,
    value: e.count,
    fill: ESCALATION_COLORS[e.stage] || COLORS.blue,
  }));

  const paymentStatusData = [
    { name: "Betaald", value: data.bills.paid, color: COLORS.green },
    { name: "Openstaand", value: data.bills.outstanding, color: COLORS.blue },
    { name: "Achterstallig", value: data.bills.overdue, color: COLORS.red },
  ].filter((d) => d.value > 0);

  const sourceData = (data.sources || []).map((s) => ({
    name: s.source === "gmail_scan" ? "Gmail scan" : s.source === "camera_scan" ? "Camera scan" : s.source === "manual" ? "Handmatig" : s.source,
    value: s.count,
  }));

  const categoryData = (data.categories || [])
    .slice(0, 6)
    .map((c) => ({
      name: c.category.charAt(0).toUpperCase() + c.category.slice(1),
      value: c.count,
    }));

  const totalPaymentStatus = paymentStatusData.reduce((s, d) => s + d.value, 0);

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 24,
            fontWeight: 700,
            color: COLORS.navy,
            letterSpacing: "-0.03em",
          }}
        >
          Dashboard
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 14, color: COLORS.muted }}>
          Overzicht van PayWatch data
        </p>
      </div>

      {/* ── Row 1: Top Stats ──────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <StatCard label="Gebruikers" value={String(data.users.total)} sparkColor={COLORS.blue} />
        <StatCard label="Rekeningen" value={String(totalBills)} sparkColor={COLORS.blue} />
        <StatCard
          label="Betaald"
          value={formatEuro(data.bills.totalPaidCents)}
          sparkColor={COLORS.green}
        />
        <StatCard
          label="Openstaand"
          value={formatEuro(data.bills.totalOutstandingCents)}
          sparkColor={COLORS.amber}
        />
      </div>

      {/* ── Row 2: Compact stats ──────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <CompactStat
          label="Betaalratio"
          value={`${paidRatio}%`}
          accent={`${paidCount} / ${totalBills}`}
        />
        <CompactStat label="Nieuwe berichten" value={String(data.contacts.new)} />
        <CompactStat label="Sollicitaties" value={String(data.applications.new)} />
      </div>

      {/* ── Row 3: Charts ─────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {/* Escalation Pipeline */}
        <div
          style={{
            background: COLORS.surface,
            borderRadius: 12,
            border: `1px solid ${COLORS.border}`,
            padding: "20px 20px 12px",
          }}
        >
          <SectionHeader title="Escalatie Pipeline" />
          <p style={{ fontSize: 12, color: COLORS.muted, margin: "4px 0 20px" }}>
            Verdeling per escalatiefase
          </p>
          <div style={{ height: 240 }}>
            {escalationChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={escalationChartData}
                  margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                  barCategoryGap="24%"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={COLORS.border}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: COLORS.muted }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: COLORS.muted }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{ fill: "rgba(0,0,0,0.03)" }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={44}>
                    {escalationChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: COLORS.muted,
                  fontSize: 13,
                }}
              >
                Geen escalatiedata
              </div>
            )}
          </div>
        </div>

        {/* Payment Status Donut */}
        <div
          style={{
            background: COLORS.surface,
            borderRadius: 12,
            border: `1px solid ${COLORS.border}`,
            padding: 20,
          }}
        >
          <SectionHeader title="Betaalstatus" />
          <p style={{ fontSize: 12, color: COLORS.muted, margin: "4px 0 16px" }}>
            Status van alle rekeningen
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 24, height: 220 }}>
            {paymentStatusData.length > 0 ? (
              <>
                <div style={{ width: 180, height: 180, flexShrink: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={58}
                        outerRadius={82}
                        dataKey="value"
                        stroke="none"
                        paddingAngle={3}
                        startAngle={90}
                        endAngle={-270}
                      >
                        {paymentStatusData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      {/* Center label */}
                      <text
                        x="50%"
                        y="46%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{
                          fontSize: 26,
                          fontWeight: 700,
                          fill: COLORS.navy,
                          fontFamily: "'Plus Jakarta Sans', system-ui",
                        }}
                      >
                        {totalPaymentStatus}
                      </text>
                      <text
                        x="50%"
                        y="58%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{
                          fontSize: 11,
                          fill: COLORS.muted,
                          fontFamily: "'Plus Jakarta Sans', system-ui",
                        }}
                      >
                        rekeningen
                      </text>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null;
                          const d = payload[0];
                          return (
                            <div
                              style={{
                                background: "#fff",
                                border: `1px solid ${COLORS.border}`,
                                borderRadius: 8,
                                padding: "8px 12px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                fontFamily: "'Plus Jakarta Sans', system-ui",
                              }}
                            >
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color:
                                    (d.payload as { color?: string })?.color || COLORS.navy,
                                }}
                              >
                                {d.name}: {d.value}
                              </p>
                            </div>
                          );
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Legend */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    justifyContent: "center",
                  }}
                >
                  {paymentStatusData.map((item) => (
                    <div
                      key={item.name}
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 3,
                          background: item.color,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: 13, color: COLORS.muted, flex: 1 }}>
                        {item.name}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.navy }}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: COLORS.muted,
                  fontSize: 13,
                }}
              >
                Geen rekeningen
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Row 4: Bar Lists ──────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            background: COLORS.surface,
            borderRadius: 12,
            border: `1px solid ${COLORS.border}`,
            padding: 20,
          }}
        >
          <SectionHeader title="Bron van rekeningen" />
          <p style={{ fontSize: 12, color: COLORS.muted, margin: "4px 0 20px" }}>
            Hoe rekeningen zijn toegevoegd
          </p>
          {sourceData.length > 0 ? (
            <HBarList data={sourceData} color={COLORS.blue} />
          ) : (
            <p style={{ fontSize: 13, color: COLORS.muted }}>Geen data</p>
          )}
        </div>

        <div
          style={{
            background: COLORS.surface,
            borderRadius: 12,
            border: `1px solid ${COLORS.border}`,
            padding: 20,
          }}
        >
          <SectionHeader title="Top categorieën" />
          <p style={{ fontSize: 12, color: COLORS.muted, margin: "4px 0 20px" }}>
            Meest voorkomende categorieën
          </p>
          {categoryData.length > 0 ? (
            <HBarList data={categoryData} color={COLORS.green} />
          ) : (
            <p style={{ fontSize: 13, color: COLORS.muted }}>Geen data</p>
          )}
        </div>
      </div>

      {/* ── Row 5: Recent Users ───────────────────────────── */}
      <div
        style={{
          background: COLORS.surface,
          borderRadius: 12,
          border: `1px solid ${COLORS.border}`,
          padding: 20,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <SectionHeader title="Recente gebruikers" />
          <a
            href="/users"
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: COLORS.blue,
              textDecoration: "none",
            }}
          >
            Bekijk alles →
          </a>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {["Naam", "Lid sinds", "Rekeningen", "Onboarding"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "10px 12px",
                      fontSize: 11,
                      fontWeight: 600,
                      color: COLORS.muted,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      borderBottom: `1px solid ${COLORS.border}`,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data.users.recent || []).map((user, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom:
                      i < (data.users.recent || []).length - 1
                        ? `1px solid ${COLORS.borderLight}`
                        : "none",
                  }}
                >
                  <td style={{ padding: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: COLORS.blueLight,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          color: COLORS.blue,
                          flexShrink: 0,
                        }}
                      >
                        {getInitials(user)}
                      </div>
                      <span style={{ fontWeight: 500, color: COLORS.navy }}>
                        {getUserName(user)}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: 12, color: COLORS.muted }}>
                    {new Date(user.created_at).toLocaleDateString("nl-NL", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td style={{ padding: 12, fontWeight: 600, color: COLORS.navy }}>
                    {user.bill_count ?? 0}
                  </td>
                  <td style={{ padding: 12 }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 12,
                        fontWeight: 500,
                        color: user.onboarding_complete ? COLORS.green : COLORS.amber,
                        background: user.onboarding_complete
                          ? COLORS.greenLight
                          : COLORS.amberLight,
                        padding: "3px 10px",
                        borderRadius: 6,
                      }}
                    >
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: user.onboarding_complete ? COLORS.green : COLORS.amber,
                        }}
                      />
                      {user.onboarding_complete ? "Compleet" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
              {(!data.users.recent || data.users.recent.length === 0) && (
                <tr>
                  <td
                    colSpan={4}
                    style={{ padding: 20, textAlign: "center", color: COLORS.muted }}
                  >
                    Geen gebruikers gevonden
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Row 6: Quick Links ────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[
          {
            title: "Bekijk alle rekeningen",
            desc: "Beheer en filter rekeningen",
            href: "/bills",
          },
          {
            title: "Gebruikers beheren",
            desc: "Zoek, bekijk en verwijder",
            href: "/users",
          },
          {
            title: "Debug info",
            desc: "Env vars & DB status",
            href: "/api/admin/debug",
          },
        ].map((link) => (
          <a
            key={link.title}
            href={link.href}
            style={{
              background: COLORS.surface,
              borderRadius: 12,
              border: `1px solid ${COLORS.border}`,
              padding: 20,
              textDecoration: "none",
              display: "block",
            }}
          >
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: COLORS.navy }}>
              {link.title}
            </p>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: COLORS.muted }}>
              {link.desc}
            </p>
            <p style={{ margin: "12px 0 0", fontSize: 12, fontWeight: 600, color: COLORS.blue }}>
              {link.href} →
            </p>
          </a>
        ))}
      </div>

      {/* ── Row 7: Email Digest Subscriptions ─────────────── */}
      {data.digest && (
        <div
          style={{
            background: COLORS.surface,
            borderRadius: 12,
            border: `1px solid ${COLORS.border}`,
            padding: 20,
            marginTop: 24,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <SectionHeader title="E-mail digest abonnementen" />
            <div style={{ display: "flex", gap: 12 }}>
              <span style={{ fontSize: 13, color: COLORS.green, fontWeight: 600 }}>
                ✓ {data.digest.subscribed} actief
              </span>
              <span style={{ fontSize: 13, color: COLORS.red, fontWeight: 600 }}>
                ✕ {data.digest.unsubscribed} uitgeschreven
              </span>
            </div>
          </div>

          {data.digest.unsubscribed > 0 ? (
            <>
              {/* Unsubscribed users */}
              <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 600, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Uitgeschreven gebruikers
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                {data.digest.unsubscribedUsers.map((u) => (
                  <div
                    key={u.user_id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      background: "#FEF2F2",
                      borderRadius: 8,
                      border: `1px solid ${COLORS.red}15`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%", background: "#FEE2E2",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 700, color: COLORS.red,
                      }}>
                        {u.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 500, color: COLORS.navy }}>{u.name}</span>
                    </div>
                    <span style={{ fontSize: 11, color: COLORS.red, fontWeight: 500 }}>Uitgeschreven</span>
                  </div>
                ))}
              </div>

              {/* Feedback */}
              {data.digest.feedback.length > 0 && (
                <>
                  <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 600, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Feedback
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {data.digest.feedback.map((f, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "10px 14px",
                          background: COLORS.borderLight,
                          borderRadius: 8,
                        }}
                      >
                        <p style={{ margin: 0, fontSize: 13, color: COLORS.navy, lineHeight: 1.5 }}>
                          "{f.message}"
                        </p>
                        <p style={{ margin: "4px 0 0", fontSize: 11, color: COLORS.muted }}>
                          {new Date(f.date).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <p style={{ margin: 0, fontSize: 13, color: COLORS.green }}>
              Alle gebruikers zijn geabonneerd op de wekelijkse digest
            </p>
          )}
        </div>
      )}
    </div>
  );
}
