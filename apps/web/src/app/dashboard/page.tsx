"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

interface Bill {
  id: string;
  vendor_name: string;
  amount_cents: number;
  due_date: string;
  status: string;
  escalation_stage: string;
}

interface DashData {
  outstanding: number;
  overdue: number;
  upcoming: number;
  paid: number;
  totalDebtCents: number;
  savedCents: number;
  overdueBills: Bill[];
}

const stageColors: Record<string, string> = {
  factuur: "var(--blue)", herinnering: "var(--amber)", aanmaning: "#EA580C", incasso: "var(--red)", deurwaarder: "#991B1B",
};

export default function DashboardPage() {
  const [data, setData] = useState<DashData | null>(null);
  const [mood, setMood] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: bills } = await supabase
        .from("bills")
        .select("id, vendor_name, amount_cents, due_date, status, escalation_stage, extra_costs_cents")
        .eq("user_id", user.id);

      const allBills = bills || [];
      const outstanding = allBills.filter((b) => b.status !== "settled");
      const overdue = allBills.filter((b) => b.status === "overdue" || b.status === "critical");
      const upcoming = allBills.filter((b) => b.status === "upcoming");
      const paid = allBills.filter((b) => b.status === "settled");
      const totalDebt = outstanding.reduce((s, b) => s + (b.amount_cents || 0), 0);
      const saved = allBills.reduce((s, b) => s + (b.extra_costs_cents || 0), 0);

      setData({
        outstanding: outstanding.length,
        overdue: overdue.length,
        upcoming: upcoming.length,
        paid: paid.length,
        totalDebtCents: totalDebt,
        savedCents: saved,
        overdueBills: overdue.slice(0, 3),
      });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <DashSkeleton />;

  const d = data!;
  const fmt = (cents: number) => `€ ${(cents / 100).toFixed(2).replace(".", ",")}`;

  return (
    <div className="px-4 py-4 flex flex-col gap-3">
      <h1 className="text-xl font-bold text-[var(--navy)]">Overzicht</h1>

      {/* 2x2 stat cards */}
      <div className="grid grid-cols-2 gap-2">
        <StatCard label="Openstaand" value={String(d.outstanding)} color="var(--blue)" />
        <StatCard label="Achterstallig" value={String(d.overdue)} color="var(--red)" />
        <StatCard label="Binnenkort" value={String(d.upcoming)} color="var(--amber)" />
        <StatCard label="Betaald" value={String(d.paid)} color="var(--green)" />
      </div>

      {/* Debt summary */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <p className="text-xs font-medium text-[var(--muted)]">Mijn schulden</p>
        <p className="text-2xl font-extrabold text-[var(--navy)] mt-1">{fmt(d.totalDebtCents)}</p>
        {d.savedCents > 0 && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--border)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span className="text-xs font-semibold text-[var(--green)]">{fmt(d.savedCents)} bespaard aan incassokosten</span>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="flex gap-2">
        <Link href="/bills" className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] py-3 text-sm font-semibold text-[var(--text)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          Betalingen
        </Link>
        <Link href="/settings" className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] py-3 text-sm font-semibold text-[var(--text)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          Instellingen
        </Link>
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
              }}>
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Overdue bills */}
      {d.overdueBills.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-[var(--navy)] mb-2">Achterstallig</h2>
          {d.overdueBills.map((bill) => (
            <div key={bill.id} className="flex justify-between items-center rounded-xl border border-[var(--red)]/20 bg-[var(--red-light)] p-3 mb-2">
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">{bill.vendor_name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: stageColors[bill.escalation_stage] || "var(--red)" }} />
                  <span className="text-[10px] font-semibold" style={{ color: stageColors[bill.escalation_stage] || "var(--red)" }}>{bill.escalation_stage}</span>
                </div>
              </div>
              <p className="text-sm font-bold text-[var(--red)]">{fmt(bill.amount_cents)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {d.outstanding === 0 && d.overdue === 0 && d.upcoming === 0 && d.paid === 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1" className="mx-auto mb-3 opacity-40"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 5L2 7"/></svg>
          <p className="text-sm font-semibold text-[var(--navy)] mb-1">Geen rekeningen gevonden</p>
          <p className="text-xs text-[var(--muted)] mb-4">Verbind je Gmail of voeg handmatig een rekening toe.</p>
          <Link href="/bills" className="inline-flex rounded bg-[var(--blue)] px-5 py-2 text-sm font-semibold text-white">
            Rekening toevoegen
          </Link>
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
      <div className="grid grid-cols-2 gap-2">
        {[1,2,3,4].map(i => <div key={i} className="h-20 bg-[var(--border)] rounded-xl opacity-40" />)}
      </div>
      <div className="h-24 bg-[var(--border)] rounded-xl opacity-40" />
      <div className="h-16 bg-[var(--border)] rounded-xl opacity-40" />
    </div>
  );
}
