"use client";

import { useMemo, useState } from "react";
import { Share, CheckCircle2, UserRound, Info } from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import { SeoBlock } from "@/components/SeoBlock";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculatorBySlug } from "@/lib/calculators";
import { useUrlState } from "@/hooks/useUrlState";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("ideal-weight-calculator")!;

const IdealWeightCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [units, setUnits] = useUrlState<"metric" | "imperial">("u", "metric");
  const [sex, setSex] = useUrlState<"male" | "female">("s", "male");
  const [height, setHeight] = useUrlState<number>("h", 175);
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    const hIn = units === "metric" ? height / 2.54 : height;
    const over5ft = Math.max(0, hIn - 60);
    let robinson, miller, devine, hamwi;
    if (sex === "male") { robinson = 52 + 1.9 * over5ft; miller = 56.2 + 1.41 * over5ft; devine = 50 + 2.3 * over5ft; hamwi = 48 + 2.7 * over5ft; }
    else { robinson = 49 + 1.7 * over5ft; miller = 53.1 + 1.36 * over5ft; devine = 45.5 + 2.3 * over5ft; hamwi = 45.5 + 2.2 * over5ft; }
    const average = (robinson + miller + devine + hamwi) / 4;
    const bmiMin = 18.5 * Math.pow(hIn * 0.0254, 2);
    const bmiMax = 24.9 * Math.pow(hIn * 0.0254, 2);
    const convert = (kg: number) => units === "metric" ? kg : kg * 2.20462;
    
    let insight = `Consensus Target: Taking the average of Robinson, Miller, Devine, and Hamwi formulas provides a balanced target of ${convert(average).toFixed(1)} ${units === "metric" ? "kg" : "lb"}. Physical frame size can adjust these targets by +/- 10%.`;

    return { robinson: convert(robinson), miller: convert(miller), devine: convert(devine), hamwi: convert(hamwi), average: convert(average), bmiMin: convert(bmiMin), bmiMax: convert(bmiMax), insight };
  }, [units, sex, height]);

  const unitText = units === "metric" ? "kg" : "lb";

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
      seoContent={<SeoBlock title="Ideal Body Weight Formulas" intro="Compare multiple medically recognized formulas to find your healthy target range." />}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 surface-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">Entry Stats</h3>
            <button onClick={handleShare} className="p-1 px-2 rounded-md bg-secondary text-[10px] font-bold text-muted-foreground hover:bg-health hover:text-white transition flex items-center gap-1">
              {copied ? <CheckCircle2 className="size-3" /> : <Share className="size-3" />}
              {copied ? "COPIED" : "SHARE"}
            </button>
          </div>
          <Tabs value={units} onValueChange={(v) => setUnits(v as any)}>
            <TabsList className="grid grid-cols-2 w-full"><TabsTrigger value="metric">Metric</TabsTrigger><TabsTrigger value="imperial">Imperial</TabsTrigger></TabsList>
          </Tabs>
          <div><Label>Sex</Label>
            <Select value={sex} onValueChange={(v) => setSex(v as any)}>
              <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem></SelectContent>
            </Select>
          </div>
          <div><Label>Height ({units === "metric" ? "cm" : "in"})</Label><Input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value) || 0)} className="mt-2 text-lg font-bold" /></div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <ResultGrid cols={2}>
            <ResultStat label="Average Target" value={`${results.average.toFixed(1)} ${unitText}`} accent />
            <ResultStat label="WHO BMI Range" value={`${results.bmiMin.toFixed(0)} – ${results.bmiMax.toFixed(0)} ${unitText}`} />
          </ResultGrid>

          <div className="p-5 rounded-xl flex gap-4 items-start border-l-4 bg-health-soft border-health text-health">
            <div className="shrink-0 mt-0.5"><UserRound className="size-5" /></div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Body Insight</h4>
              <p className="text-sm opacity-90 leading-relaxed font-medium">{results.insight}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[ {l: "Robinson", v: results.robinson}, {l: "Miller", v: results.miller}, {l: "Devine", v: results.devine}, {l: "Hamwi", v: results.hamwi} ].map(f => (
              <div key={f.l} className="surface-card p-4">
                <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">{f.l}</div>
                <div className="text-lg font-bold">{f.v.toFixed(1)} <span className="text-xs opacity-60">{unitText}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
};

export default IdealWeightCalculator;
