import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin.isAdmin) return admin.response;

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const supabase = getAdmin();
    const { data: app } = await supabase
      .from("job_applications")
      .select("cv_url")
      .eq("id", id)
      .single();

    const path = app?.cv_url as string | null | undefined;
    if (!path) return NextResponse.json({ error: "No CV" }, { status: 404 });

    // Defensive: if an absolute URL was ever stored, return it directly.
    if (/^https?:\/\//i.test(path)) return NextResponse.json({ url: path });

    const { data, error } = await supabase.storage
      .from("job-applications")
      .createSignedUrl(path, 300);

    if (error || !data?.signedUrl) {
      console.error("CV signed URL error:", error ? JSON.stringify(error) : "no url");
      return NextResponse.json({ error: "Sign failed" }, { status: 500 });
    }

    return NextResponse.json({ url: data.signedUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
