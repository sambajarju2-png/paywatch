import Link from 'next/link';
import { ArrowRight, ArrowLeft, Users, CheckCircle2, MessageSquare, FileText, BarChart3, Clock, Shield, Mail } from 'lucide-react';

export const metadata = {
  title: 'PayWatch voor Hulporganisaties | Meer impact, minder administratie',
  description: 'Geef schuldhulpcoaches realtime inzicht in de situatie van cliënten. Minder papierwerk, betere begeleiding, hogere slagingsgraad.',
};

const FEATURES = [
  { icon: BarChart3, title: 'Cliëntdashboard', body: 'Alles op één scherm: inkomsten, vaste lasten, schulden en actiepunten per cliënt.' },
  { icon: MessageSquare, title: 'Directe communicatie', body: 'Stuur berichten direct via de PayWatch-app van de cliënt — geen e-mail, geen vertragingen.' },
  { icon: FileText, title: 'Digitale dossiervoering', body: 'Automatische registratie van contactmomenten, betalingen en mijlpalen.' },
  { icon: Clock, title: 'Tijdsbesparing', body: 'Gemiddeld 5 uur minder administratie per cliënt per week door automatische gegevensverzameling.' },
  { icon: Shield, title: 'AVG-proof delen', body: 'Cliënten geven expliciete toestemming voor elke koppeling. Volledige controle over hun eigen data.' },
  { icon: CheckCircle2, title: 'Voortgangsmonitoring', body: 'Zet doelen, volg voortgang en vier successen samen met uw cliënt.' },
];

const OUTCOMES = [
  { value: '5 uur', label: 'bespaard per cliënt/week' },
  { value: '89%', label: 'cliënttevredenheid' },
  { value: '3×', label: 'snellere dossieropbouw' },
  { value: '61%', label: 'hogere slagingsgraad traject' },
];

export default function HulporganisatiePage() {
  return (
    <div>
      <div className="px-6 pt-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/b2b" className="inline-flex items-center gap-2 text-[14px] font-medium hover:opacity-70 transition-opacity" style={{ color: 'var(--text)' }}>
            <ArrowLeft className="h-4 w-4" /> Terug naar overzicht
          </Link>
        </div>
      </div>

      <section className="pt-10 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: 'var(--purple)' }}>
              <Users className="h-4 w-4" />
            </div>
            <span className="text-[13px] font-bold uppercase tracking-widest" style={{ color: 'var(--purple)' }}>Hulporganisaties</span>
          </div>
          <h1 className="text-[48px] md:text-[60px] font-extrabold leading-[1.05] tracking-tight mb-6" style={{ color: 'var(--navy)' }}>
            Meer tijd voor<br />
            <span style={{ color: 'var(--purple)' }}>het echte werk.</span>
          </h1>
          <p className="text-[18px] leading-relaxed mb-10 max-w-2xl" style={{ color: 'var(--text)', opacity: 0.7 }}>
            PayWatch neemt de administratie van schuldhulpcoaches over. Geen papieren dossiers, geen handmatige data-invoer — alleen realtime inzicht en directe communicatie met uw cliënt.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="mailto:info@paywatch.nl" className="inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-xl text-[15px] text-white hover:opacity-90 transition-opacity" style={{ background: 'var(--purple)' }}>
              Gesprek inplannen <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="https://b2b.paywatch.app" className="inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-xl border text-[15px]" style={{ borderColor: 'var(--border, #E2E8F0)', color: 'var(--navy)' }}>
              Platform bekijken
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 border-y" style={{ borderColor: 'var(--border, #E2E8F0)', background: 'var(--purple-light)' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {OUTCOMES.map((o) => (
            <div key={o.label}>
              <p className="text-[36px] font-extrabold tracking-tight" style={{ color: 'var(--navy)' }}>{o.value}</p>
              <p className="text-[13px] mt-1" style={{ color: 'var(--text)', opacity: 0.6 }}>{o.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[28px] font-extrabold tracking-tight mb-2" style={{ color: 'var(--navy)' }}>Tools voor elke coach</h2>
          <p className="text-[15px] mb-12" style={{ color: 'var(--text)', opacity: 0.6 }}>Van kredietbank tot buurtteam — PayWatch past zich aan uw werkwijze aan.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl p-6" style={{ background: 'var(--purple-light)' }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4" style={{ background: 'rgba(124,58,237,0.12)' }}>
                  <Icon className="h-4 w-4" style={{ color: 'var(--purple)' }} />
                </div>
                <h3 className="text-[15px] font-bold mb-2" style={{ color: 'var(--navy)' }}>{title}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text)', opacity: 0.7 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-[32px] font-extrabold tracking-tight mb-4" style={{ color: 'var(--navy)' }}>Wil uw organisatie meedoen?</h2>
          <p className="text-[15px] mb-8" style={{ color: 'var(--text)', opacity: 0.6 }}>We bieden een gratis pilot voor organisaties die willen testen hoe PayWatch werkt in de praktijk.</p>
          <Link href="mailto:info@paywatch.nl" className="inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-xl text-[15px] text-white hover:opacity-90 transition-opacity" style={{ background: 'var(--purple)' }}>
            <Mail className="h-4 w-4" /> info@paywatch.nl
          </Link>
        </div>
      </section>
    </div>
  );
}
