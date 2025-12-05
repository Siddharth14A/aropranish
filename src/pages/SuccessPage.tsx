import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import emailjs from "@emailjs/browser";

const PROGRAM_TITLES: Record<string, string> = {
  "natural-medicine": "Initial Comprehensive Consultation",
  "weight-loss": "Weight Loss Consultation",
  "smoking-cessation": "Smoking Cessation",
  "sleep": "Sleep Disorder Consultation",
  "non-urgent": "Non-Urgent Prescription Review",
};

export default function SuccessPage() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  const [loading, setLoading] = useState(true);
  const [stripeSession, setStripeSession] = useState<any>(null);
  const [providerName, setProviderName] = useState<string>("");
  const [payment, setPayment] = useState<any>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (sessionId) fetchSession();
    else setLoading(false);
  }, [sessionId]);

  async function fetchSession() {
    try {
      // 1️ Fetch session from edge function
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        }
      );

      const data = await res.json();
      console.log("STRIPE SESSION RETURN:", data);

      const session = data.session;
      const paymentDetails = data.payment_details;

      setStripeSession(session);
      setPayment(paymentDetails);

      // 2️ Fetch provider name
      const providerId = session?.metadata?.providerId;
      if (providerId) {
        const { data: provider } = await supabase
          .from("providers")
          .select("name")
          .eq("id", providerId)
          .single();

        setProviderName(provider?.name || "Unknown Provider");
      }

      // 3️ Mark booking as paid
      await supabase
        .from("bookings")
        .update({ payment_status: "paid" })
        .eq("session_id", sessionId);

      // -----------------------------------------
      // 4️ Send EMAIL using EmailJS
      // -----------------------------------------
      const { programme, date, time } = session.metadata;

      const emailPayload = {
        email: session.customer_details?.email || session.customer_email,
        programme,
        date,
        time,
        provider: providerName,
        amount: (paymentDetails.amount / 100).toFixed(2),
        receipt_url: paymentDetails.receipt_url,
      };

      console.log("Sending EmailJS payload:", emailPayload);
console.log("Stripe email check:", {
  customer_details_email: session.customer_details?.email,
  customer_email: session.customer_email
});

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE!,
        import.meta.env.VITE_EMAILJS_TEMPLATE!,
        emailPayload,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY!
      );

      console.log(" Email sent successfully!");

    } catch (err) {
      console.error("Error loading success page:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <h2>Loading your confirmation...</h2>;
  if (!stripeSession?.metadata)
    return <p>Error loading session… but payment was successful.</p>;

  const { programme, date, time } = stripeSession.metadata;

  return (
    <div style={{ padding: 30, maxWidth: 600, margin: "auto" }}>
      <h1 style={{ fontSize: 32 }}>🎉 Appointment Confirmed</h1>
      <p>Your payment was successful.</p>

      <div
        style={{
          marginTop: 20,
          padding: 20,
          borderRadius: 10,
          background: "#e8f8f0",
        }}
      >
        <p>
          <strong>Programme:</strong>{" "}
          {PROGRAM_TITLES[programme] || programme}
        </p>

        <p>
          <strong>Date:</strong> {date}
        </p>

        <p>
          <strong>Time:</strong> {time}
        </p>

        <p>
          <strong>Provider:</strong> {providerName}
        </p>

        {/*  Payment Info */}
        {payment && (
          <>
            <hr style={{ margin: "20px 0" }} />
            <h3>💳 Payment Details</h3>

            <p>
              <strong>Amount Paid:</strong>{" "}
              ${(payment.amount / 100).toFixed(2)}{" "}
              {payment.currency?.toUpperCase()}
            </p>

            <p>
              <strong>Card:</strong>{" "}
              {payment.brand?.toUpperCase()} •••• {payment.last4}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color: payment.status === "succeeded" ? "green" : "red",
                }}
              >
                {payment.status}
              </span>
            </p>

            {payment.receipt_url && (
              <p style={{ marginTop: 10 }}>
                <a
                  href={payment.receipt_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#0b8a5f", textDecoration: "underline" }}
                >
                  View Payment Receipt
                </a>
              </p>
            )}
          </>
        )}
      </div>

      <button
        onClick={() => navigate("/login")}
        style={{
          marginTop: 25,
          padding: "12px 20px",
          background: "#0b8a5f",
          border: "none",
          color: "white",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        Go to Dashboard
      </button>
    </div>
  );
}
