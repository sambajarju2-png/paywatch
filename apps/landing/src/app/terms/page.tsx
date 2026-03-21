"use client";

import { useApp } from "@/components/AppProvider";

export default function TermsPage() {
  const { lang } = useApp();
  const n = lang === "nl";
  return (
    <section className="py-16 px-6 bg-white min-h-screen">
      <div className="max-w-[720px] mx-auto">
        <span className="text-label text-pw-muted">{n ? "Laatst bijgewerkt: 21 maart 2026" : "Last updated: March 21, 2026"}</span>
        <h1 className="text-hero text-pw-navy mt-2 mb-6">{n ? "Algemene Voorwaarden" : "Terms & Conditions"}</h1>
        <div className="bg-pw-bg rounded-card border border-pw-border p-8 text-center">
          <p className="text-body text-pw-muted">{n ? "Deze pagina wordt binnenkort gepubliceerd via ons CMS." : "This page will be published soon via our CMS."}</p>
        </div>
      </div>
    </section>
  );
}
