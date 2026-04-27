import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { randomBytes } from "crypto";

export async function GET() {
  const h = await headers();
  const orgId = h.get("x-tenant-id");
  if (!orgId) return NextResponse.json({ error: "No org context" }, { status: 400 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("b2b_webhooks")
    .select("id, url, events, status, failure_count, last_triggered_at, last_success_at, created_at")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const h = await headers();
  const orgId = h.get("x-tenant-id");
  if (!orgId) return NextResponse.json({ error: "No org context" }, { status: 400 });

  const body = await request.json();
  const { url, events } = body;

  if (!url || !events || !Array.isArray(events)) {
    return NextResponse.json({ error: "url and events[] required" }, { status: 400 });
  }

  const secret = randomBytes(32).toString("hex");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("b2b_webhooks")
    .insert({ organization_id: orgId, url, events, secret })
    .select("id, url, events, status, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    data: { ...data, secret },
    message: "Webhook created. Store the secret securely - it won't be shown again.",
  }, { status: 201 });
}
