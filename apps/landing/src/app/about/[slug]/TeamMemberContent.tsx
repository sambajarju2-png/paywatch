"use client";

import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import SanityImage from "@/components/SanityImage";
import ScrollReveal from "@/components/ScrollReveal";
import { founders } from "@/lib/config";

export default function TeamMemberContent({ slug }: { slug: string }) {
  const { lang } = useApp();
  const person = founders.find((f) => f.slug === slug);
  if (!person) return null;

  const other = founders.find((f) => f.slug !== slug);

  return (
    <div className="bg-[var(--bg)]">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-3xl px-4 pt-6 sm:px-6">
        <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
          <Link href="/" className="hover:text-[var(--blue)] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/about" className="hover:text-[var(--blue)] transition-colors">
            {lang === "nl" ? "Over ons" : "About"}
          </Link>
          <span>/</span>
          <span className="text-[var(--text)] font-medium">{person.fullName}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-4 pt-8 pb-10 sm:px-6 sm:pt-12 sm:pb-14">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
            {/* Photo */}
            <SanityImage
              imageKey={`about-${person.name.toLowerCase()}`}
              placeholderLabel={person.name}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover border-2 border-[var(--border)] shrink-0 overflow-hidden"
            />

            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--navy)] tracking-tight mb-1">
                {person.fullName}
              </h1>
              <p className="text-base font-medium text-[var(--blue)] mb-4">{person.role[lang]}</p>

              <div className="flex items-center justify-center sm:justify-start gap-3">
                {person.linkedin && (
                  <a
                    href={person.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)] hover:border-[var(--blue)] hover:text-[var(--blue)] transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                )}
                {person.email && (
                  <a
                    href={`mailto:${person.email}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)] hover:border-[var(--blue)] hover:text-[var(--blue)] transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 5L2 7"/></svg>
                    {person.email}
                  </a>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Full bio */}
      <section className="mx-auto max-w-3xl px-4 pb-12 sm:px-6">
        <ScrollReveal>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
            <p className="text-base text-[var(--text)] leading-relaxed whitespace-pre-line">
              {person.fullBio?.[lang] || person.bio[lang]}
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Other team member */}
      {other && (
        <section className="mx-auto max-w-3xl px-4 pb-12 sm:px-6">
          <ScrollReveal>
            <h3 className="text-base font-bold text-[var(--navy)] mb-3">
              {lang === "nl" ? "Ontmoet ook" : "Also meet"}
            </h3>
            <Link
              href={`/about/${other.slug}`}
              className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-[var(--blue)] hover:shadow-md transition-all group"
            >
              <SanityImage
                imageKey={`about-${other.name.toLowerCase()}`}
                placeholderLabel={other.name}
                className="w-12 h-12 rounded-xl object-cover border border-[var(--border)] shrink-0 overflow-hidden"
              />
              <div className="flex-1">
                <p className="text-sm font-bold text-[var(--text)] group-hover:text-[var(--blue)] transition-colors">{other.fullName}</p>
                <p className="text-xs text-[var(--muted)]">{other.role[lang]}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" className="shrink-0 group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </ScrollReveal>
        </section>
      )}

      {/* Back + CTA */}
      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] px-5 py-3 text-sm font-semibold hover:border-[var(--blue)] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              {lang === "nl" ? "Terug naar team" : "Back to team"}
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--blue)] text-white px-5 py-3 text-sm font-semibold shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)] transition-all active:scale-[0.97]"
            >
              {lang === "nl" ? "Werken bij PayWatch" : "Work at PayWatch"}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
