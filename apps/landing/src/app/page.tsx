"use client";

import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import TrustBar from "@/components/TrustBar";
import GemeenteSearch from "@/components/GemeenteSearch";
import HeroBanner from "@/components/HeroBanner";
import { siteConfig } from "@/lib/config";

export default function HomePage() {
  const { t } = useApp();

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="bg-[var(--bg)]">
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-8 sm:px-6 sm:pt-20 sm:pb-12">
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-semibold text-[var(--navy)]">
              {t.hero.badge}
            </span>
          </div>
          <h1 className="text-center text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[var(--navy)] tracking-tight leading-tight max-w-3xl mx-auto">
            {t.hero.title}
          </h1>
          <p className="text-center text-base sm:text-lg text-[var(--muted)] mt-4 max-w-2xl mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Link href={`https://${siteConfig.appDomain}`} className="rounded bg-[var(--blue)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity w-full sm:w-auto text-center">
              {t.hero.cta}
            </Link>
            <Link href="/features" className="rounded border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--text)] hover:border-[var(--muted)] transition-colors w-full sm:w-auto text-center">
              {t.hero.secondary}
            </Link>
          </div>
          <p className="text-center text-xs text-[var(--muted)] mt-4">{t.hero.trust}</p>
          <div className="mt-8 flex justify-center">
            <HeroBanner />
          </div>
        </div>
      </section>

      <TrustBar />

      {/* ─── How it Works ─── */}
      <section id="how-it-works" className="bg-[var(--bg)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-[var(--navy)] tracking-tight">{t.howItWorks.title}</h2>
          <p className="text-center text-sm text-[var(--muted)] mt-2 mb-12">{t.howItWorks.subtitle}</p>
          <div className="grid gap-8 sm:grid-cols-3">
            {t.howItWorks.steps.map((step, i) => (
              <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--blue-light)] mb-4">
                  <span className="text-lg font-extrabold text-[var(--blue)]">{i + 1}</span>
                </div>

                {/* IMAGE PLACEHOLDER: Replace with screenshot showing this step */}
                <div className="rounded-lg border-2 border-dashed border-[var(--border)] bg-[var(--bg)] h-40 mb-4 flex flex-col items-center justify-center gap-2">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1" className="opacity-40">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className="text-[10px] text-[var(--muted)] opacity-60">
                    {i === 0 ? "Step 1 screenshot" : i === 1 ? "Step 2 screenshot" : "Step 3 screenshot"}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[var(--navy)] mb-2">{step.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section className="bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-[var(--navy)] tracking-tight">{t.features.title}</h2>
          <p className="text-center text-sm text-[var(--muted)] mt-2 mb-12">{t.features.subtitle}</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.features.items.map((feature, i) => (
              <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 hover:border-[var(--blue)] transition-colors">
                {/* IMAGE PLACEHOLDER: Replace with feature screenshot/illustration */}
                <div className="rounded-lg border-2 border-dashed border-[var(--border)] bg-[var(--surface)] h-28 mb-3 flex flex-col items-center justify-center gap-1.5">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1" className="opacity-40">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className="text-[9px] text-[var(--muted)] opacity-50">{feature.title}</span>
                </div>
                <h3 className="text-sm font-bold text-[var(--navy)] mb-1">{feature.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Motivation / Stats ─── */}
      <section className="bg-[var(--bg)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-[var(--navy)] tracking-tight">{t.motivation.title}</h2>
          <p className="text-center text-sm text-[var(--muted)] mt-2 mb-12">{t.motivation.subtitle}</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {t.motivation.stats.map((stat, i) => (
              <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-[var(--blue)] tracking-tight">{stat.value}</p>
                <p className="text-xs text-[var(--muted)] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Gemeente Search ─── */}
      <section className="bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 text-center">
          <GemeenteSearch />
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-[var(--bg)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--navy)] tracking-tight">{t.cta.title}</h2>
          <p className="text-sm text-[var(--muted)] mt-2 mb-8">{t.cta.subtitle}</p>
          <Link href={`https://${siteConfig.appDomain}`} className="inline-flex rounded bg-[var(--blue)] px-8 py-3 text-base font-semibold text-white hover:opacity-90 transition-opacity">
            {t.cta.button}
          </Link>
        </div>
      </section>
    </>
  );
}
