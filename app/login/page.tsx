"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

const T = {
  gold: "#c9a84c",
  bg: "#0a0a0a",
  bg2: "#0d0d0d",
  text: "#f0ebe0",
  sub: "#5c5c5c",
  border: "#181818",
  display: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif",
  sans: "var(--font-inter), system-ui, sans-serif",
} as const;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [pwFocus, setPwFocus] = useState(false);
  const [btnHov, setBtnHov] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  const inputStyle = (focused: boolean): React.CSSProperties => ({
    width: "100%",
    boxSizing: "border-box",
    background: "#111",
    border: `1px solid ${focused ? T.gold : "#242424"}`,
    color: T.text,
    fontFamily: T.sans,
    fontSize: "0.8125rem",
    fontWeight: 300,
    padding: "0.75rem 1rem",
    outline: "none",
    transition: "border-color 0.2s ease",
    caretColor: T.gold,
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: T.bg2,
          border: "1px solid rgba(201,168,76,0.25)",
          padding: "3rem 2.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        {/* Wordmark */}
        <div style={{ textAlign: "center" }}>
          <a
            href="/"
            style={{
              fontFamily: T.display,
              fontSize: "1.625rem",
              fontWeight: 400,
              letterSpacing: "0.12em",
              color: T.text,
              textDecoration: "none",
            }}
          >
            Aurea Health
          </a>
          <p
            style={{
              fontFamily: T.sans,
              fontSize: "0.5rem",
              fontWeight: 500,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: T.sub,
              marginTop: "0.5rem",
              marginBottom: 0,
            }}
          >
            Member Access
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: T.border }} />

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <label
              htmlFor="email"
              style={{
                fontFamily: T.sans,
                fontSize: "0.5rem",
                fontWeight: 500,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: T.sub,
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
              style={inputStyle(emailFocus)}
              placeholder="you@example.com"
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <label
              htmlFor="password"
              style={{
                fontFamily: T.sans,
                fontSize: "0.5rem",
                fontWeight: 500,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: T.sub,
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setPwFocus(true)}
              onBlur={() => setPwFocus(false)}
              style={inputStyle(pwFocus)}
              placeholder="••••••••"
            />
          </div>

          {/* Error message */}
          {error && (
            <p
              style={{
                fontFamily: T.sans,
                fontSize: "0.6875rem",
                fontWeight: 400,
                color: "#c97a4c",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            onMouseEnter={() => setBtnHov(true)}
            onMouseLeave={() => setBtnHov(false)}
            style={{
              marginTop: "0.5rem",
              fontFamily: T.sans,
              fontSize: "0.5625rem",
              fontWeight: 500,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              padding: "0.875rem",
              border: `1px solid ${btnHov && !loading ? T.gold : "rgba(201,168,76,0.3)"}`,
              color: btnHov && !loading ? T.bg : T.gold,
              background: btnHov && !loading ? T.gold : "transparent",
              cursor: loading ? "default" : "pointer",
              opacity: loading ? 0.55 : 1,
              width: "100%",
              transition: "all 0.25s ease",
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
