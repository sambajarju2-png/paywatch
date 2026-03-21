import { createClient } from "@supabase/supabase-js";

/* Admin uses service_role key — bypasses RLS */
export function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key);
}

/* Admin whitelist — add your email addresses here */
export const ADMIN_EMAILS = [
  "sambajarju2@gmail.com",
  "samba@paywatch.nl",
  "mariama@paywatch.com",
];

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
