import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// GET: Return enrichment stats
export async function GET() {
  const { data: stats } = await supabase
    .from("b2b_contacts")
    .select("id, website, notes")
    .eq("type", "incasso");

  if (!stats) return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });

  const total = stats.length;
  const enriched = stats.filter((c) => c.website).length;
  const nvi = stats.filter((c) => c.notes === "NVI keurmerk").length;
  const nviEnriched = stats.filter((c) => c.notes === "NVI keurmerk" && c.website).length;

  return NextResponse.json({ total, enriched, unenriched: total - enriched, nvi, nviEnriched });
}

// POST: Enrich ONE contact at a time (frontend loops, not backend)
export async function POST(req: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  const typeFilter = body.type || "incasso";

  // Fetch ONE unenriched contact (NVI first)
  const { data: contacts, error } = await supabase
    .from("b2b_contacts")
    .select("id, organization_name, kvk_number, notes, type")
    .eq("type", typeFilter)
    .is("website", null)
    .order("notes", { ascending: false })
    .order("organization_name")
    .limit(1);

  if (error || !contacts?.length) {
    const { count: remaining } = await supabase
      .from("b2b_contacts")
      .select("id", { count: "exact", head: true })
      .eq("type", typeFilter)
      .is("website", null);

    return NextResponse.json({
      message: remaining === 0 ? "All contacts enriched!" : "Error fetching contacts",
      remaining: remaining || 0,
      result: null,
    });
  }

  const contact = contacts[0];

  try {
    const searchResult = await enrichWithClaude(contact.organization_name, contact.kvk_number);

    if (!searchResult || (!searchResult.website && !searchResult.linkedin_url && !searchResult.city)) {
      // Count remaining
      const { count: remaining } = await supabase
        .from("b2b_contacts")
        .select("id", { count: "exact", head: true })
        .eq("type", typeFilter)
        .is("website", null);

      // Mark as searched but not found — set website to empty string so we don't retry
      await supabase
        .from("b2b_contacts")
        .update({ website: "" })
        .eq("id", contact.id);

      return NextResponse.json({
        remaining: (remaining || 1) - 1,
        result: { id: contact.id, name: contact.organization_name, website: null, linkedin_url: null, city: null, status: "skipped" },
      });
    }

    // Update Supabase
    const updateData: Record<string, string> = {};
    if (searchResult.website) updateData.website = searchResult.website;
    if (searchResult.linkedin_url) updateData.linkedin_url = searchResult.linkedin_url;
    if (searchResult.city) updateData.city = searchResult.city;

    if (Object.keys(updateData).length > 0) {
      await supabase
        .from("b2b_contacts")
        .update(updateData)
        .eq("id", contact.id);
    }

    const { count: remaining } = await supabase
      .from("b2b_contacts")
      .select("id", { count: "exact", head: true })
      .eq("type", typeFilter)
      .is("website", null);

    return NextResponse.json({
      remaining: remaining || 0,
      result: {
        id: contact.id,
        name: contact.organization_name,
        ...searchResult,
        status: "enriched",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";

    // If rate limited, tell frontend to wait
    const isRateLimit = msg.includes("429") || msg.includes("rate_limit");

    return NextResponse.json({
      remaining: -1, // signals "don't know"
      result: {
        id: contact.id,
        name: contact.organization_name,
        website: null,
        linkedin_url: null,
        city: null,
        status: "error",
        error: msg,
      },
      retryAfter: isRateLimit ? 30 : 5, // seconds to wait before retrying
    });
  }
}

// Call Claude API with retry on 429
async function enrichWithClaude(
  companyName: string,
  justisNumber: string | null,
  attempt = 1
): Promise<{ website: string | null; linkedin_url: string | null; city: string | null } | null> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      system: `You research Dutch companies. Search for the given company and return ONLY a JSON object:
{"website": "full URL or null", "linkedin_url": "full LinkedIn company page URL or null", "city": "Dutch city or null"}
Only include verified URLs from search. No markdown, no explanation, ONLY the JSON.`,
      messages: [
        {
          role: "user",
          content: `Find website, LinkedIn company page, and city for: "${companyName}" (Dutch incasso company${justisNumber ? `, Justis nr: ${justisNumber}` : ""})`,
        },
      ],
      tools: [{ type: "web_search_20250305", name: "web_search" }],
    }),
  });

  // Handle rate limit with retry
  if (res.status === 429 && attempt < 3) {
    const retryAfter = parseInt(res.headers.get("retry-after") || "15", 10);
    console.log(`[enrich] Rate limited, waiting ${retryAfter}s (attempt ${attempt}/3)`);
    await new Promise((r) => setTimeout(r, retryAfter * 1000));
    return enrichWithClaude(companyName, justisNumber, attempt + 1);
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Claude API ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = await res.json();

  const text = data.content
    ?.filter((b: { type: string }) => b.type === "text")
    ?.map((b: { text: string }) => b.text)
    ?.join("\n") || "";

  const clean = text.replace(/```json\s*/g, "").replace(/```/g, "").trim();
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  if (start === -1 || end === -1) return null;

  try {
    const parsed = JSON.parse(clean.slice(start, end + 1));
    return {
      website: parsed.website || null,
      linkedin_url: parsed.linkedin_url || null,
      city: parsed.city || null,
    };
  } catch {
    return null;
  }
}
