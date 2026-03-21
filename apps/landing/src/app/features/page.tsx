"use client";

import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import { siteConfig } from "@/lib/config";

/* Feature detail data with extended descriptions */
const featureDetails = {
  nl: [
    { title: "Gmail scan", desc: "Verbind je Gmail en PayWatch scant automatisch je inbox. Onze AI herkent facturen, herinneringen en aanmaningen — zonder dat je iets hoeft in te voeren.", visual: "email" },
    { title: "Escalatie tracking", desc: "Elke rekening laat zien in welke fase hij zit: factuur, herinnering, aanmaning, incasso of deurwaarder. Met een duidelijke tijdlijn en extra kosten per fase.", visual: "escalation" },
    { title: "Kostenvoorspelling", desc: "Weet precies hoeveel je bespaart door op tijd te betalen. PayWatch berekent de extra kosten van elke escalatiefase en laat zien wat je hebt voorkomen.", visual: "savings" },
    { title: "AI-brieven", desc: "Moet je reageren op een incassobrief? Laat onze AI een bezwaarbrief of betalingsvoorstel schrijven. Professioneel, persoonlijk, en klaar om te versturen.", visual: "letter" },
    { title: "Cashflow voorspelling", desc: "Zie per week wat er binnenkomt en wat er uitgaat. Plan vooruit zodat je nooit voor verrassingen staat. Met handige grafieken en tijdlijnen.", visual: "cashflow" },
    { title: "Financiële gezondheid", desc: "Een persoonlijke score van 0-100 die laat zien hoe goed je bezig bent. Gebaseerd op betaalgedrag, escalaties en consistentie.", visual: "health" },
    { title: "Hulpverleners", desc: "Vind schuldhulpverleners, juridisch adviseurs en hulporganisaties in jouw gemeente. Met contactgegevens, categorieën en directe links.", visual: "aid" },
    { title: "QR betalen", desc: "Betaal rekeningen direct vanuit je bank-app met een EPC QR-code. Geen IBAN overtypen, geen fouten. Scan en klaar.", visual: "qr" },
    { title: "Moodtracker", desc: "Financiële stress is menselijk. Houd bij hoe je je voelt en ontdek patronen. PayWatch helpt je niet alleen met geld, maar ook met rust.", visual: "mood" },
    { title: "Donkere modus", desc: "Minder licht, meer rust. Schakel handmatig of laat het automatisch meegaan met je systeeminstellingen.", visual: "dark" },
  ],
  en: [
    { title: "Gmail scan", desc: "Connect your Gmail and PayWatch automatically scans your inbox. Our AI recognizes invoices, reminders and formal notices — without any manual entry.", visual: "email" },
    { title: "Escalation tracking", desc: "Each bill shows its current stage: invoice, reminder, formal notice, collection or bailiff. With a clear timeline and extra costs per stage.", visual: "escalation" },
    { title: "Cost prediction", desc: "Know exactly how much you save by paying on time. PayWatch calculates the extra costs of each escalation stage and shows what you've prevented.", visual: "savings" },
    { title: "AI letters", desc: "Need to respond to a collection letter? Let our AI draft an objection letter or payment proposal. Professional, personal, and ready to send.", visual: "letter" },
    { title: "Cashflow forecast", desc: "See per week what's coming in and going out. Plan ahead so you're never surprised. With helpful charts and timelines.", visual: "cashflow" },
    { title: "Financial health", desc: "A personal score from 0-100 that shows how well you're doing. Based on payment behavior, escalations and consistency.", visual: "health" },
    { title: "Support organizations", desc: "Find debt counselors, legal advisors and aid organizations in your municipality. With contact details, categories and direct links.", visual: "aid" },
    { title: "QR payments", desc: "Pay bills directly from your banking app with an EPC QR code. No retyping IBANs, no mistakes. Scan and done.", visual: "qr" },
    { title: "Mood tracker", desc: "Financial stress is human. Track how you feel and discover patterns. PayWatch helps you not just with money, but also with peace of mind.", visual: "mood" },
    { title: "Dark mode", desc: "Less light, more calm. Switch manually or let it follow your system settings automatically.", visual: "dark" },
  ],
};

const visualColors: Record<string, string> = {
  email: "var(--red)",
  escalation: "var(--amber)",
  savings: "var(--green)",
  letter: "var(--purple)",
  cashflow: "var(--blue)",
  health: "var(--amber)",
  aid: "var(--green)",
  qr: "var(--blue)",
  mood: "var(--purple)",
  dark: "var(--navy)",
};

export default function FeaturesPage() {
  const { lang, t } = useApp();
  const features = featureDetails[lang];

  return (
    <div className="bg-[var(--bg)]">
      {/* Header */}
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-4 sm:px-6 sm:pt-20 sm:pb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--navy)] tracking-tight">{t.features.title}</h1>
        <p className="text-base text-[var(--muted)] mt-3 max-w-xl mx-auto">{t.features.subtitle}</p>
      </div>

      {/* Feature sections - alternating layout */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 sm:pb-24">
        {features.map((feature, i) => {
          const isEven = i % 2 === 0;
          const color = visualColors[feature.visual] || "var(--blue)";

          return (
            <div
              key={i}
              className={`flex flex-col gap-8 py-12 border-b border-[var(--border)] last:border-b-0 sm:flex-row sm:items-center ${
                isEven ? "" : "sm:flex-row-reverse"
              }`}
            >
              {/* Text */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `color-mix(in srgb, ${color} 12%, transparent)` }}>
                    <span className="text-lg font-extrabold" style={{ color }}>{i + 1}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[var(--navy)]">{feature.title}</h2>
                </div>
                <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed max-w-md">{feature.desc}</p>
              </div>

              {/* Visual placeholder */}
              <div className="flex-1 flex justify-center">
                <FeatureVisual type={feature.visual} color={color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-[var(--navy)]">{t.cta.title}</h2>
          <p className="text-sm text-[var(--muted)] mt-2 mb-6">{t.cta.subtitle}</p>
          <Link
            href={`https://${siteConfig.appDomain}`}
            className="inline-flex rounded bg-[var(--blue)] px-8 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            {t.cta.button}
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Feature Visual Placeholders ─── */
/* These are styled placeholder cards. Replace with actual mockup screenshots later. */
function FeatureVisual({ type, color }: { type: string; color: string }) {
  return (
    <div
      className="w-full max-w-xs h-48 sm:h-56 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col justify-center items-center gap-3 relative overflow-hidden"
    >
      {/* Background accent */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl"
        style={{ background: color }}
      />

      {/* Icon */}
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center z-10" style={{ background: `color-mix(in srgb, ${color} 12%, transparent)` }}>
        <VisualIcon type={type} color={color} />
      </div>

      {/* Skeleton lines to suggest UI content */}
      <div className="flex flex-col gap-1.5 items-center z-10 w-full max-w-[160px]">
        <div className="h-2.5 w-full rounded" style={{ background: `color-mix(in srgb, ${color} 20%, transparent)` }} />
        <div className="h-2 w-3/4 rounded" style={{ background: `color-mix(in srgb, ${color} 12%, transparent)` }} />
        <div className="h-2 w-1/2 rounded" style={{ background: `color-mix(in srgb, ${color} 8%, transparent)` }} />
      </div>

      {/* IMAGE PLACEHOLDER: Replace this component with actual feature screenshot/mockup */}
    </div>
  );
}

function VisualIcon({ type, color }: { type: string; color: string }) {
  const s = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.5 } as const;

  switch (type) {
    case "email": return <svg {...s}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 5L2 7"/></svg>;
    case "escalation": return <svg {...s}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case "savings": return <svg {...s}><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="4"/></svg>;
    case "letter": return <svg {...s}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>;
    case "cashflow": return <svg {...s}><polyline points="22 12 18 6 13 16 8 8 2 18"/></svg>;
    case "health": return <svg {...s}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;
    case "aid": return <svg {...s}><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/></svg>;
    case "qr": return <svg {...s}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
    case "mood": return <svg {...s}><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/></svg>;
    case "dark": return <svg {...s}><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>;
    default: return <svg {...s}><circle cx="12" cy="12" r="10"/></svg>;
  }
}
