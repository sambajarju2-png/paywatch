"use client";

import { useState } from "react";

const ROLE_LABELS: Record<string, string> = { owner: "Eigenaar", admin: "Admin", viewer: "Viewer", coach: "Coach" };

interface Member {
  id: string;
  role: string;
  invite_email: string;
  invite_status: string;
}

export default function MemberSection({ orgId, orgColor, members }: { orgId: string; orgColor: string; members: Member[] }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role, organization_id: orgId }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else {
        setMessage(data.message);
        setEmail("");
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div className="bg-pw-surface border border-pw-border rounded-card p-6">
      <h2 className="text-section-head text-pw-text mb-4">Teamleden</h2>

      {/* Invite form */}
      <form onSubmit={handleInvite} className="flex gap-2 items-end mb-4 pb-4 border-b border-pw-border/30">
        <div className="flex-1">
          <label className="block text-caption text-pw-muted font-medium mb-1">E-mail</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="collega@organisatie.nl" required
            className="w-full px-3 py-2 border border-pw-border rounded-input text-label" />
        </div>
        <div>
          <label className="block text-caption text-pw-muted font-medium mb-1">Rol</label>
          <select value={role} onChange={e => setRole(e.target.value)}
            className="px-3 py-2 border border-pw-border rounded-input text-label bg-white">
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
            <option value="coach">Coach</option>
          </select>
        </div>
        <button type="submit" disabled={loading}
          className="px-3 py-2 text-white rounded-button text-label font-semibold disabled:opacity-50 cursor-pointer border-none whitespace-nowrap"
          style={{ backgroundColor: orgColor }}>
          {loading ? "..." : "Uitnodigen"}
        </button>
      </form>
      {message && <p className="text-caption text-pw-green font-semibold mb-3">{message}</p>}
      {error && <p className="text-caption text-pw-red mb-3">{error}</p>}

      {/* Member list */}
      {members.length === 0 ? (
        <p className="text-label text-pw-muted">Geen teamleden</p>
      ) : (
        <div className="space-y-1">
          {members.map((m) => (
            <div key={m.id} className="flex items-center justify-between py-2 border-b border-pw-border/30">
              <div>
                <div className="text-label font-medium text-pw-text">{m.invite_email || "Onbekend"}</div>
                <div className="text-caption text-pw-muted">{m.invite_status}</div>
              </div>
              <span className="px-2.5 py-1 bg-pw-bg text-pw-muted text-tiny font-semibold rounded-badge">{ROLE_LABELS[m.role] || m.role}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
