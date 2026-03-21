"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";

interface Bill {
  id: string;
  vendor_name: string;
  amount_cents: number;
  due_date: string;
  status: string;
  escalation_stage: string;
  category: string;
}

const tabs = ["Openstaand", "Binnenkort", "Achterstallig", "Betaald"];
const tabFilters: Record<string, string[]> = {
  Openstaand: ["outstanding", "pending"],
  Binnenkort: ["upcoming"],
  Achterstallig: ["overdue", "critical"],
  Betaald: ["settled"],
};

const stageColors: Record<string, string> = {
  factuur: "var(--blue)", herinnering: "var(--amber)", aanmaning: "#EA580C", incasso: "var(--red)", deurwaarder: "#991B1B",
};
const stageLabels: Record<string, string> = {
  factuur: "Factuur", herinnering: "Herinnering", aanmaning: "Aanmaning", incasso: "Incasso", deurwaarder: "Deurwaarder",
};

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("bills")
        .select("id, vendor_name, amount_cents, due_date, status, escalation_stage, category")
        .eq("user_id", user.id)
        .order("due_date", { ascending: true });

      setBills(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = bills.filter((b) => tabFilters[tabs[activeTab]]?.includes(b.status));
  const fmt = (cents: number) => `€ ${(cents / 100).toFixed(2).replace(".", ",")}`;

  return (
    <div className="px-4 py-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[var(--navy)]">Betalingen</h1>
        <button onClick={() => setShowAdd(!showAdd)}
          className="rounded bg-[var(--blue)] px-3 py-1.5 text-xs font-semibold text-white">
          + Toevoegen
        </button>
      </div>

      {/* Tab filters */}
      <div className="flex gap-1 rounded-lg p-1" style={{ background: "color-mix(in srgb, var(--border) 50%, transparent)" }}>
        {tabs.map((tab, i) => {
          const count = bills.filter((b) => tabFilters[tab]?.includes(b.status)).length;
          return (
            <button key={tab} onClick={() => setActiveTab(i)}
              className={`flex-1 rounded-md py-1.5 text-[10px] font-semibold transition-colors ${
                activeTab === i ? "bg-[var(--surface)] text-[var(--text)] shadow-sm" : "text-[var(--muted)]"
              }`}>
              {tab} {count > 0 && <span className="ml-0.5 opacity-60">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Add bill form (simple) */}
      {showAdd && <AddBillForm onClose={() => setShowAdd(false)} onAdded={(bill) => { setBills([bill, ...bills]); setShowAdd(false); }} />}

      {/* Bill list */}
      {loading ? (
        <div className="flex flex-col gap-2 animate-pulse">
          {[1,2,3,4].map(i => <div key={i} className="h-16 bg-[var(--border)] rounded-xl opacity-40" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <p className="text-sm text-[var(--muted)]">Geen rekeningen in deze categorie</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((bill) => {
            const isOverdue = bill.status === "overdue" || bill.status === "critical";
            const color = stageColors[bill.escalation_stage] || "var(--blue)";
            return (
              <div key={bill.id}
                className="flex items-center gap-3 rounded-xl border p-3"
                style={{
                  borderColor: isOverdue ? "color-mix(in srgb, var(--red) 20%, transparent)" : "var(--border)",
                  background: isOverdue ? "color-mix(in srgb, var(--red) 4%, transparent)" : "var(--surface)",
                }}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text)] truncate">{bill.vendor_name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                    <span className="text-[10px] font-semibold" style={{ color }}>{stageLabels[bill.escalation_stage] || bill.escalation_stage}</span>
                    {bill.category && <span className="text-[10px] text-[var(--muted)] ml-1">{bill.category}</span>}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-[var(--text)]">{fmt(bill.amount_cents)}</p>
                  <p className="text-[10px] text-[var(--muted)]">{bill.due_date}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* Simple add bill form */
function AddBillForm({ onClose, onAdded }: { onClose: () => void; onAdded: (bill: Bill) => void }) {
  const [vendor, setVendor] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const amountCents = Math.round(parseFloat(amount.replace(",", ".")) * 100);

    const { data, error } = await supabase.from("bills").insert({
      user_id: user.id,
      vendor_name: vendor,
      amount_cents: amountCents,
      due_date: dueDate,
      status: "outstanding",
      escalation_stage: "factuur",
      source: "manual",
    }).select().single();

    if (data && !error) {
      onAdded(data as Bill);
    }
    setSaving(false);
  }

  return (
    <div className="rounded-xl border border-[var(--blue)] bg-[var(--surface)] p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-[var(--navy)]">Rekening toevoegen</p>
        <button onClick={onClose} className="text-xs text-[var(--muted)]">Annuleer</button>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
        <input type="text" required placeholder="Leverancier (bijv. Vattenfall)" value={vendor} onChange={(e) => setVendor(e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]" />
        <div className="grid grid-cols-2 gap-2">
          <input type="text" required placeholder="Bedrag (€)" value={amount} onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]" />
          <input type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]" />
        </div>
        <button type="submit" disabled={saving}
          className="w-full rounded-lg bg-[var(--blue)] py-2 text-sm font-semibold text-white disabled:opacity-50">
          {saving ? "Opslaan..." : "Toevoegen"}
        </button>
      </form>
    </div>
  );
}
