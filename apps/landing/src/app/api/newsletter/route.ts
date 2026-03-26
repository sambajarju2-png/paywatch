import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkPublicRateLimit } from "@/lib/rate-limit";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;

const AUDIENCE_IDS: Record<string, string> = {
  consumer: "065fa004-bc05-4d75-abaf-67ed1e41872d",
  gemeente: "113aa5e0-31d8-4db4-bffd-1ddc42dd675e",
  aid_org: "113aa5e0-31d8-4db4-bffd-1ddc42dd675e",
  company: "113aa5e0-31d8-4db4-bffd-1ddc42dd675e",
};

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

export async function POST(req: NextRequest) {
  // Rate limit: max 5 newsletter subscriptions per IP per hour
  const limited = await checkPublicRateLimit("newsletter", 5, 60);
  if (limited) return limited;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const body = await req.json();
    const {
      email,
      name,
      company_name,
      audience_type = "consumer",
      marketing_consent = true,
      language = "nl",
      source = "website",
    } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const validTypes = ["consumer", "gemeente", "aid_org", "company"];
    if (!validTypes.includes(audience_type)) {
      return NextResponse.json({ error: "Invalid audience_type" }, { status: 400 });
    }

    // 1. Save to Supabase
    const { data: subscriber, error: dbError } = await supabase
      .from("newsletter_subscribers")
      .upsert(
        {
          email: email.toLowerCase().trim(),
          name: name || null,
          company_name: company_name || null,
          audience_type,
          marketing_consent,
          language,
          source,
          subscribed_at: new Date().toISOString(),
          unsubscribed_at: null,
        },
        { onConflict: "email,audience_type" }
      )
      .select()
      .single();

    if (dbError) {
      console.error("Supabase newsletter error:", dbError);
      return NextResponse.json({ error: "Failed to save subscriber" }, { status: 500 });
    }

    // 2. Add to Resend Audience
    const audienceId = AUDIENCE_IDS[audience_type];
    const { firstName, lastName } = splitName(name || email.split("@")[0]);

    const tags: string[] = [audience_type];
    if (language) tags.push(`lang:${language}`);
    if (source) tags.push(`source:${source}`);

    let resendContactId: string | null = null;

    try {
      const resendRes = await fetch(
        `https://api.resend.com/audiences/${audienceId}/contacts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.toLowerCase().trim(),
            first_name: firstName,
            last_name: lastName,
            unsubscribed: false,
          }),
        }
      );

      if (resendRes.ok) {
        const resendData = await resendRes.json();
        resendContactId = resendData.id || null;
      } else {
        const text = await resendRes.text();
        console.error("Resend contact create error:", resendRes.status, text);
      }
    } catch (e) {
      console.error("Resend contact error:", e);
    }

    // 3. Update Supabase with Resend IDs
    if (resendContactId && subscriber?.id) {
      await supabase
        .from("newsletter_subscribers")
        .update({
          resend_audience_id: audienceId,
          resend_contact_id: resendContactId,
        })
        .eq("id", subscriber.id);
    }

    // 4. Send confirmation email
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "PayWatch <info@paywatch.app>",
          to: email,
          subject:
            language === "nl"
              ? "Welkom bij de PayWatch nieuwsbrief!"
              : "Welcome to the PayWatch newsletter!",
          html:
            language === "nl"
              ? `<div style="font-family:'Plus Jakarta Sans',system-ui,sans-serif;max-width:540px;margin:0 auto;padding:32px 24px"><div style="text-align:center;margin-bottom:24px"><strong style="font-size:18px;color:#0A2540">PayWatch</strong></div><p style="color:#0F172A;font-size:14px;line-height:1.6">Hoi${firstName ? ` ${firstName}` : ""},</p><p style="color:#0F172A;font-size:14px;line-height:1.6">Bedankt voor je aanmelding! Je ontvangt voortaan onze updates over slimmer omgaan met je rekeningen en het voorkomen van schulden.</p><p style="color:#64748B;font-size:12px;margin-top:32px">Je kunt je op elk moment uitschrijven via de link onderaan elke email.</p></div>`
              : `<div style="font-family:'Plus Jakarta Sans',system-ui,sans-serif;max-width:540px;margin:0 auto;padding:32px 24px"><div style="text-align:center;margin-bottom:24px"><strong style="font-size:18px;color:#0A2540">PayWatch</strong></div><p style="color:#0F172A;font-size:14px;line-height:1.6">Hi${firstName ? ` ${firstName}` : ""},</p><p style="color:#0F172A;font-size:14px;line-height:1.6">Thanks for subscribing! You'll receive our updates about smarter bill management and debt prevention.</p><p style="color:#64748B;font-size:12px;margin-top:32px">You can unsubscribe at any time via the link at the bottom of each email.</p></div>`,
          reply_to: "info@paywatch.app",
        }),
      });
    } catch (e) {
      console.error("Confirmation email error:", e);
    }

    return NextResponse.json({
      success: true,
      subscriber_id: subscriber?.id,
      resend_contact_id: resendContactId,
    });
  } catch (err) {
    console.error("Newsletter subscribe error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
