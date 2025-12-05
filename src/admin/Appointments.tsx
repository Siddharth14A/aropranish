// src/admin/Appointments.tsx

import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

interface Booking {
  id: number;
  provider_id: number;
  user_id: string;
  date: string;
  time: string;
  notes: string | null;
  programme: string | null;
  payment_status: string | null;
  session_id: string | null;
}

interface Provider {
  id: number;
  name: string;
  job_title: string | null;
}

interface UserInfo {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
}

export default function Appointments() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [providers, setProviders] = useState<Record<number, Provider>>({});
  const [users, setUsers] = useState<Record<string, UserInfo>>({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(""); // yyyy-mm-dd
  const [answersMap, setAnswersMap] = useState<Record<string, any>>({});
const [showAnswersModal, setShowAnswersModal] = useState(false);
const [selectedAnswers, setSelectedAnswers] = useState<any>(null);
const [selectedBooking, setSelectedBooking] = useState(null);
const [nextDate, setNextDate] = useState("");
const [showNextModal, setShowNextModal] = useState(false);
const [medicareMap, setMedicareMap] = useState<Record<string, any>>({});
const [showMedicareModal, setShowMedicareModal] = useState(false);
const [selectedMedicare, setSelectedMedicare] = useState<any>(null);




  useEffect(() => {
    // default: next 6 days
    loadBookingsForRange();
  }, []);

  async function loadBookingsForRange() {
    setLoading(true);
    try {
      const today = new Date();
      const end = new Date();
      end.setDate(today.getDate() + 6);

      const startStr = today.toISOString().split("T")[0];
      const endStr = end.toISOString().split("T")[0];

      const { data: bData, error } = await supabase
        .from("bookings")
        .select("*")
        .gte("date", startStr)
        .lte("date", endStr)
        .order("date", { ascending: true })
        .order("time", { ascending: true });

      if (error) {
        console.error("Error loading bookings", error);
        setLoading(false);
        return;
      }

      await hydrateRelated(bData || []);
    } finally {
      setLoading(false);
    }
  }

  async function loadBookingsForDate(dateStr: string) {
    setLoading(true);
    try {
      const { data: bData, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("date", dateStr)
        .order("time", { ascending: true });

      if (error) {
        console.error("Error loading bookings", error);
        setLoading(false);
        return;
      }

      await hydrateRelated(bData || []);
    } finally {
      setLoading(false);
    }
  }

async function hydrateRelated(bData: Booking[]) {
  setBookings(bData);

  // collect provider IDs & user IDs
  const providerIds = Array.from(new Set(bData.map((b) => b.provider_id)));
  const userIds = Array.from(new Set(bData.map((b) => b.user_id)));

  // ---- Load Providers ----
  if (providerIds.length) {
    const { data: pData } = await supabase
      .from("providers")
      .select("*")
      .in("id", providerIds);
    const pMap: Record<number, Provider> = {};
    (pData || []).forEach((p) => (pMap[p.id] = p));
    setProviders(pMap);
  }

  // ---- Load Users ----
  if (userIds.length) {
    const { data: uData } = await supabase
      .from("user_info")
      .select("*")
      .in("id", userIds);
    const uMap: Record<string, UserInfo> = {};
    (uData || []).forEach((u) => (uMap[u.id] = u));
    setUsers(uMap);
  }

  // ---- Load Questionnaire Answers ----
  if (userIds.length) {
    const { data: aData } = await supabase
      .from("answers")
      .select("*")
      .in("user_id", userIds);

    const aMap: Record<string, any> = {};
    (aData || []).forEach((a) => {
      aMap[a.user_id] = a;
    });
    setAnswersMap(aMap);
  }
  // ---- Load Medicare Details ----
if (userIds.length) {
  const { data: mData } = await supabase
    .from("medicare_details")
    .select("*")
    .in("user_id", userIds);

  const mMap: Record<string, any> = {};
  (mData || []).forEach((m) => (mMap[m.user_id] = m));
  setMedicareMap(mMap);
}

}


  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSelectedDate(value);
    if (value) {
      loadBookingsForDate(value);
    } else {
      loadBookingsForRange();
    }
  }

  function formatPaymentStatus(status: string | null) {
    if (status === "paid") return "Paid";
    if (!status) return "Pending";
    return status;
  }

  return (
    <>
      <h1>Appointments</h1>

      {/* Filter bar */}
      <div
        style={{
          marginTop: 20,
          marginBottom: 20,
          display: "flex",
          gap: 20,
          alignItems: "center",
        }}
      >
        <div>
          <label style={{ fontWeight: 600 }}>Filter by date: </label>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            style={{ padding: 6, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>
        <button
          onClick={loadBookingsForRange}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            border: "none",
            background: "#0b8a5f",
            color: "white",
            cursor: "pointer",
          }}
        >
          Next 6 Days
        </button>
      </div>

      {loading ? (
        <p>Loading appointments...</p>
      ) : bookings.length === 0 ? (
        <p>No appointments found for this range.</p>
      ) : (
        <div
          style={{
            background: "white",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #e0e0e0" }}>
                <th style={{ padding: 10 }}>Date</th>
                <th style={{ padding: 10 }}>Time</th>
                <th style={{ padding: 10 }}>Patient</th>
                <th style={{ padding: 10 }}>Phone</th>
                <th style={{ padding: 10 }}>Programme</th>
                <th style={{ padding: 10 }}>Answers</th>
                <th style={{ padding: 10 }}>Medicare</th>

                <th style={{ padding: 10 }}>Provider</th>
                <th style={{ padding: 10 }}>Payment</th>
                <th style={{ padding: 10 }}>Notes</th>
                <th style={{ padding: 10 }}>Next Appointment</th>

              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const provider = providers[b.provider_id];
                const user = users[b.user_id];

                const patientName = user
                  ? `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
                    user.email ||
                    b.user_id
                  : b.user_id;

                return (
                  <tr key={b.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: 10 }}>{b.date}</td>
                    <td style={{ padding: 10 }}>{b.time}</td>
                    <td style={{ padding: 10 }}>{patientName}</td>
                    <td style={{ padding: 10 }}>
                        {user?.phone || <span style={{ color: "#aaa" }}>N/A</span>}
                    </td>
                    <td style={{ padding: 10 }}>{b.programme}</td>
                    <td style={{ padding: 10 }}>
  <button
    onClick={() => {
      setSelectedAnswers(answersMap[b.user_id]);
      setShowAnswersModal(true);
    }}
    style={{
      padding: "6px 12px",
      borderRadius: 6,
      border: "none",
      background: "#0b8a5f",
      color: "white",
      cursor: "pointer",
      fontSize: 12,
    }}
  >
    View Answers
  </button>
</td>
<td style={{ padding: 10 }}>
  {medicareMap[b.user_id] ? (
    <button
      onClick={() => {
        setSelectedMedicare(medicareMap[b.user_id]);
        setShowMedicareModal(true);
      }}
      style={{
        padding: "6px 12px",
        borderRadius: 6,
        border: "none",
        background: "#0b8a5f",
        color: "white",
        cursor: "pointer",
        fontSize: 12,
      }}
    >
      View Medicare
    </button>
  ) : (
    <span style={{ color: "#aaa" }}>No data</span>
  )}
</td>


                    <td style={{ padding: 10 }}>
                      {provider ? provider.name : b.provider_id}
                    </td>
                    <td style={{ padding: 10 }}>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: 999,
                          fontSize: 12,
                          background:
                            b.payment_status === "paid" ? "#e0f7ec" : "#fde7e7",
                          color:
                            b.payment_status === "paid" ? "#0b8a5f" : "#b22222",
                        }}
                      >
                        {formatPaymentStatus(b.payment_status)}
                      </span>
                    </td>
                    <td style={{ padding: 10 }}>
                      {b.notes ? b.notes : <span style={{ color: "#aaa" }}>-</span>}
                    </td>
                     <td style={{ padding: 10 }}>
      {(!b.next_appointment_date && b.appointment_status !== "completed") ? (
        <button
          onClick={() => {
            setSelectedBooking(b);
            setShowNextModal(true);
          }}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "none",
            background: "#0b8a5f",
            color: "white",
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          Mark Done & Add Next Date
        </button>
      ) : (
        <span style={{ color: "#888", fontSize: 13 }}>Next date set</span>
      )}
    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
          {showAnswersModal && selectedAnswers && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
      style={{
        background: "white",
        padding: 30,
        borderRadius: 12,
        width: "500px",
        maxHeight: "80vh",
        overflowY: "auto",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      }}
    >
      <h2>Patient Answers</h2>

      <p>
        <strong>Programme:</strong> {selectedAnswers.programme}
      </p>

      <div style={{ marginTop: 20 }}>
        {Object.entries(selectedAnswers.answers || {}).map(
          ([question, answer]: any) => (
            <div
              key={question}
              style={{
                marginBottom: 15,
                paddingBottom: 10,
                borderBottom: "1px solid #eee",
              }}
            >
              <p style={{ fontWeight: 600 }}>{question}</p>
              <p style={{ marginTop: 5 }}>{String(answer)}</p>
            </div>
          )
        )}
      </div>

      <button
        onClick={() => setShowAnswersModal(false)}
        style={{
          marginTop: 20,
          padding: "8px 16px",
          background: "#0b8a5f",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Close
      </button>
    </div>
  </div>
)}
{showNextModal && selectedBooking && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
      style={{
        background: "white",
        padding: 25,
        borderRadius: 12,
        width: 400,
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      <h2>Complete Appointment</h2>

      <p>
        Mark <strong>{selectedBooking.date}</strong> appointment as done.
      </p>

      <label>Next Appointment Date:</label>
      <input
        type="date"
        value={nextDate}
        onChange={(e) => setNextDate(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginTop: 10,
          marginBottom: 20,
          borderRadius: 6,
          border: "1px solid #ccc",
        }}
      />

      <button
        onClick={async () => {
          const { error } = await supabase
            .from("bookings")
            .update({
              appointment_status: "completed",
              next_appointment_date: nextDate,
            })
            .eq("id", selectedBooking.id);

          if (error) {
            alert("Error updating appointment");
            return;
          }

          setShowNextModal(false);
          setNextDate("");
          loadBookingsForRange(); // refresh table
        }}
        style={{
          width: "100%",
          background: "#0b8a5f",
          color: "white",
          padding: 12,
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontSize: 14,
        }}
      >
        Save
      </button>

      <button
        onClick={() => setShowNextModal(false)}
        style={{
          width: "100%",
          marginTop: 10,
          background: "#ccc",
          color: "#333",
          padding: 10,
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Cancel
      </button>
    </div>
  </div>
)}
{showMedicareModal && selectedMedicare && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.45)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    }}
  >
    <div
      style={{
        background: "white",
        padding: 25,
        borderRadius: 12,
        width: 400,
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      <h2>Medicare Details</h2>

      <div style={{ marginTop: 15, lineHeight: 1.7 }}>
        <p>
          <strong>Medicare Number:</strong>{" "}
          {selectedMedicare.medicare_number}
        </p>
        <p>
          <strong>Reference Number:</strong>{" "}
          {selectedMedicare.reference_number}
        </p>
        <p>
          <strong>Expiry Date:</strong>{" "}
          {selectedMedicare.expiry_date}
        </p>
      </div>

      <button
        onClick={() => setShowMedicareModal(false)}
        style={{
          marginTop: 20,
          padding: "10px 16px",
          background: "#0b8a5f",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          width: "100%",
        }}
      >
        Close
      </button>
    </div>
  </div>
)}


        </div>
      )}
    </>
  );
}
