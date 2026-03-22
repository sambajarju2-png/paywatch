import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHmac } from "crypto";

/**
 * POST /api/unsubscribe
 *
 * Verifies the signed token, sets notify_email_digest = false,
 * and optionally saves feedback.
 *
 * Body: { uid: string, token: string, reason?: string, feedback?: string }
 *
 * GET /api/unsubscribe?uid=xxx&token=xxx
 *
 * Verifies token and returns { valid: boolean, name: string }
 * Used by the page to check the link before showing the form.
 */

function getAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key);
}

function getSecret(): string {
  // Use service role key as HMAC secret — no extra env var needed
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  return key;
}

function generateToken(uid: string): string {
  return createHmac("sha256", getSecret())
    .update(uid)
    .digest("base64url");
}

function verifyToken(uid: string, token: string): boolean {
  const expected = generateToken(uid);
  // Constant-time comparison
  if (expected.length !== token.length) return false;
  let result = 0;
  for (let i = 0; i < expected.length; i++) {
    result |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  }
  return result === 0;
}

// GET — verify the link and return user info
export async function GET(request: NextRequest) {
  try {
    const uid = request.nextUrl.searchParams.get("uid");
    const token = request.nextUrl.searchParams.get("token");

    if (!uid || !token) {
      return NextResponse.json({ valid: false, error: "Missing parameters" }, { status: 400 });
    }

    if (!verifyToken(uid, token)) {
      return NextResponse.json({ valid: false, error: "Invalid token" }, { status: 403 });
    }

    const supabase = getAdmin();
    const { data: user } = await supabase
      .from("user_settings")
      .select("first_name, display_name, notify_email_digest")
      .eq("user_id", uid)
      .single();

    const name = user?.display_name || user?.first_name || "";

    return NextResponse.json({
      valid: true,
      name,
      already_unsubscribed: user?.notify_email_digest === false,
    });
  } catch (err) {
    console.error("Unsubscribe verify error:", err);
    return NextResponse.json({ valid: false, error: "Server error" }, { status: 500 });
  }
}

// POST — actually unsubscribe + save feedback
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, token, reason, feedback } = body;

    if (!uid || !token) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    if (!verifyToken(uid, token)) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    const supabase = getAdmin();

    // Update user_settings
    const { error: updateErr } = await supabase
      .from("user_settings")
      .update({ notify_email_digest: false })
      .eq("user_id", uid);

    if (updateErr) {
      console.error("Unsubscribe update error:", updateErr);
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    // Save feedback if provided
    if (reason || feedback) {
      await supabase.from("user_feedback").insert({
        user_id: uid,
        type: "unsubscribe",
        rating: null,
        message: [reason, feedback].filter(Boolean).join(" — "),
        created_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Unsubscribe error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
