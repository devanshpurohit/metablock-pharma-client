"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Plus, Minus, Trash2 } from "lucide-react";
import api, { resolveImageUrl } from "@/utils/api";

const tabs = [
    { id: "bestsellers", label: "Best Sellers", icon: "heart" },
    { id: "mostvoted", label: "Most Voted", icon: "chat" },
    { id: "theybought", label: "They Bought These Too", icon: "percent" },
];

// ── Tab Icons ──
const TabIcon = ({ type, active }) => {
    const cls = `w-4 h-4 ${active ? "text-primary" : "text-gray-500"}`;
    if (type === "heart") return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
    );
    if (type === "chat") return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
    );
    if (type === "percent") return (
        <span className={`text-xs font-bold rounded-full bg-primary text-white w-4 h-4 flex items-center justify-center`}>%</span>
    );
    return null;
};

// ── Badge ──
const Badge = ({ label }) => {
    const isEU = label?.includes("EU");
    return (
        <span className={`flex items-center gap-1 text-[10px] font-bold tracking-wide uppercase text-white rounded px-2 py-1 ${isEU ? "bg-[#2a2a2a]" : "bg-[#1a1a1a]"}`}>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" rx="1" />
                <path d="M16 8h4l3 3v5h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            {label}
        </span>
    );
};

// ── Product Card ──
const ProductCard = ({ product }) => (
    <div className="flex flex-col bg-white border border-gray-200 rounded-sm overflow-hidden min-w-[190px] w-[190px] hover:shadow-md transition-shadow cursor-pointer group relative">
        {product.badge && (
            <div className="absolute top-2 left-2 z-10">
                <Badge label={product.badge} />
            </div>
        )}
        <Link href={`/product?id=${product.id}`}>
            <div className="flex items-center justify-center h-44 bg-white px-3 pt-8 pb-2">
                <img src={product.image} alt={product.name} className="max-h-36 max-w-full object-contain" />
            </div>
            <div className="p-3 border-t border-gray-100">
                <p className="text-sm text-gray-800 leading-snug min-h-[40px] group-hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                </p>
                <p className="text-base font-bold text-gray-900 mt-2">${product.price.toFixed(2)}</p>
            </div>
        </Link>
    </div>
);

export default function ShoppingCartPage() {
    const [activeTab, setActiveTab] = useState("bestsellers");
    const { cartItems, updateQuantity, removeFromCart } = useCart();
    const [dynamicProducts, setDynamicProducts] = useState({
        bestsellers: [],
        mostvoted: [],
        theybought: []
    });

    useEffect(() => {
        api.get("/products?limit=100")
            .then((res) => {
                const fetched = res.data.data || [];
                const formatted = fetched.map(p => ({
                    id: p._id,
                    badge: p.featured ? "USA DOMESTIC" : null,
                    name: p.productName,
                    price: p.price,
                    image: resolveImageUrl(p.mainImage)
                }));
                setDynamicProducts({
                    bestsellers: formatted.slice(0, 6),
                    mostvoted: formatted.slice(6, 12),
                    theybought: formatted.slice(12, 18)
                });
            })
            .catch((err) => console.error("Error loading products in cart page:", err));
    }, []);

    const currentProducts = dynamicProducts[activeTab] || [];
    const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCheckout = () => {
        const token = localStorage.getItem("customerToken");
        if (token) {
            window.location.href = "/checkout";
        } else {
            window.location.href = "/login?redirect=/checkout";
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Breadcrumb */}
            <div className="px-6 py-3 text-sm text-gray-500 flex items-center gap-1.5 border-b border-gray-100">
                <a href="/" className="hover:text-primary">Home</a>
                <span>›</span>
                <span className="text-gray-700">Shopping Cart</span>
            </div>

            <div className="px-6 py-12 max-w-5xl mx-auto">
                {/* Page Title */}
                <h1 className="text-2xl font-normal text-gray-800 mb-8 text-center">Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <div className="text-center">
                        <p className="text-base text-gray-600 mb-8">Your shopping cart is empty!</p>
                        <div className="max-w-md mx-auto mb-16">
                            <Link href="/all-products">
                                <button className="w-full bg-primary hover:bg-secondary text-white font-semibold text-base py-4 rounded-sm transition-colors duration-150">
                                    Continue Shopping
                                </button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="mb-16">
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                            {/* ── DESKTOP TABLE ── */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[700px]">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500 uppercase tracking-wider">
                                            <th className="p-4 font-semibold">Product</th>
                                            <th className="p-4 font-semibold">Price</th>
                                            <th className="p-4 font-semibold text-center">Quantity</th>
                                            <th className="p-4 font-semibold text-right">Total</th>
                                            <th className="p-4 font-semibold text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map((item) => (
                                            <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-16 rounded-lg border border-gray-100 bg-white flex items-center justify-center p-1 flex-shrink-0">
                                                            <img src={resolveImageUrl(item.image)} alt={item.name} className="max-w-full max-h-full object-contain" />
                                                        </div>
                                                        <div>
                                                            {item.badge && (
                                                                <span className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1 block">
                                                                    {item.badge}
                                                                </span>
                                                            )}
                                                            <Link href={`/product?id=${item.id}`} className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-2">
                                                                {item.name}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm font-medium text-gray-900">
                                                    ${item.price.toFixed(2)}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center justify-center border border-gray-200 rounded-lg overflow-hidden h-10 w-28 mx-auto bg-white">
                                                        <button 
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <div className="flex-1 h-full flex items-center justify-center font-bold text-gray-900 text-sm border-x border-gray-200">
                                                            {item.quantity}
                                                        </div>
                                                        <button 
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right text-sm font-bold text-primary">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </td>
                                                <td className="p-4 text-center">
                                                    <button 
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* ── MOBILE CARDS ── */}
                            <div className="md:hidden flex flex-col divide-y divide-gray-100">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="p-4 flex flex-col gap-4 relative bg-white hover:bg-gray-50/30 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className="w-20 h-20 rounded-lg border border-gray-100 bg-white flex items-center justify-center p-1.5 flex-shrink-0 shadow-sm">
                                                <img src={resolveImageUrl(item.image)} alt={item.name} className="max-w-full max-h-full object-contain" />
                                            </div>
                                            <div className="flex-1 pr-8">
                                                {item.badge && (
                                                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1 block">
                                                        {item.badge}
                                                    </span>
                                                )}
                                                <Link href={`/product?id=${item.id}`} className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-2 leading-tight mb-1.5">
                                                    {item.name}
                                                </Link>
                                                <span className="text-sm font-medium text-gray-500">${item.price.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between mt-1 pt-1">
                                            <div className="flex items-center justify-center border border-gray-200 rounded-lg overflow-hidden h-9 w-28 bg-white shadow-sm">
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <div className="flex-1 h-full flex items-center justify-center font-bold text-gray-900 text-sm border-x border-gray-200">
                                                    {item.quantity}
                                                </div>
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-gray-400 font-medium mb-0.5">Total</div>
                                                <div className="font-bold text-primary text-base">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => removeFromCart(item.id)}
                                            className="absolute top-4 right-4 w-8 h-8 bg-gray-50 rounded-full inline-flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-gray-50 p-4 md:p-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
                                <Link href="/all-products" className="order-2 md:order-1">
                                    <button className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors cursor-pointer">
                                        ← Continue Shopping
                                    </button>
                                </Link>
                                <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 order-1 md:order-2 w-full md:w-auto">
                                    <div className="text-center sm:text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end">
                                        <p className="text-sm text-gray-500 mb-0 sm:mb-1">Subtotal</p>
                                        <p className="text-2xl font-black text-gray-900">${cartTotal.toFixed(2)}</p>
                                    </div>
                                    <button 
                                        onClick={handleCheckout}
                                        className="w-full sm:w-auto h-12 px-8 bg-primary hover:bg-secondary text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] cursor-pointer"
                                    >
                                        Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Tabs ── */}
                <div className="flex items-center justify-center gap-6 border-b border-gray-200 mb-6">
                    {tabs.map((tab) => {
                        const active = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-1.5 pb-3 text-sm font-medium transition-colors border-b-2 -mb-px cursor-pointer ${active
                                        ? "border-primary text-primary"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <TabIcon type={tab.icon} active={active} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* ── Product Cards Row ── */}
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {currentProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}