import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
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

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ portraitUrl: null });
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    // Extract raw base64 data and mime type
    const match = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
    const mediaType = match ? match[1] : "image/jpeg";
    const base64Data = match ? match[2] : imageBase64;

    // Step 1: Analyze user's features using Claude 3.5 Sonnet Vision
    const visionMessage = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType as any,
                data: base64Data,
              },
            },
            {
              type: "text",
              text: "Analyze the uploaded photo. Describe ONLY the facial structure: eye shape/color, face shape, lips, nose, skin tone, eyebrows, and key identifiers. Do NOT describe modern hair, makeup, or modern clothing. Keep description to 2 concise sentences.",
            },
          ],
        },
      ],
    });

    const userFaceDescription =
      visionMessage.content[0].type === "text" ? visionMessage.content[0].text : "classical features";

    // Step 2: Use Claude 3.5 Sonnet to design a gorgeous, theatrical character SVG portrait card
    // representing the person fully transformed into the book's period with historical clothes/hair/expressions.
    const svgMessage = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: `Write raw XML code for a premium, stylized character SVG illustration representing a person with these facial structures: ${userFaceDescription}
          
          Fully dressed-up and transformed into a theatrical character from the classic novel: "${book.title}".
          
          Guidelines:
          - Art Style: Playful, premium vector portrait illustration matching the book's themes. Use a rich, vintage color palette.
          - Costume: Fully replace their modern style with historical clothing (e.g., high-collared Regency dresses, ruffled cravats, ornate coats, jewelry).
          - Hair: Period-accurate hair, elaborate curls, hats, or feathers matching "${book.title}"'s era.
          - Make it feel like an interactive, funny character card (like Elf Yourself) with custom props (like a quill, a scroll, roses, or a fancy letter).
          - Use beautiful gradients, textures, shadows, and paths. Keep it highly detailed.
          - The SVG must be responsive (viewBox="0 0 400 550").
          - Output ONLY valid SVG code. No markdown wrapper, no explanation, no backticks. Start directly with '<svg' and end with '</svg>'.`,
        },
      ],
    });

    let rawSvg = svgMessage.content[0].type === "text" ? svgMessage.content[0].text.trim() : "";
    
    // Strip markdown wrappers if Claude returned them despite instructions
    if (rawSvg.startsWith("```")) {
      rawSvg = rawSvg.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "");
    }

    // Convert SVG to data URI format so it fits in the same portraitUrl field
    const encodedSvg = encodeURIComponent(rawSvg)
      .replace(/'/g, "%27")
      .replace(/"/g, "%22");
    const portraitUrl = `data:image/svg+xml;utf8,${encodedSvg}`;

    return NextResponse.json({ portraitUrl });
  } catch (err) {
    console.error("[ClassicMe] Claude Portrait error:", err);
    return NextResponse.json({ error: "Portrait generation failed" }, { status: 500 });
  }
}

