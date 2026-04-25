import { NextResponse } from "next/server";

const BASE_URL = "https://paywatch.app";

const PAGES = [
  { path: "/", hreflang: true },
  { path: "/features", hreflang: true },
  { path: "/about", hreflang: true },
  { path: "/pricing", hreflang: true },
  { path: "/contact", hreflang: true },
  { path: "/blog", hreflang: true },
  { path: "/vacatures", hreflang: true },
  { path: "/vergelijking", hreflang: true },
  { path: "/vergelijking/dyme-alternatief", hreflang: true },
  { path: "/vergelijking/fikks-alternatief", hreflang: true },
  { path: "/vergelijking/grassfeld-alternatief", hreflang: true },
  { path: "/vergelijking/cleo-alternatief", hreflang: true },
  { path: "/vergelijking/monefy-alternatief", hreflang: true },
  { path: "/vergelijking/ynab-alternatief", hreflang: true },
  { path: "/vergelijking/buddy-alternatief", hreflang: true },
  { path: "/vergelijking/mijngeldzaken-alternatief", hreflang: true },
  { path: "/privacy", hreflang: false },
  { path: "/terms", hreflang: false },
];

export async function GET() {
  const now = new Date().toISOString();

  const urls = PAGES.map((page) => {
    const hreflangBlock = page.hreflang
      ? `
    <xhtml:link rel="alternate" hreflang="nl" href="${BASE_URL}${page.path}" />
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${page.path}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${page.path}" />`
      : "";

    return `  <url>
    <loc>${BASE_URL}${page.path}</loc>
    <lastmod>${now}</lastmod>${hreflangBlock}
  </url>`;
  }).join("\n");

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
