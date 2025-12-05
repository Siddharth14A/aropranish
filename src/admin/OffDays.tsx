// src/admin/OffDays.tsx

import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

interface Provider {
  id: number;
  name: string;
  job_title: string | null;
}

interface OffDay {
  id: number;
  provider_id: number;
  off_date: string;
}

export default function OffDays() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(
    null
  );
  const [offDays, setOffDays] = useState<OffDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProviders();
  }, []);

  useEffect(() => {
    if (selectedProviderId !== null) {
      loadOffDays(selectedProviderId);
    }
  }, [selectedProviderId]);

  async function loadProviders() {
    const { data, error } = await supabase.from("providers").select("*");
    if (error) {
      console.error("Error loading providers", error);
      return;
    }
    setProviders(data || []);
    if (data && data.length > 0) {
      setSelectedProviderId(data[0].id);
    }
  }

  async function loadOffDays(providerId: number) {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("doctor_off_days")
        .select("*")
        .eq("provider_id", providerId)
        .order("off_date", { ascending: true });

      if (error) {
        console.error("Error loading off days", error);
        return;
      }
      setOffDays(data || []);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkOffDay() {
    if (!selectedProviderId || !selectedDate) return;

    // check if already off
    const exists = offDays.some((d) => d.off_date === selectedDate);
    if (exists) {
      alert("This date is already marked as off for this doctor.");
      return;
    }

    const { error } = await supabase.from("doctor_off_days").insert({
      provider_id: selectedProviderId,
      off_date: selectedDate,
    });

    if (error) {
      console.error("Error inserting off day", error);
      alert("Could not mark off day.");
      return;
    }

    loadOffDays(selectedProviderId);
    setSelectedDate("");
  }

  async function handleRemoveOffDay(date: string) {
    if (!selectedProviderId) return;

    const { error } = await supabase
      .from("doctor_off_days")
      .delete()
      .eq("provider_id", selectedProviderId)
      .eq("off_date", date);

    if (error) {
      console.error("Error deleting off day", error);
      alert("Could not remove off day.");
      return;
    }

    loadOffDays(selectedProviderId);
  }

  return (
    <>
      <h1>Doctor Off Days</h1>

      <div style={{ marginTop: 20, marginBottom: 20, display: "flex", gap: 20 }}>
        <div>
          <label style={{ fontWeight: 600 }}>Select Doctor: </label>
          <select
            value={selectedProviderId || ""}
            onChange={(e) =>
              setSelectedProviderId(
                e.target.value ? Number(e.target.value) : null
              )
            }
            style={{ padding: 6, borderRadius: 6 }}
          >
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.job_title ? `(${p.job_title})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontWeight: 600 }}>Pick Date: </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ padding: 6, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>

        <button
          onClick={handleMarkOffDay}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            border: "none",
            background: "#0b8a5f",
            color: "white",
            cursor: "pointer",
            alignSelf: "flex-end",
          }}
        >
          Mark as Off Day
        </button>
      </div>

      {loading ? (
        <p>Loading off days...</p>
      ) : (
        <div
          style={{
            background: "white",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          }}
        >
          <h3>Off Days for Selected Doctor</h3>
          {offDays.length === 0 ? (
            <p>No off days set.</p>
          ) : (
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {offDays.map((d) => (
                <li
                  key={d.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <span>{d.off_date}</span>
                  <button
                    onClick={() => handleRemoveOffDay(d.off_date)}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 6,
                      border: "none",
                      background: "#e63946",
                      color: "white",
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}
