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
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-semibold text-[var(--navy)]">
              {t.hero.badge}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-center text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[var(--navy)] tracking-tight leading-tight max-w-3xl mx-auto">
            {t.hero.title}
          </h1>
          <p className="text-center text-base sm:text-lg text-[var(--muted)] mt-4 max-w-2xl mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Link
              href={`https://${siteConfig.appDomain}`}
              className="rounded bg-[var(--blue)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity w-full sm:w-auto text-center"
            >
              {t.hero.cta}
            </Link>
            <Link
              href="/features"
              className="rounded border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--text)] hover:border-[var(--muted)] transition-colors w-full sm:w-auto text-center"
            >
              {t.hero.secondary}
            </Link>
          </div>

          {/* Trust text */}
          <p className="text-center text-xs text-[var(--muted)] mt-4">
            {t.hero.trust}
          </p>

          {/* Auto-scrolling hero phone */}
          <div className="mt-8 flex justify-center">
            <HeroBanner />
          </div>
        </div>
      </section>

      {/* ─── Trust Bar ─── */}
      <TrustBar />

      {/* ─── How it Works ─── */}
      <section id="how-it-works" className="bg-[var(--bg)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-[var(--navy)] tracking-tight">{t.howItWorks.title}</h2>
          <p className="text-center text-sm text-[var(--muted)] mt-2 mb-12">{t.howItWorks.subtitle}</p>

          <div className="grid gap-8 sm:grid-cols-3">
            {t.howItWorks.steps.map((step, i) => (
              <div key={i} className="relative rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
                {/* Step number */}
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--blue-light)] mb-4">
                  <span className="text-lg font-extrabold text-[var(--blue)]">{i + 1}</span>
                </div>

                {/* Mockup placeholder */}
                <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] h-32 mb-4 flex items-center justify-center overflow-hidden">
                  {i === 0 && <StepVisual1 />}
                  {i === 1 && <StepVisual2 />}
                  {i === 2 && <StepVisual3 />}
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
              <div
                key={i}
                className="group relative rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 hover:border-[var(--blue)] transition-colors"
              >
                {/* Feature icon placeholder */}
                <div className="w-9 h-9 rounded-lg bg-[var(--blue-light)] flex items-center justify-center mb-3">
                  <FeatureIcon index={i} />
                </div>
                <h3 className="text-sm font-bold text-[var(--navy)] mb-1">{feature.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{feature.desc}</p>

                {/* Hover mockup preview */}
                <div className="absolute inset-0 rounded-xl bg-[var(--surface)] border border-[var(--blue)] p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-[var(--blue-light)] flex items-center justify-center mx-auto mb-2">
                      <FeatureIcon index={i} />
                    </div>
                    <p className="text-sm font-bold text-[var(--navy)]">{feature.title}</p>
                    <p className="text-xs text-[var(--muted)] mt-1">{feature.desc}</p>
                  </div>
                </div>
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
          <Link
            href={`https://${siteConfig.appDomain}`}
            className="inline-flex rounded bg-[var(--blue)] px-8 py-3 text-base font-semibold text-white hover:opacity-90 transition-opacity"
          >
            {t.cta.button}
          </Link>
        </div>
      </section>
    </>
  );
}

/* ─── Step visuals for "How it works" section ─── */
function StepVisual1() {
  return (
    <div className="flex items-center gap-2 px-3">
      <div className="w-8 h-8 rounded-lg bg-[var(--red-light)] flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 5L2 7"/></svg>
      </div>
      <div className="flex-1">
        <div className="h-2 w-16 rounded bg-[var(--border)]" />
        <div className="h-1.5 w-10 rounded bg-[var(--border)] mt-1 opacity-50" />
      </div>
      <div className="flex flex-col gap-1">
        <div className="h-1.5 w-8 rounded bg-[var(--green)]" />
        <div className="h-1.5 w-6 rounded bg-[var(--amber)]" />
        <div className="h-1.5 w-10 rounded bg-[var(--red)]" />
      </div>
    </div>
  );
}

function StepVisual2() {
  return (
    <div className="flex items-center gap-2 px-3">
      <div className="w-8 h-8 rounded-lg bg-[var(--purple-light)] flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex gap-1">
          <div className="h-4 flex-1 rounded bg-[var(--blue-light)] border border-[var(--border)]" />
          <div className="h-4 flex-1 rounded bg-[var(--amber-light)] border border-[var(--border)]" />
        </div>
        <div className="flex gap-1">
          <div className="h-4 flex-1 rounded bg-[var(--green-light)] border border-[var(--border)]" />
          <div className="h-4 flex-1 rounded bg-[var(--red-light)] border border-[var(--border)]" />
        </div>
      </div>
    </div>
  );
}

function StepVisual3() {
  return (
    <div className="flex items-center gap-3 px-3">
      <div className="w-8 h-8 rounded-lg bg-[var(--green-light)] flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--green)]" />
          <div className="h-1.5 flex-1 rounded bg-[var(--green)] opacity-30" />
          <div className="h-1.5 w-8 rounded bg-[var(--green)]" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--amber)]" />
          <div className="h-1.5 flex-1 rounded bg-[var(--amber)] opacity-30" />
          <div className="h-1.5 w-6 rounded bg-[var(--amber)]" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--red)]" />
          <div className="h-1.5 flex-1 rounded bg-[var(--red)] opacity-30" />
          <div className="h-1.5 w-10 rounded bg-[var(--red)]" />
        </div>
      </div>
    </div>
  );
}

/* ─── Feature icons (inline SVG, Lucide-style) ─── */
function FeatureIcon({ index }: { index: number }) {
  const cls = "text-[var(--blue)]";
  const s = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5 } as const;

  switch (index) {
    case 0: return <svg {...s} className={cls}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 5L2 7"/></svg>;
    case 1: return <svg {...s} className={cls}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case 2: return <svg {...s} className={cls}><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="4"/></svg>;
    case 3: return <svg {...s} className={cls}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>;
    case 4: return <svg {...s} className={cls}><polyline points="22 12 18 6 13 16 8 8 2 18"/></svg>;
    case 5: return <svg {...s} className={cls}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;
    case 6: return <svg {...s} className={cls}><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;
    case 7: return <svg {...s} className={cls}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h.01M7 12h.01M7 17h.01M12 7h.01M12 12h.01M12 17h.01M17 7h.01M17 12h.01M17 17h.01"/></svg>;
    case 8: return <svg {...s} className={cls}><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>;
    default: return <svg {...s} className={cls}><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>;
  }
}
