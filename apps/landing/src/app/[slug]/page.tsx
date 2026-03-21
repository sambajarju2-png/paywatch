import { notFound } from "next/navigation";
import { client } from "@/sanity/client"; // Adjust this path if your client is elsewhere

// Define what your Sanity Page data looks like
interface SanityPage {
  title: string;
  slug: { current: string };
  // Add other fields here as you create them in Sanity (like a 'body' or 'content' field)
}

// This component receives the 'slug' from the URL
export default async function DynamicPage({ params }: { params: { slug: string } }) {
  // 1. We grab the slug from the URL (e.g., "sambajarju")
  const urlSlug = params.slug;

  // 2. We write a GROQ query to ask Sanity: 
  // "Find a document where the type is 'page' AND the slug matches our URL"
  // Note: Change "page" to whatever your schema type name is in Sanity!
  const query = `*[_type == "page" && slug.current == $urlSlug][0]`;
  
  // 3. We fetch the data using our Sanity client
  const sanityData: SanityPage | null = await client.fetch(query, { urlSlug });

  // 4. If Sanity doesn't find a page with that slug, we trigger a Next.js 404
  if (!sanityData) {
    return notFound();
  }

  // 5. If it DOES find the data, we render the page!
  return (
    <main className="mx-auto max-w-4xl px-4 py-20">
      <h1 className="text-4xl font-bold text-[var(--navy)] mb-8">
        {sanityData.title}
      </h1>
      <p className="text-[var(--muted)]">
        This page was successfully generated from Sanity! 
        The slug for this page is: {sanityData.slug.current}
      </p>
    </main>
  );
}
