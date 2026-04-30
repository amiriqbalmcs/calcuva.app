"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { 
  Share, CheckCircle2, TrendingDown, Info, Landmark, Calculator, 
  Receipt, TrendingUp, Wallet, ArrowUpRight, History, Target, 
  Activity, Zap, Globe, Ruler, Gauge, Sparkles, LayoutDashboard,
  Settings2, Copy, Banknote, BarChart as BarChartIcon
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { calculatorBySlug } from "@/lib/calculators";
import { formatCurrency, formatNumber } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { useCurrency } from "@/context/CurrencyContext";
import { SITE_DOMAIN } from "@/lib/constants";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("inflation-calculator")!;

const InflationCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const { currency } = useCurrency();
  const [amount, setAmount] = useUrlState<number>("iv", 10000);
  const [rate, setRate] = useUrlState<number>("r", 5);
  const [years, setYears] = useUrlState<number>("y", 15);
  const [copied, setCopied] = useState(false);

  const data = useMemo(() => {
    const points = [];
    const r = rate / 100;
    for (let i = 0; i <= years; i++) {
      const value = amount * Math.pow(1 + r, i);
      points.push({ year: i, value });
    }
    return points;
  }, [amount, rate, years]);

  const last = data[data.length - 1].value;
  const multiplier = last / (amount || 1);
  const cumulative = (multiplier - 1) * 100;

  const resultInfo = useMemo(() => {
    const purchasingPower = amount / (multiplier || 1);
    let insight = "";
    if (cumulative > 100) insight = "High Inflation: Your money will buy only half as much as it does now. You'll need to earn more or invest wisely to keep your current way of life.";
    else if (cumulative > 40) insight = "Significant Drop: Your money will lose more than 40% of its value. Standard savings accounts might not be enough to keep up with rising prices.";
    else insight = "Slow Drop: Prices are rising slowly, which is normal. A basic savings or investment plan should help you stay ahead of inflation.";

    return { purchasingPower, insight };
  }, [multiplier, amount, cumulative]);

  const handleCopy = () => {
    const resultText = `Inflation Check: In ${years} years, ${formatCurrency(amount, currency.code)} will only buy what ${formatCurrency(resultInfo.purchasingPower, currency.code)} buys today. Calculate at ${window.location.href}`;
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        
        {/* Input Side */}
        <div className="lg:col-span-4 space-y-6">
          <div className="surface-card p-6 md:p-8 space-y-10 bg-secondary/5 border-border/40 relative overflow-hidden group">
            <Settings2 className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
            
            <div className="space-y-1 relative z-10">
              <h3 className="text-sm font-bold tracking-tight">Inflation Settings</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Set Your Money and Rate</p>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Reference Amount */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Starting Amount</Label>
                  <span className="text-xs font-mono font-medium">{formatCurrency(amount, currency.code)}</span>
                </div>
                <div className="relative group">
                  <Input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(Number(e.target.value) || 0)} 
                    className="h-11 bg-background border-border/60 focus:border-foreground/20 transition-all font-medium text-base rounded-lg shadow-sm"
                  />
                  <Banknote className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground opacity-20" />
                </div>
                <Slider 
                  value={[amount]} 
                  min={100} 
                  max={1000000} 
                  step={1000} 
                  onValueChange={([v]) => setAmount(v)} 
                  className="pt-2"
                />
              </div>

              {/* Rate and Years */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Annual Inflation Rate (%)</Label>
                  <Input 
                    type="number" 
                    step="0.1" 
                    value={rate} 
                    onChange={(e) => setRate(Number(e.target.value) || 0)} 
                    className="h-11 bg-background border-border/40 focus:border-foreground/20 transition-all font-medium text-base rounded-lg"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Years into the future</Label>
                  <Input 
                    type="number" 
                    value={years} 
                    onChange={(e) => setYears(Number(e.target.value) || 0)} 
                    className="h-11 bg-background border-border/40 focus:border-foreground/20 transition-all font-medium text-base rounded-lg"
                  />
                </div>
              </div>
              <Slider value={[years]} min={1} max={50} step={1} onValueChange={([v]) => setYears(v)} />
            </div>
          </div>

          {/* Economic Insight */}
          <div className="surface-card p-6 border-border/30 bg-signal/5 relative overflow-hidden group">
            <Globe className="absolute -bottom-4 -right-4 size-20 text-foreground/5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1 text-signal">
                <TrendingDown className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Inflation Impact</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {resultInfo.insight}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Side */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Executive Summary */}
          <div className="surface-card p-8 md:p-10 space-y-10 bg-background border-border/60 shadow-md relative overflow-hidden group">
            <LayoutDashboard className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <TrendingUp className="size-3" />
                    Future Cost of Goods
                  </div>
                  <div className="text-5xl md:text-6xl font-mono font-bold tracking-tighter tabular-nums text-foreground">
                    {formatCurrency(last, currency.code)}
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
                    <TrendingDown className="size-3 text-destructive" />
                    Buying Power Loss
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-destructive tabular-nums">
                    {cumulative.toFixed(1)}% <span className="text-[10px] opacity-40 uppercase tracking-widest font-sans font-bold">Total</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <History className="size-3" />
                    Purchasing Power Today
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                    {formatCurrency(resultInfo.purchasingPower, currency.code)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Breakdown */}
          <div className="surface-card p-8 bg-secondary/5 border-border/30 relative overflow-hidden group">
            <BarChartIcon className="absolute -bottom-4 -right-4 size-24 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-10 relative z-10">How Prices Rise Over Time</h4>
            
            <div className="h-[300px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--foreground))" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="hsl(var(--foreground))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.1} />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, opacity: 0.4 }} tickFormatter={(v) => `Year ${v}`} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, opacity: 0.4 }} tickFormatter={(v) => formatNumber(v)} />
                  <Tooltip 
                    formatter={(v: any) => formatCurrency(v, currency.code)} 
                    labelFormatter={(l) => `Timeline: Year ${l}`}
                    contentStyle={{ borderRadius: "16px", border: "none", backgroundColor: "hsl(var(--background))", boxShadow: "0 20px 40px -12px rgb(0 0 0 / 0.3)" }}
                  />
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--foreground))" fill="url(#colorPrice)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-6 relative z-10 text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-40 italic">Estimated Future Prices</div>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { l: "Multiplier", v: multiplier.toFixed(2), i: Activity, unit: "x" },
               { l: "Years", v: years, i: History, unit: "Yrs" },
               { l: "Value Lost/Day", v: ((last - amount) / (years * 365)).toFixed(2), i: Zap, unit: currency.code },
               { l: "Status", v: "Active", i: Landmark }
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


        </div>
      </div>
    </CalculatorPage>
  );
};

export default InflationCalculator;
