"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Star, MessageSquare, ThumbsUp, Send, User, CheckCircle, AlertCircle, ImagePlus, X } from "lucide-react";
import api, { resolveImageUrl } from "@/utils/api";

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          className="focus:outline-none transition-transform hover:scale-110"
          aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
        >
          <Star
            className={`w-7 h-7 transition-colors`}
            style={{
              fill: n <= (hovered || value) ? "#734B1A" : "transparent",
              color: n <= (hovered || value) ? "#734B1A" : "#d1d5db",
            }}
          />
        </button>
      ))}
    </div>
  );
}

function RatingBar({ star, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold text-gray-500 w-4">{star}</span>
      <Star style={{ width: 14, height: 14, fill: "#734B1A", color: "#734B1A" }} className="flex-shrink-0" />
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: "linear-gradient(90deg,#734B1A,#8D5E21)" }}
        />
      </div>
      <span className="text-xs text-gray-400 w-6 text-right">{count}</span>
    </div>
  );
}

function ReviewCard({ review }) {
  const date = new Date(review.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const reviewImg = review.reviewImage
    ? resolveImageUrl(review.reviewImage)
    : null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#FDF5E6" }}>
          <User className="w-5 h-5" style={{ color: "#734B1A" }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm truncate">
            {review.guestName && review.guestName !== "Anonymous"
              ? review.guestName
              : "Customer"}
          </p>
          <p className="text-xs text-gray-400">{date}</p>
        </div>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              className="w-3.5 h-3.5"
              style={{
                fill: n <= review.rating ? "#734B1A" : "transparent",
                color: n <= review.rating ? "#734B1A" : "#e5e7eb",
              }}
            />
          ))}
        </div>
      </div>
      {review.title && (
        <h4 className="font-bold text-gray-800 text-sm mb-1">{review.title}</h4>
      )}
      <p className="text-gray-600 text-sm leading-relaxed">{review.body}</p>

      {/* Review uploaded image */}
      {reviewImg && (
        <div className="mt-3 rounded-xl overflow-hidden border border-gray-100 h-40">
          <img
            src={reviewImg}
            alt="Review"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    rating: 0,
    title: "",
    body: "",
    guestName: "",
    guestEmail: "",
    imageFile: null,
  });

  const distrib = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  const fetchReviews = useCallback(() => {
    if (!productId) return;
    setLoading(true);
    api
      .get(`/reviews/product/${productId}`)
      .then((res) => {
        setReviews(res.data.reviews || []);
        setAverage(res.data.average || 0);
        setTotal(res.data.total || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Auto-fill name/email from localStorage if customer is logged in
  useEffect(() => {
    try {
      const raw = localStorage.getItem("customerAuth");
      if (raw) {
        const parsed = JSON.parse(raw);
        // Support both { user: {...} } and { name, email } shapes
        const user = parsed?.user || parsed;
        if (user?.name || user?.email) {
          setForm((f) => ({
            ...f,
            guestName: user.name || f.guestName,
            guestEmail: user.email || f.guestEmail,
          }));
        }
      }
    } catch {}
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((f) => ({ ...f, imageFile: file }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setForm((f) => ({ ...f, imageFile: null }));
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.rating) {
      setSubmitMsg({ type: "error", text: "Please select a star rating." });
      return;
    }
    if (!form.body.trim()) {
      setSubmitMsg({ type: "error", text: "Please write your review." });
      return;
    }

    setSubmitting(true);
    setSubmitMsg(null);

    // Build FormData for multipart upload
    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("rating", String(form.rating));
    formData.append("title", form.title);
    formData.append("body", form.body);
    formData.append("guestName", form.guestName);
    formData.append("guestEmail", form.guestEmail);
    if (form.imageFile) {
      formData.append("reviewImage", form.imageFile);
    }

    // Attach auth token if customer is logged in
    const headers = { "Content-Type": "multipart/form-data" };
    try {
      const raw = localStorage.getItem("customerAuth");
      if (raw) {
        const parsed = JSON.parse(raw);
        const token = parsed?.token;
        if (token) headers["Authorization"] = `Bearer ${token}`;
      }
    } catch {}

    try {
      await api.post("/reviews", formData, { headers });
      setSubmitMsg({
        type: "success",
        text: "Thank you! Your review has been submitted and will appear after admin approval.",
      });
      setForm((f) => ({ ...f, rating: 0, title: "", body: "", imageFile: null }));
      setImagePreview(null);
      setShowForm(false);
    } catch (err) {
      setSubmitMsg({
        type: "error",
        text:
          err?.response?.data?.message ||
          "Failed to submit review. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-14" id="product-reviews">
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">
            Customer Reviews
          </h2>
          <p className="text-sm text-gray-500">
            {total > 0
              ? `${total} verified review${total > 1 ? "s" : ""}`
              : "Be the first to leave a review"}
          </p>
        </div>
        <button
          onClick={() => { setShowForm((v) => !v); setSubmitMsg(null); }}
          className="flex items-center gap-2 px-5 py-2.5 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.97] text-sm"
          style={{ background: showForm ? "#5c3a13" : "#734B1A" }}
          id="write-review-btn"
        >
          <MessageSquare className="w-4 h-4" />
          {showForm ? "Cancel" : "Write a Review"}
        </button>
      </div>

      {/* Alert message */}
      {submitMsg && (
        <div
          className={`mb-6 flex items-start gap-3 p-4 rounded-xl border text-sm font-medium ${
            submitMsg.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-600"
          }`}
        >
          {submitMsg.type === "success" ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          {submitMsg.text}
        </div>
      )}

      {/* Review Form */}
      {showForm && (
        <div className="mb-10 border border-gray-200 rounded-2xl p-6 shadow-sm" style={{ background: "#FDF5E6" }}>
          <h3 className="font-bold text-gray-900 text-lg mb-5">
            Share Your Experience
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Rating <span className="text-red-500">*</span>
              </label>
              <StarPicker
                value={form.rating}
                onChange={(v) => setForm((f) => ({ ...f, rating: v }))}
              />
            </div>

            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={form.guestName}
                  onChange={(e) => setForm((f) => ({ ...f, guestName: e.target.value }))}
                  placeholder="John Doe"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none bg-white"
                  style={{ outline: 'none' }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email (optional)
                </label>
                <input
                  type="email"
                  value={form.guestEmail}
                  onChange={(e) => setForm((f) => ({ ...f, guestEmail: e.target.value }))}
                  placeholder="john@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none bg-white"
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Review Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g., Excellent quality!"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none bg-white"
              />
            </div>

            {/* Body */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Your Review <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.body}
                onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                rows={4}
                placeholder="Tell others about your experience with this product..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none bg-white resize-none"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Add a Photo (optional)
              </label>
              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 w-48 object-cover rounded-xl border shadow"
                    style={{ borderColor: "#8D5E21" }}
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="review-image-input"
                  className="flex items-center gap-3 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-all w-fit hover:opacity-80"
                  style={{ borderColor: "#8D5E21" }}
                >
                  <ImagePlus className="w-5 h-5" style={{ color: "#734B1A" }} />
                  <span className="text-sm font-medium" style={{ color: "#734B1A" }}>
                    Click to upload a photo
                  </span>
                  <input
                    id="review-image-input"
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-3 disabled:opacity-50 text-white font-bold rounded-xl shadow transition-all text-sm"
              style={{ background: "#734B1A" }}
              id="submit-review-btn"
            >
              <Send className="w-4 h-4" />
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      )}

      {/* Rating Summary */}
      {total > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 bg-gray-50 border border-gray-100 rounded-2xl p-6">
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-6xl font-black" style={{ color: "#734B1A" }}>{average}</span>
            <div className="flex gap-1 my-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className="w-5 h-5"
                  style={{
                    fill: n <= Math.round(average) ? "#734B1A" : "transparent",
                    color: n <= Math.round(average) ? "#734B1A" : "#e5e7eb",
                  }}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 font-medium">
              Based on {total} review{total > 1 ? "s" : ""}
            </p>
          </div>
          <div className="col-span-2 flex flex-col justify-center gap-2">
            {distrib.map(({ star, count }) => (
              <RatingBar key={star} star={star} count={count} total={total} />
            ))}
          </div>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-10 text-gray-400 font-medium">
          Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <ThumbsUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-semibold">No reviews yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Be the first to share your experience!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      )}
    </section>
  );
}
