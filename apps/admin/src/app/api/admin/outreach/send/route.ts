import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// Warmup schedule: auto-increase daily limits
const WARMUP_SCHEDULE = [
  { from: 1, to: 7, limit: 5 },
  { from: 8, to: 14, limit: 10 },
  { from: 15, to: 21, limit: 20 },
  { from: 22, to: 28, limit: 30 },
  { from: 29, to: 999, limit: 40 },
];

function getWarmupLimit(warmupDay: number): number {
  const tier = WARMUP_SCHEDULE.find(
    (s) => warmupDay >= s.from && warmupDay <= s.to
  );
  return tier?.limit || 40;
}

// Check if current time is within 9-17 NL (CET/CEST)
function isWithinSendingHours(): boolean {
  const now = new Date();
  // NL is UTC+1 (CET) or UTC+2 (CEST)
  // Simple approach: check UTC hour is between 7-16 (covers both CET and CEST)
  const utcHour = now.getUTCHours();
  return utcHour >= 7 && utcHour < 16;
}

async function sendViaMailgun(
  account: { email: string; display_name: string; domain: string },
  emailLog: {
    id: string;
    to_email: string;
    to_name: string | null;
    subject: string;
    body_html: string;
    body_text: string | null;
    campaign_id: string | null;
    contact_id: string | null;
  }
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
  if (!MAILGUN_API_KEY) {
    return { success: false, error: "MAILGUN_API_KEY not set" };
  }

  const form = new FormData();
  form.append("from", `${account.display_name} <${account.email}>`);
  form.append(
    "to",
    emailLog.to_name
      ? `${emailLog.to_name} <${emailLog.to_email}>`
      : emailLog.to_email
  );
  form.append("subject", emailLog.subject);
  form.append("html", emailLog.body_html);
  if (emailLog.body_text) {
    form.append("text", emailLog.body_text);
  }
  if (emailLog.campaign_id) {
    form.append("o:tag", `campaign-${emailLog.campaign_id}`);
  }
  form.append("o:tracking-opens", "yes");
  form.append("o:tracking-clicks", "htmlonly");
  form.append(
    "h:List-Unsubscribe",
    `<mailto:unsubscribe@paywatch.nl?subject=unsubscribe-${emailLog.contact_id || "unknown"}>`
  );
  form.append("v:email_log_id", emailLog.id);

  try {
    const res = await fetch(
      `https://api.eu.mailgun.net/v3/${account.domain}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString("base64")}`,
        },
        body: form,
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[Send] Mailgun error ${res.status}:`, errText);
      return { success: false, error: `Mailgun ${res.status}: ${errText}` };
    }

    const data = await res.json();
    return { success: true, messageId: data.id };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

// POST — CRON: Process queued emails (call every 15 min)
// Auth: Bearer CRON_SECRET
export async function POST(req: NextRequest) {
  try {
    // Verify cron auth
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check sending hours (9-17 NL time)
    if (!isWithinSendingHours()) {
      return NextResponse.json({
        skipped: true,
        reason: "Outside sending hours (9-17 NL time)",
      });
    }

    const supabase = createServiceRoleClient();
    const today = new Date().toISOString().split("T")[0];

    // Fetch active sending accounts
    const { data: accounts } = await supabase
      .from("b2b_sending_accounts")
      .select("*")
      .eq("is_active", true);

    if (!accounts || accounts.length === 0) {
      return NextResponse.json({ error: "No active accounts" });
    }

    // Auto-update daily limits based on warmup schedule
    for (const acc of accounts) {
      const warmupDay = Math.max(
        1,
        Math.ceil(
          (Date.now() - new Date(acc.warmup_start_date).getTime()) / 86400000
        )
      );
      const expectedLimit = getWarmupLimit(warmupDay);
      if (acc.daily_limit !== expectedLimit) {
        await supabase
          .from("b2b_sending_accounts")
          .update({ daily_limit: expectedLimit })
          .eq("id", acc.id);
        acc.daily_limit = expectedLimit;
      }
    }

    // Get today's send counts per account
    const { data: dailySends } = await supabase
      .from("b2b_daily_sends")
      .select("account_id, emails_sent")
      .eq("date", today);

    const sendCounts = new Map(
      dailySends?.map((d) => [d.account_id, d.emails_sent]) || []
    );

    // Fetch queued emails that are scheduled for now or earlier
    const now = new Date().toISOString();
    const { data: queuedEmails } = await supabase
      .from("b2b_email_log")
      .select("*")
      .eq("status", "queued")
      .lte("scheduled_for", now)
      .order("scheduled_for", { ascending: true })
      .limit(50);

    if (!queuedEmails || queuedEmails.length === 0) {
      return NextResponse.json({ sent: 0, reason: "No queued emails" });
    }

    let totalSent = 0;
    let totalSkipped = 0;
    let totalFailed = 0;

    for (const email of queuedEmails) {
      // Find the matching account
      const account = accounts.find((a) => a.email === email.from_email);
      if (!account) {
        console.error(`[Send] No account for ${email.from_email}`);
        totalSkipped++;
        continue;
      }

      // Check daily limit
      const currentSent = sendCounts.get(account.id) || 0;
      if (currentSent >= account.daily_limit) {
        totalSkipped++;
        continue;
      }

      // Check if contact has replied or bounced (stop sending)
      if (email.contact_id) {
        const { data: otherEmails } = await supabase
          .from("b2b_email_log")
          .select("status")
          .eq("contact_id", email.contact_id)
          .eq("campaign_id", email.campaign_id)
          .in("status", ["replied", "bounced", "complained"]);

        if (otherEmails && otherEmails.length > 0) {
          // Mark as skipped — contact already replied/bounced
          await supabase
            .from("b2b_email_log")
            .update({ status: "skipped" })
            .eq("id", email.id);
          totalSkipped++;
          continue;
        }
      }

      // Update status to sending
      await supabase
        .from("b2b_email_log")
        .update({ status: "sending" })
        .eq("id", email.id);

      // Send via Mailgun
      const result = await sendViaMailgun(account, email);

      if (result.success) {
        // Update email log
        await supabase
          .from("b2b_email_log")
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
            mailtrap_message_id: result.messageId || null,
          })
          .eq("id", email.id);

        // Update daily send count
        const newCount = currentSent + 1;
        sendCounts.set(account.id, newCount);

        const { data: existing } = await supabase
          .from("b2b_daily_sends")
          .select("id")
          .eq("account_id", account.id)
          .eq("date", today)
          .single();

        if (existing) {
          await supabase
            .from("b2b_daily_sends")
            .update({ emails_sent: newCount })
            .eq("id", existing.id);
        } else {
          await supabase.from("b2b_daily_sends").insert({
            account_id: account.id,
            emails_sent: 1,
            date: today,
          });
        }

        // Update campaign total_sent
        if (email.campaign_id) {
          await supabase.rpc("increment_campaign_sent", {
            cid: email.campaign_id,
          }).catch(() => {
            // Fallback: direct update
            supabase
              .from("b2b_campaigns")
              .update({
                total_sent: currentSent + 1,
              })
              .eq("id", email.campaign_id);
          });
        }

        totalSent++;
      } else {
        // Mark as failed
        await supabase
          .from("b2b_email_log")
          .update({
            status: "failed",
            bounce_type: result.error?.slice(0, 200) || null,
          })
          .eq("id", email.id);
        totalFailed++;
      }

      // Anti-spam: 60-120s delay between sends
      const delay = 60000 + Math.random() * 60000;
      await new Promise((r) => setTimeout(r, delay));
    }

    return NextResponse.json({
      sent: totalSent,
      skipped: totalSkipped,
      failed: totalFailed,
      processed: queuedEmails.length,
    });
  } catch (err) {
    console.error("[Send CRON]", err);
    return NextResponse.json(
      { error: "Send cron failed" },
      { status: 500 }
    );
  }
}
