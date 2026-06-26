import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerClient } from "@supabase/ssr";
import { sendOrderEmail } from "@/lib/resend";
import {
  createLuluPrintJob,
  buildLuluAddress,
  luluShippingOption,
  POD_PACKAGES,
  isLuluConfigured,
} from "@/lib/lulu";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature")!;

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ received: true });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = event.data.object as any;
    const { sessionId, bookSlug, tier } = (session.metadata || {}) as Record<string, string>;

    if (!sessionId || !tier) return NextResponse.json({ received: true });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } }
    );

    const { data: sessionData } = await supabase
      .from("sessions")
      .select("user_id")
      .eq("id", sessionId)
      .single();

    const shipping       = session.shipping_details?.address;
    const downloadToken  = crypto.randomUUID();

    const { data: order } = await supabase.from("orders").insert({
      session_id:         sessionId,
      user_id:            sessionData?.user_id,
      tier,
      amount_cents:       session.amount_total || 0,
      status:             tier === "digital" ? "processing" : "paid",
      stripe_payment_id:  session.payment_intent,
      stripe_session_id:  session.id,
      download_token:     downloadToken,
      shipping_name:      session.shipping_details?.name,
      shipping_line1:     shipping?.line1,
      shipping_line2:     shipping?.line2,
      shipping_city:      shipping?.city,
      shipping_state:     shipping?.state,
      shipping_zip:       shipping?.postal_code,
      shipping_country:   shipping?.country || "US",
    }).select().single();

    await supabase.from("sessions").update({ status: "ordered" }).eq("id", sessionId);

    // ── Fetch book data for email + Lulu ─────────────────────────────────────
    const { data: bookData } = await supabase
      .from("books").select("title, word_count").eq("session_id", sessionId).single();

    const bookTitle = bookData?.title || "Your Chronicle";

    const customerEmail = session.customer_details?.email || session.customer_email;
    const customerName  = session.customer_details?.name  || "Valued Customer";

    // ── Digital: generate PDF first, then email it as an attachment ───────────
    if (tier === "digital" && order) {
      let pdfUrl: string | null = null;
      try {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://getchronicled.art";
        const pdfRes = await fetch(`${appUrl}/api/pdf?token=${downloadToken}&upload=true`);
        if (pdfRes.ok) {
          const pdfData = await pdfRes.json();
          pdfUrl = pdfData.pdfUrl || null;
          await supabase.from("orders").update({ status: "complete" }).eq("id", order.id);
          console.log(`PDF generated for order ${order.id}: ${pdfUrl}`);
        } else {
          console.error(`PDF generation failed: HTTP ${pdfRes.status}`);
        }
      } catch (pdfErr) {
        console.error("PDF generation error (non-fatal):", pdfErr);
      }

      if (customerEmail) {
        try {
          await sendOrderEmail({
            toEmail:       customerEmail,
            toName:        customerName,
            bookTitle,
            bookArchetype: bookSlug || "the-great-gatsby",
            downloadToken,
            tier:          "digital",
            pdfUrl,
          });
          console.log(`Email sent to ${customerEmail} (PDF attached: ${!!pdfUrl})`);
        } catch (emailErr) {
          console.error("Email delivery error (non-fatal):", emailErr);
        }
      }
    }

    // ── Physical: send confirmation email (download link); Lulu handled below ─
    if (tier !== "digital" && order && customerEmail) {
      try {
        await sendOrderEmail({
          toEmail:       customerEmail,
          toName:        customerName,
          bookTitle,
          bookArchetype: bookSlug || "the-great-gatsby",
          downloadToken,
          tier:          tier as "softcover" | "hardcover",
        });
        console.log(`Email sent to ${customerEmail}`);
      } catch (emailErr) {
        console.error("Email delivery error (non-fatal):", emailErr);
      }
    }

    // ── For physical orders: submit to Lulu Direct ────────────────────────────
    if (tier !== "digital" && order && isLuluConfigured()) {
      try {
        const appUrl     = process.env.NEXT_PUBLIC_APP_URL || "https://getchronicled.art";
        const country    = shipping?.country || "US";

        // Generate and upload PDF first
        const pdfRes  = await fetch(`${appUrl}/api/pdf?token=${downloadToken}&upload=true`);
        const pdfData = await pdfRes.json();
        const interiorPdfUrl = pdfData.pdfUrl;

        if (!interiorPdfUrl) throw new Error("PDF upload failed");

        // Build Lulu print job
        const luluJob = await createLuluPrintJob({
          contact_email:    customerEmail || "books@getchronicled.art",
          external_id:      order.id,
          shipping_address: buildLuluAddress(order),
          shipping_option:  luluShippingOption(country),
          line_items: [
            {
              external_id:     order.id,
              title:           bookTitle,
              quantity:        1,
              pod_package_id:  POD_PACKAGES[tier as keyof typeof POD_PACKAGES],
              interior:        { source_url: interiorPdfUrl },
              // Cover: use a standard Chronicled cover PDF
              // In production, generate a custom cover per book archetype
              cover: {
                source_url: `${appUrl}/api/cover?session=${sessionId}&book=${bookSlug}`,
              },
            },
          ],
        });

        // Save Lulu job ID to order
        await supabase.from("orders")
          .update({ lulu_order_id: luluJob.id, status: "processing" })
          .eq("id", order.id);

        console.log(`Lulu print job created: ${luluJob.id} for order ${order.id}`);
      } catch (luluErr) {
        console.error("Lulu fulfillment error (non-fatal):", luluErr);
        // Don't fail the webhook — admin will be notified via logs
      }
    }

    void bookSlug;
    console.log(`Order complete: session=${sessionId} tier=${tier} token=${downloadToken}`);
  }

  return NextResponse.json({ received: true });
}
