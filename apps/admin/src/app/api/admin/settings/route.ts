import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

function getAdmin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin.isAdmin) return admin.response;
  const supabase = getAdmin();
  const { data } = await supabase.from("paywatch_settings").select("key, value, description").order("key");
  const settings: Record<string, string> = {};
  for (const row of data || []) settings[row.key] = row.value;
  return NextResponse.json({ settings, rows: data || [] });
}

export async function PATCH(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin.isAdmin) return admin.response;
  const body = await req.json() as Record<string, string>;
  const supabase = getAdmin();
  const updates = Object.entries(body).map(([key, value]) => ({
    key, value, updated_at: new Date().toISOString(),
  }));
  const { error } = await supabase.from("paywatch_settings").upsert(updates, { onConflict: "key" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
