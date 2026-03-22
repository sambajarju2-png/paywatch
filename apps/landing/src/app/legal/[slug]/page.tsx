import { createClient } from "next-sanity";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LegalPageContent from "@/components/LegalPageContent";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "pwf6qbjc",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-03-15",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const QUERY = `*[_type == "legalPage" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  lastUpdated,
  body
}`;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const page = await client.fetch(QUERY, { slug });
    if (!page) return { title: "Pagina niet gevonden" };
    const title = page.title?.nl || page.title?.en || slug;
    return {
      title,
      alternates: { canonical: `https://paywatch.app/legal/${slug}` },
    };
  } catch {
    return { title: "Legal" };
  }
}

export default async function LegalPage({ params }: Props) {
  const { slug } = await params;

  let page = null;
  try {
    page = await client.fetch(QUERY, { slug });
  } catch (e) {
    console.error("[Sanity] Legal page fetch error:", e);
  }

  if (!page) {
    notFound();
  }

  return <LegalPageContent page={page} />;
}
