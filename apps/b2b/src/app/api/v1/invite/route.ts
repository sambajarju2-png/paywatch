import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { randomBytes } from "crypto";
import QRCode from "qrcode";
import { sendInviteEmail } from "@/lib/resend";

export async function POST(request: NextRequest) {
  const h = await headers();
  const orgId = h.get("x-tenant-id");
  if (!orgId) return NextResponse.json({ error: "No org context" }, { status: 400 });

  const orgName = h.get("x-tenant-name") ? decodeURIComponent(h.get("x-tenant-name")!) : "Partner";
  const orgColor = h.get("x-tenant-color") || "#2563EB";

  // Verify user is authenticated
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

  // Accept both JSON and FormData
  let email: string | null = null;
  let external_id: string | null = null;

  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await request.json();
    email = body.email || null;
    external_id = body.external_id || null;
  } else {
    const formData = await request.formData();
    email = formData.get("email") as string || null;
    external_id = formData.get("external_id") as string || null;
  }

  const token = randomBytes(24).toString("hex");
  const expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const invite_url = `https://app.paywatch.app/invite/${token}`;

  // Generate QR code as data URL
  let qr_code_url: string | null = null;
  try {
    qr_code_url = await QRCode.toDataURL(invite_url, {
      width: 300,
      margin: 2,
      color: { dark: "#0A2540", light: "#FFFFFF" },
    });
  } catch (e) {
    console.error("[QR] Generation failed:", e);
  }

  const { data: invite, error } = await supabase.from("b2b_invites").insert({
    organization_id: orgId,
    email,
    external_id,
    token,
    invite_type: "single",
    expires_at,
    qr_code_url,
  }).select("id, token").single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send invite email if email provided and Resend is configured
  let emailSent = false;
  if (email && process.env.RESEND_API_KEY) {
    const result = await sendInviteEmail({
      to: email,
      orgName,
      orgColor,
      inviteUrl: invite_url,
    });
    emailSent = result.success;
  }

  // Log in audit
  await supabase.from("b2b_audit_log").insert({
    organization_id: orgId,
    actor_id: user.id,
    actor_type: "staff",
    action: "invite.created",
    target_type: "invite",
    target_id: invite.id,
    metadata: { email, external_id, email_sent: emailSent },
  }).then(() => {});

  return NextResponse.json({
    success: true,
    invite_id: invite.id,
    invite_url,
    qr_code_url,
    email_sent: emailSent,
  });
}
