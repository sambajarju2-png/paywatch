"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  Send,
  Loader2,
  RefreshCw,
  Play,
  Pause,
  Sparkles,
  X,
  Users,
  Eye,
  MessageSquare,
  Tag,
  Check,
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  description: string | null;
  target_type: string | null;
  target_tags: string[];
  from_name: string;
  from_email: string;
  from_accounts: string[];
  campaign_brief: string;
  campaign_mode?: string;
  email_subject?: string;
  email_body?: string;
  tone: string;
  language: string;
  sequence_steps: { day: number; type: string }[];
  status: string;
  total_contacts: number;
  total_sent: number;
  total_opened: number;
  total_replied: number;
  total_bounced: number;
  created_at: string;
  started_at: string | null;
}

interface Account {
  id: string;
  email: string;
  display_name: string;
}

interface ContactBasic {
  id: string;
  type: string;
  tags?: string[];
  status: string;
}

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  draft: { bg: "bg-gray-100", text: "text-gray-600" },
  active: { bg: "bg-green-50", text: "text-pw-green" },
  paused: { bg: "bg-amber-50", text: "text-pw-amber" },
  completed: { bg: "bg-blue-50", text: "text-pw-blue" },
};

const TONES = [
  { value: "professional_warm", label: "Professional & warm" },
  { value: "direct", label: "Direct & to-the-point" },
  { value: "data_driven", label: "Data-driven" },
  { value: "consultative", label: "Consultative" },
];

const TARGET_TYPES = [
  { value: "", label: "All types" },
  { value: "incasso", label: "Incasso" },
  { value: "aid_org", label: "Hulporganisatie" },
  { value: "gemeente", label: "Gemeente" },
  { value: "bewindvoerder", label: "Bewindvoerder" },
  { value: "kredietbank", label: "Kredietbank" },
  { value: "journalist", label: "Journalist" },
];

export default function OutreachCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [allContacts, setAllContacts] = useState<ContactBasic[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [sendResult, setSendResult] = useState<{ sent: number; failed: number } | null>(null);
  const [genResult, setGenResult] = useState<{
    generated: number;
    errors: number;
  } | null>(null);

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const [campRes, accRes, contactsRes, listsRes] = await Promise.all([
        fetch("/api/admin/outreach/campaigns"),
        fetch("/api/admin/outreach/accounts"),
        fetch("/api/admin/outreach/contacts"),
        fetch("/api/admin/outreach/lists"),
      ]);
      if (campRes.ok) {
        const data = await campRes.json();
        setCampaigns(data.campaigns);
      }
      if (accRes.ok) {
        const data = await accRes.json();
        setAccounts(data.accounts);
      }
      // Merge tags from contacts + persisted lists
      const tagSet = new Set<string>();
      if (contactsRes.ok) {
        const data = await contactsRes.json();
        const contacts = data.contacts || [];
        setAllContacts(contacts);
        contacts.forEach((c: { tags?: string[] }) =>
          (c.tags || []).forEach((t: string) => tagSet.add(t))
        );
      }
      if (listsRes.ok) {
        const data = await listsRes.json();
        (data.lists || []).forEach((l: { name: string }) => tagSet.add(l.name));
      }
      setAvailableTags(Array.from(tagSet).sort());
    } catch {
      console.error("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      await fetch("/api/admin/outreach/campaigns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      await fetchCampaigns();
    } catch {
      console.error("Status update failed");
    }
  }

  async function handleBulkSend(campaignId: string) {
    if (!confirm("Send this campaign to all matching contacts now?")) return;
    setSendingId(campaignId);
    setSendResult(null);
    try {
      const res = await fetch("/api/admin/outreach/campaigns/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaign_id: campaignId }),
      });
      const data = await res.json();
      if (res.ok) {
        setSendResult({ sent: data.sent, failed: data.failed });
        fetchCampaigns();
        setTimeout(() => setSendResult(null), 5000);
      } else {
        alert(data.error || "Send failed");
      }
    } catch {
      alert("Bulk send failed");
    } finally {
      setSendingId(null);
    }
  }

  async function handleGenerate(campaignId: string) {
    setGeneratingId(campaignId);
    setGenResult(null);
    try {
      const res = await fetch("/api/admin/outreach/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId }),
      });
      if (res.ok) {
        const data = await res.json();
        setGenResult({ generated: data.generated, errors: data.errors });
        await fetchCampaigns();
      }
    } catch {
      console.error("Generate failed");
    } finally {
      setGeneratingId(null);
      setTimeout(() => setGenResult(null), 8000);
    }
  }

  return (
    <div className="space-y-4">
      {genResult && (
        <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-lg px-4 py-2.5 text-xs">
          <Sparkles size={14} className="text-purple-600" />
          <span className="text-purple-700 font-semibold">
            Generated {genResult.generated} emails
          </span>
          {genResult.errors > 0 && (
            <span className="text-pw-red">({genResult.errors} errors)</span>
          )}
        </div>
      )}

      {sendResult && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 text-xs">
          <Send size={14} className="text-emerald-600" />
          <span className="text-emerald-700 font-semibold">
            Sent {sendResult.sent} emails
          </span>
          {sendResult.failed > 0 && (
            <span className="text-pw-red">({sendResult.failed} failed)</span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-pw-muted">
          {campaigns.length} campaign{campaigns.length !== 1 ? "s" : ""}
        </p>
        <div className="flex gap-2">
          <button
            onClick={fetchCampaigns}
            className="p-2 rounded-lg border border-pw-border bg-white hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-pw-blue text-white hover:bg-blue-600 transition-colors"
          >
            <Plus size={12} />
            New Campaign
          </button>
        </div>
      </div>

      {loading && campaigns.length === 0 ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-pw-muted" size={20} />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-pw-border">
          <Send size={24} className="mx-auto mb-3 text-pw-muted" />
          <p className="text-sm font-semibold text-pw-navy mb-1">
            No campaigns yet
          </p>
          <p className="text-xs text-pw-muted mb-4">
            Create your first AI-powered outreach campaign
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-pw-blue text-white hover:bg-blue-600 transition-colors"
          >
            <Plus size={12} />
            New Campaign
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map((c) => {
            const style = STATUS_STYLES[c.status] || STATUS_STYLES.draft;
            const progress =
              c.total_contacts > 0
                ? Math.round((c.total_sent / c.total_contacts) * 100)
                : 0;
            const isGenerating = generatingId === c.id;
            const senderCount = (c.from_accounts || []).length || 1;
            return (
              <div
                key={c.id}
                className="bg-white rounded-xl border border-pw-border p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-pw-navy">
                        {c.name}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${style.bg} ${style.text}`}
                      >
                        {c.status}
                      </span>
                    </div>
                    {c.description && (
                      <p className="text-xs text-pw-muted">{c.description}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {c.campaign_mode === "manual" ? (
                      <button
                        onClick={() => handleBulkSend(c.id)}
                        disabled={sendingId === c.id}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-semibold rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                        title="Send to all matching contacts"
                      >
                        {sendingId === c.id ? (
                          <Loader2 size={10} className="animate-spin" />
                        ) : (
                          <Send size={10} />
                        )}
                        {sendingId === c.id ? "Sending..." : "Send Now"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleGenerate(c.id)}
                        disabled={isGenerating}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-semibold rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors disabled:opacity-50"
                        title="Generate emails with Claude"
                      >
                        {isGenerating ? (
                          <Loader2 size={10} className="animate-spin" />
                        ) : (
                          <Sparkles size={10} />
                        )}
                        {isGenerating ? "Generating..." : "Generate"}
                      </button>
                    )}
                    {c.status === "draft" && (
                      <button
                        onClick={() => handleStatusChange(c.id, "active")}
                        className="p-1.5 rounded-lg hover:bg-green-50 transition-colors"
                        title="Start campaign"
                      >
                        <Play size={14} className="text-pw-green" />
                      </button>
                    )}
                    {c.status === "active" && (
                      <button
                        onClick={() => handleStatusChange(c.id, "paused")}
                        className="p-1.5 rounded-lg hover:bg-amber-50 transition-colors"
                        title="Pause campaign"
                      >
                        <Pause size={14} className="text-pw-amber" />
                      </button>
                    )}
                    {c.status === "paused" && (
                      <button
                        onClick={() => handleStatusChange(c.id, "active")}
                        className="p-1.5 rounded-lg hover:bg-green-50 transition-colors"
                        title="Resume campaign"
                      >
                        <Play size={14} className="text-pw-green" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 mb-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Users size={10} className="text-pw-muted" />
                    <span className="text-[10px] text-pw-muted">
                      {c.total_contacts} contacts
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Send size={10} className="text-pw-muted" />
                    <span className="text-[10px] text-pw-muted">
                      {c.total_sent} sent
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye size={10} className="text-pw-green" />
                    <span className="text-[10px] text-pw-green font-medium">
                      {c.total_opened} opened
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare size={10} className="text-pw-blue" />
                    <span className="text-[10px] text-pw-blue font-medium">
                      {c.total_replied} replied
                    </span>
                  </div>
                  {senderCount > 1 && (
                    <div className="flex items-center gap-1">
                      <Users size={10} className="text-purple-500" />
                      <span className="text-[10px] text-purple-500 font-medium">
                        {senderCount} senders
                      </span>
                    </div>
                  )}
                </div>

                {/* Tags shown on campaign card */}
                {(c.target_tags || []).length > 0 && (
                  <div className="flex gap-1 mb-3 flex-wrap">
                    {c.target_tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-1.5 py-0.5 rounded text-[9px] font-medium bg-blue-50 text-pw-blue"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-pw-blue rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-pw-muted">
                    {c.sequence_steps?.length || 0} step
                    {(c.sequence_steps?.length || 0) !== 1 ? "s" : ""} ·{" "}
                    {c.tone?.replace(/_/g, " ")} ·{" "}
                    {senderCount > 1
                      ? `${senderCount} accounts`
                      : c.from_name}
                  </span>
                  <span className="text-[10px] text-pw-muted">
                    {progress}% complete
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <NewCampaignModal
          accounts={accounts}
          allContacts={allContacts}
          availableTags={availableTags}
          onClose={() => setShowModal(false)}
          onCreated={() => {
            setShowModal(false);
            fetchCampaigns();
          }}
        />
      )}
    </div>
  );
}

/* ─── New Campaign Modal ─── */
function NewCampaignModal({
  accounts,
  allContacts,
  availableTags,
  onClose,
  onCreated,
}: {
  accounts: Account[];
  allContacts: ContactBasic[];
  availableTags: string[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    target_type: "",
    target_tags: [] as string[],
    from_accounts: [accounts[0]?.email || "samba@paywatch.nl"],
    campaign_mode: "manual" as "ai" | "manual",
    campaign_brief: "",
    email_subject: "",
    email_body: "",
    tone: "professional_warm",
    language: "nl",
    steps: [
      { day: 0, type: "initial" },
      { day: 3, type: "follow_up" },
      { day: 7, type: "final" },
    ],
  });

  /* ── Live contact count (server-side) ── */
  const [matchCount, setMatchCount] = useState<number | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);

  useEffect(() => {
    const fetchCount = async () => {
      setMatchLoading(true);
      try {
        const res = await fetch("/api/admin/outreach/contacts/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: form.target_type || null,
            tags: form.target_tags.length > 0 ? form.target_tags : null,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setMatchCount(data.count);
        }
      } catch { console.error("Match count failed"); }
      finally { setMatchLoading(false); }
    };
    fetchCount();
  }, [form.target_type, form.target_tags]);

  function toggleAccount(email: string) {
    setForm((prev) => {
      const has = prev.from_accounts.includes(email);
      if (has && prev.from_accounts.length === 1) return prev; // Keep at least one
      return {
        ...prev,
        from_accounts: has
          ? prev.from_accounts.filter((e) => e !== email)
          : [...prev.from_accounts, email],
      };
    });
  }

  function toggleTag(tag: string) {
    setForm((prev) => ({
      ...prev,
      target_tags: prev.target_tags.includes(tag)
        ? prev.target_tags.filter((t) => t !== tag)
        : [...prev.target_tags, tag],
    }));
  }

  function updateStep(index: number, field: string, value: number | string) {
    const newSteps = [...form.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setForm({ ...form, steps: newSteps });
  }

  function addStep() {
    const lastDay = form.steps[form.steps.length - 1]?.day || 0;
    setForm({
      ...form,
      steps: [...form.steps, { day: lastDay + 4, type: "follow_up" }],
    });
  }

  function removeStep(index: number) {
    if (form.steps.length <= 1) return;
    setForm({ ...form, steps: form.steps.filter((_, i) => i !== index) });
  }

  async function handleCreate() {
    if (!form.name || form.from_accounts.length === 0) return;
    if (form.campaign_mode === "ai" && !form.campaign_brief) return;
    if (form.campaign_mode === "manual" && (!form.email_subject || !form.email_body)) return;
    setSaving(true);
    try {
      const primaryEmail = form.from_accounts[0];
      const primaryAccount = accounts.find((a) => a.email === primaryEmail);
      const res = await fetch("/api/admin/outreach/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description || null,
          target_type: form.target_type || null,
          target_tags: form.target_tags,
          from_accounts: form.from_accounts,
          from_email: primaryEmail,
          from_name: primaryAccount?.display_name || "Samba Jarju",
          reply_to: primaryEmail,
          campaign_mode: form.campaign_mode,
          campaign_brief: form.campaign_mode === "ai" ? form.campaign_brief : null,
          email_subject: form.campaign_mode === "manual" ? form.email_subject : null,
          email_body: form.campaign_mode === "manual" ? form.email_body : null,
          tone: form.tone,
          language: form.language,
          sequence_steps: form.campaign_mode === "ai" ? form.steps : [],
        }),
      });
      if (res.ok) onCreated();
    } catch {
      console.error("Create failed");
    } finally {
      setSaving(false);
    }
  }

  const labelClass = "block text-[11px] font-semibold text-pw-muted mb-1";
  const inputClass =
    "w-full px-3 py-2 text-xs rounded-lg border border-pw-border focus:outline-none focus:border-pw-blue";
  const selectClass =
    "w-full px-3 py-2 text-xs rounded-lg border border-pw-border bg-white focus:outline-none focus:border-pw-blue";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-pw-border shrink-0">
          <div>
            <h3 className="text-sm font-bold text-pw-navy">New Campaign</h3>
            {/* Live contact count */}
            <p className="text-[10px] text-pw-muted mt-0.5 flex items-center gap-1">
              <Users size={10} className={(matchCount ?? 0) > 0 ? "text-pw-green" : "text-pw-muted"} />
              <span className={(matchCount ?? 0) > 0 ? "text-pw-green font-semibold" : ""}>
                {matchCount ?? 0} contact{(matchCount ?? 0) !== 1 ? "s" : ""} match
              </span>
              {form.target_type && (
                <span>
                  · {TARGET_TYPES.find((t) => t.value === form.target_type)?.label}
                </span>
              )}
              {form.target_tags.length > 0 && (
                <span>
                  · {form.target_tags.length} tag{form.target_tags.length !== 1 ? "s" : ""}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100"
          >
            <X size={16} className="text-pw-muted" />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
          <div>
            <label className={labelClass}>Campaign name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Journalist PR Q2"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Description (optional)</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Internal notes"
              className={inputClass}
            />
          </div>

          {/* Target segment + Language */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Target segment</label>
              <select
                value={form.target_type}
                onChange={(e) =>
                  setForm({ ...form, target_type: e.target.value })
                }
                className={selectClass}
              >
                {TARGET_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Language</label>
              <select
                value={form.language}
                onChange={(e) =>
                  setForm({ ...form, language: e.target.value })
                }
                className={selectClass}
              >
                <option value="nl">Nederlands</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* Matching contacts indicator below segment */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
            (matchCount ?? 0) > 0
              ? "bg-green-50 border-green-200"
              : "bg-amber-50 border-amber-200"
          }`}>
            <Users size={12} className={(matchCount ?? 0) > 0 ? "text-pw-green" : "text-amber-500"} />
            <span className={`text-[11px] font-semibold ${(matchCount ?? 0) > 0 ? "text-green-700" : "text-amber-700"}`}>
              {matchCount ?? 0} contact{(matchCount ?? 0) !== 1 ? "s" : ""} will receive this campaign
            </span>
          </div>

          {/* Target tags */}
          {availableTags.length > 0 && (
            <div>
              <label className={labelClass}>
                <Tag size={10} className="inline mr-1 text-pw-blue" />
                Filter by lists (optional — narrows within segment)
              </label>
              <div className="flex gap-1.5 flex-wrap mt-1">
                {availableTags.map((tag) => {
                  const selected = form.target_tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded-md transition-colors ${
                        selected
                          ? "bg-pw-blue text-white"
                          : "bg-blue-50 text-pw-blue hover:bg-blue-100"
                      }`}
                    >
                      {selected && <Check size={8} />}
                      {tag}
                    </button>
                  );
                })}
              </div>
              {form.target_tags.length > 0 && (
                <p className="text-[9px] text-pw-muted mt-1">
                  Only contacts with{" "}
                  {form.target_tags.length === 1 ? "this list" : "any of these lists"}{" "}
                  will receive emails
                </p>
              )}
            </div>
          )}

          {/* Sending accounts — multi-select */}
          <div>
            <label className={labelClass}>
              Send from ({form.from_accounts.length} selected)
            </label>
            <div className="space-y-1.5 mt-1">
              {accounts.map((acc) => {
                const selected = form.from_accounts.includes(acc.email);
                return (
                  <label
                    key={acc.email}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                      selected
                        ? "border-pw-blue bg-blue-50/50"
                        : "border-pw-border bg-white hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleAccount(acc.email)}
                      className="rounded border-gray-300 accent-pw-blue"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-semibold text-pw-text truncate">
                        {acc.display_name}
                      </div>
                      <div className="text-[10px] text-pw-muted truncate">
                        {acc.email}
                      </div>
                    </div>
                    {selected && form.from_accounts.length > 1 && (
                      <span className="text-[9px] font-semibold text-pw-blue bg-blue-100 px-1.5 py-0.5 rounded">
                        {Math.round(100 / form.from_accounts.length)}%
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
            {form.from_accounts.length > 1 && (
              <p className="text-[9px] text-pw-muted mt-1.5">
                Emails will be distributed evenly across {form.from_accounts.length} accounts (
                {Math.round(100 / form.from_accounts.length)}% each)
              </p>
            )}
          </div>

          {/* Mode toggle */}
          <div>
            <label className={labelClass}>Campaign type</label>
            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                onClick={() => setForm({ ...form, campaign_mode: "manual" })}
                className={`flex-1 px-3 py-2 text-xs font-semibold rounded-md transition-all ${
                  form.campaign_mode === "manual"
                    ? "bg-white text-pw-navy shadow-sm"
                    : "text-pw-muted hover:text-pw-text"
                }`}
              >
                ✉️ Manual template
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, campaign_mode: "ai" })}
                className={`flex-1 px-3 py-2 text-xs font-semibold rounded-md transition-all ${
                  form.campaign_mode === "ai"
                    ? "bg-white text-pw-navy shadow-sm"
                    : "text-pw-muted hover:text-pw-text"
                }`}
              >
                <Sparkles size={10} className="inline mr-1 text-purple-500" />
                AI generated
              </button>
            </div>
          </div>

          {form.campaign_mode === "manual" ? (
            <>
              {/* Subject template */}
              <div>
                <label className={labelClass}>Email subject</label>
                <input
                  value={form.email_subject}
                  onChange={(e) => setForm({ ...form, email_subject: e.target.value })}
                  placeholder="e.g. Kort gesprek over financiële toegankelijkheid, {{voornaam}}?"
                  className={inputClass}
                />
              </div>

              {/* Body template */}
              <div>
                <label className={labelClass}>Email body</label>
                <textarea
                  value={form.email_body}
                  onChange={(e) => setForm({ ...form, email_body: e.target.value })}
                  rows={8}
                  placeholder={"Beste {{voornaam}},\n\nIk zou graag met je in gesprek gaan over iets dat ik bouw bij {{bedrijf}}...\n\nGroet,\nSamba"}
                  className={`${inputClass} resize-none`}
                />
                <p className="text-[10px] text-pw-muted mt-1">
                  Variables: <code className="text-blue-500">{"{{voornaam}}"}</code>{" "}
                  <code className="text-blue-500">{"{{achternaam}}"}</code>{" "}
                  <code className="text-blue-500">{"{{bedrijf}}"}</code>{" "}
                  <code className="text-blue-500">{"{{email}}"}</code>{" "}
                  <code className="text-blue-500">{"{{functie}}"}</code>{" "}
                  <code className="text-blue-500">{"{{stad}}"}</code>{" "}
                  <code className="text-blue-500">{"{{website}}"}</code>{" "}
                  — auto-replaced per contact on send
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Tone */}
              <div>
                <label className={labelClass}>Tone</label>
                <select
                  value={form.tone}
                  onChange={(e) => setForm({ ...form, tone: e.target.value })}
                  className={selectClass}
                >
                  {TONES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Campaign brief */}
              <div>
                <label className={labelClass}>
                  <Sparkles size={10} className="inline mr-1 text-purple-500" />
                  AI Campaign Brief
                </label>
                <textarea
                  value={form.campaign_brief}
                  onChange={(e) =>
                    setForm({ ...form, campaign_brief: e.target.value })
                  }
                  rows={4}
                  placeholder="Tell Claude what you want to achieve. E.g.: 'Introduce PayWatch to tech journalists...'"
                  className={`${inputClass} resize-none`}
                />
                <p className="text-[10px] text-pw-muted mt-1">
                  Claude will use this + each contact&apos;s AI research to write
                  personalized emails
                </p>
              </div>
            </>
          )}

          {/* Email sequence */}
          <div>
            <label className={labelClass}>Email sequence</label>
            <div className="space-y-2">
              {form.steps.map((step, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 border border-gray-100"
                >
                  <span className="text-[10px] font-bold text-pw-blue w-6 text-center">
                    {i + 1}
                  </span>
                  <div className="flex items-center gap-1 flex-1">
                    <span className="text-[10px] text-pw-muted">Day</span>
                    <input
                      type="number"
                      value={step.day}
                      onChange={(e) =>
                        updateStep(i, "day", parseInt(e.target.value) || 0)
                      }
                      min={0}
                      className="w-12 px-1.5 py-1 text-[10px] text-center rounded border border-pw-border focus:outline-none focus:border-pw-blue"
                    />
                  </div>
                  <select
                    value={step.type}
                    onChange={(e) => updateStep(i, "type", e.target.value)}
                    className="px-2 py-1 text-[10px] rounded border border-pw-border bg-white focus:outline-none"
                  >
                    <option value="initial">Initial email</option>
                    <option value="follow_up">Follow-up</option>
                    <option value="final">Final touch</option>
                    <option value="breakup">Breakup email</option>
                  </select>
                  {form.steps.length > 1 && (
                    <button
                      onClick={() => removeStep(i)}
                      className="p-0.5 rounded hover:bg-red-50"
                    >
                      <X size={10} className="text-pw-red" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addStep}
              className="mt-2 text-[10px] font-semibold text-pw-blue hover:underline flex items-center gap-0.5"
            >
              <Plus size={10} /> Add step
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-6 py-4 border-t border-pw-border shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2.5 text-xs font-semibold rounded-lg border border-pw-border hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={
              !form.name ||
              !form.campaign_brief ||
              form.from_accounts.length === 0 ||
              saving
            }
            className="flex-1 px-3 py-2.5 text-xs font-semibold rounded-lg bg-pw-blue text-white hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {saving ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Plus size={12} />
            )}
            Create Campaign
          </button>
        </div>
      </div>
    </div>
  );
}
