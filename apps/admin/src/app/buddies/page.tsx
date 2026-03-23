"use client";

import { useState, useEffect } from "react";

const C = {
  blue: "#2563EB", green: "#059669", amber: "#D97706", red: "#DC2626",
  navy: "#0A2540", muted: "#64748B", border: "#E2E8F0", borderLight: "#F1F5F9",
  surface: "#FFFFFF", blueLight: "#EFF6FF", greenLight: "#ECFDF5", amberLight: "#FFFBEB",
};

interface Relationship {
  id: string;
  user_name: string;
  user_id: string;
  buddy_name: string | null;
  buddy_user_id: string | null;
  role: string;
  status: string;
  share_amounts: boolean;
  notify_on_incasso: boolean;
  invite_code: string;
  created_at: string;
  accepted_at: string | null;
}

interface Stats {
  total: number;
  accepted: number;
  pending: number;
  users_with_buddies: number;
}

const ROLE_LABELS: Record<string, string> = {
  partner: "Partner", ouder: "Ouder", schuldhulpmaatje: "Schuldhulpmaatje", anders: "Anders",
};

export default function AdminBuddiesPage() {
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, accepted: 0, pending: 0, users_with_buddies: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/buddies");
        if (res.ok) {
          const data = await res.json();
          setRelationships(data.relationships || []);
          setStats(data.stats || { total: 0, accepted: 0, pending: 0, users_with_buddies: 0 });
        }
      } catch {} finally { setLoading(false); }
    }
    load();
  }, []);

  return (
    <div>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: C.navy, letterSpacing: "-0.03em" }}>Buddy Netwerk</h1>
      <p style={{ margin: "4px 0 24px", fontSize: 14, color: C.muted }}>Overzicht van buddy-relaties</p>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Totaal", value: stats.total, color: C.blue },
          { label: "Geaccepteerd", value: stats.accepted, color: C.green },
          { label: "In afwachting", value: stats.pending, color: C.amber },
          { label: "Gebruikers met buddy", value: stats.users_with_buddies, color: C.blue },
        ].map((s) => (
          <div key={s.label} style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 16 }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 500, color: C.muted }}>{s.label}</p>
            <p style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 700, color: s.color, letterSpacing: "-0.03em" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: C.muted }}>Laden...</div>
        ) : relationships.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: C.muted }}>Nog geen buddy-relaties</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  {["Gebruiker", "Buddy", "Rol", "Status", "Bedragen", "Incasso-alert", "Aangemaakt"].map((h) => (
                    <th key={h} style={{
                      textAlign: "left", padding: "12px 14px", fontSize: 11, fontWeight: 600,
                      color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em",
                      borderBottom: `1px solid ${C.border}`, background: "#FAFBFC",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {relationships.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: i < relationships.length - 1 ? `1px solid ${C.borderLight}` : "none" }}>
                    <td style={{ padding: "12px 14px" }}>
                      <p style={{ margin: 0, fontWeight: 500, color: C.navy }}>{r.user_name}</p>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      {r.buddy_name ? (
                        <p style={{ margin: 0, fontWeight: 500, color: C.navy }}>{r.buddy_name}</p>
                      ) : (
                        <p style={{ margin: 0, fontSize: 11, color: C.muted, fontStyle: "italic" }}>Wacht op acceptatie</p>
                      )}
                    </td>
                    <td style={{ padding: "12px 14px", color: C.muted }}>{ROLE_LABELS[r.role] || r.role}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12,
                        fontWeight: 500, padding: "3px 10px", borderRadius: 6,
                        color: r.status === "accepted" ? C.green : C.amber,
                        background: r.status === "accepted" ? C.greenLight : C.amberLight,
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: r.status === "accepted" ? C.green : C.amber }} />
                        {r.status === "accepted" ? "Actief" : "In afwachting"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{
                        fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 4,
                        background: r.share_amounts ? C.blueLight : C.borderLight,
                        color: r.share_amounts ? C.blue : C.muted,
                      }}>
                        {r.share_amounts ? "Zichtbaar" : "Verborgen"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{
                        fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 4,
                        background: r.notify_on_incasso ? C.greenLight : C.borderLight,
                        color: r.notify_on_incasso ? C.green : C.muted,
                      }}>
                        {r.notify_on_incasso ? "Aan" : "Uit"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", color: C.muted, fontSize: 12 }}>
                      {new Date(r.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
