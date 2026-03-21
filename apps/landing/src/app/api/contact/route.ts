import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, type, subject, message, lang } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Try to save to Supabase if env vars are configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { error } = await supabase.from("contact_submissions").insert({
        name,
        email,
        type: type || "consumer",
        subject: subject || "",
        message,
        lang: lang || "nl",
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Supabase insert error:", error);
        // Don't fail the request — log the error and continue
      }
    } else {
      // Log to console in development
      console.log("Contact form submission (no Supabase configured):", { name, email, type, subject, message, lang });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
