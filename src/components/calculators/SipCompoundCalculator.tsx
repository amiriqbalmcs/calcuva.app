"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Share, CheckCircle2, TrendingUp, Info } from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import { SeoBlock } from "@/components/SeoBlock";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { calculatorBySlug } from "@/lib/calculators";
import { formatCurrency } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("sip-investment-calculator")!;

const SipCompoundCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
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
    if (multiples > 5) return "Exponential Milestone: Your portfolio is now over 5x your original contribution. Time and compounding are doing the heavy lifting now.";
    else if (multiples > 2) return "Growth Accelerator: You have officially doubled your initial wealth. Compounding is beginning to pull ahead of contributions.";
    return "Foundation Phase: You are building your principal base. Maintaining your recurring contributions is key to hitting the upward curve.";
  }, [last.value, last.invested]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage
      calc={calc}
      guideHtml={guideHtml}
      faqs={faqs}
      relatedArticles={relatedArticles}
      seoContent={<SeoBlock title="Precision Wealth Forecasting" intro="Simulate long-term wealth creation using various compounding frequencies and inflation adjustments." />}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 surface-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Investment Plan</h3>
            <button onClick={handleShare} className="p-1 px-2 rounded-md bg-secondary text-[10px] font-bold text-muted-foreground hover:bg-signal hover:text-white transition flex items-center gap-1 font-mono">
              {copied ? <CheckCircle2 className="size-3" /> : <Share className="size-3" />}
              {copied ? "COPIED" : "SHARE"}
            </button>
          </div>

          <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="sip">Recurring</TabsTrigger>
              <TabsTrigger value="lumpsum">One-time</TabsTrigger>
            </TabsList>
            <TabsContent value="sip" className="mt-4 space-y-4">
              <div className="flex justify-between items-center mb-1"><Label className="m-0">Monthly contribution</Label><span className="font-mono text-xs font-bold text-signal">{formatCurrency(monthly, currency)}</span></div>
              <Input type="number" value={monthly} onChange={(e) => setMonthly(Number(e.target.value) || 0)} className="text-lg font-bold" />
              <Slider value={[monthly]} min={50} max={10000} step={50} onValueChange={([v]) => setMonthly(v)} />
            </TabsContent>
            <TabsContent value="lumpsum" className="mt-4 space-y-4">
              <div className="flex justify-between items-center mb-1"><Label className="m-0">Lumpsum amount</Label><span className="font-mono text-xs font-bold text-signal">{formatCurrency(lumpsum, currency)}</span></div>
              <Input type="number" value={lumpsum} onChange={(e) => setLumpsum(Number(e.target.value) || 0)} className="text-lg font-bold" />
              <Slider value={[lumpsum]} min={500} max={500000} step={500} onValueChange={([v]) => setLumpsum(v)} />
            </TabsContent>
          </Tabs>

          <div className="space-y-4 pt-2 border-t border-border">
            <div>
              <div className="flex justify-between mb-2"><Label>Return Rate (%)</Label><span className="font-mono text-xs font-bold text-signal">{rate}%</span></div>
              <Slider value={[rate]} min={1} max={25} step={0.5} onValueChange={([v]) => setRate(v)} />
            </div>
            <div>
              <div className="flex justify-between mb-2"><Label>Time Horizon</Label><span className="font-mono text-xs font-bold text-signal">{years} yr</span></div>
              <Slider value={[years]} min={1} max={40} step={1} onValueChange={([v]) => setYears(v)} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <ResultGrid cols={2}>
            <ResultStat label="Estimated Value" value={formatCurrency(last.value, currency)} accent />
            <ResultStat label="Total Invested" value={formatCurrency(last.invested, currency)} sub="Principal Only" />
          </ResultGrid>

          <div className="p-5 rounded-xl flex gap-4 items-start border-l-4 bg-signal-soft border-signal text-signal">
            <div className="shrink-0 mt-0.5"><TrendingUp className="size-5" /></div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Growth Insight</h4>
              <p className="text-sm opacity-90 leading-relaxed font-medium">{insight}</p>
            </div>
          </div>

          <div className="surface-card p-6">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono mb-6">Wealth Accumulation Projection</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--signal))" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(var(--signal))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: any) => formatCurrency(v, currency)} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }} />
                  <Area type="monotone" dataKey="invested" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground) / 0.05)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--signal))" fill="url(#colorVal)" strokeWidth={3} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
};

export default SipCompoundCalculator;
