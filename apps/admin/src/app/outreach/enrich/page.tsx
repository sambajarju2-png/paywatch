"use client";

import { useState, useRef, useCallback } from "react";
import { Sparkles, Loader2, CheckCircle, XCircle, SkipForward, RefreshCw } from "lucide-react";

type EnrichResult = {
  id: string;
  name: string;
  website: string | null;
  linkedin_url: string | null;
  city: string | null;
  status: "enriched" | "skipped" | "error";
  error?: string;
};

type BatchResponse = {
  enriched: number;
  skipped: number;
  errors: number;
  remaining: number;
  results: EnrichResult[];
  message?: string;
};

export default function EnrichPage() {
  const [running, setRunning] = useState(false);
  const [stats, setStats] = useState<{ total: number; enriched: number; unenriched: number; nvi: number; nviEnriched: number } | null>(null);
  const [batchSize, setBatchSize] = useState(5);
  const [allResults, setAllResults] = useState<EnrichResult[]>([]);
  const [totalEnriched, setTotalEnriched] = useState(0);
  const [totalSkipped, setTotalSkipped] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [currentBatch, setCurrentBatch] = useState(0);
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

  const runBatch = async (): Promise<BatchResponse | null> => {
    const res = await fetch("/api/admin/outreach/enrich-contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ batch_size: batchSize, type: "incasso" }),
    });
    if (!res.ok) return null;
    return res.json();
  };

  const startEnrichment = async () => {
    stopRef.current = false;
    setRunning(true);
    setCurrentBatch(0);

    while (!stopRef.current) {
      setCurrentBatch((b) => b + 1);
      const result = await runBatch();

      if (!result) {
        break;
      }

      if (result.message || result.remaining === 0) {
        // All done
        setRemaining(0);
        break;
      }

      setAllResults((prev) => [...prev, ...result.results]);
      setTotalEnriched((prev) => prev + result.enriched);
      setTotalSkipped((prev) => prev + result.skipped);
      setTotalErrors((prev) => prev + result.errors);
      setRemaining(result.remaining);

      // Small pause between batches
      await new Promise((r) => setTimeout(r, 1000));
    }

    setRunning(false);
    loadStats(); // Refresh stats
  };

  const stopEnrichment = () => {
    stopRef.current = true;
  };

  const enrichedResults = allResults.filter((r) => r.status === "enriched");
  const processedTotal = totalEnriched + totalSkipped + totalErrors;

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
            Uses Claude + web search to find website, LinkedIn & city for each contact
          </p>
        </div>
      </div>

      {/* Stats Card */}
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
        <div className="flex items-center gap-3">
          <select
            value={batchSize}
            onChange={(e) => setBatchSize(Number(e.target.value))}
            disabled={running}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
          >
            <option value={1}>1 per batch</option>
            <option value={3}>3 per batch</option>
            <option value={5}>5 per batch</option>
            <option value={10}>10 per batch</option>
          </select>

          {!running ? (
            <button
              onClick={startEnrichment}
              disabled={remaining === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              {remaining === 0 ? "All Enriched!" : `Start Enrichment (${remaining ?? "..."} remaining)`}
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
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {running && (
          <div className="mt-3 flex items-center gap-2 text-sm text-blue-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing batch {currentBatch}... ({remaining} remaining)
          </div>
        )}

        {processedTotal > 0 && (
          <div className="mt-3 flex gap-4 text-xs">
            <span className="text-green-600 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> {totalEnriched} enriched
            </span>
            <span className="text-slate-400 flex items-center gap-1">
              <SkipForward className="w-3 h-3" /> {totalSkipped} skipped
            </span>
            <span className="text-red-500 flex items-center gap-1">
              <XCircle className="w-3 h-3" /> {totalErrors} errors
            </span>
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
                {[...allResults].reverse().map((r, i) => (
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
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3" /> Done
                        </span>
                      )}
                      {r.status === "skipped" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-500">
                          <SkipForward className="w-3 h-3" /> Skipped
                        </span>
                      )}
                      {r.status === "error" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700" title={r.error}>
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
