"use client";

import { useState } from "react";

interface InviteResult {
  invite_url: string;
  qr_code_url: string | null;
  email_sent: boolean;
}

export default function InviteForm({ orgId, tenantColor }: { orgId: string; tenantColor: string }) {
  const [email, setEmail] = useState("");
  const [externalId, setExternalId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [lastResult, setLastResult] = useState<InviteResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    setLastResult(null);

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
        const parts: string[] = ["Uitnodiging aangemaakt"];
        if (data.email_sent) parts.push("e-mail verstuurd");
        setMessage(parts.join(" — "));
        setLastResult({
          invite_url: data.invite_url,
          qr_code_url: data.qr_code_url,
          email_sent: data.email_sent,
        });
        setEmail("");
        setExternalId("");
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  }

  function copyLink() {
    if (lastResult?.invite_url) {
      navigator.clipboard.writeText(lastResult.invite_url);
    }
  }

  return (
    <div className="bg-pw-surface border border-pw-border rounded-card p-6 mb-6">
      <h2 className="text-section-head text-pw-text mb-4">Nieuwe uitnodiging</h2>
      <form onSubmit={handleSubmit} className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-caption text-pw-muted font-medium mb-1">E-mailadres (optioneel)</label>
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
          {loading ? "Versturen..." : "Aanmaken"}
        </button>
      </form>

      {message && (
        <div className="mt-4 p-4 bg-pw-green-light border border-green-200 rounded-lg">
          <p className="text-label text-pw-green font-semibold mb-3">{message}</p>
          {lastResult && (
            <div className="flex items-start gap-4">
              {lastResult.qr_code_url && (
                <img src={lastResult.qr_code_url} alt="QR code" className="w-24 h-24 rounded-lg border border-pw-border" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-caption text-pw-muted mb-1">Uitnodigingslink:</p>
                <div className="flex items-center gap-2">
                  <code className="text-caption text-pw-text bg-white px-2 py-1 rounded border border-pw-border overflow-hidden text-ellipsis whitespace-nowrap block flex-1">
                    {lastResult.invite_url}
                  </code>
                  <button type="button" onClick={copyLink}
                    className="px-3 py-1 bg-pw-navy text-white text-caption font-semibold rounded-button border-none cursor-pointer whitespace-nowrap">
                    Kopieer
                  </button>
                </div>
                {!lastResult.email_sent && email && (
                  <p className="text-caption text-pw-amber mt-2">E-mail kon niet worden verstuurd. Deel de link handmatig.</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {error && <p className="mt-3 text-caption text-pw-red">{error}</p>}
    </div>
  );
}
