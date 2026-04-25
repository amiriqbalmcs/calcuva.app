"use client";

import { useMemo, useState } from "react";
import { Share, CheckCircle2, AlertCircle, Info, Target, Scale } from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import { SeoBlock } from "@/components/SeoBlock";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculatorBySlug } from "@/lib/calculators";
import { formatNumber } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("bmi-tdee-calculator")!;

const ACTIVITY = {
  sedentary: { label: "Sedentary (little/no exercise)", mult: 1.2 },
  light: { label: "Light (1–3 days/week)", mult: 1.375 },
  moderate: { label: "Moderate (3–5 days/week)", mult: 1.55 },
  active: { label: "Active (6–7 days/week)", mult: 1.725 },
  athlete: { label: "Athlete (2x/day)", mult: 1.9 },
};

const BmiTdeeCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [units, setUnits] = useUrlState<"metric" | "imperial">("u", "metric");
  const [age, setAge] = useUrlState<number>("age", 30);
  const [sex, setSex] = useUrlState<"male" | "female">("s", "male");
  const [heightCm, setHeightCm] = useUrlState<number>("h", 175);
  const [weightKg, setWeightKg] = useUrlState<number>("w", 72);
  const [heightFt, setHeightFt] = useUrlState<number>("ft", 5);
  const [heightIn, setHeightIn] = useUrlState<number>("in", 9);
  const [weightLb, setWeightLb] = useUrlState<number>("lb", 160);
  const [activity, setActivity] = useUrlState<keyof typeof ACTIVITY>("act", "moderate");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const h = units === "metric" ? heightCm : (heightFt * 12 + heightIn) * 2.54;
    const w = units === "metric" ? weightKg : weightLb * 0.453592;
    const bmi = h > 0 ? w / Math.pow(h / 100, 2) : 0;
    const bmr = sex === "male"
      ? 10 * w + 6.25 * h - 5 * age + 5
      : 10 * w + 6.25 * h - 5 * age - 161;
    const tdee = bmr * ACTIVITY[activity].mult;
    
    // Ideal range calculation (18.5 - 25)
    const minIdealWeight = 18.5 * Math.pow(h / 100, 2);
    const maxIdealWeight = 25 * Math.pow(h / 100, 2);
    
    let category = "—";
    let categoryColor = "text-muted-foreground";
    let insight = "";
    let goalText = "";
    
    if (bmi < 18.5) { 
      category = "Underweight"; 
      categoryColor = "text-utility"; 
      const diff = minIdealWeight - w;
      goalText = `Gain ${units === "metric" ? `${diff.toFixed(1)}kg` : `${(diff * 2.20462).toFixed(1)}lb`} for healthy range.`;
      insight = `You are currently below the healthy range. Focusing on a ${formatNumber(tdee + 300)}kcal 'lean bulk' diet with consistent resistance training is recommended.`;
    }
    else if (bmi < 25) { 
      category = "Normal"; 
      categoryColor = "text-health"; 
      goalText = "You are currently in the healthy weight range.";
      insight = "Excellent metabolic balance. Maintaining current activity and caloric intake will keep your biomarkers optimized.";
    }
    else if (bmi < 30) { 
      category = "Overweight"; 
      categoryColor = "text-education"; 
      const diff = w - maxIdealWeight;
      goalText = `Lose ${units === "metric" ? `${diff.toFixed(1)}kg` : `${(diff * 2.20462).toFixed(1)}lb`} for healthy range.`;
      insight = `You are in the overweight category. A sustainable calorie target of ${formatNumber(tdee - 500)}kcal will help you lose ~0.5kg per week.`;
    }
    else { 
      category = "Obese"; 
      categoryColor = "text-destructive"; 
      const diff = w - maxIdealWeight;
      goalText = `Minimum loss of ${units === "metric" ? `${diff.toFixed(1)}kg` : `${(diff * 2.20462).toFixed(1)}lb`} needed.`;
      insight = "Higher metabolic risk detected. Consistent deficit and consulting with a healthcare professional for a tailored plan is advised.";
    }
    
    return { bmi, bmr, tdee, category, categoryColor, insight, goalText, minIdealWeight, maxIdealWeight };
  }, [units, age, sex, heightCm, weightKg, heightFt, heightIn, weightLb, activity]);

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
          title="Biological Performance Tuning" 
          intro="Calculate your metabolic baseline and daily sustainable calorie targets." 
          faqs={[
            { q: "What is BMR?", a: "BMR stands for Basal Metabolic Rate. It is the number of calories your body needs to maintain basic life functions (breathing, circulation) while at complete rest." },
            { q: "How is TDEE different from BMR?", a: "TDEE (Total Daily Energy Expenditure) is your BMR plus the calories you burn through physical activity throughout the day. It is the total number of calories you burn daily." },
            { q: "Is BMI an accurate measure of health?", a: "BMI is a useful screening tool for the general population to identify potential weight issues. However, it does not distinguish between muscle and fat mass, meaning athletes may have a high BMI despite low body fat." }
          ]}
        />
      }
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 surface-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Biometrics</h3>
            <button onClick={handleShare} className="p-1 px-2 rounded-md bg-secondary text-[10px] font-bold text-muted-foreground hover:bg-health hover:text-white transition flex items-center gap-1 font-mono">
              {copied ? <CheckCircle2 className="size-3" /> : <Share className="size-3" />}
              {copied ? "COPIED" : "SHARE"}
            </button>
          </div>

          <Tabs value={units} onValueChange={(v) => setUnits(v as any)}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="metric">Metric</TabsTrigger>
              <TabsTrigger value="imperial">Imperial</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Age</Label><Input type="number" value={age} onChange={(e) => setAge(Number(e.target.value) || 0)} className="mt-2" /></div>
              <div><Label>Sex</Label>
                <Select value={sex} onValueChange={(v) => setSex(v as any)}>
                  <SelectTrigger className="mt-2 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem></SelectContent>
                </Select>
              </div>
            </div>

            {units === "metric" ? (
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Height (cm)</Label><Input type="number" value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value) || 0)} className="mt-2" /></div>
                <div><Label>Weight (kg)</Label><Input type="number" value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value) || 0)} className="mt-2" /></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Height (ft)</Label><Input type="number" value={heightFt} onChange={(e) => setHeightFt(Number(e.target.value) || 0)} className="mt-2" /></div>
                  <div><Label>(in)</Label><Input type="number" value={heightIn} onChange={(e) => setHeightIn(Number(e.target.value) || 0)} className="mt-2" /></div>
                </div>
                <div><Label>Weight (lb)</Label><Input type="number" value={weightLb} onChange={(e) => setWeightLb(Number(e.target.value) || 0)} className="mt-2" /></div>
              </div>
            )}

            <div><Label>Activity Level</Label>
              <Select value={activity} onValueChange={(v) => setActivity(v as any)}>
                <SelectTrigger className="mt-2 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{Object.entries(ACTIVITY).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <ResultGrid cols={3}>
            <ResultStat label="Body Mass Index" value={result.bmi.toFixed(1)} sub={result.category} accent />
            <ResultStat label="Resting BMR" value={`${formatNumber(result.bmr)}`} sub="kcal/day" />
            <ResultStat label="Maintenance" value={`${formatNumber(result.tdee)}`} sub="kcal/day" />
          </ResultGrid>

          <div className={cn("p-5 rounded-xl flex gap-4 items-start border-l-4", 
            result.bmi < 18.5 && "bg-utility-soft border-utility text-utility",
            result.bmi >= 18.5 && result.bmi < 25 && "bg-health-soft border-health text-health",
            result.bmi >= 25 && result.bmi < 30 && "bg-amber-500/10 border-amber-500 text-amber-500",
            result.bmi >= 30 && "bg-destructive-soft border-destructive text-destructive"
          )}>
            <div className="shrink-0 mt-0.5"><Scale className="size-5" /></div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Health Milestone</h4>
              <p className="text-sm opacity-90 leading-relaxed font-medium">{result.goalText} {result.insight}</p>
            </div>
          </div>

          <div className="surface-card p-6">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono mb-6">Calorie Target Stratification</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Extreme Cut", v: result.tdee - 800, color: "text-destructive" },
                { label: "Fat Loss", v: result.tdee - 500, color: "text-amber-500" },
                { label: "Maintenance", v: result.tdee, color: "text-health" },
                { label: "Muscle Bulk", v: result.tdee + 300, color: "text-utility" },
              ].map((t) => (
                <div key={t.label} className="bg-secondary/50 rounded-xl p-4 border border-border/50">
                  <div className="text-[9px] uppercase font-bold text-muted-foreground mb-1">{t.label}</div>
                  <div className={cn("text-xl font-mono font-bold", t.color)}>{formatNumber(t.v)}</div>
                  <div className="text-[10px] opacity-60">kcal / day</div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-6">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono mb-4">BMI Clinical Spectrum</h3>
            <div className="relative h-2.5 rounded-full bg-gradient-to-r from-utility via-health to-destructive">
              <div
                className="absolute -top-1.5 size-5 rounded-full bg-foreground border-2 border-background shadow-xl"
                style={{ left: `${Math.min(100, Math.max(0, ((result.bmi - 15) / 25) * 100))}%`, transform: "translateX(-50%)" }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-3 uppercase tracking-tighter">
              <span>15 (Under)</span><span>18.5 (Normal)</span><span>25 (Overweight)</span><span>30 (Obese)</span>
            </div>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
};

export default BmiTdeeCalculator;
