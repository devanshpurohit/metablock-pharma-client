"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart, Eye, Flame } from "lucide-react";

// ─── Brand Data ───────────────────────────────────────────────────────────────
const brands = [
  { name: "Bull Pharma",   country: "USA", bg: "bg-gray-100", border: "border-gray-200", image: "https://www.getroids1.net/image/cache/catalog/BRAND%20LOGOS/bull-pharma-steroids-logo-160x160.png.webp" },
  { name: "Pharmaqo Labs", country: "USA", bg: "bg-gray-100", border: "border-gray-200", image: "https://www.getroids1.net/image/cache/catalog/BRAND%20LOGOS/pharmaqo-labs-logo-160x160.png.webp" },
  { name: "Evolve Biolabs",country: "INT", bg: "bg-gray-100", border: "border-gray-200", image: "https://www.getroids1.net/image/cache/catalog/BRANDS/evolve-biolabs-india-160x160.png.webp" },
  { name: "XT Labs",       country: "USA", bg: "bg-gray-100", border: "border-gray-200", image: "https://www.getroids1.net/image/cache/catalog/BRAND%20LOGOS/xt-labs-logo-160x160.png.webp" },
  { name: "Xeno Labs",     country: "US",  bg: "bg-gray-100", border: "border-gray-200", image: "https://www.getroids1.net/image/cache/catalog/BRAND%20LOGOS/xeno-labs-logo-160x160.png.webp" },
  { name: "Kassel Pharma", country: "USA", bg: "bg-gray-100", border: "border-gray-200", image: "https://www.getroids1.net/image/cache/catalog/BRANDS/kassel-pharma-logo-160x160.png.webp" },
  { name: "PeptidePlus",   country: "USA", bg: "bg-teal-400", border: "border-teal-300", image: "https://www.getroids1.net/image/cache/catalog/BRAND%20LOGOS/peptide-plus-logo-160x160.png.webp" },
  { name: "Driada Medical",country: "EU",  bg: "bg-gray-100", border: "border-gray-200", image: "https://www.getroids1.net/image/cache/catalog/BRAND%20LOGOS/driada-medical-logo-160x160.png.webp" },
  { name: "Omega Labs",    country: "USA", bg: "bg-gray-100", border: "border-gray-200", image: "https://www.getroids1.net/image/cache/catalog/BRAND%20LOGOS/omega-labs-steroids-logo-160x160.png.webp" },
  { name: "Sixpex",        country: "USA", bg: "bg-gray-100", border: "border-gray-200", image: "https://www.getroids1.net/image/cache/catalog/BRAND%20LOGOS/sixpex-logo-160x160.png.webp" },
];

// ─── Shipping Banners ─────────────────────────────────────────────────────────
const shippingBanners = [
  {
    label: "USA DOMESTIC",
    flagColors: ["#B22234", "#FFFFFF", "#3C3B6E"],
    type: "usa",
  },
  {
    label: "EU DOMESTIC",
    flagColors: ["#003399", "#FFCC00"],
    type: "eu",
  },
  {
    label: "UK DOMESTIC",
    flagColors: ["#012169", "#FFFFFF", "#C8102E"],
    type: "uk",
  },
  {
    label: "INTERNATIONAL SHIPPING",
    flagColors: ["#1a3a5c", "#2a6ab5"],
    type: "intl",
  },
];

// ─── Flag SVGs ────────────────────────────────────────────────────────────────
function UsaFlag() {
  return (
    <svg viewBox="0 0 300 180" className="w-full h-full object-cover opacity-80">
      {/* Stripes */}
      {[...Array(13)].map((_, i) => (
        <rect key={i} x="0" y={i * (180 / 13)} width="300" height={180 / 13}
          fill={i % 2 === 0 ? "#B22234" : "#FFFFFF"} />
      ))}
      {/* Canton */}
      <rect x="0" y="0" width="120" height={180 * 7 / 13} fill="#3C3B6E" />
      {/* Stars */}
      {[...Array(50)].map((_, i) => {
        const row = Math.floor(i / 6);
        const col = i % 6;
        const offset = row % 2 === 0 ? 0 : 10;
        return (
          <text key={i} x={10 + col * 18 + offset} y={10 + row * 14}
            fontSize="10" fill="white" textAnchor="middle">★</text>
        );
      })}
    </svg>
  );
}

function EuFlag() {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-full">
      <rect width="300" height="200" fill="#003399" />
      {/* EU circle of stars */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const cx = 150 + 60 * Math.cos(angle);
        const cy = 100 + 60 * Math.sin(angle);
        return (
          <text key={i} x={cx} y={cy} fontSize="18" fill="#FFCC00"
            textAnchor="middle" dominantBaseline="central">★</text>
        );
      })}
    </svg>
  );
}

function UkFlag() {
  return (
    <svg viewBox="0 0 300 180" className="w-full h-full">
      <rect width="300" height="180" fill="#012169" />
      {/* White diagonals */}
      <line x1="0" y1="0" x2="300" y2="180" stroke="white" strokeWidth="36" />
      <line x1="300" y1="0" x2="0" y2="180" stroke="white" strokeWidth="36" />
      {/* Red diagonals */}
      <line x1="0" y1="0" x2="300" y2="180" stroke="#C8102E" strokeWidth="20" />
      <line x1="300" y1="0" x2="0" y2="180" stroke="#C8102E" strokeWidth="20" />
      {/* White cross */}
      <rect x="120" y="0" width="60" height="180" fill="white" />
      <rect x="0" y="60" width="300" height="60" fill="white" />
      {/* Red cross */}
      <rect x="132" y="0" width="36" height="180" fill="#C8102E" />
      <rect x="0" y="72" width="300" height="36" fill="#C8102E" />
    </svg>
  );
}

function IntlFlag() {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-full">
      <defs>
        <radialGradient id="globe" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1e5ba8" />
          <stop offset="100%" stopColor="#0a2040" />
        </radialGradient>
      </defs>
      <rect width="300" height="200" fill="#0a1a2f" />
      {/* Globe circle */}
      <circle cx="80" cy="100" r="60" fill="url(#globe)" opacity="0.9" />
      {/* Latitude lines */}
      {[-30, 0, 30].map((y, i) => (
        <ellipse key={i} cx="80" cy={100 + y} rx="60" ry="8" fill="none"
          stroke="#4a9bd4" strokeWidth="1" opacity="0.6" />
      ))}
      {/* Longitude lines */}
      <ellipse cx="80" cy="100" rx="30" ry="60" fill="none" stroke="#4a9bd4" strokeWidth="1" opacity="0.6" />
      <ellipse cx="80" cy="100" rx="60" ry="60" fill="none" stroke="#4a9bd4" strokeWidth="1" opacity="0.6" />
      {/* Dot grid overlay */}
      {[...Array(8)].map((_, row) =>
        [...Array(12)].map((_, col) => (
          <circle key={`${row}-${col}`}
            cx={120 + col * 18} cy={20 + row * 24}
            r="1.5" fill="#2a6ab5" opacity="0.4" />
        ))
      )}
    </svg>
  );
}

const flagComponents = {
  usa: <UsaFlag />,
  eu: <EuFlag />,
  uk: <UkFlag />,
  intl: <IntlFlag />,
};

// ─── Tab Data ─────────────────────────────────────────────────────────────────
const tabs = [
  {
    id: "cart",
    label: "Most Added To Cart",
    icon: <ShoppingCart className="w-5 h-5" />,
    bg: "bg-[#e8f5ec]",
    activeBg: "bg-[#c8ecd4]",
    border: "border-[#b0dfc0]",
    text: "text-[#1a7a3a]",
  },
  {
    id: "viewed",
    label: "Most Viewed",
    icon: <Eye className="w-5 h-5" />,
    bg: "bg-[#fdf0ea]",
    activeBg: "bg-[#f9dece]",
    border: "border-[#f0c8b0]",
    text: "text-[#a04020]",
  },
  {
    id: "discounted",
    label: "Discounted Products",
    icon: <Flame className="w-5 h-5" />,
    bg: "bg-[#fdf8dc]",
    activeBg: "bg-[#f9f0b0]",
    border: "border-[#e8d870]",
    text: "text-[#8a7000]",
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Brands() {
  const [activeTab, setActiveTab] = useState("cart");
  const [carouselStart, setCarouselStart] = useState(0);
  const visibleCount = 9;

  const handlePrev = () => setCarouselStart((p) => Math.max(0, p - 1));
  const handleNext = () =>
    setCarouselStart((p) => Math.min(brands.length - visibleCount, p + 1));

  const visibleBrands = brands.slice(carouselStart, carouselStart + visibleCount);

  return (
    <div className="w-full bg-white font-sans">

      {/* ── BRAND CAROUSEL ── */}
      <div className="border-b border-gray-200 py-5 px-2 flex items-center gap-1 bg-white">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          disabled={carouselStart === 0}
          className="p-2 text-gray-500 hover:text-gray-900 disabled:opacity-25 flex-shrink-0 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Brands */}
        <div className="flex flex-1 items-start justify-start md:justify-around overflow-x-auto scrollbar-hide gap-4 md:gap-0 px-2 md:px-0">
          {visibleBrands.map((brand, i) => (
            <div
              key={carouselStart + i}
              className="flex flex-col items-center gap-2 cursor-pointer group w-[100px]"
            >
              {/* Circle */}
              <div className={`relative w-[72px] h-[72px] rounded-full border-2 ${brand.border} ${brand.bg}
                flex items-center justify-center shadow-sm group-hover:border-red-400 transition-colors overflow-hidden bg-white`}>
                {brand.image && (
                  <img src={brand.image} alt={brand.name} className="w-full h-full object-contain p-1.5" />
                )}
              </div>
              {/* Name */}
              <div className="text-center leading-tight">
                <p className="text-[11px] font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
                  {brand.name}
                </p>
                <p className="text-[11px] text-gray-500">{brand.country}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          disabled={carouselStart >= brands.length - visibleCount}
          className="p-2 text-gray-500 hover:text-gray-900 disabled:opacity-25 flex-shrink-0 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* ── TAB BUTTONS ── */}
      <div className="flex flex-col md:flex-row items-stretch gap-2 md:gap-0 px-4 mt-6">
        {tabs.map((tab, idx) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-2 py-4 px-6
              font-bold text-base md:text-lg border transition-all duration-200 rounded-md md:rounded-none
              ${activeTab === tab.id ? `${tab.activeBg} ${tab.border} ${tab.text}` : `${tab.bg} border-transparent ${tab.text} opacity-80`}
              ${idx === 0 ? "md:rounded-l-md" : ""}
              ${idx === tabs.length - 1 ? "md:rounded-r-md" : ""}
              hover:opacity-100
            `}
            style={{ fontFamily: "Georgia, serif" }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── SHIPPING BANNERS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-4 mt-6 mb-6">
        {shippingBanners.map((banner) => (
          <div
            key={banner.type}
            className="relative h-[130px] rounded-xl overflow-hidden cursor-pointer group shadow-md"
          >
            {/* Flag Background */}
            <div className="absolute inset-0 bg-black">
              {flagComponents[banner.type]}
            </div>

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

            {/* Label */}
            <div className="absolute inset-0 flex items-end justify-start p-3">
              <span
                className="text-white font-black text-xl leading-tight drop-shadow-lg"
                style={{ fontFamily: "'Impact', 'Arial Black', sans-serif", letterSpacing: "0.5px" }}
              >
                {banner.label}
              </span>
            </div>

            {/* Hover border effect */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/40 rounded-xl transition-colors" />
          </div>
        ))}
      </div>

    </div>
  );
}