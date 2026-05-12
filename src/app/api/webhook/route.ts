import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { createClient } from "@libsql/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia" as any,
});

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.customer_email || session.customer_details?.email;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (email) {
          // Get the plan from the subscription
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const priceId = subscription.items.data[0].price.id;
          
          let plan = "unknown";
          if (priceId === process.env.STRIPE_PRICE_ID_STARTER) plan = "starter";
          else if (priceId === process.env.STRIPE_PRICE_ID_GROWTH) plan = "growth";
          else if (priceId === process.env.STRIPE_PRICE_ID_STUDIO) plan = "studio";

          await turso.execute({
            sql: `UPDATE users SET 
                  stripe_customer_id = ?, 
                  stripe_subscription_id = ?, 
                  subscription_status = ?, 
                  plan = ? 
                  WHERE email = ?`,
            args: [customerId, subscriptionId, subscription.status, plan, email],
          });
          console.log(`Updated user ${email} with subscription ${subscriptionId}`);
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        await turso.execute({
          sql: "UPDATE users SET subscription_status = ? WHERE stripe_customer_id = ?",
          args: [subscription.status, customerId],
        });
        console.log(`Subscription ${subscription.id} status updated to ${subscription.status}`);
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (dbError) {
    console.error("Database update error during webhook:", dbError);
    return NextResponse.json({ error: "Database Error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
