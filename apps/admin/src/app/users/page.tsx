"use client";

import { useState, useEffect, useMemo } from "react";
import { Shimmer, TableSkeleton, shimmerStyle } from "@/components/Shimmer";

interface User {
  user_id: string;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string;
  language: string;
  onboarding_complete: boolean;
  gemeente: string | null;
  bill_count: number;
  last_active_at: string | null;
  created_at: string;
  likely_bot: boolean;
  plan?: string;
  voice_seconds_used?: number;
}

function getName(u: User): string {
  return u.display_name || [u.first_name, u.last_name].filter(Boolean).join(" ") || "—";
}

function getInitials(u: User): string {
  const name = getName(u);
  if (name === "—") return u.email.substring(0, 2).toUpperCase();
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function relativeTime(d: string | null) {
  if (!d) return "Nooit";
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days === 0) return "Vandaag";
  if (days === 1) return "Gisteren";
  if (days < 30) return days + "d geleden";
  return new Date(d).toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [savingPlan, setSavingPlan] = useState<string | null>(null);

  const C = { navy: "#0A2540", muted: "#64748B", border: "#E2E8F0", surface: "#FFFFFF", blue: "#2563EB", green: "#059669", amber: "#D97706", red: "#DC2626" };

  async function loadUsers() {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) setUsers((await res.json()).users || []);
    } catch {} finally { setLoading(false); }
  }
  useEffect(() => { loadUsers(); }, []);

  const botCount = users.filter(u => u.likely_bot).length;

  const filtered = useMemo(() => {
    let result = users;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(u => getName(u).toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.gemeente || "").toLowerCase().includes(q));
    }
    if (filter === "bots") result = result.filter(u => u.likely_bot);
    if (filter === "complete") result = result.filter(u => u.onboarding_complete);
    if (filter === "incomplete") result = result.filter(u => !u.onboarding_complete);
    if (filter === "pro") result = result.filter(u => (u.plan || "").startsWith("pro"));
    if (filter === "premium") result = result.filter(u => (u.plan || "").startsWith("premium"));
    return result;
  }, [users, search, filter]);

  const allSelected = filtered.length > 0 && filtered.every(u => selected.has(u.user_id));

  function toggleAll() {
    if (allSelected) setSelected(prev => { const n = new Set(prev); filtered.forEach(u => n.delete(u.user_id)); return n; });
    else setSelected(prev => { const n = new Set(prev); filtered.forEach(u => n.add(u.user_id)); return n; });
  }
  function toggleOne(id: string) { setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }); }

  async function changePlan(userId: string, plan: string) {
    setSavingPlan(userId);
    try {
      const res = await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, plan }) });
      if (res.ok) setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, plan } : u));
      else alert("Plan wijzigen mislukt");
    } catch { alert("Fout"); } finally { setSavingPlan(null); setEditingPlan(null); }
  }

  async function deleteOne(userId: string) {
    if (!confirm("Verwijder deze gebruiker en alle data?")) return;
    setDeleting(userId);
    try {
      const res = await fetch("/api/admin/users?userId=" + userId, { method: "DELETE" });
      if (res.ok) { setUsers(prev => prev.filter(u => u.user_id !== userId)); setSelected(prev => { const n = new Set(prev); n.delete(userId); return n; }); }
      else alert("Verwijderen mislukt");
    } catch { alert("Fout"); } finally { setDeleting(null); }
  }

  async function bulkDelete(ids: string[]) {
    if (!confirm("Verwijder " + ids.length + " gebruiker" + (ids.length > 1 ? "s" : "") + " en alle data?")) return;
    setBulkDeleting(true);
    try {
      const res = await fetch("/api/admin/users", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userIds: ids }) });
      if (res.ok) { setUsers(prev => prev.filter(u => !ids.includes(u.user_id))); setSelected(new Set()); setFilter("all"); }
      else alert("Verwijderen mislukt");
    } catch { alert("Fout"); } finally { setBulkDeleting(false); }
  }

  return (
    <div>
      <style>{shimmerStyle}</style>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: C.navy, letterSpacing: "-0.03em" }}>Gebruikers</h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: C.muted }}>{users.length} geregistreerd{botCount > 0 ? " · " + botCount + " vermoedelijke bots" : ""}</p>
        </div>
        {botCount > 0 && (
          <button onClick={() => bulkDelete(users.filter(u => u.likely_bot).map(u => u.user_id))} disabled={bulkDeleting}
            style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid " + C.red, background: "transparent", color: C.red, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            {bulkDeleting ? "Bezig..." : "Verwijder " + botCount + " bots"}
          </button>
        )}
      </div>

      {/* Plan distribution */}
      {users.length > 0 && (() => {
        const proCount = users.filter(u => (u.plan || "").startsWith("pro")).length;
        const premiumCount = users.filter(u => (u.plan || "").startsWith("premium")).length;
        const gratisCount = users.length - proCount - premiumCount;
        return (
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            {[
              { label: "Gratis", count: gratisCount, bg: "#F8FAFC", color: "#64748B", border: "#E2E8F0", filter: "all" },
              { label: "Pro", count: proCount, bg: "#EFF6FF", color: C.blue, border: "#BFDBFE", filter: "pro" },
              { label: "Premium", count: premiumCount, bg: "#F5F3FF", color: "#7C3AED", border: "#DDD6FE", filter: "premium" },
            ].map(s => (
              <button key={s.label} onClick={() => setFilter(s.filter)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 10, border: "1px solid " + (filter === s.filter ? s.color : s.border), background: filter === s.filter ? s.bg : "#fff", cursor: "pointer", fontFamily: "inherit", transition: "all 0.1s" }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.count}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: s.color }}>{s.label}</span>
              </button>
            ))}
          </div>
        );
      })()}

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input type="text" placeholder="Zoek op naam, email of gemeente..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, maxWidth: 320, padding: "9px 14px", borderRadius: 8, border: "1px solid " + C.border, fontSize: 13, outline: "none", fontFamily: "inherit" }} />
        <div style={{ display: "flex", gap: 4, background: "#F1F5F9", borderRadius: 8, padding: 4 }}>
          {[["all","Alle"],["complete","Compleet"],["incomplete","Pending"],["bots","Bots" + (botCount > 0 ? " (" + botCount + ")" : "")]].map(([f,l]) => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 14px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              background: filter === f ? C.surface : "transparent", color: filter === f ? C.navy : C.muted, boxShadow: filter === f ? "0 1px 2px rgba(0,0,0,0.06)" : "none" }}>{l}</button>
          ))}
        </div>
        {selected.size > 0 && (
          <button onClick={() => bulkDelete([...selected])} disabled={bulkDeleting}
            style={{ padding: "8px 16px", borderRadius: 8, background: C.red, border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            {bulkDeleting ? "Bezig..." : "Verwijder " + selected.size + " geselecteerd"}
          </button>
        )}
      </div>

      <div style={{ background: C.surface, borderRadius: 12, border: "1px solid " + C.border, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#FAFBFC" }}>
              <th style={{ width: 44, padding: "12px 16px", borderBottom: "1px solid " + C.border }}>
                <input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ cursor: "pointer" }} />
              </th>
              {["Naam","Gemeente","Plan","Rekeningen","Onboarding","Actief",""].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "12px 14px", fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid " + C.border }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? <TableSkeleton rows={10} cols={7} /> : filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: C.muted }}>Geen gebruikers gevonden</td></tr>
            ) : filtered.map((u, i) => (
              <tr key={u.user_id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F8FAFC" : "none", background: selected.has(u.user_id) ? "#EFF6FF" : u.likely_bot ? "#FEF2F2" : "transparent" }}>
                <td style={{ padding: "12px 16px" }}><input type="checkbox" checked={selected.has(u.user_id)} onChange={() => toggleOne(u.user_id)} style={{ cursor: "pointer" }} /></td>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: u.likely_bot ? "#FEE2E2" : "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: u.likely_bot ? C.red : C.blue, flexShrink: 0 }}>{getInitials(u)}</div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <p style={{ margin: 0, fontWeight: 500, color: C.navy }}>{getName(u)}</p>
                        {u.likely_bot && <span style={{ fontSize: 10, fontWeight: 700, color: C.red, background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 4, padding: "1px 6px" }}>BOT</span>}
                      </div>
                      {u.email && <p style={{ margin: 0, fontSize: 11, color: C.muted }}>{u.email}</p>}
                    </div>
                  </div>
                </td>
                <td style={{ padding: "12px 14px", color: C.muted, fontSize: 12 }}>{u.gemeente || "—"}</td>
                <td style={{ padding: "12px 14px" }}>
                  {editingPlan === u.user_id ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <select
                        autoFocus
                        defaultValue={u.plan || "gratis"}
                        onChange={(e) => changePlan(u.user_id, e.target.value)}
                        onBlur={() => setEditingPlan(null)}
                        disabled={savingPlan === u.user_id}
                        style={{ fontSize: 12, fontWeight: 600, padding: "3px 8px", borderRadius: 6, border: "1px solid " + C.blue, outline: "none", fontFamily: "inherit", cursor: "pointer", background: "#EFF6FF", color: C.blue }}
                      >
                        <option value="gratis">Gratis</option>
                        <option value="pro_monthly">Pro (maandelijks)</option>
                        <option value="pro_yearly">Pro (jaarlijks)</option>
                        <option value="premium_monthly">Premium (maandelijks)</option>
                        <option value="premium_yearly">Premium (jaarlijks)</option>
                      </select>
                      {savingPlan === u.user_id && <span style={{ fontSize: 10, color: C.muted }}>...</span>}
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingPlan(u.user_id)}
                      title="Klik om plan te wijzigen"
                      style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0 }}
                    >
                      {(() => {
                        const p = u.plan || "gratis";
                        const tier = p.startsWith("premium") ? "premium" : p.startsWith("pro") ? "pro" : "gratis";
                        const period = p.endsWith("yearly") ? "/jr" : p.endsWith("monthly") ? "/mo" : "";
                        const cfg = tier === "premium" ? { bg: "#F5F3FF", color: "#7C3AED", label: "Premium" } :
                                    tier === "pro"     ? { bg: "#EFF6FF", color: "#2563EB", label: "Pro" } :
                                                        { bg: "#F8FAFC", color: "#64748B", label: "Gratis" };
                        return (
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: cfg.bg, color: cfg.color, display: "inline-flex", alignItems: "center", gap: 4 }}>
                            {cfg.label}{period}
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                          </span>
                        );
                      })()}
                    </button>
                  )}
                </td>
                <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: u.bill_count > 0 ? C.navy : C.muted }}>{u.bill_count}</td>
                <td style={{ padding: "12px 14px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 6, color: u.onboarding_complete ? C.green : C.amber, background: u.onboarding_complete ? "#F0FDF4" : "#FFFBEB" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: u.onboarding_complete ? C.green : C.amber }} />
                    {u.onboarding_complete ? "Compleet" : "Pending"}
                  </span>
                </td>
                <td style={{ padding: "12px 14px", color: C.muted, fontSize: 12 }}>{relativeTime(u.last_active_at)}</td>
                <td style={{ padding: "12px 14px" }}>
                  <button onClick={() => deleteOne(u.user_id)} disabled={deleting === u.user_id}
                    style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid " + C.border, background: "transparent", fontSize: 12, fontWeight: 500, color: C.red, cursor: "pointer", fontFamily: "inherit", opacity: deleting === u.user_id ? 0.5 : 1 }}>
                    {deleting === u.user_id ? "..." : "Verwijder"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
