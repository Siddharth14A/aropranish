export const WhoWeHelp = () => {
  return (
    <section
      id="who-we-help"
      style={{
        padding: "100px 20px",
        background: "#ffffff",
        textAlign: "center",
      }}
    >
      {/* TITLE */}
      <h2
        style={{
          fontSize: "40px",
          color: "#26463e",
          fontWeight: 700,
          marginBottom: "60px",
        }}
      >
        Healthcare that fits your life
      </h2>

      {/* TOP ROW */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "50px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* ITEM 1 */}
        <div style={{ textAlign: "left" }}>
          <div
            style={{
              width: 52,
              height: 52,
              background: "#26463e",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            {/* DOCUMENT SVG */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>

          <h3 style={{ fontSize: 20, marginBottom: 10 }}>
            Complete Brief Screening
          </h3>
          <p style={{ color: "#4c5b56", lineHeight: 1.6 }}>
            A quick online form to help Dr. Nayak understand your health needs.
          </p>
        </div>

        {/* ITEM 2 */}
        <div style={{ textAlign: "left" }}>
          <div
            style={{
              width: 52,
              height: 52,
              background: "#26463e",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            {/* PHONE SVG */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              stroke="white"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.1 10.81 19.79 19.79 0 0 1 .03 2.18 2 2 0 0 1 2.05 0h3a2 2 0 0 1 2 1.72c.12.81.38 2.05.79 3.05a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.59 6.59l1.27-1.26a2 2 0 0 1 2.11-.46c1 .41 2.24.66 3.05.78A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>

          <h3 style={{ fontSize: 20, marginBottom: 10 }}>Book When It Suits You</h3>
          <p style={{ color: "#4c5b56", lineHeight: 1.6 }}>
            Secure phone consultations Australia-wide — choose a time that fits
            your schedule.
          </p>
        </div>

        {/* ITEM 3 */}
        <div style={{ textAlign: "left" }}>
          <div
            style={{
              width: 52,
              height: 52,
              background: "#26463e",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            {/* USER SVG */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              stroke="white"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          <h3 style={{ fontSize: 20, marginBottom: 10 }}>
            Private, Professional Care
          </h3>
          <p style={{ color: "#4c5b56", lineHeight: 1.6 }}>
            One-on-one consultation focused entirely on your wellbeing.
          </p>
        </div>
      </div>

      {/* SECOND ROW */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "50px",
          maxWidth: "750px",
          margin: "70px auto 0",
        }}
      >
        {/* ITEM 4 */}
        <div style={{ textAlign: "left" }}>
          <div
            style={{
              width: 52,
              height: 52,
              background: "#26463e",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            {/* CLIPBOARD SVG */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              stroke="white"
              fill="none"
              strokeWidth="2"
            >
              <rect x="4" y="3" width="16" height="18" rx="2" />
              <path d="M9 3V1h6v2" />
            </svg>
          </div>

          <h3 style={{ fontSize: 20, marginBottom: 10 }}>
            Receive Your Care Plan
          </h3>
          <p style={{ color: "#4c5b56", lineHeight: 1.6 }}>
            Tailored, evidence-based recommendations specific to your needs.
          </p>
        </div>

        {/* ITEM 5 */}
        <div style={{ textAlign: "left" }}>
          <div
            style={{
              width: 52,
              height: 52,
              background: "#26463e",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            {/* CLOCK SVG */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              stroke="white"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>

          <h3 style={{ fontSize: 20, marginBottom: 10 }}>Ongoing Support</h3>
          <p style={{ color: "#4c5b56", lineHeight: 1.6 }}>
            Regular check-ins to help your care stay on track.
          </p>
        </div>
      </div>

      {/* CTA BUTTON */}
      <button
  style={{
    marginTop: 60,
    padding: "16px 35px",
    background: "#26463e",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 18,
    cursor: "pointer",
  }}
  onClick={() => (window.location.href = "/booking")}
>
  Start With a Screening
</button>

    </section>
  );
};
