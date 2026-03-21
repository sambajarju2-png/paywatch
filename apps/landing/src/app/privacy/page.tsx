export default function PrivacyPage() {
  return (
    <section className="py-16 px-6 bg-white min-h-screen">
      <div className="max-w-[720px] mx-auto">
        <span className="text-label text-pw-muted">Laatst bijgewerkt: 21 maart 2026</span>
        <h1 className="text-hero text-pw-navy mt-2 mb-6">Privacyverklaring</h1>
        
        <div className="prose prose-sm max-w-none text-pw-muted leading-[1.7] space-y-6">
          <div>
            <h2 className="text-[18px] font-bold text-pw-text mb-2">1. Welke data verzamelen we?</h2>
            <p>PayWatch verzamelt je e-mailadres en wachtwoord voor authenticatie, factuurgegevens geëxtraheerd uit e-mails (bedrag, IBAN, vervaldatum, leverancier), je taalvoorkeur en gemeente voor lokale hulpverlening, en anonieme gebruiksstatistieken.</p>
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-pw-text mb-2">2. Hoe gebruiken we je data?</h2>
            <p>We gebruiken je data uitsluitend om de PayWatch dienst te leveren: rekeningen bijhouden, escalaties detecteren, AI-inzichten genereren, en meldingen sturen. We verkopen je data nooit aan derden.</p>
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-pw-text mb-2">3. Gmail toegang</h2>
            <p>Als je Gmail verbindt, scannen we alleen de metadata en bijlagen van e-mails om facturen te detecteren. We slaan nooit de volledige inhoud van je e-mails op. Je kunt Gmail op elk moment loskoppelen.</p>
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-pw-text mb-2">4. AI verwerking</h2>
            <p>We gebruiken Google Gemini Flash voor e-mailclassificatie en Anthropic Claude Haiku voor factuurextractie. Beide zijn gebonden aan verwerkingsovereenkomsten. Je data wordt niet gebruikt om AI-modellen te trainen.</p>
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-pw-text mb-2">5. Dataopslag & beveiliging</h2>
            <p>Je data wordt opgeslagen in Supabase (EU-West, Ierland). OAuth tokens zijn versleuteld met AES-256. Alle verbindingen gebruiken TLS 1.3. We implementeren Row Level Security.</p>
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-pw-text mb-2">6. Je rechten (GDPR)</h2>
            <p>Je hebt het recht op inzage, correctie, verwijdering, data-export (JSON), beperking van verwerking, en het intrekken van toestemming. Gebruik de instellingen in de app of neem contact op via privacy@paywatch.app.</p>
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-pw-text mb-2">7. Cookies</h2>
            <p>We gebruiken alleen functionele cookies voor authenticatie en taalvoorkeur. Geen tracking cookies, geen advertenties, geen analytics cookies van derden.</p>
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-pw-text mb-2">8. Contact</h2>
            <p>Voor vragen over privacy: privacy@paywatch.app. Klachten kun je indienen bij de Autoriteit Persoonsgegevens (autoriteitpersoonsgegevens.nl).</p>
          </div>
        </div>
      </div>
    </section>
  );
}
