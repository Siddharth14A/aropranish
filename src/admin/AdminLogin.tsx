import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: any) {
    e.preventDefault();

    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .maybeSingle();

    if (error || !data) {
      setError("Invalid admin credentials");
      return;
    }

    localStorage.setItem("admin_logged_in", "true");
    window.location.href = "/admin/dashboard";
  }

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#f4f7f2",
    }}>
      <form
        onSubmit={handleLogin}
        style={{
          background: "white",
          padding: 30,
          borderRadius: 12,
          width: 350,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Admin Login</h2>

        {error && (
          <p style={{ color: "red", marginBottom: 10 }}>{error}</p>
        )}

        <label>Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 10, marginTop: 5, marginBottom: 15 }}
        />

        <label>Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, marginTop: 5, marginBottom: 15 }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            background: "#0b8a5f",
            color: "white",
            padding: 12,
            border: "none",
            borderRadius: 8,
            cursor: "pointer"
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
