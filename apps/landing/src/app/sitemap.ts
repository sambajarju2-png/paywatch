import type { MetadataRoute } from "next";
import { createClient } from "next-sanity";

const BASE_URL = "https://paywatch.app";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "pwf6qbjc",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-03-15",
  useCdn: false,
});

/* ── Feature page slugs (matches /features/[slug]) ── */
const FEATURE_SLUGS = [
  "agenda",
  "betaalfases",
  "betalingen",
  "buddy",
  "camera-scanner",
  "cashflow",
  "community",
  "conceptbrieven",
  "email-scanner",
  "hulpverleners",
  "inzichten",
  "maandbudget",
  "schuldvrij-countdown",
];

/* ── Schuldhulp city page slugs ── */
const SCHULDHULP_CITY_SLUGS = [
  "rotterdam",
  "amsterdam",
  "den-haag",
  "utrecht",
  "eindhoven",
  "groningen",
  "tilburg",
  "almere",
  "breda",
  "nijmegen",
  "arnhem",
  "haarlem",
  "enschede",
  "zaanstad",
  "amersfoort",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  /* ── 1. Static pages ── */
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/features`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/resources`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/schuldhulp`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/jobs`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/support`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/roadmap`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/tech-stack`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/data-processing`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  /* ── 2. Feature pages ── */
  const featurePages: MetadataRoute.Sitemap = FEATURE_SLUGS.map((slug) => ({
    url: `${BASE_URL}/features/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  /* ── 3. Schuldhulp city pages ── */
  const schuldhulpPages: MetadataRoute.Sitemap = SCHULDHULP_CITY_SLUGS.map((slug) => ({
    url: `${BASE_URL}/schuldhulp/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  /* ── 4. Blog posts from Sanity ── */
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await client.fetch<Array<{ slug: string; publishedAt: string }>>(
      `*[_type == "blogPost" && defined(slug.current) && !(_id in path("drafts.**"))]{
        "slug": slug.current,
        publishedAt
      }`
    );
    blogPages = (posts || []).map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.publishedAt || now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch (e) {
    console.error("[Sitemap] Blog posts fetch failed:", e);
  }

  /* ── 5. Job listings from Sanity ── */
  let jobPages: MetadataRoute.Sitemap = [];
  try {
    const jobs = await client.fetch<Array<{ id: string; _updatedAt: string }>>(
      `*[_type == "jobListing" && active == true]{
        "id": id.current,
        _updatedAt
      }`
    );
    jobPages = (jobs || []).map((job) => ({
      url: `${BASE_URL}/jobs/${job.id}`,
      lastModified: job._updatedAt || now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch (e) {
    console.error("[Sitemap] Job listings fetch failed:", e);
  }

  /* ── B2B partnership pages ── */
  const partnerPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/gemeente-contact`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/incasso-contact`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/hulporg-contact`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/zakelijk-contact`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  return [...staticPages, ...featurePages, ...schuldhulpPages, ...partnerPages, ...blogPages, ...jobPages];
}
