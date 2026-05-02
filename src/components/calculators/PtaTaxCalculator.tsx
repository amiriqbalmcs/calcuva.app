"use client";

import { useState, useMemo } from "react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Info, Smartphone, ShieldCheck, AlertCircle, TrendingDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type CalcMeta } from "@/lib/calculators";

// FBR Valuation Ruling 2070 (April 2026) - Selected High Traffic Models
const MODELS = [
  { label: "iPhone 17 Pro Max", value: 1200, brand: "Apple" },
  { label: "iPhone 17 Pro", value: 1100, brand: "Apple" },
  { label: "iPhone 17", value: 900, brand: "Apple" },
  { label: "iPhone 16 Pro Max", value: 1050, brand: "Apple" },
  { label: "Samsung Galaxy S26 Ultra", value: 1150, brand: "Samsung" },
  { label: "Samsung Galaxy S26+", value: 950, brand: "Samsung" },
  { label: "Google Pixel 10 Pro", value: 1000, brand: "Google" },
  { label: "Google Pixel 10", value: 800, brand: "Google" },
  { label: "OnePlus 14 Pro", value: 850, brand: "OnePlus" },
  { label: "Other / Custom", value: 0, brand: "Custom" },
];

export default function PtaTaxCalculator({ 
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
  const [model, setModel] = useState("Other / Custom");
  const [customValue, setCustomValue] = useState<string>("1000");
  const [regType, setRegType] = useState<"passport" | "cnic">("cnic");
  const [isFiler, setIsFiler] = useState<boolean>(true);

  const currentValue = useMemo(() => {
    return MODELS.find(m => m.label === model)?.value || parseFloat(customValue) || 0;
  }, [model, customValue]);

  const results = useMemo(() => {
    const usdToPkr = 285;
    const pkrValue = currentValue * usdToPkr;
    
    // FBR Commercial/Individual Tax Structure 2026
    let regulatoryDuty = 0;
    let salesTax = 0;
    let withholdingTax = 0;
    let mobileLevy = 0;

    // Based on May 2026 FBR Valuation Ruling
    if (currentValue > 500) {
      // High-end Handsets
      regulatoryDuty = pkrValue * 0.20; 
      salesTax = 25000;
      withholdingTax = isFiler ? 11500 : 35000; // Updated 2026 Non-Filer rate
      mobileLevy = 9000;
    } else if (currentValue > 350) {
      regulatoryDuty = pkrValue * 0.15;
      salesTax = 18000;
      withholdingTax = isFiler ? 7000 : 21000;
      mobileLevy = 5000;
    } else {
      regulatoryDuty = pkrValue * 0.10;
      salesTax = 10000;
      withholdingTax = isFiler ? 3000 : 9000;
      mobileLevy = 2000;
    }

    // Passport Concession Logic 2026
    if (regType === "passport") {
      regulatoryDuty *= 0.70; // 30% discount on passport for overseas
      salesTax *= 0.80; // 20% discount
      withholdingTax *= 0.50; // 50% discount if registered within 60 days of arrival
    }

    return {
      pkrValue,
      regulatoryDuty,
      salesTax,
      withholdingTax,
      mobileLevy,
      total: regulatoryDuty + salesTax + withholdingTax + mobileLevy,
      breakdown: [
        { label: "Regulatory Duty", value: regulatoryDuty, info: "Protection duty for local industry." },
        { label: "Sales Tax (GST)", value: salesTax, info: "Fixed consumption tax for handset category." },
        { label: "Withholding Tax", value: withholdingTax, info: isFiler ? "Standard rate for Filers." : "Increased rate for Non-Filers." },
        { label: "Mobile Levy", value: mobileLevy, info: "Handset-specific flat levy." },
      ]
    };
  }, [currentValue, regType, isFiler]);

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          {/* Input Section */}
          <div className="surface-card p-8 bg-background border-border/40 shadow-sm space-y-6">
            <div className="flex items-center gap-4 border-b border-border/40 pb-6 mb-6">
               <div className="size-10 rounded-xl bg-secondary flex items-center justify-center">
                  <Smartphone className="size-5 text-foreground" />
               </div>
               <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Phone Configuration</h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Select model and registration type</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Select Phone Model</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger className="h-12 border-slate-200 focus:ring-primary/20 transition-all">
                    <SelectValue placeholder="Choose a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {MODELS.map((m) => (
                      <SelectItem key={m.label} value={m.label}>
                        {m.label} {m.value > 0 ? `($${m.value})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {model === "Other / Custom" && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <Label>Handset Value (USD)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <Input
                      type="number"
                      value={customValue}
                      onChange={(e) => setCustomValue(e.target.value)}
                      className="pl-8 h-12 border-slate-200 focus:ring-primary/20"
                      placeholder="Enter value in USD"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Label>Registration Type</Label>
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-secondary/50 rounded-xl border border-border/40">
                  <button
                    onClick={() => setRegType("passport")}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      regType === "passport" ? "bg-white text-primary shadow-sm ring-1 ring-border/20" : "text-muted-foreground hover:bg-white/50"
                    }`}
                  >
                    Passport
                  </button>
                  <button
                    onClick={() => setRegType("cnic")}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      regType === "cnic" ? "bg-white text-primary shadow-sm ring-1 ring-border/20" : "text-muted-foreground hover:bg-white/50"
                    }`}
                  >
                    CNIC
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Tax Filer Status</Label>
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
        </div>

        {/* Results Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="surface-card p-8 bg-background border-border/60 shadow-xl space-y-6 sticky top-28">
            <div className="space-y-6 border-b border-border/40 pb-6">
               <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Payable Tax</p>
                  <p className="text-4xl font-black tracking-tighter text-foreground">Rs. {Math.round(results.total).toLocaleString()}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone Value (PKR)</p>
                  <p className="text-sm font-bold text-foreground/60">Rs. {Math.round(results.pkrValue).toLocaleString()}</p>
               </div>
            </div>

            <div className="space-y-3">
              {results.breakdown.map((item, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-slate-500">{item.label}</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-900">Rs. {Math.round(item.value).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 space-y-2">
              <p className="text-[10px] font-bold text-amber-900 uppercase flex items-center gap-2">
                <AlertCircle className="size-3" /> FBR Note
              </p>
              <p className="text-[9px] text-amber-700 leading-relaxed font-medium">
                Based on Valuation Ruling 2070 (April 2026). Handset value estimated at ${currentValue}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
}
