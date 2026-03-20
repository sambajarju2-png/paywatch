import { createServerClient as createClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createServerClient() {
  const cookieStore = await cookies();

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        // FIX 1: Explicit type for cookiesToSet
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              // FIX 2: Cast options 'as any' to satisfy Next.js internal types
              cookieStore.set(name, value, options as any)
            );
          } catch {
            // This catch is necessary because Server Components 
            // are often read-only for cookies.
          }
        },
      },
    }
  );
}
