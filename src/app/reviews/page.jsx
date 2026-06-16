"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, Camera, MessageSquare, Filter, Search, ChevronLeft, ChevronRight, Home } from "lucide-react";
import api, { resolveImageUrl } from "@/utils/api";
import Link from "next/link";

const LIMIT = 10;
const PRIMARY = "#734B1A";
const SECONDARY = "#8D5E21";
const ACCENT = "#FDF5E6";

// Mask name privacy
function maskName(name) {
  if (!name || name === "Anonymous" || name === "Customer") return "Customer ***";
  const parts = name.trim().split(" ");
  return parts[0] + " ***";
}

function StarRow({ rating, size = 15 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          style={{ width: size, height: size, color: n <= rating ? PRIMARY : "#e5e7eb", fill: n <= rating ? PRIMARY : "#e5e7eb" }}
        />
      ))}
    </div>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-2 hover:shadow-md transition-shadow">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-1"
        style={{ background: ACCENT }}
      >
        {icon}
      </div>
      <p className="text-2xl font-black text-gray-900">{value}</p>
      <p className="text-xs font-semibold text-gray-500 text-center">{label}</p>
    </div>
  );
}

function RatingBar({ star, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 w-10 flex-shrink-0">
        <span className="text-sm font-bold text-gray-700">{star}</span>
        <Star size={12} style={{ fill: PRIMARY, color: PRIMARY }} />
      </div>
      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg,${PRIMARY},${SECONDARY})` }}
        />
      </div>
      <span className="text-sm font-bold w-10 text-right" style={{ color: PRIMARY }}>
        {pct}%
      </span>
    </div>
  );
}

function ReviewCard({ review }) {
  const productImg = review.productId?.mainImage
    ? resolveImageUrl(review.productId.mainImage)
    : null;
  const reviewImg = review.reviewImage
    ? resolveImageUrl(review.reviewImage)
    : null;

  const date = new Date(review.createdAt).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
      {/* Product header */}
      {productImg && (
        <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-gray-50">
          <img
            src={productImg}
            alt={review.productId?.productName || "Product"}
            className="w-12 h-12 object-contain rounded-xl border border-gray-100 bg-gray-50 p-1"
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-800 text-sm truncate">
              {review.productId?.productName}
            </p>
            <StarRow rating={review.rating} size={13} />
          </div>
        </div>
      )}

      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Reviewer row */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: ACCENT }}
          >
            <Camera size={13} style={{ color: PRIMARY }} />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">
              {maskName(review.guestName)}
            </p>
            <p className="text-[11px] text-gray-400">📅 {date}</p>
          </div>
        </div>

        {/* Stars (if no product header) */}
        {!productImg && <StarRow rating={review.rating} />}

        {/* Title */}
        {review.title && (
          <h3 className="font-bold text-gray-900 text-sm leading-snug">
            {review.title}
          </h3>
        )}

        {/* Body */}
        <p className="text-gray-600 text-sm leading-relaxed flex-1">
          {review.body}
        </p>

        {/* Review photo */}
        {reviewImg && (
          <div className="h-40 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 mt-1">
            <img
              src={reviewImg}
              alt="Customer photo"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function SkeletonReviewCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse flex flex-col gap-3">
      <div className="flex gap-3 items-center pb-3 border-b border-gray-50">
        <div className="w-12 h-12 rounded-xl bg-gray-200" />
        <div className="flex flex-col gap-1 flex-1">
          <div className="h-3 w-32 bg-gray-200 rounded" />
          <div className="h-3 w-20 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <div className="w-8 h-8 rounded-full bg-gray-200" />
        <div className="flex flex-col gap-1">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-2 w-14 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="h-3 w-4/5 bg-gray-200 rounded" />
      <div className="h-3 w-full bg-gray-100 rounded" />
      <div className="h-3 w-3/4 bg-gray-100 rounded" />
      <div className="h-40 bg-gray-100 rounded-xl" />
    </div>
  );
}

function Pagination({ page, pages, onPage }) {
  const nums = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(pages, page + 2);
  for (let i = start; i <= end; i++) nums.push(i);

  const btnBase = "w-9 h-9 rounded-xl text-sm font-bold transition-colors border";
  const activeCls = "text-white border-transparent shadow-md";
  const inactiveCls = "border-gray-200 text-gray-600 hover:bg-gray-50";

  return (
    <div className="flex items-center justify-center gap-2 pt-10">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
      </button>
      {start > 1 && (
        <>
          <button onClick={() => onPage(1)} className={`${btnBase} ${inactiveCls}`}>1</button>
          {start > 2 && <span className="text-gray-400 text-sm">…</span>}
        </>
      )}
      {nums.map((n) => (
        <button
          key={n}
          onClick={() => onPage(n)}
          className={`${btnBase} ${n === page ? activeCls : inactiveCls}`}
          style={n === page ? { background: `linear-gradient(135deg,${PRIMARY},${SECONDARY})` } : {}}
        >
          {n}
        </button>
      ))}
      {end < pages && (
        <>
          {end < pages - 1 && <span className="text-gray-400 text-sm">…</span>}
          <button onClick={() => onPage(pages)} className={`${btnBase} ${inactiveCls}`}>{pages}</button>
        </>
      )}
      <button
        onClick={() => onPage(page + 1)}
        disabled={page === pages}
        className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [ratingFilter, setRatingFilter] = useState("");
  const [onlyWithPhoto, setOnlyWithPhoto] = useState(false);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const fetchReviews = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (ratingFilter) params.set("rating", ratingFilter);
    if (search) params.set("search", search);

    api
      .get(`/reviews/approved?${params.toString()}`)
      .then((res) => {
        let data = res.data.reviews || [];
        if (onlyWithPhoto) data = data.filter((r) => r.reviewImage);
        if (sortBy === "highest") data = [...data].sort((a, b) => b.rating - a.rating);
        else if (sortBy === "lowest") data = [...data].sort((a, b) => a.rating - b.rating);
        setReviews(data);
        setTotal(res.data.total || 0);
        setPages(res.data.pages || 1);
        if (res.data.stats) setStats(res.data.stats);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, ratingFilter, search, onlyWithPhoto, sortBy]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleSearch = (e) => { e.preventDefault(); setSearch(searchInput); setPage(1); };
  const handleRatingChange = (val) => { setRatingFilter(val); setPage(1); };
  const handleSortChange = (val) => { setSortBy(val); setPage(1); };

  const selectCls = "border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 bg-white focus:outline-none cursor-pointer";

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
            <Home size={14} />
            Home
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-semibold">Customer Reviews & Ratings</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* ── Page Title ── */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Star size={32} style={{ fill: PRIMARY, color: PRIMARY }} />
            <h1 className="text-3xl font-black text-gray-900">
              Customer Reviews & Ratings
            </h1>
          </div>
          <p className="text-gray-500 text-sm">
            Discover{" "}
            <span className="font-semibold" style={{ color: PRIMARY }}>customer experiences</span>
            {" "}and ratings
          </p>
        </div>

        {/* ── Stats Cards ── */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard icon="💬" value={stats.totalReviews} label="Total Reviews" />
            <StatCard icon="⭐" value={`${stats.averageRating}/5`} label="Average Rating" />
            <StatCard icon="✅" value={stats.totalReviews} label="Verified Purchase" />
            <StatCard icon="📸" value={stats.withImage} label="Image Review" />
          </div>
        )}

        {/* ── Rating Distribution ── */}
        {stats?.distribution && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
            <h3 className="font-black text-gray-900 text-base mb-4 flex items-center gap-2">
              <span>📊</span> Rating Distribution
            </h3>
            <div className="flex flex-col gap-3">
              {stats.distribution.map(({ star, count }) => (
                <RatingBar key={star} star={star} count={count} total={stats.totalReviews} />
              ))}
            </div>
          </div>
        )}

        {/* ── Filter & Sort ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={16} style={{ color: PRIMARY }} />
            <h3 className="font-bold text-gray-900 text-sm">Filter And Sort</h3>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            {/* Rating filter */}
            <select value={ratingFilter} onChange={(e) => handleRatingChange(e.target.value)} className={selectCls}
              style={{ focusRingColor: PRIMARY }}>
              <option value="">⭐ Rating</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>

            {/* With photo toggle */}
            <button
              onClick={() => { setOnlyWithPhoto((v) => !v); setPage(1); }}
              className="flex items-center gap-2 border rounded-xl px-3 py-2 text-sm font-semibold transition-colors"
              style={
                onlyWithPhoto
                  ? { background: ACCENT, borderColor: PRIMARY, color: PRIMARY }
                  : { borderColor: "#e5e7eb", color: "#6b7280" }
              }
            >
              <Camera size={14} />
              Images{onlyWithPhoto && " ✓"}
            </button>

            {/* Sort */}
            <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)} className={selectCls}>
              <option value="newest">📅 Newest</option>
              <option value="highest">⬆️ Highest Rating</option>
              <option value="lowest">⬇️ Lowest Rating</option>
            </select>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 ml-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search product name..."
                  className="border border-gray-200 rounded-xl pl-4 pr-10 py-2 text-sm focus:outline-none bg-white w-48"
                  style={{ focusBorderColor: PRIMARY }}
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                  style={{ color: PRIMARY }}>
                  <Search size={15} />
                </button>
              </div>
            </form>

            {/* Clear filters */}
            {(ratingFilter || onlyWithPhoto || search) && (
              <button
                onClick={() => { setRatingFilter(""); setOnlyWithPhoto(false); setSearch(""); setSearchInput(""); setPage(1); }}
                className="text-xs font-semibold underline text-gray-400 hover:text-red-500 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* ── Count summary ── */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500 font-semibold">
            {loading ? "Loading..." : `Showing ${reviews.length} of ${total} reviews`}
          </p>
          <p className="text-xs text-gray-400">Page {page} of {pages}</p>
        </div>

        {/* ── Reviews Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: LIMIT }).map((_, i) => <SkeletonReviewCard key={i} />)}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <MessageSquare size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-semibold">No reviews found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.map((review) => <ReviewCard key={review._id} review={review} />)}
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && pages > 1 && (
          <Pagination page={page} pages={pages} onPage={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
        )}
      </div>
    </div>
  );
}
