import type { Metadata } from "next";
import { founders } from "@/lib/config";
import TeamMemberContent from "./TeamMemberContent";

export function generateStaticParams() {
  return founders.filter((f) => f.slug).map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const person = founders.find((f) => f.slug === slug);
  if (!person) return { title: "Team | PayWatch" };

  return {
    title: `${person.fullName} — ${person.role.nl} bij PayWatch`,
    description: person.bio.nl,
    alternates: { canonical: `https://paywatch.app/about/${slug}` },
    openGraph: {
      title: `${person.fullName} — PayWatch`,
      description: person.bio.nl,
      url: `https://paywatch.app/about/${slug}`,
    },
  };
}

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const person = founders.find((f) => f.slug === slug);
  if (!person) return null;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.fullName,
    jobTitle: person.role.nl,
    worksFor: {
      "@type": "Organization",
      name: "PayWatch",
      url: "https://paywatch.app",
    },
    url: `https://paywatch.app/about/${slug}`,
    sameAs: person.linkedin ? [person.linkedin] : [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <TeamMemberContent slug={slug} />
    </>
  );
}
