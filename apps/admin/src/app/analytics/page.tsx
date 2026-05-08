"use client";

import { useState, useEffect, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from "recharts";
import {
  Eye, Users, Activity, RefreshCw, Clock, MousePointerClick,
  TrendingUp, Globe, Monitor, Smartphone, ExternalLink,
  ArrowUpRight, ArrowDownRight, LogIn, LogOut, BarChart3,
} from "lucide-react";

/* ── Types ── */
interface PostHogData {
  overview: {
    pageviews: number; visitors: number; sessions: number;
    bounceRate: number; avgDuration: number; pagesPerSession: number;
  };
  daily: { day: string; pageviews: number; visitors: number }[];
  topPages: { page: string; views: number; unique: number }[];
  referrers: { referrer: string; visits: number; unique: number }[];
  countries: { code: string; name: string; visitors: number }[];
  browsers: { browser: string; users: number }[];
  devices: { device: string; users: number }[];
  os: { os: string; users: number }[];
  heatmap: { dow: number; hour: number; views: number }[];
  entryPages: { page: string; entries: number }[];
  exitPages: { page: string; exits: number }[];
  utm: { source: string; medium: string; campaign: string; visitors: number }[];
  days: number;
}

type Tab = "overview" | "content" | "acquisition" | "sessions";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "content", label: "Content" },
  { id: "acquisition", label: "Acquisition" },
  { id: "sessions", label: "Sessions" },
];

const FLAGS: Record<string, string> = {
  NL: "🇳🇱", DE: "🇩🇪", BE: "🇧🇪", US: "🇺🇸", GB: "🇬🇧",
  FR: "🇫🇷", ES: "🇪🇸", IT: "🇮🇹", PL: "🇵🇱", SE: "🇸🇪",
  NO: "🇳🇴", DK: "🇩🇰", AT: "🇦🇹", CH: "🇨🇭", PT: "🇵🇹",
  TR: "🇹🇷", RO: "🇷🇴", IE: "🇮🇪", CZ: "🇨🇿", HU: "🇭🇺",
  FI: "🇫🇮", GR: "🇬🇷", HR: "🇭🇷", BG: "🇧🇬", SK: "🇸🇰",
  LT: "🇱🇹", LV: "🇱🇻", EE: "🇪🇪", LU: "🇱🇺", SI: "🇸🇮",
  CY: "🇨🇾", MT: "🇲🇹", IN: "🇮🇳", BR: "🇧🇷", JP: "🇯🇵",
  CA: "🇨🇦", AU: "🇦🇺", MX: "🇲🇽", KR: "🇰🇷", ZA: "🇿🇦",
  RU: "🇷🇺", CN: "🇨🇳", NG: "🇳🇬", EG: "🇪🇬", MA: "🇲🇦",
  GM: "🇬🇲", SN: "🇸🇳", GH: "🇬🇭", KE: "🇰🇪", SR: "🇸🇷",
};

const DOW_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function fmtDuration(sec: number): string {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

/* ── Custom Tooltip ── */
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg text-[12px]">
      {label && <p className="text-slate-400 mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <strong>{fmtNum(p.value)}</strong>
        </p>
      ))}
    </div>
  );
}

/* ── Shimmer Skeleton ── */
function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-100 ${className}`} />;
}

/* ── KPI Card ── */
function KpiCard({ icon: Icon, label, value, sub, color = "#2563EB" }: {
  icon: typeof Eye; label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-md">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${color}12` }}>
          <Icon className="h-4 w-4" style={{ color }} strokeWidth={1.8} />
        </div>
        <span className="text-[12px] font-medium text-slate-500">{label}</span>
      </div>
      <p className="text-[28px] font-bold tracking-tight text-slate-900 leading-none">{value}</p>
      {sub && <p className="mt-1.5 text-[11px] text-slate-400">{sub}</p>}
    </div>
  );
}

/* ── Horizontal Bar ── */
function HBar({ data, total, color = "#2563EB" }: {
  data: { label: string; value: number }[]; total: number; color?: string;
}) {
  return (
    <div className="space-y-2.5">
      {data.map((d) => {
        const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
        return (
          <div key={d.label}>
            <div className="flex items-center justify-between text-[12px] mb-1">
              <span className="text-slate-700 font-medium truncate pr-2">{d.label}</span>
              <span className="text-slate-400 tabular-nums flex-shrink-0">{fmtNum(d.value)}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100">
              <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Activity Heatmap ── */
function Heatmap({ data }: { data: PostHogData["heatmap"] }) {
  const maxVal = Math.max(...data.map(d => d.views), 1);

  // Build grid: 7 rows (Mon-Sun) x 24 cols (hours)
  const grid: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
  data.forEach(d => {
    const row = d.dow - 1; // PostHog: 1=Mon
    if (row >= 0 && row < 7 && d.hour >= 0 && d.hour < 24) {
      grid[row][d.hour] = d.views;
    }
  });

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        {/* Hour labels */}
        <div className="flex ml-10 mb-1">
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} className="flex-1 text-center text-[9px] text-slate-400">{i}</div>
          ))}
        </div>
        {/* Grid */}
        {grid.map((row, ri) => (
          <div key={ri} className="flex items-center gap-0.5 mb-0.5">
            <span className="w-9 text-right text-[10px] text-slate-400 pr-1.5">{DOW_LABELS[ri]}</span>
            {row.map((val, ci) => {
              const intensity = val > 0 ? Math.max(0.1, val / maxVal) : 0;
              return (
                <div
                  key={ci}
                  className="flex-1 aspect-square rounded-[3px] transition-colors"
                  style={{
                    background: val > 0 ? `rgba(37, 99, 235, ${intensity})` : "#f1f5f9",
                  }}
                  title={`${DOW_LABELS[ri]} ${ci}:00 - ${val} views`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Section Card ── */
function Section({ title, icon: Icon, children, className = "" }: {
  title: string; icon?: typeof Eye; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${className}`}>
      {(title || Icon) && (
        <div className="flex items-center gap-2 mb-4">
          {Icon && <Icon className="h-4 w-4 text-slate-400" strokeWidth={1.8} />}
          <h3 className="text-[14px] font-semibold text-slate-900">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function AnalyticsPage() {
  const [data, setData] = useState<PostHogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/posthog?days=${days}`)
      .then(r => r.json())
      .then(d => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [days]);

  const deviceTotal = useMemo(() => data?.devices.reduce((a, d) => a + d.users, 0) || 1, [data]);
  const browserTotal = useMemo(() => data?.browsers.reduce((a, d) => a + d.users, 0) || 1, [data]);
  const osTotal = useMemo(() => data?.os.reduce((a, d) => a + d.users, 0) || 1, [data]);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-slate-200/80 px-6 pt-6 pb-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">Analytics</h1>
              <p className="text-[13px] text-slate-400 mt-0.5">
                {data ? `${fmtNum(data.overview.visitors)} visitors in the last ${days} days` : "Loading..."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Time range picker */}
              {[7, 14, 30].map(d => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${
                    days === d
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {d}d
                </button>
              ))}
              <button
                onClick={() => { setLoading(true); fetch(`/api/posthog?days=${days}`).then(r => r.json()).then(setData).finally(() => setLoading(false)); }}
                className="ml-1 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} strokeWidth={1.8} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-lg px-3.5 py-2 text-[13px] font-medium transition-colors ${
                  tab === t.id
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 pt-6">
        {/* Loading state */}
        {loading && !data && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-[120px]" />)}
            </div>
            <Skeleton className="h-[300px]" />
          </div>
        )}

        {data && tab === "overview" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              <KpiCard icon={Eye} label="Pageviews" value={fmtNum(data.overview.pageviews)} color="#2563EB" />
              <KpiCard icon={Users} label="Visitors" value={fmtNum(data.overview.visitors)} color="#059669" />
              <KpiCard icon={Activity} label="Sessions" value={fmtNum(data.overview.sessions)} color="#7C3AED" />
              <KpiCard icon={ArrowDownRight} label="Bounce Rate" value={`${data.overview.bounceRate}%`} color="#DC2626" />
              <KpiCard icon={MousePointerClick} label="Pages/Session" value={String(data.overview.pagesPerSession)} color="#D97706" />
              <KpiCard icon={Clock} label="Avg Duration" value={fmtDuration(data.overview.avgDuration)} color="#0891B2" />
            </div>

            {/* Traffic Chart */}
            <Section title="Traffic" icon={TrendingUp}>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={data.daily}>
                  <defs>
                    <linearGradient id="gradPV" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradV" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false}
                    tickFormatter={v => new Date(v + "T00:00:00").toLocaleDateString("en", { month: "short", day: "numeric" })} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={36} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="pageviews" name="Pageviews" stroke="#2563EB" strokeWidth={2} fill="url(#gradPV)" dot={false} />
                  <Area type="monotone" dataKey="visitors" name="Visitors" stroke="#059669" strokeWidth={2} fill="url(#gradV)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-2">
                {[["Pageviews", "#2563EB"], ["Visitors", "#059669"]].map(([l, c]) => (
                  <div key={l} className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-sm" style={{ background: c }} />
                    <span className="text-[11px] text-slate-400">{l}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* Activity Heatmap */}
            <Section title="Activity Heatmap" icon={Clock}>
              <Heatmap data={data.heatmap} />
            </Section>

            {/* Bottom grid: Devices / Browsers / OS */}
            <div className="grid gap-4 md:grid-cols-3">
              <Section title="Devices" icon={Monitor}>
                <HBar data={data.devices.map(d => ({ label: d.device || "Unknown", value: d.users }))} total={deviceTotal} color="#2563EB" />
              </Section>
              <Section title="Browsers" icon={Globe}>
                <HBar data={data.browsers.map(d => ({ label: d.browser, value: d.users }))} total={browserTotal} color="#7C3AED" />
              </Section>
              <Section title="Operating Systems" icon={Smartphone}>
                <HBar data={data.os.map(d => ({ label: d.os, value: d.users }))} total={osTotal} color="#059669" />
              </Section>
            </div>
          </div>
        )}

        {data && tab === "content" && (
          <div className="space-y-6">
            {/* Top Pages */}
            <Section title="Top Pages" icon={Eye}>
              <div className="divide-y divide-slate-100">
                {data.topPages.map((p, i) => (
                  <div key={p.page} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="text-[11px] text-slate-300 w-5 text-right tabular-nums">{i + 1}</span>
                      <span className="text-[13px] text-slate-700 truncate">{p.page}</span>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                      <span className="text-[12px] text-slate-400 tabular-nums">{fmtNum(p.unique)} unique</span>
                      <span className="text-[13px] font-semibold text-slate-900 tabular-nums w-12 text-right">{fmtNum(p.views)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Entry / Exit pages side by side */}
            <div className="grid gap-4 md:grid-cols-2">
              <Section title="Entry Pages" icon={LogIn}>
                <div className="divide-y divide-slate-100">
                  {data.entryPages.map(p => (
                    <div key={p.page} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                      <span className="text-[12px] text-slate-600 truncate pr-3">{p.page}</span>
                      <span className="text-[12px] font-medium text-slate-900 tabular-nums">{p.entries}</span>
                    </div>
                  ))}
                </div>
              </Section>
              <Section title="Exit Pages" icon={LogOut}>
                <div className="divide-y divide-slate-100">
                  {data.exitPages.map(p => (
                    <div key={p.page} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                      <span className="text-[12px] text-slate-600 truncate pr-3">{p.page}</span>
                      <span className="text-[12px] font-medium text-slate-900 tabular-nums">{p.exits}</span>
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          </div>
        )}

        {data && tab === "acquisition" && (
          <div className="space-y-6">
            {/* Referrers */}
            <Section title="Referrers" icon={ExternalLink}>
              <div className="divide-y divide-slate-100">
                {data.referrers.map(r => (
                  <div key={r.referrer} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                    <span className="text-[13px] text-slate-700 truncate pr-3">{r.referrer}</span>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span className="text-[12px] text-slate-400 tabular-nums">{r.unique} unique</span>
                      <span className="text-[13px] font-semibold text-slate-900 tabular-nums w-10 text-right">{r.visits}</span>
                    </div>
                  </div>
                ))}
                {data.referrers.length === 0 && <p className="text-[13px] text-slate-400 py-4 text-center">No referrer data yet</p>}
              </div>
            </Section>

            {/* Countries */}
            <Section title="Countries" icon={Globe}>
              <div className="grid gap-2 sm:grid-cols-2">
                {data.countries.map(c => (
                  <div key={c.code} className="flex items-center gap-2.5 rounded-lg bg-slate-50 px-3 py-2.5">
                    <span className="text-[16px]">{FLAGS[c.code] || "🌍"}</span>
                    <span className="text-[13px] text-slate-700 flex-1">{c.name}</span>
                    <span className="text-[13px] font-semibold text-slate-900 tabular-nums">{c.visitors}</span>
                  </div>
                ))}
                {data.countries.length === 0 && <p className="text-[13px] text-slate-400 py-4 text-center col-span-2">No country data yet</p>}
              </div>
            </Section>

            {/* UTM campaigns */}
            {data.utm.length > 0 && (
              <Section title="UTM Campaigns" icon={BarChart3}>
                <div className="divide-y divide-slate-100">
                  {data.utm.map((u, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                      <div className="min-w-0 flex-1">
                        <span className="text-[13px] font-medium text-slate-700">{u.source}</span>
                        {u.medium && <span className="text-[11px] text-slate-400 ml-2">/ {u.medium}</span>}
                        {u.campaign && <span className="text-[11px] text-slate-400 ml-1">/ {u.campaign}</span>}
                      </div>
                      <span className="text-[13px] font-semibold text-slate-900 tabular-nums ml-3">{u.visitors}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        )}

        {data && tab === "sessions" && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <KpiCard icon={Activity} label="Total Sessions" value={fmtNum(data.overview.sessions)} color="#7C3AED" />
              <KpiCard icon={ArrowDownRight} label="Bounce Rate" value={`${data.overview.bounceRate}%`} sub="Single-page sessions" color="#DC2626" />
              <KpiCard icon={Clock} label="Avg Duration" value={fmtDuration(data.overview.avgDuration)} sub={`${data.overview.pagesPerSession} pages per session`} color="#0891B2" />
            </div>

            {/* Session duration distribution as bar chart */}
            <Section title="Devices by Sessions" icon={Monitor}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.devices.map(d => ({ name: d.device || "Unknown", sessions: d.users }))}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={36} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="sessions" name="Sessions" fill="#7C3AED" radius={[6, 6, 0, 0]} opacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            </Section>

            {/* OS breakdown */}
            <Section title="Operating Systems" icon={Smartphone}>
              <HBar data={data.os.map(d => ({ label: d.os, value: d.users }))} total={osTotal} color="#059669" />
            </Section>
          </div>
        )}

        {/* PostHog attribution */}
        <p className="text-center text-[11px] text-slate-300 mt-8">
          PostHog EU · Last {days} days ·{" "}
          <button onClick={() => { setLoading(true); fetch(`/api/posthog?days=${days}`).then(r => r.json()).then(setData).finally(() => setLoading(false)); }}
            className="underline hover:text-slate-400 transition-colors">
            Refresh
          </button>
        </p>
      </div>
    </div>
  );
}
