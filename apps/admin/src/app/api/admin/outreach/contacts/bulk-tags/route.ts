import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const { contactIds, tag, action } = await req.json();

    if (!contactIds?.length || !tag || !["add", "remove"].includes(action)) {
      return NextResponse.json(
        { error: "contactIds[], tag, and action (add|remove) required" },
        { status: 400 }
      );
    }

    const cleanTag = tag.trim().toLowerCase().replace(/\s+/g, "-");
    if (!cleanTag) {
      return NextResponse.json({ error: "Invalid tag name" }, { status: 400 });
    }

    // Fetch all targeted contacts
    const { data: contacts, error: fetchError } = await supabase
      .from("b2b_contacts")
      .select("id, tags")
      .in("id", contactIds);

    if (fetchError) {
      console.error("[Bulk Tags] Fetch error:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch contacts" },
        { status: 500 }
      );
    }

    if (!contacts || contacts.length === 0) {
      return NextResponse.json(
        { error: "No matching contacts found" },
        { status: 404 }
      );
    }

    let updated = 0;

    for (const contact of contacts) {
      const currentTags: string[] = contact.tags || [];
      let newTags: string[];

      if (action === "add") {
        if (currentTags.includes(cleanTag)) continue; // Already has tag
        newTags = [...currentTags, cleanTag];
      } else {
        if (!currentTags.includes(cleanTag)) continue; // Doesn't have tag
        newTags = currentTags.filter((t: string) => t !== cleanTag);
      }

      const { error: updateError } = await supabase
        .from("b2b_contacts")
        .update({ tags: newTags, updated_at: new Date().toISOString() })
        .eq("id", contact.id);

      if (updateError) {
        console.error(
          `[Bulk Tags] Update error for ${contact.id}:`,
          updateError
        );
      } else {
        updated++;
      }
    }

    return NextResponse.json({
      success: true,
      updated,
      total: contacts.length,
      tag: cleanTag,
      action,
    });
  } catch (err) {
    console.error("[Bulk Tags]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
