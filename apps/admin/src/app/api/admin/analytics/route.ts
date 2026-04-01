import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function GET(req: NextRequest) {
  const period = req.nextUrl.searchParams.get("period") || "7d";
  const days = period === "30d" ? 30 : 7;

  try {
    // 1. Live visitors (unique sessions in last 5 minutes)
    const { data: liveData } = await supabase.rpc("analytics_live_count");

    // 2. Overview metrics
    const { data: overviewData } = await supabase.rpc("analytics_overview", {
      p_days: days,
    });

    // 3. Page views per day chart
    const { data: chartData } = await supabase.rpc("analytics_daily_chart", {
      p_days: days,
    });

    // 4. Top pages
    const { data: topPages } = await supabase.rpc("analytics_top_pages", {
      p_days: days,
    });

    // 5. Top referrers
    const { data: topReferrers } = await supabase.rpc(
      "analytics_top_referrers",
      { p_days: days }
    );

    // 6. Device breakdown
    const { data: devices } = await supabase.rpc("analytics_devices", {
      p_days: days,
    });

    return NextResponse.json({
      live: liveData ?? 0,
      overview: overviewData?.[0] ?? {
        total_views: 0,
        unique_sessions: 0,
        today_views: 0,
        today_sessions: 0,
      },
      chart: chartData ?? [],
      topPages: topPages ?? [],
      topReferrers: topReferrers ?? [],
      devices: devices ?? [],
    });
  } catch (e) {
    console.error("[Analytics API]", e);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
