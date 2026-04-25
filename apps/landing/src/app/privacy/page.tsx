"use client";

import { useState } from "react";
import { useApp } from "@/components/AppProvider";
import { siteConfig } from "@/lib/config";

/* ── Tab 1: Existing Privacy Policy ── */
const privacyContent = {
  nl: {
    lastUpdated: "Laatst bijgewerkt: 25 april 2026",
    sections: [
      {
        title: "1. Wie zijn wij?",
        body: `PayWatch (KVK: ${siteConfig.company.kvk}) is verantwoordelijk voor de verwerking van persoonsgegevens zoals beschreven in dit privacybeleid. Ons kantoor is gevestigd in Rotterdam, Nederland. Voor vragen over privacy kunt u contact opnemen via ${siteConfig.company.emails.privacy}.`,
      },
      {
        title: "2. Welke gegevens verzamelen wij?",
        body: `Wij verzamelen alleen wat nodig is:\n\n• Accountgegevens: naam en e-mailadres\n• Rekeninggegevens: bedrijfsnaam, bedrag, vervaldatum, IBAN en referentie — geëxtraheerd uit je e-mails of gescande rekeningen\n• E-mailmetadata: afzender, onderwerp en datum — tijdelijk verwerkt via Gmail (read-only) of Outlook (read-only), uitsluitend voor het herkennen van rekeningen\n• Gebruiksgegevens: inlogmomenten en gebruikte functies\n\nWat wij NIET opslaan:\n• Geen volledige e-mailteksten of bijlagen\n• Geen foto's of afbeeldingen van je rekeningen\n• Geen adresgegevens of BSN\n• Geen bankwachtwoorden of inloggegevens\n• Geen locatiegegevens`,
      },
      {
        title: "3. Waarvoor gebruiken wij je gegevens?",
        body: "Wij verwerken je gegevens uitsluitend voor: het leveren van onze dienst (rekeningen herkennen, bijhouden en waarschuwen bij escalatie), het berekenen van financiële overzichten (toeslagen, beslagvrije voet), het versturen van service-gerelateerde e-mails, en het naleven van wettelijke verplichtingen.",
      },
      {
        title: "4. Rechtsgronden",
        body: "Wij verwerken je gegevens op basis van: uitvoering van de overeenkomst (het leveren van de PayWatch-dienst), toestemming (voor Gmail/Outlook-koppeling), en gerechtvaardigd belang (voor dienstverlening en verbetering).",
      },
      {
        title: "5. Delen met derden",
        body: "Wij delen je gegevens alleen met verwerkers die noodzakelijk zijn voor onze dienstverlening. Alle gevoelige gegevens (e-mails, rekeningen, foto's) worden verwerkt via onze eigen AI-engine gehost bij Scaleway in Parijs, Frankrijk. Je data verlaat de EU niet voor scan- en analysedoeleinden. Zie onze pagina Gegevensverwerking voor een complete lijst. Wij verkopen nooit je gegevens aan derden.",
      },
      {
        title: "6. Beveiliging",
        body: "Wij nemen de bescherming van je gegevens serieus. We gebruiken AES-256 encryptie, TLS 1.3, Row Level Security, en OAuth 2.0 met read-only scope. Onze AI-analyse draait op servers in de EU (Parijs, Frankrijk) — je financiële gegevens verlaten Europa niet. Foto's van rekeningen worden direct na verwerking verwijderd en niet opgeslagen.",
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
    lastUpdated: "Last updated: April 25, 2026",
    sections: [
      {
        title: "1. Who are we?",
        body: `PayWatch (KVK: ${siteConfig.company.kvk}) is responsible for the processing of personal data as described in this privacy policy. Our office is located in Rotterdam, Netherlands. For privacy questions, contact us at ${siteConfig.company.emails.privacy}.`,
      },
      {
        title: "2. What data do we collect?",
        body: "We only collect what's necessary:\n\n• Account details: name and email address\n• Bill data: vendor name, amount, due date, IBAN, and reference — extracted from your emails or scanned bills\n• Email metadata: sender, subject, and date — temporarily processed via Gmail (read-only) or Outlook (read-only), solely for recognizing bills\n• Usage data: login times and features used\n\nWhat we do NOT store:\n• No full email texts or attachments\n• No photos or images of your bills\n• No home addresses or BSN numbers\n• No bank passwords or login credentials\n• No location data",
      },
      {
        title: "3. What do we use your data for?",
        body: "We process your data exclusively to: deliver our service (recognizing, tracking, and alerting on bill escalation), calculate financial overviews (benefits eligibility, beslagvrije voet), send service-related emails, and comply with legal obligations.",
      },
      {
        title: "4. Legal basis",
        body: "We process your data based on: performance of contract (delivering the PayWatch service), consent (for Gmail/Outlook connection), and legitimate interest (for service delivery and improvement).",
      },
      {
        title: "5. Sharing with third parties",
        body: "We only share your data with processors necessary for our service delivery. All sensitive data (emails, bills, photos) is processed via our own AI engine hosted at Scaleway in Paris, France. Your data does not leave the EU for scanning purposes. See our Data Processing page for a complete list. We never sell your data to third parties.",
      },
      {
        title: "6. Security",
        body: "We take the protection of your data seriously. We use AES-256 encryption, TLS 1.3, Row Level Security, and OAuth 2.0 with read-only scope. Our AI analysis runs on servers in the EU (Paris, France) — your financial data never leaves Europe. Photos of bills are deleted immediately after processing and are not stored.",
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

/* ── Tab 2: Google API / Data Processing ── */
type DataItem = {
  title: string;
  items: string[];
};

type DataSection = {
  title: string;
  body?: string;
  subsections?: DataItem[];
};

const dataProcessingContent: Record<string, { lastUpdated: string; badge: string; sections: DataSection[]; flowTitle: string; flow: [string, "blue" | "red", string][] }> = {
  nl: {
    lastUpdated: "Laatst bijgewerkt: 26 maart 2026",
    badge: "Het gebruik van informatie ontvangen via Google API's door PayWatch voldoet aan het Google API Services User Data Policy, inclusief de Limited Use-vereisten.",
    flowTitle: "Samenvatting gegevensstroom Gmail",
    flow: [
      ["1", "blue", "Gebruiker verbindt Gmail (gmail.readonly scope)"],
      ["2", "blue", "AI classificeert e-mail: rekening of niet?"],
      ["3", "red", "Niet-rekeningen worden direct genegeerd (niet opgeslagen)"],
      ["4", "blue", "Van rekeningen worden alleen velden geëxtraheerd: leverancier, bedrag, datum, IBAN, referentie"],
      ["5", "blue", "Geëxtraheerde velden worden opgeslagen als rekeningrecord"],
      ["6", "red", "Originele e-mailtekst wordt NIET opgeslagen"],
    ],
    sections: [
      {
        title: "1. Gmail- en Outlook-gegevens (bij verbinding)",
        subsections: [
          {
            title: "Wat wij opvragen en verwerken",
            items: [
              "Wij vragen toegang tot je Gmail via de scope gmail.readonly (alleen-lezen)",
              "Voor Outlook/Hotmail gebruiken wij de Microsoft Graph scope Mail.Read (alleen-lezen)",
              "Dezelfde principes gelden voor zowel Gmail- als Outlook-koppelingen",
              "Onze AI scant e-mailonderwerpen en afzenders om rekeningen te herkennen",
              "Van herkende rekeningen extraheren wij uitsluitend: leveranciersnaam, bedrag, vervaldatum, IBAN en referentienummer",
              "Wij slaan NOOIT volledige e-mailteksten op",
              "Wij slaan NOOIT bijlagen op (alleen geëxtraheerde velden)",
              "Wij slaan NOOIT persoonlijke e-mails op die geen rekeningen zijn",
              "E-mails die niet als rekening worden herkend, worden direct genegeerd en niet opgeslagen",
              "Gmail Message ID's en Outlook Message ID's worden opgeslagen om dubbele verwerking te voorkomen",
            ],
          },
        ],
      },
      {
        title: "2. Camerascan-gegevens",
        subsections: [
          {
            title: "Hoe foto's worden verwerkt",
            items: [
              "Wanneer je een foto maakt van een rekening, wordt deze naar onze AI gestuurd voor extractie",
              "De foto zelf wordt NOOIT opgeslagen — alleen de geëxtraheerde rekeninggegevens",
              "QR-codes worden lokaal op je apparaat gescand",
            ],
          },
        ],
      },
      {
        title: "3. AI-verwerking",
        subsections: [
          {
            title: "Welke AI-diensten wij gebruiken",
            items: [
              "Google Gemini 2.5 Flash: classificeert e-mails (rekening/geen rekening) en extraheert gegevens uit camerafoto's",
              "Anthropic Claude Haiku 4.5: extraheert rekeninggegevens uit e-mailtekst, genereert financiële inzichten en conceptbrieven",
              "AI-modellen ontvangen alleen de minimaal benodigde data per verzoek",
              "Wij trainen GEEN AI-modellen met jouw gegevens",
              "AI-verwerking vindt plaats via beveiligde API-verbindingen (HTTPS)",
            ],
          },
        ],
      },
      {
        title: "4. Opslag en beveiliging",
        subsections: [
          {
            title: "Database",
            items: [
              "Alle gegevens worden opgeslagen in Supabase (PostgreSQL), gehost in de EU (eu-west-1, Ierland)",
              "Row Level Security (RLS) is ingeschakeld op alle tabellen — je kunt alleen je eigen gegevens zien",
              "Betalingsbewijzen worden opgeslagen in een privé Supabase Storage-bucket met getekende URL's (signed URLs)",
              "Wachtwoorden worden gehasht opgeslagen (nooit in platte tekst)",
            ],
          },
          {
            title: "Beveiligingsmaatregelen",
            items: [
              "Alle communicatie verloopt via HTTPS (TLS-encryptie)",
              "OAuth-tokens worden versleuteld opgeslagen met AES-256-GCM met unieke IV per token",
              "Rate limiting op alle API-eindpunten",
              "Content Security Policy (CSP) headers",
              "Minimale data-overdracht naar AI-diensten",
            ],
          },
        ],
      },
      {
        title: "5. Verwerkers (sub-processors)",
        body: "Wij verkopen je gegevens NOOIT aan derden. Wij delen je gegevens alleen met de volgende verwerkers:",
        subsections: [
          {
            title: "Lijst van verwerkers",
            items: [
              "Supabase (database en authenticatie) — EU-gehost, GDPR-compliant",
              "Google Gemini API (AI-classificatie en extractie) — alleen e-mailfragmenten worden verstuurd",
              "Anthropic Claude API (AI-extractie en inzichten) — alleen minimale e-mailtekst wordt verstuurd",
              "Microsoft Graph API (Outlook e-mail scanning) — alleen-lezen toegang via Mail.Read scope",
              "Vercel (hosting) — verwerkt geen gebruikersgegevens direct",
              "Resend (e-mail) — alleen voor transactionele e-mails (wachtwoord reset, verificatie)",
            ],
          },
        ],
      },
      {
        title: "6. Google API Services — Gebruikersgegevensbeleid",
        body: "Het gebruik van informatie ontvangen via Google API's door PayWatch voldoet aan het Google API Services User Data Policy, inclusief de Limited Use-vereisten:",
        subsections: [
          {
            title: "Onze verplichtingen",
            items: [
              "Wij gebruiken Gmail-gegevens uitsluitend voor het herkennen en extraheren van rekeningen — het kerndoel van PayWatch",
              "Wij dragen geen Gmail-gegevens over aan derden, tenzij noodzakelijk voor de kernfunctionaliteit (AI-extractie), met expliciete toestemming, of vereist door de wet",
              "Wij gebruiken Gmail-gegevens NIET voor advertenties, marktonderzoek, of het trainen van AI-modellen",
              "Wij staan menselijke toegang tot Gmail-gegevens NIET toe, tenzij met jouw toestemming, noodzakelijk voor beveiligingsdoeleinden, of vereist door de wet",
              "Je kunt je Gmail-verbinding op elk moment ontkoppelen via Instellingen — hierbij worden alle opgeslagen Gmail-tokens verwijderd",
            ],
          },
        ],
      },
      {
        title: "7. Gegevensverwijdering",
        body: "Je kunt op elk moment je gegevens verwijderen:",
        subsections: [
          {
            title: "Verwijderingsopties",
            items: [
              "Gmail ontkoppelen: verwijdert alle Gmail-tokens en stopt het scannen",
              "Outlook ontkoppelen: verwijdert alle Outlook-tokens en stopt het scannen",
              "Individuele rekeningen verwijderen: verwijdert de rekening en bijbehorend betalingsbewijs",
              "Account verwijderen: verwijdert alle gegevens permanent — rekeningen, instellingen, buddy-relaties, community-posts, Gmail- en Outlook-koppelingen",
              "Verwijdering is permanent en kan niet ongedaan worden gemaakt",
              "Verwijdering wordt binnen 30 dagen voltooid in alle systemen",
            ],
          },
        ],
      },
    ],
  },
  en: {
    lastUpdated: "Last updated: March 26, 2026",
    badge: "PayWatch's use of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements.",
    flowTitle: "Gmail data flow summary",
    flow: [
      ["1", "blue", "User connects Gmail (gmail.readonly scope)"],
      ["2", "blue", "AI classifies email: bill or not?"],
      ["3", "red", "Non-bills are immediately discarded (not stored)"],
      ["4", "blue", "From bills, only fields are extracted: vendor, amount, date, IBAN, reference"],
      ["5", "blue", "Extracted fields are stored as a bill record"],
      ["6", "red", "Original email text is NOT stored"],
    ],
    sections: [
      {
        title: "1. Gmail and Outlook data (when connected)",
        subsections: [
          {
            title: "What we request and process",
            items: [
              "We request access to your Gmail via the scope gmail.readonly (read-only)",
              "For Outlook/Hotmail we use the Microsoft Graph scope Mail.Read (read-only)",
              "The same principles apply to both Gmail and Outlook connections",
              "Our AI scans email subjects and senders to identify bills",
              "From recognized bills, we extract only: vendor name, amount, due date, IBAN and reference number",
              "We NEVER store full email texts",
              "We NEVER store email attachments (only extracted fields)",
              "We NEVER store personal emails that are not bills",
              "Emails not recognized as bills are immediately discarded and not stored",
              "Gmail Message IDs and Outlook Message IDs are stored to prevent duplicate processing",
            ],
          },
        ],
      },
      {
        title: "2. Camera scan data",
        subsections: [
          {
            title: "How photos are processed",
            items: [
              "When you take a photo of a bill, it is sent to our AI for extraction",
              "The photo itself is NEVER stored — only the extracted bill data",
              "QR codes are scanned locally on your device",
            ],
          },
        ],
      },
      {
        title: "3. AI processing",
        subsections: [
          {
            title: "Which AI services we use",
            items: [
              "Google Gemini 2.5 Flash: classifies emails (bill/not bill) and extracts data from camera photos",
              "Anthropic Claude Haiku 4.5: extracts bill data from email text, generates financial insights and draft letters",
              "AI models only receive the minimum data required per request",
              "We do NOT train AI models with your data",
              "AI processing occurs via secure API connections (HTTPS)",
            ],
          },
        ],
      },
      {
        title: "4. Storage and security",
        subsections: [
          {
            title: "Database",
            items: [
              "All data is stored in Supabase (PostgreSQL), hosted in the EU (eu-west-1, Ireland)",
              "Row Level Security (RLS) is enabled on all tables — you can only see your own data",
              "Payment proofs are stored in a private Supabase Storage bucket with signed URLs",
              "Passwords are stored hashed (never in plain text)",
            ],
          },
          {
            title: "Security measures",
            items: [
              "All communication is over HTTPS (TLS encryption)",
              "OAuth tokens are encrypted at rest with AES-256-GCM using unique IVs per token",
              "Rate limiting on all API endpoints",
              "Content Security Policy (CSP) headers",
              "Minimal data transfer to AI services",
            ],
          },
        ],
      },
      {
        title: "5. Processors (sub-processors)",
        body: "We NEVER sell your data to third parties. We only share your data with the following processors:",
        subsections: [
          {
            title: "List of processors",
            items: [
              "Supabase (database and authentication) — EU-hosted, GDPR-compliant",
              "Google Gemini API (AI classification and extraction) — only email fragments are sent",
              "Anthropic Claude API (AI extraction and insights) — only minimal email text is sent",
              "Microsoft Graph API (Outlook email scanning) — read-only access via Mail.Read scope",
              "Vercel (hosting) — does not process user data directly",
              "Resend (email) — only for transactional emails (password reset, verification)",
            ],
          },
        ],
      },
      {
        title: "6. Google API Services — User Data Policy",
        body: "PayWatch's use of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements:",
        subsections: [
          {
            title: "Our commitments",
            items: [
              "We use Gmail data solely to identify and extract bills — the core purpose of PayWatch",
              "We do not transfer Gmail data to third parties, except as necessary for core functionality (AI extraction), with explicit user consent, or as required by law",
              "We do NOT use Gmail data for advertising, market research, or training AI models",
              "We do NOT allow human access to Gmail data, unless with your consent, necessary for security purposes, or required by law",
              "You can disconnect your Gmail at any time via Settings — this deletes all stored Gmail tokens",
            ],
          },
        ],
      },
      {
        title: "7. Data deletion",
        body: "You can delete your data at any time:",
        subsections: [
          {
            title: "Deletion options",
            items: [
              "Disconnect Gmail: deletes all Gmail tokens and stops scanning",
              "Disconnect Outlook: deletes all Outlook tokens and stops scanning",
              "Delete individual bills: removes the bill and associated payment proof",
              "Delete account: permanently removes all data — bills, settings, buddy relationships, community posts, Gmail and Outlook connections",
              "Deletion is permanent and cannot be undone",
              "Deletion is completed within 30 days across all systems",
            ],
          },
        ],
      },
    ],
  },
};

/* ── Helper: highlight NOOIT/NEVER/NIET/NOT lines ── */
function isNeverLine(text: string) {
  return /NOOIT|NEVER|NIET\b|NOT\b|GEEN\b/.test(text);
}

/* ── Component ── */
export default function PrivacyPage() {
  const { lang, t } = useApp();
  const [activeTab, setActiveTab] = useState<"privacy" | "data">("privacy");

  const privacy = privacyContent[lang];
  const data = dataProcessingContent[lang];

  const tabs = {
    nl: { privacy: "Privacybeleid", data: "Gegevensverwerking" },
    en: { privacy: "Privacy Policy", data: "Data Processing" },
  };

  return (
    <div className="bg-[var(--bg)]">
      <div className="mx-auto max-w-3xl px-4 pt-12 pb-16 sm:px-6 sm:pt-20 sm:pb-24">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--navy)] tracking-tight text-center">
          {t.privacy.title}
        </h1>
        <p className="text-base text-[var(--muted)] mt-3 text-center">{t.privacy.subtitle}</p>

        {/* ── Tab Switcher ── */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--border)_30%,transparent)] p-1 gap-1">
            <button
              onClick={() => setActiveTab("privacy")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "privacy"
                  ? "bg-[var(--surface)] text-[var(--navy)] shadow-sm"
                  : "text-[var(--muted)] hover:text-[var(--text)]"
              }`}
            >
              {tabs[lang].privacy}
            </button>
            <button
              onClick={() => setActiveTab("data")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "data"
                  ? "bg-[var(--surface)] text-[var(--navy)] shadow-sm"
                  : "text-[var(--muted)] hover:text-[var(--text)]"
              }`}
            >
              {tabs[lang].data}
            </button>
          </div>
        </div>

        {/* ── Tab 1: Privacy Policy (existing) ── */}
        {activeTab === "privacy" && (
          <div className="mt-6">
            <p className="text-xs text-[var(--muted)] text-center mb-6">{privacy.lastUpdated}</p>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10">
              {privacy.sections.map((section, i) => (
                <div key={i} className={i > 0 ? "mt-8 pt-6 border-t border-[var(--border)]" : ""}>
                  <h2 className="text-base font-bold text-[var(--navy)] mb-2">{section.title}</h2>
                  <p className="text-sm text-[var(--text)] leading-relaxed">{section.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab 2: Data Processing (new) ── */}
        {activeTab === "data" && (
          <div className="mt-6">
            <p className="text-xs text-[var(--muted)] text-center mb-6">{data.lastUpdated}</p>

            {/* Google API compliance badge */}
            <div className="flex gap-3 items-start rounded-xl border border-[var(--blue)]/20 bg-[color-mix(in_srgb,var(--blue)_8%,transparent)] p-4 mb-6">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              <p className="text-sm text-[var(--text)] leading-relaxed">{data.badge}</p>
            </div>

            {/* Sections */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10">
              {data.sections.map((section, si) => (
                <div key={si} className={si > 0 ? "mt-8 pt-6 border-t border-[var(--border)]" : ""}>
                  <h2 className="text-base font-bold text-[var(--navy)] mb-2">{section.title}</h2>
                  {section.body && (
                    <p className="text-sm text-[var(--text)] leading-relaxed mb-4">{section.body}</p>
                  )}
                  {section.subsections?.map((sub, subi) => (
                    <div key={subi} className={subi > 0 ? "mt-4" : "mt-3"}>
                      <h3 className="text-sm font-semibold text-[var(--text)] mb-2">{sub.title}</h3>
                      <div className="rounded-xl border border-[var(--border)] overflow-hidden">
                        {sub.items.map((item, ii) => {
                          const never = isNeverLine(item);
                          return (
                            <div
                              key={ii}
                              className={`flex gap-3 items-start px-4 py-2.5 text-sm leading-relaxed ${
                                ii < sub.items.length - 1 ? "border-b border-[var(--border)]" : ""
                              } ${never ? "text-[var(--red)] font-semibold" : "text-[var(--text)]"}`}
                            >
                              <span
                                className="mt-[7px] shrink-0 w-1.5 h-1.5 rounded-full"
                                style={{ background: never ? "var(--red)" : "var(--blue)" }}
                              />
                              <span>{item}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Gmail Data Flow Summary */}
            <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10">
              <h3 className="text-base font-bold text-[var(--navy)] mb-4">{data.flowTitle}</h3>
              {data.flow.map(([num, color, text], i) => (
                <div
                  key={i}
                  className={`flex gap-3 items-start py-3 ${
                    i < data.flow.length - 1 ? "border-b border-[var(--border)]" : ""
                  }`}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      background: `color-mix(in srgb, var(--${color}) 12%, transparent)`,
                      color: `var(--${color})`,
                    }}
                  >
                    {num}
                  </div>
                  <p className={`text-sm leading-snug ${color === "red" ? "font-semibold text-[var(--text)]" : "text-[var(--text)]"}`}>
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-xs text-[var(--muted)] text-center mt-12">
          © {new Date().getFullYear()} PayWatch — Samba Finance, Rotterdam, Netherlands
          <br />
          <a href={`mailto:${siteConfig.company.emails.privacy}`} className="text-[var(--blue)] hover:underline">
            {siteConfig.company.emails.privacy}
          </a>
        </p>
      </div>
    </div>
  );
}
