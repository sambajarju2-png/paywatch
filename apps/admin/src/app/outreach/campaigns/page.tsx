"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Send,
  Loader2,
  RefreshCw,
  Play,
  Pause,
  Sparkles,
  X,
  ChevronDown,
  MoreHorizontal,
  Users,
  Eye,
  MessageSquare,
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  description: string | null;
  target_type: string | null;
  target_tags: string[];
  from_name: string;
  from_email: string;
  campaign_brief: string;
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
];

export default function OutreachCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const [campRes, accRes] = await Promise.all([
        fetch("/api/admin/outreach/campaigns"),
        fetch("/api/admin/outreach/accounts"),
      ]);
      if (campRes.ok) {
        const data = await campRes.json();
        setCampaigns(data.campaigns);
      }
      if (accRes.ok) {
        const data = await accRes.json();
        setAccounts(data.accounts);
      }
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

  return (
    <div className="space-y-4">
      {/* Top bar */}
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

      {/* Campaign list */}
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

                {/* Stats row */}
                <div className="flex gap-4 mb-3">
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
                </div>

                {/* Progress bar */}
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
                    {c.tone?.replace(/_/g, " ")} · {c.from_name}
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

      {/* New Campaign Modal */}
      {showModal && (
        <NewCampaignModal
          accounts={accounts}
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

function NewCampaignModal({
  accounts,
  onClose,
  onCreated,
}: {
  accounts: Account[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    target_type: "",
    from_email: accounts[0]?.email || "samba@paywatch.nl",
    campaign_brief: "",
    tone: "professional_warm",
    language: "nl",
    steps: [
      { day: 0, type: "initial" },
      { day: 3, type: "follow_up" },
      { day: 7, type: "final" },
    ],
  });

  function updateStep(index: number, field: string, value: number | string) {
    const newSteps = [...form.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setForm({ ...form, steps: newSteps });
  }

  function addStep() {
    const lastDay = form.steps[form.steps.length - 1]?.day || 0;
    setForm({
      ...form,
      steps: [
        ...form.steps,
        { day: lastDay + 4, type: "follow_up" },
      ],
    });
  }

  function removeStep(index: number) {
    if (form.steps.length <= 1) return;
    setForm({
      ...form,
      steps: form.steps.filter((_, i) => i !== index),
    });
  }

  async function handleCreate() {
    if (!form.name || !form.campaign_brief) return;
    setSaving(true);
    try {
      const account = accounts.find((a) => a.email === form.from_email);
      const res = await fetch("/api/admin/outreach/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description || null,
          target_type: form.target_type || null,
          from_email: form.from_email,
          from_name: account?.display_name || "Samba Jarju",
          reply_to: form.from_email,
          campaign_brief: form.campaign_brief,
          tone: form.tone,
          language: form.language,
          sequence_steps: form.steps,
        }),
      });
      if (res.ok) onCreated();
    } catch {
      console.error("Create failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-pw-navy">New Campaign</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X size={16} className="text-pw-muted" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-[11px] font-semibold text-pw-muted mb-1">
              Campaign name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Gemeente Q2 outreach"
              className="w-full px-3 py-2 text-xs rounded-lg border border-pw-border focus:outline-none focus:border-pw-blue"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-semibold text-pw-muted mb-1">
              Description (optional)
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Internal notes about this campaign"
              className="w-full px-3 py-2 text-xs rounded-lg border border-pw-border focus:outline-none focus:border-pw-blue"
            />
          </div>

          {/* Target + Account row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-pw-muted mb-1">
                Target segment
              </label>
              <select
                value={form.target_type}
                onChange={(e) =>
                  setForm({ ...form, target_type: e.target.value })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-pw-border focus:outline-none focus:border-pw-blue bg-white"
              >
                {TARGET_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-pw-muted mb-1">
                Send from
              </label>
              <select
                value={form.from_email}
                onChange={(e) =>
                  setForm({ ...form, from_email: e.target.value })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-pw-border focus:outline-none focus:border-pw-blue bg-white"
              >
                {accounts.map((a) => (
                  <option key={a.email} value={a.email}>
                    {a.display_name} ({a.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tone + Language row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-pw-muted mb-1">
                Tone
              </label>
              <select
                value={form.tone}
                onChange={(e) => setForm({ ...form, tone: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-pw-border focus:outline-none focus:border-pw-blue bg-white"
              >
                {TONES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-pw-muted mb-1">
                Language
              </label>
              <select
                value={form.language}
                onChange={(e) =>
                  setForm({ ...form, language: e.target.value })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-pw-border focus:outline-none focus:border-pw-blue bg-white"
              >
                <option value="nl">Nederlands</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* Campaign Brief */}
          <div>
            <label className="block text-[11px] font-semibold text-pw-muted mb-1">
              <Sparkles size={10} className="inline mr-1 text-purple-500" />
              AI Campaign Brief
            </label>
            <textarea
              value={form.campaign_brief}
              onChange={(e) =>
                setForm({ ...form, campaign_brief: e.target.value })
              }
              rows={4}
              placeholder="Tell Claude what you want to achieve. E.g.: 'Introduce PayWatch to municipalities as a vroegsignalering tool. Mention our free pilot program. Ask for a 15-min call.'"
              className="w-full px-3 py-2 text-xs rounded-lg border border-pw-border focus:outline-none focus:border-pw-blue resize-none"
            />
            <p className="text-[10px] text-pw-muted mt-1">
              Claude will use this + each contact&apos;s AI research to write
              personalized emails
            </p>
          </div>

          {/* Sequence Steps */}
          <div>
            <label className="block text-[11px] font-semibold text-pw-muted mb-2">
              Email sequence
            </label>
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

        {/* Actions */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2.5 text-xs font-semibold rounded-lg border border-pw-border hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!form.name || !form.campaign_brief || saving}
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
