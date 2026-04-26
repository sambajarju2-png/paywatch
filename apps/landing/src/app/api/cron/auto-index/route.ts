import { NextRequest, NextResponse } from "next/server";
import { comparisons } from "@/lib/comparison-data";

export const maxDuration = 60;

const BASE = "https://paywatch.app";
const INDEXNOW_KEY = "11ad79aad72151b153e67695f1e06573";
const CRON_SECRET = process.env.CRON_SECRET;

// Build URL list dynamically
function getAllUrls(): string[] {
  const core = [
    "/", "/features", "/pricing", "/schuldhulp", "/app-voor-schulden-voorkomen",
    "/blog", "/about", "/support", "/resources", "/contact",
    "/vergelijking", "/vergelijking/schuldhulpmaatje",
  ];

  const compPages = comparisons.map((c) => `/vergelijking/${c.slug}`);

  const features = [
    "email-scanner", "camera-scanner", "betaalfases", "buddy",
    "cashflow", "maandbudget", "conceptbrieven", "inzichten",
    "hulpverleners", "community", "agenda", "betalingen", "schuldvrij-countdown",
  ].map((s) => `/features/${s}`);

  const cities = [
    "rotterdam", "amsterdam", "den-haag", "utrecht", "eindhoven",
    "groningen", "tilburg", "almere", "breda", "nijmegen",
    "arnhem", "haarlem", "enschede", "zaanstad", "amersfoort",
    "apeldoorn", "leiden", "dordrecht", "maastricht", "s-hertogenbosch",
  ].map((s) => `/schuldhulp/${s}`);

  return [...core, ...compPages, ...features, ...cities];
}

// IndexNow: Bing, Yandex, Seznam, Naver (free, no auth needed)
async function submitIndexNow(urls: string[]): Promise<{ status: number; engine: string }[]> {
  const fullUrls = urls.map((p) => `${BASE}${p}`);
  const results: { status: number; engine: string }[] = [];

  // IndexNow supports batch submission (up to 10,000 URLs)
  const body = JSON.stringify({
    host: "paywatch.app",
    key: INDEXNOW_KEY,
    keyLocation: `${BASE}/${INDEXNOW_KEY}.txt`,
    urlList: fullUrls,
  });

  const engines = [
    { name: "IndexNow (Bing)", url: "https://api.indexnow.org/indexnow" },
    { name: "Yandex", url: "https://yandex.com/indexnow" },
  ];

  for (const engine of engines) {
    try {
      const res = await fetch(engine.url, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body,
      });
      results.push({ engine: engine.name, status: res.status });
    } catch {
      results.push({ engine: engine.name, status: 0 });
    }
  }

  return results;
}

// Google Indexing API (only if credentials exist)
async function submitGoogleBatch(urls: string[]): Promise<{ submitted: number; failed: number } | null> {
  const email = process.env.GOOGLE_SA_EMAIL;
  const privateKey = process.env.GOOGLE_SA_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!email || !privateKey) return null;

  try {
    // Get access token
    const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    const now = Math.floor(Date.now() / 1000);
    const claim = btoa(JSON.stringify({
      iss: email,
      scope: "https://www.googleapis.com/auth/indexing",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }));

    const pemBody = privateKey
      .replace("-----BEGIN PRIVATE KEY-----", "")
      .replace("-----END PRIVATE KEY-----", "")
      .replace(/\s/g, "");
    const binaryKey = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));
    const cryptoKey = await crypto.subtle.importKey("pkcs8", binaryKey, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
    const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, new TextEncoder().encode(`${header}.${claim}`));
    const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${header}.${claim}.${sigB64}`,
    });
    const { access_token } = await tokenRes.json();
    if (!access_token) return null;

    // Submit URLs (max 200/day, we submit top priority ones)
    const priorityUrls = urls.slice(0, 50).map((p) => `${BASE}${p}`);
    let submitted = 0;
    let failed = 0;

    for (const url of priorityUrls) {
      const res = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${access_token}` },
        body: JSON.stringify({ url, type: "URL_UPDATED" }),
      });
      if (res.status === 200) submitted++;
      else failed++;
      await new Promise((r) => setTimeout(r, 100));
    }

    return { submitted, failed };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  // Auth: Vercel Cron header or secret param
  const isVercelCron = req.headers.get("authorization") === `Bearer ${CRON_SECRET}`;
  const isSecretParam = req.nextUrl.searchParams.get("secret") === CRON_SECRET;

  if (!isVercelCron && !isSecretParam) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const urls = getAllUrls();
  const start = Date.now();

  // Submit to IndexNow (Bing, Yandex)
  const indexNowResults = await submitIndexNow(urls);

  // Submit to Google (if configured)
  const googleResult = await submitGoogleBatch(urls);

  const duration = Date.now() - start;

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    duration: `${duration}ms`,
    totalUrls: urls.length,
    indexNow: indexNowResults,
    google: googleResult || "not configured (set GOOGLE_SA_EMAIL + GOOGLE_SA_PRIVATE_KEY)",
  });
}
