import type { Metadata } from "next";
import Link from "next/link";
import { getAllCityPages } from "@/lib/city-pages";

export const metadata: Metadata = {
  title: "Schuldhulp per stad — Gratis hulp bij schulden in Nederland",
  description:
    "Vind gratis schuldhulpverlening in jouw stad. Overzicht van hulporganisaties, veelgestelde vragen en praktische tips voor Rotterdam, Amsterdam, Den Haag, Utrecht, Eindhoven en meer.",
  keywords: [
    "schuldhulp",
    "schuldhulpverlening",
    "hulp bij schulden",
    "schulden Nederland",
    "gratis schuldhulp",
    "gemeente schuldhulp",
    "schulden per stad",
    "PayWatch",
  ],
  alternates: {
    canonical: "https://paywatch.app/schuldhulp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    title: "Schuldhulp per stad — Gratis hulp bij schulden | PayWatch",
    description:
      "Vind gratis schuldhulpverlening in jouw stad. Overzicht van hulporganisaties, FAQ en tips.",
    url: "https://paywatch.app/schuldhulp",
    siteName: "PayWatch",
    locale: "nl_NL",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function SchuldhulpIndexPage() {
  const cities = getAllCityPages();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "PayWatch", item: "https://paywatch.app" },
      { "@type": "ListItem", position: 2, name: "Schuldhulp per stad", item: "https://paywatch.app/schuldhulp" },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Schuldhulp per stad in Nederland",
    description: "Overzicht van schuldhulpverlening in de grootste steden van Nederland.",
    url: "https://paywatch.app/schuldhulp",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: cities.map((city, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://paywatch.app/schuldhulp/${city.slug}`,
        name: `Schuldhulp ${city.name}`,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <div className="bg-[var(--bg)] min-h-screen">
        {/* Hero */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-12 pb-6 sm:pt-20 sm:pb-10">
          <nav className="mb-4 flex items-center gap-2 text-sm text-[var(--muted)]">
            <Link href="/" className="hover:text-[var(--navy)] transition">PayWatch</Link>
            <span>/</span>
            <span className="text-[var(--navy)] font-medium">Schuldhulp per stad</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--navy)] tracking-tight">
            Schuldhulp per stad
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[var(--muted)] max-w-2xl">
            In elke grote stad in Nederland is gratis schuldhulpverlening beschikbaar. Kies je stad en ontdek welke
            organisaties je kunnen helpen, lees veelgestelde vragen en bekijk lokale tips.
          </p>
        </div>

        {/* City Grid */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/schuldhulp/${city.slug}`}
                className="group relative rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 sm:p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* City name + province */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: city.accentColor }}
                    />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                      {city.province}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-[var(--navy)] tracking-tight group-hover:underline decoration-2 underline-offset-4 decoration-[var(--border)]">
                    {city.name}
                  </h2>
                </div>

                {/* Stats */}
                <p className="text-[13px] text-[var(--muted)] leading-relaxed mb-5 line-clamp-2">
                  {city.statsHighlight}
                </p>

                {/* Metadata pills */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 rounded-md bg-[var(--bg)] px-2 py-1 text-[11px] font-medium text-[var(--text)]">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    {city.organizations.length} organisaties
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-[var(--bg)] px-2 py-1 text-[11px] font-medium text-[var(--text)]">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                    {city.faq.length} FAQ
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-[var(--bg)] px-2 py-1 text-[11px] font-medium text-[var(--text)]">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                    {city.tips.length} tips
                  </span>
                </div>

                {/* CTA arrow */}
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--muted)] group-hover:text-[var(--navy)] transition-colors">
                  Bekijk hulp in {city.name}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-0.5"><path d="m9 18 6-6-6-6" /></svg>
                </div>
              </Link>
            ))}
          </div>

          {/* Coming soon notice */}
          <div className="mt-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] p-6 text-center">
            <h3 className="text-base font-bold text-[var(--navy)]">Binnenkort meer steden</h3>
            <p className="mt-1 text-sm text-[var(--muted)] max-w-lg mx-auto">
              We werken aan pagina&apos;s voor alle 335+ Nederlandse gemeenten. Heb je nu al schulden?
              PayWatch werkt in elke gemeente. Begin direct met overzicht in je rekeningen.
            </p>
            <a
              href="https://app.paywatch.app"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--blue)] px-5 py-2.5 text-sm font-bold text-white hover:opacity-90 transition"
            >
              Start gratis met PayWatch
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
            </a>
          </div>

          {/* Internal links */}
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <Link href="/features" className="text-[var(--blue)] font-medium hover:underline">Alle functies</Link>
            <span className="text-[var(--border)]">|</span>
            <Link href="/blog" className="text-[var(--blue)] font-medium hover:underline">Blog</Link>
            <span className="text-[var(--border)]">|</span>
            <Link href="/resources" className="text-[var(--blue)] font-medium hover:underline">Artikelen</Link>
            <span className="text-[var(--border)]">|</span>
            <Link href="/about" className="text-[var(--blue)] font-medium hover:underline">Over PayWatch</Link>
          </div>
        </div>
      </div>
    </>
  );
}
