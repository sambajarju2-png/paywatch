import { NextResponse, type NextRequest } from "next/server";
import { getTenant } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";

type FeedPostRow = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  is_announcement: boolean;
  is_anonymous: boolean;
  author_type: string;
};

type FeedCommentRow = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  is_anonymous: boolean;
  author_type: string;
};

// Best-effort display name for the logged-in staff member, used both for the
// "{person} van {org}" attribution and as the display_name on the profile row we
// ensure below. Falls back through org member -> auth metadata -> email -> generic.
async function resolveStaffName(
  supabase: ReturnType<typeof createSupabaseAdmin>,
  orgId: string,
  memberId: string | null,
  staff: { id: string; email?: string | null; user_metadata?: Record<string, unknown> | null },
): Promise<string> {
  type StaffRow = { full_name: string | null; invite_email: string | null };
  let row: StaffRow | null = null;
  if (memberId) {
    const { data } = await supabase
      .from("organization_members")
      .select("full_name, invite_email")
      .eq("id", memberId)
      .maybeSingle();
    row = (data as StaffRow | null) ?? null;
  }
  if (!row?.full_name) {
    const { data } = await supabase
      .from("organization_members")
      .select("full_name, invite_email")
      .eq("organization_id", orgId)
      .eq("user_id", staff.id)
      .maybeSingle();
    if (data) row = data as StaffRow;
  }
  const fromMember = row?.full_name?.trim();
  if (fromMember) return fromMember;
  const meta = (staff.user_metadata || {}) as Record<string, unknown>;
  const metaName =
    (typeof meta.full_name === "string" && meta.full_name.trim()) ||
    (typeof meta.name === "string" && meta.name.trim());
  if (metaName) return metaName as string;
  const email = row?.invite_email || staff.email || "";
  if (email && email.includes("@")) return email.split("@")[0];
  return "Teamlid";
}

// Posts/comments/reactions all FK user_id -> community_profiles. When the org authors
// content (user_id = staff.id) that row must exist. Insert-only: never overwrite an
// existing community identity (the staff account may also be a regular member).
async function ensureOrgAuthorProfile(
  supabase: ReturnType<typeof createSupabaseAdmin>,
  staffId: string,
  displayName: string,
) {
  await supabase
    .from("community_profiles")
    .upsert({ user_id: staffId, display_name: displayName }, { onConflict: "user_id", ignoreDuplicates: true });
}

// Build the feed (posts + reaction counts + comments) for one group, including which
// reactions THIS org has made (so the portal can highlight + toggle them). The caller
// MUST have verified the group belongs to the org first. Service-role client, so the
// group_id filter is the only thing scoping the data — keep queries pinned to it.
async function buildGroupFeed(
  supabase: ReturnType<typeof createSupabaseAdmin>,
  groupId: string,
  orgId: string,
  orgName: string | null,
  orgLogo: string | null,
) {
  const { data: postRows } = await supabase
    .from("community_posts")
    .select("id, user_id, content, created_at, is_announcement, is_anonymous, author_type")
    .eq("group_id", groupId)
    .order("created_at", { ascending: false })
    .limit(50);
  const posts = (postRows || []) as FeedPostRow[];
  const postIds = posts.map((p) => p.id);

  const orgLabel = orgName || "Je organisatie";

  const reactionsByPost: Record<string, Record<string, number>> = {};
  const orgReactionsByPost: Record<string, Set<string>> = {};
  const commentsByPost: Record<string, FeedCommentRow[]> = {};
  const commentCount: Record<string, number> = {};
  const userIds = new Set<string>();
  for (const p of posts) userIds.add(p.user_id);

  if (postIds.length > 0) {
    const [reactionsRes, commentsRes] = await Promise.all([
      supabase
        .from("community_reactions")
        .select("post_id, reaction_type, author_type, author_org_id")
        .in("post_id", postIds),
      supabase
        .from("community_comments")
        .select("id, post_id, user_id, content, created_at, is_anonymous, is_flagged, author_type, author_org_id")
        .in("post_id", postIds)
        .order("created_at", { ascending: true }),
    ]);
    for (const r of (reactionsRes.data || []) as {
      post_id: string;
      reaction_type: string;
      author_type: string;
      author_org_id: string | null;
    }[]) {
      const bucket = (reactionsByPost[r.post_id] ||= {});
      bucket[r.reaction_type] = (bucket[r.reaction_type] || 0) + 1;
      if (r.author_type === "org" && r.author_org_id === orgId) {
        (orgReactionsByPost[r.post_id] ||= new Set<string>()).add(r.reaction_type);
      }
    }
    for (const c of (commentsRes.data || []) as (FeedCommentRow & { post_id: string; is_flagged: boolean })[]) {
      if (c.is_flagged) continue;
      commentCount[c.post_id] = (commentCount[c.post_id] || 0) + 1;
      (commentsByPost[c.post_id] ||= []).push(c);
      userIds.add(c.user_id);
    }
  }

  const nameMap: Record<string, string> = {};
  if (userIds.size > 0) {
    const { data: profiles } = await supabase
      .from("community_profiles")
      .select("user_id, display_name")
      .in("user_id", Array.from(userIds));
    for (const pr of (profiles || []) as { user_id: string; display_name: string }[]) {
      nameMap[pr.user_id] = pr.display_name;
    }
  }

  const authorFor = (authorType: string, userId: string, isAnon: boolean) => {
    if (authorType === "org") {
      const person = nameMap[userId];
      return { type: "org" as const, name: person ? `${person} van ${orgLabel}` : orgLabel, logo_url: orgLogo };
    }
    if (isAnon) return { type: "user" as const, name: "Anoniem lid", logo_url: null };
    return { type: "user" as const, name: nameMap[userId] || "Lid", logo_url: null };
  };

  return {
    posts: posts.map((p) => ({
      id: p.id,
      content: p.content,
      created_at: p.created_at,
      is_announcement: p.is_announcement,
      author: authorFor(p.author_type, p.user_id, p.is_anonymous),
      reactions: reactionsByPost[p.id] || {},
      org_reactions: Array.from(orgReactionsByPost[p.id] || []),
      comment_count: commentCount[p.id] || 0,
      comments: (commentsByPost[p.id] || []).slice(0, 30).map((c) => ({
        id: c.id,
        content: c.content,
        created_at: c.created_at,
        author: authorFor(c.author_type, c.user_id, c.is_anonymous),
      })),
    })),
  };
}

// GET /community/api — list this org's community groups with member counts, or
// (with ?action=group_feed&group_id=…) the read-only feed for one of its groups.
export async function GET(request: NextRequest) {
  const [tenant, staff] = await Promise.all([getTenant(), getAuthUser()]);
  if (!staff) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  if (!tenant.orgId) return NextResponse.json({ error: "Geen organisatiecontext" }, { status: 400 });

  const supabase = createSupabaseAdmin();

  const url = new URL(request.url);
  if (url.searchParams.get("action") === "group_feed") {
    const groupId = url.searchParams.get("group_id") || "";
    const { data: owns } = await supabase
      .from("community_groups")
      .select("id")
      .eq("id", groupId)
      .eq("organization_id", tenant.orgId)
      .maybeSingle();
    if (!owns) return NextResponse.json({ error: "Groep niet gevonden" }, { status: 404 });
    return NextResponse.json(await buildGroupFeed(supabase, groupId, tenant.orgId, tenant.orgName, tenant.logoUrl));
  }

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
 *   { action: "add_members_bulk", group_id, user_org_ids: string[] }
 *   { action: "announce", group_id, content }
 *   { action: "post", group_id, content }                       // org post, no mass notify
 *   { action: "react", post_id, reaction_type }                 // toggle org reaction
 *   { action: "comment", post_id, content, parent_comment_id? } // org comment as the org
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

  if (action === "add_members_bulk") {
    if (!(await ownGroup(body?.group_id))) return NextResponse.json({ error: "Groep niet gevonden" }, { status: 404 });
    const rawIds = Array.isArray(body?.user_org_ids) ? body.user_org_ids : [];
    const ids = Array.from(
      new Set(rawIds.filter((x: unknown): x is string => typeof x === "string" && x.length > 0)),
    );
    if (ids.length === 0) return NextResponse.json({ error: "Geen gebruikers geselecteerd" }, { status: 400 });

    // Resolve every selected user_organizations row to its real user_id, scoped to this org.
    const { data: uos } = await supabase
      .from("user_organizations")
      .select("user_id")
      .in("id", ids)
      .eq("organization_id", tenant.orgId);
    const userIds = Array.from(new Set((uos || []).map((u: { user_id: string }) => u.user_id)));
    if (userIds.length === 0) return NextResponse.json({ error: "Gebruikers niet gevonden" }, { status: 404 });

    // Count only the genuinely new members so the response message is honest.
    const { data: existing } = await supabase
      .from("community_group_members")
      .select("user_id")
      .eq("group_id", body.group_id)
      .in("user_id", userIds);
    const already = new Set((existing || []).map((m: { user_id: string }) => m.user_id));
    const added = userIds.filter((uid) => !already.has(uid));

    const { error } = await supabase
      .from("community_group_members")
      .upsert(
        userIds.map((uid) => ({ group_id: body.group_id, user_id: uid, role: "member", added_by: staff.id })),
        { onConflict: "group_id,user_id", ignoreDuplicates: true },
      );
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, added: added.length, total: userIds.length });
  }

  if (action === "announce") {
    if (!(await ownGroup(body?.group_id))) return NextResponse.json({ error: "Groep niet gevonden" }, { status: 404 });
    const content = (body?.content || "").trim();
    if (content.length < 3) return NextResponse.json({ error: "Bericht te kort" }, { status: 400 });
    if (content.length > 1000) return NextResponse.json({ error: "Bericht te lang" }, { status: 400 });

    const announceStaffName = await resolveStaffName(supabase, tenant.orgId, tenant.memberId, staff);
    await ensureOrgAuthorProfile(supabase, staff.id, announceStaffName);

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

  if (action === "post") {
    if (!(await ownGroup(body?.group_id))) return NextResponse.json({ error: "Groep niet gevonden" }, { status: 404 });
    const content = (body?.content || "").trim();
    if (content.length < 3) return NextResponse.json({ error: "Bericht te kort" }, { status: 400 });
    if (content.length > 1000) return NextResponse.json({ error: "Bericht te lang" }, { status: 400 });

    const staffName = await resolveStaffName(supabase, tenant.orgId, tenant.memberId, staff);
    await ensureOrgAuthorProfile(supabase, staff.id, staffName);

    const { data: post, error } = await supabase
      .from("community_posts")
      .insert({
        user_id: staff.id,
        content,
        is_anonymous: false,
        is_approved: true,
        is_flagged: false,
        group_id: body.group_id,
        is_announcement: false,
        author_type: "org",
        author_org_id: tenant.orgId,
      })
      .select("id")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, post_id: post.id });
  }

  if (action === "react") {
    const reaction = (body?.reaction_type || "").trim();
    const postId = typeof body?.post_id === "string" ? body.post_id : "";
    if (!reaction || !postId) return NextResponse.json({ error: "Ongeldige reactie" }, { status: 400 });

    // The post must live in one of this org's groups.
    const { data: post } = await supabase
      .from("community_posts")
      .select("id, group_id")
      .eq("id", postId)
      .maybeSingle();
    if (!post?.group_id || !(await ownGroup(post.group_id))) {
      return NextResponse.json({ error: "Bericht niet gevonden" }, { status: 404 });
    }

    // Toggle the org's reaction of this type (any staff member toggles the org's one).
    const { data: existing } = await supabase
      .from("community_reactions")
      .select("id")
      .eq("post_id", postId)
      .eq("author_type", "org")
      .eq("author_org_id", tenant.orgId)
      .eq("reaction_type", reaction)
      .maybeSingle();
    if (existing) {
      await supabase.from("community_reactions").delete().eq("id", existing.id);
      return NextResponse.json({ ok: true, active: false });
    }

    const staffName = await resolveStaffName(supabase, tenant.orgId, tenant.memberId, staff);
    await ensureOrgAuthorProfile(supabase, staff.id, staffName);
    const { error } = await supabase.from("community_reactions").insert({
      post_id: postId,
      user_id: staff.id,
      reaction_type: reaction,
      author_type: "org",
      author_org_id: tenant.orgId,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, active: true });
  }

  if (action === "comment") {
    const content = (body?.content || "").trim();
    const postId = typeof body?.post_id === "string" ? body.post_id : "";
    if (!postId) return NextResponse.json({ error: "Bericht niet gevonden" }, { status: 404 });
    if (content.length < 1) return NextResponse.json({ error: "Reactie te kort" }, { status: 400 });
    if (content.length > 1000) return NextResponse.json({ error: "Reactie te lang" }, { status: 400 });

    const { data: post } = await supabase
      .from("community_posts")
      .select("id, group_id, user_id, author_type")
      .eq("id", postId)
      .maybeSingle();
    if (!post?.group_id || !(await ownGroup(post.group_id))) {
      return NextResponse.json({ error: "Bericht niet gevonden" }, { status: 404 });
    }

    const parentId = typeof body?.parent_comment_id === "string" ? body.parent_comment_id : null;
    const staffName = await resolveStaffName(supabase, tenant.orgId, tenant.memberId, staff);
    await ensureOrgAuthorProfile(supabase, staff.id, staffName);
    const { data: comment, error } = await supabase
      .from("community_comments")
      .insert({
        post_id: postId,
        user_id: staff.id,
        content,
        is_anonymous: false,
        is_flagged: false,
        parent_comment_id: parentId,
        author_type: "org",
        author_org_id: tenant.orgId,
      })
      .select("id, created_at")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Notify the person being replied to (parent comment author), or the post author
    // for a top-level comment — unless that's the org itself or this staff member.
    // Surfaces in their feed notifications and deep-links to the post. In-app only,
    // matching announcements (the portal has no push channel).
    let recipientId: string | null = null;
    if (parentId) {
      const { data: parent } = await supabase
        .from("community_comments")
        .select("user_id, author_type")
        .eq("id", parentId)
        .maybeSingle();
      if (parent && parent.author_type !== "org") recipientId = parent.user_id as string;
    } else if (post.author_type !== "org") {
      recipientId = post.user_id as string;
    }
    if (recipientId && recipientId !== staff.id) {
      await supabase.from("community_notifications").insert({
        user_id: recipientId,
        type: "reply",
        from_user_id: staff.id,
        from_display_name: staffName
          ? `${staffName} van ${tenant.orgName || "je organisatie"}`
          : tenant.orgName || "Je organisatie",
        post_id: postId,
        comment_id: comment.id,
        content_preview: content.slice(0, 140),
        group_id: post.group_id,
        is_read: false,
      });
    }

    return NextResponse.json({
      ok: true,
      comment: {
        id: comment.id,
        content,
        created_at: comment.created_at,
        author: {
          type: "org",
          name: staffName ? `${staffName} van ${tenant.orgName || "je organisatie"}` : tenant.orgName || "Je organisatie",
          logo_url: tenant.logoUrl,
        },
      },
    });
  }

  return NextResponse.json({ error: "Onbekende actie" }, { status: 400 });
}
