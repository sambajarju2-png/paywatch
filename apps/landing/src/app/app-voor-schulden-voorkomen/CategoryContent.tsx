"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import ScrollReveal from "@/components/ScrollReveal";

const escalation = [
  { nl: "Factuur", en: "Invoice", cost: 120, color: "#059669" },
  { nl: "Herinnering", en: "Reminder", cost: 135, color: "#D97706" },
  { nl: "Aanmaning", en: "Formal notice", cost: 175, color: "#EA580C" },
  { nl: "Incassobureau", en: "Collection agency", cost: 325, color: "#DC2626" },
  { nl: "Deurwaarder", en: "Bailiff", cost: 625, color: "#7F1D1D" },
];

const appCategories = [
  {
    type: { nl: "Budget apps", en: "Budget apps" },
    desc: { nl: "Laten zien waar je geld naartoe gaat. Goed voor overzicht, maar ze monitoren geen rekeningen en waarschuwen niet voor deadlines.", en: "Show where your money goes. Good for overview, but they don't monitor bills or warn about deadlines." },
    apps: ["Dyme", "Grassfeld", "YNAB", "Monefy"],
    prevents: false,
    color: "#6366F1",
  },
  {
    type: { nl: "Coaching en buddy apps", en: "Coaching and buddy apps" },
    desc: { nl: "Koppelen je aan een vrijwilliger of coach. Helpend, maar pas nadat schulden al bestaan.", en: "Connect you with a volunteer or coach. Helpful, but only after debts already exist." },
    apps: ["fiKks", "SchuldHulpMaatje"],
    prevents: false,
    color: "#059669",
  },
  {
    type: { nl: "Schuldpreventie apps", en: "Debt prevention apps" },
    desc: { nl: "Scannen je inbox op rekeningen, herkennen escalatiefasen en waarschuwen voordat het misgaat. Gebouwd om schulden te voorkomen, niet alleen te monitoren.", en: "Scan your inbox for bills, recognize escalation stages and warn before things go wrong. Built to prevent debts, not just monitor them." },
    apps: ["PayWatch"],
    prevents: true,
    color: "#2563EB",
  },
];

const comparisonRows = [
  { app: "PayWatch", focus: { nl: "Rekeningen en risico", en: "Bills and risk" }, link: null, prevents: { nl: "Ja", en: "Yes" }, free: true, nl: true },
  { app: "Dyme", focus: { nl: "Abonnementen en besparen", en: "Subscriptions and savings" }, link: "/vergelijking/dyme-alternatief", prevents: { nl: "Nee", en: "No" }, free: true, nl: true },
  { app: "Grassfeld", focus: { nl: "Budget en huishoudboekje", en: "Budget and household book" }, link: "/vergelijking/grassfeld-alternatief", prevents: { nl: "Nee", en: "No" }, free: false, nl: true },
  { app: "fiKks", focus: { nl: "Buddy bij schulden", en: "Buddy for debts" }, link: "/vergelijking/fikks-alternatief", prevents: { nl: "Beperkt", en: "Limited" }, free: true, nl: true },
  { app: "Cleo", focus: { nl: "AI chatbot budget", en: "AI chatbot budget" }, link: "/vergelijking/cleo-alternatief", prevents: { nl: "Nee", en: "No" }, free: true, nl: false },
  { app: "YNAB", focus: { nl: "Zero-based budgetteren", en: "Zero-based budgeting" }, link: "/vergelijking/ynab-alternatief", prevents: { nl: "Nee", en: "No" }, free: false, nl: false },
];

const L = {
  nl: {
    heroTitle: "Beste app om schulden te voorkomen (2026)",
    heroSub: "Voorkom dat rekeningen oplopen tot incasso of deurwaarder. Vergelijk de beste apps in Nederland en kies wat bij jouw situatie past.",
    hookTitle: "Wat kost een vergeten rekening?",
    hookSub: "Een factuur van \u20AC120 kan binnen drie maanden oplopen tot meer dan \u20AC600. Dit is hoe het escalatieproces in Nederland werkt:",
    whyTitle: "Waarom ontstaan schulden?",
    whyItems: [
      "Rekeningen komen binnen via e-mail en worden over het hoofd gezien",
      "Betaaltermijnen verlopen zonder dat je het doorhebt",
      "Brieven van schuldeisers worden uitgesteld of genegeerd",
      "Kosten lopen ongemerkt op door boetes en rente",
    ],
    whyConclusion: "De meeste apps geven je inzicht in wat je uitgeeft. Maar weinig apps helpen je voorkomen dat rekeningen escaleren. Dat is een ander probleem.",
    typesTitle: "Welke soorten apps zijn er?",
    compareTitle: "Vergelijk de beste apps",
    compareHeaders: ["App", "Focus", "Voorkomt schulden?", "Gratis", "Nederlands"],
    scenarioTitle: "Welke app past bij jou?",
    scenarios: [
      { label: "Ik wil overzicht in mijn uitgaven", apps: "Dyme of Grassfeld", color: "#6366F1", link: "/vergelijking/dyme-alternatief" },
      { label: "Ik heb al schulden en zoek hulp", apps: "fiKks of SchuldHulpMaatje", color: "#059669", link: "/vergelijking/schuldhulpmaatje" },
      { label: "Ik wil voorkomen dat rekeningen escaleren", apps: "PayWatch", color: "#2563EB", link: null, highlight: true },
    ],
    tipTitle: "Beste budget app 2026: waar moet je op letten?",
    tipText: "Bij het kiezen van een app voor je geldzaken zijn een paar dingen belangrijk. Werkt de app met Nederlandse banken? Krijg je meldingen voor je betaaldeadline? En wat gebeurt er als je een rekening vergeet? Apps zoals Dyme en Grassfeld helpen je met budgetteren. Maar als je moeite hebt met het op tijd betalen van rekeningen, heb je iets nodig dat verder gaat dan alleen uitgaven bijhouden. PayWatch is specifiek gebouwd om schulden te voorkomen. Niet alleen om te laten zien waar je geld naartoe gaat, maar om actief je rekeningen in de gaten te houden en je te waarschuwen wanneer actie nodig is.",
    faqTitle: "Veelgestelde vragen",
    faqs: [
      { q: "Wat is de beste app tegen schulden in Nederland?", a: "Dat hangt af van je situatie. Voor het voorkomen van schulden is PayWatch gebouwd: het scant je inbox op rekeningen en waarschuwt voordat een factuur escaleert. Voor budgetteren zijn Dyme en Grassfeld goed. Voor hulp bij bestaande schulden is fiKks of SchuldHulpMaatje geschikt." },
      { q: "Kan een app schulden voorkomen?", a: "Ja, mits de app actief je rekeningen monitort en je waarschuwt voor deadlines. Alleen uitgaven bijhouden is niet genoeg. Je hebt een tool nodig die facturen detecteert, escalatiefasen herkent en je op tijd laat handelen." },
      { q: "Wat als ik al schulden heb?", a: "Dan is een budget app alleen niet genoeg. Kijk naar SchuldHulpMaatje voor gratis persoonlijke begeleiding, of neem contact op met de schuldhulpverlening in je gemeente. PayWatch helpt je daarnaast nieuwe rekeningen in de gaten te houden zodat de situatie niet erger wordt." },
      { q: "Is PayWatch gratis?", a: "Ja. Je kunt gratis je inbox koppelen, rekeningen scannen, escalaties volgen en schuldhulp zoeken bij jou in de buurt." },
    ],
    ctaTitle: "Voorkom dat kleine rekeningen grote problemen worden",
    ctaSub: "Verbind je inbox en zie binnen twee minuten welke rekeningen aandacht nodig hebben.",
    ctaPrimary: "Start gratis met PayWatch",
    ctaSecondary: "Bekijk alle functies",
    linksTitle: "Vergelijk PayWatch met andere apps",
  },
  en: {
    heroTitle: "Best app to prevent debts (2026)",
    heroSub: "Prevent bills from escalating to collections or bailiffs. Compare the best apps in the Netherlands and choose what fits your situation.",
    hookTitle: "What does a forgotten bill cost?",
    hookSub: "An invoice of \u20AC120 can escalate to over \u20AC600 within three months. This is how the escalation process works in the Netherlands:",
    whyTitle: "Why do debts arise?",
    whyItems: [
      "Bills arrive by email and get overlooked",
      "Payment deadlines expire without you noticing",
      "Letters from creditors get postponed or ignored",
      "Costs silently add up through penalties and interest",
    ],
    whyConclusion: "Most apps give you insight into what you spend. But few apps help you prevent bills from escalating. That's a different problem.",
    typesTitle: "What types of apps exist?",
    compareTitle: "Compare the best apps",
    compareHeaders: ["App", "Focus", "Prevents debts?", "Free", "Dutch"],
    scenarioTitle: "Which app fits you?",
    scenarios: [
      { label: "I want an overview of my spending", apps: "Dyme or Grassfeld", color: "#6366F1", link: "/vergelijking/dyme-alternatief" },
      { label: "I already have debts and need help", apps: "fiKks or SchuldHulpMaatje", color: "#059669", link: "/vergelijking/schuldhulpmaatje" },
      { label: "I want to prevent bills from escalating", apps: "PayWatch", color: "#2563EB", link: null, highlight: true },
    ],
    tipTitle: "Best budget app 2026: what to look for?",
    tipText: "When choosing an app for your finances, a few things matter. Does it work with Dutch banks? Do you get notifications before your payment deadline? And what happens when you forget a bill? Apps like Dyme and Grassfeld help you budget. But if you struggle with paying bills on time, you need something that goes beyond just tracking expenses. PayWatch is specifically built to prevent debts. Not just to show where your money goes, but to actively monitor your bills and alert you when action is needed.",
    faqTitle: "Frequently asked questions",
    faqs: [
      { q: "What is the best app against debts in the Netherlands?", a: "That depends on your situation. For preventing debts, PayWatch is built: it scans your inbox for bills and warns before an invoice escalates. For budgeting, Dyme and Grassfeld are good. For help with existing debts, fiKks or SchuldHulpMaatje is suitable." },
      { q: "Can an app prevent debts?", a: "Yes, provided the app actively monitors your bills and warns you about deadlines. Just tracking expenses is not enough. You need a tool that detects invoices, recognizes escalation stages and lets you act in time." },
      { q: "What if I already have debts?", a: "Then a budget app alone is not enough. Look at SchuldHulpMaatje for free personal guidance, or contact the debt support in your municipality. PayWatch helps you alongside that to keep an eye on new bills so the situation doesn't get worse." },
      { q: "Is PayWatch free?", a: "Yes. You can connect your inbox, scan bills, track escalations and find debt support near you for free." },
    ],
    ctaTitle: "Prevent small bills from becoming big problems",
    ctaSub: "Connect your inbox and see within two minutes which bills need attention.",
    ctaPrimary: "Start free with PayWatch",
    ctaSecondary: "View all features",
    linksTitle: "Compare PayWatch with other apps",
  },
};

export default function CategoryContent() {
  const { lang } = useApp();
  const t = L[lang];
  const [hoveredStep, setHoveredStep] = useState(0);

  return (
    <div className="bg-[var(--bg)]">
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 pt-10 pb-10 sm:px-6 sm:pt-16 sm:pb-14">
        <ScrollReveal>
          <h1 className="text-3xl sm:text-[42px] font-extrabold text-[var(--navy)] tracking-tight leading-tight mb-4">
            {t.heroTitle}
          </h1>
          <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed max-w-2xl mb-8">
            {t.heroSub}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="https://app.paywatch.app" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--blue)] text-white px-6 py-3.5 text-sm font-semibold shadow-[0_6px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_8px_28px_rgba(37,99,235,0.4)] transition-all active:scale-[0.97]">
              {t.ctaPrimary}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <Link href="#vergelijk" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] px-6 py-3.5 text-sm font-semibold hover:border-[var(--blue)] transition-colors">
              {lang === "nl" ? "Bekijk vergelijking" : "View comparison"}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* Escalation hook */}
      <section className="mx-auto max-w-4xl px-4 pb-12 sm:px-6">
        <ScrollReveal>
          <div className="rounded-2xl border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[var(--navy)] mb-2">{t.hookTitle}</h2>
            <p className="text-sm text-[var(--muted)] mb-6">{t.hookSub}</p>
            <div className="flex flex-col sm:flex-row gap-2">
              {escalation.map((step, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setHoveredStep(i)}
                  onClick={() => setHoveredStep(i)}
                  className="flex-1 rounded-xl p-4 text-center transition-all"
                  style={{
                    background: i <= hoveredStep ? `${step.color}15` : "transparent",
                    border: `2px solid ${i <= hoveredStep ? step.color : "transparent"}`,
                    transform: i === hoveredStep ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  <p className="text-2xl sm:text-3xl font-extrabold" style={{ color: step.color }}>
                    {"\u20AC"}{step.cost}
                  </p>
                  <p className="text-xs font-semibold mt-1" style={{ color: step.color }}>{step[lang]}</p>
                </button>
              ))}
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                {lang === "nl"
                  ? `Extra kosten: \u20AC${escalation[hoveredStep].cost - 120}. Met PayWatch: \u20AC0 extra.`
                  : `Extra costs: \u20AC${escalation[hoveredStep].cost - 120}. With PayWatch: \u20AC0 extra.`}
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Why do debts arise */}
      <section className="mx-auto max-w-4xl px-4 pb-12 sm:px-6">
        <ScrollReveal>
          <h2 className="text-2xl font-bold text-[var(--navy)] mb-5">{t.whyTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {t.whyItems.map((item, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <div className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0 text-xs font-bold text-red-600">{i + 1}</div>
                <p className="text-sm text-[var(--text)]">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-[var(--muted)] leading-relaxed bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">{t.whyConclusion}</p>
        </ScrollReveal>
      </section>

      {/* Types of apps */}
      <section className="mx-auto max-w-4xl px-4 pb-12 sm:px-6">
        <ScrollReveal>
          <h2 className="text-2xl font-bold text-[var(--navy)] mb-6">{t.typesTitle}</h2>
        </ScrollReveal>
        <div className="space-y-4">
          {appCategories.map((cat, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div
                className="rounded-2xl border-2 p-6 relative overflow-hidden"
                style={{
                  borderColor: cat.prevents ? cat.color : "var(--border)",
                  background: cat.prevents ? `${cat.color}08` : "var(--surface)",
                }}
              >
                {cat.prevents && (
                  <div className="absolute top-0 right-0 text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl" style={{ background: cat.color }}>
                    {lang === "nl" ? "SCHULDPREVENTIE" : "DEBT PREVENTION"}
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: cat.color }} />
                  <h3 className="text-base font-bold text-[var(--text)]">{cat.type[lang]}</h3>
                </div>
                <p className="text-sm text-[var(--muted)] mb-3">{cat.desc[lang]}</p>
                <div className="flex flex-wrap gap-2">
                  {cat.apps.map((app) => (
                    <span key={app} className="text-xs font-medium px-2.5 py-1 rounded-full border" style={{ color: cat.color, borderColor: `${cat.color}44`, background: `${cat.color}11` }}>
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section id="vergelijk" className="mx-auto max-w-4xl px-4 pb-12 sm:px-6 scroll-mt-20">
        <ScrollReveal>
          <h2 className="text-2xl font-bold text-[var(--navy)] mb-6">{t.compareTitle}</h2>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg)]">
                  {t.compareHeaders.map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} className={`border-b border-[var(--border)] last:border-0 ${row.app === "PayWatch" ? "bg-blue-50/50 dark:bg-blue-950/10" : "hover:bg-[var(--bg)]"} transition-colors`}>
                    <td className="px-4 py-3.5 font-semibold text-[var(--text)]">
                      {row.link ? (
                        <Link href={row.link} className="text-[var(--blue)] hover:underline">{row.app}</Link>
                      ) : (
                        <span className={row.app === "PayWatch" ? "text-[var(--blue)]" : ""}>{row.app}</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-[var(--muted)]">{row.focus[lang]}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${row.prevents[lang] === (lang === "nl" ? "Ja" : "Yes") ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : row.prevents[lang] === (lang === "nl" ? "Beperkt" : "Limited") ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" : "bg-gray-100 dark:bg-gray-800 text-[var(--muted)]"}`}>
                        {row.prevents[lang]}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {row.free ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {row.nl ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </section>

      {/* Which fits you? */}
      <section className="mx-auto max-w-4xl px-4 pb-12 sm:px-6">
        <ScrollReveal>
          <h2 className="text-2xl font-bold text-[var(--navy)] mb-6">{t.scenarioTitle}</h2>
        </ScrollReveal>
        <div className="space-y-3">
          {t.scenarios.map((s, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              {s.link ? (
                <Link
                  href={s.link}
                  className={`flex items-center gap-4 rounded-2xl border-2 p-5 transition-all hover:shadow-md group ${s.highlight ? "border-[var(--blue)] bg-blue-50/50 dark:bg-blue-950/20" : "border-[var(--border)] bg-[var(--surface)]"}`}
                >
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: s.color }} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[var(--text)]">{s.label}</p>
                    <p className="text-xs text-[var(--muted)] mt-0.5">{s.apps}</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              ) : (
                <a
                  href="https://app.paywatch.app"
                  className="flex items-center gap-4 rounded-2xl border-2 border-[var(--blue)] bg-blue-50/50 dark:bg-blue-950/20 p-5 transition-all hover:shadow-md group"
                >
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: s.color }} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[var(--text)]">{s.label}</p>
                    <p className="text-xs text-[var(--blue)] font-semibold mt-0.5">{s.apps}</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              )}
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Long-tail SEO text */}
      <section className="mx-auto max-w-4xl px-4 pb-12 sm:px-6">
        <ScrollReveal>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="text-lg font-bold text-[var(--navy)] mb-3">{t.tipTitle}</h2>
            <p className="text-sm text-[var(--muted)] leading-relaxed">{t.tipText}</p>
          </div>
        </ScrollReveal>
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
      <section className="mx-auto max-w-4xl px-4 pb-12 sm:px-6">
        <ScrollReveal>
          <div className="rounded-2xl bg-[var(--navy)] p-8 sm:p-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">{t.ctaTitle}</h2>
            <p className="text-sm text-white/70 mb-6 max-w-md mx-auto">{t.ctaSub}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="https://app.paywatch.app" className="inline-flex items-center gap-2 rounded-xl bg-white text-[var(--navy)] px-6 py-3.5 text-sm font-semibold shadow-lg hover:shadow-xl transition-all active:scale-[0.97]">
                {t.ctaPrimary}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
              <Link href="/features" className="inline-flex items-center gap-2 rounded-xl border border-white/20 text-white px-6 py-3.5 text-sm font-semibold hover:bg-white/10 transition-colors">
                {t.ctaSecondary}
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Comparison links */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <ScrollReveal>
          <h3 className="text-lg font-bold text-[var(--navy)] mb-4">{t.linksTitle}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { slug: "dyme-alternatief", name: "Dyme", color: "#6366F1" },
              { slug: "fikks-alternatief", name: "fiKks", color: "#059669" },
              { slug: "grassfeld-alternatief", name: "Grassfeld", color: "#0E7C55" },
              { slug: "cleo-alternatief", name: "Cleo", color: "#8B5CF6" },
              { slug: "monefy-alternatief", name: "Monefy", color: "#00B894" },
              { slug: "ynab-alternatief", name: "YNAB", color: "#3B82F6" },
              { slug: "schuldhulpmaatje", name: "SchuldHulpMaatje", color: "#059669" },
              { slug: "buddy-alternatief", name: "Buddy", color: "#F59E0B" },
            ].map((c) => (
              <Link key={c.slug} href={`/vergelijking/${c.slug}`} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 hover:border-[var(--blue)] transition-all group text-center">
                <div className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center text-xs font-extrabold text-white" style={{ background: c.color }}>{c.name.charAt(0)}</div>
                <p className="text-xs font-semibold text-[var(--text)] group-hover:text-[var(--blue)] transition-colors">{c.name}</p>
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
