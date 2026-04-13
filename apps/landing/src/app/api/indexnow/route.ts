import { NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";

const CRON_SECRET = process.env.CRON_SECRET!;
const BASE = "https://paywatch.app";
const INDEXNOW_KEY = "paywatch";

const sanity = createClient({
  projectId: "pwf6qbjc",
  dataset: "production",
  apiVersion: "2024-03-15",
  useCdn: true,
});

const STATIC_URLS = [
  "/", "/features", "/pricing", "/about", "/blog", "/resources",
  "/schuldhulp", "/jobs", "/contact", "/support", "/roadmap", "/tech-stack",
  "/privacy", "/terms", "/data-processing",
  // Feature pages
  "/features/agenda", "/features/betaalfases", "/features/betalingen",
  "/features/buddy", "/features/camera-scanner", "/features/cashflow",
  "/features/community", "/features/conceptbrieven", "/features/email-scanner",
  "/features/hulpverleners", "/features/inzichten", "/features/maandbudget",
  "/features/schuldvrij-countdown",
  // City pages
  "/schuldhulp/rotterdam", "/schuldhulp/amsterdam", "/schuldhulp/den-haag",
  "/schuldhulp/utrecht", "/schuldhulp/eindhoven", "/schuldhulp/groningen",
  "/schuldhulp/tilburg", "/schuldhulp/almere", "/schuldhulp/breda",
  "/schuldhulp/nijmegen", "/schuldhulp/arnhem", "/schuldhulp/haarlem",
  "/schuldhulp/enschede", "/schuldhulp/zaanstad", "/schuldhulp/amersfoort",
  "/schuldhulp/apeldoorn", "/schuldhulp/leiden", "/schuldhulp/dordrecht",
  "/schuldhulp/maastricht", "/schuldhulp/s-hertogenbosch",
  // B2B pages
  "/gemeente-contact", "/incasso-contact", "/hulporg-contact", "/zakelijk-contact",
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Collect all URLs
  const urls = STATIC_URLS.map((path) => `${BASE}${path}`);

  // Add blog posts from Sanity
  try {
    const posts = await sanity.fetch<Array<{ slug: string }>>(
      `*[_type == "blogPost" && defined(slug.current) && !(_id in path("drafts.**"))]{ "slug": slug.current }`
    );
    for (const post of posts || []) {
      urls.push(`${BASE}/blog/${post.slug}`);
    }
  } catch {
    // Continue without blog posts
  }

  // Submit to IndexNow (max 10,000 URLs per request)
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "paywatch.app",
        key: INDEXNOW_KEY,
        keyLocation: `${BASE}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    });

    return NextResponse.json({
      success: true,
      submitted: urls.length,
      indexNowStatus: res.status,
      indexNowResponse: res.statusText,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      submitted: urls.length,
      error: String(error),
    }, { status: 500 });
  }
}
