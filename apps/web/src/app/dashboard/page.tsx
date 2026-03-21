"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

interface Bill {
  id: string;
  vendor: string;
  amount: number;
  due_date: string;
  status: string;
  escalation_stage: string;
  estimated_extra_costs: number;
}

const stageColors: Record<string, string> = {
  factuur: "var(--blue)", herinnering: "var(--amber)", aanmaning: "#EA580C", incasso: "var(--red)", deurwaarder: "#991B1B",
};

export default function DashboardPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [mood, setMood] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from("bills")
        .select("id, vendor, amount, due_date, status, escalation_stage, estimated_extra_costs")
        .eq("user_id", user.id);

      setBills(data || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <DashSkeleton />;

  const outstanding = bills.filter((b) => b.status === "outstanding" || b.status === "action");
  const overdue = bills.filter((b) => b.status === "action");
  const upcoming = bills.filter((b) => b.status === "outstanding" && new Date(b.due_date) > new Date());
  const paid = bills.filter((b) => b.status === "settled");
  const totalDebtCents = outstanding.reduce((s, b) => s + (b.amount || 0), 0);
  const savedCents = bills.reduce((s, b) => s + (b.estimated_extra_costs || 0), 0);

  const fmt = (cents: number) => `€ ${(cents / 100).toFixed(2).replace(".", ",")}`;

  return (
    <div className="px-4 py-4 flex flex-col gap-3">
      <h1 className="text-xl font-bold text-[var(--navy)]">Overzicht</h1>

      <div className="grid grid-cols-2 gap-2">
        <StatCard label="Openstaand" value={String(outstanding.length)} color="var(--blue)" />
        <StatCard label="Achterstallig" value={String(overdue.length)} color="var(--red)" />
        <StatCard label="Binnenkort" value={String(upcoming.length)} color="var(--amber)" />
        <StatCard label="Betaald" value={String(paid.length)} color="var(--green)" />
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <p className="text-xs font-medium text-[var(--muted)]">Mijn schulden</p>
        <p className="text-2xl font-extrabold text-[var(--navy)] mt-1">{fmt(totalDebtCents)}</p>
        {savedCents > 0 && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--border)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span className="text-xs font-semibold text-[var(--green)]">{fmt(savedCents)} bespaard</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Link href="/bills" className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] py-3 text-sm font-semibold text-[var(--text)]">Betalingen</Link>
        <Link href="/settings" className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] py-3 text-sm font-semibold text-[var(--text)]">Instellingen</Link>
      </div>

      {/* Mood tracker */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <p className="text-sm font-semibold text-[var(--navy)] mb-3">Hoe voel je je vandaag?</p>
        <div className="flex justify-between">
          {["😰", "😟", "😐", "😌", "😊"].map((emoji, i) => (
            <button key={i} onClick={() => setMood(i)}
              className="w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all"
              style={{
                border: mood === i ? "2px solid var(--blue)" : "1px solid var(--border)",
                background: mood === i ? "color-mix(in srgb, var(--blue) 10%, transparent)" : "transparent",
              }}>{emoji}</button>
          ))}
        </div>
      </div>

      {/* Overdue */}
      {overdue.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-[var(--navy)] mb-2">Achterstallig</h2>
          {overdue.slice(0, 3).map((bill) => (
            <div key={bill.id} className="flex justify-between items-center rounded-xl border border-[var(--red)]/20 bg-[var(--red-light)] p-3 mb-2">
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">{bill.vendor}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: stageColors[bill.escalation_stage] || "var(--red)" }} />
                  <span className="text-[10px] font-semibold" style={{ color: stageColors[bill.escalation_stage] || "var(--red)" }}>{bill.escalation_stage}</span>
                </div>
              </div>
              <p className="text-sm font-bold text-[var(--red)]">{fmt(bill.amount)}</p>
            </div>
          ))}
        </div>
      )}

      {bills.length === 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <p className="text-sm font-semibold text-[var(--navy)] mb-1">Geen rekeningen gevonden</p>
          <p className="text-xs text-[var(--muted)] mb-4">Verbind je Gmail of voeg handmatig een rekening toe.</p>
          <Link href="/bills" className="inline-flex rounded bg-[var(--blue)] px-5 py-2 text-sm font-semibold text-white">Rekening toevoegen</Link>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] p-3" style={{ background: `color-mix(in srgb, ${color} 6%, transparent)` }}>
      <div className="w-6 h-0.5 rounded-full mb-2" style={{ background: color }} />
      <p className="text-[10px] font-medium text-[var(--muted)]">{label}</p>
      <p className="text-lg font-extrabold" style={{ color }}>{value}</p>
    </div>
  );
}

function DashSkeleton() {
  return (
    <div className="px-4 py-4 flex flex-col gap-3 animate-pulse">
      <div className="h-6 w-28 bg-[var(--border)] rounded" />
      <div className="grid grid-cols-2 gap-2">{[1,2,3,4].map(i => <div key={i} className="h-20 bg-[var(--border)] rounded-xl opacity-40" />)}</div>
      <div className="h-24 bg-[var(--border)] rounded-xl opacity-40" />
    </div>
  );
}
