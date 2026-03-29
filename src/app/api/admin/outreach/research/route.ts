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
      return NextResponse.json(
        { error: "contactId required" },
        { status: 400 }
      );
    }

    // Fetch contact
    const { data: contact, error: fetchError } = await supabase
      .from("b2b_contacts")
      .select("*")
      .eq("id", contactId)
      .single();

    if (fetchError || !contact) {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      );
    }

    // Fetch website content if available
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
          // Strip HTML to plain text (basic)
          websiteContent = html
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 3000);
        }
      } catch {
        // Website fetch failed, proceed without it
      }
    }

    // Call Claude Haiku for research
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      system:
        "You are a business researcher. Given a Dutch organization, provide a concise research summary (max 150 words) that a B2B salesperson can use. Focus on: what they do, their size/reach, key services, and how a bill-tracking app (PayWatch) could help their clients. Write in English. Be factual and concise.",
      messages: [
        {
          role: "user",
          content: `Research this organization:
Name: ${contact.organization_name}
Type: ${contact.type}
City: ${contact.city || "Unknown"}
Website: ${contact.website || "None"}
${websiteContent ? `\nWebsite content:\n${websiteContent}` : ""}

Provide a concise research summary for our outreach team.`,
        },
      ],
    });

    const summary =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Update contact with research
    const { error: updateError } = await supabase
      .from("b2b_contacts")
      .update({
        ai_research_summary: summary,
        ai_researched_at: new Date().toISOString(),
        status:
          contact.status === "new" ? "researched" : contact.status,
      })
      .eq("id", contactId);

    if (updateError) {
      console.error("[Research Update]", updateError);
      return NextResponse.json(
        { error: "Failed to save research" },
        { status: 500 }
      );
    }

    return NextResponse.json({ summary });
  } catch (err) {
    console.error("[Outreach Research]", err);
    return NextResponse.json(
      { error: "Research failed" },
      { status: 500 }
    );
  }
}
