import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// GET — List all warmup recipients
export async function GET() {
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("b2b_warmup_recipients")
      .select("*")
      .order("provider")
      .order("email");

    if (error) {
      console.error("[Warmup GET]", error);
      return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }

    return NextResponse.json({ recipients: data || [] });
  } catch (err) {
    console.error("[Warmup GET]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST — Add a warmup recipient
export async function POST(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const body = await req.json();

    if (!body.email) {
      return NextResponse.json(
        { error: "email required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("b2b_warmup_recipients")
      .insert({
        email: body.email.toLowerCase().trim(),
        display_name: body.display_name || null,
        provider: body.provider || "gmail",
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 409 }
        );
      }
      console.error("[Warmup POST]", error);
      return NextResponse.json({ error: "Failed to add" }, { status: 500 });
    }

    return NextResponse.json({ recipient: data }, { status: 201 });
  } catch (err) {
    console.error("[Warmup POST]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PATCH — Toggle active status
export async function PATCH(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("b2b_warmup_recipients")
      .update({ is_active: body.is_active })
      .eq("id", body.id);

    if (error) {
      console.error("[Warmup PATCH]", error);
      return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Warmup PATCH]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// DELETE — Remove a warmup recipient
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("b2b_warmup_recipients")
      .delete()
      .eq("id", body.id);

    if (error) {
      console.error("[Warmup DELETE]", error);
      return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Warmup DELETE]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
