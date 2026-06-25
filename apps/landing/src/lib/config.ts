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
  salary: { nl: string; en: string };
  description: { nl: string; en: string };
  longDescription: { nl: string; en: string };
  requirements: { nl: string[]; en: string[] };
  niceToHave: { nl: string[]; en: string[] };
  perks: { nl: string[]; en: string[] };
}

// Job listings (salary is localized per language: { nl, en }).
export const jobListings: JobListing[] = [
  {
    id: "founding-engineer",
    title: { nl: "Founding Engineer", en: "Founding Engineer" },
    department: { nl: "Engineering", en: "Engineering" },
    seniority: "Senior",
    location: "remote",
    salary: { nl: "In overleg", en: "Let's talk" },
    description: {
      nl: "Word onze founding developer. We bouwen de hele app opnieuw op, frontend en backend, en jij bepaalt hoe.",
      en: "Become our founding developer. We're rebuilding the whole app from scratch, frontend and backend, and you call the shots.",
    },
    longDescription: {
      nl: "PayWatch is een fintech-startup met een missie, gevestigd in Rotterdam. We helpen Nederlandse huishoudens grip te houden op hun rekeningen en schulden voordat het uit de hand loopt, met AI-tools zoals PayBuddy, automatische bezwaarbrieven, e-mailscanning en veilige bankkoppeling. Echte technologie voor een echt probleem, met sociale impact aan beide kanten van de betaalketen. Je wordt onze founding developer, de technische kern van PayWatch. We hebben een live product, echte gebruikers en samenwerkingen met de overheid die al lopen. Het werkt. Nu willen we het geweldig maken. Jij leidt de rebuild en bent eigenaar van de hele stack, van begin tot eind. Dit is geen taakjes-uit-een-lijstje rol. Jij bouwt het fundament waar al het andere op staat. We werken snel en zoeken dingen gaandeweg uit. Eerlijk is eerlijk: we zijn een early-stage startup, dus budget is nog niet onze sterkste kant. We zijn flexibel in hoe we het regelen: salaris, freelance, equity of een mix. Vertel ons wat je nodig hebt en we komen er samen uit.",
      en: "PayWatch is a mission-driven fintech startup based in Rotterdam. We help Dutch households stay on top of their bills and debts before things escalate, using AI tools like PayBuddy, automatic dispute letters, email scanning, and secure bank linking. Real tech for a real problem, with social impact on both sides of the payment chain. You'll be our founding developer, the technical core of PayWatch. We've got a live product, real users, and government partnerships already in motion. It works. Now we want to make it great. You'll lead the rebuild and own the whole stack, end to end. This isn't a pick-up-tickets job. You're building the foundation everything else stands on. We ship fast and figure things out as we go. Real talk: we're an early-stage startup so budget isn't our strong suit yet. But we're flexible on how we set it up: salary, freelance, equity, or a mix. Tell us what you need and we'll figure it out together.",
    },
    requirements: {
      nl: [
        "Je kent React en Next.js en bent thuis in servers en databases (Swift ervaring is mooi meegenomen)",
        "Je snapt AI-modellen en hebt ideeën over hoe je ze slim inzet",
        "Je werkt snel, communiceert helder en fixt dingen gewoon",
        "Je hebt grit en doet het for the love of the game",
        "Je kent je sterke punten en staat ervoor",
      ],
      en: [
        "You know React and Next.js and are comfortable with servers and databases (Swift experience is a nice bonus)",
        "You get AI models and have ideas on how to use them well",
        "You move fast, communicate clearly, and just fix things",
        "You have grit and do it for the love of the game",
        "You know your strengths and own them",
      ],
    },
    niceToHave: {
      nl: [
        "Je snapt het schuldenprobleem dat we oplossen (of je leert het graag)",
        "Je spreekt meerdere talen (onze gebruikers ook)",
        "Je hebt iets echts gebouwd dat mensen daadwerkelijk gebruiken",
      ],
      en: [
        "You understand the debt problem we're solving (or you're keen to learn it)",
        "You speak multiple languages (our users do too)",
        "You've shipped something real that people actually use",
      ],
    },
    perks: {
      nl: [
        "Freelance of salaris, wat voor jou werkt",
        "Remote binnen Europa (kernteam in Rotterdam)",
        "Claude Max plan",
        "De tools en hardware die je nodig hebt",
        "Flexibele uren en volledige autonomie",
        "Equity op tafel",
        "Klein team, goede vibe",
      ],
      en: [
        "Freelance or salaried, whatever works for you",
        "Remote within Europe (core team in Rotterdam)",
        "Claude Max plan",
        "The tools and hardware you need",
        "Flexible hours and full autonomy",
        "Equity on the table",
        "Small team, good vibes",
      ],
    },
  },
  {
    id: "content-creator",
    title: { nl: "Content Creator (Video, Foto & Design)", en: "Content Creator (Video, Photo & Design)" },
    department: { nl: "Creative", en: "Creative" },
    seniority: "Mid",
    location: "remote",
    salary: { nl: "In overleg", en: "Let's talk" },
    description: {
      nl: "PayWatch wordt een content-first bedrijf. Vertel ons verhaal in video, foto en design, op elk kanaal.",
      en: "PayWatch is becoming a content-first company. Tell our story in video, photo, and design, across every channel.",
    },
    longDescription: {
      nl: "PayWatch is een fintech-startup met een missie, gevestigd in Rotterdam. We helpen Nederlandse huishoudens grip te houden op hun rekeningen en schulden voordat het uit de hand loopt, met AI-tools zoals PayBuddy, automatische bezwaarbrieven, e-mailscanning en veilige bankkoppeling. Echte technologie voor een echt probleem, met sociale impact aan beide kanten van de betaalketen. PayWatch wordt een content-first bedrijf en jij bent de creatieve kracht achter hoe de wereld ons ziet. Je vertelt ons verhaal in video, foto en design, van productdemo's tot social content tot ons hele publieke gezicht. Je plant en draait foto en video, knipt short-form content, ontwerpt assets zoals thumbnails, social posts, ads en infographics, en maakt complexe geldonderwerpen helder en menselijk. Je houdt onze brand consistent, kijkt naar wat werkt, experimenteert met nieuwe formats en brengt creatieve ideeën in bij campagnes en launches. Je werkt nauw samen met de founders aan storytelling en messaging. Eerlijk is eerlijk: we zijn een early-stage startup, dus budget is nog niet onze sterkste kant. We zijn flexibel in hoe we het regelen: salaris, freelance, equity of een mix. Vertel ons wat je nodig hebt en we komen er samen uit.",
      en: "PayWatch is a mission-driven fintech startup based in Rotterdam. We help Dutch households stay on top of their bills and debts before things escalate, using AI tools like PayBuddy, automatic dispute letters, email scanning, and secure bank linking. Real tech for a real problem, with social impact on both sides of the payment chain. PayWatch is becoming a content-first company, and you'll be the creative force behind how the world sees us. You'll tell our story across video, photo, and design, from product demos to social content to our whole public face. You'll plan and shoot photo and video, cut short-form content, design assets like thumbnails, social posts, ads, and infographics, and turn complex money topics into clear, human visuals. You'll keep our brand consistent, look at what's working, experiment with new formats, and bring creative ideas to campaigns and launches. You'll work closely with the founders on storytelling and messaging. Real talk: we're an early-stage startup so budget isn't our strong suit yet. But we're flexible on how we set it up: salary, freelance, equity, or a mix. Tell us what you need and we'll figure it out together.",
    },
    requirements: {
      nl: [
        "Sterke video-editing skills (jouw tool, wij gatekeepen geen software)",
        "Een goed oog voor fotobewerking en visuele storytelling",
        "Een portfolio met range: je kunt strak en je kunt scrappy",
        "Self-starter energie: je ziet een kans voor content en gaat ervoor",
        "Je snapt social media van nature, niet omdat een blog zei dat je 3x per week moet posten",
        "Je maakt complexe of gevoelige geldonderwerpen toegankelijk en menselijk",
      ],
      en: [
        "Strong video editing skills (your tool of choice, we don't gatekeep software)",
        "An eye for photo editing and visual storytelling",
        "A portfolio with range: you can do polished and you can do scrappy",
        "Self-starter energy: you spot a content opportunity and just go for it",
        "You get social media natively, not because a blog told you to post 3x a week",
        "You can make complex or sensitive money topics approachable and human",
      ],
    },
    niceToHave: {
      nl: [
        "Motion design skills (echt een pro move)",
        "UI/UX design (Figma) om onze website en app opnieuw vorm te geven",
        "Een algemeen begrip van schulden en geldzorgen",
        "Bekend met de Nederlandse markt of Nederlandstalige content",
        "Je hebt zelf een merk of publiek opgebouwd",
      ],
      en: [
        "Motion design skills (a real pro move)",
        "UI/UX design (Figma) to help redesign our website and app",
        "A general understanding of debt and money struggles",
        "Familiar with the Dutch market or Dutch-language content",
        "You've built your own brand or audience before",
      ],
    },
    perks: {
      nl: [
        "Freelance of salaris, wat voor jou werkt",
        "Remote binnen Europa (kernteam in Rotterdam)",
        "Creatieve vrijheid",
        "Flexibele uren en volledige autonomie",
        "Equity op tafel",
        "De tools die je nodig hebt",
        "Klein team, goede vibe",
      ],
      en: [
        "Freelance or salaried, whatever works for you",
        "Remote within Europe (core team in Rotterdam)",
        "Creative freedom",
        "Flexible hours and full autonomy",
        "Equity on the table",
        "The tools you need",
        "Small team, good vibes",
      ],
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
