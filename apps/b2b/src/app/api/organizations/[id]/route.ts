import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const SUPER_ADMINS = ["sambajarju2@gmail.com", "samba@paywatch.nl", "mariama@paywatch.com"];

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Verify auth
  const cookieStore = await cookies();
  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );
  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (!user || !SUPER_ADMINS.includes(user.email?.toLowerCase() || "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Only allow updating specific fields
  const allowed = ["name", "primary_color", "secondary_color", "logo_url", "contact_name",
    "contact_email", "contact_phone", "city", "kvk_number", "website", "custom_intro_text",
    "tier", "status", "features", "settings"];

  const updates: Record<string, any> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) updates[key] = body[key];
  }
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("organizations")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}
