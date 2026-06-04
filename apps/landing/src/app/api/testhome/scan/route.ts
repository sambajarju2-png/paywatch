import { NextRequest, NextResponse } from "next/server";
import { checkPublicRateLimit, checkGlobalDailyCap } from "@/lib/rate-limit";

/**
 * POST /api/testhome/scan
 *
 * Public, unauthenticated bill-scan demo for paywatch.app/testhome.
 * Accepts an image (multipart/form-data, field "file"), reads it with
 * Mistral Small 3.2 Vision via Scaleway EU, returns extracted fields.
 *
 * The SCW_SECRET_KEY never leaves the server. The image is held in memory
 * for the single API call and discarded, never stored.
 *
 * Abuse protection (a public endpoint that spends money needs all three):
 *  1. Global daily ceiling across all IPs  -> bounds worst-case spend.
 *  2. Per-IP daily cap                      -> stops one connection farming it.
 *  3. Honeypot + timing                     -> blocks naive bots.
 * The "2 free then sign up" browser gate lives client-side; this is the backstop.
 */

const SCALEWAY_API_URL = "https://api.scaleway.ai/v1/chat/completions";
const VISION_MODEL = "mistral-small-3.2-24b-instruct-2506";

const NO_CACHE = { "Cache-Control": "no-store" };

// Tunable limits
const GLOBAL_MAX_PER_DAY = 800; // hard ceiling on total scans / 24h
const PER_IP_MAX_PER_DAY = 6; // a touch above the 2 browser gate for shared IPs
const WINDOW_MIN = 1440; // 24h
const MAX_BYTES = 6 * 1024 * 1024; // 6 MB
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];

const EXTRACTION_PROMPT = `Je bent een document-analist die Nederlandse huishoudens helpt hun post te begrijpen. Analyseer deze foto of scan van een rekening of brief grondig.

REGELS:
- Schrijf "explanation" alsof je het rustig uitlegt aan iemand die de brief niet goed begrijpt. Wees duidelijk en menselijk, maximaal 3 zinnen.
- Leg uit WIE het stuurt, WAAROM, en WAT er verwacht wordt.
- Als er dreigend taalgebruik in staat (aanmaning, incasso, deurwaarder), benoem dat expliciet.
- Geen Markdown, geen opsommingstekens.

Antwoord ALLEEN in dit JSON-formaat:
{
  "is_bill": true of false,
  "vendor": "afzender of null",
  "amount_cents": geheel getal in centen of null,
  "due_date": "YYYY-MM-DD of null",
  "escalation_stage": "factuur/herinnering/aanmaning/incasso/deurwaarder of null",
  "reference": "betalingskenmerk of null",
  "explanation": "Uitleg in begrijpelijk Nederlands, max 3 zinnen",
  "summary": "De kern van het document in 1 korte zin"
}`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.SCW_SECRET_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "config", message: "Scanner is nog niet geconfigureerd." },
      { status: 500, headers: NO_CACHE }
    );
  }

  // Layer 1: global daily ceiling (check before recording the per-IP row)
  const globalLimited = await checkGlobalDailyCap("testhome-scan", GLOBAL_MAX_PER_DAY, WINDOW_MIN);
  if (globalLimited) return globalLimited;

  // Parse the upload
  let file: File | null = null;
  let website = ""; // honeypot
  let ts = 0; // timing token
  try {
    const form = await req.formData();
    file = form.get("file") as File | null;
    website = String(form.get("website") || "");
    ts = Number(form.get("_t") || 0);
  } catch {
    return NextResponse.json(
      { error: "bad_request", message: "Kon het bestand niet lezen." },
      { status: 400, headers: NO_CACHE }
    );
  }

  // Layer 3: honeypot + timing. Pretend success so bots get no signal.
  if (website) {
    return NextResponse.json({ is_bill: false, blocked: true }, { headers: NO_CACHE });
  }
  if (ts && Date.now() - ts < 1500) {
    return NextResponse.json({ is_bill: false, blocked: true }, { headers: NO_CACHE });
  }

  if (!file) {
    return NextResponse.json(
      { error: "no_file", message: "Geen bestand ontvangen." },
      { status: 400, headers: NO_CACHE }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "too_large", message: "De afbeelding is te groot. Probeer een kleinere foto (max 6 MB)." },
      { status: 413, headers: NO_CACHE }
    );
  }
  const mimeType = file.type || "image/jpeg";
  if (!ALLOWED_MIME.includes(mimeType)) {
    return NextResponse.json(
      { error: "bad_type", message: "Gebruik een foto in JPG, PNG of WEBP." },
      { status: 415, headers: NO_CACHE }
    );
  }

  // Layer 2: per-IP daily cap (also records this request in public_rate_limits)
  const ipLimited = await checkPublicRateLimit("testhome-scan", PER_IP_MAX_PER_DAY, WINDOW_MIN);
  if (ipLimited) {
    return NextResponse.json(
      {
        error: "rate_limited",
        message: "Je hebt het maximum aantal gratis scans bereikt. Maak een gratis account om door te gaan.",
      },
      { status: 429, headers: NO_CACHE }
    );
  }

  // Vision call (image is discarded after this; never stored)
  try {
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const response = await fetch(SCALEWAY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: VISION_MODEL,
        messages: [
          {
            role: "user",
            content: [
              { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64}` } },
              { type: "text", text: EXTRACTION_PROMPT },
            ],
          },
        ],
        // No response_format json_object: vision + JSON mode can conflict.
        temperature: 0.1,
        max_tokens: 400,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[testhome/scan] Mistral error:", response.status, errText);
      return NextResponse.json(
        { error: "vision_error", message: "Ik kon de foto niet lezen. Probeer een duidelijkere foto." },
        { headers: NO_CACHE }
      );
    }

    const data = await response.json();
    const choice = data.choices?.[0];
    if (!choice || choice.finish_reason === "content_filter") {
      return NextResponse.json(
        { error: "blocked_image", message: "Deze foto kon niet worden verwerkt. Probeer een andere." },
        { headers: NO_CACHE }
      );
    }

    const content: string = choice.message?.content || "";
    const parsed = parseLenient(content);

    return NextResponse.json(
      {
        is_bill: Boolean(parsed.is_bill),
        vendor: parsed.vendor ?? null,
        amount_cents: typeof parsed.amount_cents === "number" ? parsed.amount_cents : null,
        due_date: parsed.due_date ?? null,
        escalation_stage: parsed.escalation_stage ?? null,
        reference: parsed.reference ?? null,
        explanation: parsed.explanation ?? null,
        summary: parsed.summary ?? null,
      },
      { headers: NO_CACHE }
    );
  } catch (err) {
    console.error("[testhome/scan] error:", err);
    return NextResponse.json(
      { error: "internal", message: "Er ging iets mis bij het scannen. Probeer het opnieuw." },
      { headers: NO_CACHE }
    );
  }
}

/** Lenient JSON extraction from a possibly-fenced / partial model response. */
function parseLenient(text: string): Record<string, unknown> {
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7);
  else if (cleaned.startsWith("```")) cleaned = cleaned.slice(3);
  if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);
  cleaned = cleaned.trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    const slice = cleaned.slice(start, end + 1);
    try {
      return JSON.parse(slice);
    } catch {
      try {
        return JSON.parse(slice.replace(/,\s*([}\]])/g, "$1").replace(/'/g, '"'));
      } catch {
        /* fall through */
      }
    }
  }
  return {};
}
