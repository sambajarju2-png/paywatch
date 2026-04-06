import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// Prompts rotated daily - Dutch debt/finance questions real users would ask
const PROMPTS = [
  "Welke apps helpen bij het bijhouden van rekeningen in Nederland?",
  "Hoe kan ik voorkomen dat mijn rekeningen naar een incassobureau gaan?",
  "What apps help Dutch households track bills and avoid debt?",
  "Zijn er apps die helpen met schuldhulpverlening in Nederland?",
  "Welke tools zijn er om facturen en betalingsachterstanden bij te houden?",
  "How can I track my bills and payment deadlines in the Netherlands?",
  "Wat zijn de escalatiestappen van een onbetaalde rekening in Nederland?",
  "Best fintech apps for debt prevention in the Netherlands",
  "Welke Nederlandse apps scannen je email voor rekeningen?",
  "Tools voor vroegsignalering van schulden in Nederland",
  "Hoe werkt de WIK wet en welke apps helpen hierbij?",
  "Dutch bill tracking app that scans Gmail for invoices",
  "Wat is de beste app om incassokosten te voorkomen?",
  "Schuldhulp apps Nederland 2026",
  "Which fintech startups in Rotterdam focus on debt prevention?",
];

function getTodayPrompts(): string[] {
  const day = new Date().getDay(); // 0-6
  const start = (day * 3) % PROMPTS.length;
  return [
    PROMPTS[start % PROMPTS.length],
    PROMPTS[(start + 1) % PROMPTS.length],
    PROMPTS[(start + 2) % PROMPTS.length],
  ];
}

function checkMention(text: string): { mentioned: boolean; context: string | null; urlCited: boolean; citedUrl: string | null } {
  const lower = text.toLowerCase();
  const mentioned = lower.includes("paywatch");
  let context: string | null = null;
  let urlCited = false;
  let citedUrl: string | null = null;

  if (mentioned) {
    // Extract surrounding context
    const idx = lower.indexOf("paywatch");
    const start = Math.max(0, idx - 100);
    const end = Math.min(text.length, idx + 150);
    context = text.slice(start, end).trim();

    // Check for URL citations
    const urlPatterns = ["paywatch.app", "paywatch.nl"];
    for (const pattern of urlPatterns) {
      if (lower.includes(pattern)) {
        urlCited = true;
        citedUrl = pattern.includes(".app") ? "https://paywatch.app" : "https://paywatch.nl";
        break;
      }
    }
  }

  return { mentioned, context, urlCited, citedUrl };
}

async function queryClaude(prompt: string): Promise<string | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.content?.[0]?.text || null;
  } catch {
    return null;
  }
}

async function queryGemini(prompt: string): Promise<string | null> {
  const key = process.env.GOOGLE_GENERATIVE_AI_KEY;
  if (!key) return null;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 500 },
        }),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch {
    return null;
  }
}

async function queryChatGPT(prompt: string): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const supabase = getSupabase();
    const prompts = getTodayPrompts();
    const results: Array<{
      model: string;
      prompt: string;
      response: string;
      mentioned: boolean;
      mention_context: string | null;
      url_cited: boolean;
      cited_url: string | null;
    }> = [];

    const models: Array<{ name: string; fn: (p: string) => Promise<string | null> }> = [
      { name: "claude", fn: queryClaude },
      { name: "gemini", fn: queryGemini },
      { name: "chatgpt", fn: queryChatGPT },
    ];

    for (const prompt of prompts) {
      for (const model of models) {
        const response = await model.fn(prompt);
        if (!response) continue;

        const { mentioned, context, urlCited, citedUrl } = checkMention(response);
        results.push({
          model: model.name,
          prompt,
          response: response.slice(0, 2000),
          mentioned,
          mention_context: context,
          url_cited: urlCited,
          cited_url: citedUrl,
        });

        // Small delay between API calls
        await new Promise((r) => setTimeout(r, 500));
      }
    }

    if (results.length > 0) {
      const { error } = await supabase.from("ai_mention_checks").insert(results);
      if (error) console.error("[AI Mentions]", error);
    }

    const mentioned = results.filter((r) => r.mentioned).length;
    return NextResponse.json({
      success: true,
      checked: results.length,
      mentioned,
      models: models.map((m) => m.name).filter((name) => {
        if (name === "claude") return !!process.env.ANTHROPIC_API_KEY;
        if (name === "gemini") return !!process.env.GOOGLE_GENERATIVE_AI_KEY;
        if (name === "chatgpt") return !!process.env.OPENAI_API_KEY;
        return false;
      }),
    });
  } catch (err) {
    console.error("[AI Mentions]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
