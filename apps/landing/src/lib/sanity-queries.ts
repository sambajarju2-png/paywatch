import { sanityClient, serverSanityClient } from "./sanity";
import { blogPostsFull, type BlogPostFull } from "./blog-content";

/**
 * Use serverSanityClient (with SANITY_API_TOKEN) for server-side fetches.
 * Falls back to public sanityClient if token is not set.
 */
function getServerClient() {
  if (process.env.SANITY_API_TOKEN) {
    return serverSanityClient;
  }
  return sanityClient;
}

/* ─── Blog Post Queries ─── */

const BLOG_POSTS_QUERY = `*[_type == "blogPost"] | order(publishedAt desc) {
  "slug": slug.current,
  title,
  excerpt,
  metaDescription,
  category->{title, "slug": slug.current},
  publishedAt,
  readTime,
  author,
  mainImage,
  "keywords": keywords[]
}`;

const BLOG_POST_BY_SLUG_QUERY = `*[_type == "blogPost" && slug.current == $slug][0] {
  "slug": slug.current,
  title,
  excerpt,
  metaDescription,
  category->{title, "slug": slug.current},
  publishedAt,
  readTime,
  author,
  mainImage,
  "keywords": keywords[],
  body[] {
    ...,
    _type == "image" => {
      ...,
      "url": asset->url
    }
  }
}`;

/* ─── Feature Queries ─── */

const FEATURES_QUERY = `*[_type == "feature"] | order(order asc) {
  title,
  description,
  icon,
  screenshot,
  order
}`;

/* ─── Navigation Queries ─── */

const NAVIGATION_QUERY = `*[_type == "navigation" && placement == $placement][0] {
  items[] {
    label,
    href,
    isExternal
  }
}`;

/* ─── Job Listing Queries ─── */

const JOB_LISTINGS_QUERY = `*[_type == "jobListing" && active == true] | order(_createdAt desc) {
  "id": id.current,
  title,
  department,
  seniority,
  location,
  salary,
  description,
  longDescription,
  requirements,
  niceToHave,
  perks,
  active
}`;

const JOB_LISTING_BY_ID_QUERY = `*[_type == "jobListing" && id.current == $jobId && active == true][0] {
  "id": id.current,
  title,
  department,
  seniority,
  location,
  salary,
  description,
  longDescription,
  requirements,
  niceToHave,
  perks,
  active
}`;

/* ─── Fetch Functions with Hardcoded Fallbacks ─── */

export async function getBlogPosts(): Promise<BlogPostFull[]> {
  try {
    const client = getServerClient();
    const sanityPosts = await client.fetch(BLOG_POSTS_QUERY);
    if (sanityPosts && sanityPosts.length > 0) {
      console.log(`[Sanity] Fetched ${sanityPosts.length} blog posts from CMS`);
      return sanityPosts.map(mapSanityToLocal);
    }
    console.log("[Sanity] No blog posts found in CMS, using hardcoded content");
  } catch (e) {
    console.error("[Sanity] Blog fetch failed:", e instanceof Error ? e.message : e);
  }
  return blogPostsFull;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostFull | null> {
  try {
    const client = getServerClient();
    const post = await client.fetch(BLOG_POST_BY_SLUG_QUERY, { slug });
    if (post) {
      console.log(`[Sanity] Fetched blog post "${slug}" from CMS`);
      return mapSanityToLocal(post);
    }
    console.log(`[Sanity] Blog post "${slug}" not found in CMS, checking hardcoded`);
  } catch (e) {
    console.error(`[Sanity] Blog post fetch failed for "${slug}":`, e instanceof Error ? e.message : e);
  }
  return blogPostsFull.find((p) => p.slug === slug) || null;
}

export async function getFeatures() {
  try {
    const client = getServerClient();
    const features = await client.fetch(FEATURES_QUERY);
    if (features && features.length > 0) return features;
  } catch (e) {
    console.error("[Sanity] Features fetch failed:", e instanceof Error ? e.message : e);
  }
  return null;
}

export async function getNavigation(placement: "header" | "footer") {
  try {
    const client = getServerClient();
    const nav = await client.fetch(NAVIGATION_QUERY, { placement });
    if (nav?.items) return nav.items;
  } catch (e) {
    console.error("[Sanity] Navigation fetch failed:", e instanceof Error ? e.message : e);
  }
  return null;
}

export async function getJobListings() {
  try {
    const client = getServerClient();
    const jobs = await client.fetch(JOB_LISTINGS_QUERY);
    if (jobs && jobs.length > 0) {
      console.log(`[Sanity] Fetched ${jobs.length} job listings from CMS`);
      return jobs;
    }
    console.log("[Sanity] No job listings in CMS, using hardcoded");
  } catch (e) {
    console.error("[Sanity] Job listings fetch failed:", e instanceof Error ? e.message : e);
  }
  return null; // signals to use hardcoded
}

export async function getJobListingById(jobId: string) {
  try {
    const client = getServerClient();
    const job = await client.fetch(JOB_LISTING_BY_ID_QUERY, { jobId });
    if (job) {
      console.log(`[Sanity] Fetched job listing "${jobId}" from CMS`);
      return job;
    }
  } catch (e) {
    console.error(`[Sanity] Job listing fetch failed for "${jobId}":`, e instanceof Error ? e.message : e);
  }
  return null;
}

/* ─── Mappers ─── */

function mapSanityToLocal(post: Record<string, unknown>): BlogPostFull {
  const title = post.title as Record<string, string> || {};
  const excerpt = post.excerpt as Record<string, string> || {};
  const meta = post.metaDescription as Record<string, string> || {};
  const cat = post.category as Record<string, string> || {};
  const author = post.author as Record<string, string> || {};

  return {
    slug: (post.slug as string) || "",
    title: { nl: title.nl || title.en || "", en: title.en || title.nl || "" },
    excerpt: { nl: excerpt.nl || "", en: excerpt.en || "" },
    metaDescription: { nl: meta.nl || excerpt.nl || "", en: meta.en || excerpt.en || "" },
    category: { nl: cat.title || "", en: cat.title || "" },
    categorySlug: cat.slug || "educatie",
    date: (post.publishedAt as string)?.slice(0, 10) || "",
    readTime: (post.readTime as string) || "5 min",
    author: author.name || "PayWatch",
    keywords: (post.keywords as string[]) || [],
    sections: [], // Sanity uses portable text — sections are in `body` field
  };
}

/* ─── Site Images ─── */

const SITE_IMAGES_QUERY = `*[_type == "siteImage"]{
  key,
  "url": image.asset->url,
  alt,
  page
}`;

export async function getSiteImages(): Promise<Record<string, { url: string; alt: string }>> {
  try {
    const images = await sanityClient.fetch(SITE_IMAGES_QUERY);
    const map: Record<string, { url: string; alt: string }> = {};
    for (const img of images || []) {
      if (img.key && img.url) {
        map[img.key] = { url: img.url, alt: img.alt || "" };
      }
    }
    return map;
  } catch {
    return {};
  }
}

export async function getSiteImage(key: string): Promise<string | null> {
  try {
    const result = await sanityClient.fetch(
      `*[_type == "siteImage" && key == $key][0]{"url": image.asset->url}`,
      { key }
    );
    return result?.url || null;
  } catch {
    return null;
  }
}
