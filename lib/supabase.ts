import { createClient as _createClient } from "@supabase/supabase-js";

// Singleton — one shared client instance for the entire browser session.
// This ensures the auth state listener (in AuthRefresher) is attached to the
// same instance that all pages use, so token refreshes are always reflected.
let _instance: ReturnType<typeof _createClient> | null = null;

export function createClient() {
  if (_instance) return _instance;

  _instance = _createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Persist session in localStorage so it survives PWA close/reopen.
        // localStorage (not sessionStorage) is required — sessionStorage is
        // cleared when the app is closed from the home screen.
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== "undefined" ? window.localStorage : undefined,
      },
    }
  );

  return _instance;
}
