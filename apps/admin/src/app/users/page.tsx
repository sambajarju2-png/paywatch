"use client";

import { useState, useEffect } from "react";

const C = {
  blue: "#2563EB", green: "#059669", amber: "#D97706", red: "#DC2626",
  navy: "#0A2540", muted: "#64748B", border: "#E2E8F0", borderLight: "#F1F5F9",
  surface: "#FFFFFF", blueLight: "#EFF6FF", greenLight: "#ECFDF5", amberLight: "#FFFBEB",
};

interface User {
  user_id: string;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  email?: string;
  language: string;
  onboarding_complete: boolean;
  gemeente: string | null;
  dark_mode: boolean;
  created_at: string;
  bill_count?: number;
}

function getInitials(u: User): string {
  const name = u.display_name || [u.first_name, u.last_name].filter(Boolean).join(" ") || "?";
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function getName(u: User): string {
  return u.display_name || [u.first_name, u.last_name].filter(Boolean).join(" ") || "Onbekend";
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  async function loadUsers() {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch {} finally { setLoading(false); }
  }

  useEffect(() => { loadUsers(); }, []);

  async function handleDelete(userId: string) {
    if (!confirm("Weet je zeker dat je deze gebruiker wilt verwijderen? Dit verwijdert alle data (17 tabellen).")) return;
    setDeleting(userId);
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, { method: "DELETE" });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.user_id !== userId));
      } else {
        alert("Verwijderen mislukt");
      }
    } catch { alert("Fout bij verwijderen"); }
    finally { setDeleting(null); }
  }

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return !q || getName(u).toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q) || (u.gemeente || "").toLowerCase().includes(q);
  });

  return (
    <div>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: C.navy, letterSpacing: "-0.03em" }}>Gebruikers</h1>
      <p style={{ margin: "4px 0 24px", fontSize: 14, color: C.muted }}>{users.length} geregistreerde gebruikers</p>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Zoek op naam, email of gemeente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%", maxWidth: 400, padding: "10px 14px",
            borderRadius: 8, border: `1px solid ${C.border}`,
            fontSize: 13, outline: "none", fontFamily: "'Plus Jakarta Sans', system-ui",
          }}
        />
      </div>

      {/* Table */}
      <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: C.muted }}>Laden...</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  {["Naam", "Taal", "Gemeente", "Onboarding", "Lid sinds", ""].map((h) => (
                    <th key={h} style={{
                      textAlign: "left", padding: "12px 14px", fontSize: 11, fontWeight: 600,
                      color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em",
                      borderBottom: `1px solid ${C.border}`, background: "#FAFBFC",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={u.user_id} style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${C.borderLight}` : "none" }}>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: "50%", background: C.blueLight,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 12, fontWeight: 700, color: C.blue, flexShrink: 0,
                        }}>{getInitials(u)}</div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 500, color: C.navy }}>{getName(u)}</p>
                          {u.email && <p style={{ margin: 0, fontSize: 11, color: C.muted }}>{u.email}</p>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px", color: C.muted }}>{(u.language || "nl").toUpperCase()}</td>
                    <td style={{ padding: "12px 14px", color: C.muted }}>{u.gemeente || "—"}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12,
                        fontWeight: 500, padding: "3px 10px", borderRadius: 6,
                        color: u.onboarding_complete ? C.green : C.amber,
                        background: u.onboarding_complete ? C.greenLight : C.amberLight,
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: u.onboarding_complete ? C.green : C.amber }} />
                        {u.onboarding_complete ? "Compleet" : "Pending"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", color: C.muted }}>
                      {new Date(u.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <button
                        onClick={() => handleDelete(u.user_id)}
                        disabled={deleting === u.user_id}
                        style={{
                          padding: "5px 12px", borderRadius: 6, border: `1px solid ${C.border}`,
                          background: "transparent", fontSize: 12, fontWeight: 500,
                          color: C.red, cursor: "pointer", opacity: deleting === u.user_id ? 0.5 : 1,
                          fontFamily: "'Plus Jakarta Sans', system-ui",
                        }}
                      >
                        {deleting === u.user_id ? "..." : "Verwijder"}
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: C.muted }}>Geen gebruikers gevonden</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
