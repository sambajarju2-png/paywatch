import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, companyDomain, companyName, audience, timeOnPage, maxScrollDepth, clickedCta, submittedForm, visitCount } = body;

    if (!sessionId || !audience) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const supabase = getSupabase();

    // Upsert by session_id
    const { error } = await supabase
      .from("b2b_page_engagement")
      .upsert(
        {
          session_id: sessionId,
          company_domain: companyDomain || null,
          company_name: companyName || null,
          audience,
          time_on_page_seconds: timeOnPage || 0,
          max_scroll_depth: maxScrollDepth || 0,
          clicked_cta: clickedCta || false,
          submitted_form: submittedForm || false,
          visit_count: visitCount || 1,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "session_id" }
      );

    if (error) {
      console.error("[TrackEngagement]", error);
      return NextResponse.json({ error: "Failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal" }, { status: 500 });
  }
}
