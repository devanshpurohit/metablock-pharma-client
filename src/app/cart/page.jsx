"use client";

import { useState } from "react";
import Link from "next/link";

const tabs = [
  { id: "recently", label: "Recently Viewed", icon: "arrow" },
  { id: "bestsellers", label: "Best Sellers", icon: "heart" },
  { id: "mostvoted", label: "Most Voted", icon: "chat" },
  { id: "theybought", label: "They Bought These Too", icon: "percent" },
];

const products = {
  recently: [
    { id: 1, badge: null, name: "Stanozolol Injection (ampoules) Hilma Biocare...", price: 52.0, image: "https://placehold.co/180x180/f5f5f5/999?text=Stanozolol" },
    { id: 2, badge: "USA DOMESTIC", name: "Levothyroxine T4 Beligas Pharma USA", price: 89.0, image: "https://placehold.co/180x180/f5f5f5/999?text=Levothyroxine" },
    { id: 3, badge: "EU DOMESTIC", name: "Liothymed 25 Driada Medical EU", price: 26.0, image: "https://placehold.co/180x180/f5f5f5/999?text=Liothymed" },
    { id: 4, badge: "USA DOMESTIC", name: "Omnadren 250 Jelfa USA", price: 120.0, image: "https://placehold.co/180x180/f5f5f5/999?text=Omnadren+250" },
    { id: 5, badge: "USA DOMESTIC", name: "Aquabull 100 Bull Pharma USA", price: 75.0, image: "https://placehold.co/180x180/f5f5f5/999?text=Aquabull+100" },
    { id: 6, badge: "EU DOMESTIC", name: "Boldenone Undecylenate Hilma Biocare EU", price: 55.0, image: "https://placehold.co/180x180/f5f5f5/999?text=Boldenone" },
  ],
  bestsellers: [
    { id: 7, badge: "USA DOMESTIC", name: "Testosterone Enanthate 250 mg USA", price: 75.0, image: "https://placehold.co/180x180/f5f5f5/999?text=Test+Enanthate" },
    { id: 8, badge: "USA DOMESTIC", name: "Anavar 10 mg Pharmaqo Labs US", price: 110.0, image: "https://placehold.co/180x180/f5f5f5/999?text=Anavar+10" },
    { id: 9, badge: "EU DOMESTIC", name: "Deca-Durabolin 300 mg Beligas EU", price: 65.0, image: "https://placehold.co/180x180/f5f5f5/999?text=Deca+300" },
    { id: 10, badge: "USA DOMESTIC", name: "Dianabol 20 mg Xeno Labs US", price: 89.0, image: "https://placehold.co/180x180/f5f5f5/999?text=Dianabol+20" },
    { id: 11, badge: "USA DOMESTIC", name: "Arimidex 1 mg 30 Tabs Xeno US", price: 86.0, image: "https://placehold.co/180x180/f5f5f5/999?text=Arimidex" },
    { id: 12, badge: "EU DOMESTIC", name: "Trenbolone Acetate 100 mg EU", price: 95.0, image: "https://placehold.co/180x180/f5f5f5/999?text=Tren+Ace" },
  ],
  mostvoted: [
    { id: 13, badge: "USA DOMESTIC", name: "HGH Somatropin 100IU Pharmaqo US", price: 199.0, image: "https://placehold.co/180x180/f5f5f5/999?text=HGH+100IU" },
    { id: 14, badge: "USA DOMESTIC", name: "Tirzepatide 5 PeptidePlus USA", price: 130.0, image: "https://placehold.co/180x180/f5f5f5/999?text=Tirzepatide" },
    { id: 15, badge: "EU DOMESTIC", name: "Winstrol 50 mg Driada Medical EU", price: 45.0, image: "https://placehold.co/180x180/f5f5f5/999?text=Winstrol+50" },
    { id: 16, badge: "USA DOMESTIC", name: "Clenbuterol 40 mcg Beligas USA", price: 55.0, image: "https://placehold.co/180x180/f5f5f5/999?text=Clenbuterol" },
    { id: 17, badge: "USA DOMESTIC", name: "Nolvadex 20 mg Pharmaqo USA", price: 38.0, image: "https://placehold.co/180x180/f5f5f5/999?text=Nolvadex" },
    { id: 18, badge: "EU DOMESTIC", name: "Masteron 200 mg Hilma Biocare EU", price: 72.0, image: "https://placehold.co/180x180/f5f5f5/999?text=Masteron" },
  ],
  theybought: [
    { id: 1, badge: null, name: "Stanozolol Injection (ampoules) Hilma Biocare...", price: 52.0, image: "https://placehold.co/180x180/f5f5f5/999?text=Stanozolol" },
    { id: 2, badge: "USA DOMESTIC", name: "Levothyroxine T4 Beligas Pharma USA", price: 89.0, image: "https://placehold.co/180x180/f5f5f5/999?text=Levothyroxine" },
    { id: 3, badge: "EU DOMESTIC", name: "Liothymed 25 Driada Medical EU", price: 26.0, image: "https://placehold.co/180x180/f5f5f5/999?text=Liothymed" },
    { id: 4, badge: "USA DOMESTIC", name: "Omnadren 250 Jelfa USA", price: 120.0, image: "https://placehold.co/180x180/f5f5f5/999?text=Omnadren+250" },
    { id: 5, badge: "USA DOMESTIC", name: "Aquabull 100 Bull Pharma USA", price: 75.0, image: "https://placehold.co/180x180/f5f5f5/999?text=Aquabull+100" },
    { id: 6, badge: "EU DOMESTIC", name: "Boldenone Undecylenate Hilma Biocare EU", price: 55.0, image: "https://placehold.co/180x180/f5f5f5/999?text=Boldenone" },
  ],
};

// ── Tab Icons ──
const TabIcon = ({ type, active }) => {
  const cls = `w-4 h-4 ${active ? "text-primary" : "text-gray-500"}`;
  if (type === "arrow") return (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
  if (type === "heart") return (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
  if (type === "chat") return (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
  if (type === "percent") return (
    <span className={`text-xs font-bold rounded-full bg-primary text-white w-4 h-4 flex items-center justify-center`}>%</span>
  );
  return null;
};

// ── Badge ──
const Badge = ({ label }) => {
  const isEU = label?.includes("EU");
  return (
    <span className={`flex items-center gap-1 text-[10px] font-bold tracking-wide uppercase text-white rounded px-2 py-1 ${isEU ? "bg-[#2a2a2a]" : "bg-[#1a1a1a]"}`}>
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
      {label}
    </span>
  );
};

// ── Product Card ──
const ProductCard = ({ product }) => (
  <div className="flex flex-col bg-white border border-gray-200 rounded-sm overflow-hidden min-w-[190px] w-[190px] hover:shadow-md transition-shadow cursor-pointer group relative">
    {product.badge && (
      <div className="absolute top-2 left-2 z-10">
        <Badge label={product.badge} />
      </div>
    )}
    <Link href="/product">
      <div className="flex items-center justify-center h-44 bg-white px-3 pt-8 pb-2">
        <img src={product.image} alt={product.name} className="max-h-36 max-w-full object-contain" />
      </div>
      <div className="p-3 border-t border-gray-100">
        <p className="text-sm text-gray-800 leading-snug min-h-[40px] group-hover:text-primary transition-colors">
          {product.name}
        </p>
        <p className="text-base font-bold text-gray-900 mt-2">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  </div>
);

// ── Main Page ──
export default function ShoppingCartPage() {
  const [activeTab, setActiveTab] = useState("theybought");

  const currentProducts = products[activeTab] || [];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Breadcrumb */}
      <div className="px-6 py-3 text-sm text-gray-500 flex items-center gap-1.5 border-b border-gray-100">
        <a href="/" className="hover:text-primary">Home</a>
        <span>›</span>
        <span className="text-gray-700">Shopping Cart</span>
      </div>

      <div className="px-6 py-12 max-w-5xl mx-auto text-center">
        {/* Page Title */}
        <h1 className="text-2xl font-normal text-gray-800 mb-4">Shopping Cart</h1>

        {/* Empty cart message */}
        <p className="text-base text-gray-600 mb-8">Your shopping cart is empty!</p>

        {/* Continue Button */}
        <div className="max-w-md mx-auto mb-16">
          <button className="w-full bg-primary hover:bg-secondary text-white font-semibold text-base py-4 rounded-sm transition-colors duration-150">
            Continue
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center justify-center gap-6 border-b border-gray-200 mb-6">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  active
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <TabIcon type={tab.icon} active={active} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Product Cards Row ── */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}