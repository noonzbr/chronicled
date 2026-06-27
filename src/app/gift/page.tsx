"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const books = [
  { slug: "romeo-and-juliet", title: "Romeo & Juliet", theme: "Tragic Love", roman: "I", color: "#7B2D3E", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=260&fit=crop&auto=format&q=80" },
  { slug: "pride-and-prejudice", title: "Pride & Prejudice", theme: "Love That Endured", roman: "II", color: "#3E6B5C", image: "https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?w=400&h=260&fit=crop&auto=format&q=80" },
  { slug: "the-great-gatsby", title: "The Great Gatsby", theme: "Ambition & Reinvention", roman: "III", color: "#9A7B2F", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=260&fit=crop&auto=format&q=80" },
  { slug: "the-odyssey", title: "The Odyssey", theme: "A Life of Adventure", roman: "IV", color: "#4A6B8A", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=260&fit=crop&auto=format&q=80" },
  { slug: "a-christmas-carol", title: "A Christmas Carol", theme: "Redemption", roman: "V", color: "#5C4A7A", image: "https://images.unsplash.com/photo-1482349212652-744925b6bb50?w=400&h=260&fit=crop&auto=format&q=80" },
  { slug: "the-count-of-monte-cristo", title: "The Count of Monte Cristo", theme: "Betrayal & Triumph", roman: "VI", color: "#7A4A2A", image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=260&fit=crop&auto=format&q=80" },
  { slug: "jane-eyre", title: "Jane Eyre", theme: "A Life on Her Own Terms", roman: "VII", color: "#6B4A5A", image: "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=400&h=260&fit=crop&auto=format&q=80" },
  { slug: "little-women", title: "Little Women", theme: "Family, Dreams & the People Who Made You", roman: "VIII", color: "#A07840", image: "https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=400&h=260&fit=crop&auto=format&q=80" },
  { slug: "wuthering-heights", title: "Wuthering Heights", theme: "The Love That Never Let Go", roman: "IX", color: "#3A4550", image: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=400&h=260&fit=crop&auto=format&q=80" },
];

const occasions = [
  { icon: "✦", label: "Mother's Day" },
  { icon: "✦", label: "Father's Day" },
  { icon: "✦", label: "Birthday" },
  { icon: "✦", label: "Anniversary" },
  { icon: "✦", label: "Graduation" },
  { icon: "✦", label: "Retirement" },
  { icon: "✦", label: "Wedding" },
  { icon: "✦", label: "Just Because" },
];

export default function GiftPage() {
  return (
    <main style={{ backgroundColor: "var(--ink)", minHeight: "100vh", color: "var(--cream)" }}>

      {/* NAV */}
      <nav style={{
        borderBottom: "1px solid rgba(191,160,90,0.15)",
        padding: "24px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
        zIndex: 10,
      }}>
        <Link href="/" style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "22px", color: "var(--gold-light)", letterSpacing: "1.5px", textDecoration: "none" }}>
          Chronicled
        </Link>
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          <Link href="/#how-it-works" style={{ fontFamily: "var(--font-inter)", fontSize: "13px", fontWeight: 500, letterSpacing: "0.08em", color: "var(--parchment)", textDecoration: "none", textTransform: "uppercase" }}>
            How It Works
          </Link>
          <Link href="/begin" style={{
            fontFamily: "var(--font-inter)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em",
            color: "var(--ink)", backgroundColor: "var(--gold-light)", padding: "12px 24px",
            textDecoration: "none", textTransform: "uppercase",
          }}>
            Begin Your Story
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: "relative", textAlign: "center", padding: "100px 40px 80px", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1400&h=700&fit=crop&auto=format&q=60')",
          backgroundSize: "cover", backgroundPosition: "center 40%", opacity: 0.14, zIndex: 0,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at center, rgba(13,17,23,0.2) 0%, rgba(13,17,23,0.95) 100%)",
          zIndex: 1,
        }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: "720px", margin: "0 auto" }}>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
            style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.16em", color: "var(--gold)", textTransform: "uppercase", marginBottom: "24px" }}
          >
            The Gift of a Lifetime
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1 }}
            style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "clamp(36px, 6vw, 66px)", color: "var(--cream)", lineHeight: 1.15, marginBottom: "28px", fontWeight: 400 }}
          >
            Give Someone
            <br />
            <span style={{ color: "var(--gold-light)" }}>Their Own Classic.</span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.4 }}
            style={{ height: "1px", background: "linear-gradient(to right, transparent, var(--gold), transparent)", margin: "0 auto 32px", maxWidth: "200px" }}
          />

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
            style={{ fontFamily: "var(--font-garamond)", fontSize: "20px", color: "var(--cream)", lineHeight: 1.85, marginBottom: "48px", opacity: 0.9 }}
          >
            Tell the story of someone you love.<br />
            Choose a classic book. Answer the interview in their voice.<br />
            We craft it into a beautifully bound literary memoir — theirs forever.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }}
            style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link href="/begin" style={{
              fontFamily: "var(--font-inter)", fontSize: "13px", fontWeight: 600, letterSpacing: "0.08em",
              color: "var(--ink)", backgroundColor: "var(--gold-light)", padding: "18px 44px",
              textDecoration: "none", textTransform: "uppercase", display: "inline-block",
              boxShadow: "0 4px 14px rgba(191,160,90,0.25)",
            }}>
              Give This Gift — $14.99
            </Link>
            <Link href="#how-gifting-works" style={{
              fontFamily: "var(--font-inter)", fontSize: "13px", fontWeight: 600, letterSpacing: "0.08em",
              color: "var(--gold)", border: "1px solid rgba(191,160,90,0.45)", padding: "18px 44px",
              textDecoration: "none", textTransform: "uppercase", display: "inline-block",
            }}>
              How It Works
            </Link>
          </motion.div>
        </div>
      </section>

      {/* OCCASIONS STRIP */}
      <div style={{
        borderTop: "1px solid rgba(191,160,90,0.12)",
        borderBottom: "1px solid rgba(191,160,90,0.12)",
        backgroundColor: "rgba(191,160,90,0.03)",
        padding: "20px 40px",
        overflow: "hidden",
      }}>
        <div style={{ display: "flex", gap: "40px", justifyContent: "center", flexWrap: "wrap" }}>
          {occasions.map((o) => (
            <span key={o.label} style={{
              fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 600,
              letterSpacing: "0.1em", color: "var(--gold)", textTransform: "uppercase",
              display: "flex", alignItems: "center", gap: "8px", opacity: 0.75,
            }}>
              <span style={{ color: "var(--gold-light)", fontSize: "8px" }}>✦</span>
              {o.label}
            </span>
          ))}
        </div>
      </div>

      {/* HOW GIFTING WORKS */}
      <section id="how-gifting-works" style={{ maxWidth: "860px", margin: "0 auto", padding: "100px 40px" }}>
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", color: "var(--gold)", textTransform: "uppercase", textAlign: "center", marginBottom: "56px" }}
        >
          How Gifting Works
        </motion.p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "40px 32px" }}>
          {[
            {
              step: "01",
              title: "Choose Their Book",
              desc: "Pick the classic that best matches their life story — the adventurer, the romantic, the one who overcame everything.",
            },
            {
              step: "02",
              title: "Tell Their Story",
              desc: "Our interviewer asks questions. You answer on their behalf — sharing the moments, people, and turning points that shaped them.",
            },
            {
              step: "03",
              title: "A Chronicle Is Written",
              desc: "Their answers become a beautifully written 100–150 page literary memoir, styled in the voice of the classic you chose.",
            },
            {
              step: "04",
              title: "Deliver the Gift",
              desc: "The beautifully designed PDF arrives in your inbox instantly. Print it, frame it, share it — or hand it to them on the day.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: "40px", height: "40px", border: "1px solid rgba(191,160,90,0.4)", marginBottom: "16px",
              }}>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "12px", fontWeight: 600, color: "var(--gold-light)" }}>{item.step}</span>
              </div>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", color: "var(--cream)", marginBottom: "10px", textTransform: "uppercase" }}>
                {item.title}
              </p>
              <p style={{ fontFamily: "var(--font-garamond)", fontSize: "16px", color: "var(--parchment)", lineHeight: 1.75 }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PULL QUOTE */}
      <div style={{ textAlign: "center", color: "var(--gold)", fontSize: "16px", letterSpacing: "10px", opacity: 0.5, marginBottom: "60px" }}>
        ✦ &nbsp; ✦ &nbsp; ✦
      </div>

      {/* CHOOSE THEIR BOOK */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 40px 100px" }}>
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", color: "var(--gold)", textTransform: "uppercase", textAlign: "center", marginBottom: "12px" }}
        >
          Choose Their Story
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "18px", color: "var(--parchment)", textAlign: "center", marginBottom: "52px", opacity: 0.75 }}
        >
          Pick the classic that sounds most like them.
        </motion.p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {books.map((book, i) => (
            <motion.div
              key={book.slug}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <Link href={`/begin?book=${book.slug}`} style={{ textDecoration: "none", display: "block" }}>
                <div style={{
                  backgroundColor: "var(--ink-card)",
                  border: "1px solid rgba(191,160,90,0.15)",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "var(--gold-light)";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(191,160,90,0.15)";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  }}
                >
                  <div style={{ position: "relative", height: "160px", overflow: "hidden" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={book.image} alt={book.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <div style={{ position: "absolute", inset: 0, backgroundColor: book.color, opacity: 0.55 }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(13,17,23,0.1) 0%, rgba(13,17,23,0.7) 100%)" }} />
                    <span style={{
                      fontFamily: "var(--font-cinzel-deco)", fontSize: "60px", color: "var(--gold-light)",
                      opacity: 0.07, position: "absolute", bottom: "-6px", right: "12px", lineHeight: 1, userSelect: "none",
                    }}>{book.roman}</span>
                    <p style={{
                      fontFamily: "var(--font-inter)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.08em",
                      color: "rgba(255,255,255,0.8)", textTransform: "uppercase",
                      position: "absolute", top: "14px", left: "16px",
                    }}>{book.theme}</p>
                    <h3 style={{
                      fontFamily: "var(--font-cinzel-deco)", fontSize: "18px", color: "#fff", fontWeight: 400,
                      position: "absolute", bottom: "14px", left: "16px", right: "48px",
                      textShadow: "0 2px 8px rgba(0,0,0,0.8)", lineHeight: 1.2,
                    }}>{book.title}</h3>
                  </div>
                  <div style={{ padding: "16px 20px" }}>
                    <p style={{
                      fontFamily: "var(--font-inter)", fontSize: "10px", fontWeight: 600,
                      letterSpacing: "0.06em", color: "var(--gold)", textTransform: "uppercase", margin: 0,
                    }}>
                      Gift This Story →
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* QUOTE STRIP */}
      <section style={{
        borderTop: "1px solid rgba(191,160,90,0.15)",
        borderBottom: "1px solid rgba(191,160,90,0.15)",
        padding: "80px 40px",
        textAlign: "center",
        background: "rgba(191,160,90,0.02)",
      }}>
        <p style={{
          fontFamily: "var(--font-garamond)", fontStyle: "italic",
          fontSize: "clamp(20px, 2.8vw, 28px)", color: "var(--cream)",
          lineHeight: 1.85, maxWidth: "620px", margin: "0 auto 24px",
        }}>
          "Every life is a great story.<br />
          Most of them just never get written."
        </p>
        <div style={{ height: "1px", background: "linear-gradient(to right, transparent, var(--gold), transparent)", maxWidth: "120px", margin: "0 auto 20px" }} />
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", color: "var(--gold)", textTransform: "uppercase" }}>
          — Chronicled
        </p>
      </section>

      {/* PRICING CTA */}
      <section style={{ padding: "100px 40px", textAlign: "center", maxWidth: "560px", margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", color: "var(--gold)", textTransform: "uppercase", marginBottom: "20px" }}>
          The Gift
        </p>
        <div style={{
          border: "1px solid var(--gold-light)",
          padding: "56px 44px",
          backgroundColor: "rgba(191,160,90,0.04)",
          marginBottom: "32px",
        }}>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", color: "var(--gold-light)", textTransform: "uppercase", marginBottom: "8px" }}>
            Digital Chronicle
          </p>
          <p style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "52px", color: "var(--cream)", marginBottom: "8px", lineHeight: 1 }}>
            $14.99
          </p>
          <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "15px", color: "var(--parchment)", opacity: 0.7, marginBottom: "32px" }}>
            Founding member rate — price rises soon
          </p>
          <div style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(191,160,90,0.3), transparent)", marginBottom: "28px" }} />
          <ul style={{ listStyle: "none", padding: 0, marginBottom: "36px", textAlign: "left" }}>
            {["100–150 page literary memoir", "Styled in a classic book archetype", "Beautifully designed PDF", "Delivered to your inbox instantly", "Theirs to keep forever"].map((item) => (
              <li key={item} style={{ fontFamily: "var(--font-garamond)", fontSize: "16px", color: "var(--parchment)", marginBottom: "12px" }}>
                <span style={{ color: "var(--gold-light)" }}>✦</span> &nbsp;{item}
              </li>
            ))}
          </ul>
          <Link href="/begin" style={{
            fontFamily: "var(--font-inter)", fontSize: "13px", fontWeight: 600, letterSpacing: "0.08em",
            color: "var(--ink)", backgroundColor: "var(--gold-light)", padding: "18px 40px",
            textDecoration: "none", textTransform: "uppercase", display: "block",
          }}>
            Give This Gift
          </Link>
        </div>
        <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "14px", color: "var(--parchment)", opacity: 0.5 }}>
          Questions? <Link href="/#contact" style={{ color: "var(--gold)", textDecoration: "none" }}>Contact us</Link> — we reply within 24 hours.
        </p>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(191,160,90,0.15)", padding: "48px 40px", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "18px", color: "var(--gold-light)", marginBottom: "8px" }}>Chronicled</p>
        <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "14px", color: "var(--gold)", opacity: 0.7, marginBottom: "24px" }}>
          Your life. A legendary narrative.
        </p>
        <div style={{ display: "flex", gap: "32px", justifyContent: "center", marginBottom: "24px" }}>
          <Link href="/" style={{ fontFamily: "var(--font-inter)", fontSize: "11px", color: "var(--gold)", opacity: 0.5, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.06em" }}>Home</Link>
          <Link href="/begin" style={{ fontFamily: "var(--font-inter)", fontSize: "11px", color: "var(--gold)", opacity: 0.5, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.06em" }}>Begin</Link>
          <Link href="/#contact" style={{ fontFamily: "var(--font-inter)", fontSize: "11px", color: "var(--gold)", opacity: 0.5, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.06em" }}>Contact</Link>
        </div>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", color: "var(--gold)", opacity: 0.35, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          © 2026 Chronicled · getchronicled.art
        </p>
      </footer>

    </main>
  );
}
