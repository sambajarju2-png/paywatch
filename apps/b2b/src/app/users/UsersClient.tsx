"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface UserGroup {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  external_id: string;
  last_active: string | null;
  coach_email: string | null;
  gemeente: string | null;
  groups: UserGroup[];
}

interface GroupOpt {
  id: string;
  name: string;
  is_default: boolean;
}

const STATUS_MAP: Record<string, { label: string; variant: "success" | "warning" | "default" }> = {
  active: { label: "Actief", variant: "success" },
  invited: { label: "Uitgenodigd", variant: "warning" },
  paused: { label: "Gepauzeerd", variant: "default" },
};

const PAGE_SIZE = 10;

export default function UsersClient({ users, groups }: { users: User[]; groups: GroupOpt[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<User[]>(users);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkGroup, setBulkGroup] = useState("");
  const [bulkBusy, setBulkBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const filtered = useMemo(() => {
    let result = rows;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(u =>
        u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.external_id?.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") result = result.filter(u => u.status === statusFilter);
    return result;
  }, [rows, search, statusFilter]);

  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const pageIds = paged.map(u => u.id);
  const allOnPageSelected = pageIds.length > 0 && pageIds.every(id => selected.has(id));
  const someOnPageSelected = pageIds.some(id => selected.has(id));

  function toggleAllOnPage() {
    setSelected(prev => {
      const next = new Set(prev);
      if (allOnPageSelected) pageIds.forEach(id => next.delete(id));
      else pageIds.forEach(id => next.add(id));
      return next;
    });
  }

  function toggleOne(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function initials(name: string) {
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  }

  function relativeTime(d: string | null) {
    if (!d) return "Nooit";
    const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
    if (days === 0) return "Vandaag";
    if (days === 1) return "Gisteren";
    if (days < 7) return `${days} dagen geleden`;
    return new Date(d).toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
  }

  async function bulkAdd() {
    if (!bulkGroup) {
      setMsg({ kind: "err", text: "Kies een groep" });
      return;
    }
    const ids = Array.from(selected);
    setBulkBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/community/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add_members_bulk", group_id: bulkGroup, user_org_ids: ids }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Er ging iets mis");

      const grp = groups.find(g => g.id === bulkGroup);
      if (grp) {
        setRows(rs => rs.map(r =>
          selected.has(r.id) && !r.groups.some(x => x.id === grp.id)
            ? { ...r, groups: [...r.groups, { id: grp.id, name: grp.name }] }
            : r
        ));
      }
      setSelected(new Set());
      const n = typeof data.added === "number" ? data.added : ids.length;
      setMsg({ kind: "ok", text: `${n} ${n === 1 ? "gebruiker" : "gebruikers"} toegevoegd aan ${grp?.name || "de groep"}` });
    } catch (e) {
      setMsg({ kind: "err", text: (e as Error).message });
    }
    setBulkBusy(false);
  }

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1100 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-extrabold text-pw-navy tracking-tight">Gebruikers</h1>
          <p className="text-sm text-pw-muted mt-1">{rows.length} gekoppelde gebruikers</p>
        </div>
      </div>

      {msg && (
        <div className={`mb-4 rounded-lg border px-4 py-2.5 text-sm ${
          msg.kind === "ok" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"
        }`}>
          {msg.text}
        </div>
      )}

      <div className="bg-white border border-pw-border rounded-2xl p-4 mb-4 flex items-center gap-4">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pw-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
            placeholder="Zoek op naam, e-mail of referentie..."
            className="w-full pl-10 pr-4 py-2 bg-pw-bg border border-pw-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pw-blue/20 focus:border-pw-blue transition-all" />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(0); }}
          className="px-3 py-2 bg-pw-bg border border-pw-border rounded-lg text-sm text-pw-text focus:outline-none">
          <option value="all">Alle statussen</option>
          <option value="active">Actief</option>
          <option value="invited">Uitgenodigd</option>
          <option value="paused">Gepauzeerd</option>
        </select>
      </div>

      <div className="bg-white border border-pw-border rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-pw-bg border-b border-pw-border">
            <tr>
              <th className="py-3 pl-5 pr-2 w-10">
                <input type="checkbox" aria-label="Selecteer alle gebruikers op deze pagina"
                  checked={allOnPageSelected}
                  ref={el => { if (el) el.indeterminate = !allOnPageSelected && someOnPageSelected; }}
                  onChange={toggleAllOnPage}
                  className="h-4 w-4 rounded border-pw-border accent-pw-blue cursor-pointer" />
              </th>
              <th className="text-left py-3 px-5 text-[11px] font-bold text-pw-muted uppercase tracking-wider">Gebruiker</th>
              <th className="text-left py-3 px-5 text-[11px] font-bold text-pw-muted uppercase tracking-wider">Status</th>
              <th className="text-left py-3 px-5 text-[11px] font-bold text-pw-muted uppercase tracking-wider">Coach</th>
              <th className="text-left py-3 px-5 text-[11px] font-bold text-pw-muted uppercase tracking-wider">Gemeente</th>
              <th className="text-left py-3 px-5 text-[11px] font-bold text-pw-muted uppercase tracking-wider">Laatst actief</th>
              <th className="py-3 px-5 w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pw-border">
            {paged.length === 0 ? (
              <tr><td colSpan={7} className="py-12 text-center text-sm text-pw-muted">Geen gebruikers gevonden</td></tr>
            ) : paged.map((user) => {
              const st = STATUS_MAP[user.status] || STATUS_MAP.active;
              const isSel = selected.has(user.id);
              return (
                <tr key={user.id} onClick={() => router.push(`/users/${user.id}`)}
                  className={`group transition-colors cursor-pointer ${isSel ? "bg-pw-blue/5" : "hover:bg-pw-bg/50"}`}>
                  <td className="py-3 pl-5 pr-2" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" aria-label={`Selecteer ${user.name || user.email}`}
                      checked={isSel} onChange={() => toggleOne(user.id)}
                      className="h-4 w-4 rounded border-pw-border accent-pw-blue cursor-pointer" />
                  </td>
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-pw-navy text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {initials(user.name || user.email)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-pw-navy">{user.name || "Onbekend"}</div>
                        <div className="text-[11px] text-pw-muted mt-0.5">{user.email}</div>
                        {user.external_id && <div className="text-[10px] text-pw-muted font-mono">Ref: {user.external_id}</div>}
                        {user.groups.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {user.groups.slice(0, 2).map(g => (
                              <span key={g.id} className="inline-flex items-center rounded-full bg-pw-bg border border-pw-border px-2 py-0.5 text-[10px] font-medium text-pw-text">
                                {g.name}
                              </span>
                            ))}
                            {user.groups.length > 2 && (
                              <span className="inline-flex items-center rounded-full bg-pw-bg border border-pw-border px-2 py-0.5 text-[10px] font-medium text-pw-muted">
                                +{user.groups.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5"><Badge variant={st.variant}>{st.label}</Badge></td>
                  <td className="py-3 px-5 text-sm text-pw-text">{user.coach_email || <span className="text-pw-muted">—</span>}</td>
                  <td className="py-3 px-5 text-sm text-pw-muted">{user.gemeente || "—"}</td>
                  <td className="py-3 px-5 text-sm text-pw-muted">{relativeTime(user.last_active)}</td>
                  <td className="py-3 px-5">
                    <svg className="w-4 h-4 text-pw-muted group-hover:text-pw-blue transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-pw-border">
            <span className="text-sm text-pw-muted">{page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} van {filtered.length}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
                className="px-3 py-1 text-sm font-medium text-pw-muted bg-pw-bg border border-pw-border rounded-lg disabled:opacity-40">Vorige</button>
              {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                <button key={i} onClick={() => setPage(i)}
                  className={`px-3 py-1 text-sm font-medium rounded-lg border ${i === page ? "bg-pw-navy text-white border-pw-navy" : "text-pw-muted bg-white border-pw-border"}`}>{i + 1}</button>
              ))}
              <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}
                className="px-3 py-1 text-sm font-medium text-pw-muted bg-pw-bg border border-pw-border rounded-lg disabled:opacity-40">Volgende</button>
            </div>
          </div>
        )}
      </div>

      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl border border-pw-border bg-white px-4 py-3 shadow-lg">
          <span className="text-sm font-semibold text-pw-navy whitespace-nowrap">
            {selected.size} geselecteerd
          </span>
          <span className="text-pw-muted">·</span>
          <span className="text-sm text-pw-muted whitespace-nowrap">Toevoegen aan</span>
          <select value={bulkGroup} onChange={e => setBulkGroup(e.target.value)}
            className="px-3 py-1.5 bg-pw-bg border border-pw-border rounded-lg text-sm text-pw-text focus:outline-none focus:ring-2 focus:ring-pw-blue/20 max-w-[200px]">
            <option value="">{groups.length ? "Kies een groep..." : "Geen groepen"}</option>
            {groups.map(g => (
              <option key={g.id} value={g.id}>{g.name}{g.is_default ? " (standaard)" : ""}</option>
            ))}
          </select>
          <button onClick={bulkAdd} disabled={bulkBusy || !bulkGroup}
            className="px-4 py-1.5 text-sm font-semibold text-white rounded-lg bg-pw-blue disabled:opacity-50 whitespace-nowrap">
            {bulkBusy ? "Bezig..." : "Toevoegen"}
          </button>
          <button onClick={() => setSelected(new Set())}
            className="px-3 py-1.5 text-sm font-medium text-pw-muted hover:text-pw-text rounded-lg whitespace-nowrap">
            Wissen
          </button>
        </div>
      )}
    </div>
  );
}
