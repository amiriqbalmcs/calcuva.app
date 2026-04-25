"use client";

import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Share, CheckCircle2, Utensils, Info, Target, Flame } from "lucide-react";
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

const calc = calculatorBySlug("macro-nutrient-calculator")!;

const DIET_TYPES = {
  balanced: { p: 30, c: 40, f: 30, label: "Balanced (30/40/30)" },
  low_carb: { p: 40, c: 20, f: 40, label: "Low Carb (40/20/40)" },
  high_carb: { p: 30, c: 50, f: 20, label: "High Carb / Low Fat" },
  ketogenic: { p: 25, c: 5, f: 70, label: "Keto (25/5/70)" },
};

const PIE_COLORS = ["hsl(var(--health))", "hsl(var(--education))", "hsl(var(--utility))"];

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
    if (diet === "ketogenic") insight = "Ketosis Threshold: You must maintain <50g of carbs to enter ketosis. Ensure high sodium and potassium intake during the transition.";
    else if (goal === "bulk") insight = "Muscle Synthesis: Your plan includes a 300kcal surplus. Stick to the 30% protein target to ensure most weight gain is lean tissue.";
    else if (goal === "cut") insight = "Satiety Strategy: High protein is essential when cutting to preserve muscle and suppress hunger hormones like ghrelin.";
    else insight = "Metabolic Maintenance: Your macro split supports stable energy throughout the day without significant spikes in insulin.";

    return { calories, protein: pGrams, carbs: cGrams, fat: fGrams, pieData, insight };
  }, [tdee, goal, diet]);

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
      seoContent={<SeoBlock title="Macro Strategy & Nutrition" intro="Plan your daily nutrition with precision based on biological goals." />}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 surface-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Diet Profile</h3>
            <button onClick={handleShare} className="p-1 px-2 rounded-md bg-secondary text-[10px] font-bold text-muted-foreground hover:bg-health hover:text-white transition flex items-center gap-1 font-mono">
              {copied ? <CheckCircle2 className="size-3" /> : <Share className="size-3" />}
              {copied ? "COPIED" : "SHARE"}
            </button>
          </div>

          <div className="space-y-4 pt-2">
            <div><Label>Daily Calorie Target</Label><Input type="number" value={tdee} onChange={(e) => setTdee(Number(e.target.value) || 0)} className="mt-2 text-lg font-bold" /></div>
            <div>
              <Label>Body Goal</Label>
              <Tabs value={goal} onValueChange={(v) => setGoal(v as any)} className="mt-2">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="cut">Cut</TabsTrigger>
                  <TabsTrigger value="maintain">Hold</TabsTrigger>
                  <TabsTrigger value="bulk">Bulk</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div><Label>Diet Protocol</Label>
              <Select value={diet} onValueChange={(v) => setDiet(v as any)}>
                <SelectTrigger className="mt-2 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{Object.entries(DIET_TYPES).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <ResultGrid cols={2}>
            <ResultStat label="Total Daily Calories" value={`${formatNumber(results.calories)} kcal`} accent sub={goal === "maintain" ? "Maintenance Level" : goal === "cut" ? "Fat Loss Target" : "Muscle Gain Target"} />
            <ResultStat label="Daily Macro Goal" value={`${(results.protein + results.carbs + results.fat).toFixed(0)}g`} sub="Total Nutrient Mass" />
          </ResultGrid>

          <div className="p-5 rounded-xl flex gap-4 items-start border-l-4 bg-health-soft border-health text-health">
            <div className="shrink-0 mt-0.5"><Target className="size-5" /></div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Body Goal Insight</h4>
              <p className="text-sm opacity-90 leading-relaxed font-medium">{results.insight}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="surface-card p-6">
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono mb-6">Macro Distribution</h3>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={results.pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={2}>
                      {results.pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} stroke="none" />)}
                    </Pie>
                    <Tooltip formatter={(v: any) => `${v.toFixed(0)}g`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-around text-[9px] uppercase font-bold tracking-widest text-muted-foreground border-t border-border/50 pt-4 mt-2">
                <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-health" />Protein</div>
                <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-education" />Carbs</div>
                <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-utility" />Fats</div>
              </div>
            </div>

            <div className="space-y-4">
               <div className="surface-card p-5">
                 <div className="flex justify-between items-center mb-3">
                   <span className="text-[10px] font-bold uppercase text-muted-foreground">Protein</span>
                   <span className="text-xs font-mono font-bold text-health">{results.protein.toFixed(0)}g</span>
                 </div>
                 <div className="h-1.5 rounded-full bg-secondary overflow-hidden"><div className="h-full bg-health" style={{ width: `${DIET_TYPES[diet].p}%` }} /></div>
               </div>
               <div className="surface-card p-5">
                 <div className="flex justify-between items-center mb-3">
                   <span className="text-[10px] font-bold uppercase text-muted-foreground">Carbohydrates</span>
                   <span className="text-xs font-mono font-bold text-education">{results.carbs.toFixed(0)}g</span>
                 </div>
                 <div className="h-1.5 rounded-full bg-secondary overflow-hidden"><div className="h-full bg-education" style={{ width: `${DIET_TYPES[diet].c}%` }} /></div>
               </div>
               <div className="surface-card p-5">
                 <div className="flex justify-between items-center mb-3">
                   <span className="text-[10px] font-bold uppercase text-muted-foreground">Healthy Fats</span>
                   <span className="text-xs font-mono font-bold text-utility">{results.fat.toFixed(0)}g</span>
                 </div>
                 <div className="h-1.5 rounded-full bg-secondary overflow-hidden"><div className="h-full bg-utility" style={{ width: `${DIET_TYPES[diet].f}%` }} /></div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
};

export default MacroCalculator;
