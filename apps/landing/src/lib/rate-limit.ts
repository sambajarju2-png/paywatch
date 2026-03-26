/**
 * IP-based rate limiting for public-facing landing page endpoints.
 * Uses the public_rate_limits table in Supabase.
 *
 * File: apps/landing/src/lib/rate-limit.ts
 */

import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Check IP-based rate limit for public endpoints.
 * Returns null if allowed, or a NextResponse 429 if rate limited.
 *
 * Usage at the top of any POST handler:
 *   const limited = await checkPublicRateLimit("contact", 5, 60);
 *   if (limited) return limited;
 */
export async function checkPublicRateLimit(
  endpoint: string,
  maxRequests: number,
  windowMinutes: number
): Promise<NextResponse | null> {
  try {
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headersList.get("x-real-ip") ||
      "unknown";

    const supabase = getSupabase();
    const windowStart = new Date(
      Date.now() - windowMinutes * 60 * 1000
    ).toISOString();

    // Count requests in the current window
    const { count, error } = await supabase
      .from("public_rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", ip)
      .eq("endpoint", endpoint)
      .gte("window_start", windowStart);

    if (error) {
      console.error("Rate limit check error:", error);
      return null; // Fail open
    }

    if ((count || 0) >= maxRequests) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Record this request
    await supabase.from("public_rate_limits").insert({
      ip_address: ip,
      endpoint,
    });

    // Cleanup old entries (fire and forget)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    supabase
      .from("public_rate_limits")
      .delete()
      .lt("window_start", oneHourAgo)
      .then(() => {});

    return null; // Allowed
  } catch (err) {
    console.error("Rate limit error:", err);
    return null; // Fail open
  }
}
