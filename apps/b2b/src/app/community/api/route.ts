import { NextResponse, type NextRequest } from "next/server";
import { getTenant } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";

// GET /community/api — list this org's community groups with member counts.
export async function GET() {
  const [tenant, staff] = await Promise.all([getTenant(), getAuthUser()]);
  if (!staff) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  if (!tenant.orgId) return NextResponse.json({ error: "Geen organisatiecontext" }, { status: 400 });

  const supabase = createSupabaseAdmin();
  const { data: groups } = await supabase
    .from("community_groups")
    .select("id, name, description, is_default, created_at")
    .eq("organization_id", tenant.orgId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true });

  const ids = (groups || []).map((g: { id: string }) => g.id);
  const counts: Record<string, number> = {};
  if (ids.length > 0) {
    const { data: members } = await supabase
      .from("community_group_members")
      .select("group_id")
      .in("group_id", ids);
    for (const m of (members || []) as { group_id: string }[]) {
      counts[m.group_id] = (counts[m.group_id] || 0) + 1;
    }
  }

  return NextResponse.json({
    groups: (groups || []).map((g: { id: string }) => ({ ...g, member_count: counts[g.id] || 0 })),
  });
}

/**
 * POST /community/api — actions:
 *   { action: "create_group", name, description? }
 *   { action: "add_member", group_id, user_org_id }
 *   { action: "announce", group_id, content }
 */
export async function POST(request: NextRequest) {
  const [tenant, staff] = await Promise.all([getTenant(), getAuthUser()]);
  if (!staff) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  if (!tenant.orgId) return NextResponse.json({ error: "Geen organisatiecontext" }, { status: 400 });

  const supabase = createSupabaseAdmin();
  const body = await request.json().catch(() => null);
  const action = body?.action;

  // Helper: confirm a group belongs to this org.
  async function ownGroup(groupId: string): Promise<boolean> {
    if (!groupId) return false;
    const { data } = await supabase
      .from("community_groups")
      .select("id")
      .eq("id", groupId)
      .eq("organization_id", tenant.orgId)
      .maybeSingle();
    return !!data;
  }

  if (action === "create_group") {
    const name = (body?.name || "").trim();
    if (name.length < 2) return NextResponse.json({ error: "Naam te kort" }, { status: 400 });
    const { data, error } = await supabase
      .from("community_groups")
      .insert({
        organization_id: tenant.orgId,
        name,
        description: (body?.description || "").trim() || null,
        is_default: false,
        created_by: staff.id,
      })
      .select("id, name, description, is_default")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, group: { ...data, member_count: 0 } });
  }

  if (action === "add_member") {
    if (!(await ownGroup(body?.group_id))) return NextResponse.json({ error: "Groep niet gevonden" }, { status: 404 });
    // Resolve the real user_id from the user_organizations row (scoped to this org).
    const { data: uo } = await supabase
      .from("user_organizations")
      .select("user_id")
      .eq("id", body?.user_org_id)
      .eq("organization_id", tenant.orgId)
      .maybeSingle();
    if (!uo) return NextResponse.json({ error: "Gebruiker niet gevonden" }, { status: 404 });
    const { error } = await supabase
      .from("community_group_members")
      .upsert({ group_id: body.group_id, user_id: uo.user_id, role: "member", added_by: staff.id }, { onConflict: "group_id,user_id" });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (action === "announce") {
    if (!(await ownGroup(body?.group_id))) return NextResponse.json({ error: "Groep niet gevonden" }, { status: 404 });
    const content = (body?.content || "").trim();
    if (content.length < 3) return NextResponse.json({ error: "Bericht te kort" }, { status: 400 });
    if (content.length > 1000) return NextResponse.json({ error: "Bericht te lang" }, { status: 400 });

    // The announcement is a normal community post, flagged + authored by the org.
    const { data: post, error: postErr } = await supabase
      .from("community_posts")
      .insert({
        user_id: staff.id,
        content,
        is_anonymous: false,
        is_approved: true,
        is_flagged: false,
        group_id: body.group_id,
        is_announcement: true,
        author_type: "org",
        author_org_id: tenant.orgId,
      })
      .select("id")
      .single();
    if (postErr) return NextResponse.json({ error: postErr.message }, { status: 500 });

    // Notify every group member (except the author) so it surfaces immediately.
    const { data: members } = await supabase
      .from("community_group_members")
      .select("user_id")
      .eq("group_id", body.group_id);
    const recipients = (members || [])
      .map((m: { user_id: string }) => m.user_id)
      .filter((uid: string) => uid !== staff.id);
    if (recipients.length > 0) {
      await supabase.from("community_notifications").insert(
        recipients.map((uid: string) => ({
          user_id: uid,
          type: "announcement",
          from_user_id: staff.id,
          from_display_name: tenant.orgName || "Je organisatie",
          post_id: post.id,
          group_id: body.group_id,
          content_preview: content.slice(0, 140),
          is_read: false,
        }))
      );
    }

    return NextResponse.json({ ok: true, notified: recipients.length });
  }

  return NextResponse.json({ error: "Onbekende actie" }, { status: 400 });
}
