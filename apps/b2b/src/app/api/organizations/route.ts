import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { seedFeatures } from "@paywatch/config";

const SUPER_ADMINS = ["sambajarju2@gmail.com", "reiskenners@gmail.com", "ayeitssamba@gmail.com", "samba@paywatch.nl", "samba@paywatch.app", "mariama@paywatch.nl", "mariama@paywatch.com", "mariama@paywatch.app"];

async function verifySuperAdmin() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !SUPER_ADMINS.includes(user.email?.toLowerCase() || "")) return null;
  return user;
}

export async function POST(request: NextRequest) {
  const user = await verifySuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const formData = await request.formData();
  const name = formData.get("name") as string;
  const slug = (formData.get("slug") as string).toLowerCase().replace(/[^a-z0-9-]/g, "");
  const type = formData.get("type") as string;
  const primary_color = formData.get("primary_color") as string;
  const tier = formData.get("tier") as string;
  const contact_email = formData.get("contact_email") as string;
  const contact_name = formData.get("contact_name") as string;
  const logo_url = formData.get("logo_url") as string;
  const city = formData.get("city") as string;
  const kvk_number = formData.get("kvk_number") as string;
  const website = formData.get("website") as string;
  const custom_intro_text = formData.get("custom_intro_text") as string;

  if (!name || !slug || !type) {
    return NextResponse.json({ error: "Naam, slug en type zijn verplicht" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const tierValue = tier || "pilot";

  const { data: org, error } = await supabase
    .from("organizations")
    .insert({
      name,
      slug,
      type,
      primary_color: primary_color || "#2563EB",
      tier: tierValue,
      contact_email: contact_email || null,
      contact_name: contact_name || null,
      logo_url: logo_url || null,
      city: city || null,
      kvk_number: kvk_number || null,
      website: website || null,
      custom_intro_text: custom_intro_text || null,
      features: seedFeatures(tierValue, type),
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "Deze slug is al in gebruik" }, { status: 409 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("organization_members").insert({
    organization_id: org.id,
    user_id: user.id,
    role: "owner",
    invite_email: user.email,
    invite_status: "accepted",
    permissions: { manage_users: true, manage_buddies: true, view_analytics: true, manage_settings: true, api_access: true },
  });

  return NextResponse.json({ success: true, id: org.id, slug: formData.get("slug") });
}
