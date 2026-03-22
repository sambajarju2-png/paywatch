import { MetadataRoute } from "next";
import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "pwf6qbjc",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-03-15",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://paywatch.app";
  const now = new Date().toISOString();

  /* Static pages */
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/features`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/resources`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/jobs`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/data-processing`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  /* Dynamic: blog posts from Sanity */
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await client.fetch<Array<{ slug: string; publishedAt: string }>>(
      `*[_type == "blogPost"]{ "slug": slug.current, publishedAt }`
    );
    blogPages = (posts || []).map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.publishedAt || now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch (e) {
    console.error("[Sitemap] Blog posts fetch failed:", e);
  }

  /* Dynamic: job listings from Sanity */
  let jobPages: MetadataRoute.Sitemap = [];
  try {
    const jobs = await client.fetch<Array<{ id: string; _updatedAt: string }>>(
      `*[_type == "jobListing" && active == true]{ "id": id.current, _updatedAt }`
    );
    jobPages = (jobs || []).map((job) => ({
      url: `${baseUrl}/jobs/${job.id}`,
      lastModified: job._updatedAt || now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch (e) {
    console.error("[Sitemap] Job listings fetch failed:", e);
  }

  /* Dynamic: legal pages from Sanity */
  let legalPages: MetadataRoute.Sitemap = [];
  try {
    const legals = await client.fetch<Array<{ slug: string; _updatedAt: string }>>(
      `*[_type == "legalPage"]{ "slug": slug.current, _updatedAt }`
    );
    legalPages = (legals || []).map((page) => ({
      url: `${baseUrl}/legal/${page.slug}`,
      lastModified: page._updatedAt || now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    }));
  } catch (e) {
    console.error("[Sitemap] Legal pages fetch failed:", e);
  }

  /* Dynamic: custom pages from Sanity */
  let customPages: MetadataRoute.Sitemap = [];
  try {
    const pages = await client.fetch<Array<{ slug: string; _updatedAt: string }>>(
      `*[_type == "page"]{ "slug": slug.current, _updatedAt }`
    );
    customPages = (pages || []).map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: page._updatedAt || now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));
  } catch (e) {
    console.error("[Sitemap] Custom pages fetch failed:", e);
  }

  return [...staticPages, ...blogPages, ...jobPages, ...legalPages, ...customPages];
}
