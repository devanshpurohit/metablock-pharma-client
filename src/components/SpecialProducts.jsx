"use client";
import { useRef, useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import ProductCard from "./ProductCard";
import api, { resolveImageUrl } from "@/utils/api";
import { useCart } from "@/context/CartContext";

export default function SpecialProducts({ title = "Special Products" }) {
  const scrollRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    api.get("/products?limit=100")
      .then((res) => {
        const list = res.data?.data || [];
        const featured = list.filter(p => p.featured || p.trending);
        setProducts(featured.map(p => ({
          id: p._id,
          brand: p.brandId?.brandName || "Pharma",
          name: p.productName,
          price: p.price,
          rating: 5,
          isTopSeller: p.featured,
          isOriginal: p.trending,
          domestic: p.trending ? "USA DOMESTIC" : "INTERNATIONAL SHIPPING",
          productType: p.tags?.includes("pill") ? "pill" : "vial",
          image: resolveImageUrl(p.mainImage),
        })));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading special products:", err);
        setLoading(false);
      });
  }, []);

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 280, behavior: "smooth" });
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -280, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="w-full bg-gray-50 py-10 font-sans text-center text-gray-500">
        Loading special products...
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-gray-50 py-4 font-sans">

      {/* ── Section Header ── */}
      <div className="mx-4 mb-5 bg-gradient-to-r from-primary via-secondary to-primary rounded-xl px-8 py-5 flex items-center justify-center shadow-lg">
        <h2
          className="text-white font-bold text-2xl tracking-wide"
        >
          {title}
        </h2>
      </div>

      {/* ── Cards Row with Navigation ── */}
      <div className="relative max-w-7xl mx-auto px-4">

        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="hidden md:flex absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-[#1a1a1a] hover:bg-[#333] text-white rounded-full items-center justify-center shadow-lg transition-colors border-none"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scrollable Cards Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4 products-scroll"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`
            .products-scroll::-webkit-scrollbar { display: none; }
          `}</style>

          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-[280px] md:w-[calc(25%-12px)]">
              <ProductCard
                {...product}
                onAddToCart={() => {
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    badge: product.domestic
                  }, 1);
                  alert(`${product.name} added to cart!`);
                }}
              />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-[#1a1a1a] hover:bg-[#333] text-white rounded-full items-center justify-center shadow-lg transition-colors border-none"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}