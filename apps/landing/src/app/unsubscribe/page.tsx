"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const REASONS = [
  { id: "too_many", nl: "Ik ontvang te veel e-mails", en: "I receive too many emails" },
  { id: "not_useful", nl: "De informatie is niet nuttig voor mij", en: "The information isn't useful to me" },
  { id: "no_longer_use", nl: "Ik gebruik PayWatch niet meer", en: "I no longer use PayWatch" },
  { id: "other", nl: "Anders", en: "Other" },
];

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid") || "";
  const token = searchParams.get("token") || "";
  const langParam = searchParams.get("lang");

  const [lang, setLang] = useState<"nl" | "en">(langParam === "en" ? "en" : "nl");
  const [state, setState] = useState<"loading" | "invalid" | "already" | "confirm" | "submitting" | "done">("loading");
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState("");

  const isNl = lang === "nl";

  useEffect(() => {
    if (!uid || !token) {
      setState("invalid");
      return;
    }

    fetch(`/api/unsubscribe?uid=${uid}&token=${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.valid) {
          setState("invalid");
        } else if (data.already_unsubscribed) {
          setState("already");
          setName(data.name || "");
        } else {
          setState("confirm");
          setName(data.name || "");
        }
      })
      .catch(() => setState("invalid"));
  }, [uid, token]);

  async function handleUnsubscribe() {
    setState("submitting");
    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid,
          token,
          reason: reason ? REASONS.find((r) => r.id === reason)?.[lang] || reason : "",
          feedback: feedback.trim(),
        }),
      });
      if (res.ok) {
        setState("done");
      } else {
        setState("confirm");
        alert(isNl ? "Er ging iets mis. Probeer opnieuw." : "Something went wrong. Please try again.");
      }
    } catch {
      setState("confirm");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F4F7FB",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: "#2563EB",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 700,
            color: "#0A2540",
            letterSpacing: "-0.02em",
          }}
        >
          PayWatch
        </h1>
      </div>

      {/* Card */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          border: "1px solid #E2E8F0",
          padding: "32px 28px",
          width: "100%",
          maxWidth: 460,
        }}
      >
        {/* ── Loading ───────────────────────────── */}
        {state === "loading" && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div
              style={{
                width: 24,
                height: 24,
                border: "2px solid #E2E8F0",
                borderTopColor: "#2563EB",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 12px",
              }}
            />
            <p style={{ color: "#64748B", fontSize: 14 }}>
              {isNl ? "Even geduld..." : "Loading..."}
            </p>
          </div>
        )}

        {/* ── Invalid link ──────────────────────── */}
        {state === "invalid" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔗</div>
            <h2 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#0A2540" }}>
              {isNl ? "Ongeldige link" : "Invalid link"}
            </h2>
            <p style={{ margin: 0, fontSize: 14, color: "#64748B", lineHeight: 1.5 }}>
              {isNl
                ? "Deze uitschrijflink is ongeldig of verlopen. Neem contact op via info@paywatch.nl als je hulp nodig hebt."
                : "This unsubscribe link is invalid or expired. Contact info@paywatch.nl if you need help."}
            </p>
          </div>
        )}

        {/* ── Already unsubscribed ──────────────── */}
        {state === "already" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <h2 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#0A2540" }}>
              {isNl ? "Al uitgeschreven" : "Already unsubscribed"}
            </h2>
            <p style={{ margin: 0, fontSize: 14, color: "#64748B", lineHeight: 1.5 }}>
              {isNl
                ? "Je ontvangt al geen wekelijkse e-mails meer. Je kunt dit altijd wijzigen in de app via Instellingen → Meldingen."
                : "You're already unsubscribed from weekly emails. You can change this anytime in the app under Settings → Notifications."}
            </p>
          </div>
        )}

        {/* ── Confirm + Feedback ────────────────── */}
        {(state === "confirm" || state === "submitting") && (
          <div>
            <div style={{ fontSize: 40, marginBottom: 12, textAlign: "center" }}>📧</div>
            <h2
              style={{
                margin: "0 0 4px",
                fontSize: 18,
                fontWeight: 700,
                color: "#0A2540",
                textAlign: "center",
              }}
            >
              {isNl ? "Uitschrijven" : "Unsubscribe"}
            </h2>
            <p
              style={{
                margin: "0 0 24px",
                fontSize: 14,
                color: "#64748B",
                textAlign: "center",
                lineHeight: 1.5,
              }}
            >
              {isNl
                ? `${name ? `Hoi ${name}, w` : "W"}eet je zeker dat je geen wekelijkse overzichtse-mails meer wilt ontvangen?`
                : `${name ? `Hi ${name}, a` : "A"}re you sure you want to stop receiving weekly summary emails?`}
            </p>

            {/* Reason selection */}
            <p
              style={{
                margin: "0 0 10px",
                fontSize: 13,
                fontWeight: 600,
                color: "#0A2540",
              }}
            >
              {isNl ? "Waarom schrijf je je uit?" : "Why are you unsubscribing?"}
              <span style={{ color: "#64748B", fontWeight: 400 }}>
                {" "}
                ({isNl ? "optioneel" : "optional"})
              </span>
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {REASONS.map((r) => (
                <label
                  key={r.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: `1px solid ${reason === r.id ? "#2563EB" : "#E2E8F0"}`,
                    background: reason === r.id ? "#EFF6FF" : "transparent",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    fontSize: 13,
                    color: "#0F172A",
                  }}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r.id}
                    checked={reason === r.id}
                    onChange={() => setReason(r.id)}
                    style={{ accentColor: "#2563EB" }}
                  />
                  {r[lang]}
                </label>
              ))}
            </div>

            {/* Free-form feedback */}
            {reason === "other" && (
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={isNl ? "Vertel ons meer..." : "Tell us more..."}
                rows={3}
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid #E2E8F0",
                  fontSize: 13,
                  resize: "vertical",
                  outline: "none",
                  fontFamily: "'Plus Jakarta Sans', system-ui",
                  boxSizing: "border-box",
                  marginBottom: 16,
                }}
              />
            )}

            {/* Buttons */}
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <a
                href="https://app.paywatch.app"
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: 8,
                  border: "1px solid #E2E8F0",
                  background: "transparent",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#64748B",
                  textDecoration: "none",
                  textAlign: "center",
                  fontFamily: "'Plus Jakarta Sans', system-ui",
                }}
              >
                {isNl ? "Annuleer" : "Cancel"}
              </a>
              <button
                onClick={handleUnsubscribe}
                disabled={state === "submitting"}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: 8,
                  border: "none",
                  background: "#DC2626",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#fff",
                  cursor: state === "submitting" ? "wait" : "pointer",
                  opacity: state === "submitting" ? 0.6 : 1,
                  fontFamily: "'Plus Jakarta Sans', system-ui",
                }}
              >
                {state === "submitting"
                  ? isNl
                    ? "Bezig..."
                    : "Processing..."
                  : isNl
                    ? "Uitschrijven"
                    : "Unsubscribe"}
              </button>
            </div>

            {/* Note */}
            <p
              style={{
                margin: "16px 0 0",
                fontSize: 12,
                color: "#94A3B8",
                textAlign: "center",
                lineHeight: 1.5,
              }}
            >
              {isNl
                ? "Je blijft nog wel meldingen ontvangen over achterstallige rekeningen. Dit kun je wijzigen in de app."
                : "You'll still receive notifications about overdue bills. You can change this in the app."}
            </p>
          </div>
        )}

        {/* ── Done ──────────────────────────────── */}
        {state === "done" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>👋</div>
            <h2 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#0A2540" }}>
              {isNl ? "Uitgeschreven" : "Unsubscribed"}
            </h2>
            <p style={{ margin: "0 0 20px", fontSize: 14, color: "#64748B", lineHeight: 1.5 }}>
              {isNl
                ? "Je ontvangt geen wekelijkse overzichtse-mails meer. Je kunt dit altijd weer inschakelen via de app."
                : "You'll no longer receive weekly summary emails. You can re-enable this anytime in the app."}
            </p>
            {feedback || reason ? (
              <p style={{ margin: "0 0 20px", fontSize: 13, color: "#059669", fontWeight: 500 }}>
                {isNl ? "Bedankt voor je feedback!" : "Thanks for your feedback!"}
              </p>
            ) : null}
            <a
              href="https://app.paywatch.app"
              style={{
                display: "inline-block",
                padding: "10px 24px",
                borderRadius: 8,
                background: "#2563EB",
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                fontFamily: "'Plus Jakarta Sans', system-ui",
              }}
            >
              {isNl ? "Terug naar PayWatch" : "Back to PayWatch"}
            </a>
          </div>
        )}
      </div>

      {/* Footer */}
      <p
        style={{
          marginTop: 24,
          fontSize: 12,
          color: "#94A3B8",
          textAlign: "center",
        }}
      >
        PayWatch — Rotterdam, Nederland
      </p>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#F4F7FB",
            fontFamily: "'Plus Jakarta Sans', system-ui",
          }}
        >
          <p style={{ color: "#64748B" }}>Laden...</p>
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
