"use client";

import { useCart } from "@/context/CartContext";
import { resolveImageUrl } from "@/utils/api";
import { Plus, Minus, Trash2, ShoppingBag, ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CartSidebar() {
    const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart } = useCart();
    
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <>
            {/* ── COLLAPSED FLOATING WIDGET ── */}
            {!isCartOpen && cartCount > 0 && (
                <div 
                    onClick={() => setIsCartOpen(true)}
                    className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-1 bg-white border-y border-l border-gray-200 shadow-xl py-3 px-2.5 rounded-l-xl cursor-pointer hover:bg-gray-50/80 transition-all duration-200 group"
                >
                    <div className="relative">
                        <ShoppingBag className="w-6 h-6 text-[#734B1A] group-hover:scale-105 transition-transform" strokeWidth={2} />
                        <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                            {cartCount}
                        </span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors mt-1" />
                </div>
            )}

            {/* ── EXPANDED SIDE DRAWER ── */}
            <div 
                className={`fixed top-0 right-0 h-full w-[310px] bg-white border-l border-gray-200 shadow-2xl z-[100] flex flex-col transition-transform duration-300 ease-in-out font-sans ${
                    isCartOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Vertical "HIDE CART" Toggle Tab on Left Edge */}
                {isCartOpen && (
                    <button 
                        onClick={() => setIsCartOpen(false)}
                        className="absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 bg-white border-l border-y border-gray-200 shadow-md py-4 px-1 rounded-l-md cursor-pointer flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                        <span className="text-[9px] tracking-[0.2em] font-black text-gray-500 uppercase select-none [writing-mode:vertical-rl] rotate-180">
                            HIDE CART
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                    </button>
                )}

                {/* Top Header Button: View Cart */}
                <div className="p-4 border-b border-gray-100 flex flex-col gap-3">
                    <Link href="/cart" onClick={() => setIsCartOpen(false)}>
                        <button className="w-full bg-primary hover:bg-secondary text-white font-bold text-sm py-2.5 rounded shadow transition-colors uppercase tracking-wider text-center cursor-pointer">
                            View Cart ({cartCount} items)
                        </button>
                    </Link>
                    <div className="flex items-center justify-between px-1">
                        <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total</span>
                        <span className="text-xl font-bold text-[#734B1A]">${cartTotal.toFixed(2)}</span>
                    </div>
                </div>

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <ShoppingBag className="w-12 h-12 mb-2 text-gray-300" strokeWidth={1.5} />
                            <p className="text-sm">Your cart is empty</p>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="flex flex-col items-center pb-4 border-b border-gray-100 relative group">
                                <div className="text-xs text-gray-700 font-semibold text-center mb-2 line-clamp-1 w-full px-2">
                                    {item.name}
                                </div>
                                <div className="w-24 h-24 bg-white flex items-center justify-center p-1 border border-gray-100 rounded-sm">
                                    <img src={resolveImageUrl(item.image)} alt={item.name} className="max-w-full max-h-full object-contain" />
                                </div>
                                <div className="flex items-center justify-between w-full mt-3 px-1">
                                    <button 
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                                        title="Remove item"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    {/* Qty Changer */}
                                    <div className="flex items-center border border-gray-200 rounded overflow-hidden h-7 w-20 bg-white">
                                        <button 
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="w-6 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
                                        >
                                            <Minus className="w-2.5 h-2.5" />
                                        </button>
                                        <div className="flex-1 h-full flex items-center justify-center font-bold text-gray-900 text-xs border-x border-gray-200 select-none">
                                            {item.quantity}
                                        </div>
                                        <button 
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-6 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
                                        >
                                            <Plus className="w-2.5 h-2.5" />
                                        </button>
                                    </div>

                                    <span className="font-bold text-sm text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
