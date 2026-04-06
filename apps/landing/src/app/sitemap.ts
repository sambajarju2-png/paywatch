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

  /* ── Helper: add hreflang for nl (primary) and en (secondary) ── */
  function withLang(url: string) {
    return {
      languages: {
        nl: url,
        en: url,
        "x-default": url,
      },
    };
  }

  /* ── 1. Static pages ── */
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: "2026-04-06", changeFrequency: "weekly", priority: 1.0, alternates: withLang(BASE_URL) },
    { url: `${BASE_URL}/features`, lastModified: "2026-03-15", changeFrequency: "monthly", priority: 0.9, alternates: withLang(`${BASE_URL}/features`) },
    { url: `${BASE_URL}/pricing`, lastModified: "2026-03-01", changeFrequency: "monthly", priority: 0.9, alternates: withLang(`${BASE_URL}/pricing`) },
    { url: `${BASE_URL}/about`, lastModified: "2026-02-15", changeFrequency: "monthly", priority: 0.7, alternates: withLang(`${BASE_URL}/about`) },
    { url: `${BASE_URL}/resources`, lastModified: "2026-03-20", changeFrequency: "weekly", priority: 0.8, alternates: withLang(`${BASE_URL}/resources`) },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8, alternates: withLang(`${BASE_URL}/blog`) },
    { url: `${BASE_URL}/schuldhulp`, lastModified: "2026-04-05", changeFrequency: "weekly", priority: 0.9, alternates: withLang(`${BASE_URL}/schuldhulp`) },
    { url: `${BASE_URL}/jobs`, lastModified: now, changeFrequency: "weekly", priority: 0.7, alternates: withLang(`${BASE_URL}/jobs`) },
    { url: `${BASE_URL}/contact`, lastModified: "2026-02-01", changeFrequency: "monthly", priority: 0.6, alternates: withLang(`${BASE_URL}/contact`) },
    { url: `${BASE_URL}/support`, lastModified: "2026-03-01", changeFrequency: "monthly", priority: 0.6, alternates: withLang(`${BASE_URL}/support`) },
    { url: `${BASE_URL}/roadmap`, lastModified: "2026-03-01", changeFrequency: "monthly", priority: 0.5, alternates: withLang(`${BASE_URL}/roadmap`) },
    { url: `${BASE_URL}/tech-stack`, lastModified: "2026-02-01", changeFrequency: "monthly", priority: 0.4, alternates: withLang(`${BASE_URL}/tech-stack`) },
    { url: `${BASE_URL}/privacy`, lastModified: "2026-01-15", changeFrequency: "yearly", priority: 0.3, alternates: withLang(`${BASE_URL}/privacy`) },
    { url: `${BASE_URL}/terms`, lastModified: "2026-01-15", changeFrequency: "yearly", priority: 0.3, alternates: withLang(`${BASE_URL}/terms`) },
    { url: `${BASE_URL}/data-processing`, lastModified: "2026-01-15", changeFrequency: "yearly", priority: 0.3, alternates: withLang(`${BASE_URL}/data-processing`) },
  ];

  /* ── 2. Feature pages ── */
  const featurePages: MetadataRoute.Sitemap = FEATURE_SLUGS.map((slug) => ({
    url: `${BASE_URL}/features/${slug}`,
    lastModified: "2026-03-15",
    changeFrequency: "monthly" as const,
    priority: 0.7,
    alternates: withLang(`${BASE_URL}/features/${slug}`),
  }));

  /* ── 3. Schuldhulp city pages ── */
  const schuldhulpPages: MetadataRoute.Sitemap = SCHULDHULP_CITY_SLUGS.map((slug) => ({
    url: `${BASE_URL}/schuldhulp/${slug}`,
    lastModified: "2026-04-05",
    changeFrequency: "monthly" as const,
    priority: 0.85,
    alternates: withLang(`${BASE_URL}/schuldhulp/${slug}`),
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
    blogPages = (posts || []).reduce<MetadataRoute.Sitemap>((acc, post) => {
      if (!acc.find((p) => p.url === `${BASE_URL}/blog/${post.slug}`)) {
        acc.push({
          url: `${BASE_URL}/blog/${post.slug}`,
          lastModified: post.publishedAt || now,
          changeFrequency: "monthly" as const,
          priority: 0.7,
        });
      }
      return acc;
    }, []);
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
    { url: `${BASE_URL}/gemeente-contact`, lastModified: "2026-04-05", changeFrequency: "monthly" as const, priority: 0.7, alternates: withLang(`${BASE_URL}/gemeente-contact`) },
    { url: `${BASE_URL}/incasso-contact`, lastModified: "2026-04-05", changeFrequency: "monthly" as const, priority: 0.7, alternates: withLang(`${BASE_URL}/incasso-contact`) },
    { url: `${BASE_URL}/hulporg-contact`, lastModified: "2026-04-05", changeFrequency: "monthly" as const, priority: 0.7, alternates: withLang(`${BASE_URL}/hulporg-contact`) },
    { url: `${BASE_URL}/zakelijk-contact`, lastModified: "2026-04-05", changeFrequency: "monthly" as const, priority: 0.7, alternates: withLang(`${BASE_URL}/zakelijk-contact`) },
  ];

  return [...staticPages, ...featurePages, ...schuldhulpPages, ...partnerPages, ...blogPages, ...jobPages];
}
