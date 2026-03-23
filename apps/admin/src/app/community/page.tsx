"use client";

import { useState, useEffect } from "react";

const C = {
  blue: "#2563EB", green: "#059669", amber: "#D97706", orange: "#EA580C",
  red: "#DC2626", navy: "#0A2540", muted: "#64748B", border: "#E2E8F0",
  borderLight: "#F1F5F9", surface: "#FFFFFF", bg: "#F8FAFC",
  blueLight: "#EFF6FF", greenLight: "#ECFDF5", amberLight: "#FFFBEB", redLight: "#FEF2F2",
};

interface Member {
  user_id: string;
  community_name: string;
  real_name: string;
  gemeente: string | null;
  language: string;
  is_banned: boolean;
  banned_until: string | null;
  ban_reason: string | null;
  post_count: number;
  comment_count: number;
  last_active_at: string | null;
  joined_at: string;
  account_created_at: string;
}

interface FlaggedPost {
  id: string;
  user_id: string;
  content: string;
  badge_type: string | null;
  is_flagged: boolean;
  created_at: string;
}

interface FlaggedComment {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  is_flagged: boolean;
  created_at: string;
}

interface Stats {
  total: number;
  banned: number;
  posts: number;
  comments: number;
  flagged: number;
}

type ActionModal = {
  type: "ban" | "timeout";
  user_id: string;
  community_name: string;
} | null;

export default function CommunityPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [flaggedPosts, setFlaggedPosts] = useState<FlaggedPost[]>([]);
  const [flaggedComments, setFlaggedComments] = useState<FlaggedComment[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, banned: 0, posts: 0, comments: 0, flagged: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"members" | "flagged">("members");
  const [filter, setFilter] = useState<"all" | "banned" | "active">("all");
  const [actionModal, setActionModal] = useState<ActionModal>(null);
  const [actionReason, setActionReason] = useState("");
  const [actionHours, setActionHours] = useState("24");
  const [acting, setActing] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  async function loadData() {
    try {
      const res = await fetch("/api/admin/community");
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
        setFlaggedPosts(data.flagged_posts || []);
        setFlaggedComments(data.flagged_comments || []);
        setStats(data.stats || { total: 0, banned: 0, posts: 0, comments: 0, flagged: 0 });
      }
    } catch {} finally { setLoading(false); }
  }

  useEffect(() => { loadData(); }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function doAction(action: string, params: Record<string, unknown>) {
    setActing(String(params.user_id || params.post_id || params.comment_id || ""));
    try {
      const res = await fetch("/api/admin/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...params }),
      });
      if (res.ok) {
        const data = await res.json();
        showToast(data.message || "Actie uitgevoerd");
        loadData();
      } else {
        const data = await res.json();
        showToast(data.error || "Actie mislukt");
      }
    } catch { showToast("Fout bij uitvoeren"); }
    finally { setActing(null); setActionModal(null); setActionReason(""); }
  }

  function handleUnban(userId: string) {
    if (!confirm("Weet je zeker dat je de blokkade wilt opheffen?")) return;
    doAction("unban", { user_id: userId });
  }

  function handleModalSubmit() {
    if (!actionModal) return;
    if (actionModal.type === "ban") {
      doAction("ban", { user_id: actionModal.user_id, reason: actionReason || undefined });
    } else {
      doAction("timeout", { user_id: actionModal.user_id, duration_hours: parseInt(actionHours) || 24, reason: actionReason || undefined });
    }
  }

  // Build member-name lookup for flagged content
  const nameMap: Record<string, string> = {};
  for (const m of members) nameMap[m.user_id] = m.community_name;

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch = !q || m.community_name.toLowerCase().includes(q) || m.real_name.toLowerCase().includes(q) || (m.gemeente || "").toLowerCase().includes(q);
    const matchFilter = filter === "all" || (filter === "banned" && m.is_banned) || (filter === "active" && !m.is_banned);
    return matchSearch && matchFilter;
  });

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 100,
          background: C.navy, color: "#fff", padding: "10px 20px",
          borderRadius: 8, fontSize: 13, fontWeight: 500,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}>{toast}</div>
      )}

      {/* Header */}
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: C.navy, letterSpacing: "-0.03em" }}>Community Moderatie</h1>
      <p style={{ margin: "4px 0 24px", fontSize: 14, color: C.muted }}>Beheer gebruikers, bekijk en verwijder content</p>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Leden", value: stats.total, color: C.blue },
          { label: "Geblokkeerd", value: stats.banned, color: C.red },
          { label: "Posts", value: stats.posts, color: C.green },
          { label: "Reacties", value: stats.comments, color: C.amber },
          { label: "Geflagged", value: stats.flagged, color: C.orange },
        ].map((s) => (
          <div key={s.label} style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 16 }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 500, color: C.muted }}>{s.label}</p>
            <p style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 700, color: s.color, letterSpacing: "-0.03em" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16, background: C.borderLight, borderRadius: 8, padding: 3, width: "fit-content" }}>
        {[
          { key: "members" as const, label: "Leden" },
          { key: "flagged" as const, label: `Geflagged (${(flaggedPosts.length) + (flaggedComments.length)})` },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: "7px 16px", borderRadius: 6, border: "none",
            background: tab === t.key ? C.surface : "transparent",
            fontSize: 13, fontWeight: tab === t.key ? 600 : 400,
            color: tab === t.key ? C.navy : C.muted,
            cursor: "pointer", fontFamily: "'Plus Jakarta Sans', system-ui",
            boxShadow: tab === t.key ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
          }}>{t.label}</button>
        ))}
      </div>

      {tab === "members" && (
        <>
          {/* Search + Filter */}
          <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
            <input type="text" placeholder="Zoek op naam of gemeente..." value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, maxWidth: 400, padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, outline: "none", fontFamily: "'Plus Jakarta Sans', system-ui" }} />
            <div style={{ display: "flex", gap: 4 }}>
              {(["all", "active", "banned"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: "7px 14px", borderRadius: 6, border: `1px solid ${filter === f ? C.blue : C.border}`,
                  background: filter === f ? C.blueLight : C.surface, fontSize: 12, fontWeight: 500,
                  color: filter === f ? C.blue : C.muted, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', system-ui",
                }}>{f === "all" ? "Alles" : f === "active" ? "Actief" : "Geblokkeerd"}</button>
              ))}
            </div>
          </div>

          {/* Members table */}
          <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
            {loading ? (
              <div style={{ padding: 40, textAlign: "center", color: C.muted }}>Laden...</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr>
                      {["Community naam", "Accountnaam", "Posts", "Reacties", "Status", "Lid sinds", "Acties"].map((h) => (
                        <th key={h} style={{
                          textAlign: "left", padding: "12px 14px", fontSize: 11, fontWeight: 600,
                          color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em",
                          borderBottom: `1px solid ${C.border}`, background: "#FAFBFC",
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((m, i) => (
                      <tr key={m.user_id} style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${C.borderLight}` : "none" }}>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <img
                              src={`https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${encodeURIComponent(m.community_name)}`}
                              alt="" width={32} height={32}
                              style={{ borderRadius: "50%", border: `1px solid ${C.border}`, background: C.bg }}
                            />
                            <div>
                              <p style={{ margin: 0, fontWeight: 600, color: C.navy }}>{m.community_name}</p>
                              {m.gemeente && <p style={{ margin: 0, fontSize: 11, color: C.muted }}>{m.gemeente}</p>}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <p style={{ margin: 0, fontSize: 13, color: C.navy }}>{m.real_name || "—"}</p>
                          <p style={{ margin: 0, fontSize: 11, color: C.muted }}>{m.language.toUpperCase()}</p>
                        </td>
                        <td style={{ padding: "12px 14px", fontWeight: 600, color: C.navy }}>{m.post_count}</td>
                        <td style={{ padding: "12px 14px", fontWeight: 600, color: C.navy }}>{m.comment_count}</td>
                        <td style={{ padding: "12px 14px" }}>
                          {m.is_banned ? (
                            <div>
                              <span style={{
                                display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12,
                                fontWeight: 500, padding: "3px 10px", borderRadius: 6,
                                color: C.red, background: C.redLight,
                              }}>
                                <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.red }} />
                                Geblokkeerd
                              </span>
                              {m.banned_until && (
                                <p style={{ margin: "4px 0 0", fontSize: 10, color: C.muted }}>
                                  Tot {new Date(m.banned_until).toLocaleDateString("nl-NL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                </p>
                              )}
                              {m.ban_reason && (
                                <p style={{ margin: "2px 0 0", fontSize: 10, color: C.muted, fontStyle: "italic" }}>
                                  {m.ban_reason}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span style={{
                              display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12,
                              fontWeight: 500, padding: "3px 10px", borderRadius: 6,
                              color: C.green, background: C.greenLight,
                            }}>
                              <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.green }} />
                              Actief
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "12px 14px", color: C.muted, fontSize: 12 }}>
                          {new Date(m.joined_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            {m.is_banned ? (
                              <ActionBtn label="Deblokkeer" color={C.green} loading={acting === m.user_id} onClick={() => handleUnban(m.user_id)} />
                            ) : (
                              <>
                                <ActionBtn label="Time-out" color={C.amber} loading={acting === m.user_id} onClick={() => { setActionModal({ type: "timeout", user_id: m.user_id, community_name: m.community_name }); setActionHours("24"); setActionReason(""); }} />
                                <ActionBtn label="Ban" color={C.red} loading={acting === m.user_id} onClick={() => { setActionModal({ type: "ban", user_id: m.user_id, community_name: m.community_name }); setActionReason(""); }} />
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: C.muted }}>Geen leden gevonden</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {tab === "flagged" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Flagged posts */}
          {flaggedPosts.length > 0 && (
            <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: C.navy }}>Geflagde posts ({flaggedPosts.length})</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {flaggedPosts.map((p) => (
                  <div key={p.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: 14, background: C.redLight, borderRadius: 8, border: `1px solid ${C.red}15` }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: C.navy }}>{nameMap[p.user_id] || "Onbekend"}</p>
                      <p style={{ margin: "4px 0 0", fontSize: 13, color: C.navy, lineHeight: 1.5 }}>{p.content}</p>
                      <p style={{ margin: "4px 0 0", fontSize: 10, color: C.muted }}>{new Date(p.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <ActionBtn label="Unflag" color={C.green} onClick={() => doAction("unflag_post", { post_id: p.id })} />
                      <ActionBtn label="Verwijder" color={C.red} onClick={() => { if (confirm("Post permanent verwijderen?")) doAction("delete_post", { post_id: p.id }); }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Flagged comments */}
          {flaggedComments.length > 0 && (
            <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: C.navy }}>Geflagde reacties ({flaggedComments.length})</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {flaggedComments.map((c) => (
                  <div key={c.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: 14, background: C.amberLight, borderRadius: 8, border: `1px solid ${C.amber}15` }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: C.navy }}>{nameMap[c.user_id] || "Onbekend"}</p>
                      <p style={{ margin: "4px 0 0", fontSize: 13, color: C.navy, lineHeight: 1.5 }}>{c.content}</p>
                      <p style={{ margin: "4px 0 0", fontSize: 10, color: C.muted }}>{new Date(c.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <ActionBtn label="Unflag" color={C.green} onClick={() => doAction("unflag_comment", { comment_id: c.id })} />
                      <ActionBtn label="Verwijder" color={C.red} onClick={() => { if (confirm("Reactie permanent verwijderen?")) doAction("delete_comment", { comment_id: c.id }); }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {flaggedPosts.length === 0 && flaggedComments.length === 0 && (
            <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 40, textAlign: "center" }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: C.green }}>✓ Geen geflagde content</p>
              <p style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Alles ziet er goed uit!</p>
            </div>
          )}
        </div>
      )}

      {/* Ban/Timeout Modal */}
      {actionModal && (
        <>
          <div onClick={() => setActionModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 50 }} />
          <div style={{
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 51,
            background: C.surface, borderRadius: 16, padding: 28, width: 420, maxWidth: "90vw",
            boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
          }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700, color: C.navy }}>
              {actionModal.type === "ban" ? "Gebruiker blokkeren" : "Time-out geven"}
            </h3>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: C.muted }}>
              {actionModal.community_name} {actionModal.type === "ban" ? "permanent blokkeren van de community" : "tijdelijk blokkeren"}
            </p>

            {actionModal.type === "timeout" && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Duur</label>
                <div style={{ display: "flex", gap: 6 }}>
                  {["1", "6", "12", "24", "48", "72", "168"].map((h) => (
                    <button key={h} onClick={() => setActionHours(h)} style={{
                      padding: "6px 12px", borderRadius: 6,
                      border: `1px solid ${actionHours === h ? C.blue : C.border}`,
                      background: actionHours === h ? C.blueLight : C.surface,
                      fontSize: 12, fontWeight: 500, cursor: "pointer",
                      color: actionHours === h ? C.blue : C.muted,
                      fontFamily: "'Plus Jakarta Sans', system-ui",
                    }}>{parseInt(h) < 24 ? `${h}u` : `${parseInt(h) / 24}d`}</button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Reden (optioneel)</label>
              <input type="text" value={actionReason} onChange={(e) => setActionReason(e.target.value)} placeholder="Bijv. ongepaste taal, spam..."
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, outline: "none", fontFamily: "'Plus Jakarta Sans', system-ui", boxSizing: "border-box" }} />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setActionModal(null)} style={{
                flex: 1, padding: "10px", borderRadius: 8, border: `1px solid ${C.border}`,
                background: C.surface, fontSize: 13, fontWeight: 600, cursor: "pointer",
                color: C.muted, fontFamily: "'Plus Jakarta Sans', system-ui",
              }}>Annuleren</button>
              <button onClick={handleModalSubmit} disabled={acting !== null} style={{
                flex: 1, padding: "10px", borderRadius: 8, border: "none",
                background: actionModal.type === "ban" ? C.red : C.amber,
                fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#fff",
                fontFamily: "'Plus Jakarta Sans', system-ui",
                opacity: acting ? 0.6 : 1,
              }}>{acting ? "..." : actionModal.type === "ban" ? "Blokkeer permanent" : `Time-out (${parseInt(actionHours) < 24 ? actionHours + "u" : parseInt(actionHours) / 24 + "d"})`}</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ActionBtn({ label, color, loading, onClick }: { label: string; color: string; loading?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      padding: "5px 12px", borderRadius: 6, border: `1px solid ${color}30`,
      background: "transparent", fontSize: 11, fontWeight: 600,
      color, cursor: "pointer", opacity: loading ? 0.5 : 1,
      fontFamily: "'Plus Jakarta Sans', system-ui",
      whiteSpace: "nowrap",
    }}>{loading ? "..." : label}</button>
  );
}
