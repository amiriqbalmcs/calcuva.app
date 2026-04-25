"use client";

import { useMemo, useState } from "react";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Share, CheckCircle2, TrendingUp, Info } from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import { SeoBlock } from "@/components/SeoBlock";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { calculatorBySlug } from "@/lib/calculators";
import { formatNumber, formatCurrency } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("break-even-point-calculator")!;

const BreakEvenCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const { currency } = useCurrency();
  const [fixed, setFixed] = useUrlState<number>("f", 5000);
  const [variable, setVariable] = useUrlState<number>("v", 20);
  const [price, setPrice] = useUrlState<number>("p", 50);
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const margin = price - variable;
    const units = margin > 0 ? fixed / margin : 0;
    const sales = units * price;
    
    let insight = "";
    if (margin <= 0) insight = "CRITICAL: Your variable cost exceeds your selling price. You will lose money on every sale. Re-evaluate your pricing or unit costs immediately.";
    else if (units > 1000) insight = "High Volume Required: You need significant sales to cover fixed costs. Consider reducing overhead or increasing unit margin.";
    else insight = "Healthy Margin: Your contribution margin is positive. Scaling sales will lead to rapid profitability once the break-even floor is hit.";

    return { units, sales, margin, insight };
  }, [fixed, variable, price]);

  const chartData = useMemo(() => {
    const data = [];
    const maxUnits = Math.max(10, Math.ceil(stats.units * 1.5) || 100);
    const step = Math.ceil(maxUnits / 10);
    for (let i = 0; i <= maxUnits; i += step) {
      data.push({ units: i, costs: fixed + (variable * i), revenue: price * i });
    }
    return data;
  }, [fixed, variable, price, stats.units]);

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
      seoContent={<SeoBlock title="Business Break-Even Analysis" intro="The point where revenue covers all costs." faqs={[{ q: "Margin?", a: "Price minus variable cost." }]} />}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 surface-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">Business Model</h3>
            <button onClick={handleShare} className="p-1 px-2 rounded-md bg-secondary text-[10px] font-bold text-muted-foreground hover:bg-signal hover:text-white transition flex items-center gap-1">
              {copied ? <CheckCircle2 className="size-3" /> : <Share className="size-3" />}
              {copied ? "COPIED" : "SHARE"}
            </button>
          </div>
          <div className="space-y-4">
            <div><div className="flex justify-between mb-2"><Label>Fixed Costs</Label><span className="font-mono text-xs font-bold">{formatCurrency(fixed, currency)}</span></div>
              <Input type="number" value={fixed} onChange={(e) => setFixed(Number(e.target.value) || 0)} className="text-lg font-bold" />
            </div>
            <div><div className="flex justify-between mb-2"><Label>Variable / Unit</Label><span className="font-mono text-xs font-bold text-signal">{formatCurrency(variable, currency)}</span></div>
              <Input type="number" value={variable} onChange={(e) => setVariable(Number(e.target.value) || 0)} />
            </div>
            <div><div className="flex justify-between mb-2"><Label>Price / Unit</Label><span className="font-mono text-xs font-bold text-health">{formatCurrency(price, currency)}</span></div>
              <Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value) || 0)} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <ResultGrid cols={2}>
            <ResultStat label="Break-Even Units" value={formatNumber(stats.units)} accent />
            <ResultStat label="Revenue Floor" value={formatCurrency(stats.sales, currency)} />
          </ResultGrid>

          {/* Business Insight */}
          <div className={cn(
            "p-5 rounded-xl flex gap-4 items-start border-l-4",
            stats.margin <= 0 ? "bg-destructive/5 border-destructive text-destructive" : "bg-signal-soft border-signal text-signal"
          )}>
            <div className="shrink-0 mt-0.5"><TrendingUp className="size-5" /></div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Operational Insight</h4>
              <p className="text-sm opacity-90 leading-relaxed font-medium">{stats.insight}</p>
            </div>
          </div>

          <div className="surface-card p-6">
             <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6">Profitability Projection</h3>
             <ResponsiveContainer width="100%" height={260}>
               <LineChart data={chartData}>
                 <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                 <XAxis dataKey="units" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                 <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} tickFormatter={(v) => `k`} />
                 <Tooltip formatter={(v: any) => formatCurrency(v, currency)} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }} />
                 <Line type="monotone" dataKey="costs" name="Total Cost" stroke="hsl(var(--destructive))" strokeWidth={2.5} dot={false} />
                 <Line type="monotone" dataKey="revenue" name="Total Revenue" stroke="hsl(var(--health))" strokeWidth={2.5} dot={false} />
               </LineChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
};

export default BreakEvenCalculator;
