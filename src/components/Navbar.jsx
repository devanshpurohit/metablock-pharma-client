"use client";

import { useState, useEffect } from "react";
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
  LogOut,
  Settings,
  Send,
} from "lucide-react";
import api, { resolveImageUrl } from "@/utils/api";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useFavorites } from "@/context/FavoritesContext";

export default function Navbar() {
  const { cartItems, setIsCartOpen } = useCart();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const { currency, setCurrency } = useCurrency();
  const { favorites } = useFavorites();
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [carouselStart, setCarouselStart] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [customer, setCustomer] = useState(null);
  const visibleCount = 9;

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("customerUser");
      const storedToken = localStorage.getItem("customerToken");
      if (storedUser && storedToken) {
        try {
          setCustomer(JSON.parse(storedUser));
        } catch (e) {
          setCustomer(null);
        }
      } else {
        setCustomer(null);
      }
    };

    checkAuth();

    // Listen for custom authentication changes (e.g. login/register)
    window.addEventListener("customerAuthChange", checkAuth);
    return () => {
      window.removeEventListener("customerAuthChange", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customerUser");
    setCustomer(null);
    window.dispatchEvent(new Event("customerAuthChange"));
    window.location.href = "/login";
  };

  useEffect(() => {
    api.get("/brands?limit=100")
      .then((res) => {
        const fetched = res.data.data || [];
        setBrands(
          fetched.map((b) => ({
            name: b.brandName,
            image: resolveImageUrl(b.logo),
            country: "USA",
            bg: "bg-gray-100",
            border: "border-gray-200",
          }))
        );
      })
      .catch((err) => console.error("Error fetching brands for navbar:", err));

    api.get("/categories?limit=100")
      .then((res) => {
        setCategories(res.data.data || []);
      })
      .catch((err) => console.error("Error fetching categories for navbar:", err));
  }, []);

  const handlePrev = () =>
    setCarouselStart((prev) => Math.max(0, prev - 1));

  const handleNext = () =>
    setCarouselStart((prev) =>
      Math.min(Math.max(0, brands.length - visibleCount), prev + 1)
    );

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/all-products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const visibleBrands = brands.slice(carouselStart, carouselStart + visibleCount);

  return (
    <div className="w-full font-sans">

      {/* ── TOP BAR ── */}
      <div className="bg-[#111111] text-white text-xs py-2.5 overflow-hidden flex whitespace-nowrap w-full border-b border-white/5 shadow-sm">
        <div className="animate-marquee flex items-center w-max hover:[animation-play-state:paused]">
          <div className="flex justify-around items-center w-screen px-4">
            <span className="text-secondary font-bold tracking-wide">EST. 2008</span>
            <span className="font-semibold tracking-widest uppercase text-[10px] opacity-90">
              Secure Payment &amp; Fast Worldwide Shipping
            </span>
            <span className="text-secondary font-bold tracking-wide uppercase text-[10px]">
              Official Reliable Steroid Shop!
            </span>
          </div>
          <div className="flex justify-around items-center w-screen px-4">
            <span className="text-secondary font-bold tracking-wide">EST. 2008</span>
            <span className="font-semibold tracking-widest uppercase text-[10px] opacity-90">
              Secure Payment &amp; Fast Worldwide Shipping
            </span>
            <span className="text-secondary font-bold tracking-wide uppercase text-[10px]">
              Official Reliable Steroid Shop!
            </span>
          </div>
        </div>
      </div>

      {/* ── STICKY HEADER GROUP ── */}
      <div className="sticky top-0 z-[90] shadow-md">
        {/* ── PRIMARY HEADER ── */}
        <div className="bg-primary px-6 py-4 flex flex-wrap md:flex-nowrap items-center justify-between gap-4 relative z-[60]">

          {/* Mobile Hamburger & Logo */}
          <div className="flex items-center gap-2 md:gap-4">
          <button 
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-full transition-all duration-200"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <a
            href="/"
            className="flex text-white font-extrabold select-none items-center gap-2 transform hover:scale-[1.02] transition-transform duration-200"
          >
            <img 
              src="/assets/pharma.png" 
              alt="Roidspharma Logo" 
              className="h-16 md:h-28 w-auto object-contain"
            />
          </a>
        </div>

        {/* Mobile Cart Icon (Visible only on mobile) */}
        <button 
          onClick={() => setIsCartOpen(true)} 
          className="md:hidden text-white p-2 hover:bg-white/10 rounded-full transition-all duration-200 relative"
          aria-label="Open Cart"
        >
          <ShoppingBag className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute top-0.5 right-0.5 bg-amber-500 text-white text-[9px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center shadow-sm animate-pulse">
              {cartCount}
            </span>
          )}
        </button>

        {/* Search Bar */}
        <div className="w-full md:flex-1 max-w-2xl order-3 md:order-none mt-2 md:mt-0">
          <div className="flex items-center bg-[#FDFBF7] rounded-full overflow-hidden border border-[#8D5E21]/20 focus-within:border-secondary focus-within:ring-4 focus-within:ring-[#8D5E21]/15 transition-all duration-300 shadow-sm">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for product, category or brand..."
              className="flex-1 px-5 py-2.5 text-sm text-gray-700 outline-none placeholder-gray-400 bg-transparent border-0 focus:ring-0"
            />
            <button 
              onClick={handleSearch}
              className="px-5 py-2.5 bg-transparent hover:bg-gray-150 text-gray-500 hover:text-secondary transition-colors duration-200"
              aria-label="Search button"
            >
              <Search className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Right: Currency + Contact + Account Icons */}
        <div className="hidden md:flex flex-shrink-0 flex-col items-end gap-2.5">

          {/* Currency + Contact */}
          <div className="flex items-center gap-4 text-white text-xs opacity-90">
            {/* Currency Switcher */}
            <div className="relative group cursor-pointer pb-2 -mb-2">
              <span className="flex items-center gap-1 hover:text-secondary transition-colors duration-200 font-medium">
                <DollarSign className="w-3.5 h-3.5 text-secondary" />
                {currency === "INR" ? "INR (₹)" : "US Dollar ($)"}
                <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform duration-300" />
              </span>
              
              <div className="absolute right-0 top-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pt-2 transform translate-y-1 group-hover:translate-y-0">
                <div className="w-3 h-3 bg-[#141414] backdrop-blur-md rotate-45 absolute top-0.5 right-6 z-40 border-t border-l border-white/10"></div>
                <div className="bg-[#141414]/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl w-40 flex flex-col py-2 text-white text-xs relative z-50">
                  <button 
                    onClick={() => setCurrency("USD")}
                    className={`px-4 py-2.5 hover:bg-white/10 text-left font-bold transition-all duration-150 ${currency === "USD" ? "text-secondary" : "text-white"}`}
                  >
                    $ US Dollar
                  </button>
                  <button 
                    onClick={() => setCurrency("INR")}
                    className={`px-4 py-2.5 hover:bg-white/10 text-left font-bold transition-all duration-150 ${currency === "INR" ? "text-secondary" : "text-white"}`}
                  >
                    ₹ INR (Rupee)
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Link */}
            <a href="/contact" className="flex items-center gap-1 hover:text-secondary transition-colors duration-200 font-medium">
              <Clock className="w-3.5 h-3.5 text-secondary" />
              Contact
            </a>
          </div>

          {/* Account / Favorites / Cart */}
          <div className="flex items-center gap-6 text-white text-xs">
            <div className="relative group cursor-pointer pb-2 -mb-2">
              <div className="flex flex-col items-center gap-0.5 hover:text-secondary transition-colors duration-200">
                <User className="w-5.5 h-5.5" strokeWidth={1.75} />
                <span className="font-semibold">{customer ? customer.name.split(' ')[0] : "Account"}</span>
              </div>
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pt-2 transform translate-y-1 group-hover:translate-y-0">
                {/* Arrow Pointer */}
                <div className="w-3 h-3 bg-[#141414] backdrop-blur-md rotate-45 absolute top-0.5 right-6 z-40 border-t border-l border-white/10"></div>
                <div className="bg-[#141414]/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl w-52 flex flex-col py-2.5 text-white text-sm relative z-50">
                  {customer ? (
                    <>
                      <div className="px-4 py-2 text-gray-400 font-bold border-b border-white/10 text-[10px] tracking-wider uppercase truncate mb-1" title={customer.name}>
                        {customer.name}
                      </div>
                      
                      <a href="/account" className="px-4 py-2.5 hover:bg-white/10 transition-all duration-150 text-left flex items-center gap-3 text-white font-medium hover:text-secondary group/item">
                        <Settings className="w-4 h-4 text-gray-400 group-hover/item:text-secondary" />
                        My Account
                      </a>
                      
                      <a href="/orders" className="px-4 py-2.5 hover:bg-white/10 transition-all duration-150 text-left flex items-center gap-3 text-white font-medium hover:text-secondary group/item">
                        <ShoppingBag className="w-4 h-4 text-gray-400 group-hover/item:text-secondary" />
                        All Orders
                      </a>
                      
                      <a href="/submit-payment" className="px-4 py-2.5 hover:bg-white/10 transition-all duration-150 text-left flex items-center gap-3 text-white font-medium hover:text-secondary group/item">
                        <Send className="w-4 h-4 text-gray-400 group-hover/item:text-secondary" />
                        Submit Payment
                      </a>
                      
                      <button 
                        onClick={handleLogout} 
                        className="w-full px-4 py-2.5 hover:bg-red-500/20 transition-all duration-150 text-left text-red-400 font-semibold flex items-center gap-3 cursor-pointer bg-transparent border-0 mt-1.5 border-t border-white/5"
                      >
                        <LogOut className="w-4 h-4 text-red-400" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <a href="/login" className="px-4 py-2.5 hover:bg-white/10 hover:text-secondary transition-all text-left block font-semibold">Login</a>
                      <a href="/register" className="px-4 py-2.5 hover:bg-white/10 hover:text-secondary transition-all text-left block font-semibold border-t border-white/5">Register</a>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <a href="/favorites" className="flex flex-col items-center gap-0.5 hover:text-secondary transition-colors duration-200 relative">
              <div className="relative">
                <Heart className="w-5.5 h-5.5" strokeWidth={1.75} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                    {favorites.length}
                  </span>
                )}
              </div>
              <span className="font-semibold">Favorites</span>
            </a>
            
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="flex flex-col items-center gap-0.5 hover:text-secondary transition-colors duration-200 cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-5.5 h-5.5" strokeWidth={1.75} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="font-semibold">Cart</span>
            </button>
          </div>

        </div>
      </div>

      {/* ── NAV BAR (Desktop) ── */}
      <div className="hidden md:flex bg-[#1E1E1E] text-white text-xs font-bold items-center relative border-b border-white/5">

        {/* All Categories */}
        <div className="group">
          <button className="flex items-center gap-2 bg-[#8D5E21] hover:bg-[#734B1A] transition-colors duration-300 px-6 py-3.5 whitespace-nowrap h-full cursor-pointer uppercase tracking-wider">
            <Menu className="w-4 h-4" />
            All Categories
            <ChevronDown className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-300 text-white/85" />
          </button>
          
          {/* ── ALL CATEGORIES MEGA MENU ── */}
          <div className="absolute left-0 top-full w-full bg-[#FDFBF7]/98 backdrop-blur-xl border border-secondary/10 shadow-2xl rounded-b-3xl py-8 px-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border-t-4 border-secondary translate-y-2 group-hover:translate-y-0 cursor-default max-h-[85vh] overflow-y-auto">
            <div className="grid grid-cols-4 gap-x-6 gap-y-3 max-h-[60vh] overflow-y-auto w-full">
              {categories.map((category) => (
                <div key={category._id} className="py-1">
                  <a
                    href={`/all-products?category=${category._id}`}
                    className="font-bold text-gray-800 text-xs hover:text-secondary transition-all flex items-center gap-1.5 hover:translate-x-2 duration-300"
                  >
                    <span className="text-secondary text-[14px] font-normal leading-none">›</span>
                    {category.categoryName}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Brands */}
        <div className="group">
          <button className="flex items-center gap-1.5 px-5 py-3.5 hover:text-secondary hover:bg-white/5 transition-all whitespace-nowrap border-l border-white/5 h-full cursor-pointer uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5 text-secondary" />
            Brands
            <ChevronDown className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-300 text-white/50" />
          </button>

          {/* ── BRAND CAROUSEL (Mega Menu) ── */}
          <div className="absolute left-0 top-full w-full bg-[#FDFBF7]/98 backdrop-blur-xl border border-secondary/10 shadow-2xl rounded-b-3xl py-6 px-8 flex items-center gap-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border-t-4 border-secondary translate-y-2 group-hover:translate-y-0">
            {/* Left Arrow */}
            <button
              onClick={handlePrev}
              disabled={carouselStart === 0}
              className="p-1.5 text-gray-400 hover:text-secondary disabled:opacity-20 flex-shrink-0 transition-colors border border-secondary/10 rounded-full hover:bg-secondary/5"
              aria-label="Previous Brand"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Brand Items */}
            <div className="flex flex-1 items-end justify-around">
              {visibleBrands.map((brand, i) => (
                <div
                  key={carouselStart + i}
                  onClick={() => window.location.href = `/all-products?brand=${brand.id}`}
                  className="flex flex-col items-center gap-2.5 cursor-pointer group/brand w-[90px] transform hover:scale-105 transition-transform duration-300"
                >
                  {/* Circle Logo */}
                  <div
                    className={`relative w-16 h-16 rounded-full border border-secondary/20 flex items-center justify-center shadow-sm hover:shadow-gold-glow hover:border-secondary transition-all duration-300 overflow-hidden bg-white p-2`}
                  >
                    {brand.image && (
                      <img src={brand.image} alt={brand.name} className="w-full h-full object-contain p-1" />
                    )}
                  </div>

                  {/* Brand Name */}
                  <div className="text-center">
                    <p className="text-[11px] font-bold text-gray-800 leading-tight group-hover/brand:text-secondary transition-colors">
                      {brand.name}
                    </p>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-0.5">{brand.country}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={handleNext}
              disabled={carouselStart >= brands.length - visibleCount}
              className="p-1.5 text-gray-400 hover:text-secondary disabled:opacity-20 flex-shrink-0 transition-colors border border-secondary/10 rounded-full hover:bg-secondary/5"
              aria-label="Next Brand"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* All Products */}
        <a href="/all-products" className="flex items-center gap-1.5 px-5 py-3.5 hover:text-secondary hover:bg-white/5 transition-all whitespace-nowrap border-l border-white/5 uppercase tracking-wider">
          <Hand className="w-3.5 h-3.5 text-secondary" />
          All Products
        </a>

        {/* Shipping */}
        <a href="/shipping" className="flex items-center gap-1.5 px-5 py-3.5 hover:text-secondary hover:bg-white/5 transition-all whitespace-nowrap border-l border-white/5 uppercase tracking-wider">
          <Truck className="w-3.5 h-3.5 text-secondary" />
          Shipping
        </a>

        {/* Why Roidspharma? */}
        <a href="/why-roidspharma" className="flex items-center gap-1.5 px-5 py-3.5 hover:text-secondary hover:bg-white/5 transition-all whitespace-nowrap border-l border-white/5 uppercase tracking-wider">
          <Star className="w-3.5 h-3.5 text-secondary" />
          Why Roidspharma?
        </a>

        {/* Payment Dropdown */}
        <div className="group relative h-full flex items-center">
          <button className="flex items-center gap-1.5 px-5 py-3.5 hover:text-secondary hover:bg-white/5 transition-all whitespace-nowrap border-l border-white/5 h-full cursor-pointer uppercase tracking-wider">
            <CreditCard className="w-3.5 h-3.5 text-secondary" />
            Payment
            <ChevronDown className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-300 text-white/50" />
          </button>

          {/* Dropdown Menu */}
          <div className="absolute left-0 top-full bg-[#1E1E1E]/95 backdrop-blur-md border border-white/5 rounded-b-2xl shadow-2xl py-2 w-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 translate-y-2 group-hover:translate-y-0">
            <a 
              href="/payment-methods" 
              className="block px-5 py-3 hover:bg-white/10 hover:text-secondary transition-all text-xs font-semibold text-gray-200 border-b border-white/5"
            >
              Payments for Steroids
            </a>
            <a 
              href="/buy-steroids-bitcoin" 
              className="block px-5 py-3 hover:bg-white/10 hover:text-secondary transition-all text-xs font-semibold text-gray-200 border-b border-white/5"
            >
              Buy Steroids Bitcoin
            </a>
            <a 
              href="/buy-steroids-credit-card" 
              className="block px-5 py-3 hover:bg-white/10 hover:text-secondary transition-all text-xs font-semibold text-gray-200"
            >
              Buy Steroids Credit Card
            </a>
          </div>
        </div>

        {/* Steroid Info Guide */}
        <a href="/steroids-guide" className="flex items-center gap-1.5 px-5 py-3.5 hover:text-secondary hover:bg-white/5 transition-all whitespace-nowrap border-l border-white/5 uppercase tracking-wider">
          <Info className="w-3.5 h-3.5 text-secondary" />
          Steroid Info Guide
        </a>

      </div>
      </div>

      {/* ── MOBILE MENU SIDEBAR ── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="absolute top-0 left-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl flex flex-col transform transition-transform duration-300 overflow-y-auto rounded-r-3xl border-r border-gray-100">
            {/* Header */}
            <div className="bg-primary px-6 py-5 flex items-center justify-between text-white shadow-md">
              <a href="/" className="flex items-center">
                <img src="/assets/pharma.png" alt="Roidspharma Logo" className="h-20 w-auto object-contain" />
              </a>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5.5 h-5.5" />
              </button>
            </div>
            
            {/* Menu Items */}
            <div className="flex flex-col py-4">
              {customer ? (
                <>
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 text-gray-800 font-bold bg-gray-50/50">
                    <User className="w-5 h-5 text-primary" /> Hi, {customer.name}
                  </div>
                  <a href="/account" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-3.5 border-b border-gray-100 flex items-center gap-3 text-gray-700 hover:bg-gray-50 transition-colors font-semibold">
                    <Settings className="w-5 h-5 text-gray-400" /> My Account
                  </a>
                  <a href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-3.5 border-b border-gray-100 flex items-center gap-3 text-gray-700 hover:bg-gray-50 transition-colors font-semibold">
                    <ShoppingBag className="w-5 h-5 text-gray-400" /> All Orders
                  </a>
                  <a href="/submit-payment" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-3.5 border-b border-gray-100 flex items-center gap-3 text-gray-700 hover:bg-gray-50 transition-colors font-semibold">
                    <Send className="w-5 h-5 text-gray-400" /> Submit Payment
                  </a>
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }} 
                    className="w-full px-6 py-3.5 border-b border-gray-100 flex items-center gap-3 text-red-600 hover:bg-red-50/10 transition-colors font-bold text-left cursor-pointer bg-transparent border-0 outline-none"
                  >
                    <LogOut className="w-5 h-5 text-red-500" /> Logout
                  </button>
                </>
              ) : (
                <a href="/login" className="px-6 py-3.5 border-b border-gray-100 flex items-center gap-3 text-gray-700 hover:bg-gray-50 transition-colors font-semibold">
                  <User className="w-5 h-5 text-gray-400" /> Account / Login
                </a>
              )}
              <a href="/all-products" className="px-6 py-3.5 border-b border-gray-100 flex items-center gap-3 text-gray-700 hover:bg-gray-50 transition-colors font-semibold">
                <Hand className="w-5 h-5 text-gray-400" /> All Products
              </a>
              <a href="/shipping" className="px-6 py-3.5 border-b border-gray-100 flex items-center gap-3 text-gray-700 hover:bg-gray-50 transition-colors font-semibold">
                <Truck className="w-5 h-5 text-gray-400" /> Shipping
              </a>
              <a 
                href="/favorites" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="px-6 py-3.5 border-b border-gray-100 flex items-center justify-between text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
              >
                <span className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-gray-400" /> Favorites
                </span>
                {favorites.length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold rounded-full px-2 py-0.5 shadow-sm animate-pulse">
                    {favorites.length}
                  </span>
                )}
              </a>
              <a 
                href="/contact" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="px-6 py-3.5 border-b border-gray-100 flex items-center gap-3 text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
              >
                <Clock className="w-5 h-5 text-gray-400" /> Contact
              </a>
              <div className="px-6 py-3.5 border-b border-gray-100 flex items-center justify-between text-gray-700 font-semibold select-none">
                <span className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-gray-400" /> Currency
                </span>
                <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                  <button
                    onClick={() => setCurrency("USD")}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all border-0 cursor-pointer ${
                      currency === "USD"
                        ? "bg-[#8D5E21] text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900 bg-transparent"
                    }`}
                  >
                    USD ($)
                  </button>
                  <button
                    onClick={() => setCurrency("INR")}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all border-0 cursor-pointer ${
                      currency === "INR"
                        ? "bg-[#8D5E21] text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900 bg-transparent"
                    }`}
                  >
                    INR (₹)
                  </button>
                </div>
              </div>

              {/* Payment Mobile Options */}
              <div className="px-6 py-4 bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">
                Payment Options
              </div>
              <a href="/payment-methods" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-3.5 border-b border-gray-100 text-gray-700 hover:bg-gray-50 transition-colors font-medium pl-10 flex items-center gap-2">
                <span className="text-gray-400 text-xs font-semibold">›</span> Payments for Steroids
              </a>
              <a href="/buy-steroids-bitcoin" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-3.5 border-b border-gray-100 text-gray-700 hover:bg-gray-50 transition-colors font-medium pl-10 flex items-center gap-2">
                <span className="text-gray-400 text-xs font-semibold">›</span> Buy Steroids Bitcoin
              </a>
              <a href="/buy-steroids-credit-card" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-3.5 border-b border-gray-100 text-gray-700 hover:bg-gray-50 transition-colors font-medium pl-10 flex items-center gap-2">
                <span className="text-gray-400 text-xs font-semibold">›</span> Buy Steroids Credit Card
              </a>
              
              {/* Categories */}
              <div className="px-6 py-4 bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">
                Categories
              </div>
              {categories.map((category) => (
                <a
                  key={category._id}
                  href={`/all-products?category=${category._id}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-6 py-3.5 border-b border-gray-100 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors text-sm pl-10 flex items-center gap-2 font-medium"
                >
                  <span className="text-gray-400 text-xs font-semibold">›</span>
                  {category.categoryName}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}