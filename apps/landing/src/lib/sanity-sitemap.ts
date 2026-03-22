const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "pwf6qbjc";
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export async function sanityFetch<T>(query: string): Promise<T> {
  const encoded = encodeURIComponent(query);
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${SANITY_DATASET}?query=${encoded}`;

  const res = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    console.error("Sanity fetch error:", res.status, await res.text());
    return [] as T;
  }

  const json = await res.json();
  return json.result as T;
}

export interface SanityDocument {
  slug: string;
  _updatedAt: string;
}
