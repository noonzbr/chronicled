"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { getBook } from "@/lib/books";

type Order = {
  id: string;
  tier: "digital" | "softcover" | "hardcover";
  amount_cents: number;
  status: string;
  created_at: string;
  download_token: string;
  session_id: string;
  tracking_number?: string;
  book_slug: string;
  book: { title: string; word_count: number } | null;
};

type DashboardData = {
  user: { id: string; name: string; email: string };
  orders: Order[];
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  processing: { label: "Generating",    color: "#D4B86A", bg: "rgba(212,184,106,0.12)" },
  paid:        { label: "Processing",   color: "#D4B86A", bg: "rgba(212,184,106,0.12)" },
  shipped:     { label: "Shipped",      color: "#7AB87A", bg: "rgba(122,184,122,0.12)" },
  complete:    { label: "Complete",     color: "#7AB87A", bg: "rgba(122,184,122,0.12)" },
  refunded:    { label: "Refunded",     color: "#c97b7b", bg: "rgba(201,123,123,0.12)" },
  pending:     { label: "Pending",      color: "#BFA05A", bg: "rgba(191,160,90,0.1)"  },
};

const TIER_ICONS: Record<string, string> = {
  digital:   "✉",
  softcover: "📖",
  hardcover: "✦",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [data,    setData]    = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId,  setUserId]  = useState<string | null>(null);

  useEffect(() => {
    // Try to get userId from localStorage (set on login/signup)
    const stored = localStorage.getItem("chronicled_user_id");
    setUserId(stored);
    fetchDashboard(stored);
  }, []);

  async function fetchDashboard(uid: string | null) {
    try {
      const url = uid ? `/api/dashboard?userId=${uid}` : "/api/dashboard";
      const res  = await fetch(url);
      if (!res.ok) { router.push("/auth/login"); return; }
      const json = await res.json();
      setData(json);
    } catch {
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("chronicled_user_id");
    localStorage.removeItem("chronicled_user_name");
    router.push("/");
  }

  if (loading) {
    return (
      <main style={{ backgroundColor: "var(--ink)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "5px", color: "var(--gold)", textTransform: "uppercase" }}
        >
          Loading your chronicles...
        </motion.p>
      </main>
    );
  }

  if (!data) return null;

  const { user, orders } = data;
  const hasOrders = orders.length > 0;

  return (
    <main style={{ backgroundColor: "var(--ink)", minHeight: "100vh" }}>

      {/* ── NAV ── */}
      <nav style={{ borderBottom: "1px solid rgba(191,160,90,0.2)", padding: "18px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "20px", color: "var(--gold-light)", textDecoration: "none" }}>
          Chronicled
        </Link>
        <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
          <Link
            href="/begin"
            style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "3px", color: "var(--ink)", backgroundColor: "var(--gold)", padding: "10px 20px", textDecoration: "none", textTransform: "uppercase" }}
          >
            New Chronicle
          </Link>
          <button
            onClick={handleLogout}
            style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "3px", color: "var(--gold)", background: "none", border: "none", cursor: "pointer", textTransform: "uppercase", opacity: 0.6 }}
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "56px 40px" }}>

        {/* ── GREETING ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "56px" }}
        >
          <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "6px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "12px" }}>
            Your Library
          </p>
          <h1 style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "clamp(26px, 4vw, 40px)", color: "var(--cream)", fontWeight: 400, marginBottom: "12px" }}>
            Welcome back, {user.name.split(" ")[0]}.
          </h1>
          <div style={{ height: "1px", background: "linear-gradient(to right, var(--gold), transparent)", maxWidth: "220px", marginBottom: "16px" }} />
          <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "16px", color: "var(--parchment)", opacity: 0.6 }}>
            {hasOrders
              ? `You have ${orders.length} chronicle${orders.length > 1 ? "s" : ""} in your library.`
              : "Your first chronicle awaits. Choose your story below."}
          </p>
        </motion.div>

        {/* ── ORDERS ── */}
        {hasOrders ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "60px" }}>
            {orders.map((order, i) => {
              const book    = getBook(order.book_slug);
              const status  = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const appUrl  = process.env.NEXT_PUBLIC_APP_URL || "";
              const dlUrl   = `${appUrl}/api/download?token=${order.download_token}`;
              const pages   = order.book ? Math.round(order.book.word_count / 250) : null;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  style={{
                    border: "1px solid rgba(191,160,90,0.2)",
                    backgroundColor: "var(--ink-card)",
                    overflow: "hidden",
                  }}
                >
                  {/* Card header — colored by book archetype */}
                  <div
                    style={{
                      height: "4px",
                      backgroundColor: book?.color || "var(--gold)",
                    }}
                  />

                  <div style={{ padding: "28px 32px", display: "grid", gridTemplateColumns: "1fr auto", gap: "24px", alignItems: "start" }}>

                    {/* Left — book info */}
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px", flexWrap: "wrap" }}>
                        {/* Tier icon + label */}
                        <span style={{ fontSize: "18px" }}>{TIER_ICONS[order.tier]}</span>
                        <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "3px", color: "var(--gold)", textTransform: "uppercase" }}>
                          {order.tier === "digital" ? "Digital PDF" : order.tier === "softcover" ? "Softcover" : "Hardcover + Portrait"}
                        </span>
                        {/* Status badge */}
                        <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "8px", letterSpacing: "2px", color: status.color, backgroundColor: status.bg, padding: "3px 10px", textTransform: "uppercase" }}>
                          {status.label}
                        </span>
                      </div>

                      <h2 style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "20px", color: "var(--cream)", fontWeight: 400, marginBottom: "6px", lineHeight: 1.3 }}>
                        {order.book?.title || "Your Chronicle"}
                      </h2>

                      <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "14px", color: "var(--gold)", marginBottom: "12px", opacity: 0.7 }}>
                        A {book?.title || ""} Chronicle
                      </p>

                      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                        {order.book?.word_count && (
                          <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "8px", letterSpacing: "2px", color: "var(--parchment)", textTransform: "uppercase", opacity: 0.55 }}>
                            {order.book.word_count.toLocaleString()} words &nbsp;·&nbsp; ~{pages} pages
                          </p>
                        )}
                        <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "8px", letterSpacing: "2px", color: "var(--parchment)", textTransform: "uppercase", opacity: 0.55 }}>
                          {formatDate(order.created_at)} &nbsp;·&nbsp; {formatPrice(order.amount_cents)}
                        </p>
                      </div>

                      {/* Tracking */}
                      {order.tracking_number && (
                        <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "13px", color: "var(--gold)", marginTop: "10px", opacity: 0.7 }}>
                          Tracking: {order.tracking_number}
                        </p>
                      )}
                    </div>

                    {/* Right — actions */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "160px" }}>

                      {/* Download — digital or any complete order */}
                      {(order.tier === "digital" || order.status === "complete") && (
                        <a
                          href={dlUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontFamily: "var(--font-cinzel)",
                            fontSize: "9px",
                            letterSpacing: "2px",
                            color: "var(--ink)",
                            backgroundColor: "var(--gold-light)",
                            padding: "12px 20px",
                            textDecoration: "none",
                            textTransform: "uppercase",
                            textAlign: "center",
                            display: "block",
                          }}
                        >
                          Download PDF
                        </a>
                      )}

                      {/* Preview link */}
                      <Link
                        href={`/preview?book=${order.book_slug}&session=${order.session_id}`}
                        style={{
                          fontFamily: "var(--font-cinzel)",
                          fontSize: "9px",
                          letterSpacing: "2px",
                          color: "var(--gold)",
                          border: "1px solid rgba(191,160,90,0.35)",
                          padding: "11px 20px",
                          textDecoration: "none",
                          textTransform: "uppercase",
                          textAlign: "center",
                          display: "block",
                        }}
                      >
                        View Preview
                      </Link>

                      {/* Physical — in production */}
                      {order.tier !== "digital" && order.status === "paid" && (
                        <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "12px", color: "var(--parchment)", opacity: 0.5, textAlign: "center", lineHeight: 1.6 }}>
                          Printing in progress.<br/>Ships in 7–14 days.
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : null}

        {/* ── EMPTY STATE / NEW CHRONICLE CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            border: "1px solid rgba(191,160,90,0.2)",
            padding: "52px 40px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle background ornament */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <span style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "220px", color: "rgba(191,160,90,0.025)", userSelect: "none", lineHeight: 1 }}>✦</span>
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "6px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "16px" }}>
              {hasOrders ? "Begin Another Chronicle" : "Your Story Awaits"}
            </p>
            <h2 style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "clamp(20px, 3vw, 28px)", color: "var(--cream)", fontWeight: 400, marginBottom: "16px", lineHeight: 1.4 }}>
              {hasOrders ? "Every life has more than one story worth telling." : "Choose your book. Tell your story."}
            </h2>
            <div style={{ height: "1px", background: "linear-gradient(to right, transparent, var(--gold), transparent)", maxWidth: "160px", margin: "0 auto 20px" }} />
            <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "16px", color: "var(--parchment)", opacity: 0.65, lineHeight: 1.8, maxWidth: "460px", margin: "0 auto 36px" }}>
              {hasOrders
                ? "Choose a different archetype. Give another chapter of your life the literary treatment it deserves."
                : "Six classic archetypes. Your real life. One extraordinary book."}
            </p>
            <Link
              href="/begin"
              style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "11px",
                letterSpacing: "3px",
                color: "var(--ink)",
                backgroundColor: "var(--gold-light)",
                padding: "16px 40px",
                textDecoration: "none",
                textTransform: "uppercase",
                display: "inline-block",
              }}
            >
              {hasOrders ? "Start a New Chronicle →" : "Begin Your Story →"}
            </Link>
          </div>
        </motion.div>

        {/* ── ACCOUNT INFO ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{ marginTop: "48px", paddingTop: "32px", borderTop: "1px solid rgba(191,160,90,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}
        >
          <div>
            <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "8px", letterSpacing: "3px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "4px", opacity: 0.6 }}>
              Account
            </p>
            <p style={{ fontFamily: "var(--font-garamond)", fontSize: "15px", color: "var(--parchment)", opacity: 0.7 }}>
              {user.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{ fontFamily: "var(--font-cinzel)", fontSize: "8px", letterSpacing: "3px", color: "var(--gold)", background: "none", border: "1px solid rgba(191,160,90,0.25)", padding: "10px 20px", cursor: "pointer", textTransform: "uppercase", opacity: 0.55 }}
          >
            Sign Out
          </button>
        </motion.div>

      </div>
    </main>
  );
}
