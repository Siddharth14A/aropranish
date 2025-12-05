export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-logo-block">
            <div className="brand-name">Aropranish</div>
            <p>
              Telehealth consultations · Western Australia &amp; Australia-wide
            </p>
            <p>
              Doctor-led, plant-based care delivered via secure telehealth, so
              you can access support from wherever you are.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-heading">Quick Links</div>
            <a href="#hero">Home</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#who-we-help">Who We Help</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQs</a>
          </div>

          <div className="footer-legal">
            <div className="footer-heading">Legal</div>
            <a href="#about-doctor">About Dr. Nayak</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            <p>© {year} Aropranish. All rights reserved.</p>
            <p>
              Telehealth medical consultations only. This service does not
              replace in-person emergency care.
            </p>
          </div>
          <div className="footer-emergency">
            This service is not suitable for emergencies. If you are in
            immediate danger or need urgent medical attention, call{" "}
            <strong>000</strong> or go to your nearest emergency department.
          </div>
        </div>
      </div>
    </footer>
  );
};
