import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabaseAuth = createClient(supabaseUrl, anonKey);

export const ADMIN_EMAILS = [
  "sambajarju2@gmail.com",
  "samba@paywatch.nl",
  "mariama@paywatch.com",
];
