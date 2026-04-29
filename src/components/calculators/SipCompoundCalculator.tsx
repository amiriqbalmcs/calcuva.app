"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  Share, CheckCircle2, TrendingUp, Info, Wallet, Target, Sparkles,
  History, Landmark, Zap, Activity, Globe, Settings2, Copy,
  TrendingDown, Banknote, BarChart as BarChartIcon, ShieldCheck,
  ChevronRight, LayoutDashboard, Calculator
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { calculatorBySlug } from "@/lib/calculators";
import { formatCurrency, formatCompact } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { useCurrency } from "@/context/CurrencyContext";
import { SITE_DOMAIN } from "@/lib/constants";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("sip-investment-calculator");

const SipCompoundCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;
  const { currency } = useCurrency();
  const [mode, setMode] = useUrlState<"sip" | "lumpsum">("m", "sip");
  const [monthly, setMonthly] = useUrlState<number>("iv", 500);
  const [lumpsum, setLumpsum] = useUrlState<number>("ls", 10000);
  const [rate, setRate] = useUrlState<number>("r", 12);
  const [years, setYears] = useUrlState<number>("y", 15);
  const [copied, setCopied] = useState(false);

  const data = useMemo(() => {
    const r = rate / 100;
    const points: { year: number; invested: number; value: number; gains: number }[] = [];
    for (let y = 1; y <= years; y++) {
      const months = y * 12;
      const monthlyR = r / 12;
      let value: number;
      let invested: number;
      if (mode === "sip") {
        invested = monthly * months;
        value = monthlyR === 0
          ? invested
          : monthly * ((Math.pow(1 + monthlyR, months) - 1) / monthlyR) * (1 + monthlyR);
      } else {
        invested = lumpsum;
        value = lumpsum * Math.pow(1 + r, y);
      }
      points.push({ year: y, invested, value, gains: value - invested });
    }
    return points;
  }, [mode, monthly, lumpsum, rate, years]);

  const last = data[data.length - 1] ?? { invested: 0, value: 0, gains: 0 };

  const insight = useMemo(() => {
    const multiples = last.value / (last.invested || 1);
    if (multiples > 5) return "Exponential Phase: Your portfolio is over 5x your contributions. Compounding has officially taken the lead.";
    else if (multiples > 2) return "Growth Accelerator: You have doubled your capital. Compound interest is now outperforming your inputs.";
    return "Foundation Phase: You are building your principal base. Consistency is critical to reaching the exponential curve.";
  }, [last.value, last.invested]);

  const handleCopy = () => {
    const resultText = `Wealth Projection: Targeting ${formatCurrency(last.value, currency.code)} in ${years} years. Model yours at ${SITE_DOMAIN}`;
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
              <h3 className="text-sm font-bold tracking-tight">Strategy Architecture</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Growth Protocol Configuration</p>
            </div>

            <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="relative z-10">
              <TabsList className="grid grid-cols-2 w-full h-11 bg-background border border-border/60 p-1 rounded-xl shadow-sm">
                <TabsTrigger value="sip" className="rounded-lg text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-background transition-all">Recurring</TabsTrigger>
                <TabsTrigger value="lumpsum" className="rounded-lg text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-background transition-all">One-time</TabsTrigger>
              </TabsList>

              <div className="mt-10 space-y-8">
                <TabsContent value="sip" className="m-0 space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Monthly Deposit</Label>
                      <span className="text-[10px] font-bold text-finance">{formatCurrency(monthly, currency.code)}</span>
                    </div>
                    <div className="relative group">
                      <Input
                        type="number"
                        value={monthly}
                        onChange={(e) => setMonthly(Number(e.target.value) || 0)}
                        className="h-12 bg-background border-border/60 focus:border-foreground/20 transition-all font-bold text-lg rounded-xl pr-12 shadow-sm"
                      />
                      <Wallet className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30" />
                    </div>
                    <Slider value={[monthly]} min={50} max={20000} step={50} onValueChange={([v]) => setMonthly(v)} />
                  </div>
                </TabsContent>

                <TabsContent value="lumpsum" className="m-0 space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Initial Capital</Label>
                      <span className="text-[10px] font-bold text-finance">{formatCurrency(lumpsum, currency.code)}</span>
                    </div>
                    <div className="relative group">
                      <Input
                        type="number"
                        value={lumpsum}
                        onChange={(e) => setLumpsum(Number(e.target.value) || 0)}
                        className="h-12 bg-background border-border/60 focus:border-foreground/20 transition-all font-bold text-lg rounded-xl pr-12 shadow-sm"
                      />
                      <Banknote className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30" />
                    </div>
                    <Slider value={[lumpsum]} min={500} max={1000000} step={500} onValueChange={([v]) => setLumpsum(v)} />
                  </div>
                </TabsContent>

                <div className="space-y-8 pt-2 border-t border-border/40">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      <span>Expected Yield (APR)</span>
                      <span className="text-health">{rate}%</span>
                    </div>
                    <Slider value={[rate]} min={1} max={30} step={0.5} onValueChange={([v]) => setRate(v)} />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      <span>Horizon Vector</span>
                      <span className="text-foreground">{years} Years</span>
                    </div>
                    <Slider value={[years]} min={1} max={40} step={1} onValueChange={([v]) => setYears(v)} />
                  </div>
                </div>
              </div>
            </Tabs>
          </div>

          <div className="surface-card p-6 border-border/30 bg-health/5 text-health relative overflow-hidden group">
            <ShieldCheck className="absolute -bottom-4 -right-4 size-20 opacity-5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1">
                <Target className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Growth Insight</h4>
                <p className="text-xs opacity-80 leading-relaxed font-medium">
                  {insight}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8">

          {/* Executive Summary */}
          <div className="surface-card p-8 md:p-10 space-y-8 bg-background border-border/60 shadow-md relative overflow-hidden group">
            <TrendingUp className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Projected Maturity Valuation</span>
                  <div className="text-6xl md:text-7xl font-mono font-medium tracking-tighter tabular-nums">
                    {formatCurrency(last.value, currency.code)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
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
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-border/40">
                <div className="flex items-center gap-1.5 px-4 py-1.5 bg-foreground text-background rounded-lg text-[10px] font-bold uppercase tracking-tight shadow-md">
                  <Sparkles className="size-3" />
                  <span>Est. Gains: {formatCurrency(last.gains, currency.code)}</span>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
                  Capital Invested: {formatCurrency(last.invested, currency.code)}
                </div>
              </div>
            </div>
          </div>

          {/* Accumulation Trajectory */}
          <div className="surface-card p-10 bg-secondary/5 border-border/30 relative overflow-hidden group shadow-sm">
            <LayoutDashboard className="absolute -top-4 -right-4 size-48 text-muted-foreground/5 opacity-40 group-hover:rotate-12 transition-transform duration-1000" />
            <div className="flex items-center justify-between mb-12 relative z-10">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <BarChartIcon className="size-3" /> Accumulation Trajectory
              </h4>
              <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">{years} Year Horizon</span>
            </div>

            <div className="h-[320px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--foreground))" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="hsl(var(--foreground))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.1} />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, opacity: 0.4 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, opacity: 0.4 }} tickFormatter={(v) => formatCompact(v)} />
                  <Tooltip
                    cursor={{ stroke: 'hsl(var(--foreground))', strokeWidth: 1, strokeDasharray: '4 4' }}
                    formatter={(v: any) => formatCurrency(v, currency.code)}
                    labelFormatter={(l) => `Year ${l}`}
                    contentStyle={{ borderRadius: "16px", border: "none", backgroundColor: "hsl(var(--background))", boxShadow: "0 20px 40px -12px rgb(0 0 0 / 0.3)" }}
                  />
                  <Area type="monotone" dataKey="invested" name="Principal" stroke="hsl(var(--muted-foreground)/0.2)" fill="hsl(var(--muted-foreground)/0.05)" strokeWidth={1} />
                  <Area type="monotone" dataKey="value" name="Value" stroke="hsl(var(--foreground))" fill="url(#colorVal)" strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-8 mt-8 relative z-10 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
              <div className="flex items-center gap-2"><div className="size-1.5 rounded-full bg-muted-foreground/30" /> Cumulative Principal</div>
              <div className="flex items-center gap-2"><div className="size-1.5 rounded-full bg-foreground/60" /> Total Portfolio Value</div>
            </div>
          </div>

          {/* Performance Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { l: "Multiplier Index", v: (last.value / (last.invested || 1)).toFixed(2), i: Activity, unit: "x" },
              { l: "Gain Efficiency", v: ((last.gains / (last.value || 1)) * 100).toFixed(1), i: Target, unit: "%" },
              { l: "Timeline Horizon", v: years, i: History, unit: "yrs" },
              { l: "Monthly Yield", v: (last.gains / (years * 12)).toFixed(0), i: Zap, unit: currency.code }
            ].map((item, idx) => (
              <div key={idx} className="surface-card p-6 border-border/30 bg-background hover:border-foreground/20 transition-all group shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <item.i className="size-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">{item.l}</span>
                </div>
                <div className="text-lg font-mono font-bold tabular-nums leading-tight">
                  {item.v}
                  <span className="text-[10px] ml-1 opacity-40 uppercase">{item.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Expert Contexts */}
          <div className="grid md:grid-cols-2 gap-6 pt-2">
            <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group shadow-sm">
              <Landmark className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:-rotate-12 transition-transform duration-500" />
              <div className="flex items-center gap-3 relative z-10">
                <Activity className="size-4 text-muted-foreground" />
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Dollar Cost Averaging</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                Recurring investments mitigate market volatility by systematically purchasing more units when prices are low, lowering your average acquisition cost over time.
              </p>
            </div>
            <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group shadow-sm">
              <Globe className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:-rotate-12 transition-transform duration-500" />
              <div className="flex items-center gap-3 relative z-10">
                <TrendingUp className="size-4 text-muted-foreground" />
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Time Vector Advantage</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                The "8th wonder of the world" works most effectively over long horizons. Starting early is mathematically superior to attempting to catch up with larger amounts later.
              </p>
            </div>
          </div>

        </div>
      </div>
    </CalculatorPage>
  );
};

export default SipCompoundCalculator;
