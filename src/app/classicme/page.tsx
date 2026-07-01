"use client";

import { useState, useRef, ChangeEvent } from "react";
import Link from "next/link";

const CLASSICS = [
  {
    id: "pride",
    title: "Pride & Prejudice",
    author: "Jane Austen",
    label: "Regency Sass",
    emoji: "💌",
    slug: "pride-and-prejudice",
    color: "#3E6B5C",
    roast: (name: string) =>
      `It is a truth universally acknowledged, that a single person in possession of a smartphone must be in want of validation. And yet ${name} — whose wit was as sharp as their Wi-Fi password — had always maintained a studied indifference to the opinions of others, except on Tuesdays, when their inbox filled with unsolicited advice from people who meant well.\n\nTheir mother, to whom all eligible conversations led, had once declared them "too particular," but ${name} suspected she meant "too expensive to gift-wrap." Mr. Darcy, had he been present at their group chat, would have initially found them tolerable — just barely — and would have spent the remainder of the novel deeply regretting that first impression.`,
  },
  {
    id: "moby",
    title: "Moby Dick",
    author: "Herman Melville",
    label: "Nautical Nonsense",
    emoji: "🐋",
    slug: null,
    color: "#2B4A7A",
    roast: (name: string) =>
      `Call me ${name}. Some weeks ago — never mind how long precisely — having little money in my purse and a vague sense that Monday meetings were consuming my soul, I thought I would sail about a little and see the watery part of the world.\n\nBut there were no oceans in my commute. Only the great grey whale of a quarterly review, its jaws agape, swallowing everyone whole. I hunted it with harpoons made of passive-aggressive emails and expense reports filed seventeen days late. I alone escaped to tell thee — mostly because I had a dentist appointment and the captain did not.`,
  },
  {
    id: "gatsby",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    label: "Jazz Age Roast",
    emoji: "🥂",
    slug: "the-great-gatsby",
    color: "#9A7B2F",
    roast: (name: string) =>
      `In my younger and more vulnerable years, before I had a Venmo account and questionable taste in party venues, my father gave me some advice: "Reserve your judgments." He was wrong, obviously.\n\n${name} had perfect judgment — particularly about wine, people, and the precise moment to leave a party before it peaked. I watched them from across the bay: their dock was green, their voice was full of money, and their group chat never had the dreaded "seen" receipt problem that plagued the rest of us. They believed in the green light, the orgastic future — and in same-day delivery, which amounted to the same thing.`,
  },
  {
    id: "sherlock",
    title: "Sherlock Holmes",
    author: "Arthur Conan Doyle",
    label: "Consulting Cluelessness",
    emoji: "🔍",
    slug: null,
    color: "#4A3A2A",
    roast: (name: string) =>
      `"You have been in back-to-back Zoom calls, I perceive." Holmes said nothing of the sort to ${name}, but he might have — had he observed the thousand-yard stare of someone who had spent the better part of a Tuesday explaining a concept that was clearly in the email.\n\nThe game was afoot. The game was always afoot. The game turned out to be a series of increasingly elaborate spreadsheets, at which point Holmes would have reconsidered his profession entirely and Watson would have switched to decaf. Still, ${name} persisted. The world is full of obvious things which nobody by any chance ever observes. ${name} had observed all of them. That was both their gift and their eternal burden.`,
  },
] as const;

type ClassicId = (typeof CLASSICS)[number]["id"];
type Step = "select" | "customize" | "generating" | "result";

export default function ClassicMePage() {
  const [step, setStep] = useState<Step>("select");
  const [selectedId, setSelectedId] = useState<ClassicId | null>(null);
  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [roastText, setRoastText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const selected = CLASSICS.find((c) => c.id === selectedId) ?? null;

  function handlePhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleGenerate() {
    if (!selected || !name.trim()) return;
    setStep("generating");
    setTimeout(() => {
      setRoastText(selected.roast(name.trim()));
      setStep("result");
      import("canvas-confetti").then((m) =>
        m.default({
          particleCount: 160,
          spread: 75,
          origin: { y: 0.55 },
          colors: ["#D4B86A", "#f59e0b", "#ffffff", "#BFA05A"],
        })
      );
    }, 2200);
  }

  function handleReset() {
    setStep("select");
    setSelectedId(null);
    setName("");
    setPhotoUrl(null);
    setRoastText("");
  }

  const ctaHref = selected?.slug ? `/begin?book=${selected.slug}` : "/begin";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;600;700&family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        .cm-root { font-family: 'EB Garamond', Georgia, serif; background: #0D1117; min-height: 100vh; color: #F0DCA8; }
        .cm-title { font-family: 'Cinzel Decorative', serif; letter-spacing: 0.04em; }
        .cm-caps { font-family: 'Cinzel', serif; letter-spacing: 0.25em; text-transform: uppercase; }
        .cm-book { cursor: pointer; border: 1px solid rgba(191,160,90,0.15); background: #141B24; transition: border-color 0.18s, transform 0.18s, box-shadow 0.18s; }
        .cm-book:hover { border-color: rgba(212,184,106,0.5); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
        .cm-book.selected { border-color: #D4B86A; box-shadow: 0 0 0 1px #D4B86A, 0 8px 32px rgba(0,0,0,0.5); }
        .cm-btn { font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 600; cursor: pointer; padding: 15px 36px; transition: opacity 0.15s, background 0.15s, border-color 0.15s; }
        .cm-btn-gold { background: #D4B86A; color: #0D1117; border: none; }
        .cm-btn-gold:hover:not(:disabled) { opacity: 0.88; }
        .cm-btn-gold:disabled { opacity: 0.35; cursor: not-allowed; }
        .cm-btn-ghost { background: transparent; color: #D4B86A; border: 1px solid rgba(212,184,106,0.4); }
        .cm-btn-ghost:hover { border-color: #D4B86A; background: rgba(212,184,106,0.06); }
        .cm-input { width: 100%; background: #0D1117; border: 1px solid rgba(191,160,90,0.28); color: #F0DCA8; font-family: 'EB Garamond', serif; font-size: 20px; padding: 14px 18px; outline: none; transition: border-color 0.15s; box-sizing: border-box; }
        .cm-input::placeholder { color: rgba(240,220,168,0.28); }
        .cm-input:focus { border-color: #D4B86A; }
        .cm-rule { height: 1px; background: linear-gradient(to right, transparent, #BFA05A, transparent); }
        .cm-passage { font-family: 'EB Garamond', serif; font-size: 19px; line-height: 1.95; color: #F0DCA8; white-space: pre-line; }
        @keyframes cm-spin { to { transform: rotate(360deg); } }
        .cm-spin { animation: cm-spin 1.5s linear infinite; display: inline-block; }
        @keyframes cm-fade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .cm-fade { animation: cm-fade 0.45s ease both; }
        .cm-photo-btn { width: 100px; height: 100px; border: 2px dashed rgba(191,160,90,0.3); background: #141B24; cursor: pointer; display: flex; align-items: center; justify-content: center; overflow: hidden; transition: border-color 0.15s; flex-shrink: 0; }
        .cm-photo-btn:hover { border-color: #D4B86A; }
      `}</style>

      <div className="cm-root">
        {/* Nav */}
        <nav style={{ borderBottom: "1px solid rgba(191,160,90,0.12)", padding: "18px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span className="cm-caps" style={{ fontSize: 13, color: "#D4B86A", letterSpacing: "0.3em" }}>Chronicled</span>
          </Link>
          <span className="cm-caps" style={{ fontSize: 9, color: "rgba(191,160,90,0.35)", letterSpacing: "0.2em" }}>ClassicMe</span>
        </nav>

        {/* Hero */}
        <header style={{ textAlign: "center", padding: "68px 24px 44px" }}>
          <p className="cm-caps" style={{ fontSize: 9, color: "rgba(191,160,90,0.5)", marginBottom: 18 }}>
            The Elf Yourself of Literature
          </p>
          <h1 className="cm-title" style={{ fontSize: "clamp(44px, 9vw, 84px)", fontWeight: 700, margin: "0 0 6px", lineHeight: 1.05 }}>
            <span style={{ color: "#F0DCA8" }}>Classic</span>
            <span style={{ color: "#D4B86A" }}>Me</span>
          </h1>
          <p style={{ fontStyle: "italic", fontSize: "clamp(16px, 2.2vw, 21px)", color: "rgba(240,220,168,0.55)", marginTop: 18, maxWidth: 500, marginLeft: "auto", marginRight: "auto", lineHeight: 1.65 }}>
            Upload your photo. Pick your novel. Get roasted by a literary legend.
          </p>
          <div className="cm-rule" style={{ maxWidth: 180, margin: "36px auto 0" }} />
        </header>

        {/* ── SELECT ── */}
        {step === "select" && (
          <div className="cm-fade" style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 80px" }}>
            <p className="cm-caps" style={{ fontSize: 9, color: "rgba(191,160,90,0.4)", textAlign: "center", marginBottom: 32 }}>
              Step 1 of 2 — Choose your classic
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(196px, 1fr))", gap: 14 }}>
              {CLASSICS.map((c) => (
                <button
                  key={c.id}
                  className={`cm-book${selectedId === c.id ? " selected" : ""}`}
                  onClick={() => setSelectedId(c.id)}
                  style={{ textAlign: "left", padding: "28px 22px", background: "none", border: "none" }}
                >
                  <div style={{ fontSize: 30, marginBottom: 12 }}>{c.emoji}</div>
                  <div style={{ width: 26, height: 3, background: c.color, marginBottom: 14 }} />
                  <p className="cm-caps" style={{ fontSize: 8, color: "#BFA05A", marginBottom: 6 }}>{c.label}</p>
                  <p style={{ fontFamily: "'Cinzel', serif", fontWeight: 600, fontSize: 14, color: "#F0DCA8", lineHeight: 1.3, margin: "0 0 4px" }}>{c.title}</p>
                  <p style={{ fontStyle: "italic", fontSize: 12, color: "rgba(191,160,90,0.5)", margin: 0 }}>{c.author}</p>
                </button>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <button className="cm-btn cm-btn-gold" disabled={!selectedId} onClick={() => setStep("customize")}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── CUSTOMIZE ── */}
        {step === "customize" && selected && (
          <div className="cm-fade" style={{ maxWidth: 560, margin: "0 auto", padding: "0 24px 80px" }}>
            <p className="cm-caps" style={{ fontSize: 9, color: "rgba(191,160,90,0.4)", textAlign: "center", marginBottom: 32 }}>
              Step 2 of 2 — Make it yours
            </p>

            {/* Selected book pill */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#141B24", border: "1px solid rgba(191,160,90,0.15)", padding: "14px 20px", marginBottom: 28 }}>
              <span style={{ fontSize: 24 }}>{selected.emoji}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "'Cinzel', serif", fontWeight: 600, fontSize: 14, color: "#F0DCA8", margin: 0 }}>{selected.title}</p>
                <p style={{ fontStyle: "italic", fontSize: 12, color: "rgba(191,160,90,0.5)", margin: "2px 0 0" }}>{selected.label}</p>
              </div>
              <button onClick={() => setStep("select")} style={{ background: "none", border: "none", color: "rgba(191,160,90,0.4)", cursor: "pointer", fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Change
              </button>
            </div>

            {/* Photo + name */}
            <div style={{ display: "flex", gap: 18, alignItems: "flex-start", marginBottom: 28 }}>
              <div>
                <button className="cm-photo-btn" onClick={() => fileRef.current?.click()} title="Upload photo">
                  {photoUrl ? (
                    <img src={photoUrl} alt="You" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ textAlign: "center", padding: 6 }}>
                      <div style={{ fontSize: 22, marginBottom: 4 }}>📸</div>
                      <p className="cm-caps" style={{ fontSize: 7, color: "rgba(191,160,90,0.45)", margin: 0 }}>Add photo</p>
                    </div>
                  )}
                </button>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
              </div>

              <div style={{ flex: 1 }}>
                <label className="cm-caps" style={{ display: "block", fontSize: 9, color: "rgba(191,160,90,0.5)", marginBottom: 10 }}>
                  Your name
                </label>
                <input
                  className="cm-input"
                  type="text"
                  placeholder="Elizabeth Bennet"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  maxLength={60}
                />
                <p style={{ fontStyle: "italic", fontSize: 12, color: "rgba(191,160,90,0.32)", marginTop: 8 }}>
                  This is the name that appears in your passage.
                </p>
              </div>
            </div>

            <div className="cm-rule" style={{ marginBottom: 28 }} />

            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="cm-btn cm-btn-ghost" onClick={() => setStep("select")}>← Back</button>
              <button className="cm-btn cm-btn-gold" disabled={!name.trim()} onClick={handleGenerate}>
                Roast Me →
              </button>
            </div>
          </div>
        )}

        {/* ── GENERATING ── */}
        {step === "generating" && (
          <div className="cm-fade" style={{ textAlign: "center", padding: "80px 24px" }}>
            <div className="cm-spin" style={{ fontSize: 38, marginBottom: 24 }}>✦</div>
            <p className="cm-caps" style={{ fontSize: 9, color: "#BFA05A", marginBottom: 10 }}>Consulting the canon</p>
            <p style={{ fontStyle: "italic", color: "rgba(240,220,168,0.45)", fontSize: 17 }}>
              Your literary portrait is being composed...
            </p>
          </div>
        )}

        {/* ── RESULT ── */}
        {step === "result" && selected && (
          <div className="cm-fade" style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 80px" }}>
            {/* Result header */}
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <p className="cm-caps" style={{ fontSize: 9, color: "rgba(191,160,90,0.5)", marginBottom: 14 }}>Your ClassicMe Passage</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
                {photoUrl && (
                  <img src={photoUrl} alt="You" style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(212,184,106,0.4)" }} />
                )}
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontFamily: "'Cinzel', serif", fontWeight: 600, fontSize: 16, color: "#F0DCA8", margin: 0 }}>{name}</p>
                  <p style={{ fontStyle: "italic", fontSize: 13, color: "rgba(191,160,90,0.55)", margin: "3px 0 0" }}>
                    as seen through {selected.title}
                  </p>
                </div>
              </div>
              <div className="cm-rule" style={{ maxWidth: 260, margin: "24px auto 0" }} />
            </div>

            {/* The passage */}
            <div style={{ background: "#141B24", border: "1px solid rgba(191,160,90,0.18)", padding: "38px 44px", marginBottom: 32 }}>
              <p className="cm-caps" style={{ fontSize: 8, color: "#BFA05A", marginBottom: 22 }}>
                {selected.emoji} &nbsp; {selected.title}
              </p>
              <p className="cm-passage">{roastText}</p>
              <div className="cm-rule" style={{ marginTop: 28, marginBottom: 16 }} />
              <p style={{ fontStyle: "italic", fontSize: 13, color: "rgba(191,160,90,0.32)", textAlign: "right", margin: 0 }}>
                — {selected.author}
              </p>
            </div>

            {/* Upsell */}
            <div style={{ background: "rgba(212,184,106,0.03)", border: "1px solid rgba(191,160,90,0.22)", padding: "30px 34px", textAlign: "center", marginBottom: 24 }}>
              <p className="cm-caps" style={{ fontSize: 9, color: "#BFA05A", marginBottom: 10 }}>Want the full story?</p>
              <p style={{ fontStyle: "italic", fontSize: 18, color: "#F0DCA8", lineHeight: 1.65, marginBottom: 6 }}>
                Turn your real life into a{" "}
                <span style={{ color: "#D4B86A" }}>full literary memoir</span> — 10,000 words,
                a bespoke portrait, and a hardcover book.
              </p>
              <p style={{ fontStyle: "italic", fontSize: 14, color: "rgba(240,220,168,0.38)", marginBottom: 24 }}>
                Chronicled interviews you and writes your life in the voice of the classics.
              </p>
              <Link href={ctaHref} style={{ display: "inline-block", textDecoration: "none" }} className="cm-btn cm-btn-gold">
                Begin Your Chronicle — $14.99 →
              </Link>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                className="cm-btn cm-btn-ghost"
                onClick={() => {
                  const text = `I just got roasted by ${selected.title} on ClassicMe\n\n"${roastText.slice(0, 200).trim()}..."\n\nTry it: getchronicled.art/classicme`;
                  if (navigator.share) {
                    navigator.share({ text });
                  } else {
                    navigator.clipboard.writeText(text).then(() => alert("Copied to clipboard!"));
                  }
                }}
              >
                Share
              </button>
              <button className="cm-btn cm-btn-ghost" onClick={handleReset}>
                Try Another Classic
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{ borderTop: "1px solid rgba(191,160,90,0.1)", padding: "28px 24px", textAlign: "center" }}>
          <p className="cm-caps" style={{ fontSize: 9, color: "rgba(191,160,90,0.28)", marginBottom: 8 }}>Chronicled — ClassicMe</p>
          <p style={{ fontStyle: "italic", fontSize: 13, color: "rgba(240,220,168,0.2)" }}>
            A playful taste of your literary life.{" "}
            <Link href="/" style={{ color: "rgba(191,160,90,0.38)", textDecoration: "none" }}>
              Explore the full experience →
            </Link>
          </p>
        </footer>
      </div>
    </>
  );
}
