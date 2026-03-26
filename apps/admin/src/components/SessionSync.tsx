"use client";

import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

/**
 * Syncs the Supabase auth session from localStorage to a cookie.
 *
 * The admin app uses client-side auth (AuthGate reads localStorage).
 * But server-side API routes need to verify the session via cookies.
 * This component bridges the gap by writing the access_token to a
 * simple cookie on every page load and session change.
 *
 * Add to layout.tsx inside <AuthGate>, renders nothing.
 */
export function SessionSync() {
  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    function syncToken(accessToken: string | null) {
      if (accessToken) {
        document.cookie = `sb-admin-token=${accessToken}; path=/; max-age=3600; SameSite=Lax; Secure`;
      } else {
        document.cookie = "sb-admin-token=; path=/; max-age=0; SameSite=Lax; Secure";
      }
    }

    // Sync on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      syncToken(session?.access_token || null);
    });

    // Sync on session change (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncToken(session?.access_token || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return null;
}
