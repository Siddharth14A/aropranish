import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Dashboard() {
  const [stats, setStats] = useState<any>({
    today: 0,
    next6: 0,
    paid: 0,
    pending: 0,
    total: 0,
    revenue: 0,
  });

  const [providerStats, setProviderStats] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const { data: bookings } = await supabase.from("bookings").select("*");
    const { data: providers } = await supabase.from("providers").select("*");

    const today = new Date().toISOString().split("T")[0];
    const next6dates = [...Array(6)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d.toISOString().split("T")[0];
    });

    const totalRevenue = bookings
      .filter((b) => b.payment_status === "paid")
      .reduce((sum, b) => sum + 69, 0); // all returning visits = $69

    // Provider breakdown
    const providerMap: any = {};
    providers.forEach((p) => {
      providerMap[p.id] = { provider: p.name, count: 0 };
    });

    bookings.forEach((b) => {
      if (providerMap[b.provider_id]) {
        providerMap[b.provider_id].count++;
      }
    });

    setProviderStats(Object.values(providerMap));

    // Recent bookings
    setRecent(
      bookings
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 10)
    );

    setStats({
      today: bookings.filter((b: any) => b.date === today).length,
      next6: bookings.filter((b: any) => next6dates.includes(b.date)).length,
      paid: bookings.filter((b: any) => b.payment_status === "paid").length,
      pending: bookings.filter((b: any) => b.payment_status !== "paid").length,
      total: bookings.length,
      revenue: totalRevenue,
    });
  }

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 30 }}> Admin Dashboard</h1>

      {/* TOP CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 20,
        }}
      >
        <Card title="Today's Appointments" value={stats.today} />
        <Card title="Next 6 Days" value={stats.next6} />
        <Card title="Paid Appointments" value={stats.paid} />
        <Card title="Pending Appointments" value={stats.pending} />
      </div>

      {/* MID CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 20,
          marginTop: 20,
        }}
      >
        <Card title="Total Appointments" value={stats.total} />
        <Card
          title="Total Revenue"
          value={`$${stats.revenue} AUD`}
          highlight={true}
        />
      </div>

      {/* PROVIDER PERFORMANCE */}
      <div style={{ marginTop: 30 }}>
        <h2>👨‍⚕️ Provider Performance</h2>
        <div style={{ marginTop: 10 }}>
          {providerStats.map((p: any) => (
            <div
              key={p.provider}
              style={{
                padding: 15,
                marginBottom: 10,
                borderRadius: 10,
                background: "#fff",
                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                display: "flex",
                justifyContent: "space-between",
                fontSize: 16,
              }}
            >
              <strong>{p.provider}</strong>
              <span>{p.count} appointments</span>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT BOOKINGS */}
      <div style={{ marginTop: 40 }}>
        <h2>📅 Recent Bookings</h2>

        <table
          style={{
            marginTop: 10,
            width: "100%",
            background: "white",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <thead
            style={{
              background: "#f5f5f5",
              textAlign: "left",
            }}
          >
            <tr>
              <th style={th}>Date</th>
              <th style={th}>Time</th>
              <th style={th}>Programme</th>
              <th style={th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((b: any) => (
              <tr key={b.id}>
                <td style={td}>{b.date}</td>
                <td style={td}>{b.time}</td>
                <td style={td}>{b.programme}</td>
                <td
                  style={{
                    ...td,
                    color: b.payment_status === "paid" ? "green" : "red",
                    fontWeight: 600,
                  }}
                >
                  {b.payment_status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card({ title, value, highlight }: any) {
  return (
    <div
      style={{
        background: highlight ? "#e8f8f0" : "white",
        padding: 25,
        borderRadius: 12,
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ marginBottom: 10 }}>{title}</h3>
      <h1 style={{ fontSize: 36, color: highlight ? "#0b8a5f" : "#222" }}>
        {value}
      </h1>
    </div>
  );
}

const th = {
  padding: 12,
  fontWeight: 600,
};

const td = {
  padding: 12,
  borderBottom: "1px solid #eee",
};
