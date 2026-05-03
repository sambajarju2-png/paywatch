/**
 * Server-side admin authentication verification.
 *
 * Reads the `sb-admin-token` cookie set by SessionSync.tsx,
 * then verifies it with Supabase auth.getUser(token).
 *
 * File: apps/admin/src/lib/admin-auth.ts
 */

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ALLOWED_EMAILS = [
  "sambajarju2@gmail.com",
  "reiskenners@gmail.com",
  "ayeitssamba@gmail.com",
  "samba@paywatch.nl",
  "samba@paywatch.app",
  "mariama@paywatch.nl",
  "mariama@paywatch.com",
  "mariama@paywatch.app",
  "admin@paywatch.nl",
];

type AdminOk = { isAdmin: true; userId: string; email: string };
type AdminFail = { isAdmin: false; response: NextResponse };

export async function verifyAdmin(): Promise<AdminOk | AdminFail> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sb-admin-token")?.value;

    if (!token) {
      return {
        isAdmin: false,
        response: NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        ),
      };
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user || !user.email) {
      return {
        isAdmin: false,
        response: NextResponse.json(
          { error: "Invalid or expired session" },
          { status: 401 }
        ),
      };
    }

    if (!ALLOWED_EMAILS.includes(user.email.toLowerCase())) {
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
