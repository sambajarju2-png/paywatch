/* ─── PayWatch Landing — Site Configuration ─── */

export const siteConfig = {
  name: "PayWatch",
  domain: "paywatch.app",
  appDomain: "app.paywatch.app",
  adminDomain: "admin.paywatch.app",
  company: {
    name: "PayWatch B.V.",
    kvk: "83474889",
    location: "Rotterdam, Netherlands",
    emails: {
      press: "pers@paywatch.nl",
      business: "business@paywatch.nl",
      info: "info@paywatch.nl",
      privacy: "privacy@paywatch.app",
    },
  },
};

/* ─── Navigation Items ─── */
export const navItems = [
  { key: "features", href: "/features" },
  { key: "about", href: "/about" },
  { key: "resources", href: "/resources" },
  { key: "jobs", href: "/jobs" },
  { key: "contact", href: "/contact" },
] as const;

/* ─── Footer Columns ─── */
export const footerColumns = {
  product: [
    { labelNl: "Functies", labelEn: "Features", href: "/features" },
    { labelNl: "Hoe het werkt", labelEn: "How it works", href: "/#how-it-works" },
    { labelNl: "Prijzen", labelEn: "Pricing", href: "/#pricing" },
  ],
  company: [
    { labelNl: "Over ons", labelEn: "About", href: "/about" },
    { labelNl: "Vacatures", labelEn: "Jobs", href: "/jobs" },
    { labelNl: "Contact", labelEn: "Contact", href: "/contact" },
  ],
  legal: [
    { labelNl: "Privacybeleid", labelEn: "Privacy Policy", href: "/privacy" },
    { labelNl: "Voorwaarden", labelEn: "Terms of Service", href: "/terms" },
    { labelNl: "Gegevensverwerking", labelEn: "Data Processing", href: "/data-processing" },
  ],
  support: [
    { labelNl: "Hulpmiddelen", labelEn: "Resources", href: "/resources" },
    { labelNl: "Hulporganisaties", labelEn: "Aid Organizations", href: "/resources#aid" },
    { labelNl: "Gemeente zoeken", labelEn: "Find municipality", href: "/resources#gemeente" },
  ],
};

/* ─── 43+ Gemeenten ─── */
export const gemeenten = [
  "Amsterdam","Rotterdam","Den Haag","Utrecht","Eindhoven","Groningen","Tilburg","Almere",
  "Breda","Nijmegen","Apeldoorn","Haarlem","Arnhem","Enschede","Amersfoort","Zaanstad",
  "Haarlemmermeer","'s-Hertogenbosch","Zoetermeer","Zwolle","Leiden","Maastricht",
  "Dordrecht","Ede","Emmen","Venlo","Deventer","Delft","Sittard-Geleen","Leeuwarden",
  "Helmond","Heerlen","Oss","Roosendaal","Vlaardingen","Schiedam","Spijkenisse",
  "Gouda","Alkmaar","Lelystad","Alphen aan den Rijn","Hoorn","Purmerend",
];

/* ─── Founders ─── */
export const founders = [
  {
    name: "Samba",
    role: { nl: "Co-founder & CTO", en: "Co-founder & CTO" },
    bio: {
      nl: "Techneut met een missie. Bouwt PayWatch van de grond af op met AI en een obsessie voor gebruiksvriendelijkheid.",
      en: "Tech builder on a mission. Building PayWatch from the ground up with AI and an obsession for user experience.",
    },
    linkedin: "https://linkedin.com/in/samba-paywatch", // PLACEHOLDER — update with real URL
    email: "samba@paywatch.nl",
  },
  {
    name: "Mariama",
    role: { nl: "Co-founder & CMO", en: "Co-founder & CMO" },
    bio: {
      nl: "De stem van PayWatch. Zorgt dat onze boodschap warm, helder en menselijk is — nooit corporate.",
      en: "The voice of PayWatch. Ensures our message stays warm, clear and human — never corporate.",
    },
    linkedin: "https://linkedin.com/in/mariama-paywatch", // PLACEHOLDER — update with real URL
    email: "mariama@paywatch.nl",
  },
];

/* ─── Job Listings ─── */
export interface JobListing {
  id: string;
  title: { nl: string; en: string };
  department: { nl: string; en: string };
  seniority: "Junior" | "Mid" | "Senior";
  location: "remote" | "hybrid" | "office";
  salary: string;
  description: { nl: string; en: string };
  requirements: { nl: string[]; en: string[] };
}

export const jobListings: JobListing[] = [
  {
    id: "frontend-dev",
    title: { nl: "Frontend Developer", en: "Frontend Developer" },
    department: { nl: "Engineering", en: "Engineering" },
    seniority: "Mid",
    location: "remote",
    salary: "€ 3.500 - € 5.000/mo",
    description: {
      nl: "Bouw mee aan de PayWatch web-app en landing page. React, Next.js, Tailwind.",
      en: "Help build the PayWatch web app and landing page. React, Next.js, Tailwind.",
    },
    requirements: {
      nl: ["2+ jaar React/Next.js ervaring", "Tailwind CSS", "TypeScript", "Oog voor design en UX"],
      en: ["2+ years React/Next.js experience", "Tailwind CSS", "TypeScript", "Eye for design and UX"],
    },
  },
  {
    id: "sales-rep",
    title: { nl: "Sales Representative", en: "Sales Representative" },
    department: { nl: "Sales", en: "Sales" },
    seniority: "Junior",
    location: "hybrid",
    salary: "€ 2.800 - € 3.800/mo",
    description: {
      nl: "Benader gemeenten en schuldhulporganisaties. Laat zien hoe PayWatch hun cliënten helpt.",
      en: "Reach out to municipalities and debt aid organizations. Show them how PayWatch helps their clients.",
    },
    requirements: {
      nl: ["Ervaring in B2G of B2B sales", "Nederlands op moedertaalniveau", "Kennis van de Nederlandse schuldhulpketen is een plus"],
      en: ["Experience in B2G or B2B sales", "Native Dutch speaker", "Knowledge of Dutch debt assistance chain is a plus"],
    },
  },
  {
    id: "ai-engineer",
    title: { nl: "AI Engineer", en: "AI Engineer" },
    department: { nl: "Engineering", en: "Engineering" },
    seniority: "Senior",
    location: "remote",
    salary: "€ 5.000 - € 7.000/mo",
    description: {
      nl: "Verbeter onze AI-pipeline: Gmail-scanning, documentherkenning, escallatie-classificatie.",
      en: "Improve our AI pipeline: Gmail scanning, document recognition, escalation classification.",
    },
    requirements: {
      nl: ["Ervaring met LLM APIs (Claude, Gemini)", "Python of TypeScript", "Document processing ervaring", "Zelfstandig en proactief"],
      en: ["Experience with LLM APIs (Claude, Gemini)", "Python or TypeScript", "Document processing experience", "Self-driven and proactive"],
    },
  },
  {
    id: "community-manager",
    title: { nl: "Community Manager", en: "Community Manager" },
    department: { nl: "Marketing", en: "Marketing" },
    seniority: "Junior",
    location: "hybrid",
    salary: "€ 2.500 - € 3.500/mo",
    description: {
      nl: "Beheer onze social media, community en user feedback. Help onze gebruikers en vertel hun verhalen.",
      en: "Manage our social media, community and user feedback. Help our users and tell their stories.",
    },
    requirements: {
      nl: ["Ervaring met social media management", "Empathisch en communicatief", "Nederlands + Engels", "Affiniteit met fintech of social impact"],
      en: ["Social media management experience", "Empathetic and communicative", "Dutch + English", "Affinity with fintech or social impact"],
    },
  },
];

/* ─── Aid Organizations ─── */
export interface AidOrg {
  name: string;
  description: { nl: string; en: string };
  category: "legal" | "debtHelp" | "financial";
  cities: string[];
  phone?: string;
  website?: string;
}

export const aidOrganizations: AidOrg[] = [
  {
    name: "Juridisch Loket",
    description: {
      nl: "Gratis juridisch advies voor iedereen. Helpt bij schulden, incasso's en consumentenrecht.",
      en: "Free legal advice for everyone. Helps with debts, collections and consumer law.",
    },
    category: "legal",
    cities: ["Landelijk"],
    phone: "0900-8020",
    website: "https://juridischloket.nl",
  },
  {
    name: "Nibud",
    description: {
      nl: "Nationaal Instituut voor Budgetvoorlichting. Tips, tools en begrotingsadviezen.",
      en: "National Institute for Budget Information. Tips, tools and budget advice.",
    },
    category: "financial",
    cities: ["Landelijk"],
    website: "https://nibud.nl",
  },
  {
    name: "SchuldHulpMaatje",
    description: {
      nl: "Vrijwilligers die je helpen met schulden. Persoonlijke begeleiding in jouw gemeente.",
      en: "Volunteers who help you with debts. Personal guidance in your municipality.",
    },
    category: "debtHelp",
    cities: ["Amsterdam", "Rotterdam", "Den Haag", "Utrecht", "Eindhoven"],
    phone: "088-7788990",
    website: "https://schuldhulpmaatje.nl",
  },
  {
    name: "Sociaal Raadslieden",
    description: {
      nl: "Gratis hulp bij financiële en juridische problemen via je gemeente.",
      en: "Free help with financial and legal problems through your municipality.",
    },
    category: "debtHelp",
    cities: ["Rotterdam", "Amsterdam", "Den Haag", "Utrecht"],
    website: "https://socialraadslieden.nl",
  },
  {
    name: "NVVK",
    description: {
      nl: "Vereniging voor schuldhulpverlening en sociaal bankieren. Verwijst door naar lokale hulp.",
      en: "Association for debt assistance and social banking. Refers to local help.",
    },
    category: "financial",
    cities: ["Landelijk"],
    website: "https://nvvk.nl",
  },
];

/* ─── Lawyers / Legal Advisors ─── */
export const legalAdvisors: AidOrg[] = [
  {
    name: "Van Doorne Advocaten",
    description: {
      nl: "Gespecialiseerd in schuldenrecht en consumentenbescherming.",
      en: "Specialized in debt law and consumer protection.",
    },
    category: "legal",
    cities: ["Amsterdam"],
    website: "https://vandoorne.com",
  },
  {
    name: "Houthoff",
    description: {
      nl: "Advocatenkantoor met expertise op het gebied van financieel recht.",
      en: "Law firm with expertise in financial law.",
    },
    category: "legal",
    cities: ["Amsterdam", "Rotterdam"],
    website: "https://houthoff.com",
  },
  {
    name: "Kennedy Van der Laan",
    description: {
      nl: "Juridische hulp bij incassozaken en betalingsgeschillen.",
      en: "Legal help with collection cases and payment disputes.",
    },
    category: "legal",
    cities: ["Amsterdam"],
    website: "https://kvdl.com",
  },
];

/* ─── Subprocessors ─── */
export const subprocessors = [
  {
    service: "Supabase",
    purpose: { nl: "Database & authenticatie", en: "Database & authentication" },
    data: { nl: "Accountgegevens, rekeningen", en: "Account data, bills" },
    location: "EU (eu-west-1)",
    gdpr: true,
  },
  {
    service: "Google Gemini Flash",
    purpose: { nl: "E-mail classificatie", en: "Email classification" },
    data: { nl: "E-mailinhoud (tijdelijk)", en: "Email content (temporary)" },
    location: "EU",
    gdpr: true,
  },
  {
    service: "Anthropic Claude Haiku",
    purpose: { nl: "Data extractie uit rekeningen", en: "Data extraction from bills" },
    data: { nl: "Rekeningtekst (tijdelijk)", en: "Bill text (temporary)" },
    location: "US (EU DPA)",
    gdpr: true,
  },
  {
    service: "Vercel",
    purpose: { nl: "Hosting & deployment", en: "Hosting & deployment" },
    data: { nl: "Verzoekdata, cookies", en: "Request data, cookies" },
    location: "Global (EU edge)",
    gdpr: true,
  },
  {
    service: "Resend",
    purpose: { nl: "Transactionele e-mails", en: "Transactional emails" },
    data: { nl: "E-mailadres, naam", en: "Email address, name" },
    location: "US (EU DPA)",
    gdpr: true,
  },
  {
    service: "Sanity.io",
    purpose: { nl: "Content management", en: "Content management" },
    data: { nl: "Geen persoonsgegevens", en: "No personal data" },
    location: "EU",
    gdpr: true,
  },
];

/* ─── Security Measures ─── */
export const securityMeasures = {
  nl: [
    "AES-256 encryptie voor alle data in rust",
    "TLS 1.3 voor data in transit",
    "Row Level Security (RLS) op Supabase",
    "OAuth 2.0 voor Gmail-koppeling (read-only scope)",
    "Geen opslag van e-mailwachtwoorden",
    "Automatische sessie-expiratie na 30 dagen",
    "SOC 2 Type II compliance via Supabase",
    "Tweefactorauthenticatie beschikbaar",
  ],
  en: [
    "AES-256 encryption for all data at rest",
    "TLS 1.3 for data in transit",
    "Row Level Security (RLS) on Supabase",
    "OAuth 2.0 for Gmail connection (read-only scope)",
    "No storage of email passwords",
    "Automatic session expiry after 30 days",
    "SOC 2 Type II compliance via Supabase",
    "Two-factor authentication available",
  ],
};
