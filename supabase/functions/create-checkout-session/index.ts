import { serve } from "https://deno.land/std/http/server.ts";
import Stripe from "https://esm.sh/stripe@12?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { amount, currency, programme, slot, providerId } = await req.json();

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      return new Response(
        JSON.stringify({
          error: "STRIPE_SECRET_KEY missing in environment",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    const origin = req.headers.get("origin");

    // 1️⃣ First: create checkout session WITHOUT success_url
    const session = await stripe.checkout.sessions.create({
  mode: "payment",
  payment_method_types: ["card"],

  line_items: [
    {
      price_data: {
        currency,
        product_data: { name: programme },
        unit_amount: amount,
      },
      quantity: 1,
    },
  ],

  metadata: {
    programme,
    providerId,
    date: slot.date,
    time: slot.time,
  },

  success_url: `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${req.headers.get("origin")}/cancel`,
});


    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
