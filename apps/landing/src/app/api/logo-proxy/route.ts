import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");

    if (!domain) {
      return new NextResponse("Missing domain param", { status: 400 });
    }

    const token = process.env.LOGO_DEV_TOKEN;
    if (!token) {
      return new NextResponse("Logo service unavailable", { status: 500 });
    }

    const logoUrl = `https://img.logo.dev/${encodeURIComponent(domain)}?token=${token}&size=200&format=png`;
    const res = await fetch(logoUrl);

    if (!res.ok) {
      return new NextResponse("Logo not found", { status: 404 });
    }

    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=604800, immutable",
      },
    });
  } catch {
    return new NextResponse("Internal error", { status: 500 });
  }
}
