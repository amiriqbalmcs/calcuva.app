"use client";

import { useMemo, useState } from "react";
import { Banknote, Copy, CheckCircle2, Users } from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import { SeoBlock } from "@/components/SeoBlock";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { calculatorBySlug } from "@/lib/calculators";
import { formatCurrency } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("tip-calculator")!;

const TIP_PRESETS = [10, 15, 18, 20, 25];

const TipCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const { currency } = useCurrency();
  const [bill, setBill] = useUrlState<number>("b", 100);
  const [tipPercent, setTipPercent] = useUrlState<number>("t", 15);
  const [split, setSplit] = useUrlState<number>("s", 1);
  const [copied, setCopied] = useState(false);

  const { tipAmount, totalBill, tipPerPerson, totalPerPerson } = useMemo(() => {
    const tip = bill * (tipPercent / 100);
    const total = bill + tip;
    const people = Math.max(1, split);
    
    return {
      tipAmount: tip,
      totalBill: total,
      tipPerPerson: tip / people,
      totalPerPerson: total / people
    };
  }, [bill, tipPercent, split]);

  const handleCopy = () => {
    let resultText = `Tip Calculator Results:\nBill Amount: ${formatCurrency(bill, currency)}\nTip (${tipPercent}%): ${formatCurrency(tipAmount, currency)}\nTotal Bill: ${formatCurrency(totalBill, currency)}\n`;
    
    if (split > 1) {
      resultText += `\nSplit among ${split} people:\nTip per person: ${formatCurrency(tipPerPerson, currency)}\nTotal per person: ${formatCurrency(totalPerPerson, currency)}\n`;
    }
    
    resultText += `\nCalculated on Calcuva.app`;
    
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-[32px] bg-card border border-border shadow-sm mt-0 lg:mt-6">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
               <div className="size-10 rounded-2xl bg-finance-soft text-finance flex items-center justify-center">
                 <Banknote className="size-5" />
               </div>
               Bill Details
            </h2>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <Label className="text-base text-muted-foreground">Bill Amount</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground font-bold">
                    {currency}
                  </div>
                  <Input 
                    type="number" 
                    min={0} 
                    value={bill || ""} 
                    onChange={(e) => setBill(Number(e.target.value) || 0)} 
                    className="font-mono text-2xl pl-10 py-6 h-14 rounded-2xl bg-secondary/50 border-transparent focus-visible:ring-signal focus-visible:bg-background transition-all" 
                    placeholder="0.00" 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <Label className="text-base text-muted-foreground">Tip Percentage</Label>
                  <span className="text-xl font-mono text-signal font-bold">{tipPercent}%</span>
                </div>
                
                <div className="grid grid-cols-5 gap-2">
                  {TIP_PRESETS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setTipPercent(p)}
                      className={cn(
                        "py-3 rounded-xl font-bold transition-all text-sm sm:text-base",
                        tipPercent === p 
                          ? "bg-signal text-white shadow-lg shadow-signal/20 scale-105" 
                          : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                      )}
                    >
                      {p}%
                    </button>
                  ))}
                </div>
                
                <div className="pt-2 flex items-center gap-4">
                  <span className="text-sm font-bold text-muted-foreground whitespace-nowrap">Custom %</span>
                  <Input 
                    type="number" 
                    min={0} 
                    max={100} 
                    value={tipPercent || ""} 
                    onChange={(e) => setTipPercent(Number(e.target.value) || 0)} 
                    className="font-mono bg-secondary/50 border-transparent rounded-xl h-12" 
                  />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <Label className="text-base text-muted-foreground flex items-center gap-2">
                  <Users className="size-4" /> Split Bill
                </Label>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSplit(Math.max(1, split - 1))}
                    className="size-12 rounded-2xl bg-secondary text-foreground font-bold text-xl hover:bg-secondary/80 transition-colors flex items-center justify-center disabled:opacity-50"
                    disabled={split <= 1}
                  >
                    -
                  </button>
                  <div className="flex-1 text-center font-mono text-2xl font-bold bg-secondary/30 py-2 rounded-2xl">
                    {split}
                  </div>
                  <button 
                    onClick={() => setSplit(split + 1)}
                    className="size-12 rounded-2xl bg-secondary text-foreground font-bold text-xl hover:bg-secondary/80 transition-colors flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <ResultGrid>
            <ResultStat 
              label={split > 1 ? "Total per Person" : "Total Bill"} 
              value={formatCurrency(split > 1 ? totalPerPerson : totalBill, currency)} 
              className="bg-finance-soft/50 border-finance/20 col-span-2 sm:col-span-2 pt-6 pb-8" 
              valueClassName="text-finance text-4xl sm:text-5xl" 
            />
            
            <ResultStat 
              label={split > 1 ? "Tip per Person" : "Tip Amount"} 
              value={formatCurrency(split > 1 ? tipPerPerson : tipAmount, currency)} 
              className={cn(split > 1 ? "" : "col-span-2 sm:col-span-2")}
            />
            
            {split > 1 && (
              <ResultStat 
                label="Grand Total" 
                value={formatCurrency(totalBill, currency)} 
              />
            )}
            
            <div className="col-span-2 pt-4">
              <button onClick={handleCopy} className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-secondary text-sm font-bold text-foreground hover:bg-secondary/80 transition-all hover:scale-[0.99] active:scale-95">
                {copied ? <><CheckCircle2 className="size-5 text-green-500" /> Copied</> : <><Copy className="size-5" /> Copy Receipt Details</>}
              </button>
            </div>
          </ResultGrid>
        </div>
      </div>
      
    </CalculatorPage>
  );
}

export default TipCalculator;
