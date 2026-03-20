"use client";

import { useState, Suspense } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-card border border-pw-border p-8">
        <h1 className="text-page-heading text-pw-navy text-center mb-1">PayWatch Admin</h1>
        <p className="text-sm text-pw-muted text-center mb-8">Login with your admin account</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-label text-pw-muted block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-input border border-pw-border focus:outline-none focus:ring-2 focus:ring-pw-blue/20 focus:border-pw-blue"
              placeholder="admin@paywatch.app"
              required
            />
          </div>
          <div>
            <label className="text-label text-pw-muted block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-input border border-pw-border focus:outline-none focus:ring-2 focus:ring-pw-blue/20 focus:border-pw-blue"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-pw-red-light text-pw-red text-xs font-medium p-3 rounded-input">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pw-blue text-white font-semibold text-sm py-2.5 rounded-button hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <main className="min-h-screen bg-pw-bg flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-pw-muted text-sm">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
