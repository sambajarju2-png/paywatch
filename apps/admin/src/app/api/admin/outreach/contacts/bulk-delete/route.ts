import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const { contactIds } = await req.json();

    if (!contactIds?.length) {
      return NextResponse.json(
        { error: "contactIds[] required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("b2b_contacts")
      .delete()
      .in("id", contactIds);

    if (error) {
      console.error("[Bulk Delete]", error);
      return NextResponse.json({ error: "Failed to delete contacts" }, { status: 500 });
    }

    return NextResponse.json({ success: true, deleted: contactIds.length });
  } catch (err) {
    console.error("[Bulk Delete]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
