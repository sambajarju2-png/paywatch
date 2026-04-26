import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { comparisons } from "@/lib/comparison-data";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

const BASE = "https://paywatch.app";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "pwf6qbjc",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-03-15",
  useCdn: true,
});

interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: string;
  priority: string;
  hreflang?: boolean;
}

function entry(e: SitemapEntry): string {
  const alt = e.hreflang !== false
    ? `
    <xhtml:link rel="alternate" hreflang="nl" href="${e.url}" />
    <xhtml:link rel="alternate" hreflang="en" href="${e.url}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${e.url}" />`
    : "";

  return `  <url>
    <loc>${e.url}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>${alt}
  </url>`;
}

export async function GET() {
  const now = new Date().toISOString().split("T")[0];

  // ── Core pages (highest priority) ──
  const corePages: SitemapEntry[] = [
    { url: BASE, lastmod: now, changefreq: "weekly", priority: "1.0" },
    { url: `${BASE}/features`, lastmod: now, changefreq: "weekly", priority: "0.9" },
    { url: `${BASE}/pricing`, lastmod: now, changefreq: "monthly", priority: "0.9" },
    { url: `${BASE}/schuldhulp`, lastmod: now, changefreq: "weekly", priority: "0.9" },
    { url: `${BASE}/blog`, lastmod: now, changefreq: "daily", priority: "0.8" },
    { url: `${BASE}/about`, lastmod: now, changefreq: "monthly", priority: "0.7" },
    { url: `${BASE}/support`, lastmod: now, changefreq: "monthly", priority: "0.7" },
    { url: `${BASE}/resources`, lastmod: now, changefreq: "weekly", priority: "0.7" },
    { url: `${BASE}/contact`, lastmod: now, changefreq: "monthly", priority: "0.6" },
    { url: `${BASE}/directory`, lastmod: now, changefreq: "monthly", priority: "0.6" },
    { url: `${BASE}/jobs`, lastmod: now, changefreq: "weekly", priority: "0.5" },
    { url: `${BASE}/roadmap`, lastmod: now, changefreq: "monthly", priority: "0.5" },
  ];

  // ── Comparison pages (auto-generated from comparison-data.ts) ──
  const comparisonPages: SitemapEntry[] = [
    { url: `${BASE}/vergelijking`, lastmod: now, changefreq: "weekly", priority: "0.85" },
    { url: `${BASE}/vergelijking/schuldhulpmaatje`, lastmod: now, changefreq: "monthly", priority: "0.85" },
    { url: `${BASE}/app-voor-schulden-voorkomen`, lastmod: now, changefreq: "weekly", priority: "0.9" },
    ...comparisons.map((c) => ({
      url: `${BASE}/vergelijking/${c.slug}`,
      lastmod: now,
      changefreq: "monthly" as const,
      priority: "0.8",
    })),
  ];

  // ── Feature detail pages ──
  const featureSlugs = [
    "email-scanner", "camera-scanner", "betaalfases", "buddy",
    "cashflow", "maandbudget", "conceptbrieven", "inzichten",
    "hulpverleners", "community", "agenda", "betalingen",
    "schuldvrij-countdown",
  ];
  const featurePages: SitemapEntry[] = featureSlugs.map((s) => ({
    url: `${BASE}/features/${s}`,
    lastmod: now,
    changefreq: "monthly",
    priority: "0.7",
  }));

  // ── Schuldhulp city pages ──
  const citySlugs = [
    "rotterdam", "amsterdam", "den-haag", "utrecht", "eindhoven",
    "groningen", "tilburg", "almere", "breda", "nijmegen",
    "arnhem", "haarlem", "enschede", "zaanstad", "amersfoort",
    "apeldoorn", "leiden", "dordrecht", "maastricht", "s-hertogenbosch",
  ];
  const cityPages: SitemapEntry[] = citySlugs.map((s) => ({
    url: `${BASE}/schuldhulp/${s}`,
    lastmod: now,
    changefreq: "monthly",
    priority: "0.75",
  }));

  // ── B2B contact pages ──
  const b2bPages: SitemapEntry[] = [
    "gemeente-contact", "incasso-contact", "hulporg-contact", "zakelijk-contact",
  ].map((s) => ({
    url: `${BASE}/${s}`,
    lastmod: now,
    changefreq: "monthly",
    priority: "0.6",
  }));

  // ── Blog posts from Sanity ──
  let blogPages: SitemapEntry[] = [];
  try {
    const posts = await client.fetch<Array<{ slug: string; publishedAt: string }>>(
      `*[_type == "blogPost" && defined(slug.current) && !(_id in path("drafts.**"))] | order(publishedAt desc) {
        "slug": slug.current,
        publishedAt
      }`
    );
    const seen = new Set<string>();
    for (const post of posts || []) {
      if (seen.has(post.slug)) continue;
      seen.add(post.slug);
      blogPages.push({
        url: `${BASE}/blog/${post.slug}`,
        lastmod: post.publishedAt?.split("T")[0] || now,
        changefreq: "monthly",
        priority: "0.7",
      });
    }
  } catch (e) {
    console.error("[Sitemap] Blog fetch failed:", e);
  }

  // ── Job listings from Sanity ──
  let jobPages: SitemapEntry[] = [];
  try {
    const jobs = await client.fetch<Array<{ id: string; _updatedAt: string }>>(
      `*[_type == "jobListing" && active == true]{ "id": id.current, _updatedAt }`
    );
    jobPages = (jobs || []).map((j) => ({
      url: `${BASE}/jobs/${j.id}`,
      lastmod: j._updatedAt?.split("T")[0] || now,
      changefreq: "weekly",
      priority: "0.5",
    }));
  } catch (e) {
    console.error("[Sitemap] Jobs fetch failed:", e);
  }

  // ── Legal pages (lowest priority) ──
  const legalPages: SitemapEntry[] = [
    { url: `${BASE}/privacy`, lastmod: now, changefreq: "yearly", priority: "0.3", hreflang: false },
    { url: `${BASE}/terms`, lastmod: now, changefreq: "yearly", priority: "0.3", hreflang: false },
    { url: `${BASE}/data-processing`, lastmod: now, changefreq: "yearly", priority: "0.3", hreflang: false },
  ];

  // ── Build XML ──
  const all = [
    ...corePages, ...comparisonPages, ...featurePages,
    ...cityPages, ...b2bPages, ...blogPages, ...jobPages,
    ...legalPages,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${all.map((e) => entry(e)).join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
