import { NextRequest, NextResponse } from "next/server";
import { getPalette } from "colorthief";

export const maxDuration = 15;

export async function POST(request: NextRequest) {
  try {
    const { company, audience } = await request.json();

    if (!company || typeof company !== "string" || company.length > 100) {
      return NextResponse.json({ error: "Invalid company" }, { status: 400 });
    }

    const domain = company.includes(".")
      ? company.toLowerCase().trim()
      : `${company.toLowerCase().trim()}.com`;

    const logoDevToken = process.env.LOGO_DEV_TOKEN || "pk_RLZzD1KxRrCpEywuCrIRRw";
    const logoUrl = `https://img.logo.dev/${domain}?token=${logoDevToken}&size=200&format=png`;

    /* ── Step 1: Extract brand colors via Color Thief ── */
    let colors: string[] = [];
    try {
      const imgRes = await fetch(logoUrl);
      if (imgRes.ok) {
        const buffer = Buffer.from(await imgRes.arrayBuffer());
        const palette = await getPalette(buffer, { colorCount: 6 });
        if (palette) {
          colors = palette.map((c: { hex: () => string }) => c.hex());
        }
      }
    } catch (e) {
      console.error("[Personalize] Color extraction:", e);
    }

    const primaryColor = colors[0] || "#0A2540";
    const secondaryColor = colors[1] || "#2563EB";

    /* ── Step 2: Claude Haiku greeting ── */
    let greeting = "PayWatch helpt uw organisatie met grip op financiele processen.";
    let tagline = "Samen voor financieel overzicht";
    let companyName =
      domain.split(".")[0].charAt(0).toUpperCase() + domain.split(".")[0].slice(1);

    const audiencePrompts: Record<string, string> = {
      gemeente:
        "PayWatch is een AI-tool die huishoudens helpt grip te houden op hun rekeningen en escalatiefases (factuur, herinnering, aanmaning, incasso, deurwaarder) te herkennen. Schrijf tekst gericht aan een GEMEENTE over samenwerking voor schuldhulpverlening en vroegsignalering. Hoe PayWatch hun inwoners kan helpen schulden te voorkomen.",
      incasso:
        "PayWatch is een AI-tool die consumenten helpt rekeningen op tijd te betalen en escalatiefases inzichtelijk maakt. Schrijf tekst gericht aan een INCASSOBUREAU over hoe PayWatch voorkomt dat rekeningen onnodig bij incasso terechtkomen. Minder wanbetalers, betere betalingsmoraal.",
      hulporg:
        "PayWatch is een AI-tool voor financieel overzicht. Schrijf tekst gericht aan een HULPORGANISATIE (schuldhulpverlening, maatschappelijk werk, kredietbank) over samenwerking om clienten digitaal te ondersteunen bij het bijhouden van rekeningen en het voorkomen van verdere escalatie.",
    };

    const audienceType = audience || "gemeente";
    const systemPrompt = audiencePrompts[audienceType] || audiencePrompts.gemeente;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey) {
      try {
        const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 200,
            system: `${systemPrompt}\n\nRespond ONLY with valid JSON. No markdown, no backticks, no explanation.\nFormat: {"companyName":"Officiele naam","greeting":"2-3 zinnen in het Nederlands, warm en professioneel","tagline":"max 5 woorden Nederlands"}`,
            messages: [{ role: "user", content: `Company domain: ${domain}` }],
          }),
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const text = aiData.content?.[0]?.text || "";
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            companyName = parsed.companyName || companyName;
            greeting = parsed.greeting || greeting;
            tagline = parsed.tagline || tagline;
          }
        }
      } catch (e) {
        console.error("[Personalize] Haiku:", e);
      }
    }

    return NextResponse.json({
      companyName,
      domain,
      primaryColor,
      secondaryColor,
      allColors: colors,
      greeting,
      tagline,
      logo: logoUrl,
      audience: audienceType,
    });
  } catch (error) {
    console.error("[Personalize]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
