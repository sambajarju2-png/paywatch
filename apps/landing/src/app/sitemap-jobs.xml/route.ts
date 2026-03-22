import { NextResponse } from "next/server";
import { sanityFetch, type SanityDocument } from "@/lib/sanity-sitemap";

const BASE_URL = "https://paywatch.app";

export async function GET() {
  let jobs: SanityDocument[] = [];

  try {
    jobs = await sanityFetch<SanityDocument[]>(
      `*[_type == "jobPosting" && defined(slug.current)] | order(_updatedAt desc) {
        "slug": slug.current,
        _updatedAt
      }`
    );
  } catch (e) {
    console.error("Sitemap jobs fetch error:", e);
  }

  const urls = (jobs || [])
    .map(
      (job) => `  <url>
    <loc>${BASE_URL}/vacatures/${job.slug}</loc>
    <lastmod>${job._updatedAt}</lastmod>
    <xhtml:link rel="alternate" hreflang="nl" href="${BASE_URL}/vacatures/${job.slug}" />
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/vacatures/${job.slug}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/vacatures/${job.slug}" />
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${urls}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
