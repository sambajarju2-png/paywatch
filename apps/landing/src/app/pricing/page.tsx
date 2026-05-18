"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import { siteConfig } from "@/lib/config";

type AudienceTab = "consumer" | "gemeente" | "hulp";

const PLANS = {
  free: {
    monthly: 0,
    yearly: 0,
    features: {
      nl: [
        "5 min PayBuddy bellen/maand",
        "15 AI chats per dag",
        "2 bezwaarschriften/maand",
        "2 AI inzichten/maand",
        "10 scans per maand",
        "1 e-mail inbox",
      ],
      en: [
        "5 min PayBuddy calls/month",
        "15 AI chats per day",
        "2 dispute letters/month",
        "2 AI insights/month",
        "10 scans per month",
        "1 email inbox",
      ],
    },
    notIncluded: {
      nl: ["Bankrekening koppelen"],
      en: ["Bank connection"],
    },
  },
  pro: {
    monthly: 4.99,
    yearly: 44.99,
    features: {
      nl: {
        monthly: [
          "15 min PayBuddy bellen/maand",
          "30 AI chats per dag",
          "8 bezwaarschriften/maand",
          "6 AI inzichten/maand",
          "Onbeperkt scannen",
          "2 e-mail inboxen",
          "1 bankrekening koppelen",
        ],
        yearly: [
          "25 min PayBuddy bellen/maand",
          "40 AI chats per dag",
          "12 bezwaarschriften/maand",
          "8 AI inzichten/maand",
          "Onbeperkt scannen",
          "2 e-mail inboxen",
          "1 bankrekening koppelen",
        ],
      },
      en: {
        monthly: [
          "15 min PayBuddy calls/month",
          "30 AI chats per day",
          "8 dispute letters/month",
          "6 AI insights/month",
          "Unlimited scanning",
          "2 email inboxes",
          "1 bank connection",
        ],
        yearly: [
          "25 min PayBuddy calls/month",
          "40 AI chats per day",
          "12 dispute letters/month",
          "8 AI insights/month",
          "Unlimited scanning",
          "2 email inboxes",
          "1 bank connection",
        ],
      },
    },
  },
  premium: {
    monthly: 8.99,
    yearly: 79.99,
    features: {
      nl: {
        monthly: [
          "40 min PayBuddy bellen/maand",
          "Onbeperkt AI chatten",
          "Onbeperkte bezwaarschriften",
          "12 AI inzichten/maand",
          "Onbeperkt scannen",
          "4 e-mail inboxen",
          "Onbeperkt bankrekeningen",
        ],
        yearly: [
          "60 min PayBuddy bellen/maand",
          "Onbeperkt AI chatten",
          "Onbeperkte bezwaarschriften",
          "15 AI inzichten/maand",
          "Onbeperkt scannen",
          "6 e-mail inboxen",
          "Onbeperkt bankrekeningen",
        ],
      },
      en: {
        monthly: [
          "40 min PayBuddy calls/month",
          "Unlimited AI chat",
          "Unlimited dispute letters",
          "12 AI insights/month",
          "Unlimited scanning",
          "4 email inboxes",
          "Unlimited bank connections",
        ],
        yearly: [
          "60 min PayBuddy calls/month",
          "Unlimited AI chat",
          "Unlimited dispute letters",
          "15 AI insights/month",
          "Unlimited scanning",
          "6 email inboxes",
          "Unlimited bank connections",
        ],
      },
    },
  },
};

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" className="flex-shrink-0">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Cross() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" className="flex-shrink-0 opacity-40">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ── Lucide-style icons ── */
function BuildingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" />
    </svg>
  );
}

function HeartHandshakeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66" />
      <path d="m18 15-2-2" /><path d="m15 18-2-2" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function PricingPage() {
  const { lang, t } = useApp();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [audience, setAudience] = useState<AudienceTab>("consumer");

  const yearlyMonthly = (yearly: number) => (yearly / 12).toFixed(2).replace(".", ",");

  return (
    <div className="bg-[var(--bg)]">
      {/* Header */}
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-4 sm:px-6 sm:pt-20 sm:pb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--navy)] tracking-tight">
          {t.pricing.title}
        </h1>
        <p className="text-base text-[var(--muted)] mt-3 max-w-xl mx-auto">
          {t.pricing.subtitle}
        </p>

        {/* ── Audience tab switcher ── */}
        <div className="flex items-center justify-center mt-8">
          <div className="flex items-center bg-[var(--surface)] border border-[var(--border)] rounded-xl p-1 gap-0.5">
            {([
              { key: "consumer" as AudienceTab, label: t.pricing.tabConsumer, icon: <UsersIcon /> },
              { key: "gemeente" as AudienceTab, label: t.pricing.tabGemeente, icon: <BuildingIcon /> },
              { key: "hulp" as AudienceTab, label: t.pricing.tabHulp, icon: <HeartHandshakeIcon /> },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setAudience(tab.key)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  audience === tab.key
                    ? "bg-[var(--navy)] text-white shadow-sm"
                    : "text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                <span className={`hidden sm:inline-flex ${audience === tab.key ? "text-white/80" : "text-[var(--muted)]"}`}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────────── CONSUMER TAB ─────────────────── */}
      {audience === "consumer" && (
        <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-16 sm:pb-24">
          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex items-center bg-[var(--surface)] border border-[var(--border)] rounded-xl p-1">
              <button
                onClick={() => setBilling("monthly")}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  billing === "monthly"
                    ? "bg-[var(--navy)] text-white"
                    : "text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                {t.pricing.monthly}
              </button>
              <button
                onClick={() => setBilling("yearly")}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  billing === "yearly"
                    ? "bg-[var(--navy)] text-white"
                    : "text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                {t.pricing.yearly}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  billing === "yearly"
                    ? "bg-white/20 text-white"
                    : "bg-[var(--green-light)] text-[var(--green)]"
                }`}>
                  {t.pricing.yearlyDiscount}
                </span>
              </button>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {/* ─── Free ─── */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 flex flex-col">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-[var(--navy)]">{t.pricing.free}</h2>
                <p className="text-sm text-[var(--muted)] mt-1">{t.pricing.freeDesc}</p>
                <p className="text-4xl font-extrabold text-[var(--navy)] mt-4">
                  &euro; 0
                </p>
                <p className="text-xs text-[var(--muted)] mt-1">
                  {lang === "nl" ? "Voor altijd" : "Forever"}
                </p>
              </div>

              <Link
                href={`https://${siteConfig.appDomain}`}
                className="block w-full text-center rounded-lg bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-sm font-semibold text-[var(--navy)] hover:bg-[var(--bg)] transition-colors mb-6"
              >
                {t.pricing.startFree}
              </Link>

              <div className="flex flex-col gap-3 flex-1">
                {PLANS.free.features[lang].map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check />
                    <span className="text-sm text-[var(--text)]">{f}</span>
                  </div>
                ))}
                {PLANS.free.notIncluded[lang].map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Cross />
                    <span className="text-sm text-[var(--muted)] line-through opacity-60">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── Pro ─── */}
            <div className="rounded-2xl border-2 border-[var(--blue)] bg-[var(--surface)] p-6 sm:p-7 relative flex flex-col">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-[var(--blue)] px-4 py-1 text-xs font-semibold text-white">
                  {t.pricing.popular}
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[var(--navy)]">{t.pricing.pro}</h2>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" className="text-[var(--blue)]">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <p className="text-sm text-[var(--muted)] mt-1">{t.pricing.proDesc}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[var(--navy)]">
                    &euro; {billing === "monthly" ? "4,99" : yearlyMonthly(PLANS.pro.yearly)}
                  </span>
                  <span className="text-sm text-[var(--muted)]">{t.pricing.perMonth}</span>
                </div>
                {billing === "yearly" && (
                  <p className="text-xs text-[var(--blue)] font-semibold mt-1">
                    &euro; {PLANS.pro.yearly.toFixed(2).replace(".", ",")}{t.pricing.perYear}
                  </p>
                )}
              </div>

              <Link
                href={`https://${siteConfig.appDomain}`}
                className="block w-full text-center rounded-lg bg-[var(--blue)] px-4 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity mb-6"
              >
                {t.pricing.upgrade}
              </Link>

              <div className="flex flex-col gap-3 flex-1">
                {PLANS.pro.features[lang][billing].map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check />
                    <span className="text-sm text-[var(--text)]">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── Premium ─── */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-500/30 bg-[var(--surface)] p-6 sm:p-7 relative flex flex-col">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-amber-500 px-4 py-1 text-xs font-semibold text-white">
                  {t.pricing.bestValue}
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[var(--navy)]">{t.pricing.premium}</h2>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2">
                    <path d="M2 4l3 12h14l3-12-5 4-5-6-5 6-5-4z" />
                    <path d="M5 16h14v4H5z" />
                  </svg>
                </div>
                <p className="text-sm text-[var(--muted)] mt-1">{t.pricing.premiumDesc}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[var(--navy)]">
                    &euro; {billing === "monthly" ? "8,99" : yearlyMonthly(PLANS.premium.yearly)}
                  </span>
                  <span className="text-sm text-[var(--muted)]">{t.pricing.perMonth}</span>
                </div>
                {billing === "yearly" && (
                  <p className="text-xs text-amber-600 font-semibold mt-1">
                    &euro; {PLANS.premium.yearly.toFixed(2).replace(".", ",")}{t.pricing.perYear}
                  </p>
                )}
              </div>

              <Link
                href={`https://${siteConfig.appDomain}`}
                className="block w-full text-center rounded-lg bg-amber-500 px-4 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity mb-6"
              >
                {t.pricing.upgrade}
              </Link>

              <div className="flex flex-col gap-3 flex-1">
                {PLANS.premium.features[lang][billing].map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check />
                    <span className="text-sm text-[var(--text)]">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ section */}
          <div className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
            <h3 className="text-lg font-bold text-[var(--navy)] mb-4 text-center">
              {lang === "nl" ? "Veelgestelde vragen" : "FAQ"}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 max-w-3xl mx-auto">
              {[
                {
                  q: { nl: "Kan ik ook gratis blijven gebruiken?", en: "Can I keep using it for free?" },
                  a: { nl: "Ja, het gratis plan blijft altijd beschikbaar. Je kunt op elk moment upgraden.", en: "Yes, the free plan is always available. You can upgrade anytime." },
                },
                {
                  q: { nl: "Hoe werkt de 14-daagse proefperiode?", en: "How does the 14-day trial work?" },
                  a: { nl: "Je krijgt 14 dagen gratis toegang tot alle Pro of Premium functies. Je wordt pas na de proefperiode gefactureerd.", en: "You get 14 days free access to all Pro or Premium features. You\u2019ll only be charged after the trial." },
                },
                {
                  q: { nl: "Kan ik op elk moment opzeggen?", en: "Can I cancel anytime?" },
                  a: { nl: "Ja, je kunt op elk moment opzeggen. Je houdt toegang tot het einde van je lopende periode.", en: "Yes, you can cancel anytime. You keep access until the end of your current period." },
                },
                {
                  q: { nl: "Is mijn data veilig?", en: "Is my data safe?" },
                  a: { nl: "Absoluut. Alle data wordt verwerkt en opgeslagen binnen de EU. Onze AI-modellen draaien op eigen servers (Scaleway, EU).", en: "Absolutely. All data is processed and stored within the EU. Our AI models run on our own servers (Scaleway, EU)." },
                },
              ].map((faq, i) => (
                <div key={i} className="rounded-xl bg-[var(--bg)] p-4">
                  <p className="text-sm font-semibold text-[var(--navy)] mb-1">{faq.q[lang]}</p>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{faq.a[lang]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────── GEMEENTE & INCASSO TAB ─────────────────── */}
      {audience === "gemeente" && (
        <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-16 sm:pb-24">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--navy)] tracking-tight">
              {t.pricing.b2bTitle}
            </h2>
            <p className="text-base text-[var(--muted)] mt-3 max-w-2xl mx-auto leading-relaxed">
              {t.pricing.b2bSubtitle}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
            {/* Setup fee card */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--blue)]/10 flex items-center justify-center text-[var(--blue)]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v4" /><path d="m6.8 15-3.5 2" /><path d="m20.7 17-3.5-2" />
                    <path d="M6.3 20.1a10 10 0 0 1 11.4 0" /><path d="M12 12a4 4 0 0 0-4 4" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--navy)]">{t.pricing.b2bSetup}</h3>
                  <p className="text-sm text-[var(--muted)]">{t.pricing.b2bSetupDesc}</p>
                </div>
              </div>
              <div className="mt-auto pt-4 border-t border-[var(--border)]">
                <p className="text-2xl font-extrabold text-[var(--navy)]">{t.pricing.b2bCustom}</p>
                <p className="text-xs text-[var(--muted)] mt-1">{t.pricing.b2bCustomDesc}</p>
              </div>
            </div>

            {/* Per-user card */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--blue)]/10 flex items-center justify-center text-[var(--blue)]">
                  <UsersIcon />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--navy)]">{t.pricing.b2bPerUser}</h3>
                  <p className="text-sm text-[var(--muted)]">{t.pricing.b2bPerUserDesc}</p>
                </div>
              </div>
              <div className="mt-auto pt-4 border-t border-[var(--border)]">
                <p className="text-2xl font-extrabold text-[var(--navy)]">{t.pricing.b2bCustom}</p>
                <p className="text-xs text-[var(--muted)] mt-1">{t.pricing.b2bCustomDesc}</p>
              </div>
            </div>
          </div>

          {/* Features + CTA */}
          <div className="mt-8 rounded-2xl border-2 border-[var(--blue)] bg-[var(--surface)] p-6 sm:p-8 max-w-3xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {t.pricing.b2bFeatures.map((f: string, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  <Check />
                  <span className="text-sm text-[var(--text)]">{f}</span>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--blue)] px-8 py-3.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                {t.pricing.b2bCta}
                <ArrowRightIcon />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────── HULPORGANISATIES TAB ─────────────────── */}
      {audience === "hulp" && (
        <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-16 sm:pb-24">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--navy)] tracking-tight">
              {t.pricing.hulpTitle}
            </h2>
            <p className="text-base text-[var(--muted)] mt-3 max-w-2xl mx-auto leading-relaxed">
              {t.pricing.hulpSubtitle}
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            {/* Free card */}
            <div className="rounded-2xl border-2 border-emerald-400 bg-[var(--surface)] p-6 sm:p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-emerald-500 px-4 py-1 text-xs font-semibold text-white">
                  {t.pricing.hulpFree}
                </span>
              </div>

              <div className="text-center mb-6">
                <p className="text-5xl font-extrabold text-[var(--navy)] mt-2">
                  &euro; 0
                </p>
                <p className="text-sm text-[var(--muted)] mt-1">{t.pricing.hulpFreeDesc}</p>
              </div>

              <div className="flex flex-col gap-3 mb-8">
                {t.pricing.hulpFeatures.map((f: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check />
                    <span className="text-sm text-[var(--text)]">{f}</span>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-8 py-3.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  {t.pricing.hulpCta}
                  <ArrowRightIcon />
                </Link>
              </div>
            </div>

            {/* Social mission callout */}
            <div className="mt-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 p-6 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 mb-3">
                <HeartHandshakeIcon />
              </div>
              <h3 className="text-base font-bold text-[var(--navy)] mb-2">{t.pricing.hulpWhy}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed max-w-md mx-auto">
                {t.pricing.hulpWhyDesc}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
