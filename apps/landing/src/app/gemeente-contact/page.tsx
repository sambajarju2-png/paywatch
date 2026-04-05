"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import PersonalizedBanner, { type PersonalizeData } from "@/components/personalized/PersonalizedBanner";

function GemeenteContent() {
  const searchParams = useSearchParams();
  const company = searchParams.get("company");
  const [brandData, setBrandData] = useState<PersonalizeData | null>(null);

  const accent = brandData?.primaryColor || "#2563EB";

  return (
    <div className="bg-[var(--bg)] min-h-screen">
      <PersonalizedBanner
        company={company}
        audience="gemeente"
        fallbackTitle="Samen schulden voorkomen voor uw inwoners"
        fallbackSubtitle="PayWatch geeft inwoners grip op hun rekeningen en waarschuwt voordat betalingsachterstanden escaleren. Ontdek hoe uw gemeente kan samenwerken."
        onDataLoaded={setBrandData}
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="#samenwerking"
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
            style={{ backgroundColor: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}
          >
            Plan een kennismaking
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
          </a>
          <a
            href="#cijfers"
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white/80 border border-white/20 hover:bg-white/10 transition"
          >
            Bekijk de cijfers
          </a>
        </div>
      </PersonalizedBanner>

      {/* ── Section: Debt stats cards ── */}
      <section id="cijfers" className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
        <h2 className="text-2xl font-bold text-[var(--navy)] mb-2">
          Schulden in Nederland: de feiten
        </h2>
        <p className="text-[var(--muted)] mb-8 max-w-2xl">
          De schuldenproblematiek in Nederland is groot. Als gemeente kunt u een verschil maken door inwoners vroeg te bereiken.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { value: "724.110", label: "huishoudens met problematische schulden", source: "CBS 2025", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" },
            { value: "8,6%", label: "van alle Nederlandse huishoudens", source: "CBS 2025", icon: "M3 3v18h18" },
            { value: "66%", label: "kampt langer dan 3 jaar met schulden", source: "CBS 2025", icon: "M12 8v4l3 3" },
            { value: "55%", label: "weet niet dat gemeentelijke hulp gratis is", source: "Flanderijn 2025", icon: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" },
          ].map((stat, i) => (
            <div key={i} className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-5">
              <div className="w-9 h-9 rounded-lg bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2"><path d={stat.icon} />{stat.icon.includes("M12 8") && <circle cx="12" cy="12" r="10" />}{stat.icon.includes("M9.09") && <><circle cx="12" cy="12" r="10" /><line x1="12" y1="17" x2="12.01" y2="17" /></>}</svg>
              </div>
              <p className="text-2xl font-extrabold text-[var(--navy)]">{stat.value}</p>
              <p className="text-sm text-[var(--text)] mt-1 leading-snug">{stat.label}</p>
              <p className="text-[10px] text-[var(--muted)] mt-2">{stat.source}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section: How PayWatch helps gemeentes ── */}
      <section id="samenwerking" className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
          <h2 className="text-2xl font-bold text-[var(--navy)] mb-2">
            Hoe PayWatch uw gemeente kan helpen
          </h2>
          <p className="text-[var(--muted)] mb-8 max-w-2xl">
            PayWatch sluit aan op uw bestaande schuldhulpverlening en vroegsignalering. Gratis voor inwoners, waardevol voor uw gemeente.
          </p>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "Vroegsignalering versterken",
                desc: "PayWatch detecteert wanneer rekeningen van inwoners escaleren van factuur naar aanmaning of incasso. Uw gemeente krijgt hiermee een extra signaleringsbron naast de bestaande convenanten met nutsbedrijven.",
                icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
              },
              {
                title: "Preventie zonder drempel",
                desc: "Inwoners gebruiken PayWatch zelf, gratis. Ze krijgen overzicht in hun rekeningen zonder dat ze zich hoeven aan te melden bij formele schuldhulpverlening. Zo bereikt u mensen die nu buiten beeld zijn.",
                icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
              },
              {
                title: "Data-gedreven beleid",
                desc: "Geanonimiseerde inzichten over betalingspatronen in uw gemeente. Welke sectoren genereren de meeste achterstanden? Welke escalatiefases komen het vaakst voor?",
                icon: "M3 3v18h18M19 9l-5 5-4-4-3 3",
              },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-[var(--border)] p-6 bg-[var(--bg)]">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: accent + "15" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5"><path d={item.icon} /></svg>
                </div>
                <h3 className="text-base font-bold text-[var(--navy)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section: Escalation stages visual ── */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
        <h2 className="text-xl font-bold text-[var(--navy)] mb-6">
          Wat PayWatch detecteert: de 5 escalatiefases
        </h2>
        <div className="flex flex-col sm:flex-row gap-2">
          {[
            { stage: "Factuur", color: "#059669", desc: "Rekening ontvangen, op tijd betalen" },
            { stage: "Herinnering", color: "#D97706", desc: "Eerste herinnering, nog geen extra kosten" },
            { stage: "Aanmaning", color: "#EA580C", desc: "Formele aanmaning, kosten lopen op" },
            { stage: "Incasso", color: "#DC2626", desc: "Overgedragen aan incassobureau" },
            { stage: "Deurwaarder", color: "#7C3AED", desc: "Gerechtelijke stappen, hoge kosten" },
          ].map((s, i) => (
            <div key={i} className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 text-center relative">
              <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: s.color }}>
                {i + 1}
              </div>
              <p className="text-sm font-bold text-[var(--navy)]">{s.stage}</p>
              <p className="text-[11px] text-[var(--muted)] mt-1">{s.desc}</p>
              {i < 4 && (
                <div className="hidden sm:block absolute top-1/2 -right-3 w-4 h-4 text-[var(--muted)]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-[var(--muted)] mt-4">
          PayWatch waarschuwt inwoners bij elke faseverandering en legt uit welke rechten ze hebben onder de WIK-wet.
        </p>
      </section>

      {/* ── CTA Section ── */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14 text-center">
          <h2 className="text-2xl font-bold text-[var(--navy)] mb-3">
            Interesse in een samenwerking?
          </h2>
          <p className="text-[var(--muted)] max-w-lg mx-auto mb-6">
            We vertellen u graag meer over hoe PayWatch past binnen uw gemeentelijke schuldhulpverlening en vroegsignaleringsbeleid.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="mailto:business@paywatch.nl?subject=Samenwerking gemeente"
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
              style={{ backgroundColor: accent }}
            >
              Plan een kennismaking
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
            </a>
            <Link
              href="/features"
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold border border-[var(--border)] text-[var(--navy)] hover:bg-[var(--bg)] transition"
            >
              Bekijk alle functies
            </Link>
          </div>
          <p className="mt-6 text-xs text-[var(--muted)]">
            Of mail direct naar business@paywatch.nl
          </p>
        </div>
      </section>
    </div>
  );
}

export default function GemeenteContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg)]" />}>
      <GemeenteContent />
    </Suspense>
  );
}
