import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";

export async function GET() {
  const sb = getAdminClient();
  const { data, error } = await sb
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return NextResponse.json({ submissions: data ?? [], error: error?.message });
}
