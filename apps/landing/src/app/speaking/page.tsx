"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useApp } from "@/components/AppProvider";
import ScrollReveal from "@/components/ScrollReveal";

/* ── Topic data ── */
const TOPICS = [
  {
    id: "schulden",
    num: "01",
    title: { nl: "Schuldenpreventie in Nederland", en: "Debt Prevention in the Netherlands" },
    desc: {
      nl: "Hoe belanden 730.000 huishoudens in problematische schulden? Wat zijn de signalen? En hoe kan technologie helpen om het te voorkomen voordat het escaleert? We nemen studenten mee in het complete traject: van eerste herinnering tot deurwaarder.",
      en: "How do 730,000 households end up in problematic debt? What are the warning signs? And how can technology help prevent escalation? We take students through the full journey: from first reminder to bailiff.",
    },
    tags: { nl: ["CBS cijfers", "Escalatiemodel", "WIK wetgeving", "Beslagvrije voet"], en: ["CBS statistics", "Escalation model", "WIK legislation", "Protected income"] },
    duration: "45-60 min",
  },
  {
    id: "ondernemen",
    num: "02",
    title: { nl: "Maatschappelijk betrokken ondernemen", en: "Purpose-Driven Entrepreneurship" },
    desc: {
      nl: "Een startup bouwen die geld verdient en tegelijk een maatschappelijk probleem oplost. Hoe combineer je impact met een businessmodel? We delen de lessen, fouten en keuzes die wij maakten bij het opzetten van PayWatch.",
      en: "Building a startup that makes money while solving a social problem. How do you combine impact with a business model? We share the lessons, mistakes, and choices we made building PayWatch.",
    },
    tags: { nl: ["Impact vs winst", "B2B + social good", "Bootstrappen", "Pitch lessen"], en: ["Impact vs profit", "B2B + social good", "Bootstrapping", "Pitch lessons"] },
    duration: "45-60 min",
  },
  {
    id: "fintech",
    num: "03",
    title: { nl: "Fintech bouwen als starter", en: "Building Fintech as a Starter" },
    desc: {
      nl: "Van idee tot app in de App Store. Hoe bouw je als jong team een fintech product zonder enorm budget? Open banking, AI, PSD2, privacy en de realiteit van regelgeving. Eerlijk verhaal, geen succesverhaal.",
      en: "From idea to App Store. How do you build a fintech product as a young team without a huge budget? Open banking, AI, PSD2, privacy, and the reality of regulation. Honest story, no highlight reel.",
    },
    tags: { nl: ["Open banking", "AI in fintech", "PSD2 / AVG", "App Store launch"], en: ["Open banking", "AI in fintech", "PSD2 / GDPR", "App Store launch"] },
    duration: "45-90 min",
  },
  {
    id: "digitaal",
    num: "04",
    title: { nl: "Digitale geletterdheid en financieel bewustzijn", en: "Digital Literacy & Financial Awareness" },
    desc: {
      nl: "Jongeren groeien op met BNPL, crypto en subscriptions maar leren niet hoe een aanmaning werkt. Hoe zorgen we dat de volgende generatie financieel weerbaar is? Een interactieve sessie over wat scholen zouden moeten onderwijzen.",
      en: "Young people grow up with BNPL, crypto, and subscriptions but never learn how a payment reminder works. How do we ensure the next generation is financially resilient?",
    },
    tags: { nl: ["BNPL risico's", "Gen Z & geld", "Financiele educatie", "Interactief"], en: ["BNPL risks", "Gen Z & money", "Financial education", "Interactive"] },
    duration: "30-45 min",
  },
];

const FORMATS = {
  nl: [
    { label: "Gastcollege", desc: "45-90 min, HBO / WO / MBO", color: "#2563EB" },
    { label: "Keynote", desc: "15-30 min, events & conferenties", color: "#059669" },
    { label: "Paneldiscussie", desc: "Moderator of panellid", color: "#D97706" },
    { label: "Workshop", desc: "2-3 uur, hands-on", color: "#8B5CF6" },
  ],
  en: [
    { label: "Guest Lecture", desc: "45-90 min, universities", color: "#2563EB" },
    { label: "Keynote", desc: "15-30 min, events & conferences", color: "#059669" },
    { label: "Panel Discussion", desc: "Moderator or panelist", color: "#D97706" },
    { label: "Workshop", desc: "2-3 hours, hands-on", color: "#8B5CF6" },
  ],
};

const FAQ_ITEMS = {
  nl: [
    { q: "Wat kost een gastcollege?", a: "Afhankelijk van het type, de duur en de locatie. Voor onderwijsinstellingen met een maatschappelijke missie zijn we flexibel. Neem contact op voor een voorstel." },
    { q: "Kunnen jullie ook een workshop geven?", a: "Ja. We geven workshops van 2-3 uur waarin studenten hands-on werken met financiele scenario's en de PayWatch tools." },
    { q: "Is het geschikt voor MBO?", a: "Ja. We passen de inhoud aan op het niveau en de opleiding. Van MBO Sociaal Werk tot WO Rechten." },
    { q: "Spreken jullie ook Engels?", a: "Ja. Beide talen, afhankelijk van de doelgroep." },
    { q: "Wat hebben jullie nodig qua techniek?", a: "Een beamer met HDMI-aansluiting en geluid. Verder regelen we alles zelf." },
  ],
  en: [
    { q: "What does a guest lecture cost?", a: "Depends on the type, duration, and location. For educational institutions with a social mission, we're flexible. Get in touch for a proposal." },
    { q: "Can you give a workshop?", a: "Yes. We run 2-3 hour workshops where students work hands-on with financial scenarios and PayWatch tools." },
    { q: "Is it suitable for vocational education?", a: "Yes. We adapt the content to the level and program." },
    { q: "Do you speak English?", a: "Yes. Both languages, depending on the audience." },
    { q: "What technical setup do you need?", a: "A projector with HDMI connection and sound output. We handle the rest." },
  ],
};

/* ── Topic card ── */
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
            <div className="flex items-start gap-4">
              <span className="text-3xl font-black text-[var(--navy)]/8 leading-none select-none">{topic.num}</span>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--navy)] leading-tight">{topic.title[lang]}</h3>
                {!open && <p className="text-xs text-[var(--muted)] mt-1">{topic.duration}</p>}
              </div>
            </div>
            <svg
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--muted)"
              strokeWidth="2" className={`shrink-0 mt-1 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>

          <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
            <p className="text-sm text-[var(--muted)] leading-relaxed">{topic.desc[lang]}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {topic.tags[lang].map((tag) => (
                <span key={tag} className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[var(--blue)]/8 text-[var(--blue)]">
                  {tag}
                </span>
              ))}
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[var(--navy)]/8 text-[var(--navy)]">
                {topic.duration}
              </span>
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

/* ── FAQ item ── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)} className="cursor-pointer border-b border-[var(--border)] last:border-0">
      <div className="flex items-center justify-between py-4 gap-4">
        <p className="text-sm font-semibold text-[var(--navy)]">{q}</p>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2"
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}><path d="M6 9l6 6 6-6" /></svg>
      </div>
      <div className={`overflow-hidden transition-all duration-200 ${open ? "max-h-40 opacity-100 pb-4" : "max-h-0 opacity-0"}`}>
        <p className="text-sm text-[var(--muted)] leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function SpeakingPage() {
  const { lang } = useApp();
  const isNl = lang === "nl";
  const [form, setForm] = useState({ name: "", email: "", organization: "", role: "", type: "", topic: "", audience: "", date_preference: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [formTimestamp] = useState(Date.now());
  const formRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.organization) return;
    setFormStatus("sending");
    try {
      const res = await fetch("/api/speaking-request", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, _t: formTimestamp, website: "" }),
      });
      setFormStatus(res.ok ? "sent" : "error");
    } catch { setFormStatus("error"); }
  };
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="bg-[var(--bg)] overflow-x-hidden bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">

      {/* ── Hero ── */}
      <section className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-12 sm:pt-20 pb-6">
        <ScrollReveal>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--blue)] mb-4">
            {isNl ? "Gastcolleges & spreekbeurten" : "Guest lectures & speaking"}
          </p>
        </ScrollReveal>
        <ScrollReveal delay={60}>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[var(--navy)] tracking-tight leading-[1.08] max-w-3xl">
            {isNl ? (
              <>Wij praten over schulden,<br className="hidden sm:block" /> ondernemen en waarom<br className="hidden sm:block" /> het anders moet.</>
            ) : (
              <>We talk about debt,<br className="hidden sm:block" /> entrepreneurship and why<br className="hidden sm:block" /> things need to change.</>
            )}
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={120}>
          <p className="text-base sm:text-lg text-[var(--muted)] mt-5 max-w-2xl leading-relaxed">
            {isNl
              ? "Wij zijn Samba Jarju en Mariama Sesay, co-founders van PayWatch. We geven samen gastcolleges bij hogescholen, universiteiten en events over schuldenpreventie, maatschappelijk ondernemen en de toekomst van fintech in Nederland."
              : "We are Samba Jarju and Mariama Sesay, co-founders of PayWatch. Together we give guest lectures at universities and events about debt prevention, social entrepreneurship, and the future of fintech in the Netherlands."}
          </p>
          <button
            onClick={scrollToForm}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[var(--blue)] text-white font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity"
          >
            {isNl ? "Boek een gastcollege" : "Book a guest lecture"}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </ScrollReveal>
      </section>

      {/* ── Spoken at strip ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-8">
        <ScrollReveal>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted)]">
              {isNl ? "Gesproken bij" : "Spoken at"}
            </span>
            {["Startup Rotterdam", "Hogeschool Rotterdam"].map(v => (
              <span key={v} className="text-sm font-semibold text-[var(--navy)]/60">{v}</span>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── Photo grid ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-12 sm:pb-16">
        <ScrollReveal>
          <div className="grid sm:grid-cols-5 gap-4">
            <div className="sm:col-span-3 relative aspect-[4/3] sm:aspect-auto sm:min-h-[420px] rounded-2xl overflow-hidden group">
              <Image src="/speaking-stage.png" alt="Samba Jarju presenteert PayWatch op het podium bij Startup Rotterdam" fill className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" sizes="(max-width: 640px) 100vw, 60vw" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[11px] font-bold text-[var(--navy)]">
                  Startup Rotterdam 2026
                </span>
              </div>
            </div>
            <div className="sm:col-span-2 relative aspect-[3/4] sm:aspect-auto sm:min-h-[420px] rounded-2xl overflow-hidden group">
              <Image src="/speaking-interview.png" alt="Samba Jarju en Mariama Sesay tijdens een interview over PayWatch" fill className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]" sizes="(max-width: 640px) 100vw, 40vw" priority />
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
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-12 sm:pb-16">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--navy)]">
              {isNl ? "Waar wij over praten" : "What we talk about"}
            </h2>
            <button onClick={scrollToForm} className="text-xs font-semibold text-[var(--blue)] hover:underline hidden sm:block">
              {isNl ? "Boek direct \u2192" : "Book now \u2192"}
            </button>
          </div>
        </ScrollReveal>
        <div className="grid gap-3 sm:grid-cols-2">
          {TOPICS.map((topic, i) => (
            <TopicCard key={topic.id} topic={topic} lang={lang} index={i} />
          ))}
        </div>
      </section>

      {/* ── Pull quote ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-12 sm:pb-20">
        <ScrollReveal>
          <div className="text-center py-8 sm:py-12">
            <p className="text-xl sm:text-3xl font-extrabold text-[var(--navy)] leading-snug max-w-2xl mx-auto">
              {isNl
                ? "\u201CDe meeste mensen komen niet in de schulden door een grote fout, maar door tien kleine betalingen die uit beeld raken.\u201D"
                : "\u201CMost people don\u2019t get into debt through one big mistake, but through ten small payments that slip out of sight.\u201D"}
            </p>
            <p className="text-sm text-[var(--muted)] mt-4 font-medium">Samba Jarju</p>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Formats (horizontal scroll on mobile) ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-12 sm:pb-16">
        <ScrollReveal>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--navy)] mb-6">
            {isNl ? "Beschikbare formats" : "Available formats"}
          </h2>
        </ScrollReveal>
        <div className="flex sm:grid sm:grid-cols-4 gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible">
          {FORMATS[lang].map((f, i) => (
            <ScrollReveal key={f.label} delay={i * 60}>
              <button onClick={() => { setForm(prev => ({ ...prev, type: ["gastcollege","keynote","panel","workshop"][i] })); scrollToForm(); }}
                className="snap-start shrink-0 w-[160px] sm:w-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 text-center hover:border-[var(--blue)]/30 transition-all group cursor-pointer">
                <div className="w-8 h-8 rounded-lg mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: f.color + "12" }}>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: f.color }} />
                </div>
                <p className="text-sm font-bold text-[var(--navy)]">{f.label}</p>
                <p className="text-[11px] text-[var(--muted)] mt-1">{f.desc}</p>
                <p className="text-[10px] font-semibold text-[var(--blue)] mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {isNl ? "Selecteer \u2192" : "Select \u2192"}
                </p>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Doelgroepen ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-12 sm:pb-16">
        <ScrollReveal>
          <div className="rounded-2xl bg-[var(--navy)] text-white p-6 sm:p-10">
            <h2 className="text-xl sm:text-2xl font-extrabold mb-6">{isNl ? "Voor wie" : "For whom"}</h2>
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

      {/* ── Over ons ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-12 sm:pb-16">
        <ScrollReveal>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[var(--blue)]/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <h2 className="text-xl font-extrabold text-[var(--navy)]">
                {isNl ? "Over Samba & Mariama" : "About Samba & Mariama"}
              </h2>
            </div>
            <div className="max-w-3xl">
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                {isNl
                  ? "Wij zijn Samba Jarju (CTO) en Mariama Sesay (CMO), de co-founders van PayWatch. We bouwen aan een platform dat huishoudens helpt schulden te voorkomen door rekeningen, abonnementen en escalaties bij te houden met AI en open banking. PayWatch wordt gebruikt door consumenten, gemeentes en incassobureaus en we bouwen het vanuit Rotterdam."
                  : "We are Samba Jarju (CTO) and Mariama Sesay (CMO), the co-founders of PayWatch. We build a platform that helps households prevent debt by tracking bills, subscriptions, and escalations using AI and open banking. PayWatch is used by consumers, municipalities, and collection agencies, and we build it from Rotterdam."}
              </p>
              <p className="text-sm text-[var(--muted)] leading-relaxed mt-3">
                {isNl
                  ? "We geven gastcolleges bij hogescholen en universiteiten, spreken op startup events en delen onze ervaring als jonge ondernemers in de fintech. Geen opgepoetst succesverhaal, maar een eerlijk verhaal over bouwen, falen en doorzetten."
                  : "We give guest lectures at universities, speak at startup events, and share our experience as young entrepreneurs in fintech. Not a polished success story, but an honest account of building, failing, and persisting."}
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── FAQ ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-12 sm:pb-16">
        <ScrollReveal>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
            <h2 className="text-lg font-extrabold text-[var(--navy)] mb-4">
              {isNl ? "Veelgestelde vragen" : "FAQ"}
            </h2>
            {FAQ_ITEMS[lang].map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── Booking Form ── */}
      <section id="boek" ref={formRef} className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 sm:pb-24 scroll-mt-8">
        <ScrollReveal>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <div className="bg-[var(--navy)] px-6 sm:px-8 py-5">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                {isNl ? "Boek een gastcollege" : "Book a guest lecture"}
              </h2>
              <p className="text-sm text-white/50 mt-1">
                {isNl ? "Vul het formulier in en we nemen binnen 2 werkdagen contact op." : "Fill out the form and we'll get back to you within 2 business days."}
              </p>
            </div>

            <div className="p-6 sm:p-8">
              {formStatus === "sent" ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <h3 className="text-lg font-bold text-[var(--navy)]">{isNl ? "Aanvraag ontvangen!" : "Request received!"}</h3>
                  <p className="text-sm text-[var(--muted)] mt-2">{isNl ? "We nemen zo snel mogelijk contact op." : "We'll be in touch shortly."}</p>
                </div>
              ) : (
                <>
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, width: 0 }} />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--navy)] mb-1">{isNl ? "Naam" : "Name"} <span className="text-red-400">*</span></label>
                      <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--blue)] transition-colors" placeholder={isNl ? "Jan de Vries" : "Jane Smith"} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--navy)] mb-1">{isNl ? "E-mailadres" : "Email"} <span className="text-red-400">*</span></label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--blue)] transition-colors" placeholder="jan@hogeschool.nl" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--navy)] mb-1">{isNl ? "Organisatie" : "Organization"} <span className="text-red-400">*</span></label>
                      <input type="text" name="organization" value={form.organization} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--blue)] transition-colors" placeholder={isNl ? "Hogeschool Rotterdam" : "Rotterdam University"} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--navy)] mb-1">{isNl ? "Functie" : "Role"}</label>
                      <input type="text" name="role" value={form.role} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--blue)] transition-colors" placeholder={isNl ? "Docent / Coordinator" : "Lecturer / Coordinator"} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--navy)] mb-1">{isNl ? "Type" : "Format"}</label>
                      <select name="type" value={form.type} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--blue)] transition-colors">
                        <option value="">{isNl ? "Kies een format" : "Choose a format"}</option>
                        <option value="gastcollege">{isNl ? "Gastcollege (45-90 min)" : "Guest Lecture (45-90 min)"}</option>
                        <option value="keynote">Keynote (15-30 min)</option>
                        <option value="panel">{isNl ? "Paneldiscussie" : "Panel Discussion"}</option>
                        <option value="workshop">Workshop (2-3 {isNl ? "uur" : "hours"})</option>
                        <option value="anders">{isNl ? "Anders" : "Other"}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--navy)] mb-1">{isNl ? "Voorkeur onderwerp" : "Preferred topic"}</label>
                      <select name="topic" value={form.topic} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--blue)] transition-colors">
                        <option value="">{isNl ? "Kies een onderwerp" : "Choose a topic"}</option>
                        <option value="schulden">{isNl ? "Schuldenpreventie" : "Debt Prevention"}</option>
                        <option value="ondernemen">{isNl ? "Maatschappelijk ondernemen" : "Social Entrepreneurship"}</option>
                        <option value="fintech">{isNl ? "Fintech bouwen" : "Building Fintech"}</option>
                        <option value="digitaal">{isNl ? "Digitale geletterdheid" : "Digital Literacy"}</option>
                        <option value="combinatie">{isNl ? "Combinatie / op maat" : "Combination / custom"}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--navy)] mb-1">{isNl ? "Doelgroep" : "Audience"}</label>
                      <input type="text" name="audience" value={form.audience} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--blue)] transition-colors" placeholder={isNl ? "Bijv. 2e jaars HBO Social Work" : "E.g. 2nd year Social Work students"} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--navy)] mb-1">{isNl ? "Gewenste datum" : "Preferred date"}</label>
                      <input type="text" name="date_preference" value={form.date_preference} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--blue)] transition-colors" placeholder={isNl ? "Bijv. september 2026" : "E.g. September 2026"} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-xs font-semibold text-[var(--navy)] mb-1">{isNl ? "Toelichting" : "Additional info"}</label>
                    <textarea name="message" rows={3} value={form.message} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--blue)] transition-colors resize-none" placeholder={isNl ? "Vertel ons meer over wat je zoekt..." : "Tell us more..."} />
                  </div>
                  {formStatus === "error" && <p className="text-sm text-red-500 mt-2">{isNl ? "Er ging iets mis. Probeer het opnieuw." : "Something went wrong. Please try again."}</p>}
                  <button onClick={handleSubmit} disabled={formStatus === "sending" || !form.name || !form.email || !form.organization}
                    className="mt-4 w-full sm:w-auto px-8 py-3 bg-[var(--blue)] text-white font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
                    {formStatus === "sending" ? (isNl ? "Versturen..." : "Sending...") : (isNl ? "Aanvraag versturen" : "Submit request")}
                  </button>
                </>
              )}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Sticky mobile CTA ── */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-[var(--surface)] border-t border-[var(--border)] px-4 py-3 safe-bottom">
        <button onClick={scrollToForm} className="w-full py-3 bg-[var(--blue)] text-white font-semibold text-sm rounded-lg">
          {isNl ? "Boek een gastcollege" : "Book a guest lecture"}
        </button>
      </div>
    </div>
  );
}
