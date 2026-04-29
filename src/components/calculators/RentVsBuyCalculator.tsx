"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { 
  Share, CheckCircle2, Home, Info, Landmark, TrendingUp, Wallet, Zap, 
  History, Target, Activity, ShieldCheck, Building2, LayoutDashboard,
  Settings2, Copy, TrendingDown, Banknote, BarChart as BarChartIcon
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

const calc = calculatorBySlug("rent-vs-buy-calculator")!;

const RentVsBuyCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const { currency } = useCurrency();
  const [homePrice, setHomePrice] = useUrlState<number>("hp", 400000);
  const [downPct, setDownPct] = useUrlState<number>("dp", 20);
  const [rate, setRate] = useUrlState<number>("rt", 7);
  const [years, setYears] = useUrlState<number>("y", 15);
  const [appreciation, setAppreciation] = useUrlState<number>("ap", 3);
  const [rent, setRent] = useUrlState<number>("rn", 2000);
  const [rentInflation, setRentInflation] = useUrlState<number>("ri", 4);
  const [investReturn, setInvestReturn] = useUrlState<number>("ir", 7);
  const [copied, setCopied] = useState(false);

  const data = useMemo(() => {
    const downPayment = homePrice * (downPct / 100);
    const principal = homePrice - downPayment;
    const n = Math.max(1, years * 12);
    const r = rate / 100 / 12;
    const emi = r === 0 ? principal / n : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    const points: { year: number; buyNet: number; rentNet: number }[] = [];
    let monthlyRent = rent;
    let rentInvested = downPayment;

    for (let y = 1; y <= years; y++) {
      const homeValue = homePrice * Math.pow(1 + appreciation / 100, y);
      const buyCost = downPayment + emi * 12 * y - homeValue;
      for (let m = 0; m < 12; m++) {
        const diff = emi - monthlyRent;
        if (diff > 0) rentInvested += diff;
        rentInvested *= 1 + investReturn / 100 / 12;
      }
      monthlyRent *= 1 + rentInflation / 100;
      
      let r0 = rent; let totalRentPaid = 0;
      for (let yy = 1; yy <= y; yy++) { for (let m = 0; m < 12; m++) totalRentPaid += r0; r0 *= 1 + rentInflation / 100; }
      const cleanRentNet = totalRentPaid - (rentInvested - downPayment);
      
      points.push({ year: y, buyNet: buyCost, rentNet: cleanRentNet });
    }
    
    let insight = "";
    const breakEven = points.find((p) => p.buyNet < p.rentNet)?.year;
    if (breakEven && breakEven <= 5) insight = "Fast Break-Even: High appreciation or rent makes buying a superior short-term strategy.";
    else if (breakEven) insight = `Long-Term Advantage: Buying becomes financially superior at year ${breakEven}. Only buy if staying past this horizon.`;
    else insight = "Rental Optimization: Renting and investing the difference outperforms buying over this specific term.";

    return { points, emi, downPayment, finalBuy: points[points.length-1].buyNet, finalRent: points[points.length-1].rentNet, breakEven, insight };
  }, [homePrice, downPct, rate, years, appreciation, rent, rentInflation, investReturn]);

  const handleCopy = () => {
    const verdict = data.finalBuy < data.finalRent ? 'BUY' : 'RENT';
    const resultText = `Rent vs Buy Verdict: ${verdict}. Break-even: ${data.breakEven ? `Year ${data.breakEven}` : 'N/A'}. Analyze at ${SITE_DOMAIN}`;
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
              <h3 className="text-sm font-bold tracking-tight">Market Architecture</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Property vs Rent Configuration</p>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Home Price */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Property Value</Label>
                  <span className="text-[10px] font-bold text-health">{formatCurrency(homePrice, currency.code)}</span>
                </div>
                <div className="relative group">
                  <Input 
                    type="number" 
                    value={homePrice} 
                    onChange={(e) => setHomePrice(Number(e.target.value) || 0)} 
                    className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm pr-12"
                  />
                  <Home className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                </div>
                <Slider value={[homePrice]} min={50000} max={2000000} step={10000} onValueChange={([v]) => setHomePrice(v)} />
              </div>

              {/* Monthly Rent */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Market Rent</Label>
                  <span className="text-[10px] font-bold text-health">{formatCurrency(rent, currency.code)}</span>
                </div>
                <div className="relative group">
                  <Input 
                    type="number" 
                    value={rent} 
                    onChange={(e) => setRent(Number(e.target.value) || 0)} 
                    className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm pr-12"
                  />
                  <Wallet className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                </div>
                <Slider value={[rent]} min={500} max={10000} step={100} onValueChange={([v]) => setRent(v)} />
              </div>

              {/* Sliders Group */}
              <div className="space-y-6 pt-2 border-t border-border/40">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Down Payment</Label>
                    <span className="text-[10px] font-bold">{downPct}%</span>
                  </div>
                  <Slider value={[downPct]} min={0} max={50} step={1} onValueChange={([v]) => setDownPct(v)} />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Mortgage Rate</Label>
                    <span className="text-[10px] font-bold text-health">{rate}%</span>
                  </div>
                  <Slider value={[rate]} min={1} max={15} step={0.1} onValueChange={([v]) => setRate(v)} />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Horizon (Years)</Label>
                    <span className="text-[10px] font-bold">{years}Y</span>
                  </div>
                  <Slider value={[years]} min={1} max={30} step={1} onValueChange={([v]) => setYears(v)} />
                </div>
              </div>
            </div>
          </div>

          <div className="surface-card p-6 border-border/30 bg-health/5 relative overflow-hidden group">
            <ShieldCheck className="absolute -bottom-4 -right-4 size-20 text-health/5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1 text-health">
                <ShieldCheck className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Property Verdict</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {data.insight}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Executive Summary */}
          <div className="surface-card p-8 md:p-10 space-y-10 bg-background border-border/60 shadow-md relative overflow-hidden group">
            <Building2 className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <History className="size-3" />
                    Financial Recommendation
                  </div>
                  <div className={cn("text-5xl md:text-6xl font-mono font-bold tracking-tighter tabular-nums", 
                    data.finalBuy < data.finalRent ? "text-health" : "text-foreground"
                  )}>
                    {data.finalBuy < data.finalRent ? "BUY" : "RENT"}
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
                    <Landmark className="size-3" />
                    Est. Monthly EMI
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                    {formatCurrency(data.emi, currency.code)}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Target className="size-3" />
                    Break-Even Horizon
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-health tabular-nums">
                    {data.breakEven ? `Year ${data.breakEven}` : "Not Reached"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Trajectory */}
          <div className="surface-card p-10 bg-secondary/5 border-border/30 relative overflow-hidden group">
            <BarChartIcon className="absolute -bottom-4 -right-4 size-24 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
            <div className="flex items-center justify-between mb-12 relative z-10">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Net Cost Accumulation</h4>
              <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">{years} Year Comparison</span>
            </div>
            
            <div className="h-[320px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.points}>
                  <defs>
                    <linearGradient id="colorBuy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--foreground))" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="hsl(var(--foreground))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.1} />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, opacity: 0.4 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, opacity: 0.4 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(v: any) => formatCurrency(v, currency.code)} 
                    contentStyle={{ borderRadius: "16px", border: "none", backgroundColor: "hsl(var(--background))", boxShadow: "0 20px 40px -12px rgb(0 0 0 / 0.3)" }}
                  />
                  <Area type="monotone" dataKey="buyNet" name="Buy Cost" stroke="hsl(var(--foreground))" fill="url(#colorBuy)" strokeWidth={4} />
                  <Area type="monotone" dataKey="rentNet" name="Rent Cost" stroke="hsl(var(--muted-foreground)/0.4)" fill="url(#colorRent)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-8 mt-8 relative z-10 text-[9px] font-bold uppercase tracking-[0.2em]">
               <div className="flex items-center gap-2"><div className="size-1.5 rounded-full bg-foreground" /> Total Buying Cost</div>
               <div className="flex items-center gap-2"><div className="size-1.5 rounded-full bg-muted-foreground/30" /> Total Rental Cost</div>
            </div>
          </div>

          {/* Performance Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { l: "Down Payment", v: data.downPayment, i: Wallet, isMoney: true },
               { l: "Home Growth", v: appreciation, i: TrendingUp, unit: "%" },
               { l: "Rent Inflation", v: rentInflation, i: Activity, unit: "%" },
               { l: "Market Yield", v: investReturn, i: Target, unit: "%" }
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
                <Building2 className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
                <div className="flex items-center gap-2 relative z-10">
                  <Home className="size-3 text-health" /> Asset Appreciation
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                  Buying leverages your capital into a large asset that historically appreciates, potentially creating significant long-term net worth.
                </p>
             </div>
             <div className="surface-card p-8 border-border/30 space-y-4 bg-secondary/5 relative overflow-hidden group">
                <LayoutDashboard className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
                <div className="flex items-center gap-2 relative z-10">
                  <Activity className="size-3 text-health" /> Capital Velocity
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                  Renting avoids illiquid property taxes and maintenance, allowing for higher velocity in stock market or business investments.
                </p>
             </div>
          </div>

        </div>
      </div>
    </CalculatorPage>
  );
};

export default RentVsBuyCalculator;
