"use client";

import { Badge } from "@/components/ui/badge";

const ESCALATION_COLORS: Record<string, string> = {
  factuur: "#2563EB",
  herinnering: "#F59E0B",
  aanmaning: "#F97316",
  incasso: "#DC2626",
  deurwaarder: "#7C3AED",
};

const ESCALATION_LABELS: Record<string, string> = {
  factuur: "Factuur",
  herinnering: "Herinnering",
  aanmaning: "Aanmaning",
  incasso: "Incasso",
  deurwaarder: "Deurwaarder",
};

interface Bill {
  id: string;
  vendor: string;
  amount: number;
  due_date: string | null;
  status: string;
  escalation_stage: string | null;
  category: string | null;
  created_at: string;
}

interface PaymentPlan {
  id: string;
  bill_id: string | null;
  total_terms: number;
  amount_per_term: number;
  payment_day: number | null;
  start_date: string | null;
  status: string;
}

interface Finances {
  netto_inkomen: number | null;
  partner_inkomen: number | null;
  uitkering_inkomen: number | null;
  toeslagen_inkomen: number | null;
  overig_inkomen: number | null;
  monthly_rent: number | null;
  has_partner: boolean | null;
  num_children: number | null;
}

interface AuditEntry {
  action: string;
  actor_id: string | null;
  actor_type: string;
  metadata: Record<string, any> | null;
  created_at: string;
}

interface Props {
  userOrgId: string;
  userId: string;
  name: string;
  email: string;
  status: string;
  externalId: string | null;
  onboardedAt: string | null;
  lastActive: string | null;
  gemeente: string | null;
  language: string;
  onboardingComplete: boolean;
  coachEmail: string | null;
  consent: { contact_info: boolean; view_bills: boolean; financial_overview: boolean; payment_plans: boolean; messaging: boolean };
  finances: Finances | null;
  bills: Bill[];
  paymentPlans: PaymentPlan[];
  auditLog: AuditEntry[];}

function euro(cents: number | null) {
  if (!cents) return "€ 0,00";
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(cents / 100);
}

function relativeTime(d: string | null) {
  if (!d) return "Nooit";
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days === 0) return "Vandaag";
  if (days === 1) return "Gisteren";
  if (days < 7) return `${days} dagen geleden`;
  return new Date(d).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() || "?";
}

const STATUS_MAP: Record<string, { label: string; variant: "success" | "warning" | "default" }> = {
  active: { label: "Actief", variant: "success" },
  invited: { label: "Uitgenodigd", variant: "warning" },
  paused: { label: "Gepauzeerd", variant: "default" },
};

export default function UserDetailClient({
  name, email, status, externalId, onboardedAt, lastActive,
  gemeente, language, onboardingComplete, coachEmail, consent,
  finances, bills, paymentPlans, auditLog,
}: Props) {
  const st = STATUS_MAP[status] || STATUS_MAP.active;

  const totalIncome = finances
    ? (finances.netto_inkomen || 0) + (finances.partner_inkomen || 0) + (finances.uitkering_inkomen || 0) + (finances.toeslagen_inkomen || 0) + (finances.overig_inkomen || 0)
    : 0;

  const outstandingBills = bills.filter((b) => b.status !== "settled");
  const escalatedBills = bills.filter((b) => b.escalation_stage && b.escalation_stage !== "factuur");
  const totalOutstanding = outstandingBills.reduce((s, b) => s + (b.amount || 0), 0);

  return (
    <div>
      {/* Header */}
      <div className="bg-white border border-pw-border rounded-2xl p-6 mb-5 flex items-start gap-5">
        <div className="w-16 h-16 rounded-full bg-pw-navy text-white flex items-center justify-center text-xl font-extrabold flex-shrink-0">
          {initials(name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-[22px] font-extrabold text-pw-navy tracking-tight">{name}</h1>
            <Badge variant={st.variant}>{st.label}</Badge>
            {!onboardingComplete && (
              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[11px] font-semibold">Onboarding niet afgerond</span>
            )}
          </div>
          <p className="text-sm text-pw-muted mt-0.5">{email}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-[12px] text-pw-muted">
            {gemeente && <span>Gemeente: <strong className="text-pw-text">{gemeente}</strong></span>}
            {externalId && <span>Ref: <strong className="font-mono text-pw-text">{externalId}</strong></span>}
            <span>Taal: <strong className="text-pw-text">{language.toUpperCase()}</strong></span>
            <span>Laatste activiteit: <strong className="text-pw-text">{relativeTime(lastActive)}</strong></span>
            {onboardedAt && <span>Onboarded: <strong className="text-pw-text">{new Date(onboardedAt).toLocaleDateString("nl-NL")}</strong></span>}
            <span>Coach: <strong className="text-pw-text">{coachEmail || "Geen"}</strong></span>
          </div>
        </div>
      </div>

      {/* No consent banner */}
      {!consent.view_bills && !consent.financial_overview && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <div>
            <p className="text-sm font-semibold text-amber-800">Geen toestemming voor inzage</p>
            <p className="text-xs text-amber-700 mt-0.5">Deze gebruiker heeft nog geen toestemming gegeven om financiële gegevens te delen. Gegevens worden verborgen totdat toestemming is verleend.</p>
          </div>
        </div>
      )}

      {/* KPI row */}
      {(consent.view_bills || consent.financial_overview) && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          <div className="bg-white border border-pw-border rounded-xl p-4">
            <p className="text-[11px] font-bold text-pw-muted uppercase tracking-wider mb-1">Openstaand</p>
            <p className="text-[20px] font-extrabold text-pw-navy">{euro(totalOutstanding)}</p>
            <p className="text-xs text-pw-muted mt-0.5">{outstandingBills.length} rekening{outstandingBills.length !== 1 ? "en" : ""}</p>
          </div>
          <div className="bg-white border border-pw-border rounded-xl p-4">
            <p className="text-[11px] font-bold text-pw-muted uppercase tracking-wider mb-1">Maandinkomen</p>
            <p className="text-[20px] font-extrabold text-pw-navy">{euro(totalIncome || null)}</p>
            <p className="text-xs text-pw-muted mt-0.5">{finances?.has_partner ? "Incl. partner" : "Alleen eigen"}</p>
          </div>
          <div className="bg-white border border-pw-border rounded-xl p-4">
            <p className="text-[11px] font-bold text-pw-muted uppercase tracking-wider mb-1">Geëscaleerd</p>
            <p className="text-[20px] font-extrabold text-pw-navy">{escalatedBills.length}</p>
            <p className="text-xs text-pw-muted mt-0.5">rekening{escalatedBills.length !== 1 ? "en" : ""} boven factuurstadium</p>
          </div>
          <div className="bg-white border border-pw-border rounded-xl p-4">
            <p className="text-[11px] font-bold text-pw-muted uppercase tracking-wider mb-1">Betalingsregelingen</p>
            <p className="text-[20px] font-extrabold text-pw-navy">{paymentPlans.length}</p>
            <p className="text-xs text-pw-muted mt-0.5">actief</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Bills */}
        <div className="lg:col-span-2 bg-white border border-pw-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-pw-border flex items-center justify-between">
            <h2 className="text-sm font-bold text-pw-navy">Rekeningen</h2>
            {consent.view_bills && <span className="text-xs text-pw-muted">{bills.length} totaal</span>}
          </div>
          {!consent.view_bills ? (
            <div className="py-10 text-center text-sm text-pw-muted">Geen toestemming</div>
          ) : bills.length === 0 ? (
            <div className="py-10 text-center text-sm text-pw-muted">Geen rekeningen gevonden</div>
          ) : (
            <div className="divide-y divide-pw-border">
              {bills.slice(0, 10).map((bill) => {
                const stage = bill.escalation_stage || "factuur";
                const stageColor = ESCALATION_COLORS[stage] || "#64748B";
                const stageLabel = ESCALATION_LABELS[stage] || stage;
                return (
                  <div key={bill.id} className="flex items-center justify-between px-5 py-3 hover:bg-pw-bg/50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: stageColor }} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-pw-text truncate">{bill.vendor}</p>
                        <p className="text-[11px] text-pw-muted">
                          {stageLabel}
                          {bill.due_date && ` · Vervalt ${new Date(bill.due_date).toLocaleDateString("nl-NL")}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-sm font-semibold text-pw-navy">{euro(bill.amount)}</p>
                      <p className="text-[11px] text-pw-muted capitalize">{bill.status}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column: Finances + Payment plans */}
        <div className="flex flex-col gap-5">
          {/* Finances */}
          <div className="bg-white border border-pw-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-pw-border">
              <h2 className="text-sm font-bold text-pw-navy">Financieel overzicht</h2>
            </div>
            {!consent.financial_overview || !finances ? (
              <div className="py-8 text-center text-sm text-pw-muted">{consent.financial_overview ? "Niet ingevuld" : "Geen toestemming"}</div>
            ) : (
              <div className="divide-y divide-pw-border">
                {[
                  { label: "Netto inkomen", val: finances.netto_inkomen },
                  { label: "Partner inkomen", val: finances.partner_inkomen },
                  { label: "Uitkering", val: finances.uitkering_inkomen },
                  { label: "Toeslagen", val: finances.toeslagen_inkomen },
                  { label: "Overig", val: finances.overig_inkomen },
                  { label: "Maandhuur", val: finances.monthly_rent },
                ].filter((r) => r.val).map((row) => (
                  <div key={row.label} className="flex items-center justify-between px-5 py-2.5">
                    <span className="text-xs text-pw-muted">{row.label}</span>
                    <span className="text-xs font-semibold text-pw-navy">{euro(row.val)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-5 py-2.5 bg-pw-bg">
                  <span className="text-xs font-bold text-pw-navy">Totaal inkomen</span>
                  <span className="text-xs font-bold text-pw-navy">{euro(totalIncome)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Payment plans */}
          {consent.payment_plans && paymentPlans.length > 0 && (
            <div className="bg-white border border-pw-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-pw-border">
                <h2 className="text-sm font-bold text-pw-navy">Betalingsregelingen</h2>
              </div>
              <div className="divide-y divide-pw-border">
                {paymentPlans.map((pp) => (
                  <div key={pp.id} className="px-5 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-pw-text">
                        {pp.bill_id ? `Rekening ${pp.bill_id.substring(0, 8)}...` : "Betalingsregeling"}
                      </p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pp.status === "active" ? "bg-green-50 text-pw-green" : "bg-pw-bg text-pw-muted"}`}>
                        {pp.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-pw-muted">
                      {euro(pp.amount_per_term)} / {pp.total_terms} termijnen
                      {pp.start_date && ` · vanaf ${new Date(pp.start_date).toLocaleDateString("nl-NL")}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audit log */}
          {auditLog.length > 0 && (
            <div className="bg-white border border-pw-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-pw-border">
                <h2 className="text-sm font-bold text-pw-navy">Activiteit</h2>
              </div>
              <div className="divide-y divide-pw-border">
                {auditLog.slice(0, 5).map((entry, idx) => (
                  <div key={idx} className="px-5 py-3">
                    <p className="text-xs font-medium text-pw-text">{entry.action}</p>
                    <p className="text-[11px] text-pw-muted mt-0.5">
                      {entry.actor_type} · {relativeTime(entry.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
