"use client";
import { useState, useEffect } from "react";
import api from "@/utils/api";
import { Send, Check, Shield } from "lucide-react";

const customerLinks = [
  { label: "Contact Desk", href: "/contact" },
  { label: "Conditions of Use", href: "/conditions" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Shipping Policies", href: "/shipping" },
  { label: "Zelle Payments Guide", href: "/payment-methods" },
  { label: "Buy Steroids with Bitcoin", href: "/buy-steroids-bitcoin" },
  { label: "FAQ Help", href: "/#faq" },
];

const FooterLink = ({ label, active = false, href = "#" }) => (
  <li className="list-none">
    <a
      href={href}
      className={`flex items-center gap-1.5 py-1.5 text-[11px] transition-all duration-300 transform hover:translate-x-1.5 uppercase tracking-wider ${
        active ? "text-secondary font-bold" : "text-gray-400 hover:text-secondary font-bold"
      }`}
    >
      <span className="text-secondary opacity-65 text-[12px] leading-none">›</span>
      {label}
    </a>
  </li>
);

export default function Footer() {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/categories?limit=100")
      .then((res) => {
        setCategories(res.data?.data || []);
      })
      .catch((err) => {
        console.error("Error loading categories for footer:", err);
      });
  }, []);

  const handleSubscribe = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim()) {
      alert("Please enter a valid email address.");
      return;
    }
    if (!agreed) {
      alert("You must agree to the Privacy Policy to subscribe.");
      return;
    }
    try {
      await api.post("/newsletter", { email: email.trim() });
      alert("Subscribed successfully!");
      setEmail("");
    } catch (err) {
      console.error("Error subscribing to newsletter:", err);
      alert(err.response?.data?.message || "Failed to subscribe. Please try again.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubscribe();
    }
  };

  return (
    <footer className="bg-[#0e0e11] text-white w-full border-t border-white/5 relative overflow-hidden font-sans">
      
      {/* Decorative top gold line */}
      <div className="w-full h-[3px] bg-gradient-to-r from-primary via-secondary to-primary opacity-80"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* CUSTOMERS */}
          <div>
            <h3 className="text-white font-serif font-normal text-base tracking-wider mb-6 pb-2 border-b border-secondary/20 w-fit">
              Customer Desk
            </h3>
            <ul className="flex flex-col gap-1.5 p-0 m-0">
              {customerLinks.map((item) => (
                <FooterLink key={item.label} label={item.label} href={item.href} />
              ))}
            </ul>
          </div>

          {/* POPULAR CATEGORIES */}
          <div>
            <h3 className="text-white font-serif font-normal text-base tracking-wider mb-6 pb-2 border-b border-secondary/20 w-fit">
              Product Catalog
            </h3>
            <ul className="flex flex-col gap-1.5 p-0 m-0">
              {categories.length > 0 ? (
                categories.slice(0, 7).map((cat) => (
                  <FooterLink
                    key={cat._id}
                    label={cat.categoryName}
                    href={`/all-products?category=${cat._id}`}
                  />
                ))
              ) : (
                <>
                  <FooterLink label="Injectable Steroids" href="/all-products" />
                  <FooterLink label="Oral Steroids" href="/all-products" />
                  <FooterLink label="HGH / Peptides" href="/all-products" />
                  <FooterLink label="Post Cycle Therapy" href="/all-products" />
                  <FooterLink label="Fat Burners" href="/all-products" />
                </>
              )}
            </ul>
          </div>

          {/* SECURITY ASSURANCE */}
          <div>
            <h3 className="text-white font-serif font-normal text-base tracking-wider mb-6 pb-2 border-b border-secondary/20 w-fit">
              Shop Guarantee
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 bg-[#16161b]/50 border border-white/5 rounded-2xl p-4">
                <Shield className="w-8 h-8 text-secondary flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Secure Payment</h4>
                  <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                    All payment transaction data is encrypted and secure. We accept Bitcoin, Zelle, and Credit Cards.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-[#16161b]/50 border border-white/5 rounded-2xl p-4">
                <Check className="w-8 h-8 text-secondary flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">100% Genuine</h4>
                  <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                    Direct partner of major GMP-certified athletic steroid labs with public test records.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* NEWSLETTER */}
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-white font-serif font-normal text-base tracking-wider mb-6 pb-2 border-b border-secondary/20 w-fit">
                Newsletter
              </h3>
              <p className="text-gray-400 text-xs mb-4.5 leading-relaxed font-medium">
                Subscribe for private discounts, price drops, and restocking notices.
              </p>

              {/* Form Input Container */}
              <div className="flex flex-col gap-2.5 w-full">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-[#16161b] border border-white/10 rounded-xl text-gray-200 placeholder-gray-500 text-xs px-4.5 py-3 outline-none focus:border-secondary transition-all w-full"
                />
                <button 
                  onClick={handleSubscribe}
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 border-0 px-5.5 py-3 text-[10px] font-extrabold uppercase tracking-widest text-white rounded-xl shadow-md hover:shadow-gold-glow flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                  Subscribe Now
                </button>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer select-none mt-4">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-700 bg-transparent text-secondary focus:ring-0 cursor-pointer mt-0.5"
                />
                <span className="text-gray-400 text-[10px] leading-tight font-semibold">
                  I agree to the privacy policy rules.
                </span>
              </label>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Bottom Bar */}
      <div className="bg-[#08080a] py-4 px-6 text-center border-t border-white/5">
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
          © 2026 Roidspharma. Sterile Laboratory Grade Compounds. All rights reserved.
        </p>
      </div>
    </footer>
  );
}