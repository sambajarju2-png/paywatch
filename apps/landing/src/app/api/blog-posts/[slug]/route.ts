import { NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "pwf6qbjc",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-03-15",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const QUERY = `*[_type == "blogPost" && slug.current == $slug][0] {
  "slug": slug.current,
  title,
  excerpt,
  metaDescription,
  category->{title, "slug": slug.current},
  publishedAt,
  readTime,
  author,
  "mainImageUrl": mainImage.asset->url,
  "mainImageAlt": mainImage.alt,
  "keywords": keywords[],
  body[] {
    ...,
    _type == "image" => {
      ...,
      "url": asset->url
    }
  }
}`;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const post = await client.fetch(QUERY, { slug });
    if (!post) {
      return NextResponse.json({ post: null });
    }
    return NextResponse.json({ post });
  } catch (e) {
    console.error("[Sanity] Blog post detail fetch error:", e);
    return NextResponse.json({ post: null });
  }
}
