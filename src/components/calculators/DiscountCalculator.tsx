"use client";

import { SITE_DOMAIN } from "@/lib/constants";
import { useMemo, useState } from "react";
import {
  Percent, Copy, CheckCircle2, ShoppingCart, Tag,
  Landmark, Wallet, ArrowDownCircle, Info, Zap,
  Globe, ReceiptText, TrendingDown, Sparkles, Share2, Settings2
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { HowToGuide } from "@/components/HowToGuide";
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

        {/* Results Panel (Right on Desktop, Top on Mobile) */}
        <div className="lg:col-span-8 space-y-8 order-1 lg:order-2">
          <div className="surface-card p-8 md:p-12 bg-secondary/5 border-border/40 relative overflow-hidden shadow-sm flex flex-col rounded-3xl min-h-[400px]">
            <Percent className="absolute inset-0 size-96 text-muted-foreground opacity-[0.03] -rotate-12 m-auto" />
            
            <div className="relative z-10 space-y-8">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                    <ReceiptText className="size-3" />
                    Final Price You Pay
                  </div>
                  <div className="text-6xl md:text-8xl font-mono font-bold tracking-tighter tabular-nums text-foreground">
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

              <div className="grid sm:grid-cols-2 gap-8 pt-8 border-t border-border/10">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                    <Sparkles className="size-3 text-health" />
                    Total Amount Saved
                  </div>
                  <div className="text-4xl font-mono font-bold text-health tabular-nums">
                    {formatCurrency(amountSaved, currency.code)}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                    <ArrowDownCircle className="size-3" />
                    Savings Percentage
                  </div>
                  <div className="text-4xl font-mono font-bold text-foreground tabular-nums">
                    {savingsPercentage.toFixed(1)}% <span className="text-[10px] opacity-40 uppercase tracking-widest font-sans">OFF</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <div className="surface-card p-6 bg-background border-border/40 relative overflow-hidden group rounded-2xl shadow-sm">
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Price Before Tax</span>
              <div className="text-xl font-mono font-bold">{formatCurrency(priceAfterDiscount, currency.code)}</div>
            </div>
            <div className="surface-card p-6 bg-background border-border/40 relative overflow-hidden group rounded-2xl shadow-sm">
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Tax Amount</span>
              <div className="text-xl font-mono font-bold">{formatCurrency(taxAmount, currency.code)}</div>
            </div>
            <div className="surface-card p-6 bg-background border-border/40 relative overflow-hidden group rounded-2xl shadow-sm">
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block mb-2 opacity-60">Full Price</span>
              <div className="text-xl font-mono font-bold text-muted-foreground line-through opacity-30">{formatCurrency(originalPrice, currency.code)}</div>
            </div>
          </div>

          {/* Details Section */}
          <div className="grid md:grid-cols-2 gap-6 pt-4">
            <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group rounded-2xl shadow-sm">
              <ReceiptText className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:-rotate-12 transition-transform duration-500" />
              <div className="flex items-center gap-3 relative z-10">
                <Info className="size-4 text-muted-foreground" />
                <h4 className="text-[10px] font-bold uppercase tracking-wider">How We Calculate</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                We subtract the discount from the original price first, then apply the sales tax to the discounted subtotal for maximum accuracy.
              </p>
            </div>
            <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group rounded-2xl shadow-sm">
              <TrendingDown className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:-rotate-12 transition-transform duration-500" />
              <div className="flex items-center gap-3 relative z-10">
                <Tag className="size-4 text-muted-foreground" />
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Savings Summary</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                With a {savingsPercentage.toFixed(1)}% reduction, you're securing a significant discount. Double check if further coupons can be stacked!
              </p>
            </div>
          </div>
        </div>

        {/* Input Panel (Left on Desktop, Bottom on Mobile) */}
        <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <div className="surface-card p-6 md:p-8 space-y-10 bg-secondary/5 border-border/40 relative overflow-hidden group shadow-sm rounded-3xl">
            <Settings2 className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
            
            <div className="space-y-1 relative z-20">
              <h3 className="text-sm font-bold tracking-tight uppercase">Price Settings</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Discount Parameters</p>
            </div>

            <div className="space-y-8 relative z-10">
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Original Price</Label>
                  <span className="text-xs font-mono font-bold text-foreground">{formatCurrency(originalPrice, currency.code)}</span>
                </div>
                <Input
                  type="number"
                  value={originalPrice || ""}
                  onChange={(e) => setOriginalPrice(Number(e.target.value) || 0)}
                  className="h-12 bg-background border-border/60 font-bold text-lg rounded-xl shadow-sm"
                />
              </div>

              <div className="space-y-4 p-5 rounded-2xl bg-background border border-border/40 shadow-sm">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Discount</Label>
                  <Tabs value={discountType} onValueChange={(v) => setDiscountType(v as "percent" | "fixed")}>
                    <TabsList className="h-7 bg-secondary/50 p-1">
                      <TabsTrigger value="percent" className="text-[10px] px-3">%</TabsTrigger>
                      <TabsTrigger value="fixed" className="text-[10px] px-3">{currency.symbol}</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <Input
                  type="number"
                  value={discountValue || ""}
                  onChange={(e) => setDiscountValue(Number(e.target.value) || 0)}
                  className="h-12 bg-background border-border/60 font-bold text-lg rounded-xl"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">Sales Tax (%)</Label>
                <Input
                  type="number"
                  value={taxRate || ""}
                  onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
                  className="h-12 bg-background border-border/60 font-bold text-lg rounded-xl shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="surface-card p-6 border-border/30 bg-finance/5 text-finance relative overflow-hidden group shadow-sm rounded-2xl">
            <ShoppingCart className="absolute -bottom-4 -right-4 size-20 opacity-5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1">
                <Wallet className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-finance/80">Smart Shopper Tip</h4>
                <p className="text-xs leading-relaxed font-medium">
                  Always compare the final price including tax to avoid surprises at the checkout counter.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How-To Section */}
      {calc.howTo && (
        <div className="mt-12 pt-12 border-t border-border/40 max-w-6xl mx-auto">
          <HowToGuide
            id="how-to-use"
            steps={calc.howTo!.steps}
            proTip={calc.howTo!.proTip}
            variant="horizontal"
          />
        </div>
      )}
    </CalculatorPage>
  );
};

export default DiscountCalculator;
