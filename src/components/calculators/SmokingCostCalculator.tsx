"use client";

import { useMemo, useState } from "react";
import { 
  Share, CheckCircle2, Cigarette, Info, TrendingUp, Wallet, 
  Clock, Activity, Heart, Zap, History, Landmark, Settings2, 
  Copy, LayoutDashboard, ChevronRight, Waves, Flame, Siren, 
  Gauge, Target, TrendingDown, Coins, Timer
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

const calc = calculatorBySlug("smoking-cost-calculator")!;

const SmokingCostCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const { currency } = useCurrency();
  const [perDay, setPerDay] = useUrlState<number>("pd", 10);
  const [pricePerPack, setPricePerPack] = useUrlState<number>("pc", 15);
  const [packSize, setPackSize] = useUrlState<number>("ps", 20);
  const [years, setYears] = useUrlState<number>("y", 5);
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const dailyCost = (perDay / packSize) * pricePerPack;
    const yearlyCost = dailyCost * 365;
    const totalCost = yearlyCost * years;
    const totalMinutesLost = perDay * 365 * years * 11;
    const daysLost = totalMinutesLost / (60 * 24);

    let insight = "";
    if (totalCost > 50000) insight = `Economic Variance: Your expenditure of ${formatCurrency(totalCost, currency.code)} represents a massive opportunity cost. If invested at 8%, this capital would likely exceed ${formatCurrency(totalCost * 2.5, currency.code)} today.`;
    else if (totalCost > 10000) insight = `Opportunity Cost: This habit has consumed the equivalent of a mid-range vehicle or several luxury international expeditions.`;
    else insight = `Vital Trajectory: Beyond the financial drain, the 11-minute life-loss per unit has already extracted ${daysLost.toFixed(0)} full days of your lifespan.`;

    return { yearlyCost, totalCost, daysLost, insight };
  }, [perDay, pricePerPack, packSize, years, currency]);

  const handleCopy = () => {
    let text = `Smoking Impact Analysis: ${formatCurrency(stats.totalCost, currency.code)} spent & ${formatNumber(stats.daysLost)} days of life lost over ${years} years. Data at ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!calc) return null;
  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        
        {/* Input Panel */}
        <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <div className="surface-card p-6 md:p-8 space-y-10 bg-secondary/5 border-border/40 relative overflow-hidden group">
            <Cigarette className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
            
            <div className="space-y-1 relative z-10">
              <h3 className="text-sm font-bold tracking-tight">Habit Parameters</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Consumption Profile</p>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Daily Count */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Cigarettes / Day</Label>
                  <span className="text-[10px] font-bold text-health">{perDay} Units</span>
                </div>
                <Slider value={[perDay]} min={1} max={60} step={1} onValueChange={([v]) => setPerDay(v)} />
                <Input type="number" value={perDay} onChange={(e) => setPerDay(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-medium rounded-lg shadow-sm" />
              </div>

              {/* Price & Size Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">Pack Price</Label>
                  <Input type="number" value={pricePerPack} onChange={(e) => setPricePerPack(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm" />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">Pack Size</Label>
                  <Input type="number" value={packSize} onChange={(e) => setPackSize(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm" />
                </div>
              </div>

              {/* Tenure */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Habit Tenure (Years)</Label>
                  <span className="text-[10px] font-bold text-health">{years} Years</span>
                </div>
                <Slider value={[years]} min={1} max={50} step={1} onValueChange={([v]) => setYears(v)} />
              </div>
            </div>
          </div>

          <div className="surface-card p-6 border-border/30 bg-destructive/5 relative overflow-hidden group">
            <Info className="absolute -bottom-4 -right-4 size-20 text-destructive/5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1 text-destructive">
                <Siren className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Vital Impact Analysis</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {stats.insight}
                </p>
              </div>
            </div>
          </div>

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
            <TrendingDown className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <TrendingDown className="size-3" />
                    Cumulative Financial Drain
                  </div>
                  <div className="text-5xl md:text-6xl font-mono font-bold tracking-tighter tabular-nums text-destructive">
                    {formatCurrency(stats.totalCost, currency.code)}
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
                    <Clock className="size-3 text-destructive" />
                    Life Expectancy Lost
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-destructive tabular-nums">
                    {formatNumber(stats.daysLost)} <span className="text-[10px] opacity-40 uppercase tracking-widest font-sans font-bold">Days</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Wallet className="size-3" />
                    Annual Cost
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                    {formatCurrency(stats.yearlyCost, currency.code)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Economic Opportunity Metrics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { l: "Monthly Cost", v: stats.yearlyCost / 12, i: Wallet },
                { l: "Total Volume", v: perDay * 365 * years, i: History, unit: "Cigs" },
                { l: "Pack Equivalents", v: (perDay * 365 * years) / packSize, i: Cigarette, unit: "Packs" },
                { l: "Years Lost", v: stats.daysLost / 365, i: Activity, unit: "Yrs" },
              ].map((item, idx) => (
                <div key={idx} className="surface-card p-6 border-border/30 bg-background hover:border-foreground/20 transition-all group">
                  <div className="text-[9px] uppercase font-bold text-muted-foreground mb-3 tracking-widest group-hover:text-foreground transition-colors">
                    {item.l}
                  </div>
                  <div className="text-2xl font-mono font-medium tracking-tight tabular-nums">
                    {typeof item.v === 'number' && item.l.includes('Cost') 
                      ? formatCurrency(item.v, currency.code) 
                      : (typeof item.v === 'number' ? formatNumber(Math.round(item.v)) : item.v)}
                    {item.unit && <span className="text-[10px] ml-1 opacity-40 font-sans uppercase">{item.unit}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recovery Benefits */}
          <div className="space-y-4">
             <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Cessation Recovery Roadmap</h4>
             <div className="surface-card p-0 overflow-hidden border-border/40">
                <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/20">
                   {[
                     { t: "20 Minutes", d: "Heart rate and blood pressure drop to normal levels.", i: Heart },
                     { t: "48 Hours", d: "Nerve endings regenerate; sense of smell and taste improve.", i: Zap },
                     { t: "10 Years", d: "Lung cancer death risk is cut by approximately 50%.", i: Target },
                   ].map((phase, i) => (
                     <div key={i} className="p-8 space-y-4 hover:bg-secondary/5 transition-colors group">
                        <div className="flex items-center gap-3">
                           <phase.i className="size-4 text-health" />
                           <span className="text-[10px] font-bold uppercase tracking-widest">{phase.t}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                           {phase.d}
                        </p>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Secondary Insights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { l: "Unit Loss", v: "11", i: Timer, unit: "Min" },
               { l: "Wealth Delta", v: "8.0", i: TrendingUp, unit: "%" },
               { l: "Tax Factor", v: "High", i: Landmark },
               { l: "Inflation", v: "3.2", i: Coins, unit: "%" }
             ].map((item, idx) => (
               <div key={idx} className="surface-card p-5 border-border/30 bg-background hover:border-foreground/20 transition-colors group">
                 <div className="flex items-center gap-2 mb-3">
                    <item.i className="size-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{item.l}</span>
                 </div>
                 <div className="text-lg font-mono font-medium tabular-nums leading-tight">
                    {item.v}
                    <span className="text-[10px] ml-1 opacity-40 uppercase">{item.unit}</span>
                 </div>
               </div>
             ))}
          </div>

        </div>
      </div>
    </CalculatorPage>
  );
};

export default SmokingCostCalculator;
