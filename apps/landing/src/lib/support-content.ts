/* ─── PayWatch Support Page Content ─── */

export interface HowItWorksGuide {
  id: string;
  icon: string; /* Lucide icon name */
  title: { nl: string; en: string };
  intro: { nl: string; en: string };
  steps: Array<{
    text: { nl: string; en: string };
  }>;
  imageKey: string; /* Sanity image key or placeholder for Arcade embed */
  tip?: { nl: string; en: string };
  relatedFeature?: string; /* slug to /features/[slug] */
}

export interface FaqItem {
  id: string;
  question: { nl: string; en: string };
  answer: { nl: string; en: string };
  category: "general" | "scanning" | "features" | "privacy" | "account";
  popular?: boolean;
  relatedFeature?: string;
}

/* ─── How it Works Guides ─── */
export const howItWorksGuides: HowItWorksGuide[] = [
  {
    id: "connect-gmail",
    icon: "Mail",
    title: { nl: "Gmail koppelen", en: "Connect Gmail" },
    intro: {
      nl: "Koppel je Gmail-account zodat PayWatch dagelijks je inbox scant op rekeningen.",
      en: "Connect your Gmail account so PayWatch scans your inbox daily for bills.",
    },
    steps: [
      { text: { nl: "Open PayWatch en ga naar het tabblad 'Inbox'.", en: "Open PayWatch and go to the 'Inbox' tab." } },
      { text: { nl: "Tik op 'E-mail koppelen' en kies 'Gmail'.", en: "Tap 'Connect email' and choose 'Gmail'." } },
      { text: { nl: "Log in met je Google-account. PayWatch vraagt alleen leestoegang — we kunnen geen e-mails versturen of verwijderen.", en: "Log in with your Google account. PayWatch only requests read access — we cannot send or delete emails." } },
      { text: { nl: "Na het koppelen begint de eerste scan direct. Dit duurt meestal 1-2 minuten.", en: "After connecting, the first scan starts immediately. This usually takes 1-2 minutes." } },
      { text: { nl: "Vanaf nu scant PayWatch je inbox elke dag automatisch, ook als de app niet open staat.", en: "From now on, PayWatch scans your inbox automatically every day, even when the app isn't open." } },
    ],
    imageKey: "guide-connect-gmail",
    tip: {
      nl: "Je kunt de koppeling op elk moment verbreken via je profiel. Al je gescande rekeningen blijven bewaard.",
      en: "You can disconnect at any time via your profile. All your scanned bills remain saved.",
    },
    relatedFeature: "email-scanner",
  },
  {
    id: "connect-outlook",
    icon: "Mail",
    title: { nl: "Outlook koppelen", en: "Connect Outlook" },
    intro: {
      nl: "Gebruik je Outlook of Hotmail? Koppel je Microsoft-account op dezelfde manier.",
      en: "Use Outlook or Hotmail? Connect your Microsoft account the same way.",
    },
    steps: [
      { text: { nl: "Open PayWatch en ga naar het tabblad 'Inbox'.", en: "Open PayWatch and go to the 'Inbox' tab." } },
      { text: { nl: "Tik op 'E-mail koppelen' en kies 'Outlook'.", en: "Tap 'Connect email' and choose 'Outlook'." } },
      { text: { nl: "Log in met je Microsoft-account (Outlook, Hotmail of Live). PayWatch vraagt alleen leestoegang.", en: "Log in with your Microsoft account (Outlook, Hotmail, or Live). PayWatch only requests read access." } },
      { text: { nl: "De eerste scan start automatisch. Je ontvangt een melding wanneer er rekeningen zijn gevonden.", en: "The first scan starts automatically. You'll receive a notification when bills are found." } },
    ],
    imageKey: "guide-connect-outlook",
    tip: {
      nl: "Outlook-scanning werkt ook dagelijks op de achtergrond, net als Gmail.",
      en: "Outlook scanning also works daily in the background, just like Gmail.",
    },
    relatedFeature: "email-scanner",
  },
  {
    id: "scan-letters",
    icon: "Camera",
    title: { nl: "Brieven scannen & QR-code", en: "Scan letters & QR code" },
    intro: {
      nl: "Ontvang je rekeningen per post? Scan ze met je camera of gebruik de QR-code.",
      en: "Receive bills by mail? Scan them with your camera or use the QR code.",
    },
    steps: [
      { text: { nl: "Open PayWatch en tik op de camera-knop in het midden van de navigatiebalk.", en: "Open PayWatch and tap the camera button in the center of the navigation bar." } },
      { text: { nl: "Kies 'Foto maken' om een brief of factuur te scannen, of 'QR-code' om een betaal-QR te scannen.", en: "Choose 'Take photo' to scan a letter or invoice, or 'QR code' to scan a payment QR." } },
      { text: { nl: "Houd de brief recht voor je camera. PayWatch herkent automatisch het bedrag, de afzender en vervaldatum.", en: "Hold the letter straight in front of your camera. PayWatch automatically detects the amount, sender, and due date." } },
      { text: { nl: "Controleer de herkende gegevens en tik op 'Opslaan'. De foto wordt bewaard als bewijs.", en: "Check the detected information and tap 'Save'. The photo is stored as proof." } },
    ],
    imageKey: "guide-scan-letters",
    tip: {
      nl: "Zorg voor goede belichting en leg de brief op een vlak oppervlak voor het beste resultaat.",
      en: "Make sure there's good lighting and place the letter on a flat surface for the best result.",
    },
    relatedFeature: "camera-scanner",
  },
  {
    id: "add-buddy",
    icon: "HeartHandshake",
    title: { nl: "Buddy toevoegen", en: "Add a buddy" },
    intro: {
      nl: "Voeg een vertrouwenspersoon toe die met je meekijkt. Je bepaalt zelf wat ze zien.",
      en: "Add a trusted person who keeps an eye on things with you. You decide what they see.",
    },
    steps: [
      { text: { nl: "Ga naar je profiel en tik op 'Buddy uitnodigen'.", en: "Go to your profile and tap 'Invite buddy'." } },
      { text: { nl: "Vul het e-mailadres in van de persoon die je wilt uitnodigen.", en: "Enter the email address of the person you want to invite." } },
      { text: { nl: "Je buddy ontvangt een e-mail met een uitnodiging om een account aan te maken.", en: "Your buddy receives an email with an invitation to create an account." } },
      { text: { nl: "Zodra ze de uitnodiging accepteren, zien ze een vereenvoudigd overzicht van je voortgang.", en: "Once they accept the invitation, they see a simplified overview of your progress." } },
    ],
    imageKey: "guide-add-buddy",
    tip: {
      nl: "Een buddy kan een partner, ouder, vriend of schuldhulpverlener zijn. Jij houdt altijd de controle over wat zichtbaar is.",
      en: "A buddy can be a partner, parent, friend, or debt counselor. You always stay in control of what's visible.",
    },
    relatedFeature: "buddy",
  },
  {
    id: "payment-plan",
    icon: "CreditCard",
    title: { nl: "Betalingsregeling instellen", en: "Set up a payment plan" },
    intro: {
      nl: "Kun je niet alles in één keer betalen? Stel een regeling in met je eigen schema.",
      en: "Can't pay everything at once? Set up a plan on your own schedule.",
    },
    steps: [
      { text: { nl: "Open een rekening en tik op 'Betalingsregeling'.", en: "Open a bill and tap 'Payment plan'." } },
      { text: { nl: "Kies hoeveel termijnen je wilt en stel de bedragen en datums in.", en: "Choose how many installments you want and set the amounts and dates." } },
      { text: { nl: "Bevestig de regeling. PayWatch herinnert je automatisch aan elke termijn.", en: "Confirm the plan. PayWatch automatically reminds you of each installment." } },
      { text: { nl: "Bij elke betaling kun je een screenshot uploaden als bewijs.", en: "With each payment you can upload a screenshot as proof." } },
    ],
    imageKey: "guide-payment-plan",
    tip: {
      nl: "Je kunt de regeling op elk moment aanpassen als je situatie verandert.",
      en: "You can adjust the plan at any time if your situation changes.",
    },
    relatedFeature: "betalingen",
  },
  {
    id: "edit-profile",
    icon: "MapPin",
    title: { nl: "Profiel bewerken", en: "Edit your profile" },
    intro: {
      nl: "Stel je locatie in zodat PayWatch hulporganisaties in jouw buurt kan tonen.",
      en: "Set your location so PayWatch can show support organizations near you.",
    },
    steps: [
      { text: { nl: "Ga naar je profiel via het menu rechtsboven.", en: "Go to your profile via the menu in the top right." } },
      { text: { nl: "Tik op 'Gemeente' en selecteer jouw gemeente uit de lijst.", en: "Tap 'Municipality' and select your municipality from the list." } },
      { text: { nl: "PayWatch toont nu hulporganisaties, juridisch adviseurs en gemeentelijke diensten bij jou in de buurt.", en: "PayWatch now shows support organizations, legal advisors, and municipal services near you." } },
    ],
    imageKey: "guide-edit-profile",
    tip: {
      nl: "Je kunt ook je voorkeurstaal en thema (licht/donker) hier aanpassen.",
      en: "You can also change your preferred language and theme (light/dark) here.",
    },
    relatedFeature: "hulpverleners",
  },
  {
    id: "community-feed",
    icon: "Users",
    title: { nl: "Community gebruiken", en: "Using the community" },
    intro: {
      nl: "Deel ervaringen, stel vragen en lees tips van anderen — anoniem en veilig.",
      en: "Share experiences, ask questions, and read tips from others — anonymous and safe.",
    },
    steps: [
      { text: { nl: "Open het 'Community' tabblad in de navigatiebalk.", en: "Open the 'Community' tab in the navigation bar." } },
      { text: { nl: "Lees berichten van andere gebruikers of tik op '+' om een eigen bericht te plaatsen.", en: "Read posts from other users or tap '+' to create your own post." } },
      { text: { nl: "Je bericht is standaard anoniem. Niemand ziet je naam of persoonlijke gegevens.", en: "Your post is anonymous by default. Nobody sees your name or personal information." } },
      { text: { nl: "Reageer op berichten, geef een hart, of meld ongepaste inhoud.", en: "Reply to posts, give a heart, or report inappropriate content." } },
    ],
    imageKey: "guide-community-feed",
    relatedFeature: "community",
  },
  {
    id: "draft-letter",
    icon: "PenLine",
    title: { nl: "Conceptbrief schrijven", en: "Draft a letter" },
    intro: {
      nl: "Laat PayWatch een bezwaarbrief of betalingsvoorstel opstellen, afgestemd op jouw rekening.",
      en: "Let PayWatch draft an objection letter or payment proposal, tailored to your bill.",
    },
    steps: [
      { text: { nl: "Open een rekening en tik op 'Brief schrijven'.", en: "Open a bill and tap 'Draft letter'." } },
      { text: { nl: "Kies het type brief: bezwaar, betalingsvoorstel, of uitstelverzoek.", en: "Choose the letter type: objection, payment proposal, or extension request." } },
      { text: { nl: "PayWatch stelt een professionele brief op met de juiste gegevens van jouw rekening.", en: "PayWatch creates a professional letter with the correct details from your bill." } },
      { text: { nl: "Lees de brief na, pas aan indien nodig, en verstuur per e-mail of print hem uit.", en: "Review the letter, edit if needed, and send by email or print it out." } },
    ],
    imageKey: "guide-draft-letter",
    tip: {
      nl: "De brief verwijst automatisch naar je rechten onder de Wet Incassokosten (WIK).",
      en: "The letter automatically references your rights under the Dutch Collection Costs Act (WIK).",
    },
    relatedFeature: "conceptbrieven",
  },
];

/* ─── FAQ Items ─── */
export const faqItems: FaqItem[] = [
  /* ── General ── */
  {
    id: "is-paywatch-free",
    question: { nl: "Is PayWatch gratis?", en: "Is PayWatch free?" },
    answer: {
      nl: "Ja, PayWatch is gratis te gebruiken tijdens de beta. Je kunt alle basisfuncties gebruiken zonder te betalen. Door een vriend uit te nodigen ontgrendel je extra functies zoals cashflow, statistieken en hulpverleners zoeken.",
      en: "Yes, PayWatch is free to use during the beta. You can use all basic features without paying. By inviting a friend you unlock extra features like cashflow, statistics, and finding support organizations.",
    },
    category: "general",
    popular: true,
  },
  {
    id: "how-does-paywatch-work",
    question: { nl: "Hoe werkt PayWatch precies?", en: "How does PayWatch work exactly?" },
    answer: {
      nl: "PayWatch herkent je rekeningen op drie manieren: door je e-mail inbox te scannen (Gmail of Outlook), door een foto te maken van een brief, of door een QR-code te scannen. Elke rekening wordt automatisch gecategoriseerd met de juiste escalatiefase, bedrag en vervaldatum.",
      en: "PayWatch finds your bills in three ways: by scanning your email inbox (Gmail or Outlook), by taking a photo of a letter, or by scanning a QR code. Each bill is automatically categorized with the correct escalation stage, amount, and due date.",
    },
    category: "general",
    popular: true,
  },
  {
    id: "what-is-escalation",
    question: { nl: "Wat zijn escalatiefases?", en: "What are escalation stages?" },
    answer: {
      nl: "In Nederland doorloopt een onbetaalde rekening vijf fases: factuur → herinnering → aanmaning → incasso → deurwaarder. Bij elke stap komen er kosten bij. PayWatch herkent automatisch in welke fase je rekening zit en waarschuwt je voordat het naar de volgende fase gaat.",
      en: "In the Netherlands, an unpaid bill goes through five stages: invoice → reminder → formal notice → collection → bailiff. Each step adds costs. PayWatch automatically detects what stage your bill is at and warns you before it moves to the next stage.",
    },
    category: "general",
    popular: true,
    relatedFeature: "betaalfases",
  },
  {
    id: "which-languages",
    question: { nl: "Kan ik PayWatch in het Engels gebruiken?", en: "Can I use PayWatch in English?" },
    answer: {
      nl: "Ja, PayWatch is volledig beschikbaar in het Nederlands en Engels. Je kunt de taal op elk moment wisselen via je profiel of de taalknop in de navigatie.",
      en: "Yes, PayWatch is fully available in Dutch and English. You can switch the language at any time via your profile or the language button in the navigation.",
    },
    category: "general",
  },
  {
    id: "which-devices",
    question: { nl: "Werkt PayWatch op mijn telefoon?", en: "Does PayWatch work on my phone?" },
    answer: {
      nl: "PayWatch is een Progressive Web App (PWA) en werkt op elke telefoon, tablet of computer met een browser. Je kunt het toevoegen aan je startscherm voor een app-achtige ervaring — zonder download uit de App Store.",
      en: "PayWatch is a Progressive Web App (PWA) and works on any phone, tablet, or computer with a browser. You can add it to your home screen for an app-like experience — no App Store download needed.",
    },
    category: "general",
  },

  /* ── Scanning ── */
  {
    id: "which-email-providers",
    question: { nl: "Welke e-mailproviders worden ondersteund?", en: "Which email providers are supported?" },
    answer: {
      nl: "Op dit moment ondersteunen we Gmail en Outlook (inclusief Hotmail en Live). We werken aan ondersteuning voor meer providers.",
      en: "Currently we support Gmail and Outlook (including Hotmail and Live). We're working on support for more providers.",
    },
    category: "scanning",
    popular: true,
  },
  {
    id: "multiple-accounts",
    question: { nl: "Kan ik meerdere e-mailaccounts koppelen?", en: "Can I connect multiple email accounts?" },
    answer: {
      nl: "Je kunt één Gmail-account en één Outlook-account tegelijk koppelen. Alle rekeningen uit beide inboxen worden gecombineerd in één overzicht.",
      en: "You can connect one Gmail account and one Outlook account at the same time. All bills from both inboxes are combined in one overview.",
    },
    category: "scanning",
  },
  {
    id: "bill-not-recognized",
    question: { nl: "Wat als een rekening niet herkend wordt?", en: "What if a bill isn't recognized?" },
    answer: {
      nl: "Als een rekening niet automatisch herkend wordt, kun je hem handmatig toevoegen via de camera-scanner of door de gegevens zelf in te voeren. Je kunt ook een correctie doorgeven, zodat we vergelijkbare rekeningen in de toekomst beter herkennen.",
      en: "If a bill isn't automatically recognized, you can add it manually via the camera scanner or by entering the details yourself. You can also submit a correction, so we recognize similar bills better in the future.",
    },
    category: "scanning",
  },
  {
    id: "how-often-scan",
    question: { nl: "Hoe vaak wordt mijn inbox gescand?", en: "How often is my inbox scanned?" },
    answer: {
      nl: "Je inbox wordt elke dag automatisch gescand, ook als de app niet open staat. Je kunt ook handmatig een scan starten via het inbox-tabblad.",
      en: "Your inbox is scanned automatically every day, even when the app isn't open. You can also manually start a scan via the inbox tab.",
    },
    category: "scanning",
  },

  /* ── Features ── */
  {
    id: "what-are-achievements",
    question: { nl: "Wat zijn achievements?", en: "What are achievements?" },
    answer: {
      nl: "Achievements zijn beloningen die je verdient door de app te gebruiken. Bijvoorbeeld je eerste rekening scannen, een buddy toevoegen, of 5 rekeningen op tijd betalen. Ze zijn er om je te motiveren en je voortgang zichtbaar te maken.",
      en: "Achievements are rewards you earn by using the app. For example, scanning your first bill, adding a buddy, or paying 5 bills on time. They're there to motivate you and make your progress visible.",
    },
    category: "features",
    popular: true,
  },
  {
    id: "what-is-health-score",
    question: { nl: "Wat is de financiële gezondheidsscore?", en: "What is the financial health score?" },
    answer: {
      nl: "Een persoonlijke score van 0 tot 100 die laat zien hoe goed je je rekeningen beheert. De score is gebaseerd op betaalgedrag, escalatiefases en consistentie. Hoe meer rekeningen je op tijd betaalt, hoe hoger je score.",
      en: "A personal score from 0 to 100 that shows how well you're managing your bills. The score is based on payment behavior, escalation stages, and consistency. The more bills you pay on time, the higher your score.",
    },
    category: "features",
    relatedFeature: "inzichten",
  },
  {
    id: "how-mood-tracker",
    question: { nl: "Hoe werkt de moodtracker?", en: "How does the mood tracker work?" },
    answer: {
      nl: "De moodtracker laat je dagelijks bijhouden hoe je je voelt. Met de tijd zie je patronen — bijvoorbeeld dat je je slechter voelt rond betaaldeadlines. Dit helpt je om beter om te gaan met financiële stress.",
      en: "The mood tracker lets you log how you feel each day. Over time you'll see patterns — for example, feeling worse around payment deadlines. This helps you manage financial stress better.",
    },
    category: "features",
  },
  {
    id: "how-countdown",
    question: { nl: "Hoe werkt de schuldvrij countdown?", en: "How does the debt-free countdown work?" },
    answer: {
      nl: "De countdown toont hoeveel je al hebt afgelost en hoeveel er nog resteert. Met een voortgangsbalk en geschatte einddatum. Bij elke mijlpaal (25%, 50%, 75%) ontvang je een melding.",
      en: "The countdown shows how much you've paid off and how much remains. With a progress bar and estimated completion date. At each milestone (25%, 50%, 75%) you receive a notification.",
    },
    category: "features",
    relatedFeature: "schuldvrij-countdown",
  },
  {
    id: "share-with-counselor",
    question: { nl: "Kan ik PayWatch delen met mijn hulpverlener?", en: "Can I share PayWatch with my counselor?" },
    answer: {
      nl: "Ja, via het buddy-systeem kun je een hulpverlener uitnodigen. Zij zien een vereenvoudigd overzicht van je voortgang, zonder bedragen die je niet wilt delen. Jij houdt altijd de controle.",
      en: "Yes, through the buddy system you can invite a counselor. They see a simplified overview of your progress, without amounts you don't want to share. You always stay in control.",
    },
    category: "features",
    relatedFeature: "buddy",
  },

  /* ── Privacy ── */
  {
    id: "is-data-safe",
    question: { nl: "Is mijn data veilig?", en: "Is my data safe?" },
    answer: {
      nl: "Absoluut. PayWatch is gebouwd in de EU met privacy als uitgangspunt. Je data wordt versleuteld opgeslagen (AES-256), we gebruiken alleen-lezen toegang tot je e-mail, en we delen nooit persoonlijke gegevens met derden. We zijn volledig AVG/GDPR-compliant.",
      en: "Absolutely. PayWatch is built in the EU with privacy at its core. Your data is encrypted (AES-256), we use read-only access to your email, and we never share personal data with third parties. We're fully GDPR compliant.",
    },
    category: "privacy",
    popular: true,
  },
  {
    id: "what-data-stored",
    question: { nl: "Welke gegevens slaat PayWatch op?", en: "What data does PayWatch store?" },
    answer: {
      nl: "We slaan je accountgegevens op (e-mail, naam), je rekeningen (bedrag, afzender, status, vervaldatum), en optioneel foto's die je als bewijs uploadt. E-mailinhoud wordt alleen tijdelijk verwerkt om rekeningen te herkennen en daarna verwijderd.",
      en: "We store your account details (email, name), your bills (amount, sender, status, due date), and optionally photos you upload as proof. Email content is only temporarily processed to detect bills and then deleted.",
    },
    category: "privacy",
  },
  {
    id: "email-password",
    question: { nl: "Moet ik mijn e-mailwachtwoord delen?", en: "Do I need to share my email password?" },
    answer: {
      nl: "Nee, nooit. PayWatch gebruikt OAuth 2.0 — je logt in via Google of Microsoft en geeft ons alleen leestoegang. We zien of slaan je wachtwoord nooit op.",
      en: "No, never. PayWatch uses OAuth 2.0 — you log in via Google or Microsoft and only give us read access. We never see or store your password.",
    },
    category: "privacy",
  },

  /* ── Account ── */
  {
    id: "delete-account",
    question: { nl: "Hoe verwijder ik mijn account?", en: "How do I delete my account?" },
    answer: {
      nl: "Ga naar je profiel → 'Account verwijderen'. Al je gegevens, rekeningen en gekoppelde e-mailaccounts worden permanent verwijderd. Dit kan niet ongedaan gemaakt worden.",
      en: "Go to your profile → 'Delete account'. All your data, bills, and connected email accounts will be permanently deleted. This cannot be undone.",
    },
    category: "account",
  },
  {
    id: "disconnect-email",
    question: { nl: "Hoe ontkoppel ik mijn e-mail?", en: "How do I disconnect my email?" },
    answer: {
      nl: "Ga naar je profiel → 'Gekoppelde accounts' en tik op 'Ontkoppelen' naast de e-mailprovider. Je eerder gescande rekeningen blijven bewaard, maar er worden geen nieuwe scans meer uitgevoerd.",
      en: "Go to your profile → 'Connected accounts' and tap 'Disconnect' next to the email provider. Your previously scanned bills remain saved, but no new scans will be performed.",
    },
    category: "account",
  },
];

/* ─── Category labels ─── */
export const faqCategories = {
  all: { nl: "Alles", en: "All" },
  general: { nl: "Algemeen", en: "General" },
  scanning: { nl: "Scannen", en: "Scanning" },
  features: { nl: "Functies", en: "Features" },
  privacy: { nl: "Privacy", en: "Privacy" },
  account: { nl: "Account", en: "Account" },
} as const;
