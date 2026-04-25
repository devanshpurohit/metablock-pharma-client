"use client";

import { useState } from "react";

const customers = [
  "Sitemap",
  "Contact",
  "Conditions of Use",
  "Privacy Policy",
  "Shipping",
  "Steroids For Sale via Zelle",
  "Buy Steroids with Bitcoins",
  "FAQ",
];

const popularPages = [
  "Anabolic Steroids",
  "Injectable Steroids (Liquids)",
  "Oral Steroids(Steroid Pills)",
  "HGH / Peptides",
  "Post Cycle Therapy",
  "Fat Burners",
  "Cycles (Steroid Programs)",
  "Syringes (Injection)",
  "USA Domestic",
  "Turkish Pharmacy Products",
  "Steroids For Sale",
];

const featuredPages = [
  { label: "Boldenone Undecylenate", active: false },
  { label: "Drostanolone Enanthate", active: false },
  { label: "Drostanolone Propionate", active: false },
  { label: "Anavar", active: false },
  { label: "Dianabol", active: false },
  { label: "Halotestin", active: false },
  { label: "Glutathione", active: true },
  { label: "Hexarelin", active: false },
  { label: "Bromocriptine", active: false },
  { label: "Liothyronine Sodium", active: false },
];

const FooterLink = ({ label, active = false }) => (
  <li className="border-b border-gray-700 last:border-b-0">
    <a
      href="#"
      className={`flex items-center gap-2 py-2.5 text-sm transition-colors duration-150 ${
        active ? "text-red-500" : "text-gray-300 hover:text-white"
      }`}
    >
      <span className="text-xs">›</span>
      {label}
    </a>
  </li>
);

export default function Footer() {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);

  return (
    <footer className="bg-[#1a1a1a] text-white w-full">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* CUSTOMERS */}
          <div>
            <h3 className="text-white font-bold text-base tracking-wide mb-4 uppercase">
              Customers
            </h3>
            <ul>
              {customers.map((item) => (
                <FooterLink key={item} label={item} />
              ))}
            </ul>
          </div>

          {/* POPULAR PAGE */}
          <div>
            <h3 className="text-white font-bold text-base tracking-wide mb-4 uppercase">
              Popular Page
            </h3>
            <ul>
              {popularPages.map((item) => (
                <FooterLink key={item} label={item} />
              ))}
            </ul>
          </div>

          {/* FEATURED PAGES */}
          <div>
            <h3 className="text-white font-bold text-base tracking-wide mb-4 uppercase">
              Featured Pages
            </h3>
            <ul>
              {featuredPages.map((item) => (
                <FooterLink key={item.label} label={item.label} active={item.active} />
              ))}
            </ul>
          </div>

          {/* NEWSLETTER + FOLLOW US */}
          <div className="flex flex-col gap-8">
            {/* Newsletter */}
            <div>
              <h3 className="text-white font-bold text-base tracking-wide mb-3 uppercase">
                Newsletter
              </h3>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                Never miss an update or promotion by signing up for our newsletter.
              </p>

              {/* Email Input + Send Button */}
              <div className="flex items-stretch border border-gray-600 overflow-hidden mb-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-[#2a2a2a] text-gray-300 placeholder-gray-500 text-sm px-3 py-2.5 outline-none"
                />
                <button className="bg-white text-red-600 border-l border-gray-600 px-4 py-2.5 text-sm font-semibold flex items-center gap-1.5 hover:bg-gray-100 transition-colors">
                  {/* Email icon */}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send
                </button>
              </div>

              {/* Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 accent-red-500 cursor-pointer"
                />
                <span className="text-gray-400 text-xs">
                  I have read and agree to the{" "}
                  <a href="#" className="text-gray-300 hover:text-white underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            {/* Follow Us */}
            <div>
              <h3 className="text-white font-bold text-base tracking-wide mb-4 uppercase">
                Follow Us
              </h3>
              <div className="flex items-center gap-3">
                {/* Telegram */}
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-[#2AABEE] flex items-center justify-center hover:opacity-80 transition-opacity"
                >
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </a>

                {/* Chat / Message */}
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-[#2a2a2a] border border-gray-600 flex items-center justify-center hover:border-gray-400 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#c0392b] py-3 px-6 text-center">
        <p className="text-white text-sm font-medium">
          © 2025 All rights reserved.
        </p>
      </div>
    </footer>
  );
}