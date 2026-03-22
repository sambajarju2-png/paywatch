import { NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "pwf6qbjc",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  if (!key) return NextResponse.json({ url: null });

  try {
    const result = await client.fetch(
      `*[_type == "siteImage" && key == $key][0]{"url": image.asset->url, "alt": alt}`,
      { key }
    );
    return NextResponse.json({ url: result?.url || null, alt: result?.alt || "" });
  } catch {
    return NextResponse.json({ url: null });
  }
}
