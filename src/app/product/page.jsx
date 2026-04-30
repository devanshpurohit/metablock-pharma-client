"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import {
  ShoppingCart,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
  ChevronRight,
  Plus,
  Minus,
  Share2
} from "lucide-react";
import CustomerReviews from "@/components/Review";
import SpecialProducts from "@/components/SpecialProducts";

// ── Sample Product Data ──
const productData = {
  id: 1,
  name: "Multi-Ester Test 400 Pharmaqo Labs US",
  brand: "Pharmaqo Labs US",
  price: 95.0,
  oldPrice: 115.0,
  rating: 4.8,
  reviewsCount: 124,
  availability: "In Stock",
  sku: "PH-TEST-400",
  badge: "USA DOMESTIC",
  images: [
    "/assets/pic.png",
    "data:image/jpeg;base64,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",
    "https://placehold.co/600x600/f5f5f5/1565C0?text=Product+Image+1",
    "https://placehold.co/600x600/f5f5f5/1565C0?text=Product+Image+2"
  ],
  description: "Multi-Ester Test 400 is a powerful blend of three testosterone esters, designed for serious athletes seeking maximum gains. It provides a steady release of testosterone into the bloodstream, ensuring optimal performance and recovery.",
  specs: [
    { label: "Concentration", value: "400mg/ml" },
    { label: "Volume", value: "10ml Vial" },
    { label: "Form", value: "Injectable" },
    { label: "Storage", value: "Room Temperature" },
  ]
};

export default function ProductDetailsPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const { addToCart } = useCart();
  const [isZooming, setIsZooming] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const incrementQty = () => setQuantity(q => q + 1);
  const decrementQty = () => setQuantity(q => q > 1 ? q - 1 : 1);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── Breadcrumb ── */}
      <div className="bg-gray-50 border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <ChevronRight className="w-4 h-4" />
          <a href="/all-products" className="hover:text-primary transition-colors">Products</a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium truncate">{productData.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

          {/* ── Left: Image Gallery ── */}
          <div className="flex flex-col gap-4 relative">
            <div
              className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center shadow-sm cursor-crosshair"
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={productData.images[selectedImage]}
                alt={productData.name}
                className="w-full h-full object-contain p-8"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                  {productData.badge}
                </span>
              </div>

              {/* Zoom lens overlay */}
              {isZooming && (
                <div
                  className="absolute pointer-events-none bg-black/5 border border-gray-300"
                  style={{
                    width: '150px',
                    height: '150px',
                    left: `calc(${mousePos.x}% - 75px)`,
                    top: `calc(${mousePos.y}% - 75px)`,
                    boxShadow: '0 0 0 9999px rgba(255,255,255,0.4)',
                  }}
                />
              )}
            </div>

            {/* Amazon-style Zoom Result Overlay */}
            {isZooming && (
              <div
                className="absolute top-0 left-[calc(100%+24px)] w-[500px] h-[500px] bg-white border border-gray-200 shadow-2xl z-50 pointer-events-none rounded-2xl hidden lg:block"
                style={{
                  backgroundImage: `url(${productData.images[selectedImage]})`,
                  backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                  backgroundSize: '250%',
                  backgroundRepeat: 'no-repeat'
                }}
              />
            )}

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {productData.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-24 h-24 flex-shrink-0 rounded-xl border-2 transition-all ${selectedImage === idx ? "border-primary shadow-md" : "border-gray-100 hover:border-gray-300"
                    } bg-white overflow-hidden p-2`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: Product Info ── */}
          <div className="flex flex-col">
            <p className="text-primary font-bold text-sm tracking-widest uppercase mb-2">
              {productData.brand}
            </p>
            <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {productData.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(productData.rating) ? "fill-primary text-primary" : "text-gray-300"}`}
                  />
                ))}
                <span className="text-sm font-bold text-gray-900 ml-1">{productData.rating}</span>
              </div>
              <div className="w-px h-4 bg-gray-200" />
              <button className="text-sm text-gray-500 hover:text-primary underline-offset-4 hover:underline transition-colors">
                {productData.reviewsCount} Customer Reviews
              </button>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 mb-8">
              <span className="text-4xl font-black text-primary">${productData.price.toFixed(2)}</span>
              {productData.oldPrice && (
                <span className="text-lg text-gray-400 line-through mb-1">${productData.oldPrice.toFixed(2)}</span>
              )}
              <span className="bg-accent text-primary text-xs font-bold px-2 py-1 rounded mb-1.5">
                SAVE ${(productData.oldPrice - productData.price).toFixed(2)}
              </span>
            </div>

            {/* Short Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider leading-none mb-1">Authenticity</p>
                  <p className="text-xs font-bold text-gray-900 leading-none">100% Genuine</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider leading-none mb-1">Delivery</p>
                  <p className="text-xs font-bold text-gray-900 leading-none">Fast Shipping</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-6 mb-8">
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-14 w-full sm:w-auto">
                  <button
                    onClick={decrementQty}
                    className="w-12 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1 sm:w-12 h-full flex items-center justify-center font-bold text-gray-900 border-x border-gray-200">
                    {quantity}
                  </div>
                  <button
                    onClick={incrementQty}
                    className="w-12 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    addToCart({
                      id: productData.id,
                      name: productData.name,
                      price: productData.price,
                      image: productData.images[0],
                      badge: productData.badge
                    }, quantity);
                    alert("Added to cart!");
                  }}
                  className="flex-1 h-14 bg-primary hover:bg-secondary text-white font-bold rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                  <ShoppingCart className="w-5 h-5" />
                  Add To Cart
                </button>

                <button className="w-14 h-14 shrink-0 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all group">
                  <Heart className="w-6 h-6 group-hover:fill-red-500 transition-colors" />
                </button>
              </div>
            </div>

            {/* Product Meta */}
            <div className="border-t border-gray-100 pt-6 space-y-3">
              <p className="text-sm">
                <span className="text-gray-500 mr-2">SKU:</span>
                <span className="text-gray-900 font-semibold">{productData.sku}</span>
              </p>
              <p className="text-sm">
                <span className="text-gray-500 mr-2">Category:</span>
                <span className="text-gray-900 font-semibold hover:text-primary cursor-pointer transition-colors">Testosterone</span>
              </p>
              <div className="flex items-center gap-3 pt-2">
                <span className="text-sm text-gray-500 mr-1">Share:</span>
                <button className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs Section ── */}
        <div className="mb-20">
          <div className="flex items-center gap-6 sm:gap-10 border-b border-gray-100 mb-8 overflow-x-auto scrollbar-hide whitespace-nowrap pb-1">
            {["Description", "Specifications", "Shipping & Returns"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`pb-4 text-sm font-bold tracking-wider uppercase transition-all relative ${activeTab === tab.toLowerCase() ? "text-primary" : "text-gray-400 hover:text-gray-600"
                  }`}
              >
                {tab}
                {activeTab === tab.toLowerCase() && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          <div className="max-w-4xl">
            {activeTab === "description" && (
              <div className="animate-in fade-in duration-500">
                <p className="text-gray-600 leading-relaxed text-base">
                  {productData.description}
                </p>
                <p className="text-gray-600 leading-relaxed text-base mt-4">
                  Pharmaqo Labs ensures the highest quality manufacturing processes, using pharmaceutical-grade ingredients to deliver results you can trust. Our Multi-Ester Test 400 is specifically formulated for maximum bioavailability.
                </p>
              </div>
            )}
            {activeTab === "specifications" && (
              <div className="animate-in slide-in-from-left-4 duration-500 overflow-hidden rounded-2xl border border-gray-100">
                {productData.specs.map((spec, i) => (
                  <div key={i} className={`flex flex-col sm:flex-row p-4 gap-1 sm:gap-4 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <span className="w-full sm:w-1/3 text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">{spec.label}</span>
                    <span className="flex-1 text-sm font-semibold text-gray-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "shipping & returns" && (
              <div className="animate-in fade-in duration-500 space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-primary flex-shrink-0">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Fast US Domestic Shipping</h4>
                    <p className="text-sm text-gray-600">Most orders are delivered within 4-6 business days. Tracking numbers provided within 48 hours.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-primary flex-shrink-0">
                    <RotateCcw className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Hassle-Free Returns</h4>
                    <p className="text-sm text-gray-600">If your package is seized or lost, we offer a 100% free reshipment guarantee.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Related Products ── */}
        <div className="mb-20">
          <SpecialProducts />
        </div>
      </div>

      {/* ── Reviews ── */}
      <div className="bg-gray-50 border-t border-gray-100">
        <CustomerReviews />
      </div>
    </div>
  );
}
