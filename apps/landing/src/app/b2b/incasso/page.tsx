import Link from 'next/link';
import { ArrowRight, ArrowLeft, Building2, CheckCircle2, Bell, FileText, Users, BarChart3, TrendingDown, Clock, Calendar, Mail } from 'lucide-react';

const DEMO_LINK = 'https://calendly.com/samba-paywatch/demo';

export const metadata = {
  title: 'PayWatch voor Incassobureaus | Hogere terugbetaalrate, minder escalaties',
  description: 'PayWatch helpt incassobureaus bij het oplossen van betalingsachterstanden. Klanten begrijpen hun schuld en nemen actie — voordat juridische stappen nodig zijn.',
};

const FEATURES = [
  { icon: Bell, title: 'Vroegsignalering', body: 'Detecteer wanneer een klant financieel onder druk staat, voordat betalingsachterstand ontstaat.' },
  { icon: FileText, title: 'Automatische bezwaarschriften', body: 'Klanten dienen bezwaar in via de app — volledig geleid, foutloos en direct naar jullie systeem.' },
  { icon: Users, title: 'Coach-koppeling', body: 'Wijs een coach toe die via PayWatch meekijkt en communiceert — zonder e-mail of telefoon.' },
  { icon: BarChart3, title: 'Betaalanalyses', body: 'Inzicht in inkomsten, vaste lasten en betalingscapaciteit — exporteerbaar als rapport.' },
  { icon: TrendingDown, title: 'Schuldenkaart', body: 'Overzicht van alle openstaande schulden, escalatiestadia en actiepunten per klant.' },
  { icon: Clock, title: 'WIK-kostenbewaking', body: 'Automatische bewaking van incassokosten conform de Wet Incassokosten.' },
];

const OUTCOMES = [
  { value: '34%', label: 'minder juridische escalaties' },
  { value: '2.4×', label: 'hogere terugbetaalrate' },
  { value: '5 uur', label: 'bespaard per dossier/week' },
  { value: '78%', label: 'lost sneller op' },
];

export default function IncassoPage() {
  return (
    <div className="bg-[var(--bg)]">

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
            <div className="w-8 h-8 rounded-lg bg-[var(--blue)] flex items-center justify-center">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <span className="text-[12px] font-bold uppercase tracking-widest text-[var(--blue)]">Incassobureaus</span>
          </div>
          <h1 className="text-[38px] sm:text-[52px] font-extrabold text-[var(--navy)] leading-[1.05] tracking-tight mb-5">
            Minder afschrijvingen.<br />
            <span className="text-[var(--blue)]">Meer terugbetaald.</span>
          </h1>
          <p className="text-[17px] text-[var(--muted)] leading-relaxed mb-10 max-w-2xl">
            PayWatch geeft je klanten inzicht in hun eigen financiële situatie — en geeft jou realtime zicht op hun betalingscapaciteit. Klanten die begrijpen wat ze kunnen betalen, doen het ook.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href={DEMO_LINK} target="_blank"
              className="inline-flex items-center gap-2 bg-[var(--blue)] text-white font-semibold px-6 py-3 rounded-xl text-[15px] hover:opacity-90 transition-opacity">
              <Calendar className="h-4 w-4" /> Demo inplannen
            </Link>
            <Link href="https://b2b.paywatch.app"
              className="inline-flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] text-[var(--navy)] font-semibold px-6 py-3 rounded-xl text-[15px] hover:border-[var(--blue)] transition-colors">
              Platform bekijken
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--blue-light)] py-10 px-4 sm:px-6">
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
          <h2 className="text-[26px] font-extrabold text-[var(--navy)] tracking-tight mb-2">Alles wat je team nodig heeft</h2>
          <p className="text-[14px] text-[var(--muted)] mb-10">Specifiek gebouwd voor de incassopraktijk.</p>
          <div className="grid md:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
                <div className="w-9 h-9 rounded-lg bg-[var(--blue-light)] flex items-center justify-center mb-4">
                  <Icon className="h-4 w-4 text-[var(--blue)]" />
                </div>
                <h3 className="text-[14px] font-bold text-[var(--navy)] mb-2">{title}</h3>
                <p className="text-[13px] text-[var(--muted)] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 bg-[var(--navy)]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-[22px] font-extrabold text-white tracking-tight mb-1">Klaar om te starten?</h2>
            <p className="text-[14px] text-white/60">Gratis demo van 30 minuten. Geen verplichtingen.</p>
          </div>
          <div className="flex gap-3">
            <Link href={DEMO_LINK} target="_blank"
              className="inline-flex items-center gap-2 bg-[var(--blue)] text-white font-semibold px-5 py-2.5 rounded-xl text-[14px] hover:opacity-90 transition-opacity whitespace-nowrap">
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
