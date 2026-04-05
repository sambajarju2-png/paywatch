"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PersonalizedBanner, { type PersonalizeData } from "./PersonalizedBanner";
import PartnerContactForm from "./PartnerContactForm";

type AudienceType = "gemeente" | "incasso" | "hulporg" | "zakelijk";

/* ── Static content per audience ── */
const CONTENT: Record<AudienceType, {
  fallbackTitle: string;
  fallbackSubtitle: string;
  subtitle: string;
  statsTitle: string;
  statsDesc: string;
  stats: { value: string; label: string; source?: string }[];
  journeyTitle: string;
  journeyDesc: string;
  journey: { step: string; title: string; desc: string }[];
  propsTitle: string;
  props: { title: string; desc: string }[];
  extraTitle?: string;
  extraItems?: { label: string; desc: string; color: string }[];
}> = {
  gemeente: {
    fallbackTitle: "Samen schulden voorkomen voor uw inwoners",
    fallbackSubtitle: "PayWatch geeft inwoners grip op hun rekeningen en waarschuwt voordat betalingsachterstanden escaleren.",
    subtitle: "PayWatch geeft inwoners grip op hun rekeningen en waarschuwt voordat betalingsachterstanden escaleren. Samen maken we schuldhulpverlening effectiever.",
    statsTitle: "Schulden in Nederland",
    statsDesc: "De cijfers laten zien dat vroegsignalering noodzakelijk is.",
    stats: [
      { value: "724.110", label: "huishoudens met problematische schulden", source: "CBS 2025" },
      { value: "8,6%", label: "van alle Nederlandse huishoudens", source: "CBS 2025" },
      { value: "66%", label: "kampt langer dan 3 jaar met schulden", source: "CBS 2025" },
      { value: "55%", label: "weet niet dat gemeentelijke hulp gratis is", source: "Flanderijn 2025" },
    ],
    journeyTitle: "Hoe de samenwerking eruitziet",
    journeyDesc: "Geen ingewikkelde implementatie. PayWatch sluit aan op wat er al is.",
    journey: [
      { step: "01", title: "Kennismaking", desc: "We bespreken de schuldenproblematiek in uw gemeente en hoe PayWatch past binnen bestaand beleid en vroegsignalering." },
      { step: "02", title: "Inwoners verwijzen", desc: "U verwijst inwoners naar PayWatch via wijkteams, het gemeenteloket of uw website. Inwoners maken zelf een gratis account aan." },
      { step: "03", title: "Signalering actief", desc: "PayWatch waarschuwt inwoners wanneer rekeningen dreigen te escaleren. Ze handelen eerder, voordat het bij schuldhulpverlening terechtkomt." },
      { step: "04", title: "Inzicht voor beleid", desc: "Geanonimiseerde data over betalingspatronen in uw gemeente. Welke sectoren genereren de meeste achterstanden?" },
    ],
    propsTitle: "Wat PayWatch toevoegt",
    props: [
      { title: "Extra signaleringsbron", desc: "Naast convenanten met nutsbedrijven en zorgverzekeraars krijgt u een digitale signaleringsbron die direct bij de inwoner zit." },
      { title: "Bereik buiten beeld", desc: "PayWatch bereikt inwoners die zichzelf niet aanmelden bij schuldhulpverlening. Ze krijgen overzicht zonder formele stap." },
      { title: "Gratis voor inwoners", desc: "Geen kosten voor de inwoner. PayWatch is gratis in beta en blijft toegankelijk." },
    ],
    extraTitle: "De 5 escalatiefases die PayWatch detecteert",
    extraItems: [
      { label: "Factuur", desc: "Op tijd, geen extra kosten", color: "#059669" },
      { label: "Herinnering", desc: "Eerste signaal", color: "#D97706" },
      { label: "Aanmaning", desc: "Formeel, kosten lopen op", color: "#EA580C" },
      { label: "Incasso", desc: "Overgedragen", color: "#DC2626" },
      { label: "Deurwaarder", desc: "Gerechtelijk, duurste fase", color: "#7C3AED" },
    ],
  },
  incasso: {
    fallbackTitle: "Minder dossiers door beter overzicht bij consumenten",
    fallbackSubtitle: "PayWatch helpt consumenten hun rekeningen op tijd te betalen. Dat betekent minder escalatie naar incasso.",
    subtitle: "Als consumenten beter overzicht hebben, betalen ze vaker op tijd. Minder dossiers voor u, lagere kosten voor de consument.",
    statsTitle: "De kosten van escalatie",
    statsDesc: "Elke factuur die bij incasso terechtkomt kost geld. Voor iedereen.",
    stats: [
      { value: "€40", label: "minimale incassokosten bij eerste overdracht" },
      { value: "€500+", label: "kosten bij gerechtelijke invordering" },
      { value: "35%", label: "van incassozaken is vermijdbaar" },
      { value: "78%", label: "betaalt na herinnering, mits op tijd" },
    ],
    journeyTitle: "Hoe PayWatch uw werk beinvloedt",
    journeyDesc: "PayWatch zit voor het incassoproces. Het vermindert het aantal zaken dat bij u terechtkomt.",
    journey: [
      { step: "01", title: "Consument installeert PayWatch", desc: "De consument verbindt zijn inbox en ziet al zijn rekeningen. PayWatch detecteert automatisch de fase van elke rekening." },
      { step: "02", title: "Waarschuwing voor escalatie", desc: "Voordat een rekening escaleert naar aanmaning of incasso, krijgt de consument een melding. Hij betaalt alsnog op tijd." },
      { step: "03", title: "Minder dossiers bij u", desc: "Consumenten die PayWatch gebruiken laten minder facturen escaleren. U ontvangt minder vermijdbare dossiers." },
      { step: "04", title: "Beter geinformeerde debiteuren", desc: "Als een dossier toch bij u komt, kent de consument al zijn rechten onder de WIK-wet. Minder bezwaarschriften, soepeler proces." },
    ],
    propsTitle: "Waarom dit voor u relevant is",
    props: [
      { title: "Preventie als strategie", desc: "Steeds meer incassopartijen investeren in preventie. PayWatch is een tool die u kunt aanbevelen aan opdrachtgevers." },
      { title: "WIK-educatie", desc: "PayWatch legt consumenten uit welke kosten wettelijk zijn. Dat vermindert onrealistische verwachtingen en klachten." },
      { title: "Reputatie en maatschappij", desc: "Door preventie te ondersteunen positioneert u zich als verantwoordelijke partner in de keten." },
    ],
    extraTitle: "WIK-kosten die PayWatch uitlegt aan consumenten",
    extraItems: [
      { label: "Tot €2.500", desc: "Min. €40 (15%)", color: "#D97706" },
      { label: "€2.500 — €5.000", desc: "€375 + 10%", color: "#EA580C" },
      { label: "€5.000 — €10.000", desc: "€625 + 5%", color: "#DC2626" },
    ],
  },
  hulporg: {
    fallbackTitle: "Uw clienten beter voorbereid op het eerste gesprek",
    fallbackSubtitle: "PayWatch geeft clienten overzicht zodat ze beter voorbereid zijn op intake en trajecten.",
    subtitle: "Clienten komen vaak pas bij u als de situatie al geescaleerd is. PayWatch geeft ze eerder overzicht, zodat het eerste gesprek productiever is.",
    statsTitle: "Het bereik van schuldhulpverlening",
    statsDesc: "Te veel mensen worden niet of te laat bereikt.",
    stats: [
      { value: "1,4 mln", label: "mensen met risicovolle of problematische schulden", source: "CBS" },
      { value: "193.000", label: "bekend bij officiele schuldhulpverlening", source: "CBS" },
      { value: "86%", label: "wordt niet of te laat bereikt" },
    ],
    journeyTitle: "Hoe de samenwerking eruitziet",
    journeyDesc: "PayWatch vervangt uw werk niet. Het maakt uw werk makkelijker.",
    journey: [
      { step: "01", title: "Verwijzing", desc: "U verwijst clienten naar PayWatch. Ze maken zelf een gratis account aan en verbinden hun inbox." },
      { step: "02", title: "Overzicht voor intake", desc: "Bij het eerste gesprek heeft de client al een compleet overzicht van al hun rekeningen, inclusief escalatiefases en deadlines." },
      { step: "03", title: "Ondersteuning tijdens traject", desc: "Tijdens het traject houdt de client via PayWatch bij welke rekeningen zijn afgehandeld en welke betalingsregelingen lopen." },
      { step: "04", title: "Nazorg en preventie", desc: "Na afloop blijft PayWatch de client helpen met overzicht. Terugval wordt voorkomen doordat de client financieel zelfredzaam blijft." },
    ],
    propsTitle: "Wat dit oplevert",
    props: [
      { title: "Snellere intake", desc: "Clienten die PayWatch gebruiken hebben hun financiele situatie al in kaart. Dat scheelt u tijd bij het eerste gesprek." },
      { title: "Minder escalatie in wachttijd", desc: "Terwijl clienten wachten op intake, waarschuwt PayWatch ze als rekeningen dreigen te escaleren." },
      { title: "Betalingsregelingen volgen", desc: "Clienten zien hoeveel termijnen er nog openstaan en worden herinnerd aan de volgende betaling." },
      { title: "Lagere terugval", desc: "Na het traject blijft PayWatch de client ondersteunen. Minder terugval betekent minder heraanmeldingen." },
    ],
  },
  zakelijk: {
    fallbackTitle: "Uw klanten betalen op tijd, zonder gedoe",
    fallbackSubtitle: "PayWatch geeft uw klanten overzicht in hun rekeningen en waarschuwt voordat betalingstermijnen verlopen.",
    subtitle: "PayWatch helpt uw klanten hun rekeningen bij te houden. Minder betalingsachterstanden, minder incassokosten, tevreden klanten.",
    statsTitle: "Waarom bedrijven kiezen voor PayWatch",
    statsDesc: "Elke onbetaalde factuur kost geld. Aan incasso, klantverlies en interne processen.",
    stats: [
      { value: "78%", label: "betaalt na herinnering, mits op tijd" },
      { value: "€40+", label: "gemiddelde kosten per incassodossier" },
      { value: "35%", label: "van incassozaken is vermijdbaar" },
    ],
    journeyTitle: "Hoe PayWatch werkt voor uw klanten",
    journeyDesc: "Uw klanten krijgen overzicht. U krijgt betaald.",
    journey: [
      { step: "01", title: "Klant installeert PayWatch", desc: "Uw klant maakt een gratis account aan en verbindt zijn inbox. PayWatch herkent automatisch alle rekeningen, ook die van u." },
      { step: "02", title: "Herinnering voor deadline", desc: "Voordat de betalingstermijn van uw factuur verloopt, krijgt de klant een melding. Hij betaalt alsnog op tijd." },
      { step: "03", title: "Minder incasso nodig", desc: "Klanten die PayWatch gebruiken laten minder facturen escaleren. U bespaart op incassokosten en behoudt de klantrelatie." },
    ],
    propsTitle: "Wat dit voor u betekent",
    props: [
      { title: "Eerder betaald", desc: "Klanten die overzicht hebben betalen vaker op tijd. Minder herinneringen, minder aanmaningen." },
      { title: "Lagere incassokosten", desc: "Minder facturen die bij een incassobureau terechtkomen. Dat scheelt u kosten en administratie." },
      { title: "Betere klantrelatie", desc: "Klanten voelen zich geholpen, niet achtervolgd. PayWatch is een positieve tool, geen dreigement." },
    ],
  },
};

export default function PersonalizedOutreachPage({ audience }: { audience: AudienceType }) {
  const searchParams = useSearchParams();
  const company = searchParams.get("company");
  const [brandData, setBrandData] = useState<PersonalizeData | null>(null);

  const c = CONTENT[audience];
  const accent = brandData?.primaryColor || "#2563EB";

  return (
    <div className="bg-[var(--bg)] min-h-screen">
      <PersonalizedBanner
        company={company}
        audience={audience}
        fallbackTitle={c.fallbackTitle}
        fallbackSubtitle={c.fallbackSubtitle}
        onDataLoaded={setBrandData}
      >
        <p className="mt-5 text-base text-slate-300 max-w-2xl leading-relaxed">{c.subtitle}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#contact" className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold bg-white text-[#0A2540] transition hover:bg-white/90">
            {audience === "gemeente" ? "Plan een kennismaking" : audience === "hulporg" ? "Laten we samenwerken" : "Neem contact op"}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
          </a>
          <a href="#journey" className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white/70 border border-white/15 hover:bg-white/[0.05] transition">
            Hoe werkt het?
          </a>
        </div>
      </PersonalizedBanner>

      {/* ── Stats ── */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
        <h2 className="text-2xl font-bold text-[var(--navy)] mb-2">{c.statsTitle}</h2>
        <p className="text-[var(--muted)] mb-8 max-w-2xl">{c.statsDesc}</p>
        <div className={`grid gap-4 sm:grid-cols-2 ${c.stats.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {c.stats.map((stat, i) => (
            <div key={i} className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-5">
              <p className="text-2xl font-extrabold" style={{ color: accent }}>{stat.value}</p>
              <p className="text-sm text-[var(--text)] mt-1.5 leading-snug">{stat.label}</p>
              {stat.source && <p className="text-[10px] text-[var(--muted)] mt-2">{stat.source}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* ── Collaboration Journey ── */}
      <section id="journey" className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
          <h2 className="text-2xl font-bold text-[var(--navy)] mb-2">{c.journeyTitle}</h2>
          <p className="text-[var(--muted)] mb-8 max-w-2xl">{c.journeyDesc}</p>
          <div className="space-y-4">
            {c.journey.map((item, i) => (
              <div key={i} className="flex gap-4 items-start rounded-xl border border-[var(--border)] p-5 bg-[var(--bg)]">
                <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: accent }}>
                  {item.step}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--navy)]">{item.title}</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Value props ── */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
        <h2 className="text-xl font-bold text-[var(--navy)] mb-8">{c.propsTitle}</h2>
        <div className={`grid gap-6 ${c.props.length === 4 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
          {c.props.map((item, i) => (
            <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${accent}15` }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
              </div>
              <h3 className="text-sm font-bold text-[var(--navy)] mb-1.5">{item.title}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Extra section (escalation stages or WIK) ── */}
      {c.extraTitle && c.extraItems && (
        <section className="border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
            <h2 className="text-xl font-bold text-[var(--navy)] mb-6">{c.extraTitle}</h2>
            <div className="flex flex-col sm:flex-row gap-2">
              {c.extraItems.map((item, i) => (
                <div key={i} className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4 text-center relative">
                  <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: item.color }}>
                    {i + 1}
                  </div>
                  <p className="text-sm font-bold text-[var(--navy)]">{item.label}</p>
                  <p className="text-[11px] text-[var(--muted)] mt-1">{item.desc}</p>
                  {i < c.extraItems!.length - 1 && (
                    <div className="hidden sm:block absolute top-1/2 -right-2.5 text-[var(--muted)]">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Contact form ── */}
      <section id="contact" className={c.extraTitle ? "" : "border-t border-[var(--border)] bg-[var(--surface)]"}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
          <div className="max-w-lg mx-auto">
            <PartnerContactForm
              companyName={brandData?.companyName}
              audience={audience}
              accentColor={accent}
            />
          </div>
        </div>
      </section>

      {/* ── Footer link ── */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 text-center">
          <Link href="/features" className="text-sm font-semibold text-[var(--blue)] hover:underline">
            Bekijk alle PayWatch functies →
          </Link>
        </div>
      </section>
    </div>
  );
}
