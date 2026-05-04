import Link from 'next/link';
import { ArrowRight, Building2, Users, Landmark, CheckCircle2, TrendingDown, Clock, Shield, BarChart3, Phone, Mail } from 'lucide-react';

export const metadata = {
  title: 'PayWatch voor organisaties | Grip op schulden van uw klanten',
  description: 'PayWatch helpt incassobureaus, gemeentes en hulporganisaties bij het voorkomen en oplossen van schulden. Realtime inzicht, slimme tools, betere uitkomsten.',
};

const SEGMENTS = [
  {
    href: '/b2b/incasso',
    icon: Building2,
    label: 'Incassobureaus',
    tagline: 'Minder afschrijvingen, hogere slagingsgraad',
    description: 'Geef klanten de tools om hun betalingsachterstand zelf te begrijpen en op te lossen — vóórdat escalatie nodig is.',
    stats: [{ value: '34%', label: 'minder escalaties' }, { value: '2.4×', label: 'hogere terugbetaalrate' }],
    color: 'blue',
  },
  {
    href: '/b2b/gemeente',
    icon: Landmark,
    label: 'Gemeentes',
    tagline: 'Schuldhulp die werkt voor uw inwoners',
    description: 'Verbind inwoners met de juiste hulp op het juiste moment. Vroegsignalering, toeslagencheck en doorverwijzing in één platform.',
    stats: [{ value: '68%', label: 'eerder gesignaleerd' }, { value: '3 min', label: 'gemiddelde doorverwijzing' }],
    color: 'green',
  },
  {
    href: '/b2b/hulporganisatie',
    icon: Users,
    label: 'Hulporganisaties',
    tagline: 'Meer impact, minder administratie',
    description: 'Coaches krijgen realtime inzicht in de financiële situatie van cliënten. Minder papierwerk, meer tijd voor het echte werk.',
    stats: [{ value: '5 uur', label: 'bespaard per cliënt/week' }, { value: '89%', label: 'cliënttevredenheid' }],
    color: 'purple',
  },
];

const STATS = [
  { value: '74', label: 'actieve gebruikers', suffix: '+' },
  { value: '1.2M', label: 'aan schulden gemonitord', prefix: '€' },
  { value: '23', label: 'organisaties actief', suffix: '+' },
  { value: '4.8', label: 'gemiddelde beoordeling', suffix: '/5' },
];

const HOW = [
  {
    step: '01',
    title: 'Koppel uw organisatie',
    body: 'Maak een organisatieprofiel aan en nodig coaches of medewerkers uit. Klaar in minder dan een dag.',
  },
  {
    step: '02',
    title: 'Verbind met klanten',
    body: 'Klanten verbinden via een uitnodigingslink of code. Zij bepalen welke gegevens ze delen — transparant en AVG-proof.',
  },
  {
    step: '03',
    title: 'Werk samen aan oplossingen',
    body: 'Coaches zien realtime inzichten, sturen berichten en monitoren voortgang — alles vanuit één dashboard.',
  },
];

export default function B2BPage() {
  return (
    <main className="min-h-screen bg-white font-sans">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pw-navy flex items-center justify-center">
              <span className="text-white font-extrabold text-sm">P</span>
            </div>
            <span className="font-extrabold text-pw-navy text-lg tracking-tight">PayWatch</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-[14px] font-medium text-pw-muted">
            <Link href="/b2b/incasso" className="hover:text-pw-navy transition-colors">Incasso</Link>
            <Link href="/b2b/gemeente" className="hover:text-pw-navy transition-colors">Gemeente</Link>
            <Link href="/b2b/hulporganisatie" className="hover:text-pw-navy transition-colors">Hulporganisatie</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="https://b2b.paywatch.app/login" className="hidden md:block text-[14px] font-semibold text-pw-navy hover:text-pw-blue transition-colors">
              Inloggen
            </Link>
            <Link href="mailto:info@paywatch.nl" className="bg-pw-navy text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-pw-blue transition-colors">
              Demo aanvragen
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-pw-blue/8 text-pw-blue rounded-full px-4 py-1.5 text-[13px] font-semibold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-pw-blue"></span>
              Voor organisaties
            </div>
            <h1 className="text-[48px] md:text-[64px] font-extrabold text-pw-navy leading-[1.05] tracking-tight mb-6">
              Grip op schulden.<br />
              <span className="text-pw-blue">Samen met uw klant.</span>
            </h1>
            <p className="text-[18px] text-pw-muted leading-relaxed max-w-2xl mb-10">
              PayWatch geeft incassobureaus, gemeentes en hulporganisaties realtime inzicht in de financiële situatie van hun klanten — met toestemming en transparantie.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="mailto:info@paywatch.nl" className="inline-flex items-center gap-2 bg-pw-navy text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-pw-blue transition-colors text-[15px]">
                Demo aanvragen
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="https://b2b.paywatch.app" className="inline-flex items-center gap-2 text-pw-navy font-semibold px-6 py-3.5 rounded-xl border border-gray-200 hover:border-pw-blue hover:text-pw-blue transition-colors text-[15px]">
                Bekijk het platform
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-gray-100 bg-pw-bg/50 py-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-[32px] font-extrabold text-pw-navy tracking-tight">
                {s.prefix}{s.value}{s.suffix}
              </p>
              <p className="text-[13px] text-pw-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Segment cards */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-[32px] font-extrabold text-pw-navy tracking-tight mb-3">
              Voor wie is PayWatch?
            </h2>
            <p className="text-[16px] text-pw-muted max-w-xl">
              We werken samen met organisaties die dagelijks te maken hebben met schulden en financiële kwetsbaarheid.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {SEGMENTS.map((seg) => {
              const Icon = seg.icon;
              const colorMap = {
                blue: { bg: 'bg-blue-50', icon: 'bg-pw-blue text-white', border: 'hover:border-pw-blue', stat: 'text-pw-blue' },
                green: { bg: 'bg-green-50', icon: 'bg-pw-green text-white', border: 'hover:border-pw-green', stat: 'text-pw-green' },
                purple: { bg: 'bg-purple-50', icon: 'bg-pw-purple text-white', border: 'hover:border-pw-purple', stat: 'text-pw-purple' },
              };
              const c = colorMap[seg.color as keyof typeof colorMap];
              return (
                <Link key={seg.href} href={seg.href} className={`group block bg-white rounded-2xl border border-gray-100 p-6 transition-all hover:shadow-lg ${c.border}`}>
                  <div className={`w-10 h-10 rounded-xl ${c.icon} flex items-center justify-center mb-4`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-pw-muted mb-1">{seg.label}</p>
                  <h3 className="text-[20px] font-extrabold text-pw-navy tracking-tight mb-3 leading-snug">{seg.tagline}</h3>
                  <p className="text-[14px] text-pw-muted leading-relaxed mb-6">{seg.description}</p>
                  <div className="flex gap-4 mb-6">
                    {seg.stats.map((st) => (
                      <div key={st.label}>
                        <p className={`text-[22px] font-extrabold tracking-tight ${c.stat}`}>{st.value}</p>
                        <p className="text-[11px] text-pw-muted">{st.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-[13px] font-semibold text-pw-navy group-hover:text-pw-blue transition-colors">
                    Meer informatie <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-pw-bg/50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-[32px] font-extrabold text-pw-navy tracking-tight mb-3">Hoe werkt het?</h2>
            <p className="text-[16px] text-pw-muted">Binnen een dag operationeel.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW.map((h) => (
              <div key={h.step} className="flex gap-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-pw-navy text-white flex items-center justify-center text-[12px] font-extrabold">
                  {h.step}
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-pw-navy mb-2">{h.title}</h3>
                  <p className="text-[14px] text-pw-muted leading-relaxed">{h.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-[32px] font-extrabold text-pw-navy tracking-tight mb-4">
                AVG-proof. Veilig. Transparant.
              </h2>
              <p className="text-[16px] text-pw-muted leading-relaxed mb-8">
                Klanten bepalen altijd zelf wat ze delen. Alle gegevens staan op Europese servers en worden nooit zonder toestemming gedeeld.
              </p>
              <ul className="space-y-3">
                {[
                  'Expliciete toestemming per koppeling',
                  'Gegevens op Nederlandse/EU-servers',
                  'KVK-geregistreerd in Rotterdam',
                  'Geen data verkoop aan derden',
                  'Volledig auditeerbaar',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[14px] text-pw-text">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-pw-green" />
                    {item}
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
                <div key={label} className="bg-pw-bg rounded-2xl p-5">
                  <Icon className="h-5 w-5 text-pw-blue mb-3" />
                  <p className="text-[14px] font-bold text-pw-navy">{label}</p>
                  <p className="text-[12px] text-pw-muted mt-1">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-pw-navy">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-[36px] font-extrabold text-white tracking-tight mb-4">
            Klaar om samen te werken?
          </h2>
          <p className="text-[16px] text-white/70 mb-10 max-w-lg mx-auto">
            Plan een vrijblijvend kennismakingsgesprek. We laten zien hoe PayWatch werkt voor uw organisatie.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="mailto:info@paywatch.nl" className="inline-flex items-center gap-2 bg-white text-pw-navy font-semibold px-6 py-3.5 rounded-xl hover:bg-pw-blue hover:text-white transition-colors text-[15px]">
              <Mail className="h-4 w-4" />
              info@paywatch.nl
            </Link>
            <Link href="https://b2b.paywatch.app" className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-[15px]">
              Platform bekijken
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-pw-navy flex items-center justify-center">
              <span className="text-white font-extrabold text-xs">P</span>
            </div>
            <span className="font-bold text-pw-navy text-sm">PayWatch</span>
            <span className="text-pw-muted text-sm ml-2">KVK: 83474889 · Rotterdam</span>
          </div>
          <div className="flex items-center gap-6 text-[13px] text-pw-muted">
            <Link href="/b2b/incasso" className="hover:text-pw-navy transition-colors">Incasso</Link>
            <Link href="/b2b/gemeente" className="hover:text-pw-navy transition-colors">Gemeente</Link>
            <Link href="/b2b/hulporganisatie" className="hover:text-pw-navy transition-colors">Hulporganisaties</Link>
            <Link href="mailto:info@paywatch.nl" className="hover:text-pw-navy transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
