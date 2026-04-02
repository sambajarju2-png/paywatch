"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Upload,
  Sparkles,
  MoreHorizontal,
  Loader2,
  RefreshCw,
  Globe,
  X,
  CheckCircle2,
  Trash2,
  ShieldCheck,
  Pencil,
  Tag,
  Plus,
  ChevronDown,
  Users,
  UserPlus,
  Check,
  FileText,
  MapPin,
  Mail,
} from "lucide-react";

/* ─── Types ─── */
interface Contact {
  id: string;
  organization_name: string;
  type: string;
  website: string | null;
  contact_person: string | null;
  contact_role: string | null;
  contact_email: string | null;
  first_name: string | null;
  last_name: string | null;
  general_email: string | null;
  phone: string | null;
  city: string | null;
  kvk_number: string | null;
  linkedin_url: string | null;
  beat: string | null;
  notes: string | null;
  status: string;
  ai_research_summary: string | null;
  ai_researched_at: string | null;
  tags: string[];
  created_at: string;
}

/* ─── Constants ─── */
const TYPE_LABELS: Record<string, string> = {
  all: "All",
  incasso: "Incasso",
  aid_org: "Hulporg",
  gemeente: "Gemeente",
  bewindvoerder: "Bewindvoerder",
  kredietbank: "Kredietbank",
  journalist: "Journalist",
};

const TYPE_OPTIONS = [
  { value: "incasso", label: "Incasso" },
  { value: "aid_org", label: "Hulporganisatie" },
  { value: "gemeente", label: "Gemeente" },
  { value: "bewindvoerder", label: "Bewindvoerder" },
  { value: "kredietbank", label: "Kredietbank" },
  { value: "journalist", label: "Journalist" },
];

const STATUS_OPTIONS = [
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

const BEAT_LABELS: Record<string, string> = {
  tech: "Tech", society: "Society", debt: "Debt",
  young_people: "Young People", finance: "Finance", politics: "Politics",
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  new: { bg: "bg-blue-50", text: "text-pw-blue" },
  researched: { bg: "bg-purple-50", text: "text-purple-600" },
  queued: { bg: "bg-amber-50", text: "text-pw-amber" },
  contacted: { bg: "bg-indigo-50", text: "text-indigo-600" },
  replied: { bg: "bg-green-50", text: "text-pw-green" },
  meeting_booked: { bg: "bg-emerald-50", text: "text-emerald-600" },
  not_interested: { bg: "bg-gray-100", text: "text-gray-500" },
  bounced: { bg: "bg-red-50", text: "text-pw-red" },
};

const inputClass = "w-full px-3 py-2.5 text-sm rounded-lg border border-pw-border bg-white focus:outline-none focus:border-pw-blue focus:ring-1 focus:ring-pw-blue/20";
const selectClass = "w-full px-3 py-2.5 text-sm rounded-lg border border-pw-border bg-white focus:outline-none focus:border-pw-blue focus:ring-1 focus:ring-pw-blue/20 appearance-none";
const labelClass = "block text-xs font-semibold text-pw-muted mb-1.5";

/* ─── Main ─── */
export default function OutreachContacts() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [beatFilter, setBeatFilter] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [researchingId, setResearchingId] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<{ success: number; errors: number } | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [expandedResearch, setExpandedResearch] = useState<Set<string>>(new Set());

  // Bottom action sheet (mobile) + dropdown portal (desktop)
  const [actionContact, setActionContact] = useState<Contact | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null);

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  // Lists
  const [persistedLists, setPersistedLists] = useState<string[]>([]);
  const [showNewList, setShowNewList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [showBulkListMenu, setShowBulkListMenu] = useState(false);
  const [bulkTagLoading, setBulkTagLoading] = useState(false);
  const [showBulkRemoveMenu, setShowBulkRemoveMenu] = useState(false);

  /* ─── Fetching ─── */
  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (typeFilter !== "all") params.set("type", typeFilter);
      if (searchQuery) params.set("search", searchQuery);
      const res = await fetch(`/api/admin/outreach/contacts?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setContacts(data.contacts);
      }
    } catch { console.error("Failed to load contacts"); }
    finally { setLoading(false); }
  }, [typeFilter, searchQuery]);

  const fetchLists = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/outreach/lists");
      if (res.ok) {
        const data = await res.json();
        setPersistedLists((data.lists || []).map((l: { name: string }) => l.name));
      }
    } catch { console.error("Failed to load lists"); }
  }, []);

  useEffect(() => { fetchContacts(); fetchLists(); }, [fetchContacts, fetchLists]);

  // Close desktop dropdown on click outside
  useEffect(() => {
    if (!actionContact || !menuPos) return;
    let handler: (() => void) | null = null;
    const id = setTimeout(() => {
      handler = () => { setActionContact(null); setMenuPos(null); };
      document.addEventListener("click", handler, { once: true });
    }, 0);
    return () => {
      clearTimeout(id);
      if (handler) document.removeEventListener("click", handler);
    };
  }, [actionContact, menuPos]);

  useEffect(() => { if (typeFilter !== "journalist") setBeatFilter(null); }, [typeFilter]);
  useEffect(() => { setSelectedIds(new Set()); }, [typeFilter, beatFilter, tagFilter, searchQuery]);

  /* ─── Derived data ─── */
  const tagCounts = contacts.reduce((acc, c) => {
    (c.tags || []).forEach((t) => { acc[t] = (acc[t] || 0) + 1; });
    return acc;
  }, {} as Record<string, number>);

  const allTags = Array.from(new Set([...persistedLists, ...Object.keys(tagCounts)])).sort();

  const filteredContacts = contacts.filter((c) => {
    if (beatFilter && c.beat !== beatFilter) return false;
    if (tagFilter && !(c.tags || []).includes(tagFilter)) return false;
    return true;
  });

  const typeCounts = contacts.reduce(
    (acc, c) => { acc[c.type] = (acc[c.type] || 0) + 1; acc.all = (acc.all || 0) + 1; return acc; },
    { all: 0 } as Record<string, number>
  );

  const beatCounts = contacts.reduce((acc, c) => {
    if (c.type === "journalist" && c.beat) acc[c.beat] = (acc[c.beat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const selectedContactTags = Array.from(selectedIds).reduce((acc, id) => {
    const c = contacts.find((ct) => ct.id === id);
    if (c?.tags) c.tags.forEach((t) => acc.add(t));
    return acc;
  }, new Set<string>());

  /* ─── Handlers ─── */
  function openActionSheet(contact: Contact) {
    setActionContact(contact);
    setMenuPos(null);
  }

  function openDesktopMenu(e: React.MouseEvent, contact: Contact) {
    e.stopPropagation();
    if (actionContact?.id === contact.id) { setActionContact(null); setMenuPos(null); return; }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setActionContact(contact);
    setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
  }

  function closeActionMenu() {
    setActionContact(null);
    setMenuPos(null);
  }

  async function handleResearch(contactId: string) {
    setResearchingId(contactId);
    try {
      const res = await fetch("/api/admin/outreach/research", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId }),
      });
      if (res.ok) await fetchContacts();
    } catch (err) { console.error("Research error:", err); }
    finally { setResearchingId(null); }
  }

  async function handleVerify(contactId: string) {
    setVerifyingId(contactId);
    try {
      const res = await fetch("/api/admin/outreach/verify", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId }),
      });
      if (res.ok) await fetchContacts();
    } catch { console.error("Verify error"); }
    finally { setVerifyingId(null); }
  }

  async function handleDelete(contactId: string) {
    try {
      const res = await fetch(`/api/admin/outreach/contacts?id=${contactId}`, { method: "DELETE" });
      if (res.ok) await fetchContacts();
    } catch { console.error("Delete error"); }
    finally { setDeleteConfirmId(null); }
  }

  async function handleBulkDelete() {
    if (selectedIds.size === 0) return;
    setBulkDeleting(true);
    try {
      const promises = Array.from(selectedIds).map((id) =>
        fetch(`/api/admin/outreach/contacts?id=${id}`, { method: "DELETE" })
      );
      await Promise.all(promises);
      await fetchContacts();
      setSelectedIds(new Set());
    } catch { console.error("Bulk delete error"); }
    finally { setBulkDeleting(false); setShowBulkDeleteConfirm(false); }
  }

  async function handleEditSave(contactId: string, updates: Partial<Contact>) {
    const res = await fetch("/api/admin/outreach/contacts", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: contactId, ...updates }),
    });
    if (!res.ok) throw new Error("Update failed");
    await fetchContacts();
    setEditingContact(null);
  }

  async function handleAddContact(data: Partial<Contact>) {
    const res = await fetch("/api/admin/outreach/contacts", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Create failed");
    await fetchContacts();
    setShowAddModal(false);
  }

  async function handleImport(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/outreach/import", { method: "POST", body: formData });
      if (res.ok) {
        const result = await res.json();
        setImportResult({ success: result.imported, errors: result.errors });
        await fetchContacts();
        setTimeout(() => setImportResult(null), 5000);
      }
    } catch { console.error("Import error"); }
    setShowImportModal(false);
  }

  /* ─── List handlers ─── */
  async function handleCreateList() {
    const name = newListName.trim().toLowerCase().replace(/\s+/g, "-");
    if (!name) return;
    await fetch("/api/admin/outreach/lists", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (selectedIds.size > 0) await handleBulkAddTag(name);
    await fetchLists();
    setNewListName("");
    setShowNewList(false);
  }

  async function handleBulkAddTag(tag: string) {
    if (selectedIds.size === 0) return;
    setBulkTagLoading(true);
    try {
      const res = await fetch("/api/admin/outreach/contacts/bulk-tags", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactIds: Array.from(selectedIds), tag, action: "add" }),
      });
      if (res.ok) { await fetchContacts(); setSelectedIds(new Set()); setShowBulkListMenu(false); }
    } catch { console.error("Bulk tag error"); }
    finally { setBulkTagLoading(false); }
  }

  async function handleBulkRemoveTag(tag: string) {
    if (selectedIds.size === 0) return;
    setBulkTagLoading(true);
    try {
      const res = await fetch("/api/admin/outreach/contacts/bulk-tags", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactIds: Array.from(selectedIds), tag, action: "remove" }),
      });
      if (res.ok) { await fetchContacts(); setSelectedIds(new Set()); setShowBulkRemoveMenu(false); }
    } catch { console.error("Bulk remove error"); }
    finally { setBulkTagLoading(false); }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  }
  function toggleSelectAll() {
    setSelectedIds(selectedIds.size === filteredContacts.length ? new Set() : new Set(filteredContacts.map((c) => c.id)));
  }

  /* ─── Render ─── */
  return (
    <div className="space-y-3 sm:space-y-4">
      {importResult && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-xs">
          <CheckCircle2 size={14} className="text-pw-green shrink-0" />
          <span className="text-pw-green font-semibold">Imported {importResult.success} contacts</span>
          {importResult.errors > 0 && <span className="text-pw-red">({importResult.errors} errors)</span>}
        </div>
      )}

      {/* ── Top bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <div className="relative flex-1 min-w-0">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-pw-muted" />
          <input type="text" placeholder="Search contacts..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-pw-border bg-white focus:outline-none focus:border-pw-blue" />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-lg bg-pw-blue text-white hover:bg-blue-600 active:bg-blue-700">
            <UserPlus size={12} /> <span className="hidden sm:inline">Add Contact</span><span className="sm:hidden">Add</span>
          </button>
          <button onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-lg border border-pw-border bg-white hover:bg-gray-50 active:bg-gray-100">
            <Upload size={12} /> <span className="hidden sm:inline">Import CSV</span><span className="sm:hidden">Import</span>
          </button>
          <button onClick={() => { fetchContacts(); fetchLists(); }}
            className="p-2.5 rounded-lg border border-pw-border bg-white hover:bg-gray-50 active:bg-gray-100">
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* ── Type filter tabs ── */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {Object.entries(TYPE_LABELS).map(([key, label]) => (
          <button key={key} onClick={() => setTypeFilter(key)}
            className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              typeFilter === key ? "bg-pw-blue text-white" : "bg-white text-pw-muted border border-pw-border hover:bg-gray-50 active:bg-gray-100"
            }`}>
            {label}
            {typeCounts[key] !== undefined && (
              <span className={`ml-1 ${typeFilter === key ? "text-blue-200" : "text-gray-400"}`}>{typeCounts[key] || 0}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Journalist beat sub-filter ── */}
      {typeFilter === "journalist" && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          <span className="text-[10px] font-semibold text-pw-muted mr-1 shrink-0">Beat:</span>
          <button onClick={() => setBeatFilter(null)}
            className={`px-2.5 py-1 text-[10px] font-semibold rounded-md transition-colors shrink-0 ${
              !beatFilter ? "bg-purple-100 text-purple-700" : "bg-white text-pw-muted border border-pw-border hover:bg-gray-50"
            }`}>All</button>
          {Object.entries(BEAT_LABELS).map(([key, label]) => (
            <button key={key} onClick={() => setBeatFilter(beatFilter === key ? null : key)}
              className={`px-2.5 py-1 text-[10px] font-semibold rounded-md transition-colors shrink-0 ${
                beatFilter === key ? "bg-purple-100 text-purple-700" : "bg-white text-pw-muted border border-pw-border hover:bg-gray-50"
              }`}>
              {label}
              {beatCounts[key] ? <span className={`ml-1 ${beatFilter === key ? "text-purple-400" : "text-gray-400"}`}>{beatCounts[key]}</span> : null}
            </button>
          ))}
        </div>
      )}

      {/* ── Lists ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        <Tag size={12} className="text-pw-muted shrink-0" />
        <span className="text-[10px] font-semibold text-pw-muted mr-0.5 shrink-0">Lists:</span>
        {tagFilter && (
          <button onClick={() => setTagFilter(null)}
            className="px-2.5 py-1 text-[10px] font-semibold rounded-md bg-white text-pw-muted border border-pw-border hover:bg-gray-50 shrink-0">Show all</button>
        )}
        {allTags.length === 0 && !tagFilter && (
          <span className="text-[10px] text-pw-muted italic">No lists yet</span>
        )}
        {allTags.map((tag) => (
          <button key={tag} onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
            className={`px-2.5 py-1 text-[10px] font-semibold rounded-md transition-colors shrink-0 ${
              tagFilter === tag ? "bg-pw-blue text-white" : "bg-blue-50 text-pw-blue hover:bg-blue-100"
            }`}>
            {tag}
            {tagCounts[tag] ? <span className={`ml-1 ${tagFilter === tag ? "text-blue-200" : "text-blue-300"}`}>{tagCounts[tag]}</span> : null}
          </button>
        ))}
        {showNewList ? (
          <div className="flex items-center gap-1 shrink-0">
            <input autoFocus value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreateList(); if (e.key === "Escape") { setShowNewList(false); setNewListName(""); } }}
              placeholder="List name..." className="px-2 py-1 text-[10px] rounded-md border border-pw-blue bg-white focus:outline-none w-28" />
            <button onClick={handleCreateList}
              className="px-2 py-1 text-[10px] font-semibold rounded-md bg-pw-blue text-white hover:bg-blue-600">
              {selectedIds.size > 0 ? `Add ${selectedIds.size}` : "Create"}
            </button>
            <button onClick={() => { setShowNewList(false); setNewListName(""); }} className="p-1 text-pw-muted hover:text-pw-text">
              <X size={10} />
            </button>
          </div>
        ) : (
          <button onClick={() => setShowNewList(true)}
            className="flex items-center gap-0.5 px-2 py-1 text-[10px] font-semibold rounded-md text-pw-blue hover:bg-blue-50 transition-colors shrink-0">
            <Plus size={10} /> New List
          </button>
        )}
      </div>

      {/* ── Select all bar (mobile) ── */}
      <div className="flex items-center gap-2 md:hidden">
        <button onClick={toggleSelectAll}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg border border-pw-border bg-white hover:bg-gray-50 active:bg-gray-100">
          {selectedIds.size === filteredContacts.length && filteredContacts.length > 0 ? (
            <><Check size={10} className="text-pw-blue" /> Deselect all</>
          ) : (
            <><Users size={10} className="text-pw-muted" /> Select all ({filteredContacts.length})</>
          )}
        </button>
        {selectedIds.size > 0 && (
          <span className="text-[11px] font-semibold text-pw-blue">{selectedIds.size} selected</span>
        )}
      </div>

      {/* ━━━ MOBILE: Card list ━━━ */}
      <div className="md:hidden space-y-2">
        {loading && contacts.length === 0 ? (
          <div className="flex justify-center py-16"><Loader2 className="animate-spin text-pw-muted" size={20} /></div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center py-16 text-sm text-pw-muted">
            {contacts.length === 0 ? (
              <>No contacts found. <button onClick={() => setShowAddModal(true)} className="text-pw-blue font-semibold">Add your first contact</button></>
            ) : "No contacts match the current filters."}
          </div>
        ) : filteredContacts.map((c) => {
          const statusStyle = STATUS_COLORS[c.status] || STATUS_COLORS.new;
          const isSelected = selectedIds.has(c.id);
          return (
            <div key={c.id}
              className={`bg-white rounded-xl border transition-colors ${isSelected ? "border-pw-blue bg-blue-50/30" : "border-pw-border"}`}>
              <div className="flex items-start gap-3 p-3">
                <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(c.id)}
                  className="mt-1 rounded border-gray-300 accent-pw-blue shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link href={`/outreach/contacts/${c.id}`}
                        className="text-sm font-semibold text-pw-text hover:text-pw-blue block truncate">
                        {c.organization_name}
                      </Link>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-600">
                          {TYPE_LABELS[c.type] || c.type}
                        </span>
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                          {c.status}
                        </span>
                        {c.beat && (
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-50 text-purple-600">
                            {BEAT_LABELS[c.beat] || c.beat}
                          </span>
                        )}
                      </div>
                    </div>
                    <button onClick={() => openActionSheet(c)}
                      className="p-2 -mr-1 -mt-0.5 rounded-lg hover:bg-gray-100 active:bg-gray-200 shrink-0">
                      <MoreHorizontal size={16} className="text-pw-muted" />
                    </button>
                  </div>

                  <div className="mt-2 space-y-1">
                    {c.contact_person && (
                      <div className="flex items-center gap-1.5 text-xs text-pw-muted">
                        <Users size={10} className="shrink-0" />
                        <span className="truncate">{c.contact_person}{c.contact_role ? ` · ${c.contact_role}` : ""}</span>
                      </div>
                    )}
                    {(c.contact_email || c.general_email) && (
                      <div className="flex items-center gap-1.5 text-xs text-pw-blue">
                        <Mail size={10} className="shrink-0" />
                        <span className="truncate">{c.contact_email || c.general_email}</span>
                      </div>
                    )}
                    {c.city && (
                      <div className="flex items-center gap-1.5 text-xs text-pw-muted">
                        <MapPin size={10} className="shrink-0" /> <span>{c.city}</span>
                      </div>
                    )}
                    {c.website && (
                      <a href={c.website} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-pw-blue hover:underline">
                        <Globe size={10} className="shrink-0" />
                        <span className="truncate">{c.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}</span>
                      </a>
                    )}
                    {c.notes && (
                      <div className="flex items-start gap-1.5 text-xs text-pw-muted">
                        <FileText size={10} className="shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{c.notes}</span>
                      </div>
                    )}
                  </div>

                  {(c.tags || []).length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {c.tags.map((tag) => (
                        <span key={tag} className="inline-block px-1.5 py-0.5 rounded text-[9px] font-medium bg-blue-50 text-pw-blue">{tag}</span>
                      ))}
                    </div>
                  )}

                  {c.ai_research_summary && (
                    <div className="mt-2 p-2 bg-purple-50/60 rounded-lg cursor-pointer"
                      onClick={() => setExpandedResearch((prev) => { const n = new Set(prev); if (n.has(c.id)) n.delete(c.id); else n.add(c.id); return n; })}>
                      <p className={`text-[10px] text-pw-text ${expandedResearch.has(c.id) ? "" : "line-clamp-2"}`}>{c.ai_research_summary}</p>
                      <p className="text-[9px] text-purple-500 mt-1 font-medium">{expandedResearch.has(c.id) ? "Show less" : "Show more"}</p>
                    </div>
                  )}
                  {!c.ai_research_summary && (
                    <button onClick={() => handleResearch(c.id)} disabled={researchingId === c.id}
                      className="mt-2 flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 active:bg-purple-200 disabled:opacity-50">
                      {researchingId === c.id ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />} Research
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ━━━ DESKTOP: Table ━━━ */}
      <div className="hidden md:block bg-white rounded-xl border border-pw-border overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-pw-border bg-gray-50/50">
              <th className="w-10 px-3 py-2.5">
                <input type="checkbox"
                  checked={filteredContacts.length > 0 && selectedIds.size === filteredContacts.length}
                  onChange={toggleSelectAll} className="rounded border-gray-300 accent-pw-blue" />
              </th>
              <th className="text-left px-4 py-2.5 font-semibold text-pw-muted">Organization</th>
              <th className="text-left px-4 py-2.5 font-semibold text-pw-muted">Contact</th>
              <th className="text-left px-4 py-2.5 font-semibold text-pw-muted">Type</th>
              <th className="text-left px-4 py-2.5 font-semibold text-pw-muted">City</th>
              <th className="text-left px-4 py-2.5 font-semibold text-pw-muted">Status</th>
              <th className="text-left px-4 py-2.5 font-semibold text-pw-muted">AI Research</th>
              <th className="text-right px-4 py-2.5 font-semibold text-pw-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && contacts.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-12"><Loader2 className="animate-spin mx-auto text-pw-muted" size={20} /></td></tr>
            ) : filteredContacts.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-12 text-pw-muted">
                {contacts.length === 0 ? (<>No contacts found. <button onClick={() => setShowAddModal(true)} className="text-pw-blue font-semibold hover:underline">Add your first contact</button></>) : "No contacts match the current filters."}
              </td></tr>
            ) : filteredContacts.map((c) => {
              const statusStyle = STATUS_COLORS[c.status] || STATUS_COLORS.new;
              return (
                <tr key={c.id} onClick={() => router.push(`/outreach/contacts/${c.id}`)} className={`border-b border-pw-border last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer ${selectedIds.has(c.id) ? "bg-blue-50/40" : ""}`}>
                  <td className="w-10 px-3 py-3" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={selectedIds.has(c.id)} onChange={() => toggleSelect(c.id)} className="rounded border-gray-300 accent-pw-blue" />
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/outreach/contacts/${c.id}`} className="font-semibold text-pw-text hover:text-pw-blue transition-colors">{c.organization_name}</Link>
                    {c.website && (
                      <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-[10px] text-pw-blue flex items-center gap-0.5 hover:underline mt-0.5">
                        <Globe size={8} /> {c.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                      </a>
                    )}
                    {c.notes && (
                      <p className="text-[10px] text-pw-muted line-clamp-1 mt-0.5 flex items-center gap-1">
                        <FileText size={8} className="shrink-0" /> {c.notes}
                      </p>
                    )}
                    {(c.tags || []).length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {c.tags.map((tag) => (
                          <span key={tag} className="inline-block px-1.5 py-0.5 rounded text-[9px] font-medium bg-blue-50 text-pw-blue">{tag}</span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {c.contact_person ? (
                      <div>
                        <div className="font-medium text-pw-text">{c.contact_person}</div>
                        <div className="text-[10px] text-pw-muted">{c.contact_role || ""}</div>
                        {c.contact_email && <div className="text-[10px] text-pw-blue mt-0.5">{c.contact_email}</div>}
                      </div>
                    ) : <span className="text-pw-muted">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-600">{TYPE_LABELS[c.type] || c.type}</span>
                    {c.beat && <div className="text-[9px] text-purple-500 font-medium mt-0.5">{BEAT_LABELS[c.beat] || c.beat}</div>}
                  </td>
                  <td className="px-4 py-3 text-pw-muted">{c.city || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${statusStyle.bg} ${statusStyle.text}`}>{c.status}</span>
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    {c.ai_research_summary ? (
                      <div className="max-w-[250px] cursor-pointer" onClick={() => setExpandedResearch((prev) => { const n = new Set(prev); if (n.has(c.id)) n.delete(c.id); else n.add(c.id); return n; })}>
                        <p className={`text-[10px] text-pw-text ${expandedResearch.has(c.id) ? "" : "line-clamp-2"}`}>{c.ai_research_summary}</p>
                        <p className="text-[9px] text-pw-muted mt-0.5">
                          {c.ai_researched_at ? new Date(c.ai_researched_at).toLocaleDateString("nl-NL") : ""}
                          <span className="ml-1 text-pw-blue">{expandedResearch.has(c.id) ? "Show less" : "Show more"}</span>
                        </p>
                      </div>
                    ) : (
                      <button onClick={() => handleResearch(c.id)} disabled={researchingId === c.id}
                        className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-purple-600 bg-purple-50 rounded hover:bg-purple-100 disabled:opacity-50">
                        {researchingId === c.id ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />} Research
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <button onClick={(e) => openDesktopMenu(e, c)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                      <MoreHorizontal size={14} className="text-pw-muted" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ━━━ DESKTOP: 3-dot dropdown portal ━━━ */}
      {actionContact && menuPos && (
        <div className="hidden md:block fixed z-50 w-44 bg-white rounded-lg border border-pw-border shadow-lg py-1"
          style={{ top: menuPos.top, right: menuPos.right }}
          onClick={(e) => e.stopPropagation()}>
          <button onClick={() => { setEditingContact(actionContact); closeActionMenu(); }}
            className="flex items-center gap-2 w-full px-3 py-2 text-[11px] text-pw-text hover:bg-gray-50 text-left">
            <Pencil size={12} className="text-pw-blue" /> Edit Contact
          </button>
          <button onClick={() => { handleResearch(actionContact.id); closeActionMenu(); }}
            className="flex items-center gap-2 w-full px-3 py-2 text-[11px] text-pw-text hover:bg-gray-50 text-left">
            <Sparkles size={12} className="text-purple-500" /> AI Research
          </button>
          <button onClick={() => { handleVerify(actionContact.id); closeActionMenu(); }}
            disabled={verifyingId === actionContact.id}
            className="flex items-center gap-2 w-full px-3 py-2 text-[11px] text-pw-text hover:bg-gray-50 text-left">
            {verifyingId === actionContact.id ? <Loader2 size={12} className="animate-spin" /> : <ShieldCheck size={12} className="text-pw-green" />} Verify Email
          </button>
          <div className="border-t border-pw-border my-1" />
          <button onClick={() => { setDeleteConfirmId(actionContact.id); closeActionMenu(); }}
            className="flex items-center gap-2 w-full px-3 py-2 text-[11px] text-pw-red hover:bg-red-50 text-left">
            <Trash2 size={12} /> Delete
          </button>
        </div>
      )}

      {/* ━━━ MOBILE: Bottom action sheet ━━━ */}
      {actionContact && !menuPos && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={closeActionMenu} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl safe-area-bottom animate-slide-up">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            <div className="px-4 pb-3 border-b border-pw-border">
              <p className="text-sm font-bold text-pw-navy truncate">{actionContact.organization_name}</p>
              {actionContact.contact_email && (
                <p className="text-xs text-pw-muted mt-0.5">{actionContact.contact_email}</p>
              )}
            </div>
            <div className="py-2">
              <button onClick={() => { setEditingContact(actionContact); closeActionMenu(); }}
                className="flex items-center gap-3 w-full px-4 py-3.5 text-sm text-pw-text active:bg-gray-50">
                <Pencil size={18} className="text-pw-blue" /> Edit Contact
              </button>
              <button onClick={() => { handleResearch(actionContact.id); closeActionMenu(); }}
                className="flex items-center gap-3 w-full px-4 py-3.5 text-sm text-pw-text active:bg-gray-50">
                <Sparkles size={18} className="text-purple-500" /> AI Research
              </button>
              <button onClick={() => { handleVerify(actionContact.id); closeActionMenu(); }}
                disabled={verifyingId === actionContact.id}
                className="flex items-center gap-3 w-full px-4 py-3.5 text-sm text-pw-text active:bg-gray-50 disabled:opacity-50">
                {verifyingId === actionContact.id ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} className="text-pw-green" />} Verify Email
              </button>
              <div className="border-t border-pw-border my-1" />
              <button onClick={() => { setDeleteConfirmId(actionContact.id); closeActionMenu(); }}
                className="flex items-center gap-3 w-full px-4 py-3.5 text-sm text-pw-red active:bg-red-50">
                <Trash2 size={18} /> Delete
              </button>
            </div>
            <div className="px-4 pb-4 pt-1">
              <button onClick={closeActionMenu}
                className="w-full py-3 text-sm font-semibold text-pw-muted bg-gray-100 rounded-xl active:bg-gray-200">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bulk action bar ── */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto bg-pw-navy text-white sm:rounded-xl shadow-2xl px-4 sm:px-5 py-3 flex items-center gap-2 sm:gap-4 z-40 safe-area-bottom sm:w-auto">
          <div className="flex items-center gap-2 shrink-0">
            <Users size={14} />
            <span className="text-xs font-semibold">{selectedIds.size}</span>
          </div>
          <div className="w-px h-5 bg-white/20 hidden sm:block" />

          {/* Add to List */}
          <div className="relative">
            <button onClick={(e) => { e.stopPropagation(); setShowBulkListMenu(!showBulkListMenu); setShowBulkRemoveMenu(false); }}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors">
              <Tag size={11} /> <span className="hidden sm:inline">Add to List</span><span className="sm:hidden">List</span> <ChevronDown size={10} />
            </button>
            {showBulkListMenu && (
              <div className="absolute bottom-full mb-2 left-0 w-48 bg-white rounded-lg border border-pw-border shadow-lg py-1 text-pw-text"
                onClick={(e) => e.stopPropagation()}>
                {allTags.length > 0 && (<>
                  {allTags.map((tag) => (
                    <button key={tag} onClick={() => handleBulkAddTag(tag)} disabled={bulkTagLoading}
                      className="flex items-center gap-2 w-full px-3 py-2 text-[11px] hover:bg-gray-50 text-left disabled:opacity-50">
                      <Tag size={10} className="text-pw-blue" /> {tag}
                      <span className="text-[9px] text-pw-muted ml-auto">{tagCounts[tag] || 0}</span>
                    </button>
                  ))}
                  <div className="border-t border-pw-border my-1" />
                </>)}
                <button onClick={() => { setShowBulkListMenu(false); setShowNewList(true); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-[11px] text-pw-blue hover:bg-blue-50 text-left font-semibold">
                  <Plus size={10} /> Create New List
                </button>
              </div>
            )}
          </div>

          {/* Remove from List */}
          {selectedContactTags.size > 0 && (
            <div className="relative">
              <button onClick={(e) => { e.stopPropagation(); setShowBulkRemoveMenu(!showBulkRemoveMenu); setShowBulkListMenu(false); }}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-red-500/20 hover:bg-red-500/30 active:bg-red-500/40 transition-colors">
                <X size={11} /> <span className="hidden sm:inline">Remove</span>
              </button>
              {showBulkRemoveMenu && (
                <div className="absolute bottom-full mb-2 left-0 w-48 bg-white rounded-lg border border-pw-border shadow-lg py-1 text-pw-text"
                  onClick={(e) => e.stopPropagation()}>
                  {Array.from(selectedContactTags).map((tag) => (
                    <button key={tag} onClick={() => handleBulkRemoveTag(tag)} disabled={bulkTagLoading}
                      className="flex items-center gap-2 w-full px-3 py-2 text-[11px] hover:bg-red-50 text-left disabled:opacity-50 text-pw-red">
                      <X size={10} /> {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bulk Delete */}
          <button onClick={() => setShowBulkDeleteConfirm(true)}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-red-500/30 hover:bg-red-500/40 active:bg-red-500/50 transition-colors">
            <Trash2 size={11} /> <span className="hidden sm:inline">Delete</span>
          </button>

          {/* Close */}
          <button onClick={() => setSelectedIds(new Set())} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors ml-auto sm:ml-0">
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Modals ── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm p-6 shadow-xl text-center safe-area-bottom">
            <Trash2 size={24} className="mx-auto mb-3 text-pw-red" />
            <h3 className="text-sm font-bold text-pw-navy mb-1">Delete contact?</h3>
            <p className="text-xs text-pw-muted mb-4">This action cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 px-3 py-2.5 text-xs font-semibold rounded-lg border border-pw-border hover:bg-gray-50 active:bg-gray-100">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 px-3 py-2.5 text-xs font-semibold rounded-lg bg-pw-red text-white hover:bg-red-700 active:bg-red-800">Delete</button>
            </div>
          </div>
        </div>
      )}

      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm p-6 shadow-xl text-center safe-area-bottom">
            <Trash2 size={24} className="mx-auto mb-3 text-pw-red" />
            <h3 className="text-sm font-bold text-pw-navy mb-1">Delete {selectedIds.size} contacts?</h3>
            <p className="text-xs text-pw-muted mb-4">This will permanently delete all selected contacts.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowBulkDeleteConfirm(false)} className="flex-1 px-3 py-2.5 text-xs font-semibold rounded-lg border border-pw-border hover:bg-gray-50 active:bg-gray-100">Cancel</button>
              <button onClick={handleBulkDelete} disabled={bulkDeleting}
                className="flex-1 px-3 py-2.5 text-xs font-semibold rounded-lg bg-pw-red text-white hover:bg-red-700 active:bg-red-800 disabled:opacity-50 flex items-center justify-center gap-1.5">
                {bulkDeleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />} Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      {editingContact && <ContactFormModal mode="edit" contact={editingContact} onClose={() => setEditingContact(null)} onSave={handleEditSave} />}
      {showAddModal && <ContactFormModal mode="add" onClose={() => setShowAddModal(false)} onAdd={handleAddContact} />}
      {showImportModal && <ImportModal onClose={() => setShowImportModal(false)} onImport={handleImport} />}

      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slideUp 0.2s ease-out; }
        .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom, 0); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

/* ─── Contact Form Modal (Add + Edit) ─── */
function ContactFormModal({ mode, contact, onClose, onSave, onAdd }: {
  mode: "add" | "edit"; contact?: Contact; onClose: () => void;
  onSave?: (id: string, updates: Partial<Contact>) => Promise<void>;
  onAdd?: (data: Partial<Contact>) => Promise<void>;
}) {
  const [form, setForm] = useState({
    organization_name: contact?.organization_name || "",
    type: contact?.type || "aid_org",
    website: contact?.website || "",
    contact_person: contact?.contact_person || "",
    contact_role: contact?.contact_role || "",
    contact_email: contact?.contact_email || "",
    first_name: contact?.first_name || "",
    last_name: contact?.last_name || "",
    general_email: contact?.general_email || "",
    phone: contact?.phone || "",
    city: contact?.city || "",
    kvk_number: contact?.kvk_number || "",
    linkedin_url: contact?.linkedin_url || "",
    beat: contact?.beat || "",
    notes: contact?.notes || "",
    status: contact?.status || "new",
  });
  const [saving, setSaving] = useState(false);
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
    setSaving(true); setError(null);
    try {
      const payload = {
        organization_name: form.organization_name.trim(), type: form.type,
        website: form.website.trim() || null, contact_person: form.contact_person.trim() || null,
        contact_role: form.contact_role.trim() || null, contact_email: form.contact_email.trim() || null,
        first_name: form.first_name.trim() || null, last_name: form.last_name.trim() || null,
        general_email: form.general_email.trim() || null, phone: form.phone.trim() || null,
        city: form.city.trim() || null, kvk_number: form.kvk_number.trim() || null,
        linkedin_url: form.linkedin_url.trim() || null,
        beat: form.type === "journalist" && form.beat.trim() ? form.beat.trim() : null,
        notes: form.notes.trim() || null, status: form.status,
      };
      if (mode === "edit" && contact && onSave) await onSave(contact.id, payload);
      else if (mode === "add" && onAdd) await onAdd(payload);
    } catch { setError("Failed to save. Try again."); }
    finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-xl max-h-[95vh] sm:max-h-[90vh] flex flex-col safe-area-bottom">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-pw-border shrink-0">
          <div className="flex items-center gap-2">
            {mode === "edit" ? <Pencil size={16} className="text-pw-blue" /> : <UserPlus size={16} className="text-pw-blue" />}
            <h3 className="text-sm font-bold text-pw-navy">{mode === "edit" ? "Edit Contact" : "Add Contact"}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 active:bg-gray-200"><X size={16} className="text-pw-muted" /></button>
        </div>
        <div className="overflow-y-auto px-5 sm:px-6 py-4 space-y-4 flex-1">
          {error && <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-pw-red"><X size={12} /> {error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className={labelClass}>Organization Name *</label><input value={form.organization_name} onChange={(e) => update("organization_name", e.target.value)} className={inputClass} placeholder="e.g. Gemeente Rotterdam" /></div>
            <div><label className={labelClass}>Type *</label>
              <select value={form.type} onChange={(e) => update("type", e.target.value)} className={selectClass}>
                {TYPE_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
          {form.type === "journalist" && (
            <div><label className={labelClass}>Beat</label>
              <select value={form.beat} onChange={(e) => update("beat", e.target.value)} className={selectClass}>
                {BEAT_OPTIONS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className={labelClass}>First Name</label><input value={form.first_name} onChange={(e) => update("first_name", e.target.value)} className={inputClass} placeholder="e.g. Jan" /></div>
            <div><label className={labelClass}>Last Name</label><input value={form.last_name} onChange={(e) => update("last_name", e.target.value)} className={inputClass} placeholder="e.g. De Vries" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className={labelClass}>Contact Person</label><input value={form.contact_person} onChange={(e) => update("contact_person", e.target.value)} className={inputClass} placeholder="e.g. Jan de Vries" /></div>
            <div><label className={labelClass}>Role</label><input value={form.contact_role} onChange={(e) => update("contact_role", e.target.value)} className={inputClass} placeholder="e.g. Projectleider" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className={labelClass}>Contact Email</label><input type="email" value={form.contact_email} onChange={(e) => update("contact_email", e.target.value)} className={inputClass} placeholder="jan@example.nl" /></div>
            <div><label className={labelClass}>General Email</label><input type="email" value={form.general_email} onChange={(e) => update("general_email", e.target.value)} className={inputClass} placeholder="info@example.nl" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className={labelClass}>Phone</label><input value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} placeholder="+31 6 12345678" /></div>
            <div><label className={labelClass}>City</label><input value={form.city} onChange={(e) => update("city", e.target.value)} className={inputClass} placeholder="e.g. Rotterdam" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className={labelClass}>Website</label><input value={form.website} onChange={(e) => update("website", e.target.value)} className={inputClass} placeholder="https://example.nl" /></div>
            <div><label className={labelClass}>KvK Number</label><input value={form.kvk_number} onChange={(e) => update("kvk_number", e.target.value)} className={inputClass} placeholder="e.g. 12345678" /></div>
          </div>
          <div><label className={labelClass}>LinkedIn URL</label><input value={form.linkedin_url} onChange={(e) => update("linkedin_url", e.target.value)} className={inputClass} placeholder="https://linkedin.com/in/..." /></div>
          {mode === "edit" && (
            <div><label className={labelClass}>Status</label>
              <select value={form.status} onChange={(e) => update("status", e.target.value)} className={selectClass}>
                {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          )}
          <div><label className={labelClass}>Notes / Description</label><textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={4} className={`${inputClass} resize-none`} placeholder="Internal notes, ClickUp description..." /></div>
        </div>
        <div className="flex gap-2 px-5 sm:px-6 py-4 border-t border-pw-border shrink-0">
          <button onClick={onClose} className="flex-1 px-3 py-2.5 text-xs font-semibold rounded-lg border border-pw-border hover:bg-gray-50 active:bg-gray-100">Cancel</button>
          <button onClick={handleSubmit} disabled={saving}
            className="flex-1 px-3 py-2.5 text-xs font-semibold rounded-lg bg-pw-blue text-white hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-1.5">
            {saving ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
            {mode === "edit" ? "Save Changes" : "Add Contact"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Import Modal ─── */
function ImportModal({ onClose, onImport }: { onClose: () => void; onImport: (file: File) => void }) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.name.endsWith(".csv") || f.name.endsWith(".tsv"))) setFile(f);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-5 sm:p-6 shadow-xl safe-area-bottom">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-pw-navy">Import Contacts</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 active:bg-gray-200"><X size={16} className="text-pw-muted" /></button>
        </div>
        <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center ${dragOver ? "border-pw-blue bg-blue-50" : "border-pw-border"}`}>
          {file ? (
            <div>
              <CheckCircle2 size={24} className="mx-auto mb-2 text-pw-green" />
              <p className="text-xs font-semibold text-pw-text">{file.name}</p>
              <p className="text-[10px] text-pw-muted mt-1">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          ) : (
            <div>
              <Upload size={24} className="mx-auto mb-2 text-pw-muted" />
              <p className="text-xs text-pw-muted mb-2">Drag &amp; drop a CSV, or tap to browse</p>
              <label className="inline-block px-3 py-1.5 text-[11px] font-semibold text-pw-blue bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 active:bg-blue-200">
                Choose file
                <input type="file" accept=".csv,.tsv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
              </label>
            </div>
          )}
        </div>
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-[10px] font-semibold text-pw-muted mb-1">Expected CSV columns:</p>
          <p className="text-[10px] text-pw-muted font-mono break-all">organization_name, type, website, contact_person, contact_role, contact_email, city, beat</p>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 px-3 py-2.5 text-xs font-semibold rounded-lg border border-pw-border hover:bg-gray-50 active:bg-gray-100">Cancel</button>
          <button onClick={async () => { if (!file) return; setUploading(true); await onImport(file); setUploading(false); }}
            disabled={!file || uploading}
            className="flex-1 px-3 py-2.5 text-xs font-semibold rounded-lg bg-pw-blue text-white hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-1.5">
            {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />} Import
          </button>
        </div>
      </div>
    </div>
  );
}
