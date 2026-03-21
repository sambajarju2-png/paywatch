/* ─── PayWatch Blog Content ─── */
/* Full blog posts with SEO-optimized content */
/* Replace with Sanity CMS content later (Step 7) */

export interface BlogPostFull {
  slug: string;
  title: { nl: string; en: string };
  metaDescription: { nl: string; en: string };
  excerpt: { nl: string; en: string };
  category: { nl: string; en: string };
  categorySlug: string;
  date: string;
  readTime: string;
  author: string;
  keywords: string[];
  sections: { heading: { nl: string; en: string }; body: { nl: string; en: string } }[];
}

export const blogCategories = [
  { slug: "all", label: { nl: "Alles", en: "All" } },
  { slug: "educatie", label: { nl: "Educatie", en: "Education" } },
  { slug: "tips", label: { nl: "Tips", en: "Tips" } },
  { slug: "hulp", label: { nl: "Hulp", en: "Help" } },
  { slug: "product", label: { nl: "Product", en: "Product" } },
];

export const blogPostsFull: BlogPostFull[] = [
  {
    slug: "wat-is-escalatie",
    title: {
      nl: "Wat is escalatie? De 5 fases van een onbetaalde rekening",
      en: "What is escalation? The 5 stages of an unpaid bill",
    },
    metaDescription: {
      nl: "Begrijp de 5 escalatiefases van een onbetaalde rekening in Nederland: factuur, herinnering, aanmaning, incasso en deurwaarder. Weet wat je kunt doen per fase.",
      en: "Understand the 5 escalation stages of an unpaid bill in the Netherlands: invoice, reminder, formal notice, collection and bailiff. Know what to do at each stage.",
    },
    excerpt: {
      nl: "Van factuur tot deurwaarder: begrijp elke fase en weet wat je kunt doen om extra kosten te voorkomen.",
      en: "From invoice to bailiff: understand each stage and know what you can do to avoid extra costs.",
    },
    category: { nl: "Educatie", en: "Education" },
    categorySlug: "educatie",
    date: "2026-03-15",
    readTime: "5 min",
    author: "Samba",
    keywords: ["escalatie", "incasso", "aanmaning", "deurwaarder", "onbetaalde rekening", "schulden", "escalation stages"],
    sections: [
      {
        heading: { nl: "Waarom escalatie begrijpen belangrijk is", en: "Why understanding escalation matters" },
        body: {
          nl: "Elke onbetaalde rekening in Nederland doorloopt een vaste reeks stappen. Hoe verder de rekening escaleert, hoe duurder het wordt. Het verschil tussen een factuur en een deurwaarder kan honderden euro's zijn — geld dat je kunt besparen als je op tijd handelt. Veel mensen weten niet in welke fase hun rekening zit, of wat de gevolgen zijn van elke stap. Dat is precies waarom PayWatch bestaat.",
          en: "Every unpaid bill in the Netherlands goes through a fixed series of steps. The further a bill escalates, the more expensive it gets. The difference between an invoice and a bailiff can be hundreds of euros — money you can save by acting on time. Many people don't know what stage their bill is at, or what the consequences of each step are. That's exactly why PayWatch exists.",
        },
      },
      {
        heading: { nl: "Fase 1: Factuur (€ 0 extra)", en: "Stage 1: Invoice (€ 0 extra)" },
        body: {
          nl: "De eerste stap is simpel: je ontvangt een factuur. Dit is een normaal verzoek om te betalen, meestal met een betaaltermijn van 14 tot 30 dagen. Er zijn geen extra kosten. Dit is het beste moment om te betalen. Tip: stel een herinnering in of gebruik PayWatch om je vervaldatum te bewaken.",
          en: "The first step is simple: you receive an invoice. This is a normal payment request, usually with a payment term of 14 to 30 days. There are no extra costs. This is the best time to pay. Tip: set a reminder or use PayWatch to monitor your due date.",
        },
      },
      {
        heading: { nl: "Fase 2: Herinnering (+€ 15 gemiddeld)", en: "Stage 2: Reminder (+€ 15 average)" },
        body: {
          nl: "Als je de factuur niet op tijd betaalt, ontvang je een herinnering. Dit is nog een vriendelijk verzoek, maar bedrijven mogen nu administratiekosten in rekening brengen — gemiddeld zo'n € 15. Sommige bedrijven sturen meerdere herinneringen, andere gaan direct naar de volgende fase. Betaal je in deze fase? Dan beperk je de schade.",
          en: "If you don't pay the invoice on time, you'll receive a reminder. This is still a friendly request, but companies can now charge administration costs — around € 15 on average. Some companies send multiple reminders, others go straight to the next stage. Pay at this stage? You limit the damage.",
        },
      },
      {
        heading: { nl: "Fase 3: Aanmaning (+€ 40 gemiddeld)", en: "Stage 3: Formal notice (+€ 40 average)" },
        body: {
          nl: "Een aanmaning is een officiële ingebrekestelling. Het bedrijf geeft je nog een laatste kans om te betalen, maar de toon is nu serieuzer. De extra kosten lopen op — gemiddeld zo'n € 40 bovenop het oorspronkelijke bedrag. Na een aanmaning mag het bedrijf de vordering overdragen aan een incassobureau. Dit is het kantelpunt.",
          en: "A formal notice (aanmaning) is an official default notice. The company gives you one last chance to pay, but the tone is now more serious. Extra costs add up — around € 40 on average on top of the original amount. After a formal notice, the company may transfer the claim to a collection agency. This is the tipping point.",
        },
      },
      {
        heading: { nl: "Fase 4: Incasso (+€ 140 gemiddeld)", en: "Stage 4: Collection (+€ 140 average)" },
        body: {
          nl: "Bij incasso is de rekening overgedragen aan een incassobureau. De kosten stijgen flink: gemiddeld € 140 extra, maar dit kan oplopen tot 15% van het oorspronkelijke bedrag. Het incassobureau neemt contact op via brieven, telefoon of e-mail. Je hebt nog steeds rechten — je mag de vordering betwisten als je het er niet mee eens bent. PayWatch kan je helpen met een conceptbrief.",
          en: "At the collection stage, the bill has been transferred to a collection agency. Costs rise significantly: on average € 140 extra, but this can go up to 15% of the original amount. The collection agency contacts you via letters, phone or email. You still have rights — you may dispute the claim if you disagree. PayWatch can help you with a draft letter.",
        },
      },
      {
        heading: { nl: "Fase 5: Deurwaarder (+€ 300+ gemiddeld)", en: "Stage 5: Bailiff (+€ 300+ average)" },
        body: {
          nl: "De laatste fase: een deurwaarder. Dit is een gerechtelijk traject. De kosten kunnen oplopen tot € 300 of meer bovenop het oorspronkelijke bedrag — plus griffierechten en proceskosten. Een deurwaarder mag beslag leggen op je inkomen of bezittingen. Het is cruciaal om juridisch advies in te winnen als je in deze fase terechtkomt. Via PayWatch vind je gratis juridische hulp in jouw gemeente.",
          en: "The final stage: a bailiff. This is a judicial process. Costs can rise to € 300 or more on top of the original amount — plus court fees and legal costs. A bailiff may seize your income or assets. It's crucial to seek legal advice if you reach this stage. Through PayWatch you can find free legal help in your municipality.",
        },
      },
      {
        heading: { nl: "Wat kun je doen?", en: "What can you do?" },
        body: {
          nl: "Het belangrijkste: weet in welke fase je rekeningen zitten. PayWatch scant je e-mail en toont automatisch de escalatiefase van elke rekening. Zo weet je altijd waar je staat en kun je handelen voordat het duurder wordt. Je hebt dit onder controle.",
          en: "The most important thing: know what stage your bills are at. PayWatch scans your email and automatically shows the escalation stage of each bill. This way you always know where you stand and can act before it gets more expensive. You've got this.",
        },
      },
    ],
  },
  {
    slug: "besparen-op-incassokosten",
    title: {
      nl: "Zo bespaar je honderden euro's aan incassokosten",
      en: "How to save hundreds of euros in collection costs",
    },
    metaDescription: {
      nl: "Praktische tips om incassokosten te voorkomen. Leer hoe je rekeningen op tijd betaalt, betalingsregelingen treft en je rechten kent bij incasso.",
      en: "Practical tips to avoid collection costs. Learn how to pay bills on time, arrange payment plans and know your rights with collections.",
    },
    excerpt: {
      nl: "Praktische tips om je rekeningen op tijd te betalen en onnodige kosten te vermijden.",
      en: "Practical tips to pay your bills on time and avoid unnecessary costs.",
    },
    category: { nl: "Tips", en: "Tips" },
    categorySlug: "tips",
    date: "2026-03-10",
    readTime: "4 min",
    author: "Mariama",
    keywords: ["incassokosten besparen", "rekeningen betalen", "betalingsregeling", "schulden voorkomen", "save collection costs"],
    sections: [
      {
        heading: { nl: "Waarom incassokosten zo snel oplopen", en: "Why collection costs add up so quickly" },
        body: {
          nl: "Een factuur van € 50 kan door escalatie oplopen tot meer dan € 200. Dat klinkt oneerlijk — en in sommige gevallen is het dat ook. Maar het Nederlandse systeem staat bedrijven toe om kosten door te berekenen bij elke escalatiestap. De WIK (Wet Incassokosten) bepaalt welke kosten maximaal in rekening mogen worden gebracht, maar veel mensen weten niet dat er grenzen zijn.",
          en: "An invoice of € 50 can escalate to more than € 200 through escalation. That sounds unfair — and in some cases it is. But the Dutch system allows companies to pass on costs at each escalation step. The WIK (Collection Costs Act) determines the maximum costs that can be charged, but many people don't know there are limits.",
        },
      },
      {
        heading: { nl: "Tip 1: Stel automatische herinneringen in", en: "Tip 1: Set automatic reminders" },
        body: {
          nl: "De meeste onbetaalde rekeningen zijn geen onwil — het is vergeten. Gebruik PayWatch om automatisch je vervaldatums te bewaken. Je krijgt een melding voordat een rekening escaleert. Zo voorkom je de eerste extra kosten zonder dat je er zelf aan hoeft te denken.",
          en: "Most unpaid bills aren't about unwillingness — they're forgotten. Use PayWatch to automatically monitor your due dates. You'll get a notification before a bill escalates. This prevents the first extra costs without having to think about it yourself.",
        },
      },
      {
        heading: { nl: "Tip 2: Vraag een betalingsregeling", en: "Tip 2: Ask for a payment plan" },
        body: {
          nl: "Kun je een rekening niet in één keer betalen? Neem dan contact op met het bedrijf en vraag om een betalingsregeling. De meeste bedrijven werken hieraan mee — het is voor hen voordeliger dan een incassoprocedure. Doe dit zo vroeg mogelijk. Hoe eerder je belt, hoe meer opties je hebt.",
          en: "Can't pay a bill in one go? Contact the company and ask for a payment plan. Most companies cooperate — it's cheaper for them than a collection procedure. Do this as early as possible. The sooner you call, the more options you have.",
        },
      },
      {
        heading: { nl: "Tip 3: Betwist onterechte kosten", en: "Tip 3: Dispute unjust costs" },
        body: {
          nl: "Je hoeft niet alles te accepteren. Als je vindt dat de incassokosten te hoog zijn, of als je het niet eens bent met de vordering, mag je bezwaar maken. PayWatch kan een conceptbrief voor je opstellen met AI. Je kunt ook gratis advies inwinnen bij het Juridisch Loket (0900-8020).",
          en: "You don't have to accept everything. If you think collection costs are too high, or if you disagree with the claim, you may object. PayWatch can draft a letter for you with AI. You can also get free advice from the Juridisch Loket (0900-8020).",
        },
      },
      {
        heading: { nl: "Tip 4: Gebruik de QR-betaalfunctie", en: "Tip 4: Use the QR payment feature" },
        body: {
          nl: "Soms is het simpelweg te ingewikkeld om een IBAN over te typen. PayWatch genereert een EPC QR-code voor je rekeningen die je direct kunt scannen met je bank-app. Het juiste bedrag, de juiste referentie — geen fouten. Betalen is nog nooit zo makkelijk geweest.",
          en: "Sometimes it's simply too complicated to retype an IBAN. PayWatch generates an EPC QR code for your bills that you can scan directly with your banking app. The right amount, the right reference — no mistakes. Paying has never been this easy.",
        },
      },
      {
        heading: { nl: "Hoeveel kun je besparen?", en: "How much can you save?" },
        body: {
          nl: "Onze gebruikers besparen gemiddeld € 760 aan incassokosten. Dat is geld dat je kunt besteden aan dingen die er echt toe doen. PayWatch is gratis in beta — je hebt niets te verliezen en alles te winnen.",
          en: "Our users save an average of € 760 in collection costs. That's money you can spend on things that actually matter. PayWatch is free in beta — you have nothing to lose and everything to gain.",
        },
      },
    ],
  },
  {
    slug: "schuldhulp-nederland",
    title: {
      nl: "Schuldhulp in Nederland: waar kun je terecht?",
      en: "Debt help in the Netherlands: where can you go?",
    },
    metaDescription: {
      nl: "Overzicht van gratis schuldhulp in Nederland. Gemeente, Juridisch Loket, SchuldHulpMaatje, Nibud en meer. Weet waar je terecht kunt bij financiële problemen.",
      en: "Overview of free debt help in the Netherlands. Municipality, Juridisch Loket, SchuldHulpMaatje, Nibud and more. Know where to go for financial problems.",
    },
    excerpt: {
      nl: "Een overzicht van gratis hulporganisaties, gemeentelijke regelingen en juridisch advies.",
      en: "An overview of free support organizations, municipal programs and legal advice.",
    },
    category: { nl: "Hulp", en: "Help" },
    categorySlug: "hulp",
    date: "2026-03-05",
    readTime: "6 min",
    author: "Samba",
    keywords: ["schuldhulp", "schuldhulpverlening", "gemeente schuldhulp", "juridisch loket", "nibud", "schulden hulp", "debt help netherlands"],
    sections: [
      {
        heading: { nl: "Je staat er niet alleen voor", en: "You're not alone" },
        body: {
          nl: "In Nederland hebben meer dan 600.000 huishoudens problematische schulden. Als je moeite hebt om je rekeningen te betalen, ben je dus zeker niet de enige. Er zijn veel organisaties die gratis hulp bieden — maar veel mensen weten niet waar ze terecht kunnen. Dit artikel geeft je een overzicht.",
          en: "In the Netherlands, more than 600,000 households have problematic debts. If you're struggling to pay your bills, you're certainly not alone. There are many organizations that offer free help — but many people don't know where to go. This article gives you an overview.",
        },
      },
      {
        heading: { nl: "Je gemeente: de eerste stap", en: "Your municipality: the first step" },
        body: {
          nl: "Elke gemeente in Nederland biedt schuldhulpverlening aan. Dit is gratis en vertrouwelijk. Je kunt je aanmelden via de website van je gemeente of binnenlopen bij het Sociaal Wijkteam. Ze helpen je met een overzicht van je schulden, betalingsregelingen en soms kwijtschelding. PayWatch is beschikbaar in 43+ gemeenten en kan je helpen om je situatie in kaart te brengen voordat je contact opneemt.",
          en: "Every municipality in the Netherlands offers debt assistance. This is free and confidential. You can register via your municipality's website or walk into the Social District Team. They help you with an overview of your debts, payment arrangements and sometimes debt relief. PayWatch is available in 43+ municipalities and can help you map out your situation before you reach out.",
        },
      },
      {
        heading: { nl: "Juridisch Loket: gratis juridisch advies", en: "Juridisch Loket: free legal advice" },
        body: {
          nl: "Het Juridisch Loket (0900-8020) biedt gratis juridisch advies. Ze kunnen je helpen als je te maken hebt met incassobureaus, deurwaarders of als je vindt dat je onterecht kosten in rekening krijgt gebracht. Je kunt bellen, mailen of langskomen op een van hun locaties. Ze geven ook advies over de WSNP (wettelijke schuldsanering).",
          en: "The Juridisch Loket (0900-8020) offers free legal advice. They can help if you're dealing with collection agencies, bailiffs, or if you think you're being unjustly charged. You can call, email or visit one of their locations. They also advise on the WSNP (statutory debt restructuring).",
        },
      },
      {
        heading: { nl: "SchuldHulpMaatje: persoonlijke begeleiding", en: "SchuldHulpMaatje: personal guidance" },
        body: {
          nl: "SchuldHulpMaatje koppelt je aan een getrainde vrijwilliger die je helpt met je financiën. Samen maak je een overzicht, bel je met schuldeisers en werk je aan een plan. Het is persoonlijk, gratis en zonder oordeel. Ze zijn actief in veel grote steden, waaronder Amsterdam, Rotterdam, Den Haag en Utrecht.",
          en: "SchuldHulpMaatje pairs you with a trained volunteer who helps you with your finances. Together you create an overview, call creditors and work on a plan. It's personal, free and without judgment. They're active in many major cities, including Amsterdam, Rotterdam, The Hague and Utrecht.",
        },
      },
      {
        heading: { nl: "Nibud: tools en tips", en: "Nibud: tools and tips" },
        body: {
          nl: "Het Nibud (Nationaal Instituut voor Budgetvoorlichting) heeft handige online tools zoals de Nibud Bufferberekenaar en huishoudboekjes. Ze publiceren ook richtlijnen voor wat je per maand kwijt zou moeten zijn aan vaste lasten. Handig om je eigen situatie te vergelijken. Bezoek nibud.nl voor meer informatie.",
          en: "Nibud (National Institute for Budget Information) has useful online tools like the Nibud Buffer Calculator and household booklets. They also publish guidelines for what you should spend per month on fixed costs. Useful to compare your own situation. Visit nibud.nl for more information.",
        },
      },
      {
        heading: { nl: "PayWatch: jouw eerste stap", en: "PayWatch: your first step" },
        body: {
          nl: "Voor je contact opneemt met een hulpverlener, is het handig om een overzicht te hebben van al je rekeningen. PayWatch doet dat voor je: het scant je inbox, herkent rekeningen en toont in welke escalatiefase ze zitten. Zo ga je het gesprek beter voorbereid in. Gratis, veilig en binnen 2 minuten klaar.",
          en: "Before you contact a support organization, it's helpful to have an overview of all your bills. PayWatch does that for you: it scans your inbox, recognizes bills and shows their escalation stage. This way you enter the conversation better prepared. Free, secure and done in 2 minutes.",
        },
      },
    ],
  },
  {
    slug: "rechten-bij-incasso",
    title: {
      nl: "Jouw rechten bij incasso: wat mag wel en wat niet?",
      en: "Your rights with collections: what's allowed and what isn't?",
    },
    metaDescription: {
      nl: "Ken je rechten bij incasso in Nederland. Welke kosten mogen incassobureaus rekenen? Wanneer mag je bezwaar maken? De WIK uitgelegd in gewone taal.",
      en: "Know your rights with collections in the Netherlands. What costs can collection agencies charge? When can you object? The WIK explained in plain language.",
    },
    excerpt: {
      nl: "Incassobureau aan de deur? Ken je rechten. We leggen de WIK uit in gewone taal.",
      en: "Collection agency at your door? Know your rights. We explain the WIK in plain language.",
    },
    category: { nl: "Educatie", en: "Education" },
    categorySlug: "educatie",
    date: "2026-02-28",
    readTime: "5 min",
    author: "Mariama",
    keywords: ["rechten incasso", "WIK", "incassokosten maximaal", "bezwaar incasso", "incassobureau rechten", "collection rights"],
    sections: [
      {
        heading: { nl: "De WIK: regels voor incassokosten", en: "The WIK: rules for collection costs" },
        body: {
          nl: "De Wet Incassokosten (WIK) bepaalt hoeveel een incassobureau maximaal aan kosten mag rekenen. Dit is afhankelijk van het oorspronkelijke bedrag. Tot € 2.500 is het maximum 15% met een minimum van € 40. Boven € 2.500 daalt het percentage. Let op: deze kosten komen bovenop het oorspronkelijke bedrag. Als je vindt dat er te veel wordt gerekend, mag je bezwaar maken.",
          en: "The Collection Costs Act (WIK) determines the maximum amount a collection agency can charge in costs. This depends on the original amount. Up to € 2,500 the maximum is 15% with a minimum of € 40. Above € 2,500 the percentage decreases. Note: these costs come on top of the original amount. If you think too much is being charged, you may object.",
        },
      },
      {
        heading: { nl: "Wanneer mag een incassobureau je benaderen?", en: "When can a collection agency contact you?" },
        body: {
          nl: "Een incassobureau mag je benaderen nadat de schuldeiser je minimaal één aanmaning heeft gestuurd met een betaaltermijn van 14 dagen. Ze mogen je bellen, mailen en brieven sturen — maar ze mogen je niet bedreigen, misleiden of onredelijk vaak contact opnemen. Als je je geïntimideerd voelt, meld dit dan bij de ACM (Autoriteit Consument & Markt).",
          en: "A collection agency may contact you after the creditor has sent you at least one formal notice with a 14-day payment term. They may call, email and send letters — but they may not threaten, mislead or contact you unreasonably often. If you feel intimidated, report this to the ACM (Authority for Consumers & Markets).",
        },
      },
      {
        heading: { nl: "Je mag altijd bezwaar maken", en: "You can always object" },
        body: {
          nl: "Als je het niet eens bent met een vordering, heb je het recht om bezwaar te maken. Dat kan schriftelijk — per brief of e-mail. Leg uit waarom je het niet eens bent en vraag om bewijs van de oorspronkelijke vordering. Het incassobureau moet dan pauzeren tot het bezwaar is behandeld. PayWatch kan met AI een bezwaarbrief voor je opstellen.",
          en: "If you disagree with a claim, you have the right to object. You can do this in writing — by letter or email. Explain why you disagree and ask for proof of the original claim. The collection agency must then pause until the objection is handled. PayWatch can draft an objection letter for you with AI.",
        },
      },
      {
        heading: { nl: "Wat als je niet kunt betalen?", en: "What if you can't pay?" },
        body: {
          nl: "Als je echt niet kunt betalen, communiceer dat dan. Neem contact op met het incassobureau en leg je situatie uit. Vraag om een betalingsregeling of verwijzing naar schuldhulpverlening. In Nederland kun je ook een beroep doen op de WSNP (Wettelijke Schuldsanering) als je schulden onbeheersbaar zijn geworden. Je gemeente kan je hierbij helpen.",
          en: "If you truly can't pay, communicate that. Contact the collection agency and explain your situation. Ask for a payment plan or referral to debt assistance. In the Netherlands you can also apply for the WSNP (Statutory Debt Restructuring) if your debts have become unmanageable. Your municipality can help you with this.",
        },
      },
    ],
  },
  {
    slug: "financiele-stress-herkennen",
    title: {
      nl: "Financiële stress herkennen (en wat je eraan kunt doen)",
      en: "Recognizing financial stress (and what you can do about it)",
    },
    metaDescription: {
      nl: "Financiële stress herkennen: signalen, gevolgen en praktische stappen. Je bent niet de enige — en er is hulp beschikbaar.",
      en: "Recognizing financial stress: signals, consequences and practical steps. You're not alone — and help is available.",
    },
    excerpt: {
      nl: "Financiële stress is menselijk. Herken de signalen en ontdek wat je eraan kunt doen.",
      en: "Financial stress is human. Recognize the signals and discover what you can do about it.",
    },
    category: { nl: "Hulp", en: "Help" },
    categorySlug: "hulp",
    date: "2026-02-20",
    readTime: "4 min",
    author: "Mariama",
    keywords: ["financiële stress", "geldstress", "schulden stress", "hulp bij schulden", "financial stress", "money anxiety"],
    sections: [
      {
        heading: { nl: "Financiële stress: je bent niet de enige", en: "Financial stress: you're not alone" },
        body: {
          nl: "Meer dan een kwart van de Nederlanders ervaart financiële stress. Dat betekent slecht slapen, piekeren over rekeningen en het vermijden van de brievenbus. Het is niets om je voor te schamen — het is een normaal gevolg van een ingewikkeld systeem. De eerste stap is het herkennen van de signalen.",
          en: "More than a quarter of Dutch people experience financial stress. That means poor sleep, worrying about bills and avoiding the mailbox. It's nothing to be ashamed of — it's a normal consequence of a complicated system. The first step is recognizing the signals.",
        },
      },
      {
        heading: { nl: "Signalen van financiële stress", en: "Signs of financial stress" },
        body: {
          nl: "Je vermijdt je post of e-mail. Je wordt onrustig als je aan geld denkt. Je slaapt slechter dan normaal. Je trekt je terug van sociale activiteiten. Je hebt moeite om je te concentreren op werk. Als je een of meer van deze signalen herkent, is dat een teken dat je actie kunt ondernemen. Niet om perfect te zijn, maar om grip te krijgen.",
          en: "You avoid your mail or email. You feel anxious when thinking about money. You sleep worse than usual. You withdraw from social activities. You have trouble concentrating at work. If you recognize one or more of these signals, that's a sign you can take action. Not to be perfect, but to get control.",
        },
      },
      {
        heading: { nl: "Kleine stappen die helpen", en: "Small steps that help" },
        body: {
          nl: "Maak een overzicht — weten waar je staat is al de helft. Betaal de kleinste rekening eerst (het snowball-effect). Bel een schuldeiser en vraag om uitstel of een regeling. Praat erover met iemand die je vertrouwt. En gebruik tools zoals PayWatch om je rekeningen bij te houden zonder er constant aan te hoeven denken.",
          en: "Create an overview — knowing where you stand is already half the battle. Pay the smallest bill first (the snowball effect). Call a creditor and ask for a delay or arrangement. Talk about it with someone you trust. And use tools like PayWatch to keep track of your bills without having to think about them constantly.",
        },
      },
      {
        heading: { nl: "De moodtracker in PayWatch", en: "The mood tracker in PayWatch" },
        body: {
          nl: "PayWatch heeft een ingebouwde moodtracker. Elke dag kun je aangeven hoe je je voelt. Niet als vervanging voor professionele hulp, maar als manier om patronen te zien. Voel je je slechter rond vervaldata? Helpt het om rekeningen af te handelen? Financieel welzijn is meer dan cijfers — het gaat ook om hoe je je voelt.",
          en: "PayWatch has a built-in mood tracker. Every day you can indicate how you feel. Not as a replacement for professional help, but as a way to see patterns. Do you feel worse around due dates? Does handling bills help? Financial wellbeing is more than numbers — it's also about how you feel.",
        },
      },
    ],
  },
];
