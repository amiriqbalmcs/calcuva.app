"use client";

import { useMemo, useState } from "react";
import {
  TrendingUp, TrendingDown, Info, BookOpen, Target,
  ChevronRight, Calculator, Scale, RefreshCcw, Activity,
  Sparkles, Globe, Landmark, Copy, Award, AlertCircle, History, Banknote, CheckCircle2
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculatorBySlug } from "@/lib/calculators";
import { PAKISTAN_INFLATION_DATA } from "@/lib/data/HistoricalData";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("pakistan-inflation-calculator");

const PkInflationCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;

  const [amount, setAmount] = useState<number>(1000);
  const [startYear, setStartYear] = useState<number>(2010);
  const [endYear, setEndYear] = useState<number>(2025);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    let currentVal = amount;
    const sortedYears = [...PAKISTAN_INFLATION_DATA].sort((a, b) => a.year - b.year);

    // Calculate cumulative inflation
    if (startYear < endYear) {
      const activeYears = sortedYears.filter(y => y.year > startYear && y.year <= endYear);
      activeYears.forEach(y => {
        currentVal = currentVal * (1 + y.rate / 100);
      });
    } else if (startYear > endYear) {
      const activeYears = sortedYears.filter(y => y.year > endYear && y.year <= startYear);
      activeYears.forEach(y => {
        currentVal = currentVal / (1 + y.rate / 100);
      });
    }

    const multiplier = currentVal / amount;
    const totalInflation = (multiplier - 1) * 100;
    const purchasingPowerLoss = (1 - (amount / currentVal)) * 100;

    return {
      futureValue: currentVal,
      multiplier,
      totalInflation,
      purchasingPowerLoss
    };
  }, [amount, startYear, endYear]);

  const handleCopy = () => {
    const text = `Pakistan Inflation: Rs. ${amount.toLocaleString()} in ${startYear} is equivalent to Rs. ${Math.round(result.futureValue).toLocaleString()} in ${endYear} (+${result.totalInflation.toFixed(1)}% inflation). Analysis at ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        <div className="lg:col-span-7 space-y-6">
          <div className="surface-card bg-secondary/5 border-border/40 overflow-hidden group shadow-sm">
            <div className="p-6 md:p-8 border-b border-border/40 flex items-center justify-between bg-background relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-foreground" />
              <div className="flex items-center gap-3 relative z-10">
                <History className="size-5 text-muted-foreground/60" />
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold tracking-tight">Timeframe Analysis</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Compare PKR value across years</p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Starting Amount (PKR)</Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value) || 0)}
                    className="h-14 bg-background border-border/60 font-mono text-2xl font-bold rounded-xl shadow-sm pl-12 tabular-nums"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 font-mono text-xs font-bold">Rs.</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">From Year</Label>
                  <Select value={startYear.toString()} onValueChange={(v) => setStartYear(Number(v))}>
                    <SelectTrigger className="h-12 bg-background border-border/60 font-bold rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/60">
                      {PAKISTAN_INFLATION_DATA.map(y => (
                        <SelectItem key={y.year} value={y.year.toString()}>{y.year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">To Year</Label>
                  <Select value={endYear.toString()} onValueChange={(v) => setEndYear(Number(v))}>
                    <SelectTrigger className="h-12 bg-background border-border/60 font-bold rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/60">
                      {PAKISTAN_INFLATION_DATA.map(y => (
                        <SelectItem key={y.year} value={y.year.toString()}>{y.year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="surface-card p-6 border-border/30 bg-foreground/5 relative overflow-hidden group">
            <Sparkles className="absolute -bottom-4 -right-4 size-24 text-foreground/5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1 text-foreground/60">
                <Info className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Historical Context</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  This calculator uses official Pakistan Bureau of Statistics (PBS) annual CPI data. Inflation peaked in 2023 at over 30%, significantly impacting the purchasing power of the Rupee.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="surface-card p-8 bg-background border-border/60 shadow-md relative overflow-hidden">
            <div className="space-y-10 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Banknote className="size-3" /> Equivalent Value in {endYear}
                  </div>
                  <button
                    onClick={handleCopy}
                    className={cn(
                      "p-2 rounded-lg transition-all border shadow-sm",
                      copied ? "bg-foreground text-background border-foreground" : "bg-background text-foreground border-border hover:bg-secondary"
                    )}
                  >
                    {copied ? <CheckCircle2 className="size-3.5" /> : <Copy className="size-3.5" />}
                  </button>
                </div>
                <div className="text-6xl font-mono font-bold tracking-tighter tabular-nums text-foreground">
                  {Math.round(result.futureValue).toLocaleString()}<span className="text-xl ml-1 opacity-20">PKR</span>
                </div>
              </div>

              <div className="space-y-6 pt-8 border-t border-border/40">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Cumulative Inflation</div>
                    <div className="text-2xl font-bold tracking-tight text-destructive">+{result.totalInflation.toFixed(1)}%</div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Multiplier</div>
                    <div className="text-2xl font-bold tracking-tight text-foreground">{result.multiplier.toFixed(2)}x</div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-destructive/5 border border-destructive/10 space-y-3">
                  <div className="flex items-center gap-2 text-destructive/60">
                    <TrendingDown className="size-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Purchasing Power Loss</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    Your Rs. {amount.toLocaleString()} in {startYear} has lost <span className="font-bold text-destructive">{result.purchasingPowerLoss.toFixed(1)}%</span> of its original value compared to {endYear}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
};

export default PkInflationCalculator;
