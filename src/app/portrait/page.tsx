"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getBook } from "@/lib/books";

function PortraitContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const bookSlug     = searchParams.get("book")    || "the-great-gatsby";
  const sessionId    = searchParams.get("session") || "demo";
  const tier         = searchParams.get("tier")    || "hardcover";
  const book         = getBook(bookSlug);

  const [preview,      setPreview]      = useState<string | null>(null);
  const [file,         setFile]         = useState<File | null>(null);
  const [generating,   setGenerating]   = useState(false);
  const [portraitUrl,  setPortraitUrl]  = useState<string | null>(null);
  const [error,        setError]        = useState("");
  const [dragOver,     setDragOver]     = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const bookColor = book?.color || "#9A7B2F";

  function handleFile(f: File) {
    setFile(f);
    setPortraitUrl(null);
    setError("");
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("image/")) handleFile(f);
  }

  async function generatePortrait() {
    if (!file) return;
    setGenerating(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("photo",     file);
      fd.append("sessionId", sessionId);
      fd.append("bookSlug",  bookSlug);

      const res  = await fetch("/api/portrait", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) { setError(data.error || "Generation failed."); return; }
      setPortraitUrl(data.portraitUrl);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  function continueToCheckout() {
    router.push(`/checkout?book=${bookSlug}&session=${sessionId}&tier=${tier}`);
  }

  const STAGES = [
    "Studying your photograph...",
    "Noting the light in your eyes...",
    "Consulting the masters...",
    "Laying in the composition...",
    "Building the palette...",
    "Rendering your portrait...",
    "Adding the final details...",
    "Your Royal Portrait is ready...",
  ];
  const [stageIdx, setStageIdx] = useState(0);

  // Cycle through stages while generating
  useState(() => {
    if (!generating) return;
    const iv = setInterval(() => setStageIdx((s) => (s < STAGES.length - 1 ? s + 1 : s)), 3000);
    return () => clearInterval(iv);
  });

  return (
    <main style={{ backgroundColor: "var(--ink)", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(191,160,90,0.2)", padding: "18px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "18px", color: "var(--gold-light)" }}>Chronicled</span>
        <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "4px", color: "var(--gold)", textTransform: "uppercase", opacity: 0.7 }}>
          Royal Portrait
        </p>
        <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "13px", color: "var(--gold)", opacity: 0.5 }}>
          {book?.title} Chronicle
        </p>
      </div>

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "60px 40px" }}>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "56px" }}
        >
          <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "6px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "16px" }}>
            Your Royal Portrait
          </p>
          <h1 style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "clamp(22px, 4vw, 34px)", color: "var(--cream)", fontWeight: 400, marginBottom: "16px", lineHeight: 1.3 }}>
            Rendered in the tradition of<br/>
            <span style={{ color: bookColor }}>{book?.title}</span>
          </h1>
          <div style={{ height: "1px", background: "linear-gradient(to right, transparent, var(--gold), transparent)", maxWidth: "200px", margin: "0 auto 20px" }} />
          <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "16px", color: "var(--parchment)", opacity: 0.7, lineHeight: 1.8, maxWidth: "520px", margin: "0 auto" }}>
            Upload a clear photo of yourself. You'll be rendered as a character from your chronicle —
            in the exact artistic style of the era.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: portraitUrl ? "1fr 1fr" : "1fr", gap: "40px", alignItems: "start" }}>

          {/* LEFT — Upload + generate */}
          <motion.div layout>

            {/* Upload zone */}
            {!portraitUrl && (
              <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                style={{
                  border: dragOver
                    ? `2px dashed ${bookColor}`
                    : preview
                    ? `1px solid rgba(191,160,90,0.4)`
                    : `2px dashed rgba(191,160,90,0.3)`,
                  backgroundColor: dragOver ? `${bookColor}11` : "var(--ink-card)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  marginBottom: "28px",
                  minHeight: "320px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {preview ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview}
                      alt="Your photo"
                      style={{ width: "100%", height: "320px", objectFit: "cover", display: "block" }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,17,23,0.8) 0%, transparent 50%)" }} />
                    <p style={{ position: "absolute", bottom: "16px", left: 0, right: 0, textAlign: "center", fontFamily: "var(--font-cinzel)", fontSize: "8px", letterSpacing: "3px", color: "var(--gold)", textTransform: "uppercase" }}>
                      Click to change photo
                    </p>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "40px" }}>
                    <div style={{ fontSize: "36px", marginBottom: "20px", opacity: 0.4 }}>✦</div>
                    <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "4px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "12px" }}>
                      Upload Your Photo
                    </p>
                    <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "14px", color: "var(--parchment)", opacity: 0.6, lineHeight: 1.7 }}>
                      Drag & drop or click to browse<br/>
                      JPG, PNG · Best with a clear face photo
                    </p>
                  </div>
                )}
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={onInputChange}
                  style={{ display: "none" }}
                />
              </div>
            )}

            {/* Art style info */}
            <div style={{ border: "1px solid rgba(191,160,90,0.15)", padding: "20px 24px", backgroundColor: "rgba(191,160,90,0.03)", marginBottom: "28px" }}>
              <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "8px", letterSpacing: "3px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "8px", opacity: 0.7 }}>
                Portrait Style
              </p>
              <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "14px", color: "var(--parchment)", lineHeight: 1.7, opacity: 0.7 }}>
                {book?.portraitStyle}
              </p>
            </div>

            {/* Error */}
            {error && (
              <p style={{ fontFamily: "var(--font-garamond)", fontSize: "14px", color: "#c97b7b", fontStyle: "italic", marginBottom: "16px" }}>
                {error}
              </p>
            )}

            {/* Generating state */}
            <AnimatePresence mode="wait">
              {generating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ textAlign: "center", padding: "32px 0" }}
                >
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    style={{ fontSize: "32px", marginBottom: "24px" }}
                  >
                    ✦
                  </motion.div>
                  <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "4px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "10px" }}>
                    Painting Your Portrait
                  </p>
                  <motion.p
                    key={stageIdx}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "15px", color: "var(--parchment)", opacity: 0.65 }}
                  >
                    {STAGES[stageIdx]}
                  </motion.p>
                  <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "12px", color: "var(--gold)", opacity: 0.4, marginTop: "16px" }}>
                    This takes about 30 seconds...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Generate button */}
            {!generating && !portraitUrl && (
              <button
                onClick={generatePortrait}
                disabled={!file}
                style={{
                  width: "100%",
                  fontFamily: "var(--font-cinzel)",
                  fontSize: "10px",
                  letterSpacing: "3px",
                  color: "var(--ink)",
                  backgroundColor: !file ? "rgba(191,160,90,0.3)" : "var(--gold-light)",
                  border: "none",
                  padding: "18px",
                  cursor: !file ? "not-allowed" : "pointer",
                  textTransform: "uppercase",
                  transition: "background-color 0.2s",
                }}
              >
                {file ? "Paint My Royal Portrait →" : "Upload a Photo First"}
              </button>
            )}

            {/* Regenerate */}
            {!generating && portraitUrl && (
              <button
                onClick={() => { setPortraitUrl(null); setPreview(null); setFile(null); }}
                style={{
                  width: "100%",
                  fontFamily: "var(--font-cinzel)",
                  fontSize: "9px",
                  letterSpacing: "3px",
                  color: "var(--gold)",
                  backgroundColor: "transparent",
                  border: "1px solid rgba(191,160,90,0.35)",
                  padding: "14px",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                Try a Different Photo
              </button>
            )}
          </motion.div>

          {/* RIGHT — Generated portrait */}
          <AnimatePresence>
            {portraitUrl && (
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Portrait frame */}
                <div
                  style={{
                    border: `2px solid ${bookColor}`,
                    padding: "12px",
                    backgroundColor: "var(--ink-card)",
                    marginBottom: "24px",
                    position: "relative",
                  }}
                >
                  <div style={{ position: "absolute", inset: "18px", border: `1px solid ${bookColor}44`, pointerEvents: "none", zIndex: 1 }} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={portraitUrl}
                    alt="Your Royal Portrait"
                    style={{ width: "100%", display: "block" }}
                  />
                  {/* Caption */}
                  <div style={{ padding: "16px 12px 8px", textAlign: "center" }}>
                    <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "8px", letterSpacing: "3px", color: "var(--gold)", textTransform: "uppercase", opacity: 0.6 }}>
                      Royal Portrait &nbsp;·&nbsp; {book?.title} Edition
                    </p>
                  </div>
                </div>

                {/* Confirm CTA */}
                <div style={{ border: "1px solid rgba(191,160,90,0.2)", padding: "24px", backgroundColor: "rgba(191,160,90,0.04)", marginBottom: "16px", textAlign: "center" }}>
                  <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "15px", color: "var(--parchment)", lineHeight: 1.8, marginBottom: "20px", opacity: 0.8 }}>
                    Your portrait will be printed inside your hardcover edition.
                  </p>
                  <button
                    onClick={continueToCheckout}
                    style={{
                      fontFamily: "var(--font-cinzel)",
                      fontSize: "10px",
                      letterSpacing: "3px",
                      color: "var(--ink)",
                      backgroundColor: "var(--gold-light)",
                      border: "none",
                      padding: "16px 36px",
                      cursor: "pointer",
                      textTransform: "uppercase",
                      width: "100%",
                    }}
                  >
                    Use This Portrait →
                  </button>
                </div>

                <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "12px", color: "var(--gold)", opacity: 0.4, textAlign: "center" }}>
                  You can request a reprint if you're not satisfied after delivery.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Skip option */}
        {!portraitUrl && (
          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <button
              onClick={continueToCheckout}
              style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "13px", color: "var(--gold)", opacity: 0.45, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
            >
              Skip portrait — add later
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function PortraitPage() {
  return <Suspense><PortraitContent /></Suspense>;
}
