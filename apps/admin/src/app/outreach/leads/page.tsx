"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  AlertTriangle,
  RefreshCw,
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Clock,
  MousePointerClick,
  ArrowDownWideNarrow,
  Mail,
  Building2,
  UserCircle,
  Send,
  X,
  Check,
} from "lucide-react";

interface Engagement {
  time_on_page_seconds: number;
  max_scroll_depth: number;
  clicked_cta: boolean;
  submitted_form: boolean;
  visit_count: number;
  referrer: string | null;
  page_path: string | null;
}

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  message: string | null;
  company_name: string | null;
  company_domain: string | null;
  audience: string;
  brand_color: string | null;
  logo_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  engagement: Engagement | null;
}

const AUDIENCES = [
  { value: "all", label: "Alle" },
  { value: "gemeente", label: "Gemeente" },
  { value: "incasso", label: "Incasso" },
  { value: "hulporg", label: "Hulporganisatie" },
  { value: "zakelijk", label: "Zakelijk" },
];

const STATUSES = [
  { value: "all", label: "Alle" },
  { value: "new", label: "Nieuw" },
  { value: "contacted", label: "Contacted" },
  { value: "meeting", label: "Meeting" },
  { value: "closed", label: "Closed" },
];

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-50 text-blue-700",
  contacted: "bg-amber-50 text-amber-700",
  meeting: "bg-purple-50 text-purple-700",
  closed: "bg-green-50 text-green-700",
};

const AUDIENCE_LABELS: Record<string, string> = {
  gemeente: "Gemeente",
  incasso: "Incasso",
  hulporg: "Hulporganisatie",
  zakelijk: "Zakelijk",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audience, setAudience] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [emailingId, setEmailingId] = useState<string | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailFrom, setEmailFrom] = useState("business@paywatch.nl");
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showSpamOnly, setShowSpamOnly] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (audience !== "all") params.set("audience", audience);
      if (status !== "all") params.set("status", status);
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/admin/outreach/leads?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setLeads(data.leads || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [audience, status, search]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  async function updateStatus(id: string, newStatus: string) {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/outreach/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) throw new Error("Update failed");
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
      );
    } catch {
      alert("Status update failed");
    } finally {
      setUpdatingId(null);
    }
  }

  function openEmailCompose(lead: Lead) {
    setEmailingId(lead.id);
    setEmailSubject(`PayWatch - samenwerking met ${lead.company_name || "uw organisatie"}`);
    setEmailBody(`Beste ${lead.first_name},\n\nBedankt voor uw interesse in PayWatch.\n\n\n\nMet vriendelijke groet,\nSamba Jarju\nCo-founder, PayWatch`);
    setEmailFrom("samba@paywatch.nl");
    setEmailSent(null);
  }

  async function sendEmail(lead: Lead) {
    setEmailSending(true);
    try {
      const res = await fetch("/api/admin/outreach/leads/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: lead.id,
          to: lead.email,
          subject: emailSubject,
          body: emailBody,
          from: emailFrom,
        }),
      });
      if (!res.ok) throw new Error("Send failed");
      setEmailSent(lead.id);
      setEmailingId(null);
      // Update local status
      setLeads((prev) =>
        prev.map((l) =>
          l.id === lead.id && l.status === "new"
            ? { ...l, status: "contacted" }
            : l
        )
      );
    } catch {
      alert("Email verzenden mislukt");
    } finally {
      setEmailSending(false);
    }
  }

  // Spam detection: random-string names (high mixed-case ratio, no vowel patterns)
  function isSpam(lead: Lead): boolean {
    const name = `${lead.first_name || ""} ${lead.last_name || ""}`.trim();
    if (name.length < 15) return false;
    const upper = (name.match(/[A-Z]/g) || []).length;
    const lower = (name.match(/[a-z]/g) || []).length;
    const total = upper + lower;
    if (total === 0) return false;
    const upperRatio = upper / total;
    // Random strings have 10-70% uppercase (camelCase bots)
    // Real names have <30% uppercase (just initials)
    const looksRandom = upperRatio > 0.1 && upperRatio < 0.75 && total > 14;
    // Also flag very long single-word names (no spaces within first/last)
    const noInternalSpaces = !(lead.first_name || "").includes(" ") && !(lead.last_name || "").includes(" ");
    return looksRandom && noInternalSpaces;
  }

  async function bulkDelete(ids: string[]) {
    if (ids.length === 0) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/outreach/leads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setLeads((prev) => prev.filter((l) => !ids.includes(l.id)));
      setSelectedIds(new Set());
    } catch {
      alert("Verwijderen mislukt");
    } finally {
      setDeleting(false);
    }
  }

  const spamLeads = leads.filter(isSpam);

  const counts = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    meeting: leads.filter((l) => l.status === "meeting").length,
    closed: leads.filter((l) => l.status === "closed").length,
  };

  return (
    <div>
      {/* Stats bar */}
      <div className="flex gap-3 mb-5 flex-wrap">
        {[
          { label: "Totaal", value: counts.total, color: "text-pw-navy" },
          { label: "Nieuw", value: counts.new, color: "text-blue-600" },
          { label: "Contacted", value: counts.contacted, color: "text-amber-600" },
          { label: "Meeting", value: counts.meeting, color: "text-purple-600" },
          { label: "Closed", value: counts.closed, color: "text-green-600" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white border border-pw-border rounded-lg px-4 py-3 min-w-[100px]"
          >
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[11px] text-pw-muted font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap items-center">
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-pw-muted"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Zoek op naam, email, bedrijf..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-pw-border rounded-lg focus:outline-none focus:border-pw-blue"
          />
        </div>

        <select
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          className="text-xs border border-pw-border rounded-lg px-3 py-2 focus:outline-none focus:border-pw-blue"
        >
          {AUDIENCES.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="text-xs border border-pw-border rounded-lg px-3 py-2 focus:outline-none focus:border-pw-blue"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <button
          onClick={fetchLeads}
          className="flex items-center gap-1.5 text-xs font-semibold text-pw-blue hover:text-pw-navy transition-colors"
        >
          <RefreshCw size={13} />
          Vernieuwen
        </button>

        {spamLeads.length > 0 && (
          <button
            onClick={() => setShowSpamOnly((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
              showSpamOnly
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-white border-pw-border text-pw-muted hover:text-pw-text"
            }`}
          >
            <AlertTriangle size={12} />
            {spamLeads.length} spam
          </button>
        )}
      </div>

      {/* Spam warning bar */}
      {spamLeads.length > 0 && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-red-500 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-red-700">{spamLeads.length} spam leads gedetecteerd</p>
              <p className="text-[11px] text-red-500">Willekeurige namen zonder herkenbaar patroon — waarschijnlijk bots via het contactformulier.</p>
            </div>
          </div>
          <button
            onClick={() => bulkDelete(spamLeads.map((l) => l.id))}
            disabled={deleting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors shrink-0 ml-4"
          >
            {deleting ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
            Verwijder alle spam
          </button>
        </div>
      )}

      {/* Bulk delete bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between bg-[#0A2540] rounded-xl px-4 py-3 mb-4">
          <p className="text-xs font-semibold text-white">{selectedIds.size} geselecteerd</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setSelectedIds(new Set())} className="text-xs text-white/60 hover:text-white transition-colors">
              Selectie opheffen
            </button>
            <button
              onClick={() => bulkDelete(Array.from(selectedIds))}
              disabled={deleting}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
            >
              {deleting ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
              Verwijder {selectedIds.size}
            </button>
          </div>
        </div>
      )}

      {/* Loading / Error */}
      {loading && leads.length === 0 && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="animate-spin text-pw-muted" size={24} />
        </div>
      )}

      {error && leads.length === 0 && (
        <div className="text-center py-16">
          <AlertTriangle className="mx-auto mb-3 text-red-400" size={24} />
          <p className="text-sm text-pw-muted mb-3">{error}</p>
          <button
            onClick={fetchLeads}
            className="text-xs font-semibold text-pw-blue hover:underline"
          >
            Opnieuw proberen
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && leads.length === 0 && (
        <div className="text-center py-16">
          <UserCircle className="mx-auto mb-3 text-pw-muted" size={32} />
          <p className="text-sm text-pw-muted">Nog geen B2B leads ontvangen</p>
        </div>
      )}

      {/* Leads list */}
      {leads.length > 0 && (
        <div className="space-y-2">
          {leads.filter((l) => !showSpamOnly || isSpam(l)).map((lead) => {
            const expanded = expandedId === lead.id;
            const spam = isSpam(lead);
            const selected = selectedIds.has(lead.id);
            return (
              <div
                key={lead.id}
                className={`bg-white border rounded-lg overflow-hidden transition-all ${
                  spam ? "border-red-200 bg-red-50/20" : "border-pw-border"
                } ${selected ? "ring-2 ring-pw-blue" : ""}`}
              >
                {/* Row */}
                <button
                  onClick={() => setExpandedId(expanded ? null : lead.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                >
                  {/* Checkbox */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIds((prev) => {
                        const next = new Set(prev);
                        if (next.has(lead.id)) next.delete(lead.id);
                        else next.add(lead.id);
                        return next;
                      });
                    }}
                    className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center cursor-pointer transition-colors ${
                      selected ? "bg-pw-blue border-pw-blue" : "border-pw-border hover:border-pw-blue"
                    }`}
                  >
                    {selected && <Check size={10} className="text-white" />}
                  </div>

                  {/* Spam badge */}
                  {spam && (
                    <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded shrink-0">SPAM</span>
                  )}

                  {/* Brand color dot */}
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: lead.brand_color || "#94a3b8" }}
                  />

                  {/* Name + company */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-pw-navy truncate">
                      {lead.first_name} {lead.last_name}
                    </div>
                    <div className="text-[11px] text-pw-muted truncate">
                      {lead.company_name || lead.company_domain || "—"}
                    </div>
                  </div>

                  {/* Audience badge */}
                  <span className="text-[10px] font-semibold bg-gray-100 text-pw-muted px-2 py-0.5 rounded shrink-0">
                    {AUDIENCE_LABELS[lead.audience] || lead.audience}
                  </span>

                  {/* Status badge */}
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded shrink-0 ${
                      STATUS_COLORS[lead.status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {lead.status}
                  </span>

                  {/* Date */}
                  <span className="text-[11px] text-pw-muted shrink-0 hidden sm:inline">
                    {formatDate(lead.created_at)}
                  </span>

                  {expanded ? (
                    <ChevronUp size={14} className="text-pw-muted shrink-0" />
                  ) : (
                    <ChevronDown size={14} className="text-pw-muted shrink-0" />
                  )}
                </button>

                {/* Expanded detail */}
                {expanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-pw-border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Contact info */}
                      <div className="space-y-2">
                        <h4 className="text-[11px] font-bold text-pw-muted uppercase tracking-wider">
                          Contact
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-pw-text">
                          <Mail size={12} className="text-pw-muted" />
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-pw-blue hover:underline"
                          >
                            {lead.email}
                          </a>
                        </div>
                        {lead.company_domain && (
                          <div className="flex items-center gap-2 text-xs text-pw-text">
                            <Building2 size={12} className="text-pw-muted" />
                            <a
                              href={`https://${lead.company_domain}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-pw-blue hover:underline flex items-center gap-1"
                            >
                              {lead.company_domain}
                              <ExternalLink size={10} />
                            </a>
                          </div>
                        )}
                        {lead.message && (
                          <div className="mt-2">
                            <div className="text-[11px] font-bold text-pw-muted uppercase tracking-wider mb-1">
                              Bericht
                            </div>
                            <p className="text-xs text-pw-text bg-gray-50 rounded-lg p-3 leading-relaxed">
                              {lead.message}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Engagement + status */}
                      <div className="space-y-3">
                        {/* Engagement */}
                        {lead.engagement && (
                          <div>
                            <h4 className="text-[11px] font-bold text-pw-muted uppercase tracking-wider mb-2">
                              Engagement
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="bg-gray-50 rounded-lg px-3 py-2">
                                <div className="flex items-center gap-1.5 text-pw-muted mb-0.5">
                                  <Clock size={11} />
                                  <span className="text-[10px] font-medium">Tijd op pagina</span>
                                </div>
                                <div className="text-sm font-bold text-pw-navy">
                                  {formatDuration(lead.engagement.time_on_page_seconds)}
                                </div>
                              </div>
                              <div className="bg-gray-50 rounded-lg px-3 py-2">
                                <div className="flex items-center gap-1.5 text-pw-muted mb-0.5">
                                  <ArrowDownWideNarrow size={11} />
                                  <span className="text-[10px] font-medium">Scroll depth</span>
                                </div>
                                <div className="text-sm font-bold text-pw-navy">
                                  {lead.engagement.max_scroll_depth}%
                                </div>
                              </div>
                              <div className="bg-gray-50 rounded-lg px-3 py-2">
                                <div className="flex items-center gap-1.5 text-pw-muted mb-0.5">
                                  <MousePointerClick size={11} />
                                  <span className="text-[10px] font-medium">CTA clicks</span>
                                </div>
                                <div className="text-sm font-bold text-pw-navy">
                                  {lead.engagement.clicked_cta ? "Ja" : "Nee"}
                                </div>
                              </div>
                              <div className="bg-gray-50 rounded-lg px-3 py-2">
                                <div className="flex items-center gap-1.5 text-pw-muted mb-0.5">
                                  <ExternalLink size={11} />
                                  <span className="text-[10px] font-medium">Bezoeken</span>
                                </div>
                                <div className="text-sm font-bold text-pw-navy">
                                  {lead.engagement.visit_count}
                                </div>
                              </div>
                            </div>
                            {lead.engagement.page_path && (
                              <div className="text-xs text-pw-muted mt-2">
                                <span className="font-semibold">Pagina:</span> {lead.engagement.page_path}
                              </div>
                            )}
                            {lead.engagement.referrer && (
                              <div className="text-xs text-pw-muted">
                                <span className="font-semibold">Referrer:</span> {lead.engagement.referrer}
                              </div>
                            )}
                          </div>
                        )}

                        {!lead.engagement && (
                          <div>
                            <h4 className="text-[11px] font-bold text-pw-muted uppercase tracking-wider mb-2">
                              Engagement
                            </h4>
                            <p className="text-xs text-pw-muted italic">Geen data beschikbaar</p>
                          </div>
                        )}

                        {/* Status update */}
                        <div>
                          <h4 className="text-[11px] font-bold text-pw-muted uppercase tracking-wider mb-2">
                            Status wijzigen
                          </h4>
                          <div className="flex gap-1.5 flex-wrap">
                            {["new", "contacted", "meeting", "closed"].map((s) => (
                              <button
                                key={s}
                                onClick={() => updateStatus(lead.id, s)}
                                disabled={lead.status === s || updatingId === lead.id}
                                className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all ${
                                  lead.status === s
                                    ? `${STATUS_COLORS[s]} ring-2 ring-offset-1 ring-current`
                                    : "bg-gray-100 text-pw-muted hover:bg-gray-200"
                                } disabled:opacity-50`}
                              >
                                {updatingId === lead.id ? (
                                  <Loader2 size={11} className="animate-spin" />
                                ) : (
                                  s
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Email button */}
                        {emailSent === lead.id ? (
                          <div className="flex items-center gap-2 text-xs text-green-600 font-semibold mt-1">
                            <Check size={14} />
                            Email verzonden
                          </div>
                        ) : emailingId !== lead.id ? (
                          <button
                            onClick={() => openEmailCompose(lead)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-pw-blue hover:text-pw-navy transition-colors mt-1"
                          >
                            <Send size={12} />
                            Stuur email
                          </button>
                        ) : null}
                      </div>
                    </div>

                    {/* Email compose form */}
                    {emailingId === lead.id && (
                      <div className="mt-4 border border-pw-border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-[11px] font-bold text-pw-muted uppercase tracking-wider">
                            Email opstellen
                          </h4>
                          <button
                            onClick={() => setEmailingId(null)}
                            className="text-pw-muted hover:text-pw-navy"
                          >
                            <X size={14} />
                          </button>
                        </div>

                        <div className="space-y-2.5">
                          <div className="flex items-center gap-2">
                            <label className="text-[11px] font-semibold text-pw-muted w-16 shrink-0">Van</label>
                            <select
                              value={emailFrom}
                              onChange={(e) => setEmailFrom(e.target.value)}
                              className="flex-1 text-xs border border-pw-border rounded-lg px-3 py-1.5 focus:outline-none focus:border-pw-blue bg-white"
                            >
                              <option value="samba@paywatch.nl">samba@paywatch.nl (Samba)</option>
                              <option value="mariama@paywatch.nl">mariama@paywatch.nl (Mariama)</option>
                              <option value="info@paywatch.nl">info@paywatch.nl (PayWatch)</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="text-[11px] font-semibold text-pw-muted w-16 shrink-0">Aan</label>
                            <div className="flex-1 text-xs text-pw-text bg-white border border-pw-border rounded-lg px-3 py-1.5">
                              {lead.email}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="text-[11px] font-semibold text-pw-muted w-16 shrink-0">Onderwerp</label>
                            <input
                              type="text"
                              value={emailSubject}
                              onChange={(e) => setEmailSubject(e.target.value)}
                              className="flex-1 text-xs border border-pw-border rounded-lg px-3 py-1.5 focus:outline-none focus:border-pw-blue"
                            />
                          </div>

                          <textarea
                            value={emailBody}
                            onChange={(e) => setEmailBody(e.target.value)}
                            rows={8}
                            className="w-full text-xs border border-pw-border rounded-lg px-3 py-2 focus:outline-none focus:border-pw-blue resize-y leading-relaxed"
                          />

                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setEmailingId(null)}
                              className="text-xs font-semibold text-pw-muted hover:text-pw-navy px-4 py-2 rounded-lg transition-colors"
                            >
                              Annuleren
                            </button>
                            <button
                              onClick={() => sendEmail(lead)}
                              disabled={emailSending || !emailSubject.trim() || !emailBody.trim()}
                              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-pw-blue hover:bg-pw-navy px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {emailSending ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <Send size={12} />
                              )}
                              Versturen
                            </button>
                          </div>
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
  );
}

