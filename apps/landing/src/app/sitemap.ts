import { MetadataRoute } from "next";

const BASE_URL = "https://paywatch.app";
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "pwf6qbjc";
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

/**
 * Fetch published documents from Sanity via GROQ.
 * Uses the CDN API — no token needed for public content.
 */
async function sanityFetch<T>(query: string): Promise<T> {
  const encoded = encodeURIComponent(query);
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${SANITY_DATASET}?query=${encoded}`;

  const res = await fetch(url, {
    next: { revalidate: 3600 }, // re-fetch every hour
  });

  if (!res.ok) {
    console.error("Sanity fetch error:", res.status, await res.text());
    return [] as T;
  }

  const json = await res.json();
  return json.result as T;
}

interface SanitySlug {
  slug: string;
  _updatedAt: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  // ── Static pages ──
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      alternates: {
        languages: {
          nl: `${BASE_URL}`,
          en: `${BASE_URL}`,
        },
      },
    },
    {
      url: `${BASE_URL}/features`,
      lastModified: now,
      alternates: {
        languages: {
          nl: `${BASE_URL}/features`,
          en: `${BASE_URL}/features`,
        },
      },
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      alternates: {
        languages: {
          nl: `${BASE_URL}/about`,
          en: `${BASE_URL}/about`,
        },
      },
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: now,
      alternates: {
        languages: {
          nl: `${BASE_URL}/pricing`,
          en: `${BASE_URL}/pricing`,
        },
      },
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      alternates: {
        languages: {
          nl: `${BASE_URL}/contact`,
          en: `${BASE_URL}/contact`,
        },
      },
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      alternates: {
        languages: {
          nl: `${BASE_URL}/blog`,
          en: `${BASE_URL}/blog`,
        },
      },
    },
    {
      url: `${BASE_URL}/vacatures`,
      lastModified: now,
      alternates: {
        languages: {
          nl: `${BASE_URL}/vacatures`,
          en: `${BASE_URL}/vacatures`,
        },
      },
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
    },
  ];

  // ── Dynamic: Blog posts from Sanity ──
  let blogPosts: SanitySlug[] = [];
  try {
    blogPosts = await sanityFetch<SanitySlug[]>(
      `*[_type == "blogPost" && defined(slug.current)] | order(_updatedAt desc) {
        "slug": slug.current,
        _updatedAt
      }`
    );
  } catch (e) {
    console.error("Sitemap: failed to fetch blog posts", e);
  }

  const blogEntries: MetadataRoute.Sitemap = (blogPosts || []).map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post._updatedAt || now,
    alternates: {
      languages: {
        nl: `${BASE_URL}/blog/${post.slug}`,
        en: `${BASE_URL}/blog/${post.slug}`,
      },
    },
  }));

  // ── Dynamic: Job postings from Sanity ──
  let jobPostings: SanitySlug[] = [];
  try {
    jobPostings = await sanityFetch<SanitySlug[]>(
      `*[_type == "jobPosting" && defined(slug.current)] | order(_updatedAt desc) {
        "slug": slug.current,
        _updatedAt
      }`
    );
  } catch (e) {
    console.error("Sitemap: failed to fetch job postings", e);
  }

  const jobEntries: MetadataRoute.Sitemap = (jobPostings || []).map((job) => ({
    url: `${BASE_URL}/vacatures/${job.slug}`,
    lastModified: job._updatedAt || now,
    alternates: {
      languages: {
        nl: `${BASE_URL}/vacatures/${job.slug}`,
        en: `${BASE_URL}/vacatures/${job.slug}`,
      },
    },
  }));

  return [...staticPages, ...blogEntries, ...jobEntries];
}
