import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/* Admin credentials — hardcoded for now, move to env vars later */
const ADMIN_ACCOUNTS = [
  { email: "sambajarju2@gmail.com", password: "@Yankuba11" },
  { email: "samba@paywatch.nl", password: "@Yankuba11" },
];

const SESSION_TOKEN = "pw-admin-session-2026";
const COOKIE_NAME = "pw-admin-auth";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const match = ADMIN_ACCOUNTS.find(
    (a) => a.email.toLowerCase() === email?.toLowerCase() && a.password === password
  );

  if (!match) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, SESSION_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(COOKIE_NAME);
  return response;
}
