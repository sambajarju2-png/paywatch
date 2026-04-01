"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  Eye,
  Users,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Activity,
  RefreshCw,
} from "lucide-react";

interface AnalyticsData {
  live: number;
  overview: {
    total_views: number;
    unique_sessions: number;
    today_views: number;
    today_sessions: number;
  };
  chart: { day: string; views: number; visitors: number }[];
  topPages: { path: string; views: number; visitors: number }[];
  topReferrers: { referrer: string; views: number }[];
  devices: { device_type: string; count: number }[];
}

const COLORS = {
  blue: "#2563EB",
  green: "#059669",
  amber: "#D97706",
  red: "#DC2626",
  purple: "#7C3AED",
  navy: "#0A2540",
  muted: "#64748B",
};

const DEVICE_ICON: Record<string, React.ReactNode> = {
  desktop: <Monitor className="w-4 h-4" />,
  mobile: <Smartphone className="w-4 h-4" />,
  tablet: <Tablet className="w-4 h-4" />,
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState<"7d" | "30d">("7d");
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/analytics?period=${period}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setLastRefresh(new Date());
      }
    } catch (e) {
      console.error("Analytics fetch failed:", e);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  // Auto-refresh live count every 30s
  useEffect(() => {
    const interval = setInterval(fetchData, 30_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading && !data) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Website Analytics
        </h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 rounded-xl border border-gray-200 bg-white animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const formatDay = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Website Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1">paywatch.app</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            {lastRefresh.toLocaleTimeString("nl-NL", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <button
            onClick={fetchData}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            title="Vernieuwen"
          >
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => setPeriod("7d")}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                period === "7d"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              7 dagen
            </button>
            <button
              onClick={() => setPeriod("30d")}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                period === "30d"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              30 dagen
            </button>
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Live bezoekers"
          value={data.live}
          icon={<Activity className="w-5 h-5" />}
          color="green"
          pulse
        />
        <MetricCard
          label="Vandaag"
          value={data.overview.today_views}
          sub={`${data.overview.today_sessions} uniek`}
          icon={<Eye className="w-5 h-5" />}
          color="blue"
        />
        <MetricCard
          label={`Totaal (${period === "7d" ? "7d" : "30d"})`}
          value={data.overview.total_views}
          sub={`${data.overview.unique_sessions} unieke bezoekers`}
          icon={<Users className="w-5 h-5" />}
          color="purple"
        />
        <MetricCard
          label="Landen"
          value={data.devices.length}
          sub="apparaattypen"
          icon={<Globe className="w-5 h-5" />}
          color="amber"
        />
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          Paginaweergaven
        </h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data.chart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="day"
              tickFormatter={formatDay}
              fontSize={12}
              tick={{ fill: COLORS.muted }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              fontSize={12}
              tick={{ fill: COLORS.muted }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              labelFormatter={(v) =>
                new Date(v).toLocaleDateString("nl-NL", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })
              }
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                fontSize: 13,
              }}
            />
            <Line
              type="monotone"
              dataKey="views"
              stroke={COLORS.blue}
              strokeWidth={2}
              dot={{ r: 3, fill: COLORS.blue }}
              name="Weergaven"
            />
            <Line
              type="monotone"
              dataKey="visitors"
              stroke={COLORS.green}
              strokeWidth={2}
              dot={{ r: 3, fill: COLORS.green }}
              name="Bezoekers"
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom row: Top pages + Referrers + Devices */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Top pages */}
        <div className="lg:col-span-1 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">
            Top pagina&apos;s
          </h2>
          <div className="space-y-2">
            {data.topPages.slice(0, 10).map((p, i) => (
              <div key={p.path} className="flex items-center gap-2 text-sm">
                <span className="text-xs text-gray-400 w-5">{i + 1}</span>
                <span className="flex-1 truncate text-gray-700 font-mono text-xs">
                  {p.path}
                </span>
                <span className="text-gray-900 font-semibold tabular-nums">
                  {p.views}
                </span>
              </div>
            ))}
            {data.topPages.length === 0 && (
              <p className="text-sm text-gray-400">Nog geen data</p>
            )}
          </div>
        </div>

        {/* Referrers */}
        <div className="lg:col-span-1 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">
            Referrers
          </h2>
          <div className="space-y-2">
            {data.topReferrers.slice(0, 8).map((r) => {
              const maxViews = data.topReferrers[0]?.views || 1;
              const pct = Math.round((r.views / maxViews) * 100);
              return (
                <div key={r.referrer} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate text-gray-700 text-xs">
                      {r.referrer}
                    </span>
                    <span className="text-gray-900 font-semibold tabular-nums ml-2">
                      {r.views}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {data.topReferrers.length === 0 && (
              <p className="text-sm text-gray-400">Nog geen data</p>
            )}
          </div>
        </div>

        {/* Devices */}
        <div className="lg:col-span-1 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">
            Apparaten
          </h2>
          <div className="space-y-3">
            {data.devices.map((d) => {
              const total = data.devices.reduce((s, x) => s + x.count, 0) || 1;
              const pct = Math.round((d.count / total) * 100);
              return (
                <div key={d.device_type} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                    {DEVICE_ICON[d.device_type] || (
                      <Monitor className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 capitalize">
                        {d.device_type}
                      </span>
                      <span className="text-gray-900 font-semibold tabular-nums">
                        {pct}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden mt-1">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background:
                            d.device_type === "mobile"
                              ? COLORS.blue
                              : d.device_type === "tablet"
                              ? COLORS.amber
                              : COLORS.green,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            {data.devices.length === 0 && (
              <p className="text-sm text-gray-400">Nog geen data</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Metric card component ── */
function MetricCard({
  label,
  value,
  sub,
  icon,
  color,
  pulse,
}: {
  label: string;
  value: number;
  sub?: string;
  icon: React.ReactNode;
  color: "blue" | "green" | "purple" | "amber";
  pulse?: boolean;
}) {
  const colorMap = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
    green: { bg: "bg-green-50", text: "text-green-600", dot: "bg-green-500" },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      dot: "bg-purple-500",
    },
    amber: { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-500" },
  };
  const c = colorMap[color];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center ${c.text}`}
        >
          {icon}
        </div>
        {pulse && (
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${c.dot} animate-pulse`} />
            <span className="text-xs text-gray-400">live</span>
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 tabular-nums">
        {value.toLocaleString("nl-NL")}
      </p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}
