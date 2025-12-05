import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { loadStripe } from "@stripe/stripe-js";
import "./appointment.css";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ""
);

interface Provider {
  id: number;
  name: string;
}

interface SelectedSlot {
  date: string;
  time: string;
}

export const AppointmentPage = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );

  const [bookedSlots, setBookedSlots] = useState<any[]>([]);
  const [offDays, setOffDays] = useState<any[]>([]);
  const [programme, setProgramme] = useState<string | null>(null);

  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [notes, setNotes] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [nextAppointment, setNextAppointment] = useState<any>(null);
  const [upcomingAppointment, setUpcomingAppointment] = useState<any>(null);

  // hasPaidBefore = true → follow-up pricing (69 AUD)
  const [hasPaidBefore, setHasPaidBefore] = useState<boolean | null>(null);
const [selectedDate, setSelectedDate] = useState<string>("");
// Medicare details states
const [medicareNumber, setMedicareNumber] = useState("");
const [referenceNumber, setReferenceNumber] = useState("");
const [medicareExpiry, setMedicareExpiry] = useState("");
const [loadingMedicare, setLoadingMedicare] = useState(false);
const [savingMedicare, setSavingMedicare] = useState(false);




  // const DAYS_AHEAD = 6;

  // -----------------------------
  // Programme metadata
  // -----------------------------
  const PROGRAM_DATA: Record<
    string,
    { title: string; price: string; currency: string }
  > = {
    "natural-medicine": {
      title: "Initial Comprehensive Consultation",
      price: "99",
      currency: "AUD",
    },
    "weight-loss": {
      title: "Weight Loss Management",
      price: "69",
      currency: "AUD",
    },
    "smoking-cessation": {
      title: "Smoking Cessation (Vaping Support)",
      price: "69",
      currency: "AUD",
    },
    sleep: {
      title: "Sleep Disorder Consultation",
      price: "69",
      currency: "AUD",
    },
    "non-urgent": {
      title: "Non-Urgent Prescriptions",
      price: "49",
      currency: "AUD",
    },
  };

  // -----------------------------
  // Helper: check if user has any PAID booking
  // -----------------------------
  async function fetchHasPaidBefore(): Promise<boolean> {
    const userId = localStorage.getItem("currentUserId");
    console.log("[hasPaidBefore] Checking for paid bookings. userId =", userId);

    if (!userId) {
      console.log("[hasPaidBefore] No userId found → treating as first-time.");
      setHasPaidBefore(false);
      return false;
    }

    const { data, error } = await supabase
      .from("bookings")
      .select("id, date, payment_status")
      .eq("user_id", userId)
      .eq("payment_status", "paid")
      .limit(1);

    if (error) {
      console.error("[hasPaidBefore] Error loading paid bookings:", error);
      setHasPaidBefore(false);
      return false;
    }

    const hasPaid = !!(data && data.length > 0);
    console.log("[hasPaidBefore] Result =", hasPaid, "Raw data:", data);
    setHasPaidBefore(hasPaid);
    return hasPaid;
  }

  async function handleLogout() {
  console.log("[Logout] Logging out user...");

  try {
    // Sign out from Supabase (optional depending on your auth)
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("[Logout] Supabase logout error:", error);
    }

    // Clear your stored user ID
    localStorage.removeItem("currentUserId");
    console.log("[Logout] Cleared localStorage user data.");

    // Redirect
    window.location.href = "/login";
  } catch (err) {
    console.error("[Logout] Unexpected error:", err);
  }
}


  // -----------------------------
  // Upcoming days (6 days ahead)
  // -----------------------------
  // function generateUpcomingDays() {
  //   const days = [];
  //   const today = new Date();

  //   for (let i = 0; i < DAYS_AHEAD; i++) {
  //     const d = new Date(today);
  //     d.setDate(today.getDate() + i);

  //     days.push({
  //       date: d.toISOString().split("T")[0],
  //       label: d.toLocaleDateString("en-US", {
  //         weekday: "long",
  //         month: "short",
  //         day: "numeric",
  //       }),
  //     });
  //   }

  //   return days;
  // }

  // const upcomingDays = generateUpcomingDays();
// Load Medicare details if user has at least one paid booking
useEffect(() => {
  async function loadMedicareDetails() {
    if (hasPaidBefore !== true) return; // only show after first paid booking

    const userId = localStorage.getItem("currentUserId");
    if (!userId) return;

    setLoadingMedicare(true);
    console.log("[Medicare] Loading medicare details for user:", userId);

    const { data, error } = await supabase
      .from("medicare_details")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("[Medicare] Error loading medicare details:", error);
    } else if (data) {
      console.log("[Medicare] Medicare found:", data);
      setMedicareNumber(data.medicare_number || "");
      setReferenceNumber(data.reference_number || "");
      setMedicareExpiry(data.expiry_date || "");
    }

    setLoadingMedicare(false);
  }

  loadMedicareDetails();
}, [hasPaidBefore]);

async function saveMedicareDetails() {
  const userId = localStorage.getItem("currentUserId");
  if (!userId) {
    alert("Please login first.");
    return;
  }

  console.log("[Medicare] Saving details:", {
    medicareNumber,
    referenceNumber,
    medicareExpiry
  });

  if (!medicareNumber || !referenceNumber || !medicareExpiry) {
    alert("Please fill all Medicare fields.");
    return;
  }

  setSavingMedicare(true);

  const { data, error } = await supabase
    .from("medicare_details")
    .upsert(
      {
        user_id: userId,
        medicare_number: medicareNumber,
        reference_number: referenceNumber,
        expiry_date: medicareExpiry
      },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  setSavingMedicare(false);

  if (error) {
    console.error("[Medicare] Save error:", error);
    alert("Could not save Medicare details.");
    return;
  }

  console.log("[Medicare] Saved successfully:", data);
  alert("Medicare details saved successfully.");
}

  // -----------------------------
  // Time slots 5:00–12:30
  // -----------------------------
  function generateTimes() {
    const times: string[] = [];
    let hour = 9;
    let minute = 0;

    while (hour < 17 || (hour === 17 && minute <= 30)) {
      const h = hour % 12 || 12;
      const ampm = hour < 12 ? "AM" : "PM";
      const formatted = `${h}:${minute === 0 ? "00" : minute} ${ampm}`;
      times.push(formatted);

      minute += 30;
      if (minute === 60) {
        minute = 0;
        hour++;
      }
    }

    return times;
  }

  const timeSlots = generateTimes();

  // -----------------------------
  // Load providers
  // -----------------------------
  useEffect(() => {
    const loadProviders = async () => {
      console.log("[loadProviders] Fetching providers...");
      const { data, error } = await supabase.from("providers").select("*");
      if (error) {
        console.error("[loadProviders] Error loading providers", error);
        return;
      }
      console.log("[loadProviders] Providers loaded:", data);
      setProviders((data || []) as Provider[]);
    };

    loadProviders();
  }, []);

  // -----------------------------
  // On mount, check if user has paid before (follow-up logic)
  // -----------------------------
  useEffect(() => {
    fetchHasPaidBefore();
  }, []);

  // -----------------------------
  // Load last programme for user
  // -----------------------------
  useEffect(() => {
    async function loadProgramme() {
      const userId = localStorage.getItem("currentUserId");
      console.log("[loadProgramme] Loaded user id:", userId);

      if (!userId) return;

      const { data, error } = await supabase
        .from("answers")
        .select("programme")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("[loadProgramme] Error loading programme", error);
        return;
      }

      console.log("[loadProgramme] Programme data:", data);
      if (data?.programme) {
        setProgramme(data.programme);
      }
    }

    loadProgramme();
  }, []);

  // -----------------------------
  // Load booked & off days
  // -----------------------------
  useEffect(() => {
    if (!selectedProvider) {
      console.log("[loadData] No provider selected yet.");
      return;
    }

    const loadData = async () => {
      console.log(
        "[loadData] Loading bookings and off days for provider:",
        selectedProvider.id
      );

      // booked slots
      const { data: booked, error: bookedErr } = await supabase
        .from("bookings")
        .select("*")
        .eq("provider_id", selectedProvider.id);

      if (bookedErr) {
        console.error("[loadData] Error loading bookings", bookedErr);
      } else {
        console.log("[loadData] Booked slots:", booked);
      }
      setBookedSlots(booked || []);

      // off days
      const { data: off, error: offErr } = await supabase
        .from("doctor_off_days")
        .select("off_date")
        .eq("provider_id", selectedProvider.id);

      if (offErr) console.error("[loadData] Error loading off days", offErr);
      else console.log("[loadData] Off days:", off);

      setOffDays(off || []);
    };

    loadData();
  }, [selectedProvider]);

  // -----------------------------
  // Load future appointments and suggestions
  // -----------------------------
  useEffect(() => {
    async function loadNextAppointment() {
      const userId = localStorage.getItem("currentUserId");
      if (!userId) return;

      console.log("[loadNextAppointment] Fetching next suggested appointment");
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", userId)
        .not("next_appointment_date", "is", null)
        .order("next_appointment_date", { ascending: true })
        .limit(1);

      if (error) {
        console.error("[loadNextAppointment] Error:", error);
        return;
      }

      console.log("[loadNextAppointment] Data:", data);
      if (data && data.length > 0) {
        setNextAppointment(data[0]);
      }
    }

    loadNextAppointment();
  }, []);

  useEffect(() => {
    async function loadUpcomingAppointment() {
      const userId = localStorage.getItem("currentUserId");
      if (!userId) return;

      const today = new Date().toISOString().split("T")[0];

      console.log("[loadUpcomingAppointment] Fetching upcoming paid appointment");
      const { data, error } = await supabase
        .from("bookings")
        .select(
          `
        *,
        providers(name)
      `
        )
        .eq("user_id", userId)
        .eq("appointment_status", "upcoming")
        .eq("payment_status", "paid")
        .gte("date", today)
        .order("date", { ascending: true })
        .limit(1);

      if (error) {
        console.error("[loadUpcomingAppointment] Error:", error);
        return;
      }

      console.log("[loadUpcomingAppointment] Data:", data);
      if (data?.length > 0) {
        setUpcomingAppointment(data[0]);
      }
    }

    loadUpcomingAppointment();
  }, []);

  // -----------------------------
  // Filter off days
  // -----------------------------
  // const availableDays = upcomingDays.filter(
  //   (day) => !offDays.some((o) => o.off_date === day.date)
  // );
  // console.log("[availableDays] Filtered available days:", availableDays);

  // -----------------------------
  // Times that are not booked (only hide PAID bookings)
  // -----------------------------
  function getAvailableTimes(date: string) {
    const times = timeSlots.filter(
      (t) =>
        !bookedSlots.some(
          (b) =>
            b.date === date &&
            b.time === t &&
            b.payment_status === "paid" // hide only paid slots
        )
    );
    console.log(
      "[getAvailableTimes] date:",
      date,
      "availableTimes:",
      times,
      "bookedSlots:",
      bookedSlots
    );
    return times;
  }

  // -----------------------------
  // Open confirm modal when slot clicked
  // -----------------------------
  function openConfirmModal(date: string, time: string) {
    console.log("[openConfirmModal] Clicked slot:", { date, time });

    if (!selectedProvider) {
      alert("Please select a provider first.");
      return;
    }

    const userId = localStorage.getItem("currentUserId");
    if (!userId) {
      alert("Please login first.");
      window.location.href = "/login";
      return;
    }

    setSelectedSlot({ date, time });
    setShowConfirmModal(true);
  }

  // -----------------------------
  // Confirm & create booking
  // -----------------------------
  async function handleConfirmAndContinue() {
    try {
      const userId = localStorage.getItem("currentUserId");
      console.log("[handleConfirmAndContinue] userId:", userId);
      console.log(
        "[handleConfirmAndContinue] selectedProvider:",
        selectedProvider
      );
      console.log("[handleConfirmAndContinue] selectedSlot:", selectedSlot);

      if (!userId || !selectedProvider || !selectedSlot) return;

      const { error } = await supabase.from("bookings").insert({
        provider_id: selectedProvider.id,
        user_id: userId,
        date: selectedSlot.date,
        time: selectedSlot.time,
        notes,
        programme,
      });

      if (error) {
        console.error("[handleConfirmAndContinue] Error creating booking:", error);
        alert("Could not create booking. Please try again.");
        return;
      }

      console.log("[handleConfirmAndContinue] Booking inserted successfully");
      setShowConfirmModal(false);
      setShowPaymentModal(true);
    } catch (err) {
      console.error("[handleConfirmAndContinue] Unexpected error:", err);
      alert("Unexpected error. Please try again.");
    }
  }

  // -----------------------------
  // Stripe payment
  // -----------------------------
  async function handleStripePayment() {
    if (!programme || !selectedSlot || !selectedProvider) {
      console.warn(
        "[handleStripePayment] Missing data:",
        programme,
        selectedSlot,
        selectedProvider
      );
      return;
    }

    setPaymentLoading(true);
    setPaymentError("");

    try {
      const stripe = await stripePromise;
      if (!stripe) {
        console.error("[handleStripePayment] Stripe not loaded.");
        setPaymentError("Stripe not loaded. Check your key.");
        setPaymentLoading(false);
        return;
      }

      // Always re-check DB for safety
      const paidBefore = await fetchHasPaidBefore();
      const meta = PROGRAM_DATA[programme];
      const basePrice = parseInt(meta.price, 10);
      const finalPrice = paidBefore ? 69 : basePrice;

      console.log("[handleStripePayment] meta:", meta);
      console.log(
        "[handleStripePayment] paidBefore:",
        paidBefore,
        "basePrice:",
        basePrice,
        "finalPrice:",
        finalPrice
      );

      const amountCents = finalPrice * 100;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: amountCents,
            currency: meta.currency.toLowerCase(),
            programme,
            slot: selectedSlot,
            providerId: selectedProvider.id,
          }),
        }
      );

      const data = await response.json();
      console.log("[handleStripePayment] Checkout response:", data);

      if (!response.ok || !data.url || !data.sessionId) {
        console.error("[handleStripePayment] Stripe session error", data);
        setPaymentError(
          data.error || "Could not start payment. Please try again."
        );
        setPaymentLoading(false);
        return;
      }

      // ⭐ Store session_id into the booking NOW
      const userId = localStorage.getItem("currentUserId");
      console.log("[handleStripePayment] Updating booking with session_id");

      await supabase
        .from("bookings")
        .update({ session_id: data.sessionId })
        .eq("provider_id", selectedProvider.id)
        .eq("user_id", userId)
        .eq("date", selectedSlot.date)
        .eq("time", selectedSlot.time);

      // ⭐ Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err: any) {
      console.error("[handleStripePayment] Unexpected error:", err);
      setPaymentError("Unexpected error while starting payment.");
    } finally {
      setPaymentLoading(false);
    }
  }

  // -----------------------------
  // Render helpers
  // -----------------------------
  const programmeMeta = programme ? PROGRAM_DATA[programme] : null;

  // Final price used for UI (summary + modals)
  let uiFinalPrice: number | null = null;
  if (programmeMeta) {
    const base = parseInt(programmeMeta.price, 10);
    uiFinalPrice = hasPaidBefore ? 69 : base;
  }
  console.log(
    "[render] hasPaidBefore:",
    hasPaidBefore,
    "programmeMeta:",
    programmeMeta,
    "uiFinalPrice:",
    uiFinalPrice
  );

  return (
    <div className="appointment-wrapper">
      <div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "15px",
  }}
>
  <button
    onClick={handleLogout}
    style={{
      background: "#d9534f",
      color: "white",
      padding: "8px 16px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
    }}
  >
    Logout
  </button>
</div>

      <h1 className="app-title">Aropranish Clinic</h1>

      {/* Progress Section */}
      <div className="progress-box">
        <div className="progress-top">
          <span>Setup Progress</span>
          <span className="step-number">Step 2 of 2</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" />
        </div>
        <div className="progress-labels">
          <span>Account</span>
          <span className="verified">Verified</span>
          <span>Booking</span>
        </div>
      </div>

      {/* Programme Summary */}
      <div className="program-box">
        <div className="program-left">
          {programmeMeta ? (
            <>
              <strong>{programmeMeta.title}</strong>
              <span className="green-tag">Selected Programme</span>
            </>
          ) : (
            <strong>Loading...</strong>
          )}
        </div>
        <div className="program-price">
          {programmeMeta
            ? `$${uiFinalPrice !== null ? uiFinalPrice : programmeMeta.price}`
            : "..."}
        </div>
      </div>
{/*  Three Blocks in One Row  */}
<div
  style={{
    display: "flex",
    gap: "20px",
    marginTop: "25px",
    marginBottom: "25px",
    flexWrap: "wrap",
  }}
>
  {/*  Medicare Details Block  */}
  {hasPaidBefore === true && (
    <div
      style={{
        background: "#f4f7f4",
        borderLeft: "6px solid #0b8a5f",
        padding: "20px",
        borderRadius: "10px",
        flex: "1",
        minWidth: "350px",
      }}
    >
      <h3 style={{ marginBottom: "10px" }}>Medicare Details</h3>

      {loadingMedicare ? (
        <p>Loading Medicare details...</p>
      ) : (
        <>
          <label className="modal-label">Medicare Number</label>
          <input
            className="q-input"
            value={medicareNumber}
            onChange={(e) => setMedicareNumber(e.target.value)}
            placeholder={medicareNumber || "1234 56789 1"}
            style={{ marginBottom: "12px" }}
          />

          <label className="modal-label">Reference Number</label>
          <input
            className="q-input"
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            placeholder={referenceNumber || "Ref No"}
            style={{ marginBottom: "12px" }}
          />

          <label className="modal-label">Expiry Date</label>
          <input
            type="month"
            className="q-input"
            value={medicareExpiry}
            onChange={(e) => setMedicareExpiry(e.target.value)}
            placeholder={medicareExpiry || "dd/mm/yyyy"}
            style={{ marginBottom: "20px" }}
          />

          <button
            className="btn-primary"
            onClick={saveMedicareDetails}
            disabled={savingMedicare}
          >
            {savingMedicare ? "Saving..." : "Save Medicare Details"}
          </button>
        </>
      )}
    </div>
  )}

  {/*  Upcoming Appointment Block  */}
  {upcomingAppointment && (
    <div
      style={{
        background: "#fff3cd",
        padding: "20px",
        borderRadius: "10px",
        borderLeft: "6px solid #ffcc00",
        flex: "1",
        minWidth: "350px",
      }}
    >
      <h3>Your Upcoming Appointment</h3>
      <p>
        📅 <strong>{upcomingAppointment.date}</strong>
        <br />
        ⏰ <strong>{upcomingAppointment.time}</strong>
      </p>

      <p style={{ marginTop: "10px" }}>
        Provider: <strong>{upcomingAppointment.providers?.name}</strong>
      </p>
    </div>
  )}

  {/*  Next Suggested Appointment  */}
  {nextAppointment && (
    <div
      style={{
        background: "#e8f8f0",
        padding: "20px",
        borderRadius: "10px",
        borderLeft: "6px solid #0b8a5f",
        flex: "1",
        minWidth: "350px",
      }}
    >
      <h3>Next Suggested Appointment</h3>

      <p>
        📅 <strong>{nextAppointment.next_appointment_date}</strong>
      </p>

      <button
        onClick={() => {
          console.log("[NextSuggested] Button clicked", nextAppointment);
          const d = nextAppointment.next_appointment_date;

          const p = providers.find(
            (p) => p.id === nextAppointment.provider_id
          );
          setSelectedProvider(p || null);

          setSelectedSlot({
            date: d,
            time: nextAppointment.time || "",
          });

          window.scrollTo({ top: 500, behavior: "smooth" });
        }}
        style={{
          marginTop: "10px",
          background: "#0b8a5f",
          color: "white",
          padding: "10px 16px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Book This Appointment
      </button>
    </div>
  )}
</div>


      {/* Main grid */}
      <div className="appointment-grid">
        {/* Provider box */}
        <div className="provider-box">
          <h4>Select Provider</h4>
          <p>Choose your healthcare professional</p>

          <select
            className="provider-select"
            value={selectedProvider?.id || ""}
            onChange={(e) => {
              const provider = providers.find(
                (p) => p.id === Number(e.target.value)
              );
              console.log("[ProviderSelect] Selected provider:", provider);
              setSelectedProvider(provider || null);
            }}
          >
            <option value="">Select healthcare provider...</option>
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Calendar box */}
        <div className="calendar-box">
  <h4>Available Appointments (Australian Western Standard Time)</h4>

  {/* DATE PICKER */}
  <div style={{ marginBottom: "20px" }}>
    <label style={{ fontWeight: 600 }}>Choose your appointment date</label>
    <input
      type="date"
      className="q-input"
      style={{
        marginTop: "8px",
        padding: "10px",
        fontSize: "15px",
        borderRadius: "8px",
        border: "1px solid #ccc",
      }}
      min={new Date().toISOString().split("T")[0]} // cannot pick past dates
      value={selectedDate}
      onChange={(e) => {
        const d = e.target.value;
        console.log("[Date Picker] Selected:", d);

        // Block OFF DAYS
        if (offDays.some((o) => o.off_date === d)) {
          alert("Doctor is unavailable on this date.");
          return;
        }

        setSelectedDate(d);
      }}
    />
  </div>

  {!selectedProvider && (
    <p className="placeholder-msg">
      Select a provider to view available times.
    </p>
  )}



          {/* {selectedProvider && (
            <div className="calendar-list">
              {availableDays.map((day) => {
                const times = getAvailableTimes(day.date);

                return (
                  <div key={day.date} className="slot-row">
                    <div className="slot-date">{day.label}</div>
                    <div className="slot-times">
                      {times.length > 0 ? (
                        times.map((t) => (
                          <button
                            key={t}
                            className="time-btn"
                            onClick={() => openConfirmModal(day.date, t)}
                          >
                            {t}
                          </button>
                        ))
                      ) : (
                        <span className="no-slots">No slots available</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )} */}
          {/* SHOW SLOTS ONLY WHEN DATE + PROVIDER ARE SELECTED */}
{selectedProvider && selectedDate && (
  <div className="calendar-list">
    <div className="slot-row">
      <div className="slot-date">
        {new Date(selectedDate).toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
        })}
      </div>

      <div className="slot-times">
        {getAvailableTimes(selectedDate).length > 0 ? (
          getAvailableTimes(selectedDate).map((t) => (
            <button
              key={t}
              className="time-btn"
              onClick={() => openConfirmModal(selectedDate, t)}
            >
              {t}
            </button>
          ))
        ) : (
          <span className="no-slots">No slots available</span>
        )}
      </div>
    </div>
  </div>
)}

        </div>
      </div>

      {/* ---------------- CONFIRM MODAL ---------------- */}
      {showConfirmModal && selectedSlot && selectedProvider && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h2>Confirm Your Appointment</h2>
              <button
                className="modal-close"
                onClick={() => setShowConfirmModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-section doctor-section">
              <div className="doctor-avatar">👤</div>
              <div>
                <div className="doctor-name">{selectedProvider.name}</div>
                <div className="doctor-role">doctor</div>
              </div>
            </div>

            <div className="modal-section details-section">
              <p>
                <strong>Date: </strong>
                {new Date(selectedSlot.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p>
                <strong>Time: </strong>
                {selectedSlot.time} (AWST)
              </p>
              <p>
                <strong>Duration: </strong>30 minutes
              </p>
            </div>

            <div className="modal-section">
              <label className="modal-label">
                Notes for Provider (Optional)
              </label>
              <textarea
                className="modal-textarea"
                placeholder="Describe your symptoms or reason for visit..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <small className="modal-helper">
                Add any relevant information about your appointment.
              </small>
            </div>

            <div className="modal-section payment-note">
              <strong>Payment Required:</strong>
              <p>
                A {programmeMeta?.title ?? "programme"} consultation fee of $
                {uiFinalPrice !== null
                  ? uiFinalPrice
                  : programmeMeta?.price}{" "}
                will be charged to confirm this appointment.
              </p>
            </div>

            <div className="modal-section after-note">
              After confirming your appointment, you&apos;ll be taken to your
              patient dashboard where you can manage all your healthcare needs.
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleConfirmAndContinue}
              >
                Confirm &amp; Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- PAYMENT MODAL ---------------- */}
      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal-box small">
            <div className="modal-header">
              <h2>Secure Payment</h2>
              <button
                className="modal-close"
                onClick={() => setShowPaymentModal(false)}
              >
                ×
              </button>
            </div>

            <p className="payment-amount">
              Amount: $
              {uiFinalPrice !== null
                ? uiFinalPrice
                : programmeMeta?.price}{" "}
              {programmeMeta?.currency}
            </p>

            <div className="payment-banner">
              Your payment details are securely processed by Stripe.
            </div>

            {paymentError && (
              <div className="payment-error">{paymentError}</div>
            )}

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleStripePayment}
                disabled={paymentLoading}
              >
                {paymentLoading
                  ? "Processing..."
                  : `Pay $${
                      uiFinalPrice !== null
                        ? uiFinalPrice
                        : programmeMeta?.price
                    }`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
