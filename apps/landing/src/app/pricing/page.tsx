"use client";

import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import { pricingFeatures, siteConfig } from "@/lib/config";

export default function PricingPage() {
  const { lang, t } = useApp();

  return (
    <div className="bg-[var(--bg)]">
      {/* Header */}
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-4 sm:px-6 sm:pt-20 sm:pb-8 text-center">
        <div className="inline-flex items-center rounded-full border border-[var(--green)] bg-[var(--green-light)] px-4 py-1.5 text-xs font-semibold text-[var(--green)] mb-4">
          {lang === "nl" ? "100% gratis in beta" : "100% free in beta"}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--navy)] tracking-tight">{t.pricing.title}</h1>
        <p className="text-base text-[var(--muted)] mt-3 max-w-xl mx-auto">{t.pricing.subtitle}</p>
      </div>

      {/* Pricing cards */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Free tier */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[var(--navy)]">{t.pricing.free}</h2>
              <p className="text-sm text-[var(--muted)] mt-1">{t.pricing.freeDesc}</p>
              <p className="text-4xl font-extrabold text-[var(--navy)] mt-4">€ 0</p>
              <p className="text-xs text-[var(--muted)] mt-1">{lang === "nl" ? "Voor altijd" : "Forever"}</p>
            </div>

            <Link
              href={`https://${siteConfig.appDomain}`}
              className="block w-full text-center rounded bg-[var(--blue)] px-4 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity mb-6"
            >
              {t.pricing.startFree}
            </Link>

            <div className="flex flex-col gap-3">
              {pricingFeatures.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  {f.free === true ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" className="flex-shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : f.free === false ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" className="flex-shrink-0 opacity-40"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  ) : (
                    <span className="flex-shrink-0 w-4 h-4 rounded bg-[var(--amber-light)] flex items-center justify-center text-[8px] font-bold text-[var(--amber)]">{f.free}</span>
                  )}
                  <span className={`text-sm ${f.free === false ? "text-[var(--muted)] line-through opacity-60" : "text-[var(--text)]"}`}>
                    {f.text[lang]}
                    {typeof f.free === "string" && (
                      <span className="text-xs text-[var(--amber)] font-semibold ml-1">({f.free})</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Full tier */}
          <div className="rounded-2xl border-2 border-[var(--blue)] bg-[var(--surface)] p-6 sm:p-8 relative">
            {/* Recommended badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-[var(--blue)] px-4 py-1 text-xs font-semibold text-white">
                {lang === "nl" ? "Aanbevolen" : "Recommended"}
              </span>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-[var(--navy)]">{t.pricing.full}</h2>
              <p className="text-sm text-[var(--muted)] mt-1">{t.pricing.fullDesc}</p>
              <p className="text-4xl font-extrabold text-[var(--navy)] mt-4">€ 0</p>
              <p className="text-xs text-[var(--blue)] font-semibold mt-1">{lang === "nl" ? "Nodig 1 vriend uit" : "Invite 1 friend"}</p>
            </div>

            <Link
              href={`https://${siteConfig.appDomain}`}
              className="block w-full text-center rounded bg-[var(--blue)] px-4 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity mb-6"
            >
              {t.pricing.inviteCta}
            </Link>

            <div className="flex flex-col gap-3">
              {pricingFeatures.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" className="flex-shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                  <span className="text-sm text-[var(--text)]">
                    {f.text[lang]}
                    {f.full === true && typeof f.free === "string" && (
                      <span className="text-xs text-[var(--green)] font-semibold ml-1">({t.pricing.unlimited})</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Invite explanation */}
        <div className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 text-center">
          <h3 className="text-lg font-bold text-[var(--navy)] mb-2">
            {lang === "nl" ? "Hoe werkt het?" : "How does it work?"}
          </h3>
          <p className="text-sm text-[var(--muted)] leading-relaxed max-w-lg mx-auto">
            {t.pricing.inviteExplain}
          </p>
          <div className="flex items-center justify-center gap-6 mt-6">
            {[
              { step: "1", text: lang === "nl" ? "Maak een account" : "Create an account" },
              { step: "2", text: lang === "nl" ? "Deel je invite link" : "Share your invite link" },
              { step: "3", text: lang === "nl" ? "Vriend maakt account" : "Friend creates account" },
              { step: "4", text: lang === "nl" ? "Alles ontgrendeld" : "Everything unlocked" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 text-center">
                <div className="w-8 h-8 rounded-full bg-[var(--blue-light)] flex items-center justify-center">
                  <span className="text-xs font-bold text-[var(--blue)]">{s.step}</span>
                </div>
                <span className="text-[10px] text-[var(--muted)] max-w-[70px] leading-tight">{s.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
