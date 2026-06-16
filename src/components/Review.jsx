"use client";

import { useEffect, useRef, useState } from "react";
import { Star, Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import api, { resolveImageUrl } from "@/utils/api";

// Mask name: "David Kekacs" → "David ***"
function maskName(name) {
  if (!name || name === "Anonymous" || name === "Customer") return "Customer ***";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0] + " ***";
  return parts[0] + " ***";
}

function StarRow({ rating, size = 14 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          style={{ width: size, height: size }}
          className={n <= rating ? "fill-[#8D5E21] text-[#8D5E21]" : "text-gray-200"}
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
    review.body?.length > 120
      ? review.body.slice(0, 120) + "..."
      : review.body;

  return (
    <div
      className="flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-4 flex flex-col gap-3"
      style={{ width: 260 }}
    >
      {/* Top badge row */}
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] font-bold px-2 py-1 rounded-full"
          style={{ background: "#fdf6ed", color: "#8D5E21" }}
        >
          Customer Review
        </span>
        {displayImg && (
          <span
            className="flex items-center gap-1 text-[10px] font-semibold"
            style={{ color: "#888" }}
          >
            <Camera size={11} />
            With Photos
          </span>
        )}
      </div>

      {/* Reviewer */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
          <Star size={14} className="text-gray-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 leading-tight">
            {maskName(review.guestName)}
          </p>
          <p className="text-[11px] text-gray-400">{date}</p>
        </div>
      </div>

      {/* Stars */}
      <StarRow rating={review.rating} />

      {/* Title */}
      {review.title && (
        <h4 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">
          {review.title}
        </h4>
      )}

      {/* Body */}
      <p className="text-gray-500 text-xs leading-relaxed flex-1">
        {shortBody}
      </p>

      {/* Photo */}
      {displayImg && (
        <div className="h-32 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
          <img
            src={displayImg}
            alt="Review photo"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Product name */}
      {review.productId?.productName && (
        <p className="text-[11px] font-semibold text-gray-600 text-center truncate">
          {review.productId.productName}
        </p>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      className="flex-shrink-0 bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-3 animate-pulse"
      style={{ width: 260 }}
    >
      <div className="h-5 w-28 bg-gray-100 rounded-full" />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-200" />
        <div className="flex flex-col gap-1">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-2 w-14 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="h-3 w-24 bg-gray-200 rounded" />
      <div className="h-3 w-full bg-gray-100 rounded" />
      <div className="h-3 w-4/5 bg-gray-100 rounded" />
      <div className="h-32 bg-gray-100 rounded-xl" />
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

  // Autoplay loop: Scroll every 2 seconds if reviews loaded and not hovered
  useEffect(() => {
    if (loading || reviews.length === 0 || isHovered) return;

    const interval = setInterval(() => {
      const slider = sliderRef.current;
      if (!slider) return;

      const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
      if (slider.scrollLeft >= maxScrollLeft - 5) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        slider.scrollBy({ left: 280, behavior: "smooth" });
      }
    }, 2000); // 2 seconds for faster sliding

    return () => clearInterval(interval);
  }, [loading, reviews, isHovered]);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -280, behavior: "smooth" });
  };
  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 280, behavior: "smooth" });
  };

  if (!loading && reviews.length === 0) return null;

  return (
    <div className="w-full bg-white py-12 px-4 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            {/* Badge */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={13}
                    className="fill-[#8D5E21] text-[#8D5E21]"
                  />
                ))}
              </div>
              <span
                className="text-[11px] font-black tracking-widest uppercase"
                style={{ color: "#8D5E21" }}
              >
                ALL REVIEWS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-2">
              Real Experiences From Our Customers
            </h2>
            <p className="text-sm text-gray-500 max-w-md">
              Discover verified purchase reviews, jump straight to the product,
              and browse the full customer review archive in one elegant slider.
            </p>
          </div>

          {/* See All & Nav Buttons */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => scrollLeft()}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scrollRight()}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
            <button
              onClick={() => router.push("/reviews")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-md transition-all hover:opacity-90 active:scale-[0.97]"
              style={{ background: "linear-gradient(135deg,#734B1A,#8D5E21)" }}
            >
              <Star size={14} className="fill-white" />
              See All Reviews →
            </button>
          </div>
        </div>

        {/* ── Slider ── */}
        <div className="relative">
          <div
            ref={sliderRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex gap-4 overflow-x-auto pb-2 scroll-smooth review-slider"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style>{`.review-slider::-webkit-scrollbar { display: none; }`}</style>
            {loading
              ? [1, 2, 3, 4].map((k) => <SkeletonCard key={k} />)
              : reviews.map((r) => (
                  <ReviewSlideCard key={r._id} review={r} />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}