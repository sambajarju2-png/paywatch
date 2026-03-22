"use client";

import { useState, useEffect, type ReactNode } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const ADMIN_EMAILS = [
  "sambajarju2@gmail.com",
  "samba@paywatch.nl",
  "mariama@paywatch.com",
];

let _supabase: SupabaseClient | null = null;
function getSupabase() {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    _supabase = createClient(url, key);
  }
  return _supabase;
}

export default function AuthGate({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<"loading" | "login" | "unauthorized" | "authenticated">("loading");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setError("Supabase not configured. Add NEXT_PUBLIC_SUPABASE_ANON_KEY to admin env vars.");
      setStatus("login");
      return;
    }

    /* Check existing session */
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        if (ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
          setEmail(session.user.email);
          setStatus("authenticated");
        } else {
          setEmail(session.user.email);
          setStatus("unauthorized");
        }
      } else {
        setStatus("login");
      }
    });

    /* Listen for auth changes (catches redirect from Google) */
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        if (ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
          setEmail(session.user.email);
          setStatus("authenticated");
        } else {
          setEmail(session.user.email);
          setStatus("unauthorized");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleGoogleLogin() {
    const supabase = getSupabase();
    if (!supabase) return;
    setError("");

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
    }
  }

  async function handleLogout() {
    const supabase = getSupabase();
    if (!supabase) return;
    await supabase.auth.signOut();
    setStatus("login");
    setEmail("");
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "unauthorized") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">PayWatch Admin</h1>
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 mt-6">
            <p className="text-sm text-red-800 font-medium mb-1">Geen toegang</p>
            <p className="text-sm text-red-600">{email} is geen admin account.</p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Andere account gebruiken
          </button>
        </div>
      </div>
    );
  }

  if (status === "login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">PayWatch Admin</h1>
            <p className="text-sm text-gray-500 mt-1">Log in met je Google account</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 2.58 9 2.58z" fill="#EA4335"/>
              </svg>
              Inloggen met Google
            </button>

            {error && (
              <p className="text-sm text-red-600 mt-4 text-center">{error}</p>
            )}

            <p className="text-xs text-gray-400 text-center mt-4">
              Alleen voor geautoriseerde admins
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">PayWatch — admin.paywatch.app</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
