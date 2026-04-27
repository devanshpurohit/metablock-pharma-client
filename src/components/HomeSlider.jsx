"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// ─── Slide Data ───────────────────────────────────────────────────────────────
const slides = [
  {
    id: 1,
    image: "https://www.getroids1.net/image/cache/catalog/BRAND%20LOGOS/35sp-4800x1600.jpg.webp",
  },
  {
    id: 2,
    image: "https://www.getroids1.net/image/cache/catalog/BLOG/pplus-30-4800x1600.jpg.webp",
  },
  
];

// ─── Main Slider ──────────────────────────────────────────────────────────────
export default function HeroSlider() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 font-sans">
      <style>{`
        .hero-swiper {
          border-radius: 16px;
          overflow: hidden;
        }
        .hero-swiper .swiper-button-next,
        .hero-swiper .swiper-button-prev {
          width: 42px !important;
          height: 42px !important;
          background: rgba(0,0,0,0.55) !important;
          border-radius: 50% !important;
          color: #fff !important;
        }
        .hero-swiper .swiper-button-next::after,
        .hero-swiper .swiper-button-prev::after {
          font-size: 14px !important;
          font-weight: 900 !important;
        }
        .hero-swiper .swiper-button-next { right: 16px !important; }
        .hero-swiper .swiper-button-prev { left: 16px !important; }
        .hero-swiper .swiper-pagination-bullet-active {
          background: #1565C0 !important;
        }
        .hero-swiper .swiper-pagination {
          bottom: 12px !important;
        }
      `}</style>

      <Swiper
        className="hero-swiper shadow-sm"
        modules={[Navigation, Autoplay, Pagination]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        speed={700}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-[180px] sm:h-[250px] md:h-auto md:aspect-[3/1] flex items-center justify-center bg-gray-50 overflow-hidden">
              <img 
                src={slide.image} 
                alt={`Banner ${slide.id}`} 
                className="w-full h-full object-cover block"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
