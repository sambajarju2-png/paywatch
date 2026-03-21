"use client";

import { useApp } from "@/components/AppProvider";
import { GemeenteSearch } from "@/components/GemeenteSearch";

export default function ResourcesPage() {
  const { lang } = useApp();
  const n = lang === "nl";
  return (
    <>
      <section className="py-16 px-6 bg-pw-bg">
        <div className="max-w-[1140px] mx-auto">
          <h1 className="text-hero text-pw-navy mb-2">Resources</h1>
          <p className="text-body text-pw-muted mb-12">{n ? "Kennis, hulp en inzichten om je financiële situatie te verbeteren." : "Knowledge, help and insights to improve your financial situation."}</p>
          <div className="mb-16">
            <h2 className="text-page-heading text-pw-navy mb-6">Blog</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { title: n ? "Wat zijn je rechten bij een incasso?" : "What are your rights with debt collection?", cat: n ? "Juridisch" : "Legal" },
                { title: n ? "5 tips om incassokosten te voorkomen" : "5 tips to avoid collection costs", cat: "Tips" },
                { title: n ? "Hoe werkt schuldhulpverlening?" : "How does debt assistance work?", cat: n ? "Hulp" : "Help" },
              ].map((post) => (
                <div key={post.title} className="bg-white rounded-card border border-pw-border overflow-hidden">
                  <div className="h-[140px] bg-pw-blue-light flex items-center justify-center">
                    <span className="text-pw-blue text-[11px] font-semibold uppercase tracking-wider">{post.cat}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-card-title text-pw-navy mb-2">{post.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-page-heading text-pw-navy mb-6">{n ? "Hulporganisaties" : "Aid organizations"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Juridisch Loket", desc: n ? "Gratis juridisch advies. Bel 0900-8020." : "Free legal advice. Call 0900-8020.", url: "https://www.juridischloket.nl", type: n ? "Juridisch" : "Legal" },
                { name: "Nibud", desc: n ? "Hulp bij je huishoudboekje." : "Help with your household budget.", url: "https://www.nibud.nl", type: n ? "Financieel" : "Financial" },
                { name: "SchuldHulpMaatje", desc: n ? "Vrijwilligers die je helpen met schulden." : "Volunteers who help with debt.", url: "https://www.schuldhulpmaatje.nl", type: n ? "Schuldhulp" : "Debt help" },
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
