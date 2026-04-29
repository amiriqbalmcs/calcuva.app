"use client";

import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Share, CheckCircle2, Utensils, Info, Target, Flame, Activity,
  Zap, Droplets, Beef, History, Landmark, Globe, Ruler, Gauge,
  Sparkles, Settings2, Copy, LayoutDashboard, ChevronRight, Dna,
  Waves, FastForward, Heart, User, Dumbbell, Apple
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

const calc = calculatorBySlug("macro-nutrient-calculator")!;

const DIET_TYPES = {
  balanced: { p: 30, c: 40, f: 30, label: "Balanced Diet" },
  low_carb: { p: 40, c: 20, f: 40, label: "Low Carb / Keto" },
  high_carb: { p: 25, c: 55, f: 20, label: "High Energy" },
  bodybuilding: { p: 45, c: 35, f: 20, label: "Build Muscle" },
};

const PIE_COLORS = ["hsl(var(--signal))", "hsl(var(--health))", "hsl(var(--muted-foreground) / 0.4)"];

const MacroCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [tdee, setTdee] = useUrlState<number>("cal", 2500);
  const [goal, setGoal] = useUrlState<"cut" | "maintain" | "bulk">("gl", "maintain");
  const [diet, setDiet] = useUrlState<keyof typeof DIET_TYPES>("pt", "balanced");
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    let calories = tdee;
    if (goal === "cut") calories -= 500;
    if (goal === "bulk") calories += 300;

    const config = DIET_TYPES[diet];
    const pCals = (calories * config.p) / 100;
    const cCals = (calories * config.c) / 100;
    const fCals = (calories * config.f) / 100;

    const pGrams = pCals / 4;
    const cGrams = cCals / 4;
    const fGrams = fCals / 9;

    const pieData = [
      { name: "Protein", value: pGrams, calories: pCals },
      { name: "Carbs", value: cGrams, calories: cCals },
      { name: "Fats", value: fGrams, calories: fCals },
    ];

    let insight = "";
    if (diet === "low_carb") insight = "Keto Mode: Focus on healthy fats. Make sure to get enough salt and water as your body adjusts to fewer carbs.";
    else if (goal === "bulk") insight = "Muscle Building: Eating extra calories helps your body build and repair muscle more effectively.";
    else if (goal === "cut") insight = "Protect Your Muscle: Eating more protein while losing weight helps you keep your muscle and lose only fat.";
    else insight = "Keep Steady: Eating a balanced mix helps keep your energy levels and mood steady all day long.";

    return { calories, protein: pGrams, carbs: cGrams, fat: fGrams, pieData, insight };
  }, [tdee, goal, diet]);

  const handleCopy = () => {
    const resultText = `Macro Plan: ${results.protein.toFixed(0)}g Protein / ${results.carbs.toFixed(0)}g Carbs / ${results.fat.toFixed(0)}g Fats. Track at ${SITE_DOMAIN}`;
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
              <h3 className="text-sm font-bold tracking-tight">Your Food Plan</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Set Your Calories and Goal</p>
            </div>

            <div className="space-y-8 relative z-10">
              {/* TDEE */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Calories to Stay Same</Label>
                  <span className="text-[10px] font-bold text-health">{tdee} Kcal</span>
                </div>
                <div className="relative group">
                  <Input type="number" value={tdee} onChange={(e) => setTdee(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm pr-12" />
                  <Flame className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                </div>
                <Slider value={[tdee]} min={1200} max={5000} step={50} onValueChange={([v]) => setTdee(v)} />
              </div>

              {/* Goal Switcher */}
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Your Body Goal</Label>
                <div className="flex bg-background border border-border/60 p-1 rounded-xl h-11">
                  <button onClick={() => setGoal("cut")} className={cn("flex-1 text-[10px] font-bold uppercase tracking-tight rounded-lg transition-all", goal === 'cut' ? "bg-foreground text-background shadow-lg" : "text-muted-foreground hover:bg-secondary/40")}>Lose Weight</button>
                  <button onClick={() => setGoal("maintain")} className={cn("flex-1 text-[10px] font-bold uppercase tracking-tight rounded-lg transition-all", goal === 'maintain' ? "bg-foreground text-background shadow-lg" : "text-muted-foreground hover:bg-secondary/40")}>Stay the Same</button>
                  <button onClick={() => setGoal("bulk")} className={cn("flex-1 text-[10px] font-bold uppercase tracking-tight rounded-lg transition-all", goal === 'bulk' ? "bg-foreground text-background shadow-lg" : "text-muted-foreground hover:bg-secondary/40")}>Gain Weight</button>
                </div>
              </div>

              {/* Diet Protocol */}
              <div className="space-y-3 pt-2 border-t border-border/40">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">How do you eat?</Label>
                <Select value={diet} onValueChange={(v) => setDiet(v as any)}>
                  <SelectTrigger className="h-11 bg-background border-border/60 font-bold text-[10px] uppercase tracking-widest rounded-xl shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/40">
                    {Object.entries(DIET_TYPES).map(([k, v]) => (
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
            <Sparkles className="absolute -bottom-4 -right-4 size-20 text-health/5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1 text-health">
                <Dna className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Body Tip</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {results.insight}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8">

          {/* Executive Summary */}
          <div className="surface-card p-8 md:p-10 space-y-8 bg-background border-border/60 shadow-md relative overflow-hidden group">
            <Waves className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Your Daily Calorie Goal</span>
                  <div className="text-6xl md:text-7xl font-mono font-medium tracking-tighter tabular-nums text-health">
                    {formatNumber(results.calories)}
                    <span className="text-2xl md:text-3xl ml-3 font-sans font-normal opacity-40 uppercase">kcal/day</span>
                  </div>
                </div>
                <button
                  onClick={handleCopy}
                  className={cn(
                    "p-3 rounded-xl transition-all border",
                    copied ? "bg-foreground text-background border-foreground" : "bg-background text-foreground border-border hover:bg-secondary"
                  )}
                >
                  {copied ? <CheckCircle2 className="size-5" /> : <Copy className="size-5" />}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-border/40">
                <div className="flex items-center gap-1.5 px-4 py-1.5 bg-foreground text-background rounded-lg text-[10px] font-bold uppercase tracking-tight shadow-sm">
                  <Zap className="size-3" />
                  <span>Calories to Stay Same: {formatNumber(tdee)} kcal</span>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Your Macro Mix: {DIET_TYPES[diet].p}% P / {DIET_TYPES[diet].c}% C / {DIET_TYPES[diet].f}% F
                </div>
              </div>
            </div>
          </div>

          {/* Visualization matrix */}
          <div className="grid md:grid-cols-12 gap-8">
            {/* Chart Side */}
            <div className="md:col-span-5 surface-card p-8 bg-secondary/5 border-border/30 relative overflow-hidden group">
               <LayoutDashboard className="absolute -bottom-4 -right-4 size-24 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
               <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-8 relative z-10">Where your calories come from</h4>
               
               <div className="h-[240px] relative z-10">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie data={results.pieData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={90} paddingAngle={8} stroke="none">
                       {results.pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                     </Pie>
                     <Tooltip 
                        formatter={(v: any) => `${v.toFixed(0)}g`}
                        contentStyle={{ borderRadius: "16px", border: "none", backgroundColor: "hsl(var(--background))", boxShadow: "0 20px 40px -12px rgb(0 0 0 / 0.3)" }}
                     />
                   </PieChart>
                 </ResponsiveContainer>
               </div>

               <div className="space-y-3 mt-4 relative z-10">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase text-muted-foreground border-b border-border/40 pb-2">
                    <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-signal" /> Protein</div>
                    <span>{DIET_TYPES[diet].p}%</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase text-muted-foreground border-b border-border/40 pb-2">
                    <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-health" /> Carbs</div>
                    <span>{DIET_TYPES[diet].c}%</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase text-muted-foreground border-b border-border/40 pb-2">
                    <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-muted-foreground/30" /> Fats</div>
                    <span>{DIET_TYPES[diet].f}%</span>
                  </div>
               </div>
            </div>

            {/* Breakdown List Side */}
            <div className="md:col-span-7 space-y-4">
               {[
                 { label: "Protein (P)", v: results.protein, color: "bg-signal", icon: Beef, kcal: results.protein * 4, pct: DIET_TYPES[diet].p, desc: "Muscle Building" },
                 { label: "Carbs (C)", v: results.carbs, color: "bg-health", icon: Zap, kcal: results.carbs * 4, pct: DIET_TYPES[diet].c, desc: "Daily Energy" },
                 { label: "Fats (F)", v: results.fat, color: "bg-muted-foreground/30", icon: Droplets, kcal: results.fat * 9, pct: DIET_TYPES[diet].f, desc: "Hormones & Health" }
               ].map((item, idx) => (
                 <div key={idx} className="surface-card p-6 bg-background border-border/40 shadow-sm hover:border-foreground/20 transition-all group">
                   <div className="flex justify-between items-center mb-4">
                     <div className="flex items-center gap-3">
                       <div className="p-2 bg-secondary/10 rounded-lg group-hover:bg-secondary/20 transition-colors">
                         <item.icon className="size-4 text-muted-foreground group-hover:text-foreground" />
                       </div>
                       <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</span>
                     </div>
                     <div className="text-2xl font-mono font-bold tabular-nums">{item.v.toFixed(0)}g</div>
                   </div>
                   <div className="h-1.5 rounded-full bg-secondary/30 overflow-hidden">
                     <div className={cn("h-full transition-all duration-1000 ease-out", item.color)} style={{ width: `${item.pct}%` }} />
                   </div>
                   <div className="flex justify-between items-center mt-3 opacity-60">
                     <span className="text-[10px] font-bold uppercase tracking-tight">{item.kcal.toFixed(0)} kcal</span>
                     <span className="text-[9px] font-bold uppercase tracking-tighter">{item.desc}</span>
                   </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Performance stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { l: "Extra/Fewer Calories", v: results.calories - tdee, i: History, unit: "kcal" },
               { l: "Protein Share", v: (results.protein / (results.calories / 4) * 100).toFixed(1), i: Dumbbell, unit: "%" },
               { l: "Carb Share", v: (results.carbs / (results.calories / 4) * 100).toFixed(1), i: Apple, unit: "%" },
               { l: "Goal", v: goal.toUpperCase(), i: Target, unit: "" }
             ].map((item, idx) => (
               <div key={idx} className="surface-card p-5 border-border/30 bg-background hover:border-foreground/20 transition-colors group">
                 <div className="flex items-center gap-2 mb-3">
                    <item.i className="size-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{item.l}</span>
                 </div>
                 <div className="text-lg font-mono font-medium tabular-nums leading-tight">
                    {item.v}
                    <span className="text-[10px] ml-1 opacity-40 uppercase">{item.unit}</span>
                 </div>
               </div>
             ))}
          </div>

          {/* Expert Insights */}
          <div className="grid md:grid-cols-2 gap-6 pt-2">
             <div className="surface-card p-8 border-border/30 space-y-4 bg-secondary/5 relative overflow-hidden group">
                <Heart className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
                <div className="flex items-center gap-2 relative z-10">
                  <History className="size-3 text-health" /> Changing Your Plan
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                  Your body's needs change over time. As you get fitter or change your workouts, update your plan every 2 months to keep seeing results.
                </p>
             </div>
             <div className="surface-card p-8 border-border/30 space-y-4 bg-secondary/5 relative overflow-hidden group">
                <Zap className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
                <div className="flex items-center gap-2 relative z-10">
                  <Gauge className="size-3 text-health" /> Protein, Carbs, and Fats
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                  Protein builds your body, while carbs and fats give you energy. Balancing all three correctly helps you feel your best and stay healthy.
                </p>
             </div>
          </div>

        </div>
      </div>
    </CalculatorPage>
  );
};

export default MacroCalculator;
