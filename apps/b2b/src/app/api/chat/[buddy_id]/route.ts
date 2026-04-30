import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin, createSupabaseServer } from "@/lib/supabase-server";

/**
 * GET  /api/chat/[buddy_id] — fetch messages for a B2B buddy link
 * POST /api/chat/[buddy_id] — send a message
 *
 * Access allowed: assigned coach, the client user, OR org owner/admin
 * Uses b2b_buddy_messages table (separate from consumer app's buddy_messages)
 */

async function verifyAccess(supabaseAdmin: any, supabaseUser: any, buddyId: string) {
  const { data: { user } } = await supabaseUser.auth.getUser();
  if (!user) return null;

  const { data: buddy } = await supabaseAdmin
    .from("b2b_buddies")
    .select("id, user_id, buddy_member_id, organization_id")
    .eq("id", buddyId)
    .single();

  if (!buddy) return null;

  // Look up the caller's membership in this org (also get role for admin/owner check)
  const { data: member } = await supabaseAdmin
    .from("organization_members")
    .select("id, role")
    .eq("organization_id", buddy.organization_id)
    .eq("user_id", user.id)
    .single();

  const isClient = buddy.user_id === user.id;
  const isCoach = member?.id === buddy.buddy_member_id;
  const isAdminOrOwner = ["admin", "owner"].includes(member?.role || "");

  if (!isClient && !isCoach && !isAdminOrOwner) return null;

  return { buddy, senderId: user.id, role: member?.role || "client" };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ buddy_id: string }> }
) {
  const { buddy_id } = await params;
  const supabaseAdmin = createSupabaseAdmin();
  const supabaseUser = await createSupabaseServer();

  const access = await verifyAccess(supabaseAdmin, supabaseUser, buddy_id);
  if (!access) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: messages, error } = await supabaseAdmin
    .from("b2b_buddy_messages")
    .select("id, sender_id, content, is_read, created_at")
    .eq("buddy_link_id", buddy_id)
    .order("created_at", { ascending: true })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Mark unread messages as read for this caller
  const unread = (messages || [])
    .filter((m: any) => !m.is_read && m.sender_id !== access.senderId)
    .map((m: any) => m.id);

  if (unread.length > 0) {
    await supabaseAdmin
      .from("b2b_buddy_messages")
      .update({ is_read: true })
      .in("id", unread);
  }

  return NextResponse.json({ messages: messages || [] });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ buddy_id: string }> }
) {
  const { buddy_id } = await params;
  const supabaseAdmin = createSupabaseAdmin();
  const supabaseUser = await createSupabaseServer();

  const access = await verifyAccess(supabaseAdmin, supabaseUser, buddy_id);
  if (!access) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const content = (body.content || "").trim();
  if (!content) return NextResponse.json({ error: "Leeg bericht" }, { status: 400 });
  if (content.length > 2000) return NextResponse.json({ error: "Bericht te lang" }, { status: 400 });

  const { data: message, error } = await supabaseAdmin
    .from("b2b_buddy_messages")
    .insert({
      buddy_link_id: buddy_id,
      sender_id: access.senderId,
      content,
      is_read: false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message });
}
