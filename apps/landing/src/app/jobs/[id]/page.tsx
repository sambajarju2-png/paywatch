"use client";

import { useState } from "react";
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

  const locLabels: Record<string, string> = { remote: t.jobs.remote, hybrid: t.jobs.hybrid, office: t.jobs.office };
  const locColors: Record<string, string> = { remote: "var(--green)", hybrid: "var(--blue)", office: "var(--amber)" };

  return (
    <div className="bg-[var(--bg)]">
      <div className="mx-auto max-w-3xl px-4 pt-8 pb-16 sm:px-6 sm:pt-16 sm:pb-24">
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
            <span className="inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold"
              style={{ color: locColors[job.location], background: `color-mix(in srgb, ${locColors[job.location]} 10%, transparent)` }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: locColors[job.location] }} />
              {locLabels[job.location]}
            </span>
          </div>
          <p className="text-2xl font-extrabold text-[var(--blue)] mb-4">{job.salary}</p>
          <p className="text-base text-[var(--text)] leading-relaxed">{job.longDescription[lang]}</p>
          <div className="mt-6">
            <a href="#apply" className="inline-flex rounded bg-[var(--blue)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
              {t.jobs.apply} →
            </a>
          </div>
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

        {/* Perks */}
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

        {/* Apply form */}
        <div id="apply" className="scroll-mt-24">
          <ApplyForm jobId={job.id} jobTitle={job.title[lang]} lang={lang} />
        </div>
      </div>
    </div>
  );
}

function ApplyForm({ jobId, jobTitle, lang }: { jobId: string; jobTitle: string; lang: "nl" | "en" }) {
  const isNl = lang === "nl";
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, jobId, jobTitle, lang }),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border-2 border-[var(--green)] bg-[var(--surface)] p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-[var(--green-light)] flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3 className="text-lg font-bold text-[var(--navy)] mb-2">
          {isNl ? "Bedankt voor je sollicitatie!" : "Thanks for applying!"}
        </h3>
        <p className="text-sm text-[var(--muted)] max-w-sm mx-auto">
          {isNl
            ? "We hebben je aanmelding ontvangen en nemen zo snel mogelijk contact met je op. Check je e-mail voor een bevestiging."
            : "We've received your application and will get back to you as soon as possible. Check your email for a confirmation."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-[var(--blue)] bg-[var(--surface)] p-6 sm:p-8">
      <h2 className="text-xl font-bold text-[var(--navy)] mb-1">
        {isNl ? `Solliciteer als ${jobTitle}` : `Apply as ${jobTitle}`}
      </h2>
      <p className="text-sm text-[var(--muted)] mb-6">
        {isNl
          ? "Vul het formulier in en we nemen zo snel mogelijk contact op."
          : "Fill in the form and we'll get back to you as soon as possible."}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
            {isNl ? "Naam" : "Name"} *
          </label>
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]" />
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
            {isNl ? "E-mailadres" : "Email"} *
          </label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]" />
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
            {isNl ? "Telefoonnummer" : "Phone number"}
          </label>
          <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder={isNl ? "Optioneel" : "Optional"}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]" />
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
            {isNl ? "Bericht / motivatie" : "Message / motivation"}
          </label>
          <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder={isNl ? "Vertel ons over jezelf en waarom je bij PayWatch wilt werken..." : "Tell us about yourself and why you want to work at PayWatch..."}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)] resize-none" />
        </div>

        {status === "error" && (
          <p className="text-sm text-[var(--red)]">{isNl ? "Er ging iets mis. Probeer het opnieuw." : "Something went wrong. Please try again."}</p>
        )}

        <button type="submit" disabled={status === "sending"}
          className="w-full rounded-lg bg-[var(--blue)] py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 transition-opacity">
          {status === "sending" ? "..." : (isNl ? "Sollicitatie versturen" : "Submit application")}
        </button>
      </form>
    </div>
  );
}
