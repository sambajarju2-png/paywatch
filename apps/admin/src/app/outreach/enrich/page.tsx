"use client";

import { useState, useRef, useCallback } from "react";
import { Sparkles, Loader2, CheckCircle, XCircle, SkipForward, RefreshCw, Clock } from "lucide-react";

type EnrichResult = {
  id: string;
  name: string;
  website: string | null;
  linkedin_url: string | null;
  city: string | null;
  status: "enriched" | "skipped" | "error";
  error?: string;
};

export default function EnrichPage() {
  const [running, setRunning] = useState(false);
  const [stats, setStats] = useState<{ total: number; enriched: number; unenriched: number; nvi: number; nviEnriched: number } | null>(null);
  const [delaySeconds, setDelaySeconds] = useState(6);
  const [allResults, setAllResults] = useState<EnrichResult[]>([]);
  const [totalEnriched, setTotalEnriched] = useState(0);
  const [totalSkipped, setTotalSkipped] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [statusText, setStatusText] = useState("");
  const [countdown, setCountdown] = useState(0);
  const stopRef = useRef(false);

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/outreach/enrich-contacts");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setRemaining(data.unenriched);
      }
    } catch {}
  }, []);

  // Load stats on mount
  useState(() => { loadStats(); });

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const countdownWait = async (seconds: number) => {
    for (let i = seconds; i > 0; i--) {
      if (stopRef.current) return;
      setCountdown(i);
      await sleep(1000);
    }
    setCountdown(0);
  };

  const startEnrichment = async () => {
    stopRef.current = false;
    setRunning(true);
    let processed = 0;

    while (!stopRef.current) {
      setStatusText("Enriching...");

      try {
        const res = await fetch("/api/admin/outreach/enrich-contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "incasso" }),
        });

        const data = await res.json();

        if (data.message && data.remaining === 0) {
          setStatusText("All done!");
          setRemaining(0);
          break;
        }

        if (data.result) {
          setAllResults((prev) => [data.result, ...prev]);
          if (data.result.status === "enriched") setTotalEnriched((p) => p + 1);
          else if (data.result.status === "skipped") setTotalSkipped((p) => p + 1);
          else setTotalErrors((p) => p + 1);
        }

        if (data.remaining >= 0) setRemaining(data.remaining);

        // If rate limited, wait longer
        if (data.retryAfter) {
          setStatusText(`Rate limited — waiting ${data.retryAfter}s...`);
          await countdownWait(data.retryAfter);
        } else {
          // Normal delay between requests
          processed++;
          setStatusText(`Waiting ${delaySeconds}s before next...`);
          await countdownWait(delaySeconds);
        }
      } catch (err) {
        setStatusText("Network error — retrying in 10s...");
        await countdownWait(10);
      }
    }

    setRunning(false);
    setStatusText(stopRef.current ? "Paused" : "Complete!");
    setCountdown(0);
    loadStats();
  };

  const stopEnrichment = () => {
    stopRef.current = true;
    setStatusText("Stopping...");
  };

  const processedTotal = totalEnriched + totalSkipped + totalErrors;
  const estimateMinutes = remaining ? Math.ceil((remaining * (delaySeconds + 4)) / 60) : 0;

  return (
    <div className="px-4 py-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">AI Contact Enrichment</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Claude Haiku + web search — 1 agency every {delaySeconds}s to stay within rate limits
          </p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
            <p className="text-xs text-slate-500">Total Incasso</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-2xl font-bold text-green-600">{stats.enriched}</p>
            <p className="text-xs text-slate-500">Enriched</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-2xl font-bold text-amber-600">{stats.unenriched}</p>
            <p className="text-xs text-slate-500">Unenriched</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-2xl font-bold text-purple-600">{stats.nviEnriched}/{stats.nvi}</p>
            <p className="text-xs text-slate-500">NVI Enriched</p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <select
              value={delaySeconds}
              onChange={(e) => setDelaySeconds(Number(e.target.value))}
              disabled={running}
              className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
            >
              <option value={4}>4s between calls (~40 min)</option>
              <option value={6}>6s between calls (~60 min)</option>
              <option value={10}>10s between calls (~90 min)</option>
              <option value={15}>15s between calls (safest)</option>
            </select>
          </div>

          {!running ? (
            <button
              onClick={startEnrichment}
              disabled={remaining === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              {remaining === 0 ? "All Enriched!" : `Start (${remaining ?? "..."} remaining${estimateMinutes ? ` · ~${estimateMinutes}min` : ""})`}
            </button>
          ) : (
            <button
              onClick={stopEnrichment}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Stop
            </button>
          )}

          <button
            onClick={loadStats}
            disabled={running}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            title="Refresh stats"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Status line */}
        {(running || statusText) && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            {running && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
            <span className={running ? "text-blue-600" : "text-slate-500"}>
              {statusText}
              {countdown > 0 && ` (${countdown}s)`}
            </span>
          </div>
        )}

        {processedTotal > 0 && (
          <div className="mt-2 flex gap-4 text-xs">
            <span className="text-green-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {totalEnriched} enriched</span>
            <span className="text-slate-400 flex items-center gap-1"><SkipForward className="w-3 h-3" /> {totalSkipped} skipped</span>
            <span className="text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" /> {totalErrors} errors</span>
          </div>
        )}
      </div>

      {/* Results */}
      {allResults.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Results ({allResults.length} processed)
            </h2>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900 sticky top-0">
                <tr>
                  <th className="text-left px-4 py-2 text-xs font-medium text-slate-500">Company</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-slate-500">Website</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-slate-500">City</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {allResults.map((r, i) => (
                  <tr key={`${r.id}-${i}`} className="border-t border-slate-100 dark:border-slate-700">
                    <td className="px-4 py-2 font-medium text-slate-900 dark:text-white truncate max-w-48">
                      {r.name}
                    </td>
                    <td className="px-4 py-2 text-xs text-blue-600 truncate max-w-40">
                      {r.website ? (
                        <a href={r.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {r.website.replace(/^https?:\/\/(www\.)?/, "")}
                        </a>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-2 text-xs text-slate-500">{r.city || "—"}</td>
                    <td className="px-4 py-2">
                      {r.status === "enriched" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          <CheckCircle className="w-3 h-3" /> Done
                        </span>
                      )}
                      {r.status === "skipped" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                          <SkipForward className="w-3 h-3" /> Skipped
                        </span>
                      )}
                      {r.status === "error" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" title={r.error}>
                          <XCircle className="w-3 h-3" /> Error
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
