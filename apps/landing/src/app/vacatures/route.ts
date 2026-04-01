import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.redirect(new URL("/jobs", "https://paywatch.app"), 301);
}

export function HEAD() {
  return NextResponse.redirect(new URL("/jobs", "https://paywatch.app"), 301);
}
