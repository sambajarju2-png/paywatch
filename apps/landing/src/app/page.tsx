"use client";

import Link from "next/link";
import { siteConfig, t } from "@/lib/config";
import { useApp } from "@/components/AppProvider";
import { TrustBar } from "@/components/TrustBar";
import { GemeenteSearch } from "@/components/GemeenteSearch";

export default function HomePage() {
  const { lang } = useApp();
  const tx = t[lang];

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="pt-20 pb-14 px-6 bg-pw-bg dark:bg-[#0B1120]">
        <div className="max-w-[1140px] mx-auto flex items-center gap-14">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pw-blue-light dark:bg-pw-blue/10 text-pw-blue text-[12px] font-semibold mb-6">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              {tx.heroTag}
            </div>
            <h1 className="text-[48px] font-extrabold text-pw-navy dark:text-white leading-[1.08] tracking-[-1.5px] mb-4">
              {tx.heroTitle1}<br />
              <span className="text-pw-blue">{tx.heroTitle2}</span>
            </h1>
            <p className="text-[17px] text-pw-muted dark:text-[#94A3B8] leading-relaxed mb-8 max-w-[460px]">
              {tx.heroSub}
            </p>
            <div className="flex gap-3 items-center">
              <Link href={siteConfig.appUrl} className="bg-pw-blue text-white text-[15px] font-semibold px-7 py-3 rounded-button hover:bg-blue-700 transition-colors">
                {tx.ctaPrimary}
              </Link>
              <Link href="/features" className="text-[15px] font-medium text-pw-blue hover:underline">
                {tx.ctaSecondary} →
              </Link>
            </div>
          </div>

          {/* ─── PHONE MOCKUP PLACEHOLDER ─── */}
          {/* Replace this div with your HeroBannerMockup or DashboardMockup component */}
          <div className="w-[300px] h-[600px] rounded-[42px] bg-black shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] overflow-hidden relative shrink-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[26px] bg-black rounded-b-[14px] z-10" />
            <div className="absolute top-[30px] left-0 right-0 bottom-0 bg-pw-bg dark:bg-[#0B1120] overflow-hidden">
              {/* Topbar */}
              <div className="flex items-center justify-between px-3 py-2 bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-sm border-b border-pw-border dark:border-[#334155]">
                <span className="text-[12px] font-bold text-pw-navy dark:text-white">PayWatch</span>
                <span className="text-[9px] font-bold text-pw-blue">🔥 12d</span>
              </div>
              {/* Debt card */}
              <div className="mx-2.5 mt-2.5 bg-gradient-to-br from-pw-navy to-[#2D3B4E] rounded-xl p-3.5">
                <p className="text-[8px] text-white/60">{lang === "nl" ? "Totaal openstaand" : "Total outstanding"}</p>
                <p className="text-[22px] font-extrabold text-white tracking-tight">€ 2.847,50</p>
                <div className="flex gap-1 mt-1">
                  <span className="text-[7px] bg-white/12 text-white/70 px-1.5 py-0.5 rounded">{lang === "nl" ? "12 rekeningen" : "12 bills"}</span>
                  <span className="text-[7px] bg-green-500/30 text-green-300 px-1.5 py-0.5 rounded">€847 {lang === "nl" ? "bespaard" : "saved"}</span>
                </div>
              </div>
              {/* Stat cards */}
              <div className="grid grid-cols-2 gap-1 mx-2.5 mt-2">
                {[
                  { l: lang === "nl" ? "Kritiek" : "Critical", v: "3", c: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20", bt: "border-t-2 border-red-500" },
                  { l: lang === "nl" ? "Binnenkort" : "Upcoming", v: "4", c: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20", bt: "border-t-2 border-amber-500" },
                  { l: lang === "nl" ? "Openstaand" : "Outstanding", v: "5", c: "text-pw-blue", bg: "bg-blue-50 dark:bg-blue-900/20", bt: "border-t-2 border-pw-blue" },
                  { l: lang === "nl" ? "Betaald" : "Paid", v: "8", c: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20", bt: "border-t-2 border-green-500" },
                ].map((s) => (
                  <div key={s.l} className={`${s.bg} ${s.bt} rounded-md p-2`}>
                    <p className="text-[7px] text-pw-muted dark:text-[#94A3B8]">{s.l}</p>
                    <p className={`text-[16px] font-extrabold ${s.c}`}>{s.v}</p>
                  </div>
                ))}
              </div>
              {/* Bills */}
              <div className="mx-2.5 mt-2 space-y-1">
                {[
                  { name: "Vattenfall", amt: "€245", stage: lang === "nl" ? "Aanmaning" : "Notice", color: "#DC2626" },
                  { name: "Ziggo", amt: "€89,50", stage: lang === "nl" ? "Herinnering" : "Reminder", color: "#D97706" },
                  { name: "Gemeente", amt: "€412", stage: lang === "nl" ? "Openstaand" : "Outstanding", color: "#2563EB" },
                  { name: "VGZ", amt: "€134", stage: lang === "nl" ? "Betaald" : "Paid", color: "#059669" },
                ].map((b) => (
                  <div key={b.name} className="bg-white dark:bg-[#1E293B] rounded-md p-2 border border-pw-border dark:border-[#334155] flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-semibold text-pw-text dark:text-white">{b.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <div className="w-[5px] h-[5px] rounded-full" style={{ background: b.color }} />
                        <span className="text-[7px] font-semibold" style={{ color: b.color }}>{b.stage}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-pw-text dark:text-white">{b.amt}</span>
                  </div>
                ))}
              </div>
              {/* Bottom nav */}
              <div className="absolute bottom-0 left-0 right-0 h-[44px] bg-white dark:bg-[#1E293B] border-t border-pw-border dark:border-[#334155] flex justify-around items-center">
                {[
                  lang === "nl" ? "Overzicht" : "Overview",
                  lang === "nl" ? "Rekeningen" : "Bills",
                  "Stats",
                  "Cashflow",
                ].map((t, i) => (
                  <div key={t} className="text-center">
                    {i === 0 && <div className="w-1 h-1 rounded-full bg-pw-blue mx-auto mb-0.5" />}
                    <span className={`text-[7px] font-medium ${i === 0 ? "text-pw-blue" : "text-pw-muted/50 dark:text-white/30"}`}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUST BAR ─── */}
      <TrustBar />

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-20 px-6 bg-white dark:bg-[#111827]">
        <div className="max-w-[1140px] mx-auto">
          <div className="text-center mb-14">
            <span className="text-[12px] font-semibold text-pw-blue tracking-widest uppercase">{tx.howLabel}</span>
            <h2 className="text-[36px] font-extrabold text-pw-navy dark:text-white mt-2 tracking-tight">{tx.howTitle}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: "01", title: tx.step1, desc: tx.step1d, icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6", color: "bg-pw-blue-light dark:bg-pw-blue/10", iconColor: "#2563EB" },
              { num: "02", title: tx.step2, desc: tx.step2d, icon: "M22 7l-8.5 8.5-5-5L2 17M16 7h6v6", color: "bg-amber-50 dark:bg-amber-500/10", iconColor: "#D97706" },
              { num: "03", title: tx.step3, desc: tx.step3d, icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", color: "bg-purple-50 dark:bg-purple-500/10", iconColor: "#7C3AED" },
            ].map((step) => (
              <div key={step.num} className="bg-pw-bg dark:bg-[#0B1120] rounded-2xl p-8 border border-pw-border dark:border-[#334155]">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-11 h-11 rounded-xl ${step.color} flex items-center justify-center`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={step.iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={step.icon} />
                    </svg>
                  </div>
                  <span className="text-[32px] font-extrabold text-pw-border dark:text-[#334155]">{step.num}</span>
                </div>
                <h3 className="text-[18px] font-bold text-pw-navy dark:text-white mb-2">{step.title}</h3>
                <p className="text-[14px] text-pw-muted dark:text-[#94A3B8] leading-relaxed">{step.desc}</p>
                {/* PLACEHOLDER: Add mockup screenshot or component here */}
                <div className="mt-4 h-[120px] rounded-xl bg-pw-border/30 dark:bg-white/5 flex items-center justify-center">
                  <span className="text-[11px] text-pw-muted dark:text-white/30">{lang === "nl" ? "Mockup placeholder" : "Mockup placeholder"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES PREVIEW ─── */}
      <section className="py-20 px-6 bg-pw-bg dark:bg-[#0B1120]">
        <div className="max-w-[1140px] mx-auto">
          <div className="text-center mb-14">
            <span className="text-[12px] font-semibold text-pw-blue tracking-widest uppercase">{tx.featLabel}</span>
            <h2 className="text-[36px] font-extrabold text-pw-navy dark:text-white mt-2 mb-3 tracking-tight">{tx.featTitle}</h2>
            <p className="text-[15px] text-pw-muted dark:text-[#94A3B8] max-w-[480px] mx-auto">{tx.featSub}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6", title: { nl: "Inbox Scanner", en: "Inbox Scanner" }, desc: { nl: "Gmail verbinden en klaar. AI pikt facturen eruit en voegt ze toe.", en: "Connect Gmail and done. AI picks out invoices and adds them." }, tag: "AI" },
              { icon: "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2zM12 13a4 4 0 100-8 4 4 0 000 8z", title: { nl: "Brief Scanner", en: "Letter Scanner" }, desc: { nl: "Maak een foto van een brief. AI leest alles en voegt het direct toe.", en: "Snap a photo. AI reads everything and adds it instantly." }, tag: "Camera" },
              { icon: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0", title: { nl: "Escalatie Ladder", en: "Escalation Ladder" }, desc: { nl: "Zie in welke fase je rekening zit. Van factuur tot deurwaarder.", en: "See what stage your bill is in. From invoice to bailiff." }, tag: { nl: "5 fases", en: "5 stages" } },
              { icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", title: { nl: "AI Reactiebrieven", en: "AI Response Letters" }, desc: { nl: "Bezwaarschrift, betalingsregeling, klacht of uitstel — AI schrijft een nette brief.", en: "Objection, payment plan, complaint or delay — AI writes a formal letter." }, tag: "4 templates" },
              { icon: "M22 7l-8.5 8.5-5-5L2 17M16 7h6v6", title: { nl: "Cashflow Voorspelling", en: "Cashflow Forecast" }, desc: { nl: "Weet wat er aankomt. Zie welke rekeningen binnenkort vervallen.", en: "Know what's coming. See which bills are due soon." }, tag: "Forecast" },
              { icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z", title: { nl: "Streaks & Badges", en: "Streaks & Badges" }, desc: { nl: "Blijf gemotiveerd. Schulden beheren mag ook leuk zijn.", en: "Stay motivated. Managing debt can be rewarding too." }, tag: { nl: "Motivatie", en: "Motivation" } },
            ].map((f, i) => (
              <div key={typeof f.title === "string" ? f.title : f.title.en} className="bg-white dark:bg-[#1E293B] rounded-card p-6 border border-pw-border dark:border-[#334155] flex gap-4 hover:border-pw-blue/30 dark:hover:border-pw-blue/30 transition-colors group">
                <div className={`w-[42px] h-[42px] rounded-[10px] ${i % 2 === 0 ? "bg-pw-blue-light dark:bg-pw-blue/10" : "bg-purple-50 dark:bg-purple-500/10"} flex items-center justify-center shrink-0`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={i % 2 === 0 ? "#2563EB" : "#7C3AED"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={f.icon} />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[15px] font-bold text-pw-navy dark:text-white">{typeof f.title === "string" ? f.title : f.title[lang]}</h3>
                    <span className="text-[9px] font-semibold text-pw-blue bg-pw-blue-light dark:bg-pw-blue/10 px-2 py-0.5 rounded">{typeof f.tag === "string" ? f.tag : f.tag[lang]}</span>
                  </div>
                  <p className="text-[13px] text-pw-muted dark:text-[#94A3B8] leading-relaxed">{typeof f.desc === "string" ? f.desc : f.desc[lang]}</p>
                  {/* PLACEHOLDER: Add feature mockup/screenshot here */}
                  <div className="mt-3 h-[80px] rounded-lg bg-pw-bg dark:bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-pw-muted dark:text-white/30">{lang === "nl" ? "Screenshot / mockup placeholder" : "Screenshot / mockup placeholder"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/features" className="text-[14px] font-semibold text-pw-blue hover:underline">{tx.featAll}</Link>
          </div>
        </div>
      </section>

      {/* ─── MOTIVATION ─── */}
      <section className="py-20 px-6 bg-white dark:bg-[#111827]">
        <div className="max-w-[1140px] mx-auto flex items-center gap-14">
          <div className="flex-1">
            <span className="text-[12px] font-semibold text-amber-600 dark:text-amber-400 tracking-widest uppercase">{tx.motLabel}</span>
            <h2 className="text-[32px] font-extrabold text-pw-navy dark:text-white mt-2 mb-4 tracking-tight">{tx.motTitle}</h2>
            <p className="text-[15px] text-pw-muted dark:text-[#94A3B8] leading-relaxed mb-6">{tx.motSub}</p>
            <div className="flex gap-3 flex-wrap">
              {[
                { icon: "M12 3q1 4 4 6.5t3 5.5a1 1 0 01-14 0 5 5 0 011-3 1 1 0 005 0c0-2-1.5-3-1.5-5q0-2 2.5-4z", label: tx.streaks, color: "#D97706" },
                { icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z", label: tx.badges, color: "#2563EB" },
                { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", label: tx.savings, color: "#059669" },
              ].map((m) => (
                <div key={m.label} className="flex items-center gap-2 px-3 py-2 rounded-[10px] bg-pw-bg dark:bg-white/5 border border-pw-border dark:border-[#334155]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={m.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={m.icon} />
                  </svg>
                  <span className="text-[12px] font-semibold text-pw-text dark:text-white">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="w-[340px] h-[220px] rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
            <div className="text-center">
              <div className="text-[48px] mb-2">🔥</div>
              <p className="text-[32px] font-extrabold text-amber-600 dark:text-amber-400">12 {tx.days}</p>
              <p className="text-[13px] text-pw-muted dark:text-[#94A3B8]">{tx.activeStreak}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="py-16 px-6 bg-pw-navy dark:bg-[#070B14]">
        <div className="max-w-[1140px] mx-auto flex justify-around text-center">
          {[
            { value: "€2.3B", label: lang === "nl" ? "Incassokosten per jaar in NL" : "Collection costs per year in NL" },
            { value: "1.4M", label: lang === "nl" ? "Huishoudens met betalingsproblemen" : "Households with payment issues" },
            { value: "87%", label: lang === "nl" ? "Weet niet van escalatiestappen" : "Unaware of escalation steps" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-[40px] font-extrabold text-white tracking-tight">{s.value}</p>
              <p className="text-[13px] text-white/50">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── MUNICIPALITY SEARCH ─── */}
      <GemeenteSearch />

      {/* ─── CTA ─── */}
      <section className="py-20 px-6 bg-pw-bg dark:bg-[#0B1120] text-center">
        <div className="max-w-[520px] mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-pw-blue-light dark:bg-pw-blue/10 flex items-center justify-center mx-auto mb-5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h2 className="text-[32px] font-extrabold text-pw-navy dark:text-white mb-3 tracking-tight">{tx.ctaTitle}</h2>
          <p className="text-[15px] text-pw-muted dark:text-[#94A3B8] leading-relaxed mb-7">{tx.ctaSub}</p>
          <Link href={siteConfig.appUrl} className="inline-block bg-pw-blue text-white text-[15px] font-semibold px-9 py-3.5 rounded-button hover:bg-blue-700 transition-colors">
            {tx.ctaBtn}
          </Link>
        </div>
      </section>
    </>
  );
}
