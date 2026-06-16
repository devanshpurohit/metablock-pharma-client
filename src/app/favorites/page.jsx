"use client";

import { useFavorites } from "@/context/FavoritesContext";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import CustomerReviews from "@/components/Review";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Breadcrumb */}
      <div className="px-6 py-3 text-sm text-gray-500 flex items-center gap-1.5 border-b border-gray-100 bg-white">
        <a href="/" className="hover:text-primary">Home</a>
        <span>›</span>
        <span className="text-gray-700">Favorites</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Title */}
        <h1 className="text-2xl font-normal text-gray-800 mb-8 flex items-center gap-2.5">
          <Heart size={24} className="fill-red-500 text-red-500" />
          My Favorites List ({favorites.length})
        </h1>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center flex flex-col items-center justify-center">
            <Heart size={48} className="text-gray-300 mb-3" />
            <h3 className="font-bold text-gray-800 text-base mb-1.5">Your favorites list is empty</h3>
            <p className="text-sm text-gray-500 max-w-xs mb-6">
              Bookmark your favorite anabolic steroids, peptides, and PCT products to view them easily anytime.
            </p>
            <a 
              href="/all-products" 
              className="px-6 py-2.5 bg-primary hover:bg-secondary text-white font-bold text-xs rounded transition-colors uppercase tracking-wider shadow-sm"
            >
              Browse Products
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onAddToCart={() => {
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    badge: product.domestic
                  }, 1);
                  alert(`${product.name} added to cart!`);
                }}
                onFavorite={() => toggleFavorite(product)}
              />
            ))}
          </div>
        )}
      </div>

      <CustomerReviews />
    </div>
  );
}
