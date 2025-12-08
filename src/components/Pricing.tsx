import { useState } from "react";
import { supabase } from "../supabaseClient";

export const Pricing = () => {
  const [showMedicalModal, setShowMedicalModal] = useState(false);

  // medical modal internal state
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
    acceptTerms: false,
  });

  const [loadingPayment, setLoadingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [formError, setFormError] = useState("");

  // digits only phone
  function filterPhoneDigits(input: string) {
    return input.replace(/\D/g, "");
  }

  // email validation
  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // -------------------------------
  // PAYMENT HANDLER
  // -------------------------------
  async function handleMedicalPayment() {
    const { firstName, lastName, email, phone, acceptTerms, notes } = form;

    // VALIDATIONS
    if (!firstName || !lastName || !email || !phone) {
      setFormError("All fields are required.");
      return;
    }
    if (!isValidEmail(email)) {
      setFormError("Invalid email address.");
      return;
    }
    if (phone.length < 8) {
      setFormError("Phone number must be at least 8 digits.");
      return;
    }
    if (!acceptTerms) {
      setFormError("You must accept the Terms & Privacy Policy.");
      return;
    }

    setFormError("");
    setLoadingPayment(true);
    setPaymentError("");

    try {
      // 1️⃣ Insert user
      const { data: user, error: userError } = await supabase
        .from("user_info")
        .insert({
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          accepted_terms: acceptTerms,
        })
        .select()
        .single();

      if (userError) {
        console.error("USER INSERT ERROR:", userError);
        setPaymentError("Failed to save user details.");
        setLoadingPayment(false);
        return;
      }

      localStorage.setItem("currentUserId", user.id);

      // 2️⃣ Insert answers record
      await supabase.from("answers").insert({
        user_id: user.id,
        programme: "medical-certificate",
        answers: {},
      });

      // 3️⃣ Insert booking
      const today = new Date().toISOString().split("T")[0];

      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          provider_id: null,
          user_id: user.id,
          date: today,
          time: "N/A",
          programme: "medical-certificate",
          notes: notes || "Medical Certificate Request",
          appointment_status: "completed",
          payment_status: "pending",
        })
        .select()
        .single();

      if (bookingError) {
        console.error("BOOKING INSERT ERROR:", bookingError);
        setPaymentError("Could not create booking record.");
        setLoadingPayment(false);
        return;
      }

      // 4️⃣ Stripe checkout
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: 29 * 100,
            currency: "aud",
            programme: "medical-certificate",
            slot: { date: today, time: "N/A" },
            providerId: null,
            bookingId: booking.id,
            successUrl: window.location.origin + "/success",
            cancelUrl: window.location.href,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.url) {
        setPaymentError("Something went wrong during payment start.");
        setLoadingPayment(false);
        return;
      }

      // 5️⃣ Update booking with Stripe session ID
      await supabase
        .from("bookings")
        .update({ session_id: data.sessionId })
        .eq("id", booking.id);

      // 6️⃣ Redirect to Stripe
      window.location.href = data.url;
    } catch (err) {
      console.error("PAYMENT ERROR:", err);
      setPaymentError("Unexpected error during payment.");
    } finally {
      setLoadingPayment(false);
    }
  }

  const infoLine: React.CSSProperties = {
    margin: "10px 0",
    textAlign: "center",
    fontSize: "15px",
    lineHeight: "1.5",
    color: "#4e4e4e",
  };

  return (
    <>
      <section id="pricing" className="section pricing-section">
        <div className="container">
          {/* HEADER */}
          <h2
            style={{
              textAlign: "center",
              fontSize: "32px",
              fontWeight: 700,
              color: "#26463e",
              marginBottom: "40px",
            }}
          >
            Honest, Upfront Pricing
          </h2>

          {/* INITIAL CONSULTATIONS */}
          <h3 style={{ fontSize: "24px", marginBottom: "20px", marginTop: "20px", color: "#26463e" }}>
            Initial Consultations
          </h3>

          <div className="pricing-grid">
            <div className="pricing-card">
              <h4>Initial Comprehensive Consultation</h4>
              <p className="price-amount">$99</p>
              <p className="pricing-desc">A detailed medical assessment tailored to your needs.</p>
              <button className="btn btn--outline-green">Book Consultation</button>
            </div>

            <div className="pricing-card">
              <h4>Weight Management Consultation</h4>
              <p className="price-amount">$69</p>
              <p className="pricing-desc">Lifestyle & weight management support.</p>
              <button className="btn btn--outline-green">Book Consultation</button>
            </div>

            <div className="pricing-card">
              <h4>Sleep Health Consultation</h4>
              <p className="price-amount">$69</p>
              <p className="pricing-desc">Assessment for sleep-related concerns.</p>
              <button className="btn btn--outline-green">Book Consultation</button>
            </div>

            <div className="pricing-card">
              <h4>Smoking Cessation Consultation</h4>
              <p className="price-amount">$69</p>
              <p className="pricing-desc">Support with quitting smoking/vaping.</p>
              <button className="btn btn--outline-green">Book Consultation</button>
            </div>

            <div className="pricing-card">
              <h4>Prescription & Medication Review</h4>
              <p className="price-amount">$69</p>
              <p className="pricing-desc">Hypertension/Diabetes etc</p>
              <button className="btn btn--outline-green">Book Consultation</button>
            </div>
          </div>

          {/* FOLLOW-UP */}
          <h3 style={{ fontSize: "24px", marginBottom: "20px", marginTop: "40px", color: "#26463e" }}>
            Follow up / Existing Patients
          </h3>

          <div className="pricing-grid">
            <div className="pricing-card">
              <h4>Follow-Up Consultation</h4>
              <p className="price-amount">$69</p>
              <p className="pricing-desc">Review & treatment adjustments.</p>
              <button
                className="btn btn--outline-green"
                onClick={() => (window.location.href = "/login")}
              >
                Book Consultation
              </button>
            </div>

            <div className="pricing-card">
              <h4>Medical Certificate / Documentation</h4>
              <p className="price-amount">$29</p>
              <p className="pricing-desc">Documentation when medically justified.</p>
              <button className="btn btn--outline-green" onClick={() => setShowMedicalModal(true)}>
                Book Consultation
              </button>
            </div>
          </div>

          <p
            style={{
              textAlign: "center",
              marginTop: "15px",
              color: "#6b6b6b",
              fontSize: "14px",
            }}
          >
            All fees are in AUD. Private billing only. No Medicare rebates available. Telehealth consultations only.
          </p>

          {/* PAY WHEN YOU BOOK */}
          <div
            style={{
              background: "#f6f1e6",
              padding: "40px 20px",
              textAlign: "center",
              marginTop: "60px",
              borderRadius: "10px",
              border: "1px solid #ddcba9",
            }}
          >
            <p style={{ margin: "10px 0", fontSize: "16px", color: "#4e4e4e" }}>
              💳 <strong>Pay when you book</strong>
            </p>

            <p style={{ margin: "10px 0", fontSize: "16px", color: "#4e4e4e" }}>
              Detailed receipts provided for private insurance claims.
            </p>

            <p style={{ margin: "10px 0", fontSize: "15px", color: "#6b6b6b" }}>• Bulk billing not available</p>
            <p style={{ margin: "10px 0", fontSize: "15px", color: "#6b6b6b" }}>
              • Telehealth services may be eligible for reimbursement — check with your insurer.
            </p>
          </div>

          {/* IMPORTANT INFO */}
          <h2
            style={{
              textAlign: "center",
              marginTop: "70px",
              fontSize: "28px",
              fontWeight: 700,
              color: "#26463e",
            }}
          >
            Important Medical Information
          </h2>

          <div
            style={{
              background: "#f6f1e6",
              padding: "30px 20px",
              maxWidth: "900px",
              margin: "30px auto",
              borderRadius: "10px",
            }}
          >
            <p style={infoLine}>All consultations require appropriate medical assessment and documented history.</p>
            <p style={infoLine}>Therapeutic recommendations follow Australian clinical guidelines.</p>
            <p style={infoLine}>Specialist referrals may be required for some conditions.</p>
            <p style={infoLine}>Treatment options are always evidence-based and clinically justified.</p>
          </div>

          {/* LEGAL COMPLIANCE */}
          <h2
            style={{
              textAlign: "center",
              marginTop: "80px",
              fontSize: "26px",
              fontWeight: 700,
              color: "#26463e",
            }}
          >
            ⚖️ Legal Compliance Note
          </h2>

          <div
            style={{
              background: "#fff",
              padding: "30px 20px",
              maxWidth: "900px",
              margin: "25px auto 80px auto",
              borderRadius: "10px",
              border: "1px solid #e1d9c8",
            }}
          >
            <p style={infoLine}>Aropranish Green complies with AHPRA and TGA advertising standards.</p>
            <p style={infoLine}>We do not advertise or supply therapeutic goods to the public.</p>
            <p style={infoLine}>Treatment options are discussed only during medical consultations.</p>
          </div>
        </div>
      </section>

      {/* ===================== MODAL ===================== */}
      {showMedicalModal && (
        <div className="modal-overlay">
          <div className="modal-box small">
            <div className="modal-header">
              <h2>Before Payment — Enter Your Details</h2>
              <button className="modal-close" onClick={() => setShowMedicalModal(false)}>
                ×
              </button>
            </div>

            {/* FORM */}
            <label className="modal-label">First Name</label>
            <input
              className="q-input"style={{ border: "1.5px solid #c9c9c9", borderRadius: "6px" }}
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />

            <label className="modal-label">Last Name</label>
            <input
              className="q-input"style={{ border: "1.5px solid #c9c9c9", borderRadius: "6px" }}
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />

            <label className="modal-label">Email</label>
            <input
              className="q-input"style={{ border: "1.5px solid #c9c9c9", borderRadius: "6px" }}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <label className="modal-label">Phone</label>
            <input
              className="q-input"style={{ border: "1.5px solid #c9c9c9", borderRadius: "6px" }}
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: filterPhoneDigits(e.target.value) })
              }
            />
            {/* ✅ OPTIONAL NOTES */}
            <label className="modal-label">
              Notes (optional – reason for certificate)
            </label>
            <textarea
              className="q-input"
              style={{
                border: "1.5px solid #c9c9c9",
                borderRadius: "6px",
                minHeight: "80px",
              }}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any details you’d like the doctor to know..."
            />

            {/* TERMS */}
            <label style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" }}>
              <input
                type="checkbox"
                checked={form.acceptTerms}
                onChange={(e) =>
                  setForm({ ...form, acceptTerms: e.target.checked })
                }
              />
              <span style={{ fontSize: "14px" }}>
                I accept the{" "}
                <a href="/terms" target="_blank" style={{ color: "#0b8a5f" }}>
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" target="_blank" style={{ color: "#0b8a5f" }}>
                  Privacy Policy
                </a>
              </span>
            </label>

            {formError && <p style={{ color: "red", marginTop: 10 }}>{formError}</p>}
            {paymentError && <p style={{ color: "red", marginTop: 10 }}>{paymentError}</p>}

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowMedicalModal(false)}>
                Cancel
              </button>

              <button className="btn-primary" disabled={loadingPayment} onClick={handleMedicalPayment}>
                {loadingPayment ? "Processing…" : "Pay $29"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
