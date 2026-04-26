"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import ScrollReveal from "@/components/ScrollReveal";
import { comparisons } from "@/lib/comparison-data";

const softCompetitors = [
  {
    slug: "schuldhulpmaatje",
    name: "SchuldHulpMaatje",
    domain: "schuldhulpmaatje.nl",
    color: "#059669",
    market: "Nederland",
    tagline: {
      nl: "Vrijwilligersorganisatie die mensen met schulden koppelt aan een getrainde buddy. Actief in 138 gemeenten met 2.000+ vrijwilligers.",
      en: "Volunteer organization connecting people with debts to a trained buddy. Active in 138 municipalities with 2,000+ volunteers.",
    },
  },
];

type Tab = "software" | "organisaties";

function LogoImg({ domain, name, size = 40 }: { domain: string; name: string; size?: number }) {
  return (
    <img
      src={`https://img.logo.dev/${domain}?token=pk_RLZzD1KxRrCpEywuCrIRRw&size=${size * 2}&format=png`}
      alt={`${name} logo`}
      width={size}
      height={size}
      className="rounded-xl object-contain"
      loading="lazy"
      onError={(e) => {
        const el = e.currentTarget;
        el.style.display = "none";
        const fallback = el.nextElementSibling as HTMLElement;
        if (fallback) fallback.style.display = "flex";
      }}
    />
  );
}

export default function VergelijkingIndex() {
  const { lang } = useApp();
  const [tab, setTab] = useState<Tab>("software");

  return (
    <div className="bg-[var(--bg)]">
      <section className="mx-auto max-w-4xl px-4 pt-10 pb-16 sm:px-6 sm:pt-16 sm:pb-20">
        <ScrollReveal>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--navy)] tracking-tight mb-3">
            {lang === "nl" ? "PayWatch vergeleken" : "PayWatch compared"}
          </h1>
          <p className="text-base text-[var(--muted)] max-w-2xl mb-8">
            {lang === "nl"
              ? "Ontdek hoe PayWatch verschilt van andere apps en organisaties. Eerlijk, transparant, en altijd eerlijk over wat we wel en niet doen."
              : "Discover how PayWatch differs from other apps and organizations. Honest, transparent, and always upfront about what we do and don't do."}
          </p>
        </ScrollReveal>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setTab("software")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              tab === "software"
                ? "bg-[var(--blue)] text-white shadow-[0_4px_14px_rgba(37,99,235,0.25)]"
                : "bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)] hover:border-[var(--blue)] hover:text-[var(--text)]"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            {`Software (${comparisons.length})`}
          </button>
          <button
            onClick={() => setTab("organisaties")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              tab === "organisaties"
                ? "bg-emerald-600 text-white shadow-[0_4px_14px_rgba(5,150,105,0.25)]"
                : "bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)] hover:border-emerald-500 hover:text-[var(--text)]"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
            {lang === "nl" ? `Organisaties (${softCompetitors.length})` : `Organizations (${softCompetitors.length})`}
          </button>
        </div>

        {/* Software tab */}
        {tab === "software" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {comparisons.map((c, i) => (
              <ScrollReveal key={c.slug} delay={i * 60}>
                <Link
                  href={`/vergelijking/${c.slug}`}
                  className="group relative block rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden hover:border-[var(--blue)] hover:shadow-lg transition-all h-full"
                >
                  {/* Top accent bar */}
                  <div className="h-1 w-full" style={{ background: c.color }} />
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      {/* Logo from Logo.dev */}
                      <div className="relative w-10 h-10 shrink-0">
                        <LogoImg domain={c.url} name={c.name} size={40} />
                        {/* Fallback letter avatar (hidden by default, shown on error) */}
                        <div
                          className="w-10 h-10 rounded-xl items-center justify-center text-base font-extrabold text-white hidden absolute inset-0"
                          style={{ background: c.color }}
                        >
                          {c.name.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-[var(--text)] group-hover:text-[var(--blue)] transition-colors truncate">
                          PayWatch vs {c.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold text-[var(--muted)] uppercase tracking-wider">{c.market}</span>
                          <span className="text-[var(--border)]">·</span>
                          <span className="text-[10px] text-[var(--muted)]">{c.pricing[lang]}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--muted)] leading-relaxed mb-4 line-clamp-2">
                      {c.tagline[lang]}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--blue)] group-hover:gap-2 transition-all">
                        {lang === "nl" ? "Vergelijk" : "Compare"}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </span>
                      <span className="text-[10px] text-[var(--muted)] font-medium">{c.url}</span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* Organisaties tab */}
        {tab === "organisaties" && (
          <div className="space-y-4">
            {softCompetitors.map((c, i) => (
              <ScrollReveal key={c.slug} delay={i * 80}>
                <Link
                  href={`/vergelijking/${c.slug}`}
                  className="group block rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/10 overflow-hidden hover:border-emerald-400 hover:shadow-lg transition-all"
                >
                  <div className="h-1 w-full bg-emerald-500" />
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="relative w-12 h-12 shrink-0">
                        <LogoImg domain={c.domain} name={c.name} size={48} />
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 items-center justify-center text-lg font-extrabold text-emerald-700 dark:text-emerald-400 hidden absolute inset-0">
                          {c.name.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="text-lg font-bold text-[var(--text)] group-hover:text-emerald-600 transition-colors">
                            PayWatch en {c.name}
                          </p>
                          <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {lang === "nl" ? "Aanbevolen" : "Recommended"}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--muted)] leading-relaxed mb-3">
                          {c.tagline[lang]}
                        </p>
                        <p className="text-xs text-[var(--muted)] mb-3">
                          {lang === "nl"
                            ? "Geen concurrent maar een aanrader. Deze organisatie helpt waar PayWatch stopt. Samen dekken ze het hele traject van preventie tot oplossing."
                            : "Not a competitor but recommended. This organization helps where PayWatch stops. Together they cover the full journey from prevention to resolution."}
                        </p>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:gap-2 transition-all">
                          {lang === "nl" ? "Bekijk aanbeveling" : "View recommendation"}
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}

            <ScrollReveal delay={160}>
              <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg)] p-6 text-center">
                <p className="text-sm text-[var(--muted)]">
                  {lang === "nl"
                    ? "Meer organisaties volgen binnenkort: Geldfit, Nibud, NVVK"
                    : "More organizations coming soon: Geldfit, Nibud, NVVK"}
                </p>
              </div>
            </ScrollReveal>
          </div>
        )}

        {/* Category link */}
        <ScrollReveal>
          <Link
            href="/app-voor-schulden-voorkomen"
            className="mt-8 flex items-center gap-4 rounded-2xl bg-[var(--navy)] p-5 hover:shadow-xl transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white group-hover:text-blue-200 transition-colors">
                {lang === "nl" ? "Beste app om schulden te voorkomen (2026)" : "Best app to prevent debts (2026)"}
              </p>
              <p className="text-xs text-white/60">
                {lang === "nl" ? "Vergelijk alle categorien: budget apps, coaching apps en schuldpreventie" : "Compare all categories: budget apps, coaching apps and debt prevention"}
              </p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" className="shrink-0 opacity-50 group-hover:translate-x-1 group-hover:opacity-100 transition-all"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </ScrollReveal>
      </section>
    </div>
  );
}
