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
        title, metaDescription, publishedAt, author, "keywords": keywords[],
        "imageUrl": mainImage.asset->url
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
      publishedTime: post.publishedAt || post.date,
      authors: ["PayWatch"],
    },
  };
}

export function generateStaticParams() {
  // Pre-generate hardcoded slugs; Sanity slugs are handled dynamically
  return blogPostsFull.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  // Fetch post data for JSON-LD
  const post = await getPostMeta(slug);

  const title = post?.title?.nl || post?.title?.en || slug;
  const desc = post?.metaDescription?.nl || post?.metaDescription?.en || "";
  const publishedAt = post?.publishedAt || post?.date || new Date().toISOString();
  const imageUrl = post?.imageUrl || "https://paywatch.app/og-image.png";

  // Article JSON-LD for Google rich results
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: desc,
    image: imageUrl,
    datePublished: publishedAt,
    dateModified: publishedAt,
    author: {
      "@type": "Person",
      name: "Samba",
      url: "https://www.linkedin.com/in/sambajarju/",
    },
    publisher: {
      "@type": "Organization",
      name: "PayWatch",
      url: "https://paywatch.app",
      logo: {
        "@type": "ImageObject",
        url: "https://paywatch.app/favicon-32x32.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://paywatch.app/blog/${slug}`,
    },
    inLanguage: "nl",
    isAccessibleForFree: true,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BlogPostContent slug={slug} />
    </>
  );
}
