import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPostsFull } from "@/lib/blog-content";
import BlogPostContent from "@/components/BlogPostContent";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPostsFull.find((p) => p.slug === slug);
  if (!post) return { title: "Post niet gevonden" };

  return {
    title: post.title.nl,
    description: post.metaDescription.nl,
    keywords: post.keywords,
    alternates: { canonical: `https://paywatch.app/blog/${post.slug}` },
    openGraph: {
      title: post.title.nl,
      description: post.metaDescription.nl,
      url: `https://paywatch.app/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      /* IMAGE PLACEHOLDER: Add OG image per post then uncomment:
      images: [{ url: `/blog/${post.slug}/og.png`, width: 1200, height: 630 }],
      */
    },
    twitter: {
      card: "summary_large_image",
      title: post.title.nl,
      description: post.metaDescription.nl,
    },
  };
}

export function generateStaticParams() {
  return blogPostsFull.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPostsFull.find((p) => p.slug === slug);
  if (!post) notFound();

  /* JSON-LD Article structured data */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title.nl,
    description: post.metaDescription.nl,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: post.author,
      url: `https://paywatch.app/about`,
    },
    publisher: {
      "@type": "Organization",
      name: "PayWatch",
      url: "https://paywatch.app",
    },
    mainEntityOfPage: `https://paywatch.app/blog/${post.slug}`,
    keywords: post.keywords.join(", "),
    inLanguage: ["nl", "en"],
    isAccessibleForFree: true,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostContent slug={slug} />
    </>
  );
}
