import { NextRequest, NextResponse } from "next/server";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY!;

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query");
  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape&content_filter=high`,
      {
        headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
        next: { revalidate: 86400 }, // Cache 24h
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Unsplash API error" }, { status: 502 });
    }

    const data = await res.json();
    const photos = (data.results || []).map((photo: Record<string, unknown>) => {
      // Trigger download tracking per Unsplash guidelines
      fetch((photo.links as Record<string, string>).download_location, {
        headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
      }).catch(() => {});

      const urls = photo.urls as Record<string, string>;
      const user = photo.user as Record<string, unknown>;
      const userLinks = user.links as Record<string, string>;

      return {
        url: urls.regular,
        small: urls.small,
        thumb: urls.thumb,
        photographer: user.name,
        photographerUrl: userLinks.html,
        unsplashUrl: (photo.links as Record<string, string>).html,
        blurHash: photo.blur_hash || null,
        alt: (photo.alt_description as string) || query,
        width: photo.width,
        height: photo.height,
      };
    });

    return NextResponse.json(
      { photos },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      }
    );
  } catch (err) {
    console.error("[Unsplash City]", err);
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}
