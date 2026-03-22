import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const RESEND_API_KEY = process.env.RESEND_API_KEY!;

const AUDIENCES = {
  consumers: "065fa004-bc05-4d75-abaf-67ed1e41872d",
  b2b: "113aa5e0-31d8-4db4-bffd-1ddc42dd675e",
  general: "ee9f4b20-bbd5-4f6f-b98e-ddb1327cbc91",
};

export async function GET() {
  try {
    // 1. Newsletter subscribers from Supabase
    const { data: subscribers, error: subErr } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false });

    if (subErr) console.error("newsletter_subscribers error:", subErr);

    const allSubs = subscribers || [];

    // Count by audience_type
    const consumerCount = allSubs.filter((s) => s.audience_type === "consumer").length;
    const gemeenteCount = allSubs.filter((s) => s.audience_type === "gemeente").length;
    const aidOrgCount = allSubs.filter((s) => s.audience_type === "aid_org").length;
    const companyCount = allSubs.filter((s) => s.audience_type === "company").length;
    const b2bCount = gemeenteCount + aidOrgCount + companyCount;
    const unsubscribedCount = allSubs.filter((s) => s.unsubscribed_at !== null).length;
    const activeCount = allSubs.length - unsubscribedCount;

    // Growth by month (last 6 months)
    const now = new Date();
    const growth: { month: string; consumers: number; b2b: number; total: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      const nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      const monthSubs = allSubs.filter((s) => {
        const created = new Date(s.created_at);
        return created >= d && created < nextMonth;
      });
      growth.push({
        month: monthStr,
        consumers: monthSubs.filter((s) => s.audience_type === "consumer").length,
        b2b: monthSubs.filter((s) => ["gemeente", "aid_org", "company"].includes(s.audience_type)).length,
        total: monthSubs.length,
      });
    }

    // 2. Digest subscribers from user_settings
    const { data: digestData, error: digestErr } = await supabase
      .from("user_settings")
      .select("user_id, display_name, notify_email_digest");

    if (digestErr) console.error("user_settings digest error:", digestErr);

    const digestUsers = digestData || [];
    const digestActive = digestUsers.filter((u) => u.notify_email_digest === true).length;
    const digestUnsubscribed = digestUsers.filter((u) => u.notify_email_digest === false).length;

    // 3. Unsubscribe feedback from user_feedback
    const { data: feedback, error: feedbackErr } = await supabase
      .from("user_feedback")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (feedbackErr) console.error("user_feedback error:", feedbackErr);

    // 4. Resend audience counts (optional — may fail if API key not set)
    let resendAudiences: Record<string, number> = {};
    try {
      for (const [key, id] of Object.entries(AUDIENCES)) {
        const res = await fetch(`https://api.resend.com/audiences/${id}/contacts`, {
          headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
        });
        if (res.ok) {
          const json = await res.json();
          resendAudiences[key] = json.data?.length || 0;
        }
      }
    } catch (e) {
      console.error("Resend audience fetch error:", e);
    }

    return NextResponse.json({
      subscribers: {
        total: allSubs.length,
        active: activeCount,
        unsubscribed: unsubscribedCount,
        consumers: consumerCount,
        b2b: b2bCount,
        gemeentes: gemeenteCount,
        aidOrgs: aidOrgCount,
        companies: companyCount,
        unsubscribeRate: allSubs.length > 0
          ? Math.round((unsubscribedCount / allSubs.length) * 100)
          : 0,
      },
      growth,
      digest: {
        active: digestActive,
        unsubscribed: digestUnsubscribed,
        total: digestUsers.length,
      },
      feedback: feedback || [],
      resendAudiences,
      list: allSubs.map((s) => ({
        id: s.id,
        email: s.email,
        name: s.name,
        company_name: s.company_name,
        audience_type: s.audience_type,
        language: s.language,
        source: s.source,
        subscribed_at: s.subscribed_at,
        unsubscribed_at: s.unsubscribed_at,
        created_at: s.created_at,
      })),
    });
  } catch (err) {
    console.error("Admin email API error:", err);
    return NextResponse.json({ error: "Failed to load email data" }, { status: 500 });
  }
}
