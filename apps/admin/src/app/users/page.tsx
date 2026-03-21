"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Card, Title, TextInput, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge, Button } from "@tremor/react";

export const dynamic = "force-dynamic";

interface UserRow {
  user_id: string;
  display_name: string;
  language: string;
  gemeente: string | null;
  onboarding_complete: boolean;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const { data } = await supabase
      .from("user_settings")
      .select("user_id, display_name, language, gemeente, onboarding_complete, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    setUsers(data || []);
    setLoading(false);
  }

  async function deleteUser(userId: string) {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    const res = await fetch("/api/admin/delete-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (res.ok) {
      setUsers(users.filter((u) => u.user_id !== userId));
    } else {
      alert("Failed to delete user. Check console.");
    }
  }

  const filtered = users.filter(
    (u) =>
      u.display_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.gemeente?.toLowerCase().includes(search.toLowerCase()) ||
      u.user_id.includes(search)
  );

  return (
    <main className="min-h-screen bg-pw-bg">
      <header className="sticky top-0 z-40 bg-pw-navy text-white">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg">PayWatch</span>
            <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded">Admin</span>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium text-white/70">
            <a href="/" className="hover:text-white transition-colors">Dashboard</a>
            <a href="/users" className="text-white">Users</a>
            <a href="/studio" className="hover:text-white transition-colors">CMS Studio</a>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-page-heading text-pw-navy mb-6">Users ({filtered.length})</h1>

        <Card>
          <div className="mb-4">
            <TextInput
              placeholder="Search by name, gemeente, or user ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="text-pw-muted text-sm py-8 text-center">Loading users...</p>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Gemeente</TableHeaderCell>
                  <TableHeaderCell>Language</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Joined</TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell>{user.display_name || "—"}</TableCell>
                    <TableCell>{user.gemeente || "—"}</TableCell>
                    <TableCell>{user.language?.toUpperCase() || "NL"}</TableCell>
                    <TableCell>
                      <Badge color={user.onboarding_complete ? "green" : "gray"}>
                        {user.onboarding_complete ? "Active" : "Onboarding"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString("nl-NL")}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="xs"
                        color="red"
                        variant="secondary"
                        onClick={() => deleteUser(user.user_id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </main>
  );
}
