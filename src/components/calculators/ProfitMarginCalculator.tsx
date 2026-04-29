"use client";

import { useMemo, useState } from "react";
import { 
  Share, CheckCircle2, TrendingUp, Info, Wallet, BarChart3, 
  PieChart, ArrowUpRight, ArrowDownRight, Tag, Landmark, 
  ShoppingCart, Activity, Target, Zap, Globe, History, 
  Ruler, Gauge, Sparkles, Copy, LayoutDashboard, Calculator,
  Settings2, Banknote, ShieldCheck, ChevronRight, Scale
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

const calc = calculatorBySlug("profit-margin-calculator");

const ProfitMarginCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;
  const { currency } = useCurrency();
  const [cost, setCost] = useUrlState<number>("c", 60);
  const [revenue, setRevenue] = useUrlState<number>("rv", 100);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const profit = revenue - cost;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    const markup = cost > 0 ? (profit / cost) * 100 : 0;
    
    let status: "optimal" | "warning" | "critical" = "optimal";
    let insight = "";
    if (margin > 50) {
      status = "optimal";
      insight = "Great Profit! Your margins suggest you have a very valuable product or service.";
    } else if (margin > 25) {
      status = "optimal";
      insight = "Healthy Profit: You are in a great range for growing and reinvesting in your business.";
    } else if (margin > 10) {
      status = "warning";
      insight = "Low Profit: You'll need high sales volume to make this work. Look for ways to lower your costs.";
    } else if (margin > 0) {
      status = "critical";
      insight = "Warning: Very Low Profit. Your pricing is risky. Small cost increases could make you lose money.";
    } else {
      status = "critical";
      insight = "Losing Money: You are currently spending more than you are making. You need to raise your prices immediately.";
    }

    return { profit, margin, markup, insight, status };
  }, [cost, revenue]);

  const handleCopy = () => {
    let text = `Unit Economics: ${result.margin.toFixed(1)}% Margin | ${formatCurrency(result.profit, currency.code)} Profit. Audit at ${SITE_DOMAIN}`;
    navigator.clipboard.writeText(text);
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
              <h3 className="text-sm font-bold tracking-tight">Profit Settings</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Product Details</p>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Cost Input */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Cost to Make/Buy</Label>
                  <span className="text-[10px] font-bold text-destructive">{formatCurrency(cost, currency.code)}</span>
                </div>
                <div className="relative group">
                  <Input 
                    type="number" 
                    value={cost} 
                    onChange={(e) => setCost(Number(e.target.value) || 0)} 
                    className="h-12 bg-background border-border/60 focus:border-foreground/20 transition-all font-bold text-lg rounded-xl pr-12 shadow-sm"
                  />
                  <ShoppingCart className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30" />
                </div>
                <Slider value={[cost]} min={1} max={10000} step={1} onValueChange={([v]) => setCost(v)} />
              </div>

              {/* Revenue Input */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Retail Selling Price</Label>
                  <span className="text-[10px] font-bold text-finance">{formatCurrency(revenue, currency.code)}</span>
                </div>
                <div className="relative group">
                  <Input 
                    type="number" 
                    value={revenue} 
                    onChange={(e) => setRevenue(Number(e.target.value) || 0)} 
                    className="h-12 bg-background border-border/60 focus:border-foreground/20 transition-all font-bold text-lg rounded-xl pr-12 shadow-sm"
                  />
                  <Banknote className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30" />
                </div>
                <Slider value={[revenue]} min={1} max={20000} step={1} onValueChange={([v]) => setRevenue(v)} />
              </div>
            </div>
          </div>

          {/* Insight Panel */}
          <div className={cn(
            "surface-card p-6 border-border/30 relative overflow-hidden group",
            result.status === "critical" ? "bg-destructive/5 text-destructive" : result.status === "warning" ? "bg-amber-500/5 text-amber-500" : "bg-health/5 text-health"
          )}>
            <ShieldCheck className="absolute -bottom-4 -right-4 size-20 opacity-5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1">
                {result.margin >= 25 ? <TrendingUp className="size-5" /> : <ArrowDownRight className="size-5" />}
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider">What This Means</h4>
                <p className="text-xs opacity-80 leading-relaxed font-medium">
                  {result.insight}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Executive Summary */}
          <div className="surface-card p-8 md:p-10 space-y-8 bg-background border-border/60 shadow-md relative overflow-hidden group">
            <Calculator className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />
            
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Total Profit Margin</span>
                  <div className="text-6xl md:text-7xl font-mono font-medium tracking-tighter tabular-nums">
                    {result.margin.toFixed(1)}%
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
              
              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-border/40">
                <div className="flex items-center gap-1.5 px-4 py-1.5 bg-foreground text-background rounded-lg text-[10px] font-bold uppercase tracking-tight shadow-md">
                  <Wallet className="size-3" />
                  <span className={cn(result.profit >= 0 ? "" : "text-destructive")}>Unit Profit: {formatCurrency(result.profit, currency.code)}</span>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
                  Profit Markup: {result.markup.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Economic Distribution */}
          <div className="surface-card p-10 bg-secondary/5 border-border/30 relative overflow-hidden group shadow-sm">
             <Sparkles className="absolute -top-4 -right-4 size-48 text-muted-foreground/5 opacity-40 group-hover:rotate-12 transition-transform duration-1000" />
             <div className="flex items-center gap-3 mb-10 relative z-10">
               <div className="size-8 rounded-lg bg-foreground text-background flex items-center justify-center shadow-lg">
                 <LayoutDashboard className="size-4" />
               </div>
               <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Where the Money Goes</h3>
            </div>
            
            <div className="space-y-8 relative z-10">
               <div className="flex h-16 rounded-2xl overflow-hidden shadow-sm border border-border/50">
                 <div 
                   className="bg-secondary flex flex-col items-center justify-center transition-all duration-1000 ease-out border-r border-border/20 group/cogs"
                   style={{ width: `${Math.max(5, (cost / (revenue || 1)) * 100)}%` }}
                 >
                   <span className="text-[8px] font-bold uppercase text-muted-foreground opacity-60">COSTS</span>
                   <span className="text-[11px] font-mono font-bold text-muted-foreground">{((cost / (revenue || 1)) * 100).toFixed(0)}%</span>
                 </div>
                 <div 
                   className={cn(
                     "flex flex-col items-center justify-center transition-all duration-1000 ease-out shadow-inner",
                     result.profit >= 0 ? "bg-health text-background" : "bg-destructive text-background"
                   )}
                   style={{ width: `${Math.max(5, (Math.abs(result.profit) / (revenue || 1)) * 100)}%` }}
                 >
                   <span className="text-[8px] font-bold uppercase opacity-60">{result.profit >= 0 ? "PROFIT" : "LOSS"}</span>
                   <span className="text-[11px] font-mono font-bold">{Math.abs(result.margin).toFixed(0)}%</span>
                 </div>
               </div>
               
               <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 px-2">
                  <div className="flex items-center gap-2"><div className="size-2 rounded-full bg-secondary" /> Production / Fulfillment</div>
                  <div className="flex items-center gap-2">
                    <div className={cn("size-2 rounded-full", result.profit >= 0 ? "bg-health" : "bg-destructive")} /> 
                    {result.profit >= 0 ? "Profit" : "Loss"}
                  </div>
               </div>
            </div>
          </div>

          {/* Stats Matrix */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { l: "Cost Ratio", v: (100 - result.margin).toFixed(1), i: Activity, unit: "%" },
               { l: "Units for $1000 Profit", v: (result.profit > 0 ? (1000 / result.profit).toFixed(0) : "∞"), i: Target, unit: "Units" },
               { l: "Business Health", v: result.profit > 0 ? "Healthy" : "Risky", i: Zap, unit: "" },
               { l: "Price Ratio", v: (revenue / (cost || 1)).toFixed(2), i: Ruler, unit: "x" }
             ].map((item, idx) => (
               <div key={idx} className="surface-card p-6 border-border/30 bg-background hover:border-foreground/20 transition-all group shadow-sm">
                 <div className="flex items-center gap-2 mb-3">
                    <item.i className="size-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{item.l}</span>
                 </div>
                 <div className="text-lg font-mono font-bold tabular-nums leading-tight">
                    {item.v}
                    {item.unit && <span className="text-[10px] ml-1 opacity-40 uppercase">{item.unit}</span>}
                 </div>
               </div>
             ))}
          </div>

          {/* Professional Insights */}
          <div className="grid md:grid-cols-2 gap-6 pt-4">
             <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group shadow-sm">
                <Landmark className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:-rotate-12 transition-transform duration-500" />
                <div className="flex items-center gap-3 relative z-10">
                  <Scale className="size-4 text-muted-foreground" />
                  <h4 className="text-[10px] font-bold uppercase tracking-wider">Taxes & Hidden Costs</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed relative z-10 font-medium">
                  Remember to set aside money for taxes, rent, and other monthly bills that aren't tied directly to making your product.
                </p>
             </div>
             <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group shadow-sm">
                <ShoppingCart className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:-rotate-12 transition-transform duration-500" />
                <div className="flex items-center gap-3 relative z-10">
                  <ShieldCheck className="size-4 text-muted-foreground" />
                  <h4 className="text-[10px] font-bold uppercase tracking-wider">Advertising Costs</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed relative z-10 font-medium">
                  To grow sustainably, you should try to keep the cost of finding new customers (advertising) below 30% of your profit on each sale.
                </p>
             </div>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
};

export default ProfitMarginCalculator;
