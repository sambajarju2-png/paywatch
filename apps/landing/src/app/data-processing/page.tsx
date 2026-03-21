"use client";

import { useApp } from "@/components/AppProvider";

export default function DataProcessingPage() {
  const { lang } = useApp();
  const n = lang === "nl";
  const processors = [
    { name: "Supabase", purpose: "Database & Auth", data: n ? "Accounts, rekeningen" : "Accounts, bills", loc: "EU (eu-west-1)" },
    { name: "Anthropic (Claude Haiku)", purpose: "AI extraction", data: n ? "Factuurdetails" : "Invoice details", loc: "US" },
    { name: "Google (Gemini Flash)", purpose: "AI classification", data: "E-mail metadata", loc: "EU/US" },
    { name: "Resend", purpose: "Transactional email", data: "E-mailadres", loc: "US" },
    { name: "Sentry", purpose: n ? "Foutrapportage" : "Error reporting", data: n ? "Anonieme foutrapporten" : "Anonymous error reports", loc: "EU" },
    { name: "Sanity", purpose: "Website CMS", data: n ? "Geen gebruikersdata" : "No user data", loc: "EU" },
  ];

  return (
    <section className="py-16 px-6 bg-white min-h-screen">
      <div className="max-w-[900px] mx-auto">
        <h1 className="text-hero text-pw-navy mb-2">{n ? "Data verwerking" : "Data processing"}</h1>
        <p className="text-[15px] text-pw-muted mb-8">{n ? "Transparantie is niet optioneel. Hier zie je precies welke diensten we gebruiken." : "Transparency is not optional. Here you can see exactly which services we use."}</p>
        <div className="bg-pw-bg rounded-card border border-pw-border overflow-hidden mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-pw-bg">
                {[n ? "Dienst" : "Service", n ? "Doel" : "Purpose", "Data", n ? "Locatie" : "Location"].map((h) => (
                  <th key={h} className="px-4 py-3 text-[11px] font-semibold text-pw-muted uppercase tracking-wider border-b border-pw-border text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {processors.map((p) => (
                <tr key={p.name} className="border-b border-pw-border last:border-0 bg-white">
                  <td className="px-4 py-3 text-[13px] font-semibold text-pw-text">{p.name}</td>
                  <td className="px-4 py-3 text-[13px] text-pw-muted">{p.purpose}</td>
                  <td className="px-4 py-3 text-[13px] text-pw-muted">{p.data}</td>
                  <td className="px-4 py-3 text-[13px] text-pw-muted">{p.loc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
