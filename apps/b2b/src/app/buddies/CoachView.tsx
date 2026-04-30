"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

interface Client {
  buddyId: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string | null;
  onboardedAt: string | null;
}

interface Message {
  id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

function relativeTime(d: string | null) {
  if (!d) return "Nooit";
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days === 0) return "Vandaag";
  if (days === 1) return "Gisteren";
  if (days < 7) return `${days} dagen geleden`;
  return new Date(d).toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
}

function initials(name: string) {
  return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "?";
}

function ChatPanel({
  client,
  coachUserId,
  onClose,
}: {
  client: Client;
  coachUserId: string;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat/${client.buddyId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch {}
    setLoading(false);
  }, [client.buddyId]);

  useEffect(() => {
    fetchMessages();
    // Poll every 8 seconds for new messages
    pollRef.current = setInterval(fetchMessages, 8000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const content = input.trim();
    if (!content || sending) return;
    setSending(true);
    setInput("");
    try {
      const res = await fetch(`/api/chat/${client.buddyId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) await fetchMessages();
    } catch {}
    setSending(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col" style={{ height: "min(80vh, 600px)" }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-pw-border flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-pw-navy text-white flex items-center justify-center text-xs font-bold">
            {initials(client.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-pw-navy truncate">{client.name}</p>
            <p className="text-[11px] text-pw-muted">Laatste activiteit: {relativeTime(client.lastActive)}</p>
          </div>
          <Link
            href={`/users`}
            className="text-xs text-pw-blue font-semibold hover:underline mr-2 no-underline"
            onClick={onClose}
          >
            Dossier
          </Link>
          <button onClick={onClose} className="text-pw-muted hover:text-pw-navy transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-5 h-5 border-2 border-pw-blue border-t-transparent rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-12 h-12 rounded-full bg-pw-bg flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <p className="text-sm text-pw-muted">Nog geen berichten</p>
              <p className="text-xs text-pw-muted mt-1">Stuur een bericht om het gesprek te starten</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_id === coachUserId;
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? "bg-pw-navy text-white rounded-br-md"
                        : "bg-pw-bg text-pw-text rounded-bl-md border border-pw-border"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <p className={`text-[10px] mt-1 ${isMe ? "text-white/60" : "text-pw-muted"}`}>
                      {new Date(msg.created_at).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}
                      {isMe && (
                        <span className="ml-1">{msg.is_read ? "✓✓" : "✓"}</span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-pw-border flex items-end gap-2 flex-shrink-0">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Typ een bericht... (Enter om te sturen)"
            rows={2}
            className="flex-1 resize-none px-3 py-2.5 bg-pw-bg border border-pw-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pw-blue/20 focus:border-pw-blue transition-all"
            style={{ maxHeight: 120 }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || sending}
            className="w-10 h-10 bg-pw-navy text-white rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-40 hover:bg-blue-800 transition-colors"
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CoachView({
  clients,
  coachUserId,
}: {
  clients: Client[];
  coachUserId: string;
}) {
  const [activeChat, setActiveChat] = useState<Client | null>(null);

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1100 }}>
      <div className="mb-6">
        <h1 className="text-[22px] font-extrabold text-pw-navy tracking-tight">Mijn cliënten</h1>
        <p className="text-sm text-pw-muted mt-1">{clients.length} toegewezen cliënt{clients.length !== 1 ? "en" : ""}</p>
      </div>

      {clients.length === 0 ? (
        <div className="bg-white border border-pw-border rounded-2xl p-12 text-center">
          <p className="text-pw-muted text-sm">Geen cliënten toegewezen</p>
          <p className="text-xs text-pw-muted mt-1">Je beheerder wijst cliënten aan je toe via de coachpagina.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {clients.map((client) => (
            <div
              key={client.buddyId}
              className="bg-white border border-pw-border rounded-2xl p-5 hover:border-pw-blue/30 transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-11 h-11 rounded-full bg-pw-navy text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {initials(client.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-pw-navy truncate">{client.name}</p>
                  <p className="text-[11px] text-pw-muted mt-0.5 truncate">{client.email}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-pw-muted">
                    <span className={`inline-flex items-center gap-1 font-semibold ${client.status === "active" ? "text-pw-green" : "text-pw-amber"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${client.status === "active" ? "bg-pw-green" : "bg-pw-amber"}`} />
                      {client.status === "active" ? "Actief" : "Uitgenodigd"}
                    </span>
                    <span>Actief: {relativeTime(client.lastActive)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveChat(client)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-pw-navy text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  Chatten
                </button>
                <Link
                  href="/users"
                  className="px-3 py-2 bg-pw-bg border border-pw-border text-pw-text text-sm font-medium rounded-lg hover:bg-white transition-colors no-underline"
                >
                  Dossier
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeChat && (
        <ChatPanel
          client={activeChat}
          coachUserId={coachUserId}
          onClose={() => setActiveChat(null)}
        />
      )}
    </div>
  );
}
