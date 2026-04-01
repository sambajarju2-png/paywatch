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
    const {
      event_type = "pageview",
      session_id,
      visitor_id,
      path,
      referrer,
      browser,
      utm_source,
      utm_medium,
      utm_campaign,
      scroll_depth,
      event_name,
      duration_ms,
    } = body;

    if (!session_id || !path) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const ua = req.headers.get("user-agent") || "";

    // Skip bots
    if (/bot|crawl|spider|slurp|googlebot|bingbot|yandex/i.test(ua)) {
      return NextResponse.json({ ok: true });
    }

    const country =
      req.headers.get("x-vercel-ip-country") ||
      req.headers.get("cf-ipcountry") ||
      null;

    await supabase.from("site_analytics").insert({
      event_type,
      session_id,
      visitor_id: visitor_id || null,
      path,
      referrer: referrer || null,
      country,
      device_type: event_type === "pageview" ? getDeviceType(ua) : null,
      browser: browser || null,
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
      scroll_depth: scroll_depth ?? null,
      event_name: event_name || null,
      duration_ms: duration_ms ?? null,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
