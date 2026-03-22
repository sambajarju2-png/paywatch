import { NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "pwf6qbjc",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-03-15",
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
});

export const revalidate = 60;

export async function GET(request: NextRequest) {
  const placement = request.nextUrl.searchParams.get("placement");

  try {
    if (placement) {
      /* Fetch single placement */
      const nav = await client.fetch(
        `*[_type == "navigation" && placement == $placement][0]{ placement, items[]{ label, href, isExternal } }`,
        { placement }
      );
      return NextResponse.json({ nav: nav || null });
    }

    /* Fetch all navigation documents */
    const navs = await client.fetch(
      `*[_type == "navigation"]{ placement, items[]{ label, href, isExternal } }`
    );

    /* Convert to map: { "header": [...items], "footer-product": [...items] } */
    const map: Record<string, Array<{ label: { nl: string; en: string }; href: string; isExternal: boolean }>> = {};
    for (const nav of navs || []) {
      if (nav.placement && nav.items) {
        map[nav.placement] = nav.items;
      }
    }

    return NextResponse.json({ navigation: map });
  } catch (e) {
    console.error("[Sanity] Navigation fetch error:", e);
    return NextResponse.json({ navigation: {}, nav: null });
  }
}
