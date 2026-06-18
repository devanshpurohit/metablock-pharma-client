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
  const [activeFilter, setActiveFilter] = useState("all");
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
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="w-full bg-[#FDFBF7] py-16 font-sans text-center text-gray-500">
        <span className="inline-block w-8 h-8 border-2 border-secondary/35 border-t-secondary rounded-full animate-spin"></span>
        <p className="mt-3 text-xs font-bold uppercase tracking-wider text-gray-400">Loading premium catalog...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  // Filter items
  const filteredProducts = products.filter(p => {
    if (activeFilter === "all") return true;
    if (activeFilter === "usa") return p.domestic?.toUpperCase().includes("USA");
    if (activeFilter === "pills") return p.productType === "pill";
    if (activeFilter === "vials") return p.productType === "vial";
    return true;
  });

  return (
    <div className="w-full bg-[#FCFAF7] pt-8 pb-16 font-sans border-b border-secondary/5 relative overflow-hidden">
      {/* Decorative clean radial background accent */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-secondary/[0.02] blur-[120px] pointer-events-none rounded-full"></div>

      {/* ── Section Header ── */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="relative flex flex-col items-center text-center">
          <span className="text-secondary text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">
            SELECTED SELECTIONS
          </span>
          <h2 className="font-serif text-gray-900 text-2xl md:text-3.5xl font-normal tracking-wide">
            {title}
          </h2>
          <div className="w-16 h-[2px] bg-secondary/30 mx-auto mt-4"></div>
        </div>
      </div>

      {/* ── Interactive Filter Pills ── */}
      <div className="flex justify-center items-center gap-2 mb-10 max-w-7xl mx-auto px-4 flex-wrap">
        {[
          { id: "all", label: "All Compounds" },
          { id: "usa", label: "USA Domestic" },
          { id: "pills", label: "Oral Pills" },
          { id: "vials", label: "Injectable Vials" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer border active:scale-[0.97] ${
              activeFilter === tab.id
                ? "bg-secondary border-secondary text-white shadow-gold-glow"
                : "bg-white border-black/5 text-gray-500 hover:text-secondary hover:bg-[#F2EFE9] hover:border-secondary/35"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Cards Row with Navigation ── */}
      <div className="relative max-w-7xl mx-auto px-6">
        {filteredProducts.length === 0 ? (
          <div className="w-full text-center py-10 text-gray-400 text-sm font-semibold">
            No products found matching this filter.
          </div>
        ) : (
          <>
            {/* Left Scroll Trigger */}
            <button
              onClick={scrollLeft}
              className="hidden md:flex absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white hover:bg-secondary hover:text-white text-gray-700 rounded-full items-center justify-center shadow-lg border border-secondary/15 transition-all duration-300 cursor-pointer active:scale-90"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Scrollable Container */}
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scroll-smooth pb-6 products-scroll pt-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <style>{`
                .products-scroll::-webkit-scrollbar { display: none; }
              `}</style>

              {filteredProducts.map((product) => (
                <div key={product.id} className="flex-shrink-0 w-[275px] md:w-[calc(25%-18px)]">
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

            {/* Right Scroll Trigger */}
            <button
              onClick={scrollRight}
              className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white hover:bg-secondary hover:text-white text-gray-700 rounded-full items-center justify-center shadow-lg border border-secondary/15 transition-all duration-300 cursor-pointer active:scale-90"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

    </div>
  );
}