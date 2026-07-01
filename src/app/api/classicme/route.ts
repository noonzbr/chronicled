import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const PROMPTS: Record<string, string> = {
  pride: `Write a witty, satirical 3-paragraph passage in Jane Austen's narrative voice about a person named {name}.
Use Austen's signature irony, social observation, and warm amusement — but apply it entirely to modern life: smartphones, group chats, dating apps, workplace emails, LinkedIn.
Write in third person, as a narrator warmly observing {name}'s particular genius and foibles.
Each paragraph should land a distinct, quotable observation. Light, clever, absolutely shareable. About 200 words.`,

  moby: `Write a humorous 3-paragraph passage in Herman Melville's voice about a person named {name}.
Open the very first sentence with "Call me {name}."
Use Melville's epic, philosophical, slightly overwrought style — but apply it to aggressively mundane modern situations: the commute, the quarterly review, the email thread that should have been a Slack message.
The white whale is something hilariously ordinary. Keep the grandiose tone; make the subject absurd. About 200 words.`,

  gatsby: `Write a 3-paragraph satirical passage in F. Scott Fitzgerald's narrator voice about a person named {name}.
The unnamed narrator watches {name} from a respectful distance, with admiration and faint wistfulness. Apply Jazz Age glamour and the green-light symbolism to modern equivalents: a LinkedIn profile, a weekend brunch, same-day delivery, a wellness routine.
Romantic and gently roasting at once. Lush sentences. About 200 words.`,

  sherlock: `Write a 3-paragraph humorous passage narrated by Watson about a Sherlock Holmes investigation concerning a person named {name}.
Holmes deduces mundane things about {name}'s modern life from tiny clues — their notification badges, coffee order, Slack status, AirPods usage.
Use Watson's admiring narration and Holmes's pompous certainty. The deductions are hilariously accurate about completely ordinary modern habits. About 200 words.`,
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

    const text =
      message.content[0].type === "text" ? message.content[0].text.trim() : "";

    return NextResponse.json({ text });
  } catch (err) {
    console.error("[ClassicMe] Generation error:", err);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
