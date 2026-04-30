"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  PiggyBank, Share, CheckCircle2, TrendingUp, Wallet, ArrowUpRight,
  Info, History, Target, Activity, Zap, Globe, Landmark,
  Gauge, Ruler, Sparkles, LayoutDashboard, Copy, Settings2,
  TrendingDown, Banknote, Calendar, BarChart as BarChartIcon
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { calculatorBySlug } from "@/lib/calculators";
import { formatCurrency } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { useCurrency } from "@/context/CurrencyContext";
import { SITE_DOMAIN } from "@/lib/constants";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("compound-interest-calculator")!;

const CompoundInterestCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const { currency } = useCurrency();
  const [principal, setPrincipal] = useUrlState<number>("p", 10000);
  const [addition, setAddition] = useUrlState<number>("a", 500);
  const [years, setYears] = useUrlState<number>("y", 15);
  const [rate, setRate] = useUrlState<number>("r", 8);
  const [frequency, setFrequency] = useUrlState<number>("f", 12);
  const [copied, setCopied] = useState(false);

  const data = useMemo(() => {
    const points: { year: number; principal: number; interest: number; balance: number }[] = [];
    const r = rate / 100;
    const n = frequency;

    for (let y = 1; y <= years; y++) {
      const months = y * 12;
      let fvPrincipal = principal * Math.pow(1 + r / n, n * y);

      let fvAdditions = 0;
      if (addition > 0) {
        if (n === 12) {
          fvAdditions = addition * ((Math.pow(1 + r / 12, months) - 1) / (r / 12));
        } else {
          const effectiveAnnualRate = Math.pow(1 + r / n, n) - 1;
          const effectiveMonthlyRate = Math.pow(1 + effectiveAnnualRate, 1 / 12) - 1;
          fvAdditions = effectiveMonthlyRate > 0 ? addition * ((Math.pow(1 + effectiveMonthlyRate, months) - 1) / effectiveMonthlyRate) : addition * months;
        }
      }

      const finalBalance = fvPrincipal + fvAdditions;
      const finalPrincipal = principal + (addition * months);

      points.push({
        year: y,
        principal: finalPrincipal,
        interest: finalBalance - finalPrincipal,
        balance: finalBalance
      });
    }
    return points;
  }, [principal, addition, years, rate, frequency]);

  const last = data[data.length - 1] ?? { principal: 0, balance: 0, interest: 0 };

  const handleCopy = () => {
    const resultText = `Savings Goal: ${formatCurrency(last.balance, currency.code)} in ${years} years. Calculate yours at ${window.location.href}`;
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
                <h3 className="text-sm font-bold tracking-tight">Savings Settings</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Set Your Savings Goal</p>
              </div>

              <div className="space-y-8 relative z-10">
                {/* Initial Principal */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Initial Deposit</Label>
                    <span className="text-[10px] font-bold text-health">{formatCurrency(principal, currency.code)}</span>
                  </div>
                  <div className="relative group">
                    <Input
                      type="number"
                      value={principal}
                      onChange={(e) => setPrincipal(Number(e.target.value) || 0)}
                      className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm pr-12"
                    />
                    <Wallet className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                  </div>
                  <Slider aria-label="Initial Deposit" value={[principal]} min={0} max={250000} step={1000} onValueChange={([v]) => setPrincipal(v)} />
                </div>

                {/* Monthly Contribution */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Monthly Addition</Label>
                    <span className="text-[10px] font-bold text-health">{formatCurrency(addition, currency.code)}</span>
                  </div>
                  <div className="relative group">
                    <Input
                      type="number"
                      value={addition}
                      onChange={(e) => setAddition(Number(e.target.value) || 0)}
                      className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm pr-12"
                    />
                    <TrendingUp className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                  </div>
                  <Slider aria-label="Monthly Addition" value={[addition]} min={0} max={10000} step={100} onValueChange={([v]) => setAddition(v)} />
                </div>

                {/* APR and Years */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Annual Interest Rate (%)</Label>
                    <Input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Savings Years</Label>
                    <Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm" />
                  </div>
                </div>

                {/* Frequency */}
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">How often interest is added</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { l: "Monthly", v: 12 },
                      { l: "Quarterly", v: 4 },
                      { l: "Annual", v: 1 },
                      { l: "Daily", v: 365 },
                    ].map((f) => (
                      <button
                        key={f.v}
                        onClick={() => setFrequency(f.v)}
                        className={cn("py-2.5 px-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all border",
                          frequency === f.v
                            ? "bg-foreground text-background border-foreground shadow-md"
                            : "bg-background text-muted-foreground border-border hover:border-foreground/20 hover:text-foreground"
                        )}
                      >
                        {f.l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="surface-card p-6 border-border/30 bg-health/5 relative overflow-hidden group">
              <Sparkles className="absolute -bottom-4 -right-4 size-20 text-health/5 group-hover:rotate-12 transition-transform duration-700" />
              <div className="flex gap-4 items-start relative z-10">
                <div className="mt-1 text-health">
                  <Target className="size-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider">Savings Tip</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    In {years} years, your money will grow by {((last.interest / last.principal) * 100).toFixed(0)}% more than what you put in.
                    {last.interest > last.principal ? " Your interest is now earning more than your own deposits!" : " You're building a strong foundation for your future wealth."}
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
                      Estimated Total Savings
                    </div>
                    <div className="text-5xl md:text-6xl font-mono font-bold tracking-tighter tabular-nums text-health">
                      {formatCurrency(last.balance, currency.code)}
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
                      Total Interest Earned
                    </div>
                    <div className="text-3xl md:text-4xl font-mono font-bold text-health tabular-nums">
                      {formatCurrency(last.interest, currency.code)}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      <Banknote className="size-3" />
                      Total Invested
                    </div>
                    <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                      {formatCurrency(last.principal, currency.code)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Breakdown */}
            <div className="surface-card p-10 bg-secondary/5 border-border/30 relative overflow-hidden group">
              <BarChartIcon className="absolute -bottom-4 -right-4 size-24 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
              <div className="flex items-center justify-between mb-12 relative z-10">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">How Your Money Grows</h4>
                <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">{years} Year Projection</span>
              </div>

              <div className="h-[320px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--foreground))" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="hsl(var(--foreground))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.1} />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, opacity: 0.4 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, opacity: 0.4 }} tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
                    <Tooltip
                      formatter={(v: any) => formatCurrency(v, currency.code)}
                      contentStyle={{ borderRadius: "16px", border: "none", backgroundColor: "hsl(var(--background))", boxShadow: "0 20px 40px -12px rgb(0 0 0 / 0.3)" }}
                    />
                    <Area type="monotone" dataKey="principal" stackId="1" stroke="hsl(var(--muted-foreground)/0.2)" fill="hsl(var(--muted-foreground)/0.05)" strokeWidth={1} />
                    <Area type="monotone" dataKey="balance" stackId="2" stroke="hsl(var(--foreground))" fill="url(#colorBalance)" strokeWidth={4} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-8 mt-8 relative z-10 text-[9px] font-bold uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2"><div className="size-1.5 rounded-full bg-muted-foreground/30" /> Money Put In</div>
                <div className="flex items-center gap-2"><div className="size-1.5 rounded-full bg-foreground" /> Total Value</div>
              </div>
            </div>

            {/* Performance Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { l: "Growth Multiplier", v: (last.balance / last.principal).toFixed(2), i: Activity, unit: "x" },
                { l: "Total Months", v: years * 12, i: History, unit: "mth" },
                { l: "Interest Share", v: (last.interest / last.balance * 100).toFixed(1), i: Target, unit: "%" },
                { l: "Avg Interest/Month", v: (last.interest / (years * 12)).toFixed(0), i: Zap, unit: currency.code }
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
                <PiggyBank className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
                <div className="flex items-center gap-2 relative z-10">
                  <Banknote className="size-3 text-health" /> Saving Regularly
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                  Saving a small amount every month builds a strong foundation and helps your money grow much faster over time through the power of compounding.
                </p>
              </div>
              <div className="surface-card p-8 border-border/30 space-y-4 bg-secondary/5 relative overflow-hidden group">
                <History className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
                <div className="flex items-center gap-2 relative z-10">
                  <TrendingUp className="size-3 text-health" /> The Power of Time
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                  Most of your interest is earned in the last few years of your savings plan. Staying patient is the ultimate way to grow your wealth.
                </p>
              </div>
            </div>

          </div>
        </div>
      </CalculatorPage>
    );
  };

export default CompoundInterestCalculator;
