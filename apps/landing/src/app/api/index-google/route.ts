import { NextRequest, NextResponse } from "next/server";

/**
 * Google Indexing API — push URLs for instant indexing
 *
 * SETUP (one-time):
 * 1. Go to Google Cloud Console → APIs & Services → Enable "Web Search Indexing API"
 * 2. Create a Service Account → download JSON key
 * 3. In Google Search Console → Settings → Users → Add the service account email as Owner
 * 4. Set these env vars in Vercel:
 *    - GOOGLE_SA_EMAIL = service account email (xxx@project.iam.gserviceaccount.com)
 *    - GOOGLE_SA_PRIVATE_KEY = private key from JSON (the full -----BEGIN PRIVATE KEY----- block)
 *    - INDEXING_API_SECRET = a random secret you create (for auth on this endpoint)
 *
 * USAGE:
 * POST /api/index-google
 * Headers: { "x-api-key": "your-INDEXING_API_SECRET" }
 * Body: { "urls": ["/vergelijking/dyme-alternatief", "/vergelijking/schuldhulpmaatje"], "action": "URL_UPDATED" }
 *
 * action can be "URL_UPDATED" (index/re-index) or "URL_DELETED" (remove from index)
 */

const BASE = "https://paywatch.app";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const INDEXING_API_URL = "https://indexing.googleapis.com/v3/urlNotifications:publish";

// All indexable URLs for bulk submission
const ALL_URLS = [
  "/", "/features", "/pricing", "/schuldhulp", "/app-voor-schulden-voorkomen",
  "/blog", "/about", "/support", "/resources", "/contact",
  "/vergelijking", "/vergelijking/schuldhulpmaatje",
  "/vergelijking/dyme-alternatief", "/vergelijking/fikks-alternatief",
  "/vergelijking/grassfeld-alternatief", "/vergelijking/cleo-alternatief",
  "/vergelijking/monefy-alternatief", "/vergelijking/ynab-alternatief",
  "/vergelijking/buddy-alternatief", "/vergelijking/mijngeldzaken-alternatief",
  "/features/email-scanner", "/features/camera-scanner", "/features/betaalfases",
  "/features/buddy", "/features/cashflow", "/features/maandbudget",
  "/schuldhulp/rotterdam", "/schuldhulp/amsterdam", "/schuldhulp/den-haag",
  "/schuldhulp/utrecht", "/schuldhulp/eindhoven", "/schuldhulp/groningen",
];

async function getAccessToken(): Promise<string> {
  const email = process.env.GOOGLE_SA_EMAIL;
  const privateKey = process.env.GOOGLE_SA_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!email || !privateKey) {
    throw new Error("Missing GOOGLE_SA_EMAIL or GOOGLE_SA_PRIVATE_KEY env vars");
  }

  // Create JWT
  const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const claim = btoa(
    JSON.stringify({
      iss: email,
      scope: "https://www.googleapis.com/auth/indexing",
      aud: GOOGLE_TOKEN_URL,
      iat: now,
      exp: now + 3600,
    })
  );

  // Sign with Web Crypto API
  const encoder = new TextEncoder();
  const pemBody = privateKey
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "");

  const binaryKey = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureData = encoder.encode(`${header}.${claim}`);
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, signatureData);
  const sig = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const jwt = `${header}.${claim}.${sig}`;

  // Exchange JWT for access token
  const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    throw new Error(`Token exchange failed: ${JSON.stringify(tokenData)}`);
  }

  return tokenData.access_token;
}

async function submitUrl(
  accessToken: string,
  url: string,
  action: "URL_UPDATED" | "URL_DELETED"
): Promise<{ url: string; status: number; response: string }> {
  const res = await fetch(INDEXING_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ url, type: action }),
  });

  return {
    url,
    status: res.status,
    response: await res.text(),
  };
}

export async function POST(req: NextRequest) {
  // Auth check
  const apiKey = req.headers.get("x-api-key");
  const secret = process.env.INDEXING_API_SECRET;

  if (!secret || apiKey !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const action = body.action || "URL_UPDATED";

    // "all" submits all important URLs, otherwise submit specific paths
    let paths: string[] = body.urls === "all" ? ALL_URLS : body.urls;

    if (!paths || !Array.length) {
      return NextResponse.json({ error: "No URLs provided. Use { urls: ['/', '/vergelijking/dyme-alternatief'] } or { urls: 'all' }" }, { status: 400 });
    }

    // Prepend base URL if paths don't start with https
    const fullUrls = paths.map((p: string) => (p.startsWith("https") ? p : `${BASE}${p}`));

    const accessToken = await getAccessToken();
    const results = [];

    // Google rate limit: 200 URLs per day, submit with slight delay
    for (const url of fullUrls) {
      const result = await submitUrl(accessToken, url, action);
      results.push(result);
      // Small delay to avoid rate limiting
      if (fullUrls.length > 10) {
        await new Promise((r) => setTimeout(r, 100));
      }
    }

    const succeeded = results.filter((r) => r.status === 200).length;
    const failed = results.filter((r) => r.status !== 200).length;

    return NextResponse.json({
      success: true,
      total: results.length,
      succeeded,
      failed,
      results,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// GET: health check + list of URLs that would be submitted
export async function GET(req: NextRequest) {
  const apiKey = req.nextUrl.searchParams.get("key");
  const secret = process.env.INDEXING_API_SECRET;

  if (!secret || apiKey !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hasCredentials = !!(process.env.GOOGLE_SA_EMAIL && process.env.GOOGLE_SA_PRIVATE_KEY);

  return NextResponse.json({
    status: "ready",
    hasCredentials,
    totalUrls: ALL_URLS.length,
    urls: ALL_URLS.map((p) => `${BASE}${p}`),
    usage: {
      submit_all: "POST /api/index-google with body { urls: 'all' }",
      submit_specific: "POST /api/index-google with body { urls: ['/vergelijking/dyme-alternatief'] }",
      remove: "POST /api/index-google with body { urls: ['/old-page'], action: 'URL_DELETED' }",
    },
  });
}
