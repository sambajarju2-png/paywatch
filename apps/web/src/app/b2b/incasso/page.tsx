import Link from 'next/link';
import { ArrowRight, ArrowLeft, Building2, CheckCircle2, TrendingDown, Clock, Users, FileText, Bell, BarChart3, Mail } from 'lucide-react';

export const metadata = {
  title: 'PayWatch voor Incassobureaus | Hogere terugbetaalrate, minder escalaties',
  description: 'PayWatch helpt incassobureaus bij het oplossen van betalingsachterstanden. Klanten begrijpen hun schuld en nemen actie — voordat juridische stappen nodig zijn.',
};

const FEATURES = [
  {
    icon: Bell,
    title: 'Vroegsignalering',
    body: 'Detecteer wanneer een klant financieel onder druk staat, voordat betalingsachterstand ontstaat.',
  },
  {
    icon: FileText,
    title: 'Automatische bezwaarschriften',
    body: 'Klanten kunnen via de app bezwaar indienen — volledig geleid, foutloos en direct naar uw systeem.',
  },
  {
    icon: Users,
    title: 'Coach-koppeling',
    body: 'Wijs een coach toe die via PayWatch meekijkt en communiceert — zonder e-mail of telefoon.',
  },
  {
    icon: BarChart3,
    title: 'Betaalanalyses',
    body: 'Inzicht in inkomsten, vaste lasten en betalingscapaciteit — exporteerbaar als rapport.',
  },
  {
    icon: TrendingDown,
    title: 'Schuldenkaart',
    body: 'Overzicht van alle openstaande schulden, escalatiestadia en actiepunten per klant.',
  },
  {
    icon: Clock,
    title: 'WIK-kostenbewaking',
    body: 'Automatische bewaking van incassokosten conform de Wet Incassokosten.',
  },
];

const OUTCOMES = [
  { value: '34%', label: 'minder juridische escalaties' },
  { value: '2.4×', label: 'hogere terugbetaalrate' },
  { value: '5 uur', label: 'bespaard per dossier/week' },
  { value: '78%', label: 'van klanten lost sneller op' },
];

const STEPS = [
  { n: '01', title: 'Stuur een uitnodiging', body: 'Klant ontvangt een link en verbindt zijn PayWatch-account aan uw dossier.' },
  { n: '02', title: 'Klant geeft toestemming', body: 'Expliciete toestemming bepaalt welke gegevens zichtbaar zijn voor uw coaches.' },
  { n: '03', title: 'Realtime samenwerking', body: 'Uw team ziet inkomsten, schulden en voortgang — en communiceert direct via de app.' },
];

export default function IncassoPage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/b2b" className="flex items-center gap-2 text-pw-muted hover:text-pw-navy transition-colors text-[14px] font-medium">
            <ArrowLeft className="h-4 w-4" /> Terug naar overzicht
          </Link>
          <Link href="mailto:info@paywatch.nl" className="bg-pw-navy text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-pw-blue transition-colors">
            Demo aanvragen
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-pw-blue flex items-center justify-center">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <span className="text-[13px] font-bold uppercase tracking-widest text-pw-blue">Incassobureaus</span>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-[48px] md:text-[60px] font-extrabold text-pw-navy leading-[1.05] tracking-tight mb-6">
              Minder afschrijvingen.<br />
              <span className="text-pw-blue">Meer terugbetaald.</span>
            </h1>
            <p className="text-[18px] text-pw-muted leading-relaxed mb-10 max-w-2xl">
              PayWatch geeft uw klanten inzicht in hun eigen financiële situatie — en geeft u realtime zicht op hun betalingscapaciteit. Het resultaat: klanten die begrijpen wat ze kunnen betalen en het ook daadwerkelijk doen.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="mailto:info@paywatch.nl" className="inline-flex items-center gap-2 bg-pw-navy text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-pw-blue transition-colors text-[15px]">
                Gesprek inplannen <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="https://b2b.paywatch.app" className="inline-flex items-center gap-2 text-pw-navy font-semibold px-6 py-3.5 rounded-xl border border-gray-200 hover:border-pw-blue hover:text-pw-blue transition-colors text-[15px]">
                Platform bekijken
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes */}
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

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[28px] font-extrabold text-pw-navy tracking-tight mb-2">Alles wat uw team nodig heeft</h2>
          <p className="text-[15px] text-pw-muted mb-12">Specifiek gebouwd voor de incassopraktijk.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-pw-bg/60 rounded-2xl p-6">
                <div className="w-9 h-9 rounded-lg bg-pw-blue/10 flex items-center justify-center mb-4">
                  <Icon className="h-4 w-4 text-pw-blue" />
                </div>
                <h3 className="text-[15px] font-bold text-pw-navy mb-2">{title}</h3>
                <p className="text-[13px] text-pw-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How */}
      <section className="py-20 px-6 bg-pw-navy">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[28px] font-extrabold text-white tracking-tight mb-12">Zo werkt het</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {STEPS.map((s) => (
              <div key={s.n}>
                <p className="text-[48px] font-extrabold text-white/10 leading-none mb-3">{s.n}</p>
                <h3 className="text-[16px] font-bold text-white mb-2">{s.title}</h3>
                <p className="text-[14px] text-white/60 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-[32px] font-extrabold text-pw-navy tracking-tight mb-4">
            Klaar om te beginnen?
          </h2>
          <p className="text-[15px] text-pw-muted mb-8 max-w-md mx-auto">
            Plan een demo van 30 minuten. Geen verplichtingen, wel concrete antwoorden.
          </p>
          <Link href="mailto:info@paywatch.nl" className="inline-flex items-center gap-2 bg-pw-navy text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-pw-blue transition-colors text-[15px]">
            <Mail className="h-4 w-4" /> info@paywatch.nl
          </Link>
        </div>
      </section>
    </main>
  );
}
