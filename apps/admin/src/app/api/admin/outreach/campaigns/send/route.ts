import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

const SIGNATURES: Record<string, string> = {
  "samba@paywatch.nl": `<br/><br/><div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:13px;color:#64748B;border-top:1px solid #E2E8F0;padding-top:16px;margin-top:16px;"><strong style="color:#0A2540;">Samba Jarju</strong><br/>Co-founder · PayWatch<br/><em style="font-size:12px;color:#94A3B8;">PayWatch: De slimme buffer tussen jou en incassokosten.</em><br/><a href="https://paywatch.app" style="color:#2563EB;text-decoration:none;">paywatch.app</a> · <a href="https://www.linkedin.com/in/sambajarju/" style="color:#2563EB;text-decoration:none;">LinkedIn</a></div>`,
  "mariama@paywatch.nl": `<br/><br/><div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:13px;color:#64748B;border-top:1px solid #E2E8F0;padding-top:16px;margin-top:16px;"><strong style="color:#0A2540;">Mariama Sesay</strong><br/>Co-founder · PayWatch<br/><em style="font-size:12px;color:#94A3B8;">PayWatch: De slimme buffer tussen jou en incassokosten.</em><br/><a href="https://paywatch.app" style="color:#2563EB;text-decoration:none;">paywatch.app</a> · <a href="https://www.linkedin.com/in/hadja-mariama-sesay-3a5392228/" style="color:#2563EB;text-decoration:none;">LinkedIn</a></div>`,
  "info@paywatch.nl": `<br/><br/><div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:13px;color:#64748B;border-top:1px solid #E2E8F0;padding-top:16px;margin-top:16px;"><strong style="color:#0A2540;">PayWatch</strong><br/><em style="font-size:12px;color:#94A3B8;">De slimme buffer tussen jou en incassokosten.</em><br/><a href="https://paywatch.app" style="color:#2563EB;text-decoration:none;">paywatch.app</a></div>`,
};

function replaceVars(template: string, contact: Record<string, unknown>): string {
  const vars: Record<string, string> = {
    "{{voornaam}}": (contact.first_name as string) || (contact.contact_person as string || "").split(" ")[0] || "",
    "{{achternaam}}": (contact.last_name as string) || (contact.contact_person as string || "").split(" ").slice(1).join(" ") || "",
    "{{volledige_naam}}": (contact.contact_person as string) || `${contact.first_name || ""} ${contact.last_name || ""}`.toString().trim(),
    "{{bedrijf}}": (contact.organization_name as string) || "",
    "{{email}}": (contact.contact_email as string) || (contact.general_email as string) || "",
    "{{website}}": (contact.website as string) || "",
    "{{functie}}": (contact.contact_role as string) || "",
    "{{stad}}": (contact.city as string) || "",
  };
  let result = template;
  for (const [key, val] of Object.entries(vars)) {
    result = result.split(key).join(val);
  }
  return result;
}

function markdownToHtml(text: string): string {
  let html = text;
  // Convert [text](url) to <a> tags
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#2563EB;text-decoration:underline;">$1</a>');
  // Convert **text** to <strong>
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Convert newlines to <br/>
  html = html.replace(/\n/g, "<br/>");
  return html;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const { campaign_id } = await req.json();

    if (!campaign_id) {
      return NextResponse.json({ error: "campaign_id required" }, { status: 400 });
    }

    // 1. Get campaign
    const { data: campaign, error: campErr } = await supabase
      .from("b2b_campaigns")
      .select("*")
      .eq("id", campaign_id)
      .single();

    if (campErr || !campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    if (campaign.campaign_mode !== "manual") {
      return NextResponse.json({ error: "Only manual campaigns can use bulk send" }, { status: 400 });
    }

    if (!campaign.email_subject || !campaign.email_body) {
      return NextResponse.json({ error: "Campaign missing subject or body template" }, { status: 400 });
    }

    // 2. Get sender account
    const senderEmail = campaign.from_accounts?.[0] || campaign.from_email || "samba@paywatch.nl";
    const { data: account } = await supabase
      .from("b2b_sending_accounts")
      .select("*")
      .eq("email", senderEmail)
      .single();

    if (!account) {
      return NextResponse.json({ error: `Sender ${senderEmail} not found` }, { status: 404 });
    }

    // 3. Get matching contacts
    let query = supabase
      .from("b2b_contacts")
      .select("*")
      .not("status", "eq", "bounced")
      .not("contact_email", "is", null);

    if (campaign.target_type) {
      query = query.eq("type", campaign.target_type);
    }
    if (campaign.target_tags && campaign.target_tags.length > 0) {
      query = query.overlaps("tags", campaign.target_tags);
    }

    const { data: contacts, error: contactErr } = await query;

    if (contactErr || !contacts || contacts.length === 0) {
      return NextResponse.json({ error: "No matching contacts found" }, { status: 404 });
    }

    // 4. Check which contacts already received this campaign
    const { data: existingLogs } = await supabase
      .from("b2b_email_log")
      .select("contact_id")
      .eq("campaign_id", campaign_id);

    const alreadySent = new Set((existingLogs || []).map(l => l.contact_id));
    const toSend = contacts.filter(c => !alreadySent.has(c.id));

    if (toSend.length === 0) {
      return NextResponse.json({ error: "All contacts already emailed in this campaign" }, { status: 400 });
    }

    const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
    if (!MAILGUN_API_KEY) {
      return NextResponse.json({ error: "MAILGUN_API_KEY not configured" }, { status: 500 });
    }

    const signature = SIGNATURES[senderEmail] || "";
    let sent = 0;
    let failed = 0;

    // Download attachments from storage once (reuse for all contacts)
    const attachmentBuffers: { name: string; buffer: Buffer; type: string }[] = [];
    const campaignAttachments = (campaign.attachments || []) as { name: string; path: string }[];
    for (const att of campaignAttachments) {
      try {
        const { data, error } = await supabase.storage
          .from("email-attachments")
          .download(att.path);
        if (data && !error) {
          const buffer = Buffer.from(await data.arrayBuffer());
          attachmentBuffers.push({ name: att.name, buffer, type: data.type || "application/octet-stream" });
        }
      } catch { console.error("Failed to download attachment:", att.path); }
    }

    // 5. Send emails with delay
    for (const contact of toSend) {
      const toEmail = contact.contact_email || contact.general_email;
      if (!toEmail) { failed++; continue; }

      const filledSubject = replaceVars(campaign.email_subject, contact);
      const filledBody = markdownToHtml(replaceVars(campaign.email_body, contact));
      const fullHtml = `<div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:14px;color:#0F172A;line-height:1.6;">${filledBody}${signature}</div>`;

      const emailLogId = crypto.randomUUID();
      const toName = contact.contact_person || contact.organization_name;

      const form = new FormData();
      form.append("from", `${account.display_name} <${account.email}>`);
      form.append("to", toName ? `${toName} <${toEmail}>` : toEmail);
      form.append("subject", filledSubject);
      form.append("html", fullHtml);
      form.append("h:Reply-To", `${account.display_name} <${account.email}>`);
      form.append("o:tracking-opens", "yes");
      form.append("o:tracking-clicks", "htmlonly");
      form.append("o:tag", `campaign-${campaign_id}`);
      form.append("v:email_log_id", emailLogId);
      form.append("v:contact_id", contact.id);

      // Add attachments
      for (const att of attachmentBuffers) {
        form.append("attachment", new Blob([new Uint8Array(att.buffer)], { type: att.type }), att.name);
      }

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

        if (res.ok) {
          sent++;
          // Log email
          await supabase.from("b2b_email_log").insert({
            id: emailLogId,
            contact_id: contact.id,
            campaign_id: campaign_id,
            account_id: account.id,
            direction: "outbound",
            from_email: account.email,
            from_name: account.display_name,
            to_email: toEmail,
            to_name: toName,
            subject: filledSubject,
            body_html: fullHtml,
            status: "sent",
            sent_at: new Date().toISOString(),
          });
        } else {
          failed++;
        }
      } catch {
        failed++;
      }

      // Rate limit: 200ms between emails
      await new Promise(r => setTimeout(r, 200));
    }

    // 6. Update campaign totals
    await supabase
      .from("b2b_campaigns")
      .update({
        status: "active",
        started_at: campaign.started_at || new Date().toISOString(),
        total_sent: (campaign.total_sent || 0) + sent,
        total_contacts: contacts.length,
      })
      .eq("id", campaign_id);

    return NextResponse.json({
      sent,
      failed,
      skipped: alreadySent.size,
      total: toSend.length,
    });
  } catch (err) {
    console.error("[Campaign Bulk Send]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
