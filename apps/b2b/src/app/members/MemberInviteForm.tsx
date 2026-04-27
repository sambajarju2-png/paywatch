"use client";

import { useState } from "react";

export default function MemberInviteForm({ orgId, tenantColor }: { orgId: string; tenantColor: string }) {
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
      else { setMessage(data.message); setEmail(""); }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div className="bg-pw-surface border border-pw-border rounded-card p-6 mb-6">
      <h2 className="text-section-head text-pw-text mb-4">Nieuw teamlid uitnodigen</h2>
      <form onSubmit={handleInvite} className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-caption text-pw-muted font-medium mb-1">E-mailadres</label>
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
          className="px-4 py-2 text-white rounded-button text-label font-semibold disabled:opacity-50 cursor-pointer border-none whitespace-nowrap"
          style={{ backgroundColor: tenantColor }}>
          {loading ? "Verzenden..." : "Uitnodigen"}
        </button>
      </form>
      {message && <p className="mt-3 text-caption text-pw-green font-semibold">{message}</p>}
      {error && <p className="mt-3 text-caption text-pw-red">{error}</p>}
    </div>
  );
}
