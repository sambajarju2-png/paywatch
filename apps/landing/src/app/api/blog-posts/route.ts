import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { blogPostsFull } from "@/lib/blog-content";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "pwf6qbjc",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-03-15",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const QUERY = `*[_type == "blogPost"] | order(publishedAt desc) {
  "slug": slug.current,
  title,
  excerpt,
  metaDescription,
  category->{title, "slug": slug.current},
  publishedAt,
  readTime,
  author,
  "mainImageUrl": mainImage.asset->url,
  "keywords": keywords[]
}`;

export const revalidate = 60;

export async function GET() {
  try {
    const sanityPosts = await client.fetch(QUERY);
    if (sanityPosts && sanityPosts.length > 0) {
      const posts = sanityPosts.map((post: Record<string, unknown>) => {
        const title = (post.title as Record<string, string>) || {};
        const excerpt = (post.excerpt as Record<string, string>) || {};
        const meta = (post.metaDescription as Record<string, string>) || {};
        const cat = (post.category as Record<string, string>) || {};
        const author = (post.author as Record<string, string>) || {};

        return {
          slug: post.slug || "",
          title: { nl: title.nl || title.en || "", en: title.en || title.nl || "" },
          excerpt: { nl: excerpt.nl || "", en: excerpt.en || "" },
          metaDescription: { nl: meta.nl || excerpt.nl || "", en: meta.en || excerpt.en || "" },
          category: { nl: cat.title || "", en: cat.title || "" },
          categorySlug: cat.slug || "educatie",
          date: ((post.publishedAt as string) || "").slice(0, 10),
          readTime: (post.readTime as string) || "5 min",
          author: author.name || "PayWatch",
          keywords: (post.keywords as string[]) || [],
          mainImageUrl: (post.mainImageUrl as string) || null,
          sections: [],
        };
      });
      return NextResponse.json({ posts });
    }
  } catch (e) {
    console.error("[Sanity] Blog posts API error:", e);
  }

  // Fallback to hardcoded
  return NextResponse.json({ posts: blogPostsFull });
}
