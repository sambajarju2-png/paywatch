"use client";

import { useState, useEffect } from "react";

const C = { blue: "#2563EB", green: "#059669", amber: "#D97706", navy: "#0A2540", muted: "#64748B", border: "#E2E8F0", borderLight: "#F1F5F9", surface: "#FFFFFF", red: "#DC2626" };

interface Application {
  id: string;
  job_id: string;
  job_title: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  lang: string;
  status: string;
  linkedin_url?: string;
  personal_projects?: string;
  cv_url?: string;
  admin_notes?: string;
  starred?: boolean;
  created_at: string;
}

const TABS = ["all", "starred", "new", "read", "done"] as const;
const TAB_LABELS: Record<string, string> = { all: "Alles", starred: "Favorieten", new: "Nieuw", read: "Gelezen", done: "Afgehandeld" };
const STATUS_COLORS: Record<string, string> = { new: C.blue, read: C.amber, done: C.green };

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<Application | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [linkedInDraft, setLinkedInDraft] = useState<Record<string, string>>({});
  const [cvLoading, setCvLoading] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/applications").then(r => r.json()).then(d => setApps(d.applications || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch("/api/admin/applications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }

  async function toggleStar(id: string, starred: boolean) {
    setApps(prev => prev.map(a => a.id === id ? { ...a, starred } : a));
    await fetch("/api/admin/applications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, starred }) });
  }

  async function updateField(id: string, field: string, value: string) {
    await fetch("/api/admin/applications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, [field]: value }) });
    setApps(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  }

  async function downloadCv(id: string) {
    setCvLoading(id);
    try {
      const r = await fetch(`/api/admin/applications/cv?id=${encodeURIComponent(id)}`);
      const d = await r.json();
      if (d.url) window.open(d.url, "_blank", "noopener,noreferrer");
      else alert("CV niet beschikbaar");
    } catch { alert("CV ophalen mislukt"); }
    finally { setCvLoading(null); }
  }

  async function sendReply() {
    if (!replyTo || !replyText.trim()) return;
    setSending(true);
    try {
      await fetch("/api/admin/reply", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: replyTo.email, name: replyTo.name, subject: `Re: Sollicitatie ${replyTo.job_title}`, message: replyText }) });
      await updateStatus(replyTo.id, "done");
      setReplyTo(null); setReplyText("");
    } catch { alert("Verzenden mislukt"); }
    finally { setSending(false); }
  }

  const filtered = tab === "all" ? apps : tab === "starred" ? apps.filter(a => a.starred) : apps.filter(a => a.status === tab);

  return (
    <div>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: C.navy }}>Sollicitaties</h1>
      <p style={{ margin: "4px 0 24px", fontSize: 14, color: C.muted }}>{apps.length} sollicitaties ontvangen</p>

      <div style={{ display: "flex", gap: 4, marginBottom: 16, background: C.borderLight, borderRadius: 8, padding: 4, width: "fit-content" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "6px 16px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", background: tab === t ? C.surface : "transparent", color: tab === t ? C.navy : C.muted, boxShadow: tab === t ? "0 1px 2px rgba(0,0,0,0.06)" : "none" }}>
            {TAB_LABELS[t]} {t !== "all" && `(${t === "starred" ? apps.filter(a => a.starred).length : apps.filter(a => a.status === t).length})`}
          </button>
        ))}
      </div>

      {loading ? <div style={{ padding: 40, color: C.muted }}>Laden...</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(a => {
            const isExpanded = expandedId === a.id;
            return (
              <div key={a.id} style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                {/* Collapsed row */}
                <div style={{ padding: 20, cursor: "pointer" }} onClick={() => { setExpandedId(isExpanded ? null : a.id); if (a.status === "new") updateStatus(a.id, "read"); }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.blue, flexShrink: 0 }}>
                        {a.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: C.navy }}>{a.name}</p>
                          <span style={{ fontSize: 11, fontWeight: 600, color: C.blue, background: "#EFF6FF", padding: "2px 8px", borderRadius: 4 }}>{a.job_title}</span>
                          {a.status === "new" && <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.blue, display: "inline-block" }} />}
                        </div>
                        <p style={{ margin: "2px 0 0", fontSize: 12, color: C.muted }}>{a.email}{a.phone ? ` · ${a.phone}` : ""}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <button onClick={e => { e.stopPropagation(); toggleStar(a.id, !a.starred); }}
                        onMouseDown={e => e.stopPropagation()}
                        title={a.starred ? "Verwijder favoriet" : "Markeer als favoriet"}
                        style={{ background: "none", border: "none", padding: 4, cursor: "pointer", display: "flex", alignItems: "center", lineHeight: 0 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill={a.starred ? "#F59E0B" : "none"} stroke={a.starred ? "#F59E0B" : C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </button>
                      <span style={{ fontSize: 11, color: C.muted }}>{new Date(a.created_at).toLocaleDateString("nl-NL")}</span>
                      <select value={a.status} onChange={e => { e.stopPropagation(); updateStatus(a.id, e.target.value); }}
                        onClick={e => e.stopPropagation()}
                        style={{ padding: "4px 8px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12, color: STATUS_COLORS[a.status] || C.muted, fontFamily: "inherit" }}>
                        <option value="new">Nieuw</option><option value="read">Gelezen</option><option value="done">Afgehandeld</option>
                      </select>
                    </div>
                  </div>
                  {!isExpanded && <p style={{ margin: "10px 0 0", fontSize: 13, color: C.muted, lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{a.message}</p>}
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div style={{ borderTop: `1px solid ${C.borderLight}`, padding: "0 20px 20px" }}>
                    {/* Message */}
                    <p style={{ margin: "16px 0 0", fontSize: 14, color: "#374151", lineHeight: 1.7 }}>{a.message}</p>

                    {/* Personal projects + CV row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
                      <div>
                        <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Persoonlijke projecten</p>
                        <div style={{ padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12, color: a.personal_projects ? "#374151" : C.muted, lineHeight: 1.5, minHeight: 38, background: "#FAFBFC", wordBreak: "break-word" }}>
                          {a.personal_projects || "Niet opgegeven"}
                        </div>
                      </div>
                      <div>
                        <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>CV</p>
                        {a.cv_url ? (
                          <button onClick={() => downloadCv(a.id)} disabled={cvLoading === a.id}
                            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: "#EFF6FF", color: C.blue, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                            {cvLoading === a.id ? "Laden..." : "CV downloaden"}
                          </button>
                        ) : (
                          <div style={{ padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12, color: C.muted, background: "#FAFBFC" }}>Geen CV geüpload</div>
                        )}
                      </div>
                    </div>

                    {/* LinkedIn + notes row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
                      <div>
                        <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>LinkedIn</p>
                        <div style={{ display: "flex", gap: 6 }}>
                          <input
                            type="url"
                            defaultValue={a.linkedin_url || ""}
                            placeholder="https://linkedin.com/in/..."
                            onChange={e => setLinkedInDraft(prev => ({ ...prev, [a.id]: e.target.value }))}
                            style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12, outline: "none", fontFamily: "inherit" }}
                          />
                          {a.linkedin_url && (
                            <a href={a.linkedin_url} target="_blank" rel="noopener noreferrer"
                              style={{ padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.border}`, background: "#EFF6FF", color: C.blue, fontSize: 12, textDecoration: "none", fontWeight: 600 }}>
                              Open
                            </a>
                          )}
                          {linkedInDraft[a.id] !== undefined && linkedInDraft[a.id] !== a.linkedin_url && (
                            <button onClick={() => updateField(a.id, "linkedin_url", linkedInDraft[a.id])}
                              style={{ padding: "8px 10px", borderRadius: 8, background: C.blue, border: "none", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                              Sla op
                            </button>
                          )}
                        </div>
                      </div>
                      <div>
                        <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Notities</p>
                        {editingNotes === a.id ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <textarea value={notesDraft} onChange={e => setNotesDraft(e.target.value)} rows={3} autoFocus
                              style={{ padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.blue}`, fontSize: 12, resize: "vertical", outline: "none", fontFamily: "inherit" }} />
                            <div style={{ display: "flex", gap: 6 }}>
                              <button onClick={async () => { setSavingNotes(true); await updateField(a.id, "admin_notes", notesDraft); setSavingNotes(false); setEditingNotes(null); }}
                                disabled={savingNotes}
                                style={{ padding: "6px 12px", borderRadius: 6, background: C.blue, border: "none", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                                {savingNotes ? "Opslaan..." : "Opslaan"}
                              </button>
                              <button onClick={() => setEditingNotes(null)} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${C.border}`, background: "transparent", fontSize: 12, color: C.muted, cursor: "pointer", fontFamily: "inherit" }}>Annuleer</button>
                            </div>
                          </div>
                        ) : (
                          <div onClick={() => { setEditingNotes(a.id); setNotesDraft(a.admin_notes || ""); }}
                            style={{ padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12, color: a.admin_notes ? "#374151" : C.muted, lineHeight: 1.5, cursor: "text", minHeight: 72, background: "#FAFBFC" }}>
                            {a.admin_notes || "Klik om notities toe te voegen..."}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                      <button onClick={() => { setReplyTo(a); setReplyText(""); }}
                        style={{ padding: "8px 16px", borderRadius: 8, background: C.blue, border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                        Reageer
                      </button>
                      <a href={`mailto:${a.email}`}
                        style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.navy, fontSize: 13, textDecoration: "none", fontWeight: 500 }}>
                        Open in mail
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", color: C.muted, background: C.surface, borderRadius: 12, border: `1px solid ${C.border}` }}>Geen sollicitaties{tab !== "all" ? " in deze categorie" : ""}</div>}
        </div>
      )}

      {/* Reply modal */}
      {replyTo && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setReplyTo(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: C.surface, borderRadius: 16, padding: 24, width: "100%", maxWidth: 500, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: C.navy }}>Reageer op {replyTo.name}</h3>
            <p style={{ margin: "0 0 16px", fontSize: 12, color: C.muted }}>{replyTo.email} — {replyTo.job_title}</p>
            <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={6} placeholder="Typ je reactie..." style={{ width: "100%", padding: 12, borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
              <button onClick={() => setReplyTo(null)} style={{ padding: "8px 16px", borderRadius: 6, border: `1px solid ${C.border}`, background: "transparent", fontSize: 13, cursor: "pointer", fontFamily: "inherit", color: C.muted }}>Annuleer</button>
              <button onClick={sendReply} disabled={sending || !replyText.trim()} style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: C.blue, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: sending ? 0.5 : 1, fontFamily: "inherit" }}>{sending ? "Verzenden..." : "Verzend"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
