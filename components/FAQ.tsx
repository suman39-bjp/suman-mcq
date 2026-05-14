"use client";
import { useState } from "react";

const faqs = [
  {
    q: "What is this platform?",
    a: "It helps you turn study material into quizzes and notes.",
  },
  {
    q: "Is it free?",
    a: "Yes, you can start for free.",
  },
  {
    q: "How does it work?",
    a: "Upload content and AI generates learning tools.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-6">

        <h2 className="text-3xl font-bold text-center mb-10">
          Frequently Asked Questions
        </h2>

        {faqs.map((item, i) => (
          <div key={i} className="border-b py-4">
            <button
              className="w-full text-left font-medium"
              onClick={() => setOpen(open === i ? null : i)}
            >
              {item.q}
            </button>

            {open === i && (
              <p className="mt-2 text-gray-600">
                {item.a}
              </p>
            )}
          </div>
        ))}

      </div>
    </section>
  );
}