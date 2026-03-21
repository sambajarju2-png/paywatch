"use client";

import { useApp } from "@/components/AppProvider";
import { siteConfig } from "@/lib/config";

const termsContent = {
  nl: {
    lastUpdated: "Laatst bijgewerkt: 15 maart 2026",
    sections: [
      {
        title: "1. Definities",
        body: `In deze voorwaarden wordt verstaan onder: "PayWatch" — PayWatch B.V., gevestigd te Rotterdam, KVK: ${siteConfig.company.kvk}. "Dienst" — de PayWatch webapplicatie en alle bijbehorende functionaliteiten. "Gebruiker" — iedere natuurlijke persoon die een account aanmaakt en de Dienst gebruikt.`,
      },
      {
        title: "2. Toepasselijkheid",
        body: "Deze voorwaarden zijn van toepassing op ieder gebruik van de Dienst. Door een account aan te maken of de Dienst te gebruiken, ga je akkoord met deze voorwaarden.",
      },
      {
        title: "3. De Dienst",
        body: "PayWatch biedt een tool waarmee gebruikers hun huishoudelijke rekeningen kunnen bijhouden, escalatiefases kunnen monitoren, en actie kunnen ondernemen om onnodige kosten te voorkomen. De Dienst maakt gebruik van AI om rekeningen uit e-mails te herkennen en te classificeren.",
      },
      {
        title: "4. Account",
        body: "Om de Dienst te gebruiken heb je een account nodig. Je bent verantwoordelijk voor het geheim houden van je inloggegevens. Bij vermoeden van ongeautoriseerd gebruik, neem direct contact met ons op.",
      },
      {
        title: "5. Gmail-koppeling",
        body: "PayWatch kan worden gekoppeld aan je Gmail-account via OAuth 2.0. We vragen alleen read-only toegang. We slaan geen e-mailwachtwoorden op en bewaren e-mailinhoud niet permanent. Je kunt de koppeling op elk moment intrekken via je Google-accountinstellingen.",
      },
      {
        title: "6. Geen financieel advies",
        body: "PayWatch is een hulpmiddel voor het bijhouden van rekeningen. Wij bieden geen financieel, juridisch of fiscaal advies. De informatie in de app is informatief van aard. Raadpleeg een professional voor persoonlijk advies.",
      },
      {
        title: "7. Beschikbaarheid",
        body: "Wij streven naar een hoge beschikbaarheid van de Dienst, maar kunnen geen 100% uptime garanderen. Wij zijn niet aansprakelijk voor schade als gevolg van onderbrekingen of storingen.",
      },
      {
        title: "8. Intellectueel eigendom",
        body: "Alle rechten op de Dienst, inclusief software, ontwerp, logo's en content, berusten bij PayWatch B.V. Het is niet toegestaan de Dienst te kopiëren, reverse-engineeren of voor commerciële doeleinden te gebruiken zonder toestemming.",
      },
      {
        title: "9. Beëindiging",
        body: "Je kunt je account op elk moment verwijderen. PayWatch kan je account beëindigen bij overtreding van deze voorwaarden. Na beëindiging worden je gegevens verwijderd conform ons privacybeleid.",
      },
      {
        title: "10. Aansprakelijkheid",
        body: "PayWatch is niet aansprakelijk voor indirecte schade, gevolgschade of gemiste besparingen. Onze aansprakelijkheid is beperkt tot het bedrag dat je in de afgelopen 12 maanden aan PayWatch hebt betaald.",
      },
      {
        title: "11. Wijzigingen",
        body: "Wij behouden ons het recht voor deze voorwaarden te wijzigen. Bij belangrijke wijzigingen stellen wij je minimaal 14 dagen van tevoren op de hoogte.",
      },
      {
        title: "12. Toepasselijk recht",
        body: "Op deze voorwaarden is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter te Rotterdam.",
      },
    ],
  },
  en: {
    lastUpdated: "Last updated: March 15, 2026",
    sections: [
      {
        title: "1. Definitions",
        body: `In these terms: "PayWatch" — PayWatch B.V., registered in Rotterdam, KVK: ${siteConfig.company.kvk}. "Service" — the PayWatch web application and all associated functionalities. "User" — any natural person who creates an account and uses the Service.`,
      },
      {
        title: "2. Applicability",
        body: "These terms apply to all use of the Service. By creating an account or using the Service, you agree to these terms.",
      },
      {
        title: "3. The Service",
        body: "PayWatch provides a tool that allows users to track their household bills, monitor escalation stages, and take action to prevent unnecessary costs. The Service uses AI to recognize and classify bills from emails.",
      },
      {
        title: "4. Account",
        body: "You need an account to use the Service. You are responsible for keeping your login credentials confidential. If you suspect unauthorized use, contact us immediately.",
      },
      {
        title: "5. Gmail connection",
        body: "PayWatch can be connected to your Gmail account via OAuth 2.0. We only request read-only access. We do not store email passwords and do not permanently retain email content. You can revoke the connection at any time via your Google account settings.",
      },
      {
        title: "6. No financial advice",
        body: "PayWatch is a tool for tracking bills. We do not provide financial, legal, or tax advice. Information in the app is informational in nature. Consult a professional for personal advice.",
      },
      {
        title: "7. Availability",
        body: "We strive for high availability of the Service but cannot guarantee 100% uptime. We are not liable for damages resulting from interruptions or outages.",
      },
      {
        title: "8. Intellectual property",
        body: "All rights to the Service, including software, design, logos and content, belong to PayWatch B.V. It is not permitted to copy, reverse-engineer, or use the Service for commercial purposes without permission.",
      },
      {
        title: "9. Termination",
        body: "You can delete your account at any time. PayWatch may terminate your account for violation of these terms. After termination, your data will be deleted in accordance with our privacy policy.",
      },
      {
        title: "10. Liability",
        body: "PayWatch is not liable for indirect damages, consequential damages, or missed savings. Our liability is limited to the amount you have paid to PayWatch in the past 12 months.",
      },
      {
        title: "11. Changes",
        body: "We reserve the right to modify these terms. For significant changes, we will notify you at least 14 days in advance.",
      },
      {
        title: "12. Applicable law",
        body: "These terms are governed by Dutch law. Disputes shall be submitted to the competent court in Rotterdam.",
      },
    ],
  },
};

export default function TermsPage() {
  const { lang, t } = useApp();
  const content = termsContent[lang];

  return (
    <div className="bg-[var(--bg)]">
      <div className="mx-auto max-w-3xl px-4 pt-12 pb-16 sm:px-6 sm:pt-20 sm:pb-24">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--navy)] tracking-tight text-center">{t.terms.title}</h1>
        <p className="text-base text-[var(--muted)] mt-3 text-center">{t.terms.subtitle}</p>
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
