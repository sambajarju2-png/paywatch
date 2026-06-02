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
      privacy: "samba@paywatch.nl",
    },
  },
};

/* ─── Navigation Items ─── */
export const navItems = [
  { key: "features", href: "/features" },
  { key: "pricing", href: "/pricing" },
  { key: "vergelijken", href: "/vergelijking" },
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
    { labelNl: "Vergelijken", labelEn: "Compare", href: "/vergelijking" },
    { labelNl: "Vacatures", labelEn: "Jobs", href: "/jobs" },
    { labelNl: "Blog", labelEn: "Blog", href: "/blog" },
    { labelNl: "Contact", labelEn: "Contact", href: "/contact" },
    { labelNl: "Gastcolleges", labelEn: "Speaking", href: "/speaking" },
    { labelNl: "Prijzen", labelEn: "Pricing", href: "/pricing" },
  ],
  legal: [
    { labelNl: "Privacybeleid", labelEn: "Privacy Policy", href: "/privacy" },
    { labelNl: "Voorwaarden", labelEn: "Terms of Service", href: "/terms" },
    { labelNl: "Gegevensverwerking", labelEn: "Data Processing", href: "/data-processing" },
    { labelNl: "DPIA", labelEn: "DPIA", href: "/privacy?tab=dpia" },
  ],
  support: [
    { labelNl: "Artikelen", labelEn: "Resources", href: "/resources" },
    { labelNl: "Hulp & uitleg", labelEn: "Help & guides", href: "/support" },
    { labelNl: "Hulporganisaties", labelEn: "Aid Organizations", href: "/resources#aid" },
    { labelNl: "Gemeente zoeken", labelEn: "Find municipality", href: "/resources#gemeente" },
    { labelNl: "Directory", labelEn: "Directory", href: "/directory" },
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
    slug: "samba-jarju",
    fullName: "Samba Jarju",
    role: { nl: "Co-founder", en: "Co-founder" },
    bio: {
      nl: "Marketeer met een passie voor technologie en gebruiksvriendelijkheid. Gelooft dat data het leven van mensen makkelijker kan maken als je het goed inzet.",
      en: "Marketer with a passion for technology and user experience. Believes data can make people's lives easier when used right.",
    },
    fullBio: {
      nl: "Samba is marketeer van hart en techneut van aard. Hij combineert een scherp oog voor data met een drang om dingen simpel te houden. Bij PayWatch vertaalt hij complexe financiele processen naar iets dat iedereen begrijpt. Zijn achtergrond in marketing en data-analyse zorgt ervoor dat alles wat PayWatch bouwt niet alleen technisch goed werkt, maar ook echt aansluit bij de mensen die het gebruiken. Hij is geobsedeerd door gebruiksvriendelijkheid. Niet het soort dat je op een feature-lijst zet, maar het soort dat je merkt als je de app opent en alles gewoon klopt. Elke scherm, elke flow, elk detail wordt afgewogen vanuit de vraag: maakt dit het makkelijker voor iemand die al genoeg stress heeft? Privacy staat bij Samba op plek een. Niet als marketingpraatje, maar als ontwerpprincipe. Gegevens worden verwerkt in de EU, foto's van rekeningen worden direct verwijderd na verwerking, en de app vraagt alleen om data die echt nodig is. Dat is geen concessie, dat is hoe je het hoort te doen.",
      en: "Samba is a marketer at heart and a techie by nature. He combines a sharp eye for data with a drive to keep things simple. At PayWatch he translates complex financial processes into something everyone understands. His background in marketing and data analysis ensures that everything PayWatch builds doesn't just work technically, but also connects with the people who use it. He's obsessed with user experience. Not the kind you put on a feature list, but the kind you notice when you open the app and everything just feels right. Every screen, every flow, every detail is weighed against the question: does this make things easier for someone who already has enough stress? Privacy is Samba's number one priority. Not as a marketing talking point, but as a design principle. Data is processed in the EU, photos of bills are deleted immediately after processing, and the app only asks for data that's truly needed. That's not a compromise, that's how it should be done.",
    },
    photo: "",
    linkedin: "https://www.linkedin.com/in/sambajarju/",
    email: "samba@paywatch.nl",
  },
  {
    name: "Mariama",
    slug: "mariama-sesay",
    fullName: "Mariama Sesay",
    role: { nl: "Co-founder", en: "Co-founder" },
    bio: {
      nl: "Sales en juridisch adviseur met ervaring in privacy en consumentenrecht. Zorgt dat PayWatch groeit en dat de rechten van gebruikers altijd voorop staan.",
      en: "Sales and legal advisor with experience in privacy and consumer law. Makes sure PayWatch grows while always putting user rights first.",
    },
    fullBio: {
      nl: "Mariama brengt twee werelden samen die zelden bij dezelfde persoon zitten: sales en recht. Ze heeft ervaring opgebouwd bij juridische kantoren waar ze werkte aan privacyrecht, consumentenbescherming en AVG-compliance. Die achtergrond maakt haar tot de ideale persoon om ervoor te zorgen dat PayWatch niet alleen groeit, maar dat ook op de juiste manier doet. In haar salesrol is ze het eerste gezicht van PayWatch naar buiten. Ze praat met gemeenten, hulporganisaties en incassobureaus. Niet met een verkooppraatje, maar met een eerlijk verhaal over wat de app doet en waarom het ertoe doet. Haar juridische achtergrond geeft haar geloofwaardigheid in die gesprekken. Ze kent de regels, ze kent de risico's, en ze weet wat organisaties nodig hebben voordat ze ja zeggen. Op het gebied van privacy is Mariama de interne bewaker. Ze beoordeelt elke nieuwe feature op privacyimpact, zorgt dat verwerkersovereenkomsten op orde zijn, en houdt PayWatch scherp op databescherming. Dat is geen bijrol, dat is een kernfunctie.",
      en: "Mariama brings together two worlds that rarely sit with the same person: sales and law. She has built experience at legal firms where she worked on privacy law, consumer protection and GDPR compliance. That background makes her the ideal person to ensure PayWatch doesn't just grow, but does so the right way. In her sales role she's the first face of PayWatch to the outside world. She talks to municipalities, aid organizations and collection agencies. Not with a sales pitch, but with an honest story about what the app does and why it matters. Her legal background gives her credibility in those conversations. She knows the rules, she knows the risks, and she knows what organizations need before they say yes. On privacy, Mariama is the internal guardian. She reviews every new feature for privacy impact, ensures data processing agreements are in order, and keeps PayWatch sharp on data protection. That's not a side role, that's a core function.",
    },
    photo: "",
    linkedin: "https://www.linkedin.com/in/hadja-mariama-sesay-3a5392228/",
    email: "mariama@paywatch.nl",
  },
  {
    name: "Shah",
    slug: "shah-farooq",
    fullName: "Shah Farooq",
    role: { nl: "Data Engineer & Developer", en: "Data Engineer & Developer" },
    bio: {
      nl: "Data engineer en ontwikkelaar die zorgt dat de technische ruggengraat van PayWatch snel, betrouwbaar en schaalbaar is.",
      en: "Data engineer and developer who ensures PayWatch's technical backbone is fast, reliable and scalable.",
    },
    fullBio: {
      nl: "Shah is data engineer en ontwikkelaar bij PayWatch. Hij werkt aan de systemen die ervoor zorgen dat financiële data veilig verwerkt wordt en dat de app altijd beschikbaar is. Met een achtergrond in data engineering brengt hij de technische diepgang die nodig is om complexe datastromen betrouwbaar te laten werken op schaal.",
      en: "Shah is a data engineer and developer at PayWatch. He works on the systems that ensure financial data is processed securely and that the app is always available. With a background in data engineering, he brings the technical depth needed to make complex data flows work reliably at scale.",
    },
    photo: "/team-shah.jpg",
    linkedin: "https://www.linkedin.com/in/shahmfarooq/",
    email: "",
  },
  {
    name: "Ahsan",
    slug: "ahsan-ramzan",
    fullName: "Ahsan Ramzan",
    role: { nl: "Developer", en: "Developer" },
    bio: {
      nl: "Full-stack developer die features bouwt die het verschil maken voor gebruikers in een kwetsbare financiële situatie.",
      en: "Full-stack developer who builds features that make a difference for users in vulnerable financial situations.",
    },
    fullBio: {
      nl: "Ahsan is developer bij PayWatch en werkt aan zowel de front-end als de back-end van het platform. Hij vertaalt ontwerpen en specificaties naar werkende code die elke dag wordt gebruikt door mensen die grip willen krijgen op hun rekeningen. Zijn focus ligt op het bouwen van betrouwbare, snelle interfaces die ook werken op oudere telefoons en langzame verbindingen.",
      en: "Ahsan is a developer at PayWatch working on both the front-end and back-end of the platform. He translates designs and specifications into working code used daily by people who want to get a grip on their bills. His focus is on building reliable, fast interfaces that also work on older phones and slow connections.",
    },
    photo: "/team-ahsan.jpg",
    linkedin: "https://www.linkedin.com/in/ahsanramzan/",
    email: "",
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
  { service: "Scaleway", purpose: { nl: "AI-analyse (rekening- en e-mailscan)", en: "AI analysis (bill & email scanning)" }, data: { nl: "E-mailtekst, foto's van rekeningen", en: "Email text, photos of bills" }, location: "EU (Parijs, Frankrijk)", gdpr: true },
  { service: "Vercel", purpose: { nl: "Hosting & deployment", en: "Hosting & deployment" }, data: { nl: "Verzoekdata, cookies", en: "Request data, cookies" }, location: "Global (EU edge)", gdpr: true },
  { service: "Resend", purpose: { nl: "Transactionele e-mails", en: "Transactional emails" }, data: { nl: "E-mailadres, naam", en: "Email address, name" }, location: "US (EU DPA)", gdpr: true },
  { service: "Anthropic", purpose: { nl: "AI-inzichten & conceptbrieven", en: "AI insights & draft letters" }, data: { nl: "Geanonimiseerde rekeninggegevens", en: "Anonymized bill summaries" }, location: "US (EU DPA)", gdpr: true },
  { service: "Sanity.io", purpose: { nl: "Content management", en: "Content management" }, data: { nl: "Geen persoonsgegevens", en: "No personal data" }, location: "EU", gdpr: true },
  { service: "ElevenLabs", purpose: { nl: "Spraakassistent (PayBuddy)", en: "Voice assistant (PayBuddy)" }, data: { nl: "Spraakaudio (niet opgeslagen)", en: "Voice audio (not stored)" }, location: "EU (DPA)", gdpr: true },
];

export const securityMeasures = {
  nl: [ "AES-256 encryptie voor alle data in rust", "TLS 1.3 voor data in transit", "Row Level Security (RLS) op Supabase", "OAuth 2.0 voor Gmail-koppeling (read-only scope)", "Geen opslag van e-mailwachtwoorden", "Geen opslag van foto's of afbeeldingen", "AI-verwerking volledig binnen de EU (Scaleway, Parijs)", "Automatische sessie-expiratie na 30 dagen", "SOC 2 Type II compliance via Supabase", "Tweefactorauthenticatie beschikbaar" ],
  en: [ "AES-256 encryption for all data at rest", "TLS 1.3 for data in transit", "Row Level Security (RLS) on Supabase", "OAuth 2.0 for Gmail connection (read-only scope)", "No storage of email passwords", "No storage of photos or images", "AI processing fully within the EU (Scaleway, Paris)", "Automatic session expiry after 30 days", "SOC 2 Type II compliance via Supabase", "Two-factor authentication available" ],
};
