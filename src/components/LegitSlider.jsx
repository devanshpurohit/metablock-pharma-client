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
    <div className="w-full bg-white py-8 border-t border-b border-gray-100 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <h3 className="text-center text-gray-800 font-bold text-lg md:text-xl mb-6 tracking-wide uppercase">
          Is roidspharma.Net Legit? Yes !
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
              animation: marquee-scroll 30s linear infinite;
            }
            .animate-marquee-brands:hover {
              animation-play-state: paused;
            }
          `}</style>
          
          <div className="animate-marquee-brands flex gap-12 md:gap-20 items-center">
            {marqueeItems.map((brand, index) => (
              <div key={index} className="flex flex-col items-center justify-center min-w-[120px] md:min-w-[150px] shrink-0 select-none">
                <div className="h-12 md:h-14 flex items-center justify-center mb-2">
                  <img
                    src={resolveImageUrl(brand.logo)}
                    alt={brand.brandName}
                    className="max-h-full max-w-full object-contain filter contrast-125"
                    draggable={false}
                  />
                </div>
                <span className="text-[9px] md:text-[10px] font-bold text-gray-800 tracking-wider uppercase">
                  Authorized Retailer
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
