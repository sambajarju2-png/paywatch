import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET() {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("b2b_contacts")
      .select("type", { count: "exact", head: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const counts: Record<string, number> = { all: 0 };
    for (const row of data || []) {
      counts[row.type] = (counts[row.type] || 0) + 1;
      counts.all++;
    }

    return NextResponse.json({ counts });
  } catch (err) {
    console.error("[Counts]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
