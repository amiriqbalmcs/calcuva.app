"use client";

import { useMemo, useState } from "react";
import {
  TrendingUp, TrendingDown, Info, BookOpen, Target,
  ChevronRight, Calculator, Scale, RefreshCcw, Activity,
  Sparkles, Globe, Landmark, Copy, Award, AlertCircle, History, Banknote, CheckCircle2
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { HowToGuide } from "@/components/HowToGuide";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculatorBySlug } from "@/lib/calculators";
import { PAKISTAN_INFLATION_DATA } from "@/lib/data/HistoricalData";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("pakistan-inflation-calculator")!;

const PkInflationCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
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

  if (!calc) return null;

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8 order-1 lg:order-2">
          <div className="surface-card p-10 bg-background border-border/60 shadow-xl relative overflow-hidden group">
            <Landmark className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />

            <div className="relative z-10 space-y-12">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground flex items-center gap-2">
                    <Banknote className="size-3" />
                    Equivalent Value in {endYear}
                  </div>
                  <button
                    onClick={handleCopy}
                    className={cn(
                      "p-3 rounded-xl transition-all border shadow-sm",
                      copied ? "bg-foreground text-background border-foreground" : "bg-background text-foreground border-border hover:bg-secondary"
                    )}
                  >
                    {copied ? <CheckCircle2 className="size-4" /> : <Copy className="size-4" />}
                  </button>
                </div>
                <div className="flex items-baseline gap-3">
                  <div className="text-6xl md:text-7xl font-mono font-black tracking-tighter tabular-nums text-foreground">
                    {Math.round(result.futureValue).toLocaleString()}
                  </div>
                  <span className="text-2xl font-mono font-bold opacity-20 uppercase tracking-widest">PKR</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10 pt-10 border-t border-border/40">
                <div className="space-y-6">
                  <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Cumulative Inflation</div>
                    <div className="text-3xl font-black tracking-tight text-destructive tabular-nums">+{result.totalInflation.toFixed(1)}%</div>
                  </div>
                  <div className="w-full bg-secondary/30 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-destructive h-full transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min(100, result.totalInflation)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                    The general price level in Pakistan has risen by <span className="font-bold text-destructive">{result.totalInflation.toFixed(1)}%</span> between {startYear} and {endYear}.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Purchasing Power Loss</div>
                    <div className="text-3xl font-black tracking-tight text-destructive tabular-nums">{result.purchasingPowerLoss.toFixed(1)}%</div>
                  </div>
                  <div className="p-5 rounded-2xl bg-destructive/5 border border-destructive/10 space-y-3">
                    <div className="flex items-center gap-2 text-destructive/60">
                      <TrendingDown className="size-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Value Eroded</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                      Your Rs. {amount.toLocaleString()} in {startYear} is only worth <span className="font-bold text-destructive">{Math.round(amount * (1 - result.purchasingPowerLoss / 100)).toLocaleString()} PKR</span> in terms of {endYear} purchasing power.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="surface-card p-8 bg-secondary/5 border-border/30 relative overflow-hidden group">
              <Activity className="absolute -bottom-4 -right-4 size-24 text-foreground/5 group-hover:-rotate-12 transition-transform duration-700" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Economic Multiplier</h4>
              <div className="text-4xl font-mono font-black text-foreground mb-2">{result.multiplier.toFixed(2)}x</div>
              <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                Prices are roughly <span className="font-bold">{result.multiplier.toFixed(2)} times</span> higher today than they were in {startYear}.
              </p>
            </div>

            <div className="surface-card p-8 bg-finance/5 border-finance/20 relative overflow-hidden group">
              <Globe className="absolute -bottom-4 -right-4 size-24 text-finance/10 group-hover:rotate-12 transition-transform duration-700" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-finance/60 mb-4">Currency Trend</h4>
              <div className="text-4xl font-mono font-black text-finance">PKR 🇵🇰</div>
              <p className="text-[11px] text-finance/80 leading-relaxed font-medium mt-2">
                High inflation periods often coincide with Rupee devaluation against major global currencies.
              </p>
            </div>
          </div>
        </div>

        {/* Input Panel */}
        <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <div className="surface-card bg-secondary/5 border-border/40 overflow-hidden group">
            <div className="p-6 md:p-8 border-b border-border/40 flex items-center justify-between bg-background relative overflow-hidden">
              <div className="flex items-center gap-3 relative z-10">
                <History className="size-5 text-muted-foreground/60" />
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold tracking-tight">Timeframe</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Historical Comparison</p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Starting Amount</Label>
                <div className="relative group">
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value) || 0)}
                    className="h-14 bg-background border-border/60 focus:border-foreground/20 transition-all font-mono text-2xl font-bold rounded-xl shadow-sm pl-12 tabular-nums"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 font-mono text-xs font-black">Rs.</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">From Year</Label>
                  <Select value={startYear.toString()} onValueChange={(v) => setStartYear(Number(v))}>
                    <SelectTrigger className="h-12 bg-background border-border/60 font-bold text-xs rounded-xl shadow-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/60">
                      {PAKISTAN_INFLATION_DATA.map(y => (
                        <SelectItem key={y.year} value={y.year.toString()} className="text-xs font-bold">{y.year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">To Year</Label>
                  <Select value={endYear.toString()} onValueChange={(v) => setEndYear(Number(v))}>
                    <SelectTrigger className="h-12 bg-background border-border/60 font-bold text-xs rounded-xl shadow-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/60">
                      {PAKISTAN_INFLATION_DATA.map(y => (
                        <SelectItem key={y.year} value={y.year.toString()} className="text-xs font-bold">{y.year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="surface-card p-6 border-border/30 bg-background relative overflow-hidden group">
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1 text-muted-foreground/40">
                <Info className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Data Source</h4>
                <p className="text-[10px] text-muted-foreground leading-relaxed font-medium uppercase tracking-tight">
                  Calculations based on Pakistan Bureau of Statistics (PBS) annual Consumer Price Index (CPI) reports.
                </p>
              </div>
            </div>
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
};

export default PkInflationCalculator;
