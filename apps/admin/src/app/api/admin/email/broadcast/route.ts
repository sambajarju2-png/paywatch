import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;

const AUDIENCES: Record<string, string> = {
  consumers: "065fa004-bc05-4d75-abaf-67ed1e41872d",
  b2b: "113aa5e0-31d8-4db4-bffd-1ddc42dd675e",
  general: "ee9f4b20-bbd5-4f6f-b98e-ddb1327cbc91",
};

const AUDIENCE_LABELS: Record<string, string> = {
  "065fa004-bc05-4d75-abaf-67ed1e41872d": "Consumers",
  "113aa5e0-31d8-4db4-bffd-1ddc42dd675e": "B2B Partners",
  "ee9f4b20-bbd5-4f6f-b98e-ddb1327cbc91": "General",
};

// GET: Fetch broadcast history from Resend
export async function GET() {
  const admin = await verifyAdmin();
  if (!admin.isAdmin) return admin.response;

  try {
    const res = await fetch("https://api.resend.com/broadcasts", {
      headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Resend broadcasts error:", res.status, text);
      return NextResponse.json({ broadcasts: [], error: `Resend API ${res.status}` });
    }

    const json = await res.json();
    const broadcasts = (json.data || []).map((b: any) => ({
      id: b.id,
      name: b.name,
      audience_id: b.audience_id,
      audience_label: AUDIENCE_LABELS[b.audience_id] || "Unknown",
      from: b.from,
      subject: b.subject,
      status: b.status, // draft, queued, sending, sent
      created_at: b.created_at,
      sent_at: b.sent_at,
      sends: b.sends || 0,
      opens: b.opens || 0,
      clicks: b.clicks || 0,
    }));

    return NextResponse.json({ broadcasts });
  } catch (err) {
    console.error("Broadcast history error:", err);
    return NextResponse.json({ broadcasts: [], error: "Failed to load broadcasts" });
  }
}

// POST: Create and optionally send a broadcast
export async function POST(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin.isAdmin) return admin.response;

  try {
    const body = await req.json();
    const { audience, from, subject, html, sendNow, scheduledAt } = body;

    if (!audience || !from || !subject || !html) {
      return NextResponse.json(
        { error: "Missing required fields: audience, from, subject, html" },
        { status: 400 }
      );
    }

    const audienceId = AUDIENCES[audience];
    if (!audienceId) {
      return NextResponse.json(
        { error: `Invalid audience: ${audience}. Use: consumers, b2b, general` },
        { status: 400 }
      );
    }

    // Step 1: Create the broadcast
    const createRes = await fetch("https://api.resend.com/broadcasts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audience_id: audienceId,
        from,
        subject,
        html,
        name: `${subject} — ${new Date().toLocaleDateString("nl-NL")}`,
      }),
    });

    if (!createRes.ok) {
      const text = await createRes.text();
      console.error("Resend create broadcast error:", createRes.status, text);
      return NextResponse.json(
        { error: `Failed to create broadcast: ${text}` },
        { status: createRes.status }
      );
    }

    const created = await createRes.json();
    const broadcastId = created.id;

    // Step 2: Send immediately (or schedule) if requested
    if (sendNow && broadcastId) {
      const sendBody: Record<string, string> = {};
      if (scheduledAt) {
        sendBody.scheduled_at = scheduledAt;
      }

      const sendRes = await fetch(
        `https://api.resend.com/broadcasts/${broadcastId}/send`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sendBody),
        }
      );

      if (!sendRes.ok) {
        const text = await sendRes.text();
        console.error("Resend send broadcast error:", sendRes.status, text);
        return NextResponse.json({
          id: broadcastId,
          status: "draft",
          warning: `Created as draft but failed to send: ${text}`,
        });
      }

      return NextResponse.json({
        id: broadcastId,
        status: scheduledAt ? "scheduled" : "sent",
        message: scheduledAt
          ? `Broadcast scheduled for ${scheduledAt}`
          : "Broadcast created and sent successfully",
      });
    }

    return NextResponse.json({
      id: broadcastId,
      status: "draft",
      message: "Broadcast created as draft",
    });
  } catch (err) {
    console.error("Create broadcast error:", err);
    return NextResponse.json(
      { error: "Failed to create broadcast" },
      { status: 500 }
    );
  }
}
