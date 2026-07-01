"use client";

import { useState, useRef, ChangeEvent } from "react";
import Link from "next/link";

const CLASSICS = [
  {
    id: "romeo",
    roman: "I",
    title: "Romeo & Juliet",
    author: "William Shakespeare",
    theme: "Tragic Love",
    emoji: "🌹",
    slug: "romeo-and-juliet",
    color: "#7B2D3E",
    fallback: (n: string) =>
      `Two households, both alike in dignity, in fair [city] where we lay our scene — and where ${n} once declared their feelings in a text message that was, in retrospect, perhaps too long for the medium. The stars, as ever, were crossed. The thumbs-up emoji was received at 11:47 PM and never discussed again.\n\nTheir love was a brief and blazing thing, the kind that lives in a single season and is spoken of forever after. Everyone who knew ${n} then will tell you: there was a before and an after. The before was fine. The after was literature.\n\nFor never was a story of more woe — though the group chat has since recovered, and ${n} is doing remarkably well.`,
  },
  {
    id: "pride",
    roman: "II",
    title: "Pride & Prejudice",
    author: "Jane Austen",
    theme: "Love That Endured",
    emoji: "💌",
    slug: "pride-and-prejudice",
    color: "#3E6B5C",
    fallback: (n: string) =>
      `It is a truth universally acknowledged, that a single person in possession of a smartphone must be in want of validation. And yet ${n} — whose wit was as sharp as their Wi-Fi password — had always maintained a studied indifference to the opinions of others, except on Tuesdays, when their inbox filled with unsolicited advice from people who meant well.\n\nTheir mother, to whom all eligible conversations led, had once declared them "too particular," but ${n} suspected she meant "too expensive to gift-wrap." Mr. Darcy, had he been present at their group chat, would have initially found them tolerable — just barely — and would have spent the remainder of the novel deeply regretting that first impression.\n\nStill, ${n} endured. They always did. And in the end, that was the most Austen thing about them.`,
  },
  {
    id: "gatsby",
    roman: "III",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    theme: "Ambition & Reinvention",
    emoji: "🥂",
    slug: "the-great-gatsby",
    color: "#9A7B2F",
    fallback: (n: string) =>
      `In my younger and more vulnerable years, before I had a Venmo account and questionable taste in party venues, my father gave me some advice: "Reserve your judgments." He was wrong, obviously.\n\n${n} had perfect judgment — particularly about wine, people, and the precise moment to leave a party before it peaked. I watched them from across the bay: their dock was green, their voice was full of money, and their group chat never had the dreaded "seen" receipt problem that plagued the rest of us.\n\nThey believed in the green light, the orgastic future — and in same-day delivery, which amounted to the same thing. So we beat on, notifications against the current, borne back ceaselessly into our feeds.`,
  },
  {
    id: "odyssey",
    roman: "IV",
    title: "The Odyssey",
    author: "Homer",
    theme: "A Life of Adventure",
    emoji: "⚓",
    slug: "the-odyssey",
    color: "#4A6B8A",
    fallback: (n: string) =>
      `Sing in me, Muse, and through me tell the story of ${n} — who wandered far and wide, who knew the minds of many cities and many were the woes they suffered in their heart. The sea, in this case, was a series of connecting flights through Atlanta.\n\nThey were gone longer than expected. They lost luggage in circumstances that remain disputed. They came home different. The suitors had eaten all the good snacks, reorganized the kitchen incorrectly, and started a podcast.\n\nStill, ${n} had seen things — things that cannot be unseen — and would, at dinner parties, refer to them obliquely for years to come. The journey was the point. It was always the point.`,
  },
  {
    id: "carol",
    roman: "V",
    title: "A Christmas Carol",
    author: "Charles Dickens",
    theme: "Redemption",
    emoji: "🕯️",
    slug: "a-christmas-carol",
    color: "#5C4A7A",
    fallback: (n: string) =>
      `${n} was not Scrooge. ${n} was, if anything, the ghost — the one who appears at odd hours with important information no one asked for, offering unsolicited perspective on choices that have already been made, and occasionally rattling chains that turn out to be AirPods.\n\nAnd yet: they changed. Not because three spirits came for them in the night (one was delayed, which ruined the whole dynamic), but because one December, in a manner they have never quite explained, something shifted.\n\nThey became softer. Warmer. The sort of person who says "let's not do gifts this year" and actually means it. God bless them, every one.`,
  },
  {
    id: "monte",
    roman: "VI",
    title: "The Count of Monte Cristo",
    author: "Alexandre Dumas",
    theme: "Betrayal & Triumph",
    emoji: "⚔️",
    slug: "the-count-of-monte-cristo",
    color: "#7A4A2A",
    fallback: (n: string) =>
      `How did ${n} survive? With patience. With planning. With a list — written in the margins of a journal bought at an airport, in a city they were never supposed to be in, during the worst year of their life — a list of everyone who had doubted them, and everything they intended to become.\n\nThey did not get revenge, exactly. They got better. Quietly, thoroughly, in full view of everyone who said they wouldn't. The Count himself would have understood, though he would have also sent a very polite, devastating thank-you note.\n\n${n} merely succeeded. That was enough. It was, in its way, more.`,
  },
  {
    id: "jane",
    roman: "VII",
    title: "Jane Eyre",
    author: "Charlotte Brontë",
    theme: "A Life on Her Own Terms",
    emoji: "🕊️",
    slug: "jane-eyre",
    color: "#6B4A5A",
    fallback: (n: string) =>
      `I am no bird; and no net ensnares me. ${n} understood this before they had language for it — the particular freedom of someone who has chosen themselves in a world full of people asking them to do otherwise, politely, repeatedly, with excellent intentions.\n\nThey were not easy to love, those who needed their ease at someone else's expense. And so ${n} left. Then returned, in their own time, on their own terms — which is, it turns out, the only way to arrive anywhere worth being.\n\nMr. Rochester, for what it's worth, would have texted first. That would have helped considerably.`,
  },
  {
    id: "women",
    roman: "VIII",
    title: "Little Women",
    author: "Louisa May Alcott",
    theme: "Family, Dreams & the People Who Made You",
    emoji: "📖",
    slug: "little-women",
    color: "#A07840",
    fallback: (n: string) =>
      `Christmas won't be Christmas without any presents, grumbled ${n} — though by Christmas they meant any number of things that had nothing to do with presents and everything to do with the feeling of being exactly where you belong, with exactly who you love, doing exactly what matters.\n\nThey grew up, as all Marches do. They wrote things down. They kept the letters. They turned, somewhere along the way, from the person who wanted everything into the person who understood what enough looked like.\n\nIt looked a great deal like this: a particular table, a particular light, people they would run toward in any weather. That was the whole of it, really. And it was more than enough.`,
  },
  {
    id: "heights",
    roman: "IX",
    title: "Wuthering Heights",
    author: "Emily Brontë",
    theme: "The Love That Never Let Go",
    emoji: "🌪️",
    slug: "wuthering-heights",
    color: "#3A4550",
    fallback: (n: string) =>
      `Whatever our souls are made of, ${n}'s and mine are the same — that was how it was described to them once, by someone standing in a car park in the rain, which slightly undercut the effect but did not diminish the sincerity.\n\n${n} was wild once, in the way the moors are wild: not dangerous, exactly, but not entirely safe either. Certain landscapes still hold them. Certain weather still brings it back. They have since become something more settled, more interior — a house with the windows finally latched.\n\nBut on particular days, in particular light, you can still see it: the thing they were before they learned to contain it. That thing was enormous. It still is.`,
  },
] as const;

type ClassicId = (typeof CLASSICS)[number]["id"];
type Step = "select" | "customize" | "email" | "generating" | "result";

function drawShareCard(
  name: string,
  roman: string,
  bookTitle: string,
  author: string,
  passage: string,
  accentColor: string
): void {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#0D1117";
  ctx.fillRect(0, 0, 1080, 1080);

  ctx.strokeStyle = "#D4B86A";
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, 1000, 1000);
  ctx.strokeStyle = "rgba(212,184,106,0.2)";
  ctx.lineWidth = 1;
  ctx.strokeRect(58, 58, 964, 964);

  ctx.fillStyle = accentColor;
  ctx.fillRect(40, 40, 1000, 10);

  ctx.fillStyle = "rgba(191,160,90,0.3)";
  ctx.font = "700 100px 'Cinzel', Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(roman, 540, 200);

  const gr1 = ctx.createLinearGradient(160, 230, 920, 230);
  gr1.addColorStop(0, "transparent");
  gr1.addColorStop(0.5, "#BFA05A");
  gr1.addColorStop(1, "transparent");
  ctx.beginPath();
  ctx.strokeStyle = gr1;
  ctx.lineWidth = 1;
  ctx.moveTo(160, 230);
  ctx.lineTo(920, 230);
  ctx.stroke();

  ctx.fillStyle = "#D4B86A";
  ctx.font = "700 28px 'Cinzel', Georgia, serif";
  ctx.fillText(bookTitle.toUpperCase(), 540, 284);

  ctx.fillStyle = "rgba(191,160,90,0.55)";
  ctx.font = "italic 20px 'EB Garamond', Georgia, serif";
  ctx.fillText(`— ${author}`, 540, 318);

  const gr2 = ctx.createLinearGradient(160, 350, 920, 350);
  gr2.addColorStop(0, "transparent");
  gr2.addColorStop(0.5, "#BFA05A");
  gr2.addColorStop(1, "transparent");
  ctx.beginPath();
  ctx.strokeStyle = gr2;
  ctx.lineWidth = 1;
  ctx.moveTo(160, 350);
  ctx.lineTo(920, 350);
  ctx.stroke();

  ctx.fillStyle = "#F0DCA8";
  ctx.font = "600 48px 'Cinzel', Georgia, serif";
  ctx.fillText(name, 540, 420);

  ctx.fillStyle = "rgba(240,220,168,0.75)";
  ctx.font = "italic 22px 'EB Garamond', Georgia, serif";
  const excerpt = passage.replace(/\n/g, " ");
  const words = excerpt.split(" ");
  let line = "";
  let y = 490;
  const lh = 36;
  let lines = 0;
  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + " ";
    if (ctx.measureText(test).width > 860 && line !== "") {
      ctx.fillText(line.trim(), 540, y);
      line = words[i] + " ";
      y += lh;
      if (++lines >= 9) { ctx.fillText("...", 540, y); break; }
    } else {
      line = test;
    }
    if (i === words.length - 1 && lines < 9) ctx.fillText(line.trim(), 540, y);
  }

  const gr3 = ctx.createLinearGradient(160, 870, 920, 870);
  gr3.addColorStop(0, "transparent");
  gr3.addColorStop(0.5, "#BFA05A");
  gr3.addColorStop(1, "transparent");
  ctx.beginPath();
  ctx.strokeStyle = gr3;
  ctx.lineWidth = 1;
  ctx.moveTo(160, 870);
  ctx.lineTo(920, 870);
  ctx.stroke();

  ctx.fillStyle = "rgba(212,184,106,0.4)";
  ctx.font = "600 15px 'Cinzel', Georgia, serif";
  ctx.fillText("GETCHRONICLED.ART / CLASSICME", 540, 920);

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
    if (email.trim()) {
      fetch("/api/classicme/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), book: selected.title }),
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
      m.default({ particleCount: 150, spread: 70, origin: { y: 0.55 }, colors: ["#D4B86A", "#f59e0b", "#fff", "#BFA05A"] })
    );
  }

  function handleReset() {
    setStep("select"); setSelectedId(null); setName(""); setEmail(""); setPhotoUrl(null); setRoastText(""); setShareMsg("");
  }

  function handleShare() {
    if (!selected) return;
    const text = `I just got roasted by ${selected.title} 📖\n\n"${roastText.slice(0, 200).trim()}..."\n\nTry it free → getchronicled.art/classicme`;
    if (navigator.share) { navigator.share({ text }).catch(() => {}); }
    else { navigator.clipboard.writeText(text).then(() => { setShareMsg("Copied!"); setTimeout(() => setShareMsg(""), 2200); }); }
  }

  const ctaHref = selected?.slug ? `/begin?book=${selected.slug}` : "/begin";
  const paragraphs = roastText.split(/\n\n+/);
  const firstPara = paragraphs[0] ?? "";
  const restParas = paragraphs.slice(1).join("\n\n");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Cinzel:wght@400;600;700&family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .cm{font-family:'EB Garamond',Georgia,serif;background:#0D1117;min-height:100vh;color:#F0DCA8;}
        .cm-display{font-family:'Cinzel Decorative',serif;}
        .cm-caps{font-family:'Cinzel',serif;letter-spacing:.2em;text-transform:uppercase;}
        .cm-rule{height:1px;background:linear-gradient(to right,transparent,#BFA05A,transparent);}
        .cm-card{background:#141B24;border:1px solid rgba(191,160,90,.15);cursor:pointer;text-align:left;transition:border-color .18s,transform .18s,box-shadow .18s;}
        .cm-card:hover{border-color:rgba(212,184,106,.45);transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,.5);}
        .cm-card.selected{border-color:#D4B86A;box-shadow:0 0 0 1px #D4B86A,0 8px 32px rgba(0,0,0,.5);}
        .cm-btn-gold{font-family:'Cinzel',serif;font-size:11px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;background:#D4B86A;color:#0D1117;border:none;cursor:pointer;padding:15px 40px;transition:opacity .15s;display:inline-block;text-decoration:none;text-align:center;}
        .cm-btn-gold:hover:not(:disabled){opacity:.88;}
        .cm-btn-gold:disabled{opacity:.32;cursor:not-allowed;}
        .cm-btn-ghost{font-family:'Cinzel',serif;font-size:10px;letter-spacing:.2em;text-transform:uppercase;background:transparent;color:#D4B86A;border:1px solid rgba(212,184,106,.35);cursor:pointer;padding:13px 28px;transition:border-color .15s,background .15s;display:inline-block;text-decoration:none;}
        .cm-btn-ghost:hover{border-color:#D4B86A;background:rgba(212,184,106,.06);}
        .cm-input{width:100%;background:#0D1117;border:1px solid rgba(191,160,90,.25);color:#F0DCA8;font-family:'EB Garamond',serif;font-size:20px;padding:14px 18px;outline:none;transition:border-color .15s;}
        .cm-input::placeholder{color:rgba(240,220,168,.25);}
        .cm-input:focus{border-color:#D4B86A;}
        .cm-passage{font-family:'EB Garamond',serif;font-size:19px;line-height:1.95;color:#F0DCA8;white-space:pre-line;}
        @keyframes cm-spin{to{transform:rotate(360deg);}}
        .cm-spin{animation:cm-spin 1.5s linear infinite;display:inline-block;}
        @keyframes cm-fade{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        .cm-fade{animation:cm-fade .4s ease both;}
        .cm-photo{width:96px;height:96px;border:2px dashed rgba(191,160,90,.28);background:#141B24;cursor:pointer;display:flex;align-items:center;justify-content:center;overflow:hidden;transition:border-color .15s;flex-shrink:0;}
        .cm-photo:hover{border-color:#D4B86A;}
      `}</style>

      <div className="cm">

        {/* ── NAV ── */}
        <nav style={{borderBottom:"1px solid rgba(191,160,90,.12)",padding:"20px 40px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <Link href="/" style={{textDecoration:"none"}}>
            <span className="cm-caps" style={{fontSize:13,color:"#D4B86A",letterSpacing:".35em"}}>Chronicled</span>
          </Link>
          <span className="cm-caps" style={{fontSize:9,color:"rgba(191,160,90,.3)",letterSpacing:".2em"}}>ClassicMe</span>
        </nav>

        {/* ── HERO ── */}
        <header style={{textAlign:"center",padding:"72px 24px 52px"}}>
          <p className="cm-caps" style={{fontSize:9,color:"rgba(191,160,90,.45)",letterSpacing:".4em",marginBottom:18}}>
            The Elf Yourself of Literature
          </p>
          <h1 className="cm-display" style={{fontSize:"clamp(48px,10vw,92px)",fontWeight:700,lineHeight:1.02,marginBottom:0}}>
            <span style={{color:"#F0DCA8"}}>Classic</span>
            <span style={{color:"#D4B86A"}}>Me</span>
          </h1>
          <p style={{fontStyle:"italic",fontSize:"clamp(17px,2.5vw,22px)",color:"rgba(240,220,168,.5)",marginTop:22,maxWidth:480,marginLeft:"auto",marginRight:"auto",lineHeight:1.7}}>
            Upload your photo. Pick your novel.<br/>Get roasted by a literary legend.
          </p>
          <div className="cm-rule" style={{maxWidth:200,margin:"36px auto 0"}} />
        </header>

        {/* ── SELECT ── */}
        {step === "select" && (
          <div className="cm-fade" style={{maxWidth:1040,margin:"0 auto",padding:"0 24px 96px"}}>
            <p className="cm-caps" style={{fontSize:9,color:"rgba(191,160,90,.35)",textAlign:"center",marginBottom:36,letterSpacing:".3em"}}>
              Step 1 of 3 — Choose your classic
            </p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:12}}>
              {CLASSICS.map((c) => (
                <button
                  key={c.id}
                  className={`cm-card${selectedId === c.id ? " selected" : ""}`}
                  onClick={() => setSelectedId(c.id)}
                  style={{padding:"0",border:"none"}}
                >
                  {/* colour bar */}
                  <div style={{height:4,background:c.color,width:"100%"}} />
                  <div style={{padding:"22px 20px 24px"}}>
                    <p className="cm-caps" style={{fontSize:28,color:"rgba(191,160,90,.18)",fontFamily:"'Cinzel',serif",marginBottom:12,lineHeight:1}}>{c.roman}</p>
                    <p className="cm-caps" style={{fontSize:8,color:"#BFA05A",marginBottom:8,letterSpacing:".22em"}}>{c.theme}</p>
                    <p style={{fontFamily:"'Cinzel',serif",fontWeight:600,fontSize:14,color:"#F0DCA8",lineHeight:1.25,marginBottom:5}}>{c.title}</p>
                    <p style={{fontStyle:"italic",fontSize:12,color:"rgba(191,160,90,.45)"}}>{c.author}</p>
                  </div>
                </button>
              ))}
            </div>
            <div style={{textAlign:"center",marginTop:44}}>
              <button className="cm-btn-gold" disabled={!selectedId} onClick={() => setStep("customize")}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── CUSTOMIZE ── */}
        {step === "customize" && selected && (
          <div className="cm-fade" style={{maxWidth:560,margin:"0 auto",padding:"0 24px 96px"}}>
            <p className="cm-caps" style={{fontSize:9,color:"rgba(191,160,90,.35)",textAlign:"center",marginBottom:36}}>
              Step 2 of 3 — Make it yours
            </p>

            {/* Selected book pill */}
            <div style={{display:"flex",alignItems:"center",gap:14,background:"#141B24",border:`1px solid rgba(191,160,90,.15)`,borderLeft:`4px solid ${selected.color}`,padding:"16px 20px",marginBottom:32}}>
              <div>
                <p className="cm-caps" style={{fontSize:8,color:"#BFA05A",marginBottom:4}}>{selected.roman} · {selected.theme}</p>
                <p style={{fontFamily:"'Cinzel',serif",fontWeight:600,fontSize:15,color:"#F0DCA8"}}>{selected.title}</p>
                <p style={{fontStyle:"italic",fontSize:12,color:"rgba(191,160,90,.45)",marginTop:2}}>{selected.author}</p>
              </div>
              <button onClick={() => setStep("select")} style={{marginLeft:"auto",background:"none",border:"none",color:"rgba(191,160,90,.38)",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:".2em",textTransform:"uppercase"}}>
                Change
              </button>
            </div>

            <div style={{display:"flex",gap:18,alignItems:"flex-start",marginBottom:28}}>
              <div>
                <button className="cm-photo" onClick={() => fileRef.current?.click()}>
                  {photoUrl
                    ? <img src={photoUrl} alt="You" style={{width:"100%",height:"100%",objectFit:"cover"}} />
                    : <div style={{textAlign:"center"}}>
                        <div style={{fontSize:20,marginBottom:4}}>📸</div>
                        <p className="cm-caps" style={{fontSize:7,color:"rgba(191,160,90,.38)"}}>Photo</p>
                      </div>
                  }
                </button>
                <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handlePhoto} />
              </div>
              <div style={{flex:1}}>
                <label className="cm-caps" style={{display:"block",fontSize:9,color:"rgba(191,160,90,.45)",marginBottom:10}}>Your name</label>
                <input
                  className="cm-input"
                  type="text"
                  placeholder="Elizabeth Bennet"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && name.trim() && setStep("email")}
                  maxLength={60}
                />
                <p style={{fontStyle:"italic",fontSize:12,color:"rgba(191,160,90,.28)",marginTop:8}}>This name appears in your passage.</p>
              </div>
            </div>

            <div className="cm-rule" style={{marginBottom:28}} />
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button className="cm-btn-ghost" onClick={() => setStep("select")}>← Back</button>
              <button className="cm-btn-gold" disabled={!name.trim()} onClick={() => setStep("email")}>Roast Me →</button>
            </div>
          </div>
        )}

        {/* ── EMAIL ── */}
        {step === "email" && selected && (
          <div className="cm-fade" style={{maxWidth:520,margin:"0 auto",padding:"0 24px 96px"}}>
            <p className="cm-caps" style={{fontSize:9,color:"rgba(191,160,90,.35)",textAlign:"center",marginBottom:36}}>
              Step 3 of 3 — One last thing
            </p>
            <div style={{background:"#141B24",border:"1px solid rgba(191,160,90,.2)",padding:"48px 40px",textAlign:"center"}}>
              <p style={{fontFamily:"'Cinzel',serif",fontWeight:600,fontSize:20,color:"#F0DCA8",lineHeight:1.35,marginBottom:14}}>
                Your passage is being composed.
              </p>
              <div className="cm-rule" style={{marginBottom:24}} />
              <p style={{fontStyle:"italic",fontSize:17,color:"rgba(240,220,168,.52)",lineHeight:1.75,marginBottom:28}}>
                Drop your email and we&apos;ll send you the full version — plus an exclusive offer on your real memoir.
              </p>
              <input
                className="cm-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                style={{marginBottom:12,textAlign:"center"}}
              />
              <button className="cm-btn-gold" style={{width:"100%",marginBottom:10}} onClick={handleGenerate}>
                Send Me My Passage →
              </button>
              <button className="cm-btn-ghost" style={{width:"100%",fontSize:10}} onClick={() => { setEmail(""); handleGenerate(); }}>
                Skip — just show me
              </button>
            </div>
            <p style={{fontStyle:"italic",fontSize:12,color:"rgba(191,160,90,.22)",textAlign:"center",marginTop:14}}>No spam. Just your roast and one offer.</p>
          </div>
        )}

        {/* ── GENERATING ── */}
        {step === "generating" && (
          <div className="cm-fade" style={{textAlign:"center",padding:"88px 24px"}}>
            <div className="cm-spin" style={{fontSize:36,marginBottom:24,color:"#D4B86A"}}>✦</div>
            <p className="cm-caps" style={{fontSize:9,color:"#BFA05A",marginBottom:10}}>Consulting the canon</p>
            <p style={{fontStyle:"italic",color:"rgba(240,220,168,.38)",fontSize:17}}>
              {selected?.author ?? "The ages"} is composing your portrait...
            </p>
          </div>
        )}

        {/* ── RESULT ── */}
        {step === "result" && selected && (
          <div className="cm-fade" style={{maxWidth:720,margin:"0 auto",padding:"0 24px 96px"}}>
            <div style={{textAlign:"center",marginBottom:36}}>
              <p className="cm-caps" style={{fontSize:9,color:"rgba(191,160,90,.42)",marginBottom:14}}>Your ClassicMe Passage</p>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14}}>
                {photoUrl && <img src={photoUrl} alt="You" style={{width:52,height:52,borderRadius:"50%",objectFit:"cover",border:"2px solid rgba(212,184,106,.38)"}} />}
                <div style={{textAlign:"left"}}>
                  <p style={{fontFamily:"'Cinzel',serif",fontWeight:600,fontSize:17,color:"#F0DCA8"}}>{name}</p>
                  <p style={{fontStyle:"italic",fontSize:13,color:"rgba(191,160,90,.48)",marginTop:2}}>as seen through {selected.title}</p>
                </div>
              </div>
              <div className="cm-rule" style={{maxWidth:240,margin:"24px auto 0"}} />
            </div>

            {/* Passage */}
            <div style={{background:"#141B24",border:"1px solid rgba(191,160,90,.18)",borderTop:`3px solid ${selected.color}`,padding:"40px 44px",marginBottom:28}}>
              <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:24}}>
                <span style={{fontFamily:"'Cinzel',serif",fontSize:11,color:"rgba(191,160,90,.3)",fontWeight:600}}>{selected.roman}</span>
                <span className="cm-caps" style={{fontSize:8,color:"#BFA05A"}}>{selected.title}</span>
              </div>

              <p className="cm-passage">{firstPara}</p>

              {restParas && (
                <div style={{position:"relative",marginTop:20}}>
                  <p className="cm-passage" style={{filter:"blur(5px)",userSelect:"none",opacity:.65}}>{restParas}</p>
                  <div style={{position:"absolute",inset:0,background:`linear-gradient(to bottom,transparent 0%,#141B24 52%)`,display:"flex",alignItems:"flex-end",justifyContent:"center",paddingBottom:4}}>
                    <Link href={ctaHref} className="cm-btn-gold">Continue Your Story →</Link>
                  </div>
                </div>
              )}

              <div className="cm-rule" style={{marginTop:restParas ? 72 : 28,marginBottom:14}} />
              <p style={{fontStyle:"italic",fontSize:13,color:"rgba(191,160,90,.28)",textAlign:"right"}}>— {selected.author}</p>
            </div>

            {/* Upsell */}
            <div style={{background:"rgba(212,184,106,.03)",border:"1px solid rgba(191,160,90,.18)",padding:"32px 36px",textAlign:"center",marginBottom:20}}>
              <p className="cm-caps" style={{fontSize:9,color:"#BFA05A",marginBottom:12}}>Want the full story?</p>
              <p style={{fontStyle:"italic",fontSize:19,color:"#F0DCA8",lineHeight:1.65,marginBottom:8}}>
                Turn your real life into a <span style={{color:"#D4B86A"}}>full literary memoir</span> — 10,000 words, a bespoke portrait, and a hardcover book.
              </p>
              <p style={{fontStyle:"italic",fontSize:14,color:"rgba(240,220,168,.33)",marginBottom:26}}>
                Chronicled interviews you and writes your life in the voice of {selected.title}.
              </p>
              <Link href={ctaHref} className="cm-btn-gold">Begin Your Chronicle — $14.99 →</Link>
            </div>

            {/* Actions */}
            <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
              <button className="cm-btn-ghost" onClick={handleShare}>{shareMsg || "Share"}</button>
              <button className="cm-btn-ghost" onClick={() => drawShareCard(name, selected.roman, selected.title, selected.author, roastText, selected.color)}>
                Download Card
              </button>
              <button className="cm-btn-ghost" onClick={handleReset}>Try Another</button>
            </div>
          </div>
        )}

        {/* ── FOOTER ── */}
        <footer style={{borderTop:"1px solid rgba(191,160,90,.1)",padding:"28px 24px",textAlign:"center"}}>
          <p className="cm-caps" style={{fontSize:9,color:"rgba(191,160,90,.22)",marginBottom:8}}>Chronicled — ClassicMe</p>
          <p style={{fontStyle:"italic",fontSize:13,color:"rgba(240,220,168,.18)"}}>
            A playful taste of your literary life.{" "}
            <Link href="/" style={{color:"rgba(191,160,90,.32)",textDecoration:"none"}}>Explore the full experience →</Link>
          </p>
        </footer>
      </div>
    </>
  );
}
