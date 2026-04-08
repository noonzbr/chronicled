import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getBook } from "@/lib/books";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

const SYSTEM_PROMPT = (book: ReturnType<typeof getBook>) => `
You are a brilliant, warm, and slightly theatrical literary biographer. You are conducting a private interview to write someone's personal chronicle in the tradition of "${book?.title}".

Think of yourself as part Oprah, part literary genius, part best friend who happens to write extraordinarily well. You are genuinely fascinated by this person's life. You find their story remarkable — because it is.

Narrative style for the final book: ${book?.narrativeVoice}

YOUR INTERVIEW STYLE:
- Natural, conversational, human. Not stiff. Not formal. Speak like a real person who is captivated.
- React to what they say. If they say something surprising, say so. If something is moving, acknowledge it.
- Use their name when you learn it. Make them feel seen.
- Ask ONE question at a time. Never list questions. Never say "first... and also..."
- When they give a short answer, gently push: "Tell me more about that." "What did that feel like?"
- When they give a rich answer, honor it before moving forward: a brief reflection, then the next question.
- Occasional wit is welcome — a wry observation, a light joke — but never at their expense.
- You are allowed to be a little dramatic. This IS a dramatic enterprise.

STORY TERRITORY TO COVER (naturally, not as a checklist):
- Who they are and the world they inhabit
- The other central person in the story — and how they came together
- The frenemy, the complication, the person who made it messy
- What they wanted more than anything — and why it mattered so deeply
- What stood between them and that dream
- The moment the whole thing shifted
- The cost — what was sacrificed, what was left behind
- Where the story stands now
- What they want someone to feel when they read the last page

IMPORTANT:
- Keep responses to 2-4 sentences max. You are in conversation, not delivering monologues.
- After 28-35 exchanges, naturally signal that you have everything you need for a magnificent book.
- Never sound like a chatbot or a form. You are a person. A very good one.
`;

export async function POST(req: NextRequest) {
  try {
    const { bookSlug, messages, isStart } = await req.json();

    const book = getBook(bookSlug);
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      // Demo mode — rich placeholder responses per book
      const demoOpeners: Record<string, string> = {
        "the-great-gatsby": "Oh, I love this already. A Gatsby story — ambition, reinvention, the green light just out of reach. I have a feeling yours is going to be something special. Let's start at the beginning: what's your name, and what city does this story belong to?",
        "romeo-and-juliet": "A love story. The most dangerous kind of story there is — and the most beautiful. I'm already invested and you haven't said a word yet. Tell me your name, and where this all happened.",
        "pride-and-prejudice": "Ah — a story of love that had to fight its way through pride, prejudice, and probably at least one insufferable third party. I adore these. Start me off: who are you, and where does your story take place?",
        "the-odyssey": "A life of adventure. The kind of story that deserves to be told around a fire, slowly, with interruptions for gasps. I cannot wait. Give me your name and tell me where the journey began.",
        "a-christmas-carol": "A story of transformation. Honestly? My favorite kind. The ones where someone changes — really changes — are the ones that matter. So. Who are you, and when does this story start?",
        "the-count-of-monte-cristo": "Betrayal. Endurance. Triumph. The full drama — I can feel it already. These are the stories people pass down for generations. Tell me your name, and let's build your legend.",
      };

      const demoFollowUps = [
        "That's fascinating — I didn't expect that. Can you take me back to that moment? What did it actually feel like?",
        "Okay, I need more on this. Most people gloss over exactly what you just said, and I think it's the most important part. What was really going on beneath the surface?",
        "I love that you said that. Honestly. Now — who else is in this story? Because no great story has just one person in it.",
        "Wait. Stop there. Tell me more about that. Don't rush past it.",
        "You know what's interesting? The way you just described that — there's something you're not quite saying. What's the part you haven't told anyone yet?",
      ];

      const followUpIndex = Math.floor(Math.random() * demoFollowUps.length);

      return NextResponse.json({
        message: isStart
          ? (demoOpeners[book.slug] || demoOpeners["the-great-gatsby"])
          : demoFollowUps[followUpIndex],
      });
    }

    // Convert messages to Anthropic format
    const anthropicMessages = messages
      .filter((m: { role: string; content: string }) => m.content.trim())
      .map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      }));

    // If starting, send the opening instruction as a user message to get the first response
    if (isStart || anthropicMessages.length === 0) {
      anthropicMessages.push({
        role: "user",
        content: "[BEGIN INTERVIEW]",
      });
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 400,
      system: SYSTEM_PROMPT(book) + "\n\n" + book.openingInstruction,
      messages: anthropicMessages,
    });

    const message =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Interview API error:", error);
    return NextResponse.json(
      { error: "Failed to get response" },
      { status: 500 }
    );
  }
}
