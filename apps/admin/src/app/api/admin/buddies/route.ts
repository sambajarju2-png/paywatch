import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET() {
  try {
    const supabase = getAdmin();

    const { data: buddies } = await supabase
      .from("user_buddies")
      .select("*")
      .order("created_at", { ascending: false });

    if (!buddies || buddies.length === 0) {
      return NextResponse.json({
        relationships: [],
        stats: { total: 0, accepted: 0, pending: 0, users_with_buddies: 0 },
      });
    }

    // Get all user IDs involved
    const allUserIds = Array.from(new Set(
      (buddies || []).flatMap((b) => [b.user_id, b.buddy_user_id].filter(Boolean))
    ));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nameMap: Record<string, any> = {};
    if (allUserIds.length > 0) {
      const { data: settings } = await supabase
        .from("user_settings")
        .select("user_id, display_name, first_name, last_name")
        .in("user_id", allUserIds);

      for (const s of settings || []) {
        nameMap[s.user_id] = {
          name: s.display_name || [s.first_name, s.last_name].filter(Boolean).join(" ") || "Onbekend",
        };
      }
    }

    const enriched = (buddies || []).map((b) => ({
      id: b.id,
      user_name: nameMap[b.user_id]?.name || "Onbekend",
      user_id: b.user_id,
      buddy_name: b.buddy_user_id ? (nameMap[b.buddy_user_id]?.name || "Onbekend") : null,
      buddy_user_id: b.buddy_user_id,
      role: b.role,
      status: b.status,
      share_amounts: b.share_amounts,
      notify_on_incasso: b.notify_on_incasso,
      invite_code: b.invite_code,
      created_at: b.created_at,
      accepted_at: b.accepted_at,
    }));

    const accepted = enriched.filter((b) => b.status === "accepted").length;
    const pending = enriched.filter((b) => b.status === "pending").length;
    const usersWithBuddies = new Set(
      enriched.filter((b) => b.status === "accepted").map((b) => b.user_id)
    ).size;

    return NextResponse.json({
      relationships: enriched,
      stats: {
        total: enriched.length,
        accepted,
        pending,
        users_with_buddies: usersWithBuddies,
      },
    });
  } catch (err) {
    console.error("Admin buddies error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
