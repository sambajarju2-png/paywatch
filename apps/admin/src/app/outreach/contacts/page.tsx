"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
} from "lucide-react";

interface Contact {
  id: string;
  organization_name: string;
  type: string;
  website: string | null;
  contact_person: string | null;
  contact_role: string | null;
  contact_email: string | null;
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

const TYPE_LABELS: Record<string, string> = {
  all: "All",
  incasso: "Incasso",
  aid_org: "Hulporg",
  gemeente: "Gemeente",
  bewindvoerder: "Bewindvoerder",
  kredietbank: "Kredietbank",
  journalist: "Journalist",
};

const TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "incasso", label: "Incasso" },
  { value: "aid_org", label: "Hulporganisatie" },
  { value: "gemeente", label: "Gemeente" },
  { value: "bewindvoerder", label: "Bewindvoerder" },
  { value: "kredietbank", label: "Kredietbank" },
  { value: "journalist", label: "Journalist" },
];

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "new", label: "New" },
  { value: "researched", label: "Researched" },
  { value: "queued", label: "Queued" },
  { value: "contacted", label: "Contacted" },
  { value: "replied", label: "Replied" },
  { value: "meeting_booked", label: "Meeting Booked" },
  { value: "not_interested", label: "Not Interested" },
  { value: "bounced", label: "Bounced" },
];

const BEAT_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "— None —" },
  { value: "tech", label: "Tech" },
  { value: "society", label: "Society" },
  { value: "debt", label: "Debt" },
  { value: "young_people", label: "Young People" },
  { value: "finance", label: "Finance" },
  { value: "politics", label: "Politics" },
];

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

export default function OutreachContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const [researchingId, setResearchingId] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<{ success: number; errors: number } | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (typeFilter !== "all") params.set("type", typeFilter);
      if (searchQuery) params.set("search", searchQuery);
      const res = await fetch(`/api/admin/outreach/contacts?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setContacts(data.contacts);
    } catch {
      console.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }, [typeFilter, searchQuery]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick() { setOpenMenuId(null); }
    if (openMenuId) document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [openMenuId]);

  async function handleResearch(contactId: string) {
    setResearchingId(contactId);
    try {
      const res = await fetch("/api/admin/outreach/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId }),
      });
      if (!res.ok) throw new Error("Research failed");
      await fetchContacts();
    } catch (err) { console.error("Research error:", err); }
    finally { setResearchingId(null); }
  }

  async function handleVerify(contactId: string) {
    setVerifyingId(contactId);
    try {
      const res = await fetch("/api/admin/outreach/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId }),
      });
      if (res.ok) {
        await fetchContacts();
      }
    } catch { console.error("Verify error"); }
    finally { setVerifyingId(null); }
  }

  async function handleDelete(contactId: string) {
    try {
      const res = await fetch(`/api/admin/outreach/contacts?id=${contactId}`, {
        method: "DELETE",
      });
      if (res.ok) await fetchContacts();
    } catch { console.error("Delete error"); }
    finally { setDeleteConfirmId(null); }
  }

  async function handleEditSave(contactId: string, updates: Partial<Contact>) {
    try {
      const res = await fetch("/api/admin/outreach/contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: contactId, ...updates }),
      });
      if (!res.ok) throw new Error("Update failed");
      await fetchContacts();
      setEditingContact(null);
    } catch (err) {
      console.error("Edit error:", err);
      throw err;
    }
  }

  async function handleImport(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/outreach/import", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Import failed");
      const result = await res.json();
      setImportResult({ success: result.imported, errors: result.errors });
      await fetchContacts();
      setTimeout(() => setImportResult(null), 5000);
    } catch { console.error("Import error"); }
    setShowImportModal(false);
  }

  const typeCounts = contacts.reduce(
    (acc, c) => { acc[c.type] = (acc[c.type] || 0) + 1; acc.all = (acc.all || 0) + 1; return acc; },
    { all: 0 } as Record<string, number>
  );

  return (
    <div className="space-y-4">
      {importResult && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-xs">
          <CheckCircle2 size={14} className="text-pw-green" />
          <span className="text-pw-green font-semibold">Imported {importResult.success} contacts</span>
          {importResult.errors > 0 && <span className="text-pw-red">({importResult.errors} errors)</span>}
        </div>
      )}

      {/* Top bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-pw-muted" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-pw-border bg-white focus:outline-none focus:border-pw-blue"
          />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowImportModal(true)} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-pw-border bg-white hover:bg-gray-50">
            <Upload size={12} /> Import CSV
          </button>
          <button onClick={fetchContacts} className="p-2 rounded-lg border border-pw-border bg-white hover:bg-gray-50">
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 flex-wrap">
        {Object.entries(TYPE_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTypeFilter(key)}
            className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-colors ${
              typeFilter === key
                ? "bg-pw-blue text-white"
                : "bg-white text-pw-muted border border-pw-border hover:bg-gray-50"
            }`}
          >
            {label}
            {typeCounts[key] !== undefined && (
              <span className={`ml-1 ${typeFilter === key ? "text-blue-200" : "text-gray-400"}`}>
                {typeCounts[key] || 0}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Contacts table */}
      <div className="bg-white rounded-xl border border-pw-border overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-pw-border bg-gray-50/50">
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
              <tr><td colSpan={7} className="text-center py-12">
                <Loader2 className="animate-spin mx-auto text-pw-muted" size={20} />
              </td></tr>
            ) : contacts.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-pw-muted">
                No contacts found. <button onClick={() => setShowImportModal(true)} className="text-pw-blue font-semibold hover:underline">Import your first CSV</button>
              </td></tr>
            ) : (
              contacts.map((c) => {
                const statusStyle = STATUS_COLORS[c.status] || STATUS_COLORS.new;
                return (
                  <tr key={c.id} className="border-b border-pw-border last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-pw-text">{c.organization_name}</div>
                      {c.website && (
                        <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-[10px] text-pw-blue flex items-center gap-0.5 hover:underline mt-0.5">
                          <Globe size={8} /> {c.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                        </a>
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
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-600">
                        {TYPE_LABELS[c.type] || c.type}
                      </span>
                      {c.beat && <div className="text-[9px] text-pw-muted mt-0.5">{c.beat}</div>}
                    </td>
                    <td className="px-4 py-3 text-pw-muted">{c.city || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {c.ai_research_summary ? (
                        <div className="max-w-[200px]">
                          <p className="text-[10px] text-pw-text line-clamp-2">{c.ai_research_summary}</p>
                          <p className="text-[9px] text-pw-muted mt-0.5">
                            {c.ai_researched_at ? new Date(c.ai_researched_at).toLocaleDateString("nl-NL") : ""}
                          </p>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleResearch(c.id)}
                          disabled={researchingId === c.id}
                          className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-purple-600 bg-purple-50 rounded hover:bg-purple-100 disabled:opacity-50"
                        >
                          {researchingId === c.id ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                          Research
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === c.id ? null : c.id); }}
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <MoreHorizontal size={14} className="text-pw-muted" />
                        </button>
                        {openMenuId === c.id && (
                          <div className="absolute right-0 top-8 w-40 bg-white rounded-lg border border-pw-border shadow-lg z-20 py-1">
                            <button
                              onClick={() => { setEditingContact(c); setOpenMenuId(null); }}
                              className="flex items-center gap-2 w-full px-3 py-2 text-[11px] text-pw-text hover:bg-gray-50 text-left"
                            >
                              <Pencil size={12} className="text-pw-blue" /> Edit Contact
                            </button>
                            <button
                              onClick={() => { handleResearch(c.id); setOpenMenuId(null); }}
                              className="flex items-center gap-2 w-full px-3 py-2 text-[11px] text-pw-text hover:bg-gray-50 text-left"
                            >
                              <Sparkles size={12} className="text-purple-500" /> AI Research
                            </button>
                            <button
                              onClick={() => { handleVerify(c.id); setOpenMenuId(null); }}
                              disabled={verifyingId === c.id}
                              className="flex items-center gap-2 w-full px-3 py-2 text-[11px] text-pw-text hover:bg-gray-50 text-left"
                            >
                              {verifyingId === c.id ? <Loader2 size={12} className="animate-spin" /> : <ShieldCheck size={12} className="text-pw-green" />}
                              Verify Email
                            </button>
                            <div className="border-t border-pw-border my-1" />
                            <button
                              onClick={() => { setDeleteConfirmId(c.id); setOpenMenuId(null); }}
                              className="flex items-center gap-2 w-full px-3 py-2 text-[11px] text-pw-red hover:bg-red-50 text-left"
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Delete confirm */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl text-center">
            <Trash2 size={24} className="mx-auto mb-3 text-pw-red" />
            <h3 className="text-sm font-bold text-pw-navy mb-1">Delete contact?</h3>
            <p className="text-xs text-pw-muted mb-4">This action cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg border border-pw-border hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg bg-pw-red text-white hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editingContact && (
        <EditContactModal
          contact={editingContact}
          onClose={() => setEditingContact(null)}
          onSave={handleEditSave}
        />
      )}

      {showImportModal && <ImportModal onClose={() => setShowImportModal(false)} onImport={handleImport} />}
    </div>
  );
}

/* ─── Edit Contact Modal ─── */
function EditContactModal({
  contact,
  onClose,
  onSave,
}: {
  contact: Contact;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Contact>) => Promise<void>;
}) {
  const [form, setForm] = useState({
    organization_name: contact.organization_name,
    type: contact.type,
    website: contact.website || "",
    contact_person: contact.contact_person || "",
    contact_role: contact.contact_role || "",
    contact_email: contact.contact_email || "",
    general_email: contact.general_email || "",
    phone: contact.phone || "",
    city: contact.city || "",
    kvk_number: contact.kvk_number || "",
    linkedin_url: contact.linkedin_url || "",
    beat: contact.beat || "",
    notes: contact.notes || "",
    status: contact.status,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear beat when switching away from journalist
    if (field === "type" && value !== "journalist") {
      setForm((prev) => ({ ...prev, [field]: value, beat: "" }));
    }
  }

  async function handleSubmit() {
    if (!form.organization_name.trim()) {
      setError("Organization name is required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(contact.id, {
        organization_name: form.organization_name.trim(),
        type: form.type,
        website: form.website.trim() || null,
        contact_person: form.contact_person.trim() || null,
        contact_role: form.contact_role.trim() || null,
        contact_email: form.contact_email.trim() || null,
        general_email: form.general_email.trim() || null,
        phone: form.phone.trim() || null,
        city: form.city.trim() || null,
        kvk_number: form.kvk_number.trim() || null,
        linkedin_url: form.linkedin_url.trim() || null,
        beat: form.type === "journalist" && form.beat.trim() ? form.beat.trim() : null,
        notes: form.notes.trim() || null,
        status: form.status,
      });
    } catch {
      setError("Failed to save changes. Try again.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full px-3 py-2 text-xs rounded-lg border border-pw-border bg-white focus:outline-none focus:border-pw-blue";
  const selectClass =
    "w-full px-3 py-2 text-xs rounded-lg border border-pw-border bg-white focus:outline-none focus:border-pw-blue appearance-none";
  const labelClass = "block text-[11px] font-semibold text-pw-muted mb-1";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-pw-border shrink-0">
          <div className="flex items-center gap-2">
            <Pencil size={16} className="text-pw-blue" />
            <h3 className="text-sm font-bold text-pw-navy">Edit Contact</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X size={16} className="text-pw-muted" />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-pw-red">
              <X size={12} /> {error}
            </div>
          )}

          {/* Organization & Type row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Organization Name *</label>
              <input
                value={form.organization_name}
                onChange={(e) => update("organization_name", e.target.value)}
                className={inputClass}
                placeholder="e.g. Gemeente Rotterdam"
              />
            </div>
            <div>
              <label className={labelClass}>Type *</label>
              <select
                value={form.type}
                onChange={(e) => update("type", e.target.value)}
                className={selectClass}
              >
                {TYPE_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Beat (only for journalists) */}
          {form.type === "journalist" && (
            <div>
              <label className={labelClass}>Beat</label>
              <select
                value={form.beat}
                onChange={(e) => update("beat", e.target.value)}
                className={selectClass}
              >
                {BEAT_OPTIONS.map((b) => (
                  <option key={b.value} value={b.value}>{b.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Contact Person & Role */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Contact Person</label>
              <input
                value={form.contact_person}
                onChange={(e) => update("contact_person", e.target.value)}
                className={inputClass}
                placeholder="e.g. Jan de Vries"
              />
            </div>
            <div>
              <label className={labelClass}>Role</label>
              <input
                value={form.contact_role}
                onChange={(e) => update("contact_role", e.target.value)}
                className={inputClass}
                placeholder="e.g. Projectleider"
              />
            </div>
          </div>

          {/* Emails */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Contact Email</label>
              <input
                type="email"
                value={form.contact_email}
                onChange={(e) => update("contact_email", e.target.value)}
                className={inputClass}
                placeholder="jan@example.nl"
              />
            </div>
            <div>
              <label className={labelClass}>General Email</label>
              <input
                type="email"
                value={form.general_email}
                onChange={(e) => update("general_email", e.target.value)}
                className={inputClass}
                placeholder="info@example.nl"
              />
            </div>
          </div>

          {/* Phone & City */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Phone</label>
              <input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={inputClass}
                placeholder="+31 6 12345678"
              />
            </div>
            <div>
              <label className={labelClass}>City</label>
              <input
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                className={inputClass}
                placeholder="e.g. Rotterdam"
              />
            </div>
          </div>

          {/* Website & KvK */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Website</label>
              <input
                value={form.website}
                onChange={(e) => update("website", e.target.value)}
                className={inputClass}
                placeholder="https://example.nl"
              />
            </div>
            <div>
              <label className={labelClass}>KvK Number</label>
              <input
                value={form.kvk_number}
                onChange={(e) => update("kvk_number", e.target.value)}
                className={inputClass}
                placeholder="e.g. 12345678"
              />
            </div>
          </div>

          {/* LinkedIn */}
          <div>
            <label className={labelClass}>LinkedIn URL</label>
            <input
              value={form.linkedin_url}
              onChange={(e) => update("linkedin_url", e.target.value)}
              className={inputClass}
              placeholder="https://linkedin.com/in/..."
            />
          </div>

          {/* Status */}
          <div>
            <label className={labelClass}>Status</label>
            <select
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
              className={selectClass}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Internal notes..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-6 py-4 border-t border-pw-border shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg border border-pw-border hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg bg-pw-blue text-white hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
            Save Changes
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

  async function handleSubmit() {
    if (!file) return;
    setUploading(true);
    await onImport(file);
    setUploading(false);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-pw-navy">Import Contacts</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X size={16} className="text-pw-muted" />
          </button>
        </div>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center ${dragOver ? "border-pw-blue bg-blue-50" : "border-pw-border"}`}
        >
          {file ? (
            <div>
              <CheckCircle2 size={24} className="mx-auto mb-2 text-pw-green" />
              <p className="text-xs font-semibold text-pw-text">{file.name}</p>
              <p className="text-[10px] text-pw-muted mt-1">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          ) : (
            <div>
              <Upload size={24} className="mx-auto mb-2 text-pw-muted" />
              <p className="text-xs text-pw-muted mb-2">Drag & drop a CSV, or click to browse</p>
              <label className="inline-block px-3 py-1.5 text-[11px] font-semibold text-pw-blue bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100">
                Choose file
                <input type="file" accept=".csv,.tsv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
              </label>
            </div>
          )}
        </div>
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-[10px] font-semibold text-pw-muted mb-1">Expected CSV columns:</p>
          <p className="text-[10px] text-pw-muted font-mono">
            organization_name, type, website, contact_person, contact_role, contact_email, city, beat
          </p>
          <p className="text-[9px] text-pw-muted mt-1">Types: incasso, aid_org, gemeente, bewindvoerder, kredietbank, journalist</p>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg border border-pw-border hover:bg-gray-50">Cancel</button>
          <button onClick={handleSubmit} disabled={!file || uploading} className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg bg-pw-blue text-white hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-1.5">
            {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />} Import
          </button>
        </div>
      </div>
    </div>
  );
}
