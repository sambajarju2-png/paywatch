"use client";

import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import {
  Upload,
  ScanLine,
  Loader2,
  Receipt,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  X,
  CalendarClock,
  Building2,
  Hash,
  Sparkles,
  Lock,
} from "lucide-react";

const FREE_SCANS = 2;
const STORAGE_KEY = "pw_testhome_real_scans";
const REGISTER_URL = "https://app.paywatch.app";

type ScanResult = {
  is_bill: boolean;
  vendor: string | null;
  amount_cents: number | null;
  due_date: string | null;
  escalation_stage: Stage | null;
  reference: string | null;
  explanation: string | null;
  summary: string | null;
  blocked?: boolean;
};

type Stage = "factuur" | "herinnering" | "aanmaning" | "incasso" | "deurwaarder";

// ── WIK (Wet Incassokosten) — wettelijk maximum aan incassokosten ──
function wikCosts(amountEuros: number): number {
  const a = Math.max(0, amountEuros);
  let c = 0;
  if (a <= 2500) c = Math.max(40, a * 0.15);
  else if (a <= 5000) c = 375 + (a - 2500) * 0.1;
  else if (a <= 10000) c = 625 + (a - 5000) * 0.05;
  else if (a <= 200000) c = 875 + (a - 10000) * 0.01;
  else c = 2775 + (a - 200000) * 0.005;
  return Math.min(c, 6775);
}

const euro = (n: number) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
const euro2 = (n: number) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);

const STAGE_LABEL: Record<Stage, string> = {
  factuur: "Factuur",
  herinnering: "Herinnering",
  aanmaning: "Aanmaning",
  incasso: "Incasso",
  deurwaarder: "Deurwaarder",
};
const STAGE_COLOR: Record<Stage, string> = {
  factuur: "var(--blue)",
  herinnering: "var(--amber)",
  aanmaning: "var(--orange)",
  incasso: "var(--red)",
  deurwaarder: "var(--red)",
};

// Canned sample bills — free + unlimited, never call the API
const SAMPLES: { label: string; result: ScanResult }[] = [
  {
    label: "Energierekening",
    result: {
      is_bill: true,
      vendor: "Vandebron",
      amount_cents: 14732,
      due_date: "2026-06-20",
      escalation_stage: "factuur",
      reference: "VB-2026-884213",
      explanation:
        "Dit is je maandelijkse energierekening van Vandebron. Het bedrag van 147,32 euro moet voor 20 juni betaald zijn. Er is nog niets aan de hand, betaal op tijd en het blijft hierbij.",
      summary: "Maandelijkse energierekening, op tijd betalen voorkomt extra kosten.",
    },
  },
  {
    label: "Aanmaning zorgverzekeraar",
    result: {
      is_bill: true,
      vendor: "Zilveren Kruis",
      amount_cents: 28900,
      due_date: "2026-06-12",
      escalation_stage: "aanmaning",
      reference: "ZK-AANM-55129",
      explanation:
        "Dit is een aanmaning van je zorgverzekeraar voor een openstaand bedrag van 289 euro. Je hebt 14 dagen om te betalen. Doe je dat niet, dan kunnen er incassokosten bijkomen.",
      summary: "Aanmaning, de klok loopt: na 14 dagen mogen incassokosten erbij.",
    },
  },
];

export default function TestHomePage() {
  const [scansUsed, setScansUsed] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGate, setShowGate] = useState(false);
  const [mountedAt] = useState(() => Date.now());
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      setScansUsed(Number(localStorage.getItem(STORAGE_KEY) || 0));
    } catch {
      /* ignore */
    }
  }, []);

  const bumpScans = useCallback(() => {
    setScansUsed((n) => {
      const next = n + 1;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const runScan = useCallback(
    async (file: File) => {
      if (scansUsed >= FREE_SCANS) {
        setShowGate(true);
        return;
      }
      setError(null);
      setLoading(true);
      setResult(null);
      try {
        const form = new FormData();
        form.append("file", file);
        form.append("website", ""); // honeypot stays empty
        form.append("_t", String(mountedAt));
        const res = await fetch("/api/testhome/scan", { method: "POST", body: form });
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 429) {
            setShowGate(true);
          } else {
            setError(data?.message || "Er ging iets mis. Probeer het opnieuw.");
          }
          return;
        }
        if (data?.blocked) {
          setError("Deze foto kon niet worden verwerkt. Probeer een andere.");
          return;
        }
        setResult(data as ScanResult);
        bumpScans();
      } catch {
        setError("Er ging iets mis. Probeer het opnieuw.");
      } finally {
        setLoading(false);
      }
    },
    [scansUsed, mountedAt, bumpScans]
  );

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) runScan(f);
    e.target.value = "";
  };

  const loadSample = (r: ScanResult) => {
    setError(null);
    setResult(r);
  };

  const scannedEuros = result?.amount_cents ? result.amount_cents / 100 : null;

  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px 80px" }}>
      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            fontWeight: 600,
            color: "var(--blue)",
            background: "var(--blue-light)",
            padding: "6px 12px",
            borderRadius: 999,
            marginBottom: 14,
          }}
        >
          <Sparkles size={14} /> Probeer zonder account
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: "var(--navy)", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
          Scan je rekening. Zie wat te laat betalen kost.
        </h1>
        <p style={{ fontSize: 15, color: "var(--muted)", maxWidth: 560, margin: "0 auto", lineHeight: 1.6 }}>
          Maak een foto van een rekening of brief. PayWatch leest hem en laat zien in welke fase hij zit en
          hoeveel het je extra kan kosten als je wacht.
        </p>
      </div>

      {/* Scanner card */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 22,
        }}
      >
        <button
          onClick={() => (scansUsed >= FREE_SCANS ? setShowGate(true) : fileRef.current?.click())}
          disabled={loading}
          style={{
            width: "100%",
            border: "2px dashed var(--border)",
            borderRadius: 14,
            background: "var(--bg)",
            padding: "34px 20px",
            cursor: loading ? "default" : "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          {loading ? (
            <>
              <Loader2 size={30} color="var(--blue)" className="pw-spin" />
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--navy)" }}>Bezig met lezen...</span>
            </>
          ) : (
            <>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: "var(--blue-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Upload size={24} color="var(--blue)" />
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)" }}>Kies of maak een foto</span>
              <span style={{ fontSize: 12.5, color: "var(--muted)" }}>JPG, PNG of WEBP, tot 6 MB</span>
            </>
          )}
        </button>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" hidden onChange={onFile} />

        {/* Honeypot, hidden from real users */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }} />

        {/* Samples */}
        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "0 0 8px" }}>Of probeer een voorbeeld:</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {SAMPLES.map((s) => (
              <button
                key={s.label}
                onClick={() => loadSample(s.result)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--navy)",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 999,
                  padding: "7px 12px",
                  cursor: "pointer",
                }}
              >
                <Receipt size={14} color="var(--blue)" />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--muted)" }}>
          <ShieldCheck size={13} color="var(--green)" />
          Verwerkt in de EU, je foto wordt niet opgeslagen. {Math.max(0, FREE_SCANS - scansUsed)} van {FREE_SCANS} gratis
          scans over.
        </div>
      </div>

      {error && (
        <div
          style={{
            marginTop: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "var(--red-light)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: "12px 14px",
            fontSize: 13.5,
            color: "var(--red)",
          }}
        >
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{ marginTop: 18 }}>
          <ResultCard result={result} />
          {result.is_bill && (
            <EscalationSimulator initialEuros={scannedEuros ?? 147} stage={result.escalation_stage ?? "factuur"} />
          )}
        </div>
      )}

      {/* CTA */}
      <div
        style={{
          marginTop: 28,
          background: "var(--navy)",
          borderRadius: 16,
          padding: "24px 22px",
          textAlign: "center",
        }}
      >
        <h3 style={{ color: "#FFFFFF", fontSize: 18, fontWeight: 800, margin: "0 0 6px" }}>
          PayWatch bewaakt dit automatisch voor al je rekeningen
        </h3>
        <p style={{ color: "#CBD5E1", fontSize: 13.5, margin: "0 0 16px", lineHeight: 1.6 }}>
          Geen losse foto's meer. PayWatch leest je post, waarschuwt je voor elke fase en helpt je op tijd te betalen.
        </p>
        <a
          href={REGISTER_URL}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "var(--blue)",
            color: "#FFFFFF",
            fontWeight: 700,
            fontSize: 14.5,
            padding: "11px 20px",
            borderRadius: 12,
            textDecoration: "none",
          }}
        >
          Maak een gratis account <ArrowRight size={16} />
        </a>
      </div>

      {/* Gate popup */}
      {showGate && <SignupGate onClose={() => setShowGate(false)} />}

      <style>{`
        @keyframes pwspin { to { transform: rotate(360deg); } }
        .pw-spin { animation: pwspin 0.9s linear infinite; }
        @keyframes pwfade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .pw-fade { animation: pwfade 0.35s ease-out both; }
      `}</style>
    </main>
  );
}

function ResultCard({ result }: { result: ScanResult }) {
  const stage = result.escalation_stage;
  return (
    <div className="pw-fade" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <ScanLine size={18} color="var(--blue)" />
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--navy)" }}>Wat PayWatch zag</span>
        {stage && (
          <span
            style={{
              marginLeft: "auto",
              fontSize: 12,
              fontWeight: 700,
              color: STAGE_COLOR[stage],
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: 999,
              padding: "4px 10px",
            }}
          >
            {STAGE_LABEL[stage]}
          </span>
        )}
      </div>

      {result.explanation && (
        <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.6, margin: "0 0 14px" }}>{result.explanation}</p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field icon={<Building2 size={14} />} label="Afzender" value={result.vendor ?? "Onbekend"} />
        <Field
          icon={<Receipt size={14} />}
          label="Bedrag"
          value={result.amount_cents != null ? euro2(result.amount_cents / 100) : "Onbekend"}
        />
        <Field icon={<CalendarClock size={14} />} label="Vervaldatum" value={result.due_date ?? "Onbekend"} />
        <Field icon={<Hash size={14} />} label="Kenmerk" value={result.reference ?? "Onbekend"} />
      </div>

      {!result.is_bill && (
        <p style={{ marginTop: 12, fontSize: 12.5, color: "var(--muted)" }}>
          Dit lijkt geen rekening of betalingsbrief. Probeer een foto van een factuur, herinnering of aanmaning.
        </p>
      )}
    </div>
  );
}

function Field({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ background: "var(--bg)", borderRadius: 10, padding: "10px 12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--muted)", fontSize: 11, fontWeight: 600 }}>
        <span style={{ color: "var(--blue)", display: "inline-flex" }}>{icon}</span>
        {label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginTop: 3, wordBreak: "break-word" }}>{value}</div>
    </div>
  );
}

function EscalationSimulator({ initialEuros, stage }: { initialEuros: number; stage: Stage }) {
  const [amount, setAmount] = useState(Math.round(initialEuros));
  const wik = useMemo(() => wikCosts(amount), [amount]);

  const steps = [
    { stage: "factuur" as Stage, extra: 0, desc: "De originele rekening." },
    { stage: "herinnering" as Stage, extra: 0, desc: "Een eerste herinnering mag niets extra kosten." },
    { stage: "aanmaning" as Stage, extra: 0, desc: "Je krijgt 14 dagen. Daarna mogen incassokosten erbij komen." },
    { stage: "incasso" as Stage, extra: wik, desc: "Wettelijke incassokosten komen er bovenop, soms plus rente en btw." },
    { stage: "deurwaarder" as Stage, extra: null as number | null, desc: "Dagvaarding, griffierecht en deurwaarderskosten. Loopt op tot honderden euro's extra." },
  ];

  const cumulative = (idx: number) =>
    amount + steps.slice(0, idx + 1).reduce((a, b) => a + (typeof b.extra === "number" ? b.extra : 0), 0);

  return (
    <div className="pw-fade" style={{ marginTop: 16, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 20 }}>
      <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--navy)", margin: "0 0 4px" }}>Wat kost wachten?</h3>
      <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "0 0 16px" }}>
        Zie hoe een rekening oploopt als hij niet betaald wordt.
      </p>

      {/* Amount control */}
      <div style={{ background: "var(--bg)", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 600 }}>Openstaand bedrag</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: "var(--navy)" }}>{euro2(amount)}</span>
        </div>
        <input
          type="range"
          min={25}
          max={2500}
          step={5}
          value={Math.min(2500, amount)}
          onChange={(e) => setAmount(Number(e.target.value))}
          style={{ width: "100%", marginTop: 10, accentColor: "var(--blue)" }}
        />
      </div>

      {/* Chain */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {steps.map((s, i) => {
          const isLast = i === steps.length - 1;
          const isHere = s.stage === stage;
          return (
            <div key={s.stage} style={{ display: "flex", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 12, height: 12, borderRadius: 999, background: STAGE_COLOR[s.stage], flexShrink: 0, marginTop: 4, outline: isHere ? "3px solid var(--blue-light)" : "none" }} />
                {!isLast && <div style={{ width: 2, flex: 1, background: "var(--border)" }} />}
              </div>
              <div style={{ paddingBottom: isLast ? 0 : 16, flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--navy)" }}>
                    {STAGE_LABEL[s.stage]}
                    {isHere && <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, color: "var(--blue)" }}>je bent hier</span>}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: s.extra ? STAGE_COLOR[s.stage] : "var(--muted)" }}>
                    {s.extra === null ? "+ honderden euro's" : s.extra === 0 ? euro2(amount) : euro2(cumulative(i))}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: "var(--muted)", margin: "2px 0 0", lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Savings headline */}
      <div style={{ marginTop: 14, background: "var(--green-light)", borderRadius: 12, padding: "12px 14px", display: "flex", gap: 10, alignItems: "center" }}>
        <ShieldCheck size={18} color="var(--green)" />
        <span style={{ fontSize: 13.5, color: "var(--text)", lineHeight: 1.5 }}>
          Door nu te betalen bespaar je <strong style={{ color: "var(--green)" }}>{euro(wik)}</strong> aan wettelijke
          incassokosten, en voorkom je deurwaarderskosten.
        </span>
      </div>

      <p style={{ fontSize: 11, color: "var(--muted)", margin: "12px 0 0", fontStyle: "italic" }}>
        Dit is een indicatie op basis van de Wet Incassokosten, geen juridisch advies. Werkelijke kosten kunnen
        verschillen.
      </p>
    </div>
  );
}

function SignupGate({ onClose }: { onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,37,64,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="pw-fade"
        style={{ background: "var(--surface)", borderRadius: 18, padding: 26, maxWidth: 380, width: "100%", position: "relative" }}
      >
        <button
          onClick={onClose}
          aria-label="Sluiten"
          style={{ position: "absolute", top: 14, right: 14, background: "transparent", border: "none", cursor: "pointer", color: "var(--muted)" }}
        >
          <X size={20} />
        </button>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: "var(--blue-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 14,
          }}
        >
          <Lock size={24} color="var(--blue)" />
        </div>
        <h3 style={{ fontSize: 19, fontWeight: 800, color: "var(--navy)", margin: "0 0 6px" }}>Je gratis scans zijn op</h3>
        <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, margin: "0 0 18px" }}>
          Je hebt je {FREE_SCANS} gratis scans gebruikt. Maak een gratis account en scan al je rekeningen, met
          waarschuwingen voor elke fase.
        </p>
        <a
          href={REGISTER_URL}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            background: "var(--blue)",
            color: "#FFFFFF",
            fontWeight: 700,
            fontSize: 15,
            padding: "12px 20px",
            borderRadius: 12,
            textDecoration: "none",
          }}
        >
          Maak een gratis account <ArrowRight size={16} />
        </a>
        <button
          onClick={onClose}
          style={{ width: "100%", marginTop: 10, background: "transparent", border: "none", color: "var(--muted)", fontSize: 13, cursor: "pointer" }}
        >
          Of bekijk een voorbeeld
        </button>
      </div>
    </div>
  );
}
