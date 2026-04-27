import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain");
  if (!domain) return NextResponse.json({ error: "domain required" }, { status: 400 });

  const token = process.env.LOGO_DEV_TOKEN;
  if (!token) return NextResponse.json({ error: "Logo.dev not configured" }, { status: 500 });

  const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase();
  const logoUrl = `https://img.logo.dev/${cleanDomain}?token=${token}&size=128&format=png`;

  // Test if the logo exists
  try {
    const res = await fetch(logoUrl, { method: "HEAD" });
    if (res.ok) {
      return NextResponse.json({ logoUrl, domain: cleanDomain });
    }
    return NextResponse.json({ logoUrl: null, domain: cleanDomain });
  } catch {
    return NextResponse.json({ logoUrl: null, domain: cleanDomain });
  }
}
