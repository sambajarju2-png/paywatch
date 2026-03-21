"use client";

import { useApp } from "@/components/AppProvider";

export default function PrivacyPage() {
  const { lang } = useApp();
  const n = lang === "nl";
  return (
    <section className="py-16 px-6 bg-white min-h-screen">
      <div className="max-w-[720px] mx-auto">
        <span className="text-label text-pw-muted">{n ? "Laatst bijgewerkt: 21 maart 2026" : "Last updated: March 21, 2026"}</span>
        <h1 className="text-hero text-pw-navy mt-2 mb-6">{n ? "Privacyverklaring" : "Privacy Policy"}</h1>
        <div className="space-y-6 text-[14px] text-pw-muted leading-[1.7]">
          <div>
            <h2 className="text-[18px] font-bold text-pw-text mb-2">{n ? "1. Welke data verzamelen we?" : "1. What data do we collect?"}</h2>
            <p>{n ? "PayWatch verzamelt je e-mailadres en wachtwoord voor authenticatie, factuurgegevens geëxtraheerd uit e-mails, je taalvoorkeur en gemeente voor lokale hulpverlening, en anonieme gebruiksstatistieken." : "PayWatch collects your email and password for authentication, invoice data extracted from emails, your language preference and municipality for local aid, and anonymous usage statistics."}</p>
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-pw-text mb-2">{n ? "2. Hoe gebruiken we je data?" : "2. How do we use your data?"}</h2>
            <p>{n ? "We gebruiken je data uitsluitend om de PayWatch dienst te leveren: rekeningen bijhouden, escalaties detecteren, AI-inzichten genereren, en meldingen sturen. We verkopen je data nooit aan derden." : "We use your data exclusively to provide the PayWatch service: tracking bills, detecting escalations, generating AI insights, and sending notifications. We never sell your data to third parties."}</p>
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-pw-text mb-2">{n ? "3. Gmail toegang" : "3. Gmail access"}</h2>
            <p>{n ? "Als je Gmail verbindt, scannen we alleen de metadata en bijlagen van e-mails om facturen te detecteren. We slaan nooit de volledige inhoud van je e-mails op. Je kunt Gmail op elk moment loskoppelen." : "When you connect Gmail, we only scan email metadata and attachments to detect invoices. We never store full email content. You can disconnect Gmail at any time."}</p>
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-pw-text mb-2">{n ? "4. AI verwerking" : "4. AI processing"}</h2>
            <p>{n ? "We gebruiken Google Gemini Flash voor e-mailclassificatie en Anthropic Claude Haiku voor factuurextractie. Je data wordt niet gebruikt om AI-modellen te trainen." : "We use Google Gemini Flash for email classification and Anthropic Claude Haiku for invoice extraction. Your data is not used to train AI models."}</p>
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-pw-text mb-2">{n ? "5. Dataopslag & beveiliging" : "5. Data storage & security"}</h2>
            <p>{n ? "Je data wordt opgeslagen in Supabase (EU-West, Ierland). OAuth tokens zijn versleuteld met AES-256. Alle verbindingen gebruiken TLS 1.3." : "Your data is stored in Supabase (EU-West, Ireland). OAuth tokens are encrypted with AES-256. All connections use TLS 1.3."}</p>
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-pw-text mb-2">{n ? "6. Je rechten (GDPR)" : "6. Your rights (GDPR)"}</h2>
            <p>{n ? "Je hebt het recht op inzage, correctie, verwijdering, data-export (JSON), beperking van verwerking, en het intrekken van toestemming. Gebruik de instellingen in de app of neem contact op via privacy@paywatch.app." : "You have the right to access, correct, delete, export (JSON), restrict processing, and withdraw consent. Use the app settings or contact privacy@paywatch.app."}</p>
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-pw-text mb-2">{n ? "7. Cookies" : "7. Cookies"}</h2>
            <p>{n ? "We gebruiken alleen functionele cookies voor authenticatie en taalvoorkeur. Geen tracking cookies, geen advertenties." : "We only use functional cookies for authentication and language preference. No tracking cookies, no ads."}</p>
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-pw-text mb-2">{n ? "8. Contact" : "8. Contact"}</h2>
            <p>{n ? "Voor vragen over privacy: privacy@paywatch.app. Klachten kun je indienen bij de Autoriteit Persoonsgegevens." : "For privacy questions: privacy@paywatch.app. Complaints can be filed with the Dutch Data Protection Authority."}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
