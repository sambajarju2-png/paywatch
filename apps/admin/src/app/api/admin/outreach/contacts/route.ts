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
    const type = searchParams.get("type");
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const perPage = Math.min(200, Math.max(1, parseInt(searchParams.get("per_page") || "100", 10)));

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase
      .from("b2b_contacts")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (type && type !== "all") query = query.eq("type", type);
    if (status) query = query.eq("status", status);
    if (search) {
      query = query.or(
        `organization_name.ilike.%${search}%,contact_person.ilike.%${search}%,contact_email.ilike.%${search}%,city.ilike.%${search}%`
      );
    }

    const { data, error, count } = await query.range(from, to);
    if (error) {
      console.error("[Outreach Contacts]", error);
      return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
    }
    return NextResponse.json({
      contacts: data || [],
      total: count || 0,
      page,
      per_page: perPage,
      total_pages: Math.ceil((count || 0) / perPage),
    });
  } catch (err) {
    console.error("[Outreach Contacts]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const body = await req.json();

    const { data, error } = await supabase
      .from("b2b_contacts")
      .insert({
        organization_name: body.organization_name,
        type: body.type || "aid_org",
        website: body.website || null,
        contact_person: body.contact_person || null,
        contact_role: body.contact_role || null,
        contact_email: body.contact_email || null,
        general_email: body.general_email || null,
        phone: body.phone || null,
        city: body.city || null,
        kvk_number: body.kvk_number || null,
        linkedin_url: body.linkedin_url || null,
        beat: body.beat || null,
        notes: body.notes || null,
        source: body.source || "manual",
        tags: body.tags || [],
        status: "new",
      })
      .select()
      .single();

    if (error) {
      console.error("[Outreach Contacts POST]", error);
      return NextResponse.json({ error: "Failed to create contact" }, { status: 500 });
    }
    return NextResponse.json({ contact: data }, { status: 201 });
  } catch (err) {
    console.error("[Outreach Contacts POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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

    const allowedFields = [
      "organization_name", "type", "website", "contact_person", "contact_role",
      "contact_email", "general_email", "phone", "city", "kvk_number",
      "linkedin_url", "beat", "notes", "status", "tags",
      "first_name", "last_name",
    ];

    const updates: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in fields) updates[key] = fields[key];
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("b2b_contacts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[Outreach Contacts PATCH]", error);
      return NextResponse.json({ error: "Failed to update contact" }, { status: 500 });
    }
    return NextResponse.json({ contact: data });
  } catch (err) {
    console.error("[Outreach Contacts PATCH]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const { error } = await supabase.from("b2b_contacts").delete().eq("id", id);
    if (error) {
      console.error("[Outreach Contacts DELETE]", error);
      return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Outreach Contacts DELETE]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
