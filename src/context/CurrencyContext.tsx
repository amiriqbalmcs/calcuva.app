"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CurrencyCode = "USD" | "EUR" | "GBP" | "INR" | "JPY" | "CAD" | "AUD" | "AED" | "SAR";

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");

  useEffect(() => {
    const saved = localStorage.getItem("preferred_currency");
    if (saved) setCurrency(saved as CurrencyCode);
  }, []);

  const handleSetCurrency = (c: CurrencyCode) => {
    setCurrency(c);
    localStorage.setItem("preferred_currency", c);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: handleSetCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within a CurrencyProvider");
  return context;
}
