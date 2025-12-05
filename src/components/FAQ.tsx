import { useState } from "react";

const faqItems = [
  {
    q: "How do telehealth consultations work?",
    a: "You book a time that suits you, complete a brief screening form, and then speak with Dr. Nayak via secure phone or video from the comfort of your home."
  },
  {
    q: "Is online healthcare as effective as in-person?",
    a: "For many conditions and follow-up care, telehealth is just as effective as in-person consultations, with the added benefit of convenience and accessibility."
  },
  {
    q: "What can I discuss in my consultation?",
    a: "You can discuss symptoms, ongoing health concerns, treatment options, medication reviews, lifestyle changes, and any questions you have about your care."
  },
  {
    q: "How private are the consultations?",
    a: "Consultations are conducted in a private setting and your information is managed in line with Australian privacy and medical confidentiality standards."
  },
  {
    q: "Do I need a referral?",
    a: "You do not need a referral for a telehealth consultation with Dr. Nayak. You can book directly as a new or existing patient."
  },
  {
    q: "What areas of healthcare does Aropranish focus on?",
    a: "Aropranish focuses on chronic condition management, lifestyle and weight management, sleep health, smoking cessation, prescription and medication reviews, and general telehealth care."
  },
  {
    q: "Are prescription therapies discussed?",
    a: "Where clinically appropriate, treatment options — including prescription therapies — may be discussed. Suitability is always assessed on an individual basis."
  },
  {
    q: "Are the prescribed treatments legal and regulated?",
    a: "Any prescribed treatments are provided within Australian regulations and TGA requirements, and only if clinically appropriate for your situation."
  }
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="faq-section">
      <div className="faq-inner">
        <h2 className="faq-title">Frequently Asked Questions</h2>

        {/* FAQ LIST */}
        <div className="faq-panel">
          {faqItems.map((item, index) => (
            <div
              key={item.q}
              className="faq-item"
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            >
              <div className="faq-question">
                <span>{item.q}</span>
                <span className="faq-toggle">
                  {openIndex === index ? "−" : "+"}
                </span>
              </div>

              {openIndex === index && (
                <div className="faq-answer">
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/*  DISCLAIMER SECTION (Added Here)  */}
        <div className="disclaimer-box">
          <h3 className="disclaimer-title">⚖️ Disclaimer</h3>

          <div className="disclaimer-content">
            <p>
              Aropranish Green provides medical consultations only.
            </p>

            <p>
              Specific therapeutic products or "natural medicines" are discussed solely within a consultation 
              and prescribed only when clinically indicated.
            </p>

            <p>
              All services comply with TGA and AHPRA advertising guidelines.
            </p>

            <p>
              Information on this website is general in nature and not a substitute for medical advice.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
