/**
 * Server-side admin authentication verification.
 *
 * CRITICAL SECURITY FIX (CWE-306, CWE-862):
 * All admin API routes previously had ZERO authentication.
 * AuthGate.tsx is client-side only — it protects the UI but not the API.
 *
 * This module mirrors the ALLOWED_EMAILS list from AuthGate.tsx
 * and verifies the Supabase session cookie server-side.
 *
 * Usage in every /api/admin/* route:
 *   const admin = await verifyAdmin();
 *   if (!admin.isAdmin) return admin.response;
 *
 * File: apps/admin/src/lib/admin-auth.ts
 */

import { createServerClient } from "@supabase/ssr";
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

export async function verifyAdmin(): Promise<AdminOk | AdminFail> {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch {
              // Server Component — safe to ignore
            }
          },
        },
      }
    );

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user || !user.email) {
      return {
        isAdmin: false,
        response: NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        ),
      };
    }

    if (!ALLOWED_EMAILS.includes(user.email.toLowerCase())) {
      console.warn(
        `[ADMIN AUTH] Unauthorized access attempt by: ${user.email} (${user.id})`
      );
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
    console.error("[ADMIN AUTH] Verification error:", err);
    return {
      isAdmin: false,
      response: NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      ),
    };
  }
}
