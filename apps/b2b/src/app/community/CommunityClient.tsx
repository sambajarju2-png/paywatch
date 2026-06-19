"use client";

import { useState } from "react";

interface Group {
  id: string;
  name: string;
  description: string | null;
  is_default: boolean;
  member_count: number;
}
interface UserOpt {
  user_org_id: string;
  name: string;
}
interface Props {
  initialGroups: Group[];
  users: UserOpt[];
  primaryColor: string;
}

export default function CommunityClient({ initialGroups, users, primaryColor }: Props) {
  const accent = primaryColor || "#2563EB";
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const [announceText, setAnnounceText] = useState<Record<string, string>>({});
  const [announceBusy, setAnnounceBusy] = useState<string | null>(null);
  const [memberPick, setMemberPick] = useState<Record<string, string>>({});
  const [memberBusy, setMemberBusy] = useState<string | null>(null);

  async function call(body: Record<string, unknown>) {
    const res = await fetch("/community/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Er ging iets mis");
    return data;
  }

  async function createGroup() {
    if (newName.trim().length < 2) {
      setMsg({ kind: "err", text: "Naam te kort" });
      return;
    }
    setCreating(true);
    setMsg(null);
    try {
      const data = await call({ action: "create_group", name: newName.trim(), description: newDesc.trim() || undefined });
      setGroups((g) => [...g, data.group]);
      setNewName("");
      setNewDesc("");
      setMsg({ kind: "ok", text: "Groep aangemaakt" });
    } catch (e) {
      setMsg({ kind: "err", text: (e as Error).message });
    }
    setCreating(false);
  }

  async function announce(groupId: string) {
    const text = (announceText[groupId] || "").trim();
    if (text.length < 3) {
      setMsg({ kind: "err", text: "Bericht te kort" });
      return;
    }
    setAnnounceBusy(groupId);
    setMsg(null);
    try {
      const data = await call({ action: "announce", group_id: groupId, content: text });
      setAnnounceText((s) => ({ ...s, [groupId]: "" }));
      setMsg({ kind: "ok", text: `Mededeling geplaatst — ${data.notified} ${data.notified === 1 ? "lid" : "leden"} genotificeerd` });
    } catch (e) {
      setMsg({ kind: "err", text: (e as Error).message });
    }
    setAnnounceBusy(null);
  }

  async function addMember(groupId: string) {
    const userOrgId = memberPick[groupId];
    if (!userOrgId) {
      setMsg({ kind: "err", text: "Kies een gebruiker" });
      return;
    }
    setMemberBusy(groupId);
    setMsg(null);
    try {
      await call({ action: "add_member", group_id: groupId, user_org_id: userOrgId });
      setGroups((g) => g.map((x) => (x.id === groupId ? { ...x, member_count: x.member_count + 1 } : x)));
      setMemberPick((s) => ({ ...s, [groupId]: "" }));
      setMsg({ kind: "ok", text: "Lid toegevoegd" });
    } catch (e) {
      setMsg({ kind: "err", text: (e as Error).message });
    }
    setMemberBusy(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Community</h1>
        <p className="mt-1 text-sm text-slate-500">
          Beheer je community-groepen en plaats mededelingen. Sub-groepen zijn privé: alleen leden zien de berichten.
        </p>
      </div>

      {msg && (
        <div
          className={`rounded-lg border px-4 py-2.5 text-sm ${
            msg.kind === "ok"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Create sub-group */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">Nieuwe sub-groep</h2>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Naam (bijv. Schuldhulp Noord)"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
          <input
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Omschrijving (optioneel)"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
          <button
            onClick={createGroup}
            disabled={creating}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            style={{ background: accent }}
          >
            {creating ? "Bezig..." : "Aanmaken"}
          </button>
        </div>
      </div>

      {/* Groups */}
      <div className="space-y-4">
        {groups.map((g) => (
          <div key={g.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">{g.name}</h3>
                  {g.is_default && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                      Standaard
                    </span>
                  )}
                </div>
                {g.description && <p className="mt-0.5 text-xs text-slate-500">{g.description}</p>}
              </div>
              <span className="text-xs text-slate-500">
                {g.member_count} {g.member_count === 1 ? "lid" : "leden"}
              </span>
            </div>

            {/* Announce */}
            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">Mededeling plaatsen</label>
              <textarea
                value={announceText[g.id] || ""}
                onChange={(e) => setAnnounceText((s) => ({ ...s, [g.id]: e.target.value }))}
                rows={2}
                placeholder="Schrijf een mededeling voor de leden van deze groep..."
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => announce(g.id)}
                  disabled={announceBusy === g.id}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  style={{ background: accent }}
                >
                  {announceBusy === g.id ? "Versturen..." : "Plaatsen"}
                </button>
              </div>
            </div>

            {/* Add member */}
            <div className="mt-3 border-t border-slate-100 pt-3">
              <label className="text-xs font-medium text-slate-600">Lid toevoegen aan deze groep</label>
              <div className="mt-1 flex gap-2">
                <select
                  value={memberPick[g.id] || ""}
                  onChange={(e) => setMemberPick((s) => ({ ...s, [g.id]: e.target.value }))}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  <option value="">Kies een gebruiker...</option>
                  {users.map((u) => (
                    <option key={u.user_org_id} value={u.user_org_id}>
                      {u.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => addMember(g.id)}
                  disabled={memberBusy === g.id}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
                >
                  {memberBusy === g.id ? "..." : "Toevoegen"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
