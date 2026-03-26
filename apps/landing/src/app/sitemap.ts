import { createClient } from '@sanity/client';
import type { MetadataRoute } from 'next';

const sanity = createClient({
  projectId: 'pwf6qbjc',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://paywatch.app';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/features`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/jobs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/resources`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/data-processing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/roadmap`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/tech-stack`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ];

  // Fetch all blog post slugs from Sanity
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await sanity.fetch<{ slug: string; publishedAt: string }[]>(
      `*[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc) {
        "slug": slug.current,
        publishedAt
      }`
    );
    blogPages = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Sitemap: Failed to fetch blog posts from Sanity', error);
  }

  // Fetch job listings from Sanity (if they exist there)
  let jobPages: MetadataRoute.Sitemap = [];
  try {
    const jobs = await sanity.fetch<{ id: string; updatedAt: string }[]>(
      `*[_type == "jobListing" && defined(id)] {
        "id": id,
        "updatedAt": _updatedAt
      }`
    );
    jobPages = jobs.map((job) => ({
      url: `${baseUrl}/jobs/${job.id}`,
      lastModified: job.updatedAt ? new Date(job.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch {
    // Jobs might be hardcoded, not in Sanity — that's fine
  }

  return [...staticPages, ...blogPages, ...jobPages];
}
