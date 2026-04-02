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
        "Dit is een incassobureau. Onderzoek welke soorten schulden ze innen, hun klantenbasis, en hoe een consumer bill tracking app debiteuren kan helpen eerder te betalen (waardoor incassokosten voor dit bureau dalen).",
      aid_org:
        "Dit is een sociale hulporganisatie (schuldhulpverlening). Onderzoek welke diensten ze aanbieden, wie hun cliënten zijn, en hoe een consumer bill tracking app hun cliënten kan helpen financieel overzicht te krijgen en schuldeskalatie te voorkomen.",
      gemeente:
        "Dit is een Nederlandse gemeente. Onderzoek hun sociale diensten, eventuele vroegsignaleringsprogramma's, en hoe een consumer bill tracking app hun schuldpreventie-inspanningen kan ondersteunen.",
      bewindvoerder:
        "Dit is een bewindvoeringskantoor. Onderzoek welke doelgroepen ze bedienen, hoeveel cliënten ze beheren, en hoe een consumer bill tracking app hen beter overzicht kan geven over de rekeningen van hun cliënten.",
      kredietbank:
        "Dit is een gemeentelijke kredietbank. Onderzoek hun leenproducten, schuldsaneringsdiensten, en hoe een consumer bill tracking app als vroege interventietool voor hun cliënten kan dienen.",
      journalist:
        `Dit is een media-organisatie. Het contact is een journalist${contact.beat ? ` die schrijft over ${contact.beat}` : ""}. Onderzoek welke onderwerpen ze doorgaans behandelen, hun publiek, en welke invalshoek PayWatch (Nederlandse fintech die schuldeskalatie oplost via AI-billscanning) een aantrekkelijk verhaal voor hen zou maken.`,
    };

    const typeAngle = typeAngles[contact.type] || "Onderzoek wat deze organisatie doet en hoe een consumer financial tracking app relevant voor hen kan zijn.";

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      system: `Je bent een B2B research analist die intelligence voorbereidt voor outreach naar Nederlandse organisaties. Je onderzoek moet SPECIFIEK zijn over deze exacte organisatie, niet generiek. Schrijf in het Nederlands. Gebruik geen streepjes of opsommingstekens. Schrijf in vloeiende alinea's. Structureer je output met korte kopjes in vetgedrukt (**Kopje**) gevolgd door een alinea.`,
      messages: [
        {
          role: "user",
          content: `Doe diepgaand onderzoek naar deze organisatie voor ons salesteam bij PayWatch (een Nederlandse consumer fintech PWA die Gmail/Outlook scant, schuldeskalatie-fases volgt van factuur tot deurwaarder, en AI gebruikt om rekeningen te herkennen).

ORGANISATIE: ${contact.organization_name}
TYPE: ${contact.type}
STAD: ${contact.city || "Nederland"}
WEBSITE: ${contact.website || "Niet opgegeven"}
CONTACTPERSOON: ${contact.contact_person || "Onbekend"}
ROL: ${contact.contact_role || "Onbekend"}
${contact.beat ? `JOURNALIST BEAT: ${contact.beat}` : ""}

${typeAngle}

${websiteContent ? `WEBSITE INHOUD:\n${websiteContent}` : "Geen website-inhoud beschikbaar. Onderzoek op basis van de organisatienaam en type."}

Schrijf een beknopt onderzoeksrapport (max 200 woorden) met deze structuur:

**Organisatie** — Wat doet deze organisatie precies? Wees specifiek.

**Doelgroep** — Wie zijn hun eindgebruikers of klanten?

**PayWatch-kans** — Welke specifieke behoeften of pijnpunten kan PayWatch voor hen adresseren?

**Contactpersoon** — Wat zijn waarschijnlijk de prioriteiten van deze persoon gezien hun rol?

**Outreach-hoek** — Eén concrete invalshoek voor de outreach e-mail.

Wees feitelijk. Als de website-inhoud beperkt is, zeg dat dan eerlijk.`,
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
