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
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: 'var(--green)' }}>
              <Landmark className="h-4 w-4" />
            </div>
            <span className="text-[13px] font-bold uppercase tracking-widest" style={{ color: 'var(--green)' }}>Gemeentes</span>
          </div>
          <h1 className="text-[48px] md:text-[60px] font-extrabold leading-[1.05] tracking-tight mb-6" style={{ color: 'var(--navy)' }}>
            Schuldhulp die werkt.<br />
            <span style={{ color: 'var(--green)' }}>Voor elk inwoner.</span>
          </h1>
          <p className="text-[18px] leading-relaxed mb-10 max-w-2xl" style={{ color: 'var(--text)', opacity: 0.7 }}>
            PayWatch verbindt inwoners met financiële problemen direct aan de juiste gemeentelijke hulp. Vroegsignalering, toeslagencheck en doorverwijzing in één platform — AVG-proof en transparant.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="mailto:info@paywatch.nl" className="inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-xl text-[15px] text-white hover:opacity-90 transition-opacity" style={{ background: 'var(--green)' }}>
              Gesprek inplannen <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="https://b2b.paywatch.app" className="inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-xl border text-[15px]" style={{ borderColor: 'var(--border, #E2E8F0)', color: 'var(--navy)' }}>
              Platform bekijken
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 border-y" style={{ borderColor: 'var(--border, #E2E8F0)', background: 'var(--green-light)' }}>
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
          <h2 className="text-[28px] font-extrabold tracking-tight mb-2" style={{ color: 'var(--navy)' }}>Gebouwd voor gemeentelijke schuldhulp</h2>
          <p className="text-[15px] mb-12" style={{ color: 'var(--text)', opacity: 0.6 }}>Volledig afgestemd op de Wet gemeentelijke schuldhulpverlening (Wgs).</p>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl p-6" style={{ background: 'var(--green-light)' }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4" style={{ background: 'rgba(5,150,105,0.12)' }}>
                  <Icon className="h-4 w-4" style={{ color: 'var(--green)' }} />
                </div>
                <h3 className="text-[15px] font-bold mb-2" style={{ color: 'var(--navy)' }}>{title}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text)', opacity: 0.7 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6" style={{ background: 'var(--navy)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[24px] font-extrabold text-white tracking-tight mb-6">Wettelijk kader</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {['Wet gemeentelijke schuldhulpverlening (Wgs)', 'Vroegsignalering conform artikel 3 Wgs', 'AVG / GDPR compliant', 'Expliciete toestemming per koppeling'].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--green)' }} />
                <span className="text-[14px] text-white/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-[32px] font-extrabold tracking-tight mb-4" style={{ color: 'var(--navy)' }}>Interesse vanuit uw gemeente?</h2>
          <p className="text-[15px] mb-8" style={{ color: 'var(--text)', opacity: 0.6 }}>We werken al samen met gemeentes in de regio Rotterdam. Plan een kennismakingsgesprek.</p>
          <Link href="mailto:info@paywatch.nl" className="inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-xl text-[15px] text-white hover:opacity-90 transition-opacity" style={{ background: 'var(--green)' }}>
            <Mail className="h-4 w-4" /> info@paywatch.nl
          </Link>
        </div>
      </section>
    </div>
  );
}
