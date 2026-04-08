import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createServerClient } from "@supabase/ssr";
import { getBook } from "@/lib/books";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file      = formData.get("photo")     as File | null;
    const sessionId = formData.get("sessionId") as string | null;
    const bookSlug  = formData.get("bookSlug")  as string | null;

    if (!file || !sessionId || !bookSlug) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const book = getBook(bookSlug);
    if (!book) {
      return NextResponse.json({ error: "Invalid book." }, { status: 400 });
    }

    // Demo mode — no API keys
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        portraitUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=740&fit=crop&auto=format&q=80",
        demo: true,
      });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // ── STEP 1: GPT-4o Vision — describe the person ──────────────────────────
    const arrayBuffer = await file.arrayBuffer();
    const base64      = Buffer.from(arrayBuffer).toString("base64");
    const mimeType    = file.type || "image/jpeg";

    const visionResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 400,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${base64}`, detail: "high" },
            },
            {
              type: "text",
              text: `Describe this person for a portrait artist with precise detail. Include:
- Gender presentation and approximate age
- Face shape, skin tone, and complexion
- Eye color and shape
- Hair color, length, texture, and style
- Distinctive facial features (strong jaw, high cheekbones, full lips, etc.)
- Overall expression and bearing (dignified, warm, serious, etc.)
Be specific and vivid. Do NOT mention clothing. This description will be used to paint a portrait. Reply with only the physical description, 3–4 sentences.`,
            },
          ],
        },
      ],
    });

    const personDescription = visionResponse.choices[0]?.message?.content?.trim() || "a distinguished individual";

    // ── STEP 2: DALL-E 3 — generate the portrait ─────────────────────────────
    const prompt = `A formal literary portrait painting. ${personDescription}

Art style: ${book.portraitStyle}

The portrait should be composed like a classic painted artwork — centered, dignified composition with rich attention to light and shadow. The subject gazes slightly off-center with quiet confidence. Museum quality. No text, no watermarks, no borders.`;

    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1792",   // portrait orientation
      quality: "hd",
      style: "vivid",
    });

    const generatedUrl = imageResponse.data?.[0]?.url;
    if (!generatedUrl) {
      return NextResponse.json({ error: "Image generation failed." }, { status: 500 });
    }

    // ── STEP 3: Download & store in Supabase Storage ──────────────────────────
    let storedUrl = generatedUrl; // fallback to DALL-E URL if storage fails

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
          { cookies: { getAll: () => [], setAll: () => {} } }
        );

        // Download the DALL-E image
        const imgRes    = await fetch(generatedUrl);
        const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
        const fileName  = `portraits/${sessionId}.png`;

        const { error: uploadError } = await supabase.storage
          .from("chronicled")
          .upload(fileName, imgBuffer, {
            contentType: "image/png",
            upsert: true,
          });

        if (!uploadError) {
          const { data: publicData } = supabase.storage
            .from("chronicled")
            .getPublicUrl(fileName);
          storedUrl = publicData.publicUrl;
        }

        // Save to portraits table
        await supabase.from("portraits").upsert({
          session_id:  sessionId,
          image_url:   storedUrl,
          prompt_used: prompt,
          style:       book.portraitStyle,
        });

      } catch (storageErr) {
        console.error("Storage error (non-fatal):", storageErr);
        // Continue — DALL-E URL still works temporarily
      }
    }

    return NextResponse.json({ portraitUrl: storedUrl, personDescription });

  } catch (error) {
    console.error("Portrait generation error:", error);
    return NextResponse.json({ error: "Portrait generation failed. Please try again." }, { status: 500 });
  }
}
