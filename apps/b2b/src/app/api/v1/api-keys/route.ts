import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies, headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { randomBytes, createHash } from "crypto";

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
  const body = await request.json();
  const { name, environment, scopes } = body;

  if (!name || !environment || !scopes?.length) {
    return NextResponse.json({ error: "Naam, omgeving en scopes zijn verplicht" }, { status: 400 });
  }

  // Generate key
  const rawKey = `pw_${environment === "live" ? "live" : "test"}_${randomBytes(24).toString("hex")}`;
  const keyHash = createHash("sha256").update(rawKey).digest("hex");
  const keyPrefix = rawKey.substring(0, 12);

  // Get member ID for created_by
  const { data: member } = await supabase
    .from("organization_members")
    .select("id")
    .eq("organization_id", orgId)
    .eq("user_id", user.id)
    .single();

  const { error } = await supabase.from("b2b_api_keys").insert({
    organization_id: orgId,
    name,
    key_hash: keyHash,
    key_prefix: keyPrefix,
    scopes,
    rate_limit: environment === "live" ? 60 : 30,
    environment,
    created_by: member?.id || null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, key: rawKey, prefix: keyPrefix });
}
