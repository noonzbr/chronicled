"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { getBook } from "@/lib/books";

const TIERS = [
  { key: "digital", label: "Digital Edition", price: "$14.99", desc: "Beautifully styled PDF delivered to your inbox instantly.", includes: ["100–150 page PDF", "Vintage book design", "Instant delivery", "Yours forever"], highlight: true, available: true },
  { key: "softcover", label: "Softcover Book", price: "Coming Soon", desc: "Your chronicle printed and bound, shipped to your door.", includes: ["Everything in Digital", "Printed softcover book", "Worldwide shipping"], highlight: false, available: false },
  { key: "hardcover", label: "Hardcover + Portrait", price: "Coming Soon", desc: "The definitive edition with your bespoke Royal Portrait.", includes: ["Everything in Softcover", "Premium hardcover binding", "Royal Portrait inside"], highlight: false, available: false },
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

  // Gift options state
  const [isGift, setIsGift] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [giftMessage, setGiftMessage] = useState("");

  async function handleCheckout() {
    setLoading(true);
    setError("");

    // Only digital available right now
    if (selectedTier !== "digital") {
      setError("Physical editions are coming soon. Please select the Digital Edition.");
      setLoading(false);
      return;
    }

    if (isGift) {
      if (!recipientName.trim()) {
        setError("Please enter the recipient's name.");
        setLoading(false);
        return;
      }
      if (!recipientEmail.trim() || !recipientEmail.includes("@")) {
        setError("Please enter a valid email address for the recipient.");
        setLoading(false);
        return;
      }
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
          isGift,
          recipientEmail,
          recipientName,
          giftMessage,
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
      <div style={{ borderBottom: "1px solid rgba(191,160,90,0.15)", padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "18px", color: "var(--gold-light)" }}>Chronicled</span>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", color: "var(--gold-light)", textTransform: "uppercase" }}>
          Step 3 of 3 &nbsp;·&nbsp; Choose Your Edition
        </p>
      </div>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "60px 40px" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ textAlign: "center", marginBottom: "56px" }}>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.15em", color: "var(--gold)", textTransform: "uppercase", marginBottom: "16px" }}>
            Your Chronicle Is Ready
          </p>
          <h1 style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "clamp(24px, 4vw, 38px)", color: "var(--cream)", fontWeight: 400, marginBottom: "16px" }}>
            How would you like it?
          </h1>
          <div style={{ height: "1px", background: "linear-gradient(to right, transparent, var(--gold), transparent)", maxWidth: "200px", margin: "0 auto 20px" }} />
          {book && (
            <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "18px", color: "var(--cream)" }}>
              A {book.title} Chronicle
            </p>
          )}
        </motion.div>

        {/* Tier cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px", marginBottom: "48px" }}>
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
                  border: isSelected ? "1px solid var(--gold-light)" : tier.highlight ? "1px solid rgba(191,160,90,0.3)" : "1px solid rgba(191,160,90,0.15)",
                  padding: "36px 28px",
                  cursor: tier.available ? "pointer" : "default",
                  backgroundColor: isSelected ? "rgba(191,160,90,0.06)" : tier.highlight ? "rgba(191,160,90,0.03)" : "var(--ink-card)",
                  opacity: tier.available ? 1 : 0.45,
                  transition: "all 0.25s ease",
                  position: "relative",
                }}
              >
                {tier.highlight && (
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.08em", color: "var(--ink)", backgroundColor: "var(--gold)", padding: "4px 12px", position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", textTransform: "uppercase" }}>
                    Intro Price
                  </p>
                )}
                {!tier.available && (
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.08em", color: "var(--gold)", backgroundColor: "rgba(191,160,90,0.05)", border: "1px solid rgba(191,160,90,0.3)", padding: "4px 12px", position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", textTransform: "uppercase" }}>
                    Coming Soon
                  </p>
                )}
                {isSelected && (
                  <div style={{ position: "absolute", top: "16px", right: "16px", width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "var(--gold-light)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)", fontSize: "12px", fontWeight: "bold" }}>✓</div>
                )}
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", color: "var(--gold-light)", textTransform: "uppercase", marginBottom: "12px" }}>
                  {tier.label}
                </p>
                <p style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "34px", color: "var(--cream)", marginBottom: "16px" }}>
                  {tier.price}
                </p>
                <p style={{ fontFamily: "var(--font-garamond)", fontSize: "15px", color: "var(--parchment)", lineHeight: 1.6, marginBottom: "20px" }}>
                  {tier.desc}
                </p>
                <div style={{ height: "1px", background: "linear-gradient(to right, rgba(191,160,90,0.25), transparent)", marginBottom: "20px" }} />
                {tier.includes.map((item) => (
                  <p key={item} style={{ fontFamily: "var(--font-garamond)", fontSize: "15px", color: "var(--parchment)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "var(--gold-light)" }}>✦</span> {item}
                  </p>
                ))}
              </motion.div>
            );
          })}
        </div>

        {/* Gift Options */}
        <div
          style={{
            border: "1px solid rgba(191,160,90,0.18)",
            backgroundColor: "var(--ink-card)",
            padding: "28px 32px",
            marginBottom: "40px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => setIsGift(!isGift)}>
            <div
              style={{
                width: "20px",
                height: "20px",
                border: "1px solid rgba(191,160,90,0.4)",
                backgroundColor: isGift ? "var(--gold-light)" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--ink)",
                fontSize: "12px",
                fontWeight: "bold",
                transition: "all 0.2s ease",
              }}
            >
              {isGift && "✓"}
            </div>
            <span
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "14px",
                fontWeight: 500,
                color: "var(--cream)",
                letterSpacing: "0.02em",
                userSelect: "none",
              }}
            >
              🎁 This chronicle is a gift for someone special
            </span>
          </div>

          {isGift && (
            <div
              style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "16px", overflow: "hidden" }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "10px",
                      fontWeight: 600,
                      color: "var(--gold)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Recipient's Name
                  </label>
                  <input
                    type="text"
                    required={isGift}
                    placeholder="Sarah"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    style={{
                      width: "100%",
                      backgroundColor: "rgba(13, 17, 23, 0.4)",
                      border: "1px solid rgba(191,160,90,0.25)",
                      padding: "12px 14px",
                      fontFamily: "var(--font-inter)",
                      fontSize: "13px",
                      color: "var(--cream)",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "10px",
                      fontWeight: 600,
                      color: "var(--gold)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Recipient's Email Address
                  </label>
                  <input
                    type="email"
                    required={isGift}
                    placeholder="recipient@example.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    style={{
                      width: "100%",
                      backgroundColor: "rgba(13, 17, 23, 0.4)",
                      border: "1px solid rgba(191,160,90,0.25)",
                      padding: "12px 14px",
                      fontFamily: "var(--font-inter)",
                      fontSize: "13px",
                      color: "var(--cream)",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "var(--gold)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Gift Message (Optional)
                </label>
                <textarea
                  placeholder="Write a personal note to be included with the chronicle..."
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  rows={3}
                  style={{
                    width: "100%",
                    backgroundColor: "rgba(13, 17, 23, 0.4)",
                    border: "1px solid rgba(191,160,90,0.25)",
                    padding: "12px 14px",
                    fontFamily: "var(--font-inter)",
                    fontSize: "13px",
                    color: "var(--cream)",
                    outline: "none",
                    resize: "none",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {error && (
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", fontWeight: 500, color: "#f87171", textAlign: "center", marginBottom: "24px" }}>
            {error}
          </p>
        )}

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={handleCheckout}
            disabled={loading}
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: "var(--ink)",
              backgroundColor: loading ? "rgba(191,160,90,0.5)" : "var(--gold-light)",
              border: "none",
              padding: "18px 52px",
              cursor: loading ? "not-allowed" : "pointer",
              textTransform: "uppercase",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 14px rgba(191,160,90,0.2)",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = "var(--cream)";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(191,160,90,0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = "var(--gold-light)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(191,160,90,0.2)";
              }
            }}
          >
            {loading ? "Preparing Payment..." : `Continue to Payment →`}
          </button>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 500, color: "var(--gold)", opacity: 0.5, marginTop: "16px", letterSpacing: "0.02em" }}>
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
