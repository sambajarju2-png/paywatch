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

    const types = ["incasso", "aid_org", "gemeente", "bewindvoerder", "kredietbank", "journalist", "billing_vendor"];

    // Fetch total count
    const { count: allCount } = await supabase
      .from("b2b_contacts")
      .select("id", { count: "exact", head: true });

    const counts: Record<string, number> = { all: allCount || 0 };

    // Fetch count per type in parallel
    const results = await Promise.all(
      types.map(async (type) => {
        const { count } = await supabase
          .from("b2b_contacts")
          .select("id", { count: "exact", head: true })
          .eq("type", type);
        return { type, count: count || 0 };
      })
    );

    for (const r of results) {
      if (r.count > 0) counts[r.type] = r.count;
    }

    return NextResponse.json({ counts });
  } catch (err) {
    console.error("[Counts]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
