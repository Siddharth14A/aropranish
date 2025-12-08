// src/pages/PrivacyPolicy.tsx

export default function PrivacyPolicy() {
  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
        Privacy Policy
      </h1>

      <p>
        At Aropranish Green, we take your privacy seriously and are committed
        to safeguarding the personal information you share with us. This Privacy
        Policy outlines how we collect, use, disclose, and protect your
        information when you visit our website or engage with our telehealth
        services.
      </p>

      <h2>Information We Collect</h2>
      <ul>
        <li>Personal Identification (name, DOB, contact info, address, etc.)</li>
        <li>Health Information (medical history, symptoms, treatments)</li>
        <li>Payment Information (securely processed)</li>
        <li>Usage Data (IP, browser, device)</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To provide telehealth services and consultations</li>
        <li>For medical record keeping and compliance</li>
        <li>To communicate with you (appointments, reminders)</li>
        <li>To improve our services</li>
      </ul>

      <h2>How We Protect Your Information</h2>
      <ul>
        <li>Industry-standard encryption in transit and at rest</li>
        <li>Access restricted to authorised medical staff</li>
        <li>Secure data storage & regular audits</li>
        <li>Secure third-party payment processing</li>
      </ul>

      <h2>When We May Share Your Information</h2>
      <ul>
        <li>With other healthcare providers (with your consent)</li>
        <li>For legal compliance</li>
        <li>With IT/service providers</li>
        <li>In case of business transfer (with notice)</li>
      </ul>

      <h2>Your Rights</h2>
      <ul>
        <li>Request access, correction, or deletion of your data</li>
        <li>Withdraw consent (may limit services)</li>
      </ul>

      <h2>Cookies</h2>
      <p>Used to improve functionality; you may disable them in browser settings.</p>

      <h2>Changes to This Policy</h2>
      <p>This policy may be updated periodically.</p>

      <h2>Contact Us</h2>
      <p>
        Doctor: Dr. Ashish Nayak<br />
        Email: contact@aropranish-green.com.au
      </p>

      <p style={{ marginTop: "30px", fontSize: "12px", color: "#666" }}>
        This Privacy Policy is provided by Aropranish Green.
      </p>
    </div>
  );
}
