"use client";

import { useState, useEffect, useCallback } from "react";

interface User {
  user_id: string;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  language: string;
  onboarding_complete: boolean;
  gemeente: string | null;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    const res = await fetch(`/api/admin/users?${params}`);
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  }, [search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  async function handleDelete(userId: string) {
    setDeleting(userId);
    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    setConfirmDelete(null);
    setDeleting(null);
    fetchUsers();
  }

  function getName(u: User) {
    if (u.first_name || u.last_name) return [u.first_name, u.last_name].filter(Boolean).join(" ");
    if (u.display_name) return u.display_name;
    return "—";
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">{users.length} users loaded</p>
        </div>
      </div>

      <div className="mb-6">
        <input type="text" placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Name</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Language</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Gemeente</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Onboarded</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Joined</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-sm text-gray-400">Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-sm text-gray-400">No users found</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.user_id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{getName(user)}</p>
                      <p className="text-xs text-gray-400 font-mono">{user.user_id.slice(0, 8)}...</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold uppercase text-gray-500">{user.language || "nl"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-500">{user.gemeente || "—"}</span>
                    </td>
                    <td className="px-4 py-3">
                      {user.onboarding_complete ? (
                        <span className="inline-flex items-center rounded bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">Yes</span>
                      ) : (
                        <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(user.created_at).toLocaleDateString("nl-NL")}</td>
                    <td className="px-4 py-3 text-right">
                      {confirmDelete === user.user_id ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-red-600 font-medium">Delete forever?</span>
                          <button onClick={() => handleDelete(user.user_id)} disabled={deleting === user.user_id}
                            className="rounded bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50">
                            {deleting === user.user_id ? "..." : "Confirm"}
                          </button>
                          <button onClick={() => setConfirmDelete(null)} className="rounded border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDelete(user.user_id)}
                          className="rounded border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors">
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
