"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/components/AppProvider";
import ScrollReveal from "@/components/ScrollReveal";
import type { CityPage as CityPageType } from "@/lib/city-pages";

/* ─── Tab IDs ─── */
const TABS = ["overzicht", "hulp", "faq", "tips"] as const;
type TabId = (typeof TABS)[number];

interface UnsplashPhoto {
  url: string;
  small: string;
  thumb: string;
  photographer: string;
  photographerUrl: string;
  unsplashUrl: string;
  alt: string;
  width: number;
  height: number;
}

export default function CityPageComponent({ city }: { city: CityPageType }) {
  const { lang } = useApp();
  const isNl = lang === "nl";
  const [activeTab, setActiveTab] = useState<TabId>("overzicht");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [heroPhoto, setHeroPhoto] = useState<UnsplashPhoto | null>(null);
  const [orgPhoto, setOrgPhoto] = useState<UnsplashPhoto | null>(null);

  /* ── Fetch city images from Unsplash ── */
  useEffect(() => {
    async function fetchPhotos() {
      try {
        const [heroRes, orgRes] = await Promise.all([
          fetch(`/api/unsplash/city?query=${encodeURIComponent(city.unsplashQuery)}`),
          fetch(`/api/unsplash/city?query=${encodeURIComponent(city.unsplashQueryOrgs)}`),
        ]);
        if (heroRes.ok) {
          const data = await heroRes.json();
          if (data.photos?.[0]) setHeroPhoto(data.photos[0]);
        }
        if (orgRes.ok) {
          const data = await orgRes.json();
          if (data.photos?.[1]) setOrgPhoto(data.photos[1]);
        }
      } catch {
        /* Silently fail, fallback gradient shows */
      }
    }
    fetchPhotos();
  }, [city.unsplashQuery, city.unsplashQueryOrgs]);

  const tabLabels: Record<TabId, { nl: string; en: string }> = {
    overzicht: { nl: "Overzicht", en: "Overview" },
    hulp: { nl: `Hulp in ${city.name}`, en: `Help in ${city.name}` },
    faq: { nl: "Veelgestelde vragen", en: "FAQ" },
    tips: { nl: "Tips & regelingen", en: "Tips & benefits" },
  };

  return (
    <div className="bg-[var(--bg)] min-h-screen">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden" style={{ minHeight: 400 }}>
        {/* Background: City image or gradient fallback */}
        {heroPhoto ? (
          <Image
            src={heroPhoto.url}
            alt={`Stadsgezicht ${city.name}`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${city.accentColor}22 0%, ${city.accentColor}11 50%, var(--bg) 100%)`,
            }}
          />
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/75" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 pt-14 pb-10 sm:pt-20 sm:pb-14">
          {/* Top row: breadcrumb + municipality logo */}
          <div className="flex items-start justify-between mb-8">
            <nav className="flex items-center gap-2 text-sm text-white/60" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-white transition">PayWatch</Link>
              <span className="text-white/30">/</span>
              <Link href="/schuldhulp" className="hover:text-white transition">
                {isNl ? "Schuldhulp per stad" : "Debt help by city"}
              </Link>
              <span className="text-white/30">/</span>
              <span className="text-white font-medium">{city.name}</span>
            </nav>
            {/* Municipality logo */}
            <div className="hidden sm:flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2.5 border border-white/10">
              <Image
                src={`https://img.logo.dev/${city.logoDomain}?token=pk_RLZzD1KxRrCpEywuCrIRRw&size=60&format=png`}
                alt={`Logo gemeente ${city.name}`}
                width={28}
                height={28}
                className="rounded-sm"
                unoptimized
              />
              <span className="text-xs font-semibold text-white/80">Gemeente {city.name}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
            {city.heroTitle}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-white/75 max-w-2xl leading-relaxed">
            {city.heroSubtitle}
          </p>

          {/* Badges row */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            {/* Mobile logo */}
            <span className="sm:hidden inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
              <Image
                src={`https://img.logo.dev/${city.logoDomain}?token=pk_RLZzD1KxRrCpEywuCrIRRw&size=40&format=png`}
                alt={`Logo gemeente ${city.name}`}
                width={18}
                height={18}
                className="rounded-sm"
                unoptimized
              />
              <span className="text-xs font-medium text-white/80">Gemeente {city.name}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm text-xs font-medium text-white/80 border border-white/10">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              {city.province}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm text-xs font-medium text-white/80 border border-white/10">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
              {city.population} {isNl ? "inwoners" : "residents"}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm text-xs font-medium text-white/80 border border-white/10">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              {city.organizations.length} {isNl ? "hulporganisaties" : "help organizations"}
            </span>
          </div>

          {/* Stats highlight bar */}
          <div className="mt-5 flex flex-wrap gap-3">
            <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>
              </div>
              <div>
                <p className="text-[11px] font-medium text-white/50 uppercase tracking-wider">{isNl ? `Data over ${city.name}` : `${city.name} data`}</p>
                <p className="text-sm font-bold text-white leading-tight">{city.statsHighlight}</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2.5 bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              </div>
              <div>
                <p className="text-[11px] font-medium text-white/50 uppercase tracking-wider">{isNl ? "Nationaal" : "National"}</p>
                <p className="text-sm font-bold text-white leading-tight">{isNl ? "724.110 huishoudens met schulden (CBS, 2025)" : "724,110 households with debt (CBS, 2025)"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Photo credit */}
        {heroPhoto && (
          <div className="absolute bottom-2 right-3 z-10 text-[10px] text-white/50">
            Foto:{" "}
            <a href={heroPhoto.photographerUrl} target="_blank" rel="noopener noreferrer" className="underline">
              {heroPhoto.photographer}
            </a>{" / "}
            <a href={heroPhoto.unsplashUrl} target="_blank" rel="noopener noreferrer" className="underline">
              Unsplash
            </a>
          </div>
        )}

        {/* Branded diagonal stripes decoration */}
        <div className="absolute top-0 right-0 w-32 h-full sm:w-48 z-[5] pointer-events-none overflow-hidden">
          <div
            className="absolute -top-10 -right-10 w-[200%] h-[200%] origin-top-right"
            style={{
              background: `repeating-linear-gradient(
                -55deg,
                transparent,
                transparent 18px,
                ${city.accentColor}40 18px,
                ${city.accentColor}40 28px,
                transparent 28px,
                transparent 38px,
                white 38px,
                white 42px,
                transparent 42px,
                transparent 60px
              )`,
            }}
          />
        </div>
      </section>

      {/* ── Tab Navigation ── */}
      <div className="sticky top-0 z-30 bg-[var(--surface)] border-b border-[var(--border)] shadow-sm">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex overflow-x-auto scrollbar-hide gap-0 -mb-px">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-3.5 px-5 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-current text-[var(--text)]"
                    : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
                }`}
                style={activeTab === tab ? { borderColor: city.accentColor, color: city.accentColor } : {}}
              >
                {isNl ? tabLabels[tab].nl : tabLabels[tab].en}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-14">

        {/* ═══ TAB: Overzicht ═══ */}
        {activeTab === "overzicht" && (
          <div className="space-y-10">
            <ScrollReveal>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--navy)] leading-snug">
                {city.introTitle}
              </h2>
              <p className="mt-4 text-[var(--text)] leading-relaxed text-base sm:text-lg">
                {city.introText}
              </p>
            </ScrollReveal>

            {/* Stat highlight card */}
            <ScrollReveal delay={100}>
              <div className="rounded-xl p-6 sm:p-8 bg-[var(--surface)] border border-[var(--border)]">
                <p className="text-sm font-semibold text-[var(--navy)] mb-4">
                  {isNl ? `Data over ${city.name}` : `${city.name} data`}
                </p>
                {/* Comparison bar: City vs National */}
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-[var(--text)]">{city.name}</span>
                      <span className="text-sm font-bold" style={{ color: city.accentColor }}>{city.debtPercentage}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-[var(--bg)] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${Math.min(city.debtPercentage * 4, 100)}%`, backgroundColor: city.accentColor }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-[var(--muted)]">{isNl ? "Landelijk gemiddelde" : "National average"}</span>
                      <span className="text-sm font-bold text-[var(--muted)]">8,6%</span>
                    </div>
                    <div className="h-3 rounded-full bg-[var(--bg)] overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${8.6 * 4}%`, backgroundColor: "var(--muted)", opacity: 0.35 }} />
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-[11px] text-[var(--muted)]">{isNl ? "Bron: CBS Schuldenproblematiek in beeld, januari 2025. Percentage huishoudens met geregistreerde problematische schulden." : "Source: CBS Debt Statistics, January 2025."}</p>
              </div>
            </ScrollReveal>

            {/* Debt context */}
            <ScrollReveal delay={150}>
              <h3 className="text-xl font-bold text-[var(--navy)]">
                {isNl ? `Schuldenproblematiek in ${city.name}` : `Debt issues in ${city.name}`}
              </h3>
              <p className="mt-3 text-[var(--text)] leading-relaxed">{city.debtContext}</p>
            </ScrollReveal>

            {/* Local situation */}
            <ScrollReveal delay={200}>
              <h3 className="text-xl font-bold text-[var(--navy)]">
                {isNl ? `Wat doet de gemeente ${city.name}?` : `What does ${city.name} municipality do?`}
              </h3>
              <p className="mt-3 text-[var(--text)] leading-relaxed">{city.localSituation}</p>
            </ScrollReveal>

            {/* CTA */}
            <ScrollReveal delay={250}>
              <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[var(--navy)]">
                    {isNl ? "PayWatch helpt je grip te houden" : "PayWatch helps you stay in control"}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {isNl
                      ? "Verbind je inbox, herken rekeningen automatisch en zie welke escalatiefase je rekening heeft bereikt. Voordat het duurder wordt."
                      : "Connect your inbox, recognize bills automatically and see what escalation stage your bill has reached. Before it gets more expensive."}
                  </p>
                </div>
                <a
                  href="https://app.paywatch.app"
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
                  style={{ backgroundColor: city.accentColor }}
                >
                  {city.ctaText}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
                </a>
              </div>
            </ScrollReveal>

            {/* Gemeente link */}
            <ScrollReveal delay={300}>
              <a
                href={city.gemeenteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold transition hover:underline"
                style={{ color: city.accentColor }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                {isNl
                  ? `Officiële pagina gemeente ${city.name}`
                  : `Official ${city.name} municipality page`}
              </a>
            </ScrollReveal>
          </div>
        )}

        {/* ═══ TAB: Hulp ═══ */}
        {activeTab === "hulp" && (
          <div className="space-y-8">
            <ScrollReveal>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--navy)]">
                {isNl ? `Hulporganisaties in ${city.name}` : `Help organizations in ${city.name}`}
              </h2>
              <p className="mt-2 text-[var(--muted)]">
                {isNl
                  ? "Deze organisaties bieden gratis hulp bij schulden. Je kunt direct contact opnemen."
                  : "These organizations offer free debt help. You can contact them directly."}
              </p>
            </ScrollReveal>

            {/* Org image */}
            {orgPhoto && (
              <ScrollReveal delay={50}>
                <div className="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden">
                  <Image
                    src={orgPhoto.url}
                    alt={`${city.name} buurt`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 960px"
                  />
                  <div className="absolute bottom-1 right-2 text-[10px] text-white/50">
                    <a href={orgPhoto.photographerUrl} target="_blank" rel="noopener noreferrer" className="underline">{orgPhoto.photographer}</a>{" / "}
                    <a href={orgPhoto.unsplashUrl} target="_blank" rel="noopener noreferrer" className="underline">Unsplash</a>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Organization cards */}
            <div className="grid gap-5 sm:grid-cols-2">
              {city.organizations.map((org, i) => (
                <ScrollReveal key={org.name} delay={i * 80}>
                  <div className="h-full rounded-xl bg-[var(--surface)] border border-[var(--border)] p-5 sm:p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: city.accentColor }}
                      >
                        {org.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-[var(--navy)] leading-tight">{org.name}</h3>
                        <span className="text-xs font-medium text-[var(--muted)]">{org.type}</span>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--text)] leading-relaxed mb-4">{org.description}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-auto">
                      <a
                        href={org.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold transition hover:underline"
                        style={{ color: city.accentColor }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                        Website
                      </a>
                      {org.phone && (
                        <a
                          href={`tel:${org.phone.replace(/\s/g, "")}`}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--green)]"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                          {org.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* General help note */}
            <ScrollReveal delay={400}>
              <div className="rounded-xl bg-[var(--blue-light)] border border-[var(--blue)]/20 p-5">
                <p className="text-sm text-[var(--navy)] leading-relaxed">
                  <strong>{isNl ? "Wist je dat?" : "Did you know?"}</strong>{" "}
                  {isNl
                    ? `Naast de organisaties hierboven kun je ook terecht bij het Juridisch Loket (gratis juridisch advies), de Voedselbank en Nibud.nl voor budgettips. PayWatch helpt je daarnaast om al je rekeningen op een plek te zien, zodat je precies weet waar je staat.`
                    : `Besides the organizations above, you can also visit the Legal Aid Office (free legal advice), the Food Bank, and Nibud.nl for budget tips. PayWatch also helps you see all your bills in one place.`}
                </p>
              </div>
            </ScrollReveal>
          </div>
        )}

        {/* ═══ TAB: FAQ ═══ */}
        {activeTab === "faq" && (
          <div className="space-y-6">
            <ScrollReveal>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--navy)]">
                {isNl ? `Veelgestelde vragen over schuldhulp in ${city.name}` : `FAQ about debt help in ${city.name}`}
              </h2>
              <p className="mt-2 text-[var(--muted)]">
                {isNl
                  ? "Antwoorden op de meest gestelde vragen over schuldhulpverlening in jouw stad."
                  : "Answers to the most frequently asked questions about debt help in your city."}
              </p>
            </ScrollReveal>

            <div className="space-y-3">
              {city.faq.map((item, i) => (
                <ScrollReveal key={i} delay={i * 60}>
                  <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between gap-4 p-5 text-left"
                      aria-expanded={openFaq === i}
                    >
                      <span className="text-sm sm:text-base font-semibold text-[var(--navy)] leading-snug pr-2">
                        {item.question}
                      </span>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`flex-shrink-0 text-[var(--muted)] transition-transform duration-200 ${
                          openFaq === i ? "rotate-180" : ""
                        }`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-5 -mt-1">
                        <p className="text-sm text-[var(--text)] leading-relaxed">{item.answer}</p>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* CTA after FAQ */}
            <ScrollReveal delay={500}>
              <div
                className="rounded-xl p-6 text-center mt-8 bg-[var(--surface)] border border-[var(--border)]"
              >
                <p className="text-base font-bold text-[var(--navy)]">
                  {isNl ? "Heb je een andere vraag?" : "Have another question?"}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {isNl
                    ? `Neem contact op met de gemeente ${city.name} via ${city.organizations[0]?.phone || "de website"} of probeer PayWatch om grip te krijgen op je rekeningen.`
                    : `Contact ${city.name} municipality via ${city.organizations[0]?.phone || "their website"} or try PayWatch to get an overview of your bills.`}
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <a
                    href="https://app.paywatch.app"
                    className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
                    style={{ backgroundColor: city.accentColor }}
                  >
                    {isNl ? "Probeer PayWatch gratis" : "Try PayWatch free"}
                  </a>
                  <a
                    href={city.gemeenteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold border border-[var(--border)] text-[var(--navy)] bg-[var(--surface)] hover:bg-[var(--bg)] transition"
                  >
                    {isNl ? `Website gemeente ${city.name}` : `${city.name} municipality`}
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        )}

        {/* ═══ TAB: Tips ═══ */}
        {activeTab === "tips" && (
          <div className="space-y-8">
            <ScrollReveal>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--navy)]">
                {isNl ? `Lokale tips en regelingen in ${city.name}` : `Local tips and benefits in ${city.name}`}
              </h2>
              <p className="mt-2 text-[var(--muted)]">
                {isNl
                  ? "Naast schuldhulpverlening zijn er in jouw stad regelingen waar je misschien recht op hebt."
                  : "Besides debt help, your city has benefits you might be entitled to."}
              </p>
            </ScrollReveal>

            <div className="grid gap-5 sm:grid-cols-2">
              {city.tips.map((tip, i) => (
                <ScrollReveal key={tip.title} delay={i * 80}>
                  <div className="h-full rounded-xl bg-[var(--surface)] border border-[var(--border)] p-5 sm:p-6 flex flex-col">
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border border-[var(--border)] bg-[var(--bg)]"
                      >
                        <TipIcon name={tip.icon} color={city.accentColor} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                          {isNl ? `Tip ${i + 1}` : `Tip ${i + 1}`}
                        </span>
                        <h3 className="text-sm font-bold text-[var(--navy)] leading-snug">{tip.title}</h3>
                      </div>
                    </div>
                    <p className="text-[13px] text-[var(--text)] leading-relaxed flex-1">{tip.description}</p>
                    <a
                      href={tip.url || city.gemeenteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold transition hover:underline"
                      style={{ color: city.accentColor }}
                    >
                      {isNl ? "Bekijk regeling" : "View details"}
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
                    </a>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* General money-saving section */}
            <ScrollReveal delay={400}>
              <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-6 sm:p-8">
                <h3 className="text-lg font-bold text-[var(--navy)] mb-3">
                  {isNl ? "Algemene bespaartips" : "General saving tips"}
                </h3>
                <div className="space-y-3 text-sm text-[var(--text)] leading-relaxed">
                  <p>
                    {isNl
                      ? "Vergelijk je zorgverzekering elk jaar in november/december. Via Independer of Zorgwijzer kun je vaak honderden euros besparen door over te stappen."
                      : "Compare your health insurance every year in November/December. Through comparison sites, you can often save hundreds of euros by switching."}
                  </p>
                  <p>
                    {isNl
                      ? "Vraag toeslagen aan waar je recht op hebt: zorgtoeslag, huurtoeslag, kinderopvangtoeslag en kindgebonden budget. Check mijn.toeslagen.nl."
                      : "Apply for allowances you're entitled to: healthcare allowance, rent allowance, childcare allowance. Check mijn.toeslagen.nl."}
                  </p>
                  <p>
                    {isNl
                      ? "Stap over van energieleverancier als je contract afloopt. De verschillen kunnen oplopen tot honderden euros per jaar. Vergelijk op energievergelijk.nl."
                      : "Switch energy provider when your contract expires. Differences can amount to hundreds of euros per year."}
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* PayWatch CTA */}
            <ScrollReveal delay={500}>
              <div
                className="rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-5 bg-[var(--surface)] border border-[var(--border)]"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[var(--navy)]">
                    {isNl ? "Wil je nooit meer een rekening missen?" : "Never miss a bill again?"}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {isNl
                      ? "PayWatch scant je inbox, herkent rekeningen en waarschuwt je voordat een betalingstermijn verloopt. Zo voorkom je onnodige incassokosten."
                      : "PayWatch scans your inbox, recognizes bills and warns you before a payment deadline passes. Preventing unnecessary collection costs."}
                  </p>
                </div>
                <a
                  href="https://app.paywatch.app"
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white transition hover:opacity-90 flex-shrink-0"
                  style={{ backgroundColor: city.accentColor }}
                >
                  {isNl ? "Start gratis" : "Start free"}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
                </a>
              </div>
            </ScrollReveal>
          </div>
        )}
      </div>

      {/* ── Bottom: Other cities ── */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
          <h2 className="text-lg font-bold text-[var(--navy)] mb-4">
            {isNl ? "Schuldhulp in andere steden" : "Debt help in other cities"}
          </h2>
          <div className="flex flex-wrap gap-2">
            {["rotterdam", "amsterdam", "den-haag", "utrecht", "eindhoven"]
              .filter((s) => s !== city.slug)
              .map((slug) => {
                const names: Record<string, string> = {
                  rotterdam: "Rotterdam",
                  amsterdam: "Amsterdam",
                  "den-haag": "Den Haag",
                  utrecht: "Utrecht",
                  eindhoven: "Eindhoven",
                };
                return (
                  <Link
                    key={slug}
                    href={`/schuldhulp/${slug}`}
                    className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm font-medium text-[var(--navy)] hover:border-[var(--blue)] transition"
                  >
                    {names[slug]}
                  </Link>
                );
              })}
          </div>
          <div className="mt-4">
            <Link
              href="/schuldhulp"
              className="text-sm font-semibold hover:underline"
              style={{ color: city.accentColor }}
            >
              {isNl ? "Bekijk alle steden →" : "View all cities →"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Simple tip icon component (inline SVGs to avoid Lucide dependency issues in client) ── */
function TipIcon({ name, color }: { name: string; color: string }) {
  const size = 20;
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (name) {
    case "BadgePercent":
      return <svg {...props}><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" /><path d="m15 9-6 6" /><path d="M9 9h.01" /><path d="M15 15h.01" /></svg>;
    case "Ticket":
      return <svg {...props}><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" /></svg>;
    case "Zap":
      return <svg {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
    case "ShoppingCart":
      return <svg {...props}><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>;
    case "Heart":
      return <svg {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>;
    case "PauseCircle":
      return <svg {...props}><circle cx="12" cy="12" r="10" /><line x1="10" y1="15" x2="10" y2="9" /><line x1="14" y1="15" x2="14" y2="9" /></svg>;
    case "Scale":
      return <svg {...props}><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="M7 21h10" /><path d="M12 3v18" /><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" /></svg>;
    case "GraduationCap":
      return <svg {...props}><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>;
    case "Baby":
      return <svg {...props}><path d="M9 12h.01" /><path d="M15 12h.01" /><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" /><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1" /></svg>;
    case "FileText":
      return <svg {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>;
    case "Trophy":
      return <svg {...props}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>;
    case "Coins":
      return <svg {...props}><circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" /><path d="M7 6h1v4" /><path d="m16.71 13.88.7.71-2.82 2.82" /></svg>;
    case "Users":
      return <svg {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    default:
      return <svg {...props}><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>;
  }
}
