"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import PersonalizedBanner, { type PersonalizeData } from "@/components/personalized/PersonalizedBanner";

function IncassoContent() {
  const searchParams = useSearchParams();
  const company = searchParams.get("company");
  const [brandData, setBrandData] = useState<PersonalizeData | null>(null);

  const accent = brandData?.primaryColor || "#2563EB";

  return (
    <div className="bg-[var(--bg)] min-h-screen">
      <PersonalizedBanner
        company={company}
        audience="incasso"
        fallbackTitle="Minder incassozaken door preventief inzicht"
        fallbackSubtitle="PayWatch helpt consumenten hun rekeningen op tijd te betalen. Dat betekent minder escalatie, minder kosten en betere betalingsmoraal."
        onDataLoaded={setBrandData}
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="#samenwerking"
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
            style={{ backgroundColor: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}
          >
            Ontdek de mogelijkheden
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
          </a>
        </div>
      </PersonalizedBanner>

      {/* ── Incasso stats ── */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
        <h2 className="text-2xl font-bold text-[var(--navy)] mb-2">
          De kosten van escalatie
        </h2>
        <p className="text-[var(--muted)] mb-8 max-w-2xl">
          Elke factuur die escaleert naar incasso kost geld. Voor de consument, voor het bedrijf en voor het incassobureau. Preventie is goedkoper.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { value: "€40", label: "gemiddelde incassokosten bij eerste overdracht", color: "#D97706" },
            { value: "€500+", label: "kosten bij gerechtelijke invordering", color: "#DC2626" },
            { value: "35%", label: "van incassozaken is vermijdbaar met vroege signalering", color: "#059669" },
            { value: "78%", label: "van consumenten betaalt na herinnering, mits op tijd", color: "#2563EB" },
          ].map((stat, i) => (
            <div key={i} className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-5">
              <p className="text-3xl font-extrabold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-sm text-[var(--text)] mt-2 leading-snug">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How PayWatch reduces incasso ── */}
      <section id="samenwerking" className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
          <h2 className="text-2xl font-bold text-[var(--navy)] mb-2">
            Hoe PayWatch incasso helpt voorkomen
          </h2>
          <p className="text-[var(--muted)] mb-8 max-w-2xl">
            PayWatch zit tussen factuur en incasso. Consumenten die PayWatch gebruiken betalen vaker op tijd omdat ze weten waar ze staan.
          </p>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "Escalatie-detectie",
                desc: "PayWatch herkent automatisch de fase van elke rekening: factuur, herinnering, aanmaning, incasso of deurwaarder. Consumenten zien direct hoe urgent het is.",
              },
              {
                title: "Betalingsherinneringen",
                desc: "Automatische meldingen voordat betalingstermijnen verlopen. Consumenten handelen eerder, waardoor minder zaken bij een incassobureau terechtkomen.",
              },
              {
                title: "Inzicht voor de consument",
                desc: "Een compleet overzicht van alle openstaande rekeningen op een plek. Geen vergeten facturen meer die stilletjes oplopen naar incasso.",
              },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-[var(--border)] p-6 bg-[var(--bg)]">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3 text-white text-sm font-bold" style={{ backgroundColor: accent }}>
                  {i + 1}
                </div>
                <h3 className="text-base font-bold text-[var(--navy)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WIK wet context ── */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
        <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-6 sm:p-8">
          <h3 className="text-lg font-bold text-[var(--navy)] mb-3">Wet Incassokosten (WIK)</h3>
          <p className="text-sm text-[var(--text)] leading-relaxed mb-4">
            Sinds 2012 regelt de WIK welke incassokosten in rekening gebracht mogen worden. PayWatch legt aan consumenten uit welke kosten wettelijk zijn en welke niet. Dit zorgt voor minder bezwaarschriften en een soepeler incassoproces.
          </p>
          <div className="grid gap-3 sm:grid-cols-3 text-center">
            {[
              { amount: "Tot €2.500", fee: "€40 (min.)", pct: "15%" },
              { amount: "€2.500 - €5.000", fee: "€375 + 10%", pct: "10%" },
              { amount: "€5.000 - €10.000", fee: "€625 + 5%", pct: "5%" },
            ].map((row, i) => (
              <div key={i} className="rounded-lg bg-[var(--bg)] p-3 border border-[var(--border)]">
                <p className="text-xs text-[var(--muted)]">Hoofdsom</p>
                <p className="text-sm font-bold text-[var(--navy)]">{row.amount}</p>
                <p className="text-xs text-[var(--muted)] mt-1">Max kosten: {row.fee}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14 text-center">
          <h2 className="text-2xl font-bold text-[var(--navy)] mb-3">Laten we het gesprek starten</h2>
          <p className="text-[var(--muted)] max-w-lg mx-auto mb-6">
            We bespreken graag hoe PayWatch past binnen uw incassoketen en hoe preventie de kosten kan verlagen.
          </p>
          <a
            href="mailto:business@paywatch.nl?subject=Samenwerking incasso"
            className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
            style={{ backgroundColor: accent }}
          >
            Neem contact op
          </a>
          <p className="mt-4 text-xs text-[var(--muted)]">business@paywatch.nl</p>
        </div>
      </section>
    </div>
  );
}

export default function IncassoContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg)]" />}>
      <IncassoContent />
    </Suspense>
  );
}
