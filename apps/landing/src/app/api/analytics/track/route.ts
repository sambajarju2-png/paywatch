import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

function getDeviceType(ua: string): string {
  if (/mobile|android|iphone|ipod/i.test(ua)) return "mobile";
  if (/ipad|tablet/i.test(ua)) return "tablet";
  return "desktop";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { session_id, path, referrer } = body;

    if (!session_id || !path) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const ua = req.headers.get("user-agent") || "";
    const country =
      req.headers.get("x-vercel-ip-country") ||
      req.headers.get("cf-ipcountry") ||
      null;

    // Skip bots
    if (/bot|crawl|spider|slurp|googlebot/i.test(ua)) {
      return NextResponse.json({ ok: true });
    }

    await supabase.from("site_analytics").insert({
      session_id,
      path,
      referrer: referrer || null,
      country,
      device_type: getDeviceType(ua),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
