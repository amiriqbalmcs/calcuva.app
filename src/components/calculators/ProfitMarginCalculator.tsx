"use client";

import { useMemo, useState } from "react";
import { Share, CheckCircle2, TrendingUp, Info } from "lucide-react";
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

const calc = calculatorBySlug("profit-margin-calculator")!;

const ProfitMarginCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [cost, setCost] = useUrlState<number>("c", 60);
  const [revenue, setRevenue] = useUrlState<number>("rv", 100);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const profit = revenue - cost;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    const markup = cost > 0 ? (profit / cost) * 100 : 0;
    
    let insight = "";
    if (margin > 50) insight = "High Value Proposition: Your margins are exceptional. This suggests a premium brand position or highly efficient sourcing.";
    else if (margin > 20) insight = "Healthy Business: A 20%+ margin is standard for sustainable retail. Ensure your overheads don't creep above 10-15%.";
    else if (margin > 0) insight = "Tight Margins: High volume is required to stay profitable. Consider bundling or optimizing supplier costs.";
    else insight = "Operating at Loss: Your cost exceeds your selling price. Review your pricing strategy immediately.";

    return { profit, margin, markup, insight };
  }, [cost, revenue]);

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
          title="Margin vs Markup"
          intro="Margin is the profit share of the selling price; Markup is the percentage added to costs."
          sections={[{ heading: "The Formula", body: <p>Margin = (Revenue - Cost) / Revenue. Markup = (Revenue - Cost) / Cost.</p> }]}
          faqs={[{ q: "Can margin be 100%?", a: "Only if your costs are zero." }]}
        />
      }
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 surface-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">Pricing Model</h3>
            <button onClick={handleShare} className="p-1 px-2 rounded-md bg-secondary text-[10px] font-bold text-muted-foreground hover:bg-business hover:text-white transition flex items-center gap-1">
              {copied ? <CheckCircle2 className="size-3" /> : <Share className="size-3" />}
              {copied ? "COPIED" : "SHARE"}
            </button>
          </div>

          <div className="space-y-6">
            <div><Label>Unit Cost</Label><Input type="number" value={cost} onChange={(e) => setCost(Number(e.target.value) || 0)} className="mt-2" />
              <Slider value={[cost]} min={1} max={10000} step={1} onValueChange={([v]) => setCost(v)} className="mt-4" />
            </div>
            <div><Label>Selling Price</Label><Input type="number" value={revenue} onChange={(e) => setRevenue(Number(e.target.value) || 0)} className="mt-2" />
              <Slider value={[revenue]} min={1} max={20000} step={1} onValueChange={([v]) => setRevenue(v)} className="mt-4" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <ResultGrid cols={2}>
            <ResultStat label="Gross Margin" value={`${result.margin.toFixed(1)}%`} accent />
            <ResultStat label="Gross Profit" value={formatCurrency(result.profit)} />
          </ResultGrid>

          {/* Business Insight */}
          <div className="p-5 rounded-xl flex gap-4 items-start border-l-4 bg-business-soft border-business text-business">
            <div className="shrink-0 mt-0.5"><TrendingUp className="size-5" /></div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Business Insight</h4>
              <p className="text-sm opacity-90 leading-relaxed font-medium">{result.insight}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <ResultStat label="Markup" value={`${result.markup.toFixed(1)}%`} />
            <ResultStat label="Cost Ratio" value={`${((cost / (revenue || 1)) * 100).toFixed(1)}%`} />
          </div>

          <div className="surface-card p-6">
            <h3 className="text-sm font-semibold mb-6 text-muted-foreground uppercase tracking-widest font-mono">Composition</h3>
            <div className="flex h-10 rounded-xl overflow-hidden shadow-sm">
              <div 
                className="bg-muted flex items-center justify-center text-[10px] font-mono font-bold text-muted-foreground transition-all truncate px-2"
                style={{ width: `${(cost / (revenue || 1)) * 100}%` }}
              >
                COST: {((cost / (revenue || 1)) * 100).toFixed(0)}%
              </div>
              <div 
                className="bg-business text-white flex items-center justify-center text-[10px] font-mono font-bold transition-all truncate px-2"
                style={{ width: `${(result.profit / (revenue || 1)) * 100}%` }}
              >
                PROFIT: {result.margin.toFixed(0)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
};

export default ProfitMarginCalculator;
