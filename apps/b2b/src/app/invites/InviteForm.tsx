"use client";

import { useState } from "react";

export default function InviteForm({ orgId, tenantColor }: { orgId: string; tenantColor: string }) {
  const [email, setEmail] = useState("");
  const [externalId, setExternalId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/v1/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email || null,
          external_id: externalId || null,
          organization_id: orgId,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Er ging iets mis");
      } else {
        setMessage(`Uitnodiging aangemaakt${data.invite_url ? "" : ""}`);
        setEmail("");
        setExternalId("");
        // Reload page to show new invite
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div className="bg-pw-surface border border-pw-border rounded-card p-6 mb-6">
      <h2 className="text-section-head text-pw-text mb-4">Nieuwe uitnodiging</h2>
      <form onSubmit={handleSubmit} className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-caption text-pw-muted font-medium mb-1">E-mailadres</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="gebruiker@email.com"
            className="w-full px-3 py-2 border border-pw-border rounded-input text-label" />
        </div>
        <div className="flex-1">
          <label className="block text-caption text-pw-muted font-medium mb-1">Referentie (optioneel)</label>
          <input value={externalId} onChange={e => setExternalId(e.target.value)}
            placeholder="Dossiernr / casenr"
            className="w-full px-3 py-2 border border-pw-border rounded-input text-label" />
        </div>
        <button type="submit" disabled={loading}
          className="px-4 py-2 text-white text-label font-semibold rounded-button border-none cursor-pointer disabled:opacity-50"
          style={{ backgroundColor: tenantColor }}>
          {loading ? "Versturen..." : "Versturen"}
        </button>
      </form>
      {message && <p className="mt-3 text-caption text-pw-green font-semibold">{message}</p>}
      {error && <p className="mt-3 text-caption text-pw-red">{error}</p>}
    </div>
  );
}
