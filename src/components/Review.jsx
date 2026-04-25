import { User } from "lucide-react";

// ─── Star Rating ──────────────────────────────────────────────────────────────
function Stars({ count = 5 }) {
  return (
    <div className="flex items-center justify-center gap-1 mt-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < count ? "text-primary" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ─── Dummy Placeholders Removed ───────────────────────────────────────────────

// ─── Review Data ──────────────────────────────────────────────────────────────
const reviews = [
  {
    id: 1,
    name: "George Ibrahim",
    stars: 5,
    text: '"My order was delivered overseas in 17-18 days. The products ..."',
    productName: "Manabol 10 Kosher Pharma INT",
    image: "https://www.getroids1.net/image/catalog/testimonials/lJiFl5to3rIQqnh7jq6zSqJW8zjvdJQ1-primoplex-xtlabs-reviews.jpg",
  },
  {
    id: 2,
    name: "Justin Bognar",
    stars: 5,
    text: '"I\'m about halfway through my first kit of this stuff ..."',
    productName: "Hutrope 100IU Hubio Pharm",
    image: "https://www.getroids1.net/image/catalog/testimonials/WEArTYwu16tGTYEVi8v1qpNcdxVcyk1t-fortebull-customer-reviews.jpg",
  },
  {
    id: 3,
    name: "Noah Beam",
    stars: 5,
    text: '"I received my order quickly and reliably, as always. You\'re ..."',
    productName: "Sustanon 250 Aslan Pharma USA",
    image: "https://www.getroids1.net/image/catalog/testimonials/2OxW1brAdYxyIgUK6fddqW2Z8ij8S6MW-peptide-plus-bpc-157-reviews.jpg",
  },
];

// ─── Single Review Card ───────────────────────────────────────────────────────
function ReviewCard({ review }) {
  return (
    <div className="relative bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col items-center gap-3 hover:shadow-lg transition-shadow duration-200">

      {/* Popular Review Badge */}
      <div className="absolute top-4 left-4 bg-primary text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">
        Popular Review
      </div>

      {/* Avatar Circle */}
      <div className="w-16 h-16 rounded-full border-2 border-secondary bg-accent flex items-center justify-center mt-4">
        <User className="w-8 h-8 text-secondary" strokeWidth={1.5} />
      </div>

      {/* Name */}
      <h3 className="font-bold text-gray-900 text-base mt-1">{review.name}</h3>

      {/* Stars */}
      <Stars count={review.stars} />

      {/* Review Text */}
      <p className="text-gray-500 text-sm text-center leading-relaxed italic">
        {review.text}
      </p>

      {/* Product Photo */}
      <div className="w-full mt-1 h-[160px] bg-gray-50 rounded-lg border border-gray-100 overflow-hidden flex items-center justify-center">
        {review.image ? (
          <img src={review.image} alt={review.productName} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-300 text-xs">No Image</span>
        )}
      </div>

      {/* Product Name */}
      <p className="text-gray-800 font-semibold text-sm text-center mt-1">
        {review.productName}
      </p>
    </div>
  );
}

// ─── Customer Reviews Section ─────────────────────────────────────────────────
export default function CustomerReviews() {
  return (
    <div className="w-full bg-[#f8f8f8] py-12 px-4 font-sans">

      {/* ── Header ── */}
      <div className="text-center mb-8">
        <h2
          className="text-3xl font-black text-gray-900 tracking-widest inline-block pb-2 border-b-4 border-primary"
          style={{ fontFamily: "Georgia, serif", letterSpacing: "0.15em" }}
        >
          CUSTOMER REVIEWS
        </h2>
        <p className="text-gray-500 text-sm mt-4">
          Discover real user experiences and explore our products.
        </p>
      </div>

      {/* ── Cards Grid ── */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* ── View All Button ── */}
      <div className="flex justify-center mt-10">
        <button className="bg-primary hover:bg-secondary text-white font-bold text-sm px-8 py-3 rounded-full shadow-lg transition-colors duration-200 tracking-wide">
          View All Reviews
        </button>
      </div>

    </div>
  );
}