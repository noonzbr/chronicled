"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { getBook } from "@/lib/books";

type BookData = {
  title: string;
  chapter_1_title: string; chapter_1_body: string;
  chapter_2_title: string; chapter_2_body: string;
  epilogue_title: string;  epilogue_body: string;
  word_count: number;
};

const DEMO_BOOK: BookData = {
  title: "The Chronicle of Natasha",
  chapter_1_title: "The Girl From Charleston",
  chapter_1_body: `In my experience, ambition and charm rarely occupy the same body. They compete for space, one forever elbowing the other aside. But Natasha was the rare exception — a woman in whom desire and elegance had long since made peace, settled into adjacent rooms, and learned to share the same wardrobe.

Charleston suited her. It always does, for women of her particular constitution — those who understand that beauty is infrastructure, that grace is strategy, and that the city's famous iron gates exist not to keep the world out, but to make it pause before entering. She moved through its moss-draped streets the way water moves through old stone: inevitably, and leaving a mark.

She wanted two things. She wanted Marcus. And she wanted success — not the polite, apologetic kind that women are sometimes permitted, but the uncompromising, architectural kind. The kind built at all costs.

The city, to its credit, did not flinch.`,
  chapter_2_title: "The Green Light",
  chapter_2_body: `Every great story has its green light — that small, impossible glow on the far shore that the dreamer reaches toward in the dark. For Jay Gatsby it blinked at the end of a dock across Long Island Sound. For Natasha, it appeared on a screen.

She found him on a dating site. The digital equivalent of a grand party, where everyone arrives in their finest version of themselves and the music never quite stops. His name was Marcus. He was in Portugal.

Portugal. Not the next town. Not the neighboring state. Not even the same continent. An entire ocean, an entire timezone, an entire life — separated from Natasha by nothing but water and wireless signal and whatever it is that makes two people recognize each other through a photograph.

They began to talk. And what they built out of words alone was solid — it had weight, it bore examination, it did not collapse when pressed.`,
  epilogue_title: "What Remains",
  epilogue_body: `They are happy. Natasha and Marcus, in Charleston, South Carolina, where the Spanish moss moves in the evening air and the light comes in old and golden and knowing.

She got what she wanted. Both things. The love and the ambition, the man who crossed an ocean and the life she refused to apologize for building.

This is the part they don't tell you about the Gatsby story — the part where the light is real and the person swimming reaches it. It is possible. It requires hope. Not the fragile, cautious kind. The architectural kind. The kind built at all costs.

The kind that looks like ambition from the outside, and feels like love from within.`,
  word_count: 12847,
};

function PreviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookSlug = searchParams.get("book") || "the-great-gatsby";
  const sessionId = searchParams.get("session") || "demo";
  const book = getBook(bookSlug);

  const [bookData, setBookData] = useState<BookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeChapter, setActiveChapter] = useState<"I" | "II" | "epilogue">("I");

  useEffect(() => {
    loadBook();
  }, []);

  async function loadBook() {
    try {
      const res = await fetch(`/api/preview?session=${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setBookData(data.book || DEMO_BOOK);
      } else {
        setBookData(DEMO_BOOK);
      }
    } catch {
      setBookData(DEMO_BOOK);
    } finally {
      setLoading(false);
    }
  }

  const bookColor = book?.color || "#9A7B2F";

  if (loading) {
    return (
      <main style={{ backgroundColor: "var(--ink)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "5px", color: "var(--gold)", textTransform: "uppercase" }}
        >
          Loading your chronicle...
        </motion.p>
      </main>
    );
  }

  const data = bookData!;

  const previewChapters = [
    { key: "I" as const,         label: "Chapter I",  title: data.chapter_1_title, body: data.chapter_1_body },
    { key: "II" as const,        label: "Chapter II", title: data.chapter_2_title, body: data.chapter_2_body },
    { key: "epilogue" as const,  label: "Epilogue",   title: data.epilogue_title,  body: data.epilogue_body },
  ];

  const active = previewChapters.find((c) => c.key === activeChapter)!;

  return (
    <main style={{ backgroundColor: "var(--ink)", minHeight: "100vh" }}>
      {/* Top bar */}
      <div style={{ borderBottom: "1px solid rgba(191,160,90,0.2)", padding: "18px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "17px", color: "var(--gold-light)" }}>Chronicled</span>
        <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "4px", color: "var(--gold)", textTransform: "uppercase" }}>
          Your Chronicle Preview
        </p>
        <button
          onClick={() => router.push(`/checkout?book=${bookSlug}&session=${sessionId}`)}
          style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "3px", color: "var(--ink)", backgroundColor: "var(--gold-light)", border: "none", padding: "10px 22px", cursor: "pointer", textTransform: "uppercase" }}
        >
          Get This Book →
        </button>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "60px 40px", display: "grid", gridTemplateColumns: "260px 1fr", gap: "60px" }}>

        {/* Sidebar */}
        <div>
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            {/* Book stats */}
            <div style={{ marginBottom: "40px" }}>
              <p style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "16px", color: "var(--cream)", marginBottom: "6px", lineHeight: 1.3 }}>
                {data.title}
              </p>
              {book && (
                <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "13px", color: "var(--gold)", marginBottom: "20px" }}>
                  A {book.title} Chronicle
                </p>
              )}
              <div style={{ height: "1px", background: "linear-gradient(to right, var(--gold), transparent)", marginBottom: "20px" }} />
              <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "2px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "4px" }}>
                Word Count
              </p>
              <p style={{ fontFamily: "var(--font-garamond)", fontSize: "22px", color: "var(--cream)" }}>
                {data.word_count?.toLocaleString() || "12,847"}
              </p>
              <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "12px", color: "var(--gold)", opacity: 0.6, marginTop: "2px" }}>
                approx. {Math.round((data.word_count || 12847) / 250)} pages
              </p>
            </div>

            {/* Chapter nav */}
            <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "8px", letterSpacing: "4px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "16px", opacity: 0.6 }}>
              Preview Chapters
            </p>
            {previewChapters.map((ch) => (
              <button
                key={ch.key}
                onClick={() => setActiveChapter(ch.key)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  borderLeft: activeChapter === ch.key ? `2px solid ${bookColor}` : "2px solid transparent",
                  padding: "10px 16px",
                  cursor: "pointer",
                  marginBottom: "4px",
                  transition: "all 0.2s",
                }}
              >
                <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "8px", letterSpacing: "3px", color: activeChapter === ch.key ? "var(--gold-light)" : "var(--gold)", textTransform: "uppercase", marginBottom: "3px", opacity: activeChapter === ch.key ? 1 : 0.6 }}>
                  {ch.label}
                </p>
                <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "13px", color: activeChapter === ch.key ? "var(--cream)" : "var(--parchment)", opacity: activeChapter === ch.key ? 1 : 0.55, lineHeight: 1.3 }}>
                  {ch.title}
                </p>
              </button>
            ))}

            {/* Lock notice */}
            <div style={{ marginTop: "24px", padding: "16px", border: "1px solid rgba(191,160,90,0.2)", backgroundColor: "rgba(191,160,90,0.05)" }}>
              <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "8px", letterSpacing: "2px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "6px", opacity: 0.7 }}>
                Full Book Includes
              </p>
              {["6 Full Chapters", "Epilogue", "Dedication Page", "Royal Portrait*", "Vintage Design"].map((item) => (
                <p key={item} style={{ fontFamily: "var(--font-garamond)", fontSize: "13px", color: "var(--parchment)", opacity: 0.65, marginBottom: "4px" }}>
                  ✦ &nbsp;{item}
                </p>
              ))}
              <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "11px", color: "var(--gold)", opacity: 0.45, marginTop: "8px" }}>
                *Hardcover edition only
              </p>
            </div>
          </motion.div>
        </div>

        {/* Book page */}
        <motion.div
          key={activeChapter}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundColor: "var(--cream)",
            padding: "72px 80px",
            position: "relative",
            boxShadow: "0 8px 48px rgba(0,0,0,0.5)",
          }}
        >
          {/* Page texture */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 15% 15%, rgba(212,185,130,0.08) 0%, transparent 55%)", pointerEvents: "none" }} />

          {/* Left rule */}
          <div style={{ position: "absolute", top: "48px", bottom: "48px", left: "44px", width: "1px", background: "linear-gradient(to bottom, transparent, var(--gold-faint) 20%, var(--gold-faint) 80%, transparent)" }} />

          {/* Running header */}
          <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "8px", letterSpacing: "4px", color: "var(--gold)", textAlign: "center", textTransform: "uppercase", marginBottom: "40px", opacity: 0.7 }}>
            {data.title} &nbsp;·&nbsp; {book?.title} Chronicle
          </p>

          {/* Chapter header */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "6px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "12px" }}>
              {active.label}
            </p>
            <h2 style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "26px", color: "var(--dark-brown)", fontWeight: 400, marginBottom: "20px", lineHeight: 1.25 }}>
              {active.title}
            </h2>
            <div style={{ width: "80px", height: "1px", background: "linear-gradient(to right, transparent, var(--gold), transparent)", margin: "0 auto" }} />
          </div>

          {/* Body text */}
          <div>
            {active.body.split("\n\n").map((para, i) => (
              <p
                key={i}
                style={{
                  fontFamily: "var(--font-garamond)",
                  fontSize: "16px",
                  lineHeight: 2,
                  color: "var(--dark-brown)",
                  textAlign: "justify",
                  textIndent: i === 0 ? "0" : "2em",
                  marginBottom: "0",
                  hyphens: "auto",
                }}
              >
                {i === 0 && (
                  <span style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "3.6em", float: "left", lineHeight: 0.72, marginRight: "6px", marginTop: "8px", color: "var(--gold)" }}>
                    {para[0]}
                  </span>
                )}
                {i === 0 ? para.slice(1) : para}
              </p>
            ))}
          </div>

          {/* Fade out at bottom — teaser effect */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "180px", background: "linear-gradient(to bottom, transparent, var(--cream))", pointerEvents: "none" }} />
        </motion.div>
      </div>

      {/* Purchase CTA */}
      <div style={{ borderTop: "1px solid rgba(191,160,90,0.15)", backgroundColor: "rgba(191,160,90,0.04)", padding: "60px 40px", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "6px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "16px" }}>
          Your Chronicle Is Ready
        </p>
        <p style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "clamp(24px, 4vw, 36px)", color: "var(--cream)", marginBottom: "12px", fontWeight: 400 }}>
          {data.title}
        </p>
        <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "17px", color: "var(--parchment)", opacity: 0.7, marginBottom: "48px" }}>
          {(data.word_count || 12847).toLocaleString()} words · {Math.round((data.word_count || 12847) / 250)} pages · Vintage design
        </p>

        <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { tier: "digital",    label: "Digital PDF",  price: "$19", desc: "Instant download",        highlight: false },
            { tier: "softcover",  label: "Softcover",    price: "$39", desc: "Printed & shipped",       highlight: false },
            { tier: "hardcover",  label: "Hardcover",    price: "$59", desc: "Royal Portrait included", highlight: true  },
          ].map((t) => (
            <Link
              key={t.tier}
              href={`/checkout?book=${bookSlug}&session=${sessionId}&tier=${t.tier}`}
              style={{
                display: "block",
                border: t.highlight ? "1px solid var(--gold-light)" : "1px solid rgba(191,160,90,0.3)",
                padding: "28px 36px",
                textDecoration: "none",
                backgroundColor: t.highlight ? "rgba(191,160,90,0.12)" : "transparent",
                minWidth: "200px",
                transition: "all 0.2s",
              }}
            >
              <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "3px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "8px" }}>
                {t.label}
              </p>
              <p style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "32px", color: "var(--cream)", marginBottom: "6px" }}>
                {t.price}
              </p>
              <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "13px", color: "var(--parchment)", opacity: 0.65 }}>
                {t.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function PreviewPage() {
  return <Suspense><PreviewContent /></Suspense>;
}
