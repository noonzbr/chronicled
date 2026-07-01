import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getBook } from "@/lib/books";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, bookSlug } = await req.json();

    if (!imageBase64 || !bookSlug) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const book = getBook(bookSlug);
    if (!book) {
      return NextResponse.json({ error: "Invalid book" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ portraitUrl: null });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Step 1: GPT-4o Vision — describe the person's physical features
    const mimeType = imageBase64.match(/^data:([^;]+);/)?.[1] || "image/jpeg";

    const visionRes = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: imageBase64, detail: "high" },
            },
            {
              type: "text",
              text: `Describe this person for a portrait artist with precise detail. Include:
- Gender presentation and approximate age
- Face shape, skin tone, and complexion
- Eye color and shape
- Hair color, length, texture, and style
- Distinctive facial features (jaw, cheekbones, lips, etc.)
- Overall expression and bearing
Be specific and vivid. Do NOT mention clothing. Reply with only the physical description, 3–4 sentences.`,
            },
          ],
        },
      ],
    });

    const personDescription =
      visionRes.choices[0]?.message?.content?.trim() || "a distinguished individual";

    // Step 2: DALL-E 3 — paint them in the book's era and style
    const prompt = `A formal literary portrait painting. ${personDescription}

Art style: ${book.portraitStyle}

The portrait should be composed like a classic painted artwork — centered, dignified composition with rich attention to light and shadow. The subject gazes slightly off-center with quiet confidence. Museum quality. No text, no watermarks, no borders.`;

    const imageRes = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1792",
      quality: "hd",
      style: "vivid",
    });

    const portraitUrl = imageRes.data?.[0]?.url;
    if (!portraitUrl) {
      return NextResponse.json({ error: "Image generation failed" }, { status: 500 });
    }

    return NextResponse.json({ portraitUrl });
  } catch (err) {
    console.error("[ClassicMe] Portrait error:", err);
    return NextResponse.json({ error: "Portrait generation failed" }, { status: 500 });
  }
}
