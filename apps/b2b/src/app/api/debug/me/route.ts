import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ logged_in: false });

  const SUPER_ADMINS = [
    "sambajarju2@gmail.com", "reiskenners@gmail.com", "ayeitssamba@gmail.com",
    "samba@paywatch.nl", "samba@paywatch.app",
    "mariama@paywatch.nl", "mariama@paywatch.com", "mariama@paywatch.app",
  ];

  return NextResponse.json({
    logged_in: true,
    email: user.email,
    provider: user.app_metadata?.provider,
    is_super_admin: SUPER_ADMINS.includes(user.email?.toLowerCase() || ""),
  });
}
