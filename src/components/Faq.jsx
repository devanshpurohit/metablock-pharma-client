"use client";

import { useState, useEffect } from "react";
import api, { resolveImageUrl } from "@/utils/api";

export default function FAQSection() {
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bannerUrl, setBannerUrl] = useState("https://www.getroids1.net/image/catalog/_banners/weship-2.webp?v=1.0");

  useEffect(() => {
    Promise.all([
      api.get("/asked-questions?limit=100&status=true"),
      api.get("/settings")
    ])
      .then(([faqRes, settingsRes]) => {
        const list = faqRes.data?.data || [];
        setFaqs(list);
        if (list.length > 0) {
          setOpenId(list[0]._id);
        }
        
        const settings = settingsRes.data || {};
        if (settings.weShipBanner) {
          setBannerUrl(resolveImageUrl(settings.weShipBanner));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading FAQs and settings:", err);
        setLoading(false);
      });
  }, []);

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-10 font-sans text-center text-gray-500">
        Loading questions...
      </div>
    );
  }

  if (faqs.length === 0) {
    return null;
  }

  return (
    <section id="faq" className="w-full py-6 font-sans bg-white">
      {/* FAQ Accordion container */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-0">
          {faqs.map((faq, index) => {
            const isOpen = openId === faq._id;
            return (
              <div
                key={faq._id}
                className={`border border-gray-300 ${
                  index !== 0 ? "-mt-px" : ""
                } bg-white`}
              >
                {/* Question Row */}
                <button
                  onClick={() => toggle(faq._id)}
                  className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-gray-50 hover:text-primary transition-colors duration-150 focus:outline-none cursor-pointer"
                >
                  <span
                    className={`text-sm font-semibold text-gray-900 pr-4 leading-snug ${
                      isOpen ? "text-primary font-bold" : ""
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
      </div>

      {/* ── Banner Image ── */}
      <div className="mt-8 w-full">
        <img 
          src={bannerUrl} 
          alt="We Ship Banner" 
          className="w-full h-auto object-cover min-h-[100px]"
        />
      </div>
    </section>
  );
}