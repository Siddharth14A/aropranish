import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./questionnaire.css";

export const WeightLossQuestionnaire = () => {
  const navigate = useNavigate();

  const steps = [
    { id: "height", type: "number", question: "Height (in cm)", required: true },
    { id: "weight", type: "number", question: "Weight (in Kg)", required: true },
    {
      id: "triedBefore",
      type: "multiselect",
      question: "Have you tried before?",
      required: true,
      options: ["Diet", "Exercise", "Medications", "Surgery"],
    },
    {
      id: "conditions",
      type: "multiselect",
      question: "Do you have any of these?",
      required: true,
      options: [
        "Diabetes",
        "High blood pressure",
        "Eating disorder / mental health condition",
        "None of the above",
      ],
    },
    {
      id: "currentMedications",
      type: "text",
      question: "Current medications",
      required: false,
    },
    {
      id: "interest",
      type: "radio",
      question: "Interested in",
      required: true,
      options: [
        "Injectable weight loss meds (e.g. Ozempic/Wegovy)",
        "Other options",
      ],
    },
  ];

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any>({
    height: "",
    weight: "",
    triedBefore: [],
    conditions: [],
    currentMedications: "",
    interest: "",
  });
  const [eligible, setEligible] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);

  const current = steps[step];

  const update = (value: any) => {
    setAnswers({ ...answers, [current.id]: value });
  };

  const toggleMulti = (value: string) => {
    let arr = answers[current.id] || [];

    if (arr.includes(value)) {
      arr = arr.filter((v: string) => v !== value);
    } else {
      arr.push(value);
    }

    update(arr);
  };

  const next = () => {
    if (current.required && !answers[current.id]) return;
    setStep(step + 1);
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  const isLast = step === steps.length - 1;

  const checkEligibility = () => {
    const h = Number(answers.height);
    const w = Number(answers.weight);

    const heightMeters = h / 100;
    const BMI = w / (heightMeters * heightMeters);

    const conditions = answers.conditions || [];
    const hasOnlyNone =
      conditions.length === 1 && conditions[0] === "None of the above";

    const isEligible = BMI >= 27 || !hasOnlyNone;

    setEligible(isEligible);
    setShowResult(true);
  };

  useEffect(() => {
    if (showResult && eligible) {
      (window as any).collectedAnswers = {
        programme: "weight-loss",
        answers,
      };

      navigate("/user-details", {
        state: {
          programme: "weight-loss",
          answers,
        },
      });
    }
  }, [showResult, eligible, navigate, answers]);

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
        <h3 className="q-subtitle">Weight Loss Assessment</h3>
        <p className="q-desc">Help us understand your health needs better</p>

        <div className="q-progress">
          <div
            className="q-progress-fill"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="q-step-label">
          Question {step + 1} of {steps.length}
        </div>

        <div className="q-question">
          {current.question}
          {current.required && <span className="q-required">*</span>}
        </div>

        <div className="q-options">
          {current.type === "number" && (
            <input
              type="number"
              className="q-input"
              placeholder="Enter value"
              value={answers[current.id] || ""}
              onChange={(e) => update(e.target.value)}
            />
          )}

          {current.type === "text" && (
            <textarea
              className="q-textarea"
              placeholder="Type here..."
              value={answers[current.id] || ""}
              onChange={(e) => update(e.target.value)}
            />
          )}

          {current.type === "radio" &&
            current.options!.map((opt) => (
              <label
                key={opt}
                className={`q-option ${
                  answers[current.id] === opt ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name={current.id}
                  value={opt}
                  checked={answers[current.id] === opt}
                  onChange={() => update(opt)}
                />
                {opt}
              </label>
            ))}

          {current.type === "multiselect" &&
            current.options!.map((opt) => (
              <label
                key={opt}
                className={`q-option ${
                  answers[current.id]?.includes(opt) ? "selected" : ""
                }`}
              >
                <input
                  type="checkbox"
                  value={opt}
                  checked={answers[current.id]?.includes(opt)}
                  onChange={() => toggleMulti(opt)}
                />
                {opt}
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
                answers[current.id] ? "active" : ""
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
          <p>Already have an account? <a href="/login">Sign in</a></p>
          <p>Need help? <a href="/contact">Contact us</a></p>
        </div>

        <div className="q-powered"></div>
      </div>
    </div>
  );
};
