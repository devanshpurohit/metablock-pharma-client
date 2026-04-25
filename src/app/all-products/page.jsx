"use client";

import { useState, useEffect } from "react";

// ── Sample products data ──
const allProducts = [
  {
    id: 1,
    badge: "USA DOMESTIC",
    name: "Multi-Ester Test 400 Pharmaqo Labs US",
    price: 95.0,
    rating: 0,
    topSeller: false,
    image: "https://www.getroids1.net/image/cache/catalog/Pharmaqo/tri-test-400-pharmaqo-labs-us-228x228.jpg",
  },
  {
    id: 2,
    badge: "USA DOMESTIC",
    name: "Tirzepatide 5 PeptidePlus USA",
    price: 130.0,
    rating: 5,
    topSeller: true,
    image: "https://www.getroids1.net/image/cache/catalog/PeptidePlus/tirzepatide-5-peptideplus-usa-228x228.jpg",
  },
  {
    id: 3,
    badge: "USA DOMESTIC",
    name: "Anavar 10 Pharmaqo Labs Us",
    price: 110.0,
    rating: 0,
    topSeller: false,
    image: "https://www.getroids1.net/image/cache/catalog/Pharmaqo/anavar-10-pharmaqo-labs-us-228x228.jpg",
  },
  {
    id: 4,
    badge: "USA DOMESTIC",
    name: "Dbol 20 mg 50 Tabs Xeno US",
    price: 89.0,
    rating: 4,
    topSeller: false,
    image: "https://www.getroids1.net/image/cache/catalog/Xeno/dbol-20-mg-50-tabs-xeno-us-228x228.jpg",
  },
  {
    id: 5,
    badge: "USA DOMESTIC",
    name: "Testosterone Enanthate 250 mg US",
    price: 75.0,
    rating: 4,
    topSeller: false,
    image: "https://www.getroids1.net/image/cache/catalog/Pharmaqo/testosterone-enanthate-250-pharmaqo-labs-us-228x228.jpg",
  },
  {
    id: 6,
    badge: "INTERNATIONAL SHIPMENT",
    name: "Ultima-Prop 100 mg Ultima Pharma INT",
    price: 45.0,
    rating: 0,
    topSeller: false,
    image: "https://www.getroids1.net/image/cache/catalog/Ultima/ultima-prop-100-ultima-pharma-int-228x228.jpg",
  },
  {
    id: 7,
    badge: "USA DOMESTIC",
    name: "Arimidex 1 mg 30 Tablets Xeno US",
    price: 86.0,
    rating: 3,
    topSeller: false,
    image: "https://www.getroids1.net/image/cache/catalog/Xeno/arimidex-1-mg-30-tabs-xeno-us-228x228.jpg",
  },
  {
    id: 8,
    badge: "INTERNATIONAL SHIPMENT",
    name: "Tamox 20 Evolve BioLabs INT",
    price: 25.0,
    rating: 5,
    topSeller: true,
    image: "https://www.getroids1.net/image/cache/catalog/Evolve/tamox-20-evolve-biolabs-int-228x228.jpg",
  },
];

const subcategories = [
  "Anabolic Steroids",
  "Injectable Steroids",
  "Oral Steroids",
  "HGH / Peptides",
  "Fat Burners",
  "Post Cycle Therapy",
];

const brands = [
  "Pharmaqo Labs",
  "Xeno Labs",
  "Beligas Pharma",
  "Ultima Pharma",
  "Evolve BioLabs",
  "PeptidePlus",
];

// ── Star Rating ──
const StarRating = ({ rating }) => (
  <div className="flex gap-0.5 my-1.5">
    {[...Array(5)].map((_, i) => (
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

// ── Badge ──
const Badge = ({ label }) => (
  <span className="flex items-center gap-1 text-[10px] font-bold tracking-wide uppercase text-white bg-[#1a1a1a] rounded px-2 py-1">
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
    {label}
  </span>
);

// ── Product Card ──
const ProductCard = ({ product }) => (
  <div className="relative bg-white border border-gray-200 rounded-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200 cursor-pointer group">
    {/* Badge */}
    {product.badge && (
      <div className="absolute top-3 left-3 z-10">
        <Badge label={product.badge} />
      </div>
    )}

    {/* TOP SELLER ribbon */}
    {product.topSeller && (
      <div className="absolute bottom-[148px] right-0 z-10 bg-primary text-white text-[10px] font-bold px-2 py-1 flex items-center gap-1 rounded-l">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        TOP SELLER
      </div>
    )}

    {/* Image */}
    <div className="flex items-center justify-center h-52 bg-white px-4 pt-10 pb-2">
      <img
        src={product.image}
        alt={product.name}
        className="max-h-40 max-w-full object-contain"
      />
    </div>

    {/* Info */}
    <div className="p-3 flex flex-col flex-1 border-t border-gray-100">
      <p className="text-sm text-gray-800 font-medium leading-snug min-h-[40px] group-hover:text-primary transition-colors">
        {product.name}
      </p>
      <StarRating rating={product.rating} />
      <p className="text-base font-bold text-gray-900 mt-1">
        ${product.price.toFixed(2)}
      </p>

      {/* Add to Cart Button */}
      <button className="mt-3 w-full bg-primary hover:bg-secondary text-white text-xs font-semibold py-2 rounded-sm transition-colors duration-150">
        Add to Cart
      </button>
    </div>
  </div>
);

// ── Collapsible Section ──
const CollapsibleSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-gray-200 py-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-sm font-semibold text-gray-800 hover:text-gray-900"
      >
        {title}
        <span className="text-gray-500 text-lg leading-none">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
};

// ── Main Page ──
export default function AllProductsPage() {
  const MAX_PRICE = 1815;
  const [priceRange, setPriceRange] = useState([0, MAX_PRICE]);
  const [minInput, setMinInput] = useState("0");
  const [maxInput, setMaxInput] = useState("1815");
  const [selectedSubs, setSelectedSubs] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Set to 4 to demonstrate pagination with 8 products

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [priceRange, selectedSubs, selectedBrands, sortBy]);

  const toggleItem = (list, setList, item) => {
    setList((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, MAX_PRICE]);
    setMinInput("0");
    setMaxInput("1815");
    setSelectedSubs([]);
    setSelectedBrands([]);
    setSortBy("default");
  };

  // Filter products
  const filtered = allProducts.filter((p) => {
    const inPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    return inPrice;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const currentProducts = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Breadcrumb */}
      <div className="px-6 py-3 text-sm text-gray-500 flex items-center gap-1.5 border-b border-gray-100">
        <a href="#" className="hover:text-primary">Home</a>
        <span>›</span>
        <span className="text-gray-800">All Products</span>
      </div>

      <div className="flex gap-0">
        {/* ── LEFT SIDEBAR ── */}
        <aside className="w-60 shrink-0 px-4 py-5 border-r border-gray-200 min-h-screen">
          {/* Filter Header */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">Filter</h2>
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 bg-primary hover:bg-secondary text-white text-xs font-semibold px-2.5 py-1 rounded-sm transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          </div>

          {/* Price Filter */}
          <CollapsibleSection title="Price" defaultOpen={true}>
            {/* Dual range slider (visual approximation) */}
            <div className="relative h-6 mb-3">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded -translate-y-1/2" />
              <div
                className="absolute top-1/2 h-1 bg-primary rounded -translate-y-1/2"
                style={{
                  left: `${(priceRange[0] / MAX_PRICE) * 100}%`,
                  right: `${100 - (priceRange[1] / MAX_PRICE) * 100}%`,
                }}
              />
              {/* Min thumb */}
              <input
                type="range"
                min={0}
                max={MAX_PRICE}
                value={priceRange[0]}
                onChange={(e) => {
                  const val = Math.min(Number(e.target.value), priceRange[1] - 10);
                  setPriceRange([val, priceRange[1]]);
                  setMinInput(String(val));
                }}
                className="absolute w-full h-1 top-1/2 -translate-y-1/2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow"
              />
              {/* Max thumb */}
              <input
                type="range"
                min={0}
                max={MAX_PRICE}
                value={priceRange[1]}
                onChange={(e) => {
                  const val = Math.max(Number(e.target.value), priceRange[0] + 10);
                  setPriceRange([priceRange[0], val]);
                  setMaxInput(String(val));
                }}
                className="absolute w-full h-1 top-1/2 -translate-y-1/2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow"
              />
            </div>

            {/* Min/Max inputs */}
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1 border border-gray-300 rounded-sm px-2 py-1 w-full">
                <span className="text-gray-500 text-xs">$</span>
                <input
                  type="number"
                  value={minInput}
                  onChange={(e) => {
                    setMinInput(e.target.value);
                    const val = Math.min(Number(e.target.value), priceRange[1] - 10);
                    if (!isNaN(val)) setPriceRange([val, priceRange[1]]);
                  }}
                  className="w-full text-sm text-gray-700 outline-none bg-transparent"
                />
              </div>
              <div className="flex items-center gap-1 border border-gray-300 rounded-sm px-2 py-1 w-full">
                <span className="text-gray-500 text-xs">$</span>
                <input
                  type="number"
                  value={maxInput}
                  onChange={(e) => {
                    setMaxInput(e.target.value);
                    const val = Math.max(Number(e.target.value), priceRange[0] + 10);
                    if (!isNaN(val)) setPriceRange([priceRange[0], val]);
                  }}
                  className="w-full text-sm text-gray-700 outline-none bg-transparent"
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* Subcategories */}
          <CollapsibleSection title="Subcategories" defaultOpen={false}>
            <ul className="flex flex-col gap-2">
              {subcategories.map((sub) => (
                <li key={sub}>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                    <input
                      type="checkbox"
                      checked={selectedSubs.includes(sub)}
                      onChange={() => toggleItem(selectedSubs, setSelectedSubs, sub)}
                      className="w-3.5 h-3.5 accent-red-700"
                    />
                    {sub}
                  </label>
                </li>
              ))}
            </ul>
          </CollapsibleSection>

          {/* Brand */}
          <CollapsibleSection title="Brand" defaultOpen={false}>
            <ul className="flex flex-col gap-2">
              {brands.map((brand) => (
                <li key={brand}>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleItem(selectedBrands, setSelectedBrands, brand)}
                      className="w-3.5 h-3.5 accent-red-700"
                    />
                    {brand}
                  </label>
                </li>
              ))}
            </ul>
          </CollapsibleSection>
        </aside>

        {/* ── RIGHT CONTENT ── */}
        <main className="flex-1 px-6 py-5">
          {/* Page Title */}
          <h1 className="text-2xl font-normal text-gray-800 mb-5">All Products</h1>

          {/* Sort Bar */}
          <div className="flex items-center justify-end gap-3 mb-6 border-b border-gray-100 pb-4">
            <span className="text-sm text-gray-600">Sort By:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none border border-gray-300 rounded-sm px-3 py-1.5 pr-7 text-sm text-gray-700 outline-none bg-white cursor-pointer"
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
              </select>
              <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Product Grid */}
          {currentProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination UI */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10 border-t border-gray-100 pt-6">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    Prev
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 flex items-center justify-center rounded text-sm transition-colors ${
                        currentPage === i + 1
                          ? "bg-primary text-white border border-primary"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-gray-400 text-sm">
              No products found in this price range.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}