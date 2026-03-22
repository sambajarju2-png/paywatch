import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";

export async function GET() {
  const sb = getAdminClient();
  const { data, error } = await sb.from("job_applications").select("*").order("created_at", { ascending: false }).limit(100);
  return NextResponse.json({ applications: data ?? [], error: error?.message });
}

export async function PATCH(request: NextRequest) {
  const { id, status } = await request.json();
  if (!id || !status) return NextResponse.json({ error: "Missing id or status" }, { status: 400 });

  const sb = getAdminClient();
  const { error } = await sb.from("job_applications").update({ status }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
