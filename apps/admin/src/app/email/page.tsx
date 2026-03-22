"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

/* ─── PayWatch design tokens ─── */
const C = {
  blue: "#2563EB",
  green: "#059669",
  amber: "#D97706",
  red: "#DC2626",
  purple: "#7C3AED",
  orange: "#EA580C",
  navy: "#0A2540",
  muted: "#64748B",
  border: "#E2E8F0",
  bg: "#F4F7FB",
  surface: "#ffffff",
  text: "#0F172A",
  greenLight: "#F0FDF4",
  amberLight: "#FEF3C7",
  redLight: "#FEF2F2",
  blueLight: "#EFF6FF",
  purpleLight: "#F5F3FF",
};

const AUDIENCE_COLORS: Record<string, string> = {
  consumer: C.blue,
  gemeente: C.green,
  aid_org: C.purple,
  company: C.amber,
};

const AUDIENCE_LABELS: Record<string, string> = {
  consumer: "Consumers",
  gemeente: "Gemeentes",
  aid_org: "Aid Orgs",
  company: "Bedrijven",
};

const STATUS_COLORS: Record<string, string> = {
  sent: C.green,
  sending: C.blue,
  queued: C.amber,
  draft: C.muted,
};

/* ─── Types ─── */
interface EmailData {
  subscribers: {
    total: number;
    active: number;
    unsubscribed: number;
    consumers: number;
    b2b: number;
    gemeentes: number;
    aidOrgs: number;
    companies: number;
    unsubscribeRate: number;
  };
  growth: { month: string; consumers: number; b2b: number; total: number }[];
  digest: { active: number; unsubscribed: number; total: number };
  feedback: { id: string; user_id: string; rating: number; feedback_text: string; created_at: string }[];
  resendAudiences: Record<string, number>;
  list: Subscriber[];
}

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  company_name: string | null;
  audience_type: string;
  language: string;
  source: string;
  subscribed_at: string;
  unsubscribed_at: string | null;
  created_at: string;
}

interface Broadcast {
  id: string;
  name: string;
  audience_id: string;
  audience_label: string;
  from: string;
  subject: string;
  status: string;
  created_at: string;
  sent_at: string | null;
  sends: number;
  opens: number;
  clicks: number;
}

/* ─── Stat Card ─── */
function StatCard({
  label,
  value,
  color,
  sub,
  bgTint,
}: {
  label: string;
  value: string | number;
  color: string;
  sub?: string;
  bgTint?: string;
}) {
  return (
    <div
      style={{
        background: bgTint || C.surface,
        border: `1px solid ${C.border}`,
        borderTop: `3px solid ${color}`,
        borderRadius: 12,
        padding: "14px 16px",
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 500, color: C.muted, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color, letterSpacing: "-0.03em" }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{sub}</div>
      )}
    </div>
  );
}

/* ─── Main Page ─── */
export default function EmailPage() {
  const [data, setData] = useState<EmailData | null>(null);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "subscribers" | "broadcasts" | "compose">("overview");
  const [search, setSearch] = useState("");
  const [audienceFilter, setAudienceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [broadcastDateFilter, setBroadcastDateFilter] = useState("all");

  // Compose state
  const [composeAudience, setComposeAudience] = useState("consumers");
  const [composeFrom, setComposeFrom] = useState("PayWatch <info@paywatch.app>");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeHtml, setComposeHtml] = useState("");
  const [composeSending, setComposeSending] = useState(false);
  const [composeResult, setComposeResult] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [emailRes, broadcastRes] = await Promise.all([
          fetch("/api/admin/email"),
          fetch("/api/admin/email/broadcast"),
        ]);
        if (emailRes.ok) {
          const json = await emailRes.json();
          setData(json);
        }
        if (broadcastRes.ok) {
          const json = await broadcastRes.json();
          setBroadcasts(json.broadcasts || []);
        }
      } catch (e) {
        console.error("Load error:", e);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSendBroadcast(sendNow: boolean) {
    if (!composeSubject || !composeHtml) return;
    setComposeSending(true);
    setComposeResult(null);
    try {
      const res = await fetch("/api/admin/email/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audience: composeAudience,
          from: composeFrom,
          subject: composeSubject,
          html: composeHtml,
          sendNow,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        setComposeResult({
          ok: true,
          msg: sendNow
            ? `✅ Broadcast sent! ID: ${json.id}`
            : `📝 Draft saved. ID: ${json.id}`,
        });
        // Refresh broadcasts
        const refreshRes = await fetch("/api/admin/email/broadcast");
        if (refreshRes.ok) {
          const refreshJson = await refreshRes.json();
          setBroadcasts(refreshJson.broadcasts || []);
        }
        if (sendNow) {
          setComposeSubject("");
          setComposeHtml("");
        }
      } else {
        setComposeResult({ ok: false, msg: json.error || "Failed to create broadcast" });
      }
    } catch (e) {
      setComposeResult({ ok: false, msg: "Network error" });
    }
    setComposeSending(false);
  }

  function exportCSV() {
    if (!data?.list) return;
    const filtered = getFilteredSubscribers();
    const headers = ["Email", "Name", "Company", "Audience", "Language", "Source", "Subscribed", "Unsubscribed"];
    const rows = filtered.map((s) => [
      s.email,
      s.name || "",
      s.company_name || "",
      s.audience_type,
      s.language || "",
      s.source || "",
      s.subscribed_at ? new Date(s.subscribed_at).toLocaleDateString("nl-NL") : "",
      s.unsubscribed_at ? new Date(s.unsubscribed_at).toLocaleDateString("nl-NL") : "",
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `paywatch-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function getFilteredSubscribers() {
    if (!data?.list) return [];
    return data.list.filter((s) => {
      if (audienceFilter !== "all" && s.audience_type !== audienceFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          s.email.toLowerCase().includes(q) ||
          (s.name || "").toLowerCase().includes(q) ||
          (s.company_name || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }

  function getFilteredBroadcasts() {
    return broadcasts.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (broadcastDateFilter !== "all") {
        const created = new Date(b.created_at);
        const now = new Date();
        if (broadcastDateFilter === "7d") {
          return created >= new Date(now.getTime() - 7 * 86400000);
        }
        if (broadcastDateFilter === "30d") {
          return created >= new Date(now.getTime() - 30 * 86400000);
        }
        if (broadcastDateFilter === "90d") {
          return created >= new Date(now.getTime() - 90 * 86400000);
        }
      }
      return true;
    });
  }

  if (loading) {
    return (
      <div style={{ padding: 32, textAlign: "center" }}>
        <div
          style={{
            width: 32,
            height: 32,
            border: `3px solid ${C.border}`,
            borderTopColor: C.blue,
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 12px",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ fontSize: 14, color: C.muted }}>Loading email data...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: 32, textAlign: "center", color: C.red }}>
        Failed to load email data. Check console for errors.
      </div>
    );
  }

  const pieData = [
    { name: "Consumers", value: data.subscribers.consumers, color: C.blue },
    { name: "Gemeentes", value: data.subscribers.gemeentes, color: C.green },
    { name: "Aid Orgs", value: data.subscribers.aidOrgs, color: C.purple },
    { name: "Bedrijven", value: data.subscribers.companies, color: C.amber },
  ].filter((d) => d.value > 0);

  const filteredSubs = getFilteredSubscribers();
  const filteredBroadcasts = getFilteredBroadcasts();

  const tabs = [
    { key: "overview", label: "📊 Overview" },
    { key: "subscribers", label: "👥 Subscribers" },
    { key: "broadcasts", label: "📨 Broadcasts" },
    { key: "compose", label: "✉️ Compose" },
  ] as const;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: C.navy,
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            📧 Email & Newsletter
          </h1>
          <p style={{ fontSize: 13, color: C.muted, margin: "4px 0 0" }}>
            Subscribers, broadcasts, and email performance
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          background: C.bg,
          borderRadius: 10,
          padding: 4,
          marginBottom: 24,
          border: `1px solid ${C.border}`,
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1,
              padding: "8px 12px",
              fontSize: 13,
              fontWeight: tab === t.key ? 600 : 500,
              color: tab === t.key ? C.surface : C.muted,
              background: tab === t.key ? C.navy : "transparent",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══════════ OVERVIEW TAB ═══════════ */}
      {tab === "overview" && (
        <>
          {/* Stat cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <StatCard
              label="Total Subscribers"
              value={data.subscribers.total}
              color={C.blue}
              sub={`${data.subscribers.active} active`}
              bgTint={C.blueLight}
            />
            <StatCard
              label="Consumers"
              value={data.subscribers.consumers}
              color={C.green}
              sub="App users & individuals"
              bgTint={C.greenLight}
            />
            <StatCard
              label="B2B Partners"
              value={data.subscribers.b2b}
              color={C.purple}
              sub={`${data.subscribers.gemeentes} gem · ${data.subscribers.aidOrgs} aid · ${data.subscribers.companies} co`}
              bgTint={C.purpleLight}
            />
            <StatCard
              label="Unsubscribe Rate"
              value={`${data.subscribers.unsubscribeRate}%`}
              color={data.subscribers.unsubscribeRate > 5 ? C.red : C.amber}
              sub={`${data.subscribers.unsubscribed} unsubscribed`}
              bgTint={data.subscribers.unsubscribeRate > 5 ? C.redLight : C.amberLight}
            />
          </div>

          {/* Charts row */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 24 }}>
            {/* Growth chart */}
            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: 20,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 16 }}>
                Subscriber Growth (Last 6 Months)
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={data.growth}>
                  <defs>
                    <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.blue} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={C.blue} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.green} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={C.green} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.muted }} />
                  <YAxis tick={{ fontSize: 11, fill: C.muted }} />
                  <Tooltip
                    contentStyle={{
                      background: C.surface,
                      border: `1px solid ${C.border}`,
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="consumers"
                    name="Consumers"
                    stroke={C.blue}
                    fill="url(#gradBlue)"
                    strokeWidth={2}
                    animationDuration={300}
                  />
                  <Area
                    type="monotone"
                    dataKey="b2b"
                    name="B2B"
                    stroke={C.green}
                    fill="url(#gradGreen)"
                    strokeWidth={2}
                    animationDuration={300}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Audience breakdown donut */}
            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: 20,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8 }}>
                Audience Breakdown
              </div>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                      animationDuration={300}
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(value: string) => (
                        <span style={{ fontSize: 11, color: C.text }}>{value}</span>
                      )}
                    />
                    <Tooltip
                      contentStyle={{
                        background: C.surface,
                        border: `1px solid ${C.border}`,
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div
                  style={{
                    height: 220,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: C.muted,
                    fontSize: 13,
                  }}
                >
                  No subscribers yet
                </div>
              )}
            </div>
          </div>

          {/* Digest + Feedback row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            {/* Digest overview */}
            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: 20,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 12 }}>
                📬 Weekly Digest Subscribers
              </div>
              <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: C.green, letterSpacing: "-0.03em" }}>
                    {data.digest.active}
                  </div>
                  <div style={{ fontSize: 11, color: C.muted }}>Active</div>
                </div>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: C.red, letterSpacing: "-0.03em" }}>
                    {data.digest.unsubscribed}
                  </div>
                  <div style={{ fontSize: 11, color: C.muted }}>Unsubscribed</div>
                </div>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: C.muted, letterSpacing: "-0.03em" }}>
                    {data.digest.total}
                  </div>
                  <div style={{ fontSize: 11, color: C.muted }}>Total Users</div>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ background: "#F1F5F9", borderRadius: 4, height: 8, overflow: "hidden" }}>
                <div
                  style={{
                    background: C.green,
                    height: "100%",
                    borderRadius: 4,
                    width: data.digest.total > 0
                      ? `${(data.digest.active / data.digest.total) * 100}%`
                      : "0%",
                    transition: "width 0.3s",
                  }}
                />
              </div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>
                {data.digest.total > 0
                  ? `${Math.round((data.digest.active / data.digest.total) * 100)}% opt-in rate`
                  : "No users yet"}
              </div>
            </div>

            {/* Unsubscribe feedback */}
            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: 20,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 12 }}>
                💬 Unsubscribe Feedback
              </div>
              {data.feedback.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 200, overflowY: "auto" }}>
                  {data.feedback.slice(0, 8).map((f) => (
                    <div
                      key={f.id}
                      style={{
                        background: C.bg,
                        borderRadius: 8,
                        padding: "8px 12px",
                        fontSize: 12,
                      }}
                    >
                      <div style={{ color: C.text, lineHeight: 1.5 }}>
                        {f.feedback_text || "No comment"}
                      </div>
                      <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>
                        {new Date(f.created_at).toLocaleDateString("nl-NL")}
                        {f.rating > 0 && ` · Rating: ${"★".repeat(f.rating)}${"☆".repeat(5 - f.rating)}`}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: C.muted, fontSize: 13 }}>No feedback yet — great sign!</div>
              )}
            </div>
          </div>

          {/* Resend Audience sync status */}
          {Object.keys(data.resendAudiences).length > 0 && (
            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: 20,
                marginBottom: 24,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 12 }}>
                🔄 Resend Audience Sync
              </div>
              <div style={{ display: "flex", gap: 24 }}>
                {Object.entries(data.resendAudiences).map(([key, count]) => (
                  <div key={key} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: C.blue }}>{count}</div>
                    <div style={{ fontSize: 11, color: C.muted, textTransform: "capitalize" }}>{key}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ═══════════ SUBSCRIBERS TAB ═══════════ */}
      {tab === "subscribers" && (
        <>
          {/* Search + filters + export */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 16,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="Search email, name, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                minWidth: 200,
                padding: "8px 12px",
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                fontSize: 13,
                outline: "none",
              }}
            />
            <select
              value={audienceFilter}
              onChange={(e) => setAudienceFilter(e.target.value)}
              style={{
                padding: "8px 12px",
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                fontSize: 13,
                background: C.surface,
                cursor: "pointer",
              }}
            >
              <option value="all">All Audiences</option>
              <option value="consumer">Consumers</option>
              <option value="gemeente">Gemeentes</option>
              <option value="aid_org">Aid Orgs</option>
              <option value="company">Bedrijven</option>
            </select>
            <button
              onClick={exportCSV}
              style={{
                padding: "8px 16px",
                background: C.navy,
                color: C.surface,
                border: "none",
                borderRadius: 4,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ⬇ Export CSV
            </button>
          </div>

          <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>
            {filteredSubs.length} subscriber{filteredSubs.length !== 1 ? "s" : ""}
          </div>

          {/* Subscriber table */}
          <div
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
                  {["Email", "Name", "Audience", "Source", "Language", "Subscribed", "Status"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "10px 12px",
                          textAlign: "left",
                          fontWeight: 600,
                          color: C.muted,
                          fontSize: 11,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredSubs.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: 24, textAlign: "center", color: C.muted }}>
                      No subscribers found
                    </td>
                  </tr>
                ) : (
                  filteredSubs.slice(0, 50).map((s) => (
                    <tr
                      key={s.id}
                      style={{ borderBottom: `1px solid ${C.border}` }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = C.bg)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <td style={{ padding: "10px 12px", fontWeight: 500 }}>{s.email}</td>
                      <td style={{ padding: "10px 12px", color: s.name ? C.text : C.muted }}>
                        {s.name || "—"}
                        {s.company_name && (
                          <div style={{ fontSize: 11, color: C.muted }}>{s.company_name}</div>
                        )}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 11,
                            fontWeight: 600,
                            color: AUDIENCE_COLORS[s.audience_type] || C.muted,
                          }}
                        >
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: 4,
                              background: AUDIENCE_COLORS[s.audience_type] || C.muted,
                            }}
                          />
                          {AUDIENCE_LABELS[s.audience_type] || s.audience_type}
                        </span>
                      </td>
                      <td style={{ padding: "10px 12px", fontSize: 12, color: C.muted }}>
                        {s.source || "—"}
                      </td>
                      <td style={{ padding: "10px 12px", fontSize: 12, color: C.muted }}>
                        {s.language?.toUpperCase() || "NL"}
                      </td>
                      <td style={{ padding: "10px 12px", fontSize: 12, color: C.muted }}>
                        {s.subscribed_at
                          ? new Date(s.subscribed_at).toLocaleDateString("nl-NL")
                          : new Date(s.created_at).toLocaleDateString("nl-NL")}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        {s.unsubscribed_at ? (
                          <span
                            style={{
                              background: C.redLight,
                              color: C.red,
                              padding: "2px 8px",
                              borderRadius: 4,
                              fontSize: 11,
                              fontWeight: 600,
                            }}
                          >
                            Unsubscribed
                          </span>
                        ) : (
                          <span
                            style={{
                              background: C.greenLight,
                              color: C.green,
                              padding: "2px 8px",
                              borderRadius: 4,
                              fontSize: 11,
                              fontWeight: 600,
                            }}
                          >
                            Active
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {filteredSubs.length > 50 && (
              <div style={{ padding: 12, textAlign: "center", fontSize: 12, color: C.muted }}>
                Showing 50 of {filteredSubs.length} — export CSV for full list
              </div>
            )}
          </div>
        </>
      )}

      {/* ═══════════ BROADCASTS TAB ═══════════ */}
      {tab === "broadcasts" && (
        <>
          {/* Filters */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: "8px 12px",
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                fontSize: 13,
                background: C.surface,
                cursor: "pointer",
              }}
            >
              <option value="all">All Statuses</option>
              <option value="sent">Sent</option>
              <option value="sending">Sending</option>
              <option value="queued">Queued</option>
              <option value="draft">Draft</option>
            </select>
            <select
              value={broadcastDateFilter}
              onChange={(e) => setBroadcastDateFilter(e.target.value)}
              style={{
                padding: "8px 12px",
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                fontSize: 13,
                background: C.surface,
                cursor: "pointer",
              }}
            >
              <option value="all">All Time</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <div style={{ flex: 1 }} />
            <button
              onClick={() => setTab("compose")}
              style={{
                padding: "8px 16px",
                background: C.blue,
                color: "#fff",
                border: "none",
                borderRadius: 4,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              + New Broadcast
            </button>
          </div>

          <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>
            {filteredBroadcasts.length} broadcast{filteredBroadcasts.length !== 1 ? "s" : ""}
          </div>

          {/* Broadcast cards */}
          {filteredBroadcasts.length === 0 ? (
            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: 40,
                textAlign: "center",
                color: C.muted,
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
              <div style={{ fontSize: 14 }}>
                {broadcasts.length === 0
                  ? "No broadcasts yet. Create your first one!"
                  : "No broadcasts match your filters."}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filteredBroadcasts.map((b) => (
                <div
                  key={b.id}
                  style={{
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  {/* Status badge */}
                  <span
                    style={{
                      background:
                        b.status === "sent"
                          ? C.greenLight
                          : b.status === "draft"
                          ? "#F1F5F9"
                          : C.amberLight,
                      color: STATUS_COLORS[b.status] || C.muted,
                      padding: "4px 10px",
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      minWidth: 60,
                      textAlign: "center",
                    }}
                  >
                    {b.status}
                  </span>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: C.text,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {b.subject || b.name || "Untitled"}
                    </div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                      {b.audience_label} · {b.from}
                    </div>
                  </div>

                  {/* Metrics */}
                  {b.status === "sent" && (
                    <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontWeight: 700, color: C.text }}>{b.sends}</div>
                        <div style={{ color: C.muted, fontSize: 10 }}>Sent</div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontWeight: 700, color: C.blue }}>{b.opens}</div>
                        <div style={{ color: C.muted, fontSize: 10 }}>Opens</div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontWeight: 700, color: C.green }}>{b.clicks}</div>
                        <div style={{ color: C.muted, fontSize: 10 }}>Clicks</div>
                      </div>
                    </div>
                  )}

                  {/* Date */}
                  <div style={{ fontSize: 12, color: C.muted, whiteSpace: "nowrap" }}>
                    {b.sent_at
                      ? new Date(b.sent_at).toLocaleDateString("nl-NL", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : new Date(b.created_at).toLocaleDateString("nl-NL", {
                          day: "numeric",
                          month: "short",
                        })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ═══════════ COMPOSE TAB ═══════════ */}
      {tab === "compose" && (
        <div
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: 24,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 20 }}>
            ✉️ Compose Broadcast
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            {/* Audience */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.muted,
                  marginBottom: 6,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Audience
              </label>
              <select
                value={composeAudience}
                onChange={(e) => setComposeAudience(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 8,
                  fontSize: 14,
                  background: C.surface,
                }}
              >
                <option value="consumers">Consumers ({data.subscribers.consumers})</option>
                <option value="b2b">B2B Partners ({data.subscribers.b2b})</option>
                <option value="general">General</option>
              </select>
            </div>

            {/* From */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.muted,
                  marginBottom: 6,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                From
              </label>
              <select
                value={composeFrom}
                onChange={(e) => setComposeFrom(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 8,
                  fontSize: 14,
                  background: C.surface,
                }}
              >
                <option value="PayWatch <info@paywatch.app>">PayWatch &lt;info@paywatch.app&gt;</option>
                <option value="Samba van PayWatch <samba@paywatch.app>">Samba van PayWatch &lt;samba@paywatch.app&gt;</option>
              </select>
            </div>
          </div>

          {/* Subject */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: C.muted,
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Subject
            </label>
            <input
              type="text"
              value={composeSubject}
              onChange={(e) => setComposeSubject(e.target.value)}
              placeholder="e.g. PayWatch Update — Maart 2026"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: `1.5px solid ${C.border}`,
                borderRadius: 8,
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* HTML Body */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: C.muted,
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              HTML Body
            </label>
            <textarea
              value={composeHtml}
              onChange={(e) => setComposeHtml(e.target.value)}
              placeholder="Paste your HTML email template here..."
              rows={12}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: `1.5px solid ${C.border}`,
                borderRadius: 8,
                fontSize: 13,
                fontFamily: "monospace",
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
            {/* Variable reference */}
            <div
              style={{
                marginTop: 10,
                background: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "12px 16px",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 8 }}>
                📋 Available Variables
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 24px" }}>
                {[
                  { var: "{{first_name}}", desc: "First name" },
                  { var: "{{last_name}}", desc: "Last name" },
                  { var: "{{name}}", desc: "Full name" },
                  { var: "{{email}}", desc: "Email address" },
                  { var: "{{company_name}}", desc: "Company / organisation" },
                  { var: "{{audience_type}}", desc: "consumer / gemeente / aid_org / company" },
                  { var: "{{language}}", desc: "nl or en" },
                  { var: "{{subscribed_at}}", desc: "Subscription date" },
                ].map((v) => (
                  <div key={v.var} style={{ display: "flex", alignItems: "baseline", gap: 8, fontSize: 11, padding: "2px 0" }}>
                    <code
                      style={{
                        background: C.surface,
                        border: `1px solid ${C.border}`,
                        borderRadius: 4,
                        padding: "1px 6px",
                        fontSize: 11,
                        fontFamily: "monospace",
                        color: C.blue,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                      title="Click to copy"
                      onClick={() => navigator.clipboard.writeText(v.var)}
                    >
                      {v.var}
                    </code>
                    <span style={{ color: C.muted }}>{v.desc}</span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 10,
                  paddingTop: 8,
                  borderTop: `1px solid ${C.border}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 600, color: C.text }}>Required links:</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, fontSize: 11 }}>
                  <code
                    style={{
                      background: C.redLight,
                      border: `1px solid ${C.border}`,
                      borderRadius: 4,
                      padding: "1px 6px",
                      fontSize: 11,
                      fontFamily: "monospace",
                      color: C.red,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                    title="Click to copy"
                    onClick={() => navigator.clipboard.writeText("{{{RESEND_UNSUBSCRIBE_URL}}}")}
                  >
                    {`{{{RESEND_UNSUBSCRIBE_URL}}}`}
                  </code>
                  <span style={{ color: C.muted }}>Unsubscribe link (triple braces — <strong>required</strong>)</span>
                </div>
              </div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 8 }}>
                Click any variable to copy. Paste a template from the email templates folder, then replace placeholders.
              </div>
            </div>
          </div>

          {/* Preview toggle */}
          {composeHtml && (
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.muted,
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Preview
              </div>
              <div
                style={{
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: 16,
                  maxHeight: 300,
                  overflowY: "auto",
                  background: "#fafafa",
                }}
                dangerouslySetInnerHTML={{ __html: composeHtml }}
              />
            </div>
          )}

          {/* Result message */}
          {composeResult && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                marginBottom: 16,
                fontSize: 13,
                fontWeight: 500,
                background: composeResult.ok ? C.greenLight : C.redLight,
                color: composeResult.ok ? C.green : C.red,
              }}
            >
              {composeResult.msg}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => handleSendBroadcast(false)}
              disabled={composeSending || !composeSubject || !composeHtml}
              style={{
                padding: "10px 20px",
                background: C.surface,
                color: C.navy,
                border: `1.5px solid ${C.navy}`,
                borderRadius: 4,
                fontSize: 14,
                fontWeight: 600,
                cursor: composeSending || !composeSubject || !composeHtml ? "not-allowed" : "pointer",
                opacity: composeSending || !composeSubject || !composeHtml ? 0.5 : 1,
              }}
            >
              📝 Save as Draft
            </button>
            <button
              onClick={() => {
                if (window.confirm("Send this broadcast NOW to all contacts in the selected audience?")) {
                  handleSendBroadcast(true);
                }
              }}
              disabled={composeSending || !composeSubject || !composeHtml}
              style={{
                padding: "10px 20px",
                background: C.blue,
                color: "#fff",
                border: "none",
                borderRadius: 4,
                fontSize: 14,
                fontWeight: 600,
                cursor: composeSending || !composeSubject || !composeHtml ? "not-allowed" : "pointer",
                opacity: composeSending || !composeSubject || !composeHtml ? 0.5 : 1,
              }}
            >
              {composeSending ? "Sending..." : "🚀 Send Now"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
