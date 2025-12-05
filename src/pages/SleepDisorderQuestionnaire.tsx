import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./questionnaire.css";

export const SleepDisorderQuestionnaire = () => {
  const navigate = useNavigate();

  const steps = [
    {
      id: "symptoms",
      type: "multiselect",
      question: "Do you have any of these symptoms?*",
      required: true,
      options: [
        "Loud snoring",
        "Pauses in breathing (someone noticed)",
        "Daytime tiredness / falling asleep easily",
        "Morning headaches",
        "Trouble concentrating",
        "No",
      ],
    },
    {
      id: "otherHealthProblems",
      type: "text",
      question: "Any other health problems?",
      required: false,
    },
    {
      id: "weight",
      type: "number",
      question: "Your weight (kg)*",
      required: true,
    },
    {
      id: "neckSize",
      type: "number",
      question: "Neck size (if known) (in cm)",
      required: false,
    },
    {
      id: "bloodPressure",
      type: "radio",
      question: "Do you have high blood pressure?*",
      required: true,
      options: ["Yes", "No"],
    },
    {
      id: "preferredStudy",
      type: "radio",
      question: "Do you have a preferred sleep study provider?*",
      required: true,
      options: ["Yes", "No"],
    },
    {
      id: "preferredStudyName",
      type: "text",
      question: "Preferred sleep study name.",
      required: false,
      dependsOn: { question: "preferredStudy", answer: "Yes" },
    },
  ];

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any>({
    symptoms: [],
    otherHealthProblems: "",
    weight: "",
    neckSize: "",
    bloodPressure: "",
    preferredStudy: "",
    preferredStudyName: "",
  });
  const [eligible, setEligible] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);

  let current = steps[step];

  const update = (value: any) => {
    setAnswers({ ...answers, [current.id]: value });
  };

  const toggleMulti = (value: string) => {
    let arr = answers[current.id] || [];

    if (value === "No") {
      arr = ["No"];
    } else {
      arr = arr.filter((v: string) => v !== "No");
      if (arr.includes(value)) {
        arr = arr.filter((v: string) => v !== value);
      } else {
        arr.push(value);
      }
    }

    update(arr);
  };

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

  const checkEligibility = () => {
    const symptoms = answers.symptoms || [];

    const isEligible =
      symptoms.length > 0 &&
      !(symptoms.length === 1 && symptoms[0] === "No") &&
      answers.weight &&
      Number(answers.weight) > 20;

    setEligible(isEligible);
    setShowResult(true);
  };

  useEffect(() => {
    if (showResult && eligible) {
      (window as any).collectedAnswers = {
        programme: "sleep",
        answers,
      };

      navigate("/user-details", {
        state: {
          programme: "sleep",
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
        <h3 className="q-subtitle">Sleep Disorder Assessment</h3>
        <p className="q-desc">Help us understand your sleep health better</p>

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
          {current.type === "multiselect" &&
            current.options?.map((opt) => (
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
              placeholder="Type here..."
              value={answers[current.id] || ""}
              onChange={(e) => update(e.target.value)}
            />
          )}

          {current.type === "number" && (
            <input
              type="number"
              className="q-input"
              placeholder="Enter value"
              value={answers[current.id] || ""}
              onChange={(e) => update(e.target.value)}
            />
          )}

          {current.type === "radio" &&
            current.options?.map((opt) => (
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
