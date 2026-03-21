"use client";

import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import ScrollReveal from "@/components/ScrollReveal";
import { siteConfig } from "@/lib/config";

const featureDetails = {
  nl: [
    { title: "Gmail scan", desc: "Verbind je Gmail en PayWatch scant automatisch je inbox. Onze AI herkent facturen, herinneringen en aanmaningen — zonder dat je iets hoeft in te voeren." },
    { title: "Escalatie tracking", desc: "Elke rekening laat zien in welke fase hij zit: factuur, herinnering, aanmaning, incasso of deurwaarder. Met een duidelijke tijdlijn en extra kosten per fase." },
    { title: "Kostenvoorspelling", desc: "Weet precies hoeveel je bespaart door op tijd te betalen. PayWatch berekent de extra kosten van elke escalatiefase en laat zien wat je hebt voorkomen." },
    { title: "AI-brieven", desc: "Moet je reageren op een incassobrief? Laat onze AI een bezwaarbrief of betalingsvoorstel schrijven. Professioneel, persoonlijk, en klaar om te versturen." },
    { title: "Cashflow voorspelling", desc: "Zie per week wat er binnenkomt en wat er uitgaat. Plan vooruit zodat je nooit voor verrassingen staat. Met handige grafieken en tijdlijnen." },
    { title: "Financiële gezondheid", desc: "Een persoonlijke score van 0-100 die laat zien hoe goed je bezig bent. Gebaseerd op betaalgedrag, escalaties en consistentie." },
    { title: "Hulpverleners", desc: "Vind schuldhulpverleners, juridisch adviseurs en hulporganisaties in jouw gemeente. Met contactgegevens, categorieën en directe links." },
    { title: "QR betalen", desc: "Betaal rekeningen direct vanuit je bank-app met een EPC QR-code. Geen IBAN overtypen, geen fouten. Scan en klaar." },
    { title: "Moodtracker", desc: "Financiële stress is menselijk. Houd bij hoe je je voelt en ontdek patronen. PayWatch helpt je niet alleen met geld, maar ook met rust." },
    { title: "Donkere modus", desc: "Minder licht, meer rust. Schakel handmatig of laat het automatisch meegaan met je systeeminstellingen." },
  ],
  en: [
    { title: "Gmail scan", desc: "Connect your Gmail and PayWatch automatically scans your inbox. Our AI recognizes invoices, reminders and formal notices — without any manual entry." },
    { title: "Escalation tracking", desc: "Each bill shows its current stage: invoice, reminder, formal notice, collection or bailiff. With a clear timeline and extra costs per stage." },
    { title: "Cost prediction", desc: "Know exactly how much you save by paying on time. PayWatch calculates the extra costs of each escalation stage and shows what you've prevented." },
    { title: "AI letters", desc: "Need to respond to a collection letter? Let our AI draft an objection letter or payment proposal. Professional, personal, and ready to send." },
    { title: "Cashflow forecast", desc: "See per week what's coming in and going out. Plan ahead so you're never surprised. With helpful charts and timelines." },
    { title: "Financial health", desc: "A personal score from 0-100 that shows how well you're doing. Based on payment behavior, escalations and consistency." },
    { title: "Support organizations", desc: "Find debt counselors, legal advisors and aid organizations in your municipality. With contact details, categories and direct links." },
    { title: "QR payments", desc: "Pay bills directly from your banking app with an EPC QR code. No retyping IBANs, no mistakes. Scan and done." },
    { title: "Mood tracker", desc: "Financial stress is human. Track how you feel and discover patterns. PayWatch helps you not just with money, but also with peace of mind." },
    { title: "Dark mode", desc: "Less light, more calm. Switch manually or let it follow your system settings automatically." },
  ],
};

export default function FeaturesPage() {
  const { lang, t } = useApp();
  const features = featureDetails[lang];

  return (
    <div className="bg-[var(--bg)]">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-4 sm:px-6 sm:pt-20 sm:pb-8 text-center">
        <ScrollReveal>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--navy)] tracking-tight">{t.features.title}</h1>
          <p className="text-base text-[var(--muted)] mt-3 max-w-xl mx-auto">{t.features.subtitle}</p>
        </ScrollReveal>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 sm:pb-24">
        {features.map((feature, i) => {
          const isEven = i % 2 === 0;
          return (
            <ScrollReveal key={i} direction={isEven ? "left" : "right"}>
              <div className={`flex flex-col gap-8 py-12 border-b border-[var(--border)] last:border-b-0 sm:flex-row sm:items-center ${isEven ? "" : "sm:flex-row-reverse"}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--blue-light)]">
                      <span className="text-lg font-extrabold text-[var(--blue)]">{i + 1}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[var(--navy)]">{feature.title}</h2>
                  </div>
                  <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed max-w-md">{feature.desc}</p>
                </div>

                {/* IMAGE PLACEHOLDER: Add feature screenshot/mockup */}
                <div className="flex-1 flex justify-center">
                  <div className="w-full max-w-sm h-56 sm:h-64 rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--surface)] flex flex-col items-center justify-center gap-3">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1" className="opacity-30"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    <span className="text-xs text-[var(--muted)] opacity-50">{feature.title}</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      <div className="bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 text-center">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-[var(--navy)]">{t.cta.title}</h2>
            <p className="text-sm text-[var(--muted)] mt-2 mb-6">{t.cta.subtitle}</p>
            <Link href={`https://${siteConfig.appDomain}`} className="inline-flex rounded bg-[var(--blue)] px-8 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity">{t.cta.button}</Link>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
