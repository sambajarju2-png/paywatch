"use client";

import { useState, useEffect } from "react";
import AuthGate from "@/components/AuthGate";
import AdminSidebar from "@/components/AdminSidebar";
import { Card } from "@tremor/react";

interface Contact { id: string; name: string; email: string; type: string; company_name: string; subject: string; message: string; lang: string; status: string; created_at: string; }

const TABS = ["all", "new", "read", "done"] as const;
const TAB_LABELS: Record<string, string> = { all: "Alle", new: "Nieuw", read: "Gelezen", done: "Afgehandeld" };

export default function ContactsPage() {
  const [items, setItems] = useState<Contact[]>([]);
  const [tab, setTab] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState<Contact | null>(null);
  const [replyMsg, setReplyMsg] = useState("");
  const [sending, setSending] = useState(false);

  const load = () => { setLoading(true); fetch("/api/admin/contacts").then(r => r.json()).then(d => setItems(d.contacts || [])).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const filtered = tab === "all" ? items : items.filter(i => i.status === tab);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/contacts", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  const sendReply = async () => {
    if (!replyTo || !replyMsg.trim()) return;
    setSending(true);
    try {
      await fetch("/api/admin/reply", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: replyTo.email, subject: `Re: ${replyTo.subject || "Contact"}`, message: replyMsg, name: replyTo.name }) });
      await updateStatus(replyTo.id, "done");
      setReplyTo(null); setReplyMsg("");
    } catch { alert("Verzenden mislukt"); }
    setSending(false);
  };

  return (
    <AuthGate><AdminSidebar />
      <main className="ml-[220px] min-h-screen p-6 bg-tremor-background dark:bg-dark-tremor-background">
        <h1 className="text-tremor-title font-bold text-tremor-content-strong dark:text-dark-tremor-content-strong mb-1">Berichten</h1>
        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content mb-6">{items.length} contactberichten</p>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-tremor-default border border-tremor-border dark:border-dark-tremor-border bg-tremor-background dark:bg-dark-tremor-background w-fit">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-tremor-small text-tremor-label font-medium transition-all ${
                tab === t ? "bg-tremor-brand text-white shadow-tremor-input" : "text-tremor-content dark:text-dark-tremor-content hover:text-tremor-content-strong"
              }`}>
              {TAB_LABELS[t]}
              {t !== "all" && <span className="ml-1.5 opacity-70">({items.filter(i => i.status === t).length})</span>}
            </button>
          ))}
        </div>

        {loading ? <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-tremor-brand border-t-transparent rounded-full animate-spin" /></div> : (
          <div className="space-y-3">
            {filtered.map(item => (
              <Card key={item.id}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">{item.name[0]?.toUpperCase()}</div>
                    <div>
                      <p className="text-tremor-default font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">{item.name} {item.company_name && <span className="text-tremor-content font-normal">({item.company_name})</span>}</p>
                      <p className="text-tremor-label text-tremor-content dark:text-dark-tremor-content">{item.email} · {item.type === "business" ? "Zakelijk" : "Particulier"} · {new Date(item.created_at).toLocaleDateString("nl-NL")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select value={item.status} onChange={(e) => updateStatus(item.id, e.target.value)}
                      className="text-tremor-label font-medium rounded-tremor-small border border-tremor-border dark:border-dark-tremor-border px-2 py-1 bg-tremor-background dark:bg-dark-tremor-background text-tremor-content-strong dark:text-dark-tremor-content-strong outline-none">
                      <option value="new">Nieuw</option><option value="read">Gelezen</option><option value="done">Afgehandeld</option>
                    </select>
                    <span className={`h-2.5 w-2.5 rounded-full ${item.status === "new" ? "bg-blue-500" : item.status === "read" ? "bg-amber-500" : "bg-emerald-500"}`} />
                  </div>
                </div>
                {item.subject && <p className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong mb-1">{item.subject}</p>}
                <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content leading-relaxed whitespace-pre-wrap">{item.message}</p>
                <div className="mt-3 pt-3 border-t border-tremor-border dark:border-dark-tremor-border flex gap-3">
                  <button onClick={() => { setReplyTo(item); setReplyMsg(""); }} className="text-tremor-label font-semibold text-tremor-brand hover:underline">Beantwoorden</button>
                  <a href={`mailto:${item.email}`} className="text-tremor-label font-semibold text-tremor-content dark:text-dark-tremor-content hover:underline">Mail openen</a>
                </div>
              </Card>
            ))}
            {filtered.length === 0 && <p className="text-tremor-default text-tremor-content py-12 text-center">Geen berichten</p>}
          </div>
        )}

        {/* Reply modal */}
        {replyTo && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-tremor-default font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">Antwoord aan {replyTo.name}</h3>
                <button onClick={() => setReplyTo(null)} className="text-tremor-content hover:text-tremor-content-strong">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <p className="text-tremor-label text-tremor-content mb-3">Naar: {replyTo.email}</p>
              <textarea value={replyMsg} onChange={(e) => setReplyMsg(e.target.value)} rows={5} placeholder="Typ je antwoord..."
                className="w-full rounded-tremor-default border border-tremor-border dark:border-dark-tremor-border p-3 text-tremor-default bg-tremor-background dark:bg-dark-tremor-background text-tremor-content-strong dark:text-dark-tremor-content-strong outline-none focus:ring-2 focus:ring-tremor-brand resize-none" />
              <div className="flex justify-end gap-2 mt-3">
                <button onClick={() => setReplyTo(null)} className="px-4 py-2 text-tremor-default font-medium text-tremor-content">Annuleer</button>
                <button onClick={sendReply} disabled={sending || !replyMsg.trim()}
                  className="px-4 py-2 rounded-tremor-small text-tremor-default font-semibold text-white bg-tremor-brand hover:bg-tremor-brand-emphasis disabled:opacity-50 transition-colors">{sending ? "Verzenden..." : "Verstuur"}</button>
              </div>
            </Card>
          </div>
        )}
      </main>
    </AuthGate>
  );
}
