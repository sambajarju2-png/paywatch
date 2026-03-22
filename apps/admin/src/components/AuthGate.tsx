"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const ALLOWED_EMAILS = [
  "sambajarju2@gmail.com",
  "samba@paywatch.nl",
  "mariama@paywatch.com",
];

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"loading" | "login" | "denied" | "ok">("loading");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    supabase.auth.getSession().then(({ data }) => {
      const userEmail = data.session?.user?.email;
      if (!userEmail) {
        setState("login");
      } else if (ALLOWED_EMAILS.includes(userEmail.toLowerCase())) {
        setEmail(userEmail);
        setState("ok");
      } else {
        setEmail(userEmail);
        setState("denied");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const userEmail = session?.user?.email;
      if (!userEmail) {
        setState("login");
      } else if (ALLOWED_EMAILS.includes(userEmail.toLowerCase())) {
        setEmail(userEmail);
        setState("ok");
      } else {
        setEmail(userEmail);
        setState("denied");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleGoogleLogin() {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    });
  }

  async function handleLogout() {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    setState("login");
  }

  if (state === "loading") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8FAFC", fontFamily: "'Plus Jakarta Sans', system-ui" }}>
        <p style={{ color: "#64748B", fontSize: 14 }}>Laden...</p>
      </div>
    );
  }

  if (state === "login") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8FAFC", fontFamily: "'Plus Jakarta Sans', system-ui" }}>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: 40, width: "100%", maxWidth: 400, textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          </div>
          <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: "#0A2540" }}>PayWatch Admin</h1>
          <p style={{ margin: "0 0 24px", fontSize: 13, color: "#64748B" }}>Log in met je Google account</p>
          <button onClick={handleGoogleLogin} style={{
            width: "100%", padding: "12px", borderRadius: 8, border: "1px solid #E2E8F0",
            background: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            color: "#0A2540", fontFamily: "'Plus Jakarta Sans', system-ui",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Inloggen met Google
          </button>
        </div>
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8FAFC", fontFamily: "'Plus Jakarta Sans', system-ui" }}>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: 40, maxWidth: 400, textAlign: "center" }}>
          <h1 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: "#DC2626" }}>Geen toegang</h1>
          <p style={{ margin: "0 0 16px", fontSize: 13, color: "#64748B" }}>{email} heeft geen admin rechten.</p>
          <button onClick={handleLogout} style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid #E2E8F0", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#0A2540", fontFamily: "'Plus Jakarta Sans', system-ui" }}>Uitloggen</button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
