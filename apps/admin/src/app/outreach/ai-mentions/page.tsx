"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  AlertTriangle,
  RefreshCw,
  Bot,
  Check,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Play,
} from "lucide-react";

interface MentionCheck {
  id: string;
  model: string;
  prompt: string;
  response: string;
  mentioned: boolean;
  mention_context: string | null;
  url_cited: boolean;
  cited_url: string | null;
  checked_at: string;
}

interface Stats {
  total: number;
  mentioned: number;
  urlCited: number;
  mentionRate: number;
}

interface ByModel {
  [key: string]: { total: number; mentioned: number; rate: number };
}

const MODEL_LABELS: Record<string, string> = {
  claude: "Claude",
  gemini: "Gemini",
  chatgpt: "ChatGPT",
};

const MODEL_COLORS: Record<string, string> = {
  claude: "bg-orange-50 text-orange-700",
  gemini: "bg-blue-50 text-blue-700",
  chatgpt: "bg-green-50 text-green-700",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AIMentionsPage() {
  const [checks, setChecks] = useState<MentionCheck[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [byModel, setByModel] = useState<ByModel>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (model !== "all") params.set("model", model);
      const res = await fetch(`/api/admin/ai-mentions?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setChecks(data.checks || []);
      setStats(data.stats || null);
      setByModel(data.byModel || {});
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [model]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function runNow() {
    setRunning(true);
    try {
      const res = await fetch("/api/admin/ai-mentions/cron");
      if (!res.ok) throw new Error("Check failed");
      const data = await res.json();
      alert(`Klaar! ${data.checked} prompts gecontroleerd, ${data.mentioned} vermeldingen gevonden. Actieve modellen: ${data.models?.join(", ") || "geen"}`);
      fetchData();
    } catch {
      alert("AI mention check mislukt");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-pw-blue" />
          <h2 className="text-lg font-bold text-pw-navy">AI Mention Tracker</h2>
        </div>
        <button
          onClick={runNow}
          disabled={running}
          className="flex items-center gap-1.5 text-xs font-semibold text-white bg-pw-blue hover:bg-pw-navy px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {running ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
          Nu checken
        </button>
      </div>

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <div className="bg-white border border-pw-border rounded-lg px-4 py-3">
            <div className="text-xl font-bold text-pw-navy">{stats.total}</div>
            <div className="text-[11px] text-pw-muted font-medium">Totaal checks</div>
          </div>
          <div className="bg-white border border-pw-border rounded-lg px-4 py-3">
            <div className="text-xl font-bold text-green-600">{stats.mentioned}</div>
            <div className="text-[11px] text-pw-muted font-medium">Vermeldingen</div>
          </div>
          <div className="bg-white border border-pw-border rounded-lg px-4 py-3">
            <div className="text-xl font-bold text-pw-blue">{stats.mentionRate}%</div>
            <div className="text-[11px] text-pw-muted font-medium">Mention rate</div>
          </div>
          <div className="bg-white border border-pw-border rounded-lg px-4 py-3">
            <div className="text-xl font-bold text-purple-600">{stats.urlCited}</div>
            <div className="text-[11px] text-pw-muted font-medium">URL citations</div>
          </div>
        </div>
      )}

      {/* Per-model breakdown */}
      {Object.keys(byModel).length > 0 && (
        <div className="flex gap-3 mb-5 flex-wrap">
          {Object.entries(byModel).map(([m, s]) => (
            <div
              key={m}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold ${MODEL_COLORS[m] || "bg-gray-50 text-gray-600"}`}
            >
              <Bot size={13} />
              {MODEL_LABELS[m] || m}: {s.mentioned}/{s.total} ({s.rate}%)
            </div>
          ))}
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-3 mb-5 items-center">
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="text-xs border border-pw-border rounded-lg px-3 py-2 focus:outline-none focus:border-pw-blue"
        >
          <option value="all">Alle modellen</option>
          <option value="claude">Claude</option>
          <option value="gemini">Gemini</option>
          <option value="chatgpt">ChatGPT</option>
        </select>
        <button
          onClick={fetchData}
          className="flex items-center gap-1.5 text-xs font-semibold text-pw-blue hover:text-pw-navy"
        >
          <RefreshCw size={13} />
          Vernieuwen
        </button>
      </div>

      {/* Loading / Error / Empty */}
      {loading && checks.length === 0 && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="animate-spin text-pw-muted" size={24} />
        </div>
      )}
      {error && checks.length === 0 && (
        <div className="text-center py-16">
          <AlertTriangle className="mx-auto mb-3 text-red-400" size={24} />
          <p className="text-sm text-pw-muted">{error}</p>
        </div>
      )}
      {!loading && !error && checks.length === 0 && (
        <div className="text-center py-16">
          <Bot className="mx-auto mb-3 text-pw-muted" size={32} />
          <p className="text-sm text-pw-muted mb-3">Nog geen AI mention checks uitgevoerd</p>
          <p className="text-xs text-pw-muted">Klik op &quot;Nu checken&quot; om de eerste check te starten</p>
        </div>
      )}

      {/* Results list */}
      {checks.length > 0 && (
        <div className="space-y-2">
          {checks.map((check) => {
            const expanded = expandedId === check.id;
            return (
              <div key={check.id} className="bg-white border border-pw-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedId(expanded ? null : check.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                >
                  {/* Mention indicator */}
                  {check.mentioned ? (
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-green-600" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                      <X size={12} className="text-red-400" />
                    </div>
                  )}

                  {/* Prompt */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-pw-navy truncate">{check.prompt}</div>
                  </div>

                  {/* Model badge */}
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded shrink-0 ${MODEL_COLORS[check.model] || "bg-gray-100"}`}>
                    {MODEL_LABELS[check.model] || check.model}
                  </span>

                  {/* URL cited */}
                  {check.url_cited && (
                    <ExternalLink size={12} className="text-pw-blue shrink-0" />
                  )}

                  {/* Date */}
                  <span className="text-[11px] text-pw-muted shrink-0 hidden sm:inline">
                    {formatDate(check.checked_at)}
                  </span>

                  {expanded ? <ChevronUp size={14} className="text-pw-muted" /> : <ChevronDown size={14} className="text-pw-muted" />}
                </button>

                {expanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-pw-border space-y-3">
                    {check.mention_context && (
                      <div>
                        <div className="text-[11px] font-bold text-pw-muted uppercase tracking-wider mb-1">Vermelding context</div>
                        <p className="text-xs text-green-700 bg-green-50 rounded-lg p-3 leading-relaxed">
                          ...{check.mention_context}...
                        </p>
                      </div>
                    )}
                    {check.cited_url && (
                      <div className="flex items-center gap-2 text-xs">
                        <ExternalLink size={12} className="text-pw-blue" />
                        <span className="text-pw-muted">URL geciteerd:</span>
                        <span className="text-pw-blue font-semibold">{check.cited_url}</span>
                      </div>
                    )}
                    <div>
                      <div className="text-[11px] font-bold text-pw-muted uppercase tracking-wider mb-1">Volledig antwoord</div>
                      <p className="text-xs text-pw-text bg-gray-50 rounded-lg p-3 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                        {check.response}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
