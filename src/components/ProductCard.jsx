import { ShoppingCart, Heart, Crown, Truck, Award } from "lucide-react";
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
          className={`w-3 h-3 ${i < rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}`}
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
    <div className="absolute top-3 right-3 w-12 h-12 rounded-full bg-gradient-to-br from-[#b8860b] via-[#e6ca65] to-[#996515] flex flex-col items-center justify-center shadow-md border border-white/20 z-10 transform group-hover/card:scale-105 duration-300">
      <Award className="w-3.5 h-3.5 text-gray-900" />
      <span className="text-gray-900 font-extrabold text-[7px] leading-none text-center tracking-tighter mt-0.5">GENUINE</span>
    </div>
  );
}

// ─── Top Seller Badge ─────────────────────────────────────────────────────────
function TopSellerBadge() {
  return (
    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-[#121215] text-[#d4af37] text-[8px] font-black px-2.5 py-1.5 rounded-lg border border-secondary/30 shadow-md z-10 tracking-widest uppercase">
      <Crown className="w-2.5 h-2.5 fill-[#d4af37]" />
      <span>TOP SELLER</span>
    </div>
  );
}

// ─── USA Domestic Badge ───────────────────────────────────────────────────────
function DomesticBadge({ label = "USA DOMESTIC" }) {
  const isUsa = label.toUpperCase().includes("USA");
  return (
    <div className={`flex items-center gap-1 ${isUsa ? "text-[#8D5E21]" : "text-gray-400"} text-[8px] font-black tracking-widest uppercase w-fit`}>
      <Truck className="w-3 h-3" />
      <span>{label}</span>
    </div>
  );
}

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
  image: propImage,
  onAddToCart,
  onFavorite,
}) {
  const id = product?.id || propId;
  const brand = product?.brand || propBrand || "Pharma";
  const name = product?.name || propName || "Anabolic Compound";
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
    <div className="bg-[#FDFBF7] border border-black/[0.04] rounded-3xl overflow-hidden flex flex-col hover:border-secondary/40 hover:shadow-gold-glow transition-all duration-400 w-full group/card relative">
      
      {/* ── Image Area ── */}
      <Link href={`/product?id=${id}`} className="relative flex items-center justify-center p-4 min-h-[220px] bg-[#F7F5F0] rounded-2xl mx-3 mt-3 overflow-hidden group-hover/card:bg-[#F2EFE9] transition-colors duration-450">
        {isOriginal && <OriginalBadge />}

        {image ? (
          <img src={image} alt={name} className="w-full h-full object-contain max-h-[170px] transform group-hover/card:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-[170px] bg-[#EFECE6] rounded flex items-center justify-center text-gray-400 text-[10px]">
            No Image
          </div>
        )}

        {isTopSeller && <TopSellerBadge />}
      </Link>

      {/* ── Product Info Details ── */}
      <div className="p-4 flex flex-col gap-1.5 flex-1 mt-1">
        {/* Row with Domestic Status & Brand */}
        <div className="flex items-center justify-between w-full">
          <p className="text-gray-400 text-[9px] uppercase font-bold tracking-widest">{brand}</p>
          <DomesticBadge label={domestic} />
        </div>

        {/* Product Title (using elegant contrast font styling) */}
        <Link href={`/product?id=${id}`} className="mt-1">
          <h3 className="font-serif text-gray-800 text-sm font-normal leading-snug hover:text-secondary transition-colors line-clamp-2 min-h-[40px]" title={name}>
            {name}
          </h3>
        </Link>

        {/* Star list & Price Row */}
        <div className="flex items-center justify-between mt-2">
          <StarRating rating={rating} />
          <p className="text-gray-950 font-extrabold text-sm tracking-tight">
            {formatPrice(price)}
          </p>
        </div>

        {/* ── Action Triggers ── */}
        <div className="flex items-center gap-2 mt-4 pt-1">
          <button
            onClick={onAddToCart}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#121215] hover:bg-gradient-to-r hover:from-primary hover:to-secondary text-white font-extrabold text-[9px] py-3 rounded-xl transition-all duration-350 shadow-md group-hover/card:shadow-gold-glow active:scale-[0.97] cursor-pointer border-0 uppercase tracking-widest"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add To Cart
          </button>
          
          <button
            onClick={handleFavoriteClick}
            className={`w-11 h-11 flex items-center justify-center border rounded-xl transition-all duration-300 flex-shrink-0 cursor-pointer active:scale-[0.97] ${
              favorited 
                ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100" 
                : "border-black/5 bg-white text-gray-400 hover:border-secondary hover:text-secondary hover:bg-secondary/5"
            }`}
            aria-label="Add to favorites"
          >
            <Heart className={`w-3.5 h-3.5 ${favorited ? "fill-red-500 text-red-500" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
}