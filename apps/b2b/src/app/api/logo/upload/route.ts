import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const SUPER_ADMINS = ["sambajarju2@gmail.com", "reiskenners@gmail.com", "ayeitssamba@gmail.com", "samba@paywatch.nl", "samba@paywatch.app", "mariama@paywatch.nl", "mariama@paywatch.com", "mariama@paywatch.app"];

async function verifySuperAdmin() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !SUPER_ADMINS.includes(user.email?.toLowerCase() || "")) return null;
  return user;
}

const ALLOWED = ["image/png", "image/jpeg", "image/svg+xml", "image/webp"];
const MAX_BYTES = 2 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const user = await verifySuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const slug = ((formData.get("slug") as string) || "org").toLowerCase().replace(/[^a-z0-9-]/g, "") || "org";

  if (!file) return NextResponse.json({ error: "Geen bestand" }, { status: 400 });
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Alleen PNG, JPG, SVG of WebP" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Bestand te groot (max 2MB)" }, { status: 400 });
  }

  const ext = file.type === "image/svg+xml" ? "svg"
    : file.type === "image/png" ? "png"
    : file.type === "image/webp" ? "webp"
    : "jpg";
  const path = `${slug}-${Date.now()}.${ext}`;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from("org-logos").upload(path, buffer, {
    contentType: file.type,
    upsert: true,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = supabase.storage.from("org-logos").getPublicUrl(path);
  return NextResponse.json({ logoUrl: data.publicUrl });
}
