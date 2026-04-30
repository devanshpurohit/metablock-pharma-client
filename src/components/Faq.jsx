"use client";

import { useState } from "react";

const faqs = [
  {
    id: 1,
    question: "Which Steroids Are The Best For Beginners?",
    answer:
      "Are you considering using steroids to kickstart your fitness journey? It's essential to make informed choices right from the start. Let's explore the best steroids for beginners that can help you achieve your fitness goals safely and effectively. Anavar (Oxandrolone): It is Ideal for beginners due to its mild nature. It promotes lean muscle gains with minimal side effects. Therefore, it enhances strength and endurance. Testosterone (Testosterone Enanthate): It's a fundamental steroid for muscle growth. A beginner may like to take this to boost energy, vitality, and muscle mass. It is when used under professional guidance. Deca-Durabolin (Nandrolone Decanoate): Known for promoting joint and muscle recovery. Excellent for bulking cycles. Dianabol (Methandrostenolone): Rapid muscle gains in a short time. It enhances nitrogen retention as well as protein synthesis. Trenbolone (Trenbolone Acetate): Reserved for more experienced users but highly effective. Dramatic muscle growth and fat loss. Choosing the best steroids for beginners depends on their goals, experience level, and medical advice. Anavar, Testosterone, Deca-Durabolin, Dianabol, and Trenbolone are popular options, but responsible usage is key to success. Stay committed to your fitness journey, and you'll achieve the results you desire. Roidspharma is the best place to buy steroids USA domestic for getting such safe steroids.",
    defaultOpen: true,
  },
  {
    id: 2,
    question:
      "Why Choosing Safe Steroids Is Essential For Your Health And Fitness Journey?",
    answer:
      "Choosing safe steroids is critical to protect your long-term health. Unsafe or counterfeit steroids can cause serious side effects including liver damage, cardiovascular issues, and hormonal imbalances. Always source from reputable suppliers and consult a healthcare professional before starting any steroid cycle.",
  },
  {
    id: 3,
    question: "How Can Steroids Aid Weight Loss?",
    answer:
      "Certain steroids like Anavar and Clenbuterol are known for their fat-burning properties. They help preserve lean muscle mass while promoting fat loss, making them popular during cutting cycles. Combined with a proper diet and training program, they can significantly accelerate weight loss results.",
  },
  {
    id: 4,
    question: "How Steroids For Sale Make Strength Training Easier?",
    answer:
      "Steroids enhance protein synthesis and nitrogen retention in muscles, leading to faster recovery and increased strength. This allows athletes to train harder and more frequently, breaking through plateaus and achieving new personal records in their strength training programs.",
  },
  {
    id: 5,
    question: "What Is The Most Effective Strategy To Grow Muscle Quickly?",
    answer:
      "The most effective muscle growth strategy combines progressive overload training, adequate protein intake, sufficient rest, and when applicable, a well-planned steroid cycle. Consistency in all these areas is key. Testosterone-based compounds are often considered the foundation for any muscle-building cycle.",
  },
  {
    id: 6,
    question: "When To Start A Steroid Cycle For The Best Results?",
    answer:
      "Beginners should first establish a solid training foundation of at least 2-3 years before considering steroids. Starting too early can interfere with natural hormone production. When ready, a simple testosterone-only cycle is recommended as the first cycle, under medical supervision.",
  },
  {
    id: 7,
    question: "How Increasing Testosterone Levels Influence You Losing Weight?",
    answer:
      "Higher testosterone levels increase metabolic rate, promote fat oxidation, and help maintain muscle mass during caloric deficit. This hormonal environment makes it easier to lose fat while preserving the lean muscle tissue that keeps your metabolism elevated.",
  },
  {
    id: 8,
    question: "How Safe Steroids Make You Stronger?",
    answer:
      "Safe steroids work by increasing red blood cell production, enhancing oxygen delivery to muscles, boosting protein synthesis, and improving nitrogen retention. These mechanisms collectively lead to greater strength gains, faster recovery, and improved athletic performance.",
  },
  {
    id: 9,
    question: "How Quickly Domestic Steroids USA Develop Muscle?",
    answer:
      "Results vary by compound and individual, but many users notice strength increases within the first 2 weeks and visible muscle gains by week 4-6 of a cycle. USA domestic steroids ensure faster delivery and quality assurance, making them a preferred choice for American athletes.",
  },
  {
    id: 10,
    question: "What Are The Advantages Of Taking Anabolic Steroids?",
    answer:
      "Anabolic steroids offer numerous benefits including accelerated muscle growth, enhanced recovery, increased strength and endurance, improved bone density, and boosted red blood cell production. When used responsibly with proper medical guidance, they can be powerful tools for achieving fitness goals.",
  },
];

export default function FAQSection() {
  const [openId, setOpenId] = useState(1);

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-6 font-sans">
      <div className="flex flex-col gap-0">
        {faqs.map((faq, index) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className={`border border-gray-300 ${
                index !== 0 ? "-mt-px" : ""
              } bg-white`}
            >
              {/* Question Row */}
              <button
                onClick={() => toggle(faq.id)}
                className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-gray-50 transition-colors duration-150 focus:outline-none"
              >
                <span
                  className={`text-sm font-semibold text-gray-900 pr-4 leading-snug ${
                    isOpen ? "text-black" : ""
                  }`}
                >
                  {faq.question}
                </span>

                {/* Chevron Icon */}
                <span className="flex-shrink-0 text-gray-500">
                  {isOpen ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </span>
              </button>

              {/* Answer */}
              {isOpen && (
                <div className="px-4 pb-5">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* ── Banner Image ── */}
      <div className="mt-8 flex justify-center">
        <img 
          src="https://www.getroids1.net/image/catalog/_banners/weship-2.webp?v=1.0" 
          alt="We Ship Banner" 
          className="w-full h-auto object-contain"
        />
      </div>
    </section>
  );
}