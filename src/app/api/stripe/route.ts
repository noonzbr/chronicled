import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const PRICES = {
  digital:   1900,  // $19.00
  softcover: 3900,  // $39.00
  hardcover: 5900,  // $59.00
} as const;

const TIER_NAMES = {
  digital:   "Chronicled — Digital PDF",
  softcover: "Chronicled — Softcover Book",
  hardcover: "Chronicled — Hardcover + Royal Portrait",
} as const;

export async function POST(req: NextRequest) {
  try {
    const { tier, bookSlug, sessionId, bookTitle } = await req.json();

    if (!tier || !PRICES[tier as keyof typeof PRICES]) {
      return NextResponse.json({ error: "Invalid tier." }, { status: 400 });
    }

    // Demo mode
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({
        url: `/order-confirmed?session=${sessionId}&tier=${tier}&demo=true`,
      });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: PRICES[tier as keyof typeof PRICES],
            product_data: {
              name: TIER_NAMES[tier as keyof typeof TIER_NAMES],
              description: bookTitle || "Your personal literary chronicle",
              images: [],
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        sessionId,
        bookSlug,
        tier,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order-confirmed?session=${sessionId}&tier=${tier}&stripe_session={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/preview?book=${bookSlug}&session=${sessionId}`,
      // Collect shipping for physical tiers
      ...(tier !== "digital" && {
        shipping_address_collection: {
          allowed_countries: ["US", "CA", "GB", "AU", "DE", "FR", "ES", "IT", "NL", "PT"],
        },
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: { amount: 0, currency: "usd" },
              display_name: "Standard Shipping",
              delivery_estimate: {
                minimum: { unit: "business_day", value: 7 },
                maximum: { unit: "business_day", value: 14 },
              },
            },
          },
        ],
      }),
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json({ error: "Payment setup failed." }, { status: 500 });
  }
}
