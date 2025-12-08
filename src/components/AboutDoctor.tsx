export const AboutDoctor = () => {
  return (
    <section id="about-doctor" className="aboutdoctor-section">
      <div className="aboutdoctor-container">

        {/* LEFT TEXT COLUMN */}
        <div className="aboutdoctor-left">
          <h2>About Dr. Ashish Nayak</h2>

          <p>
            Dr. Ashish Nayak is a registered medical practitioner providing accessible,
            professional, and patient-centred telehealth services.
          </p>

          <p>
            With years of clinical experience across Western Australia, he is committed
            to helping Australians receive quality care wherever they are.
          </p>

          <div className="aboutdoctor-approach">
            <h4>His approach:</h4>
            <ul>
              <li>Clear communication</li>
              <li>Professional, evidence-based care</li>
              <li>Genuine focus on your wellbeing</li>
            </ul>
          </div>

          <p className="aboutdoctor-desc">
            AHPRA-registered and ready to support your health journey.
          </p>

          <button
  className="aboutdoctor-btn"
  onClick={() => (window.location.href = "/booking")}
>
  Book a Consultation with Dr. Nayak
</button>

        </div>

        {/* RIGHT PHOTO COLUMN */}
        <div className="aboutdoctor-right">
          <div className="aboutdoctor-photo-wrapper">
            <img
              src="/dr.png"
              alt="Dr. Ashish Nayak"
              className="aboutdoctor-photo"
            />
          </div>

          <p className="aboutdoctor-name">Dr. Ashish Nayak</p>
          <p className="aboutdoctor-role">Registered Medical Practitioner</p>

          <div className="aboutdoctor-quote">
            “Healthcare should be accessible, professional, and genuinely helpful.”
          </div>
        </div>
      </div>
    </section>
  );
};
