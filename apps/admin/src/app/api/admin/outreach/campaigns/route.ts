import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET() {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("b2b_campaigns")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Outreach Campaigns GET]", error);
      return NextResponse.json(
        { error: "Failed to fetch campaigns" },
        { status: 500 }
      );
    }

    return NextResponse.json({ campaigns: data || [] });
  } catch (err) {
    console.error("[Outreach Campaigns GET]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const body = await req.json();

    // Count matching contacts for total_contacts
    let countQuery = supabase
      .from("b2b_contacts")
      .select("id", { count: "exact", head: true })
      .not("status", "eq", "bounced")
      .not("contact_email", "is", null);

    if (body.target_type) {
      countQuery = countQuery.eq("type", body.target_type);
    }

    if (body.target_tags && body.target_tags.length > 0) {
      countQuery = countQuery.overlaps("tags", body.target_tags);
    }

    const { count } = await countQuery;

    const { data, error } = await supabase
      .from("b2b_campaigns")
      .insert({
        name: body.name,
        description: body.description || null,
        target_type: body.target_type || null,
        target_tags: body.target_tags || [],
        from_accounts: body.from_accounts || [],
        from_name: body.from_name || "Samba Jarju",
        from_email: body.from_email || "samba@paywatch.nl",
        reply_to: body.reply_to || body.from_email || "samba@paywatch.nl",
        campaign_brief: body.campaign_brief || null,
        tone: body.tone || "professional_warm",
        language: body.language || "nl",
        campaign_mode: body.campaign_mode || "ai",
        email_subject: body.email_subject || null,
        email_body: body.email_body || null,
        attachments: body.attachments || [],
        sequence_steps: body.sequence_steps || [],
        status: "draft",
        total_contacts: count || 0,
      })
      .select()
      .single();

    if (error) {
      console.error("[Outreach Campaigns POST]", error);
      return NextResponse.json(
        { error: "Failed to create campaign" },
        { status: 500 }
      );
    }

    return NextResponse.json({ campaign: data }, { status: 201 });
  } catch (err) {
    console.error("[Outreach Campaigns POST]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const body = await req.json();

    const { id, ...fields } = body;
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};

    // Status change
    if (fields.status) {
      updates.status = fields.status;
      if (fields.status === "active" && !fields.started_at) {
        updates.started_at = new Date().toISOString();
      }
      if (fields.status === "completed") {
        updates.completed_at = new Date().toISOString();
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("b2b_campaigns")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[Outreach Campaigns PATCH]", error);
      return NextResponse.json(
        { error: "Failed to update campaign" },
        { status: 500 }
      );
    }

    return NextResponse.json({ campaign: data });
  } catch (err) {
    console.error("[Outreach Campaigns PATCH]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
