import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function MedicalCertificates() {
  const [certs, setCerts] = useState<any[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCertificates();
  }, []);

  async function loadCertificates() {
    setLoading(true);

    // 1️⃣ Fetch only medical-certificate bookings
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("programme", "medical-certificate")
      .order("id", { ascending: false }); // ⬅️ changed from created_at

    if (error) {
      console.error("LOAD ERROR:", error);
      setLoading(false);
      return;
    }

    setCerts(bookings || []);

    // 2️⃣ Fetch related user_info for those bookings
    const userIds = (bookings || []).map((b) => b.user_id).filter(Boolean);

    if (userIds.length > 0) {
      const { data: users, error: userError } = await supabase
        .from("user_info")
        .select("*")
        .in("id", userIds);

      if (userError) {
        console.error("USER LOAD ERROR:", userError);
      } else {
        const map: Record<string, any> = {};
        (users || []).forEach((u) => {
          map[u.id] = u;
        });
        setUsersMap(map);
      }
    }

    setLoading(false);
  }

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>Medical Certificate Requests</h1>

      {loading && <p>Loading...</p>}

      {!loading && certs.length === 0 && (
        <p>No medical certificate requests found.</p>
      )}

      {!loading && certs.length > 0 && (
        <table
          style={{
            width: "100%",
            background: "white",
            borderCollapse: "collapse",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <thead style={{ background: "#1d2e28", color: "white" }}>
            <tr>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>Phone</th>
              <th style={th}>Notes</th>
              <th style={th}>Payment</th>
              <th style={th}>Date</th>
            </tr>
          </thead>

          <tbody>
            {certs.map((b) => {
              const user = usersMap[b.user_id] || {};

              return (
                <tr key={b.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={td}>
                    {(user.first_name || "") + " " + (user.last_name || "")}
                  </td>

                  <td style={td}>{user.email || "—"}</td>
                  <td style={td}>{user.phone || "—"}</td>

                  <td style={td}>{b.notes || "—"}</td>

                  <td style={td}>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: 6,
                        color: "white",
                        background:
                          b.payment_status === "paid" ? "green" : "red",
                      }}
                    >
                      {b.payment_status || "pending"}
                    </span>
                  </td>

                  <td style={td}>
                    {b.date || "—"} {b.time && b.time !== "N/A" ? `· ${b.time}` : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th: React.CSSProperties = {
  padding: "12px",
  textAlign: "left",
  fontWeight: "bold",
};

const td: React.CSSProperties = {
  padding: "12px",
  verticalAlign: "top",
};
