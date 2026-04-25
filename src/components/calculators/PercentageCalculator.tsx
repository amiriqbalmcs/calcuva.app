"use client";

import { useMemo, useState } from "react";
import { Share, CheckCircle2, Percent, Info } from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import { SeoBlock } from "@/components/SeoBlock";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculatorBySlug } from "@/lib/calculators";
import { formatNumber } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("percentage-increase-calculator")!;

const PercentageCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [mode, setMode] = useUrlState<"of" | "diff" | "change">("m", "of");
  const [ofP, setOfP] = useUrlState<number>("p1", 20);
  const [ofV, setOfV] = useUrlState<number>("v1", 500);
  const [dx, setDx] = useUrlState<number>("p2", 50);
  const [dy, setDy] = useUrlState<number>("v2", 200);
  const [c1, setC1] = useUrlState<number>("v3", 100);
  const [c2, setC2] = useUrlState<number>("v4", 150);
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    if (mode === "of") return { val: (ofP/100)*ofV, label: `${ofP}% of ${ofV}` };
    if (mode === "diff") return { val: (dx/(dy||1))*100, label: `${dx} is % of ${dy}` };
    if (mode === "change") return { val: ((c2-c1)/Math.abs(c1||1))*100, label: `Change from ${c1} to ${c2}` };
    return { val: 0, label: "" };
  }, [mode, ofP, ofV, dx, dy, c1, c2]);

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
      seoContent={<SeoBlock title="Percentage Calculations" intro="From discounts to stock growth, percentages are the language of comparison." faqs={[{ q: "Rule of thumb?", a: "'Of' usually means multiply." }]} />}
    >
      <div className="flex justify-between items-center mb-6">
        <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
          <TabsList className="grid grid-cols-3 w-full max-w-sm">
            <TabsTrigger value="of">Value Of %</TabsTrigger>
            <TabsTrigger value="diff">Is what %?</TabsTrigger>
            <TabsTrigger value="change">% Change</TabsTrigger>
          </TabsList>
        </Tabs>
        <button onClick={handleShare} className="p-1 px-3 rounded-md bg-secondary text-[10px] font-bold text-muted-foreground hover:bg-education hover:text-white transition flex items-center gap-2">
          {copied ? <CheckCircle2 className="size-3" /> : <Share className="size-3" />}
          {copied ? "COPIED" : "SHARE"}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="surface-card p-6 py-8">
          {mode === "of" && (
            <div className="flex items-center gap-4"><div className="flex-1"><Label>Percentage %</Label><Input type="number" value={ofP} onChange={(e) => setOfP(Number(e.target.value) || 0)} className="mt-2 text-xl font-bold" /></div>
            <div className="pt-6 font-bold text-muted-foreground">OF</div>
            <div className="flex-1"><Label>Base Value</Label><Input type="number" value={ofV} onChange={(e) => setOfV(Number(e.target.value) || 0)} className="mt-2 text-xl font-bold" /></div></div>
          )}
          {mode === "diff" && (
            <div className="flex items-center gap-4"><div className="flex-1"><Label>Value A</Label><Input type="number" value={dx} onChange={(e) => setDx(Number(e.target.value) || 0)} className="mt-2 text-xl font-bold" /></div>
            <div className="pt-6 font-bold text-muted-foreground">AS % OF</div>
            <div className="flex-1"><Label>Base Value B</Label><Input type="number" value={dy} onChange={(e) => setDy(Number(e.target.value) || 0)} className="mt-2 text-xl font-bold" /></div></div>
          )}
          {mode === "change" && (
            <div className="flex items-center gap-4"><div className="flex-1"><Label>From</Label><Input type="number" value={c1} onChange={(e) => setC1(Number(e.target.value) || 0)} className="mt-2 text-xl font-bold" /></div>
            <div className="pt-6 font-bold text-muted-foreground">TO</div>
            <div className="flex-1"><Label>Final Value</Label><Input type="number" value={c2} onChange={(e) => setC2(Number(e.target.value) || 0)} className="mt-2 text-xl font-bold" /></div></div>
          )}
        </div>

        <div className="space-y-6">
          <ResultStat label={results.label} value={mode === "of" ? formatNumber(results.val, 2) : `${formatNumber(results.val, 2)}%`} accent />
          <div className="p-5 rounded-xl flex gap-4 items-start border-l-4 bg-education-soft border-education text-education">
            <div className="shrink-0 mt-0.5"><Percent className="size-5" /></div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Percentage Insight</h4>
              <p className="text-sm opacity-90 leading-relaxed font-medium">
                {mode === "change" ? (results.val >= 0 ? `Your value has increased by ${results.val.toFixed(1)}%.` : `Your value has decreased by ${Math.abs(results.val).toFixed(1)}%.`) : "This calculation represents the direct proportion between the two values."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
};

export default PercentageCalculator;
