"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { ArrowRight, ShieldCheck, CreditCard } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// ─── Slide Data ───────────────────────────────────────────────────────────────
const slides = [
  {
    id: 1,
    image: "/assets/ban.png",
  },
  {
    id: 2,
    image: "/assets/ban1.png",
  },
];

// ─── Main Slider ──────────────────────────────────────────────────────────────
export default function HeroSlider() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 font-sans flex flex-col gap-8">
      <style>{`
        .hero-swiper {
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 10px 30px -10px rgba(115, 75, 26, 0.1);
        }
        .hero-swiper .swiper-button-next,
        .hero-swiper .swiper-button-prev {
          width: 44px !important;
          height: 44px !important;
          background: rgba(255, 255, 255, 0.9) !important;
          backdrop-filter: blur(8px) !important;
          border-radius: 50% !important;
          color: #1a1a1a !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
          transition: all 0.2s ease !important;
          border: 1px solid rgba(141, 94, 33, 0.1) !important;
        }
        .hero-swiper .swiper-button-next:hover,
        .hero-swiper .swiper-button-prev:hover {
          background: #734B1A !important;
          color: #fff !important;
          border-color: #734B1A !important;
          transform: scale(1.05);
        }
        .hero-swiper .swiper-button-next::after,
        .hero-swiper .swiper-button-prev::after {
          font-size: 13px !important;
          font-weight: 900 !important;
        }
        .hero-swiper .swiper-button-next { right: 20px !important; }
        .hero-swiper .swiper-button-prev { left: 20px !important; }
        .hero-swiper .swiper-pagination-bullet {
          background: #d4af37 !important;
          opacity: 0.4 !important;
          transition: all 0.3s ease !important;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          background: #734B1A !important;
          width: 24px !important;
          border-radius: 4px !important;
          opacity: 1 !important;
        }
        .hero-swiper .swiper-pagination {
          bottom: 16px !important;
        }
      `}</style>

      {/* Top Section: Full Width Hero Graphic Swiper */}
      <div className="w-full border border-[#8D5E21]/20 rounded-[32px] overflow-hidden bg-[#121215] shadow-2xl p-2 relative group/slider">
        <Swiper
          className="hero-swiper shadow-sm w-full h-full"
          modules={[Navigation, Autoplay, Pagination]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop
          speed={700}
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full h-[180px] sm:h-[260px] md:h-auto md:aspect-[3.1/1] flex items-center justify-center bg-[#121215] overflow-hidden rounded-[22px]">
                <img 
                  src={slide.image} 
                  alt={`Banner ${slide.id}`} 
                  className="w-full h-full object-fill block group-hover/slider:scale-[1.005] transition-transform duration-700"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Bottom Section: Full Width Brand Statement Editorial Banner */}
      <div className="bg-[#0e0e11] border border-[#8D5E21]/20 rounded-[32px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between text-white relative overflow-hidden shadow-gold-glow gap-6">
        {/* Ambient Glow */}
        <div className="bg-gradient-to-r from-[#8D5E21]/15 to-transparent blur-3xl rounded-full absolute -top-24 -left-24 w-80 h-80 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col justify-center max-w-3xl">
          <span className="text-secondary text-[10px] font-black uppercase tracking-[0.25em] mb-4 flex items-center gap-2 border border-secondary/20 px-3.5 py-1 rounded-full w-fit bg-secondary/5">
            <ShieldCheck className="w-3.5 h-3.5 text-secondary animate-pulse" />
            OFFICIAL RELIABLE STEROID SHOP
          </span>
          
          <h1 className="font-serif text-3xl md:text-4.5xl font-normal leading-tight text-white tracking-wide mb-3">
            ELITE <span className="italic text-secondary font-light">Performance</span>, SCIENTIFIC <span className="font-bold text-white text-glow-gold">Precision</span>.
          </h1>
          
          <p className="text-gray-400 text-xs md:text-sm leading-relaxed max-w-2xl font-medium">
            Welcome to Roidspharma. We provide the gold standard of pharmaceutical-grade compounds. 100% genuine lab-tested solutions with secure worldwide delivery.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3.5 relative z-10 flex-shrink-0 w-full md:w-auto">
          <a 
            href="/all-products" 
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-xs px-6 py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 group cursor-pointer border-0 active:scale-[0.98] w-full sm:w-auto"
          >
            Explore Catalog
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
          </a>
          <a 
            href="/submit-payment" 
            className="flex items-center justify-center gap-2 bg-transparent hover:bg-white/5 border border-white/10 text-white font-extrabold text-xs px-5 py-3.5 rounded-xl transition-all duration-300 cursor-pointer active:scale-[0.98] w-full sm:w-auto"
          >
            <CreditCard className="w-3.5 h-3.5 text-secondary" />
            Submit Payment
          </a>
        </div>
      </div>
    </div>
  );
}
