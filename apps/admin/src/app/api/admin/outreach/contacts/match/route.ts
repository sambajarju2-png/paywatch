import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

/**
 * POST /api/admin/outreach/contacts/match
 * Returns count of contacts matching type + tags criteria.
 * Body: { type?: string, tags?: string[] }
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const { type, tags } = await req.json();

    let query = supabase
      .from("b2b_contacts")
      .select("id", { count: "exact", head: true })
      .not("contact_email", "is", null);

    if (type) query = query.eq("type", type);
    if (tags && tags.length > 0) query = query.overlaps("tags", tags);

    const { count, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ count: count || 0 });
  } catch (err) {
    console.error("[Match Count]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
