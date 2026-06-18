"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import api, { resolveImageUrl } from "@/utils/api";

// Map banner type → keywords to match against categoryName
const BANNER_KEYWORDS = {
  usa:  ["usa", "domestic", "united states", "american"],
  eu:   ["eu", "europe", "european"],
  uk:   ["uk", "united kingdom", "britain", "british"],
  intl: ["international", "worldwide", "global", "shipping"],
};

const shippingBanners = [
  { label: "USA DOMESTIC",        desc: "Fast 2-4 day domestic delivery within United States.", flagColors: ["#B22234","#FFFFFF","#3C3B6E"], type: "usa" },
  { label: "EU DOMESTIC",         desc: "Secure delivery to all European Union member states.", flagColors: ["#003399","#FFCC00"],           type: "eu" },
  { label: "UK DOMESTIC",         desc: "Direct shipping to England, Scotland, Wales & NI.", flagColors: ["#012169","#FFFFFF","#C8102E"], type: "uk" },
  { label: "INTERNATIONAL SHIPPING", desc: "Reliable worldwide shipping with tracking number.", flagColors: ["#1a3a5c","#2a6ab5"],       type: "intl" },
];

// ─── Flag SVGs ────────────────────────────────────────────────────────────────
function UsaFlag() {
  return (
    <svg viewBox="0 0 300 180" className="w-full h-full object-cover opacity-60">
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
    <svg viewBox="0 0 300 200" className="w-full h-full object-cover opacity-60">
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
    <svg viewBox="0 0 300 180" className="w-full h-full object-cover opacity-60">
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
    <svg viewBox="0 0 300 200" className="w-full h-full object-cover opacity-60">
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Brands() {
  const router = useRouter();
  const [brands, setBrands]             = useState([]);
  const [categoryMap, setCategoryMap]   = useState({});   // { bannerType -> categoryId }
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [carouselStart, setCarouselStart] = useState(0);
  const visibleCount = 9;

  useEffect(() => {
    Promise.all([
      api.get("/brands?limit=100"),
      api.get("/categories?limit=100"),
    ]).then(([brandRes, catRes]) => {
      const fetched = brandRes.data.data || [];
      setBrands(
        fetched.map((b) => ({
          id: b._id,
          name: b.brandName,
          image: resolveImageUrl(b.logo),
          country: "GENUINE PRODUCTS",
        }))
      );

      const cats = catRes.data.data || [];
      const map = {};
      shippingBanners.forEach(({ type }) => {
        const keywords = BANNER_KEYWORDS[type];
        const match = cats.find((c) =>
          keywords.some((kw) =>
            c.categoryName?.toLowerCase().includes(kw)
          )
        );
        if (match) map[type] = match._id;
      });
      setCategoryMap(map);
      setLoading(false);
    }).catch((err) => {
      console.error("Error fetching brands/categories:", err);
      setError("Failed to load.");
      setLoading(false);
    });
  }, []);

  const handleBannerClick = (type) => {
    const catId = categoryMap[type];
    if (catId) {
      router.push(`/all-products?category=${catId}`);
    } else {
      router.push("/all-products");
    }
  };

  const handlePrev = () => setCarouselStart((p) => Math.max(0, p - 1));
  const handleNext = () =>
    setCarouselStart((p) =>
      Math.min(Math.max(0, brands.length - visibleCount), p + 1)
    );

  const visibleBrands = brands.slice(carouselStart, carouselStart + visibleCount);

  return (
    <div className="w-full bg-gradient-to-b from-[#FDFBF7] to-[#FAF8F5] pt-12 pb-6 px-4 md:px-8 font-sans border-b border-secondary/5">
      
      {/* ── Section Title ── */}
      <div className="max-w-7xl mx-auto mb-10 text-center">
        <span className="text-secondary text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">
          PARTNER LABORATORIES
        </span>
        <h2 className="font-serif text-2xl md:text-3.5xl text-gray-900 font-normal tracking-wide">
          Authorized Manufacturers
        </h2>
        <div className="w-16 h-[2px] bg-secondary/30 mx-auto mt-4"></div>
      </div>

      {/* ── BRAND GRID (Horizontal Shelf) ── */}
      <div className="max-w-7xl mx-auto flex items-center gap-4 relative mb-2">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          disabled={carouselStart === 0}
          className="absolute left-0 md:-left-5 z-20 hidden md:flex p-2 text-gray-400 hover:text-secondary disabled:opacity-20 flex-shrink-0 transition-all border border-secondary/15 rounded-full bg-white shadow-md hover:scale-105 cursor-pointer active:scale-95 items-center justify-center"
          aria-label="Previous Brand"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Brands Outer Row */}
        <div className="flex-1 flex items-center justify-start md:justify-around overflow-x-auto scrollbar-hide gap-5 px-6 py-2">
          {brands.map((brand, i) => {
            const isVisibleOnDesktop = i >= carouselStart && i < carouselStart + visibleCount;
            return (
              <div
                key={brand.id || i}
                onClick={() => router.push(`/all-products?brand=${brand.id}`)}
                className={`flex-col items-center gap-3.5 cursor-pointer group w-[105px] shrink-0 ${
                  isVisibleOnDesktop ? "flex" : "flex md:hidden"
                }`}
              >
                {/* Circle Logo Box */}
                <div className="relative w-20 h-20 rounded-full border border-secondary/15 shadow-sm flex items-center justify-center p-2 hover:border-secondary hover:shadow-gold-glow transition-all duration-300 transform group-hover:scale-[1.03] bg-white">
                  {brand.image && (
                    <img src={brand.image} alt={brand.name} className="w-full h-full object-contain p-0.5" />
                  )}
                </div>
                {/* Name Details */}
                <div className="text-center leading-tight">
                  <p className="text-[11px] font-bold text-gray-800 group-hover:text-secondary transition-colors duration-200">
                    {brand.name}
                  </p>
                  <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">{brand.country}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          disabled={carouselStart >= brands.length - visibleCount}
          className="absolute right-0 md:-right-5 z-20 hidden md:flex p-2 text-gray-400 hover:text-secondary disabled:opacity-20 flex-shrink-0 transition-all border border-secondary/15 rounded-full bg-white shadow-md hover:scale-105 cursor-pointer active:scale-95 items-center justify-center"
          aria-label="Next Brand"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}