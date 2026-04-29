"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  external_id: string;
  onboarded_at: string | null;
  last_active: string | null;
  escalation_stage: string | null;
  gemeente: string | null;
}

const STATUS_MAP: Record<string, { label: string; variant: "success" | "warning" | "default" | "error" }> = {
  active: { label: "Actief", variant: "success" },
  invited: { label: "Uitgenodigd", variant: "warning" },
  paused: { label: "Gepauzeerd", variant: "default" },
};

const STAGE_COLORS: Record<string, string> = {
  factuur: "#2563EB", herinnering: "#D97706", aanmaning: "#EA580C", incasso: "#DC2626", deurwaarder: "#7C3AED",
};

const PAGE_SIZE = 10;

export default function UsersClient({ users }: { users: User[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let result = users;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(u =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.external_id?.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") result = result.filter(u => u.status === statusFilter);
    return result;
  }, [users, search, statusFilter]);

  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  function getInitials(name: string) {
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  }

  function relativeTime(dateStr: string | null) {
    if (!dateStr) return "Nooit";
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Vandaag";
    if (days === 1) return "Gisteren";
    if (days < 7) return `${days} dagen geleden`;
    if (days < 30) return `${Math.floor(days / 7)} weken geleden`;
    return new Date(dateStr).toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
  }

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1100 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-extrabold text-pw-navy tracking-tight">Gebruikers</h1>
          <p className="text-sm text-pw-muted mt-1">{users.length} gekoppelde gebruikers</p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="bg-white border border-pw-border rounded-2xl p-4 mb-4 flex items-center gap-4">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pw-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
            placeholder="Zoek op naam, e-mail of referentie..."
            className="w-full pl-10 pr-4 py-2 bg-pw-bg border border-pw-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pw-blue/20 focus:border-pw-blue transition-all"
          />
        </div>
        <select
          value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(0); }}
          className="px-3 py-2 bg-pw-bg border border-pw-border rounded-lg text-sm text-pw-text focus:outline-none focus:ring-2 focus:ring-pw-blue/20"
        >
          <option value="all">Alle statussen</option>
          <option value="active">Actief</option>
          <option value="invited">Uitgenodigd</option>
          <option value="paused">Gepauzeerd</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-pw-border rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-pw-bg border-b border-pw-border">
            <tr>
              <th className="text-left py-3 px-5 text-[11px] font-bold text-pw-muted uppercase tracking-wider">Gebruiker</th>
              <th className="text-left py-3 px-5 text-[11px] font-bold text-pw-muted uppercase tracking-wider">Status</th>
              <th className="text-left py-3 px-5 text-[11px] font-bold text-pw-muted uppercase tracking-wider">Escalatie</th>
              <th className="text-left py-3 px-5 text-[11px] font-bold text-pw-muted uppercase tracking-wider">Gemeente</th>
              <th className="text-left py-3 px-5 text-[11px] font-bold text-pw-muted uppercase tracking-wider">Laatst actief</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pw-border">
            {paged.length === 0 ? (
              <tr><td colSpan={5} className="py-12 text-center text-sm text-pw-muted">Geen gebruikers gevonden</td></tr>
            ) : paged.map((user) => {
              const st = STATUS_MAP[user.status] || STATUS_MAP.active;
              return (
                <tr key={user.id} className="group hover:bg-pw-bg/50 transition-colors">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-pw-navy text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {getInitials(user.name || user.email)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-pw-navy">{user.name || user.email}</div>
                        {user.external_id && <div className="text-[11px] text-pw-muted font-mono mt-0.5">Ref: {user.external_id}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5"><Badge variant={st.variant}>{st.label}</Badge></td>
                  <td className="py-3 px-5">
                    {user.escalation_stage ? (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STAGE_COLORS[user.escalation_stage] || "#64748B" }} />
                        <span className="text-sm font-medium text-pw-text capitalize">{user.escalation_stage}</span>
                      </div>
                    ) : <span className="text-xs text-pw-muted">—</span>}
                  </td>
                  <td className="py-3 px-5 text-sm text-pw-muted">{user.gemeente || "—"}</td>
                  <td className="py-3 px-5 text-sm text-pw-muted">{relativeTime(user.last_active)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-pw-border">
            <span className="text-sm text-pw-muted">
              {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} van {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
                className="px-3 py-1 text-sm font-medium text-pw-muted bg-pw-bg border border-pw-border rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40">
                Vorige
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i)}
                  className={`px-3 py-1 text-sm font-medium rounded-lg border transition-colors ${i === page ? "bg-pw-navy text-white border-pw-navy" : "text-pw-muted bg-white border-pw-border hover:bg-pw-bg"}`}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}
                className="px-3 py-1 text-sm font-medium text-pw-muted bg-pw-bg border border-pw-border rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40">
                Volgende
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
