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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <Link href={`https://${siteConfig.appDomain}`} className="rounded bg-[var(--blue)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity w-full sm:w-auto text-center">{t.hero.cta}</Link>
              <Link href="/features" className="rounded border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--text)] hover:border-[var(--muted)] transition-colors w-full sm:w-auto text-center">{t.hero.secondary}</Link>
            </div>
            <p className="text-center text-xs text-[var(--muted)] mt-4">{t.hero.trust}</p>
          </ScrollReveal>
          <ScrollReveal delay={400}>
            <div className="mt-8 flex justify-center"><HeroBanner /></div>
          </ScrollReveal>
        </div>
      </section>

      <TrustBar />

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
                  <SanityImage imageKey={`step-${i + 1}`} placeholderLabel={step.title} className="rounded-lg bg-[var(--bg)] aspect-[4/3] w-full mb-4 overflow-hidden" />
                  <h3 className="text-base font-bold text-[var(--navy)] mb-2">{step.title}</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
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
                  <SanityImage imageKey={`feature-${i + 1}`} placeholderLabel={feature.title} className="rounded-lg bg-[var(--surface)] aspect-[3/2] w-full mb-3 overflow-hidden" />
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
