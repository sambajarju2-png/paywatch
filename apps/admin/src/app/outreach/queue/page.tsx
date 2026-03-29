"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  RefreshCw,
  Mail,
  Clock,
  CheckCircle2,
  Eye,
  MessageSquare,
  AlertTriangle,
  XCircle,
  Send,
} from "lucide-react";

interface EmailLog {
  id: string;
  to_name: string | null;
  to_email: string;
  from_email: string;
  from_name: string;
  subject: string;
  sequence_step: number;
  status: string;
  sent_at: string | null;
  delivered_at: string | null;
  opened_at: string | null;
  replied_at: string | null;
  bounced_at: string | null;
  scheduled_for: string;
  campaign_name: string;
}

const STATUS_CONFIG: Record<
  string,
  { icon: typeof Mail; color: string; bg: string }
> = {
  queued: { icon: Clock, color: "text-pw-muted", bg: "bg-gray-100" },
  sending: { icon: Send, color: "text-pw-blue", bg: "bg-blue-50" },
  sent: { icon: Send, color: "text-pw-blue", bg: "bg-blue-50" },
  delivered: { icon: CheckCircle2, color: "text-pw-green", bg: "bg-green-50" },
  opened: { icon: Eye, color: "text-purple-600", bg: "bg-purple-50" },
  clicked: { icon: Eye, color: "text-purple-600", bg: "bg-purple-50" },
  replied: { icon: MessageSquare, color: "text-pw-green", bg: "bg-green-50" },
  bounced: { icon: AlertTriangle, color: "text-pw-red", bg: "bg-red-50" },
  complained: { icon: XCircle, color: "text-pw-red", bg: "bg-red-50" },
  failed: { icon: XCircle, color: "text-pw-red", bg: "bg-red-50" },
  skipped: { icon: XCircle, color: "text-gray-400", bg: "bg-gray-50" },
};

const FILTER_TABS = [
  { value: "all", label: "All" },
  { value: "queued", label: "Queued" },
  { value: "sent", label: "Sent" },
  { value: "delivered", label: "Delivered" },
  { value: "opened", label: "Opened" },
  { value: "replied", label: "Replied" },
  { value: "bounced", label: "Bounced" },
];

export default function OutreachQueue() {
  const [emails, setEmails] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchQueue = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(
        `/api/admin/outreach/queue?${params.toString()}`
      );
      if (res.ok) {
        const data = await res.json();
        setEmails(data.emails);
      }
    } catch {
      console.error("Failed to load queue");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  function formatTime(ts: string | null) {
    if (!ts) return "—";
    return new Date(ts).toLocaleString("nl-NL", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-pw-muted">
          {emails.length} email{emails.length !== 1 ? "s" : ""} in queue
        </p>
        <button
          onClick={fetchQueue}
          className="p-2 rounded-lg border border-pw-border bg-white hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-colors ${
              statusFilter === tab.value
                ? "bg-pw-blue text-white"
                : "bg-white text-pw-muted border border-pw-border hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Queue table */}
      <div className="bg-white rounded-xl border border-pw-border overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-pw-border bg-gray-50/50">
              <th className="text-left px-4 py-2.5 font-semibold text-pw-muted">
                Recipient
              </th>
              <th className="text-left px-4 py-2.5 font-semibold text-pw-muted">
                Subject
              </th>
              <th className="text-left px-4 py-2.5 font-semibold text-pw-muted">
                Campaign
              </th>
              <th className="text-center px-4 py-2.5 font-semibold text-pw-muted">
                Step
              </th>
              <th className="text-left px-4 py-2.5 font-semibold text-pw-muted">
                Status
              </th>
              <th className="text-left px-4 py-2.5 font-semibold text-pw-muted">
                From
              </th>
              <th className="text-right px-4 py-2.5 font-semibold text-pw-muted">
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && emails.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12">
                  <Loader2
                    className="animate-spin mx-auto text-pw-muted"
                    size={20}
                  />
                </td>
              </tr>
            ) : emails.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-12 text-pw-muted"
                >
                  No emails in queue. Create a campaign and generate emails
                  first.
                </td>
              </tr>
            ) : (
              emails.map((e) => {
                const config =
                  STATUS_CONFIG[e.status] || STATUS_CONFIG.queued;
                const StatusIcon = config.icon;
                return (
                  <tr
                    key={e.id}
                    className="border-b border-pw-border last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-pw-text">
                        {e.to_name || e.to_email}
                      </div>
                      {e.to_name && (
                        <div className="text-[10px] text-pw-muted">
                          {e.to_email}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-pw-text max-w-[200px] truncate">
                      {e.subject}
                    </td>
                    <td className="px-4 py-3 text-pw-muted">
                      {e.campaign_name}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block w-5 h-5 rounded-full bg-blue-50 text-pw-blue text-[10px] font-bold leading-5">
                        {e.sequence_step}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${config.bg} ${config.color}`}
                      >
                        <StatusIcon size={10} />
                        {e.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[10px] text-pw-muted">
                      {e.from_name}
                    </td>
                    <td className="px-4 py-3 text-right text-[10px] text-pw-muted">
                      {e.status === "queued"
                        ? formatTime(e.scheduled_for)
                        : formatTime(
                            e.replied_at ||
                              e.opened_at ||
                              e.delivered_at ||
                              e.sent_at
                          )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
