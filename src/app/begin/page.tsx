"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BOOKS } from "@/lib/books";

export default function BeginPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [hovering, setHovering] = useState<string | null>(null);

  function handleSelect(slug: string) {
    setSelected(slug);
    setTimeout(() => {
      router.push(`/auth/signup?book=${slug}`);
    }, 600);
  }

  return (
    <main style={{ backgroundColor: "var(--ink)", minHeight: "100vh", padding: "0 0 80px" }}>
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid rgba(191,160,90,0.2)",
          padding: "24px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <a
          href="/"
          style={{
            fontFamily: "var(--font-cinzel-deco)",
            fontSize: "18px",
            color: "var(--gold-light)",
            textDecoration: "none",
          }}
        >
          Chronicled
        </a>
        <p
          style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "9px",
            letterSpacing: "4px",
            color: "var(--gold)",
            textTransform: "uppercase",
            opacity: 0.6,
          }}
        >
          Step 1 of 3 &nbsp;·&nbsp; Choose Your Story
        </p>
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{ textAlign: "center", padding: "64px 40px 48px" }}
      >
        <p
          style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "10px",
            letterSpacing: "6px",
            color: "var(--gold)",
            textTransform: "uppercase",
            marginBottom: "20px",
          }}
        >
          The Chronicle Begins
        </p>
        <h1
          style={{
            fontFamily: "var(--font-cinzel-deco)",
            fontSize: "clamp(28px, 4vw, 44px)",
            color: "var(--cream)",
            fontWeight: 400,
            marginBottom: "20px",
            lineHeight: 1.2,
          }}
        >
          Which story is yours?
        </h1>
        <div
          style={{
            height: "1px",
            background: "linear-gradient(to right, transparent, var(--gold), transparent)",
            maxWidth: "200px",
            margin: "0 auto 20px",
          }}
        />
        <p
          style={{
            fontFamily: "var(--font-garamond)",
            fontStyle: "italic",
            fontSize: "17px",
            color: "var(--parchment)",
            opacity: 0.75,
            maxWidth: "480px",
            margin: "0 auto",
            lineHeight: 1.8,
          }}
        >
          Choose the classic that most closely mirrors the arc of your life. Your story will be written through its lens.
        </p>
      </motion.div>

      {/* Book Grid */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 40px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
          gap: "20px",
        }}
      >
        {BOOKS.map((book, i) => {
          const isSelected = selected === book.slug;
          const isHovered = hovering === book.slug;

          return (
            <motion.div
              key={book.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              onClick={() => handleSelect(book.slug)}
              onMouseEnter={() => setHovering(book.slug)}
              onMouseLeave={() => setHovering(null)}
              style={{
                border: isSelected
                  ? `1px solid ${book.color}`
                  : isHovered
                  ? "1px solid rgba(191,160,90,0.5)"
                  : "1px solid rgba(191,160,90,0.2)",
                padding: "36px 30px",
                cursor: "pointer",
                backgroundColor: isSelected
                  ? `${book.color}22`
                  : isHovered
                  ? "var(--ink-card)"
                  : "var(--ink-card)",
                transition: "all 0.25s ease",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Selected checkmark */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      position: "absolute",
                      top: "16px",
                      right: "16px",
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      backgroundColor: book.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "14px",
                    }}
                  >
                    ✓
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Roman numeral bg */}
              <span
                style={{
                  fontFamily: "var(--font-cinzel-deco)",
                  fontSize: "52px",
                  color: book.color,
                  opacity: 0.12,
                  position: "absolute",
                  top: "12px",
                  right: isSelected ? "50px" : "20px",
                  lineHeight: 1,
                  transition: "right 0.3s ease",
                }}
              >
                {book.roman}
              </span>

              <p
                style={{
                  fontFamily: "var(--font-cinzel)",
                  fontSize: "9px",
                  letterSpacing: "4px",
                  color: "var(--gold)",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                {book.theme}
              </p>

              <h3
                style={{
                  fontFamily: "var(--font-cinzel-deco)",
                  fontSize: "19px",
                  color: "var(--cream)",
                  marginBottom: "6px",
                  fontWeight: 400,
                  lineHeight: 1.25,
                }}
              >
                {book.title}
              </h3>

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

              <div
                style={{
                  height: "1px",
                  background: `linear-gradient(to right, ${book.color}88, transparent)`,
                  marginBottom: "14px",
                }}
              />

              <p
                style={{
                  fontFamily: "var(--font-garamond)",
                  fontSize: "14.5px",
                  color: "var(--parchment)",
                  lineHeight: 1.75,
                  opacity: 0.8,
                }}
              >
                {book.description}
              </p>

              <motion.p
                animate={{ opacity: isHovered || isSelected ? 1 : 0.4 }}
                style={{
                  fontFamily: "var(--font-cinzel)",
                  fontSize: "9px",
                  letterSpacing: "3px",
                  color: isSelected ? book.color : "var(--gold)",
                  textTransform: "uppercase",
                  marginTop: "22px",
                  transition: "color 0.2s",
                }}
              >
                {isSelected ? "Selected — continuing..." : "Choose This Story →"}
              </motion.p>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
}
