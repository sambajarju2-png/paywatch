import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let query = supabase
      .from("b2b_email_log")
      .select(
        "id, to_name, to_email, from_email, from_name, subject, sequence_step, status, sent_at, delivered_at, opened_at, replied_at, bounced_at, scheduled_for, campaign_id"
      )
      .order("scheduled_for", { ascending: false })
      .limit(100);

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data: emails, error } = await query;

    if (error) {
      console.error("[Queue GET]", error);
      return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }

    // Enrich with campaign names
    const campaignIds = [
      ...new Set((emails || []).map((e) => e.campaign_id).filter(Boolean)),
    ];

    let campaignMap = new Map<string, string>();
    if (campaignIds.length > 0) {
      const { data: campaigns } = await supabase
        .from("b2b_campaigns")
        .select("id, name")
        .in("id", campaignIds);
      campaignMap = new Map(
        campaigns?.map((c) => [c.id, c.name]) || []
      );
    }

    const enriched = (emails || []).map((e) => ({
      ...e,
      campaign_name: campaignMap.get(e.campaign_id) || "—",
    }));

    return NextResponse.json({ emails: enriched });
  } catch (err) {
    console.error("[Queue GET]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
