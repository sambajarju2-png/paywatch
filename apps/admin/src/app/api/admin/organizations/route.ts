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

// Next invoice number generator: PW-2025-001
async function nextInvoiceNumber(supabase: ReturnType<typeof getAdmin>): Promise<string> {
  const year = new Date().getFullYear();
  const { count } = await supabase
    .from("b2b_invoices")
    .select("id", { count: "exact", head: true });
  const seq = String((count || 0) + 1).padStart(3, "0");
  return `PW-${year}-${seq}`;
}

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin.isAdmin) return admin.response;

  const supabase = getAdmin();

  const [orgsRes, userCountsRes, invoicesRes] = await Promise.all([
    supabase.from("organizations").select("*").order("created_at", { ascending: false }),
    supabase.from("user_organizations").select("organization_id, status"),
    supabase.from("b2b_invoices").select("*").order("created_at", { ascending: false }),
  ]);

  const orgs = orgsRes.data || [];
  const uos = userCountsRes.data || [];
  const invoices = invoicesRes.data || [];

  // Count active users per org
  const seatMap: Record<string, number> = {};
  for (const uo of uos) {
    if (["active", "onboarded"].includes(uo.status)) {
      seatMap[uo.organization_id] = (seatMap[uo.organization_id] || 0) + 1;
    }
  }

  const invoiceMap: Record<string, typeof invoices> = {};
  for (const inv of invoices) {
    if (!invoiceMap[inv.organization_id]) invoiceMap[inv.organization_id] = [];
    invoiceMap[inv.organization_id].push(inv);
  }

  const result = orgs.map(org => ({
    ...org,
    active_seats: seatMap[org.id] || 0,
    invoices: (invoiceMap[org.id] || []).slice(0, 10),
  }));

  return NextResponse.json({ organizations: result });
}

export async function PATCH(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin.isAdmin) return admin.response;

  const body = await req.json();
  const { id, ...fields } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const allowed = [
    "name", "type", "status", "tier", "contact_name", "contact_email", "contact_phone",
    "billing_email", "kvk_number", "website", "city",
    "seat_limit", "price_per_seat", "monthly_fee", "billing_period",
    "contract_start_at", "contract_end_at", "invoice_reference", "billing_notes", "features",
  ];
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const k of allowed) {
    if (k in fields) update[k] = fields[k];
  }

  const supabase = getAdmin();
  const { error } = await supabase.from("organizations").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin.isAdmin) return admin.response;

  const body = await req.json();
  const { action, organization_id } = body;

  if (action === "create_invoice") {
    const supabase = getAdmin();

    const { data: org } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", organization_id)
      .single();

    if (!org) return NextResponse.json({ error: "Org not found" }, { status: 404 });

    // Count active seats
    const { count: seats } = await supabase
      .from("user_organizations")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", organization_id)
      .in("status", ["active", "onboarded"]);

    const activeSeats = seats || 0;

    // Calculate period
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodMap: Record<string, Date> = {
      monthly: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      quarterly: new Date(now.getFullYear(), now.getMonth() + 3, 0),
      annual: new Date(now.getFullYear() + 1, now.getMonth(), 0),
    };
    const periodEnd = periodMap[org.billing_period] || periodMap.quarterly;

    // Amount: fixed fee + per-seat
    const amount = (org.monthly_fee || 0) + ((org.price_per_seat || 0) * activeSeats);

    // Due date = 30 days from now
    const dueDate = new Date(now.getTime() + 30 * 86400000);

    const invoiceNumber = await nextInvoiceNumber(supabase);

    const { data: invoice, error } = await supabase
      .from("b2b_invoices")
      .insert({
        organization_id,
        invoice_number: invoiceNumber,
        period_start: periodStart.toISOString().split("T")[0],
        period_end: periodEnd.toISOString().split("T")[0],
        seats_billed: activeSeats,
        amount_cents: amount,
        status: "draft",
        due_date: dueDate.toISOString().split("T")[0],
        notes: body.notes || null,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, invoice });
  }

  if (action === "update_invoice") {
    const { invoice_id, status, notes } = body;
    const supabase = getAdmin();
    const update: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
    if (notes !== undefined) update.notes = notes;
    if (status === "sent") update.sent_at = new Date().toISOString();
    if (status === "paid") update.paid_at = new Date().toISOString();
    const { error } = await supabase.from("b2b_invoices").update(update).eq("id", invoice_id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
