"use client";

import { useState } from "react";

interface InviteResult {
  invite_url: string;
  qr_code_url: string | null;
  email_sent: boolean;
  language: string;
}

// Languages a user can be onboarded in. Matches the consumer app's live locales.
const LANGS = [
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "pl", label: "Polski", flag: "🇵🇱" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
] as const;

const LANG_LABEL: Record<string, string> = Object.fromEntries(
  LANGS.map((l) => [l.code, `${l.flag} ${l.label}`])
);

export default function InviteForm({ orgId, tenantColor }: { orgId: string; tenantColor: string }) {
  const [email, setEmail] = useState("");
  const [externalId, setExternalId] = useState("");
  const [language, setLanguage] = useState<string>("nl");
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
          language,
          organization_id: orgId,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Er ging iets mis");
      } else {
        const parts: string[] = ["Uitnodiging aangemaakt"];
        if (data.email_sent) parts.push(`e-mail verstuurd in ${LANG_LABEL[language] || language}`);
        setMessage(parts.join(" — "));
        setLastResult({
          invite_url: data.invite_url,
          qr_code_url: data.qr_code_url,
          email_sent: data.email_sent,
          language,
        });
        setEmail("");
        setExternalId("");
        // Keep the chosen language selected for the next invite — staff often
        // onboard several people in the same language in a row.
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
      <h2 className="text-section-head text-pw-text mb-1">Nieuwe uitnodiging</h2>
      <p className="text-caption text-pw-muted mb-4">
        Kies de taal waarin de gebruiker wordt uitgenodigd. De e-mail, de uitnodigingspagina en de app starten in deze taal.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Language selector */}
        <div className="mb-4">
          <label className="block text-caption text-pw-muted font-medium mb-2">Taal van de uitnodiging</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {LANGS.map((l) => {
              const active = language === l.code;
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLanguage(l.code)}
                  aria-pressed={active}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-input text-label font-semibold border transition-all cursor-pointer"
                  style={
                    active
                      ? { backgroundColor: tenantColor, color: "#FFFFFF", borderColor: tenantColor }
                      : { backgroundColor: "#FFFFFF", color: "#475569", borderColor: "#E2E8F0" }
                  }
                >
                  <span style={{ fontSize: 16, lineHeight: 1 }}>{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Email + reference */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
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
            className="px-5 py-2 text-white text-label font-semibold rounded-button border-none cursor-pointer disabled:opacity-50 whitespace-nowrap"
            style={{ backgroundColor: tenantColor }}>
            {loading ? "Versturen..." : "Aanmaken"}
          </button>
        </div>
        <p className="text-caption text-pw-muted mt-2">
          Geen e-mailadres? Laat het veld leeg en deel de link of QR-code zelf.
        </p>
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
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-caption text-pw-muted">Taal:</span>
                  <span className="text-caption font-semibold text-pw-text bg-white px-2 py-0.5 rounded border border-pw-border">
                    {LANG_LABEL[lastResult.language] || lastResult.language}
                  </span>
                </div>
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
                {!lastResult.email_sent && (
                  <p className="text-caption text-pw-amber mt-2">Geen e-mail verstuurd. Deel de link of QR-code handmatig.</p>
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
