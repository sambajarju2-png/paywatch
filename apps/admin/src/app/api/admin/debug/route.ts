import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const envStatus = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
  };

  let dbTest = "not tested";
  try {
    const { count, error } = await supabase.from("user_settings").select("user_id", { count: "exact", head: true });
    dbTest = error ? `error: ${error.message}` : `ok (${count} users)`;
  } catch (e) {
    dbTest = `exception: ${e}`;
  }

  return NextResponse.json({ envStatus, dbTest, timestamp: new Date().toISOString() });
}
