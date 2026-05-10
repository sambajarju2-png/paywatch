import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceRoleClient();

    // Get campaign
    const { data: campaign, error: campErr } = await supabase
      .from("b2b_campaigns")
      .select("*")
      .eq("id", id)
      .single();

    if (campErr || !campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Get email logs for this campaign with contact info
    const { data: emails } = await supabase
      .from("b2b_email_log")
      .select("id, contact_id, to_email, to_name, from_email, subject, status, sent_at, opened_at, clicked_at, replied_at, bounced_at")
      .eq("campaign_id", id)
      .order("sent_at", { ascending: false });

    // Get unique contact IDs and fetch their org names
    const contactIds = [...new Set((emails || []).map(e => e.contact_id).filter(Boolean))];
    let contactMap: Record<string, { organization_name: string; contact_person: string | null }> = {};

    if (contactIds.length > 0) {
      const { data: contacts } = await supabase
        .from("b2b_contacts")
        .select("id, organization_name, contact_person")
        .in("id", contactIds);

      if (contacts) {
        contactMap = Object.fromEntries(
          contacts.map(c => [c.id, { organization_name: c.organization_name, contact_person: c.contact_person }])
        );
      }
    }

    // Attach contact info to emails
    const enrichedEmails = (emails || []).map(e => ({
      ...e,
      contact: contactMap[e.contact_id] || null,
    }));

    return NextResponse.json({ campaign, emails: enrichedEmails });
  } catch (err) {
    console.error("[Campaign Detail]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
