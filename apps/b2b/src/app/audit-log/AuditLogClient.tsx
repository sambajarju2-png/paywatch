"use client";

import { useState, useMemo } from "react";

const ACTION_LABELS: Record<string, string> = {
  "invite.created": "Uitnodiging aangemaakt",
  "invite.activated": "Uitnodiging geactiveerd",
  "member.invited": "Teamlid uitgenodigd",
  "member.removed": "Teamlid verwijderd",
  "user.consent_granted": "Toestemming verleend",
  "user.consent_revoked": "Toestemming ingetrokken",
  "buddy.assigned": "Coach toegewezen",
  "buddy.removed": "Coach verwijderd",
  "settings.updated": "Instellingen bijgewerkt",
  "api_key.created": "API key aangemaakt",
  "api_key.revoked": "API key ingetrokken",
  "webhook.created": "Webhook aangemaakt",
  "user.data_accessed": "Gebruikersdata bekeken",
};

const ACTOR_LABELS: Record<string, string> = {
  staff: "Medewerker",
  api_key: "API",
  system: "Systeem",
  super_admin: "Super admin",
};

const ACTOR_COLORS: Record<string, string> = {
  system: "#64748B",
  api_key: "#7C3AED",
  super_admin: "#DC2626",
};

const ACTION_GROUPS: Record<string, string[]> = {
  "Uitnodigingen": ["invite.created", "invite.activated"],
  "Teamleden": ["member.invited", "member.removed"],
  "Toestemming": ["user.consent_granted", "user.consent_revoked"],
  "Coaches": ["buddy.assigned", "buddy.removed"],
  "Instellingen": ["settings.updated", "api_key.created", "api_key.revoked", "webhook.created"],
  "Data": ["user.data_accessed"],
};

interface LogEntry {
  id: string;
  actor_id: string;
  actor_type: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  metadata: any;
  created_at: string;
  actorEmail: string | null;
}

export default function AuditLogClient({ logs }: { logs: LogEntry[] }) {
  const [actionFilter, setActionFilter] = useState("all");
  const [actorFilter, setActorFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Get unique actions and actor types from logs
  const uniqueActions = useMemo(() => [...new Set(logs.map(l => l.action))].sort(), [logs]);
  const uniqueActorTypes = useMemo(() => [...new Set(logs.map(l => l.actor_type))].sort(), [logs]);

  const filtered = useMemo(() => {
    let result = logs;
    if (actionFilter !== "all") result = result.filter(l => l.action === actionFilter);
    if (actorFilter !== "all") result = result.filter(l => l.actor_type === actorFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(l =>
        (l.actorEmail || "").toLowerCase().includes(q) ||
        (ACTION_LABELS[l.action] || l.action).toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q)
      );
    }
    return result;
  }, [logs, actionFilter, actorFilter, search]);

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1100 }}>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-[22px] font-extrabold text-pw-navy tracking-tight">Audit log</h1>
        <span className="text-sm text-pw-muted">{filtered.length} van {logs.length} vermeldingen</span>
      </div>
      <p className="text-sm text-pw-muted mb-6">Alle acties worden gelogd voor compliance.</p>

      {/* Filters */}
      <div className="bg-white border border-pw-border rounded-2xl p-4 mb-4 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-48 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pw-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Zoek op actie of medewerker..."
            className="w-full pl-10 pr-4 py-2 bg-pw-bg border border-pw-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pw-blue/20 focus:border-pw-blue transition-all"
          />
        </div>

        <select
          value={actionFilter}
          onChange={e => setActionFilter(e.target.value)}
          className="px-3 py-2 bg-pw-bg border border-pw-border rounded-lg text-sm text-pw-text focus:outline-none min-w-40"
        >
          <option value="all">Alle acties</option>
          {Object.entries(ACTION_GROUPS).map(([group, actions]) => (
            <optgroup key={group} label={group}>
              {actions.filter(a => uniqueActions.includes(a)).map(a => (
                <option key={a} value={a}>{ACTION_LABELS[a] || a}</option>
              ))}
            </optgroup>
          ))}
          {uniqueActions.filter(a => !Object.values(ACTION_GROUPS).flat().includes(a)).map(a => (
            <option key={a} value={a}>{ACTION_LABELS[a] || a}</option>
          ))}
        </select>

        <select
          value={actorFilter}
          onChange={e => setActorFilter(e.target.value)}
          className="px-3 py-2 bg-pw-bg border border-pw-border rounded-lg text-sm text-pw-text focus:outline-none min-w-36"
        >
          <option value="all">Alle actoren</option>
          {uniqueActorTypes.map(t => (
            <option key={t} value={t}>{ACTOR_LABELS[t] || t}</option>
          ))}
        </select>

        {(actionFilter !== "all" || actorFilter !== "all" || search) && (
          <button
            onClick={() => { setActionFilter("all"); setActorFilter("all"); setSearch(""); }}
            className="px-3 py-2 text-sm text-pw-muted hover:text-pw-navy border border-pw-border rounded-lg bg-pw-bg hover:bg-white transition-colors"
          >
            Wissen
          </button>
        )}
      </div>

      <div className="bg-white border border-pw-border rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-pw-muted text-sm">
            {logs.length === 0 ? "Nog geen activiteit gelogd." : "Geen resultaten voor deze filters."}
          </div>
        ) : (
          filtered.map((log) => {
            const actorDisplay = log.actorEmail || ACTOR_LABELS[log.actor_type] || log.actor_type;
            const avatarColor = ACTOR_COLORS[log.actor_type] || "#0A2540";
            const avatarLabel = log.actor_type === "system" ? "SYS" : log.actor_type === "api_key" ? "API" : (actorDisplay || "?").substring(0, 2).toUpperCase();

            return (
              <div key={log.id} className="px-5 py-3.5 border-b border-pw-border/50 last:border-0 flex items-center justify-between hover:bg-pw-bg/40 transition-colors">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                    style={{ backgroundColor: avatarColor }}
                  >
                    {avatarLabel}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-pw-text">{ACTION_LABELS[log.action] || log.action}</div>
                    <div className="text-xs text-pw-muted truncate mt-0.5">
                      {log.actorEmail && log.actorEmail !== log.actor_type ? log.actorEmail : ACTOR_LABELS[log.actor_type] || log.actor_type}
                      {log.target_type && <> &middot; <span className="font-mono">{log.target_type}</span></>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <span className="hidden sm:inline px-2 py-0.5 bg-pw-bg text-pw-muted text-[10px] font-bold rounded-full border border-pw-border">
                    {ACTOR_LABELS[log.actor_type] || log.actor_type}
                  </span>
                  <span className="text-xs text-pw-muted whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString("nl-NL", {
                      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
