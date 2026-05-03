import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

async function getPaymentSettings(): Promise<Record<string, string>> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
    const { data } = await supabase.from("paywatch_settings").select("key, value");
    const out: Record<string, string> = {};
    for (const row of data || []) out[row.key] = row.value;
    return out;
  } catch {
    return {};
  }
}

function formatEuro(cents: number): string {
  return "€ " + (cents / 100).toLocaleString("nl-NL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

interface InvoiceEmailOptions {
  to: string;
  orgName: string;
  invoiceNumber: string;
  periodStart: string;   // "2025-01-01"
  periodEnd: string;     // "2025-03-31"
  seatsBilled: number;
  amountCents: number;
  dueDate: string;       // "2025-04-30"
  billingPeriod: string; // "monthly" | "quarterly" | "annual"
  invoiceReference: string | null;
  notes: string | null;
}

export async function sendInvoiceEmail(opts: InvoiceEmailOptions): Promise<{ success: boolean; error?: string }> {
  const resend = getResend();
  if (!resend) return { success: false, error: "RESEND_API_KEY niet geconfigureerd" };

  const ps = await getPaymentSettings();
  const IBAN         = ps.iban         || "—";
  const BIC          = ps.bic          || "—";
  const ACCOUNT_NAME = ps.account_name || "PayWatch";
  const FROM_NAME    = ps.invoice_from_name  || "PayWatch";
  const FROM_EMAIL   = ps.invoice_from_email || "noreply@paywatch.app";
  const KVK          = ps.kvk          || "83474889";
  const BTW          = ps.btw          || "";
  const ADDRESS      = ps.address      || "Rotterdam, Nederland";

  const {
    to, orgName, invoiceNumber, periodStart, periodEnd,
    seatsBilled, amountCents, dueDate, billingPeriod,
    invoiceReference, notes,
  } = opts;

  const periodLabel = billingPeriod === "monthly" ? "maand" : billingPeriod === "quarterly" ? "kwartaal" : "jaar";
  const fmtDate = (d: string) => new Date(d).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });

  const html = `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F4F7FB;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F7FB;padding:40px 20px">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0">

      <!-- Header -->
      <tr><td style="background:#0A2540;padding:28px 36px">
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td>
            <span style="color:#fff;font-size:20px;font-weight:800;letter-spacing:-0.03em">PayWatch</span>
            <p style="margin:2px 0 0;color:rgba(255,255,255,0.5);font-size:12px">Factuur</p>
          </td>
          <td align="right">
            <span style="color:#fff;font-size:22px;font-weight:800">${invoiceNumber}</span>
          </td>
        </tr></table>
      </td></tr>

      <!-- Org info -->
      <tr><td style="padding:28px 36px 0">
        <p style="margin:0 0 4px;font-size:11px;color:#94A3B8;font-weight:600;text-transform:uppercase;letter-spacing:0.06em">Aan</p>
        <p style="margin:0;font-size:15px;font-weight:700;color:#0A2540">${orgName}</p>
        ${invoiceReference ? `<p style="margin:4px 0 0;font-size:12px;color:#64748B">Referentie: ${invoiceReference}</p>` : ""}
      </td></tr>

      <!-- Period + amount -->
      <tr><td style="padding:24px 36px">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border-radius:12px;border:1px solid #E2E8F0">
          <tr>
            <td style="padding:20px 24px;border-right:1px solid #E2E8F0">
              <p style="margin:0 0 4px;font-size:11px;color:#94A3B8;font-weight:600;text-transform:uppercase;letter-spacing:0.06em">Periode</p>
              <p style="margin:0;font-size:14px;font-weight:600;color:#0A2540">${fmtDate(periodStart)} — ${fmtDate(periodEnd)}</p>
              <p style="margin:4px 0 0;font-size:12px;color:#64748B">${seatsBilled} actieve gebruikers · per ${periodLabel}</p>
            </td>
            <td style="padding:20px 24px;text-align:right;white-space:nowrap">
              <p style="margin:0 0 4px;font-size:11px;color:#94A3B8;font-weight:600;text-transform:uppercase;letter-spacing:0.06em">Te betalen</p>
              <p style="margin:0;font-size:28px;font-weight:800;color:#0A2540;letter-spacing:-0.03em">${formatEuro(amountCents)}</p>
              <p style="margin:4px 0 0;font-size:12px;color:#64748B">incl. BTW</p>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- Payment instructions -->
      <tr><td style="padding:0 36px 28px">
        <div style="background:#EFF6FF;border-radius:12px;border:1px solid #BFDBFE;padding:20px 24px">
          <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#1E40AF">Betaalinstructies</p>
          <table cellpadding="0" cellspacing="0" style="font-size:13px;color:#1E3A5F;line-height:1.8">
            <tr><td style="padding-right:16px;color:#64748B;white-space:nowrap">IBAN</td><td><strong>${IBAN}</strong></td></tr>
            <tr><td style="padding-right:16px;color:#64748B;white-space:nowrap">BIC</td><td>${BIC}</td></tr>
            <tr><td style="padding-right:16px;color:#64748B;white-space:nowrap">Ten name van</td><td>${ACCOUNT_NAME}</td></tr>
            <tr><td style="padding-right:16px;color:#64748B;white-space:nowrap">Kenmerk</td><td><strong>${invoiceNumber}</strong></td></tr>
            <tr><td style="padding-right:16px;color:#64748B;white-space:nowrap">Bedrag</td><td><strong>${formatEuro(amountCents)}</strong></td></tr>
            <tr><td style="padding-right:16px;color:#64748B;white-space:nowrap">Vervaldatum</td><td style="color:#DC2626;font-weight:600">${fmtDate(dueDate)}</td></tr>
          </table>
        </div>
      </td></tr>

      ${notes ? `
      <!-- Notes -->
      <tr><td style="padding:0 36px 24px">
        <p style="margin:0 0 6px;font-size:11px;color:#94A3B8;font-weight:600;text-transform:uppercase;letter-spacing:0.06em">Notities</p>
        <p style="margin:0;font-size:13px;color:#64748B;line-height:1.6">${notes}</p>
      </td></tr>` : ""}

      <!-- Footer -->
      <tr><td style="padding:20px 36px;background:#F8FAFC;border-top:1px solid #E2E8F0">
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="font-size:11px;color:#94A3B8">
            ${FROM_NAME} · ${ADDRESS} · KVK ${KVK}
          </td>
          <td align="right" style="font-size:11px;color:#94A3B8">
            samba@paywatch.nl
          </td>
        </tr></table>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  try {
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <noreply@paywatch.app>`,
      reply_to: FROM_EMAIL,
      to,
      subject: `Factuur ${invoiceNumber} — ${orgName} (${formatEuro(amountCents)})`,
      html,
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    console.error("[Invoice email]", err);
    return { success: false, error: err.message };
  }
}
