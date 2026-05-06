import Link from 'next/link';
import { ArrowLeft, Users, CheckCircle2, MessageSquare, FileText, BarChart3, Clock, Shield, Calendar, Mail } from 'lucide-react';

const DEMO_LINK = 'https://calendly.com/samba-paywatch/demo';

export const metadata = {
  title: 'PayWatch voor Hulporganisaties | Meer impact, minder administratie',
  description: 'Geef schuldhulpcoaches realtime inzicht in de situatie van cliënten. 5 uur minder administratie per cliënt per week. Minder papierwerk, betere begeleiding.',
  alternates: { canonical: 'https://paywatch.app/b2b/hulporganisatie' },
  openGraph: {
    title: 'PayWatch voor Hulporganisaties',
    description: '5 uur bespaard per cliënt/week. 89% cliënttevredenheid. Digitaal dossier en directe communicatie voor schuldhulpcoaches.',
    url: 'https://paywatch.app/b2b/hulporganisatie',
    type: 'website',
  },
};

const FEATURES = [
  { icon: BarChart3, title: 'Cliëntdashboard', body: 'Alles op één scherm: inkomsten, vaste lasten, schulden en actiepunten per cliënt.' },
  { icon: MessageSquare, title: 'Directe communicatie', body: 'Stuur berichten direct via de PayWatch-app van de cliënt — geen e-mail, geen vertragingen.' },
  { icon: FileText, title: 'Digitale dossiervoering', body: 'Automatische registratie van contactmomenten, betalingen en mijlpalen.' },
  { icon: Clock, title: 'Tijdsbesparing', body: 'Gemiddeld 5 uur minder administratie per cliënt per week door automatische gegevensverzameling.' },
  { icon: Shield, title: 'AVG-proof delen', body: 'Cliënten geven expliciete toestemming voor elke koppeling. Volledige controle over hun eigen data.' },
  { icon: CheckCircle2, title: 'Voortgangsmonitoring', body: 'Stel doelen in, volg voortgang en vier successen samen met je cliënt.' },
];

const OUTCOMES = [
  { value: '5 uur', label: 'bespaard per cliënt/week' },
  { value: '89%', label: 'cliënttevredenheid' },
  { value: '3×', label: 'snellere dossieropbouw' },
  { value: '61%', label: 'hogere slagingsgraad' },
];

export default function HulporganisatiePage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'PayWatch', item: 'https://paywatch.app' },
      { '@type': 'ListItem', position: 2, name: 'Voor organisaties', item: 'https://paywatch.app/b2b' },
      { '@type': 'ListItem', position: 3, name: 'Hulporganisaties', item: 'https://paywatch.app/b2b/hulporganisatie' },
    ],
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'PayWatch voor Hulporganisaties',
    description: 'Digitaal cliëntdossier, directe communicatie en voortgangsmonitoring voor schuldhulpcoaches bij kredietbanken, schuldhulpmaatje en buurtteams.',
    provider: { '@type': 'Organization', name: 'PayWatch', url: 'https://paywatch.app' },
    areaServed: { '@type': 'Country', name: 'Netherlands' },
    audience: { '@type': 'Audience', audienceType: 'Hulporganisaties schuldhulpverlening' },
    url: 'https://paywatch.app/b2b/hulporganisatie',
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Hoeveel tijd bespaart PayWatch coaches?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Gemiddeld 5 uur per cliënt per week. Automatische registratie van contactmomenten, betalingen en documentatie vervangt handmatige invoer.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is er een gratis pilot beschikbaar voor hulporganisaties?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ja. We bieden een gratis pilot van 30 dagen aan voor organisaties die PayWatch willen testen. Plan een demo om de mogelijkheden te bespreken.',
        },
      },
      {
        '@type': 'Question',
        name: 'Voor welke hulporganisaties is PayWatch geschikt?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'PayWatch is geschikt voor kredietbanken, Schuldhulpmaatje, sociaal raadslieden, buurtteams, voedselbanken, MEE en andere organisaties die schuldhulpverlening bieden.',
        },
      },
    ],
  };

  return (
    <div className="bg-[var(--bg)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="px-4 sm:px-6 pt-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/b2b" className="inline-flex items-center gap-2 text-[14px] font-medium text-[var(--muted)] hover:text-[var(--navy)] transition-colors">
            <ArrowLeft className="h-4 w-4" /> Terug naar overzicht
          </Link>
        </div>
      </div>

      <section className="px-4 sm:px-6 pt-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[var(--purple)] flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            <span className="text-[12px] font-bold uppercase tracking-widest text-[var(--purple)]">Hulporganisaties</span>
          </div>
          <h1 className="text-[38px] sm:text-[52px] font-extrabold text-[var(--navy)] leading-[1.05] tracking-tight mb-5">
            Meer tijd voor<br />
            <span className="text-[var(--purple)]">het echte werk.</span>
          </h1>
          <p className="text-[17px] text-[var(--muted)] leading-relaxed mb-10 max-w-2xl">
            PayWatch neemt de administratie van schuldhulpcoaches over. Geen papieren dossiers, geen handmatige data-invoer — alleen realtime inzicht en directe communicatie met je cliënt.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href={DEMO_LINK} target="_blank"
              className="inline-flex items-center gap-2 bg-[var(--purple)] text-white font-semibold px-6 py-3 rounded-xl text-[15px] hover:opacity-90 transition-opacity">
              <Calendar className="h-4 w-4" /> Demo inplannen
            </Link>
            <Link href="https://b2b.paywatch.app"
              className="inline-flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] text-[var(--navy)] font-semibold px-6 py-3 rounded-xl text-[15px] hover:border-[var(--purple)] transition-colors">
              Platform bekijken
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--purple-light)] py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {OUTCOMES.map(o => (
            <div key={o.label}>
              <p className="text-[34px] font-extrabold text-[var(--navy)] tracking-tight">{o.value}</p>
              <p className="text-[13px] text-[var(--muted)] mt-1">{o.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[26px] font-extrabold text-[var(--navy)] tracking-tight mb-2">Tools voor elke coach</h2>
          <p className="text-[14px] text-[var(--muted)] mb-10">Van kredietbank tot buurtteam — PayWatch past zich aan jullie werkwijze aan.</p>
          <div className="grid md:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
                <div className="w-9 h-9 rounded-lg bg-[var(--purple-light)] flex items-center justify-center mb-4">
                  <Icon className="h-4 w-4 text-[var(--purple)]" />
                </div>
                <h3 className="text-[14px] font-bold text-[var(--navy)] mb-2">{title}</h3>
                <p className="text-[13px] text-[var(--muted)] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto">
          <p className="text-[13px] text-[var(--muted)] mb-4 font-medium">Passend voor organisaties zoals</p>
          <div className="flex flex-wrap gap-2.5">
            {['Kredietbank Nederland', 'Schuldhulpmaatje', 'Sociaal raadslieden', 'Voedselbanken', 'Buurtteams', 'MEE'].map(org => (
              <span key={org} className="bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] text-[13px] font-medium px-4 py-1.5 rounded-full">{org}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 px-4 sm:px-6 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-[22px] font-extrabold text-[var(--navy)] tracking-tight mb-8">Veelgestelde vragen</h2>
          <div className="space-y-5">
            {[
              { q: 'Hoeveel tijd bespaart PayWatch coaches?', a: 'Gemiddeld 5 uur per cliënt per week. Automatische registratie van contactmomenten, betalingen en documentatie vervangt handmatige invoer.' },
              { q: 'Is er een gratis pilot beschikbaar?', a: 'Ja. We bieden een gratis pilot van 30 dagen aan voor organisaties die PayWatch willen testen. Plan een demo om de mogelijkheden te bespreken.' },
              { q: 'Voor welke hulporganisaties is PayWatch geschikt?', a: 'PayWatch is geschikt voor kredietbanken, Schuldhulpmaatje, sociaal raadslieden, buurtteams, voedselbanken, MEE en andere organisaties die schuldhulpverlening bieden.' },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-[var(--border)] pb-5">
                <p className="text-[15px] font-bold text-[var(--navy)] mb-2">{q}</p>
                <p className="text-[14px] text-[var(--muted)] leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 bg-[var(--navy)]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-[22px] font-extrabold text-white tracking-tight mb-1">Gratis pilot beschikbaar</h2>
            <p className="text-[14px] text-white/60">Test PayWatch 30 dagen gratis binnen je organisatie.</p>
          </div>
          <div className="flex gap-3">
            <Link href={DEMO_LINK} target="_blank"
              className="inline-flex items-center gap-2 bg-[var(--purple)] text-white font-semibold px-5 py-2.5 rounded-xl text-[14px] hover:opacity-90 transition-opacity whitespace-nowrap">
              <Calendar className="h-4 w-4" /> Demo inplannen
            </Link>
            <Link href="mailto:info@paywatch.nl"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-5 py-2.5 rounded-xl text-[14px] hover:bg-white/20 transition-colors">
              <Mail className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
