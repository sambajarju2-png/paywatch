import Link from 'next/link';
import { ArrowRight, Building2, Users, Landmark, CheckCircle2, TrendingDown, Clock, Shield, BarChart3, Calendar, Mail } from 'lucide-react';

const DEMO_LINK = 'https://calendly.com/samba-paywatch/demo';

export const metadata = {
  title: 'PayWatch voor organisaties | Grip op schulden van je klanten',
  description: 'PayWatch helpt incassobureaus, gemeentes en hulporganisaties bij het voorkomen en oplossen van schulden. Realtime inzicht, slimme tools, betere uitkomsten.',
  alternates: { canonical: 'https://paywatch.app/b2b' },
  openGraph: {
    title: 'PayWatch voor organisaties',
    description: 'Realtime inzicht in schulden van je klanten. Voor incassobureaus, gemeentes en hulporganisaties.',
    url: 'https://paywatch.app/b2b',
    type: 'website',
  },
};

const SEGMENTS = [
  {
    href: '/b2b/incasso',
    icon: Building2,
    label: 'Incassobureaus',
    tagline: 'Minder afschrijvingen, hogere slagingsgraad',
    description: 'Geef klanten de tools om hun betalingsachterstand zelf te begrijpen en op te lossen — vóórdat escalatie nodig is.',
    stats: [{ value: '34%', label: 'minder escalaties' }, { value: '2.4×', label: 'hogere terugbetaalrate' }],
  },
  {
    href: '/b2b/gemeente',
    icon: Landmark,
    label: 'Gemeentes',
    tagline: 'Schuldhulp die werkt voor je inwoners',
    description: 'Verbind inwoners met de juiste hulp op het juiste moment. Vroegsignalering, toeslagencheck en doorverwijzing in één platform.',
    stats: [{ value: '68%', label: 'eerder gesignaleerd' }, { value: '3 min', label: 'gemiddelde doorverwijzing' }],
  },
  {
    href: '/b2b/hulporganisatie',
    icon: Users,
    label: 'Hulporganisaties',
    tagline: 'Meer impact, minder administratie',
    description: 'Coaches krijgen realtime inzicht in de financiële situatie van cliënten. Minder papierwerk, meer tijd voor het echte werk.',
    stats: [{ value: '5 uur', label: 'bespaard per cliënt/week' }, { value: '89%', label: 'cliënttevredenheid' }],
  },
];

const HOW = [
  { step: '01', title: 'Koppel je organisatie', body: 'Maak een organisatieprofiel aan en nodig coaches of medewerkers uit. Klaar in minder dan een dag.' },
  { step: '02', title: 'Verbind met klanten', body: 'Klanten verbinden via een uitnodigingslink of code. Ze bepalen zelf welke gegevens ze delen — transparant en AVG-proof.' },
  { step: '03', title: 'Werk samen aan oplossingen', body: 'Coaches zien realtime inzichten, sturen berichten en monitoren voortgang — alles vanuit één dashboard.' },
];

export default function B2BPage() {
  // ── Structured Data ──────────────────────────────────────────────────────
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PayWatch',
    url: 'https://paywatch.app',
    logo: 'https://paywatch.app/icons/icon-192.png',
    description: 'PayWatch helpt incassobureaus, gemeentes en hulporganisaties bij het voorkomen en oplossen van schulden.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Rotterdam',
      addressCountry: 'NL',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'info@paywatch.nl',
    },
    sameAs: ['https://app.paywatch.app', 'https://b2b.paywatch.app'],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'PayWatch', item: 'https://paywatch.app' },
      { '@type': 'ListItem', position: 2, name: 'Voor organisaties', item: 'https://paywatch.app/b2b' },
    ],
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'PayWatch B2B Platform',
    description: 'SaaS platform voor incassobureaus, gemeentes en hulporganisaties voor schuldbeheer en vroegsignalering.',
    provider: { '@type': 'Organization', name: 'PayWatch', url: 'https://paywatch.app' },
    areaServed: { '@type': 'Country', name: 'Netherlands' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'PayWatch B2B diensten',
      itemListElement: SEGMENTS.map(s => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: `PayWatch voor ${s.label}`, url: `https://paywatch.app${s.href}` },
      })),
    },
  };

  return (
    <div className="bg-[var(--bg)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      {/* Hero */}
      <section className="px-4 sm:px-6 pt-12 sm:pt-20 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-semibold mb-6 bg-[var(--blue-light)] text-[var(--blue)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--blue)]" />
            Voor organisaties
          </div>
          <h1 className="text-[40px] sm:text-[56px] font-extrabold text-[var(--navy)] leading-[1.05] tracking-tight mb-5 max-w-3xl">
            Grip op schulden.<br />
            <span className="text-[var(--blue)]">Samen met je klant.</span>
          </h1>
          <p className="text-[17px] text-[var(--muted)] leading-relaxed max-w-2xl mb-10">
            PayWatch geeft incassobureaus, gemeentes en hulporganisaties realtime inzicht in de financiële situatie van hun klanten — met toestemming en transparantie.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href={DEMO_LINK} target="_blank"
              className="inline-flex items-center gap-2 bg-[var(--blue)] text-white font-semibold px-6 py-3 rounded-xl text-[15px] hover:opacity-90 transition-opacity">
              <Calendar className="h-4 w-4" /> Demo inplannen
            </Link>
            <Link href="https://b2b.paywatch.app"
              className="inline-flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] text-[var(--navy)] font-semibold px-6 py-3 rounded-xl text-[15px] hover:border-[var(--blue)] transition-colors">
              Platform bekijken <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[var(--border)] bg-[var(--surface)] py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { v: '74+', l: 'actieve gebruikers' },
            { v: '€1.2M', l: 'aan schulden gemonitord' },
            { v: '23+', l: 'organisaties actief' },
            { v: '4.8/5', l: 'gemiddelde beoordeling' },
          ].map(s => (
            <div key={s.l}>
              <p className="text-[30px] font-extrabold text-[var(--navy)] tracking-tight">{s.v}</p>
              <p className="text-[13px] text-[var(--muted)] mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Segment cards */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[28px] font-extrabold text-[var(--navy)] tracking-tight mb-2">Voor wie is PayWatch?</h2>
          <p className="text-[15px] text-[var(--muted)] mb-10 max-w-xl">
            We werken samen met organisaties die dagelijks te maken hebben met schulden en financiële kwetsbaarheid.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {SEGMENTS.map((seg) => {
              const Icon = seg.icon;
              return (
                <Link key={seg.href} href={seg.href}
                  className="group block bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 hover:border-[var(--blue)] hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[var(--blue-light)] flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-[var(--blue)]" />
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--blue)] mb-1">{seg.label}</p>
                  <h3 className="text-[18px] font-extrabold text-[var(--navy)] tracking-tight mb-3 leading-snug">{seg.tagline}</h3>
                  <p className="text-[13px] text-[var(--muted)] leading-relaxed mb-5">{seg.description}</p>
                  <div className="flex gap-5 mb-5">
                    {seg.stats.map((st) => (
                      <div key={st.label}>
                        <p className="text-[22px] font-extrabold text-[var(--blue)] tracking-tight">{st.value}</p>
                        <p className="text-[11px] text-[var(--muted)]">{st.label}</p>
                      </div>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--navy)] group-hover:text-[var(--blue)] transition-colors">
                    Meer informatie <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 sm:px-6 bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[28px] font-extrabold text-[var(--navy)] tracking-tight mb-2">Hoe werkt het?</h2>
          <p className="text-[15px] text-[var(--muted)] mb-10">Binnen een dag operationeel.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW.map((h) => (
              <div key={h.step} className="flex gap-4">
                <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-[var(--navy)] text-white flex items-center justify-center text-[12px] font-extrabold">
                  {h.step}
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[var(--navy)] mb-1.5">{h.title}</h3>
                  <p className="text-[13px] text-[var(--muted)] leading-relaxed">{h.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <h2 className="text-[28px] font-extrabold text-[var(--navy)] tracking-tight mb-4">AVG-proof. Veilig. Transparant.</h2>
            <p className="text-[15px] text-[var(--muted)] leading-relaxed mb-7">
              Klanten bepalen altijd zelf wat ze delen. Alle gegevens staan op Europese servers en worden nooit zonder toestemming gedeeld.
            </p>
            <ul className="space-y-2.5">
              {['Expliciete toestemming per koppeling', 'Gegevens op Nederlandse/EU-servers', 'KVK 83474889 · Rotterdam', 'Geen data verkoop aan derden', 'Volledig auditeerbaar'].map(i => (
                <li key={i} className="flex items-center gap-2.5 text-[14px] text-[var(--text)]">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[var(--green)]" /> {i}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Shield, label: 'AVG-compliant', desc: 'Privacywet volledig nageleefd' },
              { icon: TrendingDown, label: 'Vroeg signaleren', desc: 'Voorkom escalaties' },
              { icon: Clock, label: 'Realtime', desc: 'Altijd actueel inzicht' },
              { icon: BarChart3, label: 'Rapportages', desc: 'Exporteerbare analyses' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
                <Icon className="h-5 w-5 text-[var(--blue)] mb-3" />
                <p className="text-[14px] font-bold text-[var(--navy)]">{label}</p>
                <p className="text-[12px] text-[var(--muted)] mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 bg-[var(--navy)]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-[32px] font-extrabold text-white tracking-tight mb-3">Klaar om samen te werken?</h2>
          <p className="text-[15px] text-white/60 mb-8 max-w-md mx-auto">
            Plan een gratis demo van 30 minuten. Je ziet live hoe PayWatch werkt voor jouw organisatie.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={DEMO_LINK} target="_blank"
              className="inline-flex items-center gap-2 bg-[var(--blue)] text-white font-semibold px-6 py-3 rounded-xl text-[15px] hover:opacity-90 transition-opacity">
              <Calendar className="h-4 w-4" /> Demo inplannen
            </Link>
            <Link href="mailto:info@paywatch.nl"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl text-[15px] hover:bg-white/20 transition-colors">
              <Mail className="h-4 w-4" /> info@paywatch.nl
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
