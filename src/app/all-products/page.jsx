"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import api, { resolveImageUrl } from "@/utils/api";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";

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

function AllProductsPageContent() {
    const MAX_PRICE = 2000;
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [priceRange, setPriceRange] = useState([0, MAX_PRICE]);
    const [minInput, setMinInput] = useState("0");
    const [maxInput, setMaxInput] = useState("2000");
    const [selectedSubs, setSelectedSubs] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [sortBy, setSortBy] = useState("default");
    const [currentPage, setCurrentPage] = useState(1);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const itemsPerPage = 20;

    const { addToCart } = useCart();
    const searchParams = useSearchParams();
    const categoryQuery = searchParams.get("category");
    const brandQuery = searchParams.get("brand");
    const searchQuery = searchParams.get("search");
    const [searchVal, setSearchVal] = useState("");

    // Fetch data from backend
    useEffect(() => {
        setLoading(true);
        Promise.all([
            api.get("/products?limit=100"),
            api.get("/categories?limit=100"),
            api.get("/brands?limit=100")
        ]).then(([prodRes, catRes, brandRes]) => {
            setProducts(prodRes.data?.data || []);
            setCategories(catRes.data?.data || []);
            setBrands(brandRes.data?.data || []);
            setLoading(false);
        }).catch(err => {
            console.error("Error fetching all products data:", err);
            setError("Failed to load products");
            setLoading(false);
        });
    }, []);

    // Set initial category from query param
    useEffect(() => {
        if (categoryQuery) {
            setSelectedSubs([categoryQuery]);
        } else {
            setSelectedSubs([]);
        }
    }, [categoryQuery]);

    // Set initial brand from query param
    useEffect(() => {
        if (brandQuery) {
            setSelectedBrands([brandQuery]);
        } else {
            setSelectedBrands([]);
        }
    }, [brandQuery]);

    // Set initial search from query param
    useEffect(() => {
        if (searchQuery) {
            setSearchVal(searchQuery);
        } else {
            setSearchVal("");
        }
    }, [searchQuery]);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [priceRange, selectedSubs, selectedBrands, sortBy, searchVal]);

    const toggleItem = (list, setList, item) => {
        setList((prev) =>
            prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
        );
    };

    const clearFilters = () => {
        setPriceRange([0, MAX_PRICE]);
        setMinInput("0");
        setMaxInput(String(MAX_PRICE));
        setSelectedSubs([]);
        setSelectedBrands([]);
        setSortBy("default");
        setSearchVal("");
    };

    // Filter products
    const filtered = products.filter((p) => {
        const inPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
        
        const categoryMatch = selectedSubs.length === 0 || 
            selectedSubs.includes(p.categoryId?._id || p.categoryId);

        const brandMatch = selectedBrands.length === 0 || 
            selectedBrands.includes(p.brandId?._id || p.brandId);

        const searchMatch = !searchVal || 
            p.productName?.toLowerCase().includes(searchVal.toLowerCase()) ||
            p.brandId?.brandName?.toLowerCase().includes(searchVal.toLowerCase()) ||
            p.categoryId?.categoryName?.toLowerCase().includes(searchVal.toLowerCase()) ||
            (p.tags && p.tags.some(t => t.toLowerCase().includes(searchVal.toLowerCase())));

        return inPrice && categoryMatch && brandMatch && searchMatch;
    });

    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "name-asc") return a.productName.localeCompare(b.productName);
        return 0;
    });

    const totalPages = Math.ceil(sorted.length / itemsPerPage);
    const currentProducts = sorted.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center font-sans">
                <div className="text-gray-500 font-semibold">Loading products...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center font-sans text-red-500 font-semibold">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Breadcrumb */}
            <div className="px-6 py-3 text-sm text-gray-500 flex items-center gap-1.5 border-b border-gray-100">
                <Link href="/" className="hover:text-primary">Home</Link>
                <span>›</span>
                <span className="text-gray-800">All Products</span>
            </div>

            <div className="flex flex-col md:flex-row gap-0">

                {/* Mobile Header (Title + Filter Toggle) */}
                <div className="md:hidden px-4 py-4 flex items-center justify-between border-b border-gray-100">
                    <h1 className="text-xl font-normal text-gray-800">All Products</h1>
                    <button
                        onClick={() => setIsMobileFilterOpen(true)}
                        className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-sm text-sm font-semibold transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filters
                    </button>
                </div>

                {/* ── LEFT SIDEBAR ── */}
                <aside className={`
                  ${isMobileFilterOpen ? 'fixed inset-0 z-[100] overflow-y-auto bg-white block' : 'hidden'}
                  md:block md:static md:w-60 shrink-0 px-4 py-5 border-r border-gray-200 md:min-h-screen
                `}>
                    {/* Mobile Filter Close Header */}
                    <div className="flex md:hidden items-center justify-between mb-6 pb-4 border-b border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                        <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Filter Header (Desktop) */}
                    <div className="hidden md:flex items-center justify-between mb-3">
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
                    <CollapsibleSection title="Subcategories" defaultOpen={true}>
                        <ul className="flex flex-col gap-2">
                            {categories.map((cat) => (
                                <li key={cat._id}>
                                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                                        <input
                                            type="checkbox"
                                            checked={selectedSubs.includes(cat._id)}
                                            onChange={() => toggleItem(selectedSubs, setSelectedSubs, cat._id)}
                                            className="w-3.5 h-3.5 accent-red-700"
                                        />
                                        {cat.categoryName}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </CollapsibleSection>

                    {/* Brand */}
                    <CollapsibleSection title="Brand" defaultOpen={true}>
                        <ul className="flex flex-col gap-2">
                            {brands.map((brand) => (
                                <li key={brand._id}>
                                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                                        <input
                                            type="checkbox"
                                            checked={selectedBrands.includes(brand._id)}
                                            onChange={() => toggleItem(selectedBrands, setSelectedBrands, brand._id)}
                                            className="w-3.5 h-3.5 accent-red-700"
                                        />
                                        {brand.brandName}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </CollapsibleSection>
                </aside>

                {/* ── RIGHT CONTENT ── */}
                <main className="flex-1 px-4 md:px-6 py-5">
                    {/* Page Title */}
                    <h1 className="text-2xl font-normal text-gray-800 mb-5 hidden md:block">All Products</h1>

                    {/* Sort Bar */}
                    <div className="flex sm:items-center justify-between sm:justify-end gap-3 mb-6 border-b border-gray-100 pb-4">
                        <span className="text-sm text-gray-600 hidden sm:inline">Sort By:</span>
                        <div className="relative w-full sm:w-auto">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full sm:w-auto appearance-none border border-gray-300 rounded-sm px-3 py-2 sm:py-1.5 pr-8 text-sm text-gray-700 outline-none bg-white cursor-pointer shadow-sm sm:shadow-none"
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
                                {currentProducts.map((p) => {
                                    const productData = {
                                        id: p._id,
                                        brand: p.brandId?.brandName || "Pharma",
                                        name: p.productName,
                                        image: resolveImageUrl(p.mainImage),
                                        price: p.price,
                                        rating: 5,
                                        isTopSeller: p.featured,
                                        isOriginal: p.trending,
                                        domestic: p.trending ? "USA DOMESTIC" : "INTERNATIONAL SHIPPING"
                                    };
                                    return (
                                        <ProductCard 
                                            key={productData.id} 
                                            {...productData} 
                                            onAddToCart={() => {
                                                addToCart({
                                                    id: productData.id,
                                                    name: productData.name,
                                                    price: productData.price,
                                                    image: productData.image,
                                                    badge: productData.domestic
                                                }, 1);
                                                alert(`${productData.name} added to cart!`);
                                            }}
                                        />
                                    );
                                })}
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
                                            className={`w-8 h-8 flex items-center justify-center rounded text-sm transition-colors ${currentPage === i + 1
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
                            No products found matching the criteria.
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default function AllProductsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center font-sans">
                <div className="text-gray-500 font-semibold">Loading products list...</div>
            </div>
        }>
            <AllProductsPageContent />
        </Suspense>
    );
}