"use client";

import { useState } from "react";

const REACTION_META: Record<string, { emoji: string }> = {
  heart: { emoji: "❤️" },
  goed: { emoji: "👍" },
  trots: { emoji: "🏆" },
  steun: { emoji: "🤝" },
  sterkte: { emoji: "💪" },
  herkenbaar: { emoji: "🙌" },
  dankbaar: { emoji: "🙏" },
};
function reactionEmoji(type: string) {
  return REACTION_META[type]?.emoji || "💬";
}
function timeAgo(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "Net";
  if (mins < 60) return `${mins} min geleden`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} uur geleden`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} ${days === 1 ? "dag" : "dagen"} geleden`;
  return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
}
function initialsOf(name: string) {
  return name.split(" ").map((n) => n[0]).filter(Boolean).join("").substring(0, 2).toUpperCase() || "?";
}

interface FeedAuthor {
  type: "org" | "user";
  name: string;
  logo_url: string | null;
}
interface FeedComment {
  id: string;
  content: string;
  created_at: string;
  author: FeedAuthor;
}
interface FeedPost {
  id: string;
  content: string;
  created_at: string;
  is_announcement: boolean;
  author: FeedAuthor;
  reactions: Record<string, number>;
  comment_count: number;
  comments: FeedComment[];
}

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

  const [feedOpen, setFeedOpen] = useState<Record<string, boolean>>({});
  const [feedData, setFeedData] = useState<Record<string, FeedPost[]>>({});
  const [feedBusy, setFeedBusy] = useState<Record<string, boolean>>({});

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

  async function toggleFeed(groupId: string) {
    const willOpen = !feedOpen[groupId];
    setFeedOpen((s) => ({ ...s, [groupId]: willOpen }));
    if (willOpen && !(groupId in feedData)) {
      setFeedBusy((s) => ({ ...s, [groupId]: true }));
      try {
        const res = await fetch(`/community/api?action=group_feed&group_id=${encodeURIComponent(groupId)}`);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Kon berichten niet laden");
        setFeedData((s) => ({ ...s, [groupId]: (data.posts || []) as FeedPost[] }));
      } catch (e) {
        setMsg({ kind: "err", text: (e as Error).message });
        setFeedOpen((s) => ({ ...s, [groupId]: false }));
      }
      setFeedBusy((s) => ({ ...s, [groupId]: false }));
    }
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

            {/* Read-only feed of this group's posts, reactions and comments */}
            <div className="mt-3 border-t border-slate-100 pt-3">
              <button
                onClick={() => toggleFeed(g.id)}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                <svg
                  className={`h-3.5 w-3.5 transition-transform ${feedOpen[g.id] ? "rotate-90" : ""}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
                {feedOpen[g.id] ? "Berichten verbergen" : "Berichten bekijken"}
              </button>

              {feedOpen[g.id] && (
                <div className="mt-3 space-y-3">
                  {feedBusy[g.id] && <p className="text-xs text-slate-400">Laden...</p>}
                  {!feedBusy[g.id] && (feedData[g.id] || []).length === 0 && (
                    <p className="text-xs text-slate-400">Nog geen berichten in deze groep.</p>
                  )}
                  {(feedData[g.id] || []).map((post) => (
                    <div key={post.id} className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
                      <div className="flex items-center gap-2">
                        {post.author.logo_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={post.author.logo_url} alt="" className="h-7 w-7 rounded-full object-cover" />
                        ) : (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-700 text-[10px] font-bold text-white">
                            {initialsOf(post.author.name)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-slate-900">{post.author.name}</span>
                            {post.is_announcement && (
                              <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600">
                                Mededeling
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">{timeAgo(post.created_at)}</span>
                        </div>
                      </div>

                      <p className="mt-2 whitespace-pre-wrap text-xs text-slate-700">{post.content}</p>

                      {(Object.keys(post.reactions).length > 0 || post.comment_count > 0) && (
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          {Object.entries(post.reactions).map(([type, count]) => (
                            <span
                              key={type}
                              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-600"
                            >
                              <span>{reactionEmoji(type)}</span>
                              {count}
                            </span>
                          ))}
                          {post.comment_count > 0 && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                              </svg>
                              {post.comment_count}
                            </span>
                          )}
                        </div>
                      )}

                      {post.comments.length > 0 && (
                        <div className="mt-2 space-y-1.5 border-l-2 border-slate-200 pl-3">
                          {post.comments.map((c) => (
                            <div key={c.id} className="text-[11px]">
                              <span className="font-semibold text-slate-700">{c.author.name}</span>
                              <span className="text-slate-400"> · {timeAgo(c.created_at)}</span>
                              <p className="whitespace-pre-wrap text-slate-600">{c.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
