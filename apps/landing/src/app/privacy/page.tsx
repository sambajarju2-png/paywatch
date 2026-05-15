"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/components/AppProvider";
import { siteConfig } from "@/lib/config";

/* ── Tab 1: Existing Privacy Policy ── */
const privacyContent = {
  nl: {
    lastUpdated: "Laatst bijgewerkt: 14 mei 2026",
    sections: [
      {
        title: "1. Wie zijn wij?",
        body: `PayWatch is een Nederlandse app die je helpt grip te krijgen op je rekeningen en schulden. We zijn opgericht in Rotterdam en ingeschreven bij de KvK onder nummer ${siteConfig.company.kvk}.\n\nWij zijn de verwerkingsverantwoordelijke voor je persoonsgegevens. Dat betekent dat wij bepalen waarvoor en hoe je gegevens worden verwerkt — en dat we daarvoor verantwoordelijk zijn.\n\nOnze privacyverantwoordelijke is Samba Jarju (CTO). Vragen over je privacy? Mail naar ${siteConfig.company.emails.privacy}.`,
      },
      {
        title: "2. Welke gegevens verzamelen wij — en waarom?",
        body: "We verzamelen zo min mogelijk. Hieronder staat precies wat we nodig hebben, waarom, en of het verplicht of optioneel is.\n\nVERPLICHT (nodig om de app te laten werken)\n• E-mailadres — om in te loggen en je account te beveiligen\n• Naam — om je persoonlijk aan te spreken in de app\n\nOPTIONEEL (je kiest zelf of je dit gebruikt)\n• Gmail/Outlook-koppeling — we scannen onderwerpen en afzenders om rekeningen te vinden. Bij e-mails die over rekeningen gaan, lezen we de inhoud om bedrijfsnaam, bedrag en vervaldatum te herkennen. We slaan alleen de geëxtraheerde rekeninggegevens op — nooit de e-mailtekst zelf.\n• Bankkoppeling (via Enable Banking) — we zien je transacties (bedrijfsnaam, bedrag, datum). We kunnen nooit geld overmaken. Zie sectie 3.\n• Foto\'s van rekeningen — de foto wordt direct verwerkt door AI en daarna verwijderd. We bewaren de foto niet.\n• Inkomen en vaste lasten — voor de beslagvrije voet-berekening en toeslagen-check.\n• Spraakgesprekken met PayBuddy — onze AI-assistent. Gesprekken worden niet opgenomen of opgeslagen.\n• Videogesprekken met je coach — via LiveKit. Versleuteld, niet opgenomen. Wij kunnen niet meekijken of meeluisteren.\n\nWAT WE NIET VERZAMELEN\n• Geen BSN of identiteitsbewijs\n• Geen adresgegevens\n• Geen bankwachtwoorden of inlogcodes\n• Geen locatiegegevens\n• Geen opslag van e-mailteksten (alleen geëxtraheerde rekeningdata)",
      },
      {
        title: "3. Bankkoppeling — hoe werkt dat?",
        body: "Als je je bankrekening koppelt, gebeurt dat via Enable Banking — een Europese PSD2-dienstverlener met vergunning van de Finse toezichthouder (FIN-FSA).\n\n• Je logt in bij je eigen bank (via de beveiligde omgeving van je bank)\n• Enable Banking geeft ons alleen-lezen toegang tot je transacties\n• We kunnen nooit geld overmaken of betalingen doen\n• Wij zien je bankwachtwoord niet\n• Elke 90 dagen moet je de toestemming opnieuw bevestigen\n• Je kunt de koppeling op elk moment intrekken\n\nWat we uit je transacties halen: bedrijfsnaam, bedrag en datum. Dit gebruiken we om je rekeningen automatisch te herkennen en bij te houden.",
      },
      {
        title: "4. Bijzondere persoonsgegevens",
        body: "Onder de AVG zijn \"bijzondere persoonsgegevens\" extra beschermd — denk aan gegevens over gezondheid, religie, politieke overtuiging, seksuele geaardheid, of vakbondslidmaatschap.\n\nWAT JE MOET WETEN\nPayWatch is niet gericht op het verwerken van bijzondere persoonsgegevens. Het valt echter niet uit te sluiten dat banktransacties indirect bijzondere persoonsgegevens kunnen onthullen — bijvoorbeeld als een bedrijfsnaam een zorginstelling, politieke partij of religieuze organisatie betreft.\n\nConcreet voorbeeld: als je via je bankrekening een betaling hebt gedaan aan een zorginstelling, zien wij alleen:\n• Bedrijfsnaam (bijv. \"Kliniek XYZ\")\n• Bedrag (bijv. \u20ac120,00)\n• Datum\n\nWij zien niet:\n• Welke behandeling je hebt gehad\n• Welke diagnose je hebt\n• Waarom je hebt betaald\n\nOnze AI is getraind om rekeningen te herkennen (bedrijf, bedrag, vervaldatum) — niet om transacties medisch of anderszins te categoriseren. We bouwen geen gezondheidsprofielen, politieke profielen of andere gevoelige profielen.\n\nRECHTSGROND\nVoor zover transactiegegevens indirect bijzondere persoonsgegevens kunnen onthullen, verwerken wij deze uitsluitend omdat dit technisch noodzakelijk is om de door jou gevraagde financiële analyse- en schuldpreventiedienst te leveren (Art. 6(1)(b) AVG).\n\nTECHNISCHE EN ORGANISATORISCHE MAATREGELEN\n• Categorisering is uitsluitend financieel (bijv. \"zorgverzekering\", \"energie\") — nooit medisch of persoonlijk\n• Je kunt op elk moment een transactie verwijderen uit je overzicht\n• Stopt je bankkoppeling? Transactiegegevens worden binnen 30 dagen verwijderd\n• Geen medewerker van PayWatch heeft toegang tot individuele transacties\n• Bijzondere persoonsgegevens worden nooit gebruikt voor profilering of geautomatiseerde besluitvorming",
      },
      {
        title: "5. Waarvoor gebruiken wij je gegevens?",
        body: "Wij gebruiken je gegevens alléén voor:\n\n• Rekeningen herkennen en bijhouden\n• Waarschuwen bij escalatie — als een rekening overgaat naar aanmaning, incasso of deurwaarder\n• Financiële berekeningen — beslagvrije voet, toeslagen-check, cashflow-overzicht\n• Service-e-mails — bevestigingen en waarschuwingen\n• App verbeteren — geanonimiseerde gebruiksstatistieken\n\nWij gebruiken je gegevens NOOIT voor:\n• Reclame of advertenties\n• Verkoop aan derden\n• Het beoordelen van je kredietwaardigheid\n• Profilering voor commerciële doeleinden",
      },
      {
        title: "6. Rechtsgronden (AVG)",
        body: "We verwerken je gegevens op basis van:\n\n• Uitvoering van de overeenkomst — zonder je basisgegevens kunnen we de dienst niet leveren\n• Toestemming — voor Gmail/Outlook- en bankkoppeling. Je kunt deze altijd intrekken\n• Gerechtvaardigd belang — voor het verbeteren van de app en voorkomen van fraude",
      },
      {
        title: "7. AI-verwerking",
        body: "PayWatch gebruikt AI op drie plekken. In alle gevallen geldt: je gegevens verlaten de EU niet.\n\n1. Rekeningen herkennen en extraheren — Mistral AI (gehost op onze eigen servers bij Scaleway in Parijs) scant je e-mails op rekeningen, extraheert bedrijfsnaam, bedrag en vervaldatum, en verwerkt foto\'s van rekeningen. E-mailteksten en foto\'s worden niet opgeslagen.\n\n2. Financiële samenvattingen — Anthropic Claude genereert inzichten op basis van je rekeningtotalen. Claude ontvangt geen persoonlijke gegevens — alleen samenvattingen zoals totaalbedragen en aantallen.\n\n3. PayBuddy spraakassistent — ElevenLabs verwerkt je spraak. Gesprekken worden niet opgenomen of opgeslagen.\n\nGeen van deze AI-diensten wordt getraind op jouw data.",
      },
      {
        title: "8. Delen met derden",
        body: `Wij delen je gegevens alleen met dienstverleners die nodig zijn om PayWatch te laten werken:\n\n• Supabase (EU) — database en authenticatie\n• Mistral AI / Scaleway (Parijs) — e-mail classificatie, rekeningextractie, OCR foto's\n• Enable Banking (Finland, EU) — bankkoppeling via PSD2\n• ElevenLabs — spraakverwerking voor PayBuddy\n• Vercel (EU) — hosting\n• LiveKit (EU) — videogesprekken met je coach\n• Resend — service-e-mails\n\nMet al deze partijen hebben wij verwerkersovereenkomsten. Wij verkopen nooit je gegevens.`,
      },
      {
        title: "9. Beveiliging",
        body: "• AES-256 encryptie voor data in rust\n• TLS 1.3 voor data in transit\n• Row Level Security — je ziet alleen je eigen gegevens\n• OAuth 2.0 met read-only scope voor e-mailkoppelingen\n• Alle AI-verwerking binnen de EU\n• Foto's direct na scan verwijderd\n• Videogesprekken end-to-end versleuteld",
      },
      {
        title: "10. Bewaartermijnen",
        body: "• Accountgegevens — zolang je account actief is + 6 maanden na verwijdering\n• Rekeninggegevens — zolang je account actief is\n• Banktransacties — zolang koppeling actief + 30 dagen na intrekking\n• E-mailinhoud — niet opgeslagen, alleen tijdelijk verwerkt\n• Foto's — direct na scan verwijderd\n• Spraak- en videogesprekken — niet opgeslagen\n• Gebruiksgegevens — maximaal 12 maanden",
      },
      {
        title: "11. Jouw rechten",
        body: `Onder de AVG heb je deze rechten:\n\n• Inzage — opvragen welke gegevens wij van je hebben\n• Correctie — onjuiste gegevens laten aanpassen\n• Verwijdering — je account en alle gegevens laten verwijderen\n• Beperking — verwerking tijdelijk stopzetten\n• Overdracht — je gegevens in leesbaar formaat ontvangen\n• Bezwaar — bezwaar maken tegen verwerking\n• Toestemming intrekken — voor e-mail- of bankkoppeling, op elk moment\n\nMail naar ${siteConfig.company.emails.privacy}. We reageren binnen 30 dagen.\n\nNiet tevreden? Je kunt een klacht indienen bij de Autoriteit Persoonsgegevens (autoriteitpersoonsgegevens.nl).`,
      },
      {
        title: "12. Cookies en tracking",
        body: "PayWatch gebruikt geen tracking cookies en geen advertentiecookies.\n\nIn de app slaan we alleen je taalvoorkeur en thema-instelling op (localStorage). Dit wordt niet naar onze servers gestuurd.\n\nOp onze website gebruiken wij PostHog (EU, Frankfurt) voor geanonimiseerde bezoekersstatistieken. In de app wordt geen analytics-tracking gebruikt.",
      },
      {
        title: "13. Wijzigingen",
        body: "Wij kunnen dit privacybeleid wijzigen. Bij belangrijke wijzigingen stellen wij je op de hoogte via e-mail of een melding in de app.",
      },
    ],
  },
  en: {
    lastUpdated: "Last updated: May 10, 2026",
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
        body: `We only share your data with processors necessary for our service delivery.

For scanning and analysing photos of bills, we use Mistral AI Small (vision model), hosted via Scaleway in Paris, France — this is a self-hosted installation on our own server infrastructure. Your photo is not sent anywhere else and we cannot see the images ourselves. Photos are deleted immediately after processing.

All other sensitive data (emails, bills) is processed via our own AI engine hosted at Scaleway in Amsterdam/Paris, the Netherlands/France. Your data does not leave the EU for scanning or analysis purposes.

We never sell your data to third parties.`,
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
        body: "PayWatch does not use tracking cookies or advertising cookies. We only store your language preference and theme setting in localStorage. These are not cookies and are not sent to our servers. On our landing page (paywatch.app), we use PostHog for anonymized visitor statistics. PostHog runs in the EU and does not collect personal data. In the app itself (app.paywatch.app), no analytics tracking is used.",
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
    lastUpdated: "Laatst bijgewerkt: 10 mei 2026",
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
              "Mistral AI (gehost bij Scaleway in Parijs, Frankrijk): classificeert e-mails, extraheert rekeninggegevens (bedrijf, bedrag, datum) en verwerkt camerafoto's — volledig binnen de EU",
              "Anthropic Claude: genereert financiële samenvattingen op basis van rekeningtotalen — ontvangt geen individuele persoonsgegevens",
              "AI-modellen ontvangen alleen de minimaal benodigde data per verzoek",
              "Wij trainen GEEN AI-modellen met jouw gegevens",
              "Gevoelige gegevens (e-mails, foto's, IBAN's) verlaten de EU niet",
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
              "Scaleway Generative API (AI-scan en extractie) — gehost in Parijs, Frankrijk, volledig binnen de EU",
              "Anthropic Claude — financiële samenvattingen op basis van rekeningtotalen (geen individuele persoonsgegevens)",
              "Microsoft Graph API (Outlook e-mail scanning) — alleen-lezen toegang via Mail.Read scope",
              "Enable Banking (PSD2 open banking) — banksynchronisatie via beveiligde PSD2-verbinding, alleen-lezen toegang tot transacties en saldo. Wij kunnen NOOIT geld overboeken of je saldo wijzigen. Verbindingen verlopen automatisch na 90 dagen",
              "Vercel (hosting) — verwerkt geen gebruikersgegevens direct",
              "Resend (e-mail) — alleen voor transactionele e-mails (wachtwoord reset, verificatie)",
              "Apple Push Notification service (APNs) — voor pushmeldingen op iOS-apparaten",
              "ElevenLabs (spraak-AI) — voor de PayBuddy spraakassistent, alleen wanneer je de spraakfunctie actief gebruikt",
              "PostHog (website-analytics) — alleen op paywatch.app (de landingspagina). PostHog draait in de EU (eu.posthog.com). Wij tracken geen gebruikers in de app (app.paywatch.app). Er worden geen persoonsgegevens verzameld, alleen geanonimiseerde paginabezoeken",
              "RevenueCat (abonnementenbeheer) — voor het beheren van iOS-abonnementen via de App Store. Wij ontvangen alleen abonnementsstatus, geen betalingsgegevens",
            ],
          },
        ],
      },
      {
        title: "5b. iOS-app: apparaatrechten",
        body: "De PayWatch iOS-app vraagt optioneel toegang tot de volgende apparaatfuncties. Je kunt elk recht op elk moment intrekken via iOS Instellingen:",
        subsections: [
          {
            title: "Camera",
            items: [
              "Wordt gebruikt om rekeningen te scannen via de camerafunctie",
              "Foto's worden NIET opgeslagen — alleen de geëxtraheerde gegevens (bedrijfsnaam, bedrag, vervaldatum) worden bewaard",
              "Je kunt de camera ook gebruiken om QR-codes op rekeningen te scannen — dit gebeurt volledig lokaal op je apparaat",
            ],
          },
          {
            title: "Microfoon",
            items: [
              "Wordt alleen gebruikt voor PayBuddy, je financiële spraakassistent",
              "Spraak wordt in realtime verwerkt via ElevenLabs en NIET opgeslagen door PayWatch",
              "De microfoon is pas actief wanneer je expliciet op de spraakknop drukt",
            ],
          },
          {
            title: "Pushmeldingen",
            items: [
              "Herinneringen wanneer een rekening bijna vervalt of achterstallig is",
              "Meldingen over e-mailscanresultaten en banktransactiematches",
              "Je kunt meldingen op elk moment uitschakelen via iOS Instellingen → Meldingen → PayWatch",
            ],
          },
          {
            title: "Face ID / Touch ID",
            items: [
              "Optioneel: bescherm de app met biometrische verificatie",
              "PayWatch heeft GEEN toegang tot je biometrische gegevens — iOS verwerkt dit volledig lokaal",
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
    lastUpdated: "Last updated: May 10, 2026",
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
              "Mistral AI (hosted at Scaleway in Paris, France): classifies emails, extracts bill data (vendor, amount, date), and processes camera photos — fully within the EU",
              "Anthropic Claude: generates financial summaries based on bill totals — receives no individual personal data",
              "AI models only receive the minimum data required per request",
              "We do NOT train AI models with your data",
              "Sensitive data (emails, photos, IBANs) never leaves the EU",
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
              "Scaleway Generative API (AI scanning and extraction) — hosted in Paris, France, fully within the EU",
              "Anthropic Claude — financial summaries based on bill totals (no individual personal data)",
              "Microsoft Graph API (Outlook email scanning) — read-only access via Mail.Read scope",
              "Enable Banking (PSD2 open banking) — bank sync via secure PSD2 connection, read-only access to transactions and balance. We can NEVER transfer money or modify your balance. Connections expire automatically after 90 days",
              "Vercel (hosting) — does not process user data directly",
              "Resend (email) — only for transactional emails (password reset, verification)",
              "Apple Push Notification service (APNs) — for push notifications on iOS devices",
              "ElevenLabs (voice AI) — for the PayBuddy voice assistant, only when you actively use the voice feature",
              "PostHog (website analytics) — only on paywatch.app (the landing page). PostHog runs in the EU (eu.posthog.com). We do not track users in the app (app.paywatch.app). No personal data is collected, only anonymized page visits",
              "RevenueCat (subscription management) — for managing iOS subscriptions via the App Store. We only receive subscription status, no payment details",
            ],
          },
        ],
      },
      {
        title: "5b. iOS app: device permissions",
        body: "The PayWatch iOS app optionally requests access to the following device features. You can revoke any permission at any time via iOS Settings:",
        subsections: [
          {
            title: "Camera",
            items: [
              "Used to scan bills using the camera function",
              "Photos are NOT stored — only the extracted data (vendor name, amount, due date) is kept",
              "You can also use the camera to scan QR codes on bills — this happens entirely locally on your device",
            ],
          },
          {
            title: "Microphone",
            items: [
              "Only used for PayBuddy, your financial voice assistant",
              "Speech is processed in real-time via ElevenLabs and NOT stored by PayWatch",
              "The microphone is only active when you explicitly press the voice button",
            ],
          },
          {
            title: "Push notifications",
            items: [
              "Reminders when a bill is about to be due or overdue",
              "Notifications about email scan results and bank transaction matches",
              "You can disable notifications at any time via iOS Settings → Notifications → PayWatch",
            ],
          },
          {
            title: "Face ID / Touch ID",
            items: [
              "Optional: protect the app with biometric verification",
              "PayWatch has NO access to your biometric data — iOS processes this entirely locally",
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
function PrivacyContent() {
  const { lang, t } = useApp();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"privacy" | "data" | "dpia">("dpia");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "privacy" || tab === "data" || tab === "dpia") setActiveTab(tab);
  }, [searchParams]);

  const privacy = privacyContent[lang];
  const data = dataProcessingContent[lang];

  const tabs = {
    nl: { dpia: "DPIA", privacy: "Privacybeleid", data: "Gegevensverwerking" },
    en: { dpia: "DPIA", privacy: "Privacy Policy", data: "Data Processing" },
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
              onClick={() => setActiveTab("dpia")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "dpia"
                  ? "bg-[var(--surface)] text-[var(--navy)] shadow-sm"
                  : "text-[var(--muted)] hover:text-[var(--text)]"
              }`}
            >
              {tabs[lang].dpia}
            </button>
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
                  <p className="text-sm text-[var(--text)] leading-relaxed whitespace-pre-line">{section.body}</p>
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


        {/* ── Tab 3: DPIA ── */}
        {activeTab === "dpia" && (
          <div className="mt-6">
            <p className="text-xs text-[var(--muted)] text-center mb-6">Versie 1.0 — 15 mei 2026</p>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10 space-y-8">
              <div>
                <h2 className="text-base font-bold text-[var(--navy)] mb-2">1. Beschrijving van de verwerking</h2>
                <p className="text-sm text-[var(--text)] leading-relaxed whitespace-pre-line">{"PayWatch helpt Nederlandse huishoudens om grip te krijgen op hun rekeningen en schulden te voorkomen. De app herkent rekeningen uit e-mail en bankgegevens, volgt escalatiefases (factuur → herinnering → aanmaning → incasso → deurwaarder), en biedt hulptools.\n\nBetrokkenen: consumenten (app-gebruikers, waarvan een deel in een kwetsbare financiële situatie) en B2B-gebruikers (coaches en medewerkers van gemeenten en hulporganisaties).\n\nVerantwoordelijke: PayWatch (KVK 83474889), Rotterdam. Privacyverantwoordelijke: Samba Jarju (CTO)."}</p>
              </div>

              <div className="border-t border-[var(--border)] pt-6">
                <h2 className="text-base font-bold text-[var(--navy)] mb-2">2. Categorieën persoonsgegevens</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead><tr className="bg-[var(--bg)]">
                      <th className="text-left p-2 font-semibold text-[var(--navy)] border-b border-[var(--border)]">Categorie</th>
                      <th className="text-left p-2 font-semibold text-[var(--navy)] border-b border-[var(--border)]">Bron</th>
                      <th className="text-left p-2 font-semibold text-[var(--navy)] border-b border-[var(--border)]">Bewaartermijn</th>
                    </tr></thead>
                    <tbody className="text-[var(--text)]">
                      <tr><td className="p-2 border-b border-[var(--border)]">Naam, e-mailadres</td><td className="p-2 border-b border-[var(--border)]">Registratie</td><td className="p-2 border-b border-[var(--border)]">Account + 6 mnd</td></tr>
                      <tr><td className="p-2 border-b border-[var(--border)]">Rekeninggegevens (bedrijf, bedrag, datum)</td><td className="p-2 border-b border-[var(--border)]">E-mail scan, foto, handmatig</td><td className="p-2 border-b border-[var(--border)]">Actief account</td></tr>
                      <tr><td className="p-2 border-b border-[var(--border)]">Banktransacties</td><td className="p-2 border-b border-[var(--border)]">Enable Banking PSD2</td><td className="p-2 border-b border-[var(--border)]">Koppeling + 30 dgn</td></tr>
                      <tr><td className="p-2 border-b border-[var(--border)]">Financieel profiel</td><td className="p-2 border-b border-[var(--border)]">Handmatig ingevoerd</td><td className="p-2 border-b border-[var(--border)]">Actief account</td></tr>
                      <tr><td className="p-2 border-b border-[var(--border)]">E-mailinhoud</td><td className="p-2 border-b border-[var(--border)]">Gmail/Outlook</td><td className="p-2 border-b border-[var(--border)]">Niet opgeslagen</td></tr>
                      <tr><td className="p-2 border-b border-[var(--border)]">Foto's van rekeningen</td><td className="p-2 border-b border-[var(--border)]">Camera</td><td className="p-2 border-b border-[var(--border)]">Direct verwijderd</td></tr>
                      <tr><td className="p-2">Spraak en video</td><td className="p-2">In-app</td><td className="p-2">Niet opgeslagen</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-6">
                <h2 className="text-base font-bold text-[var(--navy)] mb-2">3. Bijzondere persoonsgegevens</h2>
                <p className="text-sm text-[var(--text)] leading-relaxed whitespace-pre-line">{"PayWatch is niet gericht op het verwerken van bijzondere persoonsgegevens (Art. 9 AVG). Het valt echter niet uit te sluiten dat banktransacties indirect bijzondere persoonsgegevens onthullen — bijvoorbeeld betalingen aan zorginstellingen of politieke partijen.\n\nMaatregelen:\n• Categorisering is uitsluitend financieel — nooit medisch of politiek\n• Geen gezondheids- of andere gevoelige profielen\n• Gebruikers kunnen individuele transacties verwijderen\n• Geen medewerker heeft toegang tot individuele transacties\n• Geen geautomatiseerde besluitvorming (Art. 22 AVG)"}</p>
              </div>

              <div className="border-t border-[var(--border)] pt-6">
                <h2 className="text-base font-bold text-[var(--navy)] mb-2">4. Verwerkers</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead><tr className="bg-[var(--bg)]">
                      <th className="text-left p-2 font-semibold text-[var(--navy)] border-b border-[var(--border)]">Verwerker</th>
                      <th className="text-left p-2 font-semibold text-[var(--navy)] border-b border-[var(--border)]">Doel</th>
                      <th className="text-left p-2 font-semibold text-[var(--navy)] border-b border-[var(--border)]">Regio</th>
                    </tr></thead>
                    <tbody className="text-[var(--text)]">
                      <tr><td className="p-2 border-b border-[var(--border)]">Supabase</td><td className="p-2 border-b border-[var(--border)]">Database, authenticatie</td><td className="p-2 border-b border-[var(--border)]">EU (Frankfurt)</td></tr>
                      <tr><td className="p-2 border-b border-[var(--border)]">Anthropic (Claude)</td><td className="p-2 border-b border-[var(--border)]">Financiële samenvattingen (alleen totalen)</td><td className="p-2 border-b border-[var(--border)]">EU</td></tr>
                      <tr><td className="p-2 border-b border-[var(--border)]">Mistral AI (Scaleway)</td><td className="p-2 border-b border-[var(--border)]">E-mail scan, extractie, OCR foto's</td><td className="p-2 border-b border-[var(--border)]">Frankrijk (EU)</td></tr>
                      
                      <tr><td className="p-2 border-b border-[var(--border)]">ElevenLabs</td><td className="p-2 border-b border-[var(--border)]">Spraakassistent</td><td className="p-2 border-b border-[var(--border)]">EU</td></tr>
                      <tr><td className="p-2 border-b border-[var(--border)]">Enable Banking</td><td className="p-2 border-b border-[var(--border)]">PSD2 bankkoppeling</td><td className="p-2 border-b border-[var(--border)]">Finland (EU)</td></tr>
                      <tr><td className="p-2 border-b border-[var(--border)]">LiveKit</td><td className="p-2 border-b border-[var(--border)]">Videogesprekken</td><td className="p-2 border-b border-[var(--border)]">EU</td></tr>
                      <tr><td className="p-2 border-b border-[var(--border)]">Vercel</td><td className="p-2 border-b border-[var(--border)]">Hosting</td><td className="p-2 border-b border-[var(--border)]">EU (London)</td></tr>
                      <tr><td className="p-2">Resend</td><td className="p-2">E-mail</td><td className="p-2">EU/US (SCC)</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-6">
                <h2 className="text-base font-bold text-[var(--navy)] mb-2">5. Risicobeoordeling</h2>
                <div className="space-y-3">
                  {[
                    { risk: "Onbevoegde toegang tot financiële gegevens", chance: "Laag", impact: "Hoog", measure: "Row Level Security, AES-256, TLS 1.3, OAuth 2.0 read-only" },
                    { risk: "AI-hallucination bij classificatie", chance: "Middel", impact: "Middel", measure: "Dual-AI pipeline, gebruiker kan corrigeren, geen geautomatiseerde besluiten" },
                    { risk: "Bijzondere persoonsgegevens via banktransacties", chance: "Middel", impact: "Hoog", measure: "Alleen financiële categorisering, geen profiling, individuele verwijdering, admin geen toegang" },
                    { risk: "Onvolledige verwijdering bij accountdeletie", chance: "Zeer laag", impact: "Hoog", measure: "delete_all_user_data() dekt 52 tabellen in één atomaire operatie" },
                  ].map((r, i) => (
                    <div key={i} className="rounded-lg border border-[var(--border)] p-3">
                      <p className="text-sm font-semibold text-[var(--navy)]">{r.risk}</p>
                      <div className="flex gap-4 mt-1 text-xs text-[var(--muted)]">
                        <span>Kans: <strong>{r.chance}</strong></span>
                        <span>Impact: <strong>{r.impact}</strong></span>
                      </div>
                      <p className="text-xs text-[var(--text)] mt-1">{r.measure}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-6">
                <h2 className="text-base font-bold text-[var(--navy)] mb-2">6. Maatregelen en waarborgen</h2>
                <p className="text-sm text-[var(--text)] leading-relaxed whitespace-pre-line">{"Technisch:\n• Row Level Security op alle gebruikerstabellen\n• AES-256 encryptie in rust, TLS 1.3 in transit\n• delete_all_user_data() voor complete verwijdering (52 tabellen)\n• Admin audit log voor alle beheerdersacties\n• Admin kan geen individuele rekeningen of transacties inzien\n• is_restricted vlag voor accountbevriezing (GDPR beperking)\n• Alle AI-verwerking binnen de EU\n\nOrganisatorisch:\n• Privacyverantwoordelijke aangesteld (Samba Jarju, CTO)\n• GDPR-verzoeksysteem met automatische verwerking en 30-dagen deadline monitoring\n• Granulaire B2B-toestemming (gebruiker kiest per scope)\n• Geautomatiseerde deadline-herinneringen voor openstaande verzoeken"}</p>
              </div>

              <div className="border-t border-[var(--border)] pt-6">
                <h2 className="text-base font-bold text-[var(--navy)] mb-2">7. Verwerkersregister</h2>
                <p className="text-sm text-[var(--muted)] mb-3">Overzicht van alle partijen die persoonsgegevens verwerken namens PayWatch.</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead><tr className="bg-[var(--bg)]">
                      <th className="text-left p-2 font-semibold text-[var(--navy)] border-b border-[var(--border)]">Verwerker</th>
                      <th className="text-left p-2 font-semibold text-[var(--navy)] border-b border-[var(--border)]">Doel</th>
                      <th className="text-left p-2 font-semibold text-[var(--navy)] border-b border-[var(--border)]">Regio</th>
                      <th className="text-left p-2 font-semibold text-[var(--navy)] border-b border-[var(--border)]">VEO</th>
                    </tr></thead>
                    <tbody className="text-[var(--text)]">
                      {[
                        ["Supabase", "Database, authenticatie", "EU (Frankfurt)", "✅"],
                        ["Anthropic (Claude)", "Financiële samenvattingen (alleen totalen)", "EU", "✅"],
                        ["Mistral AI (Scaleway)", "E-mail scan, extractie, OCR", "Frankrijk (EU)", "✅ Self-hosted"],
                        ["ElevenLabs", "Spraakassistent", "EU", "✅"],
                        ["Enable Banking", "PSD2 bankkoppeling", "Finland (EU)", "✅"],
                        ["LiveKit", "Videogesprekken", "EU", "✅"],
                        ["Vercel", "Hosting", "EU (London)", "✅"],
                        ["Resend", "Transactionele e-mail", "EU/US (SCC)", "✅"],
                        ["Mailgun", "Outreach e-mail", "EU", "✅"],
                        ["PostHog", "Analytics (geanonimiseerd)", "EU (Frankfurt)", "✅"],
                      ].map((row, i) => (
                        <tr key={i}><td className="p-2 border-b border-[var(--border)]">{row[0]}</td><td className="p-2 border-b border-[var(--border)]">{row[1]}</td><td className="p-2 border-b border-[var(--border)]">{row[2]}</td><td className="p-2 border-b border-[var(--border)]">{row[3]}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-6">
                <h2 className="text-base font-bold text-[var(--navy)] mb-2">8. Datalekprocedure</h2>
                <p className="text-sm text-[var(--text)] leading-relaxed whitespace-pre-line">{"PayWatch heeft een vastgestelde procedure voor het omgaan met datalekken conform Art. 33/34 AVG.\n\nBij een datalek:\n• Binnen 4 uur: classificatie (kritiek/hoog/middel/laag)\n• Binnen 72 uur: melding bij de Autoriteit Persoonsgegevens als er risico is voor betrokkenen\n• Zonder onredelijke vertraging: melding bij betrokkenen als er hoog risico is\n\nMeldkanalen naar betrokkenen:\n• E-mail via Resend\n• In-app notificatie\n\nAlle incidenten worden gelogd in het admin audit log met datum, beschrijving, classificatie, en getroffen maatregelen.\n\nVerantwoordelijke: Samba Jarju (CTO) — privacy@paywatch.nl"}</p>
              </div>

              <div className="border-t border-[var(--border)] pt-6 text-center">
                <p className="text-xs text-[var(--muted)]">Volgende herziening: november 2026</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-xs text-[var(--muted)] text-center mt-12">
          © {new Date().getFullYear()} PayWatch — PayWatch, Rotterdam, Netherlands
          <br />
          <a href={`mailto:${siteConfig.company.emails.privacy}`} className="text-[var(--blue)] hover:underline">
            {siteConfig.company.emails.privacy}
          </a>
        </p>

      </div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg)]" />}>
      <PrivacyContent />
    </Suspense>
  );
}
