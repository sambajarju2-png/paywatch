"use client";

import { useState, useEffect, useCallback } from "react";
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
  const [tab, setTab] = useState<"timeline" | "details">("timeline");
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

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

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-700 mb-6">
        {(["timeline", "details"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            {t === "timeline" ? "Timeline" : "Details"}
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
    </div>
  );
}
