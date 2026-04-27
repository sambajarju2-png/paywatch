import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const SUPER_ADMINS = ["sambajarju2@gmail.com", "samba@paywatch.nl", "mariama@paywatch.com"];

async function verifySuperAdmin() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
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
  const logo_url = formData.get("logo_url") as string;

  if (!name || !slug || !type) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const featureDefaults: Record<string, object> = {
    gemeente: { bank_sync: true, ai_insights: true, payment_plans: true, community: false, camera_scan: true, buddy_system: true, spending_analytics: true, push_notifications: true, export_reports: true, escalation_alerts: true },
    incasso: { bank_sync: false, ai_insights: true, payment_plans: true, community: false, camera_scan: true, buddy_system: true, spending_analytics: false, push_notifications: true, export_reports: true, escalation_alerts: true },
    bewindvoerder: { bank_sync: true, ai_insights: true, payment_plans: true, community: false, camera_scan: true, buddy_system: true, spending_analytics: true, push_notifications: true, export_reports: true, escalation_alerts: true },
    hulporganisatie: { bank_sync: false, ai_insights: true, payment_plans: true, community: true, camera_scan: true, buddy_system: true, spending_analytics: false, push_notifications: true, export_reports: true, escalation_alerts: false },
    kredietbank: { bank_sync: true, ai_insights: true, payment_plans: true, community: false, camera_scan: true, buddy_system: true, spending_analytics: true, push_notifications: true, export_reports: true, escalation_alerts: true },
  };

  const { data: org, error } = await supabase
    .from("organizations")
    .insert({
      name,
      slug,
      type,
      primary_color: primary_color || "#2563EB",
      tier: tier || "pilot",
      contact_email: contact_email || null,
      logo_url: logo_url || null,
      features: featureDefaults[type] || featureDefaults.gemeente,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Slug already taken" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("organization_members").insert({
    organization_id: org.id,
    user_id: user.id,
    role: "owner",
    invite_status: "accepted",
    permissions: { manage_users: true, manage_buddies: true, view_analytics: true, manage_settings: true, api_access: true },
  });

  return NextResponse.redirect(new URL(`/organizations/${org.id}`, request.url));
}
