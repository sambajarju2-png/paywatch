import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

const VALID_TYPES = [
  "incasso",
  "aid_org",
  "gemeente",
  "bewindvoerder",
  "kredietbank",
  "journalist",
];

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const delimiter = lines[0].includes("\t") ? "\t" : ",";
  const headers = lines[0].split(delimiter).map((h) => h.trim().toLowerCase().replace(/['"]/g, ""));
  return lines.slice(1).map((line) => {
    const values = line.split(delimiter).map((v) => v.trim().replace(/^["']|["']$/g, ""));
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i] || ""; });
    return row;
  });
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const text = await file.text();
    const rows = parseCSV(text);
    if (rows.length === 0) return NextResponse.json({ error: "No valid rows found" }, { status: 400 });

    let imported = 0;
    let errors = 0;

    for (const row of rows) {
      const orgName = row.organization_name || row.company || row.organisation || row.name || "";
      if (!orgName) { errors++; continue; }

      const type = VALID_TYPES.includes(row.type) ? row.type : "aid_org";

      const { error } = await supabase.from("b2b_contacts").insert({
        organization_name: orgName,
        type,
        website: row.website || null,
        contact_person: row.contact_person || row.journalist || row.name || null,
        contact_role: row.contact_role || row.role || row.title || null,
        contact_email: row.contact_email || row.email || null,
        general_email: row.general_email || null,
        phone: row.phone || row.telephone || null,
        city: row.city || row.plaats || null,
        kvk_number: row.kvk_number || row.kvk || null,
        linkedin_url: row.linkedin_url || row.linkedin || null,
        beat: row.beat || row.specialty || row.focus || null,
        notes: row.notes || null,
        source: "csv_import",
        tags: [],
        status: "new",
      });

      if (error) { console.error("[Import] Row error:", error.message, orgName); errors++; }
      else { imported++; }
    }

    return NextResponse.json({ imported, errors, total: rows.length });
  } catch (err) {
    console.error("[Outreach Import]", err);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
