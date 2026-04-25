"use client";

import { useMemo, useState } from "react";
import { Share, CheckCircle2, AlertTriangle, Beer, Info } from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import { SeoBlock } from "@/components/SeoBlock";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculatorBySlug } from "@/lib/calculators";
import { useUrlState } from "@/hooks/useUrlState";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("blood-alcohol-content-calculator")!;

const BacCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [weight, setWeight] = useUrlState<number>("w", 80);
  const [sex, setSex] = useUrlState<"male" | "female">("s", "male");
  const [drinks, setDrinks] = useUrlState<number>("dk", 3);
  const [hours, setHours] = useUrlState<number>("hr", 2);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const totalAlcohol = drinks * 14; 
    const r = sex === "male" ? 0.68 : 0.55;
    const weightGrams = weight * 1000;
    
    let currentBac = (totalAlcohol / (weightGrams * r)) * 100;
    currentBac -= (hours * 0.015);
    const finalBac = Math.max(0, currentBac);
    
    let insight = "";
    if (finalBac > 0.15) insight = "Severe Intoxication: Physical control and consciousness are at high risk. Medical attention may be required in some cases.";
    else if (finalBac >= 0.08) insight = "Legal Overlimit (USA): Coordination and judgment are significantly impaired. Driving or operating machinery is dangerous and illegal.";
    else if (finalBac > 0.02) insight = "Moderate Impairment: Mood and relaxation are elevated, but reaction times are already slowing. Not safe to drive.";
    else insight = "Minimal/Zero Alcohol: You are likely within safe physiological bounds, though sensitivity varies extremely between individuals.";

    return { bac: finalBac, insight };
  }, [weight, sex, drinks, hours]);

  const timeToZero = result.bac / 0.015;

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
      seoContent={<SeoBlock title="BAC and Alcohol Safety" intro="Understand how body mass and time affect alcohol metabolism." faqs={[{ q: "Formula?", a: "Widmark formula accounts for body mass and gender distribution." }]} />}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 surface-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">Entry Data</h3>
            <button onClick={handleShare} className="p-1 px-2 rounded-md bg-secondary text-[10px] font-bold text-muted-foreground hover:bg-health hover:text-white transition flex items-center gap-1">
              {copied ? <CheckCircle2 className="size-3" /> : <Share className="size-3" />}
              {copied ? "COPIED" : "SHARE"}
            </button>
          </div>
          <div className="space-y-4">
            <div><Label>Weight (kg)</Label><Input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value) || 0)} className="mt-2" /></div>
            <div><Label>Sex</Label>
              <Select value={sex} onValueChange={(v) => setSex(v as any)}>
                <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem></SelectContent>
              </Select>
            </div>
            <div><Label>Drinks Count</Label><Input type="number" value={drinks} onChange={(e) => setDrinks(Number(e.target.value) || 0)} className="mt-2 text-lg font-bold" /></div>
            <div><Label>Hours Elapsed</Label><Input type="number" value={hours} onChange={(e) => setHours(Number(e.target.value) || 0)} className="mt-2" /></div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <ResultGrid cols={2}>
            <ResultStat label="Estimated BAC" value={`${result.bac.toFixed(3)}%`} accent />
            <ResultStat label="Time to Zero" value={`${timeToZero.toFixed(1)} hrs`} />
          </ResultGrid>

          {/* Safety Insight */}
          <div className={cn(
            "p-5 rounded-xl flex gap-4 items-start border-l-4",
            result.bac > 0.08 ? "bg-destructive/5 border-destructive text-destructive" : "bg-health/5 border-health text-health"
          )}>
            <div className="shrink-0 mt-0.5"><AlertTriangle className="size-5" /></div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Safety Insight</h4>
              <p className="text-sm opacity-90 leading-relaxed font-medium">{result.insight}</p>
            </div>
          </div>

          <div className="surface-card p-6 text-center">
             <div className="flex justify-center gap-4 mb-4">
               {Array.from({ length: Math.min(6, drinks) }).map((_, i) => <Beer key={i} className="size-6 text-health opacity-40" />)}
             </div>
             <p className="text-xs text-muted-foreground italic uppercase tracking-widest">Always enjoy responsibly. Calculation is for educational estimation only.</p>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
};

export default BacCalculator;
