"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import ScrollReveal from "@/components/ScrollReveal";
import SanityImage from "@/components/SanityImage";
import FeatureIcon from "@/components/FeatureIcon";
import { siteConfig } from "@/lib/config";
import { howItWorksGuides, faqItems, faqCategories } from "@/lib/support-content";

type Tab = "how-it-works" | "faq";
type FaqCategory = "all" | "general" | "scanning" | "features" | "privacy" | "account";

export default function SupportPage() {
  const { lang, t } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>("how-it-works");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<FaqCategory>("all");
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  /* ── FAQ filtering ── */
  const filteredFaqs = useMemo(() => {
    let items = faqItems;

    if (activeCategory !== "all") {
      items = items.filter((f) => f.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (f) =>
          f.question[lang].toLowerCase().includes(q) ||
          f.answer[lang].toLowerCase().includes(q)
      );
    }

    return items;
  }, [activeCategory, searchQuery, lang]);

  const popularFaqs = faqItems.filter((f) => f.popular);

  return (
    <div className="bg-[var(--bg)] min-h-screen">
      {/* ─── Hero ─── */}
      <div className="mx-auto max-w-4xl px-4 pt-12 pb-6 sm:px-6 sm:pt-20 sm:pb-10 text-center">
        <ScrollReveal>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--navy)] tracking-tight">
            {lang === "nl" ? "Hulp & uitleg" : "Help & guides"}
          </h1>
          <p className="text-base text-[var(--muted)] mt-3 max-w-lg mx-auto">
            {lang === "nl"
              ? "Leer hoe PayWatch werkt of zoek antwoord op je vraag."
              : "Learn how PayWatch works or find the answer to your question."}
          </p>
        </ScrollReveal>
      </div>

      {/* ─── Tab bar ─── */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="flex border-b border-[var(--border)]">
          <button
            onClick={() => setActiveTab("how-it-works")}
            className={`flex-1 py-3 text-sm font-semibold text-center transition-colors border-b-2 ${
              activeTab === "how-it-works"
                ? "border-[var(--blue)] text-[var(--blue)]"
                : "border-transparent text-[var(--muted)] hover:text-[var(--navy)]"
            }`}
          >
            {lang === "nl" ? "Hoe het werkt" : "How it works"}
          </button>
          <button
            onClick={() => setActiveTab("faq")}
            className={`flex-1 py-3 text-sm font-semibold text-center transition-colors border-b-2 ${
              activeTab === "faq"
                ? "border-[var(--blue)] text-[var(--blue)]"
                : "border-transparent text-[var(--muted)] hover:text-[var(--navy)]"
            }`}
          >
            {lang === "nl" ? "Veelgestelde vragen" : "FAQ"}
          </button>
        </div>
      </div>

      {/* ─── Tab Content ─── */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-8 pb-16 sm:pb-24">
        {activeTab === "how-it-works" && (
          <div className="space-y-6">
            {howItWorksGuides.map((guide, i) => (
              <ScrollReveal key={guide.id} delay={i * 60}>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
                  {/* Guide header */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--blue-light)]">
                        <FeatureIcon name={guide.icon} size={20} className="text-[var(--blue)]" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-[var(--navy)]">
                          {guide.title[lang]}
                        </h2>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">
                      {guide.intro[lang]}
                    </p>

                    {/* Steps */}
                    <div className="space-y-3 mb-4">
                      {guide.steps.map((step, si) => (
                        <div key={si} className="flex gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--blue)] flex items-center justify-center mt-0.5">
                            <span className="text-xs font-bold text-white">{si + 1}</span>
                          </div>
                          <p className="text-sm text-[var(--text)] leading-relaxed">
                            {step.text[lang]}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Tip */}
                    {guide.tip && (
                      <div className="rounded-lg bg-[var(--blue-light)] p-3 flex gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.5" className="flex-shrink-0 mt-0.5">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 16v-4M12 8h.01" />
                        </svg>
                        <p className="text-xs text-[var(--navy)] leading-relaxed">
                          {guide.tip[lang]}
                        </p>
                      </div>
                    )}

                    {/* Link to feature page */}
                    {guide.relatedFeature && (
                      <Link
                        href={`/features/${guide.relatedFeature}`}
                        className="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-[var(--blue)] hover:underline"
                      >
                        {lang === "nl" ? "Meer over deze functie" : "More about this feature"}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                  </div>

                  {/* Screenshot / Arcade embed placeholder */}
                  <div className="border-t border-[var(--border)]">
                    <SanityImage
                      imageKey={guide.imageKey}
                      placeholderLabel={guide.title[lang]}
                      className="w-full aspect-[16/9] bg-[var(--bg)]"
                    />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

        {activeTab === "faq" && (
          <div>
            {/* Search bar */}
            <div className="relative mb-6">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" className="absolute left-3 top-1/2 -translate-y-1/2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === "nl" ? "Zoek een vraag..." : "Search for a question..."}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-10 pr-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--blue)] transition-colors"
              />
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap gap-2 mb-8">
              {(Object.keys(faqCategories) as FaqCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                    activeCategory === cat
                      ? "bg-[var(--blue)] text-white"
                      : "bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] hover:border-[var(--blue)] hover:text-[var(--navy)]"
                  }`}
                >
                  {faqCategories[cat][lang]}
                </button>
              ))}
            </div>

            {/* Popular FAQs — only show when no search and on "all" category */}
            {!searchQuery && activeCategory === "all" && popularFaqs.length > 0 && (
              <div className="mb-8">
                <h2 className="text-sm font-bold text-[var(--navy)] uppercase tracking-wide mb-4">
                  {lang === "nl" ? "Meestgestelde vragen" : "Most asked questions"}
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {popularFaqs.map((faq) => (
                    <button
                      key={faq.id}
                      onClick={() => {
                        setOpenFaqId(openFaqId === faq.id ? null : faq.id);
                      }}
                      className="text-left rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-[var(--blue)] transition-colors"
                    >
                      <p className="text-sm font-semibold text-[var(--navy)]">
                        {faq.question[lang]}
                      </p>
                      {openFaqId === faq.id && (
                        <p className="text-xs text-[var(--muted)] mt-2 leading-relaxed">
                          {faq.answer[lang]}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* All FAQs — accordion */}
            <div className="space-y-2">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-[var(--muted)]">
                    {lang === "nl"
                      ? "Geen resultaten gevonden. Probeer andere zoekwoorden."
                      : "No results found. Try different keywords."}
                  </p>
                </div>
              ) : (
                filteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between p-4 text-left"
                    >
                      <span className="text-sm font-semibold text-[var(--navy)] pr-4">
                        {faq.question[lang]}
                      </span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--muted)"
                        strokeWidth="2"
                        className={`flex-shrink-0 transition-transform ${
                          openFaqId === faq.id ? "rotate-180" : ""
                        }`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    {openFaqId === faq.id && (
                      <div className="px-4 pb-4 border-t border-[var(--border)] pt-3">
                        <p className="text-sm text-[var(--muted)] leading-relaxed">
                          {faq.answer[lang]}
                        </p>
                        {faq.relatedFeature && (
                          <Link
                            href={`/features/${faq.relatedFeature}`}
                            className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-[var(--blue)] hover:underline"
                          >
                            {lang === "nl" ? "Meer hierover" : "Learn more"}
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* ─── CTA ─── */}
      <div className="bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 text-center">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-[var(--navy)]">
              {lang === "nl" ? "Nog vragen?" : "Still have questions?"}
            </h2>
            <p className="text-sm text-[var(--muted)] mt-2 mb-6">
              {lang === "nl"
                ? "Neem contact op — we helpen je graag."
                : "Get in touch — we're happy to help."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/contact"
                className="rounded bg-[var(--blue)] px-8 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                {lang === "nl" ? "Contact opnemen" : "Contact us"}
              </Link>
              <Link
                href={`https://${siteConfig.appDomain}`}
                className="rounded border border-[var(--border)] bg-[var(--bg)] px-6 py-3 text-sm font-semibold text-[var(--text)] hover:border-[var(--blue)] transition-colors"
              >
                {t.cta.button}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
