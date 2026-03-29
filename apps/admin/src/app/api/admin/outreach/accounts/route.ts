import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET() {
  try {
    const supabase = createServiceRoleClient();

    const { data: accounts, error } = await supabase
      .from("b2b_sending_accounts")
      .select("*")
      .order("email");

    if (error) {
      console.error("[Accounts GET]", error);
      return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }

    // Get today's send counts
    const today = new Date().toISOString().split("T")[0];
    const { data: dailySends } = await supabase
      .from("b2b_daily_sends")
      .select("account_id, emails_sent")
      .eq("date", today);

    const dailySendMap = new Map(
      dailySends?.map((d) => [d.account_id, d.emails_sent]) || []
    );

    const enriched = (accounts || []).map((acc) => {
      const warmupDay = Math.max(
        1,
        Math.ceil(
          (Date.now() - new Date(acc.warmup_start_date).getTime()) / 86400000
        )
      );
      return {
        ...acc,
        today_sent: dailySendMap.get(acc.id) || 0,
        warmup_day: warmupDay,
      };
    });

    return NextResponse.json({ accounts: enriched });
  } catch (err) {
    console.error("[Accounts GET]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
