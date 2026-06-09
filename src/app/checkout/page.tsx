"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { getBook } from "@/lib/books";

const TIERS = [
  { key: "digital", label: "Digital Edition", price: "$14.99", desc: "Beautifully styled PDF delivered to your inbox instantly.", includes: ["100–150 page PDF", "Vintage book design", "Instant delivery", "Yours forever"], highlight: true, available: true },
  { key: "softcover", label: "Softcover Book", price: "Coming Soon", desc: "Your chronicle printed and bound, shipped to your door.", includes: ["Everything in Digital", "Printed softcover book", "Worldwide shipping"], highlight: false, available: false },
  { key: "hardcover", label: "Hardcover + Portrait", price: "Coming Soon", desc: "The definitive edition with your AI-generated Royal Portrait.", includes: ["Everything in Softcover", "Premium hardcover binding", "Royal Portrait inside"], highlight: false, available: false },
];

function CheckoutContent() {
  const searchParams = useSearchParams();
  const bookSlug  = searchParams.get("book")    || "the-great-gatsby";
  const sessionId = searchParams.get("session") || "demo";
  const defaultTier = searchParams.get("tier")  || "hardcover";
  const book = getBook(bookSlug);

  const [selectedTier, setSelectedTier] = useState("digital");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setLoading(true);
    setError("");

    // Only digital available right now
    if (selectedTier !== "digital") {
      setError("Physical editions are coming soon. Please select the Digital Edition.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: selectedTier,
          bookSlug,
          sessionId,
          bookTitle: `Your ${book?.title || ""} Chronicle`,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const bookColor = book?.color || "#9A7B2F";

  return (
    <main style={{ backgroundColor: "var(--ink)", minHeight: "100vh", padding: "0 0 80px" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(191,160,90,0.2)", padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "18px", color: "var(--gold-light)" }}>Chronicled</span>
        <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "4px", color: "var(--gold)", textTransform: "uppercase", opacity: 0.7 }}>
          Step 3 of 3 &nbsp;·&nbsp; Choose Your Edition
        </p>
      </div>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "60px 40px" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ textAlign: "center", marginBottom: "56px" }}>
          <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "6px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "16px" }}>
            Your Chronicle Is Ready
          </p>
          <h1 style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "clamp(24px, 4vw, 38px)", color: "var(--cream)", fontWeight: 400, marginBottom: "12px" }}>
            How would you like it?
          </h1>
          <div style={{ height: "1px", background: "linear-gradient(to right, transparent, var(--gold), transparent)", maxWidth: "200px", margin: "0 auto 16px" }} />
          {book && (
            <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "16px", color: "var(--parchment)", opacity: 0.7 }}>
              A {book.title} Chronicle
            </p>
          )}
        </motion.div>

        {/* Tier cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px", marginBottom: "40px" }}>
          {TIERS.map((tier, i) => {
            const isSelected = selectedTier === tier.key;
            return (
              <motion.div
                key={tier.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                onClick={() => tier.available && setSelectedTier(tier.key)}
                style={{
                  border: isSelected ? `1px solid ${bookColor}` : tier.highlight ? "1px solid rgba(191,160,90,0.4)" : "1px solid rgba(191,160,90,0.15)",
                  padding: "32px 28px",
                  cursor: tier.available ? "pointer" : "default",
                  backgroundColor: isSelected ? `${bookColor}15` : tier.highlight ? "rgba(191,160,90,0.06)" : "var(--ink-card)",
                  opacity: tier.available ? 1 : 0.45,
                  transition: "all 0.2s",
                  position: "relative",
                }}
              >
                {tier.highlight && (
                  <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "7px", letterSpacing: "3px", color: "var(--ink)", backgroundColor: "var(--gold)", padding: "3px 10px", position: "absolute", top: "-11px", left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", textTransform: "uppercase" }}>
                    Intro Price
                  </p>
                )}
                {!tier.available && (
                  <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "7px", letterSpacing: "3px", color: "var(--gold)", backgroundColor: "rgba(191,160,90,0.1)", border: "1px solid rgba(191,160,90,0.3)", padding: "3px 10px", position: "absolute", top: "-11px", left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", textTransform: "uppercase" }}>
                    Coming Soon
                  </p>
                )}
                {isSelected && (
                  <div style={{ position: "absolute", top: "14px", right: "14px", width: "22px", height: "22px", borderRadius: "50%", backgroundColor: bookColor, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "11px" }}>✓</div>
                )}
                <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "3px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "8px" }}>
                  {tier.label}
                </p>
                <p style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "34px", color: "var(--cream)", marginBottom: "10px" }}>
                  {tier.price}
                </p>
                <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "13.5px", color: "var(--parchment)", lineHeight: 1.7, marginBottom: "16px", opacity: 0.75 }}>
                  {tier.desc}
                </p>
                <div style={{ height: "1px", background: "linear-gradient(to right, rgba(191,160,90,0.3), transparent)", marginBottom: "14px" }} />
                {tier.includes.map((item) => (
                  <p key={item} style={{ fontFamily: "var(--font-garamond)", fontSize: "13px", color: "var(--parchment)", marginBottom: "5px", opacity: 0.65 }}>
                    ✦ &nbsp;{item}
                  </p>
                ))}
              </motion.div>
            );
          })}
        </div>

        {error && (
          <p style={{ fontFamily: "var(--font-garamond)", fontSize: "14px", color: "#c97b7b", fontStyle: "italic", textAlign: "center", marginBottom: "20px" }}>
            {error}
          </p>
        )}

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={handleCheckout}
            disabled={loading}
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "11px",
              letterSpacing: "3px",
              color: "var(--ink)",
              backgroundColor: loading ? "rgba(191,160,90,0.5)" : "var(--gold-light)",
              border: "none",
              padding: "18px 52px",
              cursor: loading ? "not-allowed" : "pointer",
              textTransform: "uppercase",
              transition: "background-color 0.2s",
            }}
          >
            {loading ? "Preparing Payment..." : `Continue to Payment →`}
          </button>
          <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "12px", color: "var(--gold)", opacity: 0.5, marginTop: "14px" }}>
            Secured by Stripe · Your story is always yours
          </p>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return <Suspense><CheckoutContent /></Suspense>;
}
