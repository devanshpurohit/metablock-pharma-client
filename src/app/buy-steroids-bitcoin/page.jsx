"use client";

import { useState, useEffect } from "react";
import api from "@/utils/api";
import CustomerReviews from "@/components/Review";

export default function BuySteroidsBitcoinPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/pages/buy-steroids-bitcoin")
      .then((res) => {
        setContent(res.data?.content || "");
      })
      .catch((err) => {
        console.error("Error loading Buy Steroids Bitcoin page:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      <style>{`
        .cms-content h2 { font-size: 1.5rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.75rem; text-decoration: underline; }
        .cms-content h3 { font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        .cms-content p { margin-bottom: 1rem; line-height: 1.625; }
        .cms-content ul { list-style-type: disc; padding-left: 1.25rem; margin-bottom: 1rem; }
        .cms-content ol { list-style-type: decimal; padding-left: 1.25rem; margin-bottom: 1rem; }
        .cms-content li { margin-bottom: 0.25rem; }
        .cms-content strong { font-weight: 700; }
        .cms-content em { font-style: italic; }
        .cms-content a { color: #8D5E21; text-decoration: underline; }
      `}</style>

      {/* Breadcrumb */}
      <div className="px-6 py-3 text-sm text-gray-500 flex items-center gap-1.5 border-b border-gray-100">
        <a href="/" className="hover:text-primary">Home</a>
        <span>›</span>
        <span className="text-gray-700">Buy Steroids Bitcoin</span>
      </div>

      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="text-2xl font-normal text-gray-800 mb-6">
          Buy Steroids Bitcoin
        </h1>

        {loading ? (
          <div className="text-center text-gray-500 py-20">Loading...</div>
        ) : (
          <div 
            className="text-sm text-gray-800 leading-relaxed cms-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
      
      {/* Customer Reviews Section */}
      <CustomerReviews />
    </div>
  );
}
