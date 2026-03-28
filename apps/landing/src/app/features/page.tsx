"use client";

import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import ScrollReveal from "@/components/ScrollReveal";
import { siteConfig } from "@/lib/config";
import { featurePages } from "@/lib/feature-pages";

export default function FeaturesPage() {
  const { lang, t } = useApp();

  return (
    <div className="bg-[var(--bg)]">
      {/* ─── Hero ─── */}
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-4 sm:px-6 sm:pt-20 sm:pb-8 text-center">
        <ScrollReveal>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--navy)] tracking-tight">
            {t.features.title}
          </h1>
          <p className="text-base text-[var(--muted)] mt-3 max-w-xl mx-auto">
            {t.features.subtitle}
          </p>
        </ScrollReveal>
      </div>

      {/* ─── Features Grid ─── */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featurePages.map((feature, i) => (
            <ScrollReveal key={feature.slug} delay={i * 60}>
              <Link
                href={`/features/${feature.slug}`}
                className="group block rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 hover:border-[var(--blue)] transition-all h-full"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{feature.icon}</span>
                  <h2 className="text-base font-bold text-[var(--navy)] group-hover:text-[var(--blue)] transition-colors">
                    {feature.overview.title[lang]}
                  </h2>
                </div>
                <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">
                  {feature.overview.desc[lang]}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--blue)]">
                  {lang === "nl" ? "Meer lezen" : "Read more"}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-1">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* ─── CTA ─── */}
      <div className="bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 text-center">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-[var(--navy)]">{t.cta.title}</h2>
            <p className="text-sm text-[var(--muted)] mt-2 mb-6">{t.cta.subtitle}</p>
            <Link
              href={`https://${siteConfig.appDomain}`}
              className="inline-flex rounded bg-[var(--blue)] px-8 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              {t.cta.button}
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
