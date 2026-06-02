"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import ScrollReveal from "@/components/ScrollReveal";

const TOPICS = [
  {
    id: "schulden",
    emoji: "🔥",
    title: { nl: "Schuldenpreventie in Nederland", en: "Debt Prevention in the Netherlands" },
    desc: {
      nl: "Hoe belanden 730.000 huishoudens in problematische schulden? Wat zijn de signalen? En hoe kan technologie helpen om het te voorkomen voordat het escaleert? Ik neem studenten mee in het complete traject: van eerste herinnering tot deurwaarder.",
      en: "How do 730,000 households end up in problematic debt? What are the warning signs? And how can technology help prevent escalation? I take students through the full journey: from first reminder to bailiff.",
    },
    tags: { nl: ["CBS cijfers", "Escalatiemodel", "WIK wetgeving", "Beslagvrije voet"], en: ["CBS statistics", "Escalation model", "WIK legislation", "Protected income"] },
  },
  {
    id: "ondernemen",
    emoji: "🚀",
    title: { nl: "Maatschappelijk betrokken ondernemen", en: "Purpose-Driven Entrepreneurship" },
    desc: {
      nl: "Een startup bouwen die geld verdient en tegelijk een maatschappelijk probleem oplost. Hoe combineer je impact met een businessmodel? Ik deel de lessen, fouten en keuzes die wij maakten bij het opzetten van PayWatch.",
      en: "Building a startup that makes money while solving a social problem. How do you combine impact with a business model? I share the lessons, mistakes, and choices we made building PayWatch.",
    },
    tags: { nl: ["Impact vs winst", "B2B + social good", "Bootstrappen", "Pitch lessen"], en: ["Impact vs profit", "B2B + social good", "Bootstrapping", "Pitch lessons"] },
  },
  {
    id: "fintech",
    emoji: "⚡",
    title: { nl: "Fintech bouwen als starter", en: "Building Fintech as a Starter" },
    desc: {
      nl: "Van idee tot app in de App Store. Hoe bouw je als jong team een fintech product zonder enorm budget? Open banking, AI, PSD2, privacy en de realiteit van regelgeving. Eerlijk verhaal, geen succesverhaal.",
      en: "From idea to App Store. How do you build a fintech product as a young team without a huge budget? Open banking, AI, PSD2, privacy, and the reality of regulation. Honest story, no highlight reel.",
    },
    tags: { nl: ["Open banking", "AI in fintech", "PSD2 / AVG", "App Store launch"], en: ["Open banking", "AI in fintech", "PSD2 / GDPR", "App Store launch"] },
  },
  {
    id: "digitaal",
    emoji: "🧠",
    title: { nl: "Digitale geletterdheid en financieel bewustzijn", en: "Digital Literacy & Financial Awareness" },
    desc: {
      nl: "Jongeren groeien op met BNPL, crypto en subscriptions maar leren niet hoe een aanmaning werkt. Hoe zorgen we dat de volgende generatie financieel weerbaar is? Een interactieve sessie over wat scholen zouden moeten onderwijzen.",
      en: "Young people grow up with BNPL, crypto, and subscriptions but never learn how a payment reminder works. How do we ensure the next generation is financially resilient?",
    },
    tags: { nl: ["BNPL risico\'s", "Gen Z & geld", "Financiele educatie", "Interactief"], en: ["BNPL risks", "Gen Z & money", "Financial education", "Interactive"] },
  },
];

const FORMATS = {
  nl: [
    { icon: "🎓", label: "Gastcollege", desc: "45-90 min, HBO/WO/MBO", color: "#2563EB" },
    { icon: "🎤", label: "Keynote", desc: "15-30 min, events & conferenties", color: "#059669" },
    { icon: "💬", label: "Paneldiscussie", desc: "Moderator of panellid", color: "#D97706" },
    { icon: "🔧", label: "Workshop", desc: "2-3 uur, hands-on", color: "#8B5CF6" },
  ],
  en: [
    { icon: "🎓", label: "Guest Lecture", desc: "45-90 min, universities", color: "#2563EB" },
    { icon: "🎤", label: "Keynote", desc: "15-30 min, events & conferences", color: "#059669" },
    { icon: "💬", label: "Panel Discussion", desc: "Moderator or panelist", color: "#D97706" },
    { icon: "🔧", label: "Workshop", desc: "2-3 hours, hands-on", color: "#8B5CF6" },
  ],
};

function TopicCard({ topic, lang, index }: { topic: typeof TOPICS[0]; lang: "nl" | "en"; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <ScrollReveal delay={index * 80}>
      <div
        onClick={() => setOpen(!open)}
        className={`group cursor-pointer rounded-2xl border bg-[var(--surface)] overflow-hidden transition-all duration-300 ${
          open ? "border-[var(--blue)] shadow-lg shadow-blue-500/5" : "border-[var(--border)] hover:border-[var(--blue)]/40"
        }`}
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{topic.emoji}</span>
              <h3 className="text-base sm:text-lg font-bold text-[var(--navy)] leading-tight">{topic.title[lang]}</h3>
            </div>
            <svg
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--muted)"
              strokeWidth="2" className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>

          <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
            <p className="text-sm text-[var(--muted)] leading-relaxed">{topic.desc[lang]}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {topic.tags[lang].map((tag) => (
                <span key={tag} className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[var(--blue)]/8 text-[var(--blue)]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function SpeakingPage() {
  const { lang } = useApp();
  const isNl = lang === "nl";

  return (
    <div className="bg-[var(--bg)] overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-12 sm:pt-20 pb-8">
        <ScrollReveal>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--blue)] mb-4">
            {isNl ? "Gastcolleges & spreekbeurten" : "Guest lectures & speaking"}
          </p>
        </ScrollReveal>
        <ScrollReveal delay={60}>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[var(--navy)] tracking-tight leading-[1.08] max-w-3xl">
            {isNl ? (
              <>Ik praat over schulden,<br className="hidden sm:block" /> ondernemen en waarom<br className="hidden sm:block" /> het anders moet.</>
            ) : (
              <>I talk about debt,<br className="hidden sm:block" /> entrepreneurship and why<br className="hidden sm:block" /> things need to change.</>
            )}
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={120}>
          <p className="text-base sm:text-lg text-[var(--muted)] mt-5 max-w-2xl leading-relaxed">
            {isNl
              ? "Mijn naam is Samba Jarju. Ik ben co-founder van PayWatch en geef gastcolleges bij hogescholen, universiteiten en events over schuldenpreventie, maatschappelijk ondernemen en de toekomst van fintech in Nederland."
              : "My name is Samba Jarju. I'm the co-founder of PayWatch and I give guest lectures at universities and events about debt prevention, social entrepreneurship, and the future of fintech in the Netherlands."}
          </p>
        </ScrollReveal>
      </section>

      {/* ── Photo grid ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-12 sm:pb-16">
        <ScrollReveal>
          <div className="grid sm:grid-cols-5 gap-4">
            <div className="sm:col-span-3 relative aspect-[4/3] sm:aspect-auto sm:min-h-[420px] rounded-2xl overflow-hidden">
              <Image src="/speaking-stage.png" alt="Samba Jarju presenteert PayWatch op het podium bij Startup Rotterdam" fill className="object-cover" sizes="(max-width: 640px) 100vw, 60vw" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[11px] font-bold text-[var(--navy)]">
                  Startup Rotterdam 2026
                </span>
              </div>
            </div>
            <div className="sm:col-span-2 relative aspect-[3/4] sm:aspect-auto sm:min-h-[420px] rounded-2xl overflow-hidden">
              <Image src="/speaking-interview.png" alt="Samba Jarju en Mariama Sesay tijdens een TV-interview over PayWatch" fill className="object-cover object-top" sizes="(max-width: 640px) 100vw, 40vw" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[11px] font-bold text-[var(--navy)]">
                  {isNl ? "Interview Hogeschool Rotterdam" : "Interview Rotterdam University"}
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Topics ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-12 sm:pb-20">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[var(--blue)]/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--navy)]">
              {isNl ? "Waar ik over praat" : "What I talk about"}
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid gap-3 sm:grid-cols-2">
          {TOPICS.map((topic, i) => (
            <TopicCard key={topic.id} topic={topic} lang={lang} index={i} />
          ))}
        </div>
      </section>

      {/* ── Formats ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-12 sm:pb-20">
        <ScrollReveal>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--navy)] mb-6">
            {isNl ? "Beschikbare formats" : "Available formats"}
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {FORMATS[lang].map((f, i) => (
            <ScrollReveal key={f.label} delay={i * 60}>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 text-center hover:border-[var(--blue)]/30 transition-colors">
                <span className="text-3xl block mb-3">{f.icon}</span>
                <p className="text-sm font-bold text-[var(--navy)]">{f.label}</p>
                <p className="text-[11px] text-[var(--muted)] mt-1">{f.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Doelgroepen ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-12 sm:pb-20">
        <ScrollReveal>
          <div className="rounded-2xl bg-[var(--navy)] text-white p-6 sm:p-10">
            <h2 className="text-xl sm:text-2xl font-extrabold mb-6">
              {isNl ? "Voor wie" : "For whom"}
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {(isNl ? [
                { label: "HBO, WO & MBO", desc: "Opleidingen zoals Social Work, Bedrijfskunde, Rechten, Finance en Informatica. Gastcolleges op maat, afgestemd op het curriculum." },
                { label: "Gemeentes & overheden", desc: "Interne presentaties over schuldenpreventie, digitale hulpmiddelen en hoe technologie het sociaal domein kan ondersteunen." },
                { label: "Events & conferenties", desc: "Startup events, fintech meetups, sociaal domein conferenties. Keynote of paneldiscussie over impact-driven ondernemen." },
              ] : [
                { label: "Universities & colleges", desc: "Programs like Social Work, Business, Law, Finance, and CS. Tailored guest lectures aligned with the curriculum." },
                { label: "Municipalities & government", desc: "Internal presentations on debt prevention, digital tools, and how tech supports the social domain." },
                { label: "Events & conferences", desc: "Startup events, fintech meetups, social domain conferences. Keynote or panel on impact-driven entrepreneurship." },
              ]).map((item, i) => (
                <div key={i} className="rounded-xl bg-white/8 p-4 sm:p-5">
                  <p className="text-sm font-bold text-white mb-2">{item.label}</p>
                  <p className="text-xs text-white/60 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Over Samba ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-12 sm:pb-20">
        <ScrollReveal>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[var(--blue)]/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <h2 className="text-xl font-extrabold text-[var(--navy)]">
                {isNl ? "Over Samba" : "About Samba"}
              </h2>
            </div>
            <div className="max-w-3xl">
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                {isNl
                  ? "Samba Jarju is co-founder en CTO van PayWatch, een Nederlandse fintech startup die huishoudens helpt schulden te voorkomen. Samen met co-founder Mariama Sesay bouwt hij aan een platform dat rekeningen, abonnementen en escalaties bijhoudt met behulp van AI en open banking. PayWatch wordt gebruikt door consumenten, gemeentes en incassobureaus en is gebouwd vanuit Rotterdam."
                  : "Samba Jarju is the co-founder and CTO of PayWatch, a Dutch fintech startup helping households prevent debt. Together with co-founder Mariama Sesay, he builds a platform that tracks bills, subscriptions, and escalations using AI and open banking. PayWatch is used by consumers, municipalities, and collection agencies, built from Rotterdam."}
              </p>
              <p className="text-sm text-[var(--muted)] leading-relaxed mt-3">
                {isNl
                  ? "Samba geeft gastcolleges bij hogescholen en universiteiten, spreekt op startup events en deelt zijn ervaring als jong ondernemer in de fintech. Geen opgepoetst succesverhaal, maar een eerlijk verhaal over bouwen, falen en doorzetten."
                  : "Samba gives guest lectures at universities, speaks at startup events, and shares his experience as a young entrepreneur in fintech. Not a polished success story, but an honest account of building, failing, and persisting."}
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 sm:pb-24">
        <ScrollReveal>
          <div className="rounded-2xl bg-gradient-to-br from-[var(--blue)] to-[#1D4ED8] p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
              {isNl ? "Boek een gastcollege" : "Book a guest lecture"}
            </h2>
            <p className="text-sm sm:text-base text-white/70 max-w-lg mx-auto mb-6">
              {isNl
                ? "Wil je dat ik langskom bij jullie opleiding, organisatie of event? Neem contact op en we plannen het in."
                : "Want me to visit your program, organization, or event? Get in touch and we'll plan it."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[var(--blue)] font-semibold text-sm rounded-lg hover:bg-white/90 transition-colors"
              >
                {isNl ? "Neem contact op" : "Get in touch"}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <a
                href="mailto:samba@paywatch.nl"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold text-sm rounded-lg hover:bg-white/20 transition-colors"
              >
                samba@paywatch.nl
              </a>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
