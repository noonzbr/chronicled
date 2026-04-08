import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { generateBookHtml } from "@/lib/book-html";

// ── PDF generation via headless Chrome ──────────────────────────────────────
// Uses @sparticuz/chromium-min + puppeteer-core for Vercel compatibility

async function getBrowser() {
  // In production (Vercel), use the serverless chromium build
  if (process.env.NODE_ENV === "production" || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const chromium   = (await import("@sparticuz/chromium-min")).default;
    const puppeteer  = (await import("puppeteer-core")).default;
    const execPath   = await chromium.executablePath(
      "https://github.com/Sparticuz/chromium/releases/download/v130.0.0/chromium-v130.0.0-pack.tar"
    );
    return puppeteer.launch({
      args:           chromium.args,
      executablePath: execPath,
      headless:       true,
    });
  }

  // In development, use locally installed Chrome
  const puppeteer = (await import("puppeteer-core")).default;
  const paths = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
  ];

  // Find first available Chrome path
  const { existsSync } = await import("fs");
  const executablePath = paths.find((p) => existsSync(p));

  if (!executablePath) {
    throw new Error("Chrome not found. Install Google Chrome to generate PDFs locally.");
  }

  return puppeteer.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}

export async function GET(req: NextRequest) {
  const token     = req.nextUrl.searchParams.get("token");
  const upload    = req.nextUrl.searchParams.get("upload") === "true";

  if (!token) return new NextResponse("Missing token", { status: 400 });

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return new NextResponse("Service unavailable in demo mode", { status: 503 });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );

  // Resolve order → session → book
  const { data: order } = await supabase
    .from("orders")
    .select("session_id, tier")
    .eq("download_token", token)
    .single();

  if (!order) return new NextResponse("Order not found", { status: 404 });

  const { data: book } = await supabase
    .from("books").select("*").eq("session_id", order.session_id).single();
  if (!book) return new NextResponse("Book not found", { status: 404 });

  const { data: session } = await supabase
    .from("sessions").select("book_slug").eq("id", order.session_id).single();

  const { data: portrait } = await supabase
    .from("portraits").select("image_url").eq("session_id", order.session_id).maybeSingle();

  const bookSlug = session?.book_slug || "the-great-gatsby";
  const html     = generateBookHtml(book, bookSlug, portrait);

  // ── Generate PDF ──────────────────────────────────────────────────────────
  let browser;
  try {
    browser = await getBrowser();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.emulateMediaType("print");

    const pdfBuffer = await page.pdf({
      format:     "Letter",
      printBackground: true,
      margin:     { top: "0", right: "0", bottom: "0", left: "0" },
    });

    await browser.close();
    browser = null;

    // ── Optionally upload to Supabase Storage & return URL ────────────────
    if (upload) {
      const fileName = `pdfs/${order.session_id}.pdf`;
      const { error } = await supabase.storage
        .from("chronicled")
        .upload(fileName, pdfBuffer, { contentType: "application/pdf", upsert: true });

      if (error) throw error;

      const { data: publicData } = supabase.storage
        .from("chronicled")
        .getPublicUrl(fileName);

      // Update order with PDF url
      await supabase.from("orders")
        .update({ pdf_url: publicData.publicUrl })
        .eq("download_token", token);

      return NextResponse.json({ pdfUrl: publicData.publicUrl });
    }

    // ── Stream the PDF directly ────────────────────────────────────────────
    return new NextResponse(Buffer.from(pdfBuffer) as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type":        "application/pdf",
        "Content-Disposition": `attachment; filename="${book.title || "chronicle"}.pdf"`,
        "Cache-Control":       "private, no-store",
      },
    });

  } catch (err) {
    if (browser) await browser.close();
    console.error("PDF generation error:", err);
    return new NextResponse("PDF generation failed", { status: 500 });
  }
}
