import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "" });

export async function POST(req: NextRequest) {
  try {
    const { category, tone, password } = await req.json();

    const expectedPassword = process.env.ADMIN_PASSWORD || "chronicled2026";
    if (password !== expectedPassword) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const systemPrompt = `You are a master biographer and creative director. You write viral, highly engaging, thought-provoking writing prompts for people to reflect on their lives, memories, and family histories.
Your goal is to get people to think about their personal story and realize it's worth turning into a printed or digital memoir.

Your writing style is heavily optimized for TikTok hooks and X/Twitter virality (SuperX/Tweet Hunter style):
- Every prompt must start with a short, scroll-stopping question or hook.
- Write in short, single-sentence paragraphs.
- Keep the tone emotional, deep, slightly dramatic, and literary.
- Return your output as a clean JSON array of exactly 5 prompts.
- Do not output any markdown or explanation, return ONLY the raw JSON array.

JSON Format:
[
  {
    "id": 1,
    "hook": "First scroll-stopping line",
    "body": "Secondary sentence expanding the theme",
    "takeaway": "Bookmarkable summary sentence"
  }
]`;

    const userPrompt = `Generate exactly 5 viral writing prompts about:
Category: "${category}" (e.g., Childhood, Travel, Love, Lessons)
Literary Tone: "${tone}" (e.g., Epic, Romantic, Witty, Reflective)

Ensure the output is a valid JSON array matching the requested schema. Return nothing else.`;

    const message = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const responseText = message.content[0].type === "text" ? message.content[0].text.trim() : "";
    
    // Clean JSON response (in case Claude wraps in markdown code blocks)
    const jsonString = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const prompts = JSON.parse(jsonString);

    return NextResponse.json({ success: true, prompts });
  } catch (err: any) {
    console.error("Error generating prompts:", err);
    return NextResponse.json({ error: err.message || "Failed to generate prompts" }, { status: 500 });
  }
}
