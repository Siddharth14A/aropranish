import { serve } from "https://deno.land/std/http/server.ts";
import Stripe from "https://esm.sh/stripe@12?target=deno";

// For sending emails (example: using Resend)
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

serve(async (req) => {
  // Stripe signature verification
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!
    );
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const sessionId = session.id;
    const userId = session.metadata.userId;
    const programme = session.metadata.programme;
    const providerId = session.metadata.providerId;
    const date = session.metadata.date;
    const time = session.metadata.time;
    const email = session.customer_details.email;

    // Update payments in DB
    const supabaseURL = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    await fetch(`${supabaseURL}/rest/v1/bookings`, {
      method: "PATCH",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payment_status: "paid",
      }),
    });

    // Send email using Resend API
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Aropranish Clinic <noreply@aropranish.com>",
        to: email,
        subject: "Your Appointment is Confirmed",
        html: `
          <h2>Payment Successful 🎉</h2>
          <p>Your consultation has been confirmed.</p>
          <p><strong>Programme:</strong> ${programme}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Provider ID:</strong> ${providerId}</p>
          <p><strong>Session ID:</strong> ${sessionId}</p>
          <br/>
          <p>Thank you for choosing Aropranish Clinic.</p>
        `,
      }),
    });
  }

  return new Response("OK", { status: 200 });
});
