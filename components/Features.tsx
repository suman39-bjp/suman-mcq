"use client";
import { useState } from "react";

const questions = [
  {
    question: "What is the primary goal of an AI Manifesto?",
    options: [
      "To increase AI profits",
      "To define ethical and responsible AI use",
      "To replace human workers",
      "To speed up automation",
    ],
    answer: "To define ethical and responsible AI use",
  },
  {
    question: "Which principle emphasizes fairness in AI systems?",
    options: [
      "Scalability",
      "Bias mitigation",
      "Data compression",
      "Optimization",
    ],
    answer: "Bias mitigation",
  },
  {
    question: "Transparency in AI refers to:",
    options: [
      "Making AI invisible",
      "Openly sharing how AI systems make decisions",
      "Hiding algorithms for security",
      "Reducing computation",
    ],
    answer: "Openly sharing how AI systems make decisions",
  },
  {
    question: "Accountability in AI means:",
    options: [
      "AI systems take responsibility",
      "Developers and organizations are responsible for AI outcomes",
      "Users must fix AI errors",
      "AI works independently",
    ],
    answer: "Developers and organizations are responsible for AI outcomes",
  },
  {
    question: "Which of the following is a risk addressed by AI manifestos?",
    options: [
      "Faster internet",
      "Algorithmic bias",
      "Increased storage",
      "Better graphics",
    ],
    answer: "Algorithmic bias",
  },
  {
    question: "Human-centered AI focuses on:",
    options: [
      "Replacing humans",
      "Enhancing human well-being and control",
      "Eliminating human input",
      "Maximizing automation only",
    ],
    answer: "Enhancing human well-being and control",
  },
  {
    question: "Privacy in AI systems involves:",
    options: [
      "Collecting all available data",
      "Protecting user data and ensuring consent",
      "Sharing data publicly",
      "Ignoring regulations",
    ],
    answer: "Protecting user data and ensuring consent",
  },
  {
    question: "Which principle ensures AI systems are safe and reliable?",
    options: [
      "Robustness",
      "Popularity",
      "Speed",
      "Cost-efficiency",
    ],
    answer: "Robustness",
  },
  {
    question: "Inclusivity in AI means:",
    options: [
      "AI for elite users only",
      "AI accessible and fair for diverse populations",
      "AI limited to developers",
      "AI for businesses only",
    ],
    answer: "AI accessible and fair for diverse populations",
  },
  {
    question: "Governance in AI refers to:",
    options: [
      "Coding techniques",
      "Rules, policies, and oversight of AI systems",
      "Hardware upgrades",
      "Marketing strategies",
    ],
    answer: "Rules, policies, and oversight of AI systems",
  },
];

export default function Features() {
  const [selected, setSelected] = useState<(string | null)[]>(
    Array(questions.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qIndex: number, option: string) => {
    const updated = [...selected];
    updated[qIndex] = option;
    setSelected(updated);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const score = selected.reduce((total, ans, i) => {
    return ans === questions[i].answer ? total + 1 : total;
  }, 0);

  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold mb-8 text-center">
        MCQ Quiz Test
      </h2>

      {questions.map((q, qIndex) => (
        <div key={qIndex} className="mb-6 p-4 border rounded-lg shadow-sm">
          <h3 className="font-semibold mb-3">
            {qIndex + 1}. {q.question}
          </h3>

          <div className="flex flex-col gap-2">
            {q.options.map((opt, i) => (
              <label
                key={i}
     className={`p-2 border rounded cursor-pointer transition ${
      selected[qIndex] === opt
      ? "bg-blue-200 border-blue-400 text-black"
      : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
     }`}
        >
                <input
                  type="radio"
                  name={`question-${qIndex}`}
                  value={opt}
                  className="hidden"
                  onChange={() => handleSelect(qIndex, opt)}
                />
                {opt}
              </label>
            ))}
          </div>

          {submitted && (
            <p
              className={`mt-2 text-sm ${
                selected[qIndex] === q.answer
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              Correct Answer: {q.answer}
            </p>
          )}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="bg-black text-white px-6 py-3 rounded-md block mx-auto"
        >
          Submit
        </button>
      ) : (
        <div className="text-center mt-6">
          <h3 className="text-xl font-bold">
            Your Score: {score} / {questions.length}
          </h3>
        </div>
      )}
    </section>
  );
}