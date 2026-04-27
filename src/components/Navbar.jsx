"use client"

import { useState } from "react";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  Clock,
  DollarSign,
  Tag,
  Hand,
  Truck,
  Star,
  CreditCard,
  Info,
  X,
} from "lucide-react";

// Brand data
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

// Mega Menu Data
const megaMenuColumns = [
  [
    {
      title: "Injectable Steroids (Liquids)",
      items: ["Boldenone Undecylenate", "Dihydroboldenone Cypionate", "Drostanolone Enanthate", "Drostanolone Propionate", "Nandrolone Decanoate", "Nandrolone Phenylpropionate", "Primobolan Depot", "Sustanon", "Testosterone Acetate", "Testosterone Cypionate", "Testosterone Decanoate", "Testosterone Enanthate", "Testosterone Phenylpropionate", "Testosterone Propionate", "Testosterone Suspension", "Testosterone Undecanoate", "Trenbolone Acetate", "Trenbolone Enanthate", "Trenbolone Hexahydrobenzylcarbonate"]
    },
    {
      title: "Oral Steroids (Steroid Pills)",
      items: ["Anavar", "Dianabol", "Halotestin", "Turinabol", "Winstrol"]
    }
  ],
  [
    {
      title: "Peptides",
      items: ["AOD9604", "BPC-157", "Cagrilintide", "CJC-1295 DAC", "DSIP", "Epithalon", "Follistatin", "Fragment 176-191", "GHK-CU", "GHRP-2", "GHRP-6", "Glutathione", "HCG", "Hexarelin", "HMG", "IGF-1", "Ipamorelin", "Mazdutide", "Melanotan", "MOD GRF", "MOTS-C", "MYO", "NAD+"]
    },
    {
      title: "Sarms",
      items: ["Andarine S4", "Cardarine", "LGD-4033", "MK-677", "Ostarine", "RAD-140", "YK-11"]
    }
  ],
  [
    {
      title: "Post Cycle Therapy",
      items: ["Anastrozole", "Cabergoline", "Clomiphene Citrate", "Exemestane", "Proviron", "Tamoxifen Citrate"]
    },
    {
      title: "Fat Burners",
      items: ["Bromocriptine", "Clenbuterol", "Ketotifen", "Levothyroxine Sodium", "Liothyronine Sodium", "Orlistat", "Salbutamol", "Semaglutide (Ozempic)", "Sibutramine", "Tirzepatide"]
    }
  ],
  [
    {
      isStandalone: true,
      items: ["USA Domestic", "UK Domestic", "EU Domestic", "Men's Health", "Cycles (Steroid Programs)", "Lab Test", "Bulk Offers"]
    }
  ]
];

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [carouselStart, setCarouselStart] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const visibleCount = 9;

  const handlePrev = () =>
    setCarouselStart((prev) => Math.max(0, prev - 1));

  const handleNext = () =>
    setCarouselStart((prev) =>
      Math.min(brands.length - visibleCount, prev + 1)
    );

  const visibleBrands = brands.slice(carouselStart, carouselStart + visibleCount);

  return (
    <div className="w-full font-sans">

      {/* ── TOP BAR ── */}
      <div className="bg-[#111111] text-white text-xs py-1.5 overflow-hidden flex whitespace-nowrap w-full">
        <div className="animate-marquee flex items-center w-max hover:[animation-play-state:paused]">
          <div className="flex justify-around items-center w-screen px-4">
            <span className="text-secondary font-bold tracking-wide">2008</span>
            <span className="font-bold tracking-widest uppercase text-[11px]">
              Secure Payment &amp; Fast Shipping
            </span>
            <span className="text-secondary font-bold tracking-wide uppercase text-[11px]">
              Official Reliable Steroid Shop!
            </span>
          </div>
          <div className="flex justify-around items-center w-screen px-4">
            <span className="text-secondary font-bold tracking-wide">2008</span>
            <span className="font-bold tracking-widest uppercase text-[11px]">
              Secure Payment &amp; Fast Shipping
            </span>
            <span className="text-secondary font-bold tracking-wide uppercase text-[11px]">
              Official Reliable Steroid Shop!
            </span>
          </div>
        </div>
      </div>

      {/* ── PRIMARY HEADER ── */}
      <div className="bg-primary px-4 py-3 flex flex-wrap md:flex-nowrap items-center justify-between gap-4 relative z-[60]">

        {/* Mobile Hamburger & Logo */}
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            className="md:hidden text-white p-1 hover:bg-white/10 rounded-sm transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <a
            href="/"
            className="text-white font-extrabold text-2xl md:text-3xl select-none flex items-center gap-1"
            style={{ fontFamily: "Georgia, serif", letterSpacing: "-1px" }}
          >
            PHARMA
          </a>
        </div>

        {/* Mobile Cart Icon (Visible only on mobile) */}
        <a href="/cart" className="md:hidden text-white p-1 hover:bg-white/10 rounded-sm transition-colors">
          <ShoppingBag className="w-6 h-6" />
        </a>

        {/* Search Bar */}
        <div className="w-full md:flex-1 max-w-2xl order-3 md:order-none mt-2 md:mt-0">
          <div className="flex items-center bg-white rounded-sm overflow-hidden">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for product, category or brand..."
              className="flex-1 px-4 py-2.5 text-sm text-gray-600 outline-none placeholder-gray-400"
            />
            <button className="px-4 py-2.5 bg-white hover:bg-gray-50 transition-colors">
              <Search className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Right: Currency + Contact + Account Icons */}
        <div className="hidden md:flex flex-shrink-0 flex-col items-end gap-2">

          {/* Currency + Contact */}
          <div className="flex items-center gap-4 text-white text-xs">
            <span className="flex items-center gap-1 cursor-pointer hover:underline">
              <DollarSign className="w-3.5 h-3.5" />
              US Dollar
              <ChevronDown className="w-3 h-3" />
            </span>
            <span className="flex items-center gap-1 cursor-pointer hover:underline">
              <Clock className="w-3.5 h-3.5" />
              Contact
            </span>
          </div>

          {/* Account / Favorites / Cart */}
          <div className="flex items-center gap-5 text-white text-xs">
            <div className="relative group cursor-pointer pb-2 -mb-2">
              <div className="flex flex-col items-center gap-0.5 hover:text-gray-200 transition-colors">
                <User className="w-6 h-6" strokeWidth={1.5} />
                <span>Account</span>
              </div>
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-white rounded-sm shadow-xl border border-gray-200 w-32 flex flex-col py-1 text-gray-800 text-sm">
                  <a href="/login" className="px-4 py-2 hover:bg-gray-100 transition-colors text-left">Login</a>
                  <a href="/register" className="px-4 py-2 hover:bg-gray-100 transition-colors text-left">Register</a>
                </div>
              </div>
            </div>
            <button className="flex flex-col items-center gap-0.5 hover:text-gray-200 transition-colors">
              <Heart className="w-6 h-6" strokeWidth={1.5} />
              <span>Favorites</span>
            </button>
            <a href="/cart" className="flex flex-col items-center gap-0.5 hover:text-gray-200 transition-colors">
              <ShoppingBag className="w-6 h-6" strokeWidth={1.5} />
              <span>Cart</span>
            </a>
          </div>

        </div>
      </div>

      {/* ── NAV BAR (Desktop) ── */}
      <div className="hidden md:flex bg-[#222222] text-white text-sm items-center relative">

        {/* All Categories */}
        <div className="group">
          <button className="flex items-center gap-1.5 bg-primary group-hover:bg-white group-hover:text-black transition-colors px-4 py-3 font-semibold whitespace-nowrap h-full cursor-pointer">
            <Menu className="w-4 h-4" />
            All Categories
            <ChevronDown className="w-3 h-3 group-hover:text-secondary group-hover:rotate-180 transition-transform duration-200" />
          </button>
          
          {/* ── ALL CATEGORIES MEGA MENU ── */}
          <div className="absolute left-0 top-full w-full bg-white text-gray-800 py-6 px-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 shadow-xl border-t-[3px] border-primary translate-y-2 group-hover:translate-y-0 cursor-default max-h-[85vh] overflow-y-auto">
            <div className="grid grid-cols-4 gap-8">
              {megaMenuColumns.map((col, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-6">
                  {col.map((section, secIdx) => (
                    <div key={secIdx}>
                      {section.isStandalone ? (
                        <ul className="flex flex-col gap-6 font-bold text-[13px] text-gray-700">
                          {section.items.map((item, i) => (
                            <li key={i}>
                              <a href="#" className="hover:text-secondary transition-colors">
                                {item}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <>
                          <h3 className="font-bold text-gray-800 mb-4 text-[13px]">{section.title}</h3>
                          <ul className="flex flex-col gap-3 text-[12px] text-gray-500">
                            {section.items.map((item, i) => (
                              <li key={i}>
                                <a href="#" className="flex items-center gap-1.5 hover:text-secondary transition-colors">
                                  <span className="text-gray-400 text-[10px]">›</span> {item}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Brands */}
        <div className="group">
          <button className="flex items-center gap-1.5 px-4 py-3 hover:bg-[#333333] transition-colors whitespace-nowrap border-l border-[#444] h-full cursor-pointer">
            <Tag className="w-4 h-4" />
            Brands
            <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform duration-200" />
          </button>

          {/* ── BRAND CAROUSEL (Mega Menu) ── */}
          <div className="absolute left-0 top-full w-full bg-white py-4 px-2 flex items-center gap-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 shadow-xl border-t-[3px] border-primary translate-y-2 group-hover:translate-y-0">
            {/* Left Arrow */}
            <button
              onClick={handlePrev}
              disabled={carouselStart === 0}
              className="p-1 text-gray-500 hover:text-gray-800 disabled:opacity-30 flex-shrink-0 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Brand Items */}
            <div className="flex flex-1 items-end justify-around">
              {visibleBrands.map((brand, i) => (
                <div
                  key={carouselStart + i}
                  className="flex flex-col items-center gap-2 cursor-pointer group/brand w-[90px]"
                >
                  {/* Circle Logo */}
                  <div
                    className={`relative w-16 h-16 rounded-full border-2 ${brand.border || 'border-gray-200'} flex items-center justify-center
                      group-hover/brand:border-primary transition-colors shadow-sm overflow-hidden bg-white ${brand.bg}`}
                  >
                    {brand.image && (
                      <img src={brand.image} alt={brand.name} className="w-full h-full object-contain p-1.5" />
                    )}
                  </div>

                  {/* Brand Name */}
                  <div className="text-center">
                    <p className="text-xs font-semibold text-gray-800 leading-tight group-hover/brand:text-primary transition-colors">
                      {brand.name}
                    </p>
                    <p className="text-xs text-gray-500">{brand.country}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={handleNext}
              disabled={carouselStart >= brands.length - visibleCount}
              className="p-1 text-gray-500 hover:text-gray-800 disabled:opacity-30 flex-shrink-0 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* All Products */}
        <a href="/all-products" className="flex items-center gap-1.5 px-4 py-3 hover:bg-[#333333] transition-colors whitespace-nowrap border-l border-[#444]">
          <Hand className="w-4 h-4" />
          All Products
        </a>

        {/* Shipping */}
        <a href="/shipping" className="flex items-center gap-1.5 px-4 py-3 hover:bg-[#333333] transition-colors whitespace-nowrap border-l border-[#444]">
          <Truck className="w-4 h-4" />
          Shipping
        </a>

        {/* Why Pharma? */}
        <button className="flex items-center gap-1.5 px-4 py-3 hover:bg-[#333333] transition-colors whitespace-nowrap border-l border-[#444]">
          <Star className="w-4 h-4" />
          Why Pharma?
        </button>

        {/* Payment */}
        <button className="flex items-center gap-1.5 px-4 py-3 hover:bg-[#333333] transition-colors whitespace-nowrap border-l border-[#444]">
          <CreditCard className="w-4 h-4" />
          Payment
          <ChevronDown className="w-3 h-3" />
        </button>

        {/* Steroid Info Guide */}
        <button className="flex items-center gap-1.5 px-4 py-3 hover:bg-[#333333] transition-colors whitespace-nowrap border-l border-[#444]">
          <Info className="w-4 h-4" />
          Steroid Info Guide
        </button>

      </div>

      {/* ── MOBILE MENU SIDEBAR ── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/50 transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="absolute top-0 left-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl flex flex-col transform transition-transform overflow-y-auto">
            {/* Header */}
            <div className="bg-primary p-4 flex items-center justify-between text-white">
              <span className="font-extrabold text-2xl" style={{ fontFamily: "Georgia, serif", letterSpacing: "-1px" }}>PHARMA</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 hover:bg-white/10 rounded-sm">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Menu Items */}
            <div className="flex flex-col py-2">
              <a href="/login" className="px-5 py-3 border-b border-gray-100 flex items-center gap-3 text-gray-700 hover:bg-gray-50 font-medium">
                <User className="w-5 h-5 text-gray-400" /> Account
              </a>
              <a href="/all-products" className="px-5 py-3 border-b border-gray-100 flex items-center gap-3 text-gray-700 hover:bg-gray-50 font-medium">
                <Hand className="w-5 h-5 text-gray-400" /> All Products
              </a>
              <a href="/shipping" className="px-5 py-3 border-b border-gray-100 flex items-center gap-3 text-gray-700 hover:bg-gray-50 font-medium">
                <Truck className="w-5 h-5 text-gray-400" /> Shipping
              </a>
              
              {/* Categories */}
              <div className="px-5 py-4 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Categories
              </div>
              {megaMenuColumns.flat().map((section, idx) => (
                <div key={idx} className="flex flex-col">
                  {section.isStandalone ? (
                    section.items.map((item, i) => (
                      <a key={i} href="#" className="px-5 py-3 border-b border-gray-100 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors text-sm">
                        {item}
                      </a>
                    ))
                  ) : (
                    <div className="flex flex-col">
                      <div className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 font-semibold text-sm">
                        {section.title}
                      </div>
                      {section.items.map((item, i) => (
                        <a key={i} href="#" className="px-5 py-2.5 border-b border-gray-50 text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors text-sm pl-8">
                          {item}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}