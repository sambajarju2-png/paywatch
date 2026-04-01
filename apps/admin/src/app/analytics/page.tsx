"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";
import {
  Eye, Users, Globe, Monitor, Smartphone, Tablet,
  Activity, RefreshCw, ArrowRight, Clock, MousePointerClick,
  TrendingUp, BarChart3, Zap, ArrowDown, ArrowUp,
  LogIn, LogOut,
} from "lucide-react";

/* ── Types ── */
interface Analytics {
  live: number;
  livePages: { path: string; visitors: number }[];
  overview: {
    total_views: number; unique_sessions: number; unique_visitors: number;
    today_views: number; today_sessions: number; bounce_rate: number;
    avg_pages_per_session: number; avg_session_duration_sec: number;
    new_visitors: number; returning_visitors: number;
  };
  chart: { day: string; views: number; visitors: number }[];
  topPages: { path: string; views: number; visitors: number }[];
  entryPages: { path: string; sessions: number }[];
  exitPages: { path: string; sessions: number }[];
  referrers: { referrer: string; views: number }[];
  devices: { device_type: string; count: number }[];
  browsers: { browser: string; count: number }[];
  utm: { source: string; medium: string; campaign: string; visits: number }[];
  countries: { country: string; visitors: number }[];
  pageFlow: { from_page: string; to_page: string; transitions: number }[];
  events: { event_name: string; count: number }[];
  scrollDepth: { path: string; avg_depth: number; samples: number }[];
}

const C = {
  blue: "#2563EB", green: "#059669", amber: "#D97706",
  red: "#DC2626", purple: "#7C3AED", navy: "#0A2540",
  muted: "#64748B", cyan: "#0891B2",
};

const PIE_COLORS = [C.blue, C.green, C.amber, C.purple, C.cyan, C.red];

const COUNTRY_FLAGS: Record<string, string> = {
  NL: "🇳🇱", DE: "🇩🇪", BE: "🇧🇪", US: "🇺🇸", GB: "🇬🇧",
  FR: "🇫🇷", ES: "🇪🇸", IT: "🇮🇹", PL: "🇵🇱", SE: "🇸🇪",
  NO: "🇳🇴", DK: "🇩🇰", AT: "🇦🇹", CH: "🇨🇭", PT: "🇵🇹",
  IE: "🇮🇪", FI: "🇫🇮", CZ: "🇨🇿", RO: "🇷🇴", HU: "🇭🇺",
};

const DEVICE_ICON: Record<string, React.ReactNode> = {
  desktop: <Monitor className="w-4 h-4" />,
  mobile: <Smartphone className="w-4 h-4" />,
  tablet: <Tablet className="w-4 h-4" />,
};

const TABS = [
  { id: "overview", label: "Overzicht", icon: BarChart3 },
  { id: "content", label: "Content", icon: Eye },
  { id: "acquisition", label: "Acquisitie", icon: TrendingUp },
  { id: "behavior", label: "Gedrag", icon: MousePointerClick },
];

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [period, setPeriod] = useState<"24h" | "7d" | "30d">("7d");
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/analytics?period=${period}`);
      if (res.ok) { setData(await res.json()); setLastRefresh(new Date()); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [period]);

  useEffect(() => { setLoading(true); fetchData(); }, [fetchData]);
  useEffect(() => { const i = setInterval(fetchData, 30_000); return () => clearInterval(i); }, [fetchData]);

  if (loading && !data) return <Loading />;
  if (!data) return null;

  const o = data.overview;
  const fmtDay = (d: string) => new Date(d).toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
  const fmtDur = (s: number) => s < 60 ? `${Math.round(s)}s` : `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`;

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Website Analytics</h1>
          <p className="text-sm text-gray-400 mt-0.5">paywatch.app &middot; {lastRefresh.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchData} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"><RefreshCw className="w-4 h-4 text-gray-500" /></button>
          {(["24h", "7d", "30d"] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${period === p ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
            >{p === "24h" ? "24 uur" : p === "7d" ? "7 dagen" : "30 dagen"}</button>
          ))}
        </div>
      </div>

      {/* Live banner */}
      <div className="flex items-center gap-3 p-3 rounded-xl border border-green-200 bg-green-50">
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-bold text-green-800">{data.live} live bezoeker{data.live !== 1 ? "s" : ""}</span>
        </span>
        {data.livePages.length > 0 && (
          <span className="text-xs text-green-600 ml-2">
            op {data.livePages.map(p => p.path).slice(0, 3).join(", ")}
          </span>
        )}
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Metric label="Weergaven" value={o.total_views} icon={<Eye className="w-4 h-4" />} color="blue" />
        <Metric label="Bezoekers" value={o.unique_visitors || o.unique_sessions} icon={<Users className="w-4 h-4" />} color="purple" />
        <Metric label="Vandaag" value={o.today_views} sub={`${o.today_sessions} sessies`} icon={<Zap className="w-4 h-4" />} color="amber" />
        <Metric label="Bounce rate" value={`${o.bounce_rate}%`} icon={<ArrowDown className="w-4 h-4" />} color={Number(o.bounce_rate) > 70 ? "red" : "green"} />
        <Metric label="Pagina's/sessie" value={o.avg_pages_per_session} icon={<BarChart3 className="w-4 h-4" />} color="cyan" />
        <Metric label="Gem. duur" value={fmtDur(Number(o.avg_session_duration_sec))} icon={<Clock className="w-4 h-4" />} color="navy" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-gray-100">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${tab === t.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            <t.icon className="w-4 h-4" />{t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "overview" && <OverviewTab data={data} fmtDay={fmtDay} />}
      {tab === "content" && <ContentTab data={data} />}
      {tab === "acquisition" && <AcquisitionTab data={data} />}
      {tab === "behavior" && <BehaviorTab data={data} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: OVERVIEW
   ═══════════════════════════════════════════════════════ */
function OverviewTab({ data, fmtDay }: { data: Analytics; fmtDay: (d: string) => string }) {
  return (
    <div className="space-y-4">
      {/* Chart */}
      <Card title="Verkeer over tijd">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data.chart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" tickFormatter={fmtDay} fontSize={12} tick={{ fill: C.muted }} axisLine={false} tickLine={false} />
            <YAxis fontSize={12} tick={{ fill: C.muted }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip labelFormatter={v => new Date(v).toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" })}
              contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }} />
            <Line type="monotone" dataKey="views" stroke={C.blue} strokeWidth={2.5} dot={{ r: 3 }} name="Weergaven" />
            <Line type="monotone" dataKey="visitors" stroke={C.green} strokeWidth={2} dot={{ r: 3 }} name="Bezoekers" strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Top pages */}
        <Card title="Top pagina's" className="lg:col-span-1">
          <RankList items={data.topPages.slice(0, 10).map(p => ({ label: p.path, value: p.views, sub: `${p.visitors} uniek` }))} />
        </Card>
        {/* Referrers */}
        <Card title="Referrers" className="lg:col-span-1">
          <BarList items={data.referrers.slice(0, 8)} labelKey="referrer" valueKey="views" />
        </Card>
        {/* Countries */}
        <Card title="Landen" className="lg:col-span-1">
          <div className="space-y-2">
            {data.countries.slice(0, 8).map(c => (
              <div key={c.country} className="flex items-center gap-2 text-sm">
                <span className="text-base">{COUNTRY_FLAGS[c.country] || "🌍"}</span>
                <span className="flex-1 text-gray-700">{c.country}</span>
                <span className="font-semibold tabular-nums text-gray-900">{c.visitors}</span>
              </div>
            ))}
            {data.countries.length === 0 && <Empty />}
          </div>
        </Card>
      </div>

      {/* New vs returning */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card title="Nieuw vs. terugkerend">
          <div className="flex gap-6 items-center">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie data={[
                  { name: "Nieuw", value: data.overview.new_visitors || 0 },
                  { name: "Terugkerend", value: data.overview.returning_visitors || 0 },
                ]} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" strokeWidth={0}>
                  <Cell fill={C.blue} /><Cell fill={C.green} />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-600" /><span className="text-sm text-gray-700">Nieuw: <b>{data.overview.new_visitors}</b></span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-600" /><span className="text-sm text-gray-700">Terugkerend: <b>{data.overview.returning_visitors}</b></span></div>
            </div>
          </div>
        </Card>
        <Card title="Apparaten &amp; Browsers">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Apparaat</p>
              {data.devices.map(d => {
                const total = data.devices.reduce((s, x) => s + x.count, 0) || 1;
                return (
                  <div key={d.device_type} className="flex items-center gap-2 text-sm">
                    {DEVICE_ICON[d.device_type] || <Monitor className="w-4 h-4" />}
                    <span className="flex-1 capitalize text-gray-700">{d.device_type}</span>
                    <span className="font-semibold tabular-nums">{Math.round(d.count / total * 100)}%</span>
                  </div>
                );
              })}
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Browser</p>
              {data.browsers.slice(0, 5).map(b => (
                <div key={b.browser} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{b.browser}</span>
                  <span className="font-semibold tabular-nums">{b.count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: CONTENT
   ═══════════════════════════════════════════════════════ */
function ContentTab({ data }: { data: Analytics }) {
  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-2 gap-4">
        <Card title="Entry pagina's" sub="Eerste pagina van een sessie" icon={<LogIn className="w-4 h-4 text-green-600" />}>
          <RankList items={data.entryPages.map(p => ({ label: p.path, value: p.sessions }))} />
        </Card>
        <Card title="Exit pagina's" sub="Laatste pagina voor vertrek" icon={<LogOut className="w-4 h-4 text-red-500" />}>
          <RankList items={data.exitPages.map(p => ({ label: p.path, value: p.sessions }))} color="red" />
        </Card>
      </div>

      <Card title="Scroll diepte per pagina" sub="Hoe ver lezen bezoekers gemiddeld">
        {data.scrollDepth.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.scrollDepth} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} fontSize={12} tick={{ fill: C.muted }} />
              <YAxis type="category" dataKey="path" width={180} fontSize={11} tick={{ fill: C.muted }} />
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }} />
              <Bar dataKey="avg_depth" fill={C.blue} radius={[0, 4, 4, 0]} name="Gem. scroll %" />
            </BarChart>
          </ResponsiveContainer>
        ) : <Empty text="Nog geen scroll data — komt vanzelf als bezoekers pagina's scrollen" />}
      </Card>

      <Card title="Alle pagina's">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 text-xs font-semibold text-gray-400 uppercase">#</th>
                <th className="text-left py-2 text-xs font-semibold text-gray-400 uppercase">Pagina</th>
                <th className="text-right py-2 text-xs font-semibold text-gray-400 uppercase">Weergaven</th>
                <th className="text-right py-2 text-xs font-semibold text-gray-400 uppercase">Uniek</th>
              </tr>
            </thead>
            <tbody>
              {data.topPages.map((p, i) => (
                <tr key={p.path} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2 text-gray-400 w-8">{i + 1}</td>
                  <td className="py-2 text-gray-700 font-mono text-xs">{p.path}</td>
                  <td className="py-2 text-right font-semibold tabular-nums">{p.views}</td>
                  <td className="py-2 text-right text-gray-500 tabular-nums">{p.visitors}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.topPages.length === 0 && <Empty />}
        </div>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: ACQUISITION
   ═══════════════════════════════════════════════════════ */
function AcquisitionTab({ data }: { data: Analytics }) {
  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-2 gap-4">
        <Card title="Referrers">
          <BarList items={data.referrers} labelKey="referrer" valueKey="views" />
        </Card>
        <Card title="Landen">
          <div className="space-y-2.5">
            {data.countries.map(c => {
              const max = data.countries[0]?.visitors || 1;
              return (
                <div key={c.country} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span>{COUNTRY_FLAGS[c.country] || "🌍"}</span>
                      <span className="text-gray-700">{c.country}</span>
                    </span>
                    <span className="font-semibold tabular-nums">{c.visitors}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-purple-500" style={{ width: `${(c.visitors / max) * 100}%` }} />
                  </div>
                </div>
              );
            })}
            {data.countries.length === 0 && <Empty />}
          </div>
        </Card>
      </div>

      <Card title="UTM Campagnes" sub="Verkeer via utm_source / utm_medium / utm_campaign">
        {data.utm.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-xs font-semibold text-gray-400 uppercase">Source</th>
                  <th className="text-left py-2 text-xs font-semibold text-gray-400 uppercase">Medium</th>
                  <th className="text-left py-2 text-xs font-semibold text-gray-400 uppercase">Campaign</th>
                  <th className="text-right py-2 text-xs font-semibold text-gray-400 uppercase">Sessies</th>
                </tr>
              </thead>
              <tbody>
                {data.utm.map((u, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 text-gray-700">{u.source}</td>
                    <td className="py-2 text-gray-500">{u.medium}</td>
                    <td className="py-2 text-gray-500">{u.campaign}</td>
                    <td className="py-2 text-right font-semibold tabular-nums">{u.visits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <Empty text="Nog geen UTM data — voeg ?utm_source=...&utm_medium=... toe aan je links" />}
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: BEHAVIOR
   ═══════════════════════════════════════════════════════ */
function BehaviorTab({ data }: { data: Analytics }) {
  return (
    <div className="space-y-4">
      <Card title="Paginastromen" sub="Hoe bezoekers door je site navigeren">
        {data.pageFlow.length > 0 ? (
          <div className="space-y-2">
            {data.pageFlow.slice(0, 12).map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm py-1.5 border-b border-gray-50">
                <span className="font-mono text-xs text-gray-600 truncate max-w-[180px]">{f.from_page}</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span className="font-mono text-xs text-gray-600 truncate max-w-[180px]">{f.to_page}</span>
                <span className="ml-auto font-semibold tabular-nums text-gray-900">{f.transitions}</span>
              </div>
            ))}
          </div>
        ) : <Empty text="Nog geen flow data — verschijnt als bezoekers meerdere pagina's bekijken" />}
      </Card>

      <Card title="CTA &amp; Click Events" sub="Klikken op knoppen, externe links en CTA's">
        {data.events.length > 0 ? (
          <div className="space-y-2">
            {data.events.map(e => {
              const max = data.events[0]?.count || 1;
              const isCta = e.event_name.startsWith("cta:");
              const isOutbound = e.event_name.startsWith("outbound:");
              return (
                <div key={e.event_name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      {isCta && <MousePointerClick className="w-3.5 h-3.5 text-blue-500" />}
                      {isOutbound && <ArrowUp className="w-3.5 h-3.5 text-amber-500" />}
                      {!isCta && !isOutbound && <Zap className="w-3.5 h-3.5 text-purple-500" />}
                      <span className="text-gray-700 text-xs truncate max-w-[300px]">
                        {e.event_name.replace(/^(cta|outbound):/, "")}
                      </span>
                    </span>
                    <span className="font-semibold tabular-nums">{e.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${(e.count / max) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : <Empty text="Nog geen click events — verschijnt als bezoekers op CTA's klikken" />}
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card title="Live bezoekers" sub="Actieve pagina's in de laatste 5 minuten">
          {data.livePages.length > 0 ? (
            <div className="space-y-2">
              {data.livePages.map(p => (
                <div key={p.path} className="flex items-center gap-2 text-sm">
                  <Activity className="w-3.5 h-3.5 text-green-500" />
                  <span className="font-mono text-xs text-gray-700 flex-1 truncate">{p.path}</span>
                  <span className="font-semibold tabular-nums">{p.visitors}</span>
                </div>
              ))}
            </div>
          ) : <Empty text="Geen live bezoekers op dit moment" />}
        </Card>
        <Card title="Scroll diepte" sub="Hoe ver lezen bezoekers gemiddeld">
          {data.scrollDepth.length > 0 ? (
            <div className="space-y-2">
              {data.scrollDepth.map(s => (
                <div key={s.path} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-mono text-xs text-gray-600 truncate max-w-[200px]">{s.path}</span>
                    <span className="font-semibold tabular-nums">{s.avg_depth}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-green-500" style={{ width: `${s.avg_depth}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : <Empty text="Nog geen scroll data" />}
        </Card>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════════════════ */
function Card({ title, sub, icon, className, children }: {
  title: string; sub?: string; icon?: React.ReactNode; className?: string; children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-5 ${className || ""}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          {sub && <p className="text-xs text-gray-400">{sub}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function Metric({ label, value, sub, icon, color }: {
  label: string; value: string | number; sub?: string; icon: React.ReactNode;
  color: "blue" | "green" | "amber" | "red" | "purple" | "navy" | "cyan";
}) {
  const bg: Record<string, string> = { blue: "bg-blue-50 text-blue-600", green: "bg-green-50 text-green-600", amber: "bg-amber-50 text-amber-600", red: "bg-red-50 text-red-600", purple: "bg-purple-50 text-purple-600", navy: "bg-slate-100 text-slate-700", cyan: "bg-cyan-50 text-cyan-600" };
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3.5">
      <div className={`w-8 h-8 rounded-lg ${bg[color]} flex items-center justify-center mb-2`}>{icon}</div>
      <p className="text-xl font-bold text-gray-900 tabular-nums">{typeof value === "number" ? value.toLocaleString("nl-NL") : value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

function RankList({ items, color = "blue" }: { items: { label: string; value: number; sub?: string }[]; color?: string }) {
  const max = items[0]?.value || 1;
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={item.label} className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-xs text-gray-400 w-5">{i + 1}</span>
            <span className="flex-1 font-mono text-xs text-gray-700 truncate">{item.label}</span>
            <span className="font-semibold tabular-nums text-gray-900">{item.value}</span>
            {item.sub && <span className="text-xs text-gray-400">{item.sub}</span>}
          </div>
          <div className="h-1 rounded-full bg-gray-100 overflow-hidden ml-7">
            <div className={`h-full rounded-full ${color === "red" ? "bg-red-400" : "bg-blue-400"}`} style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
      {items.length === 0 && <Empty />}
    </div>
  );
}

function BarList({ items, labelKey, valueKey }: { items: Record<string, unknown>[]; labelKey: string; valueKey: string }) {
  const max = Number(items[0]?.[valueKey]) || 1;
  return (
    <div className="space-y-2.5">
      {items.map(r => (
        <div key={String(r[labelKey])} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700 text-xs truncate">{String(r[labelKey])}</span>
            <span className="font-semibold tabular-nums ml-2">{Number(r[valueKey])}</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full rounded-full bg-blue-500" style={{ width: `${(Number(r[valueKey]) / max) * 100}%` }} />
          </div>
        </div>
      ))}
      {items.length === 0 && <Empty />}
    </div>
  );
}

function Empty({ text = "Nog geen data" }: { text?: string }) {
  return <p className="text-sm text-gray-400 py-4 text-center">{text}</p>;
}

function Loading() {
  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">Website Analytics</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-24 rounded-xl border border-gray-200 bg-white animate-pulse" />)}
      </div>
      <div className="h-80 rounded-xl border border-gray-200 bg-white animate-pulse" />
    </div>
  );
}
