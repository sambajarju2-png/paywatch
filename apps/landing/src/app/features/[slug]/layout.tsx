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

  return {
    title: `${feature.overview.title.nl} | PayWatch`,
    description: feature.overview.desc.nl,
    alternates: {
      canonical: `https://paywatch.app/features/${slug}`,
    },
    openGraph: {
      title: `${feature.overview.title.nl} | PayWatch`,
      description: feature.overview.desc.nl,
      url: `https://paywatch.app/features/${slug}`,
      siteName: "PayWatch",
      type: "website",
    },
  };
}

export async function generateStaticParams() {
  return featurePages.map((f) => ({ slug: f.slug }));
}

export default async function FeatureLayout({ children }: Props) {
  return <>{children}</>;
}
