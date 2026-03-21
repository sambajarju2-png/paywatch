"use client";

import { useState, useEffect } from "react";

interface Submission {
  id: number;
  name: string;
  email: string;
  type: string;
  subject: string;
  message: string;
  lang: string;
  created_at: string;
}

export default function ContactsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/contacts")
      .then((r) => r.json())
      .then((data) => setSubmissions(data.submissions || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse"><div className="h-8 w-48 bg-gray-200 rounded mb-8" />{[1,2,3].map(i=><div key={i} className="h-20 bg-gray-100 rounded-xl mb-3"/>)}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Contact Submissions</h1>
      <p className="text-sm text-gray-500 mb-8">{submissions.length} total submissions</p>

      {submissions.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-sm text-gray-400">No contact submissions yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {submissions.map((s) => (
            <div key={s.id} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      s.type === "business" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {s.type}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{s.name}</p>
                    <p className="text-xs text-gray-400 truncate">{s.email}</p>
                  </div>
                  <div className="hidden sm:block text-right flex-shrink-0">
                    <p className="text-xs text-gray-500">{s.subject || "—"}</p>
                    <p className="text-xs text-gray-400">{new Date(s.created_at).toLocaleDateString("nl-NL")}</p>
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" className={`ml-3 transition-transform ${expanded === s.id ? "rotate-180" : ""}`}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {expanded === s.id && (
                <div className="px-5 pb-4 border-t border-gray-100 pt-3">
                  <div className="grid sm:grid-cols-3 gap-3 mb-3 text-xs">
                    <div><span className="text-gray-400">Subject:</span> <span className="text-gray-700 font-medium">{s.subject || "—"}</span></div>
                    <div><span className="text-gray-400">Language:</span> <span className="text-gray-700 font-medium uppercase">{s.lang}</span></div>
                    <div><span className="text-gray-400">Date:</span> <span className="text-gray-700 font-medium">{new Date(s.created_at).toLocaleString("nl-NL")}</span></div>
                  </div>
                  <div className="rounded-lg bg-gray-50 border border-gray-100 p-4">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{s.message}</p>
                  </div>
                  <div className="mt-3">
                    <a
                      href={`mailto:${s.email}?subject=Re: ${s.subject || "PayWatch Contact"}`}
                      className="inline-flex rounded bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                    >
                      Reply via email
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
