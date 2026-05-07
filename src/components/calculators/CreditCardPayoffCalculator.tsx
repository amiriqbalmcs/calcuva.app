"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  Share, CheckCircle2, CreditCard, Info, RefreshCcw, DollarSign, Calendar,
  Percent, TrendingDown, History, Target, Activity, Zap, Globe, Landmark,
  Gauge, Ruler, Sparkles, LayoutDashboard, Wallet, ArrowUpRight, Copy, Settings2,
  ShieldCheck, ChevronRight, Banknote
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { HowToGuide } from "@/components/HowToGuide";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { calculatorBySlug } from "@/lib/calculators";
import { formatCurrency, formatNumber } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { useCurrency } from "@/context/CurrencyContext";
import { SITE_DOMAIN } from "@/lib/constants";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("credit-card-payoff-calculator")!;

const CreditCardPayoffCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const { currency } = useCurrency();
  const [balance, setBalance] = useUrlState<number>("b", 5000);
  const [rate, setRate] = useUrlState<number>("r", 18.9);
  const [payment, setPayment] = useUrlState<number>("p", 250);
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    const interestCharge = balance * monthlyRate;

    if (payment <= interestCharge && balance > 0) {
      return { months: Infinity, totalInterest: Infinity, totalPaid: Infinity, chartData: [], isDangerous: true };
    }

    let currentBalance = balance;
    let months = 0;
    let totalInterest = 0;
    const chartData = [];

    while (currentBalance > 0 && months < 600) {
      const charge = currentBalance * monthlyRate;
      totalInterest += charge;
      currentBalance = currentBalance + charge - payment;
      months++;

      if (months % 6 === 0 || currentBalance <= 0) {
        chartData.push({ month: months, balance: Math.max(0, currentBalance) });
      }
    }

    return { months, totalInterest, totalPaid: balance + totalInterest, chartData, isDangerous: false };
  }, [balance, rate, payment]);

  const years = Math.floor(results.months / 12);
  const remainingMonths = results.months % 12;

  const handleCopy = () => {
    let text = `Debt Projection: Clearing ${formatCurrency(balance, currency.code)} in ${results.months} months. Plan your payoff at ${window.location.href}`;
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

          {/* Executive Summary */}
          <div className="surface-card p-8 md:p-10 space-y-10 bg-background border-border/60 shadow-md relative overflow-hidden group">
            <TrendingDown className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Calendar className="size-3" />
                    Timeline to Zero Balance
                  </div>
                  <div className={cn("text-5xl md:text-6xl font-mono font-bold tracking-tighter tabular-nums", results.isDangerous && "text-muted-foreground/40")}>
                    {results.isDangerous ? "∞" : results.months < 12 ? `${results.months} MTH` : `${years}Y ${remainingMonths}M`}
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
                    <Zap className="size-3 text-destructive" />
                    Total Interest Paid
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-destructive tabular-nums">
                    {results.isDangerous ? "Infinite" : formatCurrency(results.totalInterest, currency.code)}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Banknote className="size-3" />
                    Total Payout
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                    {results.isDangerous ? "Infinite" : formatCurrency(results.totalPaid, currency.code)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!results.isDangerous && (
            <>
              {/* Liquidation Curve */}
              <div className="surface-card p-10 bg-secondary/5 border-border/30 relative overflow-hidden group shadow-sm">
                <LayoutDashboard className="absolute -top-4 -right-4 size-48 text-muted-foreground/5 opacity-40 group-hover:rotate-12 transition-transform duration-1000" />
                <div className="flex items-center justify-between mb-12 relative z-10">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <History className="size-3" /> Liability Liquidation Trajectory
                  </h4>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">{results.months} Month Projection</span>
                </div>

                <div className="h-[320px] w-full relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={results.chartData}>
                      <defs>
                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--foreground))" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="hsl(var(--foreground))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.1} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, opacity: 0.4 }} tickFormatter={(v) => `M${v}`} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, opacity: 0.4 }} tickFormatter={(v) => formatNumber(v)} />
                      <Tooltip
                        cursor={{ stroke: 'hsl(var(--foreground))', strokeWidth: 1, strokeDasharray: '4 4' }}
                        formatter={(v: any) => [formatCurrency(v, currency.code), "Balance"]}
                        labelFormatter={(l) => `Timeline: Month ${l}`}
                        contentStyle={{ borderRadius: "16px", border: "none", backgroundColor: "hsl(var(--background))", boxShadow: "0 20px 40px -12px rgb(0 0 0 / 0.3)" }}
                      />
                      <Area type="monotone" dataKey="balance" stroke="hsl(var(--foreground))" fillOpacity={1} fill="url(#colorBalance)" strokeWidth={4} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center mt-8 relative z-10">
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
                    <div className="size-1.5 rounded-full bg-foreground/20" /> principal depletion vector
                  </div>
                </div>
              </div>

              {/* Performance Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { l: "Leverage Index", v: (results.totalPaid / balance).toFixed(2), i: Activity, unit: "x" },
                  { l: "Interest Weight", v: ((results.totalInterest / results.totalPaid) * 100).toFixed(1), i: Target, unit: "%" },
                  { l: "Timeline", v: results.months, i: History, unit: "mths" },
                  { l: "Daily Carry", v: ((balance * (rate / 100 / 365))).toFixed(2), i: Zap, unit: currency.code }
                ].map((item, idx) => (
                  <div key={idx} className="surface-card p-6 border-border/30 bg-background hover:border-foreground/20 transition-all group shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <item.i className="size-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">{item.l}</span>
                    </div>
                    <div className="text-lg font-mono font-bold tabular-nums leading-tight">
                      {item.v}
                      {item.unit && <span className="text-[10px] ml-1 opacity-40 uppercase">{item.unit}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Expert Contexts */}
          <div className="grid md:grid-cols-2 gap-6 pt-2">
            <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group shadow-sm">
              <Landmark className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:-rotate-12 transition-transform duration-500" />
              <div className="flex items-center gap-3 relative z-10">
                <Sparkles className="size-4 text-muted-foreground" />
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Avalanche Method</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed relative z-10 font-medium">
                Prioritize paying off the balance with the highest interest rate first. This protocol mathematically minimizes the total interest volume paid over the liability lifecycle.
              </p>
            </div>
            <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group shadow-sm">
              <RefreshCcw className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:-rotate-12 transition-transform duration-500" />
              <div className="flex items-center gap-3 relative z-10">
                <TrendingDown className="size-4 text-muted-foreground" />
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Balance Transfers</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed relative z-10 font-medium">
                Moving a high-APR balance to a 0% introductory card can save thousands in interest, provided the principal is liquidated within the promotional buffer.
              </p>
            </div>
          </div>

        </div>

        {/* Input Panel */}
        <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <div className="surface-card p-6 md:p-8 space-y-10 bg-secondary/5 border-border/40 relative overflow-hidden group">
            <Settings2 className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />

            <div className="space-y-1 relative z-10">
              <h3 className="text-sm font-bold tracking-tight">Debt Architecture</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Liability Configuration</p>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Balance */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Balance</Label>
                  <span className="text-[10px] font-bold text-finance">{formatCurrency(balance, currency.code)}</span>
                </div>
                <div className="relative group">
                  <Input
                    type="number"
                    value={balance}
                    onChange={(e) => setBalance(Number(e.target.value) || 0)}
                    className="h-12 bg-background border-border/60 focus:border-foreground/20 transition-all font-bold text-lg rounded-xl pr-12 shadow-sm"
                  />
                  <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30" />
                </div>
                <Slider value={[balance]} min={100} max={50000} step={100} onValueChange={([v]) => setBalance(v)} />
              </div>

              {/* Rate */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">APR (%)</Label>
                  <span className="text-[10px] font-bold text-destructive">{rate}%</span>
                </div>
                <div className="relative group">
                  <Input
                    type="number"
                    value={rate}
                    step="0.1"
                    onChange={(e) => setRate(Number(e.target.value) || 0)}
                    className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm pr-12"
                  />
                  <Percent className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30" />
                </div>
                <Slider value={[rate]} min={0} max={40} step={0.1} onValueChange={([v]) => setRate(v)} />
              </div>

              {/* Monthly Payment */}
              <div className="space-y-4 pt-2 border-t border-border/40">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Monthly Payment</Label>
                  <span className="text-[10px] font-bold text-finance">{formatCurrency(payment, currency.code)}</span>
                </div>
                <div className="relative group">
                  <Input
                    type="number"
                    value={payment}
                    onChange={(e) => setPayment(Number(e.target.value) || 0)}
                    className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm pr-12"
                  />
                  <Wallet className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30" />
                </div>
                <Slider value={[payment]} min={50} max={5000} step={10} onValueChange={([v]) => setPayment(v)} />
              </div>
            </div>
          </div>

          <div className={cn(
            "surface-card p-6 border-border/30 relative overflow-hidden group",
            results.isDangerous ? "bg-destructive/5 text-destructive" : "bg-health/5 text-health"
          )}>
            <ShieldCheck className="absolute -bottom-4 -right-4 size-20 opacity-5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1">
                <Activity className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Payoff Strategy</h4>
                <p className="text-xs opacity-80 leading-relaxed font-medium">
                  {results.isDangerous
                    ? "Negative Amortization: Your payment does not cover the interest. This debt will grow indefinitely unless payment is increased."
                    : results.totalInterest > balance * 0.5
                      ? "High Interest Burden: Your total interest is over 50% of the balance. Consider increasing payments or consolidating."
                      : "Aggressive Reduction: Your current payment strategy ensures a rapid and efficient principal liquidation."}
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

export default CreditCardPayoffCalculator;
