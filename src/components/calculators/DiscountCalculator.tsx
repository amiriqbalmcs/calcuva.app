"use client";

import { SITE_DOMAIN } from "@/lib/constants";
import { useMemo, useState } from "react";
import { 
  Percent, Copy, CheckCircle2, ShoppingCart, Tag, 
  Landmark, Wallet, ArrowDownCircle, Info, Zap, 
  Globe, ReceiptText, TrendingDown, Sparkles, Share2, Settings2
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculatorBySlug } from "@/lib/calculators";
import { formatCurrency } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("discount-calculator")!;

const DiscountCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const { currency } = useCurrency();
  const [originalPrice, setOriginalPrice] = useUrlState<number>("p", 1250);
  const [discountType, setDiscountType] = useUrlState<"percent" | "fixed">("type", "percent");
  const [discountValue, setDiscountValue] = useUrlState<number>("d", 25);
  const [taxRate, setTaxRate] = useUrlState<number>("t", 8.5);
  const [copied, setCopied] = useState(false);

  const { amountSaved, priceAfterDiscount, taxAmount, finalPrice, savingsPercentage } = useMemo(() => {
    let saved = 0;
    if (discountType === "percent") {
      saved = originalPrice * (discountValue / 100);
    } else {
      saved = Math.min(discountValue, originalPrice);
    }
    
    const afterDiscount = Math.max(0, originalPrice - saved);
    const tax = afterDiscount * (taxRate / 100);
    const actualSavingsPercent = (saved / (originalPrice || 1)) * 100;
    
    return {
      amountSaved: saved,
      priceAfterDiscount: afterDiscount,
      taxAmount: tax,
      finalPrice: afterDiscount + tax,
      savingsPercentage: actualSavingsPercent
    };
  }, [originalPrice, discountType, discountValue, taxRate]);

  const handleCopy = () => {
    const resultText = `Discount Deal: ${formatCurrency(finalPrice, currency.code)} (Saved ${formatCurrency(amountSaved, currency.code)} - ${savingsPercentage.toFixed(1)}% OFF). Check yours at ${window.location.href}`;
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        
        {/* Input Side */}
        <div className="lg:col-span-4 space-y-6">
          <div className="surface-card p-6 md:p-8 space-y-10 bg-secondary/5 border-border/40 relative overflow-hidden group">
            {/* Background Icon */}
            <Settings2 className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
            
            <div className="space-y-1 relative z-20">
              <h3 className="text-sm font-bold tracking-tight">Calculator Settings</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Enter Price and Discount</p>
            </div>
 
            <div className="space-y-8 relative z-10">
              {/* List Price */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Original Price</Label>
                  <span className="text-xs font-mono font-medium">{formatCurrency(originalPrice, currency.code)}</span>
                </div>
                <div className="relative group">
                  <Input 
                    type="number" 
                    value={originalPrice} 
                    onChange={(e) => setOriginalPrice(Number(e.target.value) || 0)} 
                    className="h-11 bg-background border-border/60 focus:border-foreground/20 transition-all font-medium text-base rounded-lg shadow-sm"
                  />
                </div>
                <Slider 
                  value={[originalPrice]} 
                  min={0} 
                  max={5000} 
                  step={10} 
                  onValueChange={([v]) => setOriginalPrice(v)} 
                  className="pt-2"
                />
              </div>
 
              {/* Discount */}
              <div className="space-y-4 p-5 rounded-xl bg-background border border-border/40 shadow-sm relative overflow-hidden">
                <Percent className="absolute -top-2 -right-2 size-12 text-signal/5 -rotate-12" />
                <div className="flex justify-between items-center relative z-10">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Discount</Label>
                  <Tabs value={discountType} onValueChange={(v) => setDiscountType(v as "percent" | "fixed")}>
                    <TabsList className="h-7 bg-secondary/50 border-none">
                      <TabsTrigger value="percent" className="text-[10px] px-3 font-medium data-[state=active]:bg-foreground data-[state=active]:text-background">%</TabsTrigger>
                      <TabsTrigger value="fixed" className="text-[10px] px-3 font-medium data-[state=active]:bg-foreground data-[state=active]:text-background">{currency.symbol}</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="relative z-10">
                  <Input 
                    type="number" 
                    value={discountValue} 
                    onChange={(e) => setDiscountValue(Number(e.target.value) || 0)} 
                    className="h-11 bg-background border-border/40 focus:border-foreground/20 transition-all font-medium text-base rounded-lg"
                  />
                </div>
                <Slider 
                  value={[discountValue]} 
                  min={0} 
                  max={discountType === 'percent' ? 100 : originalPrice} 
                  step={discountType === 'percent' ? 1 : 5} 
                  onValueChange={([v]) => setDiscountValue(v)} 
                  className="relative z-10"
                />
              </div>
 
              {/* Tax */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Sales Tax Rate</Label>
                  <span className="text-xs font-mono font-medium">{taxRate}%</span>
                </div>
                <Input 
                  type="number" 
                  value={taxRate} 
                  onChange={(e) => setTaxRate(Number(e.target.value) || 0)} 
                  className="h-11 bg-background border-border/60 focus:border-foreground/20 transition-all font-medium text-base rounded-lg shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
 
        {/* Results Side */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Executive Summary */}
          <div className="surface-card p-8 md:p-10 space-y-10 bg-background border-border/60 shadow-md relative overflow-hidden group">
            <TrendingDown className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <ReceiptText className="size-3" />
                    Final Price You Pay
                  </div>
                  <div className="text-5xl md:text-6xl font-mono font-bold tracking-tighter tabular-nums text-finance">
                    {formatCurrency(finalPrice, currency.code)}
                  </div>
                </div>
                <button 
                  onClick={handleCopy} 
                  className={cn(
                    "p-3 rounded-xl transition-all border shadow-sm",
                    copied ? "bg-foreground text-background border-foreground" : "bg-background text-foreground border-border hover:bg-secondary"
                  )}
                >
                  {copied ? <CheckCircle2 className="size-5" /> : <Copy className="size-5" />}
                </button>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-8 pt-8 border-t border-border/40">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Sparkles className="size-3 text-health" />
                    Total Amount Saved
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-health tabular-nums">
                    {formatCurrency(amountSaved, currency.code)}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <ArrowDownCircle className="size-3" />
                    Savings Percentage
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                    {savingsPercentage.toFixed(1)}% <span className="text-[10px] opacity-40 uppercase tracking-widest font-sans">OFF</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
 
          {/* Breakdown Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="surface-card p-6 bg-secondary/5 border-border/30 relative overflow-hidden group">
              <ShoppingCart className="absolute -bottom-2 -right-2 size-12 text-muted-foreground/5 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block mb-2 relative z-10">Price Before Tax</span>
              <div className="text-xl font-mono font-medium relative z-10">{formatCurrency(priceAfterDiscount, currency.code)}</div>
            </div>
            <div className="surface-card p-6 bg-secondary/5 border-border/30 relative overflow-hidden group">
              <Landmark className="absolute -bottom-2 -right-2 size-12 text-muted-foreground/5 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block mb-2 relative z-10">Tax Amount</span>
              <div className="text-xl font-mono font-medium relative z-10">{formatCurrency(taxAmount, currency.code)}</div>
            </div>
            <div className="surface-card p-6 bg-secondary/5 border-border/30 relative overflow-hidden group">
              <Tag className="absolute -bottom-2 -right-2 size-12 text-muted-foreground/5 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block mb-2 relative z-10">Full Price</span>
              <div className="text-xl font-mono font-medium text-muted-foreground line-through opacity-40 relative z-10">{formatCurrency(originalPrice, currency.code)}</div>
            </div>
          </div>
 
          {/* Details */}
          <div className="grid md:grid-cols-2 gap-6 pt-4">
            <div className="surface-card p-6 border-border/30 space-y-3 bg-background/50 relative overflow-hidden group">
              <ReceiptText className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:-rotate-12 transition-transform duration-500" />
              <div className="flex items-center gap-2 relative z-10">
                <ReceiptText className="size-4 text-muted-foreground" />
                <h4 className="text-[10px] font-bold uppercase tracking-wider">How We Calculate</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed relative z-10">
                We take the discount off the original price first, then add the sales tax to that new amount to find your final total.
              </p>
            </div>
            <div className="surface-card p-6 border-border/30 space-y-3 bg-background/50 relative overflow-hidden group">
              <Info className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:-rotate-12 transition-transform duration-500" />
              <div className="flex items-center gap-2 relative z-10">
                <Info className="size-4 text-muted-foreground" />
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Savings Summary</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed relative z-10">
                A {savingsPercentage.toFixed(1)}% discount is a great deal! You are paying much less than the original store price.
              </p>
            </div>
          </div>

        </div>
      </div>
    </CalculatorPage>
  );
};


export default DiscountCalculator;
