// src/pages/TermsOfService.tsx

export default function TermsOfService() {
  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
        Terms of Service
      </h1>

      <p>
        By accessing and using Aropranish Green’s telehealth services, you agree
        to the following Terms of Service. Please read them carefully before
        proceeding with any consultation or use of our website.
      </p>

      {/* ----------------------------  RESPONSIBILITIES ---------------------------- */}
      <h2>Your Responsibilities</h2>
      <ul>
        <li>Provide accurate, truthful, and up-to-date medical and personal information.</li>
        <li>Use the service only for lawful and medically appropriate purposes.</li>
        <li>Follow clinical guidance provided by your healthcare practitioner.</li>
        <li>Ensure your contact details remain valid for appointment communication.</li>
        <li>
          Understand that telehealth consultations may not be suitable for all
          conditions and may require in-person review or specialist referral.
        </li>
      </ul>

      {/* ----------------------------  SERVICE LIMITATIONS ---------------------------- */}
      <h2>Service Limitations</h2>
      <p>
        Aropranish Green provides telehealth consultations conducted by
        qualified practitioners. Eligibility for treatment, prescriptions, or
        medical documentation is determined solely by clinical judgment.
      </p>

      <p>
        Consultations may not replace physical examinations when clinically
        necessary. Some treatments may not be appropriate, and the practitioner
        may decline or limit services based on medical safety.
      </p>

      {/* ----------------------------  PAYMENTS ---------------------------- */}
      <h2>Payments & Billing</h2>
      <p>
        All fees are payable at the time of booking and are non-refundable
        except where required by Australian Consumer Law. You are responsible
        for ensuring payment details are accurate.
      </p>

      {/* ----------------------------  PRIVACY ---------------------------- */}
      <h2>Privacy & Confidentiality</h2>
      <p>
        Aropranish Green collects, stores, and processes personal information
        in accordance with our Privacy Policy. By using our platform, you
        consent to secure communication via email, SMS, and digital platforms.
      </p>

      {/* ----------------------------  LIABILITY ---------------------------- */}
      <h2>Liability Disclaimer</h2>
      <p>
        Aropranish Green takes reasonable steps to maintain secure systems.
        However, by using our services, you acknowledge and agree that:
      </p>

      <ul>
        <li>
          No digital system can be guaranteed to be 100% secure, and we cannot
          guarantee protection against all cyber threats.
        </li>
        <li>
          Aropranish Green is <strong>not responsible for any data loss</strong>,
          data breach, unauthorised access, corruption, or disclosure of
          information arising from:
          <ul>
            <li>third-party service failures (e.g., hosting, email, Stripe),</li>
            <li>internet outages or interruptions,</li>
            <li>technical issues beyond our control,</li>
            <li>user negligence (lost devices, shared passwords, etc.).</li>
          </ul>
        </li>
        <li>
          Aropranish Green is not liable for indirect, incidental, consequential,
          punitive, or special damages, including loss of data, revenue,
          business, or reputation.
        </li>
        <li>
          Aropranish Green and its practitioners are not liable for decisions you
          make based on information provided during consultations outside of
          clinical guidance.
        </li>
      </ul>

      {/* ----------------------------  EMERGENCY DISCLAIMER ---------------------------- */}
      <h2>Emergency Disclaimer</h2>
      <p>
        Aropranish Green is <strong>not an emergency service</strong>.  
        If you require urgent medical care, call <strong>000</strong> or attend your
        nearest emergency department immediately.
      </p>

      {/* ----------------------------  MODIFICATIONS ---------------------------- */}
      <h2>Changes to These Terms</h2>
      <p>
        We may update these Terms of Service periodically. Continued use of the
        service after changes are published constitutes acceptance of the updated
        Terms.
      </p>

      {/* ----------------------------  CONTACT ---------------------------- */}
      <h2>Contact Us</h2>
      <p>
        For questions regarding these Terms, please contact:<br />
        <strong>Email:</strong> contact@aropranish-green.com.au
      </p>

      <p style={{ marginTop: "30px", fontSize: "12px", color: "#666" }}>
        These Terms govern your access to Aropranish Green’s telehealth services.
      </p>
    </div>
  );
}
