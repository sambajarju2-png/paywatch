/**
 * Server-side admin authentication verification.
 *
 * Reads Supabase auth cookies directly and verifies the user
 * with the service role client. Does NOT depend on @supabase/ssr
 * for cookie handling — avoids version compatibility issues.
 *
 * File: apps/admin/src/lib/admin-auth.ts
 */

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Must match AuthGate.tsx ALLOWED_EMAILS exactly
const ALLOWED_EMAILS = [
  "sambajarju2@gmail.com",
  "samba@paywatch.nl",
  "mariama@paywatch.com",
];

type AdminOk = { isAdmin: true; userId: string; email: string };
type AdminFail = { isAdmin: false; response: NextResponse };

/**
 * Extract the Supabase access token from cookies.
 *
 * Supabase stores auth in cookies named:
 *   sb-<project-ref>-auth-token       (single cookie)
 *   sb-<project-ref>-auth-token.0     (chunked, part 0)
 *   sb-<project-ref>-auth-token.1     (chunked, part 1)
 *   etc.
 *
 * The value is a JSON array: [access_token, refresh_token, ...]
 * or a base64-encoded JSON object with access_token field.
 */
function extractAccessToken(
  allCookies: { name: string; value: string }[]
): string | null {
  // Find all Supabase auth cookies
  const authCookies = allCookies
    .filter((c) => c.name.startsWith("sb-") && c.name.includes("-auth-token"))
    .sort((a, b) => a.name.localeCompare(b.name));

  if (authCookies.length === 0) return null;

  // Reassemble the value (may be chunked across multiple cookies)
  let raw = "";
  const base = authCookies[0].name.replace(/\.\d+$/, "");
  const chunks = authCookies.filter(
    (c) => c.name === base || c.name.startsWith(base + ".")
  );

  if (chunks.length === 1 && chunks[0].name === base) {
    // Single cookie
    raw = chunks[0].value;
  } else {
    // Chunked cookies — reassemble in order
    const sorted = chunks
      .filter((c) => c.name !== base || chunks.length === 1)
      .sort((a, b) => {
        const aNum = parseInt(a.name.split(".").pop() || "0");
        const bNum = parseInt(b.name.split(".").pop() || "0");
        return aNum - bNum;
      });
    raw = sorted.map((c) => c.value).join("");
  }

  if (!raw) return null;

  try {
    // Try parsing as base64 first
    let decoded = raw;
    try {
      decoded = Buffer.from(raw, "base64").toString("utf-8");
    } catch {
      // Not base64, use raw value
    }

    const parsed = JSON.parse(decoded);

    // Format 1: JSON array [access_token, refresh_token, ...]
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed[0];
    }

    // Format 2: JSON object { access_token, refresh_token, ... }
    if (parsed.access_token) {
      return parsed.access_token;
    }

    return null;
  } catch {
    return null;
  }
}

export async function verifyAdmin(): Promise<AdminOk | AdminFail> {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    const accessToken = extractAccessToken(allCookies);

    if (!accessToken) {
      console.warn("[ADMIN AUTH] No Supabase auth token in cookies. Cookie names:", allCookies.map((c) => c.name).join(", "));
      return {
        isAdmin: false,
        response: NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        ),
      };
    }

    // Use service role client to verify the JWT and get the user
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(accessToken);

    if (error || !user || !user.email) {
      console.warn("[ADMIN AUTH] Invalid token:", error?.message || "no user");
      return {
        isAdmin: false,
        response: NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        ),
      };
    }

    if (!ALLOWED_EMAILS.includes(user.email.toLowerCase())) {
      console.warn(`[ADMIN AUTH] Unauthorized: ${user.email}`);
      return {
        isAdmin: false,
        response: NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        ),
      };
    }

    return { isAdmin: true, userId: user.id, email: user.email };
  } catch (err) {
    console.error("[ADMIN AUTH] Error:", err);
    return {
      isAdmin: false,
      response: NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      ),
    };
  }
}
