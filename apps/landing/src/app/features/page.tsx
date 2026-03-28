"use client";

import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import ScrollReveal from "@/components/ScrollReveal";
import SanityImage from "@/components/SanityImage";
import FeatureIcon from "@/components/FeatureIcon";
import { siteConfig } from "@/lib/config";
import { featurePages } from "@/lib/feature-pages";

export default function FeaturesPage() {
  const { lang, t } = useApp();

  return (
    <div className="bg-[var(--bg)]">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-4 sm:px-6 sm:pt-20 sm:pb-8 text-center">
        <ScrollReveal>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--navy)] tracking-tight">{t.features.title}</h1>
          <p className="text-base text-[var(--muted)] mt-3 max-w-xl mx-auto">{t.features.subtitle}</p>
        </ScrollReveal>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 sm:pb-24">
        {featurePages.map((feature, i) => {
          const isEven = i % 2 === 0;
          return (
            <ScrollReveal key={feature.slug} direction={isEven ? "left" : "right"}>
              <div className={`flex flex-col gap-8 py-12 border-b border-[var(--border)] last:border-b-0 sm:flex-row sm:items-center ${isEven ? "" : "sm:flex-row-reverse"}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--blue-light)]">
                      <FeatureIcon name={feature.icon} size={20} className="text-[var(--blue)]" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[var(--navy)]">{feature.overview.title[lang]}</h2>
                  </div>
                  <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed max-w-md">{feature.overview.desc[lang]}</p>
                  <Link
                    href={`/features/${feature.slug}`}
                    className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-[var(--blue)] hover:underline"
                  >
                    {lang === "nl" ? "Meer lezen" : "Read more"}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                <div className="flex-1 flex justify-center">
                  <SanityImage imageKey={`feature-detail-${i + 1}`} placeholderLabel={feature.overview.title[lang]} className="w-full max-w-sm aspect-[4/5] rounded-2xl overflow-hidden" />
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      <div className="bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 text-center">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-[var(--navy)]">{t.cta.title}</h2>
            <p className="text-sm text-[var(--muted)] mt-2 mb-6">{t.cta.subtitle}</p>
            <Link href={`https://${siteConfig.appDomain}`} className="inline-flex rounded bg-[var(--blue)] px-8 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity">{t.cta.button}</Link>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
