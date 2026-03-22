import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const checks: Record<string, string> = {
    NEXT_PUBLIC_SUPABASE_URL: url ? `SET (${url.slice(0, 30)}...)` : "MISSING",
    SUPABASE_SERVICE_ROLE_KEY: serviceKey ? `SET (${serviceKey.slice(0, 10)}...${serviceKey.slice(-5)})` : "MISSING",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey ? `SET (${anonKey.slice(0, 10)}...)` : "MISSING",
    RESEND_API_KEY: process.env.RESEND_API_KEY ? "SET" : "MISSING",
  };

  let dbTest = "NOT TESTED";
  let billCount = 0;
  let userCount = 0;
  let contactCount = 0;
  let appCount = 0;

  if (url && serviceKey) {
    try {
      const sb = createClient(url, serviceKey);

      const bills = await sb.from("bills").select("id", { count: "exact", head: true });
      billCount = bills.count ?? 0;

      const users = await sb.from("user_settings").select("user_id", { count: "exact", head: true });
      userCount = users.count ?? 0;

      const contacts = await sb.from("contact_submissions").select("id", { count: "exact", head: true });
      contactCount = contacts.count ?? 0;

      const apps = await sb.from("job_applications").select("id", { count: "exact", head: true });
      appCount = apps.count ?? 0;

      dbTest = `OK — ${billCount} bills, ${userCount} users, ${contactCount} contacts, ${appCount} applications`;

      if (bills.error) dbTest = `ERROR: ${bills.error.message}`;
    } catch (e: unknown) {
      dbTest = `EXCEPTION: ${e instanceof Error ? e.message : String(e)}`;
    }
  } else {
    dbTest = "SKIPPED — missing SUPABASE_SERVICE_ROLE_KEY or URL";
  }

  return NextResponse.json({
    envVars: checks,
    dbTest,
    counts: { bills: billCount, users: userCount, contacts: contactCount, applications: appCount },
  });
}
