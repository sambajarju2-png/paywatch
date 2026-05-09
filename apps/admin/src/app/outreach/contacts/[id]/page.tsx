"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  UserCircle,
  Mail,
  Phone,
  Globe,
  MapPin,
  Tag,
  Clock,
  Send,
  CheckCircle2,
  Eye,
  MousePointerClick,
  MessageSquare,
  AlertTriangle,
  Bot,
  Plus,
  CalendarDays,
  ExternalLink,
  Loader2,
  RefreshCw,
  Pencil,
  FileText,
  X,
  Paperclip,
  Copy,
  ClipboardCheck,
} from "lucide-react";

/* ── types ── */
type Contact = {
  id: string;
  organization_name: string;
  type: string;
  website?: string;
  general_email?: string;
  contact_person?: string;
  contact_role?: string;
  contact_email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  city?: string;
  kvk_number?: string;
  linkedin_url?: string;
  notes?: string;
  status: string;
  ai_research_summary?: string;
  ai_researched_at?: string;
  source?: string;
  tags?: string[];
  beat?: string;
  clickup_task_id?: string;
  created_at: string;
  updated_at?: string;
};

type TimelineEvent = {
  id: string;
  type: string;
  timestamp: string;
  title: string;
  detail?: string;
  meta?: Record<string, unknown>;
};

type TimelineResponse = {
  contact: Contact;
  total_events: number;
  events: TimelineEvent[];
};

/* ── icon + color map for event types ── */
const EVENT_CONFIG: Record<string, { icon: typeof Clock; color: string; bg: string }> = {
  contact_created: { icon: Plus, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40" },
  ai_researched: { icon: Bot, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/40" },
  email_scheduled: { icon: CalendarDays, color: "text-slate-500 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800" },
  email_sent: { icon: Send, color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-100 dark:bg-sky-900/40" },
  email_delivered: { icon: CheckCircle2, color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/40" },
  email_opened: { icon: Eye, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/40" },
  email_clicked: { icon: MousePointerClick, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/40" },
  email_replied: { icon: MessageSquare, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/40" },
  email_bounced: { icon: AlertTriangle, color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/40" },
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  researched: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  contacted: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  replied: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  meeting_booked: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  won: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  lost: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
}

function formatRelative(dateStr: string) {
  const now = new Date();
  const d = new Date(dateStr);
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
}

/* ── Component ── */
export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const contactId = params.id as string;

  const [contact, setContact] = useState<Contact | null>(null);
  const [timeline, setTimeline] = useState<TimelineResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [tab, setTab] = useState<"timeline" | "details" | "emails">("timeline");
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [showEmailCompose, setShowEmailCompose] = useState(false);

  // Emails tab
  type EmailEntry = {
    id: string; direction: string; from_email: string; from_name: string;
    to_email: string; to_name: string; subject: string; body_html: string;
    status: string; sent_at: string; delivered_at?: string; opened_at?: string;
    clicked_at?: string; replied_at?: string; reply_body?: string;
    reply_from?: string; reply_subject?: string;
  };
  const [emails, setEmails] = useState<EmailEntry[]>([]);
  const [emailsLoading, setEmailsLoading] = useState(false);
  const [emailsFetched, setEmailsFetched] = useState(false);

  const fetchEmails = useCallback(async () => {
    setEmailsLoading(true);
    try {
      const res = await fetch(`/api/admin/outreach/contacts/${contactId}/emails`);
      if (res.ok) {
        const data = await res.json();
        setEmails(data.emails || []);
        setEmailsFetched(true);
      }
    } catch { console.error("Failed to fetch emails"); }
    finally { setEmailsLoading(false); }
  }, [contactId]);

  // Fetch emails when tab is first opened
  useEffect(() => {
    if (tab === "emails" && !emailsFetched) fetchEmails();
  }, [tab, emailsFetched, fetchEmails]);

  async function handleEditSave(updates: Record<string, unknown>) {
    setEditSaving(true);
    try {
      const res = await fetch("/api/admin/outreach/contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: contactId, ...updates }),
      });
      if (res.ok) {
        await fetchData();
        setEditing(false);
      }
    } catch { console.error("Edit save error"); }
    finally { setEditSaving(false); }
  }

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/outreach/contacts/${contactId}/timeline`);
      if (res.ok) {
        const data: TimelineResponse = await res.json();
        setContact(data.contact);
        setTimeline(data);
      }
    } catch (err) {
      console.error("Failed to fetch contact data", err);
    } finally {
      setLoading(false);
    }
  }, [contactId]);

  const refreshTimeline = useCallback(async () => {
    setTimelineLoading(true);
    try {
      const res = await fetch(`/api/admin/outreach/contacts/${contactId}/timeline`);
      if (res.ok) {
        const data: TimelineResponse = await res.json();
        setContact(data.contact);
        setTimeline(data);
      }
    } catch (err) {
      console.error("Failed to refresh timeline", err);
    } finally {
      setTimelineLoading(false);
    }
  }, [contactId]);

  const syncFromClickUp = useCallback(async () => {
    if (!contact?.clickup_task_id) return;
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch(`/api/admin/outreach/sync-clickup?type=${contact.type}`);
      if (res.ok) {
        const data = await res.json();
        setSyncResult(`Synced ${data.synced} contact(s)`);
        await fetchData();
        setTimeout(() => setSyncResult(null), 4000);
      } else {
        setSyncResult("Sync failed");
      }
    } catch {
      setSyncResult("Sync error");
    } finally {
      setSyncing(false);
    }
  }, [contact?.clickup_task_id, contact?.type, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-500 dark:text-slate-400">Contact not found.</p>
        <button onClick={() => router.push("/outreach/contacts")} className="mt-4 text-blue-600 hover:underline text-sm">
          ← Back to contacts
        </button>
      </div>
    );
  }

  /* ── Group timeline events by date ── */
  const groupedEvents: Record<string, TimelineEvent[]> = {};
  if (timeline?.events) {
    for (const event of timeline.events) {
      const dateKey = formatDate(event.timestamp);
      if (!groupedEvents[dateKey]) groupedEvents[dateKey] = [];
      groupedEvents[dateKey].push(event);
    }
  }

  /* ── Stats from timeline ── */
  const emailsSent = timeline?.events.filter((e) => e.type === "email_sent").length || 0;
  const emailsOpened = timeline?.events.filter((e) => e.type === "email_opened").length || 0;
  const emailsReplied = timeline?.events.filter((e) => e.type === "email_replied").length || 0;
  const emailsBounced = timeline?.events.filter((e) => e.type === "email_bounced").length || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 md:py-6">
      {/* ── Back button ── */}
      <button
        onClick={() => router.push("/outreach/contacts")}
        className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 mb-4 md:mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to contacts
      </button>

      {/* ── Header card ── */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 md:p-5 mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 md:gap-4">
          {/* Avatar — smaller on mobile */}
          <div className="flex-shrink-0 w-11 h-11 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-lg md:text-xl font-bold">
            {contact.organization_name.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white truncate">{contact.organization_name}</h1>
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[contact.status] || "bg-slate-100 text-slate-600"}`}>
                {contact.status}
              </span>
              <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                {contact.type}
              </span>
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 transition-colors dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
              >
                <Pencil className="w-3 h-3" /> Edit
              </button>
              {(contact.contact_email || contact.general_email) && (
                <button
                  onClick={() => setShowEmailCompose(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 transition-colors dark:bg-emerald-900/30 dark:text-emerald-300"
                >
                  <Send className="w-3 h-3" /> Email
                </button>
              )}
            </div>

            {/* Quick info row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm text-slate-500 dark:text-slate-400">
              {contact.contact_person && (
                <span className="flex items-center gap-1"><UserCircle className="w-3.5 h-3.5" /> {contact.contact_person}{contact.contact_role ? ` · ${contact.contact_role}` : ""}</span>
              )}
              {contact.city && (
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {contact.city}</span>
              )}
              {(contact.contact_email || contact.general_email) && (
                <a href={`mailto:${contact.contact_email || contact.general_email}`} className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                  <Mail className="w-3.5 h-3.5" /> <span className="truncate max-w-[200px]">{contact.contact_email || contact.general_email}</span>
                </a>
              )}
              {contact.phone && (
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {contact.phone}</span>
              )}
              {contact.website && (
                <a href={contact.website.startsWith("http") ? contact.website : `https://${contact.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                  <Globe className="w-3.5 h-3.5" /> Website <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Description / Notes preview in header */}
            {contact.notes && (
              <div className="flex items-start gap-2 mt-3 p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">{contact.notes}</p>
              </div>
            )}

            {/* Tags */}
            {contact.tags && contact.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {contact.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    <Tag className="w-3 h-3" /> {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick stats bar */}
        <div className="grid grid-cols-4 gap-2 md:gap-3 mt-4 md:mt-5 pt-4 md:pt-5 border-t border-slate-100 dark:border-slate-700">
          <div className="text-center">
            <p className="text-base md:text-lg font-bold text-slate-900 dark:text-white">{emailsSent}</p>
            <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400">Sent</p>
          </div>
          <div className="text-center">
            <p className="text-base md:text-lg font-bold text-slate-900 dark:text-white">{emailsOpened}</p>
            <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400">Opened</p>
          </div>
          <div className="text-center">
            <p className="text-base md:text-lg font-bold text-emerald-600">{emailsReplied}</p>
            <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400">Replied</p>
          </div>
          <div className="text-center">
            <p className="text-base md:text-lg font-bold text-red-500">{emailsBounced}</p>
            <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400">Bounced</p>
          </div>
        </div>

        {/* Sync from ClickUp */}
        {contact.clickup_task_id && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={syncFromClickUp}
              disabled={syncing}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-slate-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} /> Sync from ClickUp
            </button>
            {syncResult && (
              <span className="text-xs text-emerald-600 font-medium">{syncResult}</span>
            )}
          </div>
        )}
      </div>

      {/* ── Template Variables ── */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 mb-4 md:mb-6">
        <TemplateVariables contact={contact} />
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-700 mb-6">
        {(["timeline", "emails", "details"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            {t === "timeline" ? "Timeline" : t === "emails" ? "Emails" : "Details"}
          </button>
        ))}
        <div className="flex-1" />
        {tab === "timeline" && (
          <button
            onClick={refreshTimeline}
            disabled={timelineLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${timelineLoading ? "animate-spin" : ""}`} /> Refresh
          </button>
        )}
      </div>

      {/* ── Timeline Tab ── */}
      {tab === "timeline" && (
        <div>
          {timelineLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            </div>
          ) : !timeline || timeline.events.length === 0 ? (
            <div className="text-center py-16">
              <Clock className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-sm text-slate-500 dark:text-slate-400">No interactions yet.</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Events will appear here once you research or email this contact.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedEvents).map(([dateLabel, events]) => (
                <div key={dateLabel}>
                  {/* Date header */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{dateLabel}</span>
                    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                  </div>

                  {/* Events for this date */}
                  <div className="relative pl-8">
                    {/* Vertical line */}
                    <div className="absolute left-[13px] top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-700" />

                    <div className="space-y-4">
                      {events.map((event) => {
                        const config = EVENT_CONFIG[event.type] || { icon: Clock, color: "text-slate-500", bg: "bg-slate-100" };
                        const Icon = config.icon;

                        return (
                          <div key={event.id} className="relative flex gap-3 group">
                            {/* Dot */}
                            <div className={`absolute -left-8 top-0.5 w-[26px] h-[26px] rounded-full ${config.bg} flex items-center justify-center ring-4 ring-white dark:ring-slate-900`}>
                              <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 pb-1">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{event.title}</p>
                                <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">{formatTime(event.timestamp)}</span>
                              </div>
                              {event.detail && (
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 truncate">{event.detail}</p>
                              )}
                              {event.meta && (() => {
                                const campaign = event.meta.campaign as string | undefined;
                                const step = event.meta.step as string | undefined;
                                const from = event.meta.from as string | undefined;
                                return (
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {campaign && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                        {campaign}
                                      </span>
                                    )}
                                    {step && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                        {step}
                                      </span>
                                    )}
                                    {from && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                        via {from}
                                      </span>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Emails Tab ── */}
      {tab === "emails" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-slate-500">{emails.length} email{emails.length !== 1 ? "s" : ""}</p>
            <div className="flex gap-2">
              <button onClick={fetchEmails} disabled={emailsLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors">
                <RefreshCw className={`w-3.5 h-3.5 ${emailsLoading ? "animate-spin" : ""}`} /> Refresh
              </button>
              {(contact.contact_email || contact.general_email) && (
                <button onClick={() => setShowEmailCompose(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100">
                  <Send className="w-3 h-3" /> Compose
                </button>
              )}
            </div>
          </div>

          {emailsLoading && emails.length === 0 ? (
            <div className="flex justify-center py-16"><Loader2 className="w-5 h-5 animate-spin text-blue-600" /></div>
          ) : emails.length === 0 ? (
            <div className="text-center py-16">
              <Mail className="w-10 h-10 mx-auto text-slate-300 mb-3" />
              <p className="text-sm text-slate-500">No emails yet.</p>
              <p className="text-xs text-slate-400 mt-1">Send an email to start the conversation.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {emails.map((email) => {
                const isInbound = email.direction === "inbound";
                return (
                  <div key={email.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                    {/* Email header */}
                    <div className={`px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-start gap-3 ${isInbound ? "bg-emerald-50/50 dark:bg-emerald-900/10" : "bg-slate-50/50"}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isInbound ? "bg-emerald-100 dark:bg-emerald-900/40" : "bg-blue-100 dark:bg-blue-900/40"}`}>
                        {isInbound
                          ? <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                          : <Send className="w-3.5 h-3.5 text-blue-600" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-semibold ${isInbound ? "text-emerald-700" : "text-blue-700"}`}>
                            {isInbound ? "Received" : "Sent"}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {email.sent_at ? new Date(email.sent_at).toLocaleString("nl-NL", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}
                          </span>
                          {email.status === "opened" && <span className="text-[10px] text-amber-600 font-medium">Opened</span>}
                          {email.status === "clicked" && <span className="text-[10px] text-orange-600 font-medium">Clicked</span>}
                          {email.status === "delivered" && <span className="text-[10px] text-green-600 font-medium">Delivered</span>}
                          {email.status === "bounced" && <span className="text-[10px] text-red-600 font-medium">Bounced</span>}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {isInbound ? "From" : "From"}: <span className="font-medium text-slate-700">{email.from_email}</span>
                          {" → "}
                          <span className="font-medium text-slate-700">{email.to_email}</span>
                        </p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">{email.subject}</p>
                      </div>
                    </div>
                    {/* Email body */}
                    <div className="px-4 py-3">
                      <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: email.body_html || "<em>No content</em>" }} />
                    </div>
                    {/* Reply inline (if outbound email has a reply) */}
                    {email.reply_body && (
                      <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700 bg-emerald-50/30 dark:bg-emerald-900/10">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-xs font-semibold text-emerald-700">Reply from {email.reply_from}</span>
                          {email.replied_at && (
                            <span className="text-[10px] text-slate-400">
                              {new Date(email.replied_at).toLocaleString("nl-NL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: email.reply_body }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Details Tab ── */}
      {tab === "details" && (
        <div className="space-y-6">
          {/* Contact info */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Contact Information</h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {[
                { label: "Organization", value: contact.organization_name },
                { label: "Type", value: contact.type },
                { label: "First Name", value: contact.first_name },
                { label: "Last Name", value: contact.last_name },
                { label: "Contact Person", value: contact.contact_person },
                { label: "Role", value: contact.contact_role },
                { label: "Contact Email", value: contact.contact_email },
                { label: "General Email", value: contact.general_email },
                { label: "Phone", value: contact.phone },
                { label: "City", value: contact.city },
                { label: "Website", value: contact.website, link: true },
                { label: "LinkedIn", value: contact.linkedin_url, link: true },
                { label: "KVK", value: contact.kvk_number },
                { label: "Beat", value: contact.beat },
                { label: "Source", value: contact.source },
                { label: "Added", value: contact.created_at ? formatDate(contact.created_at) : undefined },
              ]
                .filter((row) => row.value)
                .map((row) => (
                  <div key={row.label} className="flex items-start px-4 md:px-5 py-3">
                    <span className="text-xs text-slate-500 dark:text-slate-400 w-24 md:w-32 flex-shrink-0 pt-0.5">{row.label}</span>
                    {row.link ? (
                      <a
                        href={(row.value as string).startsWith("http") ? row.value as string : `https://${row.value}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1 break-all"
                      >
                        {row.value} <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-sm text-slate-900 dark:text-white break-all">{row.value}</span>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* AI Research */}
          {contact.ai_research_summary && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-500" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">AI Research</h3>
                {contact.ai_researched_at && (
                  <span className="text-[11px] text-slate-400 ml-auto">{formatRelative(contact.ai_researched_at)}</span>
                )}
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{contact.ai_research_summary}</p>
              </div>
            </div>
          )}

          {/* Description / Notes (synced with ClickUp description) */}
          {contact.notes && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Description / Notes</h3>
                <span className="text-[10px] text-slate-400 ml-auto">Syncs with ClickUp</span>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{contact.notes}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editing && contact && (
        <EditContactModal
          contact={contact}
          saving={editSaving}
          onClose={() => setEditing(false)}
          onSave={handleEditSave}
        />
      )}

      {/* ── Email Compose Modal ── */}
      {showEmailCompose && contact && (
        <EmailComposeModal
          contact={contact}
          onClose={() => setShowEmailCompose(false)}
          onSent={() => { setShowEmailCompose(false); fetchData(); }}
        />
      )}
    </div>
  );
}

/* ── Template Variables ── */
function TemplateVariables({ contact }: { contact: Contact }) {
  const [copied, setCopied] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const vars: { key: string; value: string }[] = [
    { key: "{{voornaam}}", value: contact.first_name || contact.contact_person?.split(" ")[0] || "" },
    { key: "{{achternaam}}", value: contact.last_name || contact.contact_person?.split(" ").slice(1).join(" ") || "" },
    { key: "{{volledige_naam}}", value: contact.contact_person || `${contact.first_name || ""} ${contact.last_name || ""}`.trim() },
    { key: "{{bedrijf}}", value: contact.organization_name },
    { key: "{{email}}", value: contact.contact_email || contact.general_email || "" },
    { key: "{{website}}", value: contact.website || "" },
    { key: "{{functie}}", value: contact.contact_role || "" },
    { key: "{{stad}}", value: contact.city || "" },
  ].filter(v => v.value);

  function copyVar(key: string, value: string) {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  function copyAllVars() {
    const text = vars.map(v => `${v.key} = ${v.value}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  }

  function copyFilledTemplate() {
    // Copy a pre-filled email body with all variables replaced
    const template = `Beste ${vars.find(v => v.key === "{{voornaam}}")?.value || ""},\n\n[Je bericht hier]\n\nGroet,\nSamba Jarju\nCo-founder & CTO, PayWatch\npaywatch.app`;
    navigator.clipboard.writeText(template);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Copy className="w-3.5 h-3.5 text-blue-500" />
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Template variables</h3>
        </div>
        <button
          onClick={copyAllVars}
          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 rounded-lg transition-colors dark:bg-blue-900/30 dark:text-blue-300"
        >
          {copiedAll ? <ClipboardCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copiedAll ? "Copied!" : "Copy all"}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {vars.map(v => (
          <button
            key={v.key}
            onClick={() => copyVar(v.key, v.value)}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all cursor-pointer"
            title={`Click to copy: ${v.value}`}
          >
            <code className="text-[11px] font-mono text-blue-600 dark:text-blue-400">{v.key}</code>
            <span className="text-[11px] text-slate-400">=</span>
            <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 max-w-[150px] truncate">{v.value}</span>
            {copied === v.key ? (
              <ClipboardCheck className="w-3 h-3 text-green-500 shrink-0" />
            ) : (
              <Copy className="w-3 h-3 text-slate-300 group-hover:text-blue-400 shrink-0 transition-colors" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Constants for Edit Modal ── */
const TYPE_OPTIONS = [
  { value: "incasso", label: "Incasso" },
  { value: "aid_org", label: "Hulporganisatie" },
  { value: "gemeente", label: "Gemeente" },
  { value: "bewindvoerder", label: "Bewindvoerder" },
  { value: "kredietbank", label: "Kredietbank" },
  { value: "journalist", label: "Journalist" },
];

const EDIT_STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "researched", label: "Researched" },
  { value: "queued", label: "Queued" },
  { value: "contacted", label: "Contacted" },
  { value: "replied", label: "Replied" },
  { value: "meeting_booked", label: "Meeting Booked" },
  { value: "not_interested", label: "Not Interested" },
  { value: "bounced", label: "Bounced" },
];

const BEAT_OPTIONS = [
  { value: "", label: "— None —" },
  { value: "tech", label: "Tech" },
  { value: "society", label: "Society" },
  { value: "debt", label: "Debt" },
  { value: "young_people", label: "Young People" },
  { value: "finance", label: "Finance" },
  { value: "politics", label: "Politics" },
];

const editInputClass = "w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-slate-900 dark:text-white";
const editSelectClass = "w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 appearance-none text-slate-900 dark:text-white";
const editLabelClass = "block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5";

/* ── Edit Contact Modal ── */
function EditContactModal({ contact, saving, onClose, onSave }: {
  contact: Contact;
  saving: boolean;
  onClose: () => void;
  onSave: (updates: Record<string, unknown>) => Promise<void>;
}) {
  const [form, setForm] = useState({
    organization_name: contact.organization_name || "",
    type: contact.type || "aid_org",
    website: contact.website || "",
    contact_person: contact.contact_person || "",
    contact_role: contact.contact_role || "",
    contact_email: contact.contact_email || "",
    first_name: contact.first_name || "",
    last_name: contact.last_name || "",
    general_email: contact.general_email || "",
    phone: contact.phone || "",
    city: contact.city || "",
    kvk_number: contact.kvk_number || "",
    linkedin_url: contact.linkedin_url || "",
    beat: contact.beat || "",
    notes: contact.notes || "",
    status: contact.status || "new",
  });
  const [error, setError] = useState<string | null>(null);

  function update(field: string, value: string) {
    if (field === "type" && value !== "journalist") {
      setForm((prev) => ({ ...prev, [field]: value, beat: "" }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  }

  async function handleSubmit() {
    if (!form.organization_name.trim()) { setError("Organization name is required"); return; }
    setError(null);
    await onSave({
      organization_name: form.organization_name.trim(),
      type: form.type,
      website: form.website.trim() || null,
      contact_person: form.contact_person.trim() || null,
      contact_role: form.contact_role.trim() || null,
      contact_email: form.contact_email.trim() || null,
      first_name: form.first_name.trim() || null,
      last_name: form.last_name.trim() || null,
      general_email: form.general_email.trim() || null,
      phone: form.phone.trim() || null,
      city: form.city.trim() || null,
      kvk_number: form.kvk_number.trim() || null,
      linkedin_url: form.linkedin_url.trim() || null,
      beat: form.type === "journalist" && form.beat.trim() ? form.beat.trim() : null,
      notes: form.notes.trim() || null,
      status: form.status,
    });
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white dark:bg-slate-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-xl max-h-[95vh] sm:max-h-[90vh] flex flex-col" style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <div className="flex items-center gap-2">
            <Pencil className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Edit Contact</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-slate-200">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto px-5 sm:px-6 py-4 space-y-4 flex-1">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2 text-xs text-red-600 dark:text-red-400">
              <X className="w-3 h-3" /> {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className={editLabelClass}>Organization Name *</label><input value={form.organization_name} onChange={(e) => update("organization_name", e.target.value)} className={editInputClass} /></div>
            <div><label className={editLabelClass}>Type *</label>
              <select value={form.type} onChange={(e) => update("type", e.target.value)} className={editSelectClass}>
                {TYPE_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>

          {form.type === "journalist" && (
            <div><label className={editLabelClass}>Beat</label>
              <select value={form.beat} onChange={(e) => update("beat", e.target.value)} className={editSelectClass}>
                {BEAT_OPTIONS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </div>
          )}

          <div><label className={editLabelClass}>Status</label>
            <select value={form.status} onChange={(e) => update("status", e.target.value)} className={editSelectClass}>
              {EDIT_STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className={editLabelClass}>First Name</label><input value={form.first_name} onChange={(e) => update("first_name", e.target.value)} className={editInputClass} placeholder="e.g. Jan" /></div>
            <div><label className={editLabelClass}>Last Name</label><input value={form.last_name} onChange={(e) => update("last_name", e.target.value)} className={editInputClass} placeholder="e.g. De Vries" /></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className={editLabelClass}>Contact Person</label><input value={form.contact_person} onChange={(e) => update("contact_person", e.target.value)} className={editInputClass} /></div>
            <div><label className={editLabelClass}>Role</label><input value={form.contact_role} onChange={(e) => update("contact_role", e.target.value)} className={editInputClass} /></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className={editLabelClass}>Contact Email</label><input type="email" value={form.contact_email} onChange={(e) => update("contact_email", e.target.value)} className={editInputClass} /></div>
            <div><label className={editLabelClass}>General Email</label><input type="email" value={form.general_email} onChange={(e) => update("general_email", e.target.value)} className={editInputClass} /></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className={editLabelClass}>Phone</label><input value={form.phone} onChange={(e) => update("phone", e.target.value)} className={editInputClass} /></div>
            <div><label className={editLabelClass}>City</label><input value={form.city} onChange={(e) => update("city", e.target.value)} className={editInputClass} /></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className={editLabelClass}>Website</label><input value={form.website} onChange={(e) => update("website", e.target.value)} className={editInputClass} /></div>
            <div><label className={editLabelClass}>KvK Number</label><input value={form.kvk_number} onChange={(e) => update("kvk_number", e.target.value)} className={editInputClass} /></div>
          </div>

          <div><label className={editLabelClass}>LinkedIn URL</label><input value={form.linkedin_url} onChange={(e) => update("linkedin_url", e.target.value)} className={editInputClass} /></div>

          <div><label className={editLabelClass}>Notes / Description</label><textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={4} className={`${editInputClass} resize-none`} placeholder="Internal notes, ClickUp description..." /></div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 sm:px-6 py-4 border-t border-slate-200 dark:border-slate-700 shrink-0">
          <button onClick={onClose} className="flex-1 px-3 py-2.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 active:bg-slate-100 text-slate-700 dark:text-slate-300">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving}
            className="flex-1 px-3 py-2.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 flex items-center justify-center gap-1.5">
            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Email Compose Modal ── */
const EMAIL_SENDERS = [
  { email: "samba@paywatch.nl", name: "Samba Jarju", role: "Co-founder" },
  { email: "mariama@paywatch.nl", name: "Mariama Sesay", role: "Co-founder" },
  { email: "info@paywatch.nl", name: "PayWatch", role: "General" },
];

function EmailComposeModal({ contact, onClose, onSent }: {
  contact: Contact;
  onClose: () => void;
  onSent: () => void;
}) {
  const toEmail = contact.contact_email || contact.general_email || "";
  const toName = contact.contact_person || contact.organization_name;

  const [sender, setSender] = useState("samba@paywatch.nl");
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedSender = EMAIL_SENDERS.find((s) => s.email === sender);

  async function handleSend() {
    if (!subject.trim() || !bodyHtml.trim()) {
      setError("Subject and message are required");
      return;
    }
    setSending(true);
    setError(null);
    try {
      // Replace template variables
      const vars: Record<string, string> = {
        "{{voornaam}}": contact.first_name || contact.contact_person?.split(" ")[0] || "",
        "{{achternaam}}": contact.last_name || contact.contact_person?.split(" ").slice(1).join(" ") || "",
        "{{volledige_naam}}": contact.contact_person || `${contact.first_name || ""} ${contact.last_name || ""}`.trim(),
        "{{bedrijf}}": contact.organization_name || "",
        "{{email}}": contact.contact_email || contact.general_email || "",
        "{{website}}": contact.website || "",
        "{{functie}}": contact.contact_role || "",
        "{{stad}}": contact.city || "",
      };
      let filledBody = bodyHtml;
      let filledSubject = subject.trim();
      for (const [key, val] of Object.entries(vars)) {
        filledBody = filledBody.split(key).join(val);
        filledSubject = filledSubject.split(key).join(val);
      }
      const html = filledBody.replace(/\n/g, "<br/>");
      const formData = new FormData();
      formData.append("sender", sender);
      formData.append("to_email", toEmail);
      if (toName) formData.append("to_name", toName);
      formData.append("subject", filledSubject);
      formData.append("body_html", html);
      if (contact.id) formData.append("contact_id", contact.id);
      for (const file of attachments) {
        formData.append("attachment", file, file.name);
      }
      const res = await fetch("/api/admin/outreach/quick-email", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Send failed");
        return;
      }
      setSuccess(true);
      setTimeout(() => onSent(), 1500);
    } catch {
      setError("Failed to send email");
    } finally {
      setSending(false);
    }
  }

  if (!toEmail) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
        <div className="bg-white dark:bg-slate-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-xl text-center" style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}>
          <Mail className="w-8 h-8 mx-auto mb-3 text-slate-300" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">No email address</p>
          <p className="text-xs text-slate-500 mb-4">Add a contact or general email first.</p>
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white dark:bg-slate-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-xl max-h-[95vh] sm:max-h-[90vh] flex flex-col" style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Send Email</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {success ? (
          <div className="px-6 py-12 text-center">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-emerald-500" />
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Email sent!</p>
            <p className="text-xs text-slate-500 mt-1">To {toEmail}</p>
          </div>
        ) : (
          <>
            <div className="overflow-y-auto px-5 sm:px-6 py-4 space-y-4 flex-1">
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-600">
                  <X className="w-3 h-3" /> {error}
                </div>
              )}

              {/* To */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">To</label>
                <div className="px-3 py-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
                  {toName} &lt;{toEmail}&gt;
                </div>
              </div>

              {/* From (sender selection) */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">From</label>
                <div className="space-y-1.5">
                  {EMAIL_SENDERS.map((s) => (
                    <label key={s.email}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                        sender === s.email
                          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20"
                          : "border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      }`}>
                      <input type="radio" name="sender" value={s.email}
                        checked={sender === s.email}
                        onChange={() => setSender(s.email)}
                        className="accent-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{s.name}</p>
                        <p className="text-[11px] text-slate-500">{s.email} · {s.role}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Subject</label>
                <input value={subject} onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                  placeholder="e.g. Partnership mogelijkheden" />
              </div>

              {/* Body */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Message</label>
                <textarea value={bodyHtml} onChange={(e) => setBodyHtml(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500 resize-none text-slate-900 dark:text-white"
                  placeholder="Write your message... Use {{voornaam}}, {{bedrijf}} etc." />
                <p className="text-[10px] text-slate-400 mt-1">
                  Variables: <code className="text-blue-500">{"{{voornaam}}"}</code> <code className="text-blue-500">{"{{achternaam}}"}</code> <code className="text-blue-500">{"{{bedrijf}}"}</code> <code className="text-blue-500">{"{{email}}"}</code> <code className="text-blue-500">{"{{functie}}"}</code> <code className="text-blue-500">{"{{stad}}"}</code> <code className="text-blue-500">{"{{website}}"}</code> — auto-replaced on send
                </p>
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Attachments</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.gif"
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setAttachments(prev => [...prev, ...files].slice(0, 5));
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                />
                {attachments.length > 0 && (
                  <div className="space-y-1.5 mb-2">
                    {attachments.map((file, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                        <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                        <span className="text-xs text-slate-700 dark:text-slate-300 truncate flex-1">{file.name}</span>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">{(file.size / 1024).toFixed(0)} KB</span>
                        <button onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                          className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-600">
                          <X className="w-3 h-3 text-slate-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={attachments.length >= 5}
                  className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  {attachments.length === 0 ? "Attach files" : `Add more (${attachments.length}/5)`}
                </button>
              </div>

              {/* Signature preview */}
              {selectedSender && (
                <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <p className="text-[10px] font-semibold text-slate-400 mb-1.5">Signature (auto-appended)</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    <strong>{selectedSender.name}</strong><br />
                    {selectedSender.role} · PayWatch<br />
                    <em className="text-[11px] text-slate-400">PayWatch: De slimme buffer tussen jou en incassokosten.</em><br />
                    <span className="text-blue-600">paywatch.app</span>
                    {selectedSender.email !== "info@paywatch.nl" && <> · <span className="text-blue-600">LinkedIn</span></>}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-2 px-5 sm:px-6 py-4 border-t border-slate-200 dark:border-slate-700 shrink-0">
              <button onClick={onClose}
                className="flex-1 px-3 py-2.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 text-slate-700 dark:text-slate-300">
                Cancel
              </button>
              <button onClick={handleSend} disabled={sending || !subject.trim() || !bodyHtml.trim()}
                className="flex-1 px-3 py-2.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 flex items-center justify-center gap-1.5">
                {sending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                Send Email
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
