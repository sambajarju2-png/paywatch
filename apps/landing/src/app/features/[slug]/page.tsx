"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useApp } from "@/components/AppProvider";
import ScrollReveal from "@/components/ScrollReveal";
import SanityImage from "@/components/SanityImage";
import FeatureIcon from "@/components/FeatureIcon";
import { siteConfig } from "@/lib/config";
import { getFeatureBySlug, featurePages } from "@/lib/feature-pages";

export default function FeatureDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { lang, t } = useApp();
  const feature = getFeatureBySlug(slug);

  if (!feature) {
    return (
      <div className="bg-[var(--bg)] min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--navy)] mb-2">
            {lang === "nl" ? "Pagina niet gevonden" : "Page not found"}
          </h1>
          <Link href="/features" className="text-sm text-[var(--blue)] hover:underline">
            ← {lang === "nl" ? "Terug naar functies" : "Back to features"}
          </Link>
        </div>
      </div>
    );
  }

  const relatedFeatures = feature.relatedSlugs
    .map((s) => featurePages.find((f) => f.slug === s))
    .filter(Boolean);

  return (
    <div className="bg-[var(--bg)]">
      {/* ─── Breadcrumb ─── */}
      <div className="mx-auto max-w-4xl px-4 pt-6 sm:px-6">
        <Link href="/features" className="inline-flex items-center gap-1 text-xs text-[var(--muted)] hover:text-[var(--blue)] transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {lang === "nl" ? "Alle functies" : "All features"}
        </Link>
      </div>

      {/* ─── Hero ─── */}
      <section className="mx-auto max-w-4xl px-4 pt-4 pb-8 sm:px-6 sm:pt-8 sm:pb-12">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--blue-light)]">
              <FeatureIcon name={feature.icon} size={20} className="text-[var(--blue)]" />
            </div>
            <span className="text-xs font-semibold text-[var(--blue)] uppercase tracking-wide">
              {lang === "nl" ? "Functie" : "Feature"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--navy)] tracking-tight leading-tight">
            {feature.hero.title[lang]}
          </h1>
          <p className="text-base sm:text-lg text-[var(--muted)] mt-4 max-w-2xl leading-relaxed">
            {feature.hero.subtitle[lang]}
          </p>
        </ScrollReveal>
        {/* Hero image — first section image doubles as hero visual */}
        <ScrollReveal delay={200}>
          <div className="mt-8">
            <SanityImage
              imageKey={feature.sections[0]?.imageKey}
              placeholderLabel={feature.hero.title[lang]}
              className="w-full rounded-2xl overflow-hidden aspect-[16/9] bg-[var(--surface)] border border-[var(--border)]"
            />
          </div>
        </ScrollReveal>
      </section>

      {/* ─── Content Sections — alternating text / image ─── */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-16 sm:pb-24">
        {feature.sections.map((section, i) => {
          /* First section image is already shown as hero, so skip it */
          const isEven = i % 2 === 0;
          return (
            <ScrollReveal key={i} direction={isEven ? "left" : "right"}>
              <div className={`flex flex-col gap-8 py-10 ${i < feature.sections.length - 1 ? "border-b border-[var(--border)]" : ""} sm:flex-row sm:items-center ${isEven ? "" : "sm:flex-row-reverse"}`}>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-[var(--navy)] mb-3">
                    {section.heading[lang]}
                  </h2>
                  <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
                    {section.text[lang]}
                  </p>
                </div>
                {/* Image from Sanity CMS */}
                {i > 0 && (
                  <div className="flex-1 flex justify-center">
                    <SanityImage
                      imageKey={section.imageKey}
                      placeholderLabel={section.heading[lang]}
                      className="w-full max-w-sm aspect-[4/5] rounded-2xl overflow-hidden"
                    />
                  </div>
                )}
              </div>
            </ScrollReveal>
          );
        })}
      </section>

      {/* ─── Related Features ─── */}
      {relatedFeatures.length > 0 && (
        <section className="bg-[var(--surface)] border-t border-[var(--border)]">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
            <ScrollReveal>
              <h2 className="text-lg font-bold text-[var(--navy)] mb-6">
                {lang === "nl" ? "Gerelateerde functies" : "Related features"}
              </h2>
            </ScrollReveal>
            <div className="grid gap-4 sm:grid-cols-3">
              {relatedFeatures.map((related, i) => (
                <ScrollReveal key={related!.slug} delay={i * 80}>
                  <Link
                    href={`/features/${related!.slug}`}
                    className="group block rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 hover:border-[var(--blue)] transition-all h-full"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--blue-light)]">
                        <FeatureIcon name={related!.icon} size={16} className="text-[var(--blue)]" />
                      </div>
                      <h3 className="text-sm font-bold text-[var(--navy)] group-hover:text-[var(--blue)] transition-colors">
                        {related!.overview.title[lang]}
                      </h3>
                    </div>
                    <p className="text-xs text-[var(--muted)] leading-relaxed">
                      {related!.overview.desc[lang]}
                    </p>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA ─── */}
      <section className="bg-[var(--bg)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 text-center">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-[var(--navy)]">{t.cta.title}</h2>
            <p className="text-sm text-[var(--muted)] mt-2 mb-6">{t.cta.subtitle}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`https://${siteConfig.appDomain}`}
                className="rounded bg-[var(--blue)] px-8 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                {t.cta.button}
              </Link>
              <Link
                href="/features"
                className="rounded border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--text)] hover:border-[var(--blue)] transition-colors"
              >
                {lang === "nl" ? "Alle functies bekijken" : "View all features"}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
