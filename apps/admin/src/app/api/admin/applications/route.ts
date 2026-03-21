import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";

export async function GET() {
  const sb = getAdminClient();
  const { data, error } = await sb
    .from("job_applications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return NextResponse.json({ applications: data ?? [], error: error?.message });
}
