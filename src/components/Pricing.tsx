export const Pricing = () => {
  const infoLine: React.CSSProperties = {
    margin: "10px 0",
    textAlign: "center",
    fontSize: "15px",
    lineHeight: "1.5",
    color: "#4e4e4e",
  };

  return (
    <section id="pricing" className="section pricing-section">
      <div className="container">
        {/* ========================= TITLE ========================= */}
        <h2
          style={{
            textAlign: "center",
            fontSize: "32px",
            fontWeight: 700,
            color: "#26463e",
            marginBottom: "40px",
          }}
        >
          Honest, Upfront Pricing
        </h2>

        {/* ========================= INITIAL CONSULTATIONS ========================= */}
        <h3
          style={{
            fontSize: "24px",
            marginBottom: "20px",
            marginTop: "20px",
            color: "#26463e",
          }}
        >
          Initial Consultations
        </h3>

        <div className="pricing-grid">
          <div className="pricing-card">
            <h4>Initial Comprehensive Consultation</h4>
            <p className="price-amount">$99</p>
            <p className="pricing-desc">
              A detailed medical assessment and treatment planning session
              tailored to your needs.
            </p>
            <button className="btn btn--outline-green">Book Consultation</button>
          </div>

          <div className="pricing-card">
            <h4>Weight Management Consultation</h4>
            <p className="price-amount">$69</p>
            <p className="pricing-desc">
              Personalised consultation for sustainable weight and lifestyle
              management.
            </p>
            <button className="btn btn--outline-green">Book Consultation</button>
          </div>

          <div className="pricing-card">
            <h4>Sleep Health Consultation</h4>
            <p className="price-amount">$69</p>
            <p className="pricing-desc">
              Comprehensive assessment for sleep issues, including referrals for
              formal studies if required.
            </p>
            <button className="btn btn--outline-green">Book Consultation</button>
          </div>

          <div className="pricing-card">
            <h4>Smoking Cessation Consultation</h4>
            <p className="price-amount">$69</p>
            <p className="pricing-desc">
              Professional support for quitting smoking or vaping, with medically
              supervised options.
            </p>
            <button className="btn btn--outline-green">Book Consultation</button>
          </div>

          <div className="pricing-card">
            <h4>Prescription & Medication Review</h4>
            <p className="price-amount">$49</p>
            <p className="pricing-desc">
              Repeat prescriptions, chronic condition medication reviews, and
              ongoing management.
            </p>
            <button className="btn btn--outline-green">Book Consultation</button>
          </div>
        </div>

        {/* ========================= FOLLOW-UP CONSULTATIONS ========================= */}
        <h3
          style={{
            fontSize: "24px",
            marginBottom: "20px",
            marginTop: "40px",
            color: "#26463e",
          }}
        >
          Follow up / Existing Patients
        </h3>

        <div className="pricing-grid">
          <div className="pricing-card">
            <h4>Follow-Up Consultation</h4>
            <p className="price-amount">$69</p>
            <p className="pricing-desc">
              Review of your progress, adjustment of your treatment plan, and
              time to ask questions.
            </p>
            <button className="btn btn--outline-green">Book Consultation</button>
          </div>

          <div className="pricing-card">
            <h4>Medical Certificate / Documentation</h4>
            <p className="price-amount">$29</p>
            <p className="pricing-desc">
              Certificates and documentation where clinically appropriate and in
              line with medical guidelines.
            </p>
            <button className="btn btn--outline-green">Book Consultation</button>
          </div>

          {/* <div className="pricing-card">
            <h4>Brief Review & Script</h4>
            <p className="price-amount">$39</p>
            <p className="pricing-desc">
              Short telehealth review and repeat script for existing, stable
              patients where appropriate.
            </p>
            <button className="btn btn--outline-green">Book Consultation</button>
          </div> */}
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: "15px",
            color: "#6b6b6b",
            fontSize: "14px",
          }}
        >
          All fees are in AUD. Private billing only. No Medicare rebates
          available. Telehealth consultations only.
        </p>

        {/* ========================= PAY WHEN YOU BOOK SECTION ========================= */}
        <div
          style={{
            background: "#f6f1e6",
            padding: "40px 20px",
            textAlign: "center",
            marginTop: "60px",
            borderRadius: "10px",
            border: "1px solid #ddcba9",
          }}
        >
          <p style={{ margin: "10px 0", fontSize: "16px", color: "#4e4e4e" }}>
            💳 <strong>Pay when you book</strong>
          </p>

          <p style={{ margin: "10px 0", fontSize: "16px", color: "#4e4e4e" }}>
            Detailed receipts provided for private health insurance claims.
          </p>

          <p style={{ margin: "10px 0", fontSize: "15px", color: "#6b6b6b" }}>
            • Bulk billing not available
          </p>

          <p style={{ margin: "10px 0", fontSize: "15px", color: "#6b6b6b" }}>
            • Telehealth services may be eligible for reimbursement — check with
            your insurer.
          </p>
        </div>

        {/* ========================= IMPORTANT MEDICAL INFO ========================= */}
        <h2
          style={{
            textAlign: "center",
            marginTop: "70px",
            fontSize: "28px",
            fontWeight: 700,
            color: "#26463e",
          }}
        >
          Important Medical Information
        </h2>

        <div
          style={{
            background: "#f6f1e6",
            padding: "30px 20px",
            maxWidth: "900px",
            margin: "30px auto",
            borderRadius: "10px",
          }}
        >
          <p style={infoLine}>
            All consultations require appropriate medical assessment and
            documented history.
          </p>
          <p style={infoLine}>
            Therapeutic recommendations follow current Australian clinical and
            therapeutic guidelines.
          </p>
          <p style={infoLine}>
            Specialist referrals may be required for some conditions (e.g., formal
            sleep studies).
          </p>
          <p style={infoLine}>
            Treatment options are always evidence-based and prescribed with
            medical justification.
          </p>
        </div>

        {/* ========================= LEGAL COMPLIANCE NOTE ========================= */}
        <h2
          style={{
            textAlign: "center",
            marginTop: "80px",
            fontSize: "26px",
            fontWeight: 700,
            color: "#26463e",
          }}
        >
          ⚖️ Legal Compliance Note
        </h2>

        <div
          style={{
            background: "#fff",
            padding: "30px 20px",
            maxWidth: "900px",
            margin: "25px auto 80px auto",
            borderRadius: "10px",
            border: "1px solid #e1d9c8",
          }}
        >
          <p style={infoLine}>
            Aropranish Green complies with AHPRA and TGA advertising standards.
          </p>
          <p style={infoLine}>
            We do not advertise or supply specific therapeutic goods to the
            public.
          </p>
          <p style={infoLine}>
            Treatment options are discussed during medical consultations only.
          </p>
        </div>
      </div>
    </section>
  );
};
