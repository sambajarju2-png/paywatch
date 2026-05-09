"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Lang = "nl" | "en";
type Theme = "light" | "dark";

interface AppContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  t: typeof translations.nl;
}

/* ─── Translations ─── */
const translations = {
  nl: {
    nav: {
      features: "Functies",
      pricing: "Prijzen",
      about: "Over ons",
      vergelijken: "Vergelijken",
      resources: "Artikelen",
      jobs: "Vacatures",
      contact: "Contact",
      login: "Inloggen",
      cta: "Start gratis",
    },
    hero: {
      badge: "🇪🇺 Gebouwd in de EU",
      title: "Grip op je rekeningen.",
      subtitle: "PayWatch verzamelt al je rekeningen op één plek en waarschuwt je voordat een betalingstermijn verloopt. Je ziet direct welke rekening vandaag je aandacht nodig heeft, zodat je incassokosten voor bent en altijd grip houdt op je budget.",
      cta: "Start gratis",
      secondary: "Bekijk functies",
      trust: "Beschikbaar in 43+ gemeenten",
    },
    trustBar: {
      eu: "EU Product",
      gdpr: "AVG/GDPR",
      soc2: "SOC 2",
      encryption: "AES-256",
    },
    howItWorks: {
      title: "Hoe het werkt",
      subtitle: "In 3 stappen van chaos naar controle",
      steps: [
        { title: "Scan je rekeningen", desc: "Verbind je inbox of maak een foto van je post. PayWatch herkent automatisch je rekeningen, bedragen en vervaldatums — zonder iets handmatig in te voeren." },
        { title: "Zie waar je staat", desc: "Elke rekening toont direct de fase: factuur, herinnering, aanmaning, incasso of deurwaarder. Met een overzicht van deadlines en verwachte kosten." },
        { title: "Handel op tijd", desc: "Betaal direct, stel een betalingsregeling in of stuur een bezwaarbrief. Alles vanuit één plek, zodat je onnodige kosten voorkomt." },
      ],
    },
    features: {
      title: "Functies",
      subtitle: "Alles wat je nodig hebt om je rekeningen bij te houden",
      items: [
        { title: "Rekening scanner", desc: "Of het nu in je inbox zit of als brief op je deurmat — PayWatch vindt het. Verbind je e-mail of maak een foto." },
        { title: "Betaalfases & meldingen", desc: "Zie in welke fase elke rekening zit en ontvang meldingen bij deadlines. Stel een betalingsregeling in voordat het escaleert." },
        { title: "Community", desc: "Je staat er niet alleen voor. Deel ervaringen, stel vragen en steun anderen — anoniem en zonder schaamte." },
        { title: "Conceptbrieven", desc: "Moet je reageren op een incassobrief? PayWatch schrijft een bezwaarbrief of betalingsvoorstel voor je, klaar om te versturen." },
        { title: "Cashflow overzicht", desc: "Zie wat er binnenkomt en wat er uitgaat. Plan vooruit, geen verrassingen." },
        { title: "Financiële gezondheid", desc: "Een persoonlijke score die laat zien hoe goed je op weg bent." },
        { title: "Hulpverleners", desc: "Vind lokale schuldhulpverleners, juridisch adviseurs en hulporganisaties in jouw gemeente." },
        { title: "Betaallinks", desc: "PayWatch herkent betaallinks in je rekeningen zodat je direct kunt betalen vanuit de app." },
        { title: "Moodtracker", desc: "Houd bij hoe je je voelt. Financiële stress is menselijk — wij helpen je ermee." },
        { title: "Donkere modus", desc: "Minder licht, meer rust. Werkt automatisch of handmatig." },
      ],
    },
    motivation: {
      title: "Waarom PayWatch?",
      subtitle: "Omdat niemand wakker zou moeten liggen van rekeningen.",
      stats: [
        { value: "€ 760", label: "gemiddeld bespaard aan incassokosten" },
        { value: "43+", label: "gemeenten beschikbaar" },
        { value: "2 min", label: "om je inbox te scannen" },
        { value: "100%", label: "gratis in beta" },
      ],
    },
    cta: {
      title: "Klaar om te beginnen?",
      subtitle: "Gratis. Veilig. Zonder verplichtingen.",
      button: "Start nu gratis",
    },
    footer: {
      product: "Steden",
      company: "Bedrijf",
      legal: "Juridisch",
      support: "Hulp",
      privacy: "Privacybeleid",
      terms: "Voorwaarden",
      dataProcessing: "Gegevensverwerking",
      madeWith: "Gebouwd met ♥ vanuit de EU 🇪🇺",
      copyright: "© 2026 PayWatch KVK: 83474889",
    },
    cookie: {
      message: "PayWatch gebruikt geen trackers of advertentie-cookies. We slaan alleen je taalvoorkeur en thema-instelling op.",
      accept: "Begrepen",
    },
    pricing: {
      title: "Kies je plan",
      subtitle: "Start gratis en upgrade wanneer je klaar bent. Alle plannen bevatten een 14-daagse proefperiode.",
      free: "Gratis",
      freeDesc: "Voor iedereen",
      pro: "Pro",
      proDesc: "Meer ruimte en je bank koppelen",
      premium: "Premium",
      premiumDesc: "Onbeperkt alles",
      monthly: "Maandelijks",
      yearly: "Jaarlijks",
      yearlyDiscount: "Bespaar 25%",
      perMonth: "/maand",
      perYear: "/jaar",
      startFree: "Start gratis",
      upgrade: "Probeer 14 dagen gratis",
      current: "Huidig plan",
      popular: "Populair",
      bestValue: "Beste waarde",
      included: "Inbegrepen",
      unlimited: "Onbeperkt",
      features: "Functies",
    },
    contact: {
      title: "Contact",
      subtitle: "Neem contact met ons op",
      nameLabel: "Naam",
      emailLabel: "E-mailadres",
      typeLabel: "Ik ben een...",
      typeConsumer: "Particulier",
      typeBusiness: "Bedrijf / Gemeente",
      subjectLabel: "Onderwerp",
      messageLabel: "Bericht",
      send: "Verstuur bericht",
      success: "Bedankt! We nemen zo snel mogelijk contact op.",
      info: "Bedrijfsinformatie",
    },
    about: {
      title: "Over PayWatch",
      subtitle: "Twee Rotterdammers met een missie: niemand onnodig in de schulden.",
      story: "PayWatch is geboren uit frustratie. Te veel mensen in Nederland betalen onnodig honderden euro's extra aan incassokosten — simpelweg omdat ze het overzicht kwijt zijn. Wij willen dat veranderen.",
      missionTitle: "Onze missie",
      mission: "Iedereen verdient grip op z'n rekeningen. Zonder schaamte, zonder stress, zonder onnodige kosten.",
    },
    jobs: {
      title: "Werken bij PayWatch",
      subtitle: "Help mee om financiële stress in Nederland te verminderen",
      apply: "Solliciteer",
      readMore: "Lees meer",
      backToJobs: "Terug naar vacatures",
      remote: "Remote",
      hybrid: "Hybride",
      office: "Kantoor",
      noJobs: "Momenteel geen openstaande vacatures.",
      requirements: "Wat we zoeken",
      niceToHave: "Fijn als je dit ook hebt",
      perks: "Wat wij bieden",
    },
    resources: {
      title: "Hulpmiddelen",
      subtitle: "Hulporganisaties, juristen en gemeentelijke ondersteuning",
      tabs: { directory: "Hulpverleners", blog: "Blog" },
      aidOrgs: "Hulporganisaties",
      lawyers: "Juridisch advies",
      filterLabel: "Filter op categorie",
      all: "Alles",
      legal: "Juridisch",
      debtHelp: "Schuldhulp",
      financial: "Financieel",
      visit: "Bezoek website",
      call: "Bel",
      readMore: "Lees meer",
      blogEmpty: "Binnenkort verschijnen hier onze blogartikelen.",
    },
    dataProcessing: {
      title: "Gegevensverwerking",
      subtitle: "Transparantie over hoe we je data verwerken",
      service: "Service",
      purpose: "Doel",
      dataProcessed: "Data verwerkt",
      location: "Locatie",
      gdprStatus: "AVG status",
      security: "Beveiligingsmaatregelen",
    },
    privacy: {
      title: "Privacybeleid",
      subtitle: "Jouw privacy, onze prioriteit",
    },
    terms: {
      title: "Algemene voorwaarden",
      subtitle: "Onze afspraken met jou",
    },
    gemeente: {
      title: "Zoek jouw gemeente",
      placeholder: "Typ je gemeente...",
      available: "beschikbaar",
      noResults: "Geen resultaten gevonden",
    },
  },
  en: {
    nav: {
      features: "Features",
      pricing: "Pricing",
      about: "About",
      vergelijken: "Compare",
      resources: "Resources",
      jobs: "Jobs",
      contact: "Contact",
      login: "Log in",
      cta: "Start free",
    },
    hero: {
      badge: "🇪🇺 Built in the EU",
      title: "Take control of your bills.",
      subtitle: "PayWatch collects all your bills in one place and alerts you before a payment deadline passes. See which bill needs your attention today, so you stay ahead of collection costs and always keep grip on your budget.",
      cta: "Start free",
      secondary: "View features",
      trust: "Available in 43+ municipalities",
    },
    trustBar: {
      eu: "EU Product",
      gdpr: "AVG/GDPR",
      soc2: "SOC 2",
      encryption: "AES-256",
    },
    howItWorks: {
      title: "How it works",
      subtitle: "From chaos to control in 3 steps",
      steps: [
        { title: "Scan your bills", desc: "Connect your inbox or snap a photo of your mail. PayWatch automatically finds your bills, amounts, and due dates — no manual entry needed." },
        { title: "See where you stand", desc: "Each bill shows its current stage: invoice, reminder, formal notice, collection, or bailiff. With an overview of deadlines and expected costs." },
        { title: "Act on time", desc: "Pay directly, set up a payment plan, or send a dispute letter. Everything from one place, so you avoid unnecessary costs." },
      ],
    },
    features: {
      title: "Features",
      subtitle: "Everything you need to stay on top of your bills",
      items: [
        { title: "Bill scanner", desc: "Whether it's in your inbox or a letter on your doormat — PayWatch finds it. Connect your email or snap a photo." },
        { title: "Payment stages & alerts", desc: "See what stage each bill is at and get alerts before deadlines. Set up a payment plan before things escalate." },
        { title: "Community", desc: "You're not in this alone. Share experiences, ask questions, and support others — anonymous and stigma-free." },
        { title: "Draft letters", desc: "Need to respond to a collection letter? PayWatch drafts an objection letter or payment proposal for you, ready to send." },
        { title: "Cashflow overview", desc: "See what's coming in and going out. Plan ahead, no surprises." },
        { title: "Financial health", desc: "A personal score that shows how well you're doing." },
        { title: "Support organizations", desc: "Find local debt counselors, legal advisors and aid organizations in your municipality." },
        { title: "Payment links", desc: "PayWatch detects payment links in your bills so you can pay directly from the app." },
        { title: "Mood tracker", desc: "Track how you feel. Financial stress is human — we help you manage it." },
        { title: "Dark mode", desc: "Less light, more calm. Works automatically or manually." },
      ],
    },
    motivation: {
      title: "Why PayWatch?",
      subtitle: "Because nobody should lose sleep over bills.",
      stats: [
        { value: "€ 760", label: "average saved in collection costs" },
        { value: "43+", label: "municipalities available" },
        { value: "2 min", label: "to scan your inbox" },
        { value: "100%", label: "free in beta" },
      ],
    },
    cta: {
      title: "Ready to start?",
      subtitle: "Free. Secure. No strings attached.",
      button: "Start free now",
    },
    footer: {
      product: "Cities",
      company: "Company",
      legal: "Legal",
      support: "Support",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      dataProcessing: "Data Processing",
      madeWith: "Built with ♥ from the EU 🇪🇺",
      copyright: "© 2026 PayWatch KVK: 83474889",
    },
    cookie: {
      message: "PayWatch doesn't use trackers or advertising cookies. We only store your language preference and theme setting.",
      accept: "Got it",
    },
    pricing: {
      title: "Choose your plan",
      subtitle: "Start free and upgrade when you're ready. All plans include a 14-day free trial.",
      free: "Free",
      freeDesc: "For everyone",
      pro: "Pro",
      proDesc: "More room and bank connection",
      premium: "Premium",
      premiumDesc: "Unlimited everything",
      monthly: "Monthly",
      yearly: "Yearly",
      yearlyDiscount: "Save 25%",
      perMonth: "/month",
      perYear: "/year",
      startFree: "Start free",
      upgrade: "Try 14 days free",
      current: "Current plan",
      popular: "Popular",
      bestValue: "Best value",
      included: "Included",
      unlimited: "Unlimited",
      features: "Features",
    },
    contact: {
      title: "Contact",
      subtitle: "Get in touch with us",
      nameLabel: "Name",
      emailLabel: "Email address",
      typeLabel: "I am a...",
      typeConsumer: "Consumer",
      typeBusiness: "Business / Municipality",
      subjectLabel: "Subject",
      messageLabel: "Message",
      send: "Send message",
      success: "Thanks! We'll get back to you as soon as possible.",
      info: "Company information",
    },
    about: {
      title: "About PayWatch",
      subtitle: "Two Rotterdammers on a mission: stop unnecessary debt.",
      story: "PayWatch was born from frustration. Too many people in the Netherlands pay hundreds of euros in unnecessary collection costs — simply because they lost track. We want to change that.",
      missionTitle: "Our mission",
      mission: "Everyone deserves to be in control of their bills. Without shame, without stress, without unnecessary costs.",
    },
    jobs: {
      title: "Work at PayWatch",
      subtitle: "Help us reduce financial stress in the Netherlands",
      apply: "Apply",
      readMore: "Read more",
      backToJobs: "Back to jobs",
      remote: "Remote",
      hybrid: "Hybrid",
      office: "Office",
      noJobs: "No open positions at the moment.",
      requirements: "What we're looking for",
      niceToHave: "Nice to have",
      perks: "What we offer",
    },
    resources: {
      title: "Resources",
      subtitle: "Support organizations, lawyers and municipal assistance",
      tabs: { directory: "Directory", blog: "Blog" },
      aidOrgs: "Support organizations",
      lawyers: "Legal advice",
      filterLabel: "Filter by category",
      all: "All",
      legal: "Legal",
      debtHelp: "Debt help",
      financial: "Financial",
      visit: "Visit website",
      call: "Call",
      readMore: "Read more",
      blogEmpty: "Blog articles coming soon.",
    },
    dataProcessing: {
      title: "Data Processing",
      subtitle: "Transparency about how we process your data",
      service: "Service",
      purpose: "Purpose",
      dataProcessed: "Data processed",
      location: "Location",
      gdprStatus: "GDPR status",
      security: "Security measures",
    },
    privacy: {
      title: "Privacy Policy",
      subtitle: "Your privacy, our priority",
    },
    terms: {
      title: "Terms of Service",
      subtitle: "Our agreement with you",
    },
    gemeente: {
      title: "Find your municipality",
      placeholder: "Type your municipality...",
      available: "available",
      noResults: "No results found",
    },
  },
};

const AppContext = createContext<AppContextType | null>(null);

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export default function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("nl");
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const savedLang = localStorage.getItem("pw-lang") as Lang | null;
    const savedTheme = localStorage.getItem("pw-theme") as Theme | null;
    if (savedLang) setLangState(savedLang);
    if (savedTheme) setThemeState(savedTheme);
    else if (window.matchMedia("(prefers-color-scheme: dark)").matches) setThemeState("dark");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.setAttribute("lang", lang);
  }, [theme, lang]);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("pw-lang", l);
  }
  function setTheme(t: Theme) {
    setThemeState(t);
    localStorage.setItem("pw-theme", t);
  }

  const t = translations[lang];

  return (
    <AppContext.Provider value={{ lang, setLang, theme, setTheme, t }}>
      {children}
    </AppContext.Provider>
  );
}
