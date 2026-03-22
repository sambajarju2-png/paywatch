"use client";

import { useState } from "react";

/**
 * NewsletterSubscribe — Drop into any page or footer.
 *
 * Props:
 *   lang: "nl" | "en" (from useApp() or parent)
 *   variant: "full" (card with tabs) | "compact" (inline for footer)
 */

const TABS = [
  { key: "consumer", nl: "Consument", en: "Consumer" },
  { key: "gemeente", nl: "Gemeente", en: "Municipality" },
  { key: "aid_org", nl: "Hulporganisatie", en: "Aid Organization" },
  { key: "company", nl: "Bedrijf", en: "Business" },
] as const;

type AudienceType = (typeof TABS)[number]["key"];

const T = {
  nl: {
    title: "Blijf op de hoogte",
    subtitle: "Ontvang updates, tips en nieuws van PayWatch — afgestemd op jouw rol.",
    name: "Naam",
    email: "E-mailadres",
    company: "Organisatie / Gemeente",
    consent: "Ik ga akkoord met het ontvangen van marketinge-mails van PayWatch. Je kunt je op elk moment uitschrijven.",
    subscribe: "Aanmelden",
    subscribing: "Bezig...",
    success: "Bedankt voor je aanmelding!",
    successSub: "Je ontvangt binnenkort je eerste nieuwsbrief.",
    error: "Er ging iets mis. Probeer het opnieuw.",
    required: "Vul alle verplichte velden in en ga akkoord met de voorwaarden.",
    privacy: "Lees ons",
    privacyLink: "privacybeleid",
  },
  en: {
    title: "Stay in the loop",
    subtitle: "Get updates, tips, and news from PayWatch — tailored to your role.",
    name: "Name",
    email: "Email address",
    company: "Organization / Municipality",
    consent: "I agree to receive marketing emails from PayWatch. You can unsubscribe at any time.",
    subscribe: "Subscribe",
    subscribing: "Subscribing...",
    success: "Thanks for subscribing!",
    successSub: "You'll receive your first newsletter soon.",
    error: "Something went wrong. Please try again.",
    required: "Please fill in all required fields and accept the terms.",
    privacy: "Read our",
    privacyLink: "privacy policy",
  },
};

export default function NewsletterSubscribe({
  lang = "nl",
  variant = "full",
}: {
  lang?: "nl" | "en";
  variant?: "full" | "compact";
}) {
  const [tab, setTab] = useState<AudienceType>("consumer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const t = T[lang];
  const isB2B = tab !== "consumer";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !consent) {
      setErrorMsg(t.required);
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: name || undefined,
          companyName: isB2B ? company || undefined : undefined,
          audienceType: tab,
          language: lang,
          marketingConsent: true,
        }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(t.error);
      }
    } catch {
      setStatus("error");
      setErrorMsg(t.error);
    }
  }

  if (status === "success") {
    return (
      <div
        className={`rounded-[16px] border border-[var(--border)] bg-[var(--surface)] ${
          variant === "full" ? "p-8" : "p-6"
        } text-center`}
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#ECFDF5]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="text-[16px] font-bold text-[var(--navy)]">{t.success}</p>
        <p className="mt-1 text-[13px] text-[var(--muted)]">{t.successSub}</p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-[16px] border border-[var(--border)] bg-[var(--surface)] ${
        variant === "full" ? "p-8" : "p-6"
      }`}
    >
      {variant === "full" && (
        <div className="mb-6 text-center">
          <h3 className="text-[20px] font-bold text-[var(--navy)]">{t.title}</h3>
          <p className="mt-1 text-[14px] text-[var(--muted)]">{t.subtitle}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-5 flex flex-wrap gap-1.5 rounded-[10px] bg-[var(--bg,#F4F7FB)] p-1">
        {TABS.map((item) => (
          <button
            key={item.key}
            onClick={() => { setTab(item.key); setStatus("idle"); setErrorMsg(""); }}
            className={`flex-1 min-w-[80px] rounded-[8px] px-3 py-2 text-[12px] font-semibold transition-all ${
              tab === item.key
                ? "bg-[var(--surface,#fff)] text-[var(--navy,#0A2540)] shadow-sm"
                : "text-[var(--muted,#64748B)] hover:text-[var(--navy,#0A2540)]"
            }`}
          >
            {item[lang]}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.name}
          className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg,#F4F7FB)] px-3.5 py-2.5 text-[13px] text-[var(--text)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--blue)] focus:ring-2 focus:ring-[var(--blue)]/10"
        />

        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={`${t.email} *`}
          className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg,#F4F7FB)] px-3.5 py-2.5 text-[13px] text-[var(--text)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--blue)] focus:ring-2 focus:ring-[var(--blue)]/10"
        />

        {isB2B && (
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder={t.company}
            className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg,#F4F7FB)] px-3.5 py-2.5 text-[13px] text-[var(--text)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--blue)] focus:ring-2 focus:ring-[var(--blue)]/10"
          />
        )}

        {/* Marketing consent checkbox */}
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-[var(--border)] accent-[var(--blue)]"
          />
          <span className="text-[12px] leading-[1.5] text-[var(--muted)]">
            {t.consent}
          </span>
        </label>

        {errorMsg && (
          <p className="text-[12px] font-medium text-[var(--red,#DC2626)]">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-[8px] bg-[var(--blue)] py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === "sending" ? t.subscribing : t.subscribe}
        </button>

        <p className="text-center text-[11px] text-[var(--muted)]">
          {t.privacy}{" "}
          <a href="/privacy" className="underline hover:text-[var(--blue)]">
            {t.privacyLink}
          </a>
          .
        </p>
      </form>
    </div>
  );
}
