import React from "react";

export const ConsultationSection = () => {
  return (
    <section
      style={{
        background: "#f9f6ef",
        padding: "120px 20px",
        textAlign: "center",
      }}
    >
      {/* MAIN HEADING */}
      <h1
        style={{
          fontSize: "58px",
          fontWeight: 700,
          color: "#26463e",
          margin: 0,
          lineHeight: "1.2",
        }}
      >
        Quality healthcare consultations
      </h1>

      {/* GOLD SUB-HEADING */}
      <h1
        style={{
          fontSize: "58px",
          fontWeight: 700,
          color: "#b49449",
          marginTop: "10px",
          marginBottom: "35px",
          lineHeight: "1.2",
        }}
      >
        delivered online
      </h1>

      {/* DESCRIPTION */}
      <p
        style={{
          fontSize: "20px",
          color: "#41544d",
          maxWidth: "900px",
          margin: "0 auto",
          lineHeight: "1.6",
        }}
      >
        Dr. Ashish Nayak provides professional telehealth consultations across
        Australia. Receive the care you deserve from the comfort of your own
        home: private, convenient, and genuinely focused on you.
      </p>

      {/* CTA BUTTON */}
      <button
        style={{
          marginTop: "50px",
          padding: "18px 45px",
          fontSize: "20px",
          background: "#1d3e35",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          fontWeight: 600,
        }}
        onClick={() => window.location.href = "/booking"}
      >
        Book Your Consultation
      </button>
    </section>
  );
};

