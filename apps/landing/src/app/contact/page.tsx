"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/config";

export default function ContactPage() {
  const [contactType, setContactType] = useState<"consumer" | "business">("consumer");
  const [submitted, setSubmitted] = useState(false);

  const consumerReasons = ["Vragen over de app", "Privacy & AVG", "Foutmelding / bug", "Overig"];
  const businessReasons = ["Samenwerking", "Vermelding als jurist / hulporganisatie", "Technische vragen", "Privacy & AVG", "Algemene vraag"];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: POST to /api/contact → Supabase contact_submissions table
    setSubmitted(true);
  };

  return (
    <section className="py-16 px-6 bg-pw-bg min-h-screen">
      <div className="max-w-[900px] mx-auto">
        <h1 className="text-hero text-pw-navy mb-2">Contact</h1>
        <p className="text-body text-pw-muted mb-8">Vraag, opmerking of wil je samenwerken? We horen graag van je.</p>

        {/* Type toggle */}
        <div className="flex gap-2 mb-6">
          {(["consumer", "business"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setContactType(t)}
              className={`px-5 py-2 rounded-input text-[13px] font-semibold border-[1.5px] transition-colors ${
                contactType === t
                  ? "border-pw-blue bg-pw-blue-light text-pw-blue"
                  : "border-pw-border bg-white text-pw-muted"
              }`}
            >
              {t === "consumer" ? "Consument" : "Bedrijf"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-card p-8 border border-pw-border">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-pw-green-light flex items-center justify-center mx-auto mb-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="text-section-head text-pw-navy mb-2">Bedankt!</h3>
                <p className="text-body text-pw-muted">We nemen zo snel mogelijk contact op.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-label text-pw-muted block mb-1.5">Naam</label>
                  <input required className="w-full px-3.5 py-2.5 rounded-input border border-pw-border text-body bg-pw-bg outline-none focus:ring-2 focus:ring-pw-blue/20 focus:border-pw-blue" placeholder="Je naam" />
                </div>
                <div>
                  <label className="text-label text-pw-muted block mb-1.5">E-mail</label>
                  <input required type="email" className="w-full px-3.5 py-2.5 rounded-input border border-pw-border text-body bg-pw-bg outline-none focus:ring-2 focus:ring-pw-blue/20 focus:border-pw-blue" placeholder="je@email.nl" />
                </div>
                <div>
                  <label className="text-label text-pw-muted block mb-1.5">Onderwerp</label>
                  <select className="w-full px-3.5 py-2.5 rounded-input border border-pw-border text-body bg-pw-bg outline-none focus:ring-2 focus:ring-pw-blue/20 focus:border-pw-blue">
                    {(contactType === "consumer" ? consumerReasons : businessReasons).map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-label text-pw-muted block mb-1.5">Bericht</label>
                  <textarea required rows={4} className="w-full px-3.5 py-2.5 rounded-input border border-pw-border text-body bg-pw-bg outline-none focus:ring-2 focus:ring-pw-blue/20 focus:border-pw-blue resize-y font-[inherit]" placeholder="Waar kunnen we je mee helpen?" />
                </div>
                <button type="submit" className="w-full bg-pw-blue text-white rounded-button py-3 text-[14px] font-semibold hover:bg-blue-700 transition-colors">
                  Verstuur
                </button>
              </form>
            )}
          </div>

          {/* Contact info card */}
          <div className="space-y-4">
            <div className="bg-white rounded-card p-7 border border-pw-border">
              <h3 className="text-section-head text-pw-navy mb-4">Onze gegevens</h3>
              {[
                { label: "Bedrijf", value: "PayWatch B.V." },
                { label: "Locatie", value: "Rotterdam, Nederland" },
                { label: "KVK", value: siteConfig.kvk },
                { label: "Pers", value: siteConfig.emails.press },
                { label: "Zakelijk", value: siteConfig.emails.business },
                { label: "Algemeen", value: siteConfig.emails.general },
              ].map((c, i, arr) => (
                <div key={c.label} className={`flex justify-between py-2 ${i < arr.length - 1 ? "border-b border-pw-border" : ""}`}>
                  <span className="text-[13px] text-pw-muted">{c.label}</span>
                  <span className="text-[13px] font-semibold text-pw-text">{c.value}</span>
                </div>
              ))}
            </div>

            <div className="bg-pw-blue-light rounded-card p-5 border border-pw-blue/10">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" />
              </svg>
              <p className="text-[13px] text-pw-navy leading-relaxed">
                <strong>Voor bedrijven:</strong> Wil je als jurist, hulporganisatie of schuldhulpverlener in onze directory staan? Neem contact op via het formulier.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
