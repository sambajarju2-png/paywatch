"use client";

import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import TrustBar from "@/components/TrustBar";
import NetherlandsMap from "@/components/NetherlandsMap";
import HeroBanner from "@/components/HeroBanner";
import ScrollReveal from "@/components/ScrollReveal";
import SanityImage from "@/components/SanityImage";
import { siteConfig } from "@/lib/config";
import FeatureRoadmap from "@/components/FeatureRoadmap";
import EscalationCalculator from "@/components/EscalationCalculator";

export default function HomePage() {
  const { lang, t } = useApp();

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="bg-[var(--bg)]">
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-8 sm:px-6 sm:pt-20 sm:pb-12">
          <ScrollReveal>
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-semibold text-[var(--navy)]">{t.hero.badge}</span>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="text-center text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[var(--navy)] tracking-tight leading-tight max-w-3xl mx-auto">{t.hero.title}</h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-center text-base sm:text-lg text-[var(--muted)] mt-4 max-w-2xl mx-auto leading-relaxed">{t.hero.subtitle}</p>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <div className="flex flex-col items-center justify-center gap-4 mt-8">
              {/* Primary CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
                <a href="https://apps.apple.com/nl/app/paywatch/id6763662036" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 rounded-xl bg-black px-5 py-3 hover:bg-gray-900 transition-colors w-full sm:w-auto justify-center">
                  <svg width="20" height="24" viewBox="0 0 814 1000" fill="white"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.4c-58.8-82.8-109.3-211.1-109.3-332.6 0-195.3 126.9-298.8 251.8-298.8 66.3 0 121.6 43.5 163.3 43.5 39.8 0 101.7-46.2 177.5-46.2 28.7 0 131.7 2.6 199.3 96.5zM554.1 159.4c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.7 32.4-56.4 83.6-56.4 135.5 0 7.8.6 15.7 1.3 18.2 2.6.6 6.4 1.3 10.2 1.3 45.4 0 102.5-30.4 140.8-71.4z"/></svg>
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] text-white/70 leading-none">{t.hero.cta === 'Start gratis' ? 'Download in de' : 'Download on the'}</span>
                    <span className="text-[15px] font-semibold text-white leading-tight">App Store</span>
                  </div>
                </a>
                <Link href={`https://${siteConfig.appDomain}`} className="rounded-xl bg-[var(--blue)] px-6 py-3.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity w-full sm:w-auto text-center">{t.hero.cta === 'Start gratis' ? 'Of start via de browser' : 'Or start in browser'}</Link>
              </div>
              {/* Secondary */}
              <Link href="/features" className="text-sm font-medium text-[var(--muted)] hover:text-[var(--text)] transition-colors underline underline-offset-4">{t.hero.secondary}</Link>
            </div>
            <p className="text-center text-xs text-[var(--muted)] mt-4">{t.hero.trust}</p>
            <div className="flex justify-center mt-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-[11px] font-medium text-[var(--muted)]">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                {t.hero.languages}
              </span>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={400}>
            <div className="mt-8 flex justify-center"><HeroBanner /></div>
          </ScrollReveal>
        </div>
      </section>

      <TrustBar />

      <EscalationCalculator />

      {/* ─── How it Works ─── */}
      <section id="how-it-works" className="bg-[var(--bg)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <ScrollReveal>
            <h2 className="text-center text-2xl sm:text-3xl font-bold text-[var(--navy)] tracking-tight">{t.howItWorks.title}</h2>
            <p className="text-center text-sm text-[var(--muted)] mt-2 mb-12">{t.howItWorks.subtitle}</p>
          </ScrollReveal>
          <div className="grid gap-8 sm:grid-cols-3">
            {t.howItWorks.steps.map((step, i) => (
              <ScrollReveal key={i} delay={i * 150}>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 h-full">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--blue-light)] mb-4">
                    <span className="text-lg font-extrabold text-[var(--blue)]">{i + 1}</span>
                  </div>
                  <SanityImage imageKey={`step-${i + 1}`} placeholderLabel={step.title} className="rounded-lg bg-[var(--bg)] aspect-[3/4] w-full mb-4 overflow-hidden" />
                  <h3 className="text-base font-bold text-[var(--navy)] mb-2">{step.title}</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal delay={500}>
            <div className="flex justify-center mt-10">
              <Link
                href="/support"
                className="inline-flex items-center gap-2 rounded border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--text)] hover:border-[var(--blue)] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-70">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                {lang === "nl" ? "Veelgestelde vragen bekijken" : "View frequently asked questions"}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section className="bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <ScrollReveal>
            <h2 className="text-center text-2xl sm:text-3xl font-bold text-[var(--navy)] tracking-tight">{t.features.title}</h2>
            <p className="text-center text-sm text-[var(--muted)] mt-2 mb-12">{t.features.subtitle}</p>
          </ScrollReveal>
          <div className="grid gap-4 sm:grid-cols-3">
            {t.features.items.slice(0, 3).map((feature, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 hover:border-[var(--blue)] transition-all h-full">
                  <SanityImage imageKey={`feature-${i + 1}`} placeholderLabel={feature.title} className="rounded-lg bg-[var(--surface)] aspect-[4/5] w-full mb-3 overflow-hidden" />
                  <h3 className="text-sm font-bold text-[var(--navy)] mb-1">{feature.title}</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{feature.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Link href="/features" className="rounded border border-[var(--border)] bg-[var(--bg)] px-6 py-3 text-sm font-semibold text-[var(--text)] hover:border-[var(--blue)] transition-colors">
              {lang === "nl" ? "Alle functies bekijken" : "View all features"} →
            </Link>
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
          <ScrollReveal><NetherlandsMap /></ScrollReveal>
        </div>
      </section>

      {/* Roadmap */}
<div className="bg-[var(--bg)] border-t border-[var(--border)]">
  <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
    <FeatureRoadmap compact />
  </div>
</div>
      {/* ─── CTA ─── */}
      <section className="bg-[var(--bg)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 text-center">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--navy)] tracking-tight">{t.cta.title}</h2>
            <p className="text-sm text-[var(--muted)] mt-2 mb-8">{t.cta.subtitle}</p>
            <Link href={`https://${siteConfig.appDomain}`} className="inline-flex rounded bg-[var(--blue)] px-8 py-3 text-base font-semibold text-white hover:opacity-90 transition-opacity">{t.cta.button}</Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
