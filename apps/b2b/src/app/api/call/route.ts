import { NextRequest, NextResponse } from "next/server";
import { AccessToken, RoomServiceClient } from "livekit-server-sdk";
import { createSupabaseAdmin, createSupabaseServer } from "@/lib/supabase-server";

// Support both env var names (LiveKit dashboard uses LIVEKIT_URL, we want NEXT_PUBLIC_)
const LK_API_KEY = process.env.LIVEKIT_API_KEY!;
const LK_API_SECRET = process.env.LIVEKIT_API_SECRET!;
const LK_WSS_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL
  || process.env.LIVEKIT_URL
  || "";
// RoomServiceClient needs HTTPS, not WSS
const LK_HTTP_URL = LK_WSS_URL.replace("wss://", "https://");

/**
 * POST /api/call
 * Coach starts a video call.
 */
export async function POST(req: NextRequest) {
  try {
    const supabaseUser = await createSupabaseServer();
    const { data: { user: coach } } = await supabaseUser.auth.getUser();
    if (!coach) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { buddy_id } = await req.json();
    if (!buddy_id) return NextResponse.json({ error: "buddy_id required" }, { status: 400 });

    if (!LK_API_KEY || !LK_API_SECRET || !LK_WSS_URL) {
      console.error("[Call] Missing LiveKit env vars:", {
        hasKey: !!LK_API_KEY,
        hasSecret: !!LK_API_SECRET,
        wssUrl: LK_WSS_URL || "MISSING",
      });
      return NextResponse.json({ error: "LiveKit not configured" }, { status: 500 });
    }

    const db = createSupabaseAdmin();

    const { data: buddy } = await db
      .from("b2b_buddies")
      .select("id, user_id, buddy_member_id, organization_id")
      .eq("id", buddy_id)
      .single();

    if (!buddy) return NextResponse.json({ error: "Buddy not found" }, { status: 404 });

    const roomName = `pw-${buddy_id.slice(0, 8)}-${Date.now()}`;
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Create room (HTTPS URL required for REST API)
    try {
      const svc = new RoomServiceClient(LK_HTTP_URL, LK_API_KEY, LK_API_SECRET);
      await svc.createRoom({ name: roomName, emptyTimeout: 300, maxParticipants: 2 });
      console.log("[Call] Room created:", roomName);
    } catch (roomErr) {
      console.error("[Call] Room creation failed (non-fatal):", roomErr);
    }

    // Coach token
    const at = new AccessToken(LK_API_KEY, LK_API_SECRET, {
      identity: `coach-${coach.id.slice(0, 8)}`,
      name: coach.email?.split("@")[0] || "Coach",
      ttl: "1h",
    });
    at.addGrant({ room: roomName, roomJoin: true, canPublish: true, canSubscribe: true });
    const token = await at.toJwt();

    console.log("[Call] Token generated, room:", roomName, "url:", LK_WSS_URL);

    const callMetadata = {
      room_name: roomName,
      expires_at: expiresAt.toISOString(),
      initiated_by: coach.id,
    };

    // Write to b2b_buddy_messages
    await db.from("b2b_buddy_messages").insert({
      buddy_link_id: buddy_id,
      sender_id: coach.id,
      content: "📞 Videogesprek gestart",
      message_type: "call_invite",
      metadata: callMetadata,
    });

    // Bridge to hulp_messages for consumer app
    try {
      const { data: coachMember } = await db
        .from("organization_members")
        .select("full_name, invite_email")
        .eq("user_id", coach.id)
        .eq("organization_id", buddy.organization_id)
        .single();

      const coachName = coachMember?.full_name
        || coachMember?.invite_email?.split("@")[0]
        || "Coach";

      await db.from("hulp_messages").insert({
        user_id: buddy.user_id,
        thread_id: `coach:${buddy_id}`,
        sender_type: "coach",
        sender_name: coachName,
        sender_id: coach.id,
        content: "📞 Videogesprek gestart — tik om deel te nemen",
        message_type: "call_invite",
        metadata: callMetadata,
        is_read: false,
      });
    } catch (bridgeErr) {
      console.error("[Call] hulp_messages bridge error:", bridgeErr);
    }

    return NextResponse.json({ token, roomName, livekitUrl: LK_WSS_URL });
  } catch (err) {
    console.error("[Call create]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

/**
 * GET /api/call?room=xxx
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const room = searchParams.get("room");
    if (!room) return NextResponse.json({ error: "room required" }, { status: 400 });

    const identity = `user-${user.id.slice(0, 8)}`;
    const displayName = searchParams.get("name") || user.email?.split("@")[0] || "Gebruiker";

    const at = new AccessToken(LK_API_KEY, LK_API_SECRET, { identity, name: displayName, ttl: "1h" });
    at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true });
    const token = await at.toJwt();

    return NextResponse.json({ token, livekitUrl: LK_WSS_URL });
  } catch (err) {
    console.error("[Call token]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
