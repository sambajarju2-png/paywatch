import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// GET — List all campaigns
export async function GET() {
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("b2b_campaigns")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Campaigns GET]", error);
      return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }

    return NextResponse.json({ campaigns: data || [] });
  } catch (err) {
    console.error("[Campaigns GET]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST — Create a new campaign
export async function POST(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const body = await req.json();

    // Count matching contacts for this campaign
    let contactQuery = supabase
      .from("b2b_contacts")
      .select("*", { count: "exact", head: true })
      .not("status", "eq", "bounced");

    if (body.target_type) {
      contactQuery = contactQuery.eq("type", body.target_type);
    }

    const { count: totalContacts } = await contactQuery;

    const { data, error } = await supabase
      .from("b2b_campaigns")
      .insert({
        name: body.name,
        description: body.description || null,
        target_type: body.target_type || null,
        target_tags: body.target_tags || [],
        from_name: body.from_name || "Samba Jarju",
        from_email: body.from_email || "samba@paywatch.nl",
        reply_to: body.reply_to || body.from_email || "samba@paywatch.nl",
        campaign_brief: body.campaign_brief,
        tone: body.tone || "professional_warm",
        language: body.language || "nl",
        sequence_steps: body.sequence_steps || [],
        status: "draft",
        total_contacts: totalContacts || 0,
      })
      .select()
      .single();

    if (error) {
      console.error("[Campaigns POST]", error);
      return NextResponse.json({ error: "Failed to create" }, { status: 500 });
    }

    return NextResponse.json({ campaign: data }, { status: 201 });
  } catch (err) {
    console.error("[Campaigns POST]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PATCH — Update campaign status
export async function PATCH(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const update: Record<string, unknown> = {};
    if (body.status) {
      update.status = body.status;
      if (body.status === "active" && !body.started_at) {
        update.started_at = new Date().toISOString();
      }
      if (body.status === "completed") {
        update.completed_at = new Date().toISOString();
      }
    }

    const { error } = await supabase
      .from("b2b_campaigns")
      .update(update)
      .eq("id", body.id);

    if (error) {
      console.error("[Campaigns PATCH]", error);
      return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Campaigns PATCH]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
