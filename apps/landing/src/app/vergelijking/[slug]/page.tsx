"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useApp } from "@/components/AppProvider";
import ScrollReveal from "@/components/ScrollReveal";
import { getComparisonBySlug, comparisons, escalationSteps } from "@/lib/comparison-data";

/* ─── Escalation Slider ─── */
function EscalationSlider({ lang }: { lang: "nl" | "en" }) {
  const [activeStep, setActiveStep] = useState(0);
  const steps = escalationSteps[lang];
  const base = 120;
  const extras = [0, 15, 40, 150, 500];
  const cumulative = extras.reduce<number[]>((acc, v, i) => {
    acc.push((acc[i - 1] || 0) + v);
    return acc;
  }, []);
  const total = base + cumulative[activeStep];
  const saved = cumulative[4] - cumulative[activeStep];

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
      <h3 className="text-lg font-bold text-[var(--navy)] mb-1">
        {lang === "nl" ? "Wat kost een gemiste rekening?" : "What does a missed bill cost?"}
      </h3>
      <p className="text-sm text-[var(--muted)] mb-6">
        {lang === "nl"
          ? "Sleep de slider om te zien hoe snel kosten oplopen"
          : "Drag the slider to see how quickly costs add up"}
      </p>

      {/* Slider */}
      <input
        type="range"
        min={0}
        max={4}
        step={1}
        value={activeStep}
        onChange={(e) => setActiveStep(+e.target.value)}
        className="w-full h-2 rounded-full appearance-none cursor-pointer mb-6"
        style={{
          background: `linear-gradient(to right, #059669 0%, #D97706 25%, #EA580C 50%, #DC2626 75%, #7F1D1D 100%)`,
          accentColor: steps[activeStep].color,
        }}
      />

      {/* Steps row */}
      <div className="flex justify-between mb-8">
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setActiveStep(i)}
            className="flex flex-col items-center gap-1 transition-opacity"
            style={{ opacity: i <= activeStep ? 1 : 0.35 }}
          >
            <div
              className="w-3 h-3 rounded-full transition-transform"
              style={{
                background: s.color,
                transform: i === activeStep ? "scale(1.5)" : "scale(1)",
                boxShadow: i === activeStep ? `0 0 0 4px ${s.color}33` : "none",
              }}
            />
            <span className="text-[10px] sm:text-xs font-semibold text-[var(--text)]">{s.stage}</span>
            <span className="text-[10px] text-[var(--muted)]">{s.days}</span>
          </button>
        ))}
      </div>

      {/* Result cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border-2 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-5">
          <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">
            {lang === "nl" ? "Zonder PayWatch" : "Without PayWatch"}
          </p>
          <p className="text-3xl font-extrabold text-red-700 dark:text-red-300">
            €{total}
          </p>
          <p className="text-xs text-red-500 dark:text-red-400 mt-1">
            {lang === "nl" ? `€${base} + €${cumulative[activeStep]} extra kosten` : `€${base} + €${cumulative[activeStep]} extra costs`}
          </p>
        </div>
        <div className="rounded-xl border-2 border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/30 p-5">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
            {lang === "nl" ? "Met PayWatch" : "With PayWatch"}
          </p>
          <p className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-300">
            €{base}
          </p>
          <p className="text-xs text-emerald-500 dark:text-emerald-400 mt-1">
            {lang === "nl" ? `€${saved} bespaard aan extra kosten` : `€${saved} saved in extra costs`}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Feature Row ─── */
function FeatureCell({ val, accent }: { val: boolean | string; accent?: string }) {
  if (val === true)
    return (
      <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    );
  if (val === false)
    return (
      <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>
    );
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full border" style={{ color: accent, borderColor: `${accent}44`, background: `${accent}11` }}>
      {val}
    </span>
  );
}

/* ─── Main Page ─── */
export default function ComparisonPage() {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useApp();
  const data = getComparisonBySlug(slug);

  if (!data) {
    return (
      <div className="bg-[var(--bg)] min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--navy)] mb-2">
            {lang === "nl" ? "Vergelijking niet gevonden" : "Comparison not found"}
          </h1>
          <Link href="/vergelijking" className="text-sm text-[var(--blue)] hover:underline">
            ← {lang === "nl" ? "Alle vergelijkingen" : "All comparisons"}
          </Link>
        </div>
      </div>
    );
  }

  const pwFeatureCount = data.features.filter((f) => f.paywatch === true).length;
  const compFeatureCount = data.features.filter((f) => f.competitor === true).length;

  return (
    <div className="bg-[var(--bg)]">
      {/* ─── Breadcrumb ─── */}
      <div className="mx-auto max-w-4xl px-4 pt-6 sm:px-6">
        <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
          <Link href="/" className="hover:text-[var(--blue)] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/vergelijking" className="hover:text-[var(--blue)] transition-colors">
            {lang === "nl" ? "Vergelijking" : "Comparison"}
          </Link>
          <span>/</span>
          <span className="text-[var(--text)] font-medium">{data.name}</span>
        </div>
      </div>

      {/* ─── Hero ─── */}
      <section className="mx-auto max-w-4xl px-4 pt-6 pb-10 sm:px-6 sm:pt-10 sm:pb-16">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] mb-5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
            {lang === "nl" ? "Vergelijking" : "Comparison"} — PayWatch vs {data.name}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--navy)] tracking-tight leading-tight mb-4">
            {data.heroTitle[lang]}
          </h1>
          <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed max-w-2xl">
            {data.heroSubtitle[lang]}
          </p>
        </ScrollReveal>

        {/* Quick stats */}
        <ScrollReveal delay={150}>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: lang === "nl" ? "Markt" : "Market", value: data.market },
              { label: lang === "nl" ? "Focus" : "Focus", value: data.tagline[lang] },
              { label: lang === "nl" ? "Prijs" : "Pricing", value: data.pricing[lang] },
              { label: lang === "nl" ? "Website" : "Website", value: data.url },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-[var(--muted)] mb-1">{s.label}</p>
                <p className="text-sm font-semibold text-[var(--text)] truncate">{s.value}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ─── Feature Comparison Table ─── */}
      <section className="mx-auto max-w-4xl px-4 pb-12 sm:px-6">
        <ScrollReveal>
          <h2 className="text-2xl font-bold text-[var(--navy)] mb-2">
            {lang === "nl" ? "Functies vergeleken" : "Features compared"}
          </h2>
          <p className="text-sm text-[var(--muted)] mb-6">
            {lang === "nl"
              ? `PayWatch heeft ${pwFeatureCount} van ${data.features.length} functies. ${data.name} heeft ${compFeatureCount} van ${data.features.length}.`
              : `PayWatch has ${pwFeatureCount} of ${data.features.length} features. ${data.name} has ${compFeatureCount} of ${data.features.length}.`}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[1fr_80px_80px] sm:grid-cols-[1fr_120px_120px] items-center px-4 sm:px-6 py-3 border-b border-[var(--border)] bg-[var(--bg)]">
              <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                {lang === "nl" ? "Functie" : "Feature"}
              </span>
              <span className="text-xs font-bold text-[var(--blue)] text-center">PayWatch</span>
              <span className="text-xs font-bold text-center" style={{ color: data.color }}>{data.name}</span>
            </div>
            {/* Rows */}
            {data.features.map((f, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_80px_80px] sm:grid-cols-[1fr_120px_120px] items-center px-4 sm:px-6 py-3.5 border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg)] transition-colors"
              >
                <span className="text-sm text-[var(--text)]">{f.label[lang]}</span>
                <div className="flex justify-center">
                  <FeatureCell val={f.paywatch} accent="var(--blue)" />
                </div>
                <div className="flex justify-center">
                  <FeatureCell val={f.competitor} accent={data.color} />
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ─── When to use which ─── */}
      <section className="mx-auto max-w-4xl px-4 pb-12 sm:px-6">
        <ScrollReveal>
          <h2 className="text-2xl font-bold text-[var(--navy)] mb-6">
            {lang === "nl" ? "Wanneer welke app?" : "When to use which?"}
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ScrollReveal delay={0}>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 h-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${data.color}15` }}>
                  <span className="text-sm font-bold" style={{ color: data.color }}>{data.name.charAt(0)}</span>
                </div>
                <h3 className="text-base font-bold text-[var(--text)]">
                  {lang === "nl" ? `Kies ${data.name} als:` : `Choose ${data.name} if:`}
                </h3>
              </div>
              <ul className="space-y-2.5">
                {data.whenCompetitor[lang].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--muted)]">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: data.color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="rounded-2xl border-2 border-[var(--blue)] bg-[var(--surface)] p-6 h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[var(--blue)] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                {lang === "nl" ? "AANBEVOLEN" : "RECOMMENDED"}
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-[var(--text)]">
                  {lang === "nl" ? "Kies PayWatch als:" : "Choose PayWatch if:"}
                </h3>
              </div>
              <ul className="space-y-2.5">
                {data.whenPayWatch[lang].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--text)]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2.5" strokeLinecap="round" className="shrink-0 mt-0.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Escalation Slider ─── */}
      <section className="mx-auto max-w-4xl px-4 pb-12 sm:px-6">
        <ScrollReveal>
          <EscalationSlider lang={lang} />
        </ScrollReveal>
      </section>

      {/* ─── Real Scenario ─── */}
      <section className="mx-auto max-w-4xl px-4 pb-12 sm:px-6">
        <ScrollReveal>
          <h2 className="text-2xl font-bold text-[var(--navy)] mb-2">
            {data.scenario.title[lang]}
          </h2>
          <p className="text-sm text-[var(--muted)] mb-6">
            {lang === "nl" ? "Een realistisch voorbeeld" : "A realistic example"}
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ScrollReveal delay={0}>
            <div className="rounded-2xl border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 p-6 h-full">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-red-700 dark:text-red-400">
                  {lang === "nl" ? `Met ${data.name}` : `With ${data.name}`}
                </p>
              </div>
              <p className="text-sm text-red-800/80 dark:text-red-300/80 leading-relaxed">
                {data.scenario.without[lang]}
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20 p-6 h-full">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  {lang === "nl" ? "Met PayWatch" : "With PayWatch"}
                </p>
              </div>
              <p className="text-sm text-emerald-800/80 dark:text-emerald-300/80 leading-relaxed">
                {data.scenario.with[lang]}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Social Proof ─── */}
      <section className="mx-auto max-w-4xl px-4 pb-12 sm:px-6">
        <ScrollReveal>
          <div className="rounded-2xl bg-[var(--navy)] p-8 sm:p-10 text-center">
            <p className="text-4xl sm:text-5xl font-extrabold text-white mb-2">1 op de 5</p>
            <p className="text-base text-white/70 mb-1">
              {lang === "nl"
                ? "Nederlandse huishoudens heeft geldproblemen"
                : "Dutch households has money problems"}
            </p>
            <p className="text-sm text-white/50">
              {lang === "nl"
                ? "PayWatch helpt dit voorkomen. Niet genezen — voorkomen."
                : "PayWatch helps prevent this. Not cure — prevent."}
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── CTA ─── */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <ScrollReveal>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--navy)] mb-3">
              {lang === "nl"
                ? "Probeer PayWatch gratis"
                : "Try PayWatch for free"}
            </h2>
            <p className="text-sm text-[var(--muted)] mb-6 max-w-md mx-auto">
              {lang === "nl"
                ? "Verbind je inbox en zie binnen 2 minuten welke rekeningen je aandacht nodig hebben."
                : "Connect your inbox and see within 2 minutes which bills need your attention."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://app.paywatch.app"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--blue)] text-white px-6 py-3.5 text-sm font-semibold shadow-[0_6px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_8px_28px_rgba(37,99,235,0.4)] transition-all active:scale-[0.97]"
              >
                {lang === "nl" ? "Start gratis" : "Get started free"}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <Link
                href="/features"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] px-6 py-3.5 text-sm font-semibold hover:border-[var(--blue)] transition-colors"
              >
                {lang === "nl" ? "Bekijk alle functies" : "View all features"}
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── Other Comparisons ─── */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <ScrollReveal>
          <h3 className="text-lg font-bold text-[var(--navy)] mb-4">
            {lang === "nl" ? "Andere vergelijkingen" : "Other comparisons"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {comparisons
              .filter((c) => c.slug !== slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/vergelijking/${c.slug}`}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-[var(--blue)] hover:shadow-md transition-all group"
                >
                  <p className="text-sm font-bold text-[var(--text)] group-hover:text-[var(--blue)] transition-colors">
                    PayWatch vs {c.name}
                  </p>
                  <p className="text-xs text-[var(--muted)] mt-1">{c.tagline[lang]}</p>
                </Link>
              ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ─── JSON-LD Schema ─── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: data.seoTitle[lang],
            description: data.seoDesc[lang],
            url: `https://paywatch.app/vergelijking/${data.slug}`,
            mainEntity: {
              "@type": "SoftwareApplication",
              name: "PayWatch",
              applicationCategory: "FinanceApplication",
              operatingSystem: "Web, iOS, Android",
              offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
            },
          }),
        }}
      />
    </div>
  );
}
