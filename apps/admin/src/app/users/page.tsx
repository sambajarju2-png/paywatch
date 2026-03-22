"use client";

import { useState, useEffect } from "react";
import AuthGate from "@/components/AuthGate";
import AdminSidebar from "@/components/AdminSidebar";
import { Card, Badge, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@tremor/react";

interface User {
  user_id: string;
  display_name: string;
  first_name: string;
  last_name: string;
  language: string;
  gemeente: string;
  onboarding_complete: boolean;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/users").then(r => r.json()).then(d => setUsers(d.users || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (u.display_name || "").toLowerCase().includes(q) || (u.gemeente || "").toLowerCase().includes(q) || (u.first_name || "").toLowerCase().includes(q);
  });

  const handleDelete = async (userId: string, name: string) => {
    if (!confirm(`Wil je "${name}" en al hun data definitief verwijderen?`)) return;
    setDeleting(userId);
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, { method: "DELETE" });
      const d = await res.json();
      if (d.success) load(); else alert("Fout: " + (d.error || "Onbekend"));
    } catch { alert("Mislukt"); }
    setDeleting(null);
  };

  const getName = (u: User) => u.display_name || `${u.first_name || ""} ${u.last_name || ""}`.trim() || "Onbekend";

  return (
    <AuthGate><AdminSidebar />
      <main className="ml-[220px] min-h-screen p-6 bg-tremor-background dark:bg-dark-tremor-background">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-tremor-title font-bold text-tremor-content-strong dark:text-dark-tremor-content-strong">Gebruikers</h1>
            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content mt-1">{users.length} geregistreerd</p>
          </div>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-tremor-content" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Zoek gebruiker..."
              className="pl-9 pr-4 py-2 rounded-tremor-default border border-tremor-border dark:border-dark-tremor-border text-tremor-default bg-tremor-background dark:bg-dark-tremor-background text-tremor-content-strong dark:text-dark-tremor-content-strong w-72 outline-none focus:ring-2 focus:ring-tremor-brand" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-tremor-brand border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <Card className="!p-0 overflow-hidden">
            <Table>
              <TableHead>
                <TableRow className="border-b border-tremor-border dark:border-dark-tremor-border">
                  <TableHeaderCell>Naam</TableHeaderCell>
                  <TableHeaderCell>Gemeente</TableHeaderCell>
                  <TableHeaderCell>Taal</TableHeaderCell>
                  <TableHeaderCell>Onboarding</TableHeaderCell>
                  <TableHeaderCell>Lid sinds</TableHeaderCell>
                  <TableHeaderCell className="text-right">Actie</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((u) => (
                  <TableRow key={u.user_id} className="hover:bg-tremor-background-muted dark:hover:bg-dark-tremor-background-muted">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">
                          {getName(u)[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">{getName(u)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{u.gemeente || "—"}</TableCell>
                    <TableCell>
                      <Badge color="gray" size="xs">{u.language === "nl" ? "NL" : "EN"}</Badge>
                    </TableCell>
                    <TableCell>
                      {u.onboarding_complete
                        ? <Badge color="emerald">Voltooid</Badge>
                        : <Badge color="amber">Bezig</Badge>
                      }
                    </TableCell>
                    <TableCell className="text-tremor-label">{u.created_at ? new Date(u.created_at).toLocaleDateString("nl-NL") : "—"}</TableCell>
                    <TableCell className="text-right">
                      <button onClick={() => handleDelete(u.user_id, getName(u))} disabled={deleting === u.user_id}
                        className="text-tremor-label font-medium text-tremor-content hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50 transition-colors">
                        {deleting === u.user_id ? "..." : "Verwijder"}
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-tremor-content">{search ? "Geen resultaten" : "Nog geen gebruikers"}</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        )}
      </main>
    </AuthGate>
  );
}
