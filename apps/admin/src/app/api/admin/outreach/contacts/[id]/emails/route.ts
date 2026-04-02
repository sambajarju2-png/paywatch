import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: emails, error } = await supabase
      .from("b2b_email_log")
      .select("id, direction, from_email, from_name, to_email, to_name, subject, body_html, status, sent_at, delivered_at, opened_at, clicked_at, replied_at, reply_body, reply_from, reply_subject, campaign_id, sequence_step, created_at")
      .eq("contact_id", id)
      .order("sent_at", { ascending: false, nullsFirst: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ emails: emails || [] });
  } catch (err) {
    console.error("[Contact Emails]", err);
    return NextResponse.json({ error: "Failed to fetch emails" }, { status: 500 });
  }
}
