import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "pwf6qbjc",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-03-15",
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
});

export const revalidate = 60;

export async function GET() {
  try {
    const strings = await client.fetch(`*[_type == "appStrings"]{ key, value, context }`);
    if (!strings || strings.length === 0) {
      return NextResponse.json({ strings: {} });
    }

    /* Convert array to key-value map: { "hero.title": { nl: "...", en: "..." } } */
    const map: Record<string, { nl: string; en: string }> = {};
    for (const s of strings) {
      if (s.key && s.value) {
        map[s.key] = { nl: s.value.nl || "", en: s.value.en || "" };
      }
    }

    return NextResponse.json({ strings: map });
  } catch (e) {
    console.error("[Sanity] App strings fetch error:", e);
    return NextResponse.json({ strings: {} });
  }
}
