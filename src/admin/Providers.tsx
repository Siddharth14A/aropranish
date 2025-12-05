// src/admin/Providers.tsx

import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

interface Provider {
  id: number;
  name: string;
  job_title: string | null;
}

export default function Providers() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [appointmentsCount, setAppointmentsCount] = useState<
    Record<number, number>
  >({});
  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  useEffect(() => {
    loadProviders();
  }, []);

  async function loadProviders() {
    const { data, error } = await supabase.from("providers").select("*");
    if (error) {
      console.error("Error loading providers", error);
      return;
    }
    setProviders(data || []);

    // load appointment counts
    const { data: bookings } = await supabase
      .from("bookings")
      .select("provider_id");

    const map: Record<number, number> = {};
    (bookings || []).forEach((b: any) => {
      map[b.provider_id] = (map[b.provider_id] || 0) + 1;
    });
    setAppointmentsCount(map);
  }

  async function handleAddProvider(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const { error } = await supabase.from("providers").insert({
      name,
      job_title: jobTitle || null,
    });

    if (error) {
      console.error("Error adding provider", error);
      alert("Could not add provider");
      return;
    }

    setName("");
    setJobTitle("");
    loadProviders();
  }

  return (
    <>
      <h1>Providers</h1>

      {/* Add provider form */}
      <form
        onSubmit={handleAddProvider}
        style={{
          marginTop: 20,
          marginBottom: 30,
          display: "flex",
          gap: 10,
          alignItems: "flex-end",
        }}
      >
        <div>
          <label style={{ fontWeight: 600 }}>Name</label>
          <br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              padding: 8,
              borderRadius: 6,
              border: "1px solid #ccc",
              minWidth: 200,
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 600 }}>Job Title</label>
          <br />
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            style={{
              padding: 8,
              borderRadius: 6,
              border: "1px solid #ccc",
              minWidth: 200,
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            border: "none",
            background: "#0b8a5f",
            color: "white",
            cursor: "pointer",
          }}
        >
          Add Provider
        </button>
      </form>

      {/* Provider list */}
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
              <th style={{ padding: 10 }}>Name</th>
              <th style={{ padding: 10 }}>Job Title</th>
              <th style={{ padding: 10 }}>Total Appointments</th>
            </tr>
          </thead>
          <tbody>
            {providers.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: 10 }}>
                  No providers found.
                </td>
              </tr>
            ) : (
              providers.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: 10 }}>{p.name}</td>
                  <td style={{ padding: 10 }}>
                    {p.job_title || <span style={{ color: "#aaa" }}>-</span>}
                  </td>
                  <td style={{ padding: 10 }}>
                    {appointmentsCount[p.id] || 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
