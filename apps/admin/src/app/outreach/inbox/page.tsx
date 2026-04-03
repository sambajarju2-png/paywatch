"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Send,
  Mail,
  MessageSquare,
  Loader2,
  RefreshCw,
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  CheckCircle2,
  Eye,
  AlertTriangle,
  X,
} from "lucide-react";

type InboxEmail = {
  id: string;
  direction: string;
  from_email: string;
  from_name: string;
  to_email: string;
  to_name: string;
  subject: string;
  body_html: string;
  status: string;
  sent_at: string;
  delivered_at?: string;
  opened_at?: string;
  clicked_at?: string;
  replied_at?: string;
  reply_body?: string;
  reply_from?: string;
  reply_subject?: string;
  contact_id?: string;
  contact_name?: string;
  contact_type?: string;
};

const STATUS_ICON: Record<string, { icon: typeof Send; color: string }> = {
  sent: { icon: Send, color: "text-blue-500" },
  delivered: { icon: CheckCircle2, color: "text-green-500" },
  opened: { icon: Eye, color: "text-amber-500" },
  replied: { icon: MessageSquare, color: "text-emerald-600" },
  received: { icon: Mail, color: "text-emerald-600" },
  bounced: { icon: AlertTriangle, color: "text-red-500" },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);

  if (days === 0) {
    return d.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
  }
  if (days === 1) return "Gisteren";
  if (days < 7) return d.toLocaleDateString("nl-NL", { weekday: "short" });
  return d.toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
}

export default function InboxPage() {
  const [emails, setEmails] = useState<InboxEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [direction, setDirection] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchEmails = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("per_page", "50");
      if (direction !== "all") params.set("direction", direction);
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/outreach/inbox?${params}`);
      if (res.ok) {
        const data = await res.json();
        setEmails(data.emails || []);
        setTotal(data.total || 0);
        setTotalPages(data.total_pages || 1);
      }
    } catch { console.error("Inbox fetch failed"); }
    finally { setLoading(false); }
  }, [page, direction, search]);

  useEffect(() => { fetchEmails(); }, [fetchEmails]);
  useEffect(() => { setPage(1); }, [direction, search]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-pw-navy">Inbox</h2>
          <p className="text-xs text-pw-muted mt-0.5">{total} email{total !== 1 ? "s" : ""} across all contacts</p>
        </div>
        <button onClick={fetchEmails} disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-pw-muted hover:text-pw-text transition-colors">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-pw-muted" />
          <input type="text" placeholder="Search subject, email..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-pw-border bg-white focus:outline-none focus:border-pw-blue" />
        </div>
        <div className="flex gap-1">
          {[
            { value: "all", label: "All" },
            { value: "outbound", label: "Sent" },
            { value: "inbound", label: "Received" },
          ].map((f) => (
            <button key={f.value} onClick={() => setDirection(f.value)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                direction === f.value ? "bg-pw-blue text-white" : "bg-white text-pw-muted border border-pw-border hover:bg-gray-50"
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Email list */}
      <div className="bg-white rounded-xl border border-pw-border overflow-hidden">
        {loading && emails.length === 0 ? (
          <div className="flex justify-center py-16"><Loader2 className="animate-spin text-pw-muted" size={20} /></div>
        ) : emails.length === 0 ? (
          <div className="text-center py-16">
            <Mail className="w-10 h-10 mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-pw-muted">No emails yet</p>
          </div>
        ) : (
          <div className="divide-y divide-pw-border">
            {emails.map((email) => {
              const isInbound = email.direction === "inbound";
              const isExpanded = expandedId === email.id;
              const statusConfig = STATUS_ICON[email.status] || STATUS_ICON.sent;
              const StatusIcon = statusConfig.icon;

              return (
                <div key={email.id}>
                  {/* Row — Gmail style */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : email.id)}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50/80 transition-colors ${
                      isExpanded ? "bg-blue-50/30" : ""
                    } ${email.status === "received" || email.replied_at ? "bg-blue-50/20" : ""}`}>

                    {/* Direction icon */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isInbound ? "bg-emerald-100" : "bg-blue-100"
                    }`}>
                      {isInbound
                        ? <Mail className="w-3.5 h-3.5 text-emerald-600" />
                        : <Send className="w-3.5 h-3.5 text-blue-600" />
                      }
                    </div>

                    {/* Contact + sender */}
                    <div className="w-36 sm:w-48 shrink-0 min-w-0">
                      {email.contact_name ? (
                        <p className="text-xs font-semibold text-pw-text truncate">{email.contact_name}</p>
                      ) : (
                        <p className="text-xs font-semibold text-pw-text truncate">{isInbound ? email.from_email : email.to_email}</p>
                      )}
                      <p className="text-[10px] text-pw-muted truncate">
                        {isInbound ? `from ${email.from_email}` : `via ${email.from_email}`}
                      </p>
                    </div>

                    {/* Subject + preview */}
                    <div className="flex-1 min-w-0 hidden sm:block">
                      <span className="text-xs font-medium text-pw-text">{email.subject || "(no subject)"}</span>
                      {email.body_html && (
                        <span className="text-xs text-pw-muted ml-2">
                          — {email.body_html.replace(/<[^>]+>/g, "").slice(0, 80)}
                        </span>
                      )}
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.color}`} />
                      {email.replied_at && !isInbound && (
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </div>

                    {/* Date */}
                    <span className="text-[11px] text-pw-muted w-16 text-right shrink-0">
                      {email.sent_at ? formatDate(email.sent_at) : ""}
                    </span>

                    {/* Expand chevron */}
                    {isExpanded
                      ? <ChevronUp className="w-3.5 h-3.5 text-pw-muted shrink-0" />
                      : <ChevronDown className="w-3.5 h-3.5 text-pw-muted shrink-0" />
                    }
                  </div>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 bg-gray-50/50">
                      {/* Meta bar */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3 text-xs text-pw-muted border-b border-pw-border mb-3">
                        <span><strong className="text-pw-text">From:</strong> {email.from_name || email.from_email}</span>
                        <span><strong className="text-pw-text">To:</strong> {email.to_name || email.to_email}</span>
                        <span><strong className="text-pw-text">Date:</strong> {email.sent_at ? new Date(email.sent_at).toLocaleString("nl-NL") : ""}</span>
                        {email.opened_at && <span className="text-amber-600">Opened {new Date(email.opened_at).toLocaleString("nl-NL", { hour: "2-digit", minute: "2-digit" })}</span>}
                        {email.delivered_at && <span className="text-green-600">Delivered</span>}
                        {email.contact_id && (
                          <Link href={`/outreach/contacts/${email.contact_id}`}
                            className="flex items-center gap-1 text-pw-blue hover:underline font-medium"
                            onClick={(e) => e.stopPropagation()}>
                            {email.contact_name || "View contact"} <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>

                      {/* Email body */}
                      <div className="bg-white rounded-lg border border-pw-border p-4">
                        <h3 className="text-sm font-semibold text-pw-navy mb-3">{email.subject}</h3>
                        <div className="text-sm text-pw-text leading-relaxed prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: email.body_html || "<em>No content</em>" }} />
                      </div>

                      {/* Reply (if outbound email has a reply) */}
                      {email.reply_body && (
                        <div className="mt-3 bg-emerald-50/50 rounded-lg border border-emerald-200 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs font-semibold text-emerald-700">Reply from {email.reply_from}</span>
                            {email.replied_at && (
                              <span className="text-[10px] text-pw-muted">
                                {new Date(email.replied_at).toLocaleString("nl-NL")}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-pw-text leading-relaxed prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: email.reply_body }} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between py-2">
          <p className="text-xs text-pw-muted">
            Page {page} of {totalPages} ({total} total)
          </p>
          <div className="flex gap-1">
            <button onClick={() => setPage(page - 1)} disabled={page <= 1}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-pw-border bg-white hover:bg-gray-50 disabled:opacity-40">
              ← Prev
            </button>
            <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-pw-border bg-white hover:bg-gray-50 disabled:opacity-40">
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
