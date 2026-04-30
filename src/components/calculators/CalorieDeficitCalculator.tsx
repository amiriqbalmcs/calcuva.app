"use client";

import { useMemo, useState } from "react";
import {
  Copy, CheckCircle2, Target, CalendarDays, ActivitySquare,
  TrendingDown, Settings2, Flame, Zap, Activity, Info, AlertTriangle,
  ChevronRight, Calendar, Waves, Gauge, Ruler, LayoutDashboard, History, User,
  HeartPulse, Sparkles, Dna, ShieldAlert, Weight
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

const calc = calculatorBySlug("calorie-deficit-calculator")!;

const ACTIVITY = {
  sedentary: { label: "Sedentary (Minimal Movement)", mult: 1.2 },
  light: { label: "Light (1–3 Sessions/Week)", mult: 1.375 },
  moderate: { label: "Moderate (3–5 Sessions/Week)", mult: 1.55 },
  active: { label: "Active (6–7 Sessions/Week)", mult: 1.725 },
  athlete: { label: "Elite (2x Training/Day)", mult: 1.9 },
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
  const [pace, setPace] = useUrlState<number>("pace", 1);
  const [copied, setCopied] = useState(false);

  const KCAL_PER_KG_FAT = 7700;
  const KCAL_PER_LB_FAT = 3500;

  const result = useMemo(() => {
    const h = units === "metric" ? heightCm : (heightFt * 12 + heightIn) * 2.54;
    const currentW = units === "metric" ? weightKg : weightLb * 0.453592;
    const targetW = units === "metric" ? targetWeightKg : targetWeightLb * 0.453592;

    const bmr = sex === "male"
      ? 10 * currentW + 6.25 * h - 5 * age + 5
      : 10 * currentW + 6.25 * h - 5 * age - 161;

    const tdee = Math.round(bmr * ACTIVITY[activity].mult);

    let dailyDeficit = 0;
    let weightToLoseKg = Math.max(0, currentW - targetW);

    if (units === "metric") {
      const kgPerWeek = pace * 0.5;
      dailyDeficit = Math.round((kgPerWeek * KCAL_PER_KG_FAT) / 7);
    } else {
      const lbPerWeek = pace * 1;
      dailyDeficit = Math.round((lbPerWeek * KCAL_PER_LB_FAT) / 7);
    }

    const targetCalories = tdee - dailyDeficit;
    const safeMin = sex === "female" ? 1200 : 1500;
    let isUnsafe = targetCalories < safeMin;

    const totalDeficitNeeded = weightToLoseKg * KCAL_PER_KG_FAT;
    const daysToGoal = dailyDeficit > 0 ? Math.ceil(totalDeficitNeeded / dailyDeficit) : 0;

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
    const resultText = `Weight Loss Plan: Target ${formatNumber(result.targetCalories)} calories/day | Goal: ${result.goalDate}. Created on ${window.location.href}`;
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
              <h3 className="text-sm font-bold tracking-tight">Weight Loss Plan</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Set Your Body Details</p>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Unit Switcher */}
              <div className="flex bg-background border border-border/60 p-1 rounded-xl h-11">
                <button onClick={() => setUnits("metric")} className={cn("flex-1 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all", units === 'metric' ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary/40")}>Metric</button>
                <button onClick={() => setUnits("imperial")} className={cn("flex-1 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all", units === 'imperial' ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary/40")}>Imperial</button>
              </div>

              {/* Sex & Age */}
              <div className="grid grid-cols-2 gap-6">
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
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Age</Label>
                  <Input type="number" value={age} onChange={(e) => setAge(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm" />
                </div>
              </div>

              {/* Height & Weights */}
              {units === "metric" ? (
                <div className="space-y-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Height (cm)</Label>
                    <div className="relative group">
                      <Input type="number" value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm pr-12" />
                      <Ruler className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 pt-2 border-t border-border/40">
                    <div className="space-y-3 pt-4">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Current (kg)</Label>
                      <Input type="number" value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm" />
                    </div>
                    <div className="space-y-3 pt-4">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-health">Target (kg)</Label>
                      <Input type="number" value={targetWeightKg} onChange={(e) => setTargetWeightKg(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-bold rounded-lg text-health shadow-sm" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Feet</Label>
                      <Input type="number" value={heightFt} onChange={(e) => setHeightFt(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Inches</Label>
                      <Input type="number" value={heightIn} onChange={(e) => setHeightIn(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 pt-2 border-t border-border/40">
                    <div className="space-y-3 pt-4">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Current (lb)</Label>
                      <Input type="number" value={weightLb} onChange={(e) => setWeightLb(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm" />
                    </div>
                    <div className="space-y-3 pt-4">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-health">Target (lb)</Label>
                      <Input type="number" value={targetWeightLb} onChange={(e) => setTargetWeightLb(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-bold rounded-lg text-health shadow-sm" />
                    </div>
                  </div>
                </div>
              )}

              {/* Activity */}
              <div className="space-y-3 pt-2 border-t border-border/40">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">How much do you move?</Label>
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

              {/* Pacing */}
              <div className="space-y-3 pt-6 border-t border-border/40">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Weight Loss Pacing</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    { l: "Mild", v: 0.5, desc: units === "metric" ? "0.25kg" : "0.5lb" },
                    { l: "Normal", v: 1, desc: units === "metric" ? "0.5kg" : "1.0lb" },
                    { l: "Fast", v: 1.5, desc: units === "metric" ? "0.75kg" : "1.5lb" },
                    { l: "Extreme", v: 2, desc: units === "metric" ? "1.0kg" : "2.0lb" },
                  ].map((p) => (
                    <button
                      key={p.l}
                      onClick={() => setPace(p.v)}
                      className={cn(
                        "py-3 px-2 rounded-xl border text-[10px] font-bold uppercase tracking-tight transition-all",
                        pace === p.v ? "bg-foreground text-background border-foreground shadow-lg scale-[1.02]" : "bg-background text-muted-foreground border-border/60 hover:border-foreground"
                      )}
                    >
                      {p.l}<br /><span className="text-[8px] opacity-60 normal-case font-medium">{p.desc}/wk</span>
                    </button>
                  ))}
                </div>
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
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Energy Tip</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  Try not to cut your calories by more than 25% at once. This helps you keep your muscle and stay healthy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8">

          {/* Executive Summary */}
          <div className="surface-card p-8 md:p-10 space-y-10 bg-background border-border/60 shadow-md relative overflow-hidden group">
            <Waves className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Target className="size-3" />
                    Daily Calorie Target
                  </div>
                  <div className={cn("text-5xl md:text-6xl font-mono font-bold tracking-tighter tabular-nums", result.isUnsafe ? "text-destructive" : "text-health")}>
                    {formatNumber(result.targetCalories)} <span className="text-xl md:text-2xl opacity-40 uppercase tracking-widest font-sans font-bold">kcal/day</span>
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
                    <Calendar className="size-3 text-health" />
                    Estimated Goal Date
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-health tabular-nums">
                    {result.goalDate}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Weight className="size-3" />
                    Weight to Lose
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                    {result.weightToLose.toFixed(1)} <span className="text-[10px] opacity-40 uppercase tracking-widest font-sans">{units === "metric" ? "kg" : "lb"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Goal Projection Grid */}
          <div className="grid md:grid-cols-2 gap-6 pt-2">
            <div className="surface-card p-8 border-border/30 bg-secondary/5 relative overflow-hidden group">
              <TrendingDown className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                <Target className="size-3 text-health" /> Total Weight to Lose
              </div>
              <div className="text-4xl font-mono font-medium tracking-tighter tabular-nums">
                {result.weightToLose.toFixed(1)}
                <span className="text-sm font-sans font-normal text-muted-foreground ml-2">{units === 'metric' ? 'kg' : 'lb'}</span>
              </div>
            </div>
            <div className="surface-card p-8 border-border/30 bg-secondary/5 relative overflow-hidden group">
              <Calendar className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                <CalendarDays className="size-3 text-health" /> Estimated Goal Date
              </div>
              <div className="text-4xl font-mono font-medium tracking-tighter tabular-nums">
                {result.weightToLose <= 0 ? "Target Reached" : result.goalDate}
              </div>
            </div>
          </div>

          {/* Safety Threshold Alert */}
          {result.isUnsafe && (
            <div className="surface-card p-8 border-destructive/30 bg-destructive/5 relative overflow-hidden group">
              <ShieldAlert className="absolute -bottom-4 -right-4 size-24 text-destructive/5 group-hover:rotate-12 transition-transform duration-700" />
              <div className="flex gap-6 items-start relative z-10">
                <div className="p-3 rounded-xl bg-destructive text-white shadow-xl shadow-destructive/20">
                  <AlertTriangle className="size-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-destructive">Safety Alert</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    Your target of {formatNumber(result.targetCalories)} calories is below the recommended limit of {result.safeMin} calories. Eating too few calories can be bad for your health and make you feel tired or weak.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Expert Insight Grid */}
          <div className="grid md:grid-cols-2 gap-6 pt-2">
             <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group">
                <Gauge className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
                <div className="flex items-center gap-2 relative z-10">
                  <History className="size-3 text-health" /> Your Changing Body
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                  As you lose weight, your body needs fewer calories. Update your details every 5 pounds (2.5kg) to keep your goal on track.
                </p>
             </div>
             <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group">
                <Flame className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
                <div className="flex items-center gap-2 relative z-10">
                  <LayoutDashboard className="size-3 text-health" /> Eat More Protein
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                  Eating enough protein helps you keep your muscle while you lose fat, and keeps you feeling full throughout the day.
                </p>
             </div>
          </div>

        </div>
      </div>
    </CalculatorPage>
  );
};

export default CalorieDeficitCalculator;
