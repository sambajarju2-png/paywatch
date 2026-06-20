"use client";

import { useState } from "react";

// Reaction vocabulary mirrors the consumer feed (heart / goed / trots / top).
const REACTION_META: Record<string, { emoji: string; label: string }> = {
  heart: { emoji: "❤️", label: "Hart" },
  goed: { emoji: "👏", label: "Goed" },
  trots: { emoji: "💪", label: "Trots" },
  top: { emoji: "⭐", label: "Top" },
  // Historical types still render gracefully if present in older data.
  steun: { emoji: "🤝", label: "Steun" },
  sterkte: { emoji: "💪", label: "Sterkte" },
  herkenbaar: { emoji: "🙌", label: "Herkenbaar" },
  dankbaar: { emoji: "🙏", label: "Dankbaar" },
};
const ORG_REACTION_KEYS = ["heart", "goed", "trots", "top"];
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
  org_reactions: string[];
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

function Avatar({ author, size = 28 }: { author: FeedAuthor; size?: number }) {
  const px = `${size}px`;
  if (author.logo_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={author.logo_url} alt="" style={{ width: px, height: px }} className="flex-shrink-0 rounded-full border border-slate-200 object-cover" />
    );
  }
  return (
    <div
      style={{ width: px, height: px, fontSize: size <= 24 ? 9 : 10 }}
      className="flex flex-shrink-0 items-center justify-center rounded-full bg-slate-700 font-bold text-white"
    >
      {initialsOf(author.name)}
    </div>
  );
}

export default function CommunityClient({ initialGroups, users, primaryColor }: Props) {
  const accent = primaryColor || "#2563EB";
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const [composeText, setComposeText] = useState<Record<string, string>>({});
  const [composeAnnounce, setComposeAnnounce] = useState<Record<string, boolean>>({});
  const [composeBusy, setComposeBusy] = useState<string | null>(null);

  const [memberPick, setMemberPick] = useState<Record<string, string>>({});
  const [memberBusy, setMemberBusy] = useState<string | null>(null);
  const [memberOpen, setMemberOpen] = useState<Record<string, boolean>>({});

  const [feedOpen, setFeedOpen] = useState<Record<string, boolean>>({});
  const [feedData, setFeedData] = useState<Record<string, FeedPost[]>>({});
  const [feedBusy, setFeedBusy] = useState<Record<string, boolean>>({});

  const [reactBusy, setReactBusy] = useState<Record<string, boolean>>({});
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [commentBusy, setCommentBusy] = useState<Record<string, boolean>>({});
  const [replyTarget, setReplyTarget] = useState<Record<string, { id: string; name: string } | null>>({});

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

  function updatePost(groupId: string, postId: string, updater: (p: FeedPost) => FeedPost) {
    setFeedData((s) => ({ ...s, [groupId]: (s[groupId] || []).map((p) => (p.id === postId ? updater(p) : p)) }));
  }

  async function loadFeed(groupId: string) {
    setFeedBusy((s) => ({ ...s, [groupId]: true }));
    try {
      const res = await fetch(`/community/api?action=group_feed&group_id=${encodeURIComponent(groupId)}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Kon berichten niet laden");
      setFeedData((s) => ({ ...s, [groupId]: (data.posts || []) as FeedPost[] }));
    } catch (e) {
      setMsg({ kind: "err", text: (e as Error).message });
    }
    setFeedBusy((s) => ({ ...s, [groupId]: false }));
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

  async function submitCompose(groupId: string) {
    const text = (composeText[groupId] || "").trim();
    if (text.length < 3) {
      setMsg({ kind: "err", text: "Bericht te kort" });
      return;
    }
    const asAnnouncement = !!composeAnnounce[groupId];
    setComposeBusy(groupId);
    setMsg(null);
    try {
      const data = await call({ action: asAnnouncement ? "announce" : "post", group_id: groupId, content: text });
      setComposeText((s) => ({ ...s, [groupId]: "" }));
      setComposeAnnounce((s) => ({ ...s, [groupId]: false }));
      setMsg({
        kind: "ok",
        text: asAnnouncement
          ? `Mededeling geplaatst — ${data.notified} ${data.notified === 1 ? "lid" : "leden"} genotificeerd`
          : "Bericht geplaatst",
      });
      setFeedOpen((s) => ({ ...s, [groupId]: true }));
      await loadFeed(groupId);
    } catch (e) {
      setMsg({ kind: "err", text: (e as Error).message });
    }
    setComposeBusy(null);
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
    if (willOpen && !(groupId in feedData)) await loadFeed(groupId);
  }

  function applyReactionToggle(p: FeedPost, type: string, nowActive: boolean): FeedPost {
    const reactions = { ...p.reactions };
    const next = Math.max(0, (reactions[type] || 0) + (nowActive ? 1 : -1));
    if (next === 0) delete reactions[type];
    else reactions[type] = next;
    const org_reactions = nowActive
      ? Array.from(new Set([...p.org_reactions, type]))
      : p.org_reactions.filter((t) => t !== type);
    return { ...p, reactions, org_reactions };
  }

  async function reactToPost(groupId: string, postId: string, type: string) {
    const key = `${postId}:${type}`;
    if (reactBusy[key]) return;
    const post = (feedData[groupId] || []).find((p) => p.id === postId);
    if (!post) return;
    const nowActive = !post.org_reactions.includes(type);
    setReactBusy((s) => ({ ...s, [key]: true }));
    updatePost(groupId, postId, (p) => applyReactionToggle(p, type, nowActive));
    try {
      await call({ action: "react", post_id: postId, reaction_type: type });
    } catch (e) {
      updatePost(groupId, postId, (p) => applyReactionToggle(p, type, !nowActive));
      setMsg({ kind: "err", text: (e as Error).message });
    }
    setReactBusy((s) => {
      const n = { ...s };
      delete n[key];
      return n;
    });
  }

  async function commentOnPost(groupId: string, postId: string) {
    const text = (commentText[postId] || "").trim();
    if (!text || commentBusy[postId]) return;
    setCommentBusy((s) => ({ ...s, [postId]: true }));
    const parent = replyTarget[postId]?.id;
    try {
      const data = await call({ action: "comment", post_id: postId, content: text, parent_comment_id: parent });
      if (data.comment) {
        updatePost(groupId, postId, (p) => ({
          ...p,
          comments: [...p.comments, data.comment as FeedComment],
          comment_count: p.comment_count + 1,
        }));
      }
      setCommentText((s) => ({ ...s, [postId]: "" }));
      setReplyTarget((s) => ({ ...s, [postId]: null }));
    } catch (e) {
      setMsg({ kind: "err", text: (e as Error).message });
    }
    setCommentBusy((s) => ({ ...s, [postId]: false }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Community</h1>
        <p className="mt-1 text-sm text-slate-500">
          Plaats berichten, reageer en doe mee in je groepen. Sub-groepen zijn privé: alleen leden zien de berichten.
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
        {groups.map((g) => {
          const posts = feedData[g.id] || [];
          return (
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

              {/* Compose: a normal org post, or a Mededeling that notifies members */}
              <div className="mt-4">
                <textarea
                  value={composeText[g.id] || ""}
                  onChange={(e) => setComposeText((s) => ({ ...s, [g.id]: e.target.value }))}
                  rows={2}
                  placeholder="Schrijf een bericht aan deze groep..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
                <div className="mt-2 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={!!composeAnnounce[g.id]}
                      onChange={(e) => setComposeAnnounce((s) => ({ ...s, [g.id]: e.target.checked }))}
                      className="h-3.5 w-3.5 rounded border-slate-300"
                    />
                    Als mededeling versturen (leden krijgen een melding)
                  </label>
                  <button
                    onClick={() => submitCompose(g.id)}
                    disabled={composeBusy === g.id}
                    className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    style={{ background: accent }}
                  >
                    {composeBusy === g.id ? "Versturen..." : "Plaatsen"}
                  </button>
                </div>
              </div>

              {/* Feed (interactive) */}
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
                  {feedOpen[g.id] ? "Berichten verbergen" : "Berichten & reacties"}
                </button>

                {feedOpen[g.id] && (
                  <div className="mt-3 space-y-3">
                    {feedBusy[g.id] && <p className="text-xs text-slate-400">Laden...</p>}
                    {!feedBusy[g.id] && posts.length === 0 && (
                      <p className="text-xs text-slate-400">Nog geen berichten in deze groep.</p>
                    )}
                    {posts.map((post) => (
                      <div key={post.id} className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
                        <div className="flex items-center gap-2">
                          <Avatar author={post.author} size={28} />
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

                        {/* Reaction buttons — org toggles its own reaction of each type */}
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          {ORG_REACTION_KEYS.map((type) => {
                            const count = post.reactions[type] || 0;
                            const active = post.org_reactions.includes(type);
                            return (
                              <button
                                key={type}
                                onClick={() => reactToPost(g.id, post.id, type)}
                                disabled={reactBusy[`${post.id}:${type}`]}
                                title={REACTION_META[type]?.label || type}
                                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] transition-colors disabled:opacity-50 ${
                                  active
                                    ? "border-blue-300 bg-blue-50 text-blue-700"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                }`}
                              >
                                <span>{reactionEmoji(type)}</span>
                                {count > 0 && <span>{count}</span>}
                              </button>
                            );
                          })}
                          {post.comment_count > 0 && (
                            <span className="ml-1 inline-flex items-center gap-1 text-[11px] text-slate-400">
                              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                              </svg>
                              {post.comment_count}
                            </span>
                          )}
                        </div>

                        {/* Comments */}
                        {post.comments.length > 0 && (
                          <div className="mt-2.5 space-y-2 border-l-2 border-slate-200 pl-3">
                            {post.comments.map((c) => (
                              <div key={c.id} className="flex items-start gap-2">
                                <Avatar author={c.author} size={22} />
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-baseline gap-1.5">
                                    <span className="text-[11px] font-semibold text-slate-700">{c.author.name}</span>
                                    <span className="text-[9px] text-slate-400">{timeAgo(c.created_at)}</span>
                                  </div>
                                  <p className="whitespace-pre-wrap text-[11px] text-slate-600">{c.content}</p>
                                  <button
                                    onClick={() => setReplyTarget((s) => ({ ...s, [post.id]: { id: c.id, name: c.author.name } }))}
                                    className="mt-0.5 text-[10px] font-medium text-slate-400 hover:text-blue-600"
                                  >
                                    Beantwoorden
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Comment composer (as the org) */}
                        <div className="mt-2.5">
                          {replyTarget[post.id] && (
                            <div className="mb-1 flex items-center gap-1.5 text-[10px] text-slate-500">
                              <span>Antwoord aan {replyTarget[post.id]?.name}</span>
                              <button
                                onClick={() => setReplyTarget((s) => ({ ...s, [post.id]: null }))}
                                className="text-slate-400 hover:text-slate-700"
                              >
                                ✕
                              </button>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <input
                              value={commentText[post.id] || ""}
                              onChange={(e) => setCommentText((s) => ({ ...s, [post.id]: e.target.value }))}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  commentOnPost(g.id, post.id);
                                }
                              }}
                              placeholder="Reageer als organisatie..."
                              className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-400"
                            />
                            <button
                              onClick={() => commentOnPost(g.id, post.id)}
                              disabled={commentBusy[post.id] || !(commentText[post.id] || "").trim()}
                              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
                              style={{ background: accent }}
                            >
                              {commentBusy[post.id] ? "..." : "Plaats"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Member management (secondary) */}
              <div className="mt-3 border-t border-slate-100 pt-3">
                <button
                  onClick={() => setMemberOpen((s) => ({ ...s, [g.id]: !s[g.id] }))}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  <svg
                    className={`h-3.5 w-3.5 transition-transform ${memberOpen[g.id] ? "rotate-90" : ""}`}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                  Lid toevoegen
                </button>
                {memberOpen[g.id] && (
                  <div className="mt-2 flex gap-2">
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
                )}
                <p className="mt-1.5 text-[11px] text-slate-400">
                  Tip: voeg meerdere leden tegelijk toe via de pagina Gebruikers.
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
