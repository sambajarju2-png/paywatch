import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";

const SUPER_ADMINS = [
  "sambajarju2@gmail.com",
  "reiskenners@gmail.com",
  "ayeitssamba@gmail.com",
  "samba@paywatch.nl",
  "samba@paywatch.app",
  "mariama@paywatch.nl",
  "mariama@paywatch.com",
  "mariama@paywatch.app",
];

/**
 * POST /api/members/reset-password
 * Sends a password reset email to a B2B member.
 * Only admin/owner of the org (or super-admins) can trigger this.
 */
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
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const body = await request.json();
  const { member_id, organization_id } = body;

  if (!member_id || !organization_id) {
    return NextResponse.json(
      { error: "member_id en organization_id zijn verplicht" },
      { status: 400 }
    );
  }

  // Verify caller has admin rights
  const isSuperAdmin = SUPER_ADMINS.includes(user.email?.toLowerCase() || "");
  if (!isSuperAdmin) {
    const { data: myMembership } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", organization_id)
      .eq("user_id", user.id)
      .single();

    if (!myMembership || !["owner", "admin"].includes(myMembership.role)) {
      return NextResponse.json({ error: "Geen rechten" }, { status: 403 });
    }
  }

  // Get the target member's email and name
  const { data: member, error: memberError } = await supabase
    .from("organization_members")
    .select("invite_email, full_name, role")
    .eq("id", member_id)
    .eq("organization_id", organization_id)
    .single();

  if (memberError || !member) {
    return NextResponse.json({ error: "Teamlid niet gevonden" }, { status: 404 });
  }

  // Get org info for the email
  const { data: org } = await supabase
    .from("organizations")
    .select("name, primary_color, slug")
    .eq("id", organization_id)
    .single();

  const orgName = org?.name || "PayWatch Partner";
  const orgColor = org?.primary_color || "#2563EB";
  const orgSlug = org?.slug || "b2b";

  // Generate a password reset link via Supabase Admin
  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: "recovery",
    email: member.invite_email,
    options: {
      redirectTo: `https://${orgSlug}.paywatch.app/reset-password`,
    },
  });

  if (linkError || !linkData?.properties?.action_link) {
    console.error("[ResetPassword] generateLink error:", linkError);
    return NextResponse.json(
      { error: "Kon de reset-link niet aanmaken. Controleer of het e-mailadres actief is." },
      { status: 500 }
    );
  }

  const resetLink = linkData.properties.action_link;
  const displayName = member.full_name || member.invite_email.split("@")[0];

  // Send branded reset email
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    // Return the link directly so admin can share it manually
    return NextResponse.json({
      success: true,
      message: `Reset-link aangemaakt (e-mail niet geconfigureerd — deel de link handmatig)`,
      reset_link: resetLink,
    });
  }

  const resend = new Resend(resendKey);

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F4F7FB;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F7FB;padding:40px 20px">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E2E8F0">
        <tr><td style="background:${orgColor};padding:24px 32px">
          <span style="color:#FFFFFF;font-size:16px;font-weight:700">${orgName}</span>
          <span style="color:rgba(255,255,255,0.6);font-size:12px;font-weight:500;margin-left:8px">via PayWatch</span>
        </td></tr>
        <tr><td style="padding:32px">
          <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0F172A">Wachtwoord opnieuw instellen</h1>
          <p style="margin:0 0 24px;font-size:14px;color:#64748B;line-height:1.6">
            Hoi ${displayName}, je hebt een verzoek ontvangen om je wachtwoord opnieuw in te stellen voor je account bij ${orgName}.
          </p>
          <a href="${resetLink}"
            style="display:inline-block;background:${orgColor};color:#fff;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;margin-bottom:24px">
            Nieuw wachtwoord instellen
          </a>
          <p style="margin:0;font-size:12px;color:#94A3B8;line-height:1.6">
            Deze link is 24 uur geldig. Als je dit niet hebt aangevraagd, kun je deze e-mail negeren.
          </p>
        </td></tr>
        <tr><td style="background:#F8FAFC;padding:16px 32px;border-top:1px solid #F1F5F9">
          <p style="margin:0;font-size:11px;color:#CBD5E1">
            Verstuurd via PayWatch B2B Portal · paywatch.app
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const { error: emailError } = await resend.emails.send({
    from: "PayWatch <info@paywatch.app>",
    to: member.invite_email,
    subject: `Wachtwoord opnieuw instellen — ${orgName}`,
    html,
  });

  if (emailError) {
    console.error("[ResetPassword] Resend error:", emailError);
    return NextResponse.json({
      success: true,
      message: `Reset-link aangemaakt maar e-mail mislukt. Deel de link handmatig.`,
      reset_link: resetLink,
    });
  }

  return NextResponse.json({
    success: true,
    message: `Reset-e-mail verstuurd naar ${member.invite_email}`,
  });
}
