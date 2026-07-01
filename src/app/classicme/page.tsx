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
    fallback: (name: string) =>
      `It is a truth universally acknowledged, that a single person in possession of a smartphone must be in want of validation. And yet ${name} — whose wit was as sharp as their Wi-Fi password — had always maintained a studied indifference to the opinions of others, except on Tuesdays, when their inbox filled with unsolicited advice from people who meant well.\n\nTheir mother, to whom all eligible conversations led, had once declared them "too particular," but ${name} suspected she meant "too expensive to gift-wrap." Mr. Darcy, had he been present at their group chat, would have initially found them tolerable — just barely — and would have spent the remainder of the novel deeply regretting that first impression.\n\nStill, ${name} endured. They always did. And in the end, that was the most Austen thing about them.`,
  },
  {
    id: "moby",
    title: "Moby Dick",
    author: "Herman Melville",
    label: "Nautical Nonsense",
    emoji: "🐋",
    slug: null,
    color: "#2B4A7A",
    fallback: (name: string) =>
      `Call me ${name}. Some weeks ago — never mind how long precisely — having little money in my purse and a vague sense that Monday meetings were consuming my soul, I thought I would sail about a little and see the watery part of the world.\n\nBut there were no oceans in my commute. Only the great grey whale of a quarterly review, its jaws agape, swallowing everyone whole. I hunted it with harpoons made of passive-aggressive emails and expense reports filed seventeen days late.\n\nI alone escaped to tell thee — mostly because I had a dentist appointment and the captain did not. The sea is vast. The inbox, vaster.`,
  },
  {
    id: "gatsby",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    label: "Jazz Age Roast",
    emoji: "🥂",
    slug: "the-great-gatsby",
    color: "#9A7B2F",
    fallback: (name: string) =>
      `In my younger and more vulnerable years, before I had a Venmo account and questionable taste in party venues, my father gave me some advice: "Reserve your judgments." He was wrong, obviously.\n\n${name} had perfect judgment — particularly about wine, people, and the precise moment to leave a party before it peaked. I watched them from across the bay: their dock was green, their voice was full of money, and their group chat never had the dreaded "seen" receipt problem that plagued the rest of us.\n\nThey believed in the green light, the orgastic future — and in same-day delivery, which amounted to the same thing. So we beat on, notifications against the current, borne back ceaselessly into our feeds.`,
  },
  {
    id: "sherlock",
    title: "Sherlock Holmes",
    author: "Arthur Conan Doyle",
    label: "Consulting Cluelessness",
    emoji: "🔍",
    slug: null,
    color: "#5A4030",
    fallback: (name: string) =>
      `"You have been in back-to-back Zoom calls, I perceive." Holmes said nothing of the sort to ${name}, but he might have — had he observed the thousand-yard stare of someone who spent the better part of a Tuesday explaining a concept that was clearly in the email.\n\nThe game was afoot. The game was always afoot. The game turned out to be a series of increasingly elaborate spreadsheets, at which point Holmes would have reconsidered his profession entirely and Watson would have switched to decaf.\n\nStill, ${name} persisted. The world is full of obvious things which nobody by any chance ever observes. ${name} had observed all of them. That was both their gift and their eternal burden.`,
  },
] as const;

type ClassicId = (typeof CLASSICS)[number]["id"];
type Step = "select" | "customize" | "email" | "generating" | "result";

function drawShareCard(
  name: string,
  bookTitle: string,
  author: string,
  emoji: string,
  passage: string,
  accentColor: string
): void {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Background
  ctx.fillStyle = "#0D1117";
  ctx.fillRect(0, 0, 1080, 1080);

  // Outer gold border
  ctx.strokeStyle = "#D4B86A";
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, 1000, 1000);

  // Inner subtle border
  ctx.strokeStyle = "rgba(212,184,106,0.25)";
  ctx.lineWidth = 1;
  ctx.strokeRect(56, 56, 968, 968);

  // Accent colour bar at top
  ctx.fillStyle = accentColor;
  ctx.fillRect(40, 40, 1000, 10);

  // Book emoji
  ctx.font = "76px serif";
  ctx.textAlign = "center";
  ctx.fillText(emoji, 540, 220);

  // Book title
  ctx.fillStyle = "#D4B86A";
  ctx.font = "700 30px 'Cinzel', Georgia, serif";
  ctx.fillText(bookTitle.toUpperCase(), 540, 286);

  // Author
  ctx.fillStyle = "rgba(191,160,90,0.55)";
  ctx.font = "italic 20px 'EB Garamond', Georgia, serif";
  ctx.fillText(`— ${author}`, 540, 320);

  // Gold rule
  const gr1 = ctx.createLinearGradient(160, 355, 920, 355);
  gr1.addColorStop(0, "transparent");
  gr1.addColorStop(0.5, "#BFA05A");
  gr1.addColorStop(1, "transparent");
  ctx.beginPath();
  ctx.strokeStyle = gr1;
  ctx.lineWidth = 1;
  ctx.moveTo(160, 355);
  ctx.lineTo(920, 355);
  ctx.stroke();

  // Name
  ctx.fillStyle = "#F0DCA8";
  ctx.font = "600 50px 'Cinzel', Georgia, serif";
  ctx.fillText(name, 540, 428);

  // Passage excerpt (word-wrapped)
  ctx.fillStyle = "rgba(240,220,168,0.78)";
  ctx.font = "italic 22px 'EB Garamond', Georgia, serif";
  const excerpt = passage.replace(/\n/g, " ");
  const words = excerpt.split(" ");
  let line = "";
  let y = 496;
  const maxW = 860;
  const lh = 36;
  let lines = 0;

  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + " ";
    if (ctx.measureText(test).width > maxW && line !== "") {
      ctx.fillText(line.trim(), 540, y);
      line = words[i] + " ";
      y += lh;
      lines++;
      if (lines >= 8) {
        ctx.fillText("...", 540, y);
        break;
      }
    } else {
      line = test;
    }
    if (i === words.length - 1 && lines < 8) {
      ctx.fillText(line.trim(), 540, y);
    }
  }

  // Bottom rule
  const gr2 = ctx.createLinearGradient(160, 870, 920, 870);
  gr2.addColorStop(0, "transparent");
  gr2.addColorStop(0.5, "#BFA05A");
  gr2.addColorStop(1, "transparent");
  ctx.beginPath();
  ctx.strokeStyle = gr2;
  ctx.lineWidth = 1;
  ctx.moveTo(160, 870);
  ctx.lineTo(920, 870);
  ctx.stroke();

  // Watermark
  ctx.fillStyle = "rgba(212,184,106,0.45)";
  ctx.font = "600 16px 'Cinzel', Georgia, serif";
  ctx.fillText("GETCHRONICLED.ART / CLASSICME", 540, 926);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `classicme-${name.toLowerCase().replace(/\s+/g, "-")}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, "image/png");
}

export default function ClassicMePage() {
  const [step, setStep] = useState<Step>("select");
  const [selectedId, setSelectedId] = useState<ClassicId | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [roastText, setRoastText] = useState("");
  const [shareMsg, setShareMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const selected = CLASSICS.find((c) => c.id === selectedId) ?? null;

  function handlePhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleGenerate() {
    if (!selected || !name.trim()) return;

    // Fire-and-forget email capture
    if (email.trim()) {
      fetch("/api/classicme/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          book: selected.title,
        }),
      }).catch(() => {});
    }

    setStep("generating");

    try {
      const res = await fetch("/api/classicme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), bookId: selected.id }),
      });
      const data = await res.json();
      setRoastText(data.text || selected.fallback(name.trim()));
    } catch {
      setRoastText(selected.fallback(name.trim()));
    }

    setStep("result");
    import("canvas-confetti").then((m) =>
      m.default({
        particleCount: 160,
        spread: 75,
        origin: { y: 0.55 },
        colors: ["#D4B86A", "#f59e0b", "#ffffff", "#BFA05A"],
      })
    );
  }

  function handleReset() {
    setStep("select");
    setSelectedId(null);
    setName("");
    setEmail("");
    setPhotoUrl(null);
    setRoastText("");
    setShareMsg("");
  }

  function handleShare() {
    if (!selected) return;
    const text = `I just got roasted by ${selected.title} 📖\n\n"${roastText.slice(0, 200).trim()}..."\n\nTry it free: getchronicled.art/classicme`;
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setShareMsg("Copied to clipboard!");
        setTimeout(() => setShareMsg(""), 2500);
      });
    }
  }

  function handleDownloadCard() {
    if (!selected) return;
    drawShareCard(
      name,
      selected.title,
      selected.author,
      selected.emoji,
      roastText,
      selected.color
    );
  }

  const ctaHref = selected?.slug ? `/begin?book=${selected.slug}` : "/begin";
  const paragraphs = roastText.split(/\n\n+/);
  const firstPara = paragraphs[0] ?? "";
  const restParas = paragraphs.slice(1).join("\n\n");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;600;700&family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        .cm { font-family:'EB Garamond',Georgia,serif; background:#0D1117; min-height:100vh; color:#F0DCA8; }
        .cm-display { font-family:'Cinzel Decorative',serif; }
        .cm-caps { font-family:'Cinzel',serif; letter-spacing:.22em; text-transform:uppercase; }
        .cm-book { cursor:pointer; border:1px solid rgba(191,160,90,.15); background:#141B24; transition:border-color .18s,transform .18s,box-shadow .18s; text-align:left; }
        .cm-book:hover { border-color:rgba(212,184,106,.5); transform:translateY(-2px); box-shadow:0 8px 28px rgba(0,0,0,.45); }
        .cm-book.on { border-color:#D4B86A; box-shadow:0 0 0 1px #D4B86A,0 8px 28px rgba(0,0,0,.5); }
        .cm-gold { font-family:'Cinzel',serif; font-size:11px; letter-spacing:.22em; text-transform:uppercase; font-weight:600; background:#D4B86A; color:#0D1117; border:none; cursor:pointer; padding:15px 36px; transition:opacity .15s; }
        .cm-gold:hover:not(:disabled) { opacity:.88; }
        .cm-gold:disabled { opacity:.35; cursor:not-allowed; }
        .cm-ghost { font-family:'Cinzel',serif; font-size:10px; letter-spacing:.2em; text-transform:uppercase; background:transparent; color:#D4B86A; border:1px solid rgba(212,184,106,.4); cursor:pointer; padding:14px 30px; transition:border-color .15s,background .15s; }
        .cm-ghost:hover { border-color:#D4B86A; background:rgba(212,184,106,.06); }
        .cm-input { width:100%; background:#0D1117; border:1px solid rgba(191,160,90,.28); color:#F0DCA8; font-family:'EB Garamond',serif; font-size:20px; padding:14px 18px; outline:none; transition:border-color .15s; box-sizing:border-box; }
        .cm-input::placeholder { color:rgba(240,220,168,.28); }
        .cm-input:focus { border-color:#D4B86A; }
        .cm-rule { height:1px; background:linear-gradient(to right,transparent,#BFA05A,transparent); }
        .cm-passage { font-family:'EB Garamond',serif; font-size:19px; line-height:1.95; color:#F0DCA8; }
        @keyframes cm-spin { to { transform:rotate(360deg); } }
        .cm-spin { animation:cm-spin 1.5s linear infinite; display:inline-block; }
        @keyframes cm-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .cm-in { animation:cm-in .45s ease both; }
        .cm-photo { width:100px; height:100px; border:2px dashed rgba(191,160,90,.3); background:#141B24; cursor:pointer; display:flex; align-items:center; justify-content:center; overflow:hidden; transition:border-color .15s; flex-shrink:0; }
        .cm-photo:hover { border-color:#D4B86A; }
      `}</style>

      <div className="cm">
        {/* Nav */}
        <nav style={{ borderBottom:"1px solid rgba(191,160,90,.12)", padding:"18px 32px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <Link href="/" style={{ textDecoration:"none" }}>
            <span className="cm-caps" style={{ fontSize:13, color:"#D4B86A", letterSpacing:".3em" }}>Chronicled</span>
          </Link>
          <span className="cm-caps" style={{ fontSize:9, color:"rgba(191,160,90,.32)" }}>ClassicMe</span>
        </nav>

        {/* Hero */}
        <header style={{ textAlign:"center", padding:"68px 24px 44px" }}>
          <p className="cm-caps" style={{ fontSize:9, color:"rgba(191,160,90,.45)", marginBottom:16 }}>
            The Elf Yourself of Literature
          </p>
          <h1 className="cm-display" style={{ fontSize:"clamp(44px,9vw,84px)", fontWeight:700, margin:"0 0 6px", lineHeight:1.05 }}>
            <span style={{ color:"#F0DCA8" }}>Classic</span>
            <span style={{ color:"#D4B86A" }}>Me</span>
          </h1>
          <p style={{ fontStyle:"italic", fontSize:"clamp(16px,2.2vw,21px)", color:"rgba(240,220,168,.5)", marginTop:18, maxWidth:500, marginLeft:"auto", marginRight:"auto", lineHeight:1.65 }}>
            Upload your photo. Pick your novel. Get roasted by a literary legend.
          </p>
          <div className="cm-rule" style={{ maxWidth:180, margin:"32px auto 0" }} />
        </header>

        {/* ── STEP: SELECT ── */}
        {step === "select" && (
          <div className="cm-in" style={{ maxWidth:880, margin:"0 auto", padding:"0 24px 80px" }}>
            <p className="cm-caps" style={{ fontSize:9, color:"rgba(191,160,90,.38)", textAlign:"center", marginBottom:32 }}>Step 1 of 3 — Choose your classic</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(196px,1fr))", gap:14 }}>
              {CLASSICS.map((c) => (
                <button key={c.id} className={`cm-book${selectedId === c.id ? " on" : ""}`} onClick={() => setSelectedId(c.id)} style={{ padding:"28px 22px" }}>
                  <div style={{ fontSize:30, marginBottom:12 }}>{c.emoji}</div>
                  <div style={{ width:26, height:3, background:c.color, marginBottom:14 }} />
                  <p className="cm-caps" style={{ fontSize:8, color:"#BFA05A", margin:"0 0 6px" }}>{c.label}</p>
                  <p style={{ fontFamily:"'Cinzel',serif", fontWeight:600, fontSize:14, color:"#F0DCA8", lineHeight:1.3, margin:"0 0 4px" }}>{c.title}</p>
                  <p style={{ fontStyle:"italic", fontSize:12, color:"rgba(191,160,90,.5)", margin:0 }}>{c.author}</p>
                </button>
              ))}
            </div>
            <div style={{ textAlign:"center", marginTop:40 }}>
              <button className="cm-gold" disabled={!selectedId} onClick={() => setStep("customize")}>Continue →</button>
            </div>
          </div>
        )}

        {/* ── STEP: CUSTOMIZE ── */}
        {step === "customize" && selected && (
          <div className="cm-in" style={{ maxWidth:560, margin:"0 auto", padding:"0 24px 80px" }}>
            <p className="cm-caps" style={{ fontSize:9, color:"rgba(191,160,90,.38)", textAlign:"center", marginBottom:32 }}>Step 2 of 3 — Make it yours</p>

            <div style={{ display:"flex", alignItems:"center", gap:14, background:"#141B24", border:"1px solid rgba(191,160,90,.15)", padding:"14px 20px", marginBottom:28 }}>
              <span style={{ fontSize:24 }}>{selected.emoji}</span>
              <div style={{ flex:1 }}>
                <p style={{ fontFamily:"'Cinzel',serif", fontWeight:600, fontSize:14, color:"#F0DCA8", margin:0 }}>{selected.title}</p>
                <p style={{ fontStyle:"italic", fontSize:12, color:"rgba(191,160,90,.5)", margin:"2px 0 0" }}>{selected.label}</p>
              </div>
              <button onClick={() => setStep("select")} style={{ background:"none", border:"none", color:"rgba(191,160,90,.4)", cursor:"pointer", fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:".15em", textTransform:"uppercase" }}>Change</button>
            </div>

            <div style={{ display:"flex", gap:18, alignItems:"flex-start", marginBottom:28 }}>
              <div>
                <button className="cm-photo" onClick={() => fileRef.current?.click()} title="Upload photo">
                  {photoUrl
                    ? <img src={photoUrl} alt="You" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    : <div style={{ textAlign:"center", padding:6 }}>
                        <div style={{ fontSize:22, marginBottom:4 }}>📸</div>
                        <p className="cm-caps" style={{ fontSize:7, color:"rgba(191,160,90,.4)", margin:0 }}>Add photo</p>
                      </div>
                  }
                </button>
                <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handlePhoto} />
              </div>
              <div style={{ flex:1 }}>
                <label className="cm-caps" style={{ display:"block", fontSize:9, color:"rgba(191,160,90,.5)", marginBottom:10 }}>Your name</label>
                <input className="cm-input" type="text" placeholder="Elizabeth Bennet" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && name.trim() && setStep("email")} maxLength={60} />
                <p style={{ fontStyle:"italic", fontSize:12, color:"rgba(191,160,90,.3)", marginTop:8 }}>This name appears in your passage.</p>
              </div>
            </div>

            <div className="cm-rule" style={{ marginBottom:28 }} />
            <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
              <button className="cm-ghost" onClick={() => setStep("select")}>← Back</button>
              <button className="cm-gold" disabled={!name.trim()} onClick={() => setStep("email")}>Roast Me →</button>
            </div>
          </div>
        )}

        {/* ── STEP: EMAIL ── */}
        {step === "email" && selected && (
          <div className="cm-in" style={{ maxWidth:520, margin:"0 auto", padding:"0 24px 80px" }}>
            <p className="cm-caps" style={{ fontSize:9, color:"rgba(191,160,90,.38)", textAlign:"center", marginBottom:32 }}>Step 3 of 3 — One last thing</p>

            <div style={{ background:"#141B24", border:"1px solid rgba(191,160,90,.2)", padding:"44px 40px", textAlign:"center" }}>
              <div style={{ fontSize:36, marginBottom:16 }}>✉️</div>
              <h2 style={{ fontFamily:"'Cinzel',serif", fontWeight:600, fontSize:20, color:"#F0DCA8", margin:"0 0 12px", lineHeight:1.3 }}>
                Your passage is being composed.
              </h2>
              <p style={{ fontStyle:"italic", fontSize:16, color:"rgba(240,220,168,.55)", lineHeight:1.7, margin:"0 0 28px" }}>
                Drop your email and we&apos;ll send you the full version — plus an exclusive offer on your real memoir.
              </p>

              <input
                className="cm-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                style={{ marginBottom:14, textAlign:"center" }}
              />

              <button className="cm-gold" style={{ width:"100%", marginBottom:10 }} onClick={handleGenerate}>
                Send Me My Passage →
              </button>
              <button
                className="cm-ghost"
                style={{ width:"100%", fontSize:10 }}
                onClick={() => { setEmail(""); handleGenerate(); }}
              >
                Skip — just show me
              </button>
            </div>

            <p style={{ fontStyle:"italic", fontSize:12, color:"rgba(191,160,90,.25)", textAlign:"center", marginTop:16 }}>
              No spam. Just your roast and one offer.
            </p>
          </div>
        )}

        {/* ── STEP: GENERATING ── */}
        {step === "generating" && (
          <div className="cm-in" style={{ textAlign:"center", padding:"80px 24px" }}>
            <div className="cm-spin" style={{ fontSize:38, marginBottom:24 }}>✦</div>
            <p className="cm-caps" style={{ fontSize:9, color:"#BFA05A", marginBottom:10 }}>Consulting the canon</p>
            <p style={{ fontStyle:"italic", color:"rgba(240,220,168,.4)", fontSize:17 }}>
              Your literary portrait is being composed by {selected?.author ?? "the ages"}...
            </p>
          </div>
        )}

        {/* ── STEP: RESULT ── */}
        {step === "result" && selected && (
          <div className="cm-in" style={{ maxWidth:720, margin:"0 auto", padding:"0 24px 80px" }}>
            {/* Result header */}
            <div style={{ textAlign:"center", marginBottom:32 }}>
              <p className="cm-caps" style={{ fontSize:9, color:"rgba(191,160,90,.45)", marginBottom:14 }}>Your ClassicMe Passage</p>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:14 }}>
                {photoUrl && <img src={photoUrl} alt="You" style={{ width:52, height:52, borderRadius:"50%", objectFit:"cover", border:"2px solid rgba(212,184,106,.4)" }} />}
                <div style={{ textAlign:"left" }}>
                  <p style={{ fontFamily:"'Cinzel',serif", fontWeight:600, fontSize:16, color:"#F0DCA8", margin:0 }}>{name}</p>
                  <p style={{ fontStyle:"italic", fontSize:13, color:"rgba(191,160,90,.5)", margin:"3px 0 0" }}>as seen through {selected.title}</p>
                </div>
              </div>
              <div className="cm-rule" style={{ maxWidth:260, margin:"22px auto 0" }} />
            </div>

            {/* Passage card */}
            <div style={{ background:"#141B24", border:"1px solid rgba(191,160,90,.18)", padding:"38px 44px", marginBottom:28 }}>
              <p className="cm-caps" style={{ fontSize:8, color:"#BFA05A", marginBottom:22 }}>
                {selected.emoji} &nbsp; {selected.title}
              </p>

              {/* First paragraph — fully visible */}
              <p className="cm-passage">{firstPara}</p>

              {/* Rest — blurred cliff-hanger */}
              {restParas && (
                <div style={{ position:"relative", marginTop:20 }}>
                  <p className="cm-passage" style={{ filter:"blur(5px)", userSelect:"none", opacity:.7, margin:0 }}>
                    {restParas}
                  </p>
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 0%,#141B24 55%)", display:"flex", alignItems:"flex-end", justifyContent:"center", paddingBottom:0 }}>
                    <Link href={ctaHref} style={{ display:"inline-block", textDecoration:"none" }} className="cm-gold">
                      Continue Your Story →
                    </Link>
                  </div>
                </div>
              )}

              <div className="cm-rule" style={{ marginTop: restParas ? 80 : 28, marginBottom:16 }} />
              <p style={{ fontStyle:"italic", fontSize:13, color:"rgba(191,160,90,.3)", textAlign:"right", margin:0 }}>— {selected.author}</p>
            </div>

            {/* Upsell block */}
            <div style={{ background:"rgba(212,184,106,.03)", border:"1px solid rgba(191,160,90,.2)", padding:"30px 34px", textAlign:"center", marginBottom:20 }}>
              <p className="cm-caps" style={{ fontSize:9, color:"#BFA05A", marginBottom:10 }}>Want the full story?</p>
              <p style={{ fontStyle:"italic", fontSize:18, color:"#F0DCA8", lineHeight:1.65, marginBottom:6 }}>
                Turn your real life into a <span style={{ color:"#D4B86A" }}>full literary memoir</span> — 10,000 words, a bespoke portrait, and a hardcover book.
              </p>
              <p style={{ fontStyle:"italic", fontSize:14, color:"rgba(240,220,168,.35)", marginBottom:24 }}>
                Chronicled interviews you and writes your life in the voice of the classics.
              </p>
              <Link href={ctaHref} style={{ display:"inline-block", textDecoration:"none" }} className="cm-gold">
                Begin Your Chronicle — $14.99 →
              </Link>
            </div>

            {/* Action row */}
            <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
              <button className="cm-ghost" onClick={handleShare}>
                {shareMsg || "Share"}
              </button>
              <button className="cm-ghost" onClick={handleDownloadCard} title="Download a shareable image card">
                Download Card 🖼️
              </button>
              <button className="cm-ghost" onClick={handleReset}>
                Try Another Classic
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{ borderTop:"1px solid rgba(191,160,90,.1)", padding:"28px 24px", textAlign:"center" }}>
          <p className="cm-caps" style={{ fontSize:9, color:"rgba(191,160,90,.25)", marginBottom:8 }}>Chronicled — ClassicMe</p>
          <p style={{ fontStyle:"italic", fontSize:13, color:"rgba(240,220,168,.18)" }}>
            A playful taste of your literary life.{" "}
            <Link href="/" style={{ color:"rgba(191,160,90,.35)", textDecoration:"none" }}>Explore the full experience →</Link>
          </p>
        </footer>
      </div>
    </>
  );
}
