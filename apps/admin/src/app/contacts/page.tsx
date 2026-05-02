"use client";

import { useState, useEffect } from "react";

interface Contact {
  id: string;
  name: string;
  email: string;
  type: string;
  company_name?: string;
  subject: string;
  message: string;
  lang: string;
  status: string;
  created_at: string;
}

const TABS = ["all", "new", "read", "done"] as const;
const TAB_LABELS: Record<string, string> = { all: "Alles", new: "Nieuw", read: "Gelezen", done: "Afgehandeld" };

const STATUS_CONFIG: Record<string, { label: string; cls: string; dot: string }> = {
  new: { label: "Nieuw", cls: "bg-blue-50 text-blue-700 border border-blue-200", dot: "bg-blue-500" },
  read: { label: "Gelezen", cls: "bg-amber-50 text-amber-700 border border-amber-200", dot: "bg-amber-500" },
  done: { label: "Afgehandeld", cls: "bg-green-50 text-green-700 border border-green-200", dot: "bg-green-500" },
};

function relativeTime(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m geleden`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}u geleden`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d geleden`;
  return new Date(d).toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
}

function initials(name: string) {
  return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "?";
}

function ShimmerRow() {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-[#F1F5F9] shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-32 rounded bg-[#F1F5F9]" />
          <div className="h-3 w-48 rounded bg-[#F1F5F9]" />
          <div className="h-3 w-full rounded bg-[#F1F5F9]" />
          <div className="h-3 w-3/4 rounded bg-[#F1F5F9]" />
        </div>
        <div className="h-6 w-20 rounded-full bg-[#F1F5F9] shrink-0" />
      </div>
    </div>
  );
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<string>("all");
  const [replyTo, setReplyTo] = useState<Contact | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/contacts")
      .then((r) => r.json())
      .then((d) => setContacts(d.contacts || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch("/api/admin/contacts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  }

  async function sendReply() {
    if (!replyTo || !replyText.trim()) return;
    setSending(true);
    try {
      await fetch("/api/admin/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: replyTo.email, name: replyTo.name, subject: `Re: ${replyTo.subject}`, message: replyText }),
      });
      await updateStatus(replyTo.id, "done");
      setReplyTo(null);
      setReplyText("");
    } catch {
      alert("Verzenden mislukt");
    } finally {
      setSending(false);
    }
  }

  const filtered = tab === "all" ? contacts : contacts.filter((c) => c.status === tab);
  const newCount = contacts.filter(c => c.status === "new").length;
  const readCount = contacts.filter(c => c.status === "read").length;
  const doneCount = contacts.filter(c => c.status === "done").length;
  const countMap: Record<string, number> = { new: newCount, read: readCount, done: doneCount };

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#0A2540] tracking-tight">Berichten</h1>
          <p className="text-sm text-[#64748B] mt-1">{contacts.length} berichten ontvangen</p>
        </div>
        {newCount > 0 && (
          <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />
            {newCount} nieuw
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-xl w-fit mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
              tab === t
                ? "bg-white text-[#0A2540] shadow-sm"
                : "text-[#64748B] hover:text-[#0A2540]"
            }`}
          >
            {TAB_LABELS[t]}
            {t !== "all" && countMap[t] > 0 && (
              <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full inline-block ${
                t === "new" ? "bg-blue-100 text-blue-700" : t === "read" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
              }`}>
                {countMap[t]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {loading ? (
          [0, 1, 2].map(i => <ShimmerRow key={i} />)
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center mx-auto mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
            </div>
            <p className="text-sm text-[#64748B]">Geen berichten{tab !== "all" ? " in deze categorie" : ""}</p>
          </div>
        ) : (
          filtered.map((c) => {
            const cfg = STATUS_CONFIG[c.status] || STATUS_CONFIG.new;
            const isExpanded = expanded === c.id;
            return (
              <div
                key={c.id}
                className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:border-[#2563EB]/30 transition-all cursor-pointer"
                onClick={() => {
                  setExpanded(isExpanded ? null : c.id);
                  if (c.status === "new") updateStatus(c.id, "read");
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-[#0A2540] text-white flex items-center justify-center text-[12px] font-bold shrink-0">
                    {initials(c.name)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-[14px] font-semibold text-[#0A2540] truncate">{c.name}</p>
                      {c.company_name && (
                        <span className="text-[11px] text-[#64748B]">{c.company_name}</span>
                      )}
                    </div>
                    <p className="text-[12px] text-[#64748B] mb-2">{c.email} &middot; {c.type}</p>
                    <p className="text-[13px] font-semibold text-[#0A2540] mb-1">{c.subject}</p>
                    <p className={`text-[12px] text-[#64748B] leading-relaxed ${isExpanded ? "" : "line-clamp-2"}`}>
                      {c.message}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-col items-end gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                    <span className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${cfg.cls}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} inline-block`} />
                      {cfg.label}
                    </span>
                    <span className="text-[11px] text-[#94A3B8]">
                      {relativeTime(c.created_at)}
                    </span>
                  </div>
                </div>

                {/* Expanded actions */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[#F1F5F9] flex items-center justify-between" onClick={e => e.stopPropagation()}>
                    <select
                      value={c.status}
                      onChange={(e) => updateStatus(c.id, e.target.value)}
                      className="text-[12px] border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-[#64748B] focus:outline-none focus:border-[#2563EB]"
                    >
                      <option value="new">Nieuw</option>
                      <option value="read">Gelezen</option>
                      <option value="done">Afgehandeld</option>
                    </select>
                    <button
                      onClick={() => { setReplyTo(c); setReplyText(""); }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#0A2540] text-white text-[12px] font-semibold rounded-lg hover:bg-[#0A2540]/90 transition-colors"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                      Reageer
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Reply Modal */}
      {replyTo && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setReplyTo(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-[16px] font-bold text-[#0A2540]">Reageer op {replyTo.name}</h3>
                <p className="text-[12px] text-[#64748B] mt-0.5">{replyTo.email}</p>
              </div>
              <button onClick={() => setReplyTo(null)} className="text-[#94A3B8] hover:text-[#0A2540] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="bg-[#F8FAFC] rounded-xl p-3 mb-4 border border-[#E2E8F0]">
              <p className="text-[11px] text-[#94A3B8] font-medium mb-0.5">Onderwerp: {replyTo.subject}</p>
              <p className="text-[12px] text-[#64748B] line-clamp-2">{replyTo.message}</p>
            </div>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={5}
              placeholder="Typ je reactie..."
              className="w-full p-3 rounded-xl border border-[#E2E8F0] text-[13px] resize-none outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 transition-all"
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => setReplyTo(null)}
                className="px-4 py-2 rounded-lg border border-[#E2E8F0] text-[13px] text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
              >
                Annuleer
              </button>
              <button
                onClick={sendReply}
                disabled={sending || !replyText.trim()}
                className="flex items-center gap-1.5 px-5 py-2 bg-[#0A2540] text-white text-[13px] font-semibold rounded-lg hover:bg-[#0A2540]/90 disabled:opacity-50 transition-all"
              >
                {sending ? (
                  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity="0.25"/><path d="M21 12a9 9 0 01-9 9" strokeLinecap="round"/></svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                )}
                {sending ? "Verzenden..." : "Verzend"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
