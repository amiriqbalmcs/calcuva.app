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
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          <div className="surface-card p-8 bg-background border-border/40 shadow-sm space-y-8">
            <div className="flex items-center justify-between border-b border-border/40 pb-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-secondary flex items-center justify-center">
                  <Sparkles className="size-5 text-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Wealth Assessment</h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Real-time 2026 Zakat Calculation</p>
                </div>
              </div>
              <button 
                onClick={fetchRates}
                disabled={isLoading}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group"
              >
                <RefreshCcw className={cn("size-3", isLoading && "animate-spin")} />
                {isLoading ? "Fetching..." : "Live Rates"}
              </button>
            </div>

            {/* Global Settings Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/40 space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Scale className="size-3" /> Weight Unit
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {["tola", "grams"].map((u) => (
                    <button
                      key={u}
                      onClick={() => setWeightUnit(u as WeightUnit)}
                      className={cn(
                        "py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all",
                        weightUnit === u 
                          ? "bg-slate-900 text-white border-slate-900" 
                          : "bg-white text-muted-foreground border-border hover:border-primary/40"
                      )}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/40 space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Coins className="size-3" /> Gold Purity
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {["24k", "22k", "21k", "18k"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setGoldPurity(p as GoldPurity)}
                      className={cn(
                        "py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all",
                        goldPurity === p 
                          ? "bg-slate-900 text-white border-slate-900" 
                          : "bg-white text-muted-foreground border-border hover:border-primary/40"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Assets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <Coins className="size-3.5" /> Precious Metals
                </h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs flex justify-between">
                      <span>Gold Weight ({weightUnit === "tola" ? "Tola" : "Grams"})</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Rate: Rs. {Math.round(goldPricePerGram * (weightUnit === "tola" ? 11.66 : 1)).toLocaleString()}</span>
                    </Label>
                    <Input
                      type="number"
                      value={goldWeight}
                      onChange={(e) => setGoldWeight(e.target.value)}
                      className="h-11 border-slate-200 focus:ring-primary/20"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs flex justify-between">
                      <span>Silver Weight ({weightUnit === "tola" ? "Tola" : "Grams"})</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Rate: Rs. {Math.round(silverPricePerGram * (weightUnit === "tola" ? 11.66 : 1)).toLocaleString()}</span>
                    </Label>
                    <Input
                      type="number"
                      value={silverWeight}
                      onChange={(e) => setSilverWeight(e.target.value)}
                      className="h-11 border-slate-200 focus:ring-primary/20"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <Landmark className="size-3.5" /> Cash & Savings
                </h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Cash in Hand / Wallet</Label>
                    <Input
                      type="number"
                      value={cashInHand}
                      onChange={(e) => setCashInHand(e.target.value)}
                      className="h-11 border-slate-200 focus:ring-primary/20"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Bank Balance / TDRs</Label>
                    <Input
                      type="number"
                      value={bankBalance}
                      onChange={(e) => setBankBalance(e.target.value)}
                      className="h-11 border-slate-200 focus:ring-primary/20"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="size-3.5" /> Investments
                </h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Stocks / Mutual Funds (Value)</Label>
                    <Input
                      type="number"
                      value={investments}
                      onChange={(e) => setInvestments(e.target.value)}
                      className="h-11 border-slate-200 focus:ring-primary/20"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Business Inventory / Goods</Label>
                    <Input
                      type="number"
                      value={businessAssets}
                      onChange={(e) => setBusinessAssets(e.target.value)}
                      className="h-11 border-slate-200 focus:ring-primary/20"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <ShieldCheck className="size-3.5 text-destructive" /> Liabilities
                </h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Debts / Payables</Label>
                    <Input
                      type="number"
                      value={debts}
                      onChange={(e) => setDebts(e.target.value)}
                      className="h-11 border-destructive/20 focus:ring-destructive/20"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Results Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="surface-card p-8 bg-background border-border/60 shadow-xl space-y-8 sticky top-28 overflow-hidden">
            <div className="space-y-6 border-b border-border/40 pb-10">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Zakat Due</p>
                <p className="text-4xl font-black tracking-tighter text-foreground">Rs. {Math.round(results.zakatDue).toLocaleString()}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Net Wealth</p>
                  <p className="text-sm font-bold text-foreground/60">Rs. {Math.round(results.netWealth).toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Nisab (Silver)</p>
                  <p className="text-sm font-bold text-foreground/60">Rs. {Math.round(results.nisabThreshold).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Eligibility Card */}
            <div className={`p-6 rounded-2xl space-y-2 ${results.meetsNisab ? 'bg-green-50 border border-green-100' : 'bg-slate-50 border border-slate-100'}`}>
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground">Eligibility</h4>
                <Badge variant={results.meetsNisab ? "default" : "secondary"} className="text-[9px] uppercase font-black tracking-widest">
                  {results.meetsNisab ? 'Mandatory' : 'Exempted'}
                </Badge>
              </div>
              <p className="text-[11px] font-medium leading-relaxed">
                {results.meetsNisab
                  ? "Your net wealth exceeds the Nisab threshold. Zakat is mandatory at 2.5%."
                  : "Your wealth is below the Nisab threshold. Zakat is not religiously mandatory."}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 space-y-2">
              <p className="text-[10px] font-bold text-blue-900 uppercase flex items-center gap-2">
                <Info className="size-3" /> 2026 Market Note
              </p>
              <p className="text-[9px] text-blue-700 leading-relaxed font-medium">
                Live prices sourced from <a href="https://sarmaaya.pk/commodities/gold" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">Sarmaaya.pk</a>. {goldPurity} Gold: Rs. {Math.round(goldPricePerGram * (weightUnit === "tola" ? 11.66 : 1)).toLocaleString()} / {weightUnit}. Silver: Rs. {Math.round(silverPricePerGram * (weightUnit === "tola" ? 11.66 : 1)).toLocaleString()} / {weightUnit}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
}
