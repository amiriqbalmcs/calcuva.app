"use client";

import { useMemo, useState } from "react";
import { 
  Share, CheckCircle2, PiggyBank, Info, Settings2, Copy, 
  TrendingUp, Wallet, Landmark, Zap, Target, Activity, 
  ArrowUpRight, Sparkles, History, Banknote
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculatorBySlug } from "@/lib/calculators";
import { formatCurrency } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";
import { SITE_DOMAIN } from "@/lib/constants";

const calc = calculatorBySlug("fixed-deposit-calculator")!;

const COMPOUND_PERIODS = [
  { label: "Monthly Compounding", value: 12 },
  { label: "Quarterly Compounding", value: 4 },
  { label: "Half-Yearly Compounding", value: 2 },
  { label: "Yearly Compounding", value: 1 },
];

const FdRdCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const { currency } = useCurrency();
  const [mode, setMode] = useUrlState<"fd" | "rd">("m", "fd");
  const [amount, setAmount] = useUrlState<number>("iv", 50000);
  const [rate, setRate] = useUrlState<number>("r", 7.5);
  const [years, setYears] = useUrlState<number>("y", 5);
  const [compounding, setCompounding] = useUrlState<number>("cp", 4);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const r = rate / 100;
    const n = compounding;
    const t = years;

    if (mode === "fd") {
      const maturity = amount * Math.pow(1 + r / n, n * t);
      const interest = maturity - amount;
      let insight = "";
      if (interest > amount) insight = "Yield Mastery: Your interest exceeds your principal. This indicates high discipline and long-term deposit strategy.";
      else if (interest > amount * 0.3) insight = "Portfolio Boost: Your savings have grown by over 30%. This rate significantly outperforms standard inflation.";
      else insight = "Capital Safety: Your principal is protected while generating guaranteed yield. Consider extending tenure for higher growth.";
      return { maturity, interest, invested: amount, insight };
    } else {
      let maturity = 0;
      const totalMonths = t * 12;
      for (let m = 1; m <= totalMonths; m++) {
        const timeRemaining = (totalMonths - m + 1) / 12;
        maturity += amount * Math.pow(1 + r / n, n * timeRemaining);
      }
      const invested = amount * totalMonths;
      const interest = maturity - invested;
      let insight = "";
      if (interest > invested * 0.4) insight = "Habit-Driven Wealth: Recurring deposits are generating massive leverage. This is the most reliable way to build a corpus.";
      else insight = "Consistent Saver: Regular contributions are creating a guaranteed safety net. You are successfully automating your future wealth.";
      return { maturity, interest, invested, insight };
    }
  }, [mode, amount, rate, years, compounding]);

  const handleCopy = () => {
    const resultText = `Savings Maturity: ${formatCurrency(result.maturity, currency.code)} in ${years} years. Model your deposit at ${SITE_DOMAIN}`;
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        
        {/* Input Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="surface-card p-6 md:p-8 space-y-10 bg-secondary/5 border-border/40 relative overflow-hidden group">
            <Settings2 className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
            
            <div className="space-y-1 relative z-10">
              <h3 className="text-sm font-bold tracking-tight">Savings Architecture</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Yield Configuration</p>
            </div>

            <div className="space-y-8 relative z-10">
              <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
                <TabsList className="grid grid-cols-2 w-full h-11 bg-background border border-border/60 p-1 rounded-xl">
                  <TabsTrigger value="fd" className="rounded-lg text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-background transition-all">Lump Sum</TabsTrigger>
                  <TabsTrigger value="rd" className="rounded-lg text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-background transition-all">Recurring</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Deposit Amount */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{mode === "fd" ? "Initial Deposit" : "Monthly Installment"}</Label>
                  <span className="text-[10px] font-bold text-health">{formatCurrency(amount, currency.code)}</span>
                </div>
                <div className="relative group">
                  <Input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(Number(e.target.value) || 0)} 
                    className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm pr-12"
                  />
                  <Wallet className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                </div>
                <Slider value={[amount]} min={mode === "fd" ? 1000 : 100} max={mode === "fd" ? 1000000 : 50000} step={mode === "fd" ? 1000 : 100} onValueChange={([v]) => setAmount(v)} />
              </div>

              {/* Rate and Tenure */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Return (%)</Label>
                  <Input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm" />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tenure (Yrs)</Label>
                  <Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm" />
                </div>
              </div>

              {/* Compounding */}
              <div className="space-y-3 pt-2 border-t border-border/40">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Yield Compounding</Label>
                <Select value={compounding.toString()} onValueChange={(v) => setCompounding(Number(v))}>
                  <SelectTrigger className="h-11 bg-background border-border/60 font-bold text-[10px] uppercase tracking-widest rounded-xl shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/40">
                    {COMPOUND_PERIODS.map((p) => (
                      <SelectItem key={p.value} value={p.value.toString()} className="text-[10px] font-bold uppercase tracking-widest">
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="surface-card p-6 border-border/30 bg-health/5 relative overflow-hidden group">
            <Sparkles className="absolute -bottom-4 -right-4 size-20 text-health/5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1 text-health">
                <PiggyBank className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Yield Insight</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {result.insight}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Executive Summary */}
          <div className="surface-card p-8 md:p-10 space-y-10 bg-background border-border/60 shadow-md relative overflow-hidden group">
            <TrendingUp className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Target className="size-3" />
                    Projected Maturity Valuation
                  </div>
                  <div className="text-5xl md:text-6xl font-mono font-bold tracking-tighter tabular-nums text-health">
                    {formatCurrency(result.maturity, currency.code)}
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
                    <Zap className="size-3 text-health" />
                    Est. Interest Earned
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-health tabular-nums">
                    {formatCurrency(result.interest, currency.code)}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Banknote className="size-3" />
                    Total Contributions
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                    {formatCurrency(result.invested, currency.code)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { l: "Multiplier", v: (result.maturity / result.invested).toFixed(2), i: Activity, unit: "x" },
               { l: "Time Horizon", v: years, i: History, unit: "yrs" },
               { l: "Interest Weight", v: ((result.interest / result.maturity) * 100).toFixed(1), i: Target, unit: "%" },
               { l: "Monthly Accrual", v: (result.interest / (years * 12)).toFixed(0), i: Zap, unit: currency.code }
             ].map((item, idx) => (
               <div key={idx} className="surface-card p-5 border-border/30 bg-background hover:border-foreground/20 transition-colors group">
                 <div className="flex items-center gap-2 mb-3">
                    <item.i className="size-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{item.l}</span>
                 </div>
                 <div className="text-xl font-mono font-medium tabular-nums leading-tight">
                    {item.v}
                    <span className="text-[10px] ml-1 opacity-40 uppercase">{item.unit}</span>
                 </div>
               </div>
             ))}
          </div>

          {/* Expert Insights */}
          <div className="grid md:grid-cols-2 gap-6 pt-2">
             <div className="surface-card p-8 border-border/30 space-y-4 bg-secondary/5 relative overflow-hidden group">
                <Landmark className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
                <div className="flex items-center gap-2 relative z-10">
                  <History className="size-3 text-health" /> Capital Preservation
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                  Fixed deposits are the cornerstone of a low-risk portfolio, providing a guaranteed rate of return that is immune to equity market volatility.
                </p>
             </div>
             <div className="surface-card p-8 border-border/30 space-y-4 bg-secondary/5 relative overflow-hidden group">
                <Zap className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
                <div className="flex items-center gap-2 relative z-10">
                  <TrendingUp className="size-3 text-health" /> Compounding Velocity
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                  The frequency of compounding plays a critical role in effective annual yield. Shorter intervals (monthly) maximize your total interest accrual.
                </p>
             </div>
          </div>

        </div>
      </div>
    </CalculatorPage>
  );
};

export default FdRdCalculator;
