import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./questionnaire.css";

export const NaturalMedicineQuestionnaire = () => {
  const navigate = useNavigate();

  const questions = [
    { id: "over18", question: "Are you over 22?", required: true },
    {
      id: "medicalCondition",
      question: "Have you been diagnosed with a medical condition?",
      required: true,
    },
    {
      id: "triedMedication",
      question: "Have you tried standard medication without benefit?",
      required: true,
    },
    {
      id: "psychosisHistory",
      question: "Do you have a history of psychosis?",
      required: true,
    },
    {
      id: "pregnant",
      question: "Are you pregnant or breastfeeding?",
      required: true,
    },
    {
      id: "schizophrenia",
      question: "Do you have a history of schizophrenia?",
      required: true,
    },
  ];

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({
    over18: "",
    medicalCondition: "",
    triedMedication: "",
    psychosisHistory: "",
    pregnant: "",
    schizophrenia: "",
  });
  const [eligible, setEligible] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (value: string) => {
    const key = questions[step].id;
    setAnswers({ ...answers, [key]: value });
  };

  const next = () => {
    if (!answers[questions[step].id]) return;
    setStep(step + 1);
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  const isLast = step === questions.length - 1;

  const checkEligibility = () => {
    const eligibleNow =
      answers.over18 === "Yes" &&
      answers.medicalCondition === "Yes" &&
      answers.psychosisHistory === "No" &&
      answers.schizophrenia === "No" &&
      answers.pregnant === "No";

    setEligible(eligibleNow);
    setShowResult(true);
  };

  // Redirect side-effect when eligible
  useEffect(() => {
    if (showResult && eligible) {
      (window as any).collectedAnswers = {
        programme: "natural-medicine",
        answers,
      };

      navigate("/user-details", {
        state: {
          programme: "natural-medicine",
          answers,
        },
      });
    }
  }, [showResult, eligible, navigate, answers]);

  // Not eligible screen
  if (showResult && eligible === false) {
    return (
      <div className="q-container">
        <div className="q-card">
          <h2 className="q-title">Not Eligible</h2>
          <p className="q-desc">
            Sorry, unfortunately you are not eligible for a consultation based
            on your answers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="q-container">
      <div className="q-card">
        <h2 className="q-title">Aropranish Clinic</h2>
        <h3 className="q-subtitle">Health Assessment</h3>
        <p className="q-desc">Help us understand your health needs better</p>

        <div className="q-progress">
          <div
            className="q-progress-fill"
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="q-step-label">
          Question {step + 1} of {questions.length}
        </div>

        <div className="q-question">
          {questions[step].question}{" "}
          {questions[step].required && <span className="q-required">*</span>}
        </div>

        <div className="q-options">
          {["Yes", "No"].map((value) => (
            <label
              key={value}
              className={`q-option ${
                answers[questions[step].id] === value ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name={questions[step].id}
                value={value}
                checked={answers[questions[step].id] === value}
                onChange={() => handleSelect(value)}
              />
              {value}
            </label>
          ))}
        </div>

        <div className="q-nav">
          {step > 0 && (
            <button className="q-prev" onClick={prev}>
              Previous
            </button>
          )}

          {!isLast ? (
            <button
              className={`q-next ${
                answers[questions[step].id] ? "active" : ""
              }`}
              onClick={next}
            >
              Next →
            </button>
          ) : (
            <button className="q-complete" onClick={checkEligibility}>
              Complete
            </button>
          )}
        </div>

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
