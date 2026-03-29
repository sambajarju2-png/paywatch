import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// Verify Mailgun webhook signature
function verifyWebhook(
  timestamp: string,
  token: string,
  signature: string
): boolean {
  const signingKey = process.env.MAILGUN_WEBHOOK_SIGNING_KEY;
  if (!signingKey) return false;

  const hmac = crypto
    .createHmac("sha256", signingKey)
    .update(timestamp + token)
    .digest("hex");

  return hmac === signature;
}

// POST — Mailgun webhook events
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Mailgun sends events in this structure:
    // { signature: { timestamp, token, signature }, event-data: { event, ... } }
    const sig = body.signature;
    const eventData = body["event-data"];

    if (!sig || !eventData) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Verify signature
    if (!verifyWebhook(sig.timestamp, sig.token, sig.signature)) {
      console.error("[Webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const supabase = createServiceRoleClient();
    const event = eventData.event; // delivered, opened, clicked, complained, failed, etc.
    const messageId = eventData.message?.headers?.["message-id"];

    // Get email_log_id from custom variables
    const emailLogId =
      eventData["user-variables"]?.email_log_id ||
      eventData["user-variables"]?.["email_log_id"];

    if (!emailLogId && !messageId) {
      // Can't identify the email, skip
      return NextResponse.json({ received: true });
    }

    // Find the email log entry
    let emailLog;
    if (emailLogId) {
      const { data } = await supabase
        .from("b2b_email_log")
        .select("id, campaign_id, contact_id, status")
        .eq("id", emailLogId)
        .single();
      emailLog = data;
    } else if (messageId) {
      const { data } = await supabase
        .from("b2b_email_log")
        .select("id, campaign_id, contact_id, status")
        .eq("mailtrap_message_id", `<${messageId}>`)
        .single();
      emailLog = data;
    }

    if (!emailLog) {
      console.log("[Webhook] Email log not found for event:", event);
      return NextResponse.json({ received: true });
    }

    const now = new Date().toISOString();

    switch (event) {
      case "delivered": {
        await supabase
          .from("b2b_email_log")
          .update({ status: "delivered", delivered_at: now })
          .eq("id", emailLog.id);
        break;
      }

      case "opened": {
        // Only update if not already replied (don't downgrade status)
        if (emailLog.status !== "replied") {
          await supabase
            .from("b2b_email_log")
            .update({ status: "opened", opened_at: now })
            .eq("id", emailLog.id);

          // Update campaign opened count
          if (emailLog.campaign_id) {
            const { data: campaign } = await supabase
              .from("b2b_campaigns")
              .select("total_opened")
              .eq("id", emailLog.campaign_id)
              .single();
            if (campaign) {
              await supabase
                .from("b2b_campaigns")
                .update({ total_opened: (campaign.total_opened || 0) + 1 })
                .eq("id", emailLog.campaign_id);
            }
          }
        }
        break;
      }

      case "clicked": {
        if (!["replied"].includes(emailLog.status)) {
          await supabase
            .from("b2b_email_log")
            .update({ clicked_at: now })
            .eq("id", emailLog.id);
        }
        break;
      }

      case "failed":
      case "rejected": {
        const severity = eventData.severity; // permanent or temporary
        if (severity === "permanent") {
          await supabase
            .from("b2b_email_log")
            .update({
              status: "bounced",
              bounced_at: now,
              bounce_type: eventData.reason || "permanent",
            })
            .eq("id", emailLog.id);

          // Mark contact as bounced
          if (emailLog.contact_id) {
            await supabase
              .from("b2b_contacts")
              .update({ status: "bounced" })
              .eq("id", emailLog.contact_id);
          }

          // Update campaign bounce count
          if (emailLog.campaign_id) {
            const { data: campaign } = await supabase
              .from("b2b_campaigns")
              .select("total_bounced")
              .eq("id", emailLog.campaign_id)
              .single();
            if (campaign) {
              await supabase
                .from("b2b_campaigns")
                .update({ total_bounced: (campaign.total_bounced || 0) + 1 })
                .eq("id", emailLog.campaign_id);
            }
          }
        }
        break;
      }

      case "complained": {
        // Spam complaint — stop all emails to this contact
        await supabase
          .from("b2b_email_log")
          .update({ status: "complained" })
          .eq("id", emailLog.id);

        if (emailLog.contact_id) {
          // Mark contact as not_interested
          await supabase
            .from("b2b_contacts")
            .update({ status: "not_interested" })
            .eq("id", emailLog.contact_id);

          // Skip all queued emails for this contact
          await supabase
            .from("b2b_email_log")
            .update({ status: "skipped" })
            .eq("contact_id", emailLog.contact_id)
            .eq("status", "queued");
        }
        break;
      }

      default:
        console.log("[Webhook] Unhandled event:", event);
    }

    return NextResponse.json({ received: true, event });
  } catch (err) {
    console.error("[Webhook]", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
