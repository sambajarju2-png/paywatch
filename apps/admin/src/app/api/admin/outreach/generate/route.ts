import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

const EMAIL_SYSTEM_PROMPT = `You are the outreach copywriter for PayWatch (paywatch.app), a Dutch bill tracking app.
ABOUT: PWA scanning Gmail/Outlook, tracking escalation (factuur → deurwaarder), AI extraction.
TONE: Direct, professional, "u" form. To the point — these are customers not users. Understand their world.
RULES:
- Dutch "u" form unless language is English
- Max 120 words step 1, 80 words follow-ups
- One clear ask per email
- Reference their specific company/role
- Subject under 50 chars
- No images, max 1 link
- Include real postal address: PayWatch B.V., Rotterdam
- End with unsubscribe line (small text)
BY TYPE:
- incasso: position as faster payment recovery tool
- aid_org: position as better outcomes for clients
- gemeente: position as vroegsignalering + preventie
- bewindvoerder: position as oversight + client empowerment
- kredietbank: position as early intervention tool
RESPOND JSON ONLY: {"subject":"...","body_html":"<p>...</p>","body_text":"..."}`;

// POST — Generate emails for a campaign
// Body: { campaignId }
export async function POST(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const { campaignId } = await req.json();

    if (!campaignId) {
      return NextResponse.json(
        { error: "campaignId required" },
        { status: 400 }
      );
    }

    // Fetch campaign
    const { data: campaign, error: campError } = await supabase
      .from("b2b_campaigns")
      .select("*")
      .eq("id", campaignId)
      .single();

    if (campError || !campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    // Fetch matching contacts (not bounced, have email)
    let contactQuery = supabase
      .from("b2b_contacts")
      .select("*")
      .not("status", "eq", "bounced")
      .not("contact_email", "is", null);

    if (campaign.target_type) {
      contactQuery = contactQuery.eq("type", campaign.target_type);
    }

    const { data: contacts, error: contactError } = await contactQuery;

    if (contactError || !contacts || contacts.length === 0) {
      return NextResponse.json(
        { error: "No matching contacts found" },
        { status: 404 }
      );
    }

    // Check which contacts already have emails for this campaign
    const { data: existingLogs } = await supabase
      .from("b2b_email_log")
      .select("contact_id, sequence_step")
      .eq("campaign_id", campaignId);

    const existingSet = new Set(
      (existingLogs || []).map(
        (l) => `${l.contact_id}-${l.sequence_step}`
      )
    );

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });

    const steps = campaign.sequence_steps || [{ day: 0, type: "initial" }];
    let generated = 0;
    let skipped = 0;
    let errors = 0;

    // Fetch sending account
    const { data: account } = await supabase
      .from("b2b_sending_accounts")
      .select("*")
      .eq("email", campaign.from_email)
      .single();

    const fromName = account?.display_name || campaign.from_name;
    const fromEmail = campaign.from_email;

    for (const contact of contacts) {
      for (let stepIdx = 0; stepIdx < steps.length; stepIdx++) {
        const step = steps[stepIdx];
        const stepNum = stepIdx + 1;
        const key = `${contact.id}-${stepNum}`;

        // Skip if already generated
        if (existingSet.has(key)) {
          skipped++;
          continue;
        }

        try {
          // Generate email with Claude Sonnet
          const message = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 600,
            system: EMAIL_SYSTEM_PROMPT,
            messages: [
              {
                role: "user",
                content: `COMPANY: ${contact.organization_name} (${contact.type}) — ${contact.city || "NL"}
Contact: ${contact.contact_person || "Team"}, ${contact.contact_role || ""}
Research: ${contact.ai_research_summary || "No research available"}
CAMPAIGN: ${campaign.campaign_brief}
TONE: ${campaign.tone?.replace(/_/g, " ") || "professional warm"}
LANGUAGE: ${campaign.language || "nl"}
STEP: ${stepNum} of ${steps.length} (${step.type})
${stepNum > 1 ? "This is a follow-up. Be shorter, reference the previous email." : ""}

Generate the email now. JSON only.`,
              },
            ],
          });

          const responseText =
            message.content[0].type === "text"
              ? message.content[0].text
              : "";

          // Parse JSON from response
          let emailData: {
            subject: string;
            body_html: string;
            body_text: string;
          };

          try {
            // Try direct parse first
            emailData = JSON.parse(responseText);
          } catch {
            // Try extracting JSON from response
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              emailData = JSON.parse(jsonMatch[0]);
            } else {
              throw new Error("Could not parse JSON from response");
            }
          }

          // Calculate scheduled time
          const scheduledFor = new Date();
          scheduledFor.setDate(scheduledFor.getDate() + (step.day || 0));
          // Send between 9-17 NL time (UTC+1/+2)
          scheduledFor.setUTCHours(8 + Math.floor(Math.random() * 8));
          scheduledFor.setUTCMinutes(Math.floor(Math.random() * 60));

          // Insert into email log
          const { error: insertError } = await supabase
            .from("b2b_email_log")
            .insert({
              campaign_id: campaignId,
              contact_id: contact.id,
              sequence_step: stepNum,
              to_email: contact.contact_email,
              to_name: contact.contact_person || null,
              from_email: fromEmail,
              from_name: fromName,
              subject: emailData.subject,
              body_html: emailData.body_html,
              body_text: emailData.body_text || "",
              status: "queued",
              scheduled_for: scheduledFor.toISOString(),
            });

          if (insertError) {
            console.error("[Generate] Insert error:", insertError);
            errors++;
          } else {
            generated++;
          }

          // Small delay between AI calls
          await new Promise((r) => setTimeout(r, 500));
        } catch (err) {
          console.error(
            `[Generate] Error for ${contact.organization_name} step ${stepNum}:`,
            err
          );
          errors++;
        }
      }
    }

    // Update campaign total_contacts
    await supabase
      .from("b2b_campaigns")
      .update({ total_contacts: contacts.length })
      .eq("id", campaignId);

    return NextResponse.json({
      generated,
      skipped,
      errors,
      contacts: contacts.length,
      steps: steps.length,
    });
  } catch (err) {
    console.error("[Generate]", err);
    return NextResponse.json(
      { error: "Generation failed" },
      { status: 500 }
    );
  }
}
