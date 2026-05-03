import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdmin } from "@/lib/admin-auth";
import { sendInvoiceEmail } from "@/lib/invoice-email";

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin.isAdmin) return admin.response;

  const { invoice_id } = await req.json();
  if (!invoice_id) return NextResponse.json({ error: "invoice_id required" }, { status: 400 });

  const supabase = getAdmin();

  // Fetch invoice + org
  const { data: invoice } = await supabase
    .from("b2b_invoices")
    .select("*, organizations(name, billing_email, contact_email, invoice_reference, billing_period, billing_notes)")
    .eq("id", invoice_id)
    .single();

  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

  const org = invoice.organizations as any;
  const to = org.billing_email || org.contact_email;

  if (!to) {
    return NextResponse.json({ error: "Geen facturatie e-mailadres ingesteld voor deze organisatie." }, { status: 400 });
  }

  const result = await sendInvoiceEmail({
    to,
    orgName: org.name,
    invoiceNumber: invoice.invoice_number,
    periodStart: invoice.period_start,
    periodEnd: invoice.period_end,
    seatsBilled: invoice.seats_billed,
    amountCents: invoice.amount_cents,
    dueDate: invoice.due_date || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    billingPeriod: org.billing_period || "quarterly",
    invoiceReference: org.invoice_reference || null,
    notes: invoice.notes || org.billing_notes || null,
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  // Mark as sent
  await supabase
    .from("b2b_invoices")
    .update({ status: "sent", sent_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", invoice_id);

  return NextResponse.json({ ok: true, sent_to: to });
}
