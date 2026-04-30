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

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin.isAdmin) return admin.response;

  try {
    const supabase = getAdmin();
    const { data } = await supabase
      .from("job_applications")
      .select("*")
      .order("created_at", { ascending: false });

    return NextResponse.json({ applications: data || [] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin.isAdmin) return admin.response;

  try {
    const body = await request.json();
    const { id, status, linkedin_url, admin_notes } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const supabase = getAdmin();
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (status !== undefined) updates.status = status;
    if (linkedin_url !== undefined) updates.linkedin_url = linkedin_url;
    if (admin_notes !== undefined) updates.admin_notes = admin_notes;

    await supabase.from("job_applications").update(updates).eq("id", id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
