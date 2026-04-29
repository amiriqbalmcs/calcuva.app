"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";

interface CurrencyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
}

export function CurrencyInput({ label, value, onChange, id, className, ...props }: CurrencyInputProps) {
  const { currency } = useCurrency();
  const prefix = currency.code === 'USD' ? '$' : (currency.symbol || currency.code);
  
  // Dynamic padding based on prefix length
  const prefixString = String(prefix);
  const paddingClass = prefixString.length > 2 ? "pl-20" : prefixString.length > 1 ? "pl-14" : "pl-10";

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold select-none pointer-events-none">
        {prefix}
      </div>
      <Input
        id={id}
        type="number"
        value={value}
        onChange={onChange}
        className={cn(paddingClass, "h-11 bg-background/50 border-border/50 font-mono text-lg font-bold", className)}
        {...props}
      />
    </div>
  );
}
