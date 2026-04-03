"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Send,
  Eye,
  MessageSquare,
  AlertTriangle,
  ArrowUpRight,
  RefreshCw,
  Loader2,
  TrendingUp,
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

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-pw-muted" size={24} />
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="mx-auto mb-3 text-pw-red" size={24} />
        <p className="text-sm text-pw-muted mb-3">{error}</p>
        <button
          onClick={fetchStats}
          className="text-xs font-semibold text-pw-blue hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  const s = stats!;

  const statCards = [
    {
      label: "Total Contacts",
      value: s.totalContacts,
      icon: Users,
      color: "text-pw-blue",
      bg: "bg-blue-50",
    },
    {
      label: "Emails Sent",
      value: s.totalSent,
      icon: Send,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Open Rate",
      value: `${s.openRate}%`,
      icon: Eye,
      color: "text-pw-green",
      bg: "bg-green-50",
    },
    {
      label: "Reply Rate",
      value: `${s.replyRate}%`,
      icon: MessageSquare,
      color: "text-pw-amber",
      bg: "bg-amber-50",
    },
    {
      label: "Bounce Rate",
      value: `${s.bounceRate}%`,
      icon: AlertTriangle,
      color: "text-pw-red",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Refresh */}
      <div className="flex justify-end">
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-pw-muted hover:text-pw-text transition-colors"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-pw-border p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-medium text-pw-muted">
                {card.label}
              </span>
              <div
                className={`w-7 h-7 rounded-lg ${card.bg} flex items-center justify-center`}
              >
                <card.icon size={14} className={card.color} />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-pw-navy tracking-tight">
              {card.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Active Campaigns */}
        <div className="md:col-span-2 bg-white rounded-xl border border-pw-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-pw-navy">
              Active Campaigns
            </h2>
            <a
              href="/outreach/campaigns"
              className="text-[11px] font-semibold text-pw-blue flex items-center gap-0.5 hover:underline"
            >
              View all <ArrowUpRight size={10} />
            </a>
          </div>
          {s.activeCampaigns.length === 0 ? (
            <p className="text-xs text-pw-muted py-6 text-center">
              No active campaigns yet
            </p>
          ) : (
            <div className="space-y-3">
              {s.activeCampaigns.map((c) => {
                const progress =
                  c.total_contacts > 0
                    ? Math.round(
                        (c.total_sent / c.total_contacts) * 100
                      )
                    : 0;
                return (
                  <div key={c.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-pw-text truncate">
                          {c.name}
                        </span>
                        <span className="text-[10px] font-medium text-pw-muted">
                          {c.total_sent}/{c.total_contacts} sent
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-pw-blue rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex gap-3 mt-1">
                        <span className="text-[10px] text-pw-muted">
                          {c.total_opened} opened
                        </span>
                        <span className="text-[10px] text-pw-green font-medium">
                          {c.total_replied} replied
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Replies */}
        <div className="bg-white rounded-xl border border-pw-border p-5">
          <h2 className="text-sm font-bold text-pw-navy mb-4">
            Recent Replies
          </h2>
          {s.recentReplies.length === 0 ? (
            <p className="text-xs text-pw-muted py-6 text-center">
              No replies yet
            </p>
          ) : (
            <div className="space-y-3">
              {s.recentReplies.map((r) => (
                <div
                  key={r.id}
                  className="p-2.5 rounded-lg bg-green-50 border border-green-100"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <MessageSquare size={10} className="text-pw-green" />
                    {r.contact_id ? (
                      <a href={`/outreach/contacts/${r.contact_id}`} className="text-[11px] font-semibold text-pw-blue hover:underline truncate">
                        {r.contact_name || r.to_name || r.to_email}
                      </a>
                    ) : (
                      <span className="text-[11px] font-semibold text-pw-text truncate">
                        {r.contact_name || r.to_name || r.to_email}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-pw-muted truncate">
                    Re: {r.subject}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[10px] text-pw-muted">
                      {r.replied_at
                        ? new Date(r.replied_at).toLocaleDateString("nl-NL", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </p>
                    {r.from_email && <span className="text-[10px] text-pw-muted">via {r.from_email}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Account Health */}
      <div className="bg-white rounded-xl border border-pw-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-pw-navy">
            Sending Account Health
          </h2>
          <a
            href="/outreach/accounts"
            className="text-[11px] font-semibold text-pw-blue flex items-center gap-0.5 hover:underline"
          >
            Manage <ArrowUpRight size={10} />
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {s.accounts.map((acc) => {
            const warmupDay = Math.max(
              1,
              Math.ceil(
                (Date.now() - new Date(acc.warmup_start_date).getTime()) /
                  86400000
              )
            );
            const usagePercent =
              acc.daily_limit > 0
                ? Math.round((acc.today_sent / acc.daily_limit) * 100)
                : 0;
            return (
              <div
                key={acc.id}
                className="rounded-lg border border-pw-border p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-pw-text truncate">
                      {acc.display_name}
                    </p>
                    <p className="text-[10px] text-pw-muted truncate">
                      {acc.email}
                    </p>
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      acc.is_active ? "bg-pw-green" : "bg-gray-300"
                    }`}
                  />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={10} className="text-pw-amber" />
                  <span className="text-[10px] text-pw-muted">
                    Warmup day {warmupDay} · {acc.daily_limit}/day limit
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      usagePercent >= 90
                        ? "bg-pw-red"
                        : usagePercent >= 60
                        ? "bg-pw-amber"
                        : "bg-pw-green"
                    }`}
                    style={{ width: `${Math.min(usagePercent, 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-pw-muted mt-1">
                  {acc.today_sent}/{acc.daily_limit} sent today
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
