/* ─── PayWatch Schuldhulp City Pages ─── */
/* Unique content per city — Dutch first, natural tone, no em dashes */

export interface CityFAQ {
  question: string;
  answer: string;
}

export interface CityOrg {
  name: string;
  url: string;
  type: string;
  description: string;
  phone?: string;
}

export interface CityTip {
  title: string;
  description: string;
  icon: string; // Lucide icon name
}

export interface CityPage {
  slug: string;
  name: string;
  province: string;
  population: string;
  accentColor: string;       // CSS hex for city branding
  accentColorLight: string;  // Light version for backgrounds
  accentColorName: string;   // Human readable
  unsplashQuery: string;     // Search query for hero image
  unsplashQueryOrgs: string; // Search query for organizations section
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  introTitle: string;
  introText: string;
  debtContext: string;        // City-specific debt context paragraph
  localSituation: string;    // How debt affects this city specifically
  organizations: CityOrg[];
  faq: CityFAQ[];
  tips: CityTip[];
  statsHighlight: string;    // One notable stat
  ctaText: string;
  gemeenteUrl: string;       // Official gemeente schuldhulp page
  coordinates: { lat: number; lng: number };
}

export const CITY_SLUGS = [
  "rotterdam",
  "amsterdam",
  "den-haag",
  "utrecht",
  "eindhoven",
] as const;

export type CitySlug = (typeof CITY_SLUGS)[number];

export const cityPages: Record<CitySlug, CityPage> = {
  rotterdam: {
    slug: "rotterdam",
    name: "Rotterdam",
    province: "Zuid-Holland",
    population: "660.000+",
    accentColor: "#009B3A",
    accentColorLight: "#E6F7EE",
    accentColorName: "Rotterdams groen",
    unsplashQuery: "Rotterdam Netherlands skyline Erasmus bridge",
    unsplashQueryOrgs: "Rotterdam city Netherlands architecture",
    metaTitle: "Schuldhulp Rotterdam — Gratis hulp bij schulden in Rotterdam",
    metaDescription: "Heb je schulden in Rotterdam? Ontdek welke gratis hulporganisaties er zijn, hoe schuldhulpverlening werkt en wat PayWatch voor je kan doen. Bekijk lokale tips en veelgestelde vragen.",
    heroTitle: "Schuldhulp in Rotterdam",
    heroSubtitle: "Overzicht van alle hulp bij schulden in de Maasstad",
    introTitle: "Schulden in Rotterdam: je staat er niet alleen voor",
    introText: "Rotterdam is een stad van doeners. Maar ook doeners kunnen vastlopen op onverwachte rekeningen, hoge energiekosten of een plotseling inkomensverlies. In Rotterdam hebben naar schatting 1 op de 5 huishoudens te maken met problematische schulden. Dat is niet iets om je voor te schamen. De gemeente Rotterdam en diverse organisaties bieden gratis ondersteuning om je weer op weg te helpen.",
    debtContext: "Als havenstad met een diverse bevolking kent Rotterdam relatief veel huishoudens met een laag inkomen. De combinatie van stijgende huurprijzen in wijken als Feijenoord, Charlois en Delfshaven, oplopende energiekosten en de nasleep van de coronacrisis heeft ervoor gezorgd dat steeds meer Rotterdammers met betalingsachterstanden kampen. Vooral zzp'ers en flexwerkers in de haven- en dienstensector worden hard geraakt.",
    localSituation: "Rotterdam zet sterk in op vroegsignalering. Dat betekent dat de gemeente actief signalen oppikt van nutsbedrijven, zorgverzekeraars en woningcorporaties wanneer bewoners betalingsachterstanden oplopen. Je kunt dus al hulp aangeboden krijgen voordat je er zelf om vraagt. Dit is uniek in Nederland en maakt Rotterdam een voorloper op het gebied van schuldhulpverlening.",
    statsHighlight: "Ongeveer 1 op de 5 Rotterdamse huishoudens heeft problematische schulden",
    organizations: [
      {
        name: "Kredietbank Rotterdam",
        url: "https://www.rotterdam.nl/schuldhulpverlening",
        type: "Gemeentelijke kredietbank",
        description: "De Kredietbank Rotterdam is onderdeel van de gemeente en biedt gratis schuldhulpverlening. Ze helpen met budgetcoaching, schuldregelingen en schuldsanering. Aanmelden kan via de wijkteams of direct bij de gemeente.",
        phone: "14 010",
      },
      {
        name: "Wijkteams Rotterdam",
        url: "https://www.rotterdam.nl/wijkteams",
        type: "Wijkteam / eerste aanspreekpunt",
        description: "Elk Rotterdams wijkteam heeft medewerkers die je kunnen helpen met geldzorgen. Ze kijken samen met jou naar je situatie en verwijzen je door naar de juiste hulp. Laagdrempelig en gratis.",
        phone: "14 010",
      },
      {
        name: "SchuldHulpMaatje Rotterdam",
        url: "https://schuldhulpmaatje.nl/rotterdam/",
        type: "Vrijwillige schuldhulp",
        description: "Vrijwilligers die naast je staan bij het op orde brengen van je administratie en financien. Ze gaan mee naar gesprekken met schuldeisers en helpen je bij het aanvragen van toeslagen of regelingen.",
      },
      {
        name: "Humanitas Rotterdam",
        url: "https://www.humanitas.nl/rotterdam",
        type: "Maatschappelijke ondersteuning",
        description: "Biedt thuisadministratie, budgetmaatjes en ondersteuning bij het ordenen van je papierwerk. Vooral geschikt als je moeite hebt met de administratieve kant van je financien.",
      },
    ],
    faq: [
      {
        question: "Hoe vraag ik schuldhulpverlening aan in Rotterdam?",
        answer: "Je kunt schuldhulpverlening aanvragen door te bellen naar 14 010 of door langs te gaan bij je wijkteam. Je kunt ook online een aanvraag doen via rotterdam.nl/schuldhulpverlening. Er wordt dan een intakegesprek gepland waarin je situatie in kaart wordt gebracht.",
      },
      {
        question: "Is schuldhulpverlening in Rotterdam gratis?",
        answer: "Ja, schuldhulpverlening via de gemeente Rotterdam is volledig gratis. Je hoeft er niets voor te betalen. Pas op voor commerciele partijen die geld vragen voor schuldhulp. Ga altijd eerst naar de gemeente.",
      },
      {
        question: "Hoe lang duurt een schuldhulptraject in Rotterdam?",
        answer: "Een schuldhulptraject duurt gemiddeld 18 tot 36 maanden, afhankelijk van je situatie. Bij een minnelijke schuldregeling proberen ze binnen 120 dagen een akkoord te bereiken met je schuldeisers. Een wettelijke schuldsanering (WSNP) duurt standaard 18 maanden.",
      },
      {
        question: "Wat doet het vroegsignaleringsproject van Rotterdam?",
        answer: "Rotterdam krijgt signalen van energieleveranciers, zorgverzekeraars en woningcorporaties als je betalingsachterstanden hebt. De gemeente neemt dan proactief contact met je op om hulp aan te bieden, nog voordat de situatie escaleert. Je kunt dit ook weigeren, het is vrijblijvend.",
      },
      {
        question: "Kan ik hulp krijgen als ik in de Bijstand zit?",
        answer: "Zeker. Juist als je een bijstandsuitkering ontvangt, heb je recht op schuldhulpverlening. De gemeente kan daarnaast helpen met bijzondere bijstand voor onverwachte kosten of het kwijtschelden van gemeentelijke belastingen.",
      },
      {
        question: "Wat als ik al een deurwaarder aan de deur heb gehad?",
        answer: "Ook dan kun je nog hulp krijgen. Neem zo snel mogelijk contact op met het wijkteam of bel 14 010. Hoe eerder je hulp zoekt, hoe meer opties er zijn. Een deurwaarder betekent niet dat alles verloren is.",
      },
    ],
    tips: [
      {
        title: "Kwijtschelding gemeentelijke belastingen",
        description: "Als je een laag inkomen hebt, kun je in Rotterdam kwijtschelding aanvragen voor gemeentelijke belastingen en de waterschapsbelasting. Dit kan je honderden euros per jaar schelen.",
        icon: "BadgePercent",
      },
      {
        title: "Rotterdampas",
        description: "Met de Rotterdampas (gratis bij laag inkomen) krijg je korting op sport, cultuur en uitjes. Het bespaart je geld op activiteiten die anders duur zouden zijn.",
        icon: "Ticket",
      },
      {
        title: "Energietoeslag aanvragen",
        description: "Rotterdammers met een inkomen tot 130% van het sociaal minimum komen in aanmerking voor de energietoeslag. Check op rotterdam.nl of je hiervoor in aanmerking komt.",
        icon: "Zap",
      },
      {
        title: "Voedselbank Rotterdam",
        description: "Heb je moeite om rond te komen? De Voedselbank Rotterdam heeft meerdere uitgiftepunten in de stad. Aanmelden kan via het wijkteam of maatschappelijk werk.",
        icon: "ShoppingCart",
      },
    ],
    ctaText: "Begin vandaag met overzicht in je rekeningen",
    gemeenteUrl: "https://www.rotterdam.nl/schuldhulpverlening",
    coordinates: { lat: 51.9244, lng: 4.4777 },
  },

  amsterdam: {
    slug: "amsterdam",
    name: "Amsterdam",
    province: "Noord-Holland",
    population: "920.000+",
    accentColor: "#C8102E",
    accentColorLight: "#FDE8EC",
    accentColorName: "Amsterdams rood",
    unsplashQuery: "Amsterdam Netherlands canal houses cityscape",
    unsplashQueryOrgs: "Amsterdam city neighborhood Netherlands",
    metaTitle: "Schuldhulp Amsterdam — Hulp bij schulden in Amsterdam",
    metaDescription: "Schulden in Amsterdam? Bekijk gratis hulporganisaties, schuldhulpverlening via de gemeente en praktische tips. PayWatch helpt je met overzicht in je rekeningen.",
    heroTitle: "Schuldhulp in Amsterdam",
    heroSubtitle: "Alle hulp bij schulden in de hoofdstad op een rij",
    introTitle: "Schulden in Amsterdam: in een dure stad is het snel misgegaan",
    introText: "Amsterdam is een van de duurste steden van Nederland. De huren zijn hoog, de dagelijkse kosten lopen op en het leven in de hoofdstad is niet goedkoop. Het is dan ook niet vreemd dat veel Amsterdammers op een gegeven moment moeite krijgen met het betalen van hun rekeningen. De gemeente Amsterdam heeft een uitgebreid netwerk aan hulporganisaties opgezet om inwoners bij te staan.",
    debtContext: "Door de extreme woningmarkt betalen veel Amsterdammers meer dan 40% van hun inkomen aan huur. In wijken als Nieuw-West, Zuidoost en Noord is het percentage huishoudens met betalingsachterstanden aanzienlijk hoger dan het landelijk gemiddelde. Daarnaast zorgt de groei van de flexeconomie en het toerisme voor een groep werkenden die ondanks een baan financieel kwetsbaar blijft.",
    localSituation: "Amsterdam werkt met het programma 'Pak je Kans' en heeft buurtteams in elke wijk. De stad experimenteert met het automatisch kwijtschelden van schulden bij de gemeente zelf en heeft een speciaal programma voor jongeren met schulden (18-27 jaar). Uniek is ook de samenwerking met woningcorporaties om huisuitzettingen te voorkomen.",
    statsHighlight: "Meer dan 80.000 Amsterdamse huishoudens hebben geregistreerde betalingsachterstanden",
    organizations: [
      {
        name: "Kredietbank Amsterdam",
        url: "https://www.amsterdam.nl/schuldhulp",
        type: "Gemeentelijke kredietbank",
        description: "De Kredietbank Amsterdam helpt met budgetbeheer, schuldregelingen en sociale kredieten. Ze werken samen met de buurtteams en je kunt je ook rechtstreeks aanmelden via amsterdam.nl/schuldhulp.",
        phone: "14 020",
      },
      {
        name: "Buurtteam Amsterdam",
        url: "https://www.buurtteamamsterdam.nl/hulp-bij-schulden-amsterdam/",
        type: "Buurtteam / lokale hulp",
        description: "In elke Amsterdamse buurt zit een buurtteam dat je gratis helpt met geldzorgen. Ze denken met je mee, helpen met je administratie en verwijzen je door als dat nodig is. Geen wachtlijst voor een eerste gesprek.",
      },
      {
        name: "Grip op Geld (Gemeente Amsterdam)",
        url: "https://www.amsterdam.nl/werk-en-inkomen/pak-je-kans/grip-op-geld/",
        type: "Gemeentelijk preventieprogramma",
        description: "Online tools en workshops van de gemeente Amsterdam om grip te krijgen op je geldzaken. Inclusief huishoudboekje, budgetcoach en financiele check-ups. Volledig gratis.",
      },
      {
        name: "SchuldHulpMaatje Amsterdam",
        url: "https://schuldhulpmaatje.nl/amsterdam/",
        type: "Vrijwillige schuldhulp",
        description: "Getrainde vrijwilligers die je persoonlijk begeleiden bij het aanpakken van je schulden. Ze helpen met post openen, brieven beantwoorden en je administratie op orde brengen.",
      },
    ],
    faq: [
      {
        question: "Hoe meld ik me aan voor schuldhulpverlening in Amsterdam?",
        answer: "Je kunt je aanmelden door te bellen naar 14 020, online via amsterdam.nl/schuldhulp, of door langs te gaan bij je buurtteam. Je kunt ook naar een Stadsloket. Binnen twee weken heb je een eerste gesprek.",
      },
      {
        question: "Wat is het verschil tussen een buurtteam en de Kredietbank?",
        answer: "Het buurtteam is je eerste aanspreekpunt en helpt je met allerlei vragen, ook over geld. De Kredietbank is gespecialiseerd in schuldhulpverlening en neemt het over als je een formeel schuldhulptraject nodig hebt. Het buurtteam verwijst je door naar de Kredietbank als dat nodig is.",
      },
      {
        question: "Kan ik als jongere in Amsterdam hulp krijgen bij schulden?",
        answer: "Ja, Amsterdam heeft een speciaal programma voor jongeren van 18 tot 27 jaar met schulden. Je krijgt een persoonlijke coach die je helpt om je schulden aan te pakken en financieel zelfstandig te worden. Meld je aan via het buurtteam of bel 14 020.",
      },
      {
        question: "Wat als ik dreig uit huis gezet te worden?",
        answer: "Neem onmiddellijk contact op met je buurtteam of bel 14 020. Amsterdam heeft convenanten met woningcorporaties om huisuitzettingen door schulden te voorkomen. Er is bijna altijd een oplossing mogelijk, maar snelheid is belangrijk.",
      },
      {
        question: "Ik schaam me voor mijn schulden, is het vertrouwelijk?",
        answer: "Alles wat je bespreekt met het buurtteam, de Kredietbank of vrijwilligersorganisaties is vertrouwelijk. Niemand buiten het hulpverleningsteam krijgt je gegevens te zien. Schulden overkomen veel mensen en er is geen reden voor schaamte.",
      },
      {
        question: "Kan de gemeente mijn gemeentelijke belastingschuld kwijtschelden?",
        answer: "Amsterdam experimenteert met het automatisch kwijtschelden van gemeentelijke schulden voor inwoners in de schuldhulpverlening. Daarnaast kun je kwijtschelding aanvragen voor gemeentelijke belastingen als je een laag inkomen hebt.",
      },
    ],
    tips: [
      {
        title: "Stadspas Amsterdam",
        description: "De Stadspas geeft korting op sport, cultuur en vervoer. Bij een laag inkomen is de pas gratis en krijg je extra tegoed voor activiteiten.",
        icon: "Ticket",
      },
      {
        title: "Collectieve zorgverzekering",
        description: "Als Amsterdammer met een laag inkomen kun je meedoen aan de collectieve zorgverzekering van de gemeente. Dit is vaak goedkoper dan een individuele polis en biedt goede dekking.",
        icon: "Heart",
      },
      {
        title: "Schulden bij de gemeente? Vraag om pauze",
        description: "Als je gemeentelijke belastingschulden hebt en in een hulptraject zit, kan de invordering worden gepauzeerd. Dit geeft je ademruimte om je andere schulden aan te pakken.",
        icon: "PauseCircle",
      },
      {
        title: "Gratis juridisch advies",
        description: "Via het Juridisch Loket Amsterdam kun je gratis advies krijgen over je rechten als schuldenaar. Handig als je te maken hebt met incassobureaus of deurwaarders.",
        icon: "Scale",
      },
    ],
    ctaText: "Krijg overzicht in je Amsterdamse rekeningen",
    gemeenteUrl: "https://www.amsterdam.nl/werk-en-inkomen/regelingen-bij-laag-inkomen-pak-je-kans/schuldhulpverlening/",
    coordinates: { lat: 52.3676, lng: 4.9041 },
  },

  "den-haag": {
    slug: "den-haag",
    name: "Den Haag",
    province: "Zuid-Holland",
    population: "555.000+",
    accentColor: "#006338",
    accentColorLight: "#E6F2EC",
    accentColorName: "Haags groen",
    unsplashQuery: "The Hague Netherlands Binnenhof cityscape",
    unsplashQueryOrgs: "The Hague city street Netherlands",
    metaTitle: "Schuldhulp Den Haag — Hulp bij schulden in Den Haag",
    metaDescription: "Schulden in Den Haag? Ontdek gratis schuldhulpverlening, lokale organisaties en praktische tips. PayWatch geeft je overzicht in je rekeningen en waarschuwt op tijd.",
    heroTitle: "Schuldhulp in Den Haag",
    heroSubtitle: "Overzicht van alle hulp bij schulden in de hofstad",
    introTitle: "Schulden in Den Haag: hulp is dichterbij dan je denkt",
    introText: "Den Haag is niet alleen de stad van het Binnenhof en de internationale organisaties. Het is ook een stad met grote tegenstellingen. Van Statenkwartier tot Transvaal, van Scheveningen tot Laak: in elke wijk wonen mensen die worstelen met schulden. De gemeente Den Haag heeft schuldhulpverlening hoog op de agenda staan en biedt uitgebreide ondersteuning.",
    debtContext: "Den Haag kent wijken waar meer dan 25% van de huishoudens te maken heeft met geregistreerde betalingsachterstanden. Vooral in Laak, Transvaal en Moerwijk is de schuldproblematiek groot. De diverse samenstelling van de stad, met veel internationale inwoners en statushouders, vraagt om schuldhulp in meerdere talen en met culturele gevoeligheid.",
    localSituation: "De gemeente Den Haag werkt met een centraal aanmeldpunt voor schuldhulpverlening en heeft een netwerk van sociale wijkteams. Bijzonder is het programma 'Financieel Fit' dat zich richt op preventie: mensen leren omgaan met geld voordat er schulden ontstaan. Ook heeft Den Haag een speciaal noodfonds voor acute situaties, zoals dreigende afsluiting van gas en licht.",
    statsHighlight: "In bepaalde Haagse wijken heeft meer dan 1 op de 4 huishoudens betalingsachterstanden",
    organizations: [
      {
        name: "Kredietbank Den Haag",
        url: "https://www.denhaag.nl/nl/schulden.htm",
        type: "Gemeentelijke kredietbank",
        description: "De Kredietbank Den Haag biedt schuldhulpverlening, budgetbeheer en sociale kredieten. Aanmelden kan telefonisch via 14 070 of online. Je wordt dan uitgenodigd voor een intakegesprek.",
        phone: "14 070",
      },
      {
        name: "Sociale Wijkteams Den Haag",
        url: "https://www.denhaag.nl/nl/in-de-stad/sociale-wijkteams.htm",
        type: "Wijkteam / eerste aanspreekpunt",
        description: "In elk stadsdeel van Den Haag is een sociaal wijkteam actief. Ze helpen met geldzorgen, maar ook met andere problemen die daarmee samenhangen, zoals wonen, werk en gezondheid.",
        phone: "14 070",
      },
      {
        name: "SchuldHulpMaatje Den Haag",
        url: "https://schuldhulpmaatje.nl/den-haag/",
        type: "Vrijwillige schuldhulp",
        description: "Persoonlijke begeleiding door getrainde vrijwilligers. Ze helpen je met het ordenen van je administratie, het beantwoorden van post en het begeleiden naar professionele hulp.",
      },
      {
        name: "Vluchtelingenwerk Den Haag (financiele hulp)",
        url: "https://www.vluchtelingenwerk.nl/nl",
        type: "Gespecialiseerde hulp",
        description: "Specifieke ondersteuning voor statushouders en vluchtelingen met schulden. Hulp in meerdere talen en met begrip voor de specifieke situatie van nieuwkomers in Nederland.",
      },
    ],
    faq: [
      {
        question: "Hoe kan ik schuldhulpverlening aanvragen in Den Haag?",
        answer: "Bel 14 070 of ga naar denhaag.nl/schulden. Je kunt ook langsgaan bij een sociaal wijkteam in je buurt. Na aanmelding volgt een intakegesprek waarin je situatie wordt beoordeeld en een plan wordt gemaakt.",
      },
      {
        question: "Is er schuldhulp beschikbaar in andere talen?",
        answer: "Ja, Den Haag biedt schuldhulpverlening met tolken en er zijn organisaties die specifiek helpen in het Engels, Arabisch, Turks en andere talen. Vraag bij het wijkteam naar de mogelijkheden.",
      },
      {
        question: "Wat is het noodfonds van Den Haag?",
        answer: "Het gemeentelijk noodfonds kan ingezet worden bij acute situaties, zoals dreigende afsluiting van energie of water, of een dreigende huisuitzetting. Het wijkteam kan je helpen met een aanvraag. Dit is een gift, geen lening.",
      },
      {
        question: "Kan ik hulp krijgen als zzp'er in Den Haag?",
        answer: "Zeker. Steeds meer zzp'ers krijgen te maken met schulden. De gemeente Den Haag biedt ook voor ondernemers en zzp'ers schuldhulpverlening aan. Er is extra aandacht voor de specifieke situatie van zelfstandigen.",
      },
      {
        question: "Hoe werkt vroegsignalering in Den Haag?",
        answer: "Net als in andere grote steden ontvangt de gemeente signalen van energieleveranciers, zorgverzekeraars en woningcorporaties. Als je meerdere betalingsachterstanden hebt, neemt het wijkteam proactief contact met je op om hulp aan te bieden.",
      },
      {
        question: "Wat is het verschil tussen een minnelijke regeling en WSNP?",
        answer: "Bij een minnelijke regeling probeert de Kredietbank met al je schuldeisers een akkoord te bereiken. Je betaalt 18 tot 36 maanden wat je kunt missen, daarna worden de restschulden kwijtgescholden. WSNP is de wettelijke variant via de rechtbank en duurt 18 maanden, maar is strenger.",
      },
    ],
    tips: [
      {
        title: "Ooievaarspas",
        description: "De Ooievaarspas geeft Hagenaars met een laag inkomen korting op sport, cultuur en openbaar vervoer. Aanvragen kan via denhaag.nl.",
        icon: "Ticket",
      },
      {
        title: "Gratis budgetcoaching",
        description: "Via het programma 'Financieel Fit' kun je gratis budgetcoaching volgen. Je leert omgaan met je geld en voorkomt dat kleine problemen uitgroeien tot grote schulden.",
        icon: "GraduationCap",
      },
      {
        title: "Kindpakket Den Haag",
        description: "Gezinnen met een laag inkomen kunnen aanspraak maken op het Kindpakket: een vergoeding voor schoolspullen, sportcontributies en andere kosten voor kinderen.",
        icon: "Baby",
      },
      {
        title: "Gratis belastingaangifte",
        description: "Via diverse Haagse organisaties kun je gratis hulp krijgen bij je belastingaangifte. Dit voorkomt boetes en zorgt ervoor dat je alle toeslagen krijgt waar je recht op hebt.",
        icon: "FileText",
      },
    ],
    ctaText: "Krijg grip op je rekeningen in Den Haag",
    gemeenteUrl: "https://www.denhaag.nl/nl/schulden.htm",
    coordinates: { lat: 52.0705, lng: 4.3007 },
  },

  utrecht: {
    slug: "utrecht",
    name: "Utrecht",
    province: "Utrecht",
    population: "365.000+",
    accentColor: "#C8102E",
    accentColorLight: "#FDE8EC",
    accentColorName: "Utrechts rood",
    unsplashQuery: "Utrecht Netherlands Dom tower canal",
    unsplashQueryOrgs: "Utrecht city Netherlands street",
    metaTitle: "Schuldhulp Utrecht — Gratis hulp bij schulden in Utrecht",
    metaDescription: "Schulden in Utrecht? Vind gratis schuldhulpverlening, lokale hulporganisaties en tips om je financien op orde te krijgen. PayWatch helpt je met grip op je rekeningen.",
    heroTitle: "Schuldhulp in Utrecht",
    heroSubtitle: "Alle hulp bij schulden in de Domstad",
    introTitle: "Schulden in Utrecht: ook in een welvarende stad loopt het mis",
    introText: "Utrecht staat bekend als een van de meest welvarende steden van Nederland. Maar achter die statistiek schuilt een ander verhaal. Ook in Utrecht zijn er duizenden huishoudens die moeite hebben om rond te komen. Studenten die na hun studie met schulden achterblijven, jonge gezinnen die de huur nauwelijks kunnen betalen en ouderen met een klein pensioen. De gemeente Utrecht pakt schulden proactief aan.",
    debtContext: "De woningmarkt in Utrecht is extreem krap. Huurprijzen zijn de afgelopen jaren fors gestegen, ook in wijken die voorheen betaalbaar waren, zoals Overvecht, Kanaleneiland en Zuilen. Voor veel Utrechters gaat meer dan de helft van hun inkomen naar woonlasten. Dat laat weinig ruimte voor onverwachte kosten. Een kapotte wasmachine of een naheffing van de Belastingdienst kan dan al het begin zijn van een schuldenspiraal.",
    localSituation: "Utrecht werkt met buurtteams die laagdrempelig bereikbaar zijn. De stad is een van de koplopers in het toepassen van de Wet gemeentelijke schuldhulpverlening en experimenteert met het eerder kwijtschelden van schulden. Utrecht heeft ook een speciaal project voor mensen die net niet in aanmerking komen voor formele schuldhulp maar wel geldzorgen hebben.",
    statsHighlight: "In Overvecht en Kanaleneiland heeft meer dan 15% van de huishoudens problematische schulden",
    organizations: [
      {
        name: "Werk en Inkomen Utrecht",
        url: "https://www.utrecht.nl/zorg-en-onderwijs/hulp-bij-schulden/",
        type: "Gemeentelijke dienst",
        description: "De afdeling Werk en Inkomen van de gemeente Utrecht is het startpunt voor schuldhulpverlening. Zij regelen de intake, beoordelen je situatie en starten het hulptraject op. Aanmelden via het buurtteam of telefonisch.",
        phone: "14 030",
      },
      {
        name: "Buurtteams Utrecht",
        url: "https://www.buurtteamsutrecht.nl",
        type: "Buurtteam / eerste aanspreekpunt",
        description: "De Utrechtse buurtteams zijn je eerste aanspreekpunt voor hulp bij geldzorgen. Ze helpen je met praktische zaken, verwijzen door naar schuldhulpverlening en ondersteunen je tijdens het hele traject.",
      },
      {
        name: "Stadsgeldbeheer",
        url: "https://www.stadsgeldbeheer.nl",
        type: "Budgetbeheer",
        description: "Stadsgeldbeheer helpt Utrechters die moeite hebben met het beheren van hun geld. Ze nemen tijdelijk je financien over, betalen vaste lasten en zorgen dat er geen nieuwe schulden ontstaan.",
      },
      {
        name: "U-Centraal (Maatschappelijk Werk)",
        url: "https://www.u-centraal.nl",
        type: "Psychosociale ondersteuning",
        description: "Schulden gaan vaak gepaard met stress, schaamte en andere problemen. U-Centraal biedt gratis maatschappelijk werk en psychosociale ondersteuning naast de financiele hulp.",
      },
    ],
    faq: [
      {
        question: "Hoe vraag ik schuldhulpverlening aan in Utrecht?",
        answer: "Neem contact op met je buurtteam of bel 14 030. Je kunt ook online een aanvraag indienen via utrecht.nl. Na je aanmelding volgt een eerste gesprek waarin je situatie in kaart wordt gebracht.",
      },
      {
        question: "Ik ben student in Utrecht en heb schulden, kan ik hulp krijgen?",
        answer: "Ja, ook studenten kunnen gebruikmaken van schuldhulpverlening in Utrecht. Neem contact op met het buurtteam in je wijk. Daarnaast heeft de Universiteit Utrecht en de Hogeschool Utrecht studentenpsychologen die ook bij financiele stress kunnen helpen.",
      },
      {
        question: "Wat is budgetbeheer en is dat iets voor mij?",
        answer: "Bij budgetbeheer neemt een organisatie tijdelijk het beheer van je financien over. Je inkomen komt op een beheerrekening, vaste lasten worden automatisch betaald en jij krijgt leefgeld. Dit voorkomt dat je nieuwe schulden maakt terwijl je oude schulden worden afgelost.",
      },
      {
        question: "Kan ik ook hulp krijgen als mijn schulden klein zijn?",
        answer: "Ja, Utrecht heeft ook hulp voor mensen met beginnende geldzorgen. Je hoeft niet te wachten tot de situatie onhoudbaar wordt. Hoe eerder je hulp zoekt, hoe makkelijker en sneller het op te lossen is.",
      },
      {
        question: "Hoeveel schulden moet ik hebben voor schuldhulpverlening?",
        answer: "Er is geen minimumbedrag. Als je je schulden niet meer kunt overzien of betalen, heb je recht op hulp. De gemeente kijkt naar je totale situatie: inkomen, vaste lasten, schulden en persoonlijke omstandigheden.",
      },
      {
        question: "Wat als ik zelfstandig ondernemer ben?",
        answer: "Utrecht biedt ook schuldhulpverlening aan zzp'ers en zelfstandig ondernemers. Er is extra expertise beschikbaar voor de specifieke situatie van ondernemers, zoals BTW-schulden en zakelijke schulden.",
      },
    ],
    tips: [
      {
        title: "U-pas",
        description: "Met de U-pas krijg je korting op sport, cultuur en openbaar vervoer in Utrecht. Bij een laag inkomen is de pas gratis. Aanvragen via utrecht.nl.",
        icon: "Ticket",
      },
      {
        title: "Individuele inkomenstoeslag",
        description: "Als je al langer dan 3 jaar een laag inkomen hebt, kun je bij de gemeente Utrecht een individuele inkomenstoeslag aanvragen. Dit is een eenmalig bedrag dat je vrij kunt besteden.",
        icon: "Coins",
      },
      {
        title: "Gratis juridisch spreekuur",
        description: "Het Juridisch Loket Utrecht biedt gratis juridisch advies. Handig als je vragen hebt over je rechten bij incasso, loonbeslag of andere juridische aspecten van je schulden.",
        icon: "Scale",
      },
      {
        title: "Voedselbank Utrecht",
        description: "Als je onvoldoende geld hebt voor boodschappen, kun je via het buurtteam aangemeld worden bij de Voedselbank Utrecht. Ze hebben meerdere uitgiftepunten in de stad.",
        icon: "ShoppingCart",
      },
    ],
    ctaText: "Krijg grip op je rekeningen in Utrecht",
    gemeenteUrl: "https://www.utrecht.nl/zorg-en-onderwijs/hulp-bij-schulden/",
    coordinates: { lat: 52.0907, lng: 5.1214 },
  },

  eindhoven: {
    slug: "eindhoven",
    name: "Eindhoven",
    province: "Noord-Brabant",
    population: "240.000+",
    accentColor: "#1E3A8A",
    accentColorLight: "#E8EDF8",
    accentColorName: "Eindhovens blauw",
    unsplashQuery: "Eindhoven Netherlands technology city skyline",
    unsplashQueryOrgs: "Eindhoven Brabant Netherlands street",
    metaTitle: "Schuldhulp Eindhoven — Hulp bij schulden in Eindhoven",
    metaDescription: "Schulden in Eindhoven? Ontdek gratis hulporganisaties, schuldhulpverlening en tips om financieel gezond te worden. PayWatch geeft je overzicht en waarschuwt op tijd.",
    heroTitle: "Schuldhulp in Eindhoven",
    heroSubtitle: "Alle hulp bij schulden in de Lichtstad",
    introTitle: "Schulden in Eindhoven: ook in de techstad liggen financiele problemen op de loer",
    introText: "Eindhoven groeit snel. De techsector bloeit, er worden nieuwe wijken gebouwd en de stad trekt mensen van over de hele wereld aan. Maar niet iedereen deelt mee in die groei. In Eindhoven wonen ook veel mensen met een laag inkomen die moeite hebben om rond te komen. De gemeente Eindhoven zet zich actief in voor schuldhulpverlening en heeft een stevig netwerk van hulporganisaties opgebouwd.",
    debtContext: "Achter het succes van de Brainportregio schuilt een andere werkelijkheid. In wijken als Woensel-Zuid, Gestel en Tongelre worstelen veel huishoudens met schulden. De snelle groei van de stad heeft de huurprijzen omhooggeduwd. Tegelijkertijd zijn er in Eindhoven veel arbeidsmigranten en expats die niet altijd goed op de hoogte zijn van hun rechten en beschikbare hulp. De gemeente zet daarom extra in op bereikbaarheid en meertalige voorlichting.",
    localSituation: "Eindhoven werkt met WIJeindhoven, een organisatie die in elke wijk aanwezig is en fungeert als eerste aanspreekpunt voor alle sociale vragen, inclusief geldzorgen. De stad werkt nauw samen met woningcorporaties Woonbedrijf en 'thuis om betalingsachterstanden bij huurders vroegtijdig te signaleren. Ook is er een speciaal loket voor ondernemers met schulden, in samenwerking met de Kamer van Koophandel.",
    statsHighlight: "In Woensel-Zuid heeft bijna 1 op de 5 huishoudens te maken met problematische schulden",
    organizations: [
      {
        name: "Schuldhulpverlening Eindhoven (gemeente)",
        url: "https://www.eindhoven.nl/schulden",
        type: "Gemeentelijke schuldhulp",
        description: "De gemeente Eindhoven biedt volledige schuldhulpverlening: van intake en budgetcoaching tot schuldregelingen en doorverwijzing naar WSNP. Aanmelden via WIJeindhoven of telefonisch.",
        phone: "14 040",
      },
      {
        name: "WIJeindhoven",
        url: "https://www.wijeindhoven.nl",
        type: "Sociaal wijkteam",
        description: "WIJeindhoven is er voor alle Eindhovenaren met vragen over geld, werk, opvoeding en meer. In elk stadsdeel is een team aanwezig. Je kunt zonder afspraak binnenlopen voor een eerste gesprek over je geldzorgen.",
        phone: "040 212 4040",
      },
      {
        name: "Lumens",
        url: "https://www.lumens.nu",
        type: "Welzijnsorganisatie",
        description: "Lumens biedt informele schuldhulp, thuisadministratie en maatjesprojecten. Getrainde vrijwilligers helpen je met het ordenen van je financien en begeleiden je naar professionele hulp als dat nodig is.",
      },
      {
        name: "PlusTeam Eindhoven",
        url: "https://www.plusteameindhoven.nl",
        type: "Gespecialiseerde hulp",
        description: "Voor complexere situaties waar schulden samengaan met andere problemen, zoals verslaving, psychische klachten of huiselijk geweld. Het PlusTeam biedt integrale ondersteuning.",
      },
    ],
    faq: [
      {
        question: "Hoe vraag ik schuldhulpverlening aan in Eindhoven?",
        answer: "Loop binnen bij WIJeindhoven in je wijk, bel 14 040 of meld je aan via eindhoven.nl/schulden. Je krijgt een eerste gesprek waarin je situatie wordt bekeken. Daarna wordt besloten welke hulp het best bij je past.",
      },
      {
        question: "Is er hulp voor arbeidsmigranten met schulden in Eindhoven?",
        answer: "Ja, Eindhoven heeft speciale aandacht voor arbeidsmigranten en expats. Er is hulp beschikbaar in het Engels en via tolken ook in andere talen. WIJeindhoven heeft ervaring met de specifieke problemen waar internationale inwoners tegenaan lopen.",
      },
      {
        question: "Wat doet WIJeindhoven precies bij geldzorgen?",
        answer: "WIJeindhoven is je eerste aanspreekpunt. Ze luisteren naar je verhaal, brengen je situatie in kaart en bepalen welke hulp je nodig hebt. Dit kan varieren van een eenmalig adviesgesprek tot een verwijzing naar formele schuldhulpverlening.",
      },
      {
        question: "Kan ik hulp krijgen als ondernemer in Eindhoven?",
        answer: "Zeker. Eindhoven heeft een speciaal loket voor ondernemers met schulden, in samenwerking met de Kamer van Koophandel. Er is expertise beschikbaar voor zakelijke schulden, BTW-problematiek en de combinatie van prive- en zakelijke schulden.",
      },
      {
        question: "Hoe lang duurt het voordat ik geholpen word?",
        answer: "Voor een eerste gesprek bij WIJeindhoven kun je vaak zonder afspraak terecht. Voor een formeel schuldhulptraject geldt een wettelijke termijn van maximaal 4 weken na aanmelding voor het eerste gesprek. In de praktijk lukt dit in Eindhoven meestal sneller.",
      },
      {
        question: "Moet ik al mijn schulden kennen voordat ik hulp kan vragen?",
        answer: "Nee, je hoeft niet een compleet overzicht te hebben. De schuldhulpverlener helpt je juist met het in kaart brengen van al je schulden. Neem mee wat je hebt aan brieven en post, en de rest wordt uitgezocht.",
      },
    ],
    tips: [
      {
        title: "Eindhoven Sportief en Cultureel",
        description: "Met een laag inkomen kun je in Eindhoven deelnemen aan diverse sport- en cultuurregelingen. Dit zijn geen leningen, maar vergoedingen. Vraag ernaar bij WIJeindhoven.",
        icon: "Trophy",
      },
      {
        title: "Energiecoach Eindhoven",
        description: "Gratis energiecoaches helpen je om je energieverbruik te verlagen. Ze komen bij je thuis langs en geven concrete tips. Dit kan je tientallen euros per maand besparen.",
        icon: "Zap",
      },
      {
        title: "Kwijtschelding gemeentelijke belastingen",
        description: "Eindhovenaren met een laag inkomen kunnen kwijtschelding aanvragen voor gemeentelijke belastingen en afvalstoffenheffing. Doe dit elk jaar opnieuw via eindhoven.nl.",
        icon: "BadgePercent",
      },
      {
        title: "Samen rond de tafel met schuldeisers",
        description: "In Eindhoven wordt steeds vaker gewerkt met een 'breed moratorium': een pauze van afbetalingen aan alle schuldeisers tegelijk, zodat je rust krijgt om een plan te maken.",
        icon: "Users",
      },
    ],
    ctaText: "Begin vandaag met overzicht in je rekeningen",
    gemeenteUrl: "https://www.eindhoven.nl/schulden",
    coordinates: { lat: 51.4416, lng: 5.4697 },
  },
};

/* ── Helper: get city by slug ── */
export function getCityBySlug(slug: string): CityPage | undefined {
  return cityPages[slug as CitySlug];
}

/* ── All city pages as array ── */
export function getAllCityPages(): CityPage[] {
  return Object.values(cityPages);
}
