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

export async function POST(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const { contactId } = await req.json();

    if (!contactId) {
      return NextResponse.json({ error: "contactId required" }, { status: 400 });
    }

    const { data: contact, error: fetchError } = await supabase
      .from("b2b_contacts")
      .select("*")
      .eq("id", contactId)
      .single();

    if (fetchError || !contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    // Fetch website content
    let websiteContent = "";
    if (contact.website) {
      try {
        const url = contact.website.startsWith("http")
          ? contact.website
          : `https://${contact.website}`;
        const res = await fetch(url, {
          headers: { "User-Agent": "PayWatch Research Bot/1.0" },
          signal: AbortSignal.timeout(8000),
        });
        if (res.ok) {
          const html = await res.text();
          websiteContent = html
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 4000);
        }
      } catch {
        // Website fetch failed
      }
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });

    // Build type-specific research angle
    const typeAngles: Record<string, string> = {
      incasso:
        "They are a debt collection agency. Research what types of debts they collect, their client base, and how a consumer bill tracking app could help debtors pay earlier (reducing collection costs for this agency).",
      aid_org:
        "They are a social aid organization (schuldhulpverlening). Research what services they offer, who their clients are, and how a consumer bill tracking app could help their clients gain financial oversight and avoid debt escalation.",
      gemeente:
        "They are a Dutch municipality. Research their social services, any vroegsignalering (early warning) programs they run, and how a consumer bill tracking app could support their debt prevention efforts.",
      bewindvoerder:
        "They are a financial guardianship firm (bewindvoering). Research what populations they serve, how many clients they manage, and how a consumer bill tracking app could give them better oversight of their clients' bills.",
      kredietbank:
        "They are a municipal credit bank. Research their loan products, debt restructuring services, and how a consumer bill tracking app could serve as an early intervention tool for their clients.",
      journalist:
        `They are a media outlet. The contact is a journalist${contact.beat ? ` covering ${contact.beat}` : ""}. Research what topics they typically cover, their audience, and what angle would make PayWatch (Dutch fintech solving debt escalation through AI bill scanning) a compelling story for them.`,
    };

    const typeAngle = typeAngles[contact.type] || "Research what this organization does and how a consumer financial tracking app could be relevant to them.";

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      system: `You are a thorough B2B research analyst preparing intelligence for outreach to Dutch organizations. Your research must be SPECIFIC to this exact organization, not generic. Write in English. Never use dashes or bullet points. Write in flowing paragraphs.`,
      messages: [
        {
          role: "user",
          content: `Deep research this organization for our sales team at PayWatch (a Dutch consumer bill tracking PWA that scans Gmail/Outlook, tracks debt escalation stages from factuur to deurwaarder, and uses AI to extract bill data).

ORGANIZATION: ${contact.organization_name}
TYPE: ${contact.type}
CITY: ${contact.city || "Netherlands"}
WEBSITE: ${contact.website || "None provided"}
CONTACT PERSON: ${contact.contact_person || "Unknown"}
CONTACT ROLE: ${contact.contact_role || "Unknown"}
${contact.beat ? `JOURNALIST BEAT: ${contact.beat}` : ""}

${typeAngle}

${websiteContent ? `WEBSITE CONTENT:\n${websiteContent}` : "No website content available. Research based on the organization name and type."}

Write a research brief (200 words max) covering:
1. What exactly this organization does (be specific, not generic)
2. Who their end users or clients are
3. What specific needs or pain points PayWatch could address for them
4. The contact person's likely priorities given their role
5. One concrete angle for the outreach email

Be factual. If website content is limited, say so rather than making things up.`,
        },
      ],
    });

    const summary =
      message.content[0].type === "text" ? message.content[0].text : "";

    const { error: updateError } = await supabase
      .from("b2b_contacts")
      .update({
        ai_research_summary: summary,
        ai_researched_at: new Date().toISOString(),
        status: contact.status === "new" ? "researched" : contact.status,
      })
      .eq("id", contactId);

    if (updateError) {
      console.error("[Research Update]", updateError);
      return NextResponse.json({ error: "Failed to save research" }, { status: 500 });
    }

    return NextResponse.json({ summary });
  } catch (err) {
    console.error("[Outreach Research]", err);
    return NextResponse.json({ error: "Research failed" }, { status: 500 });
  }
}
