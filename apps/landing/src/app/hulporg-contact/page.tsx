"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import PersonalizedBanner, { type PersonalizeData } from "@/components/personalized/PersonalizedBanner";

function HulporgContent() {
  const searchParams = useSearchParams();
  const company = searchParams.get("company");
  const [brandData, setBrandData] = useState<PersonalizeData | null>(null);

  const accent = brandData?.primaryColor || "#2563EB";

  return (
    <div className="bg-[var(--bg)] min-h-screen">
      <PersonalizedBanner
        company={company}
        audience="hulporg"
        fallbackTitle="Versterk uw clienten met financieel overzicht"
        fallbackSubtitle="PayWatch geeft clienten in schuldhulpverlening direct inzicht in hun rekeningen en escalatiefases. Zodat zij beter voorbereid zijn op gesprekken en trajecten."
        onDataLoaded={setBrandData}
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="#samenwerking"
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
            style={{ backgroundColor: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}
          >
            Laten we samenwerken
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
          </a>
        </div>
      </PersonalizedBanner>

      {/* ── The problem ── */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
        <h2 className="text-2xl font-bold text-[var(--navy)] mb-2">Het probleem dat u elke dag ziet</h2>
        <p className="text-[var(--muted)] mb-8 max-w-2xl">
          Clienten komen vaak pas bij u als de situatie al geescaleerd is. Met dozen vol ongeopende post, rekeningen in verschillende fases en geen overzicht. Dat maakt de intake langer en het traject complexer.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { value: "1,4 mln", label: "mensen met risicovolle of problematische schulden in Nederland", source: "CBS" },
            { value: "193.000", label: "bekend bij officiele schuldhulpverlening", source: "CBS" },
            { value: "86%", label: "bereikt hulpverlening niet of te laat", source: "Schatting o.b.v. CBS data" },
          ].map((stat, i) => (
            <div key={i} className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-5 text-center">
              <p className="text-3xl font-extrabold" style={{ color: accent }}>{stat.value}</p>
              <p className="text-sm text-[var(--text)] mt-2 leading-snug">{stat.label}</p>
              <p className="text-[10px] text-[var(--muted)] mt-2">{stat.source}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How PayWatch helps hulpverleners ── */}
      <section id="samenwerking" className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
          <h2 className="text-2xl font-bold text-[var(--navy)] mb-2">Wat PayWatch doet voor uw clienten</h2>
          <p className="text-[var(--muted)] mb-8 max-w-2xl">
            PayWatch is een gratis tool die uw clienten zelf kunnen gebruiken. Het vervangt uw werk niet, het versterkt het.
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              {
                title: "Compleet rekeningoverzicht",
                desc: "Clienten verbinden hun inbox en zien direct al hun rekeningen op een plek. Geen handmatig zoeken meer naar facturen en herinneringen. Bij intake heeft de client al een overzicht klaarliggen.",
                icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2",
              },
              {
                title: "Escalatiefase per rekening",
                desc: "Elke rekening toont de huidige fase: factuur, herinnering, aanmaning, incasso of deurwaarder. Dit geeft de hulpverlener direct inzicht in de urgentie per schuld.",
                icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
              },
              {
                title: "Vroegsignalering voor de client",
                desc: "Meldingen als een betalingstermijn nadert of als een rekening escaleert. Clienten handelen eerder, waardoor de schuldenberg minder snel groeit tijdens het wachten op een intake.",
                icon: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9",
              },
              {
                title: "Betalingsregeling volgen",
                desc: "Clienten kunnen hun betalingsregelingen bijhouden in PayWatch. Ze zien hoeveel termijnen er nog openstaan en worden herinnerd aan de volgende betaling.",
                icon: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
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

      {/* ── How collaboration works ── */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
        <h2 className="text-xl font-bold text-[var(--navy)] mb-6">Hoe de samenwerking werkt</h2>
        <div className="space-y-4">
          {[
            { step: "1", title: "Verwijzing", desc: "U verwijst clienten naar PayWatch (app.paywatch.app). Ze maken zelf een gratis account aan en verbinden hun inbox." },
            { step: "2", title: "Overzicht", desc: "De client krijgt direct overzicht in al hun rekeningen, inclusief escalatiefase en deadlines. Dit helpt bij de voorbereiding op de intake." },
            { step: "3", title: "Inzicht", desc: "Tijdens het traject houdt de client via PayWatch bij welke rekeningen zijn afgehandeld, welke betalingsregelingen lopen en waar nog actie nodig is." },
            { step: "4", title: "Nazorg", desc: "Na afloop van het traject blijft PayWatch de client helpen met overzicht. Zo wordt terugval voorkomen en blijft de client financieel zelfredzaam." },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 items-start rounded-xl bg-[var(--surface)] border border-[var(--border)] p-5">
              <div className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: accent }}>
                {item.step}
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--navy)]">{item.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14 text-center">
          <h2 className="text-2xl font-bold text-[var(--navy)] mb-3">Samen sterker voor uw clienten</h2>
          <p className="text-[var(--muted)] max-w-lg mx-auto mb-6">
            We vertellen u graag meer over PayWatch en hoe het past binnen uw werkwijze. Geen kosten, geen verplichtingen.
          </p>
          <a
            href="mailto:business@paywatch.nl?subject=Samenwerking hulporganisatie"
            className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
            style={{ backgroundColor: accent }}
          >
            Laten we samenwerken
          </a>
          <p className="mt-4 text-xs text-[var(--muted)]">business@paywatch.nl</p>
        </div>
      </section>
    </div>
  );
}

export default function HulporgContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg)]" />}>
      <HulporgContent />
    </Suspense>
  );
}
