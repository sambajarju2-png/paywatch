"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PersonalizedBanner, { type PersonalizeData } from "./PersonalizedBanner";
import PartnerContactForm from "./PartnerContactForm";

type AudienceType = "gemeente" | "incasso" | "hulporg" | "zakelijk";

/* ── Audience-specific static content ── */
const CONTENT: Record<AudienceType, {
  fallbackTitle: string;
  fallbackSubtitle: string;
  subtitle: string;
  statsTitle: string;
  statsDesc: string;
  stats: { value: string; label: string; source?: string }[];
  propsTitle: string;
  propsDesc: string;
  props: { title: string; desc: string }[];
  extraSection?: { title: string; items: { label: string; desc: string; color: string }[] };
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
    propsTitle: "Hoe PayWatch past binnen uw gemeente",
    propsDesc: "PayWatch vervangt niets. Het versterkt wat er al is.",
    props: [
      { title: "Vroegsignalering", desc: "PayWatch detecteert wanneer rekeningen escaleren. Een extra signaleringsbron naast bestaande convenanten met nutsbedrijven en zorgverzekeraars." },
      { title: "Preventie zonder drempel", desc: "Inwoners gebruiken PayWatch zelf, gratis. Ze krijgen overzicht zonder zich aan te melden bij formele schuldhulpverlening. U bereikt mensen die nu buiten beeld zijn." },
      { title: "Inzicht voor beleid", desc: "Welke sectoren genereren de meeste achterstanden? Welke escalatiefases komen het vaakst voor? Geanonimiseerde data voor beter beleid." },
    ],
    extraSection: {
      title: "De 5 escalatiefases die PayWatch detecteert",
      items: [
        { label: "Factuur", desc: "Op tijd betalen, geen extra kosten", color: "#059669" },
        { label: "Herinnering", desc: "Eerste signaal, nog geen kosten", color: "#D97706" },
        { label: "Aanmaning", desc: "Formeel, kosten lopen op", color: "#EA580C" },
        { label: "Incasso", desc: "Overgedragen, hoge kosten", color: "#DC2626" },
        { label: "Deurwaarder", desc: "Gerechtelijk, duurste fase", color: "#7C3AED" },
      ],
    },
  },
  incasso: {
    fallbackTitle: "Minder dossiers door beter overzicht bij consumenten",
    fallbackSubtitle: "PayWatch helpt consumenten hun rekeningen op tijd te betalen. Dat betekent minder escalatie naar incasso.",
    subtitle: "Als consumenten beter overzicht hebben in hun rekeningen, betalen ze vaker op tijd. Minder dossiers voor u, lagere kosten voor de consument.",
    statsTitle: "De kosten van escalatie",
    statsDesc: "Elke factuur die bij incasso terechtkomt kost geld. Voor iedereen.",
    stats: [
      { value: "€40", label: "minimale incassokosten bij eerste overdracht" },
      { value: "€500+", label: "kosten bij gerechtelijke invordering" },
      { value: "35%", label: "van incassozaken is vermijdbaar met vroege signalering" },
      { value: "78%", label: "betaalt na herinnering, mits die op tijd komt" },
    ],
    propsTitle: "Wat PayWatch betekent voor uw organisatie",
    propsDesc: "PayWatch zit tussen factuur en incasso. Voor de consument, maar met impact op uw werk.",
    props: [
      { title: "Minder vermijdbare dossiers", desc: "Consumenten die PayWatch gebruiken betalen vaker op tijd. Ze zien direct als een rekening dreigt te escaleren en handelen eerder." },
      { title: "Beter geinformeerde debiteuren", desc: "PayWatch legt consumenten uit welke kosten wettelijk zijn onder de WIK-wet. Dat leidt tot minder bezwaarschriften en een soepeler proces." },
      { title: "Preventie als verdienmodel", desc: "Steeds meer incassopartijen investeren in preventie. PayWatch is een tool die u kunt aanbevelen aan klanten van uw opdrachtgevers." },
    ],
    extraSection: {
      title: "Wet Incassokosten (WIK) — wat mag er in rekening gebracht worden?",
      items: [
        { label: "Tot €2.500", desc: "Minimaal €40 (15%)", color: "#D97706" },
        { label: "€2.500 — €5.000", desc: "€375 + 10% over rest", color: "#EA580C" },
        { label: "€5.000 — €10.000", desc: "€625 + 5% over rest", color: "#DC2626" },
      ],
    },
  },
  hulporg: {
    fallbackTitle: "Uw clienten beter voorbereid op het eerste gesprek",
    fallbackSubtitle: "PayWatch geeft clienten overzicht in hun rekeningen zodat ze beter voorbereid zijn op intake en hulpverleningstrajecten.",
    subtitle: "Clienten komen vaak pas bij u als de situatie al geescaleerd is. PayWatch geeft ze eerder overzicht, zodat het eerste gesprek productiever is.",
    statsTitle: "Het bereik van schuldhulpverlening",
    statsDesc: "Te veel mensen worden niet of te laat bereikt.",
    stats: [
      { value: "1,4 mln", label: "mensen met risicovolle of problematische schulden", source: "CBS" },
      { value: "193.000", label: "bekend bij officiele schuldhulpverlening", source: "CBS" },
      { value: "86%", label: "wordt niet of te laat bereikt" },
    ],
    propsTitle: "Wat PayWatch doet voor uw clienten",
    propsDesc: "PayWatch vervangt uw werk niet. Het maakt uw werk makkelijker.",
    props: [
      { title: "Overzicht bij intake", desc: "Clienten die PayWatch gebruiken hebben bij het eerste gesprek al een compleet overzicht van al hun rekeningen en escalatiefases. Dat scheelt tijd." },
      { title: "Minder escalatie tijdens wachttijd", desc: "Terwijl clienten wachten op intake, waarschuwt PayWatch ze als rekeningen dreigen te escaleren. De situatie verslechtert minder snel." },
      { title: "Betalingsregelingen bijhouden", desc: "Clienten volgen hun betalingsregelingen in PayWatch. Ze weten hoeveel termijnen er nog openstaan en worden herinnerd aan de volgende betaling." },
      { title: "Nazorg en terugvalpreventie", desc: "Na afloop van het traject blijft PayWatch de client helpen. Zo wordt terugval voorkomen en blijft de client financieel zelfredzaam." },
    ],
  },
  zakelijk: {
    fallbackTitle: "Uw klanten betalen op tijd, zonder gedoe",
    fallbackSubtitle: "PayWatch geeft uw klanten overzicht in hun rekeningen en waarschuwt voordat betalingstermijnen verlopen.",
    subtitle: "PayWatch helpt uw klanten hun rekeningen bij te houden. Dat betekent minder betalingsachterstanden, minder incassokosten en tevreden klanten.",
    statsTitle: "Waarom bedrijven kiezen voor PayWatch",
    statsDesc: "Elke onbetaalde factuur kost geld. Aan incasso, klantverlies en interne processen.",
    stats: [
      { value: "78%", label: "betaalt na herinnering, mits op tijd" },
      { value: "€40+", label: "gemiddelde kosten per incassodossier" },
      { value: "35%", label: "van incassozaken is vermijdbaar" },
    ],
    propsTitle: "Wat PayWatch doet voor uw klanten",
    propsDesc: "Uw klanten krijgen overzicht. U krijgt betaald.",
    props: [
      { title: "Alle rekeningen op een plek", desc: "Uw klanten zien al hun rekeningen, ook die van andere bedrijven. Ze vergeten niets meer en betalen vaker op tijd." },
      { title: "Slimme herinneringen", desc: "PayWatch stuurt meldingen voordat betalingstermijnen verlopen. Uw factuur wordt eerder betaald zonder dat u zelf hoeft te herinneren." },
      { title: "Escalatie voorkomen", desc: "Klanten zien direct als een rekening dreigt te escaleren naar herinnering of aanmaning. Ze handelen eerder, wat u incassokosten bespaart." },
    ],
  },
};

export default function PersonalizedOutreachPage({ audience }: { audience: AudienceType }) {
  const searchParams = useSearchParams();
  const company = searchParams.get("company");
  const [brandData, setBrandData] = useState<PersonalizeData | null>(null);

  const content = CONTENT[audience];
  const accent = brandData?.primaryColor || "#2563EB";

  return (
    <div className="bg-[var(--bg)] min-h-screen">
      <PersonalizedBanner
        company={company}
        audience={audience}
        fallbackTitle={content.fallbackTitle}
        fallbackSubtitle={content.fallbackSubtitle}
        onDataLoaded={setBrandData}
      >
        <p className="mt-5 text-base text-slate-300 max-w-2xl leading-relaxed">
          {content.subtitle}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#contact" className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold bg-white text-[#0A2540] transition hover:bg-white/90">
            {audience === "gemeente" ? "Plan een kennismaking" : audience === "hulporg" ? "Laten we samenwerken" : "Neem contact op"}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
          </a>
          <a href="#info" className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white/70 border border-white/15 hover:bg-white/[0.05] transition">
            Meer informatie
          </a>
        </div>
      </PersonalizedBanner>

      {/* ── Stats section ── */}
      <section id="info" className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
        <h2 className="text-2xl font-bold text-[var(--navy)] mb-2">{content.statsTitle}</h2>
        <p className="text-[var(--muted)] mb-8 max-w-2xl">{content.statsDesc}</p>
        <div className={`grid gap-4 sm:grid-cols-2 ${content.stats.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {content.stats.map((stat, i) => (
            <div key={i} className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-5">
              <p className="text-2xl font-extrabold" style={{ color: accent }}>{stat.value}</p>
              <p className="text-sm text-[var(--text)] mt-1.5 leading-snug">{stat.label}</p>
              {stat.source && <p className="text-[10px] text-[var(--muted)] mt-2">{stat.source}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* ── Value propositions ── */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
          <h2 className="text-2xl font-bold text-[var(--navy)] mb-2">{content.propsTitle}</h2>
          <p className="text-[var(--muted)] mb-8 max-w-2xl">{content.propsDesc}</p>
          <div className={`grid gap-6 ${content.props.length === 4 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
            {content.props.map((item, i) => (
              <div key={i} className="rounded-xl border border-[var(--border)] p-6 bg-[var(--bg)]">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3 text-white text-xs font-bold" style={{ backgroundColor: accent }}>
                  {i + 1}
                </div>
                <h3 className="text-base font-bold text-[var(--navy)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Extra section (escalation stages or WIK table) ── */}
      {content.extraSection && (
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
          <h2 className="text-xl font-bold text-[var(--navy)] mb-6">{content.extraSection.title}</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            {content.extraSection.items.map((item, i) => (
              <div key={i} className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 text-center relative">
                <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: item.color }}>
                  {i + 1}
                </div>
                <p className="text-sm font-bold text-[var(--navy)]">{item.label}</p>
                <p className="text-[11px] text-[var(--muted)] mt-1">{item.desc}</p>
                {i < content.extraSection!.items.length - 1 && (
                  <div className="hidden sm:block absolute top-1/2 -right-2.5 text-[var(--muted)]">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Contact form ── */}
      <section id="contact" className="border-t border-[var(--border)] bg-[var(--surface)]">
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
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-8 text-center">
        <Link href="/features" className="text-sm font-semibold text-[var(--blue)] hover:underline">
          Bekijk alle PayWatch functies →
        </Link>
      </section>
    </div>
  );
}
