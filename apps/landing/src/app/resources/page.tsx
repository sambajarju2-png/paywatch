import Link from "next/link";
import { GemeenteSearch } from "@/components/GemeenteSearch";

export default function ResourcesPage() {
  return (
    <>
      <section className="py-16 px-6 bg-pw-bg">
        <div className="max-w-[1140px] mx-auto">
          <h1 className="text-hero text-pw-navy mb-2">Resources</h1>
          <p className="text-body text-pw-muted mb-12">Kennis, hulp en inzichten om je financiële situatie te verbeteren.</p>

          {/* Blog section */}
          <div className="mb-16">
            <h2 className="text-page-heading text-pw-navy mb-6">Blog</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { title: "Wat zijn je rechten bij een incasso?", cat: "Juridisch", desc: "Een heldere uitleg over de Wet Incassokosten en wat je mag verwachten." },
                { title: "5 tips om incassokosten te voorkomen", cat: "Tips", desc: "Praktische stappen die je vandaag nog kunt nemen." },
                { title: "Hoe werkt schuldhulpverlening?", cat: "Hulp", desc: "Wat kun je verwachten als je hulp zoekt bij je gemeente?" },
              ].map((post) => (
                <div key={post.title} className="bg-white rounded-card border border-pw-border overflow-hidden">
                  <div className="h-[140px] bg-pw-blue-light flex items-center justify-center">
                    <span className="text-pw-blue text-[11px] font-semibold uppercase tracking-wider">{post.cat}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-card-title text-pw-navy mb-2">{post.title}</h3>
                    <p className="text-caption text-pw-muted leading-relaxed">{post.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-[13px] text-pw-muted mt-6">Meer artikelen worden binnenkort gepubliceerd via ons CMS.</p>
          </div>

          {/* Aid directory */}
          <div className="mb-8">
            <h2 className="text-page-heading text-pw-navy mb-6">Hulporganisaties</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Juridisch Loket", desc: "Gratis juridisch advies voor iedereen. Bel 0900-8020.", url: "https://www.juridischloket.nl", type: "Juridisch" },
                { name: "Nibud", desc: "Nationaal Instituut voor Budgetvoorlichting. Hulp bij je huishoudboekje.", url: "https://www.nibud.nl", type: "Financieel" },
                { name: "SchuldHulpMaatje", desc: "Vrijwilligers die je helpen met schulden. Persoonlijk en dichtbij.", url: "https://www.schuldhulpmaatje.nl", type: "Schuldhulp" },
              ].map((org) => (
                <a key={org.name} href={org.url} target="_blank" rel="noopener noreferrer" className="bg-white rounded-card p-5 border border-pw-border hover:border-pw-blue/30 transition-colors block">
                  <span className="text-[10px] font-semibold text-pw-blue bg-pw-blue-light px-2 py-0.5 rounded mb-2 inline-block">{org.type}</span>
                  <h3 className="text-[15px] font-bold text-pw-navy mb-1">{org.name}</h3>
                  <p className="text-[13px] text-pw-muted leading-relaxed">{org.desc}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
      <GemeenteSearch />
    </>
  );
}
