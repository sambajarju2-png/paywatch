"use client";

import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import ScrollReveal from "@/components/ScrollReveal";
import { comparisons } from "@/lib/comparison-data";

export default function VergelijkingIndex() {
  const { lang } = useApp();

  return (
    <div className="bg-[var(--bg)]">
      <section className="mx-auto max-w-4xl px-4 pt-10 pb-16 sm:px-6 sm:pt-16 sm:pb-20">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] mb-5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            {lang === "nl" ? "SEO vergelijkingspagina's" : "SEO comparison pages"}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--navy)] tracking-tight mb-3">
            {lang === "nl"
              ? "PayWatch vergeleken"
              : "PayWatch compared"}
          </h1>
          <p className="text-base text-[var(--muted)] max-w-2xl mb-10">
            {lang === "nl"
              ? "Ontdek hoe PayWatch verschilt van andere budget- en schulden-apps. Eerlijk, transparant, en altijd eerlijk over wat we wel en niet doen."
              : "Discover how PayWatch differs from other budget and debt apps. Honest, transparent, and always upfront about what we do and don't do."}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {comparisons.map((c, i) => (
            <ScrollReveal key={c.slug} delay={i * 80}>
              <Link
                href={`/vergelijking/${c.slug}`}
                className="block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 hover:border-[var(--blue)] hover:shadow-lg transition-all group h-full"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-extrabold text-white"
                    style={{ background: c.color }}
                  >
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-base font-bold text-[var(--text)] group-hover:text-[var(--blue)] transition-colors">
                      PayWatch vs {c.name}
                    </p>
                    <p className="text-xs text-[var(--muted)]">{c.market}</p>
                  </div>
                </div>
                <p className="text-sm text-[var(--muted)] leading-relaxed mb-3">
                  {c.tagline[lang]}
                </p>
                <div className="flex items-center gap-1 text-xs font-semibold text-[var(--blue)]">
                  {lang === "nl" ? "Vergelijk" : "Compare"}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
