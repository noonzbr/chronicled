import { getBook } from "@/lib/books";

type BookRecord = {
  title: string;
  chapter_1_title: string; chapter_1_body: string;
  chapter_2_title: string; chapter_2_body: string;
  chapter_3_title: string; chapter_3_body: string;
  chapter_4_title: string; chapter_4_body: string;
  chapter_5_title: string; chapter_5_body: string;
  chapter_6_title: string; chapter_6_body: string;
  epilogue_title:  string; epilogue_body:  string;
  word_count: number;
};

type PortraitRecord = {
  image_url: string;
} | null;

function escapedBody(text: string): string {
  // Wrap paragraphs in <p> tags, handle section breaks
  const paragraphs = text.split(/\n\n+/);
  return paragraphs
    .map((p) => {
      const trimmed = p.trim();
      if (!trimmed) return "";
      if (trimmed === "✦ ✦ ✦" || trimmed === "* * *") {
        return `<div class="section-break">✦ &nbsp;&nbsp; ✦ &nbsp;&nbsp; ✦</div>`;
      }
      return `<p>${trimmed.replace(/\n/g, " ")}</p>`;
    })
    .filter(Boolean)
    .join("\n");
}

function chapterPage(
  num: string,
  label: string,
  title: string,
  body: string,
  pageNum: number,
  runningTitle: string,
  epigraph?: string,
  epigraphAttr?: string
): string {
  return `
  <div class="page">
    <div class="running-header">${runningTitle}</div>
    <div class="chapter-header">
      <p class="chapter-number">${label}</p>
      <h2 class="chapter-title">${title || `Chapter ${num}`}</h2>
      <div class="chapter-rule"></div>
      ${epigraph ? `
      <p class="chapter-epigraph">
        "${epigraph}"
        <span class="chapter-epigraph-attr">— ${epigraphAttr}</span>
      </p>` : ""}
    </div>
    <div class="chapter-body">
      ${escapedBody(body)}
    </div>
    <div class="page-number">${pageNum}</div>
    <div class="page-brand">Chronicled</div>
  </div>`;
}

export function generateBookHtml(book: BookRecord, bookSlug: string, portrait?: PortraitRecord): string {
  const archetype = getBook(bookSlug);
  const runningTitle = `${book.title} &nbsp;·&nbsp; ${archetype?.title || ""} Chronicle`;

  // Epigraphs per archetype
  const epigraphs: Record<string, { lines: Array<{ quote: string; attr: string }> }> = {
    "the-great-gatsby": {
      lines: [
        { quote: "Her voice was full of money.", attr: "F. Scott Fitzgerald, The Great Gatsby" },
        { quote: "So we beat on, boats against the current,<br/>borne back ceaselessly into the past.", attr: "F. Scott Fitzgerald, The Great Gatsby" },
        { quote: "I was within and without, simultaneously enchanted and repelled by the inexhaustible variety of life.", attr: "F. Scott Fitzgerald, The Great Gatsby" },
        { quote: "Can't repeat the past? Why of course you can!", attr: "F. Scott Fitzgerald, The Great Gatsby" },
        { quote: "And so with the sunshine and the great bursts of leaves growing on the trees...", attr: "F. Scott Fitzgerald, The Great Gatsby" },
        { quote: "They were careless people... they smashed up things and creatures and then retreated back into their money.", attr: "F. Scott Fitzgerald, The Great Gatsby" },
      ],
    },
    "pride-and-prejudice": {
      lines: [
        { quote: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.", attr: "Jane Austen, Pride & Prejudice" },
        { quote: "I declare after all there is no enjoyment like reading!", attr: "Jane Austen, Pride & Prejudice" },
        { quote: "A lady's imagination is very rapid; it jumps from admiration to love, from love to matrimony in a moment.", attr: "Jane Austen, Pride & Prejudice" },
        { quote: "You must allow me to tell you how ardently I admire and love you.", attr: "Jane Austen, Pride & Prejudice" },
        { quote: "Till this moment I never knew myself.", attr: "Jane Austen, Pride & Prejudice" },
        { quote: "I am the happiest creature in the world.", attr: "Jane Austen, Pride & Prejudice" },
      ],
    },
    "romeo-and-juliet": {
      lines: [
        { quote: "What's in a name? That which we call a rose by any other name would smell as sweet.", attr: "William Shakespeare, Romeo & Juliet" },
        { quote: "My bounty is as boundless as the sea, my love as deep.", attr: "William Shakespeare, Romeo & Juliet" },
        { quote: "These violent delights have violent ends.", attr: "William Shakespeare, Romeo & Juliet" },
        { quote: "Good night, good night! Parting is such sweet sorrow.", attr: "William Shakespeare, Romeo & Juliet" },
        { quote: "Love is a smoke raised with the fume of sighs.", attr: "William Shakespeare, Romeo & Juliet" },
        { quote: "For never was a story of more woe than this.", attr: "William Shakespeare, Romeo & Juliet" },
      ],
    },
    "the-odyssey": {
      lines: [
        { quote: "Tell me, O Muse, of that ingenious hero who travelled far and wide.", attr: "Homer, The Odyssey" },
        { quote: "Of all creatures that breathe and move upon the earth, nothing is bred that is weaker than man.", attr: "Homer, The Odyssey" },
        { quote: "Be strong, saith my heart; I am a soldier; I have seen worse sights than this.", attr: "Homer, The Odyssey" },
        { quote: "There is a time for many words, and there is also a time for sleep.", attr: "Homer, The Odyssey" },
        { quote: "The journey is the thing.", attr: "Homer, The Odyssey" },
        { quote: "Even his griefs are a joy long after to one that remembers all that he wrought and endured.", attr: "Homer, The Odyssey" },
      ],
    },
    "a-christmas-carol": {
      lines: [
        { quote: "I will honour Christmas in my heart, and try to keep it all the year.", attr: "Charles Dickens, A Christmas Carol" },
        { quote: "No space of regret can make amends for one life's opportunity misused.", attr: "Charles Dickens, A Christmas Carol" },
        { quote: "It is required of every man, that the spirit within him should walk abroad among his fellow-men.", attr: "Charles Dickens, A Christmas Carol" },
        { quote: "There is nothing in the world so irresistibly contagious as laughter and good humour.", attr: "Charles Dickens, A Christmas Carol" },
        { quote: "He was not the kind of man who could bring himself to say 'I was wrong.'", attr: "Charles Dickens, A Christmas Carol" },
        { quote: "God bless us, every one!", attr: "Charles Dickens, A Christmas Carol" },
      ],
    },
    "the-count-of-monte-cristo": {
      lines: [
        { quote: "All human wisdom is summed up in two words: wait and hope.", attr: "Alexandre Dumas, The Count of Monte Cristo" },
        { quote: "There is neither happiness nor misery in the world; there is only the comparison of one state with another.", attr: "Alexandre Dumas, The Count of Monte Cristo" },
        { quote: "Life is a storm, my young friend. You will bask in the sunlight one moment, be shattered on the rocks the next.", attr: "Alexandre Dumas, The Count of Monte Cristo" },
        { quote: "How did I escape? With difficulty. How did I plan this moment? With pleasure.", attr: "Alexandre Dumas, The Count of Monte Cristo" },
        { quote: "The difference between treason and patriotism is only a matter of dates.", attr: "Alexandre Dumas, The Count of Monte Cristo" },
        { quote: "Until the day God will deign to reveal the future to man, all human wisdom is contained in these two words: Wait and Hope.", attr: "Alexandre Dumas, The Count of Monte Cristo" },
      ],
    },
  };

  const eq = epigraphs[bookSlug]?.lines || [];

  const chapters = [
    { num: "I",   label: "Chapter I",   title: book.chapter_1_title, body: book.chapter_1_body, page: 7,  ep: eq[0] },
    { num: "II",  label: "Chapter II",  title: book.chapter_2_title, body: book.chapter_2_body, page: 19, ep: eq[1] },
    { num: "III", label: "Chapter III", title: book.chapter_3_title, body: book.chapter_3_body, page: 33, ep: eq[2] },
    { num: "IV",  label: "Chapter IV",  title: book.chapter_4_title, body: book.chapter_4_body, page: 51, ep: eq[3] },
    { num: "V",   label: "Chapter V",   title: book.chapter_5_title, body: book.chapter_5_body, page: 71, ep: eq[4] },
    { num: "VI",  label: "Chapter VI",  title: book.chapter_6_title, body: book.chapter_6_body, page: 87, ep: eq[5] },
  ];

  const tocEntries = [
    ...chapters.map((c) => `
      <div class="toc-entry">
        <span class="toc-chapter">${c.label}</span>
        <span class="toc-name">${c.title || `Chapter ${c.num}`}</span>
        <span class="toc-page">${c.page}</span>
      </div>`),
    `<div class="toc-entry" style="border-bottom:none;">
        <span class="toc-chapter">Epilogue</span>
        <span class="toc-name">${book.epilogue_title || "Epilogue"}</span>
        <span class="toc-page">105</span>
      </div>`,
  ].join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${book.title}</title>
  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Cinzel:wght@400;600&family=Cinzel+Decorative:wght@400&display=swap" rel="stylesheet"/>
  <style>
    :root {
      --ink:         #0D1117;
      --cream:       #F0DCA8;
      --parchment:   #E8D49A;
      --dark-brown:  #2C1A0E;
      --mid-brown:   #5C3D2E;
      --gold:        #BFA05A;  /* decorative: rules, borders, lines */
      --gold-light:  #D4B86A;
      --gold-faint:  rgba(191,160,90,0.22);
      --gold-print:  #7A5218;  /* readable text on cream — darker antique gold */
    }
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background:var(--ink); font-family:'EB Garamond',Georgia,serif; color:var(--dark-brown); }
    .book-wrapper { max-width:780px; margin:40px auto; background:var(--cream); box-shadow:0 0 100px rgba(0,0,0,0.9); }

    /* ── DARK PAGES ── */
    .title-page, .portrait-page, .back-page {
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      text-align:center; min-height:1050px; background:var(--ink);
      padding:100px 80px; position:relative; page-break-after:always;
    }
    .title-page::before, .portrait-page::before, .back-page::before {
      content:''; position:absolute; inset:28px; border:1px solid rgba(191,160,90,0.3); pointer-events:none;
    }
    .title-page::after { content:''; position:absolute; inset:35px; border:0.5px solid rgba(191,160,90,0.12); pointer-events:none; }

    /* ── CREAM PAGES ── */
    .center-page { display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; min-height:1050px; padding:100px 80px; background:var(--cream); page-break-after:always; }
    .page { background:var(--cream); padding:90px 95px 80px 105px; position:relative; page-break-after:always; border-bottom:1px solid var(--parchment); }
    .page::before { content:''; position:absolute; inset:0; background-image:radial-gradient(ellipse at 15% 15%, rgba(191,160,90,0.06) 0%, transparent 55%); pointer-events:none; }
    .page::after { content:''; position:absolute; top:60px; bottom:60px; left:65px; width:1px; background:linear-gradient(to bottom, transparent, var(--gold-faint) 15%, var(--gold-faint) 85%, transparent); }

    /* ── TYPOGRAPHY — DARK PAGES ── */
    .brand-top { font-family:'Cinzel',serif; font-size:10px; letter-spacing:8px; color:var(--gold); margin-bottom:70px; text-transform:uppercase; }
    .title-ornament { color:var(--gold); font-size:20px; letter-spacing:14px; margin-bottom:28px; }
    .book-title { font-family:'Cinzel Decorative',serif; font-size:46px; font-weight:400; color:var(--cream); line-height:1.15; margin-bottom:22px; }
    .book-rule { width:180px; height:1px; background:linear-gradient(to right, transparent, var(--gold), transparent); margin:20px auto; }
    .book-subtitle { font-family:'Cinzel',serif; font-size:13px; letter-spacing:5px; color:var(--gold); }
    .book-tagline { font-family:'EB Garamond',serif; font-style:italic; font-size:15.5px; color:rgba(240,220,168,0.7); line-height:1.8; max-width:360px; margin:0 auto 60px; }
    .gatsby-label { font-family:'Cinzel',serif; font-size:10px; letter-spacing:5px; color:var(--gold-light); text-transform:uppercase; }
    .dedication-text { font-family:'EB Garamond',serif; font-style:italic; font-size:17.5px; color:var(--mid-brown); line-height:2.1; max-width:340px; }

    /* ── TYPOGRAPHY — CREAM PAGES (use --gold-print for text contrast) ── */
    .toc-title { font-family:'Cinzel',serif; font-size:13px; letter-spacing:6px; color:var(--gold-print); text-align:center; margin-bottom:50px; }
    .toc-entry { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:18px; padding-bottom:18px; border-bottom:1px dotted rgba(122,82,24,0.3); }
    .toc-chapter { font-family:'Cinzel',serif; font-size:10px; letter-spacing:3px; color:var(--gold-print); min-width:90px; }
    .toc-name { font-family:'EB Garamond',serif; font-style:italic; font-size:15px; color:var(--dark-brown); flex:1; padding:0 16px; }
    .toc-page { font-family:'Cinzel',serif; font-size:10px; color:var(--gold-print); min-width:30px; text-align:right; }

    .running-header { font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:4px; color:var(--gold-print); text-align:center; margin-bottom:40px; text-transform:uppercase; }
    .chapter-header { text-align:center; margin-bottom:44px; padding-top:16px; }
    .chapter-number { font-family:'Cinzel',serif; font-size:10px; letter-spacing:7px; color:var(--gold-print); text-transform:uppercase; margin-bottom:14px; }
    .chapter-title { font-family:'Cinzel Decorative',serif; font-size:26px; font-weight:400; color:var(--dark-brown); line-height:1.25; margin-bottom:20px; }
    .chapter-epigraph { font-family:'EB Garamond',serif; font-style:italic; font-size:14.5px; color:var(--mid-brown); max-width:340px; margin:18px auto 0; line-height:1.7; }
    .chapter-epigraph-attr { font-family:'Cinzel',serif; font-size:9px; letter-spacing:3px; color:var(--gold-print); margin-top:8px; display:block; }
    .chapter-rule { width:100px; height:1px; background:linear-gradient(to right, transparent, var(--gold), transparent); margin:0 auto; }

    .chapter-body p { font-size:15.5px; line-height:2; color:var(--dark-brown); text-align:justify; margin-bottom:0; hyphens:auto; }
    .chapter-body p+p { text-indent:2.2em; }
    .chapter-body p:first-child { text-indent:0; }
    .chapter-body p:first-child::first-letter { font-family:'Cinzel Decorative',serif; font-size:4.4em; font-weight:400; float:left; line-height:0.72; margin-right:7px; margin-top:8px; color:var(--gold-print); }

    .section-break { text-align:center; color:var(--gold-print); font-size:16px; letter-spacing:16px; margin:44px 0; }
    .pull-quote { border-left:2px solid var(--gold-print); margin:36px 24px; padding:14px 28px; background:rgba(122,82,24,0.06); }
    .pull-quote p { font-family:'EB Garamond',serif; font-style:italic; font-size:17px !important; color:var(--mid-brown) !important; line-height:1.8 !important; text-indent:0 !important; text-align:left !important; }

    .page-number { position:absolute; bottom:34px; left:0; right:0; text-align:center; font-family:'EB Garamond',serif; font-style:italic; font-size:12px; color:var(--gold-print); }
    .page-brand { position:absolute; bottom:22px; left:105px; font-family:'Cinzel',serif; font-size:7px; letter-spacing:3px; color:var(--gold-print); opacity:0.55; text-transform:uppercase; }
    .end-mark { text-align:center; margin-top:52px; padding-bottom:20px; }
    .end-rule { width:140px; height:1px; background:linear-gradient(to right, transparent, var(--gold), transparent); margin:0 auto 18px; }
    .end-text { font-family:'Cinzel',serif; font-size:10px; letter-spacing:6px; color:var(--gold-print); }

    /* Portrait */
    .portrait-frame { width:360px; height:440px; border:3px solid var(--gold); display:flex; align-items:center; justify-content:center; position:relative; background:rgba(255,255,255,0.02); margin-bottom:36px; }
    .portrait-frame::before { content:''; position:absolute; inset:8px; border:1px solid rgba(191,160,90,0.35); }
    .portrait-placeholder { font-family:'Cinzel',serif; font-size:10px; letter-spacing:3px; color:rgba(191,160,90,0.45); text-align:center; line-height:2; padding:20px; }
    .portrait-name { font-family:'Cinzel Decorative',serif; font-size:22px; color:var(--gold-light); margin-bottom:10px; }
    .portrait-caption { font-family:'EB Garamond',serif; font-style:italic; font-size:13px; color:var(--cream); opacity:0.5; letter-spacing:1px; }

    /* Back */
    .back-brand { font-family:'Cinzel Decorative',serif; font-size:30px; color:var(--gold-light); letter-spacing:3px; margin-bottom:16px; }
    .back-tagline { font-family:'EB Garamond',serif; font-style:italic; font-size:16px; color:var(--cream); margin-bottom:40px; opacity:0.75; }
    .back-rule { width:80px; height:1px; background:linear-gradient(to right, transparent, var(--gold), transparent); margin:0 auto 40px; }
    .back-url { font-family:'Cinzel',serif; font-size:10px; letter-spacing:5px; color:var(--gold); }

    /* Print */
    .print-btn { position:fixed; bottom:30px; right:30px; background:var(--gold); color:var(--ink); border:none; padding:14px 28px; font-family:'Cinzel',serif; font-size:11px; letter-spacing:3px; cursor:pointer; box-shadow:0 4px 24px rgba(0,0,0,0.5); z-index:100; text-transform:uppercase; }
    .print-btn:hover { background:var(--gold-light); }
    @media print { body { background:none; } .book-wrapper { max-width:100%; margin:0; box-shadow:none; } .print-btn { display:none; } }
  </style>
</head>
<body>
<button class="print-btn" onclick="window.print()">SAVE AS PDF</button>
<div class="book-wrapper">

  <!-- TITLE PAGE -->
  <div class="title-page">
    <div class="brand-top">Chronicled &nbsp;·&nbsp; A Literary Chronicle</div>
    <div class="title-ornament">❧ &nbsp; ✦ &nbsp; ❧</div>
    <h1 class="book-title">${book.title}</h1>
    <div class="book-rule"></div>
    <p class="book-subtitle">A Personal Chronicle</p>
    <div class="book-rule"></div>
    <p class="book-tagline">A True Account of a Life Extraordinarily Lived</p>
    <div class="book-rule"></div>
    <p class="gatsby-label">A ${archetype?.title || ""} Chronicle</p>
  </div>

  <!-- COPYRIGHT PAGE -->
  <div class="center-page">
    <div style="text-align:left;max-width:380px;">
      <p style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:3px;color:var(--gold);margin-bottom:32px;">CHRONICLED PRESS</p>
      <p style="font-family:'EB Garamond',serif;font-size:13px;color:var(--mid-brown);line-height:1.9;margin-bottom:20px;font-style:italic;">
        This book was composed through the Chronicled literary interview process and rendered in the narrative tradition of ${archetype?.title || "great literature"}.
      </p>
      <p style="font-family:'EB Garamond',serif;font-size:13px;color:var(--mid-brown);line-height:1.9;margin-bottom:20px;font-style:italic;">
        All events depicted herein are drawn from real life. The names, places, and hearts are true. The literary flourishes are the author's gift.
      </p>
      <div class="book-rule" style="margin:28px 0;"></div>
      <p style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:2px;color:var(--gold);">First Edition</p>
      <p style="font-family:'EB Garamond',serif;font-size:12px;color:var(--mid-brown);font-style:italic;margin-top:6px;">getchronicled.com</p>
    </div>
  </div>

  <!-- TABLE OF CONTENTS -->
  <div class="page" style="min-height:1050px;">
    <div style="padding-top:60px;">
      <p class="toc-title">Contents</p>
      ${tocEntries}
    </div>
    <div class="page-number">5</div>
    <div class="page-brand">Chronicled</div>
  </div>

  <!-- CHAPTERS -->
  ${chapters.map((c) => chapterPage(c.num, c.label, c.title, c.body, c.page, runningTitle, c.ep?.quote, c.ep?.attr)).join("\n")}

  <!-- EPILOGUE -->
  <div class="page">
    <div class="running-header">${runningTitle}</div>
    <div class="section-break">✦ &nbsp;&nbsp; ✦ &nbsp;&nbsp; ✦</div>
    <div class="chapter-header">
      <p class="chapter-number">Epilogue</p>
      <h2 class="chapter-title">${book.epilogue_title || "What Remains"}</h2>
      <div class="chapter-rule"></div>
    </div>
    <div class="chapter-body">
      ${escapedBody(book.epilogue_body)}
    </div>
    <div class="end-mark">
      <div class="end-rule"></div>
      <p class="end-text">— End —</p>
    </div>
    <div class="page-number">105</div>
    <div class="page-brand">Chronicled</div>
  </div>

  <!-- ROYAL PORTRAIT -->
  <div class="portrait-page">
    <div class="portrait-frame">
      ${portrait?.image_url
        ? `<img src="${portrait.image_url}" alt="Royal Portrait" style="width:100%;height:100%;object-fit:cover;display:block;"/>`
        : `<div class="portrait-placeholder">
        ROYAL PORTRAIT<br/><br/>
        ${archetype?.portraitStyle || "Artistic Style"}<br/><br/>
        Generated from your photograph<br/>
        Hardcover Edition Only
      </div>`
      }
    </div>
    <p class="portrait-name">${book.title.replace("The Chronicle of ", "")}</p>
    <p class="portrait-caption">A ${archetype?.title || ""} Chronicle</p>
  </div>

  <!-- BACK PAGE -->
  <div class="back-page">
    <p class="back-brand">Chronicled</p>
    <p class="back-tagline">Your life. A legendary narrative.</p>
    <div class="back-rule"></div>
    <p style="font-family:'EB Garamond',serif;font-style:italic;font-size:14px;color:rgba(240,220,168,0.45);max-width:320px;line-height:1.9;margin-bottom:36px;">
      Choose your story. Answer our questions. Receive a book that will outlast everything except the life it was written about.
    </p>
    <div class="back-rule"></div>
    <p class="back-url">getchronicled.com</p>
  </div>

</div>
</body>
</html>`;
}
