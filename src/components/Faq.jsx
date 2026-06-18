"use client";
import { useState, useEffect } from "react";
import { HelpCircle, ChevronDown, Mail, MessageSquare } from "lucide-react";
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
      <div className="w-full bg-[#FDFBF7] py-16 font-sans text-center text-gray-500">
        <span className="inline-block w-8 h-8 border-2 border-secondary/35 border-t-secondary rounded-full animate-spin"></span>
        <p className="mt-3 text-xs font-bold uppercase tracking-wider text-gray-400">Loading FAQ center...</p>
      </div>
    );
  }

  if (faqs.length === 0) {
    return null;
  }

  return (
    <section id="faq" className="w-full py-16 font-sans bg-gradient-to-b from-[#FAF8F5] to-[#FDFBF7] border-b border-secondary/5 relative overflow-hidden">
      {/* Decorative gold mesh light glow */}
      <div className="absolute bottom-0 right-10 w-[400px] h-[200px] bg-secondary/[0.02] blur-[90px] pointer-events-none rounded-full"></div>
      
      {/* ── Section Title ── */}
      <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
        <span className="text-secondary text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">
          HELP CENTER
        </span>
        <h2 className="font-serif text-gray-900 text-2xl md:text-3.5xl font-normal tracking-wide">
          Frequently Asked Questions
        </h2>
        <div className="w-16 h-[2px] bg-secondary/30 mx-auto mt-4"></div>
      </div>

      {/* ── SPLIT LAYOUT CONTAINER ── */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Support Hub Card (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-secondary/15 shadow-md rounded-3xl p-8 flex flex-col justify-between text-gray-800 relative overflow-hidden min-h-[300px]">
          {/* Accent glow shadow */}
          <div className="bg-gradient-to-r from-secondary/5 to-transparent blur-3xl rounded-full absolute -top-16 -left-16 w-64 h-64 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <span className="text-secondary text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-1.5 border border-secondary/20 px-3 py-1 rounded-full w-fit bg-secondary/5">
                <HelpCircle className="w-3.5 h-3.5" />
                CUSTOMER ASSISTANCE
              </span>
              
              <h3 className="font-serif text-2.5xl font-normal leading-tight text-gray-900 tracking-wide mb-4 mt-3">
                Got Questions?<br/>We Have Answers.
              </h3>
              
              <p className="text-gray-500 text-xs leading-relaxed mb-6 font-medium">
                Can't find the answers you need in our standard guide? Drop us a line or open a ticket. Our support team is here to assist you 24/7.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 mt-auto w-full">
              <a 
                href="/contact" 
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-xs py-3 rounded-xl transition-all duration-300 cursor-pointer border-0 active:scale-[0.98] w-full text-center"
              >
                <Mail className="w-4 h-4" />
                Contact Support
              </a>
              <button 
                onClick={() => {
                  if (typeof window !== "undefined" && window.Tawk_API) {
                    window.Tawk_API.maximize();
                  } else {
                    alert("Support desk is online. Please use the chat widget in the bottom right corner.");
                  }
                }}
                className="flex items-center justify-center gap-2 bg-transparent hover:bg-secondary/5 border border-secondary/20 text-secondary font-extrabold text-xs py-3 rounded-xl transition-all duration-300 cursor-pointer active:scale-[0.98] w-full"
              >
                <MessageSquare className="w-4 h-4 text-secondary" />
                Start Live Chat
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Accordion Tiles List (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-3.5">
          {faqs.map((faq) => {
            const isOpen = openId === faq._id;
            return (
              <div
                key={faq._id}
                className={`border rounded-2xl overflow-hidden bg-white shadow-sm transition-all duration-300 ${
                  isOpen 
                    ? "border-secondary/35 shadow-md shadow-[#8D5E21]/5" 
                    : "border-black/[0.04] hover:border-secondary/20"
                }`}
              >
                {/* Question row trigger */}
                <button
                  onClick={() => toggle(faq._id)}
                  className="w-full flex items-center justify-between px-6 py-4.5 text-left transition-colors duration-250 focus:outline-none cursor-pointer border-0 bg-transparent"
                >
                  <span
                    className={`text-xs md:text-sm font-extrabold leading-snug transition-colors duration-200 ${
                      isOpen ? "text-secondary font-bold" : "text-gray-800"
                    }`}
                  >
                    {faq.question}
                  </span>

                  {/* Icon */}
                  <span className={`flex-shrink-0 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-secondary" : ""}`}>
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                {/* Answer drawer content */}
                {isOpen && (
                  <div className="px-6 pb-5 border-t border-black/[0.03] pt-4">
                    <p className="text-[11px] md:text-xs text-gray-600 leading-relaxed font-medium">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Banner Image Frame ── */}
      <div className="max-w-7xl mx-auto px-6 mt-16">
        <div className="rounded-[32px] overflow-hidden border border-secondary/15 p-2 bg-white shadow-2xl">
          <img 
            src={bannerUrl} 
            alt="We Ship Banner" 
            className="w-full h-auto object-cover min-h-[100px] rounded-[24px] opacity-90 hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      </div>

    </section>
  );
}