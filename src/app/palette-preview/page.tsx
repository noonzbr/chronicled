"use client";

import { useState } from "react";

const PALETTES = [
  {
    id: "A",
    name: "Midnight & Champagne",
    desc: "A first edition in a private library",
    bg: "#0D1117",
    bgCard: "#141B24",
    border: "#BFA05A",
    borderFaint: "rgba(191,160,90,0.2)",
    text: "#F0DCA8",
    textSub: "rgba(240,220,168,0.65)",
    gold: "#BFA05A",
    goldLight: "#D4B86A",
    cream: "#F0DCA8",
    parchment: "#E8D49A",
  },
  {
    id: "B",
    name: "Oxblood & Ivory",
    desc: "Velvet, old leather, a book that matters",
    bg: "#1A0A0F",
    bgCard: "#230F16",
    border: "#8B2635",
    borderFaint: "rgba(139,38,53,0.25)",
    text: "#F5EDD8",
    textSub: "rgba(245,237,216,0.65)",
    gold: "#C4A54A",
    goldLight: "#D4B85A",
    cream: "#F5EDD8",
    parchment: "#EDDFCA",
  },
  {
    id: "C",
    name: "Forest & Gilt",
    desc: "An heirloom in a country house",
    bg: "#0D1F18",
    bgCard: "#132A20",
    border: "#4A7C59",
    borderFaint: "rgba(74,124,89,0.25)",
    text: "#F4EDDC",
    textSub: "rgba(244,237,220,0.65)",
    gold: "#C9A84C",
    goldLight: "#D9B85C",
    cream: "#F4EDDC",
    parchment: "#EBE0C8",
  },
  {
    id: "D",
    name: "Slate & Amber",
    desc: "A contemporary literary magazine on heritage paper",
    bg: "#151C28",
    bgCard: "#1C2535",
    border: "#C4732A",
    borderFaint: "rgba(196,115,42,0.25)",
    text: "#F2EBD9",
    textSub: "rgba(242,235,217,0.65)",
    gold: "#C4732A",
    goldLight: "#D4833A",
    cream: "#F2EBD9",
    parchment: "#E8DECA",
  },
  {
    id: "E",
    name: "Noir & Rose Gold",
    desc: "A luxury gift — modern and editorial",
    bg: "#111111",
    bgCard: "#1A1A1A",
    border: "#C49A78",
    borderFaint: "rgba(196,154,120,0.25)",
    text: "#F5EBE0",
    textSub: "rgba(245,235,224,0.65)",
    gold: "#C49A78",
    goldLight: "#D4AA88",
    cream: "#F5EBE0",
    parchment: "#EDE0D4",
  },
];

type Palette = typeof PALETTES[0];

function PaletteCard({ p, isActive, onClick }: { p: Palette; isActive: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: p.bg,
        border: isActive ? `2px solid ${p.gold}` : `1px solid ${p.borderFaint}`,
        cursor: "pointer",
        transition: "all 0.25s ease",
        transform: isActive ? "scale(1.01)" : "scale(1)",
        flex: "1 1 180px",
        minWidth: "160px",
      }}
    >
      {/* Color swatches */}
      <div style={{ display: "flex", height: "6px" }}>
        <div style={{ flex: 1, backgroundColor: p.bg }} />
        <div style={{ flex: 1, backgroundColor: p.bgCard }} />
        <div style={{ flex: 1, backgroundColor: p.gold }} />
        <div style={{ flex: 1, backgroundColor: p.cream }} />
        <div style={{ flex: 1, backgroundColor: p.border }} />
      </div>

      <div style={{ padding: "20px 18px 18px" }}>
        <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "3px", color: p.gold, textTransform: "uppercase", marginBottom: "6px" }}>
          Option {p.id}
        </p>
        <p style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "14px", color: p.cream, marginBottom: "6px", lineHeight: 1.3 }}>
          {p.name}
        </p>
        <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "12px", color: p.textSub, lineHeight: 1.5 }}>
          {p.desc}
        </p>

        {isActive && (
          <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "8px", letterSpacing: "2px", color: p.gold, textTransform: "uppercase", marginTop: "12px" }}>
            ✓ Selected
          </p>
        )}
      </div>
    </div>
  );
}

function MockPage({ p }: { p: Palette }) {
  return (
    <div style={{ backgroundColor: p.bg, border: `1px solid ${p.borderFaint}`, flex: 1 }}>
      {/* Nav */}
      <div style={{ borderBottom: `1px solid ${p.borderFaint}`, padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "18px", color: p.goldLight }}>Chronicled</span>
        <div style={{ display: "flex", gap: "24px" }}>
          {["How It Works", "Sign In"].map(l => (
            <span key={l} style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "3px", color: p.gold, textTransform: "uppercase", opacity: 0.7 }}>{l}</span>
          ))}
          <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "3px", color: p.bg, backgroundColor: p.gold, padding: "7px 16px", textTransform: "uppercase" }}>Begin</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "52px 40px 40px" }}>
        <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "6px", color: p.gold, textTransform: "uppercase", marginBottom: "16px" }}>
          A Literary Chronicle
        </p>
        <h1 style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "38px", color: p.cream, lineHeight: 1.15, marginBottom: "16px", fontWeight: 400 }}>
          Your Life.<br />
          <span style={{ color: p.goldLight }}>A Legendary Narrative.</span>
        </h1>
        <div style={{ height: "1px", background: `linear-gradient(to right, transparent, ${p.gold}, transparent)`, maxWidth: "180px", margin: "0 auto 20px" }} />
        <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "15px", color: p.text, lineHeight: 1.8, opacity: 0.75, maxWidth: "440px", margin: "0 auto 28px" }}>
          Choose a classic. Answer our questions.<br />Receive a book that will outlast everything except the life it was written about.
        </p>
        <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "3px", color: p.bg, backgroundColor: p.goldLight, padding: "12px 28px", textTransform: "uppercase", display: "inline-block" }}>
          Begin Your Story
        </span>
      </div>

      {/* Divider */}
      <div style={{ textAlign: "center", color: p.gold, fontSize: "14px", letterSpacing: "10px", marginBottom: "32px", opacity: 0.5 }}>✦ &nbsp; ✦ &nbsp; ✦</div>

      {/* 3 book cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", padding: "0 24px 24px" }}>
        {[
          { title: "Romeo & Juliet",    theme: "Tragic Love",          tone: "Fateful · Romantic" },
          { title: "The Great Gatsby",  theme: "Ambition & Reinvention", tone: "Glamorous · Sharp" },
          { title: "A Christmas Carol", theme: "Redemption",            tone: "Honest · Hopeful" },
        ].map((book) => (
          <div key={book.title} style={{ border: `1px solid ${p.borderFaint}`, padding: "18px 16px", backgroundColor: `${p.bgCard}` }}>
            <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "8px", letterSpacing: "3px", color: p.gold, textTransform: "uppercase", marginBottom: "6px" }}>{book.theme}</p>
            <p style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "13px", color: p.cream, marginBottom: "5px", lineHeight: 1.3 }}>{book.title}</p>
            <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "11px", color: p.textSub }}>{book.tone}</p>
          </div>
        ))}
      </div>

      {/* Pricing row */}
      <div style={{ borderTop: `1px solid ${p.borderFaint}`, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0" }}>
        {[
          { label: "Digital",   price: "$14", highlight: false },
          { label: "Softcover", price: "$39", highlight: false },
          { label: "Hardcover", price: "$59", highlight: true  },
        ].map((t) => (
          <div key={t.label} style={{ padding: "20px 16px", borderRight: `1px solid ${p.borderFaint}`, backgroundColor: t.highlight ? `${p.borderFaint}` : "transparent", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "8px", letterSpacing: "3px", color: p.gold, textTransform: "uppercase", marginBottom: "6px" }}>{t.label}</p>
            <p style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "26px", color: p.cream, marginBottom: "4px" }}>{t.price}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${p.borderFaint}`, padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "13px", color: p.gold, opacity: 0.7 }}>Chronicled</p>
        <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "12px", color: p.textSub }}>Your life. A legendary narrative.</p>
      </div>
    </div>
  );
}

function MockInterview({ p }: { p: Palette }) {
  return (
    <div style={{ backgroundColor: p.bg, border: `1px solid ${p.borderFaint}`, flex: 1 }}>
      {/* Top bar */}
      <div style={{ borderBottom: `1px solid ${p.borderFaint}`, padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "15px", color: p.goldLight }}>Chronicled</span>
        <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "8px", letterSpacing: "3px", color: p.gold, textTransform: "uppercase" }}>The Interview · The Great Gatsby</span>
        <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "8px", letterSpacing: "2px", color: p.gold, opacity: 0.5, textTransform: "uppercase" }}>12 / 28</span>
      </div>

      <div style={{ padding: "28px 28px 20px" }}>
        {/* Chronicler message */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "8px", letterSpacing: "3px", color: p.gold, textTransform: "uppercase", marginBottom: "8px", opacity: 0.85 }}>Your Chronicler</p>
          <div style={{ border: `1px solid ${p.border}55`, backgroundColor: `${p.bgCard}`, padding: "16px 20px", maxWidth: "85%" }}>
            <p style={{ fontFamily: "var(--font-garamond)", fontSize: "16px", color: "#ffffff", lineHeight: 1.9 }}>
              Portugal. I need to sit with that for a second. An entire ocean between you — and you both leaned in anyway. Tell me, what was the first moment you thought: this is actually real?
            </p>
          </div>
        </div>

        {/* User message */}
        <div style={{ marginBottom: "20px", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "8px", letterSpacing: "3px", color: p.goldLight, textTransform: "uppercase", marginBottom: "8px", opacity: 0.85 }}>You</p>
          <div style={{ border: `1px solid ${p.borderFaint}`, backgroundColor: `rgba(255,255,255,0.05)`, padding: "14px 18px", maxWidth: "80%" }}>
            <p style={{ fontFamily: "var(--font-garamond)", fontSize: "16px", color: "rgba(255,255,255,0.75)", lineHeight: 1.9 }}>
              When he stayed up until 3am his time just to finish a conversation with me. Nobody does that unless they mean it.
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: "16px" }}>
          <div style={{ height: "2px", backgroundColor: `${p.borderFaint}`, borderRadius: "1px" }}>
            <div style={{ width: "43%", height: "100%", backgroundColor: p.gold, borderRadius: "1px" }} />
          </div>
        </div>

        {/* Input */}
        <div style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
          <div style={{ flex: 1, border: `1px solid ${p.borderFaint}`, backgroundColor: `rgba(255,255,255,0.04)`, padding: "12px 16px" }}>
            <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "14px", color: "rgba(255,255,255,0.25)" }}>Answer freely...</p>
          </div>
          <div style={{ backgroundColor: p.goldLight, padding: "12px 18px", display: "flex", alignItems: "center" }}>
            <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "8px", letterSpacing: "2px", color: p.bg, textTransform: "uppercase" }}>Send</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MockBookPage({ p }: { p: Palette }) {
  return (
    <div style={{ backgroundColor: "#F7F2E7", flex: 1, padding: "36px 44px", position: "relative" }}>
      {/* Left rule */}
      <div style={{ position: "absolute", top: "28px", bottom: "28px", left: "28px", width: "1px", background: `linear-gradient(to bottom, transparent, ${p.gold}88 20%, ${p.gold}88 80%, transparent)` }} />

      {/* Running header */}
      <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "7px", letterSpacing: "4px", color: p.gold, textAlign: "center", textTransform: "uppercase", marginBottom: "28px", opacity: 0.7 }}>
        The Chronicle of Natasha &nbsp;·&nbsp; The Great Gatsby
      </p>

      {/* Chapter header */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "8px", letterSpacing: "5px", color: p.gold, textTransform: "uppercase", marginBottom: "8px" }}>Chapter II</p>
        <h3 style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "20px", color: "#2C1A0E", fontWeight: 400, marginBottom: "14px" }}>The Green Light</h3>
        <div style={{ width: "60px", height: "1px", background: `linear-gradient(to right, transparent, ${p.gold}, transparent)`, margin: "0 auto" }} />
      </div>

      {/* Body */}
      <p style={{ fontFamily: "var(--font-garamond)", fontSize: "14px", color: "#2C1A0E", lineHeight: 2, textAlign: "justify", marginBottom: "14px" }}>
        <span style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "3.2em", float: "left", lineHeight: 0.72, marginRight: "5px", marginTop: "6px", color: p.gold }}>E</span>
        very great story has its green light — that small, impossible glow on the far shore that the dreamer reaches toward in the dark. For Natasha, it appeared on a screen. His name was Marcus. He was in Portugal.
      </p>
      <p style={{ fontFamily: "var(--font-garamond)", fontSize: "14px", color: "#2C1A0E", lineHeight: 2, textAlign: "justify", textIndent: "2em", marginBottom: "14px" }}>
        Portugal. Not the next town. Not the neighboring state. An entire ocean — separated by nothing but water and wireless signal and whatever it is that makes two people recognize each other.
      </p>

      {/* Pull quote */}
      <div style={{ borderLeft: `2px solid ${p.gold}`, margin: "16px 12px", padding: "10px 18px", backgroundColor: `${p.gold}0A` }}>
        <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "13px", color: "#5C3D2E", lineHeight: 1.7 }}>
          "When all you have are words, you learn to mean them."
        </p>
      </div>

      {/* Footer with Chronicled branding */}
      <div style={{ position: "absolute", bottom: "18px", left: "44px", right: "28px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${p.gold}22`, paddingTop: "10px" }}>
        <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "7px", letterSpacing: "3px", color: p.gold, opacity: 0.45, textTransform: "uppercase" }}>Chronicled</p>
        <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "11px", color: "#9A7B2F", opacity: 0.5 }}>12</p>
      </div>
    </div>
  );
}

export default function PalettePreviewPage() {
  const [active, setActive] = useState("A");
  const [view, setView] = useState<"homepage" | "interview" | "book">("homepage");

  const p = PALETTES.find((x) => x.id === active)!;

  return (
    <div style={{ backgroundColor: "#080808", minHeight: "100vh", padding: "32px" }}>
      {/* Page title */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "6px", color: "#9A7B2F", textTransform: "uppercase", marginBottom: "8px" }}>
          Chronicled
        </p>
        <h1 style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "28px", color: "#F0DCA8", fontWeight: 400, marginBottom: "6px" }}>
          Color Palette Options
        </h1>
        <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "15px", color: "rgba(240,220,168,0.55)" }}>
          Click a palette to preview it across the full product
        </p>
      </div>

      {/* Palette selector */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "28px", flexWrap: "wrap" }}>
        {PALETTES.map((pal) => (
          <PaletteCard key={pal.id} p={pal} isActive={active === pal.id} onClick={() => setActive(pal.id)} />
        ))}
      </div>

      {/* View switcher */}
      <div style={{ display: "flex", gap: "0", marginBottom: "20px", border: `1px solid ${p.borderFaint}`, width: "fit-content" }}>
        {(["homepage", "interview", "book"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "9px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              padding: "10px 22px",
              border: "none",
              cursor: "pointer",
              backgroundColor: view === v ? p.gold : "transparent",
              color: view === v ? p.bg : p.gold,
              transition: "all 0.2s",
              borderRight: v !== "book" ? `1px solid ${p.borderFaint}` : "none",
            }}
          >
            {v === "homepage" ? "Homepage" : v === "interview" ? "Interview" : "Book Page"}
          </button>
        ))}
      </div>

      {/* Selected palette info */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {[p.bg, p.bgCard, p.gold, p.goldLight, p.cream, p.border].map((color, i) => (
            <div key={i} title={color} style={{ width: "28px", height: "28px", backgroundColor: color, border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%" }} />
          ))}
        </div>
        <div>
          <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "3px", color: p.goldLight, textTransform: "uppercase" }}>
            Option {p.id} — {p.name}
          </p>
          <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>
            {p.desc}
          </p>
        </div>
      </div>

      {/* Live preview */}
      <div style={{ display: "flex", minHeight: "720px", boxShadow: "0 12px 60px rgba(0,0,0,0.7)" }}>
        {view === "homepage"  && <MockPage       p={p} />}
        {view === "interview" && <MockInterview  p={p} />}
        {view === "book"      && <MockBookPage   p={p} />}
      </div>

      {/* Hex values */}
      <div style={{ marginTop: "20px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {[
          { label: "Background",  val: p.bg },
          { label: "Card BG",     val: p.bgCard },
          { label: "Accent",      val: p.gold },
          { label: "Accent Light",val: p.goldLight },
          { label: "Text",        val: p.cream },
          { label: "Border",      val: p.border },
        ].map((s) => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "14px", height: "14px", backgroundColor: s.val, border: "1px solid rgba(255,255,255,0.15)" }} />
            <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "8px", letterSpacing: "2px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>
              {s.label}: {s.val}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
