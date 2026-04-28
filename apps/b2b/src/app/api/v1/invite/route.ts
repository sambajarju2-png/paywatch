import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { randomBytes } from "crypto";

export async function POST(request: NextRequest) {
  const h = await headers();
  const orgId = h.get("x-tenant-id");
  if (!orgId) return NextResponse.json({ error: "No org context" }, { status: 400 });

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

  const { data: invite, error } = await supabase.from("b2b_invites").insert({
    organization_id: orgId,
    email,
    external_id,
    token,
    invite_type: "single",
    expires_at,
  }).select("id, token").single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // TODO: Send invite email via Resend when email is provided
  // if (email) { await sendInviteEmail(email, invite_url, orgName); }

  return NextResponse.json({
    success: true,
    invite_id: invite.id,
    invite_url,
    token: invite.token,
  });
}
