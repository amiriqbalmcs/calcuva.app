"use client";

import { useState, useMemo } from "react";
import { 
  Dumbbell, Info, TrendingUp, Activity, Ruler, Target, 
  RefreshCcw, Share, CheckCircle2, Zap, Scale, Heart, 
  History, Trophy, Gauge, Sparkles, LayoutDashboard, 
  Globe, Landmark, Settings2, Copy, ChevronRight, User, 
  Flame, Battery, Waves, Siren
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { HowToGuide } from "@/components/HowToGuide";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { calculatorBySlug } from "@/lib/calculators";
import { useUrlState } from "@/hooks/useUrlState";
import { SITE_DOMAIN } from "@/lib/constants";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("one-rep-max-calculator")!;

const OneRepMaxCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [weight, setWeight] = useUrlState<number>("w", 100);
  const [reps, setReps] = useUrlState<number>("r", 5);
  const [unit, setUnit] = useUrlState<"kg" | "lbs">("u", "kg");
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    // Epley Formula: 1RM = w * (1 + r/30)
    const epley = weight * (1 + reps / 30);
    // Brzycki Formula: 1RM = w / (1.0278 - (0.0278 * r))
    const brzycki = weight / (1.0278 - 0.0278 * reps);
    const avg = (epley + brzycki) / 2;

    const percentages = [
      { pct: 100, label: "100%", weight: avg, zone: "MAX", color: "text-health" },
      { pct: 95, label: "95%", weight: avg * 0.95, zone: "MAX STRENGTH", color: "text-health/80" },
      { pct: 90, label: "90%", weight: avg * 0.90, zone: "POWER", color: "text-health/60" },
      { pct: 85, label: "85%", weight: avg * 0.85, zone: "BUILD MUSCLE", color: "text-foreground" },
      { pct: 80, label: "80%", weight: avg * 0.80, zone: "STRENGTH", color: "text-foreground/80" },
      { pct: 75, label: "75%", weight: avg * 0.75, zone: "ENDURANCE", color: "text-foreground/60" },
    ];

    let insight = "";
    if (reps > 12) insight = "Note: Estimating your 1-rep max from more than 12 reps is less accurate.";
    else if (reps === 1) insight = "This is your actual 1-rep max. The chart below shows lighter weights to use for different training goals.";
    else insight = "Lifting a weight multiple times helps accurately predict the heaviest weight you can lift once.";

    return { oneRepMax: avg, epley, brzycki, percentages, insight };
  }, [weight, reps]);

  const handleCopy = () => {
    let text = `Estimated 1RM: ${results.oneRepMax.toFixed(1)} ${unit}. Strength analysis at ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        
        {/* Input Panel */}
        <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <div className="surface-card p-6 md:p-8 space-y-10 bg-secondary/5 border-border/40 relative overflow-hidden group">
            <Dumbbell className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
            
            <div className="space-y-1 relative z-10">
              <h3 className="text-sm font-bold tracking-tight">Your Lift</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Lift Details</p>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Unit Switcher */}
              <div className="flex bg-background border border-border/60 p-1 rounded-xl h-11 h-11">
                <button onClick={() => setUnit("kg")} className={cn("flex-1 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all", unit === 'kg' ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary/40")}>Kilograms</button>
                <button onClick={() => setUnit("lbs")} className={cn("flex-1 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all", unit === 'lbs' ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary/40")}>Pounds</button>
              </div>

              {/* Weight */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Weight Lifted</Label>
                  <span className="text-[10px] font-bold text-health">{weight} {unit}</span>
                </div>
                <Slider value={[weight]} min={1} max={unit === 'kg' ? 500 : 1100} step={1} onValueChange={([v]) => setWeight(v)} />
                <Input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm" />
              </div>

              {/* Reps */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Reps Completed</Label>
                  <span className="text-[10px] font-bold text-health">{reps} Reps</span>
                </div>
                <Slider value={[reps]} min={1} max={30} step={1} onValueChange={([v]) => setReps(v)} />
                <Input type="number" value={reps} onChange={(e) => setReps(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm" />
              </div>
            </div>
          </div>

          <div className="surface-card p-6 border-border/30 bg-health/5 relative overflow-hidden group">
            <Info className="absolute -bottom-4 -right-4 size-20 text-health/5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1 text-health">
                <Target className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Lifting Tip</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {results.insight}
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
                    <Trophy className="size-3" />
                    Estimated One Rep Max
                  </div>
                  <div className="text-6xl md:text-7xl font-mono font-bold tracking-tighter tabular-nums text-health">
                    {results.oneRepMax.toFixed(1)}<span className="text-2xl md:text-3xl ml-2 font-sans font-normal opacity-40 uppercase">{unit}</span>
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
                    <Zap className="size-3 text-health" />
                    Strength Level
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-health tabular-nums">
                    {results.oneRepMax > (unit === 'kg' ? 140 : 300) ? "Advanced" : "Intermediate"}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Scale className="size-3" />
                    Loading Formula
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                    Epley <span className="text-[10px] opacity-40 uppercase tracking-widest font-sans font-bold">— Avg Estimate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Intensity Spectrum */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Weight Training Zones</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {results.percentages.map((p) => (
                <div key={p.pct} className="surface-card p-6 border-border/30 bg-background hover:border-foreground/20 transition-all group">
                  <div className="flex justify-between items-center mb-3">
                     <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest group-hover:text-foreground transition-colors">
                       {p.label}
                     </span>
                     <span className={cn("text-[8px] font-bold px-2 py-0.5 rounded-full border bg-secondary/30 uppercase tracking-tighter", p.color)}>
                       {p.zone}
                     </span>
                  </div>
                  <div className="text-2xl font-mono font-medium tracking-tight tabular-nums group-hover:text-health transition-colors">
                    {p.weight.toFixed(0)}<span className="text-[10px] ml-1 opacity-40 font-sans uppercase">{unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expert Insights */}
          <div className="grid md:grid-cols-2 gap-6 pt-2">
            <div className="surface-card p-8 border-border/30 bg-secondary/5 relative overflow-hidden group">
               <Flame className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
               <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                 <History className="size-3 text-health" /> Training Zones
               </div>
               <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                 Use these different weight zones in your workouts depending on if your goal is strength, building muscle, or endurance.
               </p>
            </div>
            <div className="surface-card p-8 border-border/30 bg-secondary/5 relative overflow-hidden group">
               <Battery className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
               <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Heart className="size-3 text-health" /> Rest & Recovery
               </div>
               <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                 Lifting very heavy weights (above 90% of your max) is very tiring for your body. Make sure you take enough rest days between heavy lifting sessions.
               </p>
            </div>
          </div>

          {/* Comparative Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { l: "Epley Formula", v: results.epley.toFixed(1), i: Activity, unit: unit },
               { l: "Brzycki Formula", v: results.brzycki.toFixed(1), i: Scale, unit: unit },
               { l: "Load %", v: ((weight / results.oneRepMax) * 100).toFixed(1), i: Gauge, unit: "%" },
               { l: "Version", v: "v2.5", i: Landmark }
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

        </div>
      </div>
    </CalculatorPage>
  );
};

export default OneRepMaxCalculator;
