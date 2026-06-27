"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";

// ── CONTACT SECTION COMPONENT ──
function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(20,14,6,0.8)",
    border: "1px solid rgba(191,160,90,0.25)",
    borderRadius: "6px",
    padding: "14px 18px",
    color: "#e8d5a3",
    fontSize: "15px",
    fontFamily: "var(--font-inter)",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  return (
    <section
      id="contact"
      style={{
        padding: "100px 24px",
        maxWidth: "680px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        style={{ textAlign: "center", marginBottom: "52px" }}
      >
        <p style={{
          fontFamily: "var(--font-inter)",
          fontSize: "11px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#b8961e",
          marginBottom: "16px",
        }}>Get In Touch</p>
        <h2 style={{
          fontFamily: "var(--font-cinzel-deco)",
          fontSize: "clamp(26px, 4vw, 38px)",
          color: "#e8d5a3",
          margin: "0 0 16px",
          lineHeight: 1.3,
        }}>Questions &amp; Inquiries</h2>
        <p style={{
          fontFamily: "var(--font-garamond)",
          fontStyle: "italic",
          fontSize: "17px",
          color: "#b8961e",
          opacity: 0.85,
          margin: 0,
        }}>We read every message. A member of our team will reply within 24 hours.</p>
      </motion.div>

      {/* Form or Success */}
      {status === "success" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: "rgba(20,14,6,0.9)",
            border: "1px solid rgba(191,160,90,0.3)",
            borderRadius: "12px",
            padding: "56px 40px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "40px", marginBottom: "20px" }}>✉️</div>
          <h3 style={{
            fontFamily: "var(--font-cinzel-deco)",
            color: "#d4a843",
            fontSize: "22px",
            marginBottom: "12px",
          }}>Message Received</h3>
          <p style={{
            fontFamily: "var(--font-garamond)",
            fontStyle: "italic",
            color: "#e8d5a3",
            fontSize: "16px",
            opacity: 0.8,
            margin: "0 0 28px",
          }}>Thank you for reaching out. We will be in touch shortly.</p>
          <button
            onClick={() => setStatus("idle")}
            style={{
              background: "transparent",
              border: "1px solid rgba(191,160,90,0.4)",
              color: "#b8961e",
              padding: "10px 24px",
              borderRadius: "6px",
              cursor: "pointer",
              fontFamily: "var(--font-inter)",
              fontSize: "13px",
              letterSpacing: "0.06em",
            }}
          >Send Another Message</button>
        </motion.div>
      ) : (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          onSubmit={handleSubmit}
          style={{
            background: "rgba(16,11,4,0.85)",
            border: "1px solid rgba(191,160,90,0.2)",
            borderRadius: "12px",
            padding: "clamp(28px, 5vw, 52px)",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Row: Name + Email */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontFamily: "var(--font-inter)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#8a7040" }}>Name *</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = "rgba(191,160,90,0.6)")}
                onBlur={e => (e.target.style.borderColor = "rgba(191,160,90,0.25)")}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontFamily: "var(--font-inter)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#8a7040" }}>Email *</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = "rgba(191,160,90,0.6)")}
                onBlur={e => (e.target.style.borderColor = "rgba(191,160,90,0.25)")}
              />
            </div>
          </div>

          {/* Subject */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontFamily: "var(--font-inter)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#8a7040" }}>Subject</label>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              placeholder="Order question, custom request, partnership..."
              value={form.subject}
              onChange={handleChange}
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = "rgba(191,160,90,0.6)")}
              onBlur={e => (e.target.style.borderColor = "rgba(191,160,90,0.25)")}
            />
          </div>

          {/* Message */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontFamily: "var(--font-inter)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#8a7040" }}>Message *</label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={6}
              placeholder="Tell us about your project, question, or idea..."
              value={form.message}
              onChange={handleChange}
              style={{ ...inputStyle, resize: "vertical", minHeight: "140px" }}
              onFocus={e => (e.target.style.borderColor = "rgba(191,160,90,0.6)")}
              onBlur={e => (e.target.style.borderColor = "rgba(191,160,90,0.25)")}
            />
          </div>

          {/* Error */}
          {status === "error" && (
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "#e05c5c", margin: 0 }}>
              {errorMsg || "Something went wrong. Please try again."}
            </p>
          )}

          {/* Submit */}
          <motion.button
            id="contact-submit"
            type="submit"
            disabled={status === "sending"}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: status === "sending" ? "rgba(180,140,50,0.3)" : "linear-gradient(135deg, #b8961e 0%, #d4a843 50%, #b8961e 100%)",
              color: status === "sending" ? "rgba(20,14,6,0.6)" : "#14090a",
              border: "none",
              borderRadius: "8px",
              padding: "16px 32px",
              fontFamily: "var(--font-inter)",
              fontWeight: 700,
              fontSize: "13px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: status === "sending" ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              marginTop: "4px",
            }}
          >
            {status === "sending" ? "Sending..." : "Send Message"}
          </motion.button>
        </motion.form>
      )}
    </section>
  );
}

const books = [
  {
    slug: "romeo-and-juliet",
    title: "Romeo & Juliet",
    theme: "Tragic Love",
    tone: "Fateful · Romantic · Bittersweet",
    description:
      "For the love that burned too bright. Your story told with the weight of fate, the beauty of sacrifice, and the ache of what could not be changed.",
    roman: "I",
    color: "#7B2D3E",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=220&fit=crop&auto=format&q=80",
  },
  {
    slug: "pride-and-prejudice",
    title: "Pride & Prejudice",
    theme: "Love That Endured",
    tone: "Witty · Warm · Triumphant",
    description:
      "For the love that almost wasn't. Your story told with sharp wit, gentle irony, and the deep satisfaction of a heart that chose well.",
    roman: "II",
    color: "#3E6B5C",
    image: "https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?w=600&h=220&fit=crop&auto=format&q=80",
  },
  {
    slug: "the-great-gatsby",
    title: "The Great Gatsby",
    theme: "Ambition & Reinvention",
    tone: "Glamorous · Cautionary · Sharp",
    description:
      "For the dreamer who reached across the water. Your story told with the shimmer of possibility and the weight of everything you built.",
    roman: "III",
    color: "#9A7B2F",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=220&fit=crop&auto=format&q=80",
  },
  {
    slug: "the-odyssey",
    title: "The Odyssey",
    theme: "A Life of Adventure",
    tone: "Epic · Wandering · Hard-Won",
    description:
      "For the one who went out into the world and didn't come back the same. Your story told as the journey it truly was.",
    roman: "IV",
    color: "#4A6B8A",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=220&fit=crop&auto=format&q=80",
  },
  {
    slug: "a-christmas-carol",
    title: "A Christmas Carol",
    theme: "Redemption",
    tone: "Honest · Wry · Hopeful",
    description:
      "For the one who changed. Your story told with honesty about who you were, and generosity about who you became.",
    roman: "V",
    color: "#5C4A7A",
    image: "https://images.unsplash.com/photo-1482349212652-744925b6bb50?w=600&h=220&fit=crop&auto=format&q=80",
  },
  {
    slug: "the-count-of-monte-cristo",
    title: "The Count of Monte Cristo",
    theme: "Betrayal & Triumph",
    tone: "Bold · Dramatic · Satisfying",
    description:
      "For the one who was wronged and rose anyway. Your story told with the full drama it deserves and the ending it earned.",
    roman: "VI",
    color: "#7A4A2A",
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&h=220&fit=crop&auto=format&q=80",
  },
  {
    slug: "jane-eyre",
    title: "Jane Eyre",
    theme: "A Life on Her Own Terms",
    tone: "Fierce · Intimate · Triumphant",
    description:
      "For the woman who refused to settle. Your story told with moral courage, quiet strength, and the dignity of someone who always knew her own worth.",
    roman: "VII",
    color: "#6B4A5A",
    image: "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=600&h=220&fit=crop&auto=format&q=80",
  },
  {
    slug: "little-women",
    title: "Little Women",
    theme: "Family, Dreams & the People Who Made You",
    tone: "Warm · Nostalgic · Life-Affirming",
    description:
      "For the family story — the sisters, the sacrifices, the love that shaped everything. Your story told with warmth, humor, and the full beauty of a life extraordinarily lived.",
    roman: "VIII",
    color: "#A07840",
    image: "https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=600&h=220&fit=crop&auto=format&q=80",
  },
  {
    slug: "wuthering-heights",
    title: "Wuthering Heights",
    theme: "The Love That Never Let Go",
    tone: "Wild · Haunting · Unforgettable",
    description:
      "For the love that defied everything — time, circumstance, reason itself. Your story told with the raw intensity of a feeling that simply could not be contained.",
    roman: "IX",
    color: "#3A4550",
    image: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=600&h=220&fit=crop&auto=format&q=80",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("chronicled_user_id"));
  }, []);

  return (
    <main style={{ backgroundColor: "var(--ink)", minHeight: "100vh" }}>

      {/* ── NAV ── */}
      <nav
        style={{
          borderBottom: "1px solid rgba(191,160,90,0.15)",
          padding: "24px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-cinzel-deco)",
            fontSize: "22px",
            color: "var(--gold-light)",
            letterSpacing: "1.5px",
          }}
        >
          Chronicled
        </span>
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          <Link
            href="/how-it-works"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "0.08em",
              color: "var(--parchment)",
              textDecoration: "none",
              textTransform: "uppercase",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-light)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--parchment)")}
          >
            How It Works
          </Link>
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "0.08em",
                color: "var(--parchment)",
                textDecoration: "none",
                textTransform: "uppercase",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-light)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--parchment)")}
            >
              My Library
            </Link>
          ) : (
            <Link
              href="/auth/login"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "0.08em",
                color: "var(--parchment)",
                textDecoration: "none",
                textTransform: "uppercase",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-light)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--parchment)")}
            >
              Sign In
            </Link>
          )}
          <Link
            href="/begin"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: "var(--ink)",
              backgroundColor: "var(--gold-light)",
              padding: "12px 24px",
              textDecoration: "none",
              textTransform: "uppercase",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(191,160,90,0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--cream)";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(191,160,90,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--gold-light)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(191,160,90,0.15)";
            }}
          >
            Begin Your Story
          </Link>
        </div>
      </nav>

      {/* ── Announcement Banner ── */}
      <div style={{
        backgroundColor: "rgba(191,160,90,0.06)",
        borderTop: "1px solid rgba(191,160,90,0.2)",
        borderBottom: "1px solid rgba(191,160,90,0.2)",
        padding: "12px 20px",
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: "var(--font-inter)",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.08em",
          color: "var(--gold-light)",
          textTransform: "uppercase",
          margin: 0,
        }}>
          ✦ &nbsp; Founding Member Rate — $14.99 &nbsp;·&nbsp; First 100 Chronicles Only &nbsp;·&nbsp; Price Rises Soon &nbsp; ✦
        </p>
      </div>

      {/* ── HERO ── */}
      <section
        style={{
          position: "relative",
          textAlign: "center",
          padding: "120px 40px 100px",
          overflow: "hidden",
        }}
      >
        {/* Atmospheric background image — very dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1400&h=800&fit=crop&auto=format&q=60')",
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
            opacity: 0.18,
            zIndex: 0,
          }}
        />
        {/* Gradient vignette over the image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, rgba(13,17,23,0.3) 0%, rgba(13,17,23,0.95) 100%)",
            zIndex: 1,
          }}
        />

        {/* Hero content */}
        <div style={{ position: "relative", zIndex: 2, maxWidth: "760px", margin: "0 auto" }}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.15em",
              color: "var(--gold)",
              textTransform: "uppercase",
              marginBottom: "28px",
            }}
          >
            A Literary Chronicle
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            style={{
              fontFamily: "var(--font-cinzel-deco)",
              fontSize: "clamp(42px, 7vw, 72px)",
              color: "var(--cream)",
              lineHeight: 1.15,
              marginBottom: "28px",
              fontWeight: 400,
            }}
          >
            Your Life.
            <br />
            <span style={{ color: "var(--gold-light)" }}>A Legendary Narrative.</span>
          </motion.h1>

          {/* Gold rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              height: "1px",
              background: "linear-gradient(to right, transparent, var(--gold), transparent)",
              margin: "0 auto 36px",
              maxWidth: "240px",
            }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              fontFamily: "var(--font-garamond)",
              fontSize: "22px",
              color: "var(--cream)",
              lineHeight: 1.8,
              marginBottom: "48px",
            }}
          >
            Choose a classic book. Answer our questions.
            <br />
            Receive a beautifully crafted chronicle of your life —<br />
            part memoir, part masterpiece.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            style={{ display: "flex", gap: "18px", justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link
              href="/begin"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: "var(--ink)",
                backgroundColor: "var(--gold-light)",
                padding: "18px 40px",
                textDecoration: "none",
                textTransform: "uppercase",
                display: "inline-block",
                transition: "all 0.25s ease",
                boxShadow: "0 4px 14px rgba(191,160,90,0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--cream)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(191,160,90,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--gold-light)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(191,160,90,0.2)";
              }}
            >
              Begin Your Story
            </Link>
            <Link
              href="#how-it-works"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: "var(--gold)",
                border: "1px solid rgba(191,160,90,0.45)",
                padding: "18px 40px",
                textDecoration: "none",
                textTransform: "uppercase",
                display: "inline-block",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--gold-light)";
                e.currentTarget.style.color = "var(--gold-light)";
                e.currentTarget.style.backgroundColor = "rgba(191,160,90,0.04)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(191,160,90,0.45)";
                e.currentTarget.style.color = "var(--gold)";
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              How It Works
            </Link>
          </motion.div>

          {/* ── Introductory Offer Banner ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            style={{
              marginTop: "44px",
              display: "inline-flex",
              alignItems: "center",
              gap: "16px",
              border: "1px solid rgba(191,160,90,0.3)",
              backgroundColor: "rgba(191,160,90,0.04)",
              padding: "14px 28px",
              borderRadius: "0",
            }}
          >
            <span style={{
              fontFamily: "var(--font-inter)",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: "var(--gold-light)",
              textTransform: "uppercase",
            }}>
              ⏳ Limited Time Offer
            </span>
            <div style={{ width: "1px", height: "16px", backgroundColor: "rgba(191,160,90,0.25)" }} />
            <span style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "16px",
              color: "rgba(191,160,90,0.4)",
              textDecoration: "line-through",
              letterSpacing: "1px",
            }}>
              $24.99
            </span>
            <span style={{
              fontFamily: "var(--font-cinzel-deco)",
              fontSize: "24px",
              color: "var(--cream)",
            }}>
              $14.99
            </span>
          </motion.div>

        </div>
      </section>

      {/* ── ORNAMENT ── */}
      <div style={{ textAlign: "center", color: "var(--gold)", fontSize: "18px", letterSpacing: "12px", marginBottom: "60px", opacity: 0.6 }}>
        ✦ &nbsp; ✦ &nbsp; ✦
      </div>

      {/* ── BOOK GRID ── */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 40px 80px" }}>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.15em",
            color: "var(--gold)",
            textTransform: "uppercase",
            textAlign: "center",
            marginBottom: "48px",
          }}
        >
          Choose Your Story
        </motion.p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {books.map((book, i) => (
            <motion.div
              key={book.slug}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <Link href={`/begin?book=${book.slug}`} style={{ textDecoration: "none", display: "block" }}>
                <div
                  style={{
                    backgroundColor: "var(--ink-card)",
                    border: "1px solid rgba(191,160,90,0.15)",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "var(--gold-light)";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 40px rgba(0,0,0,0.6), 0 0 15px rgba(191,160,90,0.06)`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(191,160,90,0.15)";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  }}
                >
                  {/* ── IMAGE HEADER ── */}
                  <div
                    style={{
                      position: "relative",
                      height: "180px",
                      overflow: "hidden",
                    }}
                  >
                    {/* Photo */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={book.image}
                      alt={book.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                        display: "block",
                      }}
                    />
                    {/* Book-color overlay */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: book.color,
                        opacity: 0.55,
                      }}
                    />
                    {/* Dark gradient at bottom to blend into card */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to bottom, rgba(13,17,23,0.1) 0%, rgba(13,17,23,0.75) 100%)",
                      }}
                    />
                    {/* Roman numeral watermark */}
                    <span
                      style={{
                        fontFamily: "var(--font-cinzel-deco)",
                        fontSize: "72px",
                        color: "var(--gold-light)",
                        opacity: 0.05,
                        position: "absolute",
                        bottom: "-8px",
                        right: "16px",
                        lineHeight: 1,
                        userSelect: "none",
                      }}
                    >
                      {book.roman}
                    </span>
                    {/* Theme label over image */}
                    <p
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "10px",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        color: "rgba(255,255,255,0.85)",
                        textTransform: "uppercase",
                        position: "absolute",
                        top: "18px",
                        left: "20px",
                      }}
                    >
                      {book.theme}
                    </p>
                    {/* Title over image */}
                    <h3
                      style={{
                        fontFamily: "var(--font-cinzel-deco)",
                        fontSize: "20px",
                        color: "#ffffff",
                        fontWeight: 400,
                        lineHeight: 1.25,
                        position: "absolute",
                        bottom: "18px",
                        left: "20px",
                        right: "60px",
                        textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                      }}
                    >
                      {book.title}
                    </h3>
                  </div>

                  {/* ── CARD BODY ── */}
                  <div style={{ padding: "24px 28px 28px" }}>
                    {/* Tone */}
                    <p
                      style={{
                        fontFamily: "var(--font-garamond)",
                        fontStyle: "italic",
                        fontSize: "15px",
                        color: "var(--gold-light)",
                        marginBottom: "14px",
                      }}
                    >
                      {book.tone}
                    </p>

                    {/* Rule */}
                    <div
                      style={{
                        height: "1px",
                        background: `linear-gradient(to right, ${book.color}66, transparent)`,
                        marginBottom: "14px",
                      }}
                    />

                    {/* Description */}
                    <p
                      style={{
                        fontFamily: "var(--font-garamond)",
                        fontSize: "16px",
                        color: "var(--parchment)",
                        lineHeight: 1.75,
                        marginBottom: "24px",
                      }}
                    >
                      {book.description}
                    </p>

                    {/* CTA */}
                    <p
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "11px",
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        color: "var(--gold)",
                        textTransform: "uppercase",
                        margin: 0,
                      }}
                    >
                      Choose This Story →
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        id="how-it-works"
        style={{
          borderTop: "1px solid rgba(191,160,90,0.15)",
          borderBottom: "1px solid rgba(191,160,90,0.15)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "560px",
        }}
      >
        {/* LEFT — Image panel */}
        <div style={{ position: "relative", overflow: "hidden", minHeight: "480px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=700&fit=crop&auto=format&q=75"
            alt="Writing desk with open book"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
          />
          {/* Dark overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to right, rgba(13,17,23,0.3) 0%, rgba(13,17,23,0.55) 100%)",
            }}
          />
          {/* Quote over image */}
          <div
            style={{
              position: "absolute",
              bottom: "48px",
              left: "40px",
              right: "40px",
            }}
          >
            <div
              style={{
                height: "1px",
                background: "linear-gradient(to right, var(--gold), transparent)",
                marginBottom: "20px",
                maxWidth: "80px",
              }}
            />
            <p
              style={{
                fontFamily: "var(--font-garamond)",
                fontStyle: "italic",
                fontSize: "22px",
                color: "var(--cream)",
                lineHeight: 1.8,
                marginBottom: "16px",
              }}
            >
              "The interview takes about 20 minutes.<br />
              The book lasts a lifetime."
            </p>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: "var(--gold)",
                textTransform: "uppercase",
              }}
            >
              — Chronicled
            </p>
          </div>
        </div>

        {/* RIGHT — Steps */}
        <div
          style={{
            backgroundColor: "rgba(20, 27, 36, 0.95)",
            padding: "60px 52px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.15em",
              color: "var(--gold)",
              textTransform: "uppercase",
              marginBottom: "44px",
            }}
          >
            How It Works
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "36px 32px",
            }}
          >
            {[
              { step: "01", title: "Choose Your Book", desc: "Pick the classic that matches the arc of your life." },
              { step: "02", title: "The Interview", desc: "Our literary biographer asks questions. You answer freely — no forms, no limits." },
              { step: "03", title: "Your Book Is Written", desc: "Claude crafts your answers into a 100–150 page literary chronicle." },
              { step: "04", title: "Receive Your Chronicle", desc: "Your beautifully designed digital edition arrives in your inbox instantly." },
            ].map((item) => (
              <div key={item.step}>
                {/* Step number badge */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "36px",
                    height: "36px",
                    border: "1px solid rgba(191,160,90,0.4)",
                    marginBottom: "14px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "var(--gold-light)",
                    }}
                  >
                    {item.step}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    color: "var(--cream)",
                    marginBottom: "10px",
                    textTransform: "uppercase",
                    lineHeight: 1.5,
                  }}
                >
                  {item.title}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-garamond)",
                    fontSize: "15.5px",
                    color: "var(--parchment)",
                    lineHeight: 1.7,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ marginTop: "44px" }}>
            <Link
              href="/begin"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: "var(--ink)",
                backgroundColor: "var(--gold-light)",
                padding: "14px 32px",
                textDecoration: "none",
                textTransform: "uppercase",
                display: "inline-block",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--cream)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--gold-light)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Begin Your Story →
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL STRIP ── */}
      <section
        style={{
          position: "relative",
          padding: "80px 40px",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Background image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=1400&h=500&fit=crop&auto=format&q=60')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.12,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, var(--ink) 0%, transparent 20%, transparent 80%, var(--ink) 100%)",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "640px", margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.15em",
              color: "var(--gold)",
              textTransform: "uppercase",
              marginBottom: "32px",
            }}
          >
            ✦ &nbsp; A Chronicle &nbsp; ✦
          </p>
          <p
            style={{
              fontFamily: "var(--font-garamond)",
              fontStyle: "italic",
              fontSize: "clamp(22px, 3vw, 28px)",
              color: "var(--cream)",
              lineHeight: 1.75,
              marginBottom: "28px",
            }}
          >
            "Every life is a great story.<br />
            Most of them just never get written."
          </p>
          <div
            style={{
              height: "1px",
              background: "linear-gradient(to right, transparent, var(--gold), transparent)",
              maxWidth: "160px",
              margin: "0 auto 20px",
            }}
          />
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              color: "var(--gold)",
              textTransform: "uppercase",
            }}
          >
            — Chronicled
          </p>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ padding: "80px 40px", textAlign: "center", maxWidth: "900px", margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.15em",
            color: "var(--gold)",
            textTransform: "uppercase",
            marginBottom: "48px",
          }}
        >
          Editions
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "24px",
          }}
        >
          {[
            {
              name: "Digital Edition",
              price: "$14.99",
              badge: "Intro Price",
              desc: "Your complete chronicle as a beautifully styled PDF, delivered to your inbox instantly.",
              includes: ["100–150 page PDF", "Vintage book design", "Instant delivery", "Yours forever"],
              highlight: true,
              available: true,
            },
            {
              name: "Softcover Book",
              price: "Coming Soon",
              badge: null,
              desc: "Your chronicle printed and bound, shipped to your door.",
              includes: ["Everything in Digital", "Printed softcover book", "Worldwide shipping"],
              highlight: false,
              available: false,
            },
            {
              name: "Hardcover + Portrait",
              price: "Coming Soon",
              badge: null,
              desc: "The definitive edition. Includes your bespoke Royal Portrait.",
              includes: ["Everything in Softcover", "Hardcover binding", "Royal Portrait inside"],
              highlight: false,
              available: false,
            },
          ].map((tier) => (
            <div
              key={tier.name}
              style={{
                border: tier.highlight ? "1px solid var(--gold-light)" : "1px solid rgba(191,160,90,0.15)",
                padding: "44px 28px",
                backgroundColor: tier.highlight ? "rgba(191,160,90,0.06)" : "var(--ink-card)",
                position: "relative",
                opacity: tier.available ? 1 : 0.45,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "440px",
              }}
            >
              <div>
                {tier.badge && (
                  <p
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "9px",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      color: "var(--ink)",
                      backgroundColor: "var(--gold)",
                      padding: "4px 12px",
                      position: "absolute",
                      top: "-12px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      whiteSpace: "nowrap",
                      textTransform: "uppercase",
                    }}
                  >
                    {tier.badge}
                  </p>
                )}
                {!tier.available && (
                  <p style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "9px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    color: "var(--gold)",
                    border: "1px solid rgba(191,160,90,0.3)",
                    backgroundColor: "rgba(191,160,90,0.05)",
                    padding: "4px 12px",
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    whiteSpace: "nowrap",
                    textTransform: "uppercase"
                  }}>
                    Coming Soon
                  </p>
                )}
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    color: "var(--gold-light)",
                    textTransform: "uppercase",
                    marginBottom: "12px",
                    marginTop: "8px",
                  }}
                >
                  {tier.name}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-cinzel-deco)",
                    fontSize: "38px",
                    color: "var(--cream)",
                    marginBottom: "16px",
                  }}
                >
                  {tier.price}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-garamond)",
                    fontSize: "15px",
                    color: "var(--parchment)",
                    lineHeight: 1.7,
                    marginBottom: "24px",
                  }}
                >
                  {tier.desc}
                </p>
                <div
                  style={{
                    height: "1px",
                    background: "linear-gradient(to right, transparent, rgba(191,160,90,0.25), transparent)",
                    marginBottom: "20px",
                  }}
                />
                <ul style={{ listStyle: "none", padding: 0, marginBottom: "28px", textAlign: "left" }}>
                  {tier.includes.map((item) => (
                    <li
                      key={item}
                      style={{
                        fontFamily: "var(--font-garamond)",
                        fontSize: "15px",
                        color: "var(--parchment)",
                        marginBottom: "10px",
                      }}
                    >
                      <span style={{ color: "var(--gold-light)" }}>✦</span> &nbsp;{item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Link
                  href={tier.available ? "/begin" : "#"}
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    color: tier.highlight ? "var(--ink)" : "var(--gold)",
                    backgroundColor: tier.highlight ? "var(--gold-light)" : "transparent",
                    border: tier.highlight ? "none" : "1px solid rgba(191,160,90,0.4)",
                    padding: "14px 24px",
                    textDecoration: "none",
                    textTransform: "uppercase",
                    display: "block",
                    transition: "all 0.2s ease",
                    cursor: tier.available ? "pointer" : "default",
                  }}
                  onMouseEnter={(e) => {
                    if (tier.available) {
                      e.currentTarget.style.backgroundColor = tier.highlight ? "var(--cream)" : "rgba(191,160,90,0.06)";
                      if (!tier.highlight) e.currentTarget.style.borderColor = "var(--gold-light)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (tier.available) {
                      e.currentTarget.style.backgroundColor = tier.highlight ? "var(--gold-light)" : "transparent";
                      if (!tier.highlight) e.currentTarget.style.borderColor = "rgba(191,160,90,0.4)";
                    }
                  }}
                >
                  Begin Your Story
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <ContactSection />

      {/* ── FOOTER ── */}
      <footer
        style={{
          borderTop: "1px solid rgba(191,160,90,0.15)",
          padding: "50px 40px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-cinzel-deco)",
            fontSize: "18px",
            color: "var(--gold-light)",
            marginBottom: "8px",
          }}
        >
          Chronicled
        </p>
        <p
          style={{
            fontFamily: "var(--font-garamond)",
            fontStyle: "italic",
            fontSize: "14px",
            color: "var(--gold)",
            opacity: 0.8,
            marginBottom: "24px",
          }}
        >
          Your life. A legendary narrative.
        </p>
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "11px",
            letterSpacing: "0.05em",
            color: "var(--gold)",
            opacity: 0.5,
            textTransform: "uppercase",
          }}
        >
          © 2026 Chronicled · getchronicled.art
        </p>
      </footer>
    </main>
  );
}
