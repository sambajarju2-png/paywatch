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
        "id, campaign_id, contact_id, sequence_step, to_email, to_name, from_email, from_name, subject, body_html, body_text, status, sent_at, delivered_at, opened_at, clicked_at, replied_at, bounced_at, bounce_type, scheduled_for, created_at, b2b_campaigns(name)"
      )
      .order("scheduled_for", { ascending: true });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error } = await query.limit(200);

    if (error) {
      console.error("[Outreach Queue]", error);
      return NextResponse.json(
        { error: "Failed to fetch queue" },
        { status: 500 }
      );
    }

    // Map campaign name from join
    const emails = (data || []).map((e: Record<string, unknown>) => {
      const campaigns = e.b2b_campaigns as { name: string } | null;
      return {
        ...e,
        campaign_name: campaigns?.name || "—",
        b2b_campaigns: undefined,
      };
    });

    return NextResponse.json({ emails });
  } catch (err) {
    console.error("[Outreach Queue]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
