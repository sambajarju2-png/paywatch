import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 55;
export const dynamic = "force-dynamic";

function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

/* ── Warmup schedule: daily limit per account based on age ── */
const WARMUP_SCHEDULE = [
  { from: 1, to: 7, limit: 3 },    // Week 1: 3/day (conservative for warmup)
  { from: 8, to: 14, limit: 5 },   // Week 2: 5/day
  { from: 15, to: 21, limit: 8 },  // Week 3: 8/day
  { from: 22, to: 28, limit: 10 }, // Week 4: 10/day
  { from: 29, to: 999, limit: 12 }, // Week 5+: 12/day
];

function getWarmupLimit(warmupDay: number): number {
  const tier = WARMUP_SCHEDULE.find((s) => warmupDay >= s.from && warmupDay <= s.to);
  return tier?.limit || 12;
}

/* ── Only send during NL business hours (9:00-17:00 CET/CEST) ── */
function isWithinSendingHours(): boolean {
  const now = new Date();
  const utcHour = now.getUTCHours();
  return utcHour >= 7 && utcHour < 16; // Covers CET (UTC+1) and CEST (UTC+2)
}

/* ── Natural warmup email templates ── */
/* These look like real internal/team communication to build sender reputation */
const WARMUP_TEMPLATES = [
  {
    subject: "Even checken: beschikbaar voor een call volgende week?",
    body: "Hoi {name},\n\nIk wil even kort afstemmen over de planning voor volgende week. Heb je ergens een halfuurtje vrij? Dinsdag of woensdag werkt voor mij het beste.\n\nLaat maar weten!\n\nGroet,\n{sender}",
  },
  {
    subject: "Artikel gedeeld: interessant voor ons",
    body: "Hey {name},\n\nIk kwam dit artikel tegen over de toekomst van fintech in Nederland. Dacht dat het je zou interesseren gezien waar we mee bezig zijn.\n\nKort samengevat: steeds meer mensen zoeken digitale tools om hun financien te beheren. Past helemaal in het plaatje.\n\nLaat me weten wat je ervan vindt!\n\nGroet,\n{sender}",
  },
  {
    subject: "Update: voortgang deze week",
    body: "Hoi {name},\n\nKorte update van mijn kant:\n\nWe hebben deze week goede stappen gezet. Er zijn een paar nieuwe features afgerond en de feedback van gebruikers is positief. Volgende week focus ik me op de afronding van het huidige sprint-doel.\n\nHeb jij nog punten die ik moet meenemen?\n\nGroet,\n{sender}",
  },
  {
    subject: "Vraag over de presentatie",
    body: "Hey {name},\n\nIk ben de slides aan het voorbereiden voor het overleg. Heb jij de laatste versie van de cijfers? Ik wil er zeker van zijn dat we met de juiste data werken.\n\nAlvast bedankt!\n\nGroet,\n{sender}",
  },
  {
    subject: "Bedankt voor gisteren",
    body: "Hoi {name},\n\nNog even bedankt voor het goede gesprek gisteren. Het was nuttig om alles door te spreken en ik denk dat we op de goede weg zitten.\n\nIk werk de actiepunten uit en stuur ze later deze week.\n\nFijne dag!\n\nGroet,\n{sender}",
  },
  {
    subject: "Planning: wanneer starten we?",
    body: "Hey {name},\n\nWanneer wil je beginnen met het nieuwe project? Ik kan vanaf volgende week starten, maar wil even afstemmen zodat we op dezelfde lijn zitten.\n\nLaat maar horen.\n\nGroet,\n{sender}",
  },
  {
    subject: "Feedback op het voorstel",
    body: "Hoi {name},\n\nIk heb het voorstel doorgelezen. Er zitten een paar goede punten in. Ik heb een paar kleine suggesties die ik later doorstuur.\n\nOverall ziet het er goed uit. Goed werk!\n\nGroet,\n{sender}",
  },
  {
    subject: "Herinnering: deadline vrijdag",
    body: "Hey {name},\n\nEven een vriendelijke herinnering dat de deadline voor het rapport vrijdag is. Lukt het om alles op tijd af te ronden? Laat me weten als je ergens tegenaan loopt, dan kijken we er samen naar.\n\nGroet,\n{sender}",
  },
  {
    subject: "Koffie volgende week?",
    body: "Hoi {name},\n\nHeb je zin om volgende week een keer koffie te drinken? Even bijpraten over hoe het gaat. Ik ben dinsdag en donderdag in de buurt.\n\nGroet,\n{sender}",
  },
  {
    subject: "Leuk initiatief gezien",
    body: "Hey {name},\n\nIk zag online een interessant initiatief voorbijkomen dat aansluit bij waar we mee bezig zijn. Steeds meer gemeenten investeren in digitale oplossingen voor hun inwoners.\n\nGoed om te zien dat er beweging in de markt zit. Hopelijk kunnen we daar iets mee.\n\nGroet,\n{sender}",
  },
  {
    subject: "Snel vraagje",
    body: "Hoi {name},\n\nHeb je toevallig het telefoonnummer van de contactpersoon bij de gemeente? Ik wil even navragen hoe het staat met onze aanvraag.\n\nAlvast bedankt!\n\nGroet,\n{sender}",
  },
  {
    subject: "Re: planning Q2",
    body: "Hey {name},\n\nIk heb de planning voor Q2 bijgewerkt. De prioriteiten zijn duidelijk en ik denk dat we realistisch hebben gepland. Er is ook wat buffer ingebouwd voor onverwachte zaken.\n\nKun je er even naar kijken en laten weten of je akkoord bent?\n\nGroet,\n{sender}",
  },
];

/* ── Convert plain text to simple HTML ── */
function textToHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br/>")
    .replace(/^/, "<p>")
    .replace(/$/, "</p>");
}

/* ── Send via Mailgun ── */
async function sendWarmupEmail(
  fromEmail: string,
  fromName: string,
  domain: string,
  toEmail: string,
  toName: string | null,
  subject: string,
  bodyHtml: string,
  bodyText: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
  if (!MAILGUN_API_KEY) return { success: false, error: "MAILGUN_API_KEY not set" };

  const form = new FormData();
  form.append("from", `${fromName} <${fromEmail}>`);
  form.append("to", toName ? `${toName} <${toEmail}>` : toEmail);
  form.append("subject", subject);
  form.append("html", bodyHtml);
  form.append("text", bodyText);
  form.append("o:tracking-opens", "yes");
  form.append("o:tracking-clicks", "no"); // No link tracking for warmup
  form.append("o:tag", "warmup");

  try {
    const res = await fetch(
      `https://api.eu.mailgun.net/v3/${domain}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString("base64")}`,
        },
        body: form,
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: `Mailgun ${res.status}: ${errText}` };
    }

    const data = await res.json();
    return { success: true, messageId: data.id };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/* ── Main cron handler ── */
export async function GET() {
  const startTime = Date.now();
  const log: string[] = [];

  try {
    // 1. Check sending hours
    if (!isWithinSendingHours()) {
      return NextResponse.json({ message: "Outside sending hours (9-17 NL)", sent: 0 });
    }

    const supabase = createServiceRoleClient();
    const today = new Date().toISOString().split("T")[0];

    // 2. Get active sending accounts
    const { data: accounts, error: accErr } = await supabase
      .from("b2b_sending_accounts")
      .select("*")
      .eq("is_active", true);

    if (accErr || !accounts?.length) {
      return NextResponse.json({ error: "No active accounts", detail: accErr?.message }, { status: 500 });
    }

    // 3. Get active warmup recipients
    const { data: recipients, error: recErr } = await supabase
      .from("b2b_warmup_recipients")
      .select("*")
      .eq("is_active", true);

    if (recErr || !recipients?.length) {
      return NextResponse.json({ error: "No active warmup recipients", detail: recErr?.message }, { status: 500 });
    }

    // 4. Get today's send counts per account
    const { data: dailySends } = await supabase
      .from("b2b_daily_sends")
      .select("account_id, emails_sent")
      .eq("date", today);

    const dailySendMap = new Map(
      dailySends?.map((d) => [d.account_id, d.emails_sent]) || []
    );

    let totalSent = 0;

    // 5. For each sending account, send warmup emails
    for (const account of accounts) {
      const warmupDay = Math.max(
        1,
        Math.ceil((Date.now() - new Date(account.warmup_start_date).getTime()) / 86400000)
      );
      const dailyLimit = getWarmupLimit(warmupDay);
      const todaySent = dailySendMap.get(account.id) || 0;
      const remaining = dailyLimit - todaySent;

      if (remaining <= 0) {
        log.push(`[${account.email}] Day ${warmupDay}: limit reached (${todaySent}/${dailyLimit})`);
        continue;
      }

      // Send 1-2 warmup emails per cron run per account
      const toSend = Math.min(remaining, 2);
      
      // Pick random recipients (different from sender domain)
      const eligibleRecipients = recipients.filter(
        (r) => !r.email.endsWith(account.domain)
      );

      if (!eligibleRecipients.length) {
        log.push(`[${account.email}] No eligible recipients (all same domain)`);
        continue;
      }

      for (let i = 0; i < toSend; i++) {
        // Pick random recipient and template
        const recipient = eligibleRecipients[Math.floor(Math.random() * eligibleRecipients.length)];
        const template = WARMUP_TEMPLATES[Math.floor(Math.random() * WARMUP_TEMPLATES.length)];

        // Personalize
        const senderFirstName = account.display_name.split(" ")[0];
        const recipientName = recipient.display_name || recipient.email.split("@")[0];
        const subject = template.subject;
        const bodyText = template.body
          .replace(/{name}/g, recipientName)
          .replace(/{sender}/g, senderFirstName);
        const bodyHtml = textToHtml(bodyText);

        // Send
        const result = await sendWarmupEmail(
          account.email,
          account.display_name,
          account.domain,
          recipient.email,
          recipient.display_name,
          subject,
          bodyHtml,
          bodyText
        );

        if (result.success) {
          totalSent++;
          log.push(`[${account.email}] → ${recipient.email}: "${subject}" ✓`);

          // Update daily send count
          const { error: upsertErr } = await supabase
            .from("b2b_daily_sends")
            .upsert(
              {
                account_id: account.id,
                date: today,
                emails_sent: todaySent + i + 1,
              },
              { onConflict: "account_id,date" }
            );

          if (upsertErr) {
            log.push(`[${account.email}] Daily sends upsert error: ${upsertErr.message}`);
          }
        } else {
          log.push(`[${account.email}] → ${recipient.email}: FAILED - ${result.error}`);
        }

        // Small delay between sends (1-3 seconds)
        await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000));
      }
    }

    const duration = Date.now() - startTime;
    return NextResponse.json({
      success: true,
      sent: totalSent,
      accounts: accounts.length,
      recipients: recipients.length,
      duration: `${duration}ms`,
      log,
    });
  } catch (err) {
    console.error("[Warmup Cron]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
