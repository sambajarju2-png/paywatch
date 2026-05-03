import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { randomBytes } from "crypto";
import { sendMemberInviteEmail } from "@/lib/resend";

const SUPER_ADMINS = ["sambajarju2@gmail.com", "samba@paywatch.nl", "mariama@paywatch.com"];

function generateTempPassword(): string {
  // Readable 12-char password: 3 words + 2 digits
  const words = ["Tulp", "Molen", "Fiets", "Kaas", "Brug", "Klok", "Dijk", "Boot", "Ster", "Wolk", "Roos", "Berg"];
  const w1 = words[Math.floor(Math.random() * words.length)];
  const w2 = words[Math.floor(Math.random() * words.length)];
  const digits = String(Math.floor(Math.random() * 90) + 10);
  return `${w1}${w2}${digits}!`;
}

export async function POST(request: NextRequest) {
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

  // Verify caller is admin/owner or super admin
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

  // Get org info for branded email
  const { data: org } = await supabase
    .from("organizations")
    .select("name, primary_color, slug, logo_url")
    .eq("id", organization_id)
    .single();

  const orgName = org?.name || "PayWatch Partner";
  const orgColor = org?.primary_color || "#2563EB";
  const orgSlug = org?.slug || "b2b";
  const loginUrl = `https://${orgSlug}.paywatch.app/login`;

  // Check if user already exists in auth
  const { data: existingLookup } = await supabase
    .from("organization_members")
    .select("id")
    .eq("organization_id", organization_id)
    .eq("invite_email", email)
    .maybeSingle();

  if (existingLookup) {
    return NextResponse.json({ error: "Deze gebruiker is al lid van deze organisatie" }, { status: 409 });
  }

  // Check if auth user already exists
  const { data: { users: allUsers } } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  const existingUser = allUsers?.find(
    (u: any) => u.email?.toLowerCase() === email.toLowerCase()
  );

  let targetUserId: string;
  let tempPassword: string | null = null;

  if (existingUser) {
    targetUserId = existingUser.id;
  } else {
    // Create user with a temporary password (NOT inviteUserByEmail which sends English email)
    tempPassword = generateTempPassword();
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true, // Skip email verification — admin is vouching for this email
    });

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }
    targetUserId = newUser.user.id;
  }

  // Add as org member
  const roleLabels: Record<string, string> = {
    admin: "Beheerder",
    viewer: "Alleen bekijken",
    coach: "Coach",
    owner: "Eigenaar",
  };

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

  // Send Dutch branded email
  let emailSent = false;
  if (process.env.RESEND_API_KEY) {
    const result = await sendMemberInviteEmail({
      to: email,
      orgName,
      orgColor,
      loginUrl,
      roleName: roleLabels[role] || role,
      tempPassword: tempPassword || null,
      isExistingUser: !!existingUser,
      inviterEmail: user.email || "",
    });
    emailSent = result.success;
  }

  return NextResponse.json({
    success: true,
    message: existingUser
      ? `${email} is toegevoegd als ${roleLabels[role] || role}`
      : `Uitnodiging verstuurd naar ${email}`,
    email_sent: emailSent,
    user_id: targetUserId,
  });
}

export async function PATCH(request: NextRequest) {
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
  const { member_id, role, permissions, organization_id } = body;

  if (!member_id || !organization_id) {
    return NextResponse.json({ error: "member_id en organization_id zijn verplicht" }, { status: 400 });
  }

  // Only owner/admin/super-admin can change roles
  const isSuperAdmin = SUPER_ADMINS.includes(user.email?.toLowerCase() || "");
  if (!isSuperAdmin) {
    const { data: myMembership } = await supabase
      .from("organization_members").select("role").eq("organization_id", organization_id).eq("user_id", user.id).single();
    if (!myMembership || !["owner", "admin"].includes(myMembership.role)) {
      return NextResponse.json({ error: "Geen rechten" }, { status: 403 });
    }
  }

  const updates: Record<string, unknown> = {};
  const validRoles = ["owner", "admin", "coach", "viewer"];
  if (role && validRoles.includes(role)) updates.role = role;
  if (permissions && typeof permissions === "object") updates.permissions = permissions;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Niets om bij te werken" }, { status: 400 });
  }

  const { error } = await supabase.from("organization_members").update(updates).eq("id", member_id).eq("organization_id", organization_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const cookieStore = await cookies();
  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );
  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { member_id, organization_id } = await request.json();

  if (!member_id || !organization_id) {
    return NextResponse.json({ error: "member_id en organization_id zijn verplicht" }, { status: 400 });
  }

  const isSuperAdmin = SUPER_ADMINS.includes(user.email?.toLowerCase() || "");
  if (!isSuperAdmin) {
    const { data: myMembership } = await supabase
      .from("organization_members").select("role").eq("organization_id", organization_id).eq("user_id", user.id).single();
    if (!myMembership || !["owner", "admin"].includes(myMembership.role)) {
      return NextResponse.json({ error: "Geen rechten" }, { status: 403 });
    }
  }

  // Can't remove yourself
  const { data: target } = await supabase.from("organization_members").select("user_id").eq("id", member_id).single();
  if (target?.user_id === user.id) {
    return NextResponse.json({ error: "Je kunt jezelf niet verwijderen" }, { status: 400 });
  }

  const { error } = await supabase.from("organization_members").delete().eq("id", member_id).eq("organization_id", organization_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
