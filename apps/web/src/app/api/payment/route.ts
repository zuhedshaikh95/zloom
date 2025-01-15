import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/libs/stripe";

export async function GET(request: NextRequest) {
  const user = await currentUser();

  if (!user) return NextResponse.json({ status: 401, message: "Unauthorized!" }, { status: 401 });

  const priceId = process.env.STRIPE_SUBSCRIPTION_PRICE_ID;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_HOST_URL}/payment?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_HOST_URL}/payment?cancel=true`,
  });

  if (session) {
    return NextResponse.json({
      status: true,
      session_url: session.url,
      customer_id: session.customer,
    });
  }

  return NextResponse.json({ status: false, message: "Payment session not initialized!" }, { status: 500 });
}
