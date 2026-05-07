"use client";

import { useCurrency, CURRENCIES, CurrencyCode } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export const CurrencySwitcher = ({ className }: { className?: string }) => {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative inline-block text-left", className)} ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Select Currency"
        aria-expanded={open}
        className="flex items-center gap-2 px-5 h-12 rounded-xl bg-background hover:bg-secondary border border-border/60 hover:border-foreground/10 transition-all text-xs font-bold uppercase tracking-widest text-foreground shadow-sm group active:scale-95"
      >
        <span className="opacity-60 font-mono text-[9px]">{currency.code}</span>
        <span className="font-mono">{currency.symbol}</span>
        <ChevronDown className={cn("size-3 text-muted-foreground transition-transform duration-300", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-52 bg-background border border-border shadow-2xl z-[100] p-2 rounded-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="px-3 py-2.5 mb-1">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Select Currency</span>
          </div>
          <div className="grid grid-cols-1 gap-1">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  setCurrency(c.code as CurrencyCode);
                  setOpen(false);
                }}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-xl text-[12px] font-medium transition-all w-full text-left group/item",
                  currency.code === c.code 
                    ? "bg-foreground text-background" 
                    : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn("font-mono text-[10px] uppercase", currency.code === c.code ? "opacity-70" : "opacity-40")}>{c.code}</span>
                  <span>{c.name}</span>
                </div>
                {currency.code === c.code ? (
                  <Check className="size-3" />
                ) : (
                  <span className="font-mono text-[10px] opacity-0 group-hover/item:opacity-40 transition-opacity">{c.symbol}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default CurrencySwitcher;
