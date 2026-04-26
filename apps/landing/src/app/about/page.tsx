"use client";

import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import SanityImage from "@/components/SanityImage";
import ScrollReveal from "@/components/ScrollReveal";
import { founders } from "@/lib/config";

export default function AboutPage() {
  const { lang, t } = useApp();

  return (
    <div className="bg-[var(--bg)]">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-4 sm:px-6 sm:pt-20 sm:pb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--navy)] tracking-tight">{t.about.title}</h1>
        <p className="text-base text-[var(--muted)] mt-3 max-w-xl mx-auto">{t.about.subtitle}</p>
      </div>

      {/* Story */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pb-12">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10">
          <p className="text-base text-[var(--text)] leading-relaxed">{t.about.story}</p>
          <div className="mt-8 pt-6 border-t border-[var(--border)]">
            <h3 className="text-lg font-bold text-[var(--navy)] mb-2">{t.about.missionTitle}</h3>
            <p className="text-base text-[var(--muted)] leading-relaxed italic">&ldquo;{t.about.mission}&rdquo;</p>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-12 sm:pb-16">
        <h2 className="text-xl font-bold text-[var(--navy)] text-center mb-8">
          {lang === "nl" ? "Ons team" : "Our team"}
        </h2>
        <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
          {founders.map((person) => (
            <Link
              key={person.name}
              href={`/about/${person.slug}`}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 w-full sm:w-80 hover:border-[var(--blue)] hover:shadow-lg transition-all"
            >
              <SanityImage
                imageKey={`about-${person.name.toLowerCase()}`}
                placeholderLabel={person.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-[var(--border)] mx-auto mb-4 overflow-hidden group-hover:border-[var(--blue)] transition-colors"
              />

              <div className="text-center">
                <h3 className="text-lg font-bold text-[var(--navy)] group-hover:text-[var(--blue)] transition-colors">{person.fullName || person.name}</h3>
                <p className="text-sm font-medium text-[var(--blue)] mb-3">{person.role[lang]}</p>
                <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">{person.bio[lang]}</p>

                <div className="flex items-center justify-center gap-3">
                  {person.linkedin && (
                    <span
                      onClick={(e) => { e.preventDefault(); window.open(person.linkedin, '_blank'); }}
                      className="w-9 h-9 rounded-lg border border-[var(--border)] flex items-center justify-center hover:border-[var(--blue)] transition-colors cursor-pointer"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--muted)">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </span>
                  )}
                  {person.email && (
                    <span
                      onClick={(e) => { e.preventDefault(); window.location.href = `mailto:${person.email}`; }}
                      className="w-9 h-9 rounded-lg border border-[var(--border)] flex items-center justify-center hover:border-[var(--blue)] transition-colors cursor-pointer"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5">
                        <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 5L2 7" />
                      </svg>
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--blue)] font-medium mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  {lang === "nl" ? "Lees meer" : "Read more"} →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Jobs link */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pb-12">
        <ScrollReveal>
          <Link
            href="/jobs"
            className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--blue)] hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[var(--text)] group-hover:text-[var(--blue)] transition-colors">
                {lang === "nl" ? "Werken bij PayWatch" : "Work at PayWatch"}
              </p>
              <p className="text-xs text-[var(--muted)]">
                {lang === "nl" ? "Bekijk onze openstaande vacatures" : "View our open positions"}
              </p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" className="shrink-0 group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </ScrollReveal>
      </div>

      {/* Company info */}
      <div className="bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 text-center">
          <h3 className="text-lg font-bold text-[var(--navy)] mb-4">PayWatch</h3>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-[var(--muted)]">
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>Rotterdam, Netherlands</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <span>KVK: 83474889</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 5L2 7"/></svg>
              <a href="mailto:info@paywatch.nl" className="hover:text-[var(--blue)] transition-colors">info@paywatch.nl</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
