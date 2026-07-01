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
    tone: "Fateful · Romantic · Bittersweet",
    description:
      "For the love that burned too bright. Your story told with the weight of fate, the beauty of sacrifice, and the ache of what could not be changed.",
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
    tone: "Witty · Warm · Triumphant",
    description:
      "For the love that almost wasn't. Your story told with sharp wit, gentle irony, and the deep satisfaction of a heart that chose well.",
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
    tone: "Glamorous · Cautionary · Sharp",
    description:
      "For the dreamer who reached across the water. Your story told with the shimmer of possibility and the weight of everything you built.",
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
    tone: "Epic · Wandering · Hard-Won",
    description:
      "For the one who went out into the world and didn't come back the same. Your story told as the journey it truly was.",
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
    tone: "Honest · Wry · Hopeful",
    description:
      "For the one who changed. Your story told with honesty about who you were, and generosity about who you became.",
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
    tone: "Bold · Dramatic · Satisfying",
    description:
      "For the one who was wronged and rose anyway. Your story told with the full drama it deserves and the ending it earned.",
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
    tone: "Fierce · Intimate · Triumphant",
    description:
      "For the woman who refused to settle. Your story told with moral courage, quiet strength, and the dignity of someone who always knew her own worth.",
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
    tone: "Warm · Nostalgic · Life-Affirming",
    description:
      "For the family story — the sisters, the sacrifices, the love that shaped everything. Your story told with warmth, humor, and the full beauty of a life extraordinarily lived.",
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
    tone: "Wild · Haunting · Unforgettable",
    description:
      "For the love that defied everything — time, circumstance, reason itself. Your story told with the raw intensity of a feeling that simply could not be contained.",
    emoji: "🌪️",
    slug: "wuthering-heights",
    color: "#3A4550",
    fallback: (n: string) =>
      `Whatever our souls are made of, ${n}'s and mine are the same — that was how it was described to them once, by someone standing in a car park in the rain, which slightly undercut the effect but did not diminish the sincerity.\n\n${n} was wild once, in the way the moors are wild: not dangerous, exactly, but not entirely safe either. Certain landscapes still hold them. Certain weather still brings it back. They have since become something more settled, more interior — a house with the windows finally latched.\n\nBut on particular days, in particular light, you can still see it: the thing they were before they learned to contain it. That thing was enormous. It still is.`,
  },
] as const;

type ClassicId = (typeof CLASSICS)[number]["id"];


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

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "When entering a room, how do you make your presence known?",
    options: [
      { text: "With a sharp, witty remark that commands attention.", value: "pride" },
      { text: "By seeking out the host to compliment the decor and get a drink.", value: "gatsby" },
      { text: "Quietly, choosing a corner to observe the dynamics before speaking.", value: "jane" },
      { text: "Warmly greeting everyone with open arms and a laughter that fills the air.", value: "women" },
    ]
  },
  {
    id: 2,
    question: "What is your fatal flaw in relationships?",
    options: [
      { text: "I love too intensely, disregarding all warnings of doom.", value: "romeo" },
      { text: "I hold onto old grudges and wait for the perfect moment of vindication.", value: "monte" },
      { text: "I refuse to settle, which makes me seem aloof and unyielding.", value: "jane" },
      { text: "I let my passion run so wild it consumes everything around me.", value: "heights" },
    ]
  },
  {
    id: 3,
    question: "Your ideal weekend plan looks like...",
    options: [
      { text: "A lavish party with sparkling conversations and endless champagne.", value: "gatsby" },
      { text: "A grand, solo journey to explore uncharted landscapes.", value: "odyssey" },
      { text: "Gathering close friends or family by the fireplace to share stories.", value: "women" },
      { text: "Re-reading old letters and reflecting on how much I have changed.", value: "carol" },
    ]
  },
  {
    id: 4,
    question: "How do you handle a direct slight from a colleague or friend?",
    options: [
      { text: "Compose a reply that is polite on the surface but devastatingly sharp.", value: "pride" },
      { text: "Plot a meticulous, long-term plan to outperform and outclass them.", value: "monte" },
      { text: "Walk away entirely. My dignity is not up for negotiation.", value: "jane" },
      { text: "Confront them with dramatic, poetic passion.", value: "romeo" },
    ]
  },
  {
    id: 5,
    question: "What does success look like to you?",
    options: [
      { text: "A life of endless adventure and stories worth telling.", value: "odyssey" },
      { text: "Achieving redemption and finding peace with my past.", value: "carol" },
      { text: "Building an empire to win back the only heart that matters.", value: "gatsby" },
      { text: "A warm home full of people I love, doing creative work.", value: "women" },
    ]
  }
];

const WAITING_QUOTES = [
  "“It is a truth universally acknowledged, that a single person in possession of a smartphone must be in want of validation...”",
  "“Whatever our souls are made of, his and mine are the same...”",
  "“Sing in me, Muse, and through me tell the story...”",
  "“I am no bird; and no net ensnares me...”",
  "“In my younger and more vulnerable years my father gave me some advice...”",
  "“For never was a story of more woe than this of Juliet and her Romeo...”",
  "“There is nothing in the world so irresistibly contagious as laughter and good humor...”"
];

type Step = "select" | "quiz" | "customize" | "generating" | "result";

export default function ClassicMePage() {
  const [step, setStep] = useState<Step>("select");
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<ClassicId | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailSaved, setEmailSaved] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [roastText, setRoastText] = useState("");
  const [shareMsg, setShareMsg] = useState("");
  const [portraitGenUrl, setPortraitGenUrl] = useState<string | null>(null);
  const [portraitLoading, setPortraitLoading] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const selected = CLASSICS.find((c) => c.id === selectedId) ?? null;

  function handlePhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function selectBook(id: ClassicId) {
    setSelectedId(id);
    setStep("customize");
  }

  function startQuiz() {
    setQuizIndex(0);
    setQuizAnswers([]);
    setStep("quiz");
  }

  function handleQuizAnswer(val: string) {
    const nextAnswers = [...quizAnswers, val];
    setQuizAnswers(nextAnswers);
    if (quizIndex < QUIZ_QUESTIONS.length - 1) {
      setQuizIndex(quizIndex + 1);
    } else {
      // Calculate matches
      const counts: Record<string, number> = {};
      let maxCount = 0;
      let matchedId: ClassicId = "pride";
      for (const ans of nextAnswers) {
        counts[ans] = (counts[ans] || 0) + 1;
        if (counts[ans] > maxCount) {
          maxCount = counts[ans];
          matchedId = ans as ClassicId;
        }
      }
      setSelectedId(matchedId);
      setStep("customize");
    }
  }

  function resizeForUpload(dataUrl: string, maxDim = 1024): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d")?.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  }

  async function handleGenerate() {
    if (!selected || !name.trim()) return;

    setStep("generating");
    
    // Rotate through loading quotes for wait experience
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % WAITING_QUOTES.length);
    }, 4500);

    // Fire portrait generation in parallel — completes after text is shown
    let portraitPromise = Promise.resolve({ portraitUrl: null });
    if (photoUrl) {
      setPortraitLoading(true);
      setPortraitGenUrl(null);
      const slug = selected.slug;
      portraitPromise = resizeForUpload(photoUrl)
        .then((resized) =>
          fetch("/api/classicme/portrait", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageBase64: resized, bookSlug: slug }),
          })
        )
        .then((r) => r.json())
        .catch(() => ({ portraitUrl: null }));
    }

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

    portraitPromise.then((data) => {
      if (data.portraitUrl) setPortraitGenUrl(data.portraitUrl);
      setPortraitLoading(false);
    });

    clearInterval(interval);
    setStep("result");
    import("canvas-confetti").then((m) =>
      m.default({ particleCount: 150, spread: 70, origin: { y: 0.55 }, colors: ["#D4B86A", "#f59e0b", "#fff", "#BFA05A"] })
    );
  }

  function handleSaveEmail() {
    if (!email.trim() || !selected) return;
    fetch("/api/classicme/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), email: email.trim(), book: selected.title }),
    })
      .then(() => setEmailSaved(true))
      .catch(() => {});
  }

  function handleReset() {
    setStep("select"); setSelectedId(null); setName(""); setEmail(""); setEmailSaved(false); setPhotoUrl(null);
    setRoastText(""); setShareMsg(""); setPortraitGenUrl(null); setPortraitLoading(false);
  }

  function handleShare() {
    if (!selected) return;
    const text = `I put you in ${selected.title}! Here is how the narrator would have described you: "${roastText.slice(0, 180).trim()}..." Find your classic match at getchronicled.art/classicme 📖✨`;
    if (navigator.share) { navigator.share({ text }).catch(() => {}); }
    else { navigator.clipboard.writeText(text).then(() => { setShareMsg("Link Copied!"); setTimeout(() => setShareMsg(""), 2200); }); }
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
        .cm{font-family:'EB Garamond',Georgia,serif;background:#0A0D14;min-height:100vh;color:#F0DCA8;}
        .cm-display{font-family:'Cinzel Decorative',serif;}
        .cm-caps{font-family:'Cinzel',serif;letter-spacing:.18em;text-transform:uppercase;}
        .cm-rule{height:1px;background:linear-gradient(to right,transparent,#BFA05A,transparent);}
        .cm-book-card{
          background:#101520;
          border:1px solid rgba(191,160,90,.12);
          cursor:pointer;
          text-align:left;
          transition:all .3s cubic-bezier(0.16, 1, 0.3, 1);
          position:relative;
          overflow:hidden;
          padding:0;
          width:100%;
          display:block;
          border-radius:6px;
        }
        .cm-book-card:hover{
          border-color:rgba(212,184,106,.45);
          transform:translateY(-6px);
          box-shadow:0 15px 45px rgba(0,0,0,.65);
          background:#141C2A;
        }
        .cm-book-card:hover .cm-card-cta{color:#F0DCA8;}
        .cm-card-roman{
          position:absolute;
          right:-8px;
          top:50%;
          transform:translateY(-50%);
          font-family:'Cinzel',serif;
          font-weight:700;
          font-size:130px;
          line-height:1;
          opacity:0.04;
          pointer-events:none;
          user-select:none;
          letter-spacing:-4px;
        }
        .cm-card-inner{
          padding:32px 32px 28px;
          position:relative;
          z-index:1;
        }
        .cm-card-theme{
          font-family:'Cinzel',serif;
          font-size:10px;
          letter-spacing:.28em;
          text-transform:uppercase;
          color:#BFA05A;
          margin-bottom:14px;
        }
        .cm-card-title{
          font-family:'Cinzel',serif;
          font-weight:600;
          font-size:20px;
          color:#F0DCA8;
          line-height:1.2;
          margin-bottom:10px;
        }
        .cm-card-tone{
          font-style:italic;
          font-size:14px;
          color:rgba(191,160,90,.8);
          margin-bottom:16px;
          letter-spacing:.04em;
        }
        .cm-card-desc{
          font-style:italic;
          font-size:15px;
          color:rgba(240,220,168,.6);
          line-height:1.65;
          margin-bottom:24px;
        }
        .cm-card-cta{
          font-family:'Cinzel',serif;
          font-size:11px;
          letter-spacing:.22em;
          text-transform:uppercase;
          color:#D4B86A;
          transition:color .15s;
        }
        .cm-books-grid{
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:24px;
        }
        @media(max-width:800px){.cm-books-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:520px){.cm-books-grid{grid-template-columns:1fr;}}
        .cm-btn-gold{font-family:'Cinzel',serif;font-size:13px;letter-spacing:.18em;text-transform:uppercase;font-weight:600;background:#D4B86A;color:#0D1117;border:none;cursor:pointer;padding:16px 44px;transition:all 0.25s;display:inline-block;text-decoration:none;text-align:center;border-radius:4px;box-shadow:0 4px 15px rgba(212,184,106,0.2);}
        .cm-btn-gold:hover:not(:disabled){opacity:.95;transform:translateY(-1px);box-shadow:0 6px 20px rgba(212,184,106,0.35);}
        .cm-btn-gold:disabled{opacity:.32;cursor:not-allowed;}
        .cm-btn-ghost{font-family:'Cinzel',serif;font-size:12px;letter-spacing:.15em;text-transform:uppercase;background:transparent;color:#D4B86A;border:1px solid rgba(212,184,106,.45);cursor:pointer;padding:14px 28px;transition:all 0.2s;display:inline-block;text-decoration:none;border-radius:4px;}
        .cm-btn-ghost:hover{border-color:#D4B86A;background:rgba(212,184,106,.07);transform:translateY(-1px);}
        .cm-btn-quiz{width:100%;text-align:left;background:#101520;border:1px solid rgba(191,160,90,.2);color:#F0DCA8;font-family:'EB Garamond',serif;font-size:18px;padding:16px 22px;margin-bottom:12px;cursor:pointer;transition:all 0.2s;border-radius:6px;}
        .cm-btn-quiz:hover{border-color:#D4B86A;background:#141C2A;padding-left:28px;}
        .cm-input{width:100%;background:#0D1117;border:1px solid rgba(191,160,90,.3);color:#F0DCA8;font-family:'EB Garamond',serif;font-size:22px;padding:15px 20px;outline:none;transition:border-color .15s;border-radius:4px;}
        .cm-input::placeholder{color:rgba(240,220,168,.38);}
        .cm-input:focus{border-color:#D4B86A;}
        .cm-passage{font-family:'EB Garamond',serif;font-size:21px;line-height:2.1;color:#F0DCA8;white-space:pre-line;}
        @keyframes cm-spin{to{transform:rotate(360deg);}}
        .cm-spin{animation:cm-spin 1.5s linear infinite;display:inline-block;}
        @keyframes cm-fade{from{opacity:0;transform:translateY(15px);}to{opacity:1;transform:translateY(0);}}
        .cm-fade{animation:cm-fade .5s cubic-bezier(0.16, 1, 0.3, 1) both;}
        
        /* Premium Ken Burns & Reveal Effects */
        @keyframes kenburns {
          0% { transform: scale(1.02) translate(0, 0); }
          50% { transform: scale(1.08) translate(-1%, -1%); }
          100% { transform: scale(1.02) translate(0, 0); }
        }
        .portrait-container {
          overflow: hidden;
          position: relative;
        }
        .portrait-zoom {
          animation: kenburns 25s ease-in-out infinite;
        }
        .painterly-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, transparent 20%, rgba(13,17,23,0.3) 100%), linear-gradient(45deg, rgba(212,184,106,0.1) 0%, transparent 60%);
          pointer-events: none;
        }
        .cm-photo{width:100px;height:100px;border:2px dashed rgba(191,160,90,.4);background:#101520;cursor:pointer;display:flex;align-items:center;justify-content:center;overflow:hidden;transition:border-color .15s;flex-shrink:0;border-radius:8px;}
        .cm-photo:hover{border-color:#D4B86A;}
        .cm-portrait-img{filter:sepia(0.35) contrast(1.08) brightness(0.97) saturate(0.82);}
      `}</style>

      <div className="cm">

        {/* ── NAV ── */}
        <nav style={{borderBottom:"1px solid rgba(191,160,90,.15)",padding:"20px 40px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <Link href="/" style={{textDecoration:"none"}}>
            <span className="cm-caps" style={{fontSize:15,color:"#D4B86A",letterSpacing:".3em"}}>Chronicled</span>
          </Link>
          <span className="cm-caps" style={{fontSize:12,color:"rgba(191,160,90,.55)",letterSpacing:".18em"}}>ClassicMe</span>
        </nav>

        {/* ── HERO ── */}
        <header style={{textAlign:"center",padding:"72px 24px 52px"}}>
          <p className="cm-caps" style={{fontSize:12,color:"rgba(191,160,90,.7)",letterSpacing:".3em",marginBottom:18}}>
            The Elf Yourself of Literature
          </p>
          <h1 className="cm-display" style={{fontSize:"clamp(48px,10vw,92px)",fontWeight:700,lineHeight:1.02,marginBottom:0}}>
            <span style={{color:"#F0DCA8"}}>Classic</span>
            <span style={{color:"#D4B86A"}}>Me</span>
          </h1>
          <p style={{fontStyle:"italic",fontSize:"clamp(18px,2.5vw,23px)",color:"rgba(240,220,168,.78)",marginTop:22,maxWidth:480,marginLeft:"auto",marginRight:"auto",lineHeight:1.7}}>
            Upload your photo. Get matched to your classic.<br/>Get written into literary legend.
          </p>
          <div className="cm-rule" style={{maxWidth:200,margin:"36px auto 0"}} />
        </header>

        {/* ── SELECT ── */}
        {step === "select" && (
          <div className="cm-fade" style={{maxWidth:1120,margin:"0 auto",padding:"0 24px 96px"}}>
            
            {/* Playful Interactive Option */}
            <div style={{textAlign:"center",marginBottom:64}}>
              <button className="cm-btn-gold" style={{fontSize:15,padding:"18px 52px"}} onClick={startQuiz}>
                ✨ Take the Literary Matchmaker Quiz →
              </button>
              <p style={{fontStyle:"italic",color:"rgba(191,160,90,.6)",marginTop:14,fontSize:16}}>
                Let the canon decide which classic novel matches your spirit
              </p>
            </div>

            <p className="cm-caps" style={{fontSize:11,color:"rgba(191,160,90,.6)",textAlign:"center",marginBottom:40,letterSpacing:".25em"}}>
              Or select your novel directly
            </p>
            <div className="cm-books-grid">
              {CLASSICS.map((c) => (
                <button
                  key={c.id}
                  className="cm-book-card"
                  onClick={() => selectBook(c.id)}
                  style={{borderLeft:`3px solid ${c.color}`}}
                >
                  <div className="cm-card-roman" style={{color:c.color}}>{c.roman}</div>
                  <div className="cm-card-inner">
                    <p className="cm-card-theme">{c.theme}</p>
                    <p className="cm-card-title">{c.title}</p>
                    <p className="cm-card-tone">{c.tone}</p>
                    <p className="cm-card-desc">{c.description}</p>
                    <div className="cm-rule" style={{marginBottom:18}} />
                    <p className="cm-card-cta">Choose This Story →</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── QUIZ ── */}
        {step === "quiz" && (
          <div className="cm-fade" style={{maxWidth:600,margin:"0 auto",padding:"0 24px 96px"}}>
            <p className="cm-caps" style={{fontSize:12,color:"rgba(191,160,90,.65)",textAlign:"center",marginBottom:24}}>
              Question {quizIndex + 1} of {QUIZ_QUESTIONS.length}
            </p>
            <div style={{background:"#101520",border:"1px solid rgba(191,160,90,.2)",padding:"40px",borderRadius:8}}>
              <h2 style={{fontFamily:"'Cinzel',serif",fontSize:22,color:"#F0DCA8",marginBottom:32,lineHeight:1.4,textAlign:"center"}}>
                {QUIZ_QUESTIONS[quizIndex].question}
              </h2>
              <div>
                {QUIZ_QUESTIONS[quizIndex].options.map((opt, i) => (
                  <button key={i} className="cm-btn-quiz" onClick={() => handleQuizAnswer(opt.value)}>
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
            <div style={{textAlign:"center",marginTop:24}}>
              <button className="cm-btn-ghost" onClick={() => setStep("select")}>✕ Cancel Quiz</button>
            </div>
          </div>
        )}

        {/* ── CUSTOMIZE ── */}
        {step === "customize" && selected && (
          <div className="cm-fade" style={{maxWidth:560,margin:"0 auto",padding:"0 24px 96px"}}>
            <p className="cm-caps" style={{fontSize:12,color:"rgba(191,160,90,.65)",textAlign:"center",marginBottom:36}}>
              Step 2 of 2 — Personalize
            </p>

            <div style={{display:"flex",alignItems:"center",gap:14,background:"#101520",border:`1px solid rgba(191,160,90,.2)`,borderLeft:`4px solid ${selected.color}`,padding:"18px 22px",marginBottom:32,borderRadius:6}}>
              <div>
                <p className="cm-caps" style={{fontSize:10,color:"#BFA05A",marginBottom:5}}>{selected.roman} · {selected.theme}</p>
                <p style={{fontFamily:"'Cinzel',serif",fontWeight:600,fontSize:17,color:"#F0DCA8"}}>{selected.title}</p>
                <p style={{fontStyle:"italic",fontSize:15,color:"rgba(191,160,90,.7)",marginTop:3}}>{selected.author}</p>
              </div>
              <button onClick={() => setStep("select")} style={{marginLeft:"auto",background:"none",border:"none",color:"rgba(191,160,90,.6)",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:12,letterSpacing:".15em",textTransform:"uppercase"}}>
                Change
              </button>
            </div>

            <div style={{display:"flex",gap:18,alignItems:"flex-start",marginBottom:28}}>
              <div>
                <button className="cm-photo" onClick={() => fileRef.current?.click()}>
                  {photoUrl
                    ? <img src={photoUrl} alt="You" style={{width:"100%",height:"100%",objectFit:"cover"}} />
                    : <div style={{textAlign:"center"}}>
                        <div style={{fontSize:24,marginBottom:6}}>📸</div>
                        <p className="cm-caps" style={{fontSize:11,color:"rgba(191,160,90,.6)"}}>Photo</p>
                      </div>
                  }
                </button>
                <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handlePhoto} />
              </div>
              <div style={{flex:1}}>
                <label className="cm-caps" style={{display:"block",fontSize:12,color:"rgba(191,160,90,.7)",marginBottom:12}}>Your name</label>
                <input
                  className="cm-input"
                  type="text"
                  placeholder="Elizabeth Bennet"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && name.trim() && handleGenerate()}
                  maxLength={60}
                />
                <p style={{fontStyle:"italic",fontSize:15,color:"rgba(191,160,90,.5)",marginTop:10}}>This name appears in your passage.</p>
              </div>
            </div>

            <div className="cm-rule" style={{marginBottom:28}} />
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button className="cm-btn-ghost" onClick={() => setStep("select")}>← Back</button>
              <button className="cm-btn-gold" disabled={!name.trim()} onClick={handleGenerate}>Compose Passage & Portrait →</button>
            </div>
          </div>
        )}

        {/* ── GENERATING / INSCRIBING ── */}
        {step === "generating" && (
          <div className="cm-fade" style={{textAlign:"center",padding:"88px 24px",maxWidth:600,margin:"0 auto"}}>
            <div className="cm-spin" style={{fontSize:36,marginBottom:24,color:"#D4B86A"}}>✦</div>
            <p className="cm-caps" style={{fontSize:13,color:"#BFA05A",marginBottom:24}}>Consulting the canon</p>
            
            {/* Dynamic waiting quotes to build anticipation */}
            <div style={{minHeight:120,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 20px"}}>
              <p style={{fontStyle:"italic",color:"rgba(240,220,168,.85)",fontSize:22,lineHeight:1.6,transition:"all 0.5s ease"}}>
                {WAITING_QUOTES[quoteIndex]}
              </p>
            </div>
            
            <p style={{fontStyle:"italic",color:"rgba(240,220,168,.45)",fontSize:15,marginTop:32}}>
              {selected?.author ?? "The ages"} is composing your portrait and passage...
            </p>
          </div>
        )}

        {/* ── RESULT ── */}
        {step === "result" && selected && (
          <div className="cm-fade" style={{maxWidth:720,margin:"0 auto",padding:"0 24px 96px"}}>

            {/* Portrait + name header */}
            <div style={{textAlign:"center",marginBottom:40}}>
              <p className="cm-caps" style={{fontSize:12,color:"rgba(191,160,90,.65)",marginBottom:24}}>Your ClassicMe Portrait</p>

              {/* Portrait with Premium Ken Burns & Painterly Overlay */}
              <div style={{display:"inline-block",position:"relative",marginBottom:20}}>
                {portraitGenUrl ? (
                  /* ── AI portrait ready ── */
                  <>
                    <div className="portrait-container" style={{
                      width:220,height:320,
                      border:"2px solid #D4B86A",
                      padding:6,
                      background:"#141B24",
                      display:"inline-block",
                      boxShadow:"0 0 60px rgba(212,184,106,.2)",
                      borderRadius:4,
                    }}>
                      <div className="portrait-zoom" style={{width:"100%",height:"100%",border:"1px solid rgba(191,160,90,.3)",overflow:"hidden",position:"relative"}}>
                        <img
                          src={portraitGenUrl}
                          alt={`${name} — ${selected.title} portrait`}
                          style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}
                        />
                        <div className="painterly-overlay" />
                      </div>
                    </div>
                    <div style={{
                      position:"absolute",bottom:-14,left:"50%",transform:"translateX(-50%)",
                      background:"#D4B86A",color:"#0D1117",
                      fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:13,
                      padding:"3px 14px",letterSpacing:".15em",whiteSpace:"nowrap",
                      borderRadius:2,
                    }}>
                      {selected.roman} · {selected.theme.toUpperCase()}
                    </div>
                  </>
                ) : photoUrl ? (
                  /* ── Original photo + painting overlay while AI generates ── */
                  <>
                    <div className="portrait-container" style={{
                      width:190,height:240,
                      border:"2px solid #D4B86A",
                      padding:6,
                      background:"#141B24",
                      display:"inline-block",
                      boxShadow:"0 0 40px rgba(212,184,106,.15)",
                      borderRadius:4,
                    }}>
                      <div style={{width:"100%",height:"100%",border:"1px solid rgba(191,160,90,.3)",overflow:"hidden",position:"relative"}}>
                        <img
                          src={photoUrl}
                          alt={name}
                          className="cm-portrait-img portrait-zoom"
                          style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}
                        />
                        <div className="painterly-overlay" />
                        {portraitLoading && (
                          <div style={{
                            position:"absolute",inset:0,
                            background:"rgba(13,17,23,0.85)",
                            display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,
                          }}>
                            <div className="cm-spin" style={{fontSize:26,color:"#D4B86A"}}>✦</div>
                            <p className="cm-caps" style={{fontSize:10,color:"#BFA05A",textAlign:"center",lineHeight:1.5}}>
                              Painting<br/>your portrait...
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{
                      position:"absolute",bottom:-14,left:"50%",transform:"translateX(-50%)",
                      background:"#D4B86A",color:"#0D1117",
                      fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:13,
                      padding:"3px 14px",letterSpacing:".15em",
                      borderRadius:2,
                    }}>
                      {selected.roman}
                    </div>
                  </>
                ) : (
                  /* ── No photo uploaded ── */
                  <div style={{
                    width:190,height:240,border:"2px solid #D4B86A",padding:6,background:"#101520",display:"inline-flex",
                    boxShadow:"0 0 40px rgba(212,184,106,.15)",
                    borderRadius:4,
                  }}>
                    <div style={{flex:1,border:"1px solid rgba(191,160,90,.3)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:8}}>
                      <span style={{fontFamily:"'Cinzel Decorative',serif",fontSize:64,color:"rgba(191,160,90,.25)",lineHeight:1}}>
                        {name.charAt(0).toUpperCase()}
                      </span>
                      <p className="cm-caps" style={{fontSize:10,color:"rgba(191,160,90,.4)"}}>Upload a photo<br/>for your portrait</p>
                    </div>
                  </div>
                )}
              </div>

              <p style={{fontFamily:"'Cinzel',serif",fontWeight:600,fontSize:22,color:"#F0DCA8",marginBottom:6,marginTop:24}}>{name}</p>
              <p style={{fontStyle:"italic",fontSize:16,color:"rgba(191,160,90,.7)"}}>as seen through {selected.title}</p>
              <div className="cm-rule" style={{maxWidth:240,margin:"22px auto 0"}} />
            </div>

            {/* Passage card */}
            <div style={{background:"#101520",border:"1px solid rgba(191,160,90,.22)",borderLeft:`3px solid ${selected.color}`,padding:"40px 44px",marginBottom:28,borderRadius:6}}>
              <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:24}}>
                <span style={{fontFamily:"'Cinzel',serif",fontSize:14,color:"rgba(191,160,90,.55)",fontWeight:700}}>{selected.roman}</span>
                <span className="cm-caps" style={{fontSize:12,color:"#BFA05A"}}>{selected.title}</span>
              </div>

              <p className="cm-passage">{firstPara}</p>

              {restParas && (
                <div style={{position:"relative",marginTop:20}}>
                  <p className="cm-passage" style={{filter:"blur(5px)",userSelect:"none",opacity:.65}}>{restParas}</p>
                  <div style={{position:"absolute",inset:0,background:`linear-gradient(to bottom,transparent 0%,#101520 52%)`,display:"flex",alignItems:"flex-end",justifyContent:"center",paddingBottom:4}}>
                    <Link href={ctaHref} className="cm-btn-gold">Continue Your Story →</Link>
                  </div>
                </div>
              )}

              <div className="cm-rule" style={{marginTop:restParas ? 72 : 28,marginBottom:16}} />
              <p style={{fontStyle:"italic",fontSize:15,color:"rgba(191,160,90,.5)",textAlign:"right"}}>— {selected.author}</p>
            </div>

            {/* Post-result email gate & monetization */}
            <div style={{background:"rgba(212,184,106,.02)",border:"1px solid rgba(191,160,90,.18)",padding:"34px 38px",textAlign:"center",marginBottom:28,borderRadius:6}}>
              {!emailSaved ? (
                <>
                  <p className="cm-caps" style={{fontSize:12,color:"#BFA05A",marginBottom:10}}>Save Your Literary Keepsake</p>
                  <p style={{fontStyle:"italic",fontSize:16,color:"rgba(240,220,168,.75)",marginBottom:18}}>
                    Drop your email to get the full written text, the high-res portrait link, and a free trial of Chronicled.
                  </p>
                  <div style={{display:"flex",gap:10,maxWidth:420,margin:"0 auto"}}>
                    <input
                      className="cm-input"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{fontSize:16,padding:"10px 15px"}}
                    />
                    <button className="cm-btn-gold" style={{padding:"10px 24px",fontSize:11,whiteSpace:"nowrap"}} onClick={handleSaveEmail}>
                      Save Free
                    </button>
                  </div>
                </>
              ) : (
                <p style={{fontStyle:"italic",fontSize:16,color:"#D4B86A"}}>✓ Saved! Check your inbox shortly for your full portrait package.</p>
              )}
            </div>

            <div style={{background:"rgba(212,184,106,.04)",border:"1px solid rgba(191,160,90,.22)",padding:"34px 38px",textAlign:"center",marginBottom:28,borderRadius:6}}>
              <p className="cm-caps" style={{fontSize:12,color:"#BFA05A",marginBottom:14}}>Want the full story?</p>
              <p style={{fontStyle:"italic",fontSize:20,color:"#F0DCA8",lineHeight:1.65,marginBottom:10}}>
                Turn your real life into a <span style={{color:"#D4B86A"}}>full literary memoir</span> — 10,000 words, a bespoke portrait, and a hardcover book.
              </p>
              <p style={{fontStyle:"italic",fontSize:16,color:"rgba(240,220,168,.55)",marginBottom:28}}>
                Chronicled interviews you and writes your life in the voice of {selected.title}.
              </p>
              <Link href={ctaHref} className="cm-btn-gold">Begin Your Chronicle — $14.99 →</Link>
            </div>

            <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
              <button className="cm-btn-gold" onClick={handleShare}>{shareMsg || "🎁 Put a Friend in this Novel"}</button>
              <button className="cm-btn-ghost" onClick={() => drawShareCard(name, selected.roman, selected.title, selected.author, roastText, selected.color)}>
                Download Card
              </button>
              <button className="cm-btn-ghost" onClick={handleReset}>Try Another</button>
            </div>
          </div>
        )}

        {/* ── FOOTER ── */}
        <footer style={{borderTop:"1px solid rgba(191,160,90,.12)",padding:"32px 24px",textAlign:"center"}}>
          <p className="cm-caps" style={{fontSize:12,color:"rgba(191,160,90,.45)",marginBottom:10}}>Chronicled — ClassicMe</p>
          <p style={{fontStyle:"italic",fontSize:15,color:"rgba(240,220,168,.4)"}}>
            A playful taste of your literary life.{" "}
            <Link href="/" style={{color:"rgba(191,160,90,.6)",textDecoration:"none"}}>Explore the full experience →</Link>
          </p>
        </footer>
      </div>
    </>
  );
}

