import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(req.url);
    const model = searchParams.get("model");
    const days = parseInt(searchParams.get("days") || "30", 10);

    const since = new Date();
    since.setDate(since.getDate() - days);

    let query = supabase
      .from("ai_mention_checks")
      .select("*")
      .gte("checked_at", since.toISOString())
      .order("checked_at", { ascending: false });

    if (model && model !== "all") query = query.eq("model", model);

    const { data, error } = await query.limit(200);
    if (error) {
      console.error("[AI Mentions GET]", error);
      return NextResponse.json({ error: "Failed" }, { status: 500 });
    }

    // Calculate stats
    const checks = data || [];
    const total = checks.length;
    const mentioned = checks.filter((c) => c.mentioned).length;
    const urlCited = checks.filter((c) => c.url_cited).length;
    const mentionRate = total > 0 ? Math.round((mentioned / total) * 100) : 0;

    // Per-model stats
    const byModel: Record<string, { total: number; mentioned: number; rate: number }> = {};
    for (const c of checks) {
      if (!byModel[c.model]) byModel[c.model] = { total: 0, mentioned: 0, rate: 0 };
      byModel[c.model].total++;
      if (c.mentioned) byModel[c.model].mentioned++;
    }
    for (const m of Object.values(byModel)) {
      m.rate = m.total > 0 ? Math.round((m.mentioned / m.total) * 100) : 0;
    }

    return NextResponse.json({
      checks,
      stats: { total, mentioned, urlCited, mentionRate },
      byModel,
    });
  } catch (err) {
    console.error("[AI Mentions GET]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
