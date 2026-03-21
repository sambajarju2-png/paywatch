"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { useApp } from "@/components/AppProvider";

export default function FeaturesPage() {
  const { lang } = useApp();
  const n = lang === "nl";
  const features = [
    { icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6", title: "Gmail Scanner", desc: n ? "Verbind je Gmail en PayWatch scant automatisch je e-mails. AI classificeert en extraheert alle details." : "Connect Gmail and PayWatch auto-scans your emails. AI classifies and extracts all details.", tag: "Gemini + Haiku" },
    { icon: "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2zM12 13a4 4 0 100-8 4 4 0 000 8z", title: "Camera Scan", desc: n ? "Maak een foto van een brief of factuur. Vision AI leest de tekst en extraheert de details." : "Snap a photo of a letter or invoice. Vision AI reads and extracts the details.", tag: "Vision AI" },
    { icon: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0", title: n ? "Escalatie Tracking" : "Escalation Tracking", desc: n ? "PayWatch herkent in welke fase je rekening zit: openstaand, herinnering, aanmaning, incasso, of deurwaarder." : "PayWatch detects your bill stage: outstanding, reminder, notice, collection, or bailiff.", tag: n ? "5 fases" : "5 stages" },
    { icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", title: n ? "AI Reactiebrieven" : "AI Response Letters", desc: n ? "Bezwaarschrift, betalingsregeling, klacht of uitstel — AI schrijft een nette brief." : "Objection, payment plan, complaint or delay — AI writes a formal letter.", tag: "4 templates" },
    { icon: "M22 7l-8.5 8.5-5-5L2 17M16 7h6v6", title: "Cashflow Forecast", desc: n ? "Voorspel je uitgaven op basis van terugkerende rekeningen." : "Predict expenses based on recurring bills.", tag: n ? "Voorspelling" : "Forecast" },
    { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", title: n ? "Privacy & Veiligheid" : "Privacy & Security", desc: n ? "Geen e-mailinhoud opgeslagen. OAuth tokens versleuteld met AES-256. GDPR compliant." : "No email content stored. OAuth tokens encrypted with AES-256. GDPR compliant.", tag: "AES-256" },
  ];

  return (
    <section className="py-16 px-6 bg-pw-bg min-h-screen">
      <div className="max-w-[1140px] mx-auto">
        <div className="text-center mb-14">
          <span className="text-[12px] font-semibold text-pw-blue tracking-widest uppercase">Features</span>
          <h1 className="text-[40px] font-extrabold text-pw-navy mt-2 mb-3 tracking-tight">{n ? "Alles in één app" : "Everything in one app"}</h1>
        </div>
        <div className="space-y-4">
          {features.map((f, i) => (
            <div key={f.title} className="flex items-start gap-6 py-7 border-b border-pw-border last:border-0">
              <div className={`w-12 h-12 rounded-xl ${i % 2 === 0 ? "bg-pw-blue-light" : "bg-pw-purple-light"} flex items-center justify-center shrink-0`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={i % 2 === 0 ? "#2563EB" : "#7C3AED"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={f.icon} /></svg>
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
        <div className="text-center mt-16 py-12 bg-white rounded-card border border-pw-border">
          <h2 className="text-page-heading text-pw-navy mb-3">{n ? "Overtuigd?" : "Convinced?"}</h2>
          <Link href={siteConfig.appUrl} className="inline-block bg-pw-blue text-white text-[15px] font-semibold px-8 py-3 rounded-button hover:bg-blue-700 transition-colors">{n ? "Start gratis" : "Start free"}</Link>
        </div>
      </div>
    </section>
  );
}
