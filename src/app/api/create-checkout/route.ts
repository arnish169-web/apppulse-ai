import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICE_IDS: Record<string, string> = {
  starter: process.env.STRIPE_PRICE_ID_STARTER!,
  growth: process.env.STRIPE_PRICE_ID_GROWTH!,
  studio: process.env.STRIPE_PRICE_ID_STUDIO!,
};

export async function POST(request: Request) {
  try {
    const { plan, email } = await request.json();
    if (!plan || !PRICE_IDS[plan]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }
    const origin = request.headers.get("origin");
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
      mode: "subscription",
      subscription_data: { trial_period_days: 30 },
      success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
    });
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
