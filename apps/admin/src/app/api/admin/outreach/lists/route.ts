import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// GET — fetch all list names
export async function GET() {
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("b2b_lists")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("[Outreach Lists GET]", error);
      return NextResponse.json({ error: "Failed to fetch lists" }, { status: 500 });
    }

    return NextResponse.json({ lists: data || [] });
  } catch (err) {
    console.error("[Outreach Lists GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — create a new list
export async function POST(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const { name } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "name required" }, { status: 400 });
    }

    const cleanName = name.trim().toLowerCase().replace(/\s+/g, "-");

    const { data, error } = await supabase
      .from("b2b_lists")
      .insert({ name: cleanName })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        // Unique constraint — list already exists, that's fine
        return NextResponse.json({ list: { name: cleanName }, existing: true });
      }
      console.error("[Outreach Lists POST]", error);
      return NextResponse.json({ error: "Failed to create list" }, { status: 500 });
    }

    return NextResponse.json({ list: data }, { status: 201 });
  } catch (err) {
    console.error("[Outreach Lists POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE — remove a list (also removes the tag from all contacts)
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "name required" }, { status: 400 });
    }

    // Remove from b2b_lists
    await supabase.from("b2b_lists").delete().eq("name", name);

    // Remove tag from all contacts that have it
    const { data: contacts } = await supabase
      .from("b2b_contacts")
      .select("id, tags")
      .contains("tags", [name]);

    if (contacts && contacts.length > 0) {
      for (const c of contacts) {
        const newTags = (c.tags || []).filter((t: string) => t !== name);
        await supabase
          .from("b2b_contacts")
          .update({ tags: newTags, updated_at: new Date().toISOString() })
          .eq("id", c.id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Outreach Lists DELETE]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
