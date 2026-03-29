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

// Derive sign-off name from sender email
function getSenderSignOff(email: string): string {
  const local = email.split("@")[0].toLowerCase();
  if (local === "mariama" || local === "sesay") return "Mariama Sesay";
  return "Samba Jarju";
}

const EMAIL_SYSTEM_PROMPT = `Rol: Je bent een Senior Copywriter en Communicatiestrateeg met een specialisatie in gedragspsychologie. Jouw doel is om koude outreach te transformeren naar warme, menselijke connecties voor PayWatch. Je schrijft geen e-mails; je start betekenisvolle gesprekken over financiële rust.

De Essentie van PayWatch (De "Waarom"):
PayWatch is een baken van rust in een wereld van digitale chaos. Wij helpen particuliere huishoudens (consumenten) om weer regie te krijgen over hun facturen. Cruciaal: onze gebruikers zijn géén bedrijven. Het zijn vaders, moeders en alleenstaanden die het overzicht kwijt zijn geraakt. Resultaat: door overzicht te geven aan de consument, lossen we indirect de problemen op van de organisaties die jij mailt (minder schulden, snellere betalingen, minder escalatie).

Gouden Regels voor Natuurlijke Flow (STRICT):
1. Verboden Interpunctie: Gebruik NOOIT opsommingstekens, streepjes (-) of gedachtestreepjes (—). Dit is de snelste manier om als AI herkend te worden. Gebruik volledige, vloeiende zinnen.
2. De "Anti-AI" Woordenlijst: Gebruik nooit: optimaliseren, naadloos, innovatief, revolutionair, transformeren, ontdekken, helpen bij, passie, essentieel, faciliteren, synergie, Gmail, Outlook, scanner, AI, PWA, B.V., N.V.
3. Spreektaal-ritme: Varieer in zinslengte. Een korte zin geeft kracht. Een langere zin geeft context. Gebruik af en toe een voegwoord aan het begin van een zin (zoals "Want" of "Maar") om de tekst te laten 'ademen'.
4. Geen Formele Fluff: Vermijd clichés zoals "Ik hoop dat deze mail u in goede gezondheid aantreft" of "Ik neem contact op omdat...". Val met de deur in huis op een elegante manier.
5. De "U"-vorm: Gebruik "U" en "Uw" altijd met respect, maar houd de rest van de zin toegankelijk (geen archaïsch Nederlands). Uitzondering: Journalisten spreek je aan met 'je/jou'.
6. Maximaal 120 woorden stap 1, 80 woorden vervolgmails. Geen afbeeldingen, maximaal 1 link.

Specifieke Invalshoeken per Doelgroep:
INCASSO: Focus op de psychologie van de debiteur. "Mensen betalen sneller als ze zich niet overvallen voelen." Leg uit dat PayWatch de consument (uw debiteur) overzicht geeft, waardoor de drempel om te betalen lager wordt. Dit verhoogt de recovery zonder agressieve methodes.
HULPORGANISATIE (aid_org): Focus op de 'menselijke maat' en preventie. "Cliënten die zelf weer in de spiegel durven kijken omdat ze weten waar ze aan toe zijn." PayWatch is een verlengstuk van hun zorg, geen vervanging.
GEMEENTE: Focus op de maatschappelijke plicht en de Wet Vroegsignalering. "Het voorkomen van een traject is goedkoper en humaner dan het genezen ervan." Praat over impact in de wijk.
BEWINDVOERDER: Focus op efficiëntie door zelfredzaamheid. "Minder paniektelefoontjes van cliënten omdat zij zelf ook het overzicht hebben in de app."
KREDIETBANK: Focus op vroeg ingrijpen. Minder aanmeldingen voor schuldsanering als consumenten eerder overzicht krijgen.
JOURNALIST: Schrijf als een vakgenoot die een 'primeur' of een frisse hoek deelt. De insteek is de "stille schuldencrisis" en hoe Nederlandse tech dit eindelijk menselijk maakt. Toon is informeel (je/jij). Pas de invalshoek aan op hun beat.

Stappenplan voor de Output:
1. Onderwerp: Maximaal 5 tot 7 woorden. Moet lijken op een interne mail (bijv: "Vraagje over de vroegsignalering in [Stad]").
2. De Hook: Gebruik de RESEARCH data om direct te laten zien dat je weet wie ze zijn. Geen algemeenheden.
3. De Brug: Verbind hun probleem (bijv. hoge werkdruk, oplopende schulden in de wijk) met de oplossing die PayWatch biedt aan de consument.
4. Call to Action: Altijd een vraag die met "Ja" of een kort antwoord beantwoord kan worden. Geen verzoek om een "demo van 30 minuten".
5. Afsluiting: Altijd "Groetjes," gevolgd door de AFZENDER naam, dan op een nieuwe regel "PayWatch, Rotterdam".

Eindcontrole: Scan de tekst. Zitten er streepjes in? Verwijder ze. Klinkt het als een template? Schrijf het om. Is de focus op de consument als eindgebruiker duidelijk? Zo ja, genereer de JSON.

ANTWOORD ALLEEN JSON: {"subject":"...","body_html":"<p>...</p>","body_text":"..."}`;

// POST — Generate emails for a campaign
export async function POST(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const { campaignId } = await req.json();

    if (!campaignId) {
      return NextResponse.json(
        { error: "campaignId required" },
        { status: 400 }
      );
    }

    // Fetch campaign
    const { data: campaign, error: campError } = await supabase
      .from("b2b_campaigns")
      .select("*")
      .eq("id", campaignId)
      .single();

    if (campError || !campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    // Fetch matching contacts
    let contactQuery = supabase
      .from("b2b_contacts")
      .select("*")
      .not("status", "eq", "bounced")
      .not("contact_email", "is", null);

    if (campaign.target_type) {
      contactQuery = contactQuery.eq("type", campaign.target_type);
    }

    if (campaign.target_tags && campaign.target_tags.length > 0) {
      contactQuery = contactQuery.overlaps("tags", campaign.target_tags);
    }

    const { data: contacts, error: contactError } = await contactQuery;

    if (contactError || !contacts || contacts.length === 0) {
      return NextResponse.json(
        { error: "No matching contacts found" },
        { status: 404 }
      );
    }

    // Check existing emails for this campaign
    const { data: existingLogs } = await supabase
      .from("b2b_email_log")
      .select("contact_id, sequence_step")
      .eq("campaign_id", campaignId);

    const existingSet = new Set(
      (existingLogs || []).map(
        (l) => `${l.contact_id}-${l.sequence_step}`
      )
    );

    // Resolve sending accounts (multi-sender)
    const fromAccountEmails =
      campaign.from_accounts && campaign.from_accounts.length > 0
        ? campaign.from_accounts
        : [campaign.from_email];

    const { data: sendingAccounts } = await supabase
      .from("b2b_sending_accounts")
      .select("*")
      .in("email", fromAccountEmails)
      .eq("is_active", true);

    if (!sendingAccounts || sendingAccounts.length === 0) {
      return NextResponse.json(
        { error: "No active sending accounts found" },
        { status: 400 }
      );
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });

    const steps = campaign.sequence_steps || [{ day: 0, type: "initial" }];
    let generated = 0;
    let skipped = 0;
    let errors = 0;
    let accountIdx = 0;

    for (const contact of contacts) {
      for (let stepIdx = 0; stepIdx < steps.length; stepIdx++) {
        const step = steps[stepIdx];
        const stepNum = stepIdx + 1;
        const key = `${contact.id}-${stepNum}`;

        if (existingSet.has(key)) {
          skipped++;
          continue;
        }

        // Round-robin account
        const account =
          sendingAccounts[accountIdx % sendingAccounts.length];
        accountIdx++;

        const fromEmail = account.email;
        const fromName = account.display_name;
        const signOffName = getSenderSignOff(fromEmail);

        try {
          const beatContext =
            contact.type === "journalist" && contact.beat
              ? `\nBEAT: ${contact.beat}. Pas de invalshoek aan op deze beat.`
              : "";

          const message = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 600,
            system: EMAIL_SYSTEM_PROMPT,
            messages: [
              {
                role: "user",
                content: `ORGANISATIE: ${contact.organization_name} (${contact.type}) in ${contact.city || "Nederland"}
CONTACT: ${contact.contact_person || "Team"}, ${contact.contact_role || ""}
RESEARCH: ${contact.ai_research_summary || "Geen research beschikbaar. Schrijf op basis van het organisatietype."}${beatContext}
CAMPAGNE INSTRUCTIE: ${campaign.campaign_brief}
TOON: ${campaign.tone?.replace(/_/g, " ") || "professional warm"}
TAAL: ${campaign.language === "en" ? "Engels" : "Nederlands"}
STAP: ${stepNum} van ${steps.length} (${step.type})
${stepNum > 1 ? "Dit is een vervolg. Wees korter, verwijs naar de vorige mail." : ""}
AFZENDER: ${signOffName}

Genereer de email. Alleen JSON.`,
              },
            ],
          });

          const responseText =
            message.content[0].type === "text"
              ? message.content[0].text
              : "";

          let emailData: {
            subject: string;
            body_html: string;
            body_text: string;
          };

          try {
            emailData = JSON.parse(responseText);
          } catch {
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              emailData = JSON.parse(jsonMatch[0]);
            } else {
              throw new Error("Could not parse JSON from response");
            }
          }

          // Schedule send time
          const scheduledFor = new Date();
          scheduledFor.setDate(scheduledFor.getDate() + (step.day || 0));
          scheduledFor.setUTCHours(8 + Math.floor(Math.random() * 8));
          scheduledFor.setUTCMinutes(Math.floor(Math.random() * 60));

          const { error: insertError } = await supabase
            .from("b2b_email_log")
            .insert({
              campaign_id: campaignId,
              contact_id: contact.id,
              sequence_step: stepNum,
              to_email: contact.contact_email,
              to_name: contact.contact_person || null,
              from_email: fromEmail,
              from_name: fromName,
              subject: emailData.subject,
              body_html: emailData.body_html,
              body_text: emailData.body_text || "",
              status: "queued",
              scheduled_for: scheduledFor.toISOString(),
            });

          if (insertError) {
            console.error("[Generate] Insert error:", insertError);
            errors++;
          } else {
            generated++;
          }

          await new Promise((r) => setTimeout(r, 500));
        } catch (err) {
          console.error(
            `[Generate] Error for ${contact.organization_name} step ${stepNum}:`,
            err
          );
          errors++;
        }
      }
    }

    await supabase
      .from("b2b_campaigns")
      .update({ total_contacts: contacts.length })
      .eq("id", campaignId);

    return NextResponse.json({
      generated,
      skipped,
      errors,
      contacts: contacts.length,
      steps: steps.length,
      accounts_used: sendingAccounts.length,
    });
  } catch (err) {
    console.error("[Generate]", err);
    return NextResponse.json(
      { error: "Generation failed" },
      { status: 500 }
    );
  }
}
