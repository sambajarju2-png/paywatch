/* ─── PayWatch Competitor Comparison Data ─── */

export interface ComparisonFeature {
  label: { nl: string; en: string };
  paywatch: boolean | string;
  competitor: boolean | string;
}

export interface ComparisonScenario {
  title: { nl: string; en: string };
  without: { nl: string; en: string };
  with: { nl: string; en: string };
}

export interface ComparisonData {
  slug: string;
  name: string;
  url: string;
  tagline: { nl: string; en: string };
  heroTitle: { nl: string; en: string };
  heroSubtitle: { nl: string; en: string };
  focus: { nl: string; en: string };
  pricing: { nl: string; en: string };
  market: string;
  color: string; /* accent color for the competitor */
  features: ComparisonFeature[];
  whenCompetitor: { nl: string[]; en: string[] };
  whenPayWatch: { nl: string[]; en: string[] };
  scenario: ComparisonScenario;
  seoTitle: { nl: string; en: string };
  seoDesc: { nl: string; en: string };
}

export const comparisons: ComparisonData[] = [
  /* ── Dyme ── */
  {
    slug: "dyme-alternatief",
    name: "Dyme",
    url: "dyme.app",
    color: "#6366F1",
    tagline: {
      nl: "Abonnementen & besparen",
      en: "Subscriptions & savings",
    },
    heroTitle: {
      nl: "Dyme alternatief: voorkom dat rekeningen escaleren",
      en: "Dyme alternative: prevent bills from escalating",
    },
    heroSubtitle: {
      nl: "Dyme geeft je inzicht in je abonnementen en vaste lasten. PayWatch gaat een stap verder: we scannen je inbox op rekeningen en waarschuwen je voordat een factuur een aanmaning wordt.",
      en: "Dyme gives you insight into your subscriptions and fixed costs. PayWatch goes further: we scan your inbox for bills and warn you before an invoice becomes a formal notice.",
    },
    focus: {
      nl: "Abonnementen beheren, contracten vergelijken, bespaardeals",
      en: "Subscription management, contract comparison, savings deals",
    },
    pricing: {
      nl: "Gratis basis, Premium vanaf €2,99/maand",
      en: "Free basic, Premium from €2.99/month",
    },
    market: "NL",
    features: [
      { label: { nl: "Bankkoppeling", en: "Bank sync" }, paywatch: false, competitor: true },
      { label: { nl: "Abonnementen opzeggen", en: "Cancel subscriptions" }, paywatch: false, competitor: true },
      { label: { nl: "Contract vergelijking", en: "Contract comparison" }, paywatch: false, competitor: true },
      { label: { nl: "E-mail inbox scanning", en: "Email inbox scanning" }, paywatch: true, competitor: false },
      { label: { nl: "Camera & QR scanning", en: "Camera & QR scanning" }, paywatch: true, competitor: false },
      { label: { nl: "Escalatie detectie", en: "Escalation detection" }, paywatch: true, competitor: false },
      { label: { nl: "Herinneringen vóór boetes", en: "Reminders before penalties" }, paywatch: true, competitor: false },
      { label: { nl: "Buddy systeem", en: "Buddy system" }, paywatch: true, competitor: false },
      { label: { nl: "Schuldpreventie brieven", en: "Debt prevention letters" }, paywatch: true, competitor: false },
      { label: { nl: "Toeslagen berekenen", en: "Benefits calculator" }, paywatch: true, competitor: false },
      { label: { nl: "Schuldhulp zoeker", en: "Debt help finder" }, paywatch: true, competitor: false },
      { label: { nl: "Budgetteren", en: "Budgeting" }, paywatch: true, competitor: "Premium" },
      { label: { nl: "AI voice assistent", en: "AI voice assistant" }, paywatch: true, competitor: false },
      { label: { nl: "Cashflow voorspelling", en: "Cash flow forecast" }, paywatch: true, competitor: false },
    ],
    whenCompetitor: {
      nl: [
        "Je wilt weten welke abonnementen je hebt",
        "Je zoekt een goedkoper energiecontract",
        "Je wilt met één druk op de knop opzeggen",
      ],
      en: [
        "You want to know which subscriptions you have",
        "You're looking for a cheaper energy contract",
        "You want to cancel with one tap",
      ],
    },
    whenPayWatch: {
      nl: [
        "Je ontvangt rekeningen die je soms vergeet te betalen",
        "Je wilt voorkomen dat een factuur een incasso wordt",
        "Je hebt al betalingsachterstanden of dreigt die te krijgen",
        "Je wilt dat iemand meekijkt via het buddy systeem",
      ],
      en: [
        "You receive bills you sometimes forget to pay",
        "You want to prevent an invoice from becoming a collection",
        "You already have payment arrears or risk getting them",
        "You want someone to keep an eye via the buddy system",
      ],
    },
    scenario: {
      title: {
        nl: "Je krijgt een energierekening van €320",
        en: "You receive an energy bill of €320",
      },
      without: {
        nl: "In Dyme zie je dat je energiekosten deze maand hoog zijn. Maar de factuur zelf — met vervaldatum, escalatiefase en extra kosten — zie je niet. Als je de brief mist, krijg je na 14 dagen een herinnering (+€15). Na 30 dagen een aanmaning (+€40). Na 60 dagen een incassobureau (+€150).",
        en: "In Dyme you see your energy costs are high this month. But the invoice itself — with due date, escalation stage, and extra costs — you don't see. If you miss the letter, you get a reminder after 14 days (+€15). After 30 days a formal notice (+€40). After 60 days a collection agency (+€150).",
      },
      with: {
        nl: "PayWatch scant je inbox, vindt de factuur, toont de vervaldatum op je dashboard en stuurt je een herinnering 3 dagen vooraf. Je betaalt op tijd: €320. Geen extra kosten, geen stress.",
        en: "PayWatch scans your inbox, finds the invoice, shows the due date on your dashboard and sends you a reminder 3 days in advance. You pay on time: €320. No extra costs, no stress.",
      },
    },
    seoTitle: {
      nl: "Dyme alternatief: PayWatch voorkomt escalatie van rekeningen",
      en: "Dyme alternative: PayWatch prevents bill escalation",
    },
    seoDesc: {
      nl: "Zoek je een Dyme alternatief? PayWatch scant je inbox, detecteert escalaties en voorkomt dat rekeningen incassozaken worden. Vergelijk de functies.",
      en: "Looking for a Dyme alternative? PayWatch scans your inbox, detects escalations and prevents bills from becoming collections. Compare features.",
    },
  },

  /* ── fiKks ── */
  {
    slug: "fikks-alternatief",
    name: "fiKks",
    url: "wijgaanhetfikksen.nl",
    color: "#059669",
    tagline: {
      nl: "Buddy-hulp bij schulden",
      en: "Buddy-based debt help",
    },
    heroTitle: {
      nl: "fiKks alternatief: grijp in vóórdat schulden ontstaan",
      en: "fiKks alternative: intervene before debts arise",
    },
    heroSubtitle: {
      nl: "fiKks koppelt je aan een vrijwilliger als je al schulden hebt. PayWatch vangt het eerder op: we detecteren rekeningen die dreigen te escaleren en helpen je op tijd actie te ondernemen.",
      en: "fiKks connects you with a volunteer when you already have debts. PayWatch catches it earlier: we detect bills that are about to escalate and help you take action in time.",
    },
    focus: {
      nl: "Anonieme buddy-coaching bij bestaande schulden, actieplannen",
      en: "Anonymous buddy coaching for existing debts, action plans",
    },
    pricing: { nl: "Gratis (stichting)", en: "Free (nonprofit)" },
    market: "NL",
    features: [
      { label: { nl: "Persoonlijke buddy", en: "Personal buddy" }, paywatch: true, competitor: true },
      { label: { nl: "Anoniem gebruik", en: "Anonymous usage" }, paywatch: false, competitor: true },
      { label: { nl: "Chat met buddy", en: "Chat with buddy" }, paywatch: false, competitor: true },
      { label: { nl: "E-mail inbox scanning", en: "Email inbox scanning" }, paywatch: true, competitor: false },
      { label: { nl: "Camera & QR scanning", en: "Camera & QR scanning" }, paywatch: true, competitor: false },
      { label: { nl: "Automatische rekeningen", en: "Automatic bill detection" }, paywatch: true, competitor: false },
      { label: { nl: "Escalatie detectie", en: "Escalation detection" }, paywatch: true, competitor: false },
      { label: { nl: "Herinneringen vóór boetes", en: "Reminders before penalties" }, paywatch: true, competitor: false },
      { label: { nl: "AI voice assistent", en: "AI voice assistant" }, paywatch: true, competitor: false },
      { label: { nl: "Toeslagen berekenen", en: "Benefits calculator" }, paywatch: true, competitor: false },
      { label: { nl: "Cashflow voorspelling", en: "Cash flow forecast" }, paywatch: true, competitor: false },
      { label: { nl: "Schuldoverzicht", en: "Debt overview" }, paywatch: true, competitor: true },
      { label: { nl: "Schuldhulp zoeker", en: "Debt help finder" }, paywatch: true, competitor: true },
      { label: { nl: "AI brieven genereren", en: "AI letter generation" }, paywatch: true, competitor: false },
    ],
    whenCompetitor: {
      nl: [
        "Je hebt al schulden en zoekt een anonieme coach",
        "Je wilt een vrijwilliger die meedenkt over aflossing",
        "Je vindt het fijn om volledig anoniem te blijven",
      ],
      en: [
        "You already have debts and want an anonymous coach",
        "You want a volunteer to help plan repayments",
        "You prefer to remain fully anonymous",
      ],
    },
    whenPayWatch: {
      nl: [
        "Je wilt voorkomen dat rekeningen schulden worden",
        "Je wilt automatisch gewaarschuwd worden bij deadlines",
        "Je zoekt een tool die je inbox scant op rekeningen",
        "Je hebt vroege betalingsachterstanden en wilt escalatie stoppen",
      ],
      en: [
        "You want to prevent bills from becoming debts",
        "You want automatic warnings before deadlines",
        "You're looking for a tool that scans your inbox for bills",
        "You have early payment arrears and want to stop escalation",
      ],
    },
    scenario: {
      title: {
        nl: "Je hebt 3 onbetaalde rekeningen en weet het niet",
        en: "You have 3 unpaid bills and don't know it",
      },
      without: {
        nl: "Met fiKks ga je pas aan de slag als je al schulden hebt. Je vult handmatig je inkomsten en uitgaven in. Je buddy helpt je een plan maken — maar de rekeningen hadden voorkomen kunnen worden.",
        en: "With fiKks you only start working when you already have debts. You manually enter your income and expenses. Your buddy helps you make a plan — but the bills could have been prevented.",
      },
      with: {
        nl: "PayWatch scant je inbox en vindt de 3 facturen automatisch. Je ziet direct de vervaldatums, krijgt herinneringen, en betaalt op tijd. Als je toch hulp nodig hebt, koppel je een buddy via het vangnet systeem.",
        en: "PayWatch scans your inbox and finds the 3 invoices automatically. You see due dates immediately, get reminders, and pay on time. If you still need help, connect a buddy via the safety net system.",
      },
    },
    seoTitle: {
      nl: "fiKks alternatief: PayWatch grijpt eerder in bij rekeningen",
      en: "fiKks alternative: PayWatch intervenes earlier on bills",
    },
    seoDesc: {
      nl: "Zoek je een fiKks alternatief? PayWatch voorkomt dat rekeningen schulden worden door je inbox te scannen en escalaties te detecteren. Vergelijk nu.",
      en: "Looking for a fiKks alternative? PayWatch prevents bills from becoming debts by scanning your inbox and detecting escalations. Compare now.",
    },
  },

  /* ── Grassfeld ── */
  {
    slug: "grassfeld-alternatief",
    name: "Grassfeld",
    url: "grassfeld.com",
    color: "#0E7C55",
    tagline: {
      nl: "Budget & huishoudboekje",
      en: "Budget & household book",
    },
    heroTitle: {
      nl: "Grassfeld alternatief: meer dan budgetteren",
      en: "Grassfeld alternative: more than budgeting",
    },
    heroSubtitle: {
      nl: "Grassfeld helpt je bijhouden wat je uitgeeft. PayWatch helpt je voorkomen dat je rekeningen escaleren naar aanmaningen, incasso's en deurwaarders.",
      en: "Grassfeld helps you track what you spend. PayWatch helps you prevent bills from escalating into formal notices, collections, and bailiffs.",
    },
    focus: {
      nl: "Budgetteren, spaardoelen, bankkoppeling, rapportages",
      en: "Budgeting, savings goals, bank sync, reports",
    },
    pricing: {
      nl: "14 dagen gratis, daarna €1,99–€3,99/maand",
      en: "14 days free, then €1.99–€3.99/month",
    },
    market: "NL + BE + Global",
    features: [
      { label: { nl: "Bankkoppeling", en: "Bank sync" }, paywatch: false, competitor: true },
      { label: { nl: "Budgetteren per categorie", en: "Category budgets" }, paywatch: true, competitor: true },
      { label: { nl: "Spaardoelen", en: "Savings goals" }, paywatch: false, competitor: true },
      { label: { nl: "Webdashboard", en: "Web dashboard" }, paywatch: false, competitor: "Premium+" },
      { label: { nl: "E-mail inbox scanning", en: "Email inbox scanning" }, paywatch: true, competitor: false },
      { label: { nl: "Camera & QR scanning", en: "Camera & QR scanning" }, paywatch: true, competitor: false },
      { label: { nl: "Escalatie detectie", en: "Escalation detection" }, paywatch: true, competitor: false },
      { label: { nl: "Herinneringen vóór boetes", en: "Reminders before penalties" }, paywatch: true, competitor: false },
      { label: { nl: "Buddy systeem", en: "Buddy system" }, paywatch: true, competitor: false },
      { label: { nl: "Schuldpreventie brieven", en: "Debt prevention letters" }, paywatch: true, competitor: false },
      { label: { nl: "Toeslagen berekenen", en: "Benefits calculator" }, paywatch: true, competitor: false },
      { label: { nl: "Schuldhulp zoeker", en: "Debt help finder" }, paywatch: true, competitor: false },
      { label: { nl: "AI voice assistent", en: "AI voice assistant" }, paywatch: true, competitor: false },
      { label: { nl: "Nibud vergelijking", en: "Nibud comparison" }, paywatch: true, competitor: false },
    ],
    whenCompetitor: {
      nl: [
        "Je wilt gedetailleerd budgetteren per categorie",
        "Je zoekt bankkoppeling en automatische categorisatie",
        "Je wilt spaardoelen instellen en volgen",
      ],
      en: [
        "You want detailed category-based budgeting",
        "You're looking for bank sync and auto-categorization",
        "You want to set and track savings goals",
      ],
    },
    whenPayWatch: {
      nl: [
        "Je wilt voorkomen dat facturen escaleren naar incasso",
        "Je wilt je inbox laten scannen op rekeningen",
        "Je hebt hulp nodig bij het navigeren van de schuldhulp",
        "Je wilt weten of je recht hebt op toeslagen",
      ],
      en: [
        "You want to prevent invoices from escalating to collections",
        "You want your inbox scanned for bills",
        "You need help navigating the debt support system",
        "You want to know if you're eligible for benefits",
      ],
    },
    scenario: {
      title: {
        nl: "Je energierekening gaat van €150 naar €320",
        en: "Your energy bill goes from €150 to €320",
      },
      without: {
        nl: "Grassfeld categoriseert de betaling achteraf en laat zien dat je energiekosten gestegen zijn. Maar de factuur zelf — en of je op tijd betaalt — dat monitort Grassfeld niet. Als je de rekening mist, loop je ongemerkt vertraging op.",
        en: "Grassfeld categorizes the payment after the fact and shows your energy costs have risen. But the invoice itself — and whether you pay on time — Grassfeld doesn't monitor. If you miss the bill, you unknowingly fall behind.",
      },
      with: {
        nl: "PayWatch detecteert de factuur in je inbox, toont de vervaldatum, en stuurt een herinnering. Je vergelijkt je kosten met het Nibud-gemiddelde en ziet direct dat je 40% boven de norm zit. Tijd om actie te ondernemen — vóór de herinnering.",
        en: "PayWatch detects the invoice in your inbox, shows the due date, and sends a reminder. You compare your costs with the Nibud average and immediately see you're 40% above the norm. Time to take action — before the reminder.",
      },
    },
    seoTitle: {
      nl: "Grassfeld alternatief: PayWatch voorkomt schuldenescalatie",
      en: "Grassfeld alternative: PayWatch prevents debt escalation",
    },
    seoDesc: {
      nl: "Zoek je een Grassfeld alternatief? PayWatch scant je inbox, detecteert escalaties en helpt je schulden voorkomen. Vergelijk de functies.",
      en: "Looking for a Grassfeld alternative? PayWatch scans your inbox, detects escalations, and helps you prevent debts. Compare features.",
    },
  },

  /* ── Cleo ── */
  {
    slug: "cleo-alternatief",
    name: "Cleo",
    url: "meetcleo.com",
    color: "#8B5CF6",
    tagline: {
      nl: "AI chatbot & cash advance",
      en: "AI chatbot & cash advance",
    },
    heroTitle: {
      nl: "Cleo alternatief: schulden voorkomen in Nederland",
      en: "Cleo alternative: prevent debts in the Netherlands",
    },
    heroSubtitle: {
      nl: "Cleo is een slimme budgetbot uit de VS met cash advance en credit builder. PayWatch is gebouwd voor de Nederlandse markt: inbox scanning, escalatie tracking, en schuldhulp bij jou in de buurt.",
      en: "Cleo is a smart budget bot from the US with cash advance and credit builder. PayWatch is built for the Dutch market: inbox scanning, escalation tracking, and debt help near you.",
    },
    focus: {
      nl: "AI budgetcoach, cash advance, credit builder (VS/VK)",
      en: "AI budget coach, cash advance, credit builder (US/UK)",
    },
    pricing: {
      nl: "Gratis basis, Plus $5,99/maand (VS)",
      en: "Free basic, Plus $5.99/month (US)",
    },
    market: "US / UK",
    features: [
      { label: { nl: "AI chatbot", en: "AI chatbot" }, paywatch: true, competitor: true },
      { label: { nl: "Nederlandse taal", en: "Dutch language" }, paywatch: true, competitor: false },
      { label: { nl: "Beschikbaar in NL/BE", en: "Available in NL/BE" }, paywatch: true, competitor: false },
      { label: { nl: "Cash advance", en: "Cash advance" }, paywatch: false, competitor: true },
      { label: { nl: "Credit builder", en: "Credit builder" }, paywatch: false, competitor: true },
      { label: { nl: "E-mail inbox scanning", en: "Email inbox scanning" }, paywatch: true, competitor: false },
      { label: { nl: "Camera & QR scanning", en: "Camera & QR scanning" }, paywatch: true, competitor: false },
      { label: { nl: "Escalatie detectie", en: "Escalation detection" }, paywatch: true, competitor: false },
      { label: { nl: "Buddy systeem", en: "Buddy system" }, paywatch: true, competitor: false },
      { label: { nl: "Toeslagen berekenen", en: "Benefits calculator" }, paywatch: true, competitor: false },
      { label: { nl: "Schuldhulp zoeker", en: "Debt help finder" }, paywatch: true, competitor: false },
      { label: { nl: "AI brieven genereren", en: "AI letter generation" }, paywatch: true, competitor: false },
      { label: { nl: "Nederlands recht & wet", en: "Dutch law & regulations" }, paywatch: true, competitor: false },
      { label: { nl: "Beslagvrije voet calculator", en: "Protected income calculator" }, paywatch: true, competitor: false },
    ],
    whenCompetitor: {
      nl: [
        "Je woont in de VS of het VK",
        "Je zoekt een cash advance of credit builder",
        "Je vindt een grappige budgetcoach leuk",
      ],
      en: [
        "You live in the US or UK",
        "You're looking for a cash advance or credit builder",
        "You enjoy a fun budget coach chatbot",
      ],
    },
    whenPayWatch: {
      nl: [
        "Je woont in Nederland of België",
        "Je wilt je inbox laten scannen op Nederlandse rekeningen",
        "Je wilt hulp bij het Nederlandse incassoproces",
        "Je zoekt schuldhulp bij jou in de buurt",
      ],
      en: [
        "You live in the Netherlands or Belgium",
        "You want your inbox scanned for Dutch invoices",
        "You need help with the Dutch collection process",
        "You're looking for debt help near you",
      ],
    },
    scenario: {
      title: {
        nl: "Je krijgt een brief van een incassobureau",
        en: "You receive a letter from a collection agency",
      },
      without: {
        nl: "Cleo is niet beschikbaar in Nederland. Zelfs als het dat wel was, begrijpt het het Nederlandse incassosysteem niet: factuur → herinnering → aanmaning → incasso → deurwaarder. Je staat er alleen voor.",
        en: "Cleo is not available in the Netherlands. Even if it were, it doesn't understand the Dutch collection system: invoice → reminder → formal notice → collection → bailiff. You're on your own.",
      },
      with: {
        nl: "PayWatch kent het Nederlandse systeem. Je ziet in welke fase je rekening zit, krijgt een AI-gegenereerde brief om de schuldeiser te benaderen, en vindt schuldhulpverlening bij jou in de gemeente.",
        en: "PayWatch knows the Dutch system. You see which stage your bill is in, get an AI-generated letter to approach the creditor, and find debt help in your municipality.",
      },
    },
    seoTitle: {
      nl: "Cleo alternatief Nederland: PayWatch voor schuldenpreventie",
      en: "Cleo alternative Netherlands: PayWatch for debt prevention",
    },
    seoDesc: {
      nl: "Cleo is niet beschikbaar in Nederland. PayWatch is het Nederlandse alternatief: inbox scanning, escalatie tracking, en schuldhulp bij jou in de buurt.",
      en: "Cleo is not available in the Netherlands. PayWatch is the Dutch alternative: inbox scanning, escalation tracking, and debt help near you.",
    },
  },
];

export function getComparisonBySlug(slug: string): ComparisonData | undefined {
  return comparisons.find((c) => c.slug === slug);
}

/* ─── Escalation timeline (used in interactive section) ─── */
export const escalationSteps = {
  nl: [
    { stage: "Factuur", cost: "€0", color: "#059669", days: "Dag 0" },
    { stage: "Herinnering", cost: "+€15", color: "#D97706", days: "Dag 14" },
    { stage: "Aanmaning", cost: "+€40", color: "#EA580C", days: "Dag 30" },
    { stage: "Incassobureau", cost: "+€150", color: "#DC2626", days: "Dag 60" },
    { stage: "Deurwaarder", cost: "+€500+", color: "#7F1D1D", days: "Dag 90+" },
  ],
  en: [
    { stage: "Invoice", cost: "€0", color: "#059669", days: "Day 0" },
    { stage: "Reminder", cost: "+€15", color: "#D97706", days: "Day 14" },
    { stage: "Formal notice", cost: "+€40", color: "#EA580C", days: "Day 30" },
    { stage: "Collection agency", cost: "+€150", color: "#DC2626", days: "Day 60" },
    { stage: "Bailiff", cost: "+€500+", color: "#7F1D1D", days: "Day 90+" },
  ],
};
