import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const SUPER_ADMINS = ["sambajarju2@gmail.com", "samba@paywatch.nl", "mariama@paywatch.com"];

export async function POST(request: NextRequest) {
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
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const body = await request.json();
  const { email, role, organization_id } = body;

  if (!email || !role || !organization_id) {
    return NextResponse.json({ error: "email, role en organization_id zijn verplicht" }, { status: 400 });
  }

  // Verify caller is admin/owner of this org or super admin
  const isSuperAdmin = SUPER_ADMINS.includes(user.email?.toLowerCase() || "");
  if (!isSuperAdmin) {
    const { data: membership } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", organization_id)
      .eq("user_id", user.id)
      .single();

    if (!membership || !["owner", "admin"].includes(membership.role)) {
      return NextResponse.json({ error: "Geen rechten" }, { status: 403 });
    }
  }

  // Check if user already exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existingUser = existingUsers?.users?.find(
    (u: any) => u.email?.toLowerCase() === email.toLowerCase()
  );

  let targetUserId: string;

  if (existingUser) {
    targetUserId = existingUser.id;
  } else {
    // Invite new user via Supabase (sends invite email automatically)
    const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: `https://b2b.paywatch.app/api/auth/callback`,
    });

    if (inviteError) {
      return NextResponse.json({ error: inviteError.message }, { status: 500 });
    }
    targetUserId = inviteData.user.id;
  }

  // Check if already a member
  const { data: existingMember } = await supabase
    .from("organization_members")
    .select("id")
    .eq("organization_id", organization_id)
    .eq("user_id", targetUserId)
    .maybeSingle();

  if (existingMember) {
    return NextResponse.json({ error: "Deze gebruiker is al lid van deze organisatie" }, { status: 409 });
  }

  // Add as org member
  const permissions: Record<string, boolean> = {
    manage_users: role === "admin" || role === "owner",
    manage_buddies: role !== "viewer",
    view_analytics: true,
    manage_settings: role === "admin" || role === "owner",
    api_access: role === "admin" || role === "owner",
  };

  const { error: memberError } = await supabase.from("organization_members").insert({
    organization_id,
    user_id: targetUserId,
    role,
    invite_email: email,
    invite_status: existingUser ? "accepted" : "pending",
    invited_by: user.id,
    permissions,
  });

  if (memberError) {
    return NextResponse.json({ error: memberError.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: existingUser
      ? `${email} is toegevoegd als ${role}`
      : `Uitnodiging verstuurd naar ${email}`,
    user_id: targetUserId,
  });
}
