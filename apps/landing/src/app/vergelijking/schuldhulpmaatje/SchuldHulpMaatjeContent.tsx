"use client";

import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import ScrollReveal from "@/components/ScrollReveal";

const L = {
  nl: {
    breadHome: "Home",
    breadComp: "Vergelijking",
    badge: "Samenwerking",
    heroTitle: "SchuldHulpMaatje en PayWatch",
    heroSub: "Twee organisaties, één doel: voorkomen dat geldproblemen uit de hand lopen. SchuldHulpMaatje biedt persoonlijke begeleiding bij schulden. PayWatch vangt signalen eerder op. Samen dekken ze het hele traject.",
    whatIsTitle: "Wat is SchuldHulpMaatje?",
    whatIs: "SchuldHulpMaatje is een landelijke vrijwilligersorganisatie met ANBI-status. Ze koppelen mensen met geldzorgen aan een getrainde vrijwilliger die gratis meeloopt. Geen oordeel, wel een luisterend oor en concrete hulp. De vrijwilligers volgen een opleiding gebaseerd op Nibud-content en zijn actief in meer dan 138 gemeenten door heel Nederland. In 2023 kreeg SchuldHulpMaatje bijna 11.000 hulpvragen. Bij 61% van die mensen was de gemeente nog niet in beeld. Dat betekent dat SchuldHulpMaatje vaak het eerste vangnet is voor mensen die anders geen hulp zouden zoeken.",
    statsTitle: "SchuldHulpMaatje in cijfers",
    stats: [
      { value: "11.000+", label: "hulpvragen per jaar" },
      { value: "2.000+", label: "getrainde vrijwilligers" },
      { value: "138", label: "gemeenten actief" },
      { value: "61%", label: "niet eerder in beeld bij gemeente" },
    ],
    timelineTitle: "Waar past welke hulp?",
    timelineSub: "Geldproblemen beginnen klein. Een vergeten rekening, een onverwachte naheffing. Niet iedereen heeft meteen schulden. Maar zonder actie loopt het op. Zo ziet het traject eruit:",
    timeline: [
      {
        phase: "Fase 1: Rekeningen binnenkomen",
        who: "PayWatch",
        color: "#2563EB",
        desc: "Je inbox wordt gescand op facturen. Bedragen, deadlines en afzenders worden automatisch herkend. Je ziet in één overzicht wat er betaald moet worden.",
      },
      {
        phase: "Fase 2: Deadlines naderen",
        who: "PayWatch",
        color: "#2563EB",
        desc: "Je krijgt een herinnering voordat de betaaltermijn verloopt. Geen verrassing, geen herinnering van de schuldeiser, geen extra kosten.",
      },
      {
        phase: "Fase 3: Betalingsachterstand dreigt",
        who: "PayWatch + SchuldHulpMaatje",
        color: "#D97706",
        desc: "PayWatch detecteert dat een rekening escaleert. De app helpt je een brief te schrijven of schuldhulp te vinden. Dit is ook het moment waarop een SchuldHulpMaatje kan helpen met een plan.",
      },
      {
        phase: "Fase 4: Schulden bestaan",
        who: "SchuldHulpMaatje",
        color: "#059669",
        desc: "Een vrijwilliger helpt je overzicht te krijgen, schuldeisers te benaderen en een afbetalingsplan te maken. Persoonlijk, gratis en zonder oordeel.",
      },
      {
        phase: "Fase 5: Traject bij de gemeente",
        who: "SchuldHulpMaatje + gemeente",
        color: "#059669",
        desc: "Als het nodig is, begeleidt je maatje je naar de gemeentelijke schuldhulpverlening. Je hoeft die stap niet alleen te zetten.",
      },
    ],
    gapTitle: "Het gat tussen weten en doen",
    gapText: "De meeste mensen weten wel dat ze rekeningen moeten betalen. Het probleem is niet onwetendheid. Het probleem is overzicht verliezen. Een brief die onderop de stapel belandt. Een e-mail die je over het hoofd ziet. Een betaaltermijn die net te laat opvalt. Daar zit het gat. Budget apps laten je zien wat je uitgeeft. SchuldHulpMaatje helpt als het al misgegaan is. Maar wie helpt je in dat stukje ertussen? Dat is waar PayWatch zit.",
    complementTitle: "Hoe vullen ze elkaar aan?",
    complements: [
      {
        pw: "Scant je inbox automatisch op rekeningen",
        shm: "Helpt je handmatig overzicht maken bij schulden",
      },
      {
        pw: "Waarschuwt voordat een deadline verloopt",
        shm: "Helpt nadat betalingsachterstanden zijn ontstaan",
      },
      {
        pw: "Genereert brieven met AI voor schuldeisers",
        shm: "Maatje belt samen met jou naar schuldeisers",
      },
      {
        pw: "Vindt schuldhulp in jouw gemeente",
        shm: "Begeleidt je naar de juiste hulpinstantie",
      },
      {
        pw: "24/7 beschikbaar als app op je telefoon",
        shm: "Persoonlijk contact met een echt mens",
      },
    ],
    forWhoTitle: "Voor wie is wat?",
    forPw: "Kies PayWatch als",
    forPwItems: [
      "Je wilt voorkomen dat rekeningen uit de hand lopen",
      "Je overzicht mist in wat je moet betalen en wanneer",
      "Je liever zelf de regie houdt met hulp van technologie",
      "Je een buddy wilt die meekijkt via de app",
    ],
    forShm: "Kies SchuldHulpMaatje als",
    forShmItems: [
      "Je al schulden hebt en niet weet waar je moet beginnen",
      "Je behoefte hebt aan persoonlijk contact met iemand die meedenkt",
      "Je hulp nodig hebt bij het benaderen van schuldeisers",
      "Je de stap naar de gemeente niet alleen durft te zetten",
    ],
    forBoth: "Gebruik beide als",
    forBothItems: [
      "Je naast persoonlijke begeleiding ook technologie wilt voor overzicht",
      "Je een maatje hebt maar ook grip wilt op nieuwe rekeningen",
      "Je een professional bent die clienten wilt ondersteunen met een app",
    ],
    faqTitle: "Veelgestelde vragen",
    faqs: [
      {
        q: "Wat is SchuldHulpMaatje?",
        a: "SchuldHulpMaatje is een landelijke vrijwilligersorganisatie die mensen met geldzorgen gratis koppelt aan een getrainde vrijwilliger. Samen werken ze aan het oplossen van schulden en het op orde brengen van de financiele situatie.",
      },
      {
        q: "Is SchuldHulpMaatje gratis?",
        a: "Ja, volledig gratis. De vrijwilligers worden getraind en begeleid door de organisatie. Je hoeft niets te betalen voor de hulp.",
      },
      {
        q: "Kan ik SchuldHulpMaatje en PayWatch tegelijk gebruiken?",
        a: "Ja. PayWatch geeft je overzicht in je rekeningen en deadlines. SchuldHulpMaatje biedt persoonlijke begeleiding. Samen heb je zowel de technologie als de menselijke ondersteuning.",
      },
      {
        q: "Hoe verschilt PayWatch van SchuldHulpMaatje?",
        a: "SchuldHulpMaatje helpt wanneer schulden al bestaan, met persoonlijke begeleiding. PayWatch werkt eerder in het proces: het scant je inbox op rekeningen en waarschuwt voordat een factuur escaleert naar een aanmaning of incasso.",
      },
    ],
    ctaTitle: "Grip krijgen op je rekeningen?",
    ctaSub: "Begin met overzicht. PayWatch scant je inbox en laat je zien welke rekeningen aandacht nodig hebben. Gratis, in twee minuten.",
    ctaPrimary: "Start gratis met PayWatch",
    ctaSecondary: "Of bezoek SchuldHulpMaatje",
    moreTitle: "Meer vergelijkingen",
  },
  en: {
    breadHome: "Home",
    breadComp: "Comparison",
    badge: "Collaboration",
    heroTitle: "SchuldHulpMaatje and PayWatch",
    heroSub: "Two organizations, one goal: preventing money problems from getting out of hand. SchuldHulpMaatje offers personal guidance for debts. PayWatch catches signals earlier. Together they cover the entire journey.",
    whatIsTitle: "What is SchuldHulpMaatje?",
    whatIs: "SchuldHulpMaatje is a national volunteer organization with ANBI status in the Netherlands. They connect people with money worries to a trained volunteer who walks alongside them for free. No judgment, just a listening ear and practical help. The volunteers complete training based on Nibud content and are active in over 138 municipalities across the Netherlands. In 2023, SchuldHulpMaatje received nearly 11,000 requests for help. For 61% of those people, the municipality was not yet involved. That means SchuldHulpMaatje is often the first safety net for people who would otherwise not seek help.",
    statsTitle: "SchuldHulpMaatje in numbers",
    stats: [
      { value: "11,000+", label: "help requests per year" },
      { value: "2,000+", label: "trained volunteers" },
      { value: "138", label: "municipalities active" },
      { value: "61%", label: "not previously known to municipality" },
    ],
    timelineTitle: "Where does each type of help fit?",
    timelineSub: "Money problems start small. A forgotten bill, an unexpected assessment. Not everyone has debts right away. But without action, things escalate. This is what the journey looks like:",
    timeline: [
      { phase: "Phase 1: Bills arrive", who: "PayWatch", color: "#2563EB", desc: "Your inbox is scanned for invoices. Amounts, deadlines and senders are automatically recognized. You see everything that needs to be paid in one overview." },
      { phase: "Phase 2: Deadlines approach", who: "PayWatch", color: "#2563EB", desc: "You get a reminder before the payment deadline expires. No surprise, no reminder from the creditor, no extra costs." },
      { phase: "Phase 3: Payment arrears threaten", who: "PayWatch + SchuldHulpMaatje", color: "#D97706", desc: "PayWatch detects that a bill is escalating. The app helps you write a letter or find debt support. This is also the moment when a SchuldHulpMaatje can help with a plan." },
      { phase: "Phase 4: Debts exist", who: "SchuldHulpMaatje", color: "#059669", desc: "A volunteer helps you get an overview, approach creditors and create a repayment plan. Personal, free and without judgment." },
      { phase: "Phase 5: Municipal trajectory", who: "SchuldHulpMaatje + municipality", color: "#059669", desc: "If needed, your buddy guides you to municipal debt support. You don't have to take that step alone." },
    ],
    gapTitle: "The gap between knowing and doing",
    gapText: "Most people know they need to pay their bills. The problem is not ignorance. The problem is losing oversight. A letter that ends up at the bottom of the pile. An email you overlook. A payment deadline you notice just too late. That's where the gap is. Budget apps show you what you spend. SchuldHulpMaatje helps when things have already gone wrong. But who helps you in that space in between? That's where PayWatch sits.",
    complementTitle: "How do they complement each other?",
    complements: [
      { pw: "Automatically scans your inbox for bills", shm: "Helps you manually create an overview of debts" },
      { pw: "Warns before a deadline expires", shm: "Helps after payment arrears have arisen" },
      { pw: "Generates letters with AI for creditors", shm: "Buddy calls creditors together with you" },
      { pw: "Finds debt support in your municipality", shm: "Guides you to the right support organization" },
      { pw: "Available 24/7 as an app on your phone", shm: "Personal contact with a real person" },
    ],
    forWhoTitle: "Who is each for?",
    forPw: "Choose PayWatch if",
    forPwItems: [
      "You want to prevent bills from getting out of hand",
      "You lack oversight of what you need to pay and when",
      "You prefer to stay in control with help from technology",
      "You want a buddy who monitors via the app",
    ],
    forShm: "Choose SchuldHulpMaatje if",
    forShmItems: [
      "You already have debts and don't know where to start",
      "You need personal contact with someone who thinks along",
      "You need help approaching creditors",
      "You don't dare take the step to the municipality alone",
    ],
    forBoth: "Use both if",
    forBothItems: [
      "You want technology for oversight alongside personal guidance",
      "You have a buddy but also want grip on new incoming bills",
      "You're a professional who wants to support clients with an app",
    ],
    faqTitle: "Frequently asked questions",
    faqs: [
      { q: "What is SchuldHulpMaatje?", a: "SchuldHulpMaatje is a national volunteer organization that connects people with money worries to a trained volunteer for free. Together they work on resolving debts and organizing the financial situation." },
      { q: "Is SchuldHulpMaatje free?", a: "Yes, completely free. The volunteers are trained and guided by the organization. You don't have to pay anything for the help." },
      { q: "Can I use SchuldHulpMaatje and PayWatch at the same time?", a: "Yes. PayWatch gives you oversight of your bills and deadlines. SchuldHulpMaatje offers personal guidance. Together you have both the technology and the human support you need." },
      { q: "How does PayWatch differ from SchuldHulpMaatje?", a: "SchuldHulpMaatje helps when debts already exist, with personal guidance. PayWatch works earlier in the process: it scans your inbox for bills and warns you before an invoice escalates." },
    ],
    ctaTitle: "Want to get a grip on your bills?",
    ctaSub: "Start with oversight. PayWatch scans your inbox and shows you which bills need attention. Free, in two minutes.",
    ctaPrimary: "Start free with PayWatch",
    ctaSecondary: "Or visit SchuldHulpMaatje",
    moreTitle: "More comparisons",
  },
};

export default function SchuldHulpMaatjeContent() {
  const { lang } = useApp();
  const t = L[lang];

  return (
    <div className="bg-[var(--bg)]">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-4xl px-4 pt-6 sm:px-6">
        <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
          <Link href="/" className="hover:text-[var(--blue)] transition-colors">{t.breadHome}</Link>
          <span>/</span>
          <Link href="/vergelijking" className="hover:text-[var(--blue)] transition-colors">{t.breadComp}</Link>
          <span>/</span>
          <span className="text-[var(--text)] font-medium">SchuldHulpMaatje</span>
        </div>
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 pt-6 pb-10 sm:px-6 sm:pt-10 sm:pb-14">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
            {t.badge}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--navy)] tracking-tight leading-tight mb-4">
            {t.heroTitle}
          </h1>
          <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed max-w-2xl">
            {t.heroSub}
          </p>
        </ScrollReveal>
      </section>

      {/* What is SchuldHulpMaatje */}
      <section className="mx-auto max-w-4xl px-4 pb-12 sm:px-6">
        <ScrollReveal>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border)] bg-[var(--bg)]">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-base font-extrabold text-emerald-700 dark:text-emerald-400 shrink-0">S</div>
              <div>
                <h2 className="text-lg font-bold text-[var(--navy)]">{t.whatIsTitle}</h2>
                <p className="text-xs text-[var(--muted)]">schuldhulpmaatje.nl · ANBI · 138 gemeenten</p>
              </div>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-[var(--text)] leading-relaxed">{t.whatIs}</p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-4xl px-4 pb-12 sm:px-6">
        <ScrollReveal>
          <h2 className="text-xl font-bold text-[var(--navy)] mb-4">{t.statsTitle}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {t.stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
                <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{s.value}</p>
                <p className="text-xs text-[var(--muted)] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* The gap */}
      <section className="mx-auto max-w-4xl px-4 pb-12 sm:px-6">
        <ScrollReveal>
          <div className="rounded-2xl bg-[var(--navy)] p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-3">{t.gapTitle}</h2>
            <p className="text-sm text-white/70 leading-relaxed">{t.gapText}</p>
          </div>
        </ScrollReveal>
      </section>

      {/* Timeline: where does each fit? */}
      <section className="mx-auto max-w-4xl px-4 pb-12 sm:px-6">
        <ScrollReveal>
          <h2 className="text-2xl font-bold text-[var(--navy)] mb-2">{t.timelineTitle}</h2>
          <p className="text-sm text-[var(--muted)] mb-8">{t.timelineSub}</p>
        </ScrollReveal>

        <div className="space-y-0">
          {t.timeline.map((step, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div className="flex gap-4 pb-6">
                {/* Vertical line + dot */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-4 h-4 rounded-full border-2 shrink-0" style={{ borderColor: step.color, background: `${step.color}22` }} />
                  {i < t.timeline.length - 1 && (
                    <div className="w-0.5 flex-1 min-h-[40px]" style={{ background: `${step.color}33` }} />
                  )}
                </div>
                {/* Content */}
                <div className="pb-2">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: step.color }}>{step.who}</p>
                  <h3 className="text-base font-bold text-[var(--text)] mb-1.5">{step.phase}</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* How they complement each other */}
      <section className="mx-auto max-w-4xl px-4 pb-12 sm:px-6">
        <ScrollReveal>
          <h2 className="text-2xl font-bold text-[var(--navy)] mb-6">{t.complementTitle}</h2>
        </ScrollReveal>
        <div className="space-y-3">
          {t.complements.map((c, i) => (
            <ScrollReveal key={i} delay={i * 60}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
                <div className="px-5 py-4 border-b sm:border-b-0 sm:border-r border-[var(--border)]">
                  <p className="text-[10px] font-semibold text-[var(--blue)] uppercase tracking-wider mb-1">PayWatch</p>
                  <p className="text-sm text-[var(--text)]">{c.pw}</p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">SchuldHulpMaatje</p>
                  <p className="text-sm text-[var(--text)]">{c.shm}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* For who */}
      <section className="mx-auto max-w-4xl px-4 pb-12 sm:px-6">
        <ScrollReveal>
          <h2 className="text-2xl font-bold text-[var(--navy)] mb-6">{t.forWhoTitle}</h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ScrollReveal delay={0}>
            <div className="rounded-2xl border border-[var(--blue)] bg-blue-50/50 dark:bg-blue-950/20 p-5 h-full">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <p className="text-sm font-bold text-[var(--text)] mb-3">{t.forPw}</p>
              <ul className="space-y-2">
                {t.forPwItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[var(--muted)]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="3" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <div className="rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 p-5 h-full">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/></svg>
              </div>
              <p className="text-sm font-bold text-[var(--text)] mb-3">{t.forShm}</p>
              <ul className="space-y-2">
                {t.forShmItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[var(--muted)]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <div className="rounded-2xl border-2 border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/20 p-5 h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-bl-lg uppercase tracking-wider">Tip</div>
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <p className="text-sm font-bold text-[var(--text)] mb-3">{t.forBoth}</p>
              <ul className="space-y-2">
                {t.forBothItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[var(--muted)]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="3" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 pb-12 sm:px-6">
        <ScrollReveal>
          <h2 className="text-2xl font-bold text-[var(--navy)] mb-6">{t.faqTitle}</h2>
          <div className="space-y-3">
            {t.faqs.map((faq, i) => (
              <details key={i} className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-semibold text-[var(--text)] hover:bg-[var(--bg)] transition-colors">
                  {faq.q}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" className="shrink-0 transition-transform group-open:rotate-180"><path d="M6 9l6 6 6-6"/></svg>
                </summary>
                <div className="px-5 pb-4 text-sm text-[var(--muted)] leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <ScrollReveal>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--navy)] mb-3">{t.ctaTitle}</h2>
            <p className="text-sm text-[var(--muted)] mb-6 max-w-md mx-auto">{t.ctaSub}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="https://app.paywatch.app" className="inline-flex items-center gap-2 rounded-xl bg-[var(--blue)] text-white px-6 py-3.5 text-sm font-semibold shadow-[0_6px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_8px_28px_rgba(37,99,235,0.4)] transition-all active:scale-[0.97]">
                {t.ctaPrimary}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
              <a href="https://schuldhulpmaatje.nl" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-6 py-3.5 text-sm font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors">
                {t.ctaSecondary}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* More comparisons */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <ScrollReveal>
          <h3 className="text-lg font-bold text-[var(--navy)] mb-4">{t.moreTitle}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { href: "/vergelijking/dyme-alternatief", name: "Dyme", sub: lang === "nl" ? "Abonnementen en besparen" : "Subscriptions and savings" },
              { href: "/vergelijking/fikks-alternatief", name: "fiKks", sub: lang === "nl" ? "Buddy-hulp bij schulden" : "Buddy help with debts" },
              { href: "/vergelijking/grassfeld-alternatief", name: "Grassfeld", sub: lang === "nl" ? "Budget en huishoudboekje" : "Budget and household book" },
            ].map((c) => (
              <Link key={c.href} href={c.href} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-[var(--blue)] hover:shadow-md transition-all group">
                <p className="text-sm font-bold text-[var(--text)] group-hover:text-[var(--blue)] transition-colors">PayWatch vs {c.name}</p>
                <p className="text-xs text-[var(--muted)] mt-1">{c.sub}</p>
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
