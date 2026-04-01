"use client";

import { useState, useRef } from "react";
import { useApp } from "@/components/AppProvider";
import NewsletterSubscribe from "@/components/NewsletterSubscribe";

const TYPES = [
  { key: "consumer", nl: "Consument", en: "Consumer" },
  { key: "gemeente", nl: "Gemeente", en: "Municipality" },
  { key: "aid_org", nl: "Hulporganisatie", en: "Aid Organization" },
  { key: "company", nl: "Bedrijf", en: "Business" },
] as const;

type ContactType = (typeof TYPES)[number]["key"];

const SUBJECTS: Record<ContactType, { nl: string; en: string }[]> = {
  consumer: [
    { nl: "Vragen over de app", en: "Questions about the app" },
    { nl: "Privacy & AVG", en: "Privacy & GDPR" },
    { nl: "Foutmelding / bug", en: "Bug report" },
    { nl: "Overig", en: "Other" },
  ],
  gemeente: [
    { nl: "Samenwerking / pilot", en: "Partnership / pilot" },
    { nl: "Vroegsignalering", en: "Early detection" },
    { nl: "Vermelding schuldhulp resources", en: "Debt aid resource listing" },
    { nl: "Technische vragen", en: "Technical questions" },
    { nl: "Overig", en: "Other" },
  ],
  aid_org: [
    { nl: "Samenwerking", en: "Partnership" },
    { nl: "Vermelding als hulporganisatie", en: "Listing as aid organization" },
    { nl: "Doorverwijzing van cliënten", en: "Client referrals" },
    { nl: "Technische vragen", en: "Technical questions" },
    { nl: "Overig", en: "Other" },
  ],
  company: [
    { nl: "Samenwerking / sponsoring", en: "Partnership / sponsorship" },
    { nl: "API / integratie", en: "API / integration" },
    { nl: "Commercieel voorstel", en: "Commercial proposal" },
    { nl: "Overig", en: "Other" },
  ],
};

const T = {
  nl: {
    title: "Contact",
    subtitle: "Vraag, opmerking of wil je samenwerken? We horen graag van je.",
    name: "Naam",
    email: "E-mailadres",
    company: "Organisatie / Gemeente naam",
    subject: "Onderwerp",
    message: "Bericht",
    messagePlaceholder: "Waar kunnen we je mee helpen?",
    newsletter: "Houd mij op de hoogte via de nieuwsbrief",
    send: "Verstuur bericht",
    sending: "Verzenden...",
    success: "Bedankt!",
    successMsg: "We nemen zo snel mogelijk contact met je op. Meestal reageren we binnen 24 uur.",
    error: "Er ging iets mis. Probeer het opnieuw.",
    info: "Hoe kun je ons bereiken",
    newsletterTitle: "Nieuwsbrief",
  },
  en: {
    title: "Contact",
    subtitle: "Question, feedback, or want to partner up? We'd love to hear from you.",
    name: "Name",
    email: "Email address",
    company: "Organization / Municipality name",
    subject: "Subject",
    message: "Message",
    messagePlaceholder: "How can we help you?",
    newsletter: "Keep me updated via the newsletter",
    send: "Send message",
    sending: "Sending...",
    success: "Thank you!",
    successMsg: "We'll get back to you as soon as possible. Usually within 24 hours.",
    error: "Something went wrong. Please try again.",
    info: "How to reach us",
    newsletterTitle: "Newsletter",
  },
};

export default function ContactPage() {
  const { lang } = useApp();
  const isNl = lang === "nl";
  const t = T[lang];

  const [type, setType] = useState<ContactType>("consumer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [subscribe, setSubscribe] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  // Anti-spam
  const formLoadedAt = useRef(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);

  const isB2B = type !== "consumer";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          type,
          companyName: isB2B ? company : undefined,
          subject: subject || SUBJECTS[type][0][lang],
          message,
          lang,
          subscribeNewsletter: subscribe,
          // Anti-spam fields
          website: honeypotRef.current?.value || "",
          _t: formLoadedAt.current,
        }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="py-16 px-6 min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-[960px]">
        <h1
          className="mb-2 text-[32px] font-bold leading-tight"
          style={{ color: "var(--navy)", letterSpacing: "-0.03em" }}
        >
          {t.title}
        </h1>
        <p className="mb-8 text-[15px]" style={{ color: "var(--muted)" }}>
          {t.subtitle}
        </p>

        {/* Type tabs */}
        <div className="mb-6 flex flex-wrap gap-1.5 rounded-[10px] p-1" style={{ background: "var(--border)" }}>
          {TYPES.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setType(item.key);
                setSubject("");
                setStatus("idle");
              }}
              className="flex-1 min-w-[90px] rounded-[8px] px-3 py-2 text-[12px] font-semibold transition-all"
              style={{
                background: type === item.key ? "var(--surface)" : "transparent",
                color: type === item.key ? "var(--navy)" : "var(--muted)",
                boxShadow: type === item.key ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
              }}
            >
              {item[lang]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_340px]">
          {/* ── Form Card ───────────────────────── */}
          <div
            className="rounded-[16px] border p-8"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          >
            {status === "success" ? (
              <div className="py-8 text-center">
                <div
                  className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ background: "#ECFDF5" }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="text-[18px] font-bold" style={{ color: "var(--navy)" }}>{t.success}</h3>
                <p className="mt-2 text-[14px]" style={{ color: "var(--muted)" }}>{t.successMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot — hidden from humans, bots auto-fill it */}
                <input
                  ref={honeypotRef}
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, width: 0 }}
                />

                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold" style={{ color: "var(--muted)" }}>{t.name} *</label>
                  <input
                    required value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-[8px] border px-3.5 py-2.5 text-[13px] outline-none"
                    style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--text)" }}
                    placeholder={isNl ? "Je naam" : "Your name"}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold" style={{ color: "var(--muted)" }}>{t.email} *</label>
                  <input
                    required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-[8px] border px-3.5 py-2.5 text-[13px] outline-none"
                    style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--text)" }}
                    placeholder={isNl ? "je@email.nl" : "you@email.com"}
                  />
                </div>

                {/* Company (B2B only) */}
                {isB2B && (
                  <div>
                    <label className="mb-1.5 block text-[12px] font-semibold" style={{ color: "var(--muted)" }}>{t.company}</label>
                    <input
                      value={company} onChange={(e) => setCompany(e.target.value)}
                      className="w-full rounded-[8px] border px-3.5 py-2.5 text-[13px] outline-none"
                      style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--text)" }}
                      placeholder={isNl ? "Naam van je organisatie" : "Organization name"}
                    />
                  </div>
                )}

                {/* Subject */}
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold" style={{ color: "var(--muted)" }}>{t.subject}</label>
                  <select
                    value={subject} onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-[8px] border px-3.5 py-2.5 text-[13px] outline-none"
                    style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--text)" }}
                  >
                    {SUBJECTS[type].map((s) => (
                      <option key={s[lang]} value={s[lang]}>{s[lang]}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold" style={{ color: "var(--muted)" }}>{t.message} *</label>
                  <textarea
                    required rows={5} value={message} onChange={(e) => setMessage(e.target.value)}
                    className="w-full resize-y rounded-[8px] border px-3.5 py-2.5 text-[13px] outline-none"
                    style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--text)", fontFamily: "inherit" }}
                    placeholder={t.messagePlaceholder}
                  />
                </div>

                {/* Newsletter opt-in */}
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox" checked={subscribe} onChange={(e) => setSubscribe(e.target.checked)}
                    className="h-4 w-4 rounded accent-[var(--blue)]"
                  />
                  <span className="text-[12px]" style={{ color: "var(--muted)" }}>{t.newsletter}</span>
                </label>

                {status === "error" && (
                  <p className="text-[12px] font-medium" style={{ color: "var(--red)" }}>{t.error}</p>
                )}

                <button
                  type="submit" disabled={status === "sending"}
                  className="w-full rounded-[8px] py-3 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ background: "var(--blue)" }}
                >
                  {status === "sending" ? t.sending : t.send}
                </button>
              </form>
            )}
          </div>

          {/* ── Sidebar ─────────────────────────── */}
          <div className="space-y-6">
            {/* Company info */}
            <div
              className="rounded-[16px] border p-6"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h3 className="mb-4 text-[15px] font-bold" style={{ color: "var(--navy)" }}>{t.info}</h3>
              <div className="space-y-3 text-[13px]" style={{ color: "var(--muted)" }}>
                <div className="flex items-start gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-0.5 flex-shrink-0"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <div>
                    <p className="font-semibold" style={{ color: "var(--navy)" }}>info@paywatch.nl</p>
                    <p>{isNl ? "Algemene vragen" : "General inquiries"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-0.5 flex-shrink-0"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
                  <div>
                    <p className="font-semibold" style={{ color: "var(--navy)" }}>samba@paywatch.nl</p>
                    <p>{isNl ? "Partnerships & samenwerkingen" : "Partnerships & collaborations"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-0.5 flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  <div>
                    <p className="font-semibold" style={{ color: "var(--navy)" }}>Rotterdam, Nederland</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="mb-3 text-[15px] font-bold" style={{ color: "var(--navy)" }}>{t.newsletterTitle}</h3>
              <NewsletterSubscribe lang={lang} variant="compact" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
