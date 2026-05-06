"use client";

import { useState } from "react";
import MemberInviteForm from "./MemberInviteForm";

const ROLE_CONFIG: Record<string, { label: string; desc: string; color: string; bg: string; border: string }> = {
  owner:  { label: "Eigenaar",  desc: "Volledige toegang, kan rollen wijzigen", color: "#0A2540", bg: "#F1F5F9", border: "#CBD5E1" },
  admin:  { label: "Admin",     desc: "Gebruikers, instellingen en coaches",    color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE" },
  coach:  { label: "Coach",     desc: "Alleen eigen cliënten bekijken",          color: "#059669", bg: "#F0FDF4", border: "#BBF7D0" },
  viewer: { label: "Viewer",    desc: "Dashboard en gebruikers, alleen-lezen",  color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" },
};

// What each role sees in the sidebar
const ROLE_SECTIONS: Record<string, string[]> = {
  owner:  ["Dashboard", "Gebruikers", "Uitnodigen", "Coaches", "Rapportage", "API", "Teamleden", "Audit log", "Instellingen"],
  admin:  ["Dashboard", "Gebruikers", "Uitnodigen", "Coaches", "Rapportage", "API", "Teamleden", "Audit log", "Instellingen"],
  coach:  ["Mijn cliënten"],
  viewer: ["Dashboard", "Gebruikers"],
};

const PERMISSION_LABELS: Record<string, { label: string; desc: string }> = {
  manage_users:    { label: "Gebruikers beheren", desc: "Cliënten toevoegen en verwijderen" },
  manage_buddies:  { label: "Coaches beheren",    desc: "Coaches toewijzen aan cliënten" },
  view_analytics:  { label: "Rapportage inzien",  desc: "Statistieken en grafieken" },
  manage_settings: { label: "Instellingen",       desc: "Organisatiegegevens wijzigen" },
  api_access:      { label: "API toegang",        desc: "Webhook en API key beheer" },
};

interface Member {
  id: string;
  role: string;
  invite_email: string;
  invite_status: string;
  created_at: string;
  user_id: string | null;
  permissions: Record<string, boolean> | null;
  full_name: string | null;
}

interface Props {
  members: Member[];
  orgId: string;
  currentUserEmail: string;
  tenantColor: string;
  canManage: boolean;
}

const DEFAULT_PERMISSIONS: Record<string, Record<string, boolean>> = {
  owner:  { manage_users: true,  manage_buddies: true,  view_analytics: true,  manage_settings: true,  api_access: true  },
  admin:  { manage_users: true,  manage_buddies: true,  view_analytics: true,  manage_settings: true,  api_access: true  },
  coach:  { manage_users: false, manage_buddies: false, view_analytics: false, manage_settings: false, api_access: false },
  viewer: { manage_users: false, manage_buddies: false, view_analytics: true,  manage_settings: false, api_access: false },
};

export default function RightsClient({ members: initial, orgId, canManage }: Props) {
  const [members, setMembers] = useState<Member[]>(initial);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const [resetting, setResetting] = useState<string | null>(null);
  const [resetMsg, setResetMsg] = useState<{ id: string; msg: string; ok: boolean } | null>(null);

  async function updateMember(memberId: string, patch: { role?: string; permissions?: Record<string, boolean> }) {
    setSaving(memberId);
    try {
      const res = await fetch("/api/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ member_id: memberId, organization_id: orgId, ...patch }),
      });
      if (res.ok) {
        setMembers(prev => prev.map(m => m.id === memberId ? { ...m, ...patch } : m));
      } else {
        const d = await res.json();
        alert(d.error || "Opslaan mislukt");
      }
    } catch { alert("Fout"); } finally { setSaving(null); }
  }

  async function removeMember(memberId: string) {
    if (!confirm("Teamlid verwijderen?")) return;
    setRemoving(memberId);
    try {
      const res = await fetch("/api/members", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ member_id: memberId, organization_id: orgId }),
      });
      if (res.ok) setMembers(prev => prev.filter(m => m.id !== memberId));
      else { const d = await res.json(); alert(d.error || "Verwijderen mislukt"); }
    } catch { alert("Fout"); } finally { setRemoving(null); }
  }

  function getPermissions(m: Member): Record<string, boolean> {
    return m.permissions || DEFAULT_PERMISSIONS[m.role] || DEFAULT_PERMISSIONS.viewer;
  }

  async function resetPassword(memberId: string) {
    setResetting(memberId);
    setResetMsg(null);
    try {
      const res = await fetch("/api/members/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ member_id: memberId, organization_id: orgId }),
      });
      const data = await res.json();
      setResetMsg({ id: memberId, msg: data.message || (res.ok ? "Reset-e-mail verstuurd" : data.error || "Fout"), ok: res.ok });
      setTimeout(() => setResetMsg(null), 6000);
    } catch {
      setResetMsg({ id: memberId, msg: "Fout bij versturen", ok: false });
    } finally {
      setResetting(null);
    }
  }

  function displayName(m: Member): string {
    return m.full_name || m.invite_email;
  }

  function avatarInitials(m: Member): string {
    if (m.full_name) {
      const parts = m.full_name.trim().split(/\s+/);
      return parts.length >= 2
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : m.full_name.substring(0, 2).toUpperCase();
    }
    return (m.invite_email || "?").substring(0, 2).toUpperCase();
  }

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-extrabold text-pw-navy tracking-tight">Rechten & Rollen</h1>
          <p className="text-sm text-pw-muted mt-1">{members.length} teamleden · beheer wie wat kan zien</p>
        </div>
      </div>

      {/* Role overview */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {Object.entries(ROLE_CONFIG).map(([role, cfg]) => {
          const count = members.filter(m => m.role === role).length;
          const sections = ROLE_SECTIONS[role] || [];
          return (
            <div key={role} className="bg-white border rounded-2xl p-4" style={{ borderColor: cfg.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                <span className="text-[11px] font-semibold text-pw-muted">{count} {count === 1 ? "lid" : "leden"}</span>
              </div>
              <p className="text-[11px] text-pw-muted mb-3 leading-relaxed">{cfg.desc}</p>
              <div className="flex flex-wrap gap-1">
                {sections.map(s => (
                  <span key={s} className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-pw-bg text-pw-muted">{s}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Invite form */}
      {canManage && <MemberInviteForm orgId={orgId} tenantColor="#2563EB" />}

      {/* Members list */}
      <div className="bg-white border border-pw-border rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-pw-border bg-pw-bg/50">
          <div className="grid grid-cols-12 gap-4 text-[10px] font-bold text-pw-muted uppercase tracking-widest">
            <div className="col-span-4">Teamlid</div>
            <div className="col-span-2">Rol</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-3">Permissies</div>
          </div>
        </div>

        {members.length === 0 ? (
          <div className="p-12 text-center text-sm text-pw-muted">Nog geen teamleden</div>
        ) : members.map((m, i) => {
          const rc = ROLE_CONFIG[m.role] || ROLE_CONFIG.viewer;
          const perms = getPermissions(m);
          const enabledCount = Object.values(perms).filter(Boolean).length;
          const isExpanded = expanded === m.id;
          const isSaving = saving === m.id;
          const isRemoving = removing === m.id;

          return (
            <div key={m.id} className={`${i < members.length - 1 ? "border-b border-pw-border" : ""}`}>
              {/* Main row */}
              <div
                className="px-5 py-4 grid grid-cols-12 gap-4 items-center hover:bg-pw-bg/20 transition-colors cursor-pointer"
                onClick={() => setExpanded(isExpanded ? null : m.id)}
              >
                {/* Member */}
                <div className="col-span-4 flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-bold flex-shrink-0 text-white"
                    style={{ background: rc.color }}>
                    {avatarInitials(m)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-pw-navy truncate">{displayName(m)}</div>
                    <div className="text-[11px] text-pw-muted truncate">{m.full_name ? m.invite_email : new Date(m.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}</div>
                  </div>
                </div>

                {/* Role */}
                <div className="col-span-2">
                  {canManage ? (
                    <select
                      value={m.role}
                      onClick={e => e.stopPropagation()}
                      onChange={e => {
                        const newRole = e.target.value;
                        // When role changes, reset permissions to role defaults
                        updateMember(m.id, { role: newRole, permissions: DEFAULT_PERMISSIONS[newRole] });
                      }}
                      disabled={isSaving}
                      className="text-[11px] font-bold px-2 py-1 rounded-lg border outline-none cursor-pointer transition-opacity disabled:opacity-50"
                      style={{ background: rc.bg, color: rc.color, borderColor: rc.border }}
                    >
                      <option value="owner">Eigenaar</option>
                      <option value="admin">Admin</option>
                      <option value="coach">Coach</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  ) : (
                    <span className="text-[11px] font-bold px-2 py-1 rounded-lg" style={{ background: rc.bg, color: rc.color }}>{rc.label}</span>
                  )}
                </div>

                {/* Status */}
                <div className="col-span-3 flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${m.invite_status === "accepted" ? "bg-pw-green" : "bg-pw-amber"}`} />
                  <span className={`text-xs font-medium ${m.invite_status === "accepted" ? "text-pw-green" : "text-pw-amber"}`}>
                    {m.invite_status === "accepted" ? "Actief" : "Uitgenodigd"}
                  </span>
                </div>

                {/* Permissions summary */}
                <div className="col-span-3 flex items-center justify-between">
                  <span className="text-[11px] text-pw-muted">{enabledCount}/{Object.keys(perms).length} permissies</span>
                  <div className="flex items-center gap-1">
                    {isSaving && <div className="w-3 h-3 border border-pw-blue border-t-transparent rounded-full animate-spin" />}
                    <svg className={`w-3.5 h-3.5 text-pw-muted transition-transform ${isExpanded ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                </div>
              </div>

              {/* Expanded permissions panel */}
              {isExpanded && (
                <div className="px-5 pb-5 bg-pw-bg/30 border-t border-pw-border">
                  <div className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold text-pw-navy uppercase tracking-widest">Permissies voor {rc.label}</p>
                      <p className="text-[10px] text-pw-muted">Individuele overschrijving naast de rol</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(PERMISSION_LABELS).map(([key, meta]) => {
                        const enabled = perms[key] ?? false;
                        return (
                          <button
                            key={key}
                            onClick={() => {
                              if (!canManage) return;
                              const newPerms = { ...perms, [key]: !enabled };
                              updateMember(m.id, { permissions: newPerms });
                            }}
                            disabled={!canManage || isSaving}
                            className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                              enabled
                                ? "border-pw-blue/20 bg-blue-50/50"
                                : "border-pw-border bg-white opacity-60"
                            } ${canManage ? "hover:opacity-100 cursor-pointer" : "cursor-default"}`}
                          >
                            <div>
                              <div className="text-xs font-semibold text-pw-navy">{meta.label}</div>
                              <div className="text-[10px] text-pw-muted mt-0.5">{meta.desc}</div>
                            </div>
                            <div className={`w-8 h-4 rounded-full relative flex-shrink-0 ml-3 transition-colors ${enabled ? "bg-pw-blue" : "bg-gray-200"}`}>
                              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${enabled ? "left-4" : "left-0.5"}`} />
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {canManage && (
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-pw-border">
                        <button
                          onClick={() => updateMember(m.id, { permissions: DEFAULT_PERMISSIONS[m.role] })}
                          disabled={isSaving}
                          className="text-[11px] text-pw-muted hover:text-pw-text transition-colors"
                        >
                          Herstel standaard voor {rc.label}
                        </button>
                        <div className="flex items-center gap-3">
                          {/* Password reset */}
                          <button
                            onClick={() => resetPassword(m.id)}
                            disabled={resetting === m.id}
                            className="text-[11px] font-semibold text-pw-blue hover:opacity-80 transition-opacity disabled:opacity-50"
                          >
                            {resetting === m.id ? "Versturen..." : "Stuur reset-link"}
                          </button>
                          {resetMsg?.id === m.id && (
                            <span className={`text-[11px] font-medium ${resetMsg.ok ? "text-pw-green" : "text-pw-red"}`}>
                              {resetMsg.msg}
                            </span>
                          )}
                          <button
                            onClick={() => removeMember(m.id)}
                            disabled={isRemoving}
                            className="text-[11px] font-semibold text-pw-red hover:opacity-80 transition-opacity disabled:opacity-50"
                          >
                            {isRemoving ? "Bezig..." : "Verwijder teamlid"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sections reference */}
      <div className="mt-6 bg-white border border-pw-border rounded-2xl p-5">
        <h2 className="text-sm font-bold text-pw-navy mb-3">Welke secties per rol</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-pw-border">
                <th className="text-left pb-2 pr-4 font-semibold text-pw-muted uppercase tracking-wider w-40">Sectie</th>
                {Object.entries(ROLE_CONFIG).map(([role, cfg]) => (
                  <th key={role} className="text-center pb-2 px-3 font-bold" style={{ color: cfg.color }}>{cfg.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {["Dashboard", "Gebruikers", "Uitnodigen", "Coaches", "Rapportage", "API", "Teamleden", "Audit log", "Instellingen"].map(section => (
                <tr key={section} className="border-b border-pw-border/50 last:border-0">
                  <td className="py-2 pr-4 text-pw-text font-medium">{section}</td>
                  {Object.keys(ROLE_CONFIG).map(role => {
                    const has = (ROLE_SECTIONS[role] || []).includes(section);
                    return (
                      <td key={role} className="py-2 px-3 text-center">
                        {has
                          ? <span className="text-pw-green font-bold">✓</span>
                          : <span className="text-pw-muted opacity-30">–</span>
                        }
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
