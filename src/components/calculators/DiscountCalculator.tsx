"use client";

import { useMemo, useState } from "react";
import { Percent, Copy, CheckCircle2, ShoppingCart } from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import { SeoBlock } from "@/components/SeoBlock";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculatorBySlug } from "@/lib/calculators";
import { formatCurrency } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { useCurrency } from "@/context/CurrencyContext";

const calc = calculatorBySlug("discount-calculator")!;

const DiscountCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const { currency } = useCurrency();
  const [originalPrice, setOriginalPrice] = useUrlState<number>("p", 100);
  const [discountType, setDiscountType] = useUrlState<"percent" | "fixed">("type", "percent");
  const [discountValue, setDiscountValue] = useUrlState<number>("d", 20);
  const [taxRate, setTaxRate] = useUrlState<number>("t", 0);
  const [copied, setCopied] = useState(false);

  const { amountSaved, priceAfterDiscount, taxAmount, finalPrice } = useMemo(() => {
    let saved = 0;
    if (discountType === "percent") {
      saved = originalPrice * (discountValue / 100);
    } else {
      saved = Math.min(discountValue, originalPrice);
    }
    
    const afterDiscount = Math.max(0, originalPrice - saved);
    const tax = afterDiscount * (taxRate / 100);
    
    return {
      amountSaved: saved,
      priceAfterDiscount: afterDiscount,
      taxAmount: tax,
      finalPrice: afterDiscount + tax
    };
  }, [originalPrice, discountType, discountValue, taxRate]);

  const handleCopy = () => {
    const resultText = `Discount Calculator Results:
Original Price: ${formatCurrency(originalPrice, currency)}
Discount: ${discountType === "percent" ? `${discountValue}%` : formatCurrency(discountValue, currency)}
Amount Saved: ${formatCurrency(amountSaved, currency)}
${taxRate > 0 ? `Tax (${taxRate}%): ${formatCurrency(taxAmount, currency)}\n` : ''}
Final Price: ${formatCurrency(finalPrice, currency)}
Calculated on Calcuva.app`;
    
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm mt-0 lg:mt-6">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
               <Percent className="size-5 text-signal" />
               Inputs
            </h2>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Original Price</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground font-medium">
                    {currency}
                  </div>
                  <Input 
                    type="number" 
                    min={0} 
                    value={originalPrice || ""} 
                    onChange={(e) => setOriginalPrice(Number(e.target.value) || 0)} 
                    className="pl-9 font-mono text-lg" 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Discount</Label>
                  <Tabs value={discountType} onValueChange={(v) => setDiscountType(v as "percent" | "fixed")}>
                    <TabsList className="h-8">
                      <TabsTrigger value="percent" className="text-xs px-2 py-1">Percent Off</TabsTrigger>
                      <TabsTrigger value="fixed" className="text-xs px-2 py-1">Fixed Off</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="relative">
                  {discountType === "fixed" && (
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground font-medium">
                      {currency}
                    </div>
                  )}
                  <Input 
                    type="number" 
                    min={0} 
                    max={discountType === "percent" ? 100 : undefined}
                    value={discountValue || ""} 
                    onChange={(e) => setDiscountValue(Number(e.target.value) || 0)} 
                    className={`${discountType === "fixed" ? "pl-9" : "pr-8"} font-mono text-lg`} 
                  />
                  {discountType === "percent" && (
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground font-medium">
                      %
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <Label>Sales Tax <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                <div className="relative border-border">
                  <Input 
                    type="number" 
                    min={0} 
                    value={taxRate || ""} 
                    onChange={(e) => setTaxRate(Number(e.target.value) || 0)} 
                    className="pr-8 font-mono text-lg" 
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground font-medium">
                    %
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <ResultGrid>
            <ResultStat 
              label="Final Price" 
              value={formatCurrency(finalPrice, currency)} 
              className="bg-finance-soft/50 border-finance/20 col-span-2 sm:col-span-2 pt-6 pb-8" 
              valueClassName="text-finance text-4xl sm:text-5xl" 
            />
            
            <ResultStat label="Amount Saved" value={formatCurrency(amountSaved, currency)} />
            <ResultStat label="Price After Discount" value={formatCurrency(priceAfterDiscount, currency)} />
            
            {taxRate > 0 && (
              <ResultStat label="Sales Tax Amount" value={formatCurrency(taxAmount, currency)} className="col-span-2 sm:col-span-2" />
            )}
            
            <div className="col-span-2 pt-2">
              <button onClick={handleCopy} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-secondary text-sm font-bold text-foreground hover:bg-secondary/80 transition-all hover:scale-[0.99] active:scale-95">
                {copied ? <><CheckCircle2 className="size-4 text-green-500" /> Copied</> : <><ShoppingCart className="size-4" /> Copy Deal Details</>}
              </button>
            </div>
          </ResultGrid>
        </div>
      </div>
      
    </CalculatorPage>
  );
}

export default DiscountCalculator;
