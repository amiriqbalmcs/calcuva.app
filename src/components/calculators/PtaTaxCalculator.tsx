"use client";

import { useState, useMemo } from "react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { HowToGuide } from "@/components/HowToGuide";
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

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8 order-1 lg:order-2">
          <div className="surface-card p-8 bg-background border-border/60 shadow-xl space-y-8 relative overflow-hidden group">
            <Smartphone className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />

            <div className="relative z-10 space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-8">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <ShieldCheck className="size-3 text-health" />
                    Total Payable PTA Tax
                  </p>
                  <p className="text-5xl md:text-6xl font-black tracking-tighter text-foreground tabular-nums">
                    Rs. {Math.round(results.total).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1 md:text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone Value (PKR)</p>
                  <p className="text-xl font-bold text-foreground/60 tabular-nums">
                    Rs. {Math.round(results.pkrValue).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Detailed Breakdown</h4>
                  <div className="space-y-4">
                    {results.breakdown.map((item, i) => (
                      <div key={i} className="flex flex-col gap-1 group/item">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-tight">{item.label}</span>
                          <span className="text-sm font-mono font-bold text-foreground">Rs. {Math.round(item.value).toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-secondary/30 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-finance h-full transition-all duration-1000 ease-out"
                            style={{ width: `${(item.value / results.total) * 100}%` }}
                          />
                        </div>
                        <p className="text-[9px] text-muted-foreground/60 font-medium italic opacity-0 group-hover/item:opacity-100 transition-opacity">
                          {item.info}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="surface-card p-6 bg-secondary/5 border-border/30 rounded-2xl space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <AlertCircle className="size-4 text-amber-500" />
                      </div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-600">Legal Compliance</h4>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                      Based on Valuation Ruling 2070 (April 2026). Handset value estimated at ${currentValue}. Tax rates are subject to FBR's real-time verification.
                    </p>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl border border-health/20 bg-health/5">
                    <TrendingDown className="size-5 text-health" />
                    <div>
                      <p className="text-[10px] font-bold text-health uppercase">Overseas Benefit</p>
                      <p className="text-[9px] text-health/80 font-medium">
                        {regType === "passport" ? "Passport discount applied (30-50% reduction)." : "Register via Passport to save up to 40% in taxes."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Input Panel */}
        <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <div className="surface-card p-8 bg-secondary/5 border-border/40 space-y-8 relative overflow-hidden group">
            <div className="flex items-center gap-4 border-b border-border/40 pb-6">
              <div className="size-10 rounded-xl bg-background flex items-center justify-center shadow-sm">
                <Smartphone className="size-5 text-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Phone Setup</h3>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Configuration Details</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Phone Model</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger className="h-12 bg-background border-border/60 font-bold text-[11px] uppercase tracking-widest rounded-xl shadow-sm">
                    <SelectValue placeholder="Choose a model" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/40">
                    {MODELS.map((m) => (
                      <SelectItem key={m.label} value={m.label} className="text-[11px] font-bold uppercase">
                        {m.label} {m.value > 0 ? `($${m.value})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {model === "Other / Custom" && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Handset Value (USD)</Label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 font-black">$</span>
                    <Input
                      type="number"
                      value={customValue}
                      onChange={(e) => setCustomValue(e.target.value)}
                      className="pl-8 h-12 bg-background border-border/60 focus:border-foreground/20 transition-all font-bold text-lg rounded-xl shadow-sm"
                      placeholder="Value in USD"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Registration Type</Label>
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-background/50 rounded-xl border border-border/40 shadow-inner">
                  <button
                    onClick={() => setRegType("passport")}
                    className={`py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${regType === "passport" ? "bg-white text-foreground shadow-md ring-1 ring-border/20" : "text-muted-foreground hover:bg-white/50"
                      }`}
                  >
                    Passport
                  </button>
                  <button
                    onClick={() => setRegType("cnic")}
                    className={`py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${regType === "cnic" ? "bg-white text-foreground shadow-md ring-1 ring-border/20" : "text-muted-foreground hover:bg-white/50"
                      }`}
                  >
                    CNIC
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tax Filer Status</Label>
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-background/50 rounded-xl border border-border/40 shadow-inner">
                  <button
                    onClick={() => setIsFiler(true)}
                    className={`py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${isFiler ? "bg-white text-foreground shadow-md ring-1 ring-border/20" : "text-muted-foreground hover:bg-white/50"
                      }`}
                  >
                    Filer
                  </button>
                  <button
                    onClick={() => setIsFiler(false)}
                    className={`py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${!isFiler ? "bg-white text-foreground shadow-md ring-1 ring-border/20" : "text-muted-foreground hover:bg-white/50"
                      }`}
                  >
                    Non-Filer
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="surface-card p-6 bg-secondary/5 border-border/30 flex gap-4 items-start">
            <Info className="size-5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground leading-relaxed font-medium uppercase tracking-tight">
              PTA tax values are estimated. Final values are determined by FBR at the time of registration.
            </p>
          </div>

          {calc.howTo && (
            <HowToGuide
              id='how-to-use'
              steps={calc.howTo!.steps}
              proTip={calc.howTo!.proTip}
            />
          )}
        </div>
      </div>
    </CalculatorPage>
  );
}
