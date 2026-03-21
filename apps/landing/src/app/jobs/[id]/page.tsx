"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useApp } from "@/components/AppProvider";
import { jobListings } from "@/lib/config";

export default function JobDetailPage() {
  const { lang, t } = useApp();
  const params = useParams();
  const jobId = params.id as string;

  const job = jobListings.find((j) => j.id === jobId);

  if (!job) {
    return (
      <div className="bg-[var(--bg)] min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--navy)] mb-2">
            {lang === "nl" ? "Vacature niet gevonden" : "Job not found"}
          </h1>
          <Link href="/jobs" className="text-sm text-[var(--blue)] hover:underline">{t.jobs.backToJobs}</Link>
        </div>
      </div>
    );
  }

  const locationLabels: Record<string, string> = {
    remote: t.jobs.remote,
    hybrid: t.jobs.hybrid,
    office: t.jobs.office,
  };

  const locationColors: Record<string, string> = {
    remote: "var(--green)",
    hybrid: "var(--blue)",
    office: "var(--amber)",
  };

  return (
    <div className="bg-[var(--bg)]">
      <div className="mx-auto max-w-3xl px-4 pt-8 pb-16 sm:px-6 sm:pt-16 sm:pb-24">
        {/* Back link */}
        <Link href="/jobs" className="inline-flex items-center gap-1 text-sm text-[var(--blue)] hover:underline mb-6">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          {t.jobs.backToJobs}
        </Link>

        {/* Header */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--navy)]">{job.title[lang]}</h1>
              <p className="text-sm text-[var(--muted)] mt-1">{job.department[lang]} · {job.seniority}</p>
            </div>
            <span
              className="inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold"
              style={{
                color: locationColors[job.location],
                background: `color-mix(in srgb, ${locationColors[job.location]} 10%, transparent)`,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: locationColors[job.location] }} />
              {locationLabels[job.location]}
            </span>
          </div>

          <p className="text-2xl font-extrabold text-[var(--blue)] mb-4">{job.salary}</p>
          <p className="text-base text-[var(--text)] leading-relaxed">{job.longDescription[lang]}</p>
        </div>

        {/* Requirements */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 mb-4">
          <h2 className="text-lg font-bold text-[var(--navy)] mb-4">{t.jobs.requirements}</h2>
          <div className="flex flex-col gap-2.5">
            {job.requirements[lang].map((req, i) => (
              <div key={i} className="flex items-start gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" className="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="text-sm text-[var(--text)]">{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nice to have */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 mb-4">
          <h2 className="text-lg font-bold text-[var(--navy)] mb-4">{t.jobs.niceToHave}</h2>
          <div className="flex flex-col gap-2.5">
            {job.niceToHave[lang].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>
                <span className="text-sm text-[var(--text)]">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What we offer */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 mb-6">
          <h2 className="text-lg font-bold text-[var(--navy)] mb-4">{t.jobs.perks}</h2>
          <div className="flex flex-col gap-2.5">
            {job.perks[lang].map((perk, i) => (
              <div key={i} className="flex items-start gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" className="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="text-sm text-[var(--text)]">{perk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Apply CTA */}
        <div className="rounded-2xl border-2 border-[var(--blue)] bg-[var(--surface)] p-6 sm:p-8 text-center">
          <h3 className="text-lg font-bold text-[var(--navy)] mb-2">
            {lang === "nl" ? "Geïnteresseerd?" : "Interested?"}
          </h3>
          <p className="text-sm text-[var(--muted)] mb-4">
            {lang === "nl"
              ? "Stuur ons een bericht via het contactformulier. Vertel ons over jezelf en waarom je bij PayWatch wilt werken."
              : "Send us a message via the contact form. Tell us about yourself and why you want to work at PayWatch."}
          </p>
          <Link
            href="/contact"
            className="inline-flex rounded bg-[var(--blue)] px-8 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            {t.jobs.apply} →
          </Link>
        </div>
      </div>
    </div>
  );
}
