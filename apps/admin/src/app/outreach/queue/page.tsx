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
  Zap,
  X,
} from "lucide-react";

interface EmailLog {
  id: string;
  to_name: string | null;
  to_email: string;
  from_email: string;
  from_name: string;
  subject: string;
  body_html: string;
  body_text: string | null;
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
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null);
  const [previewEmail, setPreviewEmail] = useState<EmailLog | null>(null);

  const fetchQueue = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/admin/outreach/queue?${params.toString()}`);
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

  async function handleSendNow(emailId: string) {
    setSendingId(emailId);
    setSendResult(null);
    try {
      const res = await fetch("/api/admin/outreach/send-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailLogId: emailId }),
      });
      const data = await res.json();
      if (res.ok) {
        setSendResult({ success: true, message: `Sent to ${data.to}` });
        await fetchQueue();
      } else {
        setSendResult({ success: false, message: data.error || "Send failed" });
      }
    } catch {
      setSendResult({ success: false, message: "Network error" });
    } finally {
      setSendingId(null);
      setTimeout(() => setSendResult(null), 5000);
    }
  }

  return (
    <div className="space-y-4">
      {sendResult && (
        <div className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs ${
          sendResult.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
        }`}>
          {sendResult.success ? <CheckCircle2 size={14} className="text-pw-green" /> : <XCircle size={14} className="text-pw-red" />}
          <span className={`font-semibold ${sendResult.success ? "text-pw-green" : "text-pw-red"}`}>{sendResult.message}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-pw-muted">{emails.length} {statusFilter === "all" ? "" : statusFilter + " "}email{emails.length !== 1 ? "s" : ""}</p>
        <button onClick={fetchQueue} className="p-2 rounded-lg border border-pw-border bg-white hover:bg-gray-50 transition-colors">
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="flex gap-1">
        {FILTER_TABS.map((tab) => (
          <button key={tab.value} onClick={() => setStatusFilter(tab.value)}
            className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-colors ${
              statusFilter === tab.value ? "bg-pw-blue text-white" : "bg-white text-pw-muted border border-pw-border hover:bg-gray-50"
            }`}>{tab.label}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-pw-border overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-pw-border bg-gray-50/50">
              <th className="text-left px-4 py-2.5 font-semibold text-pw-muted">Recipient</th>
              <th className="text-left px-4 py-2.5 font-semibold text-pw-muted">Subject</th>
              <th className="text-center px-4 py-2.5 font-semibold text-pw-muted">Step</th>
              <th className="text-left px-4 py-2.5 font-semibold text-pw-muted">Status</th>
              <th className="text-left px-4 py-2.5 font-semibold text-pw-muted">From</th>
              <th className="text-right px-4 py-2.5 font-semibold text-pw-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && emails.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12"><Loader2 className="animate-spin mx-auto text-pw-muted" size={20} /></td></tr>
            ) : emails.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-pw-muted">No emails in queue.</td></tr>
            ) : emails.map((e) => {
              const config = STATUS_CONFIG[e.status] || STATUS_CONFIG.queued;
              const StatusIcon = config.icon;
              const isSending = sendingId === e.id;
              return (
                <tr key={e.id} className="border-b border-pw-border last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-pw-text">{e.to_name || e.to_email}</div>
                    {e.to_name && <div className="text-[10px] text-pw-muted">{e.to_email}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setPreviewEmail(e)} className="text-pw-text hover:text-pw-blue transition-colors text-left max-w-[220px] truncate">{e.subject}</button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block w-5 h-5 rounded-full bg-blue-50 text-pw-blue text-[10px] font-bold leading-5">{e.sequence_step}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${config.bg} ${config.color}`}>
                      <StatusIcon size={10} />{e.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[10px] text-pw-muted">{e.from_name}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {e.status === "queued" && (
                        <button onClick={() => handleSendNow(e.id)} disabled={isSending}
                          className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-pw-blue bg-blue-50 rounded hover:bg-blue-100 transition-colors disabled:opacity-50">
                          {isSending ? <Loader2 size={10} className="animate-spin" /> : <Zap size={10} />} Send now
                        </button>
                      )}
                      <button onClick={() => setPreviewEmail(e)} className="p-1 rounded hover:bg-gray-100 transition-colors">
                        <Eye size={12} className="text-pw-muted" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Email Preview Modal — shows full body */}
      {previewEmail && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-pw-border shrink-0">
              <h3 className="text-sm font-bold text-pw-navy">Email Preview</h3>
              <button onClick={() => setPreviewEmail(null)} className="p-1 rounded-lg hover:bg-gray-100">
                <X size={16} className="text-pw-muted" />
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-4 flex-1">
              <div className="space-y-2 text-xs mb-4">
                <div className="flex gap-2">
                  <span className="text-pw-muted w-14 shrink-0">To:</span>
                  <span className="text-pw-text">{previewEmail.to_name ? `${previewEmail.to_name} <${previewEmail.to_email}>` : previewEmail.to_email}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-pw-muted w-14 shrink-0">From:</span>
                  <span className="text-pw-text">{previewEmail.from_name} &lt;{previewEmail.from_email}&gt;</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-pw-muted w-14 shrink-0">Subject:</span>
                  <span className="font-semibold text-pw-navy">{previewEmail.subject}</span>
                </div>
              </div>
              <div className="border-t border-pw-border pt-4">
                {previewEmail.body_html ? (
                  <div className="text-xs text-pw-text leading-relaxed [&_p]:mb-2"
                    dangerouslySetInnerHTML={{ __html: previewEmail.body_html }} />
                ) : (
                  <p className="text-xs text-pw-muted italic">No email body available</p>
                )}
              </div>
            </div>
            <div className="flex gap-2 px-6 py-4 border-t border-pw-border shrink-0">
              <button onClick={() => setPreviewEmail(null)}
                className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg border border-pw-border hover:bg-gray-50">Close</button>
              {previewEmail.status === "queued" && (
                <button onClick={() => { handleSendNow(previewEmail.id); setPreviewEmail(null); }}
                  className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg bg-pw-blue text-white hover:bg-blue-600 flex items-center justify-center gap-1.5">
                  <Zap size={12} /> Send Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
