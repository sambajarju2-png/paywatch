import { sanityClient, getClient } from "./sanity";
import { blogPostsFull, type BlogPostFull } from "./blog-content";

/* ─── Blog Post Queries ─── */

const BLOG_POSTS_QUERY = `*[_type == "blogPost"] | order(publishedAt desc) {
  "slug": slug.current,
  title,
  excerpt,
  metaDescription,
  category->{title, "slug": slug.current},
  publishedAt,
  readTime,
  author->{name},
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
  author->{name},
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

/* ─── Fetch Functions with Hardcoded Fallbacks ─── */

export async function getBlogPosts(): Promise<BlogPostFull[]> {
  try {
    const sanityPosts = await sanityClient.fetch(BLOG_POSTS_QUERY);
    if (sanityPosts && sanityPosts.length > 0) {
      return sanityPosts.map(mapSanityToLocal);
    }
  } catch (e) {
    console.log("Sanity blog fetch failed, using hardcoded content");
  }
  // Fallback to hardcoded
  return blogPostsFull;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostFull | null> {
  try {
    const post = await sanityClient.fetch(BLOG_POST_BY_SLUG_QUERY, { slug });
    if (post) return mapSanityToLocal(post);
  } catch (e) {
    console.log("Sanity post fetch failed, using hardcoded content");
  }
  // Fallback to hardcoded
  return blogPostsFull.find((p) => p.slug === slug) || null;
}

export async function getFeatures() {
  try {
    const features = await sanityClient.fetch(FEATURES_QUERY);
    if (features && features.length > 0) return features;
  } catch (e) {
    console.log("Sanity features fetch failed, using hardcoded content");
  }
  return null; // Signals to use hardcoded
}

export async function getNavigation(placement: "header" | "footer") {
  try {
    const nav = await sanityClient.fetch(NAVIGATION_QUERY, { placement });
    if (nav?.items) return nav.items;
  } catch (e) {
    console.log("Sanity navigation fetch failed, using hardcoded");
  }
  return null;
}

/* ─── Mappers ─── */

function mapSanityToLocal(post: Record<string, unknown>): BlogPostFull {
  const title = post.title as Record<string, string> || {};
  const excerpt = post.excerpt as Record<string, string> || {};
  const meta = post.metaDescription as Record<string, string> || {};
  const cat = post.category as Record<string, string> || {};

  return {
    slug: (post.slug as string) || "",
    title: { nl: title.nl || title.en || "", en: title.en || title.nl || "" },
    excerpt: { nl: excerpt.nl || "", en: excerpt.en || "" },
    metaDescription: { nl: meta.nl || excerpt.nl || "", en: meta.en || excerpt.en || "" },
    category: { nl: cat.title || "", en: cat.title || "" },
    categorySlug: cat.slug || "educatie",
    date: (post.publishedAt as string)?.slice(0, 10) || "",
    readTime: (post.readTime as string) || "5 min",
    author: ((post.author as Record<string, string>)?.name) || "PayWatch",
    keywords: (post.keywords as string[]) || [],
    sections: [], // Sanity uses portable text — sections are in `body` field
  };
}
