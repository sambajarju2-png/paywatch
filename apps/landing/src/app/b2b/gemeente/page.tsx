import Link from 'next/link';
import { ArrowLeft, Landmark, CheckCircle2, Bell, FileText, Users, BarChart3, MapPin, Calendar, Mail } from 'lucide-react';

const DEMO_LINK = 'https://calendly.com/samba-paywatch/demo';

export const metadata = {
  title: 'PayWatch voor Gemeentes | Vroegsignalering en schuldhulp voor inwoners',
  description: 'Help inwoners met financiële problemen sneller de juiste weg te vinden. PayWatch koppelt automatisch door naar gemeentelijke schuldhulpverlening.',
};

const FEATURES = [
  { icon: Bell, title: 'Automatische vroegsignalering', body: 'Signaleer financiële stress bij inwoners voordat schulden escaleren naar de WSNP of deurwaarder.' },
  { icon: MapPin, title: 'Lokale doorverwijzing', body: 'PayWatch koppelt inwoners automatisch aan de juiste schuldhulpverlening in jouw gemeente.' },
  { icon: FileText, title: 'Toeslagencheck', body: 'Automatische controle of inwoners aanspraak maken op toeslagen die ze nog niet ontvangen.' },
  { icon: Users, title: 'Coach-dashboard', body: 'Schuldhulpverleners zien realtime de situatie van cliënten en communiceren direct via de app.' },
  { icon: BarChart3, title: 'Rapportages voor beleid', body: 'Exporteer geanonimiseerde data voor gemeentelijke schuldenrapportages en beleidsevaluaties.' },
  { icon: CheckCircle2, title: 'Minnelijk traject', body: 'Ondersteun het minnelijk traject met dossiervorming, communicatie en documentbeheer.' },
];

const OUTCOMES = [
  { value: '68%', label: 'eerder gesignaleerd' },
  { value: '3 min', label: 'gemiddelde doorverwijzing' },
  { value: '€2.400', label: 'bespaard per traject' },
  { value: '91%', label: 'bereikt voor escalatie' },
];

export default function GemeentePage() {
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
            <div className="w-8 h-8 rounded-lg bg-[var(--green)] flex items-center justify-center">
              <Landmark className="h-4 w-4 text-white" />
            </div>
            <span className="text-[12px] font-bold uppercase tracking-widest text-[var(--green)]">Gemeentes</span>
          </div>
          <h1 className="text-[38px] sm:text-[52px] font-extrabold text-[var(--navy)] leading-[1.05] tracking-tight mb-5">
            Schuldhulp die werkt.<br />
            <span className="text-[var(--green)]">Voor elke inwoner.</span>
          </h1>
          <p className="text-[17px] text-[var(--muted)] leading-relaxed mb-10 max-w-2xl">
            PayWatch verbindt inwoners met financiële problemen direct aan de juiste gemeentelijke hulp. Vroegsignalering, toeslagencheck en doorverwijzing in één platform — AVG-proof en transparant.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href={DEMO_LINK} target="_blank"
              className="inline-flex items-center gap-2 bg-[var(--green)] text-white font-semibold px-6 py-3 rounded-xl text-[15px] hover:opacity-90 transition-opacity">
              <Calendar className="h-4 w-4" /> Demo inplannen
            </Link>
            <Link href="https://b2b.paywatch.app"
              className="inline-flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] text-[var(--navy)] font-semibold px-6 py-3 rounded-xl text-[15px] hover:border-[var(--green)] transition-colors">
              Platform bekijken
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--green-light)] py-10 px-4 sm:px-6">
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
          <h2 className="text-[26px] font-extrabold text-[var(--navy)] tracking-tight mb-2">Gebouwd voor gemeentelijke schuldhulp</h2>
          <p className="text-[14px] text-[var(--muted)] mb-10">Volledig afgestemd op de Wet gemeentelijke schuldhulpverlening (Wgs).</p>
          <div className="grid md:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
                <div className="w-9 h-9 rounded-lg bg-[var(--green-light)] flex items-center justify-center mb-4">
                  <Icon className="h-4 w-4 text-[var(--green)]" />
                </div>
                <h3 className="text-[14px] font-bold text-[var(--navy)] mb-2">{title}</h3>
                <p className="text-[13px] text-[var(--muted)] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 bg-[var(--navy)]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[20px] font-extrabold text-white tracking-tight mb-5">Wettelijk kader</h2>
          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {['Wet gemeentelijke schuldhulpverlening (Wgs)', 'Vroegsignalering conform artikel 3 Wgs', 'AVG / GDPR compliant', 'Expliciete toestemming per koppeling'].map(item => (
              <div key={item} className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[var(--green)]" />
                <span className="text-[13px] text-white/80">{item}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Link href={DEMO_LINK} target="_blank"
              className="inline-flex items-center gap-2 bg-[var(--green)] text-white font-semibold px-5 py-2.5 rounded-xl text-[14px] hover:opacity-90 transition-opacity">
              <Calendar className="h-4 w-4" /> Demo inplannen
            </Link>
            <Link href="mailto:info@paywatch.nl"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-5 py-2.5 rounded-xl text-[14px] hover:bg-white/20 transition-colors">
              <Mail className="h-4 w-4" /> info@paywatch.nl
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
