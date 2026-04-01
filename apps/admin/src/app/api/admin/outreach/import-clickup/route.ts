import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CLICKUP_API_KEY = process.env.CLICKUP_API_KEY!;
const BILLING_VENDORS_LIST_ID = "901522560378";

// Category detection based on company name patterns
function detectCategory(name: string): string[] {
  const n = name.toLowerCase();

  // Energy
  if (
    ["eneco", "vattenfall", "essent", "greenchoice", "budget energie", "vandebron",
      "energiedirect", "innova energie", "pure energie", "delta energie", "engie",
      "coolblue energie", "tibber", "frank energie", "next energy", "om | new energy",
      "qurrent", "powerpeers"].some((k) => n.includes(k))
  ) return ["energy"];

  // Telecom
  if (
    ["kpn", "t-mobile", "odido", "ziggo", "vodafone", "tele2", "simpel", "hollandsnieuwe",
      "youfone", "lebara", "lycamobile", "ben", "simyo", "budgetmobiel", "50+ mobiel",
      "delta fiber", "xs4all", "caiway"].some((k) => n.includes(k))
  ) return ["telecom"];

  // Insurance
  if (
    ["achmea", "zilveren kruis", "centraal beheer", "interpolis", "cz", "vgz", "menzis",
      "ohra", "a.s.r", "nationale-nederlanden", "nn ", "delta lloyd", "aegon", "allianz",
      "ditzo", "inshared", "fbto", "unive", "iza", "onvz", "dsr", "salland",
      "zorgverzekeraar", "zorgverzekering"].some((k) => n.includes(k))
  ) return ["insurance"];

  // Water utilities
  if (
    ["evides", "waternet", "dunea", "vitens", "brabant water", "pwn", "oasen",
      "waterbedrijf", "waterleiding", "wml"].some((k) => n.includes(k))
  ) return ["water", "utility"];

  // Housing corporations
  if (
    ["woonbron", "woonstad", "havensteder", "alliantie", "rochdale", "stadgenoot",
      "lieven de key", "eigen haard", "portaal", "mitros", "vivare", "ymere",
      "woonzorg", "ssh ", "nijestee", "dudok wonen", "lefier", "woonstede",
      "vestia", "wonen", "wooncompagnie"].some((k) => n.includes(k))
  ) return ["housing", "corporation"];

  // Hospitals
  if (
    ["umc", "ziekenhuis", "mc ", "lumc", "umcg", "olvg", "erasmus mc",
      "radboudumc", "isala", "amphia", "rijnstate", "zuyderland",
      "meander", "maasstad", "antonius", "martini", "catharina",
      "haga", "jeroen bosch", "mst"].some((k) => n.includes(k))
  ) return ["hospital"];

  // Gyms
  if (
    ["basic-fit", "fit for free", "trainmore", "sportcity", "anytime fitness",
      "david lloyd", "fit20", "healthcity"].some((k) => n.includes(k))
  ) return ["gym"];

  // Childcare
  if (
    ["partou", "smallsteps", "humankind", "kibeo", "kinderrijk", "korein",
      "kinderopvang", "bso", "kdv"].some((k) => n.includes(k))
  ) return ["childcare"];

  // Banks
  if (
    ["ing", "rabobank", "abn amro", "bunq", "knab", "triodos", "sns",
      "regiobank", "asn bank"].some((k) => n.includes(k))
  ) return ["bank"];

  // Education
  if (
    ["universiteit", "university", "hogeschool", "hbo", "mbo", "roc ",
      "college", "tu ", "hanze", "saxion", "fontys", "avans", "inholland",
      "windesheim", "nhl stenden", "zuyd", "artez", "codarts",
      "wageningen", "erasmus universiteit", "open universiteit"].some((k) => n.includes(k))
  ) return ["education"];

  // Incasso/collection (these appear in billing vendors too)
  if (
    ["incasso", "deurwaarder", "flanderijn", "ggn", "syncasso", "intrum",
      "riverty", "coeo", "cannock", "direct pay", "payfix", "bosveld",
      "unifin", "lavad", "bouman", "lindorff", "bierens", "straetus",
      "hoist", "intocash", "debtco", "yards", "atradius", "klarna"].some((k) => n.includes(k))
  ) return ["incasso"];

  // Gemeente (municipalities)
  if (n.startsWith("gemeente ")) return ["gemeente"];

  // Streaming/subscriptions
  if (
    ["netflix", "spotify", "disney", "apple", "videoland"].some((k) => n.includes(k))
  ) return ["subscription"];

  // Payment providers
  if (
    ["mollie", "adyen", "buckaroo", "multisafepay", "pay.nl"].some((k) => n.includes(k))
  ) return ["payment_provider"];

  return ["other"];
}

async function fetchClickUpTasks(listId: string): Promise<any[]> {
  const allTasks: any[] = [];
  let page = 0;
  let hasMore = true;

  while (hasMore) {
    const url = `https://api.clickup.com/api/v2/list/${listId}/task?page=${page}&subtasks=false&include_closed=false`;
    const res = await fetch(url, {
      headers: { Authorization: CLICKUP_API_KEY },
    });

    if (!res.ok) {
      console.error(`[ClickUp Import] Page ${page} failed:`, res.status, await res.text());
      break;
    }

    const data = await res.json();
    const tasks = data.tasks || [];
    allTasks.push(...tasks);

    // ClickUp returns 100 per page; if fewer, we're done
    if (tasks.length < 100) {
      hasMore = false;
    } else {
      page++;
    }
  }

  return allTasks;
}

export async function POST() {
  try {
    if (!CLICKUP_API_KEY) {
      return NextResponse.json({ error: "CLICKUP_API_KEY not configured" }, { status: 500 });
    }

    console.log("[ClickUp Import] Starting bulk import from billing vendors list...");

    // 1. Fetch all tasks from ClickUp
    const tasks = await fetchClickUpTasks(BILLING_VENDORS_LIST_ID);
    console.log(`[ClickUp Import] Fetched ${tasks.length} tasks from ClickUp`);

    // 2. Get existing org names to avoid duplicates
    const { data: existing } = await supabase
      .from("b2b_contacts")
      .select("organization_name")
      .eq("type", "billing_vendor");

    const existingNames = new Set(
      (existing || []).map((r: any) => r.organization_name.toLowerCase())
    );

    // 3. Prepare inserts (skip duplicates)
    let imported = 0;
    let skipped = 0;
    let errors = 0;

    for (const task of tasks) {
      const orgName = task.name?.trim();
      if (!orgName) continue;

      // Skip if already exists
      if (existingNames.has(orgName.toLowerCase())) {
        skipped++;
        continue;
      }

      // Extract custom field values
      const customFields = task.custom_fields || [];
      const getFieldValue = (fieldId: string) => {
        const field = customFields.find((f: any) => f.id === fieldId);
        return field?.value || null;
      };

      const website = getFieldValue("091deb29-c134-43ac-99fc-19f0a11cfef9");
      const linkedin = getFieldValue("3f7046d4-bb97-4c91-a0ea-e4d480e1cfa3");
      const contactEmail = getFieldValue("dce4d614-0f59-4c71-aa6d-f8dc399710aa");
      const firstName = getFieldValue("f901b412-b674-4251-a24a-96207fcb65a3");
      const lastName = getFieldValue("f288c48a-75d3-45d4-8ff7-8003246e5c65");
      const category = getFieldValue("f7e43f07-8273-472e-99e4-ad23e8931c53");

      const tags = detectCategory(orgName);
      const contactPerson =
        firstName && lastName
          ? `${firstName} ${lastName}`
          : firstName || lastName || null;

      const { error } = await supabase.from("b2b_contacts").insert({
        organization_name: orgName,
        type: "billing_vendor",
        website: website || null,
        linkedin_url: linkedin || null,
        contact_email: contactEmail || null,
        contact_person: contactPerson,
        tags,
        source: "clickup_import",
        status: "new",
        notes: category ? `Category: ${category}` : null,
      });

      if (error) {
        console.error(`[ClickUp Import] Error inserting ${orgName}:`, error.message);
        errors++;
      } else {
        imported++;
        existingNames.add(orgName.toLowerCase()); // track for this batch
      }
    }

    console.log(
      `[ClickUp Import] Done. Imported: ${imported}, Skipped (dupe): ${skipped}, Errors: ${errors}`
    );

    return NextResponse.json({
      total_in_clickup: tasks.length,
      imported,
      skipped,
      errors,
    });
  } catch (err) {
    console.error("[ClickUp Import] Fatal error:", err);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}

// GET: show current stats
export async function GET() {
  const { data, error } = await supabase
    .from("b2b_contacts")
    .select("type, status, tags")
    .eq("type", "billing_vendor");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const total = data?.length || 0;
  const byStatus: Record<string, number> = {};
  const byTag: Record<string, number> = {};

  for (const row of data || []) {
    byStatus[row.status] = (byStatus[row.status] || 0) + 1;
    for (const tag of row.tags || []) {
      byTag[tag] = (byTag[tag] || 0) + 1;
    }
  }

  return NextResponse.json({ total, byStatus, byTag });
}
