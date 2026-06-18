"use client";

import { useEffect, useState } from "react";
import api, { resolveImageUrl } from "@/utils/api";

export default function LegitSlider() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    api.get("/brands?limit=100")
      .then((res) => {
        setBrands(res.data?.data || []);
      })
      .catch((err) => {
        console.error("Error loading brands for legit slider:", err);
      });
  }, []);

  if (brands.length === 0) return null;

  // Duplicate list to make infinite marquee smooth
  const marqueeItems = [...brands, ...brands, ...brands];

  return (
    <div className="w-full bg-[#1d1207] py-10 border-t border-b border-secondary/20 font-sans overflow-hidden relative">
      {/* Soft gold backdrop glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[100px] bg-secondary/5 blur-[80px] pointer-events-none rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Title */}
        <h3 className="text-center text-[#ebdcc9] font-serif font-normal text-base md:text-lg mb-8 tracking-widest uppercase">
          Is roidspharma.Net Legit? <span className="text-metallic-gold font-bold font-sans tracking-wide">YES!</span>
        </h3>

        {/* Marquee Container */}
        <div className="relative w-full overflow-hidden flex whitespace-nowrap">
          <style>{`
            @keyframes marquee-scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-33.3333%); }
            }
            .animate-marquee-brands {
              display: flex;
              width: max-content;
              animation: marquee-scroll 35s linear infinite;
            }
            .animate-marquee-brands:hover {
              animation-play-state: paused;
            }
          `}</style>
          
          <div className="animate-marquee-brands flex gap-12 md:gap-16 items-center">
            {marqueeItems.map((brand, index) => (
              <div key={index} className="flex flex-col items-center justify-center min-w-[90px] md:min-w-[120px] shrink-0 select-none">
                <div className="h-16 w-16 md:h-20 md:w-20 bg-white border border-secondary/15 rounded-full flex items-center justify-center p-3.5 shadow-md hover:border-secondary hover:shadow-gold-glow transition-all duration-300 transform hover:scale-[1.03]">
                  <img
                    src={resolveImageUrl(brand.logo)}
                    alt={brand.brandName}
                    className="max-h-full max-w-full object-contain filter contrast-110"
                    draggable={false}
                  />
                </div>
                <span className="text-[8px] md:text-[9px] font-bold text-[#ebdcc9]/80 tracking-widest uppercase mt-3 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-secondary"></span>
                  Authorized
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
