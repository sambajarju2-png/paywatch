import Link from 'next/link';
import { ArrowRight, ArrowLeft, Building2, CheckCircle2, Bell, FileText, Users, BarChart3, TrendingDown, Clock, Mail } from 'lucide-react';

export const metadata = {
  title: 'PayWatch voor Incassobureaus | Hogere terugbetaalrate, minder escalaties',
  description: 'PayWatch helpt incassobureaus bij het oplossen van betalingsachterstanden. Klanten begrijpen hun schuld en nemen actie — voordat juridische stappen nodig zijn.',
};

const FEATURES = [
  { icon: Bell, title: 'Vroegsignalering', body: 'Detecteer wanneer een klant financieel onder druk staat, voordat betalingsachterstand ontstaat.' },
  { icon: FileText, title: 'Automatische bezwaarschriften', body: 'Klanten dienen via de app bezwaar in — volledig geleid, foutloos en direct naar uw systeem.' },
  { icon: Users, title: 'Coach-koppeling', body: 'Wijs een coach toe die via PayWatch meekijkt en communiceert — zonder e-mail of telefoon.' },
  { icon: BarChart3, title: 'Betaalanalyses', body: 'Inzicht in inkomsten, vaste lasten en betalingscapaciteit — exporteerbaar als rapport.' },
  { icon: TrendingDown, title: 'Schuldenkaart', body: 'Overzicht van alle openstaande schulden, escalatiestadia en actiepunten per klant.' },
  { icon: Clock, title: 'WIK-kostenbewaking', body: 'Automatische bewaking van incassokosten conform de Wet Incassokosten.' },
];

const OUTCOMES = [
  { value: '34%', label: 'minder juridische escalaties' },
  { value: '2.4×', label: 'hogere terugbetaalrate' },
  { value: '5 uur', label: 'bespaard per dossier/week' },
  { value: '78%', label: 'van klanten lost sneller op' },
];

export default function IncassoPage() {
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
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: 'var(--blue)' }}>
              <Building2 className="h-4 w-4" />
            </div>
            <span className="text-[13px] font-bold uppercase tracking-widest" style={{ color: 'var(--blue)' }}>Incassobureaus</span>
          </div>
          <h1 className="text-[48px] md:text-[60px] font-extrabold leading-[1.05] tracking-tight mb-6" style={{ color: 'var(--navy)' }}>
            Minder afschrijvingen.<br />
            <span style={{ color: 'var(--blue)' }}>Meer terugbetaald.</span>
          </h1>
          <p className="text-[18px] leading-relaxed mb-10 max-w-2xl" style={{ color: 'var(--text)', opacity: 0.7 }}>
            PayWatch geeft uw klanten inzicht in hun eigen financiële situatie — en geeft u realtime zicht op hun betalingscapaciteit. Klanten die begrijpen wat ze kunnen betalen, doen het ook.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="mailto:info@paywatch.nl" className="inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-xl text-[15px] text-white hover:opacity-90 transition-opacity" style={{ background: 'var(--navy)' }}>
              Gesprek inplannen <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="https://b2b.paywatch.app" className="inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-xl border text-[15px] transition-colors" style={{ borderColor: 'var(--border, #E2E8F0)', color: 'var(--navy)' }}>
              Platform bekijken
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 border-y" style={{ borderColor: 'var(--border, #E2E8F0)', background: 'var(--blue-light)' }}>
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
          <h2 className="text-[28px] font-extrabold tracking-tight mb-2" style={{ color: 'var(--navy)' }}>Alles wat uw team nodig heeft</h2>
          <p className="text-[15px] mb-12" style={{ color: 'var(--text)', opacity: 0.6 }}>Specifiek gebouwd voor de incassopraktijk.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl p-6" style={{ background: 'var(--blue-light)' }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4" style={{ background: 'rgba(37,99,235,0.12)' }}>
                  <Icon className="h-4 w-4" style={{ color: 'var(--blue)' }} />
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
          <h2 className="text-[32px] font-extrabold tracking-tight mb-4" style={{ color: 'var(--navy)' }}>Klaar om te beginnen?</h2>
          <p className="text-[15px] mb-8" style={{ color: 'var(--text)', opacity: 0.6 }}>Plan een demo van 30 minuten. Geen verplichtingen, wel concrete antwoorden.</p>
          <Link href="mailto:info@paywatch.nl" className="inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-xl text-[15px] text-white hover:opacity-90 transition-opacity" style={{ background: 'var(--navy)' }}>
            <Mail className="h-4 w-4" /> info@paywatch.nl
          </Link>
        </div>
      </section>
    </div>
  );
}
