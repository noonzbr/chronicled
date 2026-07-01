import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const PREFIX = `IMPORTANT: Write in plain prose only. Absolutely no markdown formatting. No # headers. No ** bold. No * italic markers. No bullet points. No numbered lists. Just beautiful paragraphs separated by blank lines.\n\n`;

const PROMPTS: Record<string, string> = {
  romeo: `${PREFIX}Write a 3-paragraph satirical passage in Shakespeare's romantic voice about a person named {name}.
Use Shakespearean drama and elevated language — but apply it entirely to modern life: texting, read receipts, dating apps, missed connections with bad timing.
The narrator is deeply moved. The tragedy involves something proportionally small (a thumbs-up emoji, conflicting brunch schedules).
Quotable, funny, genuinely touching at the end. About 200 words.`,

  pride: `${PREFIX}Write a witty, satirical 3-paragraph passage in Jane Austen's narrative voice about a person named {name}.
Use Austen's signature irony, social observation, and warm amusement — but apply it entirely to modern life: smartphones, group chats, dating apps, workplace emails, LinkedIn.
Write in third person, as a narrator warmly observing {name}'s particular genius and foibles.
Each paragraph should land a distinct, quotable observation. Light, clever, absolutely shareable. About 200 words.`,

  gatsby: `${PREFIX}Write a 3-paragraph satirical passage in F. Scott Fitzgerald's narrator voice about a person named {name}.
The unnamed narrator watches {name} from a respectful distance, with admiration and faint wistfulness. Apply Jazz Age glamour and the green-light symbolism to modern equivalents: a LinkedIn profile, a weekend brunch, same-day delivery, a wellness routine.
Romantic and gently roasting at once. Lush sentences. About 200 words.`,

  odyssey: `${PREFIX}Write a 3-paragraph satirical passage in Homer's epic Homeric style about a person named {name}.
Open with "Sing in me, Muse" energy. Apply grand epithets and epic invocations to a mundane modern journey — a commute, a series of flights, a complicated errand, a very long IKEA trip.
The obstacles are bureaucratic, not mythological. Keep the gravitas; make the subject absurd. Quotable and funny. About 200 words.`,

  carol: `${PREFIX}Write a 3-paragraph satirical passage in Charles Dickens' warm, moralistic voice about a person named {name}.
Use Dickens' slightly melodramatic, humanist style. {name} is observed by a narrator who has witnessed their transformation. Apply the ghost-of-Christmas-past arc to something contemporary and relatable.
Warm, funny, genuinely human at the end. At least one spectral visitor from {name}'s past. About 200 words.`,

  monte: `${PREFIX}Write a 3-paragraph satirical passage in Alexandre Dumas' theatrical, sweeping voice about a person named {name}.
Use Dumas' bold, grand-gesture style — but apply it to a modern workplace slight, social snub, or minor betrayal.
{name} endured, planned, and ultimately triumphed. The revenge is elegant and mild. The prose is impossibly dramatic about something proportionally smaller. About 200 words.`,

  jane: `${PREFIX}Write a 3-paragraph satirical passage in Charlotte Brontë's first-person voice, as if {name} themselves are narrating.
Use Jane Eyre's fiercely independent, morally grounded, intimate voice — applied to modern situations: a toxic job, a passive-aggressive email chain, an inbox full of things {name} will not be replying to.
Fierce, warm, a little funny. The narrator will not be managed. About 200 words.`,

  women: `${PREFIX}Write a 3-paragraph satirical passage in Louisa May Alcott's warm, wise, nostalgic voice about a person named {name}.
Use Alcott's family-centered, life-affirming style — but applied to modern family dynamics: group chats, holiday gatherings, sibling relationships, the particular chaos of people who love each other.
Tender and gently comic. The narrator loves {name} enormously and wants to record everything. About 200 words.`,

  heights: `${PREFIX}Write a 3-paragraph satirical passage in Emily Brontë's wild, gothic, elemental voice about a person named {name}.
Use Wuthering Heights' dramatic intensity — but apply it to something mundane: a strong opinion about something minor, a relationship that was a lot, a place they cannot stop returning to.
The passion is real; the subject slightly absurd. Dark, romantic, funny without trying to be. About 200 words.`,
};

export async function POST(req: NextRequest) {
  try {
    const { name, bookId } = await req.json();

    if (!name || !bookId || !PROMPTS[bookId]) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const client = new Anthropic();
    const prompt = PROMPTS[bookId].replace(/\{name\}/g, name);

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 600,
      messages: [{ role: "user", content: prompt }],
    });

    const raw =
      message.content[0].type === "text" ? message.content[0].text.trim() : "";

    // Strip markdown formatting Claude sometimes adds
    const text = raw
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/__(.*?)__/g, "$1")
      .replace(/_(.*?)_/g, "$1")
      .trim();

    return NextResponse.json({ text });
  } catch (err) {
    console.error("[ClassicMe] Generation error:", err);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
