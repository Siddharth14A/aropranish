import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./questionnaire.css";

export const SmokingCessationQuestionnaire = () => {
  const navigate = useNavigate();

  const steps = [
    {
      id: "currentlySmoke",
      type: "radio",
      question: "Do you currently smoke?*",
      required: true,
      options: ["Yes", "No"],
    },
    {
      id: "triedQuitting",
      type: "radio",
      question: "Have you tried quitting before?*",
      required: true,
      options: ["Yes", "No"],
    },
    {
      id: "howTried",
      type: "multiselect",
      question: "How have you tried quitting before?",
      required: false,
      options: [
        "Cold turkey",
        "Nicotine replacement therapy",
        "Prescription medication",
        "Counselling",
        "Other",
      ],
      dependsOn: { question: "triedQuitting", answer: "Yes" },
    },
    {
      id: "vapeUse",
      type: "radio",
      question: "Do you currently use vapes/nicotine?*",
      required: true,
      options: ["Yes", "No"],
    },
    {
      id: "healthConditions",
      type: "multiselect",
      question: "Any health problems? (tick all that apply)*",
      required: true,
      options: [
        "Heart disease",
        "Asthma / COPD",
        "Mental health conditions",
        "None of the above",
      ],
    },
    {
      id: "currentMedications",
      type: "text",
      question: "Current medications (If any)",
      required: false,
    },
  ];

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any>({
    currentlySmoke: "",
    triedQuitting: "",
    howTried: [],
    vapeUse: "",
    healthConditions: [],
    currentMedications: "",
  });
  const [eligible, setEligible] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);

  let current = steps[step];

  const next = () => {
    if (current.required && !answers[current.id]) return;

    let nextStep = step + 1;

    while (nextStep < steps.length) {
      const q = steps[nextStep];
      if (q.dependsOn && answers[q.dependsOn.question] !== q.dependsOn.answer) {
        nextStep++;
      } else break;
    }

    setStep(nextStep);
  };

  const prev = () => {
    let prevStep = step - 1;

    while (prevStep >= 0) {
      const q = steps[prevStep];
      if (q.dependsOn && answers[q.dependsOn.question] !== q.dependsOn.answer) {
        prevStep--;
      } else break;
    }

    setStep(prevStep);
  };

  const isLast = step === steps.length - 1;

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

  const checkEligibility = () => {
    const conditions = answers.healthConditions || [];
    const hasOnlyNone =
      conditions.length === 1 && conditions[0] === "None of the above";

    const isEligible = !hasOnlyNone;

    setEligible(isEligible);
    setShowResult(true);
  };

  useEffect(() => {
    if (showResult && eligible) {
      (window as any).collectedAnswers = {
        programme: "smoking-cessation",
        answers,
      };

      navigate("/user-details", {
        state: {
          programme: "smoking-cessation",
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
        <h3 className="q-subtitle">Smoking Cessation Assessment</h3>
        <p className="q-desc">Help us understand your health needs better</p>

        <div className="q-progress">
          <div
            className="q-progress-fill"
            style={{
              width: `${((step + 1) / steps.length) * 100}%`,
            }}
          />
        </div>

        <div className="q-step-label">
          Question {step + 1} of {steps.length}
        </div>

        <div className="q-question">
          {current.question}{" "}
          {current.required && <span className="q-required">*</span>}
        </div>

        <div className="q-options">
          {current.type === "radio" &&
            current.options?.map((opt: string) => (
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
            current.options?.map((opt: string) => (
              <label
                key={opt}
                className={`q-option ${
                  answers[current.id]?.includes(opt) ? "selected" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={answers[current.id]?.includes(opt)}
                  onChange={() => toggleMulti(opt)}
                />
                {opt}
              </label>
            ))}

          {current.type === "text" && (
            <textarea
              className="q-textarea"
              value={answers[current.id] || ""}
              placeholder="Type here..."
              onChange={(e) => update(e.target.value)}
            />
          )}
        </div>

        <div className="q-nav">
          {step > 0 && (
            <button className="q-prev" onClick={prev}>
              Previous
            </button>
          )}

          {!isLast ? (
            <button
              className={`q-next ${answers[current.id] ? "active" : ""}`}
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
