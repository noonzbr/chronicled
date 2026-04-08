"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getBook } from "@/lib/books";

const WRITING_STAGES = [
  "Reviewing your interview...",
  "Composing Chapter I...",
  "Composing Chapter II...",
  "Composing Chapter III...",
  "Composing Chapter IV...",
  "Composing Chapter V...",
  "Writing the Epilogue...",
  "Refining the narrative...",
  "Setting the typography...",
  "Preparing your chronicle...",
];

function GeneratePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookSlug = searchParams.get("book") || "the-great-gatsby";
  const sessionId = searchParams.get("session") || "demo";
  const book = getBook(bookSlug);

  const [stage, setStage] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Cycle through writing stages every 3.5 seconds
    const interval = setInterval(() => {
      setStage((s) => {
        if (s < WRITING_STAGES.length - 1) return s + 1;
        return s;
      });
    }, 3500);

    // Start generation
    generateBook();

    return () => clearInterval(interval);
  }, []);

  async function generateBook() {
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookSlug, sessionId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Generation failed.");
        return;
      }

      setDone(true);
      setTimeout(() => {
        router.push(`/preview?book=${bookSlug}&session=${sessionId}`);
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  }

  const bookColor = book?.color || "#9A7B2F";
  const progress = Math.min(((stage + 1) / WRITING_STAGES.length) * 100, 100);

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
        textAlign: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ maxWidth: "520px", width: "100%" }}
      >
        {/* Logo */}
        <p
          style={{
            fontFamily: "var(--font-cinzel-deco)",
            fontSize: "22px",
            color: "var(--gold-light)",
            marginBottom: "56px",
          }}
        >
          Chronicled
        </p>

        {/* Animated quill */}
        <motion.div
          animate={done ? { scale: 1.2, opacity: 1 } : { opacity: [0.4, 1, 0.4] }}
          transition={done ? { duration: 0.4 } : { duration: 2, repeat: Infinity }}
          style={{
            fontSize: "48px",
            marginBottom: "36px",
          }}
        >
          {done ? "✦" : "✒"}
        </motion.div>

        <p
          style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "10px",
            letterSpacing: "5px",
            color: "var(--gold)",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}
        >
          {done ? "Your Chronicle Is Complete" : "Writing Your Chronicle"}
        </p>

        {book && (
          <p
            style={{
              fontFamily: "var(--font-garamond)",
              fontStyle: "italic",
              fontSize: "17px",
              color: "var(--cream)",
              marginBottom: "48px",
              opacity: 0.8,
            }}
          >
            {done
              ? `Your ${book.title} chronicle is ready.`
              : `In the tradition of ${book.title}...`}
          </p>
        )}

        {/* Progress bar */}
        {!done && !error && (
          <>
            <div
              style={{
                width: "100%",
                height: "2px",
                backgroundColor: "rgba(191,160,90,0.2)",
                marginBottom: "20px",
                borderRadius: "1px",
              }}
            >
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{
                  height: "100%",
                  backgroundColor: bookColor,
                  borderRadius: "1px",
                }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={stage}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4 }}
                style={{
                  fontFamily: "var(--font-garamond)",
                  fontStyle: "italic",
                  fontSize: "15px",
                  color: "var(--parchment)",
                  opacity: 0.65,
                }}
              >
                {WRITING_STAGES[stage]}
              </motion.p>
            </AnimatePresence>
          </>
        )}

        {/* Done state */}
        {done && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div
              style={{
                height: "1px",
                background: "linear-gradient(to right, transparent, var(--gold), transparent)",
                marginBottom: "24px",
              }}
            />
            <p
              style={{
                fontFamily: "var(--font-garamond)",
                fontStyle: "italic",
                fontSize: "15px",
                color: "var(--parchment)",
                opacity: 0.65,
              }}
            >
              Taking you to your preview...
            </p>
          </motion.div>
        )}

        {/* Error state */}
        {error && (
          <div>
            <p
              style={{
                fontFamily: "var(--font-garamond)",
                fontSize: "15px",
                color: "#c97b7b",
                fontStyle: "italic",
                marginBottom: "20px",
              }}
            >
              {error}
            </p>
            <button
              onClick={() => { setError(""); setStage(0); generateBook(); }}
              style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "9px",
                letterSpacing: "3px",
                color: "var(--ink)",
                backgroundColor: "var(--gold-light)",
                border: "none",
                padding: "12px 24px",
                cursor: "pointer",
                textTransform: "uppercase",
              }}
            >
              Try Again
            </button>
          </div>
        )}
      </motion.div>
    </main>
  );
}

export default function GeneratePageWrapper() {
  return (
    <Suspense>
      <GeneratePage />
    </Suspense>
  );
}
