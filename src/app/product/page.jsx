"use client";

import { useState } from "react";
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
    "https://www.getroids1.net/image/cache/catalog/Pharmaqo/tri-test-400-pharmaqo-labs-us-500x500.jpg",
    "https://www.getroids1.net/image/cache/catalog/Pharmaqo/tri-test-400-pharmaqo-labs-us-back-500x500.jpg",
    "https://www.getroids1.net/image/cache/catalog/Pharmaqo/tri-test-400-pharmaqo-labs-us-box-500x500.jpg",
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
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center group shadow-sm">
              <img 
                src={productData.images[selectedImage]} 
                alt={productData.name}
                className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                  {productData.badge}
                </span>
              </div>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {productData.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-24 h-24 flex-shrink-0 rounded-xl border-2 transition-all ${
                    selectedImage === idx ? "border-primary shadow-md" : "border-gray-100 hover:border-gray-300"
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
            <div className="grid grid-cols-2 gap-4 mb-8">
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
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-14">
                  <button 
                    onClick={decrementQty}
                    className="w-12 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="w-12 h-full flex items-center justify-center font-bold text-gray-900 border-x border-gray-200">
                    {quantity}
                  </div>
                  <button 
                    onClick={incrementQty}
                    className="w-12 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <button className="flex-1 h-14 bg-primary hover:bg-secondary text-white font-bold rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                  <ShoppingCart className="w-5 h-5" />
                  Add To Cart
                </button>
                
                <button className="w-14 h-14 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all group">
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
          <div className="flex items-center gap-10 border-b border-gray-100 mb-8">
            {["Description", "Specifications", "Shipping & Returns"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`pb-4 text-sm font-bold tracking-wider uppercase transition-all relative ${
                  activeTab === tab.toLowerCase() ? "text-primary" : "text-gray-400 hover:text-gray-600"
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
                  <div key={i} className={`flex p-4 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <span className="w-1/3 text-sm font-bold text-gray-500 uppercase tracking-wider">{spec.label}</span>
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
