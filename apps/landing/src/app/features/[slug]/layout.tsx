import type { Metadata } from "next";
import { featurePages } from "@/lib/feature-pages";

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const feature = featurePages.find((f) => f.slug === slug);

  if (!feature) {
    return { title: "Feature niet gevonden | PayWatch" };
  }

  const featureTitle = feature.overview.title.nl;

  return {
    title: `${featureTitle} | PayWatch`,
    description: feature.overview.desc.nl,
    alternates: {
      canonical: `https://paywatch.app/features/${slug}`,
    },
    openGraph: {
      title: `${featureTitle} | PayWatch`,
      description: feature.overview.desc.nl,
      url: `https://paywatch.app/features/${slug}`,
      siteName: "PayWatch",
      type: "website",
      images: [{ url: `/api/og?type=feature&title=${encodeURIComponent(featureTitle)}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${featureTitle} | PayWatch`,
      description: feature.overview.desc.nl,
      images: [`/api/og?type=feature&title=${encodeURIComponent(featureTitle)}`],
    },
  };
}

export async function generateStaticParams() {
  return featurePages.map((f) => ({ slug: f.slug }));
}

export default async function FeatureLayout({ children, params }: Props) {
  const { slug } = await params;
  const feature = featurePages.find((f) => f.slug === slug);

  const jsonLd = feature
    ? {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: feature.overview.title.nl,
        description: feature.overview.desc.nl,
        url: `https://paywatch.app/features/${slug}`,
        isPartOf: {
          "@type": "SoftwareApplication",
          name: "PayWatch",
          applicationCategory: "FinanceApplication",
          operatingSystem: "Web",
          url: "https://paywatch.app",
        },
        inLanguage: ["nl", "en"],
        provider: {
          "@type": "Organization",
          name: "PayWatch",
          url: "https://paywatch.app",
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
