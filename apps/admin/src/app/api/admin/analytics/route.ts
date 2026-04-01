import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function GET(req: NextRequest) {
  const period = req.nextUrl.searchParams.get("period") || "7d";
  const days = period === "30d" ? 30 : period === "24h" ? 1 : 7;

  try {
    const [
      { data: live },
      { data: livePages },
      { data: overviewRows },
      { data: chart },
      { data: topPages },
      { data: entryPages },
      { data: exitPages },
      { data: referrers },
      { data: devices },
      { data: browsers },
      { data: utm },
      { data: countries },
      { data: pageFlow },
      { data: events },
      { data: scrollDepth },
    ] = await Promise.all([
      supabase.rpc("analytics_live_count"),
      supabase.rpc("analytics_live_pages"),
      supabase.rpc("analytics_overview", { p_days: days }),
      supabase.rpc("analytics_daily_chart", { p_days: days }),
      supabase.rpc("analytics_top_pages", { p_days: days }),
      supabase.rpc("analytics_entry_pages", { p_days: days }),
      supabase.rpc("analytics_exit_pages", { p_days: days }),
      supabase.rpc("analytics_top_referrers", { p_days: days }),
      supabase.rpc("analytics_devices", { p_days: days }),
      supabase.rpc("analytics_browsers", { p_days: days }),
      supabase.rpc("analytics_utm", { p_days: days }),
      supabase.rpc("analytics_countries", { p_days: days }),
      supabase.rpc("analytics_page_flow", { p_days: days }),
      supabase.rpc("analytics_events", { p_days: days }),
      supabase.rpc("analytics_scroll_depth", { p_days: days }),
    ]);

    const overview = overviewRows?.[0] ?? {
      total_views: 0, unique_sessions: 0, unique_visitors: 0,
      today_views: 0, today_sessions: 0, bounce_rate: 0,
      avg_pages_per_session: 0, avg_session_duration_sec: 0,
      new_visitors: 0, returning_visitors: 0,
    };

    return NextResponse.json({
      live: live ?? 0,
      livePages: livePages ?? [],
      overview,
      chart: chart ?? [],
      topPages: topPages ?? [],
      entryPages: entryPages ?? [],
      exitPages: exitPages ?? [],
      referrers: referrers ?? [],
      devices: devices ?? [],
      browsers: browsers ?? [],
      utm: utm ?? [],
      countries: countries ?? [],
      pageFlow: pageFlow ?? [],
      events: events ?? [],
      scrollDepth: scrollDepth ?? [],
    });
  } catch (e) {
    console.error("[Analytics API]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
