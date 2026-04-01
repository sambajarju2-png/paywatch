import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// GET: Return enrichment stats
export async function GET() {
  const { data, error } = await supabase.rpc("exec_sql", { query: "" }).maybeSingle();
  
  // Get stats
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

// POST: Enrich a batch of contacts
export async function POST(req: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  const batchSize = Math.min(body.batch_size || 5, 20); // max 20 per call
  const typeFilter = body.type || "incasso"; // can also enrich other types

  // Fetch unenriched contacts (NVI first)
  const { data: contacts, error } = await supabase
    .from("b2b_contacts")
    .select("id, organization_name, kvk_number, notes, type")
    .eq("type", typeFilter)
    .is("website", null)
    .order("notes", { ascending: false }) // NVI keurmerk first (alphabetically after null)
    .order("organization_name")
    .limit(batchSize);

  if (error || !contacts?.length) {
    return NextResponse.json({
      message: contacts?.length === 0 ? "All contacts enriched!" : "Error fetching contacts",
      enriched: 0,
      remaining: 0,
    });
  }

  const results: Array<{
    id: string;
    name: string;
    website: string | null;
    linkedin_url: string | null;
    city: string | null;
    status: "enriched" | "skipped" | "error";
    error?: string;
  }> = [];

  for (const contact of contacts) {
    try {
      // Call Claude API with web search
      const searchResult = await enrichWithClaude(contact.organization_name, contact.kvk_number);

      if (!searchResult || (!searchResult.website && !searchResult.linkedin_url && !searchResult.city)) {
        results.push({ id: contact.id, name: contact.organization_name, website: null, linkedin_url: null, city: null, status: "skipped" });
        continue;
      }

      // Update Supabase
      const updateData: Record<string, string> = {};
      if (searchResult.website) updateData.website = searchResult.website;
      if (searchResult.linkedin_url) updateData.linkedin_url = searchResult.linkedin_url;
      if (searchResult.city) updateData.city = searchResult.city;

      if (Object.keys(updateData).length > 0) {
        const { error: updateError } = await supabase
          .from("b2b_contacts")
          .update(updateData)
          .eq("id", contact.id);

        if (updateError) {
          results.push({ id: contact.id, name: contact.organization_name, ...searchResult, status: "error", error: updateError.message });
        } else {
          results.push({ id: contact.id, name: contact.organization_name, ...searchResult, status: "enriched" });
        }
      } else {
        results.push({ id: contact.id, name: contact.organization_name, website: null, linkedin_url: null, city: null, status: "skipped" });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      results.push({ id: contact.id, name: contact.organization_name, website: null, linkedin_url: null, city: null, status: "error", error: msg });
    }

    // Small delay between API calls to avoid rate limiting
    await new Promise((r) => setTimeout(r, 500));
  }

  // Count remaining
  const { count: remaining } = await supabase
    .from("b2b_contacts")
    .select("id", { count: "exact", head: true })
    .eq("type", typeFilter)
    .is("website", null);

  return NextResponse.json({
    enriched: results.filter((r) => r.status === "enriched").length,
    skipped: results.filter((r) => r.status === "skipped").length,
    errors: results.filter((r) => r.status === "error").length,
    remaining: remaining || 0,
    results,
  });
}

// Use Claude API with web search to find company info
async function enrichWithClaude(
  companyName: string,
  justisNumber: string | null
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
      max_tokens: 500,
      system: `You are a Dutch business research assistant. Search for the given company and return ONLY a JSON object:
{"website": "full URL or null", "linkedin_url": "full LinkedIn company page URL or null", "city": "Dutch city name or null"}
Rules:
- Only include URLs you find via search results. Use null if not found.
- linkedin_url must be a company page URL (linkedin.com/company/...), not personal profiles.
- Return ONLY the JSON, no other text, no markdown.`,
      messages: [
        {
          role: "user",
          content: `Find website, LinkedIn company page, and headquarters city for: "${companyName}" (Dutch incasso/debt collection registered company${justisNumber ? `, Justis register: ${justisNumber}` : ""})`,
        },
      ],
      tools: [{ type: "web_search_20250305", name: "web_search" }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Claude API ${res.status}: ${errText.slice(0, 100)}`);
  }

  const data = await res.json();

  // Extract text from response (skip tool_use blocks)
  const text = data.content
    ?.filter((b: { type: string }) => b.type === "text")
    ?.map((b: { text: string }) => b.text)
    ?.join("\n") || "";

  // Parse JSON from response
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
