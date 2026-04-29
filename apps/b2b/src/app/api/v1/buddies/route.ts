import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies, headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const h = await headers();
  const orgId = h.get("x-tenant-id");
  if (!orgId) return NextResponse.json({ error: "No org context" }, { status: 400 });

  const cookieStore = await cookies();
  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );
  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { user_id, buddy_member_id, role } = await request.json();

  if (!user_id || !buddy_member_id || !role) {
    return NextResponse.json({ error: "user_id, buddy_member_id en role zijn verplicht" }, { status: 400 });
  }

  const { error } = await supabase.from("b2b_buddies").insert({
    user_id,
    buddy_member_id,
    organization_id: orgId,
    role,
    permissions: { view_bills: true, view_plans: true },
    status: "active",
    assigned_at: new Date().toISOString(),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Audit log
  await supabase.from("b2b_audit_log").insert({
    organization_id: orgId,
    actor_id: user.id,
    actor_type: "staff",
    action: "buddy.assigned",
    target_type: "buddy",
    target_id: user_id,
    metadata: { coach_member_id: buddy_member_id, role },
  });

  return NextResponse.json({ success: true });
}
