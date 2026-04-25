"use client";

import { useMemo, useState } from "react";
import { Share, CheckCircle2, Cigarette, Info, TrendingUp } from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import { SeoBlock } from "@/components/SeoBlock";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { calculatorBySlug } from "@/lib/calculators";
import { formatCurrency, formatNumber } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("smoking-cost-calculator")!;

const SmokingCostCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
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
    if (totalCost > 50000) insight = `Wealth Gap: You have spent ${formatCurrency(totalCost)} on smoking. If invested at 8% annually, this would be over ${formatCurrency(totalCost * 2.5)} today.`;
    else if (totalCost > 10000) insight = `Opportunity Cost: This habit has cost you the equivalent of a mid-range sedan or a luxury world tour.`;
    else insight = `Health Trajectory: Even at low volumes, the cumulative 11-minute-per-cig loss adds up to ${daysLost.toFixed(0)} full days of life lost.`;

    return { yearlyCost, totalCost, daysLost, insight };
  }, [perDay, pricePerPack, packSize, years]);

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
      seoContent={<SeoBlock title="Financial and Physical Cost of Smoking" intro="Smoking is a major drain on both lungs and wealth." faqs={[{ q: "Formula?", a: "11 minutes of life expectancy lost per cigarette." }]} />}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 surface-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">Habit Data</h3>
            <button onClick={handleShare} className="p-1 px-2 rounded-md bg-secondary text-[10px] font-bold text-muted-foreground hover:bg-destructive hover:text-white transition flex items-center gap-1">
              {copied ? <CheckCircle2 className="size-3" /> : <Share className="size-3" />}
              {copied ? "COPIED" : "SHARE"}
            </button>
          </div>
          <div className="space-y-4">
            <div><Label>Cigarettes per Day</Label><Input type="number" value={perDay} onChange={(e) => setPerDay(Number(e.target.value) || 0)} className="mt-2 text-lg font-bold" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Pack Price</Label><Input type="number" value={pricePerPack} onChange={(e) => setPricePerPack(Number(e.target.value) || 0)} className="mt-2" /></div>
              <div><Label>Pack Size</Label><Input type="number" value={packSize} onChange={(e) => setPackSize(Number(e.target.value) || 0)} className="mt-2" /></div>
            </div>
            <div><Label>Tracking Tenure (Years)</Label><Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value) || 0)} className="mt-2" /></div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <ResultGrid cols={2}>
            <ResultStat label="Total Cash Drained" value={formatCurrency(stats.totalCost)} accent />
            <ResultStat label="Life Lost" value={`${formatNumber(stats.daysLost)} Days`} sub="~11m per cigarette" className="bg-destructive text-white border-destructive" />
          </ResultGrid>

          {/* Impact Insight */}
          <div className="p-5 rounded-xl flex gap-4 items-start border-l-4 bg-destructive/5 border-destructive text-destructive">
            <div className="shrink-0 mt-0.5"><Cigarette className="size-5" /></div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Impact Insight</h4>
              <p className="text-sm opacity-90 leading-relaxed font-medium">{stats.insight}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <ResultStat label="Annual Expense" value={formatCurrency(stats.yearlyCost)} />
            <ResultStat label="Total Volume" value={formatNumber(perDay * 365 * years)} sub="Cigarettes consumed" />
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
};

export default SmokingCostCalculator;
