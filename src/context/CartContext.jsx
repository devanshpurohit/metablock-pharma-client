"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from local storage
    useEffect(() => {
        const stored = localStorage.getItem('roidspharma_cart');
        if (stored) {
            try {
                setCartItems(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to local storage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('roidspharma_cart', JSON.stringify(cartItems));
        }
    }, [cartItems, isLoaded]);

    const addToCart = (product, quantity = 1) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => 
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            return [...prev, { ...product, quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) return removeFromCart(productId);
        setCartItems(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
