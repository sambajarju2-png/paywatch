import type { Metadata } from "next";
import { createClient } from "next-sanity";
import { blogPostsFull } from "@/lib/blog-content";
import BlogPostContent from "@/components/BlogPostContent";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "pwf6qbjc",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-03-15",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPostMeta(slug: string) {
  // Try Sanity first
  try {
    const post = await client.fetch(
      `*[_type == "blogPost" && slug.current == $slug][0]{
        title, metaDescription, publishedAt, author, "keywords": keywords[]
      }`,
      { slug }
    );
    if (post) return post;
  } catch {
    // fall through
  }
  // Fallback to hardcoded
  return blogPostsFull.find((p) => p.slug === slug) || null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostMeta(slug);
  if (!post) return { title: "Blog | PayWatch" };

  const title = post.title?.nl || post.title?.en || slug;
  const desc = post.metaDescription?.nl || post.metaDescription?.en || "";

  return {
    title,
    description: desc,
    alternates: { canonical: `https://paywatch.app/blog/${slug}` },
    openGraph: {
      title,
      description: desc,
      url: `https://paywatch.app/blog/${slug}`,
      type: "article",
    },
  };
}

export function generateStaticParams() {
  // Pre-generate hardcoded slugs; Sanity slugs are handled dynamically
  return blogPostsFull.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  return <BlogPostContent slug={slug} />;
}
