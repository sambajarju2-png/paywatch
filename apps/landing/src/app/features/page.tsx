import Link from "next/link";
import { siteConfig } from "@/lib/config";

const features = [
  { icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6", title: "Gmail Scanner", desc: "Verbind je Gmail en PayWatch scant automatisch tot 300 e-mails. AI classificeert of het een rekening is en extraheert alle details: bedrag, IBAN, vervaldatum, escalatiefase.", tag: "Gemini + Haiku" },
  { icon: "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z M12 13a4 4 0 100-8 4 4 0 000 8z", title: "Camera Scan", desc: "Maak een foto van een brief of factuur. Gemini Vision leest de tekst, Haiku extraheert de details. Binnen 5 seconden staat je rekening erin.", tag: "Vision AI" },
  { icon: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0", title: "Escalatie Tracking", desc: "PayWatch herkent in welke fase je rekening zit: openstaand, herinnering, aanmaning, incasso, of deurwaarder. Per fase zie je wat de extra kosten zijn en welke rechten je hebt.", tag: "5 fases" },
  { icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", title: "AI Reactiebrieven", desc: "Bezwaarschrift, betalingsregeling, klacht of verzoek tot uitstel — Claude Haiku schrijft een nette, formele brief in het Nederlands. Aanpasbaar voordat je het verstuurt.", tag: "4 templates" },
  { icon: "M22 7l-8.5 8.5-5-5L2 17M16 7h6v6", title: "Cashflow Forecast", desc: "Voorspel je uitgaven voor de komende maand op basis van je terugkerende rekeningen en betaalgeschiedenis. Weet wat er aankomt.", tag: "Voorspelling" },
  { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", title: "Privacy & Veiligheid", desc: "Geen e-mailinhoud opgeslagen. OAuth tokens versleuteld met AES-256. GDPR compliant met data export en account verwijdering. Row Level Security.", tag: "AES-256" },
  { icon: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z", title: "Stemmings Tracker", desc: "Log hoe je je voelt over je financiële situatie. PayWatch past zijn toon en advies aan. Want schulden beheren gaat niet alleen over geld.", tag: "Welzijn" },
  { icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75", title: "Hulp bij Schulden", desc: "Directe links naar het Juridisch Loket, Nibud, en je lokale schuldhulpverlening op basis van je gemeente. Altijd bereikbaar vanuit de app.", tag: "Lokaal" },
  { icon: "M12 3q1 4 4 6.5t3 5.5a1 1 0 01-14 0 5 5 0 011-3 1 1 0 005 0c0-2-1.5-3-1.5-5q0-2 2.5-4z", title: "Streaks & Badges", desc: "Dagelijkse streaks voor betaalgedrag, 11 badges om te verdienen, en een besparingen teller. Kleine overwinningen houden je gemotiveerd.", tag: "Gamificatie" },
  { icon: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9", title: "WIK Kostencalculator", desc: "Bereken automatisch de wettelijke incassokosten volgens de Wet Incassokosten. Weet precies of je teveel betaalt.", tag: "Nederlands recht" },
];

export default function FeaturesPage() {
  return (
    <section className="py-16 px-6 bg-pw-bg min-h-screen">
      <div className="max-w-[1140px] mx-auto">
        <div className="text-center mb-14">
          <span className="text-[12px] font-semibold text-pw-blue tracking-widest uppercase">Features</span>
          <h1 className="text-[40px] font-extrabold text-pw-navy mt-2 mb-3 tracking-tight">Alles in één app</h1>
          <p className="text-[16px] text-pw-muted max-w-[500px] mx-auto">
            Van het scannen van je inbox tot AI-advies — PayWatch doet het werk voor je.
          </p>
        </div>

        <div className="space-y-4">
          {features.map((f, i) => (
            <div key={f.title} className="flex items-start gap-6 py-7 border-b border-pw-border last:border-0">
              <div className={`w-12 h-12 rounded-xl ${i % 2 === 0 ? "bg-pw-blue-light" : "bg-pw-purple-light"} flex items-center justify-center shrink-0`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={i % 2 === 0 ? "#2563EB" : "#7C3AED"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={f.icon} />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2.5 mb-1">
                  <h3 className="text-[17px] font-bold text-pw-navy">{f.title}</h3>
                  <span className="text-[10px] font-semibold text-pw-purple bg-pw-purple-light px-2 py-0.5 rounded">{f.tag}</span>
                </div>
                <p className="text-[14px] text-pw-muted leading-relaxed max-w-[600px]">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16 py-12 bg-white rounded-card border border-pw-border">
          <h2 className="text-page-heading text-pw-navy mb-3">Overtuigd?</h2>
          <p className="text-body text-pw-muted mb-6">Gratis beginnen. Geen creditcard nodig.</p>
          <Link
            href={siteConfig.appUrl}
            className="inline-block bg-pw-blue text-white text-[15px] font-semibold px-8 py-3 rounded-button hover:bg-blue-700 transition-colors"
          >
            Start gratis →
          </Link>
        </div>
      </div>
    </section>
  );
}
