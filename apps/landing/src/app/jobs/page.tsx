import Link from "next/link";

const jobs = [
  { title: "Account Manager Hulporganisaties", type: "Sales", loc: "Rotterdam / Remote", desc: "Bouw relaties op met schuldhulpverleners en juridisch loketten door heel Nederland." },
  { title: "Account Manager Private Sector", type: "Sales", loc: "Rotterdam / Remote", desc: "Werk samen met advocatenkantoren en financiële dienstverleners die onze gebruikers kunnen helpen." },
  { title: "Full Stack Developer", type: "Engineering", loc: "Remote", desc: "Next.js, React, TypeScript, Supabase, AI-integratie. Bouw mee aan de toekomst van financiële rust." },
  { title: "Open sollicitatie", type: "Algemeen", loc: "Remote", desc: "Past geen van bovenstaande? Vertel ons wat jij kunt bijdragen aan de missie van PayWatch." },
];

export default function JobsPage() {
  return (
    <section className="py-16 px-6 bg-pw-bg min-h-screen">
      <div className="max-w-[720px] mx-auto">
        <h1 className="text-hero text-pw-navy mb-2">Vacatures</h1>
        <p className="text-body text-pw-muted mb-8">Help mee om financiële rust bereikbaar te maken voor iedereen.</p>
        <div className="space-y-3">
          {jobs.map((j) => (
            <div key={j.title} className="bg-white rounded-card p-6 border border-pw-border flex justify-between items-center">
              <div>
                <h3 className="text-section-head text-pw-navy mb-1">{j.title}</h3>
                <div className="flex gap-3 mb-1">
                  <span className="text-label text-pw-blue font-semibold">{j.type}</span>
                  <span className="text-label text-pw-muted">{j.loc}</span>
                </div>
                <p className="text-caption text-pw-muted">{j.desc}</p>
              </div>
              <Link
                href="/contact"
                className="bg-pw-blue-light text-pw-blue rounded-button px-4 py-2 text-[12px] font-semibold shrink-0 hover:bg-blue-100 transition-colors"
              >
                Solliciteer
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
