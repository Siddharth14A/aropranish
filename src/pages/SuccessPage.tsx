// src/pages/SuccessPage.tsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import emailjs from "@emailjs/browser";

const PROGRAM_TITLES: Record<string, string> = {
  "natural-medicine": "Initial Comprehensive Consultation",
  "weight-loss": "Weight Loss Consultation",
  "smoking-cessation": "Smoking Cessation Consultation",
  sleep: "Sleep Disorder Consultation",
  "non-urgent": "Non-Urgent Prescription Review",
  "medical-certificate": "Medical Certificate / Documentation",
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
    if (sessionId) {
      fetchSession();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  async function fetchSession() {
    try {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      // 1️⃣ Fetch session + payment details from Supabase Edge Function
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        }
      );

      const data = await res.json();
      console.log("[Success] STRIPE SESSION RETURN:", data);

      const session = data.session;
      const paymentDetails = data.payment_details;

      setStripeSession(session);
      setPayment(paymentDetails);

      const { programme, date, time, providerId } = session.metadata || {};
      const isMedicalCertificate = programme === "medical-certificate";

      // 2️⃣ Fetch provider name (for normal appointment flows)
      if (providerId && !isMedicalCertificate) {
        const { data: provider } = await supabase
          .from("providers")
          .select("name")
          .eq("id", providerId)
          .maybeSingle();

        if (provider?.name) {
          setProviderName(provider.name);
        }
      }

      // 3️⃣ Mark booking as paid
      await supabase
        .from("bookings")
        .update({ payment_status: "paid" })
        .eq("session_id", sessionId);

      // 4️⃣ Look up the user's email from DB via bookings → user_info
      let dbEmail: string | null = null;
      const { data: bookingRow, error: bookingErr } = await supabase
        .from("bookings")
        .select("user_id")
        .eq("session_id", sessionId)
        .maybeSingle();

      if (bookingErr) {
        console.error("[Success] Error fetching booking for email:", bookingErr);
      }

      if (bookingRow?.user_id) {
        const { data: userRow, error: userErr } = await supabase
          .from("user_info")
          .select("email")
          .eq("id", bookingRow.user_id)
          .maybeSingle();

        if (userErr) {
          console.error("[Success] Error fetching user email:", userErr);
        } else if (userRow?.email) {
          dbEmail = userRow.email;
        }
      }

      // 5️⃣ Decide final email to use (DB > Stripe customer > fallback)
      const fallbackStripeEmail =
        session.customer_details?.email || session.customer_email || "";
      const finalEmail = dbEmail || fallbackStripeEmail;

      console.log("[Success] DB email:", dbEmail);
      console.log("[Success] Stripe email fallback:", fallbackStripeEmail);
      console.log("[Success] FINAL EMAIL TO SEND:", finalEmail);

      // 6️⃣ Send EmailJS ONLY for appointment programmes (not medical certificate)
      if (!isMedicalCertificate && finalEmail && paymentDetails) {
        const readableProgramme =
          PROGRAM_TITLES[programme] || programme || "Consultation";

        const emailPayload = {
          // 🔴 IMPORTANT: This must match EmailJS template "To Email" → {{email}}
          email: finalEmail,
          // used inside the HTML body as "Hi {{to_email}}"
          to_email: finalEmail,
          programme: readableProgramme,
          date,
          time,
          provider: providerName || "",
          amount: (paymentDetails.amount / 100).toFixed(2),
          receipt_url: paymentDetails.receipt_url,
        };

        console.log("[Success] Sending EmailJS payload:", emailPayload);

        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE!,
          import.meta.env.VITE_EMAILJS_TEMPLATE!,
          emailPayload,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY!
        );

        console.log("[Success] Appointment email sent successfully ✅");
      } else {
        console.log(
          "[Success] Skipping email send (medical certificate or missing email/payment)."
        );
      }
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
  const isMedicalCertificate = programme === "medical-certificate";
  const readableProgramme =
    PROGRAM_TITLES[programme] || programme || "Consultation";

  return (
    <div style={{ padding: 30, maxWidth: 600, margin: "auto" }}>
      <h1 style={{ fontSize: 32 }}>
        {isMedicalCertificate ? "✅ Payment Successful" : "🎉 Appointment Confirmed"}
      </h1>

      <p>
        {isMedicalCertificate
          ? "Your payment for a medical certificate / documentation has been received."
          : "Your appointment has been successfully booked."}
      </p>

      <div
        style={{
          marginTop: 20,
          padding: 20,
          borderRadius: 10,
          background: "#e8f8f0",
        }}
      >
        {!isMedicalCertificate && (
          <>
            <p>
              <strong>Programme:</strong> {readableProgramme}
            </p>

            <p>
              <strong>Date:</strong> {date}
            </p>

            <p>
              <strong>Time:</strong> {time}
            </p>

            <p>
              <strong>Provider:</strong> {providerName || "To be confirmed"}
            </p>
          </>
        )}

        {/* 💳 Payment Info  (shown for both flows) */}
        {payment && (
          <>
            {!isMedicalCertificate && (
              <hr style={{ margin: "20px 0" }} />
            )}

            <h3>💳 Payment Details</h3>

            <p>
              <strong>Amount Paid:</strong>{" "}
              {(payment.amount / 100).toFixed(2)}{" "}
              {payment.currency?.toUpperCase()}
            </p>

            {payment.brand && payment.last4 && (
              <p>
                <strong>Card:</strong>{" "}
                {payment.brand?.toUpperCase()} •••• {payment.last4}
              </p>
            )}

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

        {isMedicalCertificate && (
          <p style={{ marginTop: 20 }}>
            Our team will contact you shortly regarding your medical
            certificate. For any queries, please email{" "}
            <a
              href="mailto:contact@aropranish-green.com.au"
              style={{ color: "#0b8a5f", textDecoration: "underline" }}
            >
              contact@aropranish-green.com.au
            </a>
            .
          </p>
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
