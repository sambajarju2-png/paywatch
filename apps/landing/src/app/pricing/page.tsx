"use client";

import { useState, useRef, useEffect } from "react";
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

function CheckCircleIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

/* ── Reusable B2B Demo Request Form ── */
function DemoRequestForm({
  formType,
  accentColor,
  t,
  lang,
}: {
  formType: "gemeente" | "hulp";
  accentColor: string;
  t: any;
  lang: "nl" | "en";
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    role: "",
    request_type: formType === "gemeente" ? "gemeente" : "hulporganisatie",
    estimated_users: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const timestampRef = useRef(Date.now());

  // Reset timestamp when form mounts / tab switches
  useEffect(() => {
    timestampRef.current = Date.now();
  }, [formType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.organization) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          lang,
          _t: timestampRef.current,
          website: "", // honeypot — must be empty
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4"><CheckCircleIcon /></div>
        <h3 className="text-xl font-bold text-[var(--navy)] mb-2">{t.pricing.formSuccess}</h3>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)] focus:border-[ACCENT] focus:ring-2 focus:ring-[ACCENT]/10 transition-colors".replaceAll(
      "ACCENT",
      accentColor
    );

  return (
    <div className="flex flex-col gap-3">
      {/* Honeypot — hidden from humans, bots will fill it */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, width: 0 }}
        name="website"
      />

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-[var(--navy)] mb-1">
            {t.pricing.formName} <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className={inputClass}
            placeholder="Jan de Vries"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--navy)] mb-1">
            {t.pricing.formEmail} <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className={inputClass}
            placeholder="jan@gemeente.nl"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-[var(--navy)] mb-1">
            {t.pricing.formOrg} <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="organization"
            required
            value={form.organization}
            onChange={handleChange}
            className={inputClass}
            placeholder={formType === "gemeente" ? "Gemeente Rotterdam" : "Stichting SchuldHulpMaatje"}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--navy)] mb-1">
            {t.pricing.formPhone}
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className={inputClass}
            placeholder="06-12345678"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-[var(--navy)] mb-1">
            {t.pricing.formRole}
          </label>
          <input
            type="text"
            name="role"
            value={form.role}
            onChange={handleChange}
            className={inputClass}
            placeholder={lang === "nl" ? "Beleidsadviseur" : "Policy advisor"}
          />
        </div>
        {formType === "gemeente" ? (
          <div>
            <label className="block text-xs font-semibold text-[var(--navy)] mb-1">
              {t.pricing.formTypeLabel}
            </label>
            <select
              name="request_type"
              value={form.request_type}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="gemeente">{t.pricing.formTypeGemeente}</option>
              <option value="incasso">{t.pricing.formTypeIncasso}</option>
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-[var(--navy)] mb-1">
              {t.pricing.formUsers}
            </label>
            <select
              name="estimated_users"
              value={form.estimated_users}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">—</option>
              {t.pricing.formUsersOptions.map((o: string) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {formType === "gemeente" && (
        <div>
          <label className="block text-xs font-semibold text-[var(--navy)] mb-1">
            {t.pricing.formUsers}
          </label>
          <select
            name="estimated_users"
            value={form.estimated_users}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">—</option>
            {t.pricing.formUsersOptions.map((o: string) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-[var(--navy)] mb-1">
          {t.pricing.formMessage}
        </label>
        <textarea
          name="message"
          rows={3}
          value={form.message}
          onChange={handleChange}
          className={inputClass + " resize-none"}
          placeholder={lang === "nl" ? "Vertel ons meer over jullie situatie..." : "Tell us more about your situation..."}
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-500 font-medium">{t.pricing.formError}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={status === "submitting" || !form.name || !form.email || !form.organization}
        className="w-full rounded-lg px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: accentColor }}
      >
        {status === "submitting"
          ? t.pricing.formSubmitting
          : formType === "hulp"
          ? t.pricing.formSubmitAccess
          : t.pricing.formSubmitDemo}
      </button>
    </div>
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
                <p className="text-4xl font-extrabold text-[var(--navy)] mt-4">&euro; 0</p>
                <p className="text-xs text-[var(--muted)] mt-1">{lang === "nl" ? "Voor altijd" : "Forever"}</p>
              </div>
              <Link
                href={`https://${siteConfig.appDomain}`}
                className="block w-full text-center rounded-lg bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-sm font-semibold text-[var(--navy)] hover:bg-[var(--bg)] transition-colors mb-6"
              >
                {t.pricing.startFree}
              </Link>
              <div className="flex flex-col gap-3 flex-1">
                {PLANS.free.features[lang].map((f, i) => (
                  <div key={i} className="flex items-start gap-3"><Check /><span className="text-sm text-[var(--text)]">{f}</span></div>
                ))}
                {PLANS.free.notIncluded[lang].map((f, i) => (
                  <div key={i} className="flex items-start gap-3"><Cross /><span className="text-sm text-[var(--muted)] line-through opacity-60">{f}</span></div>
                ))}
              </div>
            </div>

            {/* ─── Pro ─── */}
            <div className="rounded-2xl border-2 border-[var(--blue)] bg-[var(--surface)] p-6 sm:p-7 relative flex flex-col">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-[var(--blue)] px-4 py-1 text-xs font-semibold text-white">{t.pricing.popular}</span>
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[var(--navy)]">{t.pricing.pro}</h2>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                </div>
                <p className="text-sm text-[var(--muted)] mt-1">{t.pricing.proDesc}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[var(--navy)]">&euro; {billing === "monthly" ? "4,99" : yearlyMonthly(PLANS.pro.yearly)}</span>
                  <span className="text-sm text-[var(--muted)]">{t.pricing.perMonth}</span>
                </div>
                {billing === "yearly" && (
                  <p className="text-xs text-[var(--blue)] font-semibold mt-1">&euro; {PLANS.pro.yearly.toFixed(2).replace(".", ",")}{t.pricing.perYear}</p>
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
                  <div key={i} className="flex items-start gap-3"><Check /><span className="text-sm text-[var(--text)]">{f}</span></div>
                ))}
              </div>
            </div>

            {/* ─── Premium ─── */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-500/30 bg-[var(--surface)] p-6 sm:p-7 relative flex flex-col">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-amber-500 px-4 py-1 text-xs font-semibold text-white">{t.pricing.bestValue}</span>
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[var(--navy)]">{t.pricing.premium}</h2>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2"><path d="M2 4l3 12h14l3-12-5 4-5-6-5 6-5-4z" /><path d="M5 16h14v4H5z" /></svg>
                </div>
                <p className="text-sm text-[var(--muted)] mt-1">{t.pricing.premiumDesc}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[var(--navy)]">&euro; {billing === "monthly" ? "8,99" : yearlyMonthly(PLANS.premium.yearly)}</span>
                  <span className="text-sm text-[var(--muted)]">{t.pricing.perMonth}</span>
                </div>
                {billing === "yearly" && (
                  <p className="text-xs text-amber-600 font-semibold mt-1">&euro; {PLANS.premium.yearly.toFixed(2).replace(".", ",")}{t.pricing.perYear}</p>
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
                  <div key={i} className="flex items-start gap-3"><Check /><span className="text-sm text-[var(--text)]">{f}</span></div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ section */}
          <div className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
            <h3 className="text-lg font-bold text-[var(--navy)] mb-4 text-center">{lang === "nl" ? "Veelgestelde vragen" : "FAQ"}</h3>
            <div className="grid gap-4 sm:grid-cols-2 max-w-3xl mx-auto">
              {[
                { q: { nl: "Kan ik ook gratis blijven gebruiken?", en: "Can I keep using it for free?" }, a: { nl: "Ja, het gratis plan blijft altijd beschikbaar. Je kunt op elk moment upgraden.", en: "Yes, the free plan is always available. You can upgrade anytime." } },
                { q: { nl: "Hoe werkt de 14-daagse proefperiode?", en: "How does the 14-day trial work?" }, a: { nl: "Je krijgt 14 dagen gratis toegang tot alle Pro of Premium functies. Je wordt pas na de proefperiode gefactureerd.", en: "You get 14 days free access to all Pro or Premium features. You\u2019ll only be charged after the trial." } },
                { q: { nl: "Kan ik op elk moment opzeggen?", en: "Can I cancel anytime?" }, a: { nl: "Ja, je kunt op elk moment opzeggen. Je houdt toegang tot het einde van je lopende periode.", en: "Yes, you can cancel anytime. You keep access until the end of your current period." } },
                { q: { nl: "Is mijn data veilig?", en: "Is my data safe?" }, a: { nl: "Absoluut. Alle data wordt verwerkt en opgeslagen binnen de EU. Onze AI-modellen draaien op eigen servers (Scaleway, EU).", en: "Absolutely. All data is processed and stored within the EU. Our AI models run on our own servers (Scaleway, EU)." } },
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
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--navy)] tracking-tight">{t.pricing.b2bTitle}</h2>
            <p className="text-base text-[var(--muted)] mt-3 max-w-2xl mx-auto leading-relaxed">{t.pricing.b2bSubtitle}</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-5 max-w-4xl mx-auto">
            {/* Left: pricing model + features */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-[var(--blue)]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v4" /><path d="m6.8 15-3.5 2" /><path d="m20.7 17-3.5-2" /><path d="M6.3 20.1a10 10 0 0 1 11.4 0" /><path d="M12 12a4 4 0 0 0-4 4" /><circle cx="12" cy="12" r="2" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--navy)]">{t.pricing.b2bSetup}</p>
                    <p className="text-xs text-[var(--muted)]">{t.pricing.b2bCustomDesc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-[var(--blue)]"><UsersIcon /></div>
                  <div>
                    <p className="text-sm font-bold text-[var(--navy)]">{t.pricing.b2bPerUser}</p>
                    <p className="text-xs text-[var(--muted)]">{t.pricing.b2bPerUserDesc}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <div className="flex flex-col gap-2.5">
                  {t.pricing.b2bFeatures.map((f: string, i: number) => (
                    <div key={i} className="flex items-start gap-2.5"><Check /><span className="text-sm text-[var(--text)]">{f}</span></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: form */}
            <div className="lg:col-span-3 rounded-2xl border-2 border-[var(--blue)] bg-[var(--surface)] p-6 sm:p-7">
              <h3 className="text-lg font-bold text-[var(--navy)] mb-1">{t.pricing.b2bCta}</h3>
              <p className="text-sm text-[var(--muted)] mb-5">
                {lang === "nl" ? "Vul het formulier in en we plannen een demo." : "Fill out the form and we\u2019ll schedule a demo."}
              </p>
              <DemoRequestForm formType="gemeente" accentColor="#2563EB" t={t} lang={lang} />
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────── HULPORGANISATIES TAB ─────────────────── */}
      {audience === "hulp" && (
        <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-16 sm:pb-24">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--navy)] tracking-tight">{t.pricing.hulpTitle}</h2>
            <p className="text-base text-[var(--muted)] mt-3 max-w-2xl mx-auto leading-relaxed">{t.pricing.hulpSubtitle}</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-5 max-w-4xl mx-auto">
            {/* Left: free card + social mission */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              <div className="rounded-2xl border-2 border-emerald-400 bg-[var(--surface)] p-6 relative text-center">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-emerald-500 px-4 py-1 text-xs font-semibold text-white">{t.pricing.hulpFree}</span>
                </div>
                <p className="text-5xl font-extrabold text-[var(--navy)] mt-2">&euro; 0</p>
                <p className="text-sm text-[var(--muted)] mt-1">{t.pricing.hulpFreeDesc}</p>
                <div className="flex flex-col gap-2.5 mt-5 text-left">
                  {t.pricing.hulpFeatures.map((f: string, i: number) => (
                    <div key={i} className="flex items-start gap-2.5"><Check /><span className="text-sm text-[var(--text)]">{f}</span></div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 p-5 text-center">
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 mb-2">
                  <HeartHandshakeIcon />
                </div>
                <h3 className="text-sm font-bold text-[var(--navy)] mb-1">{t.pricing.hulpWhy}</h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed">{t.pricing.hulpWhyDesc}</p>
              </div>
            </div>

            {/* Right: form */}
            <div className="lg:col-span-3 rounded-2xl border-2 border-emerald-400 bg-[var(--surface)] p-6 sm:p-7">
              <h3 className="text-lg font-bold text-[var(--navy)] mb-1">{t.pricing.hulpCta}</h3>
              <p className="text-sm text-[var(--muted)] mb-5">
                {lang === "nl" ? "Vul het formulier in en we richten jullie portaal in." : "Fill out the form and we\u2019ll set up your portal."}
              </p>
              <DemoRequestForm formType="hulp" accentColor="#059669" t={t} lang={lang} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
