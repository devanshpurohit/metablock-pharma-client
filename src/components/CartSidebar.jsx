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
                    className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-1 bg-[#121215]/95 border-y border-l border-white/10 shadow-gold-glow py-3.5 px-3 rounded-l-2xl cursor-pointer hover:bg-[#1a1a1f] transition-all duration-300 group"
                >
                    <div className="relative">
                        <ShoppingBag className="w-6 h-6 text-secondary group-hover:scale-110 transition-transform" strokeWidth={2} />
                        <span className="absolute -top-1.5 -right-1.5 bg-secondary text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow-md animate-pulse">
                            {cartCount}
                        </span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-secondary transition-colors mt-1" />
                </div>
            )}

            {/* ── EXPANDED SIDE DRAWER ── */}
            <div 
                className={`fixed top-0 right-0 h-full w-[310px] bg-[#121215] border-l border-white/10 shadow-2xl z-[100] flex flex-col transition-transform duration-300 ease-in-out font-sans ${
                    isCartOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Vertical "HIDE CART" Toggle Tab on Left Edge */}
                {isCartOpen && (
                    <button 
                        onClick={() => setIsCartOpen(false)}
                        className="absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 bg-[#121215] border-l border-y border-white/10 shadow-md py-4 px-1.5 rounded-l-md cursor-pointer flex flex-col items-center justify-center gap-2 hover:bg-[#1c1c22] transition-colors"
                    >
                        <span className="text-[9px] tracking-[0.2em] font-black text-gray-400 uppercase select-none [writing-mode:vertical-rl] rotate-180">
                            HIDE CART
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                )}

                {/* Top Header Button: View Cart */}
                <div className="p-4 border-b border-white/10 flex flex-col gap-3.5 bg-[#0e0e11]">
                    <Link href="/cart" onClick={() => setIsCartOpen(false)}>
                        <button className="w-full bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-xs py-3 rounded-xl shadow-[0_4px_20px_-5px_rgba(212,175,55,0.3)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.45)] hover:scale-[1.01] transition-all duration-355 uppercase tracking-wider text-center cursor-pointer border-0 active:scale-[0.98]">
                            View Cart ({cartCount} items)
                        </button>
                    </Link>
                    <div className="flex items-center justify-between px-1">
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total</span>
                        <span className="text-lg font-black text-secondary">${cartTotal.toFixed(2)}</span>
                    </div>
                </div>

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-[#121215]">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <ShoppingBag className="w-12 h-12 mb-3 text-gray-600" strokeWidth={1.5} />
                            <p className="text-sm font-bold">Your cart is empty</p>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="flex flex-col items-center pb-4 border-b border-white/5 relative group bg-[#16161b]/40 rounded-2xl p-2.5">
                                <div className="text-xs text-gray-200 font-bold text-center mb-2.5 line-clamp-1 w-full px-2 group-hover:text-secondary transition-colors duration-200">
                                    {item.name}
                                </div>
                                <div className="w-24 h-24 bg-[#FDFBF7] flex items-center justify-center p-2 border border-white/5 rounded-xl shadow-inner transform group-hover:scale-[1.02] transition-transform duration-300">
                                    <img src={resolveImageUrl(item.image)} alt={item.name} className="max-w-full max-h-full object-contain" />
                                </div>
                                <div className="flex items-center justify-between w-full mt-3.5 px-1">
                                    <button 
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-gray-500 hover:text-red-500 transition-colors cursor-pointer border-0 bg-transparent"
                                        title="Remove item"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    {/* Qty Changer */}
                                    <div className="flex items-center border border-white/10 rounded-xl overflow-hidden h-7.5 w-22 bg-[#1c1c22]">
                                        <button 
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="w-6.5 h-full flex items-center justify-center hover:bg-white/5 text-gray-400 transition-colors cursor-pointer border-0 bg-transparent"
                                        >
                                            <Minus className="w-2.5 h-2.5" />
                                        </button>
                                        <div className="flex-1 h-full flex items-center justify-center font-bold text-white text-xs border-x border-white/10 select-none">
                                            {item.quantity}
                                        </div>
                                        <button 
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-6.5 h-full flex items-center justify-center hover:bg-white/5 text-gray-400 transition-colors cursor-pointer border-0 bg-transparent"
                                        >
                                            <Plus className="w-2.5 h-2.5" />
                                        </button>
                                    </div>

                                    <span className="font-extrabold text-sm text-secondary">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
