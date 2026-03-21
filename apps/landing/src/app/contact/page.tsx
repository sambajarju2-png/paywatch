"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/config";
import { useApp } from "@/components/AppProvider";

export default function ContactPage() {
  const { lang } = useApp();
  const n = lang === "nl";
  const [contactType, setContactType] = useState<"consumer" | "business">("consumer");
  const [submitted, setSubmitted] = useState(false);
  const reasons = contactType === "consumer"
    ? [n ? "Vragen over de app" : "App questions", "Privacy & AVG", n ? "Foutmelding" : "Bug report", n ? "Overig" : "Other"]
    : [n ? "Samenwerking" : "Partnership", n ? "Vermelding als jurist" : "Listing as lawyer", n ? "Technische vragen" : "Technical questions", n ? "Algemeen" : "General"];

  return (
    <section className="py-16 px-6 bg-pw-bg min-h-screen">
      <div className="max-w-[900px] mx-auto">
        <h1 className="text-hero text-pw-navy mb-2">Contact</h1>
        <p className="text-body text-pw-muted mb-8">{n ? "Vraag, opmerking of wil je samenwerken?" : "Question, comment or partnership?"}</p>
        <div className="flex gap-2 mb-6">
          {(["consumer", "business"] as const).map((t) => (
            <button key={t} onClick={() => setContactType(t)} className={`px-5 py-2 rounded-input text-[13px] font-semibold border-[1.5px] transition-colors ${contactType === t ? "border-pw-blue bg-pw-blue-light text-pw-blue" : "border-pw-border bg-white text-pw-muted"}`}>
              {t === "consumer" ? (n ? "Consument" : "Consumer") : (n ? "Bedrijf" : "Business")}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-card p-8 border border-pw-border">
            {submitted ? (
              <div className="text-center py-8">
                <h3 className="text-section-head text-pw-navy mb-2">{n ? "Bedankt!" : "Thank you!"}</h3>
                <p className="text-body text-pw-muted">{n ? "We nemen zo snel mogelijk contact op." : "We will get back to you ASAP."}</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                <div>
                  <label className="text-label text-pw-muted block mb-1.5">{n ? "Naam" : "Name"}</label>
                  <input required className="w-full px-3.5 py-2.5 rounded-input border border-pw-border text-body bg-pw-bg outline-none focus:border-pw-blue" />
                </div>
                <div>
                  <label className="text-label text-pw-muted block mb-1.5">E-mail</label>
                  <input required type="email" className="w-full px-3.5 py-2.5 rounded-input border border-pw-border text-body bg-pw-bg outline-none focus:border-pw-blue" />
                </div>
                <div>
                  <label className="text-label text-pw-muted block mb-1.5">{n ? "Onderwerp" : "Subject"}</label>
                  <select className="w-full px-3.5 py-2.5 rounded-input border border-pw-border text-body bg-pw-bg outline-none focus:border-pw-blue">
                    {reasons.map((r) => (<option key={r}>{r}</option>))}
                  </select>
                </div>
                <div>
                  <label className="text-label text-pw-muted block mb-1.5">{n ? "Bericht" : "Message"}</label>
                  <textarea required rows={4} className="w-full px-3.5 py-2.5 rounded-input border border-pw-border text-body bg-pw-bg outline-none focus:border-pw-blue resize-y" />
                </div>
                <button type="submit" className="w-full bg-pw-blue text-white rounded-button py-3 text-[14px] font-semibold hover:bg-blue-700 transition-colors">{n ? "Verstuur" : "Send"}</button>
              </form>
            )}
          </div>
          <div className="bg-white rounded-card p-7 border border-pw-border h-fit">
            <h3 className="text-section-head text-pw-navy mb-4">{n ? "Onze gegevens" : "Our details"}</h3>
            {[
              { label: n ? "Bedrijf" : "Company", value: "PayWatch B.V." },
              { label: n ? "Locatie" : "Location", value: "Rotterdam, Nederland" },
              { label: "KVK", value: siteConfig.kvk },
              { label: n ? "Pers" : "Press", value: siteConfig.emails.press },
              { label: n ? "Zakelijk" : "Business", value: siteConfig.emails.business },
              { label: n ? "Algemeen" : "General", value: siteConfig.emails.general },
            ].map((c, i, arr) => (
              <div key={c.label} className={`flex justify-between py-2 ${i < arr.length - 1 ? "border-b border-pw-border" : ""}`}>
                <span className="text-[13px] text-pw-muted">{c.label}</span>
                <span className="text-[13px] font-semibold text-pw-text">{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
