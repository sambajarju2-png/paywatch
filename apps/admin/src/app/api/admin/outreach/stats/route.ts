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

    // Total contacts
    const { count: totalContacts } = await supabase
      .from("b2b_contacts")
      .select("*", { count: "exact", head: true });

    // Email log aggregates
    const { data: emailLogs } = await supabase
      .from("b2b_email_log")
      .select("status");

    const totalSent =
      emailLogs?.filter((e) =>
        ["delivered", "opened", "clicked", "replied", "sent", "sending"].includes(
          e.status
        )
      ).length || 0;
    const totalOpened =
      emailLogs?.filter((e) =>
        ["opened", "clicked", "replied"].includes(e.status)
      ).length || 0;
    const totalReplied =
      emailLogs?.filter((e) => e.status === "replied").length || 0;
    const totalBounced =
      emailLogs?.filter((e) => e.status === "bounced").length || 0;

    const openRate =
      totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;
    const replyRate =
      totalSent > 0 ? Math.round((totalReplied / totalSent) * 100) : 0;
    const bounceRate =
      totalSent > 0 ? Math.round((totalBounced / totalSent) * 100) : 0;

    // Active campaigns
    const { data: activeCampaigns } = await supabase
      .from("b2b_campaigns")
      .select(
        "id, name, status, total_contacts, total_sent, total_opened, total_replied"
      )
      .in("status", ["active", "draft"])
      .order("created_at", { ascending: false })
      .limit(5);

    // Recent replies
    const { data: recentReplies } = await supabase
      .from("b2b_email_log")
      .select(
        "id, to_name, to_email, subject, replied_at, campaign_id, contact_id, reply_from, from_email"
      )
      .eq("status", "replied")
      .order("replied_at", { ascending: false })
      .limit(5);

    // Enrich replies with campaign + contact name
    const enrichedReplies = [];
    if (recentReplies && recentReplies.length > 0) {
      const campaignIds = [
        ...new Set(recentReplies.map((r) => r.campaign_id).filter(Boolean)),
      ];
      const contactIds = [
        ...new Set(recentReplies.map((r) => r.contact_id).filter(Boolean)),
      ];

      let campaignMap = new Map<string, string>();
      if (campaignIds.length > 0) {
        const { data: campaigns } = await supabase
          .from("b2b_campaigns")
          .select("id, name")
          .in("id", campaignIds);
        campaignMap = new Map(campaigns?.map((c) => [c.id, c.name]) || []);
      }

      let contactMap = new Map<string, string>();
      if (contactIds.length > 0) {
        const { data: contacts } = await supabase
          .from("b2b_contacts")
          .select("id, organization_name")
          .in("id", contactIds);
        contactMap = new Map(contacts?.map((c) => [c.id, c.organization_name]) || []);
      }

      for (const r of recentReplies) {
        enrichedReplies.push({
          ...r,
          campaign_name: campaignMap.get(r.campaign_id) || "Manual",
          contact_name: contactMap.get(r.contact_id) || r.to_name || r.to_email,
        });
      }
    }

    // Sending accounts with today's usage
    const { data: accounts } = await supabase
      .from("b2b_sending_accounts")
      .select("id, email, display_name, domain, daily_limit, warmup_start_date, is_active")
      .order("email");

    const today = new Date().toISOString().split("T")[0];
    const { data: dailySends } = await supabase
      .from("b2b_daily_sends")
      .select("account_id, emails_sent")
      .eq("date", today);

    const dailySendMap = new Map(
      dailySends?.map((d) => [d.account_id, d.emails_sent]) || []
    );

    const enrichedAccounts = (accounts || []).map((acc) => ({
      ...acc,
      today_sent: dailySendMap.get(acc.id) || 0,
    }));

    return NextResponse.json({
      totalContacts: totalContacts || 0,
      totalSent,
      totalOpened,
      totalReplied,
      totalBounced,
      openRate,
      replyRate,
      bounceRate,
      activeCampaigns: activeCampaigns || [],
      recentReplies: enrichedReplies,
      accounts: enrichedAccounts,
    });
  } catch (err) {
    console.error("[Outreach Stats]", err);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
