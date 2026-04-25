"use client";

import { useMemo, useState } from "react";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Share, CheckCircle2, TrendingDown, Info } from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import { SeoBlock } from "@/components/SeoBlock";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { calculatorBySlug } from "@/lib/calculators";
import { formatCurrency, formatNumber } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("inflation-calculator")!;

const InflationCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [amount, setAmount] = useUrlState<number>("iv", 10000);
  const [rate, setRate] = useUrlState<number>("r", 5);
  const [years, setYears] = useUrlState<number>("y", 10);
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
    if (cumulative > 100) insight = `Hyper-Erosion: In ${years} years, your purchasing power will more than halve. You would need ${formatCurrency(last)} to buy what ${formatCurrency(amount)} buys today.`;
    else if (cumulative > 30) insight = `Significant Impact: Your money will lose about a third of its value. Consider assets that outpace inflation (stocks, real estate).`;
    else insight = `Low-Moderate Inflation: While prices are rising, the erosion is relatively slow. Revisit your savings plan annually.`;

    return { purchasingPower, insight };
  }, [multiplier, amount, cumulative, last, years]);

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
      seoContent={
        <SeoBlock
          title="Inflation and Your Future Value"
          intro="Inflation is the erosion of purchasing power over time."
          sections={[{ heading: "Real vs Nominal", body: <p>Nominal is face value; Real is adjusted for inflation.</p> }]}
          faqs={[{ q: "What is CPI?", a: "The Consumer Price Index used to measure inflation." }]}
        />
      }
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 surface-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">Inflation Parameters</h3>
            <button onClick={handleShare} className="p-1 px-2 rounded-md bg-secondary text-[10px] font-bold text-muted-foreground hover:bg-finance hover:text-white transition flex items-center gap-1">
              {copied ? <CheckCircle2 className="size-3" /> : <Share className="size-3" />}
              {copied ? "COPIED" : "SHARE"}
            </button>
          </div>

          <div className="space-y-4">
            <div><Label>Current Value / Budget</Label><Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} className="mt-2 text-lg font-bold" /></div>
            <div>
              <div className="flex justify-between items-baseline mb-2"><Label>Inflation Rate (%)</Label><span className="font-mono text-sm font-bold text-finance">{rate}%</span></div>
              <Slider value={[rate]} min={0.1} max={30} step={0.1} onValueChange={([v]) => setRate(v)} />
            </div>
            <div>
              <div className="flex justify-between items-baseline mb-2"><Label>Time Horizon (Years)</Label><span className="font-mono text-sm font-bold text-finance">{years} y</span></div>
              <Slider value={[years]} min={1} max={50} step={1} onValueChange={([v]) => setYears(v)} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <ResultGrid cols={2}>
            <ResultStat label="Future Price" value={formatCurrency(last)} accent />
            <ResultStat label="Purchasing Power" value={formatCurrency(resultInfo.purchasingPower)} sub="Equivalent in today's money" />
          </ResultGrid>

          {/* Inflation Insight */}
          <div className="p-5 rounded-xl flex gap-4 items-start border-l-4 bg-finance-soft border-finance text-finance">
            <div className="shrink-0 mt-0.5"><TrendingDown className="size-5" /></div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Purchasing Power Insight</h4>
              <p className="text-sm opacity-90 leading-relaxed font-medium">{resultInfo.insight}</p>
            </div>
          </div>

          <div className="surface-card p-6">
            <h3 className="text-sm font-semibold mb-6 text-muted-foreground uppercase tracking-widest font-mono">Cost Projection Curve</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="year" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => formatNumber(v)} />
                  <Tooltip formatter={(v: any) => formatCurrency(v)} labelFormatter={(l) => `Year ${l}`} />
                  <Line type="monotone" dataKey="value" stroke="hsl(var(--finance))" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
};

export default InflationCalculator;
