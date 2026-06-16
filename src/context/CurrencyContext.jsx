"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CurrencyContext = createContext();

const EXCHANGE_RATE = 83.0; // 1 USD = 83 INR

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState("USD");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("roidspharma_currency");
    if (stored) {
      setCurrencyState(stored);
    }
    setIsLoaded(true);
  }, []);

  const setCurrency = (newCurrency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("roidspharma_currency", newCurrency);
  };

  const convertPrice = (priceInUsd) => {
    const numericPrice = Number(priceInUsd) || 0;
    if (currency === "INR") {
      return numericPrice * EXCHANGE_RATE;
    }
    return numericPrice;
  };

  const formatPrice = (priceInUsd) => {
    const converted = convertPrice(priceInUsd);
    if (currency === "INR") {
      // Format INR: ₹XX,XXX
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
      }).format(converted);
    }
    // Format USD: $XX.XX
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice, formatPrice, isLoaded }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
