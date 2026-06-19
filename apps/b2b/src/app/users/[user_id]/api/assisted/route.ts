import { NextResponse, type NextRequest } from "next/server";
import { getTenant, type TenantContext } from "@/lib/tenant";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-server";

type Supa = ReturnType<typeof createSupabaseAdmin>;

const ALLOWED_LANGS = ["nl", "en", "pl", "tr", "fr", "ar"];
const FINANCE_FIELDS = [
  "netto_inkomen",
  "partner_inkomen",
  "uitkering_inkomen",
  "toeslagen_inkomen",
  "overig_inkomen",
  "monthly_rent",
] as const;

async function writeAudit(
  supabase: Supa,
  tenant: TenantContext,
  actorId: string | null,
  targetUserId: string,
  action: string,
  metadata: Record<string, unknown>
) {
  await supabase.from("b2b_audit_log").insert({
    organization_id: tenant.orgId,
    actor_id: actorId,
    actor_type: "staff",
    action,
    target_type: "user",
    target_id: targetUserId,
    metadata,
  });
}

async function writeChange(
  supabase: Supa,
  tenant: TenantContext,
  targetUserId: string,
  changeType: string,
  details: Record<string, unknown>
) {
  await supabase.from("assisted_changes").insert({
    user_id: targetUserId,
    organization_id: tenant.orgId,
    org_name: tenant.orgName,
    change_type: changeType,
    details,
  });
}

/**
 * POST /api/users/[user_id]/assisted
 * Org edits a connected user's data on their behalf (Phase 5).
 * Body: { type: "language", value: "pl" } | { type: "finances", values: {...} }
 * Requires the user's explicit `assisted_entry` consent (and, for finances,
 * `financial_overview`). Every change is audit-logged and recorded for the user.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ user_id: string }> }) {
  const { user_id } = await params; // user_organizations.id
  const [tenant, staff] = await Promise.all([getTenant(), getAuthUser()]);
  if (!staff) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  if (!tenant.orgId) return NextResponse.json({ error: "Geen organisatiecontext" }, { status: 400 });

  const supabase = createSupabaseAdmin();

  // Verify the user belongs to this org and resolve the real auth user id.
  const { data: userOrg } = await supabase
    .from("user_organizations")
    .select("user_id")
    .eq("organization_id", tenant.orgId)
    .eq("id", user_id)
    .single();
  if (!userOrg) return NextResponse.json({ error: "Gebruiker niet gevonden" }, { status: 404 });
  const targetUserId = userOrg.user_id as string;

  // Consent gate: assisted writes require explicit assisted_entry consent.
  const { data: consentRows } = await supabase
    .from("b2b_consents")
    .select("scope, granted")
    .eq("user_id", targetUserId)
    .eq("organization_id", tenant.orgId);
  const granted = new Set((consentRows || []).filter((c: { granted: boolean }) => c.granted).map((c: { scope: string }) => c.scope));
  if (!granted.has("assisted_entry")) {
    return NextResponse.json({ error: "Gebruiker heeft geen toestemming gegeven voor assistentie" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const changeType = body?.type;

  // ── Language ──────────────────────────────────────────────
  if (changeType === "language") {
    const value = body?.value;
    if (typeof value !== "string" || !ALLOWED_LANGS.includes(value)) {
      return NextResponse.json({ error: "Ongeldige taal" }, { status: 400 });
    }
    const { data: cur } = await supabase.from("user_settings").select("language").eq("user_id", targetUserId).single();
    const previous = cur?.language ?? null;
    if (previous === value) return NextResponse.json({ ok: true, unchanged: true });

    const { error: upErr } = await supabase.from("user_settings").update({ language: value }).eq("user_id", targetUserId);
    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

    await writeAudit(supabase, tenant, staff.id, targetUserId, "assisted.language_updated", { language: value, previous });
    await writeChange(supabase, tenant, targetUserId, "language", { language: value, previous });
    return NextResponse.json({ ok: true });
  }

  // ── Finances ──────────────────────────────────────────────
  if (changeType === "finances") {
    if (!granted.has("financial_overview")) {
      return NextResponse.json({ error: "Geen toestemming voor financiële gegevens" }, { status: 403 });
    }
    const values = body?.values;
    if (!values || typeof values !== "object") {
      return NextResponse.json({ error: "Geen gegevens ontvangen" }, { status: 400 });
    }

    // Existing row required (assisted entry edits current finances).
    const { data: cur } = await supabase
      .from("user_finances")
      .select(FINANCE_FIELDS.join(", "))
      .eq("user_id", targetUserId)
      .single();
    if (!cur) return NextResponse.json({ error: "Gebruiker heeft nog geen financiële gegevens" }, { status: 404 });

    const update: Record<string, number> = {};
    const changes: Array<{ key: string; old: number | null; new: number }> = [];
    for (const key of FINANCE_FIELDS) {
      if (key in values) {
        const n = Number(values[key]);
        if (!Number.isFinite(n) || n < 0) {
          return NextResponse.json({ error: `Ongeldige waarde voor ${key}` }, { status: 400 });
        }
        const rounded = Math.round(n);
        update[key] = rounded;
        changes.push({ key, old: (cur as unknown as Record<string, number | null>)[key] ?? null, new: rounded });
      }
    }
    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "Geen geldige velden" }, { status: 400 });
    }

    const { error: upErr } = await supabase
      .from("user_finances")
      .update({ ...update, updated_at: new Date().toISOString() })
      .eq("user_id", targetUserId);
    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

    await writeAudit(supabase, tenant, staff.id, targetUserId, "assisted.finances_updated", { changes });
    await writeChange(supabase, tenant, targetUserId, "finances", { fields: changes.map((c) => c.key) });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Onbekend type" }, { status: 400 });
}
