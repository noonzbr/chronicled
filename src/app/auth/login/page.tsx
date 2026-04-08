"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookSlug = searchParams.get("book") || "";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials.");
        setLoading(false);
        return;
      }

      if (bookSlug) {
        router.push(`/interview?book=${bookSlug}&session=${data.sessionId}`);
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    backgroundColor: "var(--ink-card)",
    border: "1px solid rgba(191,160,90,0.3)",
    padding: "14px 16px",
    fontFamily: "var(--font-garamond)",
    fontSize: "16px",
    color: "var(--cream)",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-cinzel)",
    fontSize: "9px",
    letterSpacing: "3px",
    color: "var(--gold)",
    textTransform: "uppercase",
    display: "block",
    marginBottom: "8px",
  };

  return (
    <main
      style={{
        backgroundColor: "var(--ink)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-cinzel-deco)",
          fontSize: "22px",
          color: "var(--gold-light)",
          textDecoration: "none",
          marginBottom: "48px",
          display: "block",
        }}
      >
        Chronicled
      </Link>

      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          border: "1px solid rgba(191,160,90,0.25)",
          padding: "48px 44px",
          backgroundColor: "var(--ink-card)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "10px",
            letterSpacing: "5px",
            color: "var(--gold)",
            textTransform: "uppercase",
            textAlign: "center",
            marginBottom: "8px",
          }}
        >
          Welcome Back
        </p>
        <p
          style={{
            fontFamily: "var(--font-garamond)",
            fontStyle: "italic",
            fontSize: "15px",
            color: "var(--parchment)",
            textAlign: "center",
            opacity: 0.7,
            marginBottom: "36px",
            lineHeight: 1.6,
          }}
        >
          Your chronicle awaits.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={inputStyle}
            />
          </div>

          {error && (
            <p style={{ fontFamily: "var(--font-garamond)", fontSize: "14px", color: "#c97b7b", fontStyle: "italic", textAlign: "center" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "10px",
              letterSpacing: "3px",
              color: "var(--ink)",
              backgroundColor: loading ? "rgba(191,160,90,0.5)" : "var(--gold-light)",
              border: "none",
              padding: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              textTransform: "uppercase",
              marginTop: "8px",
            }}
          >
            {loading ? "Signing in..." : "Continue →"}
          </button>
        </form>

        <p
          style={{
            fontFamily: "var(--font-garamond)",
            fontStyle: "italic",
            fontSize: "13px",
            color: "var(--gold)",
            textAlign: "center",
            marginTop: "24px",
            opacity: 0.6,
          }}
        >
          New to Chronicled?{" "}
          <Link href="/begin" style={{ color: "var(--gold-light)", opacity: 1 }}>
            Begin your story
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
