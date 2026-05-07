"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { 
  Share, CheckCircle2, Flame, Info, TrendingUp, Wallet, Target, Sparkles, 
  User, Calendar, History, Activity, Zap, Landmark, Globe, 
  Settings2, Copy, TrendingDown, Banknote, BarChart as BarChartIcon
} from "lucide-react";
import { HowToGuide } from "@/components/HowToGuide";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { calculatorBySlug } from "@/lib/calculators";
import { formatCurrency, formatCompact } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { useCurrency } from "@/context/CurrencyContext";
import { SITE_DOMAIN } from "@/lib/constants";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("retirement-fire-calculator")!;

const RetirementFireCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const { currency } = useCurrency();
  const [currentAge, setCurrentAge] = useUrlState<number>("age", 30);
  const [retireAge, setRetireAge] = useUrlState<number>("ret", 60);
  const [currentSavings, setCurrentSavings] = useUrlState<number>("sav", 50000);
  const [monthlyContribution, setMonthlyContribution] = useUrlState<number>("ms", 1000);
  const [expectedReturn, setExpectedReturn] = useUrlState<number>("r", 8);
  const [monthlyExpensesAtRetirement, setMonthlyExpensesAtRetirement] = useUrlState<number>("ex", 3000);
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const years = Math.max(1, retireAge - currentAge);
    const r = expectedReturn / 100 / 12;
    const n = years * 12;

    const fvSavings = currentSavings * Math.pow(1 + r, n);
    const fvContrib = r === 0 ? monthlyContribution * n : monthlyContribution * (Math.pow(1 + r, n) - 1) / r;

    const totalCorpus = fvSavings + fvContrib;
    const fireNumber = monthlyExpensesAtRetirement * 12 * 25;
    
    const data = [];
    let balance = currentSavings;
    for (let y = 0; y <= years; y++) {
      data.push({ age: currentAge + y, balance });
      for (let m = 0; m < 12; m++) {
        balance = balance * (1 + (expectedReturn / 100 / 12)) + monthlyContribution;
      }
    }

    let status: "ready" | "near" | "gap" = "gap";
    let insight = "";
    if (totalCorpus >= fireNumber) {
      status = "ready";
      insight = "Fully Independent: Your projected corpus exceeds your 25x FIRE target. Compounding has officially won.";
    } else if (totalCorpus >= fireNumber * 0.7) {
      status = "near";
      insight = "Nearly Independent: You are at 70%+ of your target. A small contribution boost or +2 years of work secures the goal.";
    } else {
      status = "gap";
      insight = "Savings Gap: Your current trajectory has a shortfall. Focus on increasing monthly contributions or extending the horizon.";
    }

    return { totalCorpus, fireNumber, data, insight, status, percent: (totalCorpus / (fireNumber || 1)) * 100 };
  }, [currentAge, retireAge, currentSavings, monthlyContribution, expectedReturn, monthlyExpensesAtRetirement]);

  const handleCopy = () => {
    const resultText = `Financial Freedom Path: Targeting ${formatCurrency(stats.fireNumber, currency.code)} at age ${retireAge}. Plan yours at ${window.location.href}`;
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        
        {/* Input Panel */}
        <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <div className="surface-card p-6 md:p-8 space-y-10 bg-secondary/5 border-border/40 relative overflow-hidden group">
            <Settings2 className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
            
            <div className="space-y-1 relative z-10">
              <h3 className="text-sm font-bold tracking-tight">FIRE Architecture</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Wealth Configuration</p>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Age Config */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Current Age</Label>
                  <Input type="number" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm" />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Retire Age</Label>
                  <Input type="number" value={retireAge} onChange={(e) => setRetireAge(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm" />
                </div>
              </div>

              {/* Current Assets */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Current Assets</Label>
                  <span className="text-[10px] font-bold text-health">{formatCurrency(currentSavings, currency.code)}</span>
                </div>
                <div className="relative group">
                  <Input 
                    type="number" 
                    value={currentSavings} 
                    onChange={(e) => setCurrentSavings(Number(e.target.value) || 0)} 
                    className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm pr-12"
                  />
                  <Wallet className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                </div>
                <Slider value={[currentSavings]} min={0} max={1000000} step={1000} onValueChange={([v]) => setCurrentSavings(v)} />
              </div>

              {/* Monthly Contribution */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Monthly Accumulation</Label>
                  <span className="text-[10px] font-bold text-health">{formatCurrency(monthlyContribution, currency.code)}</span>
                </div>
                <div className="relative group">
                  <Input 
                    type="number" 
                    value={monthlyContribution} 
                    onChange={(e) => setMonthlyContribution(Number(e.target.value) || 0)} 
                    className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm pr-12"
                  />
                  <TrendingUp className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                </div>
                <Slider value={[monthlyContribution]} min={0} max={20000} step={100} onValueChange={([v]) => setMonthlyContribution(v)} />
              </div>

              {/* Parameters */}
              <div className="grid grid-cols-2 gap-6 pt-2 border-t border-border/40">
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Return (%)</Label>
                  <Input type="number" step="0.1" value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm" />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Exp/mo</Label>
                  <Input type="number" value={monthlyExpensesAtRetirement} onChange={(e) => setMonthlyExpensesAtRetirement(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm" />
                </div>
              </div>
            </div>
          </div>

          <div className={cn("surface-card p-6 border-border/30 relative overflow-hidden group", 
            stats.status === "ready" ? "bg-emerald-500/[0.03]" : "bg-health/5"
          )}>
            <Flame className="absolute -bottom-4 -right-4 size-20 text-foreground/[0.03] group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className={cn("mt-1", stats.status === "ready" ? "text-emerald-500" : "text-health")}>
                <Flame className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Financial Analysis</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {stats.insight}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Guide */}
          {calc.howTo && (
            <HowToGuide 
              id="how-to-use"
              steps={calc.howTo!.steps} 
              proTip={calc.howTo!.proTip} 
              variant="sidebar" 
            />
          )}
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8 order-1 lg:order-2">
          
          {/* Executive Summary */}
          <div className="surface-card p-8 md:p-10 space-y-10 bg-background border-border/60 shadow-md relative overflow-hidden group">
            <Target className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Flame className="size-3" />
                    Estimated Maturity Corpus
                  </div>
                  <div className="text-5xl md:text-6xl font-mono font-bold tracking-tighter tabular-nums text-health">
                    {formatCurrency(stats.totalCorpus, currency.code)}
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
                    <Target className="size-3" />
                    FIRE Target Goal
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                    {formatCurrency(stats.fireNumber, currency.code)}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Activity className="size-3" />
                    Percent of Goal
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-health tabular-nums">
                    {stats.percent.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio Trajectory */}
          <div className="surface-card p-10 bg-secondary/5 border-border/30 relative overflow-hidden group">
            <BarChartIcon className="absolute -bottom-4 -right-4 size-24 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
            <div className="flex items-center justify-between mb-12 relative z-10">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Independence Trajectory</h4>
              <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">Age-Based Projection</span>
            </div>
            
            <div className="h-[320px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.data}>
                  <defs>
                    <linearGradient id="colorBal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--foreground))" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="hsl(var(--foreground))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.1} />
                  <XAxis dataKey="age" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, opacity: 0.4 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, opacity: 0.4 }} tickFormatter={(v) => formatCompact(v)} />
                  <Tooltip 
                    formatter={(v: any) => [formatCurrency(v, currency.code), "Portfolio Value"]} 
                    labelFormatter={(l) => `Age ${l}`}
                    contentStyle={{ borderRadius: "16px", border: "none", backgroundColor: "hsl(var(--background))", boxShadow: "0 20px 40px -12px rgb(0 0 0 / 0.3)" }}
                  />
                  <Area type="monotone" dataKey="balance" stroke="hsl(var(--foreground))" fill="url(#colorBal)" strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-8 relative z-10 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-40">Portfolio Evolution Curve</div>
          </div>

          {/* Performance Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { l: "Time Horizon", v: Math.max(0, retireAge - currentAge), i: History, unit: "yrs" },
               { l: "Principal Base", v: currentSavings + (monthlyContribution * 12 * (retireAge - currentAge)), i: Landmark, isMoney: true },
               { l: "Growth Yield", v: stats.totalCorpus - (currentSavings + (monthlyContribution * 12 * (retireAge - currentAge))), i: TrendingUp, isMoney: true },
               { l: "Safety Margin", v: stats.percent > 100 ? (stats.percent - 100).toFixed(1) : 0, i: Activity, unit: "%" }
             ].map((item, idx) => (
               <div key={idx} className="surface-card p-5 border-border/30 bg-background hover:border-foreground/20 transition-colors group">
                 <div className="flex items-center gap-2 mb-3">
                    <item.i className="size-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{item.l}</span>
                 </div>
                 <div className="text-xl font-mono font-medium tabular-nums leading-tight">
                    {item.isMoney ? formatCurrency(item.v as number, currency.code) : item.v}
                    {item.unit && <span className="text-[10px] ml-1 opacity-40 uppercase">{item.unit}</span>}
                 </div>
               </div>
             ))}
          </div>

          {/* Expert Insights */}
          <div className="grid md:grid-cols-2 gap-6 pt-2">
             <div className="surface-card p-8 border-border/30 space-y-4 bg-secondary/5 relative overflow-hidden group">
                <Landmark className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
                <div className="flex items-center gap-2 relative z-10">
                  <History className="size-3 text-health" /> Safe Withdrawal Rate
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                  The "4% Rule" suggests that withdrawing 4% of your total corpus annually historically provides a 30-year runway in diverse markets.
                </p>
             </div>
             <div className="surface-card p-8 border-border/30 space-y-4 bg-secondary/5 relative overflow-hidden group">
                <Globe className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
                <div className="flex items-center gap-2 relative z-10">
                  <TrendingUp className="size-3 text-health" /> Real Return Strategy
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                  Adjust your expected return for a 2-3% inflation buffer to ensure your target retirement corpus maintains future purchasing power.
                </p>
             </div>
          </div>

        </div>
      </div>
    </CalculatorPage>
  );
};

export default RetirementFireCalculator;
