import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  const response = NextResponse.redirect(origin);
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
    return response;
  }

  if (token_hash && type) {
    await supabase.auth.verifyOtp({ token_hash, type: type as any });
    // After invite verification, redirect to set-password page
    if (type === "invite" || type === "recovery") {
      return NextResponse.redirect(`${origin}/auth/confirm`);
    }
    return response;
  }

  return NextResponse.redirect(`${origin}/login`);
}
