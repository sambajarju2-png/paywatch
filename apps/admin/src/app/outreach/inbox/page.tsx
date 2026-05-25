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
  Trash2,
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
  starred?: boolean;
  attachments?: Array<{ name: string; size: number; type: string; path: string; url: string | null }>;
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
  const [mailbox, setMailbox] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === emails.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(emails.map(e => e.id)));
    }
  }

  async function deleteSelected() {
    if (selectedIds.size === 0) return;
    if (!confirm(`${selectedIds.size} email(s) verwijderen?`)) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/outreach/inbox", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });
      if (res.ok) {
        setSelectedIds(new Set());
        await fetchEmails();
      }
    } catch { console.error("Delete failed"); }
    finally { setDeleting(false); }
  }

  async function deleteSingle(id: string) {
    if (!confirm("Dit email verwijderen?")) return;
    try {
      await fetch("/api/admin/outreach/inbox", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id] }),
      });
      setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
      await fetchEmails();
    } catch { console.error("Delete failed"); }
  }

  // One-off compose modal
  const [showCompose, setShowCompose] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [composeSender, setComposeSender] = useState("samba@paywatch.nl");
  const [composeSending, setComposeSending] = useState(false);
  const [composeFiles, setComposeFiles] = useState<File[]>([]);

  // Reply
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replySender, setReplySender] = useState("samba@paywatch.nl");
  const [replyBody, setReplyBody] = useState("");
  const [replySending, setReplySending] = useState(false);

  async function handleSendReply(email: InboxEmail) {
    if (!replyBody.trim()) return;
    setReplySending(true);
    try {
      const toEmail = email.direction === "inbound" ? email.from_email : email.to_email;
      const toName = email.contact_name || email.to_name || "";
      const res = await fetch("/api/admin/outreach/quick-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: replySender,
          to_email: toEmail,
          to_name: toName,
          subject: email.subject?.startsWith("Re:") ? email.subject : `Re: ${email.subject}`,
          body_html: replyBody.replace(/\n/g, "<br/>"),
          contact_id: email.contact_id || null,
        }),
      });
      if (res.ok) {
        setReplyingToId(null);
        setReplyBody("");
        await fetchEmails();
      }
    } catch { console.error("Reply failed"); }
    finally { setReplySending(false); }
  }

  async function toggleStar(emailId: string, current: boolean) {
    // Optimistic update
    setEmails(prev => prev.map(e => e.id === emailId ? { ...e, starred: !current } : e));
    try {
      await fetch("/api/admin/outreach/inbox", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: emailId, starred: !current }),
      });
    } catch {
      // Revert on error
      setEmails(prev => prev.map(e => e.id === emailId ? { ...e, starred: current } : e));
    }
  }

  async function sendOneOff() {
    if (!composeTo.trim() || !composeSubject.trim() || !composeBody.trim()) return;
    setComposeSending(true);
    try {
      const form = new FormData();
      form.append("sender", composeSender);
      form.append("to_email", composeTo.trim());
      form.append("subject", composeSubject.trim());
      form.append("body_html", composeBody.replace(/\n/g, "<br/>"));
      for (const f of composeFiles) form.append("attachment", f);

      const res = await fetch("/api/admin/outreach/quick-email", {
        method: "POST",
        body: form,
      });
      if (res.ok) {
        setShowCompose(false);
        setComposeTo(""); setComposeSubject(""); setComposeBody(""); setComposeFiles([]);
        await fetchEmails();
      } else { alert("Verzenden mislukt"); }
    } catch { alert("Fout bij verzenden"); }
    finally { setComposeSending(false); }
  }

  const fetchEmails = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("per_page", "100");
      if (direction !== "all") params.set("direction", direction);
      if (mailbox !== "all") params.set("mailbox", mailbox);
      if (search) params.set("search", search);
      if (showStarredOnly) params.set("starred", "true");
      const res = await fetch(`/api/admin/outreach/inbox?${params}`);
      if (res.ok) {
        const data = await res.json();
        setEmails(data.emails || []);
        setTotal(data.total || 0);
        setTotalPages(data.total_pages || 1);
      }
    } catch { console.error("Inbox fetch failed"); }
    finally { setLoading(false); }
  }, [page, direction, mailbox, search, showStarredOnly]);

  useEffect(() => { fetchEmails(); }, [fetchEmails]);
  useEffect(() => { setPage(1); }, [direction, mailbox, search, showStarredOnly]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-pw-navy">Inbox</h2>
          <p className="text-xs text-pw-muted mt-0.5">{total} email{total !== 1 ? "s" : ""} across all contacts</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowStarredOnly(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${showStarredOnly ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-white border-pw-border text-pw-muted hover:text-pw-text"}`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill={showStarredOnly ? "#D97706" : "none"} stroke={showStarredOnly ? "#D97706" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Starred
          </button>
          <button
            onClick={() => setShowCompose(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-pw-navy text-white hover:bg-blue-800 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Snel verzenden
          </button>
          <button onClick={fetchEmails} disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-pw-muted hover:text-pw-text transition-colors">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-pw-muted" />
          <input type="text" placeholder="Zoek op naam, email, bedrijf of onderwerp..." value={search}
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
          <div className="w-px bg-pw-border mx-1" />
          {[
            { value: "all", label: "All accounts" },
            { value: "samba", label: "samba@" },
            { value: "mariama", label: "mariama@" },
            { value: "info", label: "info@" },
          ].map((f) => (
            <button key={f.value} onClick={() => setMailbox(f.value)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                mailbox === f.value ? "bg-pw-navy text-white" : "bg-white text-pw-muted border border-pw-border hover:bg-gray-50"
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
          <span className="text-sm font-semibold text-red-700">{selectedIds.size} geselecteerd</span>
          <button
            onClick={deleteSelected}
            disabled={deleting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
            Verwijderen
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-xs text-red-600 hover:underline ml-auto"
          >
            Deselecteer alles
          </button>
        </div>
      )}

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
            {/* Select all row */}
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50/50 border-b border-pw-border">
              <input
                type="checkbox"
                checked={emails.length > 0 && selectedIds.size === emails.length}
                onChange={toggleSelectAll}
                className="w-3.5 h-3.5 rounded border-gray-300 accent-pw-blue cursor-pointer"
              />
              <span className="text-[11px] text-pw-muted">
                {selectedIds.size === emails.length && emails.length > 0 ? "Deselecteer alles" : "Selecteer alles"}
              </span>
            </div>
            {emails.map((email) => {
              const isInbound = email.direction === "inbound";
              const isExpanded = expandedId === email.id;
              const statusConfig = STATUS_ICON[email.status] || STATUS_ICON.sent;
              const StatusIcon = statusConfig.icon;

              return (
                <div key={email.id}>
                  {/* Row */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : email.id)}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50/80 transition-colors ${
                      isExpanded ? "bg-blue-50/30" : ""
                    } ${email.status === "received" || email.replied_at ? "bg-blue-50/20" : ""}`}>

                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedIds.has(email.id)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => toggleSelect(email.id)}
                      className="w-3.5 h-3.5 rounded border-gray-300 accent-pw-blue cursor-pointer shrink-0"
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleStar(email.id, !!email.starred); }}
                      className="shrink-0 text-pw-muted hover:text-amber-500 transition-colors"
                      title={email.starred ? "Verwijder ster" : "Markeer als belangrijk"}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={email.starred ? "#D97706" : "none"} stroke={email.starred ? "#D97706" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    </button>

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
                      {email.attachments && email.attachments.length > 0 && (
                        <span className="text-xs text-pw-muted ml-1">📎</span>
                      )}
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

                      {/* Attachments */}
                      {email.attachments && email.attachments.length > 0 && (
                        <div className="mt-2 bg-slate-50 rounded-lg border border-pw-border p-3">
                          <p className="text-xs font-semibold text-pw-navy mb-2">
                            Bijlagen ({email.attachments.length})
                          </p>
                          <div className="flex flex-col gap-3">
                            {email.attachments.map((att, idx) => {
                              const isImage = att.type?.startsWith("image/");
                              return (
                                <div key={idx}>
                                  {isImage && att.url ? (
                                    <div>
                                      <img
                                        src={att.url}
                                        alt={att.name}
                                        className="max-w-full rounded-lg border border-pw-border max-h-96 object-contain"
                                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                      />
                                      <a
                                        href={att.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-1 flex items-center gap-1 text-xs text-pw-blue hover:underline"
                                      >
                                        {att.name} ({att.size > 1024 * 1024
                                          ? `${(att.size / 1024 / 1024).toFixed(1)} MB`
                                          : `${Math.round(att.size / 1024)} KB`})
                                      </a>
                                    </div>
                                  ) : (
                                    <a
                                      href={att.url || "#"}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-pw-border hover:border-pw-blue transition-colors text-xs"
                                    >
                                      <span className="text-pw-blue font-semibold">{att.name}</span>
                                      <span className="text-pw-muted">
                                        ({att.size > 1024 * 1024
                                          ? `${(att.size / 1024 / 1024).toFixed(1)} MB`
                                          : `${Math.round(att.size / 1024)} KB`})
                                      </span>
                                    </a>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

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

                      {/* Reply action bar */}
                      {replyingToId !== email.id ? (
                        <div className="mt-3 flex gap-2">
                          <button onClick={(e) => { e.stopPropagation(); setReplyingToId(email.id); setReplySender(email.direction === "inbound" ? email.to_email : email.from_email); }}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-pw-blue bg-blue-50 rounded-lg hover:bg-blue-100 active:bg-blue-200 transition-colors">
                            <MessageSquare className="w-3.5 h-3.5" /> Reply
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); deleteSingle(email.id); }}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 active:bg-red-200 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" /> Verwijderen
                          </button>
                        </div>
                      ) : (
                        <div className="mt-3 bg-white rounded-lg border border-pw-border p-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[11px] text-pw-muted">From:</span>
                            <select value={replySender} onChange={(e) => setReplySender(e.target.value)}
                              className="text-[11px] px-2 py-1 rounded border border-pw-border bg-white">
                              <option value="samba@paywatch.nl">Samba Jarju · samba@paywatch.nl</option>
                              <option value="mariama@paywatch.nl">Mariama Sesay · mariama@paywatch.nl</option>
                              <option value="info@paywatch.nl">PayWatch · info@paywatch.nl</option>
                            </select>
                            <span className="text-[11px] text-pw-muted ml-2">→ {email.direction === "inbound" ? email.from_email : email.to_email}</span>
                          </div>
                          <textarea value={replyBody} onChange={(e) => setReplyBody(e.target.value)}
                            rows={4} autoFocus placeholder="Write your reply..."
                            className="w-full px-3 py-2 text-sm rounded-lg border border-pw-border bg-white focus:outline-none focus:border-pw-blue resize-none" />
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => handleSendReply(email)} disabled={replySending || !replyBody.trim()}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-pw-blue rounded-lg hover:bg-blue-600 disabled:opacity-50">
                              {replySending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />} Send Reply
                            </button>
                            <button onClick={() => { setReplyingToId(null); setReplyBody(""); }}
                              className="px-3 py-1.5 text-xs font-semibold text-pw-muted hover:bg-gray-100 rounded-lg">
                              Cancel
                            </button>
                          </div>
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

      {/* One-off compose modal */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowCompose(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-pw-navy">Snel verzenden</h3>
              <button onClick={() => setShowCompose(false)} className="text-pw-muted hover:text-pw-navy">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-pw-muted uppercase tracking-wider mb-1">Afzender</label>
                <select value={composeSender} onChange={e => setComposeSender(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-pw-border bg-pw-bg focus:outline-none focus:border-pw-blue">
                  <option value="samba@paywatch.nl">Samba Jarju — samba@paywatch.nl</option>
                  <option value="mariama@paywatch.nl">Mariama Sesay — mariama@paywatch.nl</option>
                  <option value="info@paywatch.nl">PayWatch — info@paywatch.nl</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-pw-muted uppercase tracking-wider mb-1">Aan <span className="normal-case font-normal">(meerdere: scheid met komma of nieuwe regel)</span></label>
                <textarea value={composeTo} onChange={e => setComposeTo(e.target.value)}
                  placeholder={"naam@organisatie.nl\nandere@organisatie.nl"}
                  rows={2}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-pw-border focus:outline-none focus:border-pw-blue resize-none" />
                {composeTo.split(/[,;\n]+/).filter(e => e.trim().includes("@")).length > 1 && (
                  <p className="text-[10px] text-pw-blue mt-1 font-medium">{composeTo.split(/[,;\n]+/).filter(e => e.trim().includes("@")).length} ontvangers</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-pw-muted uppercase tracking-wider mb-1">Onderwerp</label>
                <input type="text" value={composeSubject} onChange={e => setComposeSubject(e.target.value)}
                  placeholder="Onderwerp..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-pw-border focus:outline-none focus:border-pw-blue" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-pw-muted uppercase tracking-wider mb-1">Bericht</label>
                <textarea value={composeBody} onChange={e => setComposeBody(e.target.value)}
                  rows={6} placeholder="Typ je bericht..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-pw-border focus:outline-none focus:border-pw-blue resize-none" />
              </div>
              {/* Attachments */}
              <div>
                <label className="block text-xs font-semibold text-pw-muted uppercase tracking-wider mb-1">
                  Bijlagen <span className="normal-case font-normal">(max 5, elk max 10MB)</span>
                </label>
                <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed cursor-pointer transition-colors ${
                  composeFiles.length >= 5 ? "border-pw-border opacity-50 cursor-not-allowed" : "border-pw-border hover:border-pw-blue hover:bg-blue-50/30"
                }`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
                  <span className="text-xs text-pw-muted">Voeg bijlagen toe</span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.txt"
                    disabled={composeFiles.length >= 5}
                    className="hidden"
                    onChange={(e) => {
                      const newFiles = Array.from(e.target.files || []);
                      setComposeFiles((prev) => [...prev, ...newFiles].slice(0, 5));
                      e.target.value = "";
                    }}
                  />
                </label>
                {composeFiles.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1">
                    {composeFiles.map((f, idx) => (
                      <div key={idx} className="flex items-center justify-between px-3 py-1.5 bg-[#F8FAFC] rounded-lg border border-pw-border text-xs">
                        <span className="text-pw-text truncate max-w-[300px]">{f.name}</span>
                        <div className="flex items-center gap-2 ml-2 shrink-0">
                          <span className="text-pw-muted">{f.size > 1024*1024 ? `${(f.size/1024/1024).toFixed(1)}MB` : `${Math.round(f.size/1024)}KB`}</span>
                          <button onClick={() => setComposeFiles((prev) => prev.filter((_, i) => i !== idx))} className="text-pw-muted hover:text-red-500 transition-colors">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button onClick={() => setShowCompose(false)}
                  className="px-4 py-2 text-sm text-pw-muted border border-pw-border rounded-lg hover:bg-pw-bg transition-colors">
                  Annuleer
                </button>
                <button onClick={sendOneOff} disabled={composeSending || !composeTo.trim() || !composeSubject.trim() || !composeBody.trim()}
                  className="px-4 py-2 text-sm font-semibold bg-pw-navy text-white rounded-lg hover:bg-blue-800 disabled:opacity-40 transition-colors flex items-center gap-2">
                  {composeSending ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Verzenden...</> : <><Send className="w-3.5 h-3.5" /> Verzend</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
