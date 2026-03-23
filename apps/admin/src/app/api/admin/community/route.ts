import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * GET /api/admin/community — list community profiles with linked user info + post stats
 */
export async function GET() {
  try {
    const supabase = getAdmin();

    // Get all community profiles
    const { data: profiles } = await supabase
      .from("community_profiles")
      .select("user_id, display_name, is_anonymous_default, is_banned, banned_until, ban_reason, created_at")
      .order("created_at", { ascending: false });

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ members: [], stats: { total: 0, banned: 0, posts: 0, comments: 0 } });
    }

    const userIds = profiles.map((p) => p.user_id);

    // Get linked user_settings for each (email, real name, last activity)
    const { data: settings } = await supabase
      .from("user_settings")
      .select("user_id, display_name, first_name, last_name, language, gemeente, last_active_at, created_at")
      .in("user_id", userIds);

    const settingsMap: Record<string, typeof settings extends Array<infer T> ? T : never> = {};
    for (const s of settings || []) settingsMap[s.user_id] = s;

    // Get post counts per user
    const { data: postCounts } = await supabase
      .from("community_posts")
      .select("user_id")
      .in("user_id", userIds);

    const postCountMap: Record<string, number> = {};
    for (const p of postCounts || []) {
      postCountMap[p.user_id] = (postCountMap[p.user_id] || 0) + 1;
    }

    // Get comment counts per user
    const { data: commentCounts } = await supabase
      .from("community_comments")
      .select("user_id")
      .in("user_id", userIds);

    const commentCountMap: Record<string, number> = {};
    for (const c of commentCounts || []) {
      commentCountMap[c.user_id] = (commentCountMap[c.user_id] || 0) + 1;
    }

    // Get flagged post counts
    const { data: flaggedPosts } = await supabase
      .from("community_posts")
      .select("id, user_id, content, badge_type, is_flagged, created_at")
      .eq("is_flagged", true)
      .order("created_at", { ascending: false })
      .limit(50);

    // Get flagged comment counts
    const { data: flaggedComments } = await supabase
      .from("community_comments")
      .select("id, user_id, post_id, content, is_flagged, created_at")
      .eq("is_flagged", true)
      .order("created_at", { ascending: false })
      .limit(50);

    // Enrich profiles
    const members = profiles.map((p) => {
      const s = settingsMap[p.user_id];
      const realName = s
        ? [s.first_name, s.last_name].filter(Boolean).join(" ") || s.display_name || ""
        : "";

      return {
        user_id: p.user_id,
        community_name: p.display_name,
        real_name: realName,
        gemeente: s?.gemeente || null,
        language: s?.language || "nl",
        is_banned: p.is_banned,
        banned_until: p.banned_until,
        ban_reason: p.ban_reason,
        post_count: postCountMap[p.user_id] || 0,
        comment_count: commentCountMap[p.user_id] || 0,
        last_active_at: s?.last_active_at || null,
        joined_at: p.created_at,
        account_created_at: s?.created_at || p.created_at,
      };
    });

    const totalPosts = Object.values(postCountMap).reduce((s, v) => s + v, 0);
    const totalComments = Object.values(commentCountMap).reduce((s, v) => s + v, 0);
    const bannedCount = profiles.filter((p) => p.is_banned).length;

    return NextResponse.json({
      members,
      flagged_posts: flaggedPosts || [],
      flagged_comments: flaggedComments || [],
      stats: {
        total: profiles.length,
        banned: bannedCount,
        posts: totalPosts,
        comments: totalComments,
        flagged: (flaggedPosts?.length || 0) + (flaggedComments?.length || 0),
      },
    });
  } catch (err) {
    console.error("Admin community GET error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

/**
 * POST /api/admin/community — moderation actions
 * Actions: ban, unban, timeout, flag_post, unflag_post, flag_comment, unflag_comment, delete_post, delete_comment
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, user_id, post_id, comment_id, reason, duration_hours } = body;
    const supabase = getAdmin();

    switch (action) {
      case "ban": {
        if (!user_id) return NextResponse.json({ error: "user_id required" }, { status: 400 });
        await supabase
          .from("community_profiles")
          .update({ is_banned: true, ban_reason: reason || "Overtreding communityregels", banned_until: null })
          .eq("user_id", user_id);
        return NextResponse.json({ ok: true, message: "Gebruiker permanent geblokkeerd" });
      }

      case "timeout": {
        if (!user_id || !duration_hours) return NextResponse.json({ error: "user_id and duration_hours required" }, { status: 400 });
        const until = new Date(Date.now() + duration_hours * 3600000).toISOString();
        await supabase
          .from("community_profiles")
          .update({ is_banned: true, banned_until: until, ban_reason: reason || `Time-out (${duration_hours}u)` })
          .eq("user_id", user_id);
        return NextResponse.json({ ok: true, message: `Time-out voor ${duration_hours} uur` });
      }

      case "unban": {
        if (!user_id) return NextResponse.json({ error: "user_id required" }, { status: 400 });
        await supabase
          .from("community_profiles")
          .update({ is_banned: false, banned_until: null, ban_reason: null })
          .eq("user_id", user_id);
        return NextResponse.json({ ok: true, message: "Blokkade opgeheven" });
      }

      case "flag_post": {
        if (!post_id) return NextResponse.json({ error: "post_id required" }, { status: 400 });
        await supabase.from("community_posts").update({ is_flagged: true }).eq("id", post_id);
        return NextResponse.json({ ok: true, message: "Post geflagged" });
      }

      case "unflag_post": {
        if (!post_id) return NextResponse.json({ error: "post_id required" }, { status: 400 });
        await supabase.from("community_posts").update({ is_flagged: false }).eq("id", post_id);
        return NextResponse.json({ ok: true, message: "Flag verwijderd" });
      }

      case "delete_post": {
        if (!post_id) return NextResponse.json({ error: "post_id required" }, { status: 400 });
        // Delete comments first (FK), then reactions, then post
        await supabase.from("community_comments").delete().eq("post_id", post_id);
        await supabase.from("community_reactions").delete().eq("post_id", post_id);
        await supabase.from("community_posts").delete().eq("id", post_id);
        return NextResponse.json({ ok: true, message: "Post verwijderd" });
      }

      case "flag_comment": {
        if (!comment_id) return NextResponse.json({ error: "comment_id required" }, { status: 400 });
        await supabase.from("community_comments").update({ is_flagged: true }).eq("id", comment_id);
        return NextResponse.json({ ok: true, message: "Reactie geflagged" });
      }

      case "unflag_comment": {
        if (!comment_id) return NextResponse.json({ error: "comment_id required" }, { status: 400 });
        await supabase.from("community_comments").update({ is_flagged: false }).eq("id", comment_id);
        return NextResponse.json({ ok: true, message: "Flag verwijderd" });
      }

      case "delete_comment": {
        if (!comment_id) return NextResponse.json({ error: "comment_id required" }, { status: 400 });
        await supabase.from("community_comments").delete().eq("id", comment_id);
        return NextResponse.json({ ok: true, message: "Reactie verwijderd" });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err) {
    console.error("Admin community POST error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
