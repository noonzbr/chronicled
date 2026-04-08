import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServerClient } from "@supabase/ssr";
import { getBook } from "@/lib/books";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "" });

function parseBookContent(raw: string) {
  const chapters: Record<string, { title: string; body: string }> = {};

  const chapterRegex = /===CHAPTER_([IVX]+|EPILOGUE)===([\s\S]*?)(?====CHAPTER_|$)/gi;
  let match;

  while ((match = chapterRegex.exec(raw)) !== null) {
    const key = match[1].toUpperCase();
    const content = match[2].trim();
    const lines = content.split("\n");
    const title = lines[0]?.trim() || `Chapter ${key}`;
    const body = lines.slice(1).join("\n").trim();
    chapters[key] = { title, body };
  }

  return chapters;
}

function buildBookPrompt(
  book: ReturnType<typeof getBook>,
  transcript: string,
  subjectName: string
) {
  return `
You are a master literary author. Using the interview transcript below, write a full-length personal chronicle
in the tradition and voice of "${book?.title}" for ${subjectName}.

Narrative style: ${book?.narrativeVoice}

CRITICAL REQUIREMENTS:
- Write exactly 6 numbered chapters + an epilogue
- Each chapter: 1,800–2,500 words. Do NOT cut short. Write fully and richly.
- Total target: 12,000–16,000 words
- Use the real names, places, and events from the transcript
- Blend literary style with real events — the events are real, the treatment is your art
- Include: chapter epigraphs from the source novel, scene breaks (✦ ✦ ✦), pull quotes
- Tone: intelligent, warm, lightly satirical, occasionally witty — never flat or clinical
- This book will be held in someone's hands. Write accordingly.

CHAPTER STRUCTURE:
Chapter I   — Origins (the protagonist, their world, who they are)
Chapter II  — The Other Person (the central relationship introduced)
Chapter III — The Complication (frenemy, obstacles, forces at work)
Chapter IV  — The Distance or The Trial (what stood in the way)
Chapter V   — The Turning Point (when everything changed)
Chapter VI  — The Resolution (how it ended or where it stands)
Epilogue    — What Remains (meaning, legacy, hope)

FORMAT YOUR RESPONSE EXACTLY LIKE THIS — do not deviate:
===CHAPTER_I===
[Chapter Title]
[Full chapter body — 1,800-2,500 words]
===CHAPTER_II===
[Chapter Title]
[Full chapter body]
===CHAPTER_III===
[Chapter Title]
[Full chapter body]
===CHAPTER_IV===
[Chapter Title]
[Full chapter body]
===CHAPTER_V===
[Chapter Title]
[Full chapter body]
===CHAPTER_VI===
[Chapter Title]
[Full chapter body]
===CHAPTER_EPILOGUE===
[Epilogue Title]
[Full epilogue — 600-900 words]

INTERVIEW TRANSCRIPT:
${transcript}
  `.trim();
}

export async function POST(req: NextRequest) {
  try {
    const { bookSlug, sessionId } = await req.json();

    const book = getBook(bookSlug);
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 400 });
    }

    // Demo mode
    if (!process.env.ANTHROPIC_API_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      await new Promise((r) => setTimeout(r, 3000));
      return NextResponse.json({ success: true, sessionId });
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } }
    );

    // Fetch transcript
    const { data: msgs } = await supabase
      .from("messages")
      .select("role, content, position")
      .eq("session_id", sessionId)
      .order("position", { ascending: true });

    if (!msgs || msgs.length === 0) {
      return NextResponse.json({ error: "No interview found." }, { status: 400 });
    }

    // Get subject name from first user message
    const firstUserMsg = msgs.find((m) => m.role === "user");
    const subjectName = firstUserMsg?.content?.split(/[\s,\.]/)[0] || "the subject";

    const transcript = msgs
      .map((m) => `${m.role === "user" ? "SUBJECT" : "CHRONICLER"}: ${m.content}`)
      .join("\n\n");

    // Generate book
    const response = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 16000,
      messages: [{ role: "user", content: buildBookPrompt(book, transcript, subjectName) }],
    });

    const rawText =
      response.content[0].type === "text" ? response.content[0].text : "";

    const chapters = parseBookContent(rawText);
    const wordCount = rawText.split(/\s+/).length;

    // Save to database
    await supabase.from("books").upsert({
      session_id: sessionId,
      title: `The Chronicle of ${subjectName}`,
      chapter_1_title: chapters["I"]?.title,   chapter_1_body: chapters["I"]?.body,
      chapter_2_title: chapters["II"]?.title,  chapter_2_body: chapters["II"]?.body,
      chapter_3_title: chapters["III"]?.title, chapter_3_body: chapters["III"]?.body,
      chapter_4_title: chapters["IV"]?.title,  chapter_4_body: chapters["IV"]?.body,
      chapter_5_title: chapters["V"]?.title,   chapter_5_body: chapters["V"]?.body,
      chapter_6_title: chapters["VI"]?.title,  chapter_6_body: chapters["VI"]?.body,
      epilogue_title:  chapters["EPILOGUE"]?.title,
      epilogue_body:   chapters["EPILOGUE"]?.body,
      word_count: wordCount,
    });

    await supabase
      .from("sessions")
      .update({ status: "preview" })
      .eq("id", sessionId);

    return NextResponse.json({ success: true, sessionId, wordCount });

  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
