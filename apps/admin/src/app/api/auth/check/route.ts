import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { ADMIN_EMAILS } from "@/lib/supabase";

const COOKIE_NAME = "pw-admin-auth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  /* Verify token with Supabase */
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ authenticated: false, error: "Supabase not configured" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    /* Token expired or invalid — clear cookie */
    const response = NextResponse.json({ authenticated: false }, { status: 401 });
    response.cookies.delete(COOKIE_NAME);
    return response;
  }

  /* Verify user is in admin whitelist */
  if (!user.email || !ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    return NextResponse.json({ authenticated: false, error: "Not an admin" }, { status: 403 });
  }

  return NextResponse.json({ authenticated: true, email: user.email });
}
