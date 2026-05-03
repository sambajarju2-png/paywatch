"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users, Send, Eye, MessageSquare, AlertTriangle, ArrowUpRight,
  RefreshCw, Loader2, TrendingUp, Mail, CheckCircle2, Inbox,
} from "lucide-react";

interface Stats {
  totalContacts: number;
  totalSent: number;
  totalOpened: number;
  totalReplied: number;
  totalBounced: number;
  openRate: number;
  replyRate: number;
  bounceRate: number;
  activeCampaigns: Campaign[];
  recentReplies: Reply[];
  accounts: Account[];
}

interface Campaign {
  id: string;
  name: string;
  status: string;
  total_contacts: number;
  total_sent: number;
  total_opened: number;
  total_replied: number;
}

interface Reply {
  id: string;
  to_name: string;
  to_email: string;
  subject: string;
  replied_at: string;
  campaign_name: string;
  contact_id?: string;
  contact_name?: string;
  reply_from?: string;
  from_email?: string;
}

interface Account {
  id: string;
  email: string;
  display_name: string;
  domain: string;
  daily_limit: number;
  warmup_start_date: string;
  is_active: boolean;
  today_sent: number;
}

function relativeTime(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}u`;
  return `${Math.floor(hrs / 24)}d`;
}

export default function OutreachOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/outreach/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      setStats(data);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  if (loading && !stats) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="grid grid-cols-5 gap-3">
          {[0,1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-[#E2E8F0] p-5 h-24">
              <div className="h-3 w-20 rounded bg-[#F1F5F9] mb-3" />
              <div className="h-7 w-12 rounded bg-[#F1F5F9]" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-white rounded-2xl border border-[#E2E8F0] h-48" />
          <div className="bg-white rounded-2xl border border-[#E2E8F0] h-48" />
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="mx-auto mb-3 text-red-400" size={24} />
        <p className="text-sm text-[#64748B] mb-3">{error}</p>
        <button onClick={fetchStats} className="text-xs font-semibold text-[#2563EB] hover:underline">
          Opnieuw proberen
        </button>
      </div>
    );
  }

  const s = stats!;

  const kpis = [
    { label: "Contacten", value: s.totalContacts.toLocaleString(), icon: Users, color: "text-[#2563EB]", bg: "bg-blue-50", trend: null },
    { label: "Verzonden", value: s.totalSent.toLocaleString(), icon: Send, color: "text-purple-600", bg: "bg-purple-50", trend: null },
    { label: "Open rate", value: `${s.openRate}%`, icon: Eye, color: "text-[#D97706]", bg: "bg-amber-50", trend: s.openRate > 30 ? "good" : s.openRate > 15 ? "ok" : "bad" },
    { label: "Reply rate", value: `${s.replyRate}%`, icon: MessageSquare, color: "text-[#059669]", bg: "bg-green-50", trend: s.replyRate > 10 ? "good" : s.replyRate > 5 ? "ok" : "bad" },
    { label: "Bounce rate", value: `${s.bounceRate}%`, icon: AlertTriangle, color: "text-[#DC2626]", bg: "bg-red-50", trend: s.bounceRate < 2 ? "good" : s.bounceRate < 5 ? "ok" : "bad" },
  ];

  const trendColor = (t: string | null) => t === "good" ? "text-[#059669]" : t === "ok" ? "text-[#D97706]" : t === "bad" ? "text-[#DC2626]" : "";
  const trendIcon = (t: string | null) => t === "good" ? "↑" : t === "bad" ? "↓" : "";

  return (
    <div className="space-y-5">
      {/* Refresh */}
      <div className="flex justify-end">
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#0A2540] transition-colors"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-5 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-5 hover:border-[#2563EB]/20 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-medium text-[#64748B] uppercase tracking-wide">{k.label}</span>
              <div className={`w-7 h-7 rounded-lg ${k.bg} flex items-center justify-center shrink-0`}>
                <k.icon size={13} className={k.color} />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-[28px] font-extrabold text-[#0A2540] tracking-tight leading-none">{k.value}</span>
              {k.trend && (
                <span className={`text-[11px] font-bold mb-0.5 ${trendColor(k.trend)}`}>{trendIcon(k.trend)}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Active campaigns — 2/3 width */}
        <div className="col-span-2 bg-white rounded-2xl border border-[#E2E8F0] p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Send size={15} className="text-[#2563EB]" />
              <h2 className="text-[14px] font-bold text-[#0A2540]">Actieve campagnes</h2>
            </div>
            <a href="/outreach/campaigns" className="flex items-center gap-0.5 text-[11px] font-semibold text-[#2563EB] hover:underline">
              Bekijk alle <ArrowUpRight size={10} />
            </a>
          </div>
          {s.activeCampaigns.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <Send size={28} className="text-[#E2E8F0] mb-2" />
              <p className="text-xs text-[#64748B]">Geen actieve campagnes</p>
            </div>
          ) : (
            <div className="space-y-4">
              {s.activeCampaigns.map((c) => {
                const sentPct = c.total_contacts > 0 ? Math.round((c.total_sent / c.total_contacts) * 100) : 0;
                const openPct = c.total_sent > 0 ? Math.round((c.total_opened / c.total_sent) * 100) : 0;
                const replyPct = c.total_sent > 0 ? Math.round((c.total_replied / c.total_sent) * 100) : 0;
                return (
                  <div key={c.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-semibold text-[#0A2540] truncate">{c.name}</span>
                      <span className="text-[11px] text-[#64748B] ml-2 shrink-0">{c.total_sent}/{c.total_contacts} verzonden</span>
                    </div>
                    <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-[#2563EB] rounded-full transition-all" style={{ width: `${sentPct}%` }} />
                    </div>
                    <div className="flex gap-4">
                      <span className="text-[11px] text-[#64748B] flex items-center gap-1">
                        <Eye size={10} className="text-[#D97706]" /> {c.total_opened} open ({openPct}%)
                      </span>
                      <span className="text-[11px] text-[#059669] font-medium flex items-center gap-1">
                        <MessageSquare size={10} /> {c.total_replied} replies ({replyPct}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Replies — 1/3 width */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Inbox size={15} className="text-[#059669]" />
            <h2 className="text-[14px] font-bold text-[#0A2540]">Recente antwoorden</h2>
          </div>
          {s.recentReplies.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <MessageSquare size={28} className="text-[#E2E8F0] mb-2" />
              <p className="text-xs text-[#64748B]">Nog geen antwoorden</p>
            </div>
          ) : (
            <div className="space-y-2">
              {s.recentReplies.map((r) => (
                <div key={r.id} className="flex items-start gap-3 p-2.5 rounded-xl bg-[#F0FDF4] border border-green-100 hover:border-green-200 transition-all">
                  <div className="w-7 h-7 rounded-full bg-[#059669]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageSquare size={11} className="text-[#059669]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {r.contact_id ? (
                      <a href={`/outreach/contacts/${r.contact_id}`} className="text-[12px] font-semibold text-[#2563EB] hover:underline truncate block">
                        {r.contact_name || r.to_name || r.to_email}
                      </a>
                    ) : (
                      <p className="text-[12px] font-semibold text-[#0A2540] truncate">{r.contact_name || r.to_name || r.to_email}</p>
                    )}
                    <p className="text-[10px] text-[#64748B] truncate">Re: {r.subject}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {r.replied_at && (
                        <span className="text-[10px] text-[#94A3B8]">{relativeTime(r.replied_at)} geleden</span>
                      )}
                      {r.from_email && (
                        <span className="text-[10px] text-[#94A3B8] truncate">via {r.from_email}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <a href="/outreach/inbox" className="flex items-center justify-center gap-1 py-2 text-[11px] font-semibold text-[#2563EB] hover:underline mt-1">
                Bekijk inbox <ArrowUpRight size={10} />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={14} className="text-[#059669]" />
            <h3 className="text-[13px] font-semibold text-[#0A2540]">Deliverability</h3>
          </div>
          <div className="space-y-2">
            {[
              { label: "Afgeleverd", value: s.totalSent - s.totalBounced, pct: s.totalSent > 0 ? Math.round(((s.totalSent - s.totalBounced) / s.totalSent) * 100) : 0, color: "#059669" },
              { label: "Geopend", value: s.totalOpened, pct: s.totalSent > 0 ? Math.round((s.totalOpened / s.totalSent) * 100) : 0, color: "#D97706" },
              { label: "Bounce", value: s.totalBounced, pct: s.totalSent > 0 ? Math.round((s.totalBounced / s.totalSent) * 100) : 0, color: "#DC2626" },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-[11px] text-[#64748B]">{row.label}</span>
                  <span className="text-[11px] font-semibold text-[#0A2540]">{row.value} ({row.pct}%)</span>
                </div>
                <div className="h-1.5 bg-[#F1F5F9] rounded-full">
                  <div className="h-full rounded-full" style={{ width: `${row.pct}%`, background: row.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} className="text-[#2563EB]" />
            <h3 className="text-[13px] font-semibold text-[#0A2540]">Engagement</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: "Open rate", value: `${s.openRate}%`, benchmark: "25%", good: s.openRate >= 25 },
              { label: "Reply rate", value: `${s.replyRate}%`, benchmark: "8%", good: s.replyRate >= 8 },
              { label: "Bounce rate", value: `${s.bounceRate}%`, benchmark: "<2%", good: s.bounceRate < 2 },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-[12px] text-[#64748B]">{row.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#94A3B8]">bench: {row.benchmark}</span>
                  <span className={`text-[13px] font-bold ${row.good ? "text-[#059669]" : "text-[#DC2626]"}`}>{row.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
          <div className="flex items-center gap-2 mb-3">
            <Mail size={14} className="text-[#7C3AED]" />
            <h3 className="text-[13px] font-semibold text-[#0A2540]">Verzendscore</h3>
          </div>
          <div className="flex items-center justify-center h-[80px]">
            <div className="text-center">
              <div className={`text-[48px] font-extrabold tracking-tight leading-none ${
                s.openRate > 30 && s.bounceRate < 2 ? "text-[#059669]" :
                s.openRate > 15 || s.bounceRate < 5 ? "text-[#D97706]" : "text-[#DC2626]"
              }`}>
                {s.openRate > 30 && s.bounceRate < 2 ? "A" :
                 s.openRate > 15 || s.bounceRate < 5 ? "B" : "C"}
              </div>
              <p className="text-[11px] text-[#64748B] mt-1">
                {s.openRate > 30 && s.bounceRate < 2 ? "Uitstekend" :
                 s.openRate > 15 || s.bounceRate < 5 ? "Goed" : "Verbetering nodig"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
