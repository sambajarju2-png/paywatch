/* ─── PayWatch Landing — Site Configuration ─── */

export const siteConfig = {
  name: "PayWatch",
  domain: "paywatch.app",
  appDomain: "app.paywatch.app",
  adminDomain: "admin.paywatch.app",
  company: {
    name: "PayWatch",
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
  { key: "pricing", href: "/pricing" },
  { key: "about", href: "/about" },
  { key: "resources", href: "/resources" },
  { key: "jobs", href: "/jobs" },
  { key: "contact", href: "/contact" },
] as const;

/* ─── Footer Columns ─── */
export const footerColumns = {
  product: [
    { labelNl: "Rotterdam", labelEn: "Rotterdam", href: "/schuldhulp/rotterdam" },
    { labelNl: "Amsterdam", labelEn: "Amsterdam", href: "/schuldhulp/amsterdam" },
    { labelNl: "Den Haag", labelEn: "The Hague", href: "/schuldhulp/den-haag" },
    { labelNl: "Utrecht", labelEn: "Utrecht", href: "/schuldhulp/utrecht" },
    { labelNl: "Eindhoven", labelEn: "Eindhoven", href: "/schuldhulp/eindhoven" },
    { labelNl: "Groningen", labelEn: "Groningen", href: "/schuldhulp/groningen" },
  ],
  company: [
    { labelNl: "Over ons", labelEn: "About", href: "/about" },
    { labelNl: "Vacatures", labelEn: "Jobs", href: "/jobs" },
    { labelNl: "Blog", labelEn: "Blog", href: "/blog" },
    { labelNl: "Contact", labelEn: "Contact", href: "/contact" },
    { labelNl: "Roadmap", labelEn: "Roadmap", href: "/roadmap" },
    { labelNl: "Tech Stack", labelEn: "Tech Stack", href: "/tech-stack" },

  ],
  legal: [
    { labelNl: "Privacybeleid", labelEn: "Privacy Policy", href: "/privacy" },
    { labelNl: "Voorwaarden", labelEn: "Terms of Service", href: "/terms" },
    { labelNl: "Gegevensverwerking", labelEn: "Data Processing", href: "/data-processing" },
  ],
  support: [
    { labelNl: "Artikelen", labelEn: "Resources", href: "/resources" },
    { labelNl: "Hulp & uitleg", labelEn: "Help & guides", href: "/support" },
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

/* ─── Team Members ─── */
export const founders = [
  {
    name: "Samba",
    role: { nl: "Co-founder & CTO", en: "Co-founder & CTO" },
    bio: {
      nl: "Techneut met een missie. Bouwt PayWatch van de grond af op met AI en een obsessie voor gebruiksvriendelijkheid.",
      en: "Tech builder on a mission. Building PayWatch from the ground up with AI and an obsession for user experience.",
    },
    photo: "",
    linkedin: "https://www.linkedin.com/in/sambajarju/",
    email: "samba@paywatch.nl",
  },
  {
    name: "Mariama",
    role: { nl: "Co-founder & CMO", en: "Co-founder & CMO" },
    bio: {
      nl: "De stem van PayWatch. Zorgt dat onze boodschap warm, helder en menselijk is — nooit corporate.",
      en: "The voice of PayWatch. Ensures our message stays warm, clear and human — never corporate.",
    },
    photo: "",
    linkedin: "https://www.linkedin.com/in/hadja-mariama-sesay-3a5392228/",
    email: "mariama@paywatch.com",
  },
];

/* ─── Pricing ─── */
export interface PricingFeature {
  text: { nl: string; en: string };
  free: boolean | string;
  full: boolean | string;
}

export const pricingFeatures: PricingFeature[] = [
  { text: { nl: "Rekeningen scannen", en: "Scan bills" }, free: true, full: true },
  { text: { nl: "Escalatiefases bekijken", en: "View escalation stages" }, free: true, full: true },
  { text: { nl: "Betalingen bijhouden", en: "Track payments" }, free: true, full: true },
  { text: { nl: "Kostenvoorspelling", en: "Cost prediction" }, free: true, full: true },
  { text: { nl: "Betaallinks", en: "Payment links" }, free: true, full: true },
  { text: { nl: "Moodtracker", en: "Mood tracker" }, free: true, full: true },
  { text: { nl: "Donkere modus", en: "Dark mode" }, free: true, full: true },
  { text: { nl: "AI-inzichten", en: "AI insights" }, free: "2x", full: true },
  { text: { nl: "AI-brieven schrijven", en: "AI draft letters" }, free: "2x", full: true },
  { text: { nl: "Statistieken & gezondheid", en: "Statistics & health score" }, free: false, full: true },
  { text: { nl: "Cashflow voorspelling", en: "Cashflow forecast" }, free: false, full: true },
  { text: { nl: "Hulpverleners zoeken", en: "Find support organizations" }, free: false, full: true },
];

/* ─── Contact Subjects ─── */
export const contactSubjects = {
  consumer: {
    nl: [
      "Vraag over mijn account",
      "Probleem met scannen",
      "Vraag over een rekening",
      "Feedback of suggestie",
      "Privacy-gerelateerde vraag",
      "Overig",
    ],
    en: [
      "Question about my account",
      "Problem with scanning",
      "Question about a bill",
      "Feedback or suggestion",
      "Privacy-related question",
      "Other",
    ],
  },
  business: {
    nl: [
      "Samenwerking met PayWatch",
      "PayWatch voor onze gemeente",
      "Integratie of API",
      "Pers of media",
      "Investeren",
      "Overig",
    ],
    en: [
      "Partnership with PayWatch",
      "PayWatch for our municipality",
      "Integration or API",
      "Press or media",
      "Investment",
      "Other",
    ],
  },
};

/* ─── Job Listings ─── */
export interface JobListing {
  id: string;
  title: { nl: string; en: string };
  department: { nl: string; en: string };
  seniority: "Junior" | "Mid" | "Senior";
  location: "remote" | "hybrid" | "office";
  salary: string;
  description: { nl: string; en: string };
  longDescription: { nl: string; en: string };
  requirements: { nl: string[]; en: string[] };
  niceToHave: { nl: string[]; en: string[] };
  perks: { nl: string[]; en: string[] };
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
    longDescription: {
      nl: "Als Frontend Developer bij PayWatch werk je aan onze Next.js web-applicatie en landing page. Je bouwt nieuwe features, verbetert de UX en zorgt dat alles pixel-perfect werkt op elk apparaat. Je werkt nauw samen met ons design- en AI-team om complexe data op een begrijpelijke manier te presenteren aan mensen die worstelen met rekeningen.",
      en: "As a Frontend Developer at PayWatch, you'll work on our Next.js web application and landing page. You'll build new features, improve UX, and ensure everything works pixel-perfect on every device. You'll work closely with our design and AI teams to present complex data in an understandable way to people struggling with bills.",
    },
    requirements: {
      nl: ["2+ jaar React/Next.js ervaring", "Tailwind CSS", "TypeScript", "Oog voor design en UX"],
      en: ["2+ years React/Next.js experience", "Tailwind CSS", "TypeScript", "Eye for design and UX"],
    },
    niceToHave: {
      nl: ["Ervaring met Supabase of Firebase", "Kennis van Vercel deployment", "Ervaring met animaties (Framer Motion)"],
      en: ["Experience with Supabase or Firebase", "Knowledge of Vercel deployment", "Animation experience (Framer Motion)"],
    },
    perks: {
      nl: ["100% remote", "Flexibele uren", "Equity opties", "Impact maken in de fintech/social impact sector"],
      en: ["100% remote", "Flexible hours", "Equity options", "Make impact in fintech/social impact"],
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
    longDescription: {
      nl: "Als Sales Representative ben je het eerste contact tussen PayWatch en gemeenten, schuldhulporganisaties en maatschappelijke instellingen. Je legt uit hoe PayWatch hun cliënten helpt om grip te krijgen op rekeningen en onnodige incassokosten te voorkomen. Je bouwt relaties op, geeft demo's en helpt bij het opzetten van pilotprojecten.",
      en: "As a Sales Representative, you'll be the first point of contact between PayWatch and municipalities, debt aid organizations, and social institutions. You'll explain how PayWatch helps their clients get control over bills and avoid unnecessary collection costs. You'll build relationships, give demos, and help set up pilot projects.",
    },
    requirements: {
      nl: ["Ervaring in B2G of B2B sales", "Nederlands op moedertaalniveau", "Kennis van de Nederlandse schuldhulpketen is een plus"],
      en: ["Experience in B2G or B2B sales", "Native Dutch speaker", "Knowledge of Dutch debt assistance chain is a plus"],
    },
    niceToHave: {
      nl: ["Netwerk bij gemeenten of maatschappelijke organisaties", "CRM ervaring (HubSpot, Pipedrive)"],
      en: ["Network at municipalities or social organizations", "CRM experience (HubSpot, Pipedrive)"],
    },
    perks: {
      nl: ["Hybride werken (Rotterdam)", "Commissie bovenop salaris", "Directe impact op kwetsbare huishoudens"],
      en: ["Hybrid work (Rotterdam)", "Commission on top of salary", "Direct impact on vulnerable households"],
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
      nl: "Verbeter onze AI-pipeline: Gmail-scanning, documentherkenning, escalatie-classificatie.",
      en: "Improve our AI pipeline: Gmail scanning, document recognition, escalation classification.",
    },
    longDescription: {
      nl: "Als AI Engineer verbeter en onderhoud je onze volledige AI-pipeline. Dit omvat inbox-scanning voor classificatie, documentextractie, en het herkennen van escalatiefases in Nederlandse rekeningen en aanmaningen. Je werkt aan accuracy, snelheid en kostenoptimalisatie van onze modellen.",
      en: "As an AI Engineer, you'll improve and maintain our complete AI pipeline. This includes inbox scanning for classification, document extraction, and recognizing escalation stages in Dutch bills and formal notices. You'll work on accuracy, speed, and cost optimization of our models.",
    },
    requirements: {
      nl: ["Ervaring met LLM APIs", "Python of TypeScript", "Document processing ervaring", "Zelfstandig en proactief"],
      en: ["Experience with LLM APIs", "Python or TypeScript", "Document processing experience", "Self-driven and proactive"],
    },
    niceToHave: {
      nl: ["Ervaring met OCR of PDF-parsing", "Kennis van Nederlandse financiële documenten", "Fine-tuning ervaring"],
      en: ["OCR or PDF parsing experience", "Knowledge of Dutch financial documents", "Fine-tuning experience"],
    },
    perks: {
      nl: ["100% remote", "Werk met cutting-edge AI", "Equity opties", "Klein team, grote impact"],
      en: ["100% remote", "Work with cutting-edge AI", "Equity options", "Small team, big impact"],
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
    longDescription: {
      nl: "Als Community Manager ben je de brug tussen PayWatch en onze gebruikers. Je beheert onze social media kanalen, verzamelt feedback, helpt gebruikers met vragen en deelt hun succesverhalen. Je zorgt dat de PayWatch-community warm, behulpzaam en stigmavrij blijft.",
      en: "As Community Manager, you're the bridge between PayWatch and our users. You'll manage our social media channels, collect feedback, help users with questions, and share their success stories. You'll ensure the PayWatch community stays warm, helpful, and stigma-free.",
    },
    requirements: {
      nl: ["Ervaring met social media management", "Empathisch en communicatief", "Nederlands + Engels", "Affiniteit met fintech of social impact"],
      en: ["Social media management experience", "Empathetic and communicative", "Dutch + English", "Affinity with fintech or social impact"],
    },
    niceToHave: {
      nl: ["Content creation skills (video, graphics)", "Community building ervaring", "Kennis van schuldenproblematiek"],
      en: ["Content creation skills (video, graphics)", "Community building experience", "Knowledge of debt issues"],
    },
    perks: {
      nl: ["Hybride werken (Rotterdam)", "Creatieve vrijheid", "Help mensen direct"],
      en: ["Hybrid work (Rotterdam)", "Creative freedom", "Help people directly"],
    },
  },
];

/* ─── Blog Posts (placeholder data — replace with Sanity later) ─── */
export interface BlogPost {
  slug: string;
  title: { nl: string; en: string };
  excerpt: { nl: string; en: string };
  category: string;
  date: string;
  readTime: string;
  author: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "wat-is-escalatie",
    title: { nl: "Wat is escalatie? De 5 fases van een onbetaalde rekening", en: "What is escalation? The 5 stages of an unpaid bill" },
    excerpt: { nl: "Van factuur tot deurwaarder: begrijp elke fase en weet wat je kunt doen om extra kosten te voorkomen.", en: "From invoice to bailiff: understand each stage and know what you can do to avoid extra costs." },
    category: "educatie", date: "2026-03-15", readTime: "5 min", author: "Samba",
  },
  {
    slug: "besparen-op-incassokosten",
    title: { nl: "Zo bespaar je honderden euro's aan incassokosten", en: "How to save hundreds of euros in collection costs" },
    excerpt: { nl: "Praktische tips om je rekeningen op tijd te betalen en onnodige kosten te vermijden.", en: "Practical tips to pay your bills on time and avoid unnecessary costs." },
    category: "tips", date: "2026-03-10", readTime: "4 min", author: "Mariama",
  },
  {
    slug: "schuldhulp-nederland",
    title: { nl: "Schuldhulp in Nederland: waar kun je terecht?", en: "Debt help in the Netherlands: where can you go?" },
    excerpt: { nl: "Een overzicht van gratis hulporganisaties, gemeentelijke regelingen en juridisch advies.", en: "An overview of free support organizations, municipal programs and legal advice." },
    category: "hulp", date: "2026-03-05", readTime: "6 min", author: "Samba",
  },
];

/* ─── Aid Organizations ─── */
export interface AidOrg { name: string; description: { nl: string; en: string }; category: "legal" | "debtHelp" | "financial"; cities: string[]; phone?: string; website?: string; }

export const aidOrganizations: AidOrg[] = [
  { name: "Juridisch Loket", description: { nl: "Gratis juridisch advies voor iedereen. Helpt bij schulden, incasso's en consumentenrecht.", en: "Free legal advice for everyone. Helps with debts, collections and consumer law." }, category: "legal", cities: ["Landelijk"], phone: "0900-8020", website: "https://juridischloket.nl" },
  { name: "Nibud", description: { nl: "Nationaal Instituut voor Budgetvoorlichting. Tips, tools en begrotingsadviezen.", en: "National Institute for Budget Information. Tips, tools and budget advice." }, category: "financial", cities: ["Landelijk"], website: "https://nibud.nl" },
  { name: "SchuldHulpMaatje", description: { nl: "Vrijwilligers die je helpen met schulden. Persoonlijke begeleiding in jouw gemeente.", en: "Volunteers who help you with debts. Personal guidance in your municipality." }, category: "debtHelp", cities: ["Amsterdam", "Rotterdam", "Den Haag", "Utrecht", "Eindhoven"], phone: "088-7788990", website: "https://schuldhulpmaatje.nl" },
  { name: "Sociaal Raadslieden", description: { nl: "Gratis hulp bij financiële en juridische problemen via je gemeente.", en: "Free help with financial and legal problems through your municipality." }, category: "debtHelp", cities: ["Rotterdam", "Amsterdam", "Den Haag", "Utrecht"], website: "https://socialraadslieden.nl" },
  { name: "NVVK", description: { nl: "Vereniging voor schuldhulpverlening en sociaal bankieren. Verwijst door naar lokale hulp.", en: "Association for debt assistance and social banking. Refers to local help." }, category: "financial", cities: ["Landelijk"], website: "https://nvvk.nl" },
];

export const legalAdvisors: AidOrg[] = [
  { name: "Van Doorne Advocaten", description: { nl: "Gespecialiseerd in schuldenrecht en consumentenbescherming.", en: "Specialized in debt law and consumer protection." }, category: "legal", cities: ["Amsterdam"], website: "https://vandoorne.com" },
  { name: "Houthoff", description: { nl: "Advocatenkantoor met expertise op het gebied van financieel recht.", en: "Law firm with expertise in financial law." }, category: "legal", cities: ["Amsterdam", "Rotterdam"], website: "https://houthoff.com" },
  { name: "Kennedy Van der Laan", description: { nl: "Juridische hulp bij incassozaken en betalingsgeschillen.", en: "Legal help with collection cases and payment disputes." }, category: "legal", cities: ["Amsterdam"], website: "https://kvdl.com" },
];

/* ─── Subprocessors ─── */
export const subprocessors = [
  { service: "Supabase", purpose: { nl: "Database & authenticatie", en: "Database & authentication" }, data: { nl: "Accountgegevens, rekeningen", en: "Account data, bills" }, location: "EU (eu-west-1)", gdpr: true },
  { service: "Vercel", purpose: { nl: "Hosting & deployment", en: "Hosting & deployment" }, data: { nl: "Verzoekdata, cookies", en: "Request data, cookies" }, location: "Global (EU edge)", gdpr: true },
  { service: "Resend", purpose: { nl: "Transactionele e-mails", en: "Transactional emails" }, data: { nl: "E-mailadres, naam", en: "Email address, name" }, location: "US (EU DPA)", gdpr: true },
  { service: "Sanity.io", purpose: { nl: "Content management", en: "Content management" }, data: { nl: "Geen persoonsgegevens", en: "No personal data" }, location: "EU", gdpr: true },
];

export const securityMeasures = {
  nl: [ "AES-256 encryptie voor alle data in rust", "TLS 1.3 voor data in transit", "Row Level Security (RLS) op Supabase", "OAuth 2.0 voor Gmail-koppeling (read-only scope)", "Geen opslag van e-mailwachtwoorden", "Automatische sessie-expiratie na 30 dagen", "SOC 2 Type II compliance via Supabase", "Tweefactorauthenticatie beschikbaar" ],
  en: [ "AES-256 encryption for all data at rest", "TLS 1.3 for data in transit", "Row Level Security (RLS) on Supabase", "OAuth 2.0 for Gmail connection (read-only scope)", "No storage of email passwords", "Automatic session expiry after 30 days", "SOC 2 Type II compliance via Supabase", "Two-factor authentication available" ],
};
