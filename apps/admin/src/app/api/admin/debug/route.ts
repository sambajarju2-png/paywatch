import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const envStatus = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
  };

  let dbStatus = "unknown";
  let userCount = 0;
  let billCount = 0;

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { count: uc } = await supabase
      .from("user_settings")
      .select("*", { count: "exact", head: true });

    const { count: bc } = await supabase
      .from("bills")
      .select("*", { count: "exact", head: true });

    userCount = uc || 0;
    billCount = bc || 0;
    dbStatus = "connected";
  } catch (err) {
    dbStatus = `error: ${err instanceof Error ? err.message : "unknown"}`;
  }

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: envStatus,
    db: { status: dbStatus, users: userCount, bills: billCount },
  });
}
