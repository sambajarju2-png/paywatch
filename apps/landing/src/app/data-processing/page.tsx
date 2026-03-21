export default function DataProcessingPage() {
  const processors = [
    { name: "Supabase", purpose: "Database & Authenticatie", data: "Accounts, rekeningen, instellingen", loc: "EU (eu-west-1)" },
    { name: "Anthropic (Claude Haiku)", purpose: "AI factuurextractie & inzichten", data: "Factuurdetails (geen volledige e-mails)", loc: "US" },
    { name: "Google (Gemini Flash)", purpose: "E-mailclassificatie & camera OCR", data: "E-mail metadata, foto's van facturen", loc: "EU/US" },
    { name: "Resend", purpose: "Transactionele e-mails", data: "E-mailadres", loc: "US" },
    { name: "Sentry", purpose: "Foutrapportage", data: "Anonieme foutrapporten", loc: "EU" },
    { name: "Sanity", purpose: "Website CMS", data: "Geen gebruikersdata", loc: "EU" },
  ];

  const security = [
    "AES-256 encryptie voor OAuth tokens",
    "Row Level Security (RLS) op alle tabellen",
    "TLS 1.3 voor alle verbindingen",
    "HSTS, CSP en X-Frame-Options headers",
    "Geen e-mailinhoud opgeslagen — alleen factuurdata",
    "Geen data gebruikt voor AI-modeltraining",
  ];

  return (
    <section className="py-16 px-6 bg-white min-h-screen">
      <div className="max-w-[900px] mx-auto">
        <h1 className="text-hero text-pw-navy mb-2">Data verwerking</h1>
        <p className="text-[15px] text-pw-muted mb-8 max-w-[600px]">
          Transparantie is niet optioneel. Hier zie je precies welke diensten we gebruiken, wat ze doen, en hoe we jouw data beschermen.
        </p>

        {/* Processor table */}
        <div className="bg-pw-bg rounded-card border border-pw-border overflow-hidden mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-pw-bg">
                {["Dienst", "Doel", "Data", "Locatie", "Status"].map((h, i) => (
                  <th key={h} className={`px-4 py-3 text-[11px] font-semibold text-pw-muted uppercase tracking-wider border-b border-pw-border ${i === 4 ? "text-center" : "text-left"}`}>
                    {h}
                  </th>
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
                  <td className="px-4 py-3 text-center">
                    <span className="bg-pw-green-light text-pw-green text-[10px] font-semibold px-2 py-0.5 rounded">GDPR ✓</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Security measures */}
        <h3 className="text-[18px] font-bold text-pw-navy mb-3">Beveiligingsmaatregelen</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {security.map((s) => (
            <div key={s} className="flex items-start gap-2 px-4 py-3 bg-pw-bg rounded-[10px] border border-pw-border">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-[13px] text-pw-text leading-snug">{s}</span>
            </div>
          ))}
        </div>

        {/* Data stance */}
        <div className="mt-8 bg-pw-blue-light rounded-card p-6 border border-pw-blue/10">
          <div className="flex items-center gap-2 mb-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="text-[14px] font-bold text-pw-navy">Ons standpunt over data</span>
          </div>
          <p className="text-[13px] text-pw-muted leading-relaxed">
            PayWatch slaat nooit de volledige inhoud van je e-mails op. We extraheren alleen factuurgegevens. AI providers (Anthropic, Google) gebruiken je data niet om hun modellen te trainen. Alle OAuth tokens zijn versleuteld met AES-256 en worden opgeslagen in de EU.
          </p>
        </div>
      </div>
    </section>
  );
}
