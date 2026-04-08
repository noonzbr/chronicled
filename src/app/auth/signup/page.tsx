"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getBook } from "@/lib/books";

function SignUpForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookSlug = searchParams.get("book") || "";
  const book = getBook(bookSlug);

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, bookSlug }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      router.push(`/interview?book=${bookSlug}&session=${data.sessionId}`);
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
    transition: "border-color 0.2s",
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
      {/* Logo */}
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
          maxWidth: "460px",
          border: "1px solid rgba(191,160,90,0.25)",
          padding: "48px 44px",
          backgroundColor: "var(--ink-card)",
          position: "relative",
        }}
      >
        {/* Selected book badge */}
        {book && (
          <div
            style={{
              textAlign: "center",
              marginBottom: "32px",
              paddingBottom: "28px",
              borderBottom: "1px solid rgba(191,160,90,0.2)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "8px",
                letterSpacing: "4px",
                color: "var(--gold)",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              Your Story
            </p>
            <p
              style={{
                fontFamily: "var(--font-cinzel-deco)",
                fontSize: "16px",
                color: "var(--cream)",
              }}
            >
              {book.title}
            </p>
          </div>
        )}

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
          Create Your Account
        </p>
        <p
          style={{
            fontFamily: "var(--font-garamond)",
            fontStyle: "italic",
            fontSize: "15px",
            color: "var(--parchment)",
            textAlign: "center",
            opacity: 0.7,
            marginBottom: "32px",
            lineHeight: 1.6,
          }}
        >
          Save your progress and return to your chronicle at any time.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={labelStyle}>Your Name</label>
            <input
              type="text"
              required
              placeholder="As you'd like to be addressed"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              required
              placeholder="For your book delivery"
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
              placeholder="At least 8 characters"
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={inputStyle}
            />
          </div>

          {error && (
            <p
              style={{
                fontFamily: "var(--font-garamond)",
                fontSize: "14px",
                color: "#c97b7b",
                fontStyle: "italic",
                textAlign: "center",
              }}
            >
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
              transition: "background-color 0.2s",
            }}
          >
            {loading ? "Beginning..." : "Begin the Interview →"}
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
          Already have an account?{" "}
          <Link
            href={`/auth/login?book=${bookSlug}`}
            style={{ color: "var(--gold-light)", opacity: 1 }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}
