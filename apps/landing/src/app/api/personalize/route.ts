import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 25;

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

    /* ── Step 1: Color Thief ── */
    let colors: string[] = [];
    try {
      const imgRes = await fetch(logoUrl);
      if (imgRes.ok) {
        const buffer = Buffer.from(await imgRes.arrayBuffer());
        const { getPalette } = await import("colorthief");
        const palette = await getPalette(buffer, { colorCount: 6 });
        if (palette) {
          colors = palette.map((c) => c.hex());
        }
      }
    } catch (e) {
      console.error("[Personalize] Color:", e);
    }

    const primaryColor = colors[0] || "#0A2540";
    const secondaryColor = colors[1] || colors[0] || "#2563EB";

    /* ── Step 2: Claude Haiku — punchy headline ── */
    let greeting = "Samen werken aan financieel overzicht";
    let tagline = "PayWatch voor partners";
    let companyName =
      domain.split(".")[0].charAt(0).toUpperCase() + domain.split(".")[0].slice(1);

    const systemBase = `Je bent een Nederlandse copywriter voor PayWatch, een app die huishoudens helpt grip te houden op hun rekeningen. PayWatch detecteert escalatiefases: factuur → herinnering → aanmaning → incasso → deurwaarder.

REGELS:
- Schrijf natuurlijk Nederlands, geen AI-taal, geen "innovatief", geen "oplossing"
- De greeting moet een KORTE KRACHTIGE HEADLINE zijn van 5-10 woorden. Voorbeelden:
  "Minder schulden in Amsterdam begint bij inzicht"
  "Samen de Rotterdamse rekening op orde"
  "Wat als uw inwoners nooit meer verrast worden?"
- De tagline is 3-5 woorden, pakkend
- Gebruik de naam van het bedrijf of de stad als het een gemeente is
- Geen aansprekingen als "Beste ambtenaren" of "Geachte medewerkers"
- Geen opsommingen, geen uitleg, alleen de headline en tagline`;

    const audienceInstructions: Record<string, string> = {
      gemeente: `Context: dit is een GEMEENTE. Focus op inwoners helpen, schulden voorkomen, vroegsignalering. Gebruik de stadsnaam in de headline als het kan.`,
      incasso: `Context: dit is een INCASSOBUREAU. Focus op preventie: als consumenten eerder betalen, zijn er minder incassozaken. PayWatch vermindert het aantal zaken dat bij incasso terechtkomt.`,
      hulporg: `Context: dit is een HULPORGANISATIE (schuldhulpverlening, maatschappelijk werk). Focus op clienten beter voorbereid laten zijn, snellere intake, digitaal overzicht.`,
      zakelijk: `Context: dit is een BEDRIJF/LEVERANCIER (energie, telecom, water, etc). Focus op: hun klanten helpen rekeningen op tijd te betalen, minder betalingsachterstanden, betere klantrelatie.`,
    };

    const audienceType = audience || "gemeente";
    const instruction = audienceInstructions[audienceType] || audienceInstructions.gemeente;

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
            max_tokens: 150,
            system: `${systemBase}\n\n${instruction}\n\nRespond ONLY with valid JSON. No markdown, no backticks.\nFormat: {"companyName":"Officiele naam","greeting":"Korte krachtige headline 5-10 woorden","tagline":"3-5 woorden pakkend"}`,
            messages: [{ role: "user", content: `Domain: ${domain}` }],
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
