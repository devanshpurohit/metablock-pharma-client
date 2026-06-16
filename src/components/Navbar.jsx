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
            className="hidden md:flex text-white font-extrabold text-2xl md:text-3xl select-none items-center gap-2"
            style={{ letterSpacing: "-1px" }}
          >
            <img 
              src="/assets/pharma.png" 
              alt="Roidspharma Logo" 
              className="h-16 md:h-24 w-auto object-contain"
            />
          </a>
        </div>

        {/* Mobile Cart Icon (Visible only on mobile) */}
        <button 
          onClick={() => setIsCartOpen(true)} 
          className="md:hidden text-white p-1 hover:bg-white/10 rounded-sm transition-colors relative"
        >
          <ShoppingBag className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

        {/* Search Bar */}
        <div className="w-full md:flex-1 max-w-2xl order-3 md:order-none mt-2 md:mt-0">
          <div className="flex items-center bg-white rounded-sm overflow-hidden">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for product, category or brand..."
              className="flex-1 px-4 py-2.5 text-sm text-gray-600 outline-none placeholder-gray-400"
            />
            <button 
              onClick={handleSearch}
              className="px-4 py-2.5 bg-white hover:bg-gray-50 transition-colors"
            >
              <Search className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Right: Currency + Contact + Account Icons */}
        <div className="hidden md:flex flex-shrink-0 flex-col items-end gap-2">

          {/* Currency + Contact */}
          <div className="flex items-center gap-4 text-white text-xs">
            {/* Currency Switcher */}
            <div className="relative group cursor-pointer pb-2 -mb-2">
              <span className="flex items-center gap-1 hover:text-gray-200 transition-colors">
                <DollarSign className="w-3.5 h-3.5" />
                {currency === "INR" ? "INR (₹)" : "US Dollar ($)"}
                <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform duration-200" />
              </span>
              
              <div className="absolute right-0 top-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pt-2">
                <div className="w-3 h-3 bg-[#141414] rotate-45 absolute top-0 right-6 z-40 border-t border-l border-white/5"></div>
                <div className="bg-[#141414] rounded-xl shadow-2xl border border-white/10 w-40 flex flex-col py-1.5 text-white text-xs relative z-50">
                  <button 
                    onClick={() => setCurrency("USD")}
                    className={`px-4 py-2 hover:bg-white/5 text-left font-bold ${currency === "USD" ? "text-secondary" : "text-white"}`}
                  >
                    $ US Dollar
                  </button>
                  <button 
                    onClick={() => setCurrency("INR")}
                    className={`px-4 py-2 hover:bg-white/5 text-left font-bold ${currency === "INR" ? "text-secondary" : "text-white"}`}
                  >
                    ₹ INR (Rupee)
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Link */}
            <a href="/contact" className="flex items-center gap-1 hover:underline">
              <Clock className="w-3.5 h-3.5" />
              Contact
            </a>
          </div>

          {/* Account / Favorites / Cart */}
          <div className="flex items-center gap-5 text-white text-xs">
            <div className="relative group cursor-pointer pb-2 -mb-2">
              <div className="flex flex-col items-center gap-0.5 hover:text-gray-200 transition-colors">
                <User className="w-6 h-6" strokeWidth={1.5} />
                <span>{customer ? customer.name.split(' ')[0] : "Account"}</span>
              </div>
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pt-2">
                {/* Arrow Pointer */}
                <div className="w-3 h-3 bg-[#141414] rotate-45 absolute top-0 right-6 z-40 border-t border-l border-white/5"></div>
                <div className="bg-[#141414] rounded-xl shadow-2xl border border-white/10 w-48 flex flex-col py-2.5 text-white text-sm relative z-50">
                  {customer ? (
                    <>
                      <div className="px-4 py-2 text-gray-400 font-semibold border-b border-white/10 text-xs tracking-wider uppercase truncate" title={customer.name}>
                        {customer.name}
                      </div>
                      
                      <a href="/account" className="px-4 py-2.5 hover:bg-white/5 transition-colors text-left flex items-center gap-3 text-white font-medium hover:text-secondary group/item">
                        <Settings className="w-4.5 h-4.5 text-gray-400 group-hover/item:text-secondary" />
                        My Account
                      </a>
                      
                      <a href="/orders" className="px-4 py-2.5 hover:bg-white/5 transition-colors text-left flex items-center gap-3 text-white font-medium hover:text-secondary group/item">
                        <ShoppingBag className="w-4.5 h-4.5 text-gray-400 group-hover/item:text-secondary" />
                        All Orders
                      </a>
                      
                      <a href="/submit-payment" className="px-4 py-2.5 hover:bg-white/5 transition-colors text-left flex items-center gap-3 text-white font-medium hover:text-secondary group/item">
                        <Send className="w-4.5 h-4.5 text-gray-400 group-hover/item:text-secondary" />
                        Submit Payment
                      </a>
                      
                      <button 
                        onClick={handleLogout} 
                        className="w-full px-4 py-2.5 hover:bg-red-500/10 transition-colors text-left text-red-400 font-semibold flex items-center gap-3 cursor-pointer bg-transparent border-0 mt-1 border-t border-white/5"
                      >
                        <LogOut className="w-4.5 h-4.5 text-red-400" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <a href="/login" className="px-4 py-2.5 hover:bg-white/5 transition-colors text-left block font-medium">Login</a>
                      <a href="/register" className="px-4 py-2.5 hover:bg-white/5 transition-colors text-left block font-medium">Register</a>
                    </>
                  )}
                </div>
              </div>
            </div>
            <a href="/favorites" className="flex flex-col items-center gap-0.5 hover:text-gray-200 transition-colors relative">
              <div className="relative">
                <Heart className="w-6 h-6" strokeWidth={1.5} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </div>
              <span>Favorites</span>
            </a>
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="flex flex-col items-center gap-0.5 hover:text-gray-200 transition-colors cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-6 h-6" strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span>Cart</span>
            </button>
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
            <div className="grid grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto w-full">
              {categories.map((category) => (
                <div key={category._id} className="py-1">
                  <a
                    href={`/all-products?category=${category._id}`}
                    className="font-bold text-gray-800 text-[13px] hover:text-primary transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-primary text-[14px] font-normal">›</span>
                    {category.categoryName}
                  </a>
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

        {/* Why Roidspharma? */}
        <a href="/why-roidspharma" className="flex items-center gap-1.5 px-4 py-3 hover:bg-[#333333] transition-colors whitespace-nowrap border-l border-[#444]">
          <Star className="w-4 h-4" />
          Why Roidspharma?
        </a>

        {/* Payment Dropdown */}
        <div className="group relative h-full flex items-center">
          <button className="flex items-center gap-1.5 px-4 py-3 hover:bg-[#333333] transition-colors whitespace-nowrap border-l border-[#444] h-full cursor-pointer">
            <CreditCard className="w-4 h-4" />
            Payment
            <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform duration-200" />
          </button>

          {/* Dropdown Menu */}
          <div className="absolute left-0 top-full bg-[#222222] border-t-[3px] border-primary shadow-2xl py-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 translate-y-2 group-hover:translate-y-0">
            <a 
              href="/payment-methods" 
              className="block px-4 py-2.5 hover:bg-[#333333] hover:text-secondary transition-colors text-[13px] font-semibold text-gray-200"
            >
              Payments for Steroids
            </a>
            <a 
              href="/buy-steroids-bitcoin" 
              className="block px-4 py-2.5 hover:bg-[#333333] hover:text-secondary transition-colors text-[13px] font-semibold text-gray-200"
            >
              Buy Steroids Bitcoin
            </a>
            <a 
              href="/buy-steroids-credit-card" 
              className="block px-4 py-2.5 hover:bg-[#333333] hover:text-secondary transition-colors text-[13px] font-semibold text-gray-200"
            >
              Buy Steroids Credit Card
            </a>
          </div>
        </div>

        {/* Steroid Info Guide */}
        <a href="/steroids-guide" className="flex items-center gap-1.5 px-4 py-3 hover:bg-[#333333] transition-colors whitespace-nowrap border-l border-[#444]">
          <Info className="w-4 h-4" />
          Steroid Info Guide
        </a>

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
              <a href="/" className="flex items-center">
                <img src="/assets/pharma.png" alt="Roidspharma Logo" className="h-16 w-auto object-contain" />
              </a>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 hover:bg-white/10 rounded-sm">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Menu Items */}
            <div className="flex flex-col py-2">
              {customer ? (
                <>
                  <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3 text-gray-700 font-semibold bg-gray-50">
                    <User className="w-5 h-5 text-primary" /> Hi, {customer.name}
                  </div>
                  <a href="/account" onClick={() => setIsMobileMenuOpen(false)} className="px-5 py-3 border-b border-gray-100 flex items-center gap-3 text-gray-700 hover:bg-gray-50 font-medium">
                    <Settings className="w-5 h-5 text-gray-400" /> My Account
                  </a>
                  <a href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="px-5 py-3 border-b border-gray-100 flex items-center gap-3 text-gray-700 hover:bg-gray-50 font-medium">
                    <ShoppingBag className="w-5 h-5 text-gray-400" /> All Orders
                  </a>
                  <a href="/submit-payment" onClick={() => setIsMobileMenuOpen(false)} className="px-5 py-3 border-b border-gray-100 flex items-center gap-3 text-gray-700 hover:bg-gray-50 font-medium">
                    <Send className="w-5 h-5 text-gray-400" /> Submit Payment
                  </a>
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }} 
                    className="w-full px-5 py-3 border-b border-gray-100 flex items-center gap-3 text-red-600 hover:bg-gray-50 font-semibold text-left cursor-pointer bg-transparent border-0 outline-none"
                  >
                    <LogOut className="w-5 h-5 text-red-500" /> Logout
                  </button>
                </>
              ) : (
                <a href="/login" className="px-5 py-3 border-b border-gray-100 flex items-center gap-3 text-gray-700 hover:bg-gray-50 font-medium">
                  <User className="w-5 h-5 text-gray-400" /> Account / Login
                </a>
              )}
              <a href="/all-products" className="px-5 py-3 border-b border-gray-100 flex items-center gap-3 text-gray-700 hover:bg-gray-50 font-medium">
                <Hand className="w-5 h-5 text-gray-400" /> All Products
              </a>
              <a href="/shipping" className="px-5 py-3 border-b border-gray-100 flex items-center gap-3 text-gray-700 hover:bg-gray-50 font-medium">
                <Truck className="w-5 h-5 text-gray-400" /> Shipping
              </a>

              {/* Payment Mobile Options */}
              <div className="px-5 py-4 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Payment Options
              </div>
              <a href="/payment-methods" onClick={() => setIsMobileMenuOpen(false)} className="px-5 py-3 border-b border-gray-100 text-gray-700 hover:bg-gray-50 font-medium pl-8 flex items-center gap-1.5">
                <span className="text-gray-400 text-[10px]">›</span> Payments for Steroids
              </a>
              <a href="/buy-steroids-bitcoin" onClick={() => setIsMobileMenuOpen(false)} className="px-5 py-3 border-b border-gray-100 text-gray-700 hover:bg-gray-50 font-medium pl-8 flex items-center gap-1.5">
                <span className="text-gray-400 text-[10px]">›</span> Buy Steroids Bitcoin
              </a>
              <a href="/buy-steroids-credit-card" onClick={() => setIsMobileMenuOpen(false)} className="px-5 py-3 border-b border-gray-100 text-gray-700 hover:bg-gray-50 font-medium pl-8 flex items-center gap-1.5">
                <span className="text-gray-400 text-[10px]">›</span> Buy Steroids Credit Card
              </a>
              
              {/* Categories */}
              <div className="px-5 py-4 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Categories
              </div>
              {categories.map((category) => (
                <a
                  key={category._id}
                  href={`/all-products?category=${category._id}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-5 py-3 border-b border-gray-100 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors text-sm pl-8 flex items-center gap-1.5"
                >
                  <span className="text-gray-400 text-[10px]">›</span>
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