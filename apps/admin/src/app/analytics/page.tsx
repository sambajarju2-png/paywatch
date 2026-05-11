"use client";

import { useState, useEffect, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell,
} from "recharts";
import {
  Eye, Users, Activity, RefreshCw, Clock, MousePointerClick,
  TrendingUp, Globe, Monitor, Smartphone, ExternalLink,
  ArrowDownRight, LogIn, LogOut, BarChart3, ArrowRight,
  Layers, FileText,
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
  pageFlows?: { from: string; to: string; count: number }[];
  utm: { source: string; medium: string; campaign: string; visitors: number }[];
  days: number;
}

type Tab = "overview" | "content" | "acquisition" | "sessions";

const TABS: { id: Tab; label: string; icon: typeof Eye }[] = [
  { id: "overview", label: "Overview", icon: TrendingUp },
  { id: "content", label: "Content", icon: FileText },
  { id: "acquisition", label: "Acquisition", icon: ExternalLink },
  { id: "sessions", label: "Sessions", icon: Layers },
];

const FLAGS: Record<string, string> = {
  NL:"🇳🇱",DE:"🇩🇪",BE:"🇧🇪",US:"🇺🇸",GB:"🇬🇧",FR:"🇫🇷",ES:"🇪🇸",IT:"🇮🇹",
  PL:"🇵🇱",SE:"🇸🇪",NO:"🇳🇴",DK:"🇩🇰",AT:"🇦🇹",CH:"🇨🇭",PT:"🇵🇹",TR:"🇹🇷",
  RO:"🇷🇴",IE:"🇮🇪",IN:"🇮🇳",BR:"🇧🇷",JP:"🇯🇵",CA:"🇨🇦",AU:"🇦🇺",
  GM:"🇬🇲",SN:"🇸🇳",GH:"🇬🇭",KE:"🇰🇪",NG:"🇳🇬",EG:"🇪🇬",MA:"🇲🇦",SR:"🇸🇷",ZA:"🇿🇦",
};

const DOW_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const COLORS = {
  blue: "#2563EB", green: "#059669", purple: "#7C3AED",
  red: "#DC2626", amber: "#D97706", cyan: "#0891B2",
  pink: "#DB2777", indigo: "#4F46E5",
};

const BAR_COLORS = ["#2563EB", "#7C3AED", "#059669", "#D97706", "#DB2777", "#0891B2", "#4F46E5", "#DC2626"];

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
    <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-xl text-[12px]">
      {label && <p className="text-slate-400 mb-1.5 text-[11px]">{new Date(label + "T00:00:00").toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-500">{p.name}</span>
          <span className="ml-auto font-semibold text-slate-900">{fmtNum(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Shimmer ── */
function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-100 ${className}`} />;
}

/* ── KPI Card ── */
function KpiCard({ icon: Icon, label, value, sub, color = COLORS.blue }: {
  icon: typeof Eye; label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-5 transition-all hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300/60">
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.04]" style={{ background: color, transform: "translate(30%, -30%)" }} />
      <div className="flex items-center gap-2.5 mb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${color}14` }}>
          <Icon className="h-[18px] w-[18px]" style={{ color }} strokeWidth={1.8} />
        </div>
        <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-[32px] font-extrabold tracking-tight text-slate-900 leading-none">{value}</p>
      {sub && <p className="mt-2 text-[11px] text-slate-400 font-medium">{sub}</p>}
    </div>
  );
}

/* ── Ranked Bar Row ── */
function RankedRow({ rank, label, value, maxValue, color, suffix, sub }: {
  rank: number; label: string; value: number; maxValue: number; color: string; suffix?: string; sub?: string;
}) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;
  return (
    <div className="group flex items-center gap-3 py-2 px-1 rounded-lg hover:bg-slate-50/80 transition-colors">
      <span className="text-[11px] text-slate-300 w-5 text-right tabular-nums font-semibold">{rank}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[13px] text-slate-700 font-medium truncate pr-3">{label}</span>
          <div className="flex items-center gap-2 flex-shrink-0">
            {sub && <span className="text-[11px] text-slate-400">{sub}</span>}
            <span className="text-[13px] font-bold text-slate-900 tabular-nums">{fmtNum(value)}{suffix}</span>
          </div>
        </div>
        <div className="h-[5px] w-full rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${pct}%`, background: color }} />
        </div>
      </div>
    </div>
  );
}

/* ── Heatmap ── */
function Heatmap({ data }: { data: PostHogData["heatmap"] }) {
  const maxVal = Math.max(...data.map(d => d.views), 1);
  const grid: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
  data.forEach(d => {
    const row = d.dow - 1;
    if (row >= 0 && row < 7 && d.hour >= 0 && d.hour < 24) grid[row][d.hour] = d.views;
  });

  return (
    <div className="overflow-x-auto -mx-1">
      <div className="min-w-[560px] px-1">
        <div className="flex ml-9 mb-1.5">
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} className="flex-1 text-center text-[9px] text-slate-400 font-medium">{i}</div>
          ))}
        </div>
        {grid.map((row, ri) => (
          <div key={ri} className="flex items-center gap-[3px] mb-[3px]">
            <span className="w-8 text-right text-[10px] text-slate-400 pr-1 font-medium">{DOW_LABELS[ri]}</span>
            {row.map((val, ci) => {
              const intensity = val > 0 ? Math.max(0.12, val / maxVal) : 0;
              return (
                <div
                  key={ci}
                  className="flex-1 aspect-square rounded-[4px] transition-all duration-200 hover:scale-125 hover:z-10 cursor-default"
                  style={{ background: val > 0 ? `rgba(37, 99, 235, ${intensity})` : "#f1f5f9" }}
                  title={`${DOW_LABELS[ri]} ${ci}:00 — ${val} views`}
                />
              );
            })}
          </div>
        ))}
        <div className="flex items-center justify-end gap-1.5 mt-2">
          <span className="text-[9px] text-slate-400">Less</span>
          {[0.08, 0.2, 0.4, 0.65, 0.9].map((o, i) => (
            <div key={i} className="w-3 h-3 rounded-[3px]" style={{ background: `rgba(37, 99, 235, ${o})` }} />
          ))}
          <span className="text-[9px] text-slate-400">More</span>
        </div>
      </div>
    </div>
  );
}

/* ── Section Card ── */
function Section({ title, icon: Icon, children, className = "", action }: {
  title: string; icon?: typeof Eye; children: React.ReactNode; className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl border border-slate-200/60 bg-white p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
              <Icon className="h-3.5 w-3.5 text-slate-500" strokeWidth={2} />
            </div>
          )}
          <h3 className="text-[14px] font-bold text-slate-800">{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function AnalyticsPage() {
  const [data, setData] = useState<PostHogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [tab, setTab] = useState<Tab>("overview");

  const refresh = (overrideDays?: number) => {
    const d = overrideDays ?? days;
    setLoading(true);
    fetch(`/api/posthog?days=${d}`)
      .then(r => r.json())
      .then(d => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { refresh(days); }, [days]);

  const deviceTotal = useMemo(() => data?.devices.reduce((a, d) => a + d.users, 0) || 1, [data]);
  const browserTotal = useMemo(() => data?.browsers.reduce((a, d) => a + d.users, 0) || 1, [data]);
  const osTotal = useMemo(() => data?.os.reduce((a, d) => a + d.users, 0) || 1, [data]);
  const topMax = useMemo(() => data?.topPages[0]?.views || 1, [data]);

  return (
    <div className="min-h-screen bg-[#FAFBFC] pb-16">
      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200/60">
        <div className="max-w-[1240px] mx-auto px-6 pt-7 pb-5">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h1 className="text-[26px] font-extrabold text-slate-900 tracking-tight">Analytics</h1>
              <p className="text-[13px] text-slate-400 mt-1 font-medium">
                {data ? `${fmtNum(data.overview.visitors)} visitors in the last ${days} days` : "Loading data..."}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {[7, 14, 30].map(d => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`rounded-lg px-3.5 py-2 text-[12px] font-bold transition-all ${
                    days === d
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {d}d
                </button>
              ))}
              <button
                onClick={() => refresh()}
                className="ml-1.5 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="flex gap-0.5 bg-slate-100 rounded-xl p-1 w-fit">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-semibold transition-all ${
                  tab === t.id
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <t.icon className="h-3.5 w-3.5" strokeWidth={2} />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-6 pt-6">
        {/* ── Loading ── */}
        {loading && !data && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-[130px]" />)}
            </div>
            <Skeleton className="h-[320px]" />
          </div>
        )}

        {/* ═══ OVERVIEW TAB ═══ */}
        {data && tab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              <KpiCard icon={Eye} label="Pageviews" value={fmtNum(data.overview.pageviews)} color={COLORS.blue} />
              <KpiCard icon={Users} label="Visitors" value={fmtNum(data.overview.visitors)} color={COLORS.green} />
              <KpiCard icon={Activity} label="Sessions" value={fmtNum(data.overview.sessions)} color={COLORS.purple} />
              <KpiCard icon={ArrowDownRight} label="Bounce" value={`${data.overview.bounceRate}%`} color={COLORS.red} />
              <KpiCard icon={MousePointerClick} label="Pages/Sess" value={String(data.overview.pagesPerSession)} color={COLORS.amber} />
              <KpiCard icon={Clock} label="Duration" value={fmtDuration(data.overview.avgDuration)} color={COLORS.cyan} />
            </div>

            {/* Traffic chart */}
            <Section title="Traffic" icon={TrendingUp}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.daily}>
                  <defs>
                    <linearGradient id="gPV" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.blue} stopOpacity={0.12} />
                      <stop offset="100%" stopColor={COLORS.blue} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gV" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.green} stopOpacity={0.12} />
                      <stop offset="100%" stopColor={COLORS.green} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false}
                    tickFormatter={v => new Date(v + "T00:00:00").toLocaleDateString("en", { month: "short", day: "numeric" })} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={32} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="pageviews" name="Pageviews" stroke={COLORS.blue} strokeWidth={2.5} fill="url(#gPV)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                  <Area type="monotone" dataKey="visitors" name="Visitors" stroke={COLORS.green} strokeWidth={2.5} fill="url(#gV)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-3">
                {([["Pageviews", COLORS.blue], ["Visitors", COLORS.green]] as const).map(([l, c]) => (
                  <div key={l} className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-sm" style={{ background: c }} />
                    <span className="text-[11px] text-slate-400 font-medium">{l}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* Heatmap */}
            <Section title="Activity heatmap" icon={Clock}>
              <Heatmap data={data.heatmap} />
            </Section>

            {/* Devices / Browsers / OS */}
            <div className="grid gap-4 md:grid-cols-3">
              <Section title="Devices" icon={Monitor}>
                {data.devices.map((d, i) => {
                  const pct = deviceTotal > 0 ? Math.round((d.users / deviceTotal) * 100) : 0;
                  return (
                    <div key={d.device} className="flex items-center gap-3 py-2">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center text-[11px] font-bold"
                        style={{ background: `${BAR_COLORS[i % BAR_COLORS.length]}14`, color: BAR_COLORS[i % BAR_COLORS.length] }}>
                        {pct}%
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[13px] font-medium text-slate-700 truncate">{d.device || "Unknown"}</span>
                          <span className="text-[12px] text-slate-400 tabular-nums">{d.users}</span>
                        </div>
                        <div className="h-1 w-full rounded-full bg-slate-100">
                          <div className="h-1 rounded-full" style={{ width: `${pct}%`, background: BAR_COLORS[i % BAR_COLORS.length] }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Section>
              <Section title="Browsers" icon={Globe}>
                {data.browsers.slice(0, 6).map((d, i) => (
                  <RankedRow key={d.browser} rank={i + 1} label={d.browser} value={d.users} maxValue={browserTotal} color={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Section>
              <Section title="Operating systems" icon={Smartphone}>
                {data.os.slice(0, 6).map((d, i) => (
                  <RankedRow key={d.os} rank={i + 1} label={d.os} value={d.users} maxValue={osTotal} color={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Section>
            </div>
          </div>
        )}

        {/* ═══ CONTENT TAB ═══ */}
        {data && tab === "content" && (
          <div className="space-y-6">
            <Section title="Top pages" icon={Eye}>
              {data.topPages.map((p, i) => (
                <RankedRow key={p.page} rank={i + 1} label={p.page} value={p.views}
                  maxValue={topMax} color={BAR_COLORS[i % BAR_COLORS.length]}
                  sub={`${p.unique}u`} />
              ))}
              {data.topPages.length === 0 && <p className="text-[13px] text-slate-400 py-8 text-center">No page data yet</p>}
            </Section>

            {/* Entry / Exit */}
            <div className="grid gap-4 md:grid-cols-2">
              <Section title="Entry pages" icon={LogIn}>
                {data.entryPages.map((p, i) => (
                  <div key={p.page} className="flex items-center justify-between py-2 px-1 rounded-lg hover:bg-slate-50/80 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-bold bg-emerald-50 text-emerald-600">{p.entries}</div>
                      <span className="text-[12px] text-slate-600 truncate">{p.page}</span>
                    </div>
                  </div>
                ))}
              </Section>
              <Section title="Exit pages" icon={LogOut}>
                {data.exitPages.map((p, i) => (
                  <div key={p.page} className="flex items-center justify-between py-2 px-1 rounded-lg hover:bg-slate-50/80 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-bold bg-red-50 text-red-500">{p.exits}</div>
                      <span className="text-[12px] text-slate-600 truncate">{p.page}</span>
                    </div>
                  </div>
                ))}
              </Section>
            </div>

            {/* Page Flows */}
            {data.pageFlows && data.pageFlows.length > 0 && (
              <Section title="Page flows" icon={Layers}>
                <div className="space-y-1.5">
                  {data.pageFlows.map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5 py-2 px-2 rounded-lg hover:bg-slate-50/80 transition-colors group">
                      <span className="text-[12px] text-slate-600 truncate flex-1 text-right">{f.from}</span>
                      <div className="flex items-center gap-1 flex-shrink-0 px-2">
                        <div className="w-6 h-[1.5px] bg-slate-300 group-hover:bg-blue-400 transition-colors" />
                        <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-blue-500 transition-colors" strokeWidth={2} />
                      </div>
                      <span className="text-[12px] text-slate-600 truncate flex-1">{f.to}</span>
                      <span className="text-[12px] font-bold text-slate-900 tabular-nums flex-shrink-0 ml-2 bg-slate-100 px-2 py-0.5 rounded-md">{f.count}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        )}

        {/* ═══ ACQUISITION TAB ═══ */}
        {data && tab === "acquisition" && (
          <div className="space-y-6">
            <Section title="Referrers" icon={ExternalLink}>
              {data.referrers.map((r, i) => (
                <RankedRow key={r.referrer} rank={i + 1} label={r.referrer} value={r.visits}
                  maxValue={data.referrers[0]?.visits || 1} color={BAR_COLORS[i % BAR_COLORS.length]}
                  sub={`${r.unique} unique`} />
              ))}
              {data.referrers.length === 0 && <p className="text-[13px] text-slate-400 py-8 text-center">No referrer data yet</p>}
            </Section>

            {/* Countries */}
            <Section title="Countries" icon={Globe}>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {data.countries.map((c, i) => (
                  <div key={c.code} className="flex items-center gap-3 rounded-xl bg-slate-50/80 px-4 py-3 hover:bg-slate-100/80 transition-colors">
                    <span className="text-[18px]">{FLAGS[c.code] || "🌍"}</span>
                    <span className="text-[13px] text-slate-700 font-medium flex-1">{c.name}</span>
                    <span className="text-[14px] font-bold text-slate-900 tabular-nums">{c.visitors}</span>
                  </div>
                ))}
                {data.countries.length === 0 && <p className="text-[13px] text-slate-400 py-8 text-center col-span-3">No country data yet</p>}
              </div>
            </Section>

            {/* UTM */}
            {data.utm.length > 0 && (
              <Section title="UTM campaigns" icon={BarChart3}>
                {data.utm.map((u, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                    <div className="min-w-0 flex-1 flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-slate-700">{u.source}</span>
                      {u.medium && <span className="text-[11px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{u.medium}</span>}
                      {u.campaign && <span className="text-[11px] text-purple-500 bg-purple-50 px-1.5 py-0.5 rounded">{u.campaign}</span>}
                    </div>
                    <span className="text-[13px] font-bold text-slate-900 tabular-nums ml-3">{u.visitors}</span>
                  </div>
                ))}
              </Section>
            )}
          </div>
        )}

        {/* ═══ SESSIONS TAB ═══ */}
        {data && tab === "sessions" && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <KpiCard icon={Activity} label="Sessions" value={fmtNum(data.overview.sessions)} color={COLORS.purple} />
              <KpiCard icon={ArrowDownRight} label="Bounce rate" value={`${data.overview.bounceRate}%`} sub="Single-page sessions" color={COLORS.red} />
              <KpiCard icon={Clock} label="Avg duration" value={fmtDuration(data.overview.avgDuration)} sub={`${data.overview.pagesPerSession} pages per session`} color={COLORS.cyan} />
            </div>

            <Section title="Sessions by device" icon={Monitor}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.devices.map(d => ({ name: d.device || "Unknown", sessions: d.users }))} barSize={40}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={32} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="sessions" name="Sessions" radius={[8, 8, 0, 0]}>
                    {data.devices.map((_, i) => (
                      <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} opacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Section>

            <div className="grid gap-4 md:grid-cols-2">
              <Section title="Browsers" icon={Globe}>
                {data.browsers.map((d, i) => (
                  <RankedRow key={d.browser} rank={i + 1} label={d.browser} value={d.users} maxValue={browserTotal} color={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Section>
              <Section title="Operating systems" icon={Smartphone}>
                {data.os.map((d, i) => (
                  <RankedRow key={d.os} rank={i + 1} label={d.os} value={d.users} maxValue={osTotal} color={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Section>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-[11px] text-slate-300 mt-10 font-medium">
          PostHog EU · Last {days} days ·{" "}
          <button onClick={() => refresh()} className="underline hover:text-slate-400 transition-colors">Refresh</button>
        </p>
      </div>
    </div>
  );
}
