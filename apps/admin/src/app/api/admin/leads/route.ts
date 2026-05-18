import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/** GET /api/admin/leads — list all demo requests */
export async function GET() {
  const admin = await verifyAdmin();
  if (!admin.isAdmin) return admin.response;

  try {
    const supabase = getAdmin();
    const { data, error } = await supabase
      .from("demo_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Leads fetch error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ leads: data || [] });
  } catch (err) {
    console.error("Leads error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

/** PATCH /api/admin/leads — update lead status/notes */
export async function PATCH(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin.isAdmin) return admin.response;

  try {
    const body = await req.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }

    const validStatuses = ["new", "contacted", "demo_scheduled", "onboarded", "declined"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const supabase = getAdmin();
    const update: Record<string, any> = {
      status,
      handled_by: admin.email,
      handled_at: new Date().toISOString(),
    };
    if (notes !== undefined) update.notes = notes;

    const { error } = await supabase
      .from("demo_requests")
      .update(update)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Lead update error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
