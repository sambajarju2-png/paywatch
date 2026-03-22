import { NextResponse } from "next/server";
import { getBlogPosts } from "@/lib/sanity-queries";

export const revalidate = 60; // ISR: recheck every 60s

export async function GET() {
  const posts = await getBlogPosts();
  return NextResponse.json({ posts });
}
