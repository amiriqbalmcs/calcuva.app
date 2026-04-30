"use client";

import { useMemo, useState } from "react";
import { 
  Share, CheckCircle2, AlertCircle, Info, Target, Scale, Zap, 
  Activity, Flame, TrendingUp, User as UserIcon, History, Landmark, 
  Globe, Ruler, Gauge, Sparkles, LayoutDashboard, Settings2, Copy,
  Dna, HeartPulse, ChevronRight, Weight
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculatorBySlug } from "@/lib/calculators";
import { formatNumber } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { SITE_DOMAIN } from "@/lib/constants";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("bmi-tdee-calculator")!;

const ACTIVITY = {
  sedentary: { label: "Little to no exercise", mult: 1.2 },
  light: { label: "Light exercise (1–3 days/week)", mult: 1.375 },
  moderate: { label: "Moderate exercise (3–5 days/week)", mult: 1.55 },
  active: { label: "Hard exercise (6–7 days/week)", mult: 1.725 },
  athlete: { label: "Very hard exercise (twice a day)", mult: 1.9 },
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
    
    const minIdealWeight = 18.5 * Math.pow(h / 100, 2);
    const maxIdealWeight = 25 * Math.pow(h / 100, 2);
    
    let category = "—";
    let categoryColor = "text-muted-foreground";
    let insight = "";
    let goalText = "";
    
    if (bmi < 18.5) { 
      category = "Underweight"; 
      categoryColor = "text-amber-500"; 
      const diff = minIdealWeight - w;
      goalText = `You should aim to gain around ${units === "metric" ? `${diff.toFixed(1)}kg` : `${(diff * 2.20462).toFixed(1)}lb`} to reach a healthy weight range.`;
      insight = `Try eating more healthy calories (${formatNumber(tdee + 300)} kcal) and doing some light strength training.`;
    }
    else if (bmi < 25) { 
      category = "Healthy"; 
      categoryColor = "text-health"; 
      goalText = "Your weight is in a healthy range for your height.";
      insight = "Maintain your current weight by eating a balanced diet and staying active.";
    }
    else if (bmi < 30) { 
      category = "Overweight"; 
      categoryColor = "text-amber-500"; 
      const diff = w - maxIdealWeight;
      goalText = `You should aim to lose around ${units === "metric" ? `${diff.toFixed(1)}kg` : `${(diff * 2.20462).toFixed(1)}lb`} to reach your healthy weight.`;
      insight = `Try to eat around ${formatNumber(tdee - 500)} kcal per day to help lose fat at a steady pace.`;
    }
    else { 
      category = "Obese"; 
      categoryColor = "text-destructive"; 
      const diff = w - maxIdealWeight;
      goalText = `A weight loss of ${units === "metric" ? `${diff.toFixed(1)}kg` : `${(diff * 2.20462).toFixed(1)}lb`} is recommended for better health.`;
      insight = "We recommend speaking with a health professional to create a safe and effective plan.";
    }
    
    return { bmi, bmr, tdee, category, categoryColor, insight, goalText, minIdealWeight, maxIdealWeight };
  }, [units, age, sex, heightCm, weightKg, heightFt, heightIn, weightLb, activity]);

  const handleCopy = () => {
    const resultText = `Body Stats: BMI ${result.bmi.toFixed(1)} (${result.category}) | Calories needed: ${formatNumber(result.tdee)} kcal. Track at ${window.location.href}`;
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        
        {/* Input Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="surface-card p-6 md:p-8 space-y-10 bg-secondary/5 border-border/40 relative overflow-hidden group">
            <Settings2 className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
            
            <div className="space-y-1 relative z-10">
              <h3 className="text-sm font-bold tracking-tight">Your Details</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Body Measurements</p>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Unit Switcher */}
              <div className="flex bg-background border border-border/60 p-1 rounded-xl h-11">
                <button onClick={() => setUnits("metric")} className={cn("flex-1 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all", units === 'metric' ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary/40")}>Metric</button>
                <button onClick={() => setUnits("imperial")} className={cn("flex-1 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all", units === 'imperial' ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary/40")}>Imperial</button>
              </div>

              {/* Age & Sex */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Age</Label>
                  <Input type="number" value={age} onChange={(e) => setAge(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm" />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Sex</Label>
                  <Select value={sex} onValueChange={(v) => setSex(v as any)}>
                    <SelectTrigger className="h-11 bg-background border-border/60 font-bold text-[10px] uppercase tracking-widest rounded-xl shadow-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/40">
                      <SelectItem value="male" className="text-[10px] font-bold uppercase">Male</SelectItem>
                      <SelectItem value="female" className="text-[10px] font-bold uppercase">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Height & Weight */}
              {units === "metric" ? (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Height (cm)</Label>
                      <span className="text-[10px] font-bold text-health">{heightCm}</span>
                    </div>
                    <div className="relative group">
                      <Input type="number" value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm pr-12" />
                      <Ruler className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                    </div>
                    <Slider value={[heightCm]} min={100} max={250} step={1} onValueChange={([v]) => setHeightCm(v)} />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Weight (kg)</Label>
                      <span className="text-[10px] font-bold text-health">{weightKg}</span>
                    </div>
                    <div className="relative group">
                      <Input type="number" value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm pr-12" />
                      <Weight className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                    </div>
                    <Slider value={[weightKg]} min={30} max={250} step={1} onValueChange={([v]) => setWeightKg(v)} />
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase">Feet</Label>
                      <Input type="number" value={heightFt} onChange={(e) => setHeightFt(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase">Inches</Label>
                      <Input type="number" value={heightIn} onChange={(e) => setHeightIn(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Weight (lb)</Label>
                      <span className="text-[10px] font-bold text-health">{weightLb}</span>
                    </div>
                    <Input type="number" value={weightLb} onChange={(e) => setWeightLb(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm pr-12" />
                    <Slider value={[weightLb]} min={50} max={600} step={1} onValueChange={([v]) => setWeightLb(v)} />
                  </div>
                </div>
              )}

              {/* Activity */}
              <div className="space-y-3 pt-2 border-t border-border/40">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Activity Level</Label>
                <Select value={activity} onValueChange={(v) => setActivity(v as any)}>
                  <SelectTrigger className="h-11 bg-background border-border/60 font-bold text-[10px] uppercase tracking-widest rounded-xl shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/40">
                    {Object.entries(ACTIVITY).map(([k, v]) => (
                      <SelectItem key={k} value={k} className="text-[10px] font-bold uppercase tracking-widest">
                        {v.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="surface-card p-6 border-border/30 bg-health/5 relative overflow-hidden group">
            <HeartPulse className="absolute -bottom-4 -right-4 size-20 text-health/5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1 text-health">
                <Dna className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Health Tip</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {result.goalText} {result.insight}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Executive Summary */}
          <div className="surface-card p-8 md:p-10 space-y-10 bg-background border-border/60 shadow-md relative overflow-hidden group">
            <UserIcon className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Activity className="size-3" />
                    Body Mass Index (BMI)
                  </div>
                  <div className={cn("text-5xl md:text-6xl font-mono font-bold tracking-tighter tabular-nums", result.categoryColor)}>
                    {result.bmi.toFixed(1)} <span className="text-xl md:text-2xl opacity-40 uppercase tracking-widest font-sans font-bold">{result.category}</span>
                  </div>
                </div>
                <button 
                  onClick={handleCopy} 
                  className={cn(
                    "p-3 rounded-xl transition-all border shadow-sm",
                    copied ? "bg-foreground text-background border-foreground" : "bg-background text-foreground border-border hover:bg-secondary"
                  )}
                >
                  {copied ? <CheckCircle2 className="size-5" /> : <Copy className="size-5" />}
                </button>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-8 pt-8 border-t border-border/40">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Flame className="size-3 text-health" />
                    Maintenance Calories
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-health tabular-nums">
                    {formatNumber(result.tdee)} <span className="text-[10px] opacity-40 uppercase tracking-widest font-sans">kcal/day</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Zap className="size-3" />
                    Basal Metabolic Rate
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                    {formatNumber(result.bmr)} <span className="text-[10px] opacity-40 uppercase tracking-widest font-sans">kcal/day</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calorie Goals */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { l: "Fast Weight Loss", v: result.tdee - 800, i: Ruler, unit: "kcal", color: "text-destructive" },
               { l: "Steady Weight Loss", v: result.tdee - 500, i: Flame, unit: "kcal", color: "text-amber-500" },
               { l: "Maintain Weight", v: result.tdee, i: Activity, unit: "kcal", color: "text-health" },
               { l: "Gain Weight", v: result.tdee + 300, i: Zap, unit: "kcal", color: "text-signal" }
             ].map((item, idx) => (
               <div key={idx} className="surface-card p-5 border-border/30 bg-background hover:border-foreground/20 transition-colors group">
                 <div className="flex items-center gap-2 mb-3">
                    <item.i className={cn("size-3", item.color)} />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{item.l}</span>
                 </div>
                 <div className="text-xl font-mono font-medium tabular-nums leading-tight">
                    {formatNumber(item.v)}
                    <span className="text-[10px] ml-1 opacity-40 uppercase">{item.unit}</span>
                 </div>
               </div>
             ))}
          </div>

          {/* BMI Chart */}
          <div className="surface-card p-10 bg-secondary/5 border-border/30 relative overflow-hidden group">
            <LayoutDashboard className="absolute -bottom-4 -right-4 size-24 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
            <div className="flex items-center justify-between mb-12 relative z-10">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">BMI Chart</h4>
              <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">Health Standards</span>
            </div>
            
            <div className="relative h-2 rounded-full bg-gradient-to-r from-amber-400 via-health to-destructive relative z-10">
              <div
                className="absolute -top-3 size-8 rounded-full bg-foreground border-4 border-background shadow-xl transition-all duration-1000 ease-out"
                style={{ left: `${Math.min(100, Math.max(0, ((result.bmi - 15) / 25) * 100))}%`, transform: "translateX(-50%)" }}
              />
            </div>
            
            <div className="flex justify-between mt-6 relative z-10">
               {[15, 18.5, 25, 30, 40].map((v) => (
                 <div key={v} className="flex flex-col items-center gap-1">
                   <div className="h-1.5 w-0.5 bg-border/60" />
                   <span className="text-[9px] font-bold font-mono text-muted-foreground opacity-40">{v.toFixed(1)}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Expert Insights */}
          <div className="grid md:grid-cols-2 gap-6 pt-2">
             <div className="surface-card p-8 border-border/30 space-y-4 bg-secondary/5 relative overflow-hidden group">
                <Target className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
                <div className="flex items-center gap-2 relative z-10">
                  <UserIcon className="size-3 text-health" /> Body Weight Changes
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                  Your calorie needs change as your weight changes. Check back every few weeks to keep your progress on track and adjust your goals.
                </p>
             </div>
             <div className="surface-card p-8 border-border/30 space-y-4 bg-secondary/5 relative overflow-hidden group">
                <Flame className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
                <div className="flex items-center gap-2 relative z-10">
                  <Activity className="size-3 text-health" /> Moving More
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                  Even small movements like walking or standing help burn calories throughout the day. Every little bit of activity helps you reach your target.
                </p>
             </div>
          </div>

        </div>
      </div>
    </CalculatorPage>
  );
};

export default BmiTdeeCalculator;
