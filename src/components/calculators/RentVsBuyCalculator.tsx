"use client";

import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Share, CheckCircle2, Home, Info } from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import { SeoBlock } from "@/components/SeoBlock";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { calculatorBySlug } from "@/lib/calculators";
import { formatCurrency } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("rent-vs-buy-calculator")!;

const RentVsBuyCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
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
    const n = years * 12;
    const r = rate / 100 / 12;
    const emi = r === 0 ? principal / n : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    const points: { year: number; buyNet: number; rentNet: number }[] = [];
    let monthlyRent = rent;
    let rentInvested = downPayment;

    for (let y = 1; y <= years; y++) {
      const homeValue = homePrice * Math.pow(1 + appreciation / 100, y);
      const buyCost = downPayment + emi * 12 * y - homeValue;
      let yearRent = 0;
      for (let m = 0; m < 12; m++) {
        yearRent += monthlyRent;
        const diff = emi - monthlyRent;
        if (diff > 0) rentInvested += diff;
        rentInvested *= 1 + investReturn / 100 / 12;
      }
      monthlyRent *= 1 + rentInflation / 100;
      const cleanRentPaid = (() => {
        let r0 = rent; let total = 0;
        for (let yy = 1; yy <= y; yy++) { for (let m = 0; m < 12; m++) total += r0; r0 *= 1 + rentInflation / 100; }
        return total;
      })();
      const cleanRentNet = cleanRentPaid - (rentInvested - downPayment);
      points.push({ year: y, buyNet: buyCost, rentNet: cleanRentNet });
    }
    
    let insight = "";
    const breakEven = points.find((p) => p.buyNet < p.rentNet)?.year;
    if (breakEven && breakEven <= 5) insight = "Fast Break-Even: High appreciation or high rent makes buying an excellent short-term investment (under 5 years).";
    else if (breakEven) insight = `Long-Term Play: Buying becomes profitable at year ${breakEven}. You should only buy if you plan to stay past this threshold.`;
    else insight = "Rental Advantage: Based on current rates and rent inflation, renting and investing the difference outperforms buying over the entire period.";

    return { points, emi, downPayment, finalBuy: points[points.length-1].buyNet, finalRent: points[points.length-1].rentNet, breakEven, insight };
  }, [homePrice, downPct, rate, years, appreciation, rent, rentInflation, investReturn]);

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
      seoContent={<SeoBlock title="Real Estate Decision Math" intro="Renting vs Buying is a complex financial trade-off involving opportunity costs and asset growth." />}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 surface-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">Market Inputs</h3>
            <button onClick={handleShare} className="p-1 px-2 rounded-md bg-secondary text-[10px] font-bold text-muted-foreground hover:bg-signal hover:text-white transition flex items-center gap-1">
              {copied ? <CheckCircle2 className="size-3" /> : <Share className="size-3" />}
              {copied ? "COPIED" : "SHARE"}
            </button>
          </div>
          <div className="space-y-4">
             <div><Label>Home Price</Label><Input type="number" value={homePrice} onChange={(e) => setHomePrice(Number(e.target.value) || 0)} className="mt-2 text-lg font-bold" /></div>
             <div><div className="flex justify-between"><Label>Down Payment</Label><span className="font-mono text-xs font-bold">{downPct}%</span></div><Slider value={[downPct]} min={0} max={50} step={1} onValueChange={([v]) => setDownPct(v)} className="mt-2" /></div>
             <div><div className="flex justify-between"><Label>Mortgage Rate</Label><span className="font-mono text-xs font-bold">{rate}%</span></div><Slider value={[rate]} min={1} max={15} step={0.1} onValueChange={([v]) => setRate(v)} className="mt-2" /></div>
             <div><div className="flex justify-between"><Label>Current Rent</Label></div><Input type="number" value={rent} onChange={(e) => setRent(Number(e.target.value) || 0)} className="mt-2" /></div>
          </div>
          <div className="pt-4 border-t border-border">
             <div className="flex justify-between mb-2"><Label>Market Growth</Label><span className="font-mono text-xs">{appreciation}%</span></div>
             <Slider value={[appreciation]} min={0} max={10} step={0.5} onValueChange={([v]) => setAppreciation(v)} />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <ResultGrid cols={2}>
            <ResultStat label="Verdict" value={data.finalBuy < data.finalRent ? "Buy" : "Rent"} accent sub={`After ${years} years`} />
            <ResultStat label="EMI Estimate" value={formatCurrency(data.emi)} sub="/ month" />
          </ResultGrid>

          {/* Real Estate Insight */}
          <div className="p-5 rounded-xl flex gap-4 items-start border-l-4 bg-signal-soft border-signal text-signal">
            <div className="shrink-0 mt-0.5"><Home className="size-5" /></div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Market Insight</h4>
              <p className="text-sm opacity-90 leading-relaxed font-medium">{data.insight}</p>
            </div>
          </div>

          <div className="surface-card p-6">
             <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6">Cumulative Net Cost Comparison</h3>
             <ResponsiveContainer width="100%" height={260}>
               <LineChart data={data.points}>
                 <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                 <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                 <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                 <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }} />
                 <Line type="monotone" dataKey="buyNet" name="Buy Cost" stroke="hsl(var(--signal))" strokeWidth={3} dot={false} />
                 <Line type="monotone" dataKey="rentNet" name="Rent Cost" stroke="hsl(var(--utility))" strokeWidth={3} dot={false} />
               </LineChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
};

export default RentVsBuyCalculator;
