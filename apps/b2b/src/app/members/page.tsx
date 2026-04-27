"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [orgId, setOrgId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Get org ID from page context (set by middleware via cookie or header)
    // For super admin, we need to select which org
    loadMembers();
  }, []);

  async function loadMembers() {
    // This will be loaded server-side in production
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role, organization_id: orgId }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else {
        setMessage(data.message);
        setEmail("");
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: "32px 40px", maxWidth: 800 }}>
      <h1 className="text-page-heading text-pw-text mb-6">Teamleden</h1>

      <div className="bg-white border border-pw-border rounded-card p-6 mb-6">
        <h2 className="text-section-head text-pw-text mb-4">Nieuw teamlid uitnodigen</h2>
        <form onSubmit={handleInvite} className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-caption text-pw-muted font-medium mb-1">E-mailadres</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="collega@organisatie.nl" required
              className="w-full px-3 py-2 border border-pw-border rounded-input text-label" />
          </div>
          <div>
            <label className="block text-caption text-pw-muted font-medium mb-1">Rol</label>
            <select value={role} onChange={e => setRole(e.target.value)}
              className="px-3 py-2 border border-pw-border rounded-input text-label bg-white">
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
              <option value="coach">Coach</option>
            </select>
          </div>
          <button type="submit" disabled={loading}
            className="px-4 py-2 bg-pw-navy text-white rounded-button text-label font-semibold disabled:opacity-50 cursor-pointer border-none whitespace-nowrap">
            {loading ? "Verzenden..." : "Uitnodigen"}
          </button>
        </form>
        {message && <p className="mt-3 text-caption text-pw-green font-medium">{message}</p>}
        {error && <p className="mt-3 text-caption text-pw-red">{error}</p>}
      </div>
    </div>
  );
}
