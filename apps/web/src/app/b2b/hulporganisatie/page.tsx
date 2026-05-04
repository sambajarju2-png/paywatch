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

const ORGS = ['Kredietbank Nederland', 'Schuldhulpmaatje', 'Sociaal raadslieden', 'Voedselbanken', 'Buurtteams'];

export default function HulporganisatiePage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/b2b" className="flex items-center gap-2 text-pw-muted hover:text-pw-navy transition-colors text-[14px] font-medium">
            <ArrowLeft className="h-4 w-4" /> Terug naar overzicht
          </Link>
          <Link href="mailto:info@paywatch.nl" className="bg-pw-purple text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-purple-800 transition-colors">
            Demo aanvragen
          </Link>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-pw-purple flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            <span className="text-[13px] font-bold uppercase tracking-widest text-pw-purple">Hulporganisaties</span>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-[48px] md:text-[60px] font-extrabold text-pw-navy leading-[1.05] tracking-tight mb-6">
              Meer tijd voor<br />
              <span className="text-pw-purple">het echte werk.</span>
            </h1>
            <p className="text-[18px] text-pw-muted leading-relaxed mb-10 max-w-2xl">
              PayWatch neemt de administratie van schuldhulpcoaches over. Geen papieren dossiers, geen handmatige data-invoer — alleen realtime inzicht en directe communicatie met uw cliënt.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="mailto:info@paywatch.nl" className="inline-flex items-center gap-2 bg-pw-purple text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-purple-800 transition-colors text-[15px]">
                Gesprek inplannen <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="https://b2b.paywatch.app" className="inline-flex items-center gap-2 text-pw-navy font-semibold px-6 py-3.5 rounded-xl border border-gray-200 hover:border-pw-purple hover:text-pw-purple transition-colors text-[15px]">
                Platform bekijken
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 px-6 border-y border-gray-100 bg-pw-bg/40">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {OUTCOMES.map((o) => (
            <div key={o.label}>
              <p className="text-[36px] font-extrabold text-pw-navy tracking-tight">{o.value}</p>
              <p className="text-[13px] text-pw-muted mt-1">{o.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[28px] font-extrabold text-pw-navy tracking-tight mb-2">Tools voor elke coach</h2>
          <p className="text-[15px] text-pw-muted mb-12">Van kredietbank tot buurtteam — PayWatch past zich aan uw werkwijze aan.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-pw-bg/60 rounded-2xl p-6">
                <div className="w-9 h-9 rounded-lg bg-pw-purple/10 flex items-center justify-center mb-4">
                  <Icon className="h-4 w-4 text-pw-purple" />
                </div>
                <h3 className="text-[15px] font-bold text-pw-navy mb-2">{title}</h3>
                <p className="text-[13px] text-pw-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-pw-bg/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[24px] font-extrabold text-pw-navy tracking-tight mb-8">Passend voor organisaties zoals</h2>
          <div className="flex flex-wrap gap-3">
            {ORGS.map((org) => (
              <span key={org} className="bg-white border border-gray-200 text-pw-text text-[14px] font-medium px-4 py-2 rounded-full">
                {org}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-[32px] font-extrabold text-pw-navy tracking-tight mb-4">Wil uw organisatie meedoen?</h2>
          <p className="text-[15px] text-pw-muted mb-8">We bieden een gratis pilot voor organisaties die willen testen hoe PayWatch werkt in de praktijk.</p>
          <Link href="mailto:info@paywatch.nl" className="inline-flex items-center gap-2 bg-pw-purple text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-purple-800 transition-colors text-[15px]">
            <Mail className="h-4 w-4" /> info@paywatch.nl
          </Link>
        </div>
      </section>
    </main>
  );
}
