"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const occasions = [
  {
    id: "birthday",
    emoji: "🎂",
    headline: "The Birthday Gift They'll Never Forget",
    subhead: "Milestone Birthdays · 50th · 60th · 70th · 80th · 90th",
    copy: "You've spent weeks searching for something meaningful. Something that says more than a card, lasts longer than flowers, and actually captures who they are. A Chronicled memoir book does exactly that — their entire life story, written like a classic novel.",
    hook: "What would it mean to give Dad a book written entirely about his life?",
    cta: "Gift a Birthday Book",
    color: "#9A7B2F",
    keywords: "unique birthday gift for mom, meaningful birthday gift for dad, milestone birthday gift ideas",
  },
  {
    id: "anniversary",
    emoji: "💍",
    headline: "Their Love Story. Written Like a Novel.",
    subhead: "Anniversaries · 25th · 40th · 50th · Golden · Silver",
    copy: "How they met. The proposal. The years that followed. Every couple has a story worth telling — we write it in the voice of the classics they love. A gift they'll read together every anniversary for the rest of their lives.",
    hook: "Give them a love story written like Brontë, Austen, or Fitzgerald.",
    cta: "Gift an Anniversary Book",
    color: "#7B2D3E",
    keywords: "unique anniversary gift, personalized love story book, meaningful anniversary present",
  },
  {
    id: "memorial",
    emoji: "🕯️",
    headline: "Preserve Their Legacy Before It Fades",
    subhead: "Memorial · Tribute · Celebration of Life · Legacy",
    copy: "Their stories, their wisdom, their voice — preserved as a beautifully written book that the whole family can read forever. Before the memories fade. Before the details blur. A tribute more lasting than a photo album, more personal than a obituary.",
    hook: "The gift of remembrance, written with the dignity they deserve.",
    cta: "Create a Legacy Book",
    color: "#3A4550",
    keywords: "memorial book for loved one, tribute book gift, legacy book for family",
  },
  {
    id: "parents",
    emoji: "👨‍👩‍👧",
    headline: "Give Mom or Dad the Gift of Their Own Story",
    subhead: "Mother's Day · Father's Day · Grandparents · Parents",
    copy: "Skip the flowers. Skip the gift cards. Give them something that took thought, love, and craft — a book written entirely about their life, their memories, their chapter. The kind of gift that makes the whole room go quiet.",
    hook: "The most meaningful thing you can give a parent is proof that their story mattered.",
    cta: "Gift to a Parent",
    color: "#3E6B5C",
    keywords: "unique gift for mom, meaningful gift for dad, personalized gift for grandparents",
  },
  {
    id: "graduation",
    emoji: "🎓",
    headline: "The End of One Chapter. The Beginning of a Legend.",
    subhead: "Graduations · Retirements · Career Milestones",
    copy: "Four years of college. Forty years of a career. A lifetime of becoming. Every major milestone deserves more than a handshake and a card. A Chronicled book turns the journey into literature — written in the voice of the classics, crafted to last forever.",
    hook: "They earned this story. Give it to them in print.",
    cta: "Celebrate a Milestone",
    color: "#5C4A7A",
    keywords: "unique graduation gift, meaningful retirement gift, personalized milestone gift",
  },
  {
    id: "holiday",
    emoji: "🎄",
    headline: "The Gift Everyone Else Forgot to Give",
    subhead: "Christmas · Hanukkah · New Year · Holiday Season",
    copy: "This year, give something that makes everyone stop scrolling and actually feel something. A personalized memoir book — their story, written like a literary classic — delivered digitally in days, sharable with the whole family instantly.",
    hook: "The one that makes the whole room go quiet on Christmas morning.",
    cta: "Order for the Holidays",
    color: "#4A6B8A",
    keywords: "unique Christmas gift ideas, personalized holiday gift, meaningful gift for family",
  },
];

const faqs = [
  {
    q: "What exactly do I receive?",
    a: "A beautifully formatted digital book — 50 to 150+ pages of narrative prose, styled like a classic novel. Delivered as a high-quality PDF and a shareable digital flipbook link. Print-ready at any local print shop for ~$30–50 if you'd like a physical copy.",
  },
  {
    q: "How does the writing process work?",
    a: "After you order, we send you a guided memory questionnaire. You share the stories, moments, and details. We do all the writing — crafting them into literary prose in the style of your chosen classic novel. You review and we refine until it's perfect.",
  },
  {
    q: "How long does it take?",
    a: "Most books are delivered within 7–14 days. If you have an upcoming occasion, let us know and we'll prioritize accordingly.",
  },
  {
    q: "How is the book written?",
    a: "Chronicled uses a sophisticated literary engine refined by human editorial review. Every book is read, shaped, and polished before delivery. The result reads like literature — because that's exactly what it is.",
  },
  {
    q: "Can I print it as a physical book?",
    a: "Yes. The PDF is print-ready. Any local print shop (FedEx, Staples, etc.) can produce a beautiful physical copy for approximately $30–50. We can also guide you through premium print-on-demand options.",
  },
  {
    q: "What if I'm not happy with it?",
    a: "We offer revision rounds included with every order. Your satisfaction is part of the product.",
  },
];

export default function GiftsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeOccasion, setActiveOccasion] = useState(occasions[0]);

  return (
    <main style={{ backgroundColor: "#0d0a06", minHeight: "100vh", color: "#e8d5a3" }}>

      {/* ── NAV ── */}
      <nav style={{ borderBottom: "1px solid rgba(191,160,90,0.15)", padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "20px", color: "#bfa05a", letterSpacing: "1.5px", textDecoration: "none" }}>
          Chronicled
        </Link>
        <Link
          href="/begin"
          style={{ fontFamily: "var(--font-inter)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", color: "#0d0a06", backgroundColor: "#bfa05a", padding: "12px 28px", textDecoration: "none", textTransform: "uppercase" }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#d4b86a")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#bfa05a")}
        >
          Start Your Story
        </Link>
      </nav>

      {/* ── HERO ── */}
      <section style={{ textAlign: "center", padding: "100px 24px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1400&h=600&fit=crop&auto=format&q=50')", backgroundSize: "cover", backgroundPosition: "center 30%", opacity: 0.1 }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(13,10,6,0.2) 0%, rgba(13,10,6,0.97) 100%)" }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: "780px", margin: "0 auto" }}>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }} style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b8961e", marginBottom: "20px" }}>
            The Most Meaningful Gift You Can Give
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "clamp(34px, 6vw, 64px)", color: "#e8d5a3", lineHeight: 1.2, marginBottom: "28px", fontWeight: 400 }}>
            Their Life Story,<br />
            <span style={{ color: "#bfa05a" }}>Written Like a Classic Novel.</span>
          </motion.h1>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.7, delay: 0.4 }} style={{ height: "1px", background: "linear-gradient(to right, transparent, #b8961e, transparent)", margin: "0 auto 32px", maxWidth: "220px" }} />
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }} style={{ fontFamily: "var(--font-garamond)", fontSize: "20px", color: "#c8b07a", lineHeight: 1.85, marginBottom: "16px" }}>
            You share the memories. We write the book. They keep it forever.
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} style={{ fontFamily: "var(--font-inter)", fontSize: "12px", letterSpacing: "0.07em", color: "rgba(200,176,122,0.55)", marginBottom: "48px", textTransform: "uppercase" }}>
            Birthdays &nbsp;·&nbsp; Anniversaries &nbsp;·&nbsp; Memorials &nbsp;·&nbsp; Retirements &nbsp;·&nbsp; Holidays
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }} style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/begin" style={{ fontFamily: "var(--font-inter)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.1em", color: "#0d0a06", backgroundColor: "#bfa05a", padding: "18px 44px", textDecoration: "none", textTransform: "uppercase", transition: "all 0.2s", boxShadow: "0 4px 20px rgba(191,160,90,0.2)" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#d4b86a"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#bfa05a"; e.currentTarget.style.transform = "translateY(0)"; }}>
              Start Your Story
            </Link>
            <a href="#gift-occasions" style={{ fontFamily: "var(--font-inter)", fontSize: "13px", fontWeight: 600, letterSpacing: "0.08em", color: "#b8961e", border: "1px solid rgba(191,160,90,0.4)", padding: "18px 44px", textDecoration: "none", textTransform: "uppercase", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#bfa05a"; e.currentTarget.style.backgroundColor = "rgba(191,160,90,0.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(191,160,90,0.4)"; e.currentTarget.style.backgroundColor = "transparent"; }}>
              Browse Gift Ideas
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── WHAT IS IT ── */}
      <section style={{ borderTop: "1px solid rgba(191,160,90,0.12)", padding: "80px 24px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b8961e", marginBottom: "16px" }}>What Is Chronicled?</p>
          <h2 style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "clamp(20px, 3vw, 32px)", color: "#e8d5a3", margin: "0 0 20px", lineHeight: 1.3 }}>A Digital Memoir Book, Written Like a Literary Masterpiece</h2>
          <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "18px", color: "#c8a84b", lineHeight: 1.8, margin: "0 0 52px" }}>
            Not a photo album. Not a scrapbook. A real book — with chapters, narrative prose, and a literary voice — written entirely about someone's real life.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", textAlign: "left" }}>
            {[
              { icon: "📖", title: "A Complete Digital Book", desc: "50–150+ pages of narrative prose. Not bullet points — a real, readable book." },
              { icon: "🎭", title: "Styled Like a Classic", desc: "Romeo & Juliet, Great Gatsby, Pride & Prejudice — their story, that voice." },
              { icon: "⚡", title: "Delivered in Days", desc: "Digital delivery — PDF + shareable flipbook link. No shipping, no waiting weeks." },
              { icon: "🌍", title: "Share Instantly", desc: "Send to every family member in one click. Print locally whenever you're ready." },
            ].map(item => (
              <div key={item.title} style={{ background: "rgba(16,11,4,0.8)", border: "1px solid rgba(191,160,90,0.15)", borderRadius: "8px", padding: "24px" }}>
                <div style={{ fontSize: "26px", marginBottom: "12px" }}>{item.icon}</div>
                <h3 style={{ fontFamily: "var(--font-cinzel)", fontSize: "12px", letterSpacing: "0.06em", color: "#d4a843", margin: "0 0 10px", textTransform: "uppercase" }}>{item.title}</h3>
                <p style={{ fontFamily: "var(--font-garamond)", fontSize: "15px", color: "#c8b07a", lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SAMPLE PROSE ── */}
      <section style={{ padding: "80px 24px", background: "rgba(191,160,90,0.02)" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b8961e", marginBottom: "16px", textAlign: "center" }}>See the Transformation</p>
            <h2 style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "clamp(18px, 2.8vw, 28px)", color: "#e8d5a3", textAlign: "center", marginBottom: "40px", lineHeight: 1.3 }}>A real memory → literary prose</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, border: "1px solid rgba(191,160,90,0.2)", borderRadius: "10px", overflow: "hidden" }}>
              <div style={{ background: "rgba(30,20,8,0.9)", padding: "32px 28px", borderRight: "1px solid rgba(191,160,90,0.12)" }}>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(191,160,90,0.45)", marginBottom: "18px" }}>The Memory You Share</p>
                <p style={{ fontFamily: "var(--font-garamond)", fontSize: "15px", color: "rgba(232,213,163,0.6)", lineHeight: 1.8, fontStyle: "italic", margin: 0 }}>
                  "My grandmother used to make coffee every morning at 5am before anyone else was up. She'd sit at the kitchen table by the window and just watch the birds. She never talked about it but I think that was her happiest moment of the day."
                </p>
              </div>
              <div style={{ background: "rgba(10,7,2,0.97)", padding: "32px 28px" }}>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(191,160,90,0.45)", marginBottom: "18px" }}>Your Chronicled Book</p>
                <div style={{ height: "1px", background: "linear-gradient(to right, #b8961e, transparent)", marginBottom: "18px", maxWidth: "40px" }} />
                <p style={{ fontFamily: "var(--font-garamond)", fontSize: "16px", color: "#e8d5a3", lineHeight: 1.9, margin: 0 }}>
                  <em>Before the world stirred, before birdsong or the creak of the old oak floor, Eleanor was already awake. The coffee — dark, unadorned, prepared with a precision that bordered on ceremony — had been her private ritual for forty years. She would carry it to the window table and there she would remain, solitary and sovereign, watching the garden come alive in increments she alone had the patience to observe.</em>
                </p>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "10px", color: "rgba(191,160,90,0.35)", letterSpacing: "0.08em", marginTop: "18px", textTransform: "uppercase" }}>— Chapter 3: The Hours Before Dawn</p>
              </div>
            </div>
            <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "15px", color: "rgba(200,176,122,0.5)", textAlign: "center", marginTop: "20px" }}>Every memory becomes prose like this. 50–150+ pages. Beautifully formatted. Yours forever.</p>
          </motion.div>
        </div>
      </section>

      {/* ── OCCASION GRID ── */}
      <section id="gift-occasions" style={{ padding: "90px 24px", borderTop: "1px solid rgba(191,160,90,0.12)" }}>
        <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b8961e", marginBottom: "14px" }}>The Perfect Gift for Every Occasion</p>
            <h2 style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "clamp(20px, 3.2vw, 34px)", color: "#e8d5a3", margin: 0, lineHeight: 1.3 }}>There's a story worth telling for every milestone.</h2>
          </motion.div>

          {/* Tab selector */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginBottom: "48px" }}>
            {occasions.map(o => (
              <button key={o.id} onClick={() => setActiveOccasion(o)}
                style={{ fontFamily: "var(--font-inter)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", padding: "10px 20px", borderRadius: "4px", cursor: "pointer", transition: "all 0.2s", border: activeOccasion.id === o.id ? "1px solid #b8961e" : "1px solid rgba(191,160,90,0.2)", backgroundColor: activeOccasion.id === o.id ? "rgba(184,150,30,0.12)" : "transparent", color: activeOccasion.id === o.id ? "#d4a843" : "rgba(200,176,122,0.5)" }}>
                {o.emoji} {o.id.charAt(0).toUpperCase() + o.id.slice(1)}
              </button>
            ))}
          </div>

          {/* Active occasion panel */}
          <motion.div key={activeOccasion.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            style={{ background: "rgba(13,9,3,0.9)", border: `1px solid ${activeOccasion.color}44`, borderRadius: "12px", padding: "clamp(28px,5vw,56px)", display: "grid", gridTemplateColumns: "1fr auto", gap: "40px", alignItems: "center" }}>
            <div>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(200,176,122,0.45)", marginBottom: "12px" }}>{activeOccasion.subhead}</p>
              <h3 style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "clamp(20px,3vw,30px)", color: "#e8d5a3", margin: "0 0 20px", lineHeight: 1.3 }}>{activeOccasion.headline}</h3>
              <p style={{ fontFamily: "var(--font-garamond)", fontSize: "17px", color: "#c8b07a", lineHeight: 1.8, margin: "0 0 16px" }}>{activeOccasion.copy}</p>
              <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "16px", color: "#b8961e", margin: "0 0 32px" }}>{activeOccasion.hook}</p>
              <Link href="/begin" style={{ fontFamily: "var(--font-inter)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", color: "#0d0a06", backgroundColor: "#bfa05a", padding: "14px 32px", textDecoration: "none", textTransform: "uppercase", display: "inline-block", transition: "all 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#d4b86a")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#bfa05a")}>
                {activeOccasion.cta} →
              </Link>
            </div>
            <div style={{ fontSize: "72px", opacity: 0.8, display: "flex", alignItems: "center", justifyContent: "center", minWidth: "100px" }}>
              {activeOccasion.emoji}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ padding: "90px 24px", borderTop: "1px solid rgba(191,160,90,0.12)", background: "rgba(191,160,90,0.02)", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b8961e", marginBottom: "16px" }}>Simple, Transparent Pricing</p>
          <h2 style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "clamp(20px,3vw,32px)", color: "#e8d5a3", margin: "0 0 12px", lineHeight: 1.3 }}>One price. A lifetime of memories.</h2>
          <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "17px", color: "#c8a84b", margin: "0 0 52px" }}>Founding Member Rate — limited availability.</p>
          <div style={{ display: "inline-block", background: "rgba(13,9,3,0.95)", border: "1px solid rgba(191,160,90,0.3)", borderRadius: "12px", padding: "48px 64px", textAlign: "center", position: "relative" }}>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b8961e", marginBottom: "8px" }}>⏳ Limited Time Offer</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "16px" }}>
              <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "22px", color: "rgba(191,160,90,0.35)", textDecoration: "line-through" }}>$24.99</span>
              <span style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "52px", color: "#e8d5a3" }}>$14.99</span>
            </div>
            <p style={{ fontFamily: "var(--font-garamond)", fontSize: "15px", color: "#c8b07a", margin: "0 0 32px", lineHeight: 1.7 }}>
              50–150+ pages &nbsp;·&nbsp; PDF + Flipbook link &nbsp;·&nbsp; Print-ready file<br />
              Your chosen classic style &nbsp;·&nbsp; Revision rounds included
            </p>
            <Link href="/begin" style={{ fontFamily: "var(--font-inter)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.1em", color: "#0d0a06", backgroundColor: "#bfa05a", padding: "16px 40px", textDecoration: "none", textTransform: "uppercase", display: "inline-block", transition: "all 0.2s", boxShadow: "0 4px 20px rgba(191,160,90,0.2)" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#d4b86a"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#bfa05a"; e.currentTarget.style.transform = "translateY(0)"; }}>
              Start Your Story
            </Link>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", color: "rgba(191,160,90,0.3)", marginTop: "20px", letterSpacing: "0.05em" }}>Questions? Use the contact form at getchronicled.art or email us directly.</p>
          </div>
        </motion.div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "90px 24px", borderTop: "1px solid rgba(191,160,90,0.12)" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} style={{ textAlign: "center", marginBottom: "52px" }}>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b8961e", marginBottom: "14px" }}>Common Questions</p>
            <h2 style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "clamp(20px,3vw,30px)", color: "#e8d5a3", margin: 0, lineHeight: 1.3 }}>Everything you need to know</h2>
          </motion.div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", textAlign: "left", background: "rgba(16,11,4,0.8)", border: "1px solid rgba(191,160,90,0.15)", borderRadius: openFaq === i ? "8px 8px 0 0" : "8px", padding: "20px 24px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(191,160,90,0.35)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = openFaq === i ? "rgba(191,160,90,0.35)" : "rgba(191,160,90,0.15)")}>
                  <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "13px", letterSpacing: "0.04em", color: "#d4a843", textTransform: "uppercase" }}>{faq.q}</span>
                  <span style={{ color: "#b8961e", fontSize: "18px", lineHeight: 1, transform: openFaq === i ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ background: "rgba(10,7,2,0.9)", border: "1px solid rgba(191,160,90,0.15)", borderTop: "none", borderRadius: "0 0 8px 8px", padding: "20px 24px" }}>
                    <p style={{ fontFamily: "var(--font-garamond)", fontSize: "16px", color: "#c8b07a", lineHeight: 1.8, margin: 0 }}>{faq.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: "100px 24px", textAlign: "center", borderTop: "1px solid rgba(191,160,90,0.12)", background: "linear-gradient(to bottom, transparent, rgba(191,160,90,0.04), transparent)" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b8961e", marginBottom: "20px" }}>Don't Let the Story Fade</p>
          <h2 style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "clamp(24px, 4vw, 48px)", color: "#e8d5a3", margin: "0 0 20px", lineHeight: 1.25 }}>
            Every day without a book<br /><span style={{ color: "#bfa05a" }}>is a chapter lost.</span>
          </h2>
          <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "18px", color: "rgba(200,176,122,0.7)", margin: "0 0 44px" }}>
            Digital delivery in days. Share with everyone. Print-ready forever.
          </p>
          <Link href="/begin" style={{ fontFamily: "var(--font-inter)", fontSize: "14px", fontWeight: 700, letterSpacing: "0.1em", color: "#0d0a06", backgroundColor: "#bfa05a", padding: "20px 56px", textDecoration: "none", textTransform: "uppercase", display: "inline-block", transition: "all 0.25s", boxShadow: "0 6px 24px rgba(191,160,90,0.2)" }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#d4b86a"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(191,160,90,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#bfa05a"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(191,160,90,0.2)"; }}>
            Start Your Story
          </Link>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: "rgba(191,160,90,0.3)", marginTop: "20px" }}>
            <Link href="/" style={{ color: "rgba(191,160,90,0.4)", textDecoration: "underline" }}>Back to getchronicled.art</Link>
          </p>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(191,160,90,0.12)", padding: "40px 24px", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "16px", color: "#bfa05a", marginBottom: "6px" }}>Chronicled</p>
        <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "13px", color: "#b8961e", opacity: 0.7, marginBottom: "16px" }}>Your life. A legendary narrative.</p>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "10px", letterSpacing: "0.06em", color: "#b8961e", opacity: 0.4, textTransform: "uppercase" }}>© 2026 Chronicled · getchronicled.art</p>
      </footer>

    </main>
  );
}
