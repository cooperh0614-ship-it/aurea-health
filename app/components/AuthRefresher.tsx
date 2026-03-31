"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase";

// Mounts once in the root layout. Keeps the shared Supabase singleton alive
// and silently refreshes the JWT before it expires, so clients are never
// logged out mid-session regardless of how long the app stays open.
export default function AuthRefresher() {
  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "TOKEN_REFRESHED") {
        // Token was refreshed silently in the background — nothing to do.
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  return null;
}
