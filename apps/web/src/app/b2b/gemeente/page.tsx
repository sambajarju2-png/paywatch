import Link from 'next/link';
import { ArrowRight, ArrowLeft, Landmark, CheckCircle2, Bell, FileText, Users, BarChart3, MapPin, Mail } from 'lucide-react';

export const metadata = {
  title: 'PayWatch voor Gemeentes | Vroegsignalering en schuldhulp voor inwoners',
  description: 'Help inwoners met financiële problemen sneller de juiste weg te vinden. PayWatch koppelt automatisch door naar gemeentelijke schuldhulpverlening.',
};

const FEATURES = [
  { icon: Bell, title: 'Automatische vroegsignalering', body: 'Signaleer financiële stress bij inwoners voordat schulden escaleren naar de WSNP of deurwaarder.' },
  { icon: MapPin, title: 'Lokale doorverwijzing', body: 'PayWatch koppelt inwoners automatisch aan de juiste schuldhulpverlening in uw gemeente.' },
  { icon: FileText, title: 'Toeslagencheck', body: 'Automatische controle of inwoners aanspraak maken op toeslagen die ze nog niet ontvangen.' },
  { icon: Users, title: 'Coach-dashboard', body: 'Schuldhulpverleners zien realtime de situatie van cliënten en communiceren direct via de app.' },
  { icon: BarChart3, title: 'Rapportages voor beleid', body: 'Exporteer geanonimiseerde data voor gemeentelijke schuldenrapportages en beleidsevaluaties.' },
  { icon: CheckCircle2, title: 'Minnelijk traject', body: 'Ondersteun het minnelijk traject met dossiervorming, communicatie en documentbeheer.' },
];

const OUTCOMES = [
  { value: '68%', label: 'eerder gesignaleerd' },
  { value: '3 min', label: 'gemiddelde doorverwijzing' },
  { value: '€2.400', label: 'bespaard per traject' },
  { value: '91%', label: 'inwoners bereikt voor escalatie' },
];

export default function GemeentePage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/b2b" className="flex items-center gap-2 text-pw-muted hover:text-pw-navy transition-colors text-[14px] font-medium">
            <ArrowLeft className="h-4 w-4" /> Terug naar overzicht
          </Link>
          <Link href="mailto:info@paywatch.nl" className="bg-pw-green text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Demo aanvragen
          </Link>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-pw-green flex items-center justify-center">
              <Landmark className="h-4 w-4 text-white" />
            </div>
            <span className="text-[13px] font-bold uppercase tracking-widest text-pw-green">Gemeentes</span>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-[48px] md:text-[60px] font-extrabold text-pw-navy leading-[1.05] tracking-tight mb-6">
              Schuldhulp die werkt.<br />
              <span className="text-pw-green">Voor elk inwoner.</span>
            </h1>
            <p className="text-[18px] text-pw-muted leading-relaxed mb-10 max-w-2xl">
              PayWatch verbindt inwoners met financiële problemen direct aan de juiste gemeentelijke hulp. Vroegsignalering, toeslagencheck en doorverwijzing in één platform — AVG-proof en transparant.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="mailto:info@paywatch.nl" className="inline-flex items-center gap-2 bg-pw-green text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-green-700 transition-colors text-[15px]">
                Gesprek inplannen <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="https://b2b.paywatch.app" className="inline-flex items-center gap-2 text-pw-navy font-semibold px-6 py-3.5 rounded-xl border border-gray-200 hover:border-pw-green hover:text-pw-green transition-colors text-[15px]">
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
          <h2 className="text-[28px] font-extrabold text-pw-navy tracking-tight mb-2">Gebouwd voor gemeentelijke schuldhulp</h2>
          <p className="text-[15px] text-pw-muted mb-12">Volledig afgestemd op de Wet gemeentelijke schuldhulpverlening (Wgs).</p>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-pw-bg/60 rounded-2xl p-6">
                <div className="w-9 h-9 rounded-lg bg-pw-green/10 flex items-center justify-center mb-4">
                  <Icon className="h-4 w-4 text-pw-green" />
                </div>
                <h3 className="text-[15px] font-bold text-pw-navy mb-2">{title}</h3>
                <p className="text-[13px] text-pw-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-pw-navy">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[28px] font-extrabold text-white tracking-tight mb-6">Wettelijk kader</h2>
          <p className="text-[15px] text-white/60 mb-8 max-w-2xl">PayWatch is ontworpen met de Nederlandse wet- en regelgeving als basis.</p>
          <div className="grid md:grid-cols-2 gap-4">
            {['Wet gemeentelijke schuldhulpverlening (Wgs)', 'Vroegsignalering conform artikel 3 Wgs', 'AVG / GDPR compliant', 'Expliciete toestemming per koppeling'].map((item) => (
              <div key={item} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-pw-green" />
                <span className="text-[14px] text-white/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-[32px] font-extrabold text-pw-navy tracking-tight mb-4">Interesse vanuit uw gemeente?</h2>
          <p className="text-[15px] text-pw-muted mb-8">We werken al samen met gemeentes in de regio Rotterdam. Plan een kennismakingsgesprek.</p>
          <Link href="mailto:info@paywatch.nl" className="inline-flex items-center gap-2 bg-pw-green text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-green-700 transition-colors text-[15px]">
            <Mail className="h-4 w-4" /> info@paywatch.nl
          </Link>
        </div>
      </section>
    </main>
  );
}
