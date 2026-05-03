import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const { searchParams } = new URL(req.url);
    const audience = searchParams.get("audience");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let query = supabase
      .from("b2b_contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (audience && audience !== "all") query = query.eq("audience", audience);
    if (status && status !== "all") query = query.eq("status", status);
    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,company_name.ilike.%${search}%,company_domain.ilike.%${search}%`
      );
    }

    const { data: leads, error } = await query.limit(200);
    if (error) {
      console.error("[Leads GET]", error);
      return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
    }

    // Fetch engagement data for all leads
    const domains = [...new Set((leads || []).map((l) => l.company_domain).filter(Boolean))];
    let engagementMap: Record<string, any> = {};

    if (domains.length > 0) {
      const { data: engagements } = await supabase
        .from("b2b_page_engagement")
        .select("*")
        .in("company_domain", domains)
        .order("updated_at", { ascending: false });

      if (engagements) {
        for (const e of engagements) {
          if (e.company_domain && !engagementMap[e.company_domain]) {
            engagementMap[e.company_domain] = e;
          }
        }
      }
    }

    // Merge engagement into leads
    const enriched = (leads || []).map((lead) => ({
      ...lead,
      engagement: lead.company_domain ? engagementMap[lead.company_domain] || null : null,
    }));

    return NextResponse.json({ leads: enriched });
  } catch (err) {
    console.error("[Leads GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "id and status required" }, { status: 400 });
    }

    const validStatuses = ["new", "contacted", "meeting", "closed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const { error } = await supabase
      .from("b2b_contact_submissions")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("[Leads PATCH]", error);
      return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Leads PATCH]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "ids array required" }, { status: 400 });
    }
    if (ids.length > 200) {
      return NextResponse.json({ error: "Max 200 at a time" }, { status: 400 });
    }

    const { error } = await supabase
      .from("b2b_contact_submissions")
      .delete()
      .in("id", ids);

    if (error) {
      console.error("[Leads DELETE]", error);
      return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }

    return NextResponse.json({ success: true, deleted: ids.length });
  } catch (err) {
    console.error("[Leads DELETE]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
