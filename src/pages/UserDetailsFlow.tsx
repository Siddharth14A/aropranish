import { useState, useEffect } from "react";
import "./questionnaire.css";
import { supabase } from "../supabaseClient";
import { useLocation, useNavigate } from "react-router-dom";

export const UserDetailsFlow = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);

  const [nameData, setNameData] = useState({
    firstName: "",
    lastName: "",
  });

  const [contactData, setContactData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [error, setError] = useState("");

  // Pick up answers from route state (if coming from a questionnaire)
  useEffect(() => {
    if (location.state) {
      (window as any).collectedAnswers = location.state;
    }
  }, [location.state]);

  const handleNameNext = () => {
    if (!nameData.firstName || !nameData.lastName) {
      setError("Please enter your first and last name.");
      return;
    }
    setError("");
    setStep(1);
  };

  // Email validation regex
  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Allow only digits for phone
  function filterPhoneDigits(input: string) {
    return input.replace(/\D/g, ""); // remove all non-digits
  }

  const handleContactNext = async () => {
    const {
      email,
      phone,
      password,
      confirmPassword,
      acceptTerms,
    } = contactData;

    if (!email || !phone || !password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (phone.length < 8) {
      setError("Phone number must be at least 8 digits.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!acceptTerms) {
      setError("You must accept the Terms of Service and Privacy Policy.");
      return;
    }

    setError("");

    // 1️⃣ Insert user
    const { data: user, error: userError } = await supabase
      .from("user_info")
      .insert({
        first_name: nameData.firstName,
        last_name: nameData.lastName,
        email,
        phone,
        password_hash: password,
        accepted_terms: acceptTerms, // 🔐 store consent
      })
      .select()
      .single();

    if (userError) {
      console.error(userError);
      setError("Failed to save user. Please try again.");
      return;
    }

    // ⭐ Save new user session
    localStorage.setItem("currentUserId", user.id);
    console.log("[UserDetailsFlow] New user created with ID:", user.id);

    // 2️⃣ Insert answers
    const collected = (window as any).collectedAnswers;
    console.log("[UserDetailsFlow] Collected answers:", collected);

    if (collected) {
      // Normal flow (from questionnaire)
      const { programme, answers } = collected;

      const { error: answersError } = await supabase.from("answers").insert({
        user_id: user.id,
        programme,
        answers,
      });

      if (answersError) {
        console.error("[UserDetailsFlow] Answers insert error:", answersError);
      }
    } else {
      // ⭐ DEFAULT INSERT FOR NON-URGENT PRESCRIPTION
      console.log(
        "[UserDetailsFlow] No questionnaire → inserting default Non-Urgent programme"
      );

      const { error: defaultAnsErr } = await supabase.from("answers").insert({
        user_id: user.id,
        programme: "non-urgent",
        answers: {}, // no answers
      });

      if (defaultAnsErr) {
        console.error(
          "[UserDetailsFlow] Default non-urgent insert failed:",
          defaultAnsErr
        );
      }
    }

    // 3️⃣ Redirect to appointment page
    navigate("/appointment");
  };

  return (
    <div className="q-container">
      <div className="q-card">
        <h2 className="q-title">Aropranish Clinic</h2>

        {/* STEP 1 — Name */}
        {step === 0 && (
          <>
            <h3 className="q-subtitle">Let's start with your name</h3>
            <p className="q-desc">
              This is required to generate an electronic prescription if needed.
            </p>

            {error && <p className="q-error">{error}</p>}

            <div className="name-row">
              <div>
                <label className="q-label">First name</label>
                <input
                  className="q-input"
                  value={nameData.firstName}
                  onChange={(e) =>
                    setNameData({ ...nameData, firstName: e.target.value })
                  }
                  placeholder="John"
                />
              </div>
              <div>
                <label className="q-label">Last name</label>
                <input
                  className="q-input"
                  value={nameData.lastName}
                  onChange={(e) =>
                    setNameData({ ...nameData, lastName: e.target.value })
                  }
                  placeholder="Doe"
                />
              </div>
            </div>

            <button className="q-next active" onClick={handleNameNext}>
              Continue
            </button>
          </>
        )}

        {/* STEP 2 — Contact + Password */}
        {step === 1 && (
          <>
            <h3 className="q-subtitle">Create your account</h3>
            <p className="q-desc">Enter contact details & set a password</p>

            {error && <p className="q-error">{error}</p>}

            <label className="q-label">Email</label>
            <input
              className="q-input"
              placeholder="your@email..."
              value={contactData.email}
              onChange={(e) =>
                setContactData({ ...contactData, email: e.target.value })
              }
            />

            <label className="q-label">Phone number</label>
            <input
              className="q-input"
              placeholder="0412 345 678"
              value={contactData.phone}
              onChange={(e) =>
                setContactData({
                  ...contactData,
                  phone: filterPhoneDigits(e.target.value),
                })
              }
            />

            <label className="q-label">Create Password</label>
            <input
              type="password"
              className="q-input"
              placeholder="Minimum 6 characters"
              value={contactData.password}
              onChange={(e) =>
                setContactData({ ...contactData, password: e.target.value })
              }
            />

            <label className="q-label">Confirm Password</label>
            <input
              type="password"
              className="q-input"
              placeholder="Re-enter password"
              value={contactData.confirmPassword}
              onChange={(e) =>
                setContactData({
                  ...contactData,
                  confirmPassword: e.target.value,
                })
              }
            />

            {/* Terms Acceptance */}
            <div style={{ marginTop: "15px", marginBottom: "10px" }}>
              <label
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <input
                  type="checkbox"
                  checked={contactData.acceptTerms || false}
                  onChange={(e) =>
                    setContactData({
                      ...contactData,
                      acceptTerms: e.target.checked,
                    })
                  }
                />
                <span style={{ fontSize: "14px" }}>
                  I agree to the{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    style={{ color: "#0b8a5f", textDecoration: "underline" }}
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    target="_blank"
                    style={{ color: "#0b8a5f", textDecoration: "underline" }}
                  >
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            <div className="q-nav">
              <button className="q-prev" onClick={() => setStep(0)}>
                Back
              </button>
              <button className="q-next active" onClick={handleContactNext}>
                Complete Registration
              </button>
            </div>
          </>
        )}

        <div className="q-links">
          <p>
            Already have an account? <a href="/login">Sign in</a>
          </p>
          <p>
            Need help? <a href="/contact">Contact us</a>
          </p>
        </div>

        <div className="q-powered"></div>
      </div>
    </div>
  );
};
