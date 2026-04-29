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
      else {
        setMessage(data.message + (data.email_sent ? " (e-mail verstuurd)" : ""));
        setEmail("");
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (err: any) { setError(err.message); }
    setLoading(false);
  }

  return (
    <div className="bg-white border border-pw-border rounded-2xl p-6 mb-4">
      <h2 className="text-base font-bold text-pw-navy mb-4">Nieuw teamlid uitnodigen</h2>
      <form onSubmit={handleInvite} className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-pw-muted uppercase tracking-wider mb-1">E-mailadres</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="collega@organisatie.nl" required
            className="w-full px-3 py-2 bg-pw-bg border border-pw-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pw-blue/20 focus:border-pw-blue" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-pw-muted uppercase tracking-wider mb-1">Rol</label>
          <select value={role} onChange={e => setRole(e.target.value)}
            className="px-3 py-2 bg-pw-bg border border-pw-border rounded-lg text-sm">
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
            <option value="coach">Coach</option>
          </select>
        </div>
        <button type="submit" disabled={loading}
          className="px-4 py-2 text-white text-sm font-semibold rounded hover:opacity-90 disabled:opacity-50 border-none cursor-pointer whitespace-nowrap"
          style={{ backgroundColor: tenantColor }}>
          {loading ? "Verzenden..." : "Uitnodigen"}
        </button>
      </form>
      {message && <p className="mt-3 text-sm font-semibold text-pw-green">{message}</p>}
      {error && <p className="mt-3 text-sm text-pw-red">{error}</p>}
    </div>
  );
}
