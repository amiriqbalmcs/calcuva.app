"use client";

import { useState, useMemo, useEffect } from "react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Coins, Landmark, Wallet, Briefcase,
  TrendingUp, Calculator, ShieldCheck, AlertCircle, Sparkles, Info,
  HelpCircle, RefreshCcw, Scale
} from "lucide-react";
import { HowToGuide } from "@/components/HowToGuide";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { type CalcMeta } from "@/lib/calculators";
import { cn } from "@/lib/utils";

type WeightUnit = "grams" | "tola";
type GoldPurity = "24k" | "22k" | "21k" | "18k";

export default function ZakatCalculator({ 
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
  // Asset States
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("tola");
  const [goldPurity, setGoldPurity] = useState<GoldPurity>("24k");
  const [goldWeight, setGoldWeight] = useState<string>("0");
  const [silverWeight, setSilverWeight] = useState<string>("0");
  const [cashInHand, setCashInHand] = useState<string>("0");
  const [bankBalance, setBankBalance] = useState<string>("0");
  const [investments, setInvestments] = useState<string>("0");
  const [businessAssets, setBusinessAssets] = useState<string>("0");
  const [debts, setDebts] = useState<string>("0");

  // Market Data State
  const [marketData, setMarketData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Default prices for 2026 (fallback)
  const [goldPricePerGram, setGoldPricePerGram] = useState<number>(41307);
  const [silverPricePerGram, setSilverPricePerGram] = useState<number>(684);

  const fetchRates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/fetch-metals");
      const data = await res.json();
      if (data.success) {
        setMarketData(data);
        // Default to 24K Gram price from API
        if (data.gold?.perGram?.[goldPurity]) {
          setGoldPricePerGram(data.gold.perGram[goldPurity]);
        }
        if (data.silver?.price1g) {
          setSilverPricePerGram(data.silver.price1g);
        }
      }
    } catch (err) {
      console.error("Failed to fetch rates:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  // Update prices when purity changes
  useEffect(() => {
    if (marketData?.gold?.perGram?.[goldPurity]) {
      setGoldPricePerGram(marketData.gold.perGram[goldPurity]);
    }
  }, [goldPurity, marketData]);

  const results = useMemo(() => {
    const goldW = parseFloat(goldWeight) || 0;
    const silverW = parseFloat(silverWeight) || 0;
    
    // Convert to grams for calculation if needed (1 tola = 11.66g)
    const goldGrams = weightUnit === "tola" ? goldW * 11.66 : goldW;
    const silverGrams = weightUnit === "tola" ? silverW * 11.66 : silverW;

    const goldValue = goldGrams * goldPricePerGram;
    const silverValue = silverGrams * silverPricePerGram;
    const cash = (parseFloat(cashInHand) || 0);
    const bank = (parseFloat(bankBalance) || 0);
    const inv = (parseFloat(investments) || 0);
    const biz = (parseFloat(businessAssets) || 0);
    const debt = (parseFloat(debts) || 0);

    const totalAssets = goldValue + silverValue + cash + bank + inv + biz;
    const netWealth = Math.max(0, totalAssets - debt);

    // Nisab Threshold: 52.5 tolas of silver (standard for maximum charity)
    const nisabSilver = (52.5 * 11.66) * silverPricePerGram;
    const meetsNisab = netWealth >= nisabSilver;
    const zakatDue = meetsNisab ? netWealth * 0.025 : 0;

    return {
      totalAssets,
      netWealth,
      zakatDue,
      nisabThreshold: nisabSilver,
      meetsNisab,
      goldValue,
      silverValue,
      goldGrams,
      silverGrams
    };
  }, [goldWeight, silverWeight, weightUnit, goldPricePerGram, silverPricePerGram, cashInHand, bankBalance, investments, businessAssets, debts]);

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        
        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8 order-1 lg:order-2">
          
          {/* Executive Summary */}
          <div className="surface-card p-8 md:p-10 space-y-10 bg-background border-border/60 shadow-md relative overflow-hidden group">
            <TrendingUp className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-10">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <ShieldCheck className="size-3 text-finance" /> Zakat Assessment
                  </div>
                  <h2 className="text-sm font-bold tracking-tight">Total Zakat Payable</h2>
                </div>
                <div className="flex flex-col items-start md:items-end gap-2 overflow-hidden">
                  <div className="text-3xl sm:text-5xl md:text-6xl font-mono font-bold tracking-tighter text-foreground tabular-nums leading-none break-all">
                    Rs. {Math.round(results.zakatDue).toLocaleString()}
                  </div>
                  <div className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2",
                    results.meetsNisab ? "bg-finance/10 text-finance" : "bg-muted text-muted-foreground"
                  )}>
                    {results.meetsNisab ? (
                      <><Sparkles className="size-3" /> Mandatory Payment</>
                    ) : (
                      "Below Nisab / Exempted"
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-border/40">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Wallet className="size-3" /> Net Zakatable Wealth
                  </div>
                  <div className="text-2xl font-mono font-bold text-foreground/80 tabular-nums">
                    Rs. {Math.round(results.netWealth).toLocaleString()}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Scale className="size-3" /> Nisab Threshold (Silver)
                  </div>
                  <div className="text-2xl font-mono font-bold text-foreground/80 tabular-nums">
                    Rs. {Math.round(results.nisabThreshold).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Progress to Nisab */}
              <div className="mt-10 space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Wealth vs Nisab Threshold</span>
                  <span className="text-[10px] font-bold font-mono">
                    {results.meetsNisab ? "Exceeds Nisab" : `${Math.round((results.netWealth / results.nisabThreshold) * 100)}%`}
                  </span>
                </div>
                <div className="w-full bg-secondary/30 h-3 rounded-full overflow-hidden border border-border/20">
                  <div 
                    className={cn(
                      "h-full transition-all duration-1000 ease-out shadow-sm",
                      results.meetsNisab ? "bg-finance" : "bg-muted-foreground/30"
                    )}
                    style={{ width: `${Math.min(100, (results.netWealth / results.nisabThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Asset Breakdown Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { l: "Gold Value", v: results.goldValue, i: Coins },
              { l: "Silver Value", v: results.silverValue, i: Coins },
              { l: "Cash Total", v: (parseFloat(cashInHand) || 0) + (parseFloat(bankBalance) || 0), i: Wallet },
              { l: "Investments", v: (parseFloat(investments) || 0) + (parseFloat(businessAssets) || 0), i: TrendingUp }
            ].map((item, idx) => (
              <div key={idx} className="surface-card p-5 border-border/30 bg-background hover:border-foreground/20 transition-colors group">
                <div className="flex items-center gap-2 mb-3">
                  <item.i className="size-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{item.l}</span>
                </div>
                <div className="text-xl font-mono font-medium tabular-nums leading-tight">
                  Rs. {Math.round(item.v).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Expert Insights */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="surface-card p-8 border-border/30 space-y-4 bg-secondary/5 relative overflow-hidden group">
              <Info className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
              <div className="flex items-center gap-2 relative z-10 text-[10px] font-bold uppercase tracking-widest text-foreground">
                <ShieldCheck className="size-3 text-finance" /> Nisab Standard
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                While gold nisab is 7.5 tolas, many scholars recommend the silver nisab (52.5 tolas) for the benefit of the poor, as it is lower and triggers zakat earlier.
              </p>
            </div>
            <div className="surface-card p-8 border-border/30 space-y-4 bg-secondary/5 relative overflow-hidden group">
              <HelpCircle className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
              <div className="flex items-center gap-2 relative z-10 text-[10px] font-bold uppercase tracking-widest text-foreground">
                <Calculator className="size-3 text-finance" /> Calculation Rule
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                Zakat is calculated at 2.5% of your net wealth (Total Zakatable Assets minus immediate debts) if it has been held for one lunar year.
              </p>
            </div>
          </div>

        </div>

        {/* Sidebar Panel (Inputs) */}
        <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <div className="surface-card p-6 md:p-8 space-y-8 bg-secondary/5 border-border/40 relative overflow-hidden group">
            <Landmark className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
            
            <div className="space-y-1 relative z-10">
              <h3 className="text-sm font-bold tracking-tight">Wealth Setup</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Asset Configuration</p>
            </div>

            <div className="space-y-6 relative z-10">
              {/* Unit Controls */}
              <div className="grid grid-cols-2 gap-3 pb-6 border-b border-border/20">
                <div className="space-y-2">
                  <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Unit</Label>
                  <Select value={weightUnit} onValueChange={(v: WeightUnit) => setWeightUnit(v)}>
                    <SelectTrigger className="h-9 text-[10px] font-bold uppercase tracking-widest bg-background border-border/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tola" className="text-[10px] font-bold uppercase tracking-widest">Tola</SelectItem>
                      <SelectItem value="grams" className="text-[10px] font-bold uppercase tracking-widest">Grams</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Purity</Label>
                  <Select value={goldPurity} onValueChange={(v: GoldPurity) => setGoldPurity(v)}>
                    <SelectTrigger className="h-9 text-[10px] font-bold uppercase tracking-widest bg-background border-border/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["24k", "22k", "21k", "18k"].map(p => (
                        <SelectItem key={p} value={p} className="text-[10px] font-bold uppercase tracking-widest">{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-4">
                {[
                  { id: "gold", label: "Gold Assets", val: goldWeight, set: setGoldWeight, icon: Coins, sub: `Rate: Rs. ${Math.round(goldPricePerGram * (weightUnit === "tola" ? 11.66 : 1)).toLocaleString()}` },
                  { id: "silver", label: "Silver Assets", val: silverWeight, set: setSilverWeight, icon: Coins, sub: `Rate: Rs. ${Math.round(silverPricePerGram * (weightUnit === "tola" ? 11.66 : 1)).toLocaleString()}` },
                  { id: "cash", label: "Cash & Savings", val: cashInHand, set: setCashInHand, icon: Wallet, sub: "Hand/Bank Total" },
                  { id: "invest", label: "Investments", val: investments, set: setInvestments, icon: TrendingUp, sub: "Stocks/Business" },
                  { id: "debt", label: "Liabilities", val: debts, set: setDebts, icon: Briefcase, sub: "Debts/Bills" },
                ].map((input) => (
                  <div key={input.id} className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 px-1">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{input.label}</Label>
                      <span className="text-[8px] font-bold text-muted-foreground/60 uppercase tracking-tight">{input.sub}</span>
                    </div>
                    <div className="relative group">
                      <Input 
                        type="number" 
                        value={input.val} 
                        onChange={(e) => input.set(e.target.value)} 
                        className="h-11 bg-background border-border/60 font-mono text-sm font-bold rounded-xl pr-10 focus:ring-finance/20 transition-all"
                        placeholder="0"
                      />
                      <input.icon className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30 group-focus-within:text-finance transition-colors" />
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={fetchRates}
                disabled={isLoading}
                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center justify-center gap-3 font-bold text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 disabled:opacity-50"
              >
                <RefreshCcw className={cn("size-3", isLoading && "animate-spin")} />
                {isLoading ? "Fetching Rates..." : "Update Live Rates"}
              </button>

              <div className="pt-4 border-t border-border/20">
                <p className="text-[9px] text-muted-foreground leading-relaxed font-medium uppercase tracking-tight">
                  Live rates via <a href="https://sarmaaya.pk/commodities/gold" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">Sarmaaya.pk</a>. Rates updated automatically on load.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {calc.howTo && (
        <div className="mt-12 pt-12 border-t border-border/40">
          <HowToGuide
            id='how-to-use'
            steps={calc.howTo!.steps}
            proTip={calc.howTo!.proTip}
            variant="horizontal"
          />
        </div>
      )}
    </CalculatorPage>
  );
}
