"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  RefreshCw,
  TrendingUp,
  Plus,
  X,
  Trash2,
  Mail,
  CheckCircle2,
  Shield,
  Flame,
} from "lucide-react";

interface Account {
  id: string;
  email: string;
  display_name: string;
  domain: string;
  daily_limit: number;
  warmup_start_date: string;
  is_active: boolean;
  today_sent: number;
  warmup_day: number;
}

interface WarmupRecipient {
  id: string;
  email: string;
  display_name: string | null;
  provider: string;
  is_active: boolean;
  total_received: number;
  total_replied: number;
  last_sent_at: string | null;
}

const WARMUP_SCHEDULE = [
  { from: 1, to: 7, limit: 5 },
  { from: 8, to: 14, limit: 10 },
  { from: 15, to: 21, limit: 20 },
  { from: 22, to: 28, limit: 30 },
  { from: 29, to: 999, limit: 40 },
];

function getWarmupLimit(day: number): number {
  const tier = WARMUP_SCHEDULE.find((s) => day >= s.from && day <= s.to);
  return tier?.limit || 40;
}

const PROVIDER_COLORS: Record<string, { bg: string; text: string }> = {
  gmail: { bg: "bg-red-50", text: "text-red-600" },
  outlook: { bg: "bg-blue-50", text: "text-pw-blue" },
  hotmail: { bg: "bg-blue-50", text: "text-pw-blue" },
  icloud: { bg: "bg-gray-100", text: "text-gray-600" },
  custom: { bg: "bg-purple-50", text: "text-purple-600" },
};

export default function OutreachAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [recipients, setRecipients] = useState<WarmupRecipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddRecipient, setShowAddRecipient] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newProvider, setNewProvider] = useState("gmail");
  const [addingRecipient, setAddingRecipient] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [accRes, warmupRes] = await Promise.all([
        fetch("/api/admin/outreach/accounts"),
        fetch("/api/admin/outreach/warmup"),
      ]);
      if (accRes.ok) {
        const data = await accRes.json();
        setAccounts(data.accounts);
      }
      if (warmupRes.ok) {
        const data = await warmupRes.json();
        setRecipients(data.recipients);
      }
    } catch {
      console.error("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function addRecipient() {
    if (!newEmail) return;
    setAddingRecipient(true);
    try {
      const res = await fetch("/api/admin/outreach/warmup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail,
          display_name: newName || null,
          provider: newProvider,
        }),
      });
      if (res.ok) {
        setNewEmail("");
        setNewName("");
        setShowAddRecipient(false);
        await fetchData();
      }
    } catch {
      console.error("Add recipient failed");
    } finally {
      setAddingRecipient(false);
    }
  }

  async function removeRecipient(id: string) {
    try {
      await fetch("/api/admin/outreach/warmup", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      await fetchData();
    } catch {
      console.error("Remove recipient failed");
    }
  }

  async function toggleRecipient(id: string, active: boolean) {
    try {
      await fetch("/api/admin/outreach/warmup", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: active }),
      });
      await fetchData();
    } catch {
      console.error("Toggle failed");
    }
  }

  if (loading && accounts.length === 0) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-pw-muted" size={20} />
      </div>
    );
  }

  // Provider breakdown
  const providerCounts = recipients.reduce(
    (acc, r) => {
      acc[r.provider] = (acc[r.provider] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-6">
      {/* Refresh */}
      <div className="flex justify-end">
        <button
          onClick={fetchData}
          className="flex items-center gap-1.5 text-xs text-pw-muted hover:text-pw-text transition-colors"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Sending Accounts */}
      <div>
        <h2 className="text-sm font-bold text-pw-navy mb-3">
          Sending Accounts
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {accounts.map((acc) => {
            const expectedLimit = getWarmupLimit(acc.warmup_day);
            const usagePercent =
              acc.daily_limit > 0
                ? Math.round((acc.today_sent / acc.daily_limit) * 100)
                : 0;
            const warmupPhase = WARMUP_SCHEDULE.findIndex(
              (s) => acc.warmup_day >= s.from && acc.warmup_day <= s.to
            );

            return (
              <div
                key={acc.id}
                className="bg-white rounded-xl border border-pw-border p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-pw-navy truncate">
                      {acc.display_name}
                    </p>
                    <p className="text-[10px] text-pw-muted truncate">
                      {acc.email}
                    </p>
                  </div>
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      acc.is_active ? "bg-pw-green" : "bg-gray-300"
                    }`}
                  />
                </div>

                {/* Warmup progress */}
                <div className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-100 mb-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Flame size={10} className="text-pw-amber" />
                    <span className="text-[10px] font-semibold text-pw-amber">
                      Warmup day {acc.warmup_day}
                    </span>
                  </div>
                  <div className="flex gap-1 mb-1">
                    {WARMUP_SCHEDULE.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i <= warmupPhase
                            ? "bg-pw-amber"
                            : "bg-amber-100"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[9px] text-amber-700">
                    {acc.daily_limit}/day limit · Expected:{" "}
                    {expectedLimit}/day at day {acc.warmup_day}
                  </p>
                </div>

                {/* Daily usage */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] text-pw-muted">
                      Today&apos;s usage
                    </span>
                    <span className="text-[10px] font-semibold text-pw-text">
                      {acc.today_sent}/{acc.daily_limit}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        usagePercent >= 90
                          ? "bg-pw-red"
                          : usagePercent >= 60
                          ? "bg-pw-amber"
                          : "bg-pw-green"
                      }`}
                      style={{ width: `${Math.min(usagePercent, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Domain badge */}
                <div className="mt-3 pt-3 border-t border-pw-border">
                  <div className="flex items-center gap-1">
                    <Shield size={10} className="text-pw-muted" />
                    <span className="text-[10px] text-pw-muted">
                      {acc.domain}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Warmup Recipients */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-pw-navy">
              Warmup Recipients
            </h2>
            <p className="text-[10px] text-pw-muted mt-0.5">
              {recipients.filter((r) => r.is_active).length} active ·{" "}
              {Object.entries(providerCounts)
                .map(([p, c]) => `${c} ${p}`)
                .join(", ")}
            </p>
          </div>
          <button
            onClick={() => setShowAddRecipient(!showAddRecipient)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-pw-blue text-white hover:bg-blue-600 transition-colors"
          >
            <Plus size={10} />
            Add recipient
          </button>
        </div>

        {/* Add recipient form */}
        {showAddRecipient && (
          <div className="bg-white rounded-xl border border-pw-border p-4 mb-3">
            <div className="grid grid-cols-4 gap-2">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="email@example.com"
                className="col-span-2 px-3 py-2 text-xs rounded-lg border border-pw-border focus:outline-none focus:border-pw-blue"
              />
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Display name"
                className="px-3 py-2 text-xs rounded-lg border border-pw-border focus:outline-none focus:border-pw-blue"
              />
              <div className="flex gap-1">
                <select
                  value={newProvider}
                  onChange={(e) => setNewProvider(e.target.value)}
                  className="flex-1 px-2 py-2 text-xs rounded-lg border border-pw-border bg-white focus:outline-none"
                >
                  <option value="gmail">Gmail</option>
                  <option value="outlook">Outlook</option>
                  <option value="hotmail">Hotmail</option>
                  <option value="icloud">iCloud</option>
                  <option value="custom">Custom</option>
                </select>
                <button
                  onClick={addRecipient}
                  disabled={!newEmail || addingRecipient}
                  className="px-3 py-2 text-xs font-semibold rounded-lg bg-pw-blue text-white hover:bg-blue-600 disabled:opacity-50"
                >
                  {addingRecipient ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    "Add"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recipients table */}
        <div className="bg-white rounded-xl border border-pw-border overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-pw-border bg-gray-50/50">
                <th className="text-left px-4 py-2.5 font-semibold text-pw-muted">
                  Email
                </th>
                <th className="text-left px-4 py-2.5 font-semibold text-pw-muted">
                  Provider
                </th>
                <th className="text-center px-4 py-2.5 font-semibold text-pw-muted">
                  Received
                </th>
                <th className="text-center px-4 py-2.5 font-semibold text-pw-muted">
                  Replied
                </th>
                <th className="text-left px-4 py-2.5 font-semibold text-pw-muted">
                  Last sent
                </th>
                <th className="text-center px-4 py-2.5 font-semibold text-pw-muted">
                  Active
                </th>
                <th className="text-right px-4 py-2.5 font-semibold text-pw-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {recipients.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-8 text-pw-muted"
                  >
                    No warmup recipients. Add your email addresses above.
                  </td>
                </tr>
              ) : (
                recipients.map((r) => {
                  const pStyle =
                    PROVIDER_COLORS[r.provider] || PROVIDER_COLORS.custom;
                  return (
                    <tr
                      key={r.id}
                      className="border-b border-pw-border last:border-0 hover:bg-gray-50/50"
                    >
                      <td className="px-4 py-2.5">
                        <div className="font-medium text-pw-text">
                          {r.email}
                        </div>
                        {r.display_name && (
                          <div className="text-[10px] text-pw-muted">
                            {r.display_name}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${pStyle.bg} ${pStyle.text}`}
                        >
                          {r.provider}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-center text-pw-text">
                        {r.total_received}
                      </td>
                      <td className="px-4 py-2.5 text-center text-pw-green font-medium">
                        {r.total_replied}
                      </td>
                      <td className="px-4 py-2.5 text-pw-muted">
                        {r.last_sent_at
                          ? new Date(r.last_sent_at).toLocaleDateString(
                              "nl-NL",
                              {
                                day: "numeric",
                                month: "short",
                              }
                            )
                          : "Never"}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <button
                          onClick={() =>
                            toggleRecipient(r.id, !r.is_active)
                          }
                          className={`w-8 h-4 rounded-full transition-colors relative ${
                            r.is_active ? "bg-pw-green" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
                              r.is_active
                                ? "translate-x-4"
                                : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <button
                          onClick={() => removeRecipient(r.id)}
                          className="p-1 rounded hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={12} className="text-pw-red" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
