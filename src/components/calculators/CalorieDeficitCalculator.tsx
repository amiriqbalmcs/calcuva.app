"use client";

import { useMemo, useState } from "react";
import { Copy, CheckCircle2, Target, CalendarDays, ActivitySquare, TrendingDown } from "lucide-react";
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

const calc = calculatorBySlug("calorie-deficit-calculator")!;

const ACTIVITY = {
  sedentary: { label: "Sedentary (little/no exercise)", mult: 1.2 },
  light: { label: "Light (1–3 days/week)", mult: 1.375 },
  moderate: { label: "Moderate (3–5 days/week)", mult: 1.55 },
  active: { label: "Active (6–7 days/week)", mult: 1.725 },
  athlete: { label: "Athlete (2x/day)", mult: 1.9 },
};

const CalorieDeficitCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [units, setUnits] = useUrlState<"metric" | "imperial">("u", "imperial");
  const [age, setAge] = useUrlState<number>("age", 30);
  const [sex, setSex] = useUrlState<"male" | "female">("s", "female");
  const [heightCm, setHeightCm] = useUrlState<number>("h", 165);
  const [weightKg, setWeightKg] = useUrlState<number>("w", 75);
  const [targetWeightKg, setTargetWeightKg] = useUrlState<number>("tw", 65);
  const [heightFt, setHeightFt] = useUrlState<number>("ft", 5);
  const [heightIn, setHeightIn] = useUrlState<number>("in", 5);
  const [weightLb, setWeightLb] = useUrlState<number>("lb", 165);
  const [targetWeightLb, setTargetWeightLb] = useUrlState<number>("tlb", 145);
  const [activity, setActivity] = useUrlState<keyof typeof ACTIVITY>("act", "moderate");
  const [pace, setPace] = useUrlState<number>("pace", 1); // 1 for 1lb/week or 0.5kg/week normal
  const [copied, setCopied] = useState(false);

  // Constants
  const KCAL_PER_KG_FAT = 7700;
  const KCAL_PER_LB_FAT = 3500;

  const result = useMemo(() => {
    const h = units === "metric" ? heightCm : (heightFt * 12 + heightIn) * 2.54;
    const currentW = units === "metric" ? weightKg : weightLb * 0.453592;
    const targetW = units === "metric" ? targetWeightKg : targetWeightLb * 0.453592;
    
    // BMR using Mifflin-St Jeor Equation
    const bmr = sex === "male"
      ? 10 * currentW + 6.25 * h - 5 * age + 5
      : 10 * currentW + 6.25 * h - 5 * age - 161;
      
    const tdee = Math.round(bmr * ACTIVITY[activity].mult);
    
    // Pace definitions
    // pace index 0.5 = mild, 1 = normal, 1.5 = aggressive, 2 = extreme
    // In metric: 0.25kg, 0.5kg, 0.75kg, 1kg per week
    // In imperial: 0.5lb, 1lb, 1.5lb, 2lb per week
    let dailyDeficit = 0;
    let weightToLoseKg = currentW - targetW;
    
    if (weightToLoseKg <= 0) {
      weightToLoseKg = 0;
    }
    
    if (units === "metric") {
       const kgPerWeek = pace * 0.5; // pace=1 -> 0.5kg/week
       dailyDeficit = Math.round((kgPerWeek * KCAL_PER_KG_FAT) / 7);
    } else {
       const lbPerWeek = pace * 1; // pace=1 -> 1lb/week
       dailyDeficit = Math.round((lbPerWeek * KCAL_PER_LB_FAT) / 7);
    }

    const targetCalories = tdee - dailyDeficit;
    
    // Safety check - women shouldn't drop below 1200, men 1500 typically without supervision
    const safeMin = sex === "female" ? 1200 : 1500;
    let isUnsafe = targetCalories < safeMin;
    
    // Time to goal
    const totalDeficitNeeded = weightToLoseKg * KCAL_PER_KG_FAT;
    const daysToGoal = dailyDeficit > 0 ? Math.ceil(totalDeficitNeeded / dailyDeficit) : 0;
    
    // Date formatting
    const goalDate = new Date();
    goalDate.setDate(goalDate.getDate() + daysToGoal);
    
    return {
      tdee,
      dailyDeficit,
      targetCalories,
      daysToGoal,
      goalDate: goalDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      isUnsafe,
      safeMin,
      weightToLose: units === "metric" ? weightToLoseKg : weightToLoseKg * 2.20462
    };
  }, [units, age, sex, heightCm, weightKg, targetWeightKg, heightFt, heightIn, weightLb, targetWeightLb, activity, pace]);

  const handleCopy = () => {
    let resultText = `Calorie Deficit Calculator Results:\nMaintenance (TDEE): ${formatNumber(result.tdee)} kcal/day\nDaily Target: ${formatNumber(result.targetCalories)} kcal/day\nDaily Deficit: -${formatNumber(result.dailyDeficit)} kcal\nEstimated Goal Date: ${result.goalDate}\nCalculated on Calcuva.app`;
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm mt-0 lg:mt-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
               <ActivitySquare className="size-5 text-signal" />
               Your Profile
            </h2>

            <Tabs value={units} onValueChange={(v) => setUnits(v as any)} className="mb-6">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="imperial">Imperial</TabsTrigger>
                <TabsTrigger value="metric">Metric</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Age</Label><Input type="number" min={1} value={age || ""} onChange={(e) => setAge(Number(e.target.value) || 0)} className="mt-2" /></div>
                <div><Label>Sex</Label>
                  <Select value={sex} onValueChange={(v) => setSex(v as any)}>
                    <SelectTrigger className="mt-2 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>

              {units === "metric" ? (
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Height (cm)</Label><Input type="number" min={1} value={heightCm || ""} onChange={(e) => setHeightCm(Number(e.target.value) || 0)} className="mt-2" /></div>
                  <div><Label>Current (kg)</Label><Input type="number" min={1} value={weightKg || ""} onChange={(e) => setWeightKg(Number(e.target.value) || 0)} className="mt-2" /></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Height (ft)</Label><Input type="number" min={1} value={heightFt || ""} onChange={(e) => setHeightFt(Number(e.target.value) || 0)} className="mt-2" /></div>
                    <div><Label>(in)</Label><Input type="number" min={0} value={heightIn || ""} onChange={(e) => setHeightIn(Number(e.target.value) || 0)} className="mt-2" /></div>
                  </div>
                  <div><Label>Current Weight (lb)</Label><Input type="number" min={1} value={weightLb || ""} onChange={(e) => setWeightLb(Number(e.target.value) || 0)} className="mt-2" /></div>
                </div>
              )}

              <div><Label>Target Weight ({units === "metric" ? "kg" : "lb"})</Label>
                <Input 
                  type="number" 
                  min={1} 
                  value={units === "metric" ? targetWeightKg || "" : targetWeightLb || ""} 
                  onChange={(e) => units === "metric" ? setTargetWeightKg(Number(e.target.value) || 0) : setTargetWeightLb(Number(e.target.value) || 0)} 
                  className="mt-2 font-bold text-signal" 
                />
              </div>

              <div><Label>Activity Level</Label>
                <Select value={activity} onValueChange={(v) => setActivity(v as any)}>
                  <SelectTrigger className="mt-2 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.entries(ACTIVITY).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              
              <div className="pt-2 border-t border-border">
                  <Label>Weight Loss Pace</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                     <button onClick={() => setPace(0.5)} className={cn("py-2 px-2 text-[11px] rounded-xl border transition-all", pace === 0.5 ? "bg-signal text-white border-signal font-bold" : "bg-secondary text-muted-foreground hover:bg-secondary/80")}>Mild<br/><span className="font-normal opacity-80">{units === "metric" ? "0.25 kg/wk" : "0.5 lb/wk"}</span></button>
                     <button onClick={() => setPace(1)} className={cn("py-2 px-2 text-[11px] rounded-xl border transition-all", pace === 1 ? "bg-signal text-white border-signal font-bold" : "bg-secondary text-muted-foreground hover:bg-secondary/80")}>Normal<br/><span className="font-normal opacity-80">{units === "metric" ? "0.5 kg/wk" : "1 lb/wk"}</span></button>
                     <button onClick={() => setPace(1.5)} className={cn("py-2 px-2 text-[11px] rounded-xl border transition-all", pace === 1.5 ? "bg-signal text-white border-signal font-bold" : "bg-secondary text-muted-foreground hover:bg-secondary/80")}>Fast<br/><span className="font-normal opacity-80">{units === "metric" ? "0.75 kg/wk" : "1.5 lb/wk"}</span></button>
                     <button onClick={() => setPace(2)} className={cn("py-2 px-2 text-[11px] rounded-xl border transition-all", pace === 2 ? "bg-signal text-white border-signal font-bold" : "bg-secondary text-muted-foreground hover:bg-secondary/80")}>Extreme<br/><span className="font-normal opacity-80">{units === "metric" ? "1 kg/wk" : "2 lb/wk"}</span></button>
                  </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <ResultGrid>
            <ResultStat 
              label="Daily Calorie Target" 
              value={`${formatNumber(result.targetCalories)}`} 
              sub="kcal/day"
              className={cn("col-span-2 sm:col-span-2 pt-6 pb-8", result.isUnsafe ? "bg-destructive/10 border-destructive" : "bg-health-soft border-health/20")} 
              valueClassName={result.isUnsafe ? "text-destructive text-4xl sm:text-5xl" : "text-health text-4xl sm:text-5xl"} 
            />
            
            <ResultStat 
              label="Maintenance (TDEE)" 
              value={`${formatNumber(result.tdee)}`} 
              sub="kcal/day"
            />
            
            <ResultStat 
              label="Daily Deficit" 
              value={`-${formatNumber(result.dailyDeficit)}`} 
              sub="kcal/day"
              valueClassName="text-amber-500"
            />
            
            <div className="col-span-2 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="bg-secondary/30 border border-border rounded-2xl p-5 flex flex-col justify-center">
                  <div className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5 mb-2"><TrendingDown className="size-4 text-signal" /> Total to Lose</div>
                  <div className="text-2xl font-bold font-mono">{formatNumber(result.weightToLose)} <span className="text-sm font-sans font-normal text-muted-foreground">{units === "metric" ? "kg" : "lbs"}</span></div>
               </div>
               <div className="bg-secondary/30 border border-border rounded-2xl p-5 flex flex-col justify-center">
                  <div className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5 mb-2"><CalendarDays className="size-4 text-signal" /> Est. Goal Date</div>
                  {result.weightToLose <= 0 ? (
                     <div className="text-xl font-bold font-mono text-health">Goal Reached!</div>
                  ) : (
                     <div className="text-2xl font-bold font-mono">{result.goalDate}</div>
                  )}
               </div>
            </div>

            <div className="col-span-2 pt-2">
              <button onClick={handleCopy} className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-secondary text-sm font-bold text-foreground hover:bg-secondary/80 transition-all hover:scale-[0.99] active:scale-95">
                {copied ? <><CheckCircle2 className="size-5 text-green-500" /> Copied</> : <><Copy className="size-5" /> Copy Diet Plan</>}
              </button>
            </div>
          </ResultGrid>
          
          {result.isUnsafe && (
            <div className="p-4 rounded-xl flex gap-3 items-start border-l-4 bg-destructive/10 border-destructive text-destructive">
               <div className="shrink-0 mt-0.5"><Target className="size-5" /></div>
               <div>
                 <h4 className="font-bold text-sm">Aggressive Deficit Warning</h4>
                 <p className="text-xs opacity-90 leading-relaxed font-medium mt-1">Your target is below {result.safeMin} calories. Medical professionals generally advise against dropping below {result.safeMin} kcal/day for {sex}s as it is difficult to get adequate nutrition. Try selecting a slower pace or increasing light activity.</p>
               </div>
            </div>
           )}
        </div>
      </div>
      
    </CalculatorPage>
  );
}

export default CalorieDeficitCalculator;
