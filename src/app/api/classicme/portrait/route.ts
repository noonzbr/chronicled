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

    // Step 1: GPT-4o Vision — describe the person's core facial features ONLY, ignoring their modern hair/makeup/clothes
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
              text: `Identify and describe ONLY the core facial structures of this person (face shape, eyes, nose, mouth shape, skin tone, eyebrows). Do NOT describe their clothes, hair, or modern makeup. Reply with only these facial traits in 2 sentences.`,
            },
          ],
        },
      ],
    });

    const personDescription =
      visionRes.choices[0]?.message?.content?.trim() || "a distinguished individual";

    // Step 2: DALL-E 3 — perform a full theatrical transformation: hair, historical clothing, makeup, and setting
    const prompt = `A highly stylized, fun, and dramatic theatrical character portrait painting. 
Integrating a person with: ${personDescription} 

Fully transformed into a character from the novel "${book.title}" in the art style of "${book.portraitStyle}".
Completely replace their modern style with:
- Dramatic period-accurate costume, historical outfits, elaborate high-collared dress, or aristocratic coat.
- Historical period-accurate hairstyle, wigs, curls, or hats suited to the era of the book.
- Theatrical, stylized period makeup (e.g. powder, rosy cheeks, or dramatic expressions).
- Fun, playful, and expressive posture (gazing dramatically, holding a monocle, a letter, or a feather quill).
- Set in a historical room, library, grand ballroom, or dramatic landscape matching the novel.
Make it look like a gorgeous, funny caricature oil painting, blending the user's face structure into a historical character. Museum quality. No text, no watermarks, no borders.`;

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
