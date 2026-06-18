"use client";
import { useEffect, useRef, useState } from "react";
import { Star, Camera, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useRouter } from "next/navigation";
import api, { resolveImageUrl } from "@/utils/api";

// Mask name: "David Kekacs" → "David ***"
function maskName(name) {
  if (!name || name === "Anonymous" || name === "Customer") return "Verified Customer";
  const parts = name.trim().split(" ");
  return parts[0] + " ***";
}

function StarRow({ rating, size = 12 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          style={{ width: size, height: size }}
          className={n <= rating ? "fill-secondary text-secondary" : "text-gray-200"}
        />
      ))}
    </div>
  );
}

function ReviewSlideCard({ review }) {
  const productImg = review.productId?.mainImage
    ? resolveImageUrl(review.productId.mainImage)
    : null;
  const reviewImg = review.reviewImage
    ? resolveImageUrl(review.reviewImage)
    : null;
  const displayImg = reviewImg || productImg;

  const date = new Date(review.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const shortBody =
    review.body?.length > 130
      ? review.body.slice(0, 130) + "..."
      : review.body;

  return (
    <div
      className="flex-shrink-0 bg-white rounded-3xl border border-black/[0.04] shadow-md hover:shadow-gold-glow hover:-translate-y-1 transition-all duration-400 p-6 flex flex-col gap-4 relative group"
      style={{ width: 280 }}
    >
      {/* Decorative Quote Icon */}
      <Quote className="absolute top-4 right-4 w-10 h-10 text-secondary/[0.06] pointer-events-none" />

      {/* Top badge row */}
      <div className="flex items-center justify-between z-10">
        <span
          className="text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider bg-secondary/5 text-secondary"
        >
          Customer Review
        </span>
        {displayImg && (
          <span className="flex items-center gap-1 text-[9px] font-extrabold text-gray-400">
            <Camera size={11} className="text-secondary" />
            Photos
          </span>
        )}
      </div>

      {/* Reviewer Details */}
      <div className="flex items-center gap-3 mt-1.5">
        <div className="w-8.5 h-8.5 rounded-full bg-secondary/15 flex items-center justify-center flex-shrink-0 text-secondary shadow-sm">
          <Star size={13} className="fill-secondary text-secondary" />
        </div>
        <div>
          <p className="text-xs font-black text-gray-900 leading-tight">
            {maskName(review.guestName)}
          </p>
          <p className="text-[9px] font-semibold text-gray-400 mt-0.5">{date}</p>
        </div>
      </div>

      {/* Stars */}
      <div className="mt-1">
        <StarRow rating={review.rating} />
      </div>

      {/* Title */}
      {review.title && (
        <h4 className="font-serif text-gray-900 text-xs font-bold leading-snug line-clamp-2 min-h-[34px] mt-0.5">
          {review.title}
        </h4>
      )}

      {/* Body */}
      <p className="text-gray-500 text-[11px] leading-relaxed flex-1 italic font-medium">
        "{shortBody}"
      </p>

      {/* Photo Attachment */}
      {displayImg && (
        <div className="h-32 rounded-2xl overflow-hidden border border-black/5 bg-[#F7F5F0] shadow-inner mt-2">
          <img
            src={displayImg}
            alt="Review photo"
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      {/* Product Tag */}
      {review.productId?.productName && (
        <p className="text-[9px] font-extrabold text-gray-400 group-hover:text-secondary transition-colors text-center truncate mt-2 pt-2 border-t border-black/[0.04]">
          {review.productId.productName}
        </p>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      className="flex-shrink-0 bg-white rounded-3xl border border-black/[0.04] p-5 flex flex-col gap-3.5 animate-pulse"
      style={{ width: 280 }}
    >
      <div className="h-5 w-24 bg-gray-150 rounded-full" />
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gray-200" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="h-3.5 w-20 bg-gray-200 rounded" />
          <div className="h-2 w-14 bg-gray-150 rounded" />
        </div>
      </div>
      <div className="h-3 w-16 bg-gray-200 rounded" />
      <div className="h-3 w-full bg-gray-150 rounded" />
      <div className="h-3 w-4/5 bg-gray-150 rounded" />
      <div className="h-28 bg-gray-150 rounded-2xl mt-1" />
    </div>
  );
}

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const sliderRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    api
      .get("/reviews/approved?limit=10&page=1")
      .then((res) => setReviews(res.data.reviews || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || reviews.length === 0 || isHovered) return;

    const interval = setInterval(() => {
      const slider = sliderRef.current;
      if (!slider) return;

      const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
      if (slider.scrollLeft >= maxScrollLeft - 5) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        slider.scrollBy({ left: 300, behavior: "smooth" });
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [loading, reviews, isHovered]);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };
  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  if (!loading && reviews.length === 0) return null;

  return (
    <div className="w-full bg-[#F5F2EB] py-16 px-4 md:px-8 font-sans border-b border-secondary/5 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute -top-24 -left-24 w-[350px] h-[350px] bg-secondary/[0.03] blur-[100px] pointer-events-none rounded-full"></div>
      <div className="max-w-7xl mx-auto">
        
        {/* ── Header details ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={11}
                    className="fill-secondary text-secondary"
                  />
                ))}
              </div>
              <span
                className="text-[9px] font-black tracking-[0.25em] uppercase text-secondary"
              >
                VERIFIED TESTIMONIALS
              </span>
            </div>
            <h2 className="font-serif text-2xl md:text-3.5xl font-normal text-gray-900 leading-tight mb-2.5">
              Customer Experiences
            </h2>
            <p className="text-xs text-gray-500 max-w-lg leading-relaxed font-medium">
              Read transparent experiences from verified users, review direct product links, and browse our customer feedback timeline.
            </p>
          </div>

          {/* Controls See All & Arrow Elements */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => scrollLeft()}
              className="w-10 h-10 rounded-full border border-secondary/15 bg-white flex items-center justify-center text-gray-600 hover:text-secondary hover:bg-secondary/5 transition-all shadow-sm active:scale-95 cursor-pointer"
              aria-label="Previous review"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scrollRight()}
              className="w-10 h-10 rounded-full border border-secondary/15 bg-white flex items-center justify-center text-gray-600 hover:text-secondary hover:bg-secondary/5 transition-all shadow-sm active:scale-95 cursor-pointer"
              aria-label="Next review"
            >
              <ChevronRight size={18} />
            </button>
            <button
              onClick={() => router.push("/reviews")}
              className="flex items-center gap-1.5 px-5 py-3 rounded-xl font-extrabold text-[10px] uppercase tracking-wider text-white shadow-md hover:shadow-gold-glow transition-all duration-300 border-0 bg-gradient-to-r from-primary to-secondary cursor-pointer active:scale-[0.97]"
            >
              <Star size={13} className="fill-white" />
              See All Reviews
            </button>
          </div>
        </div>

        {/* ── Slider Row ── */}
        <div className="relative">
          <div
            ref={sliderRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex gap-6 overflow-x-auto pb-6 scroll-smooth review-slider pt-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style>{`.review-slider::-webkit-scrollbar { display: none; }`}</style>
            {loading
              ? [1, 2, 3, 4, 5].map((k) => <SkeletonCard key={k} />)
              : reviews.map((r) => (
                  <ReviewSlideCard key={r._id} review={r} />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}