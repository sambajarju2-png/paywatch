import type { Metadata } from "next";
import { comparisons, getComparisonBySlug, getFAQs } from "@/lib/comparison-data";
import ComparisonContent from "./ComparisonContent";

/* ─── Static pre-rendering for all comparison pages ─── */
export function generateStaticParams() {
  return comparisons.map((c) => ({ slug: c.slug }));
}

/* ─── Unique metadata per comparison page ─── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = getComparisonBySlug(slug);
  if (!data) return { title: "Vergelijking niet gevonden" };

  const title = `${data.name} alternatief (2026) — PayWatch vs ${data.name} vergeleken | PayWatch`;
  const description = data.seoDesc.nl;

  return {
    title,
    description,
    alternates: {
      canonical: `https://paywatch.app/vergelijking/${slug}`,
    },
    openGraph: {
      title: `${data.name} alternatief — PayWatch vs ${data.name} (2026)`,
      description,
      url: `https://paywatch.app/vergelijking/${slug}`,
      siteName: "PayWatch",
      type: "website",
    },
  };
}

/* ─── Server Component: renders schemas + client content ─── */
export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getComparisonBySlug(slug);

  /* ─── JSON-LD: WebPage schema ─── */
  const webPageSchema = data
    ? {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: `${data.name} alternatief — PayWatch vs ${data.name} (2026)`,
        description: data.seoDesc.nl,
        url: `https://paywatch.app/vergelijking/${data.slug}`,
        dateModified: new Date().toISOString().split("T")[0],
        mainEntity: {
          "@type": "SoftwareApplication",
          name: "PayWatch",
          applicationCategory: "FinanceApplication",
          operatingSystem: "Web, iOS, Android",
          offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        },
      }
    : null;

  /* ─── JSON-LD: FAQ schema ─── */
  const faqSchema = data
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: getFAQs(data).map((faq) => ({
          "@type": "Question",
          name: faq.q.nl,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a.nl,
          },
        })),
      }
    : null;

  return (
    <>
      {/* Schema scripts rendered server-side for Google */}
      {webPageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Client component handles interactivity + lang switching */}
      <ComparisonContent slug={slug} />
    </>
  );
}
