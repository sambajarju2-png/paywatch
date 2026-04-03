import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CITY_SLUGS, getCityBySlug } from "@/lib/city-pages";
import CityPageComponent from "@/components/CityPage";

/* ── Static generation for all city slugs ── */
export function generateStaticParams() {
  return CITY_SLUGS.map((slug) => ({ city: slug }));
}

/* ── Types ── */
type Props = {
  params: Promise<{ city: string }>;
};

/* ── Metadata ── */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) return {};

  const url = `https://paywatch.app/schuldhulp/${city.slug}`;

  return {
    title: city.metaTitle,
    description: city.metaDescription,
    keywords: [
      `schuldhulp ${city.name}`,
      `schulden ${city.name}`,
      `schuldhulpverlening ${city.name}`,
      `hulp bij schulden ${city.name}`,
      `incasso ${city.name}`,
      `gratis schuldhulp ${city.name}`,
      `gemeente ${city.name} schulden`,
      `betalingsachterstand ${city.name}`,
      "schuldhulpverlening",
      "schulden hulp",
      "PayWatch",
    ],
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: city.metaTitle,
      description: city.metaDescription,
      url,
      siteName: "PayWatch",
      locale: "nl_NL",
      alternateLocale: "en_US",
      type: "article",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: city.metaTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: city.metaTitle,
      description: city.metaDescription,
      images: ["/og-image.png"],
    },
  };
}

/* ── Page ── */
export default async function SchuldhulpCityPage({ params }: Props) {
  const { city: slug } = await params;
  const city = getCityBySlug(slug);

  if (!city) {
    notFound();
  }

  /* ── JSON-LD: FAQPage ── */
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: city.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  /* ── JSON-LD: BreadcrumbList ── */
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "PayWatch",
        item: "https://paywatch.app",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Schuldhulp per stad",
        item: "https://paywatch.app/schuldhulp",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `Schuldhulp ${city.name}`,
        item: `https://paywatch.app/schuldhulp/${city.slug}`,
      },
    ],
  };

  /* ── JSON-LD: Article (for AI and SERP) ── */
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: city.metaTitle,
    description: city.metaDescription,
    author: {
      "@type": "Organization",
      name: "PayWatch",
      url: "https://paywatch.app",
    },
    publisher: {
      "@type": "Organization",
      name: "PayWatch",
      url: "https://paywatch.app",
      logo: {
        "@type": "ImageObject",
        url: "https://paywatch.app/icon-512.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://paywatch.app/schuldhulp/${city.slug}`,
    },
    about: {
      "@type": "Thing",
      name: `Schuldhulpverlening in ${city.name}`,
    },
    spatialCoverage: {
      "@type": "Place",
      name: city.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: city.name,
        addressRegion: city.province,
        addressCountry: "NL",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: city.coordinates.lat,
        longitude: city.coordinates.lng,
      },
    },
  };

  /* ── JSON-LD: LocalBusiness entries for organizations ── */
  const orgSchemas = city.organizations.map((org) => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: org.name,
    url: org.url,
    description: org.description,
    ...(org.phone ? { telephone: org.phone } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: city.name,
      addressRegion: city.province,
      addressCountry: "NL",
    },
    areaServed: {
      "@type": "City",
      name: city.name,
    },
  }));

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {orgSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <CityPageComponent city={city} />
    </>
  );
}
