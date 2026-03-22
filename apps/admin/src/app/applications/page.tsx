"use client";

import { useState, useEffect } from "react";

const C = { blue: "#2563EB", green: "#059669", amber: "#D97706", navy: "#0A2540", muted: "#64748B", border: "#E2E8F0", borderLight: "#F1F5F9", surface: "#FFFFFF" };

interface Application { id: string; job_id: string; job_title: string; name: string; email: string; phone?: string; message: string; lang: string; status: string; created_at: string; }

const TABS = ["all", "new", "read", "done"] as const;
const TAB_LABELS: Record<string, string> = { all: "Alles", new: "Nieuw", read: "Gelezen", done: "Afgehandeld" };
const STATUS_COLORS: Record<string, string> = { new: C.blue, read: C.amber, done: C.green };

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<string>("all");
  const [replyTo, setReplyTo] = useState<Application | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch("/api/admin/applications").then((r) => r.json()).then((d) => setApps(d.applications || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch("/api/admin/applications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  async function sendReply() {
    if (!replyTo || !replyText.trim()) return;
    setSending(true);
    try {
      await fetch("/api/admin/reply", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: replyTo.email, name: replyTo.name, subject: `Re: Sollicitatie ${replyTo.job_title}`, message: replyText }) });
      await updateStatus(replyTo.id, "done");
      setReplyTo(null);
      setReplyText("");
    } catch { alert("Verzenden mislukt"); }
    finally { setSending(false); }
  }

  const filtered = tab === "all" ? apps : apps.filter((a) => a.status === tab);

  return (
    <div>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: C.navy }}>Sollicitaties</h1>
      <p style={{ margin: "4px 0 24px", fontSize: 14, color: C.muted }}>{apps.length} sollicitaties ontvangen</p>

      <div style={{ display: "flex", gap: 4, marginBottom: 16, background: C.borderLight, borderRadius: 8, padding: 4, width: "fit-content" }}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "6px 16px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer",
            background: tab === t ? C.surface : "transparent", color: tab === t ? C.navy : C.muted,
            boxShadow: tab === t ? "0 1px 2px rgba(0,0,0,0.06)" : "none", fontFamily: "'Plus Jakarta Sans', system-ui",
          }}>{TAB_LABELS[t]} {t !== "all" && `(${apps.filter((a) => a.status === t).length})`}</button>
        ))}
      </div>

      {loading ? <div style={{ padding: 40, color: C.muted }}>Laden...</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((a) => (
            <div key={a.id} style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: C.navy }}>{a.name}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: C.muted }}>{a.email}{a.phone ? ` · ${a.phone}` : ""}</p>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <select value={a.status} onChange={(e) => updateStatus(a.id, e.target.value)} style={{
                    padding: "4px 8px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12,
                    color: STATUS_COLORS[a.status] || C.muted, fontFamily: "'Plus Jakarta Sans', system-ui",
                  }}>
                    <option value="new">Nieuw</option><option value="read">Gelezen</option><option value="done">Afgehandeld</option>
                  </select>
                  <button onClick={() => { setReplyTo(a); setReplyText(""); }} style={{
                    padding: "5px 12px", borderRadius: 6, border: "none", background: C.blue, color: "#fff",
                    fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', system-ui",
                  }}>Reageer</button>
                </div>
              </div>
              <span style={{ display: "inline-block", fontSize: 11, fontWeight: 600, color: C.blue, background: "#EFF6FF", padding: "2px 8px", borderRadius: 4, marginBottom: 8 }}>{a.job_title}</span>
              <p style={{ margin: 0, fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{a.message}</p>
            </div>
          ))}
          {filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", color: C.muted, background: C.surface, borderRadius: 12, border: `1px solid ${C.border}` }}>Geen sollicitaties{tab !== "all" ? " in deze categorie" : ""}</div>}
        </div>
      )}

      {replyTo && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setReplyTo(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: C.surface, borderRadius: 16, padding: 24, width: "100%", maxWidth: 500, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: C.navy }}>Reageer op {replyTo.name}</h3>
            <p style={{ margin: "0 0 16px", fontSize: 12, color: C.muted }}>{replyTo.email} — {replyTo.job_title}</p>
            <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={6} placeholder="Typ je reactie..." style={{ width: "100%", padding: 12, borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, resize: "vertical", outline: "none", fontFamily: "'Plus Jakarta Sans', system-ui", boxSizing: "border-box" }} />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
              <button onClick={() => setReplyTo(null)} style={{ padding: "8px 16px", borderRadius: 6, border: `1px solid ${C.border}`, background: "transparent", fontSize: 13, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', system-ui", color: C.muted }}>Annuleer</button>
              <button onClick={sendReply} disabled={sending || !replyText.trim()} style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: C.blue, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: sending ? 0.5 : 1, fontFamily: "'Plus Jakarta Sans', system-ui" }}>{sending ? "Verzenden..." : "Verzend"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
