"use client";

import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import SanityImage from "@/components/SanityImage";
import ScrollReveal from "@/components/ScrollReveal";
import { founders } from "@/lib/config";

const TAGS: Record<string, { nl: string[]; en: string[] }> = {
  Samba: {
    nl: ["Rotterdam", "CTO & Product"],
    en: ["Rotterdam", "CTO & Product"],
  },
  Mariama: {
    nl: ["Rotterdam", "Sales & Legal"],
    en: ["Rotterdam", "Sales & Legal"],
  },
};

// What PayWatch serves
const SERVE_TAGS = {
  nl: ["Consumenten", "Incassobureaus", "Hulpinstanties", "Nutsvoorzieningen"],
  en: ["Consumers", "Collection agencies", "Aid organizations", "Utilities"],
};

const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 5L2 7"/>
  </svg>
);

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

export default function AboutPage() {
  const { lang, t } = useApp();

  return (
    <div className="bg-[var(--bg)] overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-16 sm:pt-24 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--blue)] mb-3">
              {lang === "nl" ? "Over ons" : "About us"}
            </p>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-[var(--navy)] tracking-tight leading-[1.05]">
              {lang === "nl" ? (
                <>Gebouwd voor<br />Nederland.</>
              ) : (
                <>Built for<br />the Netherlands.</>
              )}
            </h1>
          </div>
          <p className="text-base sm:text-lg text-[var(--muted)] max-w-xs leading-relaxed sm:text-right pb-1">
            {t.about.subtitle}
          </p>
        </div>
        {/* Thin accent line */}
        <div className="h-px w-full bg-[var(--border)] mt-8" />
      </section>

      {/* ── Founders ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 auto-rows-fr">
          {founders.map((person, idx) => {
            const tags = TAGS[person.name]?.[lang] || [];
            return (
              <Link
                key={person.name}
                href={`/about/${person.slug}`}
                className="group relative rounded-3xl overflow-hidden bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--blue)]/40 transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--blue)]/10 hover:-translate-y-1"
              >
                {/* Photo area */}
                <div className="relative overflow-hidden" style={{ height: "480px" }}>
                  <SanityImage
                    imageKey={`about-${person.name.toLowerCase()}`}
                    placeholderLabel={person.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" style={{ objectFit: "cover", objectPosition: "center top" }}
                  />
                  {/* Gradient overlay always present */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/80 via-[var(--navy)]/20 to-transparent" />

                  {/* Top badge */}
                  <div className="absolute top-5 left-5 flex items-center gap-2.5">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase">
                      {String(idx + 1).padStart(2, "0")} · CO-FOUNDER
                    </span>
                  </div>

                  {/* Bottom tags */}
                  <div className="absolute bottom-5 left-5 flex items-center gap-2 flex-wrap">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[10px] font-bold uppercase tracking-wider text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Hover overlay with "Lees meer" */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/95 text-[var(--navy)] text-xs font-bold shadow-lg translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      {lang === "nl" ? "Lees meer" : "Read more"} <ArrowIcon />
                    </div>
                  </div>
                </div>

                {/* Info below image */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--blue)] mb-1">
                        {person.role[lang]}
                      </p>
                      <h2 className="text-xl font-extrabold text-[var(--navy)] tracking-tight mb-2 group-hover:text-[var(--blue)] transition-colors">
                        {person.fullName || person.name}
                      </h2>
                      <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-2">
                        {person.bio[lang]}
                      </p>
                    </div>
                    {/* Social icons */}
                    <div className="flex flex-col gap-2 shrink-0 mt-1">
                      {person.linkedin && (
                        <span
                          onClick={(e) => { e.preventDefault(); window.open(person.linkedin, "_blank"); }}
                          className="w-8 h-8 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:border-[var(--blue)] hover:text-[var(--blue)] transition-all cursor-pointer"
                        >
                          <LinkedInIcon />
                        </span>
                      )}
                      {person.email && (
                        <span
                          onClick={(e) => { e.preventDefault(); window.location.href = `mailto:${person.email}`; }}
                          className="w-8 h-8 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:border-[var(--blue)] hover:text-[var(--blue)] transition-all cursor-pointer"
                        >
                          <MailIcon />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Story ── */}
      <section className="bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-20">
          <div className="grid sm:grid-cols-[1fr_2fr] gap-8 sm:gap-16 items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--blue)] mb-3">
                {lang === "nl" ? "Ons verhaal" : "Our story"}
              </p>
              <h2 className="text-2xl font-extrabold text-[var(--navy)] tracking-tight">
                {t.about.missionTitle}
              </h2>
            </div>
            <div>
              <p className="text-base text-[var(--text)] leading-relaxed mb-6">{t.about.story}</p>
              <blockquote className="border-l-2 border-[var(--blue)] pl-5">
                <p className="text-base text-[var(--navy)] font-medium italic leading-relaxed">
                  &ldquo;{t.about.mission}&rdquo;
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ── Numbers strip ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[var(--border)] rounded-2xl overflow-hidden border border-[var(--border)]">
          {(SERVE_TAGS[lang] || SERVE_TAGS.nl).map((tag) => (
            <div key={tag} className="bg-[var(--surface)] px-6 py-8 text-center">
              <p className="text-base font-extrabold text-[var(--navy)] tracking-tight leading-tight">{tag}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Jobs CTA ── */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pb-16">
        <ScrollReveal>
          <Link
            href="/jobs"
            className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--blue)] hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round">
                <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[var(--text)] group-hover:text-[var(--blue)] transition-colors">
                {lang === "nl" ? "Werken bij PayWatch" : "Work at PayWatch"}
              </p>
              <p className="text-xs text-[var(--muted)]">
                {lang === "nl" ? "Bekijk onze openstaande vacatures" : "View our open positions"}
              </p>
            </div>
            <span className="text-[var(--muted)] group-hover:translate-x-1 transition-transform">
              <ArrowIcon />
            </span>
          </Link>
        </ScrollReveal>
      </div>

      {/* ── Footer strip ── */}
      <div className="bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 text-center">
          <h3 className="text-base font-bold text-[var(--navy)] mb-3">PayWatch</h3>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-[var(--muted)]">
            <span className="flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Rotterdam, Netherlands
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              KVK: 83474889
            </span>
            <a href="mailto:info@paywatch.nl" className="flex items-center gap-1.5 hover:text-[var(--blue)] transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 5L2 7"/></svg>
              info@paywatch.nl
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
