import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// POST — Verify a single contact's email via DeBounce
// Body: { contactId } or { contactIds: string[] } for bulk
export async function POST(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const body = await req.json();

    const DEBOUNCE_KEY = process.env.DEBOUNCE_API_KEY;
    if (!DEBOUNCE_KEY) {
      return NextResponse.json(
        { error: "DEBOUNCE_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Support single or bulk
    const contactIds: string[] = body.contactIds || (body.contactId ? [body.contactId] : []);
    if (contactIds.length === 0) {
      return NextResponse.json(
        { error: "contactId or contactIds required" },
        { status: 400 }
      );
    }

    // Fetch contacts
    const { data: contacts, error: fetchError } = await supabase
      .from("b2b_contacts")
      .select("id, contact_email, general_email, organization_name, status")
      .in("id", contactIds);

    if (fetchError || !contacts || contacts.length === 0) {
      return NextResponse.json(
        { error: "Contacts not found" },
        { status: 404 }
      );
    }

    const results: { id: string; email: string; result: string; valid: boolean }[] = [];

    for (const contact of contacts) {
      const email = contact.contact_email || contact.general_email;
      if (!email) {
        results.push({
          id: contact.id,
          email: "",
          result: "no_email",
          valid: false,
        });
        continue;
      }

      try {
        const res = await fetch(
          `https://api.debounce.io/v1/?api=${DEBOUNCE_KEY}&email=${encodeURIComponent(email)}`
        );
        const data = await res.json();
        const debounce = data.debounce || {};

        // debounce.result: "Safe to Send" | "Invalid" | "Disposable" | "Role" | "Unknown" | etc.
        const resultStr = debounce.result || "Unknown";
        const isValid =
          resultStr === "Safe to Send" || resultStr === "Role";

        // Mark invalid/disposable contacts as bounced
        if (
          resultStr === "Invalid" ||
          resultStr === "Disposable"
        ) {
          await supabase
            .from("b2b_contacts")
            .update({ status: "bounced" })
            .eq("id", contact.id);
        }

        results.push({
          id: contact.id,
          email,
          result: resultStr,
          valid: isValid,
        });

        // Rate limit: DeBounce allows ~10 req/sec, we'll be safe
        await new Promise((r) => setTimeout(r, 150));
      } catch (err) {
        console.error(
          `[Verify] Error for ${contact.organization_name}:`,
          err
        );
        results.push({
          id: contact.id,
          email,
          result: "error",
          valid: false,
        });
      }
    }

    const valid = results.filter((r) => r.valid).length;
    const invalid = results.filter((r) => !r.valid).length;

    return NextResponse.json({
      verified: results.length,
      valid,
      invalid,
      results,
    });
  } catch (err) {
    console.error("[Verify]", err);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
