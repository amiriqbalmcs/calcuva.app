"use client";

import { useMemo, useState } from "react";
import { Share, CheckCircle2, Coins, TrendingUp, ShieldCheck, Rocket } from "lucide-react";
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
      insight = "House Money Status: You have exceeded a 2x return. This is an elite gain. A professional move here is to withdraw 50% (initial capital) and let the rest ride risk-free.";
      icon = Rocket;
    } else if (roi > 20) {
      insight = "Momentum Trade: You are significantly outperforming traditional indices. Tighten your stop-loss to 15% to lock in profit.";
      icon = ShieldCheck;
    } else if (roi < -50) {
      insight = "Systemic Risk: You are down over 50%. In crypto, assets often fail to recover from this drawdown. Re-evaluate if the project fundamentals still hold.";
      icon = ShieldCheck;
    } else if (roi < 0) {
      insight = "Sideways Flux: You are in a drawdown. If you believe in the long-term thesis, this is often a 'DCA' (Dollar Cost Average) opportunity.";
      icon = TrendingUp;
    } else {
      insight = "Transaction Equilibrium: You are near break-even. Exchange fees are currently the primary drain on your capital.";
      icon = TrendingUp;
    }

    return { coins, finalValue, profit, roi, totalFees: initialFee + exitFee, insight, icon };
  }, [investment, buyPrice, sellPrice, fee]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ExitIcon = result.icon;

  return (
    <CalculatorPage
      calc={calc}
      guideHtml={guideHtml}
      faqs={faqs}
      relatedArticles={relatedArticles}
      seoContent={<SeoBlock title="Digital Asset ROI Forecasting" intro="Calculate real-world crypto gains after exchange fees and network costs." />}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 surface-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Trade Parameters</h3>
            <button onClick={handleShare} className="p-1 px-2 rounded-md bg-secondary text-[10px] font-bold text-muted-foreground hover:bg-business hover:text-white transition flex items-center gap-1 font-mono">
              {copied ? <CheckCircle2 className="size-3" /> : <Share className="size-3" />}
              {copied ? "COPIED" : "SHARE"}
            </button>
          </div>

          <div className="space-y-4 pt-2">
            <div><div className="flex justify-between mb-2"><Label>Capital Contribution</Label><span className="font-mono text-xs font-bold">{formatCurrency(investment, currency)}</span></div>
              <Input type="number" value={investment} onChange={(e) => setInvestment(Number(e.target.value) || 0)} className="text-lg font-bold" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Entry Price</Label><Input type="number" value={buyPrice} onChange={(e) => setBuyPrice(Number(e.target.value) || 0)} className="mt-2" /></div>
              <div><Label>Exit Price</Label><Input type="number" value={sellPrice} onChange={(e) => setSellPrice(Number(e.target.value) || 0)} className="mt-2" /></div>
            </div>
            <div><Label>Brokerage Fee (%)</Label><Input type="number" value={fee} onChange={(e) => setFee(Number(e.target.value) || 0)} className="mt-2" /></div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <ResultGrid cols={2}>
            <ResultStat label="Final Payout (Net)" value={formatCurrency(result.finalValue, currency)} accent className={result.profit >= 0 ? "bg-health text-white border-health" : "bg-destructive text-white border-destructive"} />
            <ResultStat label="Total Profit" value={formatCurrency(result.profit, currency)} sub={result.profit >= 0 ? "Realized Gain" : "Floating Loss"} />
          </ResultGrid>
          
          <div className={cn("p-5 rounded-xl flex gap-4 items-start border-l-4", 
            result.roi > 0 ? "bg-health-soft border-health text-health" : "bg-destructive-soft border-destructive text-destructive"
          )}>
            <div className="shrink-0 mt-0.5"><ExitIcon className="size-5" /></div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Portfolio Strategy</h4>
              <p className="text-sm opacity-90 leading-relaxed font-medium">{result.insight}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
             <div className="surface-card p-5">
                <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">ROI</div>
                <div className={cn("text-lg font-bold", result.roi >= 0 ? "text-health" : "text-destructive")}>{result.roi.toFixed(1)}%</div>
             </div>
             <div className="surface-card p-5">
                <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Coin Vol.</div>
                <div className="text-lg font-bold truncate">{result.coins.toFixed(4)}</div>
             </div>
             <div className="surface-card p-5">
                <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Fees</div>
                <div className="text-lg font-bold text-muted-foreground">{formatCurrency(result.totalFees, currency)}</div>
             </div>
          </div>

          <div className="surface-card p-6">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono mb-4">Take-Profit Ladders</h3>
            <div className="space-y-3">
               {[25, 50, 100, 200].map(p => {
                 const price = buyPrice * (1 + p/100);
                 const gain = investment * (p/100);
                 return (
                   <div key={p} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50">
                      <div className="text-xs font-bold text-muted-foreground">+{p}% TARGET</div>
                      <div className="text-sm font-mono font-bold text-health">{formatCurrency(price, currency)}</div>
                      <div className="text-[10px] text-muted-foreground font-semibold">PROFIT: {formatCurrency(gain, currency)}</div>
                   </div>
                 );
               })}
            </div>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
};

export default CryptoProfitCalculator;
