"use client";

import { useApp } from "@/components/AppProvider";
import { siteConfig } from "@/lib/config";
import { useEffect, useState } from "react";

const T = {
  nl: {
    lastUpdated: "Laatst bijgewerkt: 10 mei 2026",
    toc: "Inhoudsopgave",
    sections: [
      {
        id: "definities",
        title: "1. Definities",
        body: `In deze voorwaarden wordt verstaan onder:\n\n"PayWatch": PayWatch, handelend onder Samba Finance, gevestigd te Rotterdam, KVK: ${siteConfig.company.kvk}.\n"Dienst": de PayWatch-applicatie (web en iOS), alle bijbehorende functionaliteiten, API's en het B2B-portaal.\n"Gebruiker": iedere natuurlijke persoon die een account aanmaakt en de Dienst gebruikt.\n"Organisatie": iedere rechtspersoon (gemeente, incassobureau, hulporganisatie) die het B2B-portaal gebruikt.\n"Persoonsgegevens": alle informatie die direct of indirect herleidbaar is tot een natuurlijk persoon, zoals bedoeld in de AVG.`,
      },
      {
        id: "toepasselijkheid",
        title: "2. Toepasselijkheid",
        body: "Deze voorwaarden zijn van toepassing op ieder gebruik van de Dienst. Door een account aan te maken of de Dienst te gebruiken, ga je akkoord met deze voorwaarden. Wij raden je aan deze voorwaarden zorgvuldig te lezen voordat je de Dienst gebruikt.",
      },
      {
        id: "dienst",
        title: "3. De Dienst",
        body: "PayWatch biedt een platform waarmee gebruikers hun huishoudelijke financien kunnen beheren. De Dienst omvat de volgende functionaliteiten:\n\nRekeningen bijhouden: handmatig toevoegen, scannen via e-mail (Gmail/Outlook-koppeling) of fotograferen met je camera.\nEscalatiefases: monitoring van de vijf fases van het Nederlandse incassoproces (factuur, herinnering, aanmaning, incasso, deurwaarder).\nBankkoppeling: via Enable Banking (PSD2) kun je je bankrekening(en) koppelen voor inzicht in je transacties en saldo. Dit is een alleen-lezen verbinding. Wij kunnen nooit geld overboeken of je saldo wijzigen.\nAI-spraakassistent (PayBuddy): een telefonische AI-assistent waarmee je kunt bellen over je financien, foto's van brieven kunt opsturen en uitleg krijgt over de inhoud.\nToeslagen en beslagvrije voet: berekeningen om te controleren of je recht hebt op toeslagen en wat je beslagvrije voet is.\nAI-bezwaarschriften: het genereren van conceptbrieven voor betalingsregelingen of bezwaren.\nBetalingsplannen: het bijhouden van afspraken met schuldeisers, inclusief betalingsbewijzen.\nCommunity: een feed waar gebruikers ervaringen en tips kunnen delen.\nNotificaties: herinneringen per push of e-mail wanneer een betaaldatum nadert.",
      },
      {
        id: "account",
        title: "4. Account",
        body: "Om de Dienst te gebruiken heb je een account nodig. Je bent verantwoordelijk voor het geheim houden van je inloggegevens en voor alle activiteiten die via je account plaatsvinden. Bij vermoeden van ongeautoriseerd gebruik dien je direct contact met ons op te nemen. Je account is persoonlijk en mag niet worden gedeeld met derden.",
      },
      {
        id: "email-koppeling",
        title: "5. E-mailkoppeling (Gmail en Outlook)",
        body: "PayWatch kan worden gekoppeld aan je Gmail- of Outlook-account via respectievelijk Google OAuth 2.0 (scope: gmail.readonly) en Microsoft OAuth 2.0 (scope: Mail.Read). We vragen uitsluitend alleen-lezen toegang. We slaan geen e-mailwachtwoorden op en bewaren geen volledige e-mailteksten. Alleen de gegevens van herkende rekeningen (leverancier, bedrag, vervaldatum, IBAN, referentie) worden opgeslagen. Je kunt de koppeling op elk moment intrekken via je Google- of Microsoft-accountinstellingen.",
      },
      {
        id: "bankkoppeling",
        title: "6. Bankkoppeling (PSD2)",
        body: "Via Enable Banking kun je je bankrekening koppelen aan PayWatch. Deze koppeling werkt via het PSD2-protocol (Payment Services Directive 2) en geeft PayWatch alleen-lezen toegang tot je transacties en saldo. Wij kunnen nooit geld overboeken, betalingen initiëren of je saldo wijzigen. De bankverbinding verloopt automatisch na maximaal 90 dagen. Daarna moet je de verbinding opnieuw autoriseren. Je kunt de koppeling op elk moment intrekken via de instellingen in de app. Transactiegegevens worden uitsluitend gebruikt om je financieel overzicht te tonen en om rekeningen te matchen met banktransacties.",
      },
      {
        id: "ai-spraakassistent",
        title: "7. AI-spraakassistent (PayBuddy)",
        body: "PayBuddy is een AI-gestuurde spraakassistent waarmee je kunt bellen over je financiele situatie. Tijdens het gesprek kun je foto's van brieven opsturen. De AI analyseert de brief en geeft uitleg over de inhoud. Gesprekken worden niet opgenomen of opgeslagen door PayWatch. Spraak wordt in realtime verwerkt via ElevenLabs en niet opgeslagen. Foto's worden na verwerking direct verwijderd. PayBuddy geeft geen financieel, juridisch of fiscaal advies. Alle informatie is informatief van aard.",
      },
      {
        id: "ai-verwerking",
        title: "8. AI-verwerking en privacy",
        body: "PayWatch maakt gebruik van AI-modellen voor het herkennen, classificeren en analyseren van rekeningen. Voor het scannen van foto's en e-mails gebruiken wij Mistral AI, zelf gehost via Scaleway in de EU (Parijs/Amsterdam). Je gegevens verlaten de Europese Unie niet voor scan- en analysedoeleinden. Wij trainen geen AI-modellen met jouw persoonlijke gegevens. AI-modellen ontvangen alleen de minimaal benodigde gegevens per verzoek.",
      },
      {
        id: "abonnementen",
        title: "9. Abonnementen en betaling",
        body: "PayWatch biedt drie plannen: Gratis, Pro en Premium. Betaalde abonnementen worden afgerekend via de Apple App Store (voor iOS) of via onze betalingsprovider. Prijzen zijn inclusief BTW. Je kunt je abonnement op elk moment opzeggen. Na opzegging behoud je toegang tot het einde van de lopende factureringsperiode. Automatische verlenging kan worden uitgeschakeld via je App Store-instellingen. Restitutie verloopt volgens het beleid van Apple of de betreffende betalingsprovider. Bij het Gratis-plan zijn bepaalde functies beperkt (zoals het aantal AI-chats, spraakminuten en scans per maand).",
      },
      {
        id: "community",
        title: "10. Community",
        body: "PayWatch biedt een community-feed waar gebruikers berichten kunnen plaatsen. Je bent verantwoordelijk voor de inhoud van je berichten. Het is niet toegestaan om beledigende, discriminerende, misleidende of illegale inhoud te plaatsen. PayWatch behoudt zich het recht voor berichten te verwijderen die in strijd zijn met deze voorwaarden. Je verleent PayWatch een niet-exclusieve licentie om je berichten weer te geven binnen de app.",
      },
      {
        id: "geen-advies",
        title: "11. Geen financieel advies",
        body: "PayWatch is een hulpmiddel voor het bijhouden van rekeningen en financieel overzicht. Wij bieden geen financieel, juridisch of fiscaal advies. De informatie in de app, inclusief toeslagenberekeningen, beslagvrije voet en AI-gegenereerde brieven, is informatief van aard. Raadpleeg altijd een professional voor persoonlijk advies. Voor juridische vragen verwijzen wij naar het Juridisch Loket (0900-8020).",
      },
      {
        id: "b2b-portaal",
        title: "12. B2B-portaal",
        body: "PayWatch biedt een portaal voor organisaties (gemeenten, incassobureaus, hulporganisaties) waarmee zij gebruikers kunnen onboarden en begeleiden. Organisaties kunnen via het portaal het financiele overzicht van een gebruiker inzien, uitsluitend met toestemming van de gebruiker. Het portaal is bedoeld als hulpmiddel en vervangt geen professionele schuldhulpverlening.",
      },
      {
        id: "beschikbaarheid",
        title: "13. Beschikbaarheid",
        body: "Wij streven naar een hoge beschikbaarheid van de Dienst, maar kunnen geen 100% uptime garanderen. Wij zijn niet aansprakelijk voor schade als gevolg van onderbrekingen, storingen of onderhoud. Externe koppelingen (Gmail, Outlook, Enable Banking, ElevenLabs) zijn afhankelijk van de beschikbaarheid van die diensten.",
      },
      {
        id: "intellectueel-eigendom",
        title: "14. Intellectueel eigendom",
        body: "Alle rechten op de Dienst, inclusief software, ontwerp, logo's en content, berusten bij PayWatch. Het is niet toegestaan de Dienst te kopiëren, decompileren, reverse-engineeren of voor commerciële doeleinden te gebruiken zonder voorafgaande schriftelijke toestemming.",
      },
      {
        id: "beeindiging",
        title: "15. Beëindiging",
        body: `Je kunt je account op elk moment verwijderen via de instellingen in de app. Bij verwijdering worden al je gegevens permanent verwijderd, inclusief rekeningen, instellingen, buddy-relaties, community-berichten en alle koppelingen (Gmail, Outlook, bank). Dit proces is onomkeerbaar. PayWatch kan je account beëindigen of opschorten bij overtreding van deze voorwaarden. Na beëindiging worden je gegevens verwijderd conform ons privacybeleid, met uitzondering van gegevens die wij wettelijk verplicht zijn te bewaren.`,
      },
      {
        id: "aansprakelijkheid",
        title: "16. Aansprakelijkheid",
        body: "PayWatch is niet aansprakelijk voor indirecte schade, gevolgschade, gemiste besparingen of schade als gevolg van onjuiste AI-uitvoer. Onze aansprakelijkheid is beperkt tot het bedrag dat je in de afgelopen 12 maanden aan PayWatch hebt betaald. PayWatch is niet aansprakelijk voor de juistheid van bankgegevens, toeslagenberekeningen of AI-gegenereerde brieven. De gebruiker is te allen tijde zelf verantwoordelijk voor het controleren van financiele informatie en het nemen van financiele beslissingen.",
      },
      {
        id: "wijzigingen",
        title: "17. Wijzigingen",
        body: "Wij behouden ons het recht voor deze voorwaarden te wijzigen. Bij belangrijke wijzigingen stellen wij je minimaal 14 dagen van tevoren op de hoogte via e-mail of een melding in de app. Voortgezet gebruik van de Dienst na de wijzigingsdatum geldt als acceptatie van de gewijzigde voorwaarden.",
      },
      {
        id: "toepasselijk-recht",
        title: "18. Toepasselijk recht en geschillen",
        body: "Op deze voorwaarden is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter te Rotterdam. Niets in deze voorwaarden beperkt de rechten die je hebt op grond van dwingend consumentenrecht.",
      },
      {
        id: "contact",
        title: "19. Contact",
        body: `Voor vragen over deze voorwaarden kun je contact opnemen via:\n\nE-mail: ${siteConfig.company.emails.privacy}\nAdres: PayWatch (Samba Finance), Rotterdam, Nederland\nKVK: ${siteConfig.company.kvk}`,
      },
    ],
  },
  en: {
    lastUpdated: "Last updated: May 10, 2026",
    toc: "Table of Contents",
    sections: [
      {
        id: "definitions",
        title: "1. Definitions",
        body: `In these terms:\n\n"PayWatch": PayWatch, trading as Samba Finance, registered in Rotterdam, KVK: ${siteConfig.company.kvk}.\n"Service": the PayWatch application (web and iOS), all associated functionalities, APIs, and the B2B portal.\n"User": any natural person who creates an account and uses the Service.\n"Organization": any legal entity (municipality, collection agency, aid organization) that uses the B2B portal.\n"Personal data": all information that can be directly or indirectly traced to a natural person, as defined in the GDPR.`,
      },
      {
        id: "applicability",
        title: "2. Applicability",
        body: "These terms apply to all use of the Service. By creating an account or using the Service, you agree to these terms. We recommend reading these terms carefully before using the Service.",
      },
      {
        id: "service",
        title: "3. The Service",
        body: "PayWatch provides a platform for users to manage their household finances. The Service includes the following functionalities:\n\nBill tracking: manually adding, scanning via email (Gmail/Outlook connection), or photographing with your camera.\nEscalation stages: monitoring of the five stages of the Dutch collection process (invoice, reminder, formal notice, collection, bailiff).\nBank connection: via Enable Banking (PSD2), you can connect your bank account(s) for insight into your transactions and balance. This is a read-only connection. We can never transfer money or modify your balance.\nAI voice assistant (PayBuddy): a phone-based AI assistant you can call about your finances, send photos of letters, and receive explanations of their content.\nBenefits and beslagvrije voet: calculations to check your eligibility for government benefits and your protected income threshold.\nAI dispute letters: generating draft letters for payment arrangements or disputes.\nPayment plans: tracking agreements with creditors, including payment proofs.\nCommunity: a feed where users can share experiences and tips.\nNotifications: reminders via push or email when a payment deadline approaches.",
      },
      {
        id: "account",
        title: "4. Account",
        body: "You need an account to use the Service. You are responsible for keeping your login credentials confidential and for all activities that occur via your account. If you suspect unauthorized use, contact us immediately. Your account is personal and may not be shared with third parties.",
      },
      {
        id: "email-connection",
        title: "5. Email connection (Gmail and Outlook)",
        body: "PayWatch can be connected to your Gmail or Outlook account via Google OAuth 2.0 (scope: gmail.readonly) and Microsoft OAuth 2.0 (scope: Mail.Read) respectively. We only request read-only access. We do not store email passwords and do not retain full email texts. Only the data of recognized bills (vendor, amount, due date, IBAN, reference) is stored. You can revoke the connection at any time via your Google or Microsoft account settings.",
      },
      {
        id: "bank-connection",
        title: "6. Bank connection (PSD2)",
        body: "Via Enable Banking, you can connect your bank account to PayWatch. This connection works via the PSD2 protocol (Payment Services Directive 2) and gives PayWatch read-only access to your transactions and balance. We can never transfer money, initiate payments, or modify your balance. The bank connection expires automatically after a maximum of 90 days. After that, you must re-authorize the connection. You can revoke the connection at any time via the app settings. Transaction data is used exclusively to show your financial overview and to match bills with bank transactions.",
      },
      {
        id: "voice-assistant",
        title: "7. AI voice assistant (PayBuddy)",
        body: "PayBuddy is an AI-powered voice assistant you can call about your financial situation. During the call, you can send photos of letters. The AI analyzes the letter and provides an explanation of its content. Conversations are not recorded or stored by PayWatch. Speech is processed in real-time via ElevenLabs and not stored. Photos are deleted immediately after processing. PayBuddy does not provide financial, legal, or tax advice. All information is informational in nature.",
      },
      {
        id: "ai-processing",
        title: "8. AI processing and privacy",
        body: "PayWatch uses AI models to recognize, classify, and analyze bills. For scanning photos and emails, we use Mistral AI, self-hosted via Scaleway in the EU (Paris/Amsterdam). Your data does not leave the European Union for scanning and analysis purposes. We do not train AI models with your personal data. AI models only receive the minimum data required per request.",
      },
      {
        id: "subscriptions",
        title: "9. Subscriptions and payment",
        body: "PayWatch offers three plans: Free, Pro, and Premium. Paid subscriptions are charged via the Apple App Store (for iOS) or via our payment provider. Prices include VAT. You can cancel your subscription at any time. After cancellation, you retain access until the end of the current billing period. Automatic renewal can be disabled via your App Store settings. Refunds follow the policy of Apple or the relevant payment provider. With the Free plan, certain features are limited (such as the number of AI chats, voice minutes, and scans per month).",
      },
      {
        id: "community",
        title: "10. Community",
        body: "PayWatch offers a community feed where users can post messages. You are responsible for the content of your posts. It is not permitted to post offensive, discriminatory, misleading, or illegal content. PayWatch reserves the right to remove posts that violate these terms. You grant PayWatch a non-exclusive license to display your posts within the app.",
      },
      {
        id: "no-advice",
        title: "11. No financial advice",
        body: "PayWatch is a tool for tracking bills and financial overview. We do not provide financial, legal, or tax advice. Information in the app, including benefits calculations, beslagvrije voet, and AI-generated letters, is informational in nature. Always consult a professional for personal advice. For legal questions, we refer to the Juridisch Loket (0900-8020).",
      },
      {
        id: "b2b-portal",
        title: "12. B2B portal",
        body: "PayWatch provides a portal for organizations (municipalities, collection agencies, aid organizations) to onboard and guide users. Organizations can view a user's financial overview via the portal, exclusively with the user's consent. The portal is intended as a support tool and does not replace professional debt counseling.",
      },
      {
        id: "availability",
        title: "13. Availability",
        body: "We strive for high availability of the Service but cannot guarantee 100% uptime. We are not liable for damages resulting from interruptions, outages, or maintenance. External connections (Gmail, Outlook, Enable Banking, ElevenLabs) depend on the availability of those services.",
      },
      {
        id: "intellectual-property",
        title: "14. Intellectual property",
        body: "All rights to the Service, including software, design, logos, and content, belong to PayWatch. It is not permitted to copy, decompile, reverse-engineer, or use the Service for commercial purposes without prior written permission.",
      },
      {
        id: "termination",
        title: "15. Termination",
        body: `You can delete your account at any time via the app settings. Upon deletion, all your data is permanently removed, including bills, settings, buddy relationships, community posts, and all connections (Gmail, Outlook, bank). This process is irreversible. PayWatch may terminate or suspend your account for violation of these terms. After termination, your data will be deleted in accordance with our privacy policy, with the exception of data we are legally required to retain.`,
      },
      {
        id: "liability",
        title: "16. Liability",
        body: "PayWatch is not liable for indirect damages, consequential damages, missed savings, or damages resulting from incorrect AI output. Our liability is limited to the amount you have paid to PayWatch in the past 12 months. PayWatch is not liable for the accuracy of bank data, benefits calculations, or AI-generated letters. The user is at all times responsible for verifying financial information and making financial decisions.",
      },
      {
        id: "changes",
        title: "17. Changes",
        body: "We reserve the right to modify these terms. For significant changes, we will notify you at least 14 days in advance via email or a notification in the app. Continued use of the Service after the modification date constitutes acceptance of the modified terms.",
      },
      {
        id: "applicable-law",
        title: "18. Applicable law and disputes",
        body: "These terms are governed by Dutch law. Disputes shall be submitted to the competent court in Rotterdam. Nothing in these terms limits the rights you have under mandatory consumer protection law.",
      },
      {
        id: "contact",
        title: "19. Contact",
        body: `For questions about these terms, contact us at:\n\nEmail: ${siteConfig.company.emails.privacy}\nAddress: PayWatch (Samba Finance), Rotterdam, Netherlands\nKVK: ${siteConfig.company.kvk}`,
      },
    ],
  },
};

export default function TermsPage() {
  const { lang, t } = useApp();
  const content = T[lang];
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveSection(e.target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 }
    );
    content.sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [content]);

  return (
    <div className="bg-[var(--bg)]">
      <div className="mx-auto max-w-4xl px-4 pt-12 pb-16 sm:px-6 sm:pt-20 sm:pb-24">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--navy)] tracking-tight text-center">
          {t.terms.title}
        </h1>
        <p className="text-base text-[var(--muted)] mt-3 text-center">{t.terms.subtitle}</p>
        <p className="text-xs text-[var(--muted)] mt-2 text-center">{content.lastUpdated}</p>

        <div className="mt-10 flex gap-8">
          {/* Table of contents (sticky sidebar on desktop) */}
          <nav className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24">
              <p className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-3">
                {content.toc}
              </p>
              <div className="space-y-1 max-h-[calc(100vh-140px)] overflow-y-auto pr-2">
                {content.sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className={`block text-[11px] leading-snug py-1.5 px-2 rounded-md transition-colors ${
                      activeSection === s.id
                        ? "bg-[var(--blue-light)] text-[var(--blue)] font-semibold"
                        : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[color-mix(in_srgb,var(--border)_40%,transparent)]"
                    }`}
                  >
                    {s.title}
                  </a>
                ))}
              </div>
            </div>
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile TOC */}
            <details className="lg:hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 mb-6">
              <summary className="text-sm font-bold text-[var(--navy)] cursor-pointer">
                {content.toc}
              </summary>
              <div className="mt-3 space-y-1">
                {content.sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block text-xs text-[var(--muted)] py-1 hover:text-[var(--blue)]"
                    onClick={() => {
                      const el = document.querySelector("details");
                      if (el) el.removeAttribute("open");
                    }}
                  >
                    {s.title}
                  </a>
                ))}
              </div>
            </details>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10">
              {content.sections.map((section, i) => (
                <div
                  key={section.id}
                  id={section.id}
                  className={`scroll-mt-24 ${i > 0 ? "mt-8 pt-6 border-t border-[var(--border)]" : ""}`}
                >
                  <h2 className="text-base font-bold text-[var(--navy)] mb-3">{section.title}</h2>
                  <div className="text-sm text-[var(--text)] leading-relaxed whitespace-pre-line">
                    {section.body}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-xs text-[var(--muted)] text-center mt-12">
          © {new Date().getFullYear()} PayWatch — Samba Finance, Rotterdam, Netherlands
        </p>
      </div>
    </div>
  );
}
