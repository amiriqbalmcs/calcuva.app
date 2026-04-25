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

const calc = calculatorBySlug("body-fat-percentage-calculator")!;

const BodyFatCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [units, setUnits] = useUrlState<"metric" | "imperial">("u", "metric");
  const [sex, setSex] = useUrlState<"male" | "female">("s", "male");
  const [age, setAge] = useUrlState<number>("age", 30);
  const [weight, setWeight] = useUrlState<number>("w", 75);
  const [height, setHeight] = useUrlState<number>("h", 175);
  const [neck, setNeck] = useUrlState<number>("nk", 38);
  const [waist, setWaist] = useUrlState<number>("wa", 85);
  const [hip, setHip] = useUrlState<number>("hp", 90);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const h = units === "metric" ? height / 2.54 : height;
    const w = units === "metric" ? waist / 2.54 : waist;
    const n = units === "metric" ? neck / 2.54 : neck;
    const hi = units === "metric" ? hip / 2.54 : hip;
    const wt = units === "metric" ? weight : weight * 0.453592;

    let bf = 0;
    if (sex === "male") {
      bf = 86.01 * Math.log10(Math.max(1, w - n)) - 70.041 * Math.log10(h) + 36.76;
    } else {
      bf = 163.205 * Math.log10(Math.max(1, w + hi - n)) - 97.684 * Math.log10(h) - 78.387;
    }

    if (isNaN(bf) || bf < 0) bf = 0;

    const fatMass = (wt * bf) / 100;
    const leanMass = wt - fatMass;

    let category = "—";
    let color = "text-muted-foreground";
    let insight = "";
    
    if (sex === "male") {
      if (bf < 6) { category = "Essential"; color = "text-signal"; insight = "Warning: Extremely low body fat. Essential fat is required for hormone regulation and organ protection."; }
      else if (bf < 14) { category = "Athletic"; color = "text-health"; insight = "Elite Level: Your composition is optimized for performance. Focus on nutrient intake to sustain this level."; }
      else if (bf < 25) { category = "Healthy"; color = "text-health"; insight = "Standard Range: You are within the medically advised range for long-term health and wellness."; }
      else { category = "High Risk"; color = "text-destructive"; insight = "Focus Area: High body fat is linked to metabolic risk. Focus on resistance training and a high-protein diet."; }
    } else {
      if (bf < 14) { category = "Essential"; color = "text-signal"; insight = "Warning: Below healthy levels for females. This may impact menstrual health and bone density."; }
      else if (bf < 21) { category = "Athletic"; color = "text-health"; insight = "Athletic Range: Exceptional muscle definition and low adipose tissue."; }
      else if (bf < 32) { category = "Healthy"; color = "text-health"; insight = "Optimal: Your body fat level is within the healthy demographic average."; }
      else { category = "High Risk"; color = "text-destructive"; insight = "Action Recommended: Excess fat mass can increase inflammation. Prioritize satiety-focused nutrition."; }
    }

    return { bf, fatMass, leanMass, category, color, wt, insight };
  }, [units, sex, height, neck, waist, hip, weight]);

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
          title="Understanding Body Composition"
          intro="Body fat percentage is a better indicator of health than weight alone. It distinguishes between your fat mass and your lean mass."
          sections={[{ heading: "U.S. Navy Method", icon: "book", body: <p>Widely used by the military for accuracy without expensive scans.</p> }]}
          faqs={[{ q: "Is BMI or Body Fat better?", a: "Body fat is superior for athletes as it accounts for muscle density." }]}
        />
      }
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 surface-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">Entry Stats</h3>
            <button onClick={handleShare} className="p-1 px-2 rounded-md bg-secondary text-[10px] font-bold text-muted-foreground hover:bg-health hover:text-white transition flex items-center gap-1">
              {copied ? <CheckCircle2 className="size-3" /> : <Share className="size-3" />}
              {copied ? "COPIED" : "SHARE"}
            </button>
          </div>

          <Tabs value={units} onValueChange={(v) => setUnits(v as typeof units)}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="metric">Metric</TabsTrigger>
              <TabsTrigger value="imperial">Imperial</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-2 gap-3">
            <div><Label>Sex</Label>
              <Select value={sex} onValueChange={(v) => setSex(v as typeof sex)}>
                <SelectTrigger className="mt-2 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem></SelectContent>
              </Select>
            </div>
            <div><Label>Age</Label><Input type="number" value={age} onChange={(e) => setAge(Number(e.target.value) || 0)} className="mt-2" /></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div><Label>Height ({units === "metric" ? "cm" : "in"})</Label><Input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value) || 0)} className="mt-2" /></div>
            <div><Label>Weight ({units === "metric" ? "kg" : "lb"})</Label><Input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value) || 0)} className="mt-2" /></div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div><Label>Neck</Label><Input type="number" value={neck} onChange={(e) => setNeck(Number(e.target.value) || 0)} className="mt-2" /></div>
            <div><Label>Waist</Label><Input type="number" value={waist} onChange={(e) => setWaist(Number(e.target.value) || 0)} className="mt-2" /></div>
            {sex === "female" && <div><Label>Hip</Label><Input type="number" value={hip} onChange={(e) => setHip(Number(e.target.value) || 0)} className="mt-2" /></div>}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <ResultGrid cols={2}>
            <ResultStat label="Body Fat %" value={`${result.bf.toFixed(1)}%`} sub={<span className={cn("font-bold uppercase tracking-wider text-[10px]", result.color)}>{result.category}</span>} accent />
            <ResultStat label="Lean Body Mass" value={`${result.leanMass.toFixed(1)} ${units === "metric" ? "kg" : "lb"}`} />
          </ResultGrid>

          {/* Fitness Insight */}
          <div className={cn(
            "p-5 rounded-xl flex gap-4 items-start border-l-4",
            result.category === "High Risk" ? "bg-destructive/5 border-destructive text-destructive" : "bg-health/5 border-health text-health"
          )}>
            <div className="shrink-0 mt-0.5"><UserRound className="size-5" /></div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Composition Insight</h4>
              <p className="text-sm opacity-90 leading-relaxed font-medium">{result.insight}</p>
            </div>
          </div>

          <div className="surface-card p-6">
            <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-widest font-mono">Composition Scale</h3>
            <div className="relative h-2.5 rounded-full bg-gradient-to-r from-signal via-health via-education to-destructive">
               {result.bf > 0 && (
                <div
                  className="absolute -top-1.5 size-5 rounded-full bg-foreground border-2 border-background shadow-xl"
                  style={{ left: `${Math.min(100, Math.max(0, ((result.bf - 5) / 30) * 100))}%`, transform: "translateX(-50%)" }}
                />
              )}
            </div>
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-4 uppercase tracking-tighter">
              <span>Essential</span><span>Athetic</span><span>Fitness</span><span>Average</span><span>Obese</span>
            </div>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
};

export default BodyFatCalculator;
