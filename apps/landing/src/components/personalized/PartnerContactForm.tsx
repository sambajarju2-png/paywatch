"use client";

import { useState } from "react";
import { markFormSubmitted } from "./useEngagement";

interface Props {
  companyName?: string;
  companyDomain?: string;
  audience: string;
  accentColor?: string;
  logoUrl?: string;
}

export default function PartnerContactForm({ companyName, companyDomain, audience, accentColor = "#2563EB", logoUrl }: Props) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Anti-bot: honeypot + form-load timestamp
  const [honeypot, setHoneypot] = useState("");
  const [loadTime] = useState(() => Date.now());

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);

    try {
      const res = await fetch("/api/partner-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          message: form.message,
          companyName,
          companyDomain,
          audience,
          brandColor: accentColor,
          logoUrl,
          website: honeypot,   // honeypot — bots fill this
          _t: loadTime,        // form load timestamp — bots are too fast
        }),
      });

      if (res.ok) {
        markFormSubmitted(audience, form.firstName);
        setSent(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Er ging iets mis. Probeer het opnieuw.");
      }
    } catch {
      setError("Verbinding mislukt. Probeer het opnieuw.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-8 text-center">
        <div className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ backgroundColor: accentColor + "15" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <h3 className="text-xl font-bold text-[var(--navy)]">Bedankt, {form.firstName}</h3>
        <p className="mt-2 text-sm text-[var(--muted)] max-w-sm mx-auto">
          We hebben je bericht ontvangen en nemen zo snel mogelijk contact op via {form.email}. Check ook je inbox voor een bevestiging.
        </p>
        {companyName && (
          <p className="mt-4 text-xs text-[var(--muted)]">
            {companyName} × PayWatch
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-6 sm:p-8">
      <h3 className="text-lg font-bold text-[var(--navy)] mb-1">Laten we kennismaken</h3>
      <p className="text-sm text-[var(--muted)] mb-6">
        {companyName
          ? `Vul je gegevens in en we nemen contact op over een mogelijke samenwerking met ${companyName}.`
          : "Vul je gegevens in en we nemen zo snel mogelijk contact op."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot — hidden from real users, bots fill it */}
        <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "-9999px", opacity: 0, pointerEvents: "none", tabIndex: -1 }}>
          <label htmlFor="pw-website">Website (laat leeg)</label>
          <input
            id="pw-website"
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        {companyName && (
          <div>
            <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5">Organisatie</label>
            <div className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text)]">
              {companyName}
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5">Voornaam *</label>
            <input
              type="text" required value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--blue)] focus:ring-1 focus:ring-[var(--blue)]"
              placeholder="Jan"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5">Achternaam *</label>
            <input
              type="text" required value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--blue)] focus:ring-1 focus:ring-[var(--blue)]"
              placeholder="de Vries"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5">Zakelijk e-mailadres *</label>
          <input
            type="email" required value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--blue)] focus:ring-1 focus:ring-[var(--blue)]"
            placeholder="j.devries@organisatie.nl"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5">Bericht</label>
          <textarea
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--blue)] focus:ring-1 focus:ring-[var(--blue)] resize-none"
            placeholder="Waar ben je naar op zoek?"
          />
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit" disabled={sending}
          className="w-full rounded-lg px-4 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: accentColor }}
        >
          {sending ? "Verzenden..." : "Verstuur bericht"}
        </button>

        <p className="text-[11px] text-center text-[var(--muted)]">
          Of mail direct naar business@paywatch.nl
        </p>
      </form>
    </div>
  );
}
