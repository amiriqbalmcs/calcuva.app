"use client";

import { useState, useMemo } from "react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Info, Car, ShieldCheck, AlertCircle, MapPin, Landmark } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { calculatorBySlug, type CalcMeta } from "@/lib/calculators";

export default function CarRegistrationCalculator({ 
  calc, 
  guideHtml, 
  faqs, 
  relatedArticles 
}: { 
  calc: CalcMeta;
  guideHtml?: string;
  faqs?: any[];
  relatedArticles?: any[];
}) {
  const [province, setProvince] = useState<"punjab" | "sindh" | "islamabad">("punjab");
  const [engineCC, setEngineCC] = useState<string>("1000");
  const [invoiceValue, setInvoiceValue] = useState<string>("3500000");
  const [isFiler, setIsFiler] = useState<boolean>(true);

  const results = useMemo(() => {
    const cc = parseInt(engineCC) || 0;
    const value = parseInt(invoiceValue) || 0;
    
    // 1. Federal Withholding Tax (WHT) - Based on 2026 Percentage-Based Slabs
    let whtRate = 0;
    if (cc <= 850) whtRate = isFiler ? 0.005 : 0.015;
    else if (cc <= 1000) whtRate = isFiler ? 0.01 : 0.03;
    else if (cc <= 1300) whtRate = isFiler ? 0.015 : 0.045;
    else if (cc <= 1600) whtRate = isFiler ? 0.02 : 0.06;
    else if (cc <= 1800) whtRate = isFiler ? 0.03 : 0.09;
    else if (cc <= 2000) whtRate = isFiler ? 0.05 : 0.15;
    else if (cc <= 2500) whtRate = isFiler ? 0.07 : 0.21;
    else if (cc <= 3000) whtRate = isFiler ? 0.09 : 0.27;
    else whtRate = isFiler ? 0.12 : 0.36; // 3000cc+

    const federalWHT = value * whtRate;

    // 2. Provincial Registration Fee
    let regFee = 0;
    let plateFee = 2000;
    let cardFee = 1500;

    if (province === "punjab") {
      // Punjab value-based (approx 2%)
      regFee = value * 0.02;
    } else if (province === "sindh") {
      // Sindh Slab-based
      if (cc <= 1000) regFee = value * 0.01;
      else if (cc <= 1300) regFee = value * 0.0125;
      else if (cc <= 2500) regFee = value * 0.0225;
      else regFee = value * 0.05;
    } else {
      // Islamabad
      regFee = value * 0.02;
    }

    // 3. Luxury Tax (High CC imports/locals)
    let luxuryTax = 0;
    if (cc > 1500) {
      luxuryTax = (cc - 1500) * 100; // Simplified estimate
    }

    const total = federalWHT + regFee + plateFee + cardFee + luxuryTax;

    return {
      total,
      federalWHT,
      regFee,
      plateFee,
      cardFee,
      luxuryTax,
      whtRate: (whtRate * 100).toFixed(1),
    };
  }, [province, engineCC, invoiceValue, isFiler]);

  const stats = [
    {
      label: "Total Payable",
      value: `Rs. ${Math.round(results.total).toLocaleString()}`,
      description: `Includes WHT and Provincial Fees`,
      trend: isFiler ? "down" : "up",
    },
    {
      label: "FBR Advance Tax",
      value: `Rs. ${Math.round(results.federalWHT).toLocaleString()}`,
      description: `${results.whtRate}% of Invoice Value`,
    },
    {
      label: "Registration Fee",
      value: `Rs. ${Math.round(results.regFee).toLocaleString()}`,
      description: `Provincial Excise Fee`,
    },
  ];

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          <div className="surface-card p-8 bg-background border-border/40 shadow-sm space-y-8">
            <div className="flex items-center gap-4 border-b border-border/40 pb-6 mb-6">
               <div className="size-10 rounded-xl bg-secondary flex items-center justify-center">
                  <Car className="size-5 text-foreground" />
               </div>
               <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Vehicle Details</h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Select province and engine capacity</p>
               </div>
            </div>
        {/* Province Selection */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <MapPin className="size-3.5 text-primary" />
            Select Province
          </Label>
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-secondary/50 rounded-xl border border-border/40">
            {(["punjab", "sindh", "islamabad"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setProvince(p)}
                className={`py-2 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all ${
                  province === p ? "bg-white text-primary shadow-sm ring-1 ring-border/20" : "text-muted-foreground hover:bg-white/50"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Engine Capacity (CC)</Label>
            <div className="relative">
              <Input
                type="number"
                value={engineCC}
                onChange={(e) => setEngineCC(e.target.value)}
                className="h-12 border-slate-200 focus:ring-primary/20"
                placeholder="e.g. 1300"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-xs uppercase">CC</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Invoice Value (PKR)</Label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-xs">Rs.</div>
              <Input
                type="number"
                value={invoiceValue}
                onChange={(e) => setInvoiceValue(e.target.value)}
                className="h-12 pl-10 border-slate-200 focus:ring-primary/20"
                placeholder="e.g. 3500000"
              />
            </div>
          </div>
        </div>

        {/* Filer Status */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Landmark className="size-3.5 text-primary" />
            FBR Filer Status
          </Label>
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-secondary/50 rounded-xl border border-border/40">
            <button
              onClick={() => setIsFiler(true)}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                isFiler ? "bg-white text-primary shadow-sm ring-1 ring-border/20" : "text-muted-foreground hover:bg-white/50"
              }`}
            >
              Filer
            </button>
            <button
              onClick={() => setIsFiler(false)}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                !isFiler ? "bg-white text-primary shadow-sm ring-1 ring-border/20" : "text-muted-foreground hover:bg-white/50"
              }`}
            >
              Non-Filer
            </button>
          </div>
        </div>

          </div>
        </div>

        {/* Results Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="surface-card p-8 bg-background border-border/60 shadow-xl space-y-8 sticky top-28 overflow-hidden">
            <div className="space-y-6 border-b border-border/40 pb-10">
               <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Registration Fee</p>
                  <p className="text-4xl font-black tracking-tighter text-foreground">Rs. {Math.round(results.total).toLocaleString()}</p>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Excise Fee</p>
                    <p className="text-sm font-bold text-foreground/60">Rs. {Math.round(results.regFee).toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">WHT (Tax)</p>
                    <p className="text-sm font-bold text-foreground/60">Rs. {Math.round(results.federalWHT).toLocaleString()}</p>
                  </div>
               </div>
            </div>

            {/* Breakdown Card */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Detailed Breakdown</h4>
                <Badge variant="outline" className="text-[9px] uppercase font-black tracking-widest bg-secondary">2026</Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">Number Plate</span>
                  <span className="text-[11px] font-bold text-slate-900">Rs. {results.plateFee.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">Smart Card</span>
                  <span className="text-[11px] font-bold text-slate-900">Rs. {results.cardFee.toLocaleString()}</span>
                </div>
                {results.luxuryTax > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-500">Luxury Tax</span>
                    <span className="text-[11px] font-bold text-slate-900">Rs. {results.luxuryTax.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 space-y-2">
              <p className="text-[10px] font-bold text-amber-900 uppercase flex items-center gap-2">
                <Info className="size-3" /> FBR Note
              </p>
              <p className="text-[9px] text-amber-700 leading-relaxed font-medium">
                As a <strong>{isFiler ? 'Filer' : 'Non-Filer'}</strong>, your withholding tax is calculated at {results.whtRate}%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
}
