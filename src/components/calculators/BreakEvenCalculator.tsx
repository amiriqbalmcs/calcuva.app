"use client";

import { useMemo, useState } from "react";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis
} from "recharts";
import {
  Share, CheckCircle2, TrendingUp, Info, Landmark,
  BarChart3, PieChart, ArrowUpRight, ArrowDownRight,
  Tag, Wallet, ShoppingCart, Copy, LayoutDashboard,
  Calculator, Settings2, Banknote, ShieldCheck,
  ChevronRight, Target, Activity, Zap, Ruler, Flag
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { calculatorBySlug } from "@/lib/calculators";
import { formatNumber, formatCurrency } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { useCurrency } from "@/context/CurrencyContext";
import { SITE_DOMAIN } from "@/lib/constants";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("break-even-point-calculator");

const BreakEvenCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;
  const { currency } = useCurrency();
  const [fixed, setFixed] = useUrlState<number>("f", 5000);
  const [variable, setVariable] = useUrlState<number>("v", 20);
  const [price, setPrice] = useUrlState<number>("p", 50);
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const margin = price - variable;
    const units = margin > 0 ? fixed / margin : 0;
    const sales = units * price;

    let status: "optimal" | "warning" | "critical" = "optimal";
    let insight = "";
    if (margin <= 0) {
      status = "critical";
      insight = "CRITICAL: It costs you more to make a unit than you sell it for. You will lose money on every sale. You need to raise your price or lower your costs immediately.";
    } else if (units > 1000) {
      status = "warning";
      insight = "High Volume Needed: You need to sell a lot of units just to cover your fixed costs. Consider trying to lower your fixed costs or raise your prices.";
    } else {
      status = "optimal";
      insight = "Healthy Margins: You are making a profit on each unit sold. Once you hit your break-even point, your profits will grow quickly.";
    }

    return { units, sales, margin, insight, status };
  }, [fixed, variable, price]);

  const chartData = useMemo(() => {
    const data = [];
    const maxUnits = Math.max(10, Math.ceil(stats.units * 2) || 100);
    const step = Math.ceil(maxUnits / 10) || 1;
    for (let i = 0; i <= maxUnits; i += step) {
      data.push({ units: i, costs: fixed + (variable * i), revenue: price * i });
    }
    return data;
  }, [fixed, variable, price, stats.units]);

  const handleCopy = () => {
    let text = `Break-Even Point: ${formatNumber(stats.units)} units | Total Sales Needed: ${formatCurrency(stats.sales, currency.code)}. Calculate yours at ${SITE_DOMAIN}`;
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
              <h3 className="text-sm font-bold tracking-tight">Break-Even Setup</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Your Costs and Prices</p>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Fixed Costs */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Fixed Costs</Label>
                  <span className="text-[10px] font-bold text-finance">{formatCurrency(fixed, currency.code)}</span>
                </div>
                <div className="relative group">
                  <Input
                    type="number"
                    value={fixed}
                    onChange={(e) => setFixed(Number(e.target.value) || 0)}
                    className="h-12 bg-background border-border/60 focus:border-foreground/20 transition-all font-bold text-lg rounded-xl pr-12 shadow-sm"
                  />
                  <Landmark className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30" />
                </div>
                <Slider value={[fixed]} min={100} max={100000} step={100} onValueChange={([v]) => setFixed(v)} />
              </div>

              {/* Variable Cost */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Cost Per Unit</Label>
                  <span className="text-[10px] font-bold text-destructive">{formatCurrency(variable, currency.code)}</span>
                </div>
                <div className="relative group">
                  <Input
                    type="number"
                    value={variable}
                    onChange={(e) => setVariable(Number(e.target.value) || 0)}
                    className="h-11 bg-background border-border/60 focus:border-foreground/20 transition-all font-bold text-base rounded-lg shadow-sm pr-12"
                  />
                  <Activity className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30" />
                </div>
                <Slider value={[variable]} min={1} max={5000} step={1} onValueChange={([v]) => setVariable(v)} />
              </div>

              {/* Selling Price */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Price Per Unit</Label>
                  <span className="text-[10px] font-bold text-health">{formatCurrency(price, currency.code)}</span>
                </div>
                <div className="relative group">
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value) || 0)}
                    className="h-11 bg-background border-border/60 focus:border-foreground/20 transition-all font-bold text-base rounded-lg shadow-sm pr-12"
                  />
                  <Banknote className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30" />
                </div>
                <Slider value={[price]} min={1} max={10000} step={1} onValueChange={([v]) => setPrice(v)} />
              </div>
            </div>
          </div>

          {/* Insight Panel */}
          <div className={cn(
            "surface-card p-6 border-border/30 relative overflow-hidden group",
            stats.status === "critical" ? "bg-destructive/5 text-destructive" : stats.status === "warning" ? "bg-amber-500/5 text-amber-500" : "bg-health/5 text-health"
          )}>
            <ShieldCheck className="absolute -bottom-4 -right-4 size-20 opacity-5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1">
                {stats.status === "critical" ? <ArrowDownRight className="size-5" /> : <TrendingUp className="size-5" />}
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider">What This Means</h4>
                <p className="text-xs opacity-80 leading-relaxed font-medium">
                  {stats.insight}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8">

          {/* Executive Summary */}
          <div className="surface-card p-8 md:p-10 space-y-10 bg-background border-border/60 shadow-md relative overflow-hidden group">
            <Target className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Flag className="size-3" />
                    Your Break-Even Point
                  </div>
                  <div className="text-5xl md:text-6xl font-mono font-bold tracking-tighter tabular-nums">
                    {formatNumber(stats.units)} <span className="text-xl md:text-2xl opacity-40 uppercase tracking-widest font-sans">Units</span>
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
                    <Banknote className="size-3" />
                    Total Sales Needed
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                    {formatCurrency(stats.sales, currency.code)}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <TrendingUp className="size-3 text-health" />
                    Profit Per Unit
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-health tabular-nums">
                    {formatCurrency(stats.margin, currency.code)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Projection Chart */}
          <div className="surface-card p-8 bg-secondary/5 border-border/30 relative overflow-hidden group shadow-sm">
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div className="space-y-1">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Profit Projection</h3>
                <p className="text-sm font-bold tracking-tight">Sales vs. Costs</p>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block mb-1 opacity-40">Unit Profit Margin</span>
                <div className="text-xl font-mono font-bold text-foreground">{((stats.margin / price) * 100).toFixed(1)}%</div>
              </div>
            </div>

            <div className="h-[320px] relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--health))" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="hsl(var(--health))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.4} />
                  <XAxis dataKey="units" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: "bold", fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: "bold", fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(v: any) => formatCurrency(v, currency.code)}
                    contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 20px 40px -12px rgb(0 0 0 / 0.2)", backgroundColor: "hsl(var(--background))" }}
                  />
                  <Area type="monotone" dataKey="costs" name="Total Costs" stroke="hsl(var(--destructive))" strokeWidth={2.5} fill="transparent" strokeDasharray="5 5" />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="hsl(var(--health))" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-around text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-t border-border/40 pt-6 mt-6">
              <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-health" /> Revenue</div>
              <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-destructive" /> Total Costs</div>
            </div>
          </div>

          {/* Stats Matrix */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { l: "Profit Margin", v: ((stats.margin / price) * 100).toFixed(1), i: Activity, unit: "%" },
              { l: "Fixed Costs", v: formatCurrency(fixed, currency.code), i: Zap, unit: "" },
              { l: "Cost vs Price", v: (variable / price).toFixed(2), i: Ruler, unit: "x" },
              { l: "Status", v: stats.margin > 0 ? "Viable" : "Critical", i: ShieldCheck }
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

          {/* Professional Contexts */}
          <div className="grid md:grid-cols-2 gap-6 pt-4">
            <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group shadow-sm">
              <Landmark className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:-rotate-12 transition-transform duration-500" />
              <div className="flex items-center gap-3 relative z-10">
                <Target className="size-4 text-muted-foreground" />
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Growing Your Business</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed relative z-10 font-medium">
                Once you pass your break-even point, every sale adds directly to your profit. Lowering your cost per unit is the fastest way to grow your profits.
              </p>
            </div>
            <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group shadow-sm">
              <ArrowUpRight className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:-rotate-12 transition-transform duration-500" />
              <div className="flex items-center gap-3 relative z-10">
                <ShieldCheck className="size-4 text-muted-foreground" />
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Lowering Your Risk</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed relative z-10 font-medium">
                Lowering your fixed costs (like rent or software) means you don't have to sell as much just to survive.
              </p>
            </div>
          </div>

        </div>
      </div>
    </CalculatorPage>
  );
};

export default BreakEvenCalculator;
