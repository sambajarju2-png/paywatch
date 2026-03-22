"use client";

import { useState, useEffect } from "react";

interface Application {
  id: string;
  job_id: string;
  job_title: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  lang: string;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = { new: "#2563EB", read: "#D97706", done: "#059669" };
const statusLabels: Record<string, string> = { new: "New", read: "Read", done: "Done" };

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch("/api/admin/applications").then(r => r.json()).then(d => setApps(d.applications || [])).finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch("/api/admin/applications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }

  async function sendReply(app: Application) {
    if (!replyText.trim()) return;
    setSending(true);
    await fetch("/api/admin/reply", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: app.email, name: app.name, subject: `Re: Your application — ${app.job_title}`, message: replyText, lang: app.lang }) });
    setSending(false);
    setReplyTo(null);
    setReplyText("");
    updateStatus(app.id, "done");
  }

  const filtered = filter === "all" ? apps : apps.filter(a => a.status === filter);
  const counts = { all: apps.length, new: apps.filter(a => a.status === "new").length, read: apps.filter(a => a.status === "read").length, done: apps.filter(a => a.status === "done").length };

  if (loading) return <div className="animate-pulse"><div className="h-8 w-48 bg-gray-200 rounded mb-8" />{[1,2,3].map(i=><div key={i} className="h-20 bg-gray-100 rounded-xl mb-3"/>)}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Job Applications</h1>
      <p className="text-sm text-gray-500 mb-6">{apps.length} total applications</p>

      <div className="flex gap-2 mb-6">
        {(["all", "new", "read", "done"] as const).map(tab => (
          <button key={tab} onClick={() => setFilter(tab)}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${filter === tab ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {tab === "all" ? "All" : statusLabels[tab]} ({counts[tab]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center"><p className="text-sm text-gray-400">No applications in this category</p></div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(a => (
            <div key={a.id} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <button onClick={() => { setExpanded(expanded === a.id ? null : a.id); if (a.status === "new") updateStatus(a.id, "read"); }}
                className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: statusColors[a.status] || "#94A3B8" }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{a.name}</p>
                    <p className="text-xs text-gray-400 truncate">{a.job_title} · {a.email}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                    <span className="inline-flex items-center rounded px-2 py-0.5 text-[10px] font-semibold uppercase bg-purple-50 text-purple-700">{a.job_id}</span>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded" style={{ color: statusColors[a.status], background: `color-mix(in srgb, ${statusColors[a.status]} 10%, transparent)` }}>{statusLabels[a.status] || a.status}</span>
                    <span className="text-xs text-gray-400">{new Date(a.created_at).toLocaleDateString("nl-NL")}</span>
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" className={`ml-3 transition-transform ${expanded === a.id ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
              </button>

              {expanded === a.id && (
                <div className="px-5 pb-4 border-t border-gray-100 pt-3">
                  <div className="grid sm:grid-cols-3 gap-2 mb-3 text-xs">
                    <div><span className="text-gray-400">Role:</span> <span className="font-medium text-gray-700">{a.job_title}</span></div>
                    <div><span className="text-gray-400">Phone:</span> <span className="font-medium text-gray-700">{a.phone || "—"}</span></div>
                    <div><span className="text-gray-400">Date:</span> <span className="font-medium text-gray-700">{new Date(a.created_at).toLocaleString("nl-NL")}</span></div>
                  </div>

                  {a.message && (
                    <div className="rounded-lg bg-gray-50 border border-gray-100 p-4 mb-3">
                      <p className="text-xs text-gray-400 mb-1">Message / Motivation</p>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{a.message}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-gray-400">Mark as:</span>
                    {(["new", "read", "done"] as const).map(s => (
                      <button key={s} onClick={() => updateStatus(a.id, s)}
                        className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${a.status === s ? "ring-2 ring-offset-1 ring-current" : "opacity-60 hover:opacity-100"}`}
                        style={{ color: statusColors[s], background: `color-mix(in srgb, ${statusColors[s]} 10%, transparent)` }}>
                        {statusLabels[s]}
                      </button>
                    ))}
                  </div>

                  {replyTo === a.id ? (
                    <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Reply to {a.name} ({a.email})</p>
                      <textarea rows={4} value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Type your reply..."
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-2" />
                      <div className="flex gap-2">
                        <button onClick={() => sendReply(a)} disabled={sending || !replyText.trim()}
                          className="rounded bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                          {sending ? "Sending..." : "Send via Resend"}
                        </button>
                        <button onClick={() => { setReplyTo(null); setReplyText(""); }} className="rounded border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setReplyTo(a.id)} className="rounded bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700">
                      Reply in app
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
