import { useState } from "react";
import { supabase } from "../supabaseClient";
import "./login.css";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  console.log("Login button clicked");
  setError("");

  if (!email || !password) {
    setError("Please enter your email and password.");
    return;
  }

  setLoading(true);

  try {
    const { data: user, error: lookupError } = await supabase
      .from("user_info")
      .select("*")
      .eq("email", email)
      .single();

    console.log("Lookup result:", user, lookupError);

    if (lookupError || !user) {
      setError("No account found with this email.");
      return;
    }

    if (user.password_hash !== password) {
      setError("Incorrect password.");
      return;
    }

    // Success
    localStorage.setItem("currentUserId", user.id);

    console.log("LOGIN SUCCESS, userId =", window.currentUserId);

    window.location.href = "/appointment";
  } catch (err) {
    console.error("Login error:", err);
    setError("Unexpected error. Try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Sign in to continue your consultation</p>

        {error && <p className="login-error">{error}</p>}

        <label className="login-label">Email</label>
        <input
          className="login-input"
          type="email"
          placeholder="you@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="login-label">Password</label>
        <input
          className="login-input"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="login-btn"
disabled={loading ? true : false}
          onClick={handleLogin}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div className="login-footer">
          <p>
            Don’t have an account? <a href="/user-details">Sign up</a>
          </p>
          <p>
            Need help? <a href="/contact">Contact us</a>
          </p>
        </div>
      </div>
    </div>
  );
};
