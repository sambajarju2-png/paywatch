"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import type { JobListing } from "@/lib/config";

export default function JobsPage() {
  const { lang, t } = useApp();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);

  /* Fetch from Sanity (via API), with hardcoded fallback handled server-side */
  useEffect(() => {
    fetch("/api/job-listings")
      .then((r) => r.json())
      .then((d) => {
        if (d.jobs) setJobs(d.jobs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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

  if (loading) {
    return (
      <div className="bg-[var(--bg)]">
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-4 sm:px-6 sm:pt-20 sm:pb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--navy)] tracking-tight">{t.jobs.title}</h1>
          <p className="text-base text-[var(--muted)] mt-3 max-w-xl mx-auto">{t.jobs.subtitle}</p>
        </div>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 pb-16">
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 animate-pulse">
                <div className="h-5 w-48 bg-[var(--border)] rounded mb-3" />
                <div className="h-4 w-32 bg-[var(--border)] rounded mb-4" />
                <div className="h-3 w-full bg-[var(--border)] rounded mb-2" />
                <div className="h-3 w-2/3 bg-[var(--border)] rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg)]">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-4 sm:px-6 sm:pt-20 sm:pb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--navy)] tracking-tight">{t.jobs.title}</h1>
        <p className="text-base text-[var(--muted)] mt-3 max-w-xl mx-auto">{t.jobs.subtitle}</p>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 pb-16 sm:pb-24">
        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-base text-[var(--muted)]">{t.jobs.noJobs}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {jobs.map((job) => (
              <div key={job.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 hover:border-[var(--blue)] transition-colors">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <h2 className="text-lg font-bold text-[var(--navy)]">{job.title[lang]}</h2>
                    <p className="text-sm text-[var(--muted)] mt-0.5">{job.department[lang]}</p>
                  </div>
                  <span
                    className="inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-semibold"
                    style={{
                      color: locationColors[job.location],
                      background: `color-mix(in srgb, ${locationColors[job.location]} 10%, transparent)`,
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: locationColors[job.location] }} />
                    {locationLabels[job.location]}
                  </span>
                </div>

                <p className="text-base font-extrabold text-[var(--blue)] mb-3">{job.salary[lang]}</p>
                <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">{job.description[lang]}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.requirements[lang].slice(0, 3).map((req, i) => (
                    <span key={i} className="inline-flex items-center rounded border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1 text-xs text-[var(--text)]">{req}</span>
                  ))}
                  {job.requirements[lang].length > 3 && (
                    <span className="inline-flex items-center rounded border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1 text-xs text-[var(--muted)]">+{job.requirements[lang].length - 3}</span>
                  )}
                </div>

                <div className="flex gap-3">
                  <Link href={`/jobs/${job.id}`} className="inline-flex rounded border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--text)] hover:border-[var(--blue)] transition-colors">
                    {t.jobs.readMore}
                  </Link>
                  <Link href={`/jobs/${job.id}#apply`} className="inline-flex rounded bg-[var(--blue)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
                    {t.jobs.apply} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
