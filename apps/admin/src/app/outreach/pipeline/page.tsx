"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  UserCircle,
  MapPin,
  Tag,
  Clock,
  ExternalLink,
  Sparkles,
  Send,
  MessageSquare,
  CalendarCheck,
  Trophy,
  XCircle,
  GripVertical,
} from "lucide-react";

/* ── Types ── */
type Contact = {
  id: string;
  organization_name: string;
  type: string;
  contact_person?: string;
  contact_role?: string;
  contact_email?: string;
  city?: string;
  status: string;
  tags?: string[];
  ai_researched_at?: string;
  updated_at?: string;
  created_at: string;
};

/* ── Pipeline stages config ── */
const STAGES = [
  { key: "new", label: "New", icon: Sparkles, color: "bg-blue-500", light: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-200 dark:border-blue-800", text: "text-blue-700 dark:text-blue-300" },
  { key: "researched", label: "Researched", icon: Clock, color: "bg-purple-500", light: "bg-purple-50 dark:bg-purple-900/20", border: "border-purple-200 dark:border-purple-800", text: "text-purple-700 dark:text-purple-300" },
  { key: "contacted", label: "Contacted", icon: Send, color: "bg-sky-500", light: "bg-sky-50 dark:bg-sky-900/20", border: "border-sky-200 dark:border-sky-800", text: "text-sky-700 dark:text-sky-300" },
  { key: "replied", label: "Replied", icon: MessageSquare, color: "bg-emerald-500", light: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-200 dark:border-emerald-800", text: "text-emerald-700 dark:text-emerald-300" },
  { key: "meeting_booked", label: "Meeting", icon: CalendarCheck, color: "bg-amber-500", light: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-200 dark:border-amber-800", text: "text-amber-700 dark:text-amber-300" },
  { key: "won", label: "Won", icon: Trophy, color: "bg-green-500", light: "bg-green-50 dark:bg-green-900/20", border: "border-green-200 dark:border-green-800", text: "text-green-700 dark:text-green-300" },
  { key: "lost", label: "Lost", icon: XCircle, color: "bg-red-500", light: "bg-red-50 dark:bg-red-900/20", border: "border-red-200 dark:border-red-800", text: "text-red-700 dark:text-red-300" },
] as const;

const TYPE_BADGE: Record<string, string> = {
  gemeente: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  aid_org: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  incasso: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  journalist: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  bewindvoerder: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  kredietbank: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  billing_vendor: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
};

function formatRelative(dateStr: string) {
  const now = new Date();
  const d = new Date(dateStr);
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return d.toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
}

/* ── Component ── */
export default function PipelinePage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [moving, setMoving] = useState<string | null>(null); // contact id being moved
  const [moveMenu, setMoveMenu] = useState<string | null>(null); // contact id with open move menu
  const [filterType, setFilterType] = useState<string>("all");

  const fetchContacts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/outreach/contacts");
      if (res.ok) {
        const data = await res.json();
        setContacts(Array.isArray(data) ? data : data.contacts || []);
      }
    } catch (err) {
      console.error("Failed to fetch contacts", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Close move menu on outside click
  useEffect(() => {
    if (!moveMenu) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-move-menu]")) setMoveMenu(null);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [moveMenu]);

  const moveContact = async (contactId: string, newStatus: string) => {
    setMoving(contactId);
    setMoveMenu(null);
    try {
      const res = await fetch("/api/admin/outreach/contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: contactId, status: newStatus }),
      });
      if (res.ok) {
        setContacts((prev) => prev.map((c) => (c.id === contactId ? { ...c, status: newStatus } : c)));
        // Sync status to ClickUp (fire-and-forget)
        fetch("/api/admin/outreach/sync-clickup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contact_id: contactId, status: newStatus }),
        }).catch(() => {});
      }
    } catch (err) {
      console.error("Failed to move contact", err);
    } finally {
      setMoving(null);
    }
  };

  const filteredContacts = filterType === "all" ? contacts : contacts.filter((c) => c.type === filterType);
  const contactTypes = [...new Set(contacts.map((c) => c.type))].sort();

  // Quick-advance: move to next logical stage
  const getNextStage = (current: string): string | null => {
    const idx = STAGES.findIndex((s) => s.key === current);
    if (idx === -1 || idx >= STAGES.length - 2) return null; // don't auto-advance past meeting_booked
    return STAGES[idx + 1].key;
  };

  const getPrevStage = (current: string): string | null => {
    const idx = STAGES.findIndex((s) => s.key === current);
    if (idx <= 0) return null;
    return STAGES[idx - 1].key;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Pipeline</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{contacts.length} contacts across {STAGES.length} stages</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Type filter */}
          <button
            onClick={syncFromClickUp}
            disabled={syncing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
            title="Sync statuses from ClickUp"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing..." : "Sync"}
          </button>
          {syncResult && (
            <span className="text-xs text-gray-500 dark:text-gray-400">{syncResult}</span>
          )}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5"
          >
            <option value="all">All types</option>
            {contactTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <button
            onClick={() => { setLoading(true); fetchContacts(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* ── Kanban Board ── */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory sm:snap-none">
        {STAGES.map((stage) => {
          const Icon = stage.icon;
          const stageContacts = filteredContacts.filter((c) => c.status === stage.key);

          return (
            <div
              key={stage.key}
              className="flex-shrink-0 w-[280px] sm:w-[260px] snap-center"
            >
              {/* Column header */}
              <div className={`flex items-center gap-2 px-3 py-2.5 rounded-t-xl ${stage.light} border ${stage.border} border-b-0`}>
                <div className={`w-6 h-6 rounded-md ${stage.color} flex items-center justify-center`}>
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
                <span className={`text-sm font-semibold ${stage.text}`}>{stage.label}</span>
                <span className="ml-auto text-xs font-bold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {stageContacts.length}
                </span>
              </div>

              {/* Column body */}
              <div className={`min-h-[200px] max-h-[calc(100vh-240px)] overflow-y-auto rounded-b-xl border ${stage.border} bg-slate-50/50 dark:bg-slate-900/30 p-2 space-y-2`}>
                {stageContacts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Icon className="w-8 h-8 text-slate-200 dark:text-slate-700 mb-2" />
                    <p className="text-xs text-slate-400 dark:text-slate-600">No contacts</p>
                  </div>
                ) : (
                  stageContacts.map((contact) => {
                    const nextStage = getNextStage(contact.status);
                    const prevStage = getPrevStage(contact.status);
                    const isMoving = moving === contact.id;

                    return (
                      <div
                        key={contact.id}
                        className={`group relative rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 hover:border-slate-300 dark:hover:border-slate-600 transition-all ${isMoving ? "opacity-50" : ""}`}
                      >
                        {/* Top row: name + move menu */}
                        <div className="flex items-start gap-2">
                          {/* Avatar */}
                          <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${stage.color} flex items-center justify-center text-white text-xs font-bold`}>
                            {contact.organization_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <button
                              onClick={() => router.push(`/outreach/contacts/${contact.id}`)}
                              className="text-sm font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate block text-left w-full"
                            >
                              {contact.organization_name}
                            </button>
                            <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium mt-0.5 ${TYPE_BADGE[contact.type] || "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}>
                              {contact.type}
                            </span>
                          </div>

                          {/* Move menu trigger */}
                          <div className="relative" data-move-menu>
                            <button
                              onClick={(e) => { e.stopPropagation(); setMoveMenu(moveMenu === contact.id ? null : contact.id); }}
                              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <GripVertical className="w-3.5 h-3.5 text-slate-400" />
                            </button>

                            {/* Move dropdown */}
                            {moveMenu === contact.id && (
                              <div className="absolute right-0 top-7 z-50 w-44 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg py-1">
                                <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Move to</p>
                                {STAGES.filter((s) => s.key !== contact.status).map((s) => {
                                  const SIcon = s.icon;
                                  return (
                                    <button
                                      key={s.key}
                                      onClick={() => moveContact(contact.id, s.key)}
                                      className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                    >
                                      <SIcon className={`w-3.5 h-3.5 ${s.text}`} />
                                      {s.label}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Contact person */}
                        {contact.contact_person && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1 truncate">
                            <UserCircle className="w-3 h-3 flex-shrink-0" /> {contact.contact_person}
                            {contact.contact_role && <span className="text-slate-400 dark:text-slate-500">· {contact.contact_role}</span>}
                          </p>
                        )}

                        {/* City */}
                        {contact.city && (
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3 flex-shrink-0" /> {contact.city}
                          </p>
                        )}

                        {/* Tags */}
                        {contact.tags && contact.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {contact.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                <Tag className="w-2.5 h-2.5" /> {tag}
                              </span>
                            ))}
                            {contact.tags.length > 3 && (
                              <span className="text-[10px] text-slate-400">+{contact.tags.length - 3}</span>
                            )}
                          </div>
                        )}

                        {/* Footer: time + quick advance */}
                        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700">
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">
                            {formatRelative(contact.updated_at || contact.created_at)}
                          </span>
                          <div className="flex items-center gap-1">
                            {prevStage && (
                              <button
                                onClick={() => moveContact(contact.id, prevStage)}
                                disabled={isMoving}
                                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                title={`Move to ${STAGES.find((s) => s.key === prevStage)?.label}`}
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {nextStage && (
                              <button
                                onClick={() => moveContact(contact.id, nextStage)}
                                disabled={isMoving}
                                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                title={`Move to ${STAGES.find((s) => s.key === nextStage)?.label}`}
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => router.push(`/outreach/contacts/${contact.id}`)}
                              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-blue-600 transition-colors"
                              title="View timeline"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
