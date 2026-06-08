"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";

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
  return (
    <main style={{ backgroundColor: "var(--ink)", minHeight: "100vh" }}>

      {/* ── NAV ── */}
      <nav
        style={{
          borderBottom: "1px solid rgba(191,160,90,0.2)",
          padding: "20px 40px",
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
            fontSize: "20px",
            color: "var(--gold-light)",
            letterSpacing: "1px",
          }}
        >
          Chronicled
        </span>
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          <Link
            href="/how-it-works"
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "10px",
              letterSpacing: "3px",
              color: "var(--gold)",
              textDecoration: "none",
              textTransform: "uppercase",
            }}
          >
            How It Works
          </Link>
          <Link
            href="/auth/login"
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "10px",
              letterSpacing: "3px",
              color: "var(--gold)",
              textDecoration: "none",
              textTransform: "uppercase",
            }}
          >
            Sign In
          </Link>
          <Link
            href="/begin"
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "10px",
              letterSpacing: "3px",
              color: "var(--ink)",
              backgroundColor: "var(--gold)",
              padding: "10px 22px",
              textDecoration: "none",
              textTransform: "uppercase",
            }}
          >
            Begin Your Story
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        style={{
          position: "relative",
          textAlign: "center",
          padding: "110px 40px 90px",
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
        <div style={{ position: "relative", zIndex: 2, maxWidth: "720px", margin: "0 auto" }}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "10px",
              letterSpacing: "6px",
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
              margin: "0 auto 32px",
              maxWidth: "240px",
            }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              fontFamily: "var(--font-garamond)",
              fontStyle: "italic",
              fontSize: "20px",
              color: "var(--parchment)",
              lineHeight: 1.8,
              marginBottom: "48px",
              opacity: 0.85,
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
            style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link
              href="/begin"
              style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "11px",
                letterSpacing: "3px",
                color: "var(--ink)",
                backgroundColor: "var(--gold-light)",
                padding: "16px 36px",
                textDecoration: "none",
                textTransform: "uppercase",
                display: "inline-block",
              }}
            >
              Begin Your Story
            </Link>
            <Link
              href="#how-it-works"
              style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "11px",
                letterSpacing: "3px",
                color: "var(--gold)",
                border: "1px solid rgba(191,160,90,0.4)",
                padding: "16px 36px",
                textDecoration: "none",
                textTransform: "uppercase",
                display: "inline-block",
              }}
            >
              How It Works
            </Link>
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
            fontFamily: "var(--font-cinzel)",
            fontSize: "10px",
            letterSpacing: "6px",
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
                    border: "1px solid rgba(191,160,90,0.2)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(191,160,90,0.55)";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 40px rgba(0,0,0,0.5)`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(191,160,90,0.2)";
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
                        opacity: 0.62,
                      }}
                    />
                    {/* Dark gradient at bottom to blend into card */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to bottom, rgba(13,17,23,0.1) 0%, rgba(13,17,23,0.7) 100%)",
                      }}
                    />
                    {/* Roman numeral watermark */}
                    <span
                      style={{
                        fontFamily: "var(--font-cinzel-deco)",
                        fontSize: "72px",
                        color: "rgba(255,255,255,0.12)",
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
                        fontFamily: "var(--font-cinzel)",
                        fontSize: "8px",
                        letterSpacing: "4px",
                        color: "rgba(255,255,255,0.75)",
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
                        fontSize: "17px",
                        color: "#ffffff",
                        fontWeight: 400,
                        lineHeight: 1.25,
                        position: "absolute",
                        bottom: "18px",
                        left: "20px",
                        right: "60px",
                        textShadow: "0 1px 8px rgba(0,0,0,0.6)",
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
                        fontSize: "13px",
                        color: "var(--gold)",
                        marginBottom: "14px",
                      }}
                    >
                      {book.tone}
                    </p>

                    {/* Rule */}
                    <div
                      style={{
                        height: "1px",
                        background: `linear-gradient(to right, ${book.color}88, transparent)`,
                        marginBottom: "14px",
                      }}
                    />

                    {/* Description */}
                    <p
                      style={{
                        fontFamily: "var(--font-garamond)",
                        fontSize: "14.5px",
                        color: "var(--parchment)",
                        lineHeight: 1.7,
                        opacity: 0.8,
                        marginBottom: "20px",
                      }}
                    >
                      {book.description}
                    </p>

                    {/* CTA */}
                    <p
                      style={{
                        fontFamily: "var(--font-cinzel)",
                        fontSize: "9px",
                        letterSpacing: "3px",
                        color: "var(--gold)",
                        textTransform: "uppercase",
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
                fontSize: "18px",
                color: "var(--cream)",
                lineHeight: 1.75,
                marginBottom: "12px",
              }}
            >
              "The interview takes about 20 minutes.<br />
              The book lasts a lifetime."
            </p>
            <p
              style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "8px",
                letterSpacing: "3px",
                color: "var(--gold)",
                textTransform: "uppercase",
                opacity: 0.7,
              }}
            >
              — Chronicled
            </p>
          </div>
        </div>

        {/* RIGHT — Steps */}
        <div
          style={{
            backgroundColor: "rgba(20,27,36,0.95)",
            padding: "60px 52px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "10px",
              letterSpacing: "6px",
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
              { step: "02", title: "The Interview", desc: "Our AI biographer asks questions. You answer freely — no forms, no limits." },
              { step: "03", title: "Your Book Is Written", desc: "Claude crafts your answers into a 100–150 page literary chronicle." },
              { step: "04", title: "Choose Your Edition", desc: "Digital PDF, softcover, or hardcover with your Royal Portrait inside." },
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
                      fontFamily: "var(--font-cinzel)",
                      fontSize: "11px",
                      letterSpacing: "1px",
                      color: "var(--gold)",
                    }}
                  >
                    {item.step}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-cinzel)",
                    fontSize: "10px",
                    letterSpacing: "2px",
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
                    fontStyle: "italic",
                    fontSize: "14.5px",
                    color: "var(--parchment)",
                    lineHeight: 1.75,
                    opacity: 0.75,
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
                fontFamily: "var(--font-cinzel)",
                fontSize: "10px",
                letterSpacing: "3px",
                color: "var(--ink)",
                backgroundColor: "var(--gold-light)",
                padding: "14px 32px",
                textDecoration: "none",
                textTransform: "uppercase",
                display: "inline-block",
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
              fontFamily: "var(--font-cinzel)",
              fontSize: "10px",
              letterSpacing: "6px",
              color: "var(--gold)",
              textTransform: "uppercase",
              marginBottom: "32px",
              opacity: 0.7,
            }}
          >
            ✦ &nbsp; A Chronicle &nbsp; ✦
          </p>
          <p
            style={{
              fontFamily: "var(--font-garamond)",
              fontStyle: "italic",
              fontSize: "clamp(20px, 3vw, 26px)",
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
              fontFamily: "var(--font-cinzel)",
              fontSize: "9px",
              letterSpacing: "3px",
              color: "var(--gold)",
              opacity: 0.6,
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
            fontFamily: "var(--font-cinzel)",
            fontSize: "10px",
            letterSpacing: "6px",
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
              name: "Digital",
              price: "$19",
              desc: "Your complete chronicle as a beautifully styled PDF, delivered to your inbox.",
              includes: ["100–150 page PDF", "Vintage book design", "Instant delivery"],
              highlight: false,
            },
            {
              name: "Softcover",
              price: "$39",
              desc: "Your chronicle printed and bound, shipped to your door.",
              includes: ["Everything in Digital", "Printed softcover book", "Worldwide shipping"],
              highlight: false,
            },
            {
              name: "Hardcover",
              price: "$59",
              desc: "The definitive edition. Includes your AI-generated Royal Portrait.",
              includes: ["Everything in Softcover", "Hardcover binding", "Royal Portrait inside"],
              highlight: true,
            },
          ].map((tier) => (
            <div
              key={tier.name}
              style={{
                border: tier.highlight ? "1px solid var(--gold)" : "1px solid rgba(191,160,90,0.25)",
                padding: "40px 28px",
                backgroundColor: tier.highlight ? "rgba(191,160,90,0.08)" : "rgba(20,27,36,0.8)",
                position: "relative",
              }}
            >
              {tier.highlight && (
                <p
                  style={{
                    fontFamily: "var(--font-cinzel)",
                    fontSize: "8px",
                    letterSpacing: "3px",
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
                  Most Popular
                </p>
              )}
              <p
                style={{
                  fontFamily: "var(--font-cinzel)",
                  fontSize: "10px",
                  letterSpacing: "4px",
                  color: "var(--gold)",
                  textTransform: "uppercase",
                  marginBottom: "12px",
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
                  fontStyle: "italic",
                  fontSize: "14px",
                  color: "var(--parchment)",
                  lineHeight: 1.7,
                  marginBottom: "24px",
                  opacity: 0.8,
                }}
              >
                {tier.desc}
              </p>
              <div
                style={{
                  height: "1px",
                  background: "linear-gradient(to right, transparent, rgba(191,160,90,0.4), transparent)",
                  marginBottom: "20px",
                }}
              />
              <ul style={{ listStyle: "none", padding: 0, marginBottom: "28px" }}>
                {tier.includes.map((item) => (
                  <li
                    key={item}
                    style={{
                      fontFamily: "var(--font-garamond)",
                      fontSize: "14px",
                      color: "var(--parchment)",
                      marginBottom: "8px",
                      opacity: 0.75,
                    }}
                  >
                    ✦ &nbsp;{item}
                  </li>
                ))}
              </ul>
              <Link
                href="/begin"
                style={{
                  fontFamily: "var(--font-cinzel)",
                  fontSize: "9px",
                  letterSpacing: "3px",
                  color: tier.highlight ? "var(--ink)" : "var(--gold)",
                  backgroundColor: tier.highlight ? "var(--gold-light)" : "transparent",
                  border: tier.highlight ? "none" : "1px solid rgba(191,160,90,0.4)",
                  padding: "12px 24px",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  display: "inline-block",
                }}
              >
                Begin Your Story
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          borderTop: "1px solid rgba(191,160,90,0.15)",
          padding: "40px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-cinzel-deco)",
            fontSize: "16px",
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
            fontSize: "13px",
            color: "var(--gold)",
            opacity: 0.6,
            marginBottom: "20px",
          }}
        >
          Your life. A legendary narrative.
        </p>
        <p
          style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "9px",
            letterSpacing: "3px",
            color: "var(--gold)",
            opacity: 0.4,
            textTransform: "uppercase",
          }}
        >
          © 2026 Chronicled · getchronicled.art
        </p>
      </footer>
    </main>
  );
}
