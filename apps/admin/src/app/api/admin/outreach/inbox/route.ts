import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

/**
 * GET /api/admin/outreach/inbox
 * 
 * Returns all emails across all contacts, newest first.
 * Query params:
 *   page (default 1), per_page (default 50)
 *   direction: outbound | inbound | all (default all)
 *   search: search subject/to_email/from_email
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get("per_page") || "50", 10)));
    const direction = searchParams.get("direction") || "all";
    const search = searchParams.get("search");

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase
      .from("b2b_email_log")
      .select(`
        id, direction, from_email, from_name, to_email, to_name,
        subject, body_html, status, sent_at, delivered_at, opened_at,
        clicked_at, replied_at, reply_body, reply_from, reply_subject,
        contact_id, campaign_id, sequence_step, created_at,
        attachments
      `, { count: "exact" })
      .order("sent_at", { ascending: false, nullsFirst: false });

    if (direction !== "all") query = query.eq("direction", direction);
    
    const mailbox = searchParams.get("mailbox");
    if (mailbox && mailbox !== "all") {
      const addr = `${mailbox}@paywatch.nl`;
      query = query.or(`from_email.ilike.%${addr}%,to_email.ilike.%${addr}%`);
    }

    if (search) {
      query = query.or(`subject.ilike.%${search}%,to_email.ilike.%${search}%,from_email.ilike.%${search}%`);
    }

    const { data: emails, error, count } = await query.range(from, to);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch contact names for each email
    const contactIds = [...new Set((emails || []).map((e) => e.contact_id).filter(Boolean))];
    let contactMap: Record<string, { name: string; type: string }> = {};

    if (contactIds.length > 0) {
      const { data: contacts } = await supabase
        .from("b2b_contacts")
        .select("id, organization_name, type")
        .in("id", contactIds);

      if (contacts) {
        contactMap = Object.fromEntries(
          contacts.map((c) => [c.id, { name: c.organization_name, type: c.type }])
        );
      }
    }

    // Enrich emails with contact info
    const enriched = (emails || []).map((e) => ({
      ...e,
      contact_name: e.contact_id ? contactMap[e.contact_id]?.name || null : null,
      contact_type: e.contact_id ? contactMap[e.contact_id]?.type || null : null,
    }));

    return NextResponse.json({
      emails: enriched,
      total: count || 0,
      page,
      per_page: perPage,
      total_pages: Math.ceil((count || 0) / perPage),
    });
  } catch (err) {
    console.error("[Inbox]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
