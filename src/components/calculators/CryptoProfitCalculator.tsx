"use client";

import { useMemo, useState } from "react";
import {
  Share, CheckCircle2, Coins, TrendingUp, TrendingDown, ShieldCheck, Rocket,
  Settings2, Activity, Target, Zap, History, Sparkles, Banknote, Receipt, Copy
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { HowToGuide } from "@/components/HowToGuide";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import { SeoBlock } from "@/components/SeoBlock";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { calculatorBySlug } from "@/lib/calculators";
import { formatCurrency } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { useCurrency } from "@/context/CurrencyContext";
import { SITE_DOMAIN } from "@/lib/constants";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("crypto-investment-profit-calculator")!;

const CryptoProfitCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const { currency } = useCurrency();
  const [investment, setInvestment] = useUrlState<number>("iv", 1000);
  const [buyPrice, setBuyPrice] = useUrlState<number>("bp", 50000);
  const [sellPrice, setSellPrice] = useUrlState<number>("sp", 60000);
  const [fee, setFee] = useUrlState<number>("f", 0.1);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const coins = investment / (buyPrice || 1);
    const initialFee = (investment * fee) / 100;
    const grossSell = coins * sellPrice;
    const exitFee = (grossSell * fee) / 100;

    const finalValue = grossSell - exitFee - initialFee;
    const profit = finalValue - investment;
    const roi = (profit / (investment || 1)) * 100;

    let insight = "";
    let icon = TrendingUp;
    if (roi > 100) {
      insight = "Over 2x Profit: You've more than doubled your money! Consider taking out your initial investment so the rest is risk-free.";
      icon = Rocket;
    } else if (roi > 20) {
      insight = "Great Trade: You're doing very well. Consider setting a stop-loss to protect your profits.";
      icon = ShieldCheck;
    } else if (roi < -50) {
      insight = "Heavy Loss: You're down over 50%. Take a step back and decide if you still believe in this project long-term.";
      icon = ShieldCheck;
    } else if (roi < 0) {
      insight = "Down on Investment: You're currently at a loss. If you still believe in the project, this could be a chance to buy more at a lower price.";
      icon = TrendingUp;
    } else {
      insight = "Breaking Even: You're close to where you started. Right now, fees are your main cost.";
      icon = TrendingUp;
    }

    return { coins, finalValue, profit, roi, totalFees: initialFee + exitFee, insight, icon };
  }, [investment, buyPrice, sellPrice, fee]);

  const handleCopy = () => {
    const text = `Crypto Trade: ${result.roi.toFixed(1)}% ROI | ${formatCurrency(result.profit, currency.code)} Profit. Track your portfolio at ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const StrategyIcon = result.icon;

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8 order-1 lg:order-2">

          {/* Executive Summary */}
          <div className="surface-card p-8 md:p-10 space-y-10 bg-background border-border/60 shadow-md relative overflow-hidden group">
            <Coins className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <TrendingUp className="size-3" />
                    Return on Investment
                  </div>
                  <div className={cn(
                    "text-5xl md:text-6xl font-mono font-bold tracking-tighter tabular-nums",
                    result.roi >= 0 ? "text-health" : "text-destructive"
                  )}>
                    {result.roi >= 0 ? "+" : ""}{result.roi.toFixed(1)}%
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
                    <Banknote className="size-3 text-health" />
                    Net Profit
                  </div>
                  <div className={cn(
                    "text-3xl md:text-4xl font-mono font-bold tabular-nums",
                    result.profit >= 0 ? "text-health" : "text-destructive"
                  )}>
                    {formatCurrency(result.profit, currency.code)}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Receipt className="size-3" />
                    Total Value
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                    {formatCurrency(result.finalValue, currency.code)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio Strategy */}
          <div className="surface-card p-8 bg-secondary/5 border-border/60 shadow-sm flex gap-6 items-start relative overflow-hidden group">
            <div className="shrink-0 p-3 rounded-2xl bg-background border border-border/50 shadow-sm text-business">
              <StrategyIcon className="size-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Trading Plan</h4>
              <p className="text-base font-bold leading-relaxed">{result.insight}</p>
            </div>
          </div>

          {/* Precision Analytics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { l: "Coins You Own", v: result.coins.toFixed(4), i: Coins, unit: "Unit" },
              { l: "Growth Multiplier", v: (result.finalValue / investment).toFixed(2), i: Activity, unit: "x" },
              { l: "Break-Even Price", v: (buyPrice * (1 + (fee * 2) / 100)).toFixed(2), i: Target, unit: currency.code },
              { l: "Status", v: result.roi >= 0 ? "PROFIT" : "LOSS", i: Zap, unit: "" }
            ].map((item, idx) => (
              <div key={idx} className="surface-card p-6 border-border/30 bg-background hover:border-business/20 transition-all group shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <item.i className="size-3 text-muted-foreground group-hover:text-business transition-colors" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">{item.l}</span>
                </div>
                <div className="text-xl font-mono font-bold tabular-nums leading-tight">
                  {item.v}
                  {item.unit && <span className="text-[10px] ml-1 opacity-40 uppercase">{item.unit}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Take-Profit Ladders */}
          <div className="surface-card p-8 bg-background border-border/60 shadow-sm space-y-8 relative overflow-hidden group">
            <History className="absolute -bottom-10 -right-10 size-48 text-muted-foreground/5 rotate-12 transition-transform group-hover:rotate-0 duration-1000" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <Rocket className="size-5 text-muted-foreground/60" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest">Goal Prices</h3>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-40 font-mono">Selling Plan</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 relative z-10">
              {[25, 50, 100, 200].map(p => {
                const price = buyPrice * (1 + p / 100);
                const gain = investment * (p / 100);
                return (
                  <div key={p} className="p-5 rounded-2xl bg-secondary/30 border border-border/50 hover:border-business/40 transition-all group/ladder">
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase">Target +{p}%</div>
                      <div className="text-[10px] font-mono font-bold text-health">Gain: {formatCurrency(gain, currency.code)}</div>
                    </div>
                    <div className="text-2xl font-mono font-bold tracking-tight group-hover/ladder:text-business transition-colors">
                      {formatCurrency(price, currency.code)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Trade Parameters */}
        <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <div className="surface-card p-6 md:p-8 space-y-10 bg-secondary/5 border-border/40 relative overflow-hidden group shadow-sm">
            <Settings2 className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />

            <div className="space-y-1 relative z-10">
              <h3 className="text-sm font-bold tracking-tight">Trade Details</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Your Setup</p>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Capital */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Initial Investment</Label>
                  <span className="text-xs font-mono font-medium">{formatCurrency(investment, currency.code)}</span>
                </div>
                <div className="relative group">
                  <Input
                    type="number"
                    value={investment}
                    onChange={(e) => setInvestment(Number(e.target.value) || 0)}
                    className="h-11 bg-background border-border/60 focus:border-foreground/20 transition-all font-bold text-base rounded-lg shadow-sm"
                  />
                  <Coins className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground opacity-20" />
                </div>
              </div>

              {/* Entry/Exit Price */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Entry Price</Label>
                  <Input
                    type="number"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(Number(e.target.value) || 0)}
                    className="h-11 bg-background/50 border-border/40 font-bold focus:border-foreground/20 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Exit Price</Label>
                  <Input
                    type="number"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(Number(e.target.value) || 0)}
                    className="h-11 bg-background/50 border-border/40 font-bold focus:border-foreground/20 rounded-xl"
                  />
                </div>
              </div>

              {/* Fees */}
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Trading Fee (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={fee}
                  onChange={(e) => setFee(Number(e.target.value) || 0)}
                  className="h-11 bg-background border-border/60 font-bold text-lg rounded-xl shadow-sm"
                />
              </div>

              <button
                onClick={handleCopy}
                className="w-full h-11 rounded-xl bg-background border border-border/60 hover:bg-foreground hover:text-background transition-all font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm"
              >
                {copied ? <CheckCircle2 className="size-3" /> : <Copy className="size-3" />}
                {copied ? "Result Copied" : "Copy Analysis"}
              </button>
            </div>
          </div>

          <div className="surface-card p-6 border-border/30 bg-business/5 text-business relative overflow-hidden group shadow-sm">
            <Sparkles className="absolute -bottom-4 -right-4 size-20 opacity-5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1">
                <ShieldCheck className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-business/80">Fee Check</h4>
                <p className="text-xs leading-relaxed font-medium">
                  Your total fees (buying and selling) are {formatCurrency(result.totalFees, currency.code)}. Make sure your profit covers this!
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

export default CryptoProfitCalculator;
