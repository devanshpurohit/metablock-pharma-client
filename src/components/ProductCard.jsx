import { ShoppingCart, Heart, Crown, Truck } from "lucide-react";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";
import { useFavorites } from "@/context/FavoritesContext";

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ rating = 0, max = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ─── 100% Original Badge ──────────────────────────────────────────────────────
function OriginalBadge() {
  return (
    <div className="absolute top-2 right-2 w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-700 flex flex-col items-center justify-center shadow-lg border-2 border-yellow-300 z-10">
      <span className="text-white font-black text-[9px] leading-none text-center">100%</span>
      <span className="text-white font-black text-[7px] leading-none text-center">ORIGINAL</span>
      <div className="flex gap-0.5 mt-0.5">
        {[...Array(3)].map((_, i) => (
          <span key={i} className="text-white text-[5px]">★</span>
        ))}
      </div>
    </div>
  );
}

// ─── Top Seller Badge ─────────────────────────────────────────────────────────
function TopSellerBadge() {
  return (
    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-primary text-white text-[10px] font-black px-2.5 py-1.5 rounded shadow-md z-10">
      <Crown className="w-3 h-3 fill-white" />
      <span className="tracking-wide">TOP SELLER</span>
    </div>
  );
}

// ─── USA Domestic Badge ───────────────────────────────────────────────────────
function DomesticBadge({ label = "USA DOMESTIC" }) {
  return (
    <div className="flex items-center gap-1.5 bg-[#1a1a1a] text-white text-[10px] font-bold px-2.5 py-1.5 rounded w-fit">
      <Truck className="w-3 h-3" />
      <span className="tracking-widest uppercase">{label}</span>
    </div>
  );
}

// ─── Dummy Illustrations Removed ──────────────────────────────────────────────

// ─── ProductCard ──────────────────────────────────────────────────────────────
export default function ProductCard({
  product,
  id: propId,
  brand: propBrand,
  name: propName,
  price: propPrice,
  rating: propRating,
  isTopSeller: propIsTopSeller,
  isOriginal: propIsOriginal,
  domestic: propDomestic,
  badge: propBadge,
  productType: propProductType,
  vialColor = "#5b9bd5",
  vialLabel = "Semaglutide",
  vialDose = "5mg",
  image: propImage,
  onAddToCart,
  onFavorite,
}) {
  const id = product?.id || propId;
  const brand = product?.brand || propBrand || "PeptidePlus USA";
  const name = product?.name || propName || "Semaglutide 5 PeptidePlus USA";
  const price = product?.price !== undefined ? product.price : (propPrice !== undefined ? propPrice : 130.00);
  const rating = product?.rating !== undefined ? product.rating : (propRating !== undefined ? propRating : 5);
  const isTopSeller = product?.isTopSeller !== undefined ? product.isTopSeller : (product?.topSeller !== undefined ? product.topSeller : (propIsTopSeller !== undefined ? propIsTopSeller : false));
  const isOriginal = product?.isOriginal !== undefined ? product.isOriginal : (propIsOriginal !== undefined ? propIsOriginal : false);
  const domestic = product?.domestic || product?.badge || propDomestic || propBadge || "USA DOMESTIC";
  const productType = product?.productType || propProductType || "vial";
  const image = product?.image || propImage;

  const { formatPrice } = useCurrency();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    if (onFavorite) {
      onFavorite();
    } else {
      toggleFavorite({
        id,
        brand,
        name,
        price,
        rating,
        isTopSeller,
        isOriginal,
        domestic,
        productType,
        image
      });
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-200 w-full">

      {/* ── Domestic Badge ── */}
      <div className="px-3 pt-3">
        <DomesticBadge label={domestic} />
      </div>

      {/* ── Product Image Area ── */}
      <Link href={`/product?id=${id}`} className="relative flex items-center justify-center px-4 py-4 min-h-[220px]">
        {isOriginal && <OriginalBadge />}

        {image ? (
          <img src={image} alt={name} className="w-full h-full object-contain max-h-[180px]" />
        ) : (
          <div className="w-full h-[180px] bg-gray-50 rounded flex items-center justify-center text-gray-300 text-xs">
            {/* Empty Placeholder */}
          </div>
        )}

        {isTopSeller && <TopSellerBadge />}
      </Link>

      {/* ── Info ── */}
      <div className="px-3 pb-4 flex flex-col gap-2 flex-1">
        {/* Brand */}
        <p className="text-gray-500 text-sm">{brand}</p>
        {/* Product Name */}
        <Link href={`/product?id=${id}`}>
          <p className="text-gray-900 font-semibold text-sm leading-snug hover:text-primary transition-colors">{name}</p>
        </Link>
        {/* Stars */}
        <StarRating rating={rating} />
        {/* Price */}
        <p className="text-gray-900 font-bold text-xl mt-1">
          {formatPrice(price)}
        </p>

        {/* ── Actions ── */}
        <div className="flex items-center gap-2 mt-auto pt-1">
          <button
            onClick={onAddToCart}
            className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold text-sm py-2.5 rounded transition-colors duration-200"
          >
            <ShoppingCart className="w-4 h-4" />
            Add To Cart
          </button>
          <button
            onClick={handleFavoriteClick}
            className={`w-10 h-10 flex items-center justify-center border-2 rounded transition-colors duration-200 flex-shrink-0 ${
              favorited 
                ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100" 
                : "border-gray-200 text-gray-400 hover:border-secondary hover:text-secondary"
            }`}
          >
            <Heart className={`w-4 h-4 ${favorited ? "fill-red-500" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
}