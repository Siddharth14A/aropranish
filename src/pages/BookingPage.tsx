import { useNavigate } from "react-router-dom";

export const BookingPage = () => {
  const navigate = useNavigate();

  const programmes = [
    {
      title: "Initial Comprehensive Consultation",
      price: "$99",
      desc: "Comprehensive natural medical assessment and treatment planning",
      route: "/questionnaire/natural-medicine",
    },
    {
      title: "Weight Loss Management",
      price: "$69",
      desc: "Personalised consultation and treatment planning",
      route: "/questionnaire/weight-loss",
    },
    {
      title: "Smoking Cessation (Vaping Support)",
      price: "$69",
      desc: "Professional quit-smoking guidance with prescription assessment",
      route: "/questionnaire/smoking-cessation",
    },
    {
      title: "Sleep Disorder Consultation",
      price: "$69",
      desc: "Specialized sleep apnoea assessment and CPAP management",
      route: "/questionnaire/sleep",
    },
    {
      title: "Non-Urgent Prescriptions",
      price: "$69",
      desc: "Hypertension/Diabetes etc",
      route: "/user-details",
    },
  ];

  return (
    <section className="booking-page section section-cream">
      <div className="container booking-container">
        <h1 className="booking-title">Aropranish Clinic</h1>
        <p className="booking-subtitle">
          Choose your programme type to get started
        </p>

        <div className="booking-grid">
          {programmes.map((p, idx) => (
            <div key={idx} className="booking-card">
              <h3 className="booking-card-title">{p.title}</h3>
              <p className="booking-card-price">{p.price}</p>
              <p className="booking-card-desc">{p.desc}</p>

              {/*  working navigation */}
              <button
                className="btn btn--green booking-btn"
                onClick={() => navigate(p.route)}
              >
                Select Programme
              </button>
            </div>
          ))}
        </div>

        <div className="booking-links">
          <p>
            Already have an account? <a href="/login">Sign in</a>
          </p>
          <p>
            Need help? <a href="/contact">Contact us</a>
          </p>
        </div>
      </div>
    </section>
  );
};
