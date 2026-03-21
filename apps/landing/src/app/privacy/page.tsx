"use client";

import { useApp } from "@/components/AppProvider";
import { siteConfig } from "@/lib/config";

const privacyContent = {
  nl: {
    lastUpdated: "Laatst bijgewerkt: 15 maart 2026",
    sections: [
      {
        title: "1. Wie zijn wij?",
        body: `PayWatch (KVK: ${siteConfig.company.kvk}) is verantwoordelijk voor de verwerking van persoonsgegevens zoals beschreven in dit privacybeleid. Ons kantoor is gevestigd in Rotterdam, Nederland. Voor vragen over privacy kunt u contact opnemen via ${siteConfig.company.emails.privacy}.`,
      },
      {
        title: "2. Welke gegevens verzamelen wij?",
        body: "Wij verzamelen de volgende categorieën persoonsgegevens: accountgegevens (naam, e-mailadres), e-mailinhoud (tijdelijk, alleen voor het herkennen van rekeningen via Gmail OAuth), rekening- en betaalgegevens die uit e-mails worden geëxtraheerd, gebruiksgegevens (inlogmomenten, gebruikte functies), en taalvoorkeur en thema-instelling (opgeslagen in localStorage).",
      },
      {
        title: "3. Waarvoor gebruiken wij je gegevens?",
        body: "Wij verwerken je gegevens voor het leveren van onze dienst (rekeningen herkennen en bijhouden), het verbeteren van onze AI-modellen (geanonimiseerd), het versturen van service-gerelateerde e-mails, en het naleven van wettelijke verplichtingen.",
      },
      {
        title: "4. Rechtsgronden",
        body: "Wij verwerken je gegevens op basis van: uitvoering van de overeenkomst (het leveren van de PayWatch-dienst), toestemming (voor Gmail-koppeling), en gerechtvaardigd belang (voor dienstverlening en verbetering).",
      },
      {
        title: "5. Delen met derden",
        body: "Wij delen je gegevens alleen met verwerkers die noodzakelijk zijn voor onze dienstverlening. Zie onze pagina Gegevensverwerking voor een complete lijst van subverwerkers. Wij verkopen nooit je gegevens aan derden.",
      },
      {
        title: "6. Beveiliging",
        body: "Wij nemen de bescherming van je gegevens serieus. We gebruiken AES-256 encryptie, TLS 1.3, Row Level Security, en OAuth 2.0 met read-only scope voor Gmail. Zie onze pagina Gegevensverwerking voor alle beveiligingsmaatregelen.",
      },
      {
        title: "7. Bewaartermijnen",
        body: "Accountgegevens: zolang je account actief is + 6 maanden na verwijdering. E-mailinhoud: wordt niet opgeslagen, alleen tijdelijk verwerkt tijdens scanning. Rekeninggegevens: zolang je account actief is. Gebruiksgegevens: maximaal 12 maanden.",
      },
      {
        title: "8. Jouw rechten",
        body: `Je hebt het recht op inzage, rectificatie, verwijdering, beperking van verwerking, dataportabiliteit, en het recht om bezwaar te maken. Neem contact op via ${siteConfig.company.emails.privacy} om je rechten uit te oefenen. We reageren binnen 30 dagen.`,
      },
      {
        title: "9. Cookies en tracking",
        body: "PayWatch gebruikt geen tracking cookies en geen advertentiecookies. We slaan alleen je taalvoorkeur en thema-instelling op in localStorage. Dit zijn geen cookies en worden niet naar onze servers gestuurd.",
      },
      {
        title: "10. Wijzigingen",
        body: "Wij kunnen dit privacybeleid van tijd tot tijd wijzigen. Bij belangrijke wijzigingen stellen wij je op de hoogte via e-mail of een melding in de app.",
      },
    ],
  },
  en: {
    lastUpdated: "Last updated: March 15, 2026",
    sections: [
      {
        title: "1. Who are we?",
        body: `PayWatch (KVK: ${siteConfig.company.kvk}) is responsible for the processing of personal data as described in this privacy policy. Our office is located in Rotterdam, Netherlands. For privacy questions, contact us at ${siteConfig.company.emails.privacy}.`,
      },
      {
        title: "2. What data do we collect?",
        body: "We collect the following categories of personal data: account information (name, email address), email content (temporary, only for recognizing bills via Gmail OAuth), bill and payment data extracted from emails, usage data (login times, features used), and language preference and theme setting (stored in localStorage).",
      },
      {
        title: "3. What do we use your data for?",
        body: "We process your data to deliver our service (recognizing and tracking bills), improve our AI models (anonymized), send service-related emails, and comply with legal obligations.",
      },
      {
        title: "4. Legal basis",
        body: "We process your data based on: performance of contract (delivering the PayWatch service), consent (for Gmail connection), and legitimate interest (for service delivery and improvement).",
      },
      {
        title: "5. Sharing with third parties",
        body: "We only share your data with processors necessary for our service delivery. See our Data Processing page for a complete list of sub-processors. We never sell your data to third parties.",
      },
      {
        title: "6. Security",
        body: "We take the protection of your data seriously. We use AES-256 encryption, TLS 1.3, Row Level Security, and OAuth 2.0 with read-only scope for Gmail. See our Data Processing page for all security measures.",
      },
      {
        title: "7. Retention periods",
        body: "Account data: as long as your account is active + 6 months after deletion. Email content: not stored, only temporarily processed during scanning. Bill data: as long as your account is active. Usage data: maximum 12 months.",
      },
      {
        title: "8. Your rights",
        body: `You have the right to access, rectification, erasure, restriction of processing, data portability, and the right to object. Contact ${siteConfig.company.emails.privacy} to exercise your rights. We respond within 30 days.`,
      },
      {
        title: "9. Cookies and tracking",
        body: "PayWatch does not use tracking cookies or advertising cookies. We only store your language preference and theme setting in localStorage. These are not cookies and are not sent to our servers.",
      },
      {
        title: "10. Changes",
        body: "We may update this privacy policy from time to time. For significant changes, we will notify you via email or a notification in the app.",
      },
    ],
  },
};

export default function PrivacyPage() {
  const { lang, t } = useApp();
  const content = privacyContent[lang];

  return (
    <div className="bg-[var(--bg)]">
      <div className="mx-auto max-w-3xl px-4 pt-12 pb-16 sm:px-6 sm:pt-20 sm:pb-24">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--navy)] tracking-tight text-center">{t.privacy.title}</h1>
        <p className="text-base text-[var(--muted)] mt-3 text-center">{t.privacy.subtitle}</p>
        <p className="text-xs text-[var(--muted)] mt-2 text-center">{content.lastUpdated}</p>

        <div className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10">
          {content.sections.map((section, i) => (
            <div key={i} className={`${i > 0 ? "mt-8 pt-6 border-t border-[var(--border)]" : ""}`}>
              <h2 className="text-base font-bold text-[var(--navy)] mb-2">{section.title}</h2>
              <p className="text-sm text-[var(--text)] leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
