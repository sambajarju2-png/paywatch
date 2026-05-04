import Link from 'next/link';
import { ArrowRight, Building2, Users, Landmark, CheckCircle2, TrendingDown, Clock, Shield, BarChart3, Mail } from 'lucide-react';

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
    accent: 'var(--blue)',
    accentLight: 'var(--blue-light)',
  },
  {
    href: '/b2b/gemeente',
    icon: Landmark,
    label: 'Gemeentes',
    tagline: 'Schuldhulp die werkt voor uw inwoners',
    description: 'Verbind inwoners met de juiste hulp op het juiste moment. Vroegsignalering, toeslagencheck en doorverwijzing in één platform.',
    stats: [{ value: '68%', label: 'eerder gesignaleerd' }, { value: '3 min', label: 'gemiddelde doorverwijzing' }],
    accent: 'var(--green)',
    accentLight: 'var(--green-light)',
  },
  {
    href: '/b2b/hulporganisatie',
    icon: Users,
    label: 'Hulporganisaties',
    tagline: 'Meer impact, minder administratie',
    description: 'Coaches krijgen realtime inzicht in de financiële situatie van cliënten. Minder papierwerk, meer tijd voor het echte werk.',
    stats: [{ value: '5 uur', label: 'bespaard per cliënt/week' }, { value: '89%', label: 'cliënttevredenheid' }],
    accent: 'var(--purple)',
    accentLight: 'var(--purple-light)',
  },
];

const STATS = [
  { value: '74', label: 'actieve gebruikers', suffix: '+' },
  { value: '1.2M', label: 'aan schulden gemonitord', prefix: '€' },
  { value: '23', label: 'organisaties actief', suffix: '+' },
  { value: '4.8', label: 'gemiddelde beoordeling', suffix: '/5' },
];

const HOW = [
  { step: '01', title: 'Koppel uw organisatie', body: 'Maak een organisatieprofiel aan en nodig coaches of medewerkers uit. Klaar in minder dan een dag.' },
  { step: '02', title: 'Verbind met klanten', body: 'Klanten verbinden via een uitnodigingslink of code. Zij bepalen welke gegevens ze delen — transparant en AVG-proof.' },
  { step: '03', title: 'Werk samen aan oplossingen', body: 'Coaches zien realtime inzichten, sturen berichten en monitoren voortgang — alles vanuit één dashboard.' },
];

export default function B2BPage() {
  return (
    <div>
      {/* Hero */}
      <section className="pt-16 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-semibold mb-6"
              style={{ background: 'var(--blue-light)', color: 'var(--blue)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--blue)' }}></span>
              Voor organisaties
            </div>
            <h1 className="text-[48px] md:text-[60px] font-extrabold leading-[1.05] tracking-tight mb-6"
              style={{ color: 'var(--navy)' }}>
              Grip op schulden.<br />
              <span style={{ color: 'var(--blue)' }}>Samen met uw klant.</span>
            </h1>
            <p className="text-[18px] leading-relaxed max-w-2xl mb-10" style={{ color: 'var(--text)', opacity: 0.7 }}>
              PayWatch geeft incassobureaus, gemeentes en hulporganisaties realtime inzicht in de financiële situatie van hun klanten — met toestemming en transparantie.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="mailto:info@paywatch.nl"
                className="inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-xl text-[15px] text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--navy)' }}>
                Demo aanvragen <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="https://b2b.paywatch.app"
                className="inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-xl border text-[15px] transition-colors hover:border-[var(--blue)]"
                style={{ borderColor: 'var(--border, #E2E8F0)', color: 'var(--navy)' }}>
                Bekijk het platform
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 px-6 border-y" style={{ borderColor: 'var(--border, #E2E8F0)', background: 'var(--blue-light)' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-[32px] font-extrabold tracking-tight" style={{ color: 'var(--navy)' }}>
                {s.prefix}{s.value}{s.suffix}
              </p>
              <p className="text-[13px] mt-1" style={{ color: 'var(--text)', opacity: 0.6 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Segment cards */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-[32px] font-extrabold tracking-tight mb-3" style={{ color: 'var(--navy)' }}>
              Voor wie is PayWatch?
            </h2>
            <p className="text-[16px] max-w-xl" style={{ color: 'var(--text)', opacity: 0.7 }}>
              We werken samen met organisaties die dagelijks te maken hebben met schulden en financiële kwetsbaarheid.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {SEGMENTS.map((seg) => {
              const Icon = seg.icon;
              return (
                <Link key={seg.href} href={seg.href}
                  className="group block rounded-2xl border p-6 transition-all hover:shadow-lg"
                  style={{ borderColor: 'var(--border, #E2E8F0)', background: 'var(--surface, #fff)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-white"
                    style={{ background: seg.accent }}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: seg.accent }}>{seg.label}</p>
                  <h3 className="text-[19px] font-extrabold tracking-tight mb-3 leading-snug" style={{ color: 'var(--navy)' }}>{seg.tagline}</h3>
                  <p className="text-[14px] leading-relaxed mb-6" style={{ color: 'var(--text)', opacity: 0.7 }}>{seg.description}</p>
                  <div className="flex gap-4 mb-6">
                    {seg.stats.map((st) => (
                      <div key={st.label}>
                        <p className="text-[22px] font-extrabold tracking-tight" style={{ color: seg.accent }}>{st.value}</p>
                        <p className="text-[11px]" style={{ color: 'var(--text)', opacity: 0.6 }}>{st.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-[13px] font-semibold transition-colors"
                    style={{ color: 'var(--navy)' }}>
                    Meer informatie <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6" style={{ background: 'var(--blue-light)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-[32px] font-extrabold tracking-tight mb-3" style={{ color: 'var(--navy)' }}>Hoe werkt het?</h2>
            <p className="text-[16px]" style={{ color: 'var(--text)', opacity: 0.7 }}>Binnen een dag operationeel.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW.map((h) => (
              <div key={h.step} className="flex gap-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-extrabold text-white"
                  style={{ background: 'var(--navy)' }}>
                  {h.step}
                </div>
                <div>
                  <h3 className="text-[16px] font-bold mb-2" style={{ color: 'var(--navy)' }}>{h.title}</h3>
                  <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text)', opacity: 0.7 }}>{h.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-[32px] font-extrabold tracking-tight mb-4" style={{ color: 'var(--navy)' }}>
                AVG-proof. Veilig. Transparant.
              </h2>
              <p className="text-[16px] leading-relaxed mb-8" style={{ color: 'var(--text)', opacity: 0.7 }}>
                Klanten bepalen altijd zelf wat ze delen. Alle gegevens staan op Europese servers en worden nooit zonder toestemming gedeeld.
              </p>
              <ul className="space-y-3">
                {['Expliciete toestemming per koppeling', 'Gegevens op Nederlandse/EU-servers', 'KVK-geregistreerd in Rotterdam', 'Geen data verkoop aan derden', 'Volledig auditeerbaar'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[14px]" style={{ color: 'var(--text)' }}>
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--green)' }} />
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
                <div key={label} className="rounded-2xl p-5" style={{ background: 'var(--blue-light)' }}>
                  <Icon className="h-5 w-5 mb-3" style={{ color: 'var(--blue)' }} />
                  <p className="text-[14px] font-bold" style={{ color: 'var(--navy)' }}>{label}</p>
                  <p className="text-[12px] mt-1" style={{ color: 'var(--text)', opacity: 0.6 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6" style={{ background: 'var(--navy)' }}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-[36px] font-extrabold text-white tracking-tight mb-4">Klaar om samen te werken?</h2>
          <p className="text-[16px] text-white/70 mb-10 max-w-lg mx-auto">
            Plan een vrijblijvend kennismakingsgesprek. We laten zien hoe PayWatch werkt voor uw organisatie.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="mailto:info@paywatch.nl"
              className="inline-flex items-center gap-2 bg-white font-semibold px-6 py-3.5 rounded-xl text-[15px] hover:opacity-90 transition-opacity"
              style={{ color: 'var(--navy)' }}>
              <Mail className="h-4 w-4" /> info@paywatch.nl
            </Link>
            <Link href="https://b2b.paywatch.app"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3.5 rounded-xl text-[15px] hover:bg-white/10 transition-colors">
              Platform bekijken <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
