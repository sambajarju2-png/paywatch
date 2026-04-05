"use client";

import { useState } from "react";

interface Props {
  companyName?: string;
  audience: string;
  accentColor?: string;
}

export default function PartnerContactForm({ companyName, audience, accentColor = "#2563EB" }: Props) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);

    // Send via mailto as fallback (could be replaced with API endpoint)
    const subject = encodeURIComponent(`Samenwerking ${audience} — ${companyName || "onbekend"}`);
    const body = encodeURIComponent(
      `Naam: ${form.firstName} ${form.lastName}\nE-mail: ${form.email}\nBedrijf: ${companyName || "Niet opgegeven"}\nType: ${audience}\n\nBericht:\n${form.message}`
    );
    window.open(`mailto:business@paywatch.nl?subject=${subject}&body=${body}`, "_self");
    setSent(true);
    setSending(false);
  }

  if (sent) {
    return (
      <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-8 text-center">
        <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: accentColor + "15" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <h3 className="text-lg font-bold text-[var(--navy)]">Bedankt voor je interesse</h3>
        <p className="mt-2 text-sm text-[var(--muted)]">We nemen zo snel mogelijk contact op via {form.email}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-6 sm:p-8">
      <h3 className="text-lg font-bold text-[var(--navy)] mb-1">Laten we kennismaken</h3>
      <p className="text-sm text-[var(--muted)] mb-6">
        {companyName
          ? `Vul je gegevens in en we nemen contact op over een mogelijke samenwerking met ${companyName}.`
          : "Vul je gegevens in en we nemen zo snel mogelijk contact op."
        }
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Company (read-only if known) */}
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
              type="text"
              required
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--blue)] focus:ring-1 focus:ring-[var(--blue)]"
              placeholder="Jan"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5">Achternaam *</label>
            <input
              type="text"
              required
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--blue)] focus:ring-1 focus:ring-[var(--blue)]"
              placeholder="de Vries"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5">Zakelijk e-mailadres *</label>
          <input
            type="email"
            required
            value={form.email}
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
            placeholder="Waar ben je naar op zoek? Wat wil je bereiken?"
          />
        </div>

        <button
          type="submit"
          disabled={sending}
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
