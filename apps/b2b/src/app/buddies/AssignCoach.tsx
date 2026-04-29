"use client";

import { useState } from "react";

interface Props {
  users: { id: string; name: string }[];
  coaches: { memberId: string; email: string }[];
  orgId: string;
}

export default function AssignCoach({ users, coaches, orgId }: Props) {
  const [userId, setUserId] = useState("");
  const [coachId, setCoachId] = useState("");
  const [role, setRole] = useState("schuldhulpverlener");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault();
    if (!userId || !coachId) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/v1/buddies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, buddy_member_id: coachId, role, organization_id: orgId }),
      });
      const data = await res.json();
      if (data.error) setMessage("Fout: " + data.error);
      else { setMessage("Coach gekoppeld!"); setTimeout(() => window.location.reload(), 1500); }
    } catch { setMessage("Er ging iets mis"); }
    setLoading(false);
  }

  return (
    <div className="bg-white border border-pw-border rounded-2xl p-6 mb-6">
      <h2 className="text-base font-bold text-pw-navy mb-4">Coach toewijzen</h2>
      <form onSubmit={handleAssign} className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-pw-muted uppercase tracking-wider mb-1">Gebruiker</label>
          <select value={userId} onChange={e => setUserId(e.target.value)}
            className="w-full px-3 py-2 bg-pw-bg border border-pw-border rounded-lg text-sm">
            <option value="">Selecteer gebruiker...</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name || u.id.substring(0, 8)}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold text-pw-muted uppercase tracking-wider mb-1">Coach</label>
          <select value={coachId} onChange={e => setCoachId(e.target.value)}
            className="w-full px-3 py-2 bg-pw-bg border border-pw-border rounded-lg text-sm">
            <option value="">Selecteer coach...</option>
            {coaches.map(c => <option key={c.memberId} value={c.memberId}>{c.email}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-pw-muted uppercase tracking-wider mb-1">Rol</label>
          <select value={role} onChange={e => setRole(e.target.value)}
            className="px-3 py-2 bg-pw-bg border border-pw-border rounded-lg text-sm">
            <option value="schuldhulpverlener">Schuldhulpverlener</option>
            <option value="sociaal_werker">Sociaal werker</option>
            <option value="vrijwilliger">Vrijwilliger</option>
            <option value="bewindvoerder">Bewindvoerder</option>
          </select>
        </div>
        <button type="submit" disabled={loading || !userId || !coachId}
          className="px-4 py-2 bg-pw-blue text-white text-sm font-semibold rounded hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap">
          {loading ? "..." : "Koppelen"}
        </button>
      </form>
      {message && <p className={`mt-3 text-sm font-semibold ${message.startsWith("Fout") ? "text-pw-red" : "text-pw-green"}`}>{message}</p>}
    </div>
  );
}
