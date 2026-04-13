"use client";

import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import ScrollReveal from "@/components/ScrollReveal";

const SECTIONS = [
  {
    title: { nl: "Product", en: "Product" },
    links: [
      { label: { nl: "Functies overzicht", en: "Features overview" }, href: "/features" },
      { label: { nl: "Prijzen", en: "Pricing" }, href: "/pricing" },
      { label: { nl: "Roadmap", en: "Roadmap" }, href: "/roadmap" },
      { label: { nl: "Tech Stack", en: "Tech Stack" }, href: "/tech-stack" },
      { label: { nl: "Hulp & uitleg", en: "Help & guides" }, href: "/support" },
    ],
  },
  {
    title: { nl: "Functies", en: "Features" },
    links: [
      { label: { nl: "E-mail scanner", en: "Email scanner" }, href: "/features/email-scanner" },
      { label: { nl: "Camera scanner", en: "Camera scanner" }, href: "/features/camera-scanner" },
      { label: { nl: "Betaalfases", en: "Escalation stages" }, href: "/features/betaalfases" },
      { label: { nl: "Betalingen", en: "Payments" }, href: "/features/betalingen" },
      { label: { nl: "Cashflow", en: "Cash flow" }, href: "/features/cashflow" },
      { label: { nl: "Maandbudget", en: "Monthly budget" }, href: "/features/maandbudget" },
      { label: { nl: "Conceptbrieven", en: "Draft letters" }, href: "/features/conceptbrieven" },
      { label: { nl: "AI Inzichten", en: "AI Insights" }, href: "/features/inzichten" },
      { label: { nl: "Buddy systeem", en: "Buddy system" }, href: "/features/buddy" },
      { label: { nl: "Community", en: "Community" }, href: "/features/community" },
      { label: { nl: "Hulpverleners", en: "Support organizations" }, href: "/features/hulpverleners" },
      { label: { nl: "Schuldenvrij countdown", en: "Debt-free countdown" }, href: "/features/schuldvrij-countdown" },
      { label: { nl: "Agenda", en: "Calendar" }, href: "/features/agenda" },
    ],
  },
  {
    title: { nl: "Schuldhulp per stad", en: "Debt help by city" },
    links: [
      { label: { nl: "Schuldhulp Rotterdam", en: "Debt help Rotterdam" }, href: "/schuldhulp/rotterdam" },
      { label: { nl: "Schuldhulp Amsterdam", en: "Debt help Amsterdam" }, href: "/schuldhulp/amsterdam" },
      { label: { nl: "Schuldhulp Den Haag", en: "Debt help The Hague" }, href: "/schuldhulp/den-haag" },
      { label: { nl: "Schuldhulp Utrecht", en: "Debt help Utrecht" }, href: "/schuldhulp/utrecht" },
      { label: { nl: "Schuldhulp Eindhoven", en: "Debt help Eindhoven" }, href: "/schuldhulp/eindhoven" },
      { label: { nl: "Schuldhulp Groningen", en: "Debt help Groningen" }, href: "/schuldhulp/groningen" },
      { label: { nl: "Schuldhulp Tilburg", en: "Debt help Tilburg" }, href: "/schuldhulp/tilburg" },
      { label: { nl: "Schuldhulp Almere", en: "Debt help Almere" }, href: "/schuldhulp/almere" },
      { label: { nl: "Schuldhulp Breda", en: "Debt help Breda" }, href: "/schuldhulp/breda" },
      { label: { nl: "Schuldhulp Nijmegen", en: "Debt help Nijmegen" }, href: "/schuldhulp/nijmegen" },
      { label: { nl: "Schuldhulp Arnhem", en: "Debt help Arnhem" }, href: "/schuldhulp/arnhem" },
      { label: { nl: "Schuldhulp Haarlem", en: "Debt help Haarlem" }, href: "/schuldhulp/haarlem" },
      { label: { nl: "Schuldhulp Enschede", en: "Debt help Enschede" }, href: "/schuldhulp/enschede" },
      { label: { nl: "Schuldhulp Zaanstad", en: "Debt help Zaanstad" }, href: "/schuldhulp/zaanstad" },
      { label: { nl: "Schuldhulp Amersfoort", en: "Debt help Amersfoort" }, href: "/schuldhulp/amersfoort" },
      { label: { nl: "Schuldhulp Apeldoorn", en: "Debt help Apeldoorn" }, href: "/schuldhulp/apeldoorn" },
      { label: { nl: "Schuldhulp Leiden", en: "Debt help Leiden" }, href: "/schuldhulp/leiden" },
      { label: { nl: "Schuldhulp Dordrecht", en: "Debt help Dordrecht" }, href: "/schuldhulp/dordrecht" },
      { label: { nl: "Schuldhulp Maastricht", en: "Debt help Maastricht" }, href: "/schuldhulp/maastricht" },
      { label: { nl: "Schuldhulp 's-Hertogenbosch", en: "Debt help 's-Hertogenbosch" }, href: "/schuldhulp/s-hertogenbosch" },
    ],
  },
  {
    title: { nl: "Voor partners", en: "For partners" },
    links: [
      { label: { nl: "PayWatch voor gemeentes", en: "PayWatch for municipalities" }, href: "/gemeente-contact" },
      { label: { nl: "PayWatch voor incassobureaus", en: "PayWatch for collection agencies" }, href: "/incasso-contact" },
      { label: { nl: "PayWatch voor hulporganisaties", en: "PayWatch for aid organizations" }, href: "/hulporg-contact" },
      { label: { nl: "PayWatch voor bedrijven", en: "PayWatch for businesses" }, href: "/zakelijk-contact" },
    ],
  },
  {
    title: { nl: "Bedrijf", en: "Company" },
    links: [
      { label: { nl: "Over ons", en: "About us" }, href: "/about" },
      { label: { nl: "Blog", en: "Blog" }, href: "/blog" },
      { label: { nl: "Vacatures", en: "Jobs" }, href: "/jobs" },
      { label: { nl: "Contact", en: "Contact" }, href: "/contact" },
      { label: { nl: "Artikelen & hulpbronnen", en: "Resources" }, href: "/resources" },
    ],
  },
  {
    title: { nl: "Juridisch", en: "Legal" },
    links: [
      { label: { nl: "Privacybeleid", en: "Privacy policy" }, href: "/privacy" },
      { label: { nl: "Algemene voorwaarden", en: "Terms of service" }, href: "/terms" },
      { label: { nl: "Gegevensverwerking", en: "Data processing" }, href: "/data-processing" },
    ],
  },
];

export default function DirectoryPage() {
  const { lang } = useApp();

  return (
    <div className="bg-[var(--bg)] min-h-screen">
      <div className="mx-auto max-w-4xl px-4 pt-12 pb-20 sm:px-6 sm:pt-20">
        <ScrollReveal>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--navy)] tracking-tight mb-2">
            {lang === "nl" ? "PayWatch Directory" : "PayWatch Directory"}
          </h1>
          <p className="text-base text-[var(--muted)] mb-12 max-w-lg">
            {lang === "nl"
              ? "Overzicht van alle pagina's op PayWatch. Vind snel wat je zoekt."
              : "Overview of all pages on PayWatch. Quickly find what you need."}
          </p>
        </ScrollReveal>

        <div className="space-y-10">
          {SECTIONS.map((section, sIdx) => (
            <ScrollReveal key={section.title.nl} delay={sIdx * 80}>
              <div>
                <p className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-[0.15em] mb-4 pb-2 border-b border-[var(--border)]">
                  {section.title[lang]}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm text-[var(--text)] hover:text-[var(--blue)] transition-colors py-1.5"
                    >
                      {link.label[lang]}
                    </Link>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
