"use client";

import { useState } from "react";
import { useApp } from "@/components/AppProvider";
import { siteConfig, contactSubjects } from "@/lib/config";

export default function ContactPage() {
  const { lang, t } = useApp();
  const isNl = lang === "nl";

  const [form, setForm] = useState({ name: "", email: "", type: "consumer" as "consumer" | "business", companyName: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const subjects = contactSubjects[form.type][lang];

  function handleTypeChange(type: "consumer" | "business") {
    setForm({ ...form, type, subject: "", companyName: "" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, lang }),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", type: "consumer", companyName: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="bg-[var(--bg)]">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-4 sm:px-6 sm:pt-20 sm:pb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--navy)] tracking-tight">{t.contact.title}</h1>
        <p className="text-base text-[var(--muted)] mt-3">{t.contact.subtitle}</p>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid gap-8 sm:grid-cols-5">
          <div className="sm:col-span-3">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
              {status === "sent" ? (
                <div className="text-center py-12">
                  <div className="w-14 h-14 rounded-full bg-[var(--green-light)] flex items-center justify-center mx-auto mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <p className="text-base font-semibold text-[var(--navy)]">{t.contact.success}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Type toggle */}
                  <div>
                    <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">{t.contact.typeLabel}</label>
                    <div className="flex gap-2 bg-[var(--bg)] rounded-lg border border-[var(--border)] p-1">
                      {(["consumer", "business"] as const).map((type) => (
                        <button key={type} type="button" onClick={() => handleTypeChange(type)}
                          className={`flex-1 rounded-md py-2.5 text-sm font-semibold transition-colors ${form.type === type ? "bg-[var(--surface)] text-[var(--text)] shadow-sm" : "text-[var(--muted)]"}`}>
                          {type === "consumer" ? t.contact.typeConsumer : t.contact.typeBusiness}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Company name — only visible for business */}
                  {form.type === "business" && (
                    <div>
                      <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
                        {isNl ? "Bedrijfsnaam / Gemeente" : "Company name / Municipality"}
                      </label>
                      <input type="text" required value={form.companyName}
                        onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                        placeholder={isNl ? "Bijv. Gemeente Rotterdam" : "E.g. Municipality of Rotterdam"}
                        className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]" />
                    </div>
                  )}

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">{t.contact.nameLabel}</label>
                    <input type="text" required value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]" />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">{t.contact.emailLabel}</label>
                    <input type="email" required value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]" />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">{t.contact.subjectLabel}</label>
                    <select required value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)] appearance-none"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}>
                      <option value="" disabled>{isNl ? "Kies een onderwerp..." : "Choose a subject..."}</option>
                      {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">{t.contact.messageLabel}</label>
                    <textarea required rows={5} value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)] resize-none" />
                  </div>

                  <button type="submit" disabled={status === "sending"}
                    className="rounded bg-[var(--blue)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50">
                    {status === "sending" ? "..." : t.contact.send}
                  </button>

                  {status === "error" && (
                    <p className="text-sm text-[var(--red)]">{isNl ? "Er ging iets mis. Probeer het opnieuw." : "Something went wrong. Please try again."}</p>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="sm:col-span-2">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <h3 className="text-base font-bold text-[var(--navy)] mb-4">{t.contact.info}</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-xs font-medium text-[var(--muted)] mb-0.5">{isNl ? "Bedrijf" : "Company"}</p>
                  <p className="text-sm font-semibold text-[var(--text)]">{siteConfig.company.name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--muted)] mb-0.5">KVK</p>
                  <p className="text-sm font-semibold text-[var(--text)]">{siteConfig.company.kvk}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--muted)] mb-0.5">{isNl ? "Locatie" : "Location"}</p>
                  <p className="text-sm font-semibold text-[var(--text)]">{siteConfig.company.location}</p>
                </div>
                <div className="border-t border-[var(--border)] pt-4">
                  <p className="text-xs font-medium text-[var(--muted)] mb-2">E-mail</p>
                  <div className="flex flex-col gap-2">
                    <a href={`mailto:${siteConfig.company.emails.info}`} className="text-sm text-[var(--blue)] hover:underline">{siteConfig.company.emails.info}</a>
                    <a href={`mailto:${siteConfig.company.emails.business}`} className="text-sm text-[var(--blue)] hover:underline">{siteConfig.company.emails.business}</a>
                    <a href={`mailto:${siteConfig.company.emails.press}`} className="text-sm text-[var(--blue)] hover:underline">{siteConfig.company.emails.press}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
