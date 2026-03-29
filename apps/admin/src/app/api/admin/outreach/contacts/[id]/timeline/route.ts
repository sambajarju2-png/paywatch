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

    // 1. Get full contact data
    const { data: contact, error: cErr } = await supabase
      .from("b2b_contacts")
      .select("*")
      .eq("id", id)
      .single();

    if (cErr || !contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    // 2. Get all email logs for this contact, joined with campaign name
    const { data: emails, error: eErr } = await supabase
      .from("b2b_email_log")
      .select(`
        id, campaign_id, sequence_step, to_email, from_email, from_name,
        subject, status, sent_at, delivered_at, opened_at, clicked_at,
        replied_at, bounced_at, bounce_type, scheduled_for, created_at
      `)
      .eq("contact_id", id)
      .order("created_at", { ascending: true });

    if (eErr) {
      return NextResponse.json({ error: eErr.message }, { status: 500 });
    }

    // 3. Get campaign names for the emails
    const campaignIds = [...new Set((emails || []).map((e) => e.campaign_id).filter(Boolean))];
    let campaignMap: Record<string, string> = {};

    if (campaignIds.length > 0) {
      const { data: campaigns } = await supabase
        .from("b2b_campaigns")
        .select("id, name")
        .in("id", campaignIds);

      if (campaigns) {
        campaignMap = Object.fromEntries(campaigns.map((c) => [c.id, c.name]));
      }
    }

    // 4. Build timeline events
    type TimelineEvent = {
      id: string;
      type: string;
      timestamp: string;
      title: string;
      detail?: string;
      meta?: Record<string, unknown>;
    };

    const events: TimelineEvent[] = [];

    // Contact created
    events.push({
      id: `created-${contact.id}`,
      type: "contact_created",
      timestamp: contact.created_at,
      title: "Contact added",
      detail: contact.organization_name,
    });

    // AI researched
    if (contact.ai_researched_at) {
      events.push({
        id: `researched-${contact.id}`,
        type: "ai_researched",
        timestamp: contact.ai_researched_at,
        title: "AI research completed",
        detail: contact.ai_research_summary
          ? contact.ai_research_summary.substring(0, 160) + (contact.ai_research_summary.length > 160 ? "…" : "")
          : undefined,
      });
    }

    // Email events — each email can generate multiple events
    for (const email of emails || []) {
      const campaignName = email.campaign_id ? campaignMap[email.campaign_id] || "Unknown campaign" : "Manual";
      const stepLabel = `Step ${email.sequence_step}`;

      // Scheduled
      if (email.scheduled_for && email.status === "sending") {
        events.push({
          id: `scheduled-${email.id}`,
          type: "email_scheduled",
          timestamp: email.scheduled_for,
          title: `Email scheduled`,
          detail: email.subject,
          meta: { campaign: campaignName, step: stepLabel, from: email.from_email },
        });
      }

      // Sent
      if (email.sent_at) {
        events.push({
          id: `sent-${email.id}`,
          type: "email_sent",
          timestamp: email.sent_at,
          title: `Email sent`,
          detail: email.subject,
          meta: { campaign: campaignName, step: stepLabel, from: email.from_email },
        });
      }

      // Delivered
      if (email.delivered_at) {
        events.push({
          id: `delivered-${email.id}`,
          type: "email_delivered",
          timestamp: email.delivered_at,
          title: `Email delivered`,
          detail: email.subject,
          meta: { campaign: campaignName, step: stepLabel },
        });
      }

      // Opened
      if (email.opened_at) {
        events.push({
          id: `opened-${email.id}`,
          type: "email_opened",
          timestamp: email.opened_at,
          title: `Email opened`,
          detail: email.subject,
          meta: { campaign: campaignName, step: stepLabel },
        });
      }

      // Clicked
      if (email.clicked_at) {
        events.push({
          id: `clicked-${email.id}`,
          type: "email_clicked",
          timestamp: email.clicked_at,
          title: `Link clicked`,
          detail: email.subject,
          meta: { campaign: campaignName, step: stepLabel },
        });
      }

      // Replied
      if (email.replied_at) {
        events.push({
          id: `replied-${email.id}`,
          type: "email_replied",
          timestamp: email.replied_at,
          title: `Reply received`,
          detail: email.subject,
          meta: { campaign: campaignName, step: stepLabel },
        });
      }

      // Bounced
      if (email.bounced_at) {
        events.push({
          id: `bounced-${email.id}`,
          type: "email_bounced",
          timestamp: email.bounced_at,
          title: `Email bounced`,
          detail: `${email.bounce_type || "unknown"} — ${email.subject}`,
          meta: { campaign: campaignName, step: stepLabel },
        });
      }
    }

    // Sort by timestamp descending (newest first)
    events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({
      contact,
      total_events: events.length,
      events,
    });
  } catch (err) {
    console.error("[Timeline API]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
