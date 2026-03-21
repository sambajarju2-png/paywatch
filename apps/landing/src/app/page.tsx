"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useApp } from "@/components/AppProvider";
import TrustBar from "@/components/TrustBar";
import GemeenteSearch from "@/components/GemeenteSearch";
import HeroBanner from "@/components/HeroBanner";
import ScrollReveal from "@/components/ScrollReveal";
import { siteConfig } from "@/lib/config";

/* Lazy-load mockups to keep initial bundle small */
const PhoneMockup = dynamic(() => import("@/components/mockups/PhoneMockup"), { ssr: false });

/* Which mockup screen each "How it Works" step shows */
const stepScreens = ["dashboard", "payments", "stats"] as const;

/* Which mockup screen each feature best maps to (null = use icon placeholder) */
const featureMockups: (null | "dashboard" | "payments" | "stats" | "cashflow")[] = [
  "dashboard",  // Gmail scan → shows dashboard after scanning
  "payments",   // Escalation tracking → payments screen
  null,         // Cost prediction → no direct screen
  null,         // AI letters → no direct screen
  "cashflow",   // Cashflow forecast
  "stats",      // Financial health
  null,         // Aid orgs
  null,         // QR payments
  "dashboard",  // Mood tracker → dashboard has mood
  null,         // Dark mode
];

export default function HomePage() {
  const { t } = useApp();

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="bg-[var(--bg)]">
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-8 sm:px-6 sm:pt-20 sm:pb-12">
          <ScrollReveal>
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-semibold text-[var(--navy)]">
                {t.hero.badge}
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h1 className="text-center text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[var(--navy)] tracking-tight leading-tight max-w-3xl mx-auto">
              {t.hero.title}
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="text-center text-base sm:text-lg text-[var(--muted)] mt-4 max-w-2xl mx-auto leading-relaxed">
              {t.hero.subtitle}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <Link href={`https://${siteConfig.appDomain}`} className="rounded bg-[var(--blue)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity w-full sm:w-auto text-center">
                {t.hero.cta}
              </Link>
              <Link href="/features" className="rounded border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--text)] hover:border-[var(--muted)] transition-colors w-full sm:w-auto text-center">
                {t.hero.secondary}
              </Link>
            </div>
            <p className="text-center text-xs text-[var(--muted)] mt-4">{t.hero.trust}</p>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="mt-8 flex justify-center">
              <HeroBanner />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <TrustBar />

      {/* ─── How it Works — with real mockups ─── */}
      <section id="how-it-works" className="bg-[var(--bg)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <ScrollReveal>
            <h2 className="text-center text-2xl sm:text-3xl font-bold text-[var(--navy)] tracking-tight">{t.howItWorks.title}</h2>
            <p className="text-center text-sm text-[var(--muted)] mt-2 mb-12">{t.howItWorks.subtitle}</p>
          </ScrollReveal>

          <div className="grid gap-8 sm:grid-cols-3">
            {t.howItWorks.steps.map((step, i) => (
              <ScrollReveal key={i} delay={i * 150} direction="up">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 h-full">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--blue-light)] mb-4">
                    <span className="text-lg font-extrabold text-[var(--blue)]">{i + 1}</span>
                  </div>

                  {/* Real mockup preview */}
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] mb-4 flex items-center justify-center overflow-hidden h-52">
                    <PhoneMockup screen={stepScreens[i]} scale={0.3} />
                  </div>

                  <h3 className="text-base font-bold text-[var(--navy)] mb-2">{step.title}</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Grid — mockups on hover ─── */}
      <section className="bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <ScrollReveal>
            <h2 className="text-center text-2xl sm:text-3xl font-bold text-[var(--navy)] tracking-tight">{t.features.title}</h2>
            <p className="text-center text-sm text-[var(--muted)] mt-2 mb-12">{t.features.subtitle}</p>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.features.items.map((feature, i) => (
              <ScrollReveal key={i} delay={(i % 3) * 100} direction="up">
                <div className="group rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 hover:border-[var(--blue)] transition-all hover:shadow-lg hover:shadow-[var(--blue)]/5 h-full">
                  {/* Mockup preview or icon placeholder */}
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] h-32 mb-3 flex items-center justify-center overflow-hidden">
                    {featureMockups[i] ? (
                      <div className="opacity-80 group-hover:opacity-100 transition-opacity">
                        <PhoneMockup screen={featureMockups[i]!} scale={0.19} />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[var(--blue-light)] flex items-center justify-center">
                        <FeatureIcon index={i} />
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-[var(--navy)] mb-1 group-hover:text-[var(--blue)] transition-colors">{feature.title}</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{feature.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Motivation / Stats ─── */}
      <section className="bg-[var(--bg)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <ScrollReveal>
            <h2 className="text-center text-2xl sm:text-3xl font-bold text-[var(--navy)] tracking-tight">{t.motivation.title}</h2>
            <p className="text-center text-sm text-[var(--muted)] mt-2 mb-12">{t.motivation.subtitle}</p>
          </ScrollReveal>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {t.motivation.stats.map((stat, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center">
                  <p className="text-2xl sm:text-3xl font-extrabold text-[var(--blue)] tracking-tight">{stat.value}</p>
                  <p className="text-xs text-[var(--muted)] mt-1">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Gemeente Search ─── */}
      <section className="bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 text-center">
          <ScrollReveal>
            <GemeenteSearch />
          </ScrollReveal>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-[var(--bg)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 text-center">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--navy)] tracking-tight">{t.cta.title}</h2>
            <p className="text-sm text-[var(--muted)] mt-2 mb-8">{t.cta.subtitle}</p>
            <Link href={`https://${siteConfig.appDomain}`} className="inline-flex rounded bg-[var(--blue)] px-8 py-3 text-base font-semibold text-white hover:opacity-90 transition-opacity">
              {t.cta.button}
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

function FeatureIcon({ index }: { index: number }) {
  const s = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5 } as const;
  const cls = "text-[var(--blue)]";
  switch (index) {
    case 2: return <svg {...s} className={cls}><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="4"/></svg>;
    case 3: return <svg {...s} className={cls}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>;
    case 6: return <svg {...s} className={cls}><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/></svg>;
    case 7: return <svg {...s} className={cls}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
    case 9: return <svg {...s} className={cls}><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>;
    default: return <svg {...s} className={cls}><circle cx="12" cy="12" r="10"/></svg>;
  }
}
