/* ─── PayWatch Feature Pages Data ─── */

export interface FeatureSection {
  heading: { nl: string; en: string };
  text: { nl: string; en: string };
  imageKey: string;
}

export interface FeaturePageData {
  slug: string;
  icon: string;
  overview: {
    title: { nl: string; en: string };
    desc: { nl: string; en: string };
  };
  hero: {
    title: { nl: string; en: string };
    subtitle: { nl: string; en: string };
  };
  sections: FeatureSection[];
  relatedSlugs: string[];
}

export const featurePages: FeaturePageData[] = [
  /* ── 1. Email Scanner ── */
  {
    slug: "email-scanner",
    icon: "📬",
    overview: {
      title: { nl: "E-mail scanner", en: "Email scanner" },
      desc: {
        nl: "Verbind je Gmail of Outlook en PayWatch doorzoekt je inbox dagelijks op rekeningen, herinneringen en aanmaningen.",
        en: "Connect your Gmail or Outlook and PayWatch searches your inbox daily for invoices, reminders, and formal notices.",
      },
    },
    hero: {
      title: {
        nl: "Je inbox, automatisch gescand",
        en: "Your inbox, automatically scanned",
      },
      subtitle: {
        nl: "Verbind je e-mail en PayWatch vindt je rekeningen — elke dag opnieuw. Geen handmatig werk, geen gemiste deadlines.",
        en: "Connect your email and PayWatch finds your bills — every single day. No manual work, no missed deadlines.",
      },
    },
    sections: [
      {
        heading: { nl: "Werkt met Gmail en Outlook", en: "Works with Gmail and Outlook" },
        text: {
          nl: "Koppel je Gmail- of Outlook-account via een beveiligde OAuth-verbinding. PayWatch leest alleen je e-mails — we slaan geen wachtwoorden op en hebben geen toegang tot je account. Na het koppelen scannen we je inbox dagelijks, ook als de app niet open staat.",
          en: "Link your Gmail or Outlook account through a secure OAuth connection. PayWatch only reads your emails — we don't store passwords or access your account. Once connected, we scan your inbox daily, even when the app isn't open.",
        },
        imageKey: "feature-email-scanner-1",
      },
      {
        heading: { nl: "Herkent meer dan alleen facturen", en: "Recognizes more than just invoices" },
        text: {
          nl: "PayWatch herkent niet alleen facturen, maar ook herinneringen, aanmaningen, incassobrieven en bevestigingen van betalingsregelingen. Elk bericht wordt gekoppeld aan de juiste rekening, zodat je het hele verhaal in één overzicht ziet.",
          en: "PayWatch doesn't just find invoices — it also recognizes reminders, formal notices, collection letters, and payment plan confirmations. Each message is linked to the right bill, so you see the full picture in one overview.",
        },
        imageKey: "feature-email-scanner-2",
      },
      {
        heading: { nl: "Veilig en privé", en: "Safe and private" },
        text: {
          nl: "Je e-mailgegevens worden versleuteld verwerkt en nooit gedeeld met derden. We gebruiken alleen-lezen toegang: PayWatch kan je e-mails bekijken, maar nooit versturen, verwijderen of aanpassen. Gebouwd in de EU, volledig AVG-compliant.",
          en: "Your email data is encrypted and never shared with third parties. We use read-only access: PayWatch can view your emails but never send, delete, or modify them. Built in the EU, fully GDPR compliant.",
        },
        imageKey: "feature-email-scanner-3",
      },
    ],
    relatedSlugs: ["camera-scanner", "betaalfases", "agenda"],
  },

  /* ── 2. Camera & QR Scanner ── */
  {
    slug: "camera-scanner",
    icon: "📷",
    overview: {
      title: { nl: "Camera & QR scanner", en: "Camera & QR scanner" },
      desc: {
        nl: "Ontvang je rekeningen per post? Scan ze met je camera of gebruik de QR-code op de factuur.",
        en: "Receive bills by mail? Scan them with your camera or use the QR code on the invoice.",
      },
    },
    hero: {
      title: {
        nl: "Elke rekening, ook op papier",
        en: "Every bill, even on paper",
      },
      subtitle: {
        nl: "Niet alles komt via e-mail. Maak een foto van je brief of scan de QR-code — PayWatch doet de rest.",
        en: "Not everything arrives by email. Snap a photo of your letter or scan the QR code — PayWatch does the rest.",
      },
    },
    sections: [
      {
        heading: { nl: "Maak een foto, klaar", en: "Snap a photo, done" },
        text: {
          nl: "Open de camera in PayWatch en maak een foto van je rekening of brief. PayWatch herkent automatisch het bedrag, de afzender, het factuurnummer en de vervaldatum. Binnen een paar seconden staat alles in je overzicht — zonder iets over te typen.",
          en: "Open the camera in PayWatch and take a photo of your bill or letter. PayWatch automatically detects the amount, sender, invoice number, and due date. Within seconds everything is in your overview — no retyping needed.",
        },
        imageKey: "feature-camera-scanner-1",
      },
      {
        heading: { nl: "QR-code herkenning", en: "QR code recognition" },
        text: {
          nl: "Steeds meer Nederlandse bedrijven plaatsen een QR-code op hun facturen. PayWatch leest deze code direct uit en haalt alle betalingsinformatie op — inclusief het IBAN, het bedrag en de betalingskenmerk. Eén scan en je kunt direct betalen.",
          en: "More and more Dutch companies include a QR code on their invoices. PayWatch reads this code instantly and pulls all payment information — including IBAN, amount, and payment reference. One scan and you can pay immediately.",
        },
        imageKey: "feature-camera-scanner-2",
      },
      {
        heading: { nl: "Bewaar je post als bewijs", en: "Keep your mail as proof" },
        text: {
          nl: "De foto die je maakt wordt opgeslagen bij de rekening als bewijs. Handig als je later moet aantonen dat je een brief hebt ontvangen, of als je een betalingsregeling wilt treffen. Alles veilig op één plek.",
          en: "The photo you take is saved with the bill as proof. Useful if you later need to prove you received a letter, or if you want to set up a payment plan. Everything safely in one place.",
        },
        imageKey: "feature-camera-scanner-3",
      },
    ],
    relatedSlugs: ["email-scanner", "betaalfases", "betalingen"],
  },

  /* ── 3. Betaalfases & Meldingen ── */
  {
    slug: "betaalfases",
    icon: "📊",
    overview: {
      title: { nl: "Betaalfases & meldingen", en: "Payment stages & alerts" },
      desc: {
        nl: "Zie direct in welke fase je rekening zit — van factuur tot deurwaarder. Ontvang meldingen voordat deadlines verlopen.",
        en: "See exactly what stage your bill is at — from invoice to bailiff. Get alerts before deadlines pass.",
      },
    },
    hero: {
      title: {
        nl: "Weet altijd waar je staat",
        en: "Always know where you stand",
      },
      subtitle: {
        nl: "Elke rekening doorloopt fases. PayWatch laat je precies zien waar je zit — en waarschuwt je op tijd.",
        en: "Every bill goes through stages. PayWatch shows you exactly where you are — and warns you in time.",
      },
    },
    sections: [
      {
        heading: { nl: "De 5 escalatiefases", en: "The 5 escalation stages" },
        text: {
          nl: "In Nederland doorloopt een onbetaalde rekening vijf fases: factuur, herinnering, aanmaning, incasso en deurwaarder. Bij elke stap komen er kosten bij — soms honderden euro's. PayWatch herkent automatisch in welke fase je rekening zit en toont dit met een duidelijke tijdlijn.",
          en: "In the Netherlands, an unpaid bill goes through five stages: invoice, reminder, formal notice, collection, and bailiff. Each step adds costs — sometimes hundreds of euros. PayWatch automatically detects what stage your bill is at and shows it on a clear timeline.",
        },
        imageKey: "feature-betaalfases-1",
      },
      {
        heading: { nl: "Meldingen die ertoe doen", en: "Alerts that matter" },
        text: {
          nl: "Je ontvangt een melding wanneer een deadline nadert of wanneer een rekening naar een volgende fase dreigt te gaan. Geen spam, geen onnodige berichten — alleen wat je moet weten om op tijd te handelen. Zo voorkom je extra kosten zonder er elke dag aan te hoeven denken.",
          en: "You receive an alert when a deadline approaches or when a bill is about to move to the next stage. No spam, no unnecessary messages — just what you need to know to act on time. This way you avoid extra costs without having to think about it every day.",
        },
        imageKey: "feature-betaalfases-2",
      },
      {
        heading: { nl: "Inzicht in extra kosten", en: "Insight into extra costs" },
        text: {
          nl: "Bij elke fase laat PayWatch zien hoeveel extra kosten erbij komen als je niet op tijd handelt. Zo weet je precies wat het je kost om te wachten — en hoeveel je bespaart door nú te betalen. Concrete bedragen, geen vage waarschuwingen.",
          en: "For each stage, PayWatch shows how much extra costs are added if you don't act on time. You know exactly what waiting costs you — and how much you save by paying now. Real amounts, no vague warnings.",
        },
        imageKey: "feature-betaalfases-3",
      },
    ],
    relatedSlugs: ["betalingen", "conceptbrieven", "agenda"],
  },

  /* ── 4. Betalingen & Betalingsregeling ── */
  {
    slug: "betalingen",
    icon: "💳",
    overview: {
      title: { nl: "Betalingen & betalingsregeling", en: "Payments & payment plans" },
      desc: {
        nl: "Houd je betalingen bij, stel een betalingsregeling in met deadlines en bewaar je bewijzen.",
        en: "Track your payments, set up payment plans with deadlines, and store your proof.",
      },
    },
    hero: {
      title: {
        nl: "Betalen en regelen, op één plek",
        en: "Pay and plan, all in one place",
      },
      subtitle: {
        nl: "Of je nu direct betaalt of een regeling treft — PayWatch houdt alles bij en herinnert je aan elke deadline.",
        en: "Whether you pay right away or set up a plan — PayWatch tracks everything and reminds you of every deadline.",
      },
    },
    sections: [
      {
        heading: { nl: "Betalingen bijhouden", en: "Track payments" },
        text: {
          nl: "Markeer rekeningen als betaald en houd bij wat er nog openstaat. PayWatch toont een helder overzicht van je openstaande, betaalde en achterstallige rekeningen. Upload een screenshot of foto als betaalbewijs — zo heb je altijd iets om op terug te vallen.",
          en: "Mark bills as paid and track what's still outstanding. PayWatch shows a clear overview of your open, paid, and overdue bills. Upload a screenshot or photo as proof of payment — so you always have something to fall back on.",
        },
        imageKey: "feature-betalingen-1",
      },
      {
        heading: { nl: "Betalingsregeling instellen", en: "Set up a payment plan" },
        text: {
          nl: "Kun je niet alles in één keer betalen? Stel een betalingsregeling in met je eigen schema. Voeg termijnen toe, stel deadlines in en houd bij welke termijnen je al hebt betaald. PayWatch herinnert je aan elke volgende betaling, zodat je de regeling niet mist.",
          en: "Can't pay everything at once? Set up a payment plan on your own schedule. Add installments, set deadlines, and track which ones you've already paid. PayWatch reminds you of each upcoming payment, so you don't miss the plan.",
        },
        imageKey: "feature-betalingen-2",
      },
      {
        heading: { nl: "Bewijs opslaan met foto", en: "Save proof with a photo" },
        text: {
          nl: "Bij elke betaling of termijn kun je een foto of screenshot uploaden als bewijs. Handig bij een geschil met een incassobureau, of als je wilt aantonen dat je je aan een regeling houdt. Alles wordt veilig opgeslagen bij de rekening.",
          en: "With every payment or installment you can upload a photo or screenshot as proof. Useful in a dispute with a collection agency, or if you want to prove you're sticking to a plan. Everything is safely stored with the bill.",
        },
        imageKey: "feature-betalingen-3",
      },
    ],
    relatedSlugs: ["betaalfases", "cashflow", "agenda"],
  },

  /* ── 5. Community ── */
  {
    slug: "community",
    icon: "👥",
    overview: {
      title: { nl: "Community", en: "Community" },
      desc: {
        nl: "Deel ervaringen, stel vragen en steun anderen — anoniem en zonder schaamte.",
        en: "Share experiences, ask questions, and support others — anonymous and stigma-free.",
      },
    },
    hero: {
      title: {
        nl: "Je staat er niet alleen voor",
        en: "You're not in this alone",
      },
      subtitle: {
        nl: "Praat met anderen die hetzelfde meemaken. Anoniem, veilig, en zonder oordeel.",
        en: "Talk to others going through the same thing. Anonymous, safe, and judgment-free.",
      },
    },
    sections: [
      {
        heading: { nl: "Een plek zonder schaamte", en: "A place without shame" },
        text: {
          nl: "Schulden zijn nog steeds een taboe. In de PayWatch community kun je open praten over je situatie — zonder dat iemand weet wie je bent. Deel je verhaal, stel een vraag, of lees hoe anderen het aanpakken. Soms helpt het al om te weten dat je niet de enige bent.",
          en: "Debt is still taboo. In the PayWatch community you can talk openly about your situation — without anyone knowing who you are. Share your story, ask a question, or read how others are handling it. Sometimes just knowing you're not alone already helps.",
        },
        imageKey: "feature-community-1",
      },
      {
        heading: { nl: "Tips van mensen die het begrijpen", en: "Tips from people who get it" },
        text: {
          nl: "Niemand begrijpt je situatie beter dan iemand die hetzelfde heeft meegemaakt. In de community delen gebruikers praktische tips: hoe je een betalingsregeling aanvraagt, wat je rechten zijn bij een incassobureau, of welke hulporganisatie écht geholpen heeft. Ervaringen uit de praktijk, geen theorie.",
          en: "Nobody understands your situation better than someone who's been through the same thing. In the community, users share practical tips: how to request a payment plan, what your rights are with a collection agency, or which support organization actually helped. Real-world experiences, not theory.",
        },
        imageKey: "feature-community-2",
      },
      {
        heading: { nl: "Veilig en gemodereerd", en: "Safe and moderated" },
        text: {
          nl: "De community wordt actief gemodereerd om een respectvolle en veilige omgeving te garanderen. Geen reclame, geen oordeel, geen persoonlijke aanvallen. Alleen mensen die elkaar helpen om uit een lastige situatie te komen.",
          en: "The community is actively moderated to ensure a respectful and safe environment. No ads, no judgment, no personal attacks. Just people helping each other get through a tough situation.",
        },
        imageKey: "feature-community-3",
      },
    ],
    relatedSlugs: ["buddy", "hulpverleners"],
  },

  /* ── 6. Buddy Systeem ── */
  {
    slug: "buddy",
    icon: "🤝",
    overview: {
      title: { nl: "Buddy systeem", en: "Buddy system" },
      desc: {
        nl: "Voeg een vertrouwenspersoon toe die met je meekijkt. Samen lukt het beter.",
        en: "Add a trusted person who keeps an eye on things with you. Together it's easier.",
      },
    },
    hero: {
      title: {
        nl: "Samen sta je sterker",
        en: "Stronger together",
      },
      subtitle: {
        nl: "Voeg een vriend, familielid of hulpverlener toe als buddy. Zij zien je voortgang en kunnen je helpen wanneer het nodig is.",
        en: "Add a friend, family member, or counselor as your buddy. They see your progress and can help when needed.",
      },
    },
    sections: [
      {
        heading: { nl: "Waarom een buddy?", en: "Why a buddy?" },
        text: {
          nl: "Schulden zijn zwaar — zeker als je er alleen mee zit. Onderzoek laat zien dat mensen die hun financiën delen met iemand die ze vertrouwen, sneller grip krijgen op hun situatie. Een buddy hoeft niet alles te weten, maar kan je net dat duwtje in de rug geven wanneer je het nodig hebt.",
          en: "Debt is heavy — especially when you're dealing with it alone. Research shows that people who share their finances with someone they trust get back in control faster. A buddy doesn't need to know everything, but can give you that nudge when you need it.",
        },
        imageKey: "feature-buddy-1",
      },
      {
        heading: { nl: "Hoe het werkt", en: "How it works" },
        text: {
          nl: "Nodig iemand uit via een e-mail. Jouw buddy maakt een eigen account aan en ziet een vereenvoudigd overzicht van je rekeningen en voortgang — zonder bedragen of persoonlijke details die je niet wilt delen. Je houdt altijd zelf de controle over wat zichtbaar is.",
          en: "Invite someone via email. Your buddy creates their own account and sees a simplified overview of your bills and progress — without amounts or personal details you don't want to share. You always stay in control of what's visible.",
        },
        imageKey: "feature-buddy-2",
      },
      {
        heading: { nl: "Voor iedereen die helpt", en: "For anyone who helps" },
        text: {
          nl: "Een buddy kan een partner zijn, een ouder, een vriend, of een schuldhulpverlener. Het systeem is zo ontworpen dat het werkt voor informele steun — maar ook voor professionele begeleiding. Zo overbruggen we de kloof tussen schaamte en hulp vragen.",
          en: "A buddy can be a partner, a parent, a friend, or a debt counselor. The system is designed to work for informal support — but also for professional guidance. This is how we bridge the gap between shame and asking for help.",
        },
        imageKey: "feature-buddy-3",
      },
    ],
    relatedSlugs: ["community", "hulpverleners", "betaalfases"],
  },

  /* ── 7. Conceptbrieven ── */
  {
    slug: "conceptbrieven",
    icon: "✉️",
    overview: {
      title: { nl: "Conceptbrieven", en: "Draft letters" },
      desc: {
        nl: "Moet je reageren op een incassobrief? PayWatch schrijft een bezwaar of betalingsvoorstel voor je.",
        en: "Need to respond to a collection letter? PayWatch drafts an objection or payment proposal for you.",
      },
    },
    hero: {
      title: {
        nl: "De juiste woorden, op het juiste moment",
        en: "The right words, at the right time",
      },
      subtitle: {
        nl: "Reageren op een aanmaning of incassobrief is stressvol. PayWatch helpt je met een professionele brief — je hoeft alleen nog op verzenden te klikken.",
        en: "Responding to a formal notice or collection letter is stressful. PayWatch helps you with a professional letter — you just need to hit send.",
      },
    },
    sections: [
      {
        heading: { nl: "Persoonlijk en professioneel", en: "Personal and professional" },
        text: {
          nl: "PayWatch stelt een conceptbrief op die past bij jouw situatie. Of je nu bezwaar wilt maken tegen een onterechte rekening, een betalingsregeling wilt voorstellen, of om uitstel wilt vragen — de brief is geschreven in correct, professioneel Nederlands en afgestemd op jouw specifieke rekening.",
          en: "PayWatch drafts a letter that fits your situation. Whether you want to dispute an unfair charge, propose a payment plan, or request a deadline extension — the letter is written in correct, professional Dutch and tailored to your specific bill.",
        },
        imageKey: "feature-conceptbrieven-1",
      },
      {
        heading: { nl: "Gebaseerd op jouw rechten", en: "Based on your rights" },
        text: {
          nl: "In Nederland heb je als consument rechten bij incasso. De Wet Incassokosten (WIK) bepaalt hoeveel een incassobureau mag rekenen. PayWatch houdt hier rekening mee en verwijst in de brief naar de juiste wetsartikelen. Zo sta je sterker in je communicatie.",
          en: "In the Netherlands, you have consumer rights when it comes to collections. The WIK law determines how much a collection agency can charge. PayWatch takes this into account and references the right legal articles. So you stand stronger in your communication.",
        },
        imageKey: "feature-conceptbrieven-2",
      },
    ],
    relatedSlugs: ["betaalfases", "betalingen", "hulpverleners"],
  },

  /* ── 8. Cashflow ── */
  {
    slug: "cashflow",
    icon: "📈",
    overview: {
      title: { nl: "Cashflow overzicht", en: "Cashflow overview" },
      desc: {
        nl: "Zie per week wat er binnenkomt en uitgaat. Plan vooruit en voorkom verrassingen.",
        en: "See per week what's coming in and going out. Plan ahead and avoid surprises.",
      },
    },
    hero: {
      title: {
        nl: "Weet wat er komt",
        en: "Know what's coming",
      },
      subtitle: {
        nl: "Een helder weekoverzicht van je inkomsten en uitgaven. Zodat je nooit voor verrassingen staat.",
        en: "A clear weekly overview of your income and expenses. So you're never caught off guard.",
      },
    },
    sections: [
      {
        heading: { nl: "Alles op een tijdlijn", en: "Everything on a timeline" },
        text: {
          nl: "PayWatch plaatst je openstaande rekeningen, verwachte betalingen en inkomsten op een overzichtelijke tijdlijn. Je ziet in één oogopslag of je volgende week genoeg hebt om alles te betalen — of dat je actie moet ondernemen.",
          en: "PayWatch places your outstanding bills, expected payments, and income on a clear timeline. At a glance you see whether you'll have enough next week to cover everything — or whether you need to take action.",
        },
        imageKey: "feature-cashflow-1",
      },
      {
        heading: { nl: "Grafieken die je begrijpt", en: "Charts you actually understand" },
        text: {
          nl: "Geen ingewikkelde tabellen of financieel jargon. PayWatch toont je cashflow met eenvoudige grafieken: groen als je positief zit, rood als het krap wordt. Zo heb je direct een gevoel bij je financiële situatie, zonder spreadsheets.",
          en: "No complicated tables or financial jargon. PayWatch shows your cashflow with simple charts: green when you're positive, red when it gets tight. You immediately get a feel for your financial situation, without spreadsheets.",
        },
        imageKey: "feature-cashflow-2",
      },
    ],
    relatedSlugs: ["maandbudget", "betalingen", "inzichten"],
  },

  /* ── 9. Hulpverleners ── */
  {
    slug: "hulpverleners",
    icon: "🏛️",
    overview: {
      title: { nl: "Hulpverleners", en: "Support organizations" },
      desc: {
        nl: "Vind schuldhulp, juridisch advies en hulporganisaties in jouw gemeente. Afgestemd op je locatie.",
        en: "Find debt counseling, legal advice, and aid organizations in your area. Tailored to your location.",
      },
    },
    hero: {
      title: {
        nl: "Hulp in jouw buurt",
        en: "Help in your area",
      },
      subtitle: {
        nl: "Soms heb je professionele hulp nodig. PayWatch laat je zien welke organisaties er in jouw gemeente zijn — met één klik bereikbaar.",
        en: "Sometimes you need professional help. PayWatch shows you which organizations are available in your area — reachable with one click.",
      },
    },
    sections: [
      {
        heading: { nl: "Afgestemd op jouw locatie", en: "Tailored to your location" },
        text: {
          nl: "Op basis van je profiel toont PayWatch hulporganisaties in jouw regio. Van het Juridisch Loket tot SchuldHulpMaatje, van Sociaal Raadslieden tot je gemeentelijke schuldhulpverlening. Je hoeft niet zelf te zoeken — wij brengen de hulp naar jou.",
          en: "Based on your profile, PayWatch shows support organizations in your area. From the Legal Desk to SchuldHulpMaatje, from Social Counselors to your local municipal debt assistance. You don't need to search — we bring the help to you.",
        },
        imageKey: "feature-hulpverleners-1",
      },
      {
        heading: { nl: "Categorieën en contactgegevens", en: "Categories and contact details" },
        text: {
          nl: "Elke organisatie is ingedeeld in een categorie: schuldhulp, juridisch advies of financieel advies. Je ziet direct telefoonnummers, websites en openingstijden. Geen eindeloos googelen — gewoon de informatie die je nodig hebt.",
          en: "Each organization is categorized: debt help, legal advice, or financial advice. You immediately see phone numbers, websites, and opening hours. No endless googling — just the information you need.",
        },
        imageKey: "feature-hulpverleners-2",
      },
    ],
    relatedSlugs: ["buddy", "community", "conceptbrieven"],
  },

  /* ── 10. Agenda ── */
  {
    slug: "agenda",
    icon: "📅",
    overview: {
      title: { nl: "Agenda", en: "Agenda" },
      desc: {
        nl: "Alle vervaldatums in één overzicht. Mis nooit meer een deadline.",
        en: "All due dates in one overview. Never miss a deadline again.",
      },
    },
    hero: {
      title: {
        nl: "Eén plek voor al je deadlines",
        en: "One place for all your deadlines",
      },
      subtitle: {
        nl: "Zie in één oogopslag welke rekeningen wanneer betaald moeten worden. Overzichtelijk, per week, per maand.",
        en: "See at a glance which bills need to be paid and when. Organized by week, by month.",
      },
    },
    sections: [
      {
        heading: { nl: "Nooit meer een deadline missen", en: "Never miss a deadline again" },
        text: {
          nl: "PayWatch verzamelt alle vervaldatums van je rekeningen en betalingsregelingen in één agenda. Je ziet per dag en per week wat eraan komt, zodat je op tijd kunt handelen. Gecombineerd met meldingen weet je altijd waar je aan toe bent.",
          en: "PayWatch collects all due dates from your bills and payment plans into one agenda. You see per day and per week what's coming up, so you can act on time. Combined with alerts, you always know where things stand.",
        },
        imageKey: "feature-agenda-1",
      },
      {
        heading: { nl: "Overzicht per maand", en: "Monthly overview" },
        text: {
          nl: "In het maandoverzicht zie je hoeveel rekeningen er open staan, welke bedragen eraan komen, en of er piekweken zijn waar extra aandacht nodig is. Zo plan je vooruit en voorkom je dat alles tegelijk komt.",
          en: "In the monthly overview you see how many bills are open, what amounts are coming up, and whether there are peak weeks that need extra attention. Plan ahead and prevent everything from hitting at once.",
        },
        imageKey: "feature-agenda-2",
      },
    ],
    relatedSlugs: ["betaalfases", "betalingen", "cashflow"],
  },

  /* ── 11. Schuldvrij Countdown ── */
  {
    slug: "schuldvrij-countdown",
    icon: "🎯",
    overview: {
      title: { nl: "Schuldvrij countdown", en: "Debt-free countdown" },
      desc: {
        nl: "Houd bij hoe dicht je bij je doel bent. Elke betaling telt.",
        en: "Track how close you are to your goal. Every payment counts.",
      },
    },
    hero: {
      title: {
        nl: "Aftellen naar schuldvrij",
        en: "Counting down to debt-free",
      },
      subtitle: {
        nl: "Een visuele countdown die laat zien hoever je bent. Motiverend, concreet, en helemaal van jou.",
        en: "A visual countdown that shows your progress. Motivating, concrete, and all yours.",
      },
    },
    sections: [
      {
        heading: { nl: "Zie je voortgang", en: "See your progress" },
        text: {
          nl: "De schuldvrij countdown toont hoeveel je al hebt afgelost en hoeveel er nog resteert. Met een duidelijke voortgangsbalk en een geschatte einddatum. Elke betaling die je doet, brengt de balk dichter bij 100%. Dat is motiverend — want je ziet dat het werkt.",
          en: "The debt-free countdown shows how much you've paid off and how much remains. With a clear progress bar and estimated completion date. Every payment you make brings the bar closer to 100%. That's motivating — because you can see it's working.",
        },
        imageKey: "feature-schuldvrij-1",
      },
      {
        heading: { nl: "Mijlpalen en beloningen", en: "Milestones and rewards" },
        text: {
          nl: "Bij elke mijlpaal — 25%, 50%, 75% — ontvang je een melding. Kleine momenten om te vieren, ook als de weg lang is. Want schuldvrij worden is niet alleen een financieel doel, het is ook een mentaal proces. PayWatch helpt je om gemotiveerd te blijven.",
          en: "At every milestone — 25%, 50%, 75% — you receive a notification. Small moments to celebrate, even when the road is long. Because becoming debt-free isn't just a financial goal, it's also a mental journey. PayWatch helps you stay motivated.",
        },
        imageKey: "feature-schuldvrij-2",
      },
    ],
    relatedSlugs: ["inzichten", "cashflow", "betalingen"],
  },

  /* ── 12. Persoonlijke Inzichten ── */
  {
    slug: "inzichten",
    icon: "💡",
    overview: {
      title: { nl: "Persoonlijke inzichten", en: "Personal insights" },
      desc: {
        nl: "Tips en adviezen afgestemd op jouw situatie. Praktisch, relevant en op het juiste moment.",
        en: "Tips and advice tailored to your situation. Practical, relevant, and at the right time.",
      },
    },
    hero: {
      title: {
        nl: "Advies dat bij jou past",
        en: "Advice that fits you",
      },
      subtitle: {
        nl: "Geen standaard tips, maar inzichten gebaseerd op jouw rekeningen, betaalgedrag en situatie.",
        en: "No generic tips, but insights based on your bills, payment behavior, and situation.",
      },
    },
    sections: [
      {
        heading: { nl: "Op basis van jouw situatie", en: "Based on your situation" },
        text: {
          nl: "PayWatch analyseert je rekeningen en betaalpatronen en geeft je concrete suggesties. Als je bijvoorbeeld steeds dezelfde rekening te laat betaalt, stellen we een automatische herinnering voor. Of als je in aanmerking komt voor kwijtschelding, laten we het je weten.",
          en: "PayWatch analyzes your bills and payment patterns and gives you concrete suggestions. For example, if you're consistently late on the same bill, we suggest an automatic reminder. Or if you may qualify for a debt write-off, we let you know.",
        },
        imageKey: "feature-inzichten-1",
      },
      {
        heading: { nl: "Financiële gezondheidsscore", en: "Financial health score" },
        text: {
          nl: "Een persoonlijke score van 0 tot 100 die laat zien hoe goed je bezig bent. Gebaseerd op je betaalgedrag, het aantal openstaande rekeningen, escalatiefases en hoe consistent je bent. De score gaat omhoog als je vooruitgang boekt — en geeft je een realistisch beeld van waar je staat.",
          en: "A personal score from 0 to 100 that shows how well you're doing. Based on your payment behavior, number of outstanding bills, escalation stages, and how consistent you are. The score goes up as you make progress — giving you a realistic picture of where you stand.",
        },
        imageKey: "feature-inzichten-2",
      },
    ],
    relatedSlugs: ["schuldvrij-countdown", "cashflow", "maandbudget"],
  },

  /* ── 13. Maandbudget ── */
  {
    slug: "maandbudget",
    icon: "🧮",
    overview: {
      title: { nl: "Maandbudget", en: "Monthly budget" },
      desc: {
        nl: "Stel je maandbudget in en houd bij of je op koers ligt. Simpel en overzichtelijk.",
        en: "Set your monthly budget and track whether you're on target. Simple and clear.",
      },
    },
    hero: {
      title: {
        nl: "Grip op je maandbudget",
        en: "Control your monthly budget",
      },
      subtitle: {
        nl: "Weet hoeveel je kunt uitgeven en houd bij of je binnen je budget blijft.",
        en: "Know how much you can spend and track whether you stay within your budget.",
      },
    },
    sections: [
      {
        heading: { nl: "Stel je budget in", en: "Set your budget" },
        text: {
          nl: "Voer je maandelijkse inkomsten in en PayWatch helpt je een realistisch budget op te stellen. Verdeel je geld over vaste lasten, rekeningen, en wat er overblijft voor dagelijkse uitgaven. Geen ingewikkelde categorieën — gewoon een helder overzicht.",
          en: "Enter your monthly income and PayWatch helps you create a realistic budget. Divide your money between fixed expenses, bills, and what's left for daily spending. No complicated categories — just a clear overview.",
        },
        imageKey: "feature-maandbudget-1",
      },
      {
        heading: { nl: "Houd bij of je op koers ligt", en: "Track whether you're on target" },
        text: {
          nl: "Gedurende de maand laat PayWatch zien hoeveel je al hebt uitgegeven en hoeveel er nog over is. Als je budget krap wordt, ontvang je een melding. Zo houd je controle zonder elke dag in een spreadsheet te hoeven kijken.",
          en: "Throughout the month, PayWatch shows how much you've spent and how much is left. If your budget gets tight, you receive an alert. This way you stay in control without having to check a spreadsheet every day.",
        },
        imageKey: "feature-maandbudget-2",
      },
    ],
    relatedSlugs: ["cashflow", "inzichten", "betalingen"],
  },
];

/* Helper: get feature by slug */
export function getFeatureBySlug(slug: string): FeaturePageData | undefined {
  return featurePages.find((f) => f.slug === slug);
}

/* Helper: get all slugs for static generation */
export function getAllFeatureSlugs(): string[] {
  return featurePages.map((f) => f.slug);
}
