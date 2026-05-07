"use client";

import { useMemo, useState } from "react";
import { 
  Share, CheckCircle2, UserRound, Info, Activity, Scale, Ruler, 
  Dumbbell, Target, Heart, History, Zap, Globe, Landmark, Gauge, 
  Sparkles, LayoutDashboard, Settings2, Copy, Ruler as RulerIcon,
  ChevronRight, HeartPulse, Waves, User, Fingerprint, Crosshair
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { HowToGuide } from "@/components/HowToGuide";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculatorBySlug } from "@/lib/calculators";
import { useUrlState } from "@/hooks/useUrlState";
import { SITE_DOMAIN } from "@/lib/constants";
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
      if (bf < 6) { category = "Essential"; color = "text-signal"; insight = "Very Low: Your body fat is very low. Some fat is necessary for your body to function properly and stay healthy."; }
      else if (bf < 14) { category = "Athletic"; color = "text-health"; insight = "Very Lean: You are very lean and fit. Keep up your healthy lifestyle to stay at this level."; }
      else if (bf < 25) { category = "Healthy"; color = "text-health"; insight = "Healthy Range: You are in a healthy range for long-term health and energy."; }
      else { category = "High Fat"; color = "text-destructive"; insight = "High Fat Level: A higher body fat level can be hard on your body. Focus on strength training to build muscle."; }
    } else {
      if (bf < 14) { category = "Essential"; color = "text-signal"; insight = "Very Low: Your body fat is below the healthy range. This can affect your hormones and bone health."; }
      else if (bf < 21) { category = "Athletic"; color = "text-health"; insight = "Very Lean & Fit: You have a lot of muscle and very little fat. Your body is working very efficiently."; }
      else if (bf < 32) { category = "Healthy"; color = "text-health"; insight = "Healthy Range: You are in the healthy range for your age and sex."; }
      else { category = "High Fat"; color = "text-destructive"; insight = "High Fat Level: Carrying extra fat can be hard on your body. Focus on eating filling, healthy foods to manage your weight."; }
    }

    return { bf, fatMass, leanMass, category, color, wt, insight };
  }, [units, sex, height, neck, waist, hip, weight]);

  const handleCopy = () => {
    const resultText = `Body Check: ${result.bf.toFixed(1)}% Body Fat (${result.category}) | Muscle Mass: ${result.leanMass.toFixed(1)}kg. Created on ${window.location.href}`;
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        
        {/* Input Panel */}
        <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <div className="surface-card p-6 md:p-8 space-y-10 bg-secondary/5 border-border/40 relative overflow-hidden group">
            <Settings2 className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
            
            <div className="space-y-1 relative z-10">
              <h3 className="text-sm font-bold tracking-tight">Body Details</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Set Your Body Measurements</p>
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

              {/* Height & Weight */}
              <div className="space-y-8 pt-2 border-t border-border/40">
                <div className="space-y-4 pt-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Height ({units === "metric" ? "cm" : "in"})</Label>
                    <span className="text-[10px] font-bold text-health">{height}</span>
                  </div>
                  <Slider value={[height]} min={units === "metric" ? 100 : 40} max={units === "metric" ? 250 : 100} step={1} onValueChange={([v]) => setHeight(v)} />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Weight ({units === "metric" ? "kg" : "lb"})</Label>
                    <span className="text-[10px] font-bold text-health">{weight}</span>
                  </div>
                  <Slider value={[weight]} min={units === "metric" ? 30 : 70} max={units === "metric" ? 200 : 450} step={1} onValueChange={([v]) => setWeight(v)} />
                </div>
              </div>

              {/* Measurements */}
              <div className="space-y-8 pt-6 border-t border-border/40">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Neck Size ({units === "metric" ? "cm" : "in"})</Label>
                    <span className="text-[10px] font-bold text-health">{neck}</span>
                  </div>
                  <Slider value={[neck]} min={units === "metric" ? 20 : 8} max={units === "metric" ? 60 : 24} step={0.5} onValueChange={([v]) => setNeck(v)} />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Waist Size ({units === "metric" ? "cm" : "in"})</Label>
                    <span className="text-[10px] font-bold text-health">{waist}</span>
                  </div>
                  <Slider value={[waist]} min={units === "metric" ? 40 : 16} max={units === "metric" ? 160 : 64} step={0.5} onValueChange={([v]) => setWaist(v)} />
                </div>
                {sex === "female" && (
                  <div className="space-y-4">
                     <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Hip Size ({units === "metric" ? "cm" : "in"})</Label>
                      <span className="text-[10px] font-bold text-health">{hip}</span>
                    </div>
                    <Slider value={[hip]} min={units === "metric" ? 40 : 16} max={units === "metric" ? 160 : 64} step={0.5} onValueChange={([v]) => setHip(v)} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="surface-card p-6 border-border/30 bg-health/5 relative overflow-hidden group">
            <Fingerprint className="absolute -bottom-4 -right-4 size-20 text-health/5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1 text-health">
                <Crosshair className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider">What This Means</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {result.insight}
                </p>
              </div>
            </div>
          </div>

          {calc.howTo && (
            <HowToGuide 
              id="how-to-use"
              steps={calc.howTo!.steps} 
              proTip={calc.howTo!.proTip} 
              variant="sidebar" 
            />
          )}
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8 order-1 lg:order-2">
          
          {/* Executive Summary */}
          <div className="surface-card p-8 md:p-10 space-y-10 bg-background border-border/60 shadow-md relative overflow-hidden group">
            <Waves className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <UserRound className="size-3" />
                    Body Fat Percentage
                  </div>
                  <div className={cn("text-5xl md:text-6xl font-mono font-bold tracking-tighter tabular-nums", result.color)}>
                    {result.bf.toFixed(1)}% <span className="text-xl md:text-2xl opacity-40 uppercase tracking-widest font-sans font-bold">{result.category}</span>
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
                    <Scale className="size-3 text-destructive" />
                    Total Fat Mass
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-destructive tabular-nums">
                    {result.fatMass.toFixed(1)} <span className="text-[10px] opacity-40 uppercase tracking-widest font-sans">{units === "metric" ? "kg" : "lb"}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Dumbbell className="size-3 text-health" />
                    Lean Body Mass
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-health tabular-nums">
                    {result.leanMass.toFixed(1)} <span className="text-[10px] opacity-40 uppercase tracking-widest font-sans">{units === "metric" ? "kg" : "lb"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Composition Spectrograph */}
          <div className="surface-card p-8 md:p-10 bg-secondary/5 border-border/30 relative overflow-hidden group">
            <LayoutDashboard className="absolute -bottom-4 -right-4 size-24 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
            <div className="flex items-center justify-between mb-12 relative z-10">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Body Fat Scale</h4>
              <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">U.S. Navy Standard</span>
            </div>
            
            <div className="relative h-4 rounded-full bg-gradient-to-r from-signal via-health via-education to-destructive shadow-inner mb-12 relative z-10 overflow-visible">
               <div
                 className="absolute -top-3 size-10 rounded-full bg-background border-4 border-foreground shadow-2xl transition-all duration-1000 ease-out flex items-center justify-center z-20 group/pin"
                 style={{ left: `${Math.min(100, Math.max(0, ((result.bf - 2) / 40) * 100))}%`, transform: "translateX(-50%)" }}
               >
                  <Target className="size-4 text-foreground group-hover/pin:scale-110 transition-transform" />
               </div>
            </div>
            
            <div className="grid grid-cols-5 gap-2 text-center relative z-10">
               {[
                 { l: "Very Low", c: "text-signal" },
                 { l: "Athletic", c: "text-health" },
                 { l: "Healthy", c: "text-health" },
                 { l: "Standard", c: "text-education" },
                 { l: "High", c: "text-destructive" }
               ].map((item, idx) => (
                 <div key={idx} className="space-y-2">
                    <div className={cn("text-[10px] font-bold uppercase tracking-widest leading-tight opacity-50", item.c)}>{item.l}</div>
                 </div>
               ))}
            </div>
          </div>

          {/* Performance stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { l: "Daily Resting Calories", v: (21.6 * result.leanMass + 370).toFixed(0), i: Zap, unit: "kcal" },
               { l: "Daily Protein Goal", v: (result.leanMass * 2.2).toFixed(0), i: Dumbbell, unit: "g" },
               { l: "Muscle to Fat Ratio", v: (result.leanMass / result.fatMass).toFixed(1), i: Crosshair, unit: "x" },
               { l: "Result", v: result.category.split(' ')[0], i: HeartPulse, unit: "" }
             ].map((item, idx) => (
               <div key={idx} className="surface-card p-5 border-border/30 bg-background hover:border-foreground/20 transition-colors group">
                 <div className="flex items-center gap-2 mb-3">
                    <item.i className="size-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{item.l}</span>
                 </div>
                 <div className="text-xl font-mono font-medium tabular-nums leading-tight">
                    {item.v}
                    <span className="text-[10px] ml-1 opacity-40 uppercase">{item.unit}</span>
                 </div>
               </div>
             ))}
          </div>

          {/* Expert Insights */}
          <div className="grid md:grid-cols-2 gap-6 pt-2">
             <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group">
                <RulerIcon className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
                <div className="flex items-center gap-2 relative z-10">
                  <History className="size-3 text-health" /> How it works
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                  Using measurements like your neck and waist is a proven way to estimate your body fat without expensive scans. It correlates strongly with professional scans in clinical settings.
                </p>
             </div>
             <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group">
                <HeartPulse className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
                <div className="flex items-center gap-2 relative z-10">
                  <History className="size-3 text-health" /> Track Your Progress
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                  Your weight changes every day. Tracking your body fat percentage is the best way to see if you're losing fat and gaining muscle over time.
                </p>
             </div>
          </div>

        </div>
      </div>
    </CalculatorPage>
  );
};

export default BodyFatCalculator;
