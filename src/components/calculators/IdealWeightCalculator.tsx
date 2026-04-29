"use client";

import { useMemo, useState } from "react";
import { 
  Share, CheckCircle2, UserRound, Info, Scale, Ruler, Heart, 
  Activity, Target, Zap, Settings2, Copy, LayoutDashboard, 
  ChevronRight, Thermometer, Sparkles, Gauge, Landmark, User
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculatorBySlug } from "@/lib/calculators";
import { useUrlState } from "@/hooks/useUrlState";
import { SITE_DOMAIN } from "@/lib/constants";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("ideal-weight-calculator")!;

const IdealWeightCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [units, setUnits] = useUrlState<"metric" | "imperial">("u", "metric");
  const [sex, setSex] = useUrlState<"male" | "female">("s", "male");
  const [height, setHeight] = useUrlState<number>("h", 175);
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    const hIn = units === "metric" ? height / 2.54 : height;
    const over5ft = Math.max(0, hIn - 60);
    let robinson, miller, devine, hamwi;
    if (sex === "male") { 
      robinson = 52 + 1.9 * over5ft; 
      miller = 56.2 + 1.41 * over5ft; 
      devine = 50 + 2.3 * over5ft; 
      hamwi = 48 + 2.7 * over5ft; 
    }
    else { 
      robinson = 49 + 1.7 * over5ft; 
      miller = 53.1 + 1.36 * over5ft; 
      devine = 45.5 + 2.3 * over5ft; 
      hamwi = 45.5 + 2.2 * over5ft; 
    }
    const average = (robinson + miller + devine + hamwi) / 4;
    const bmiMin = 18.5 * Math.pow(hIn * 0.0254, 2);
    const bmiMax = 24.9 * Math.pow(hIn * 0.0254, 2);
    const convert = (kg: number) => units === "metric" ? kg : kg * 2.20462;
    
    let insight = `The target of ${convert(average).toFixed(1)} ${units === "metric" ? "kg" : "lb"} is an average of 4 common formulas. Your actual ideal weight can vary by 10% depending on your muscle mass and body frame.`;

    return { 
      robinson: convert(robinson), 
      miller: convert(miller), 
      devine: convert(devine), 
      hamwi: convert(hamwi), 
      average: convert(average), 
      bmiMin: convert(bmiMin), 
      bmiMax: convert(bmiMax), 
      insight 
    };
  }, [units, sex, height]);

  const unitText = units === "metric" ? "kg" : "lb";

  const handleCopy = () => {
    let text = `Ideal Weight: ${results.average.toFixed(1)} ${unitText}. Healthy Range: ${results.bmiMin.toFixed(0)}-${results.bmiMax.toFixed(0)} ${unitText}. Calculate yours at ${SITE_DOMAIN}`;
    navigator.clipboard.writeText(text);
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
              <h3 className="text-sm font-bold tracking-tight">Weight Goal</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Set Your Height</p>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Unit Switcher */}
              <div className="flex bg-background border border-border/60 p-1 rounded-xl h-11">
                <button onClick={() => setUnits("metric")} className={cn("flex-1 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all", units === 'metric' ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary/40")}>Metric</button>
                <button onClick={() => setUnits("imperial")} className={cn("flex-1 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all", units === 'imperial' ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary/40")}>Imperial</button>
              </div>

              {/* Sex Selection */}
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Sex</Label>
                <Select value={sex} onValueChange={(v) => setSex(v as any)}>
                  <SelectTrigger className="h-11 bg-background border-border/60 font-medium text-xs uppercase tracking-widest rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/40">
                    <SelectItem value="male" className="text-[10px] font-bold uppercase">Male</SelectItem>
                    <SelectItem value="female" className="text-[10px] font-bold uppercase">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Height */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Height ({units === 'metric' ? 'cm' : 'in'})</Label>
                  <span className="text-[10px] font-bold text-health">{height}</span>
                </div>
                <Slider 
                  value={[height]} 
                  min={units === "metric" ? 120 : 48} 
                  max={units === "metric" ? 220 : 86} 
                  step={1} 
                  onValueChange={([v]) => setHeight(v)} 
                />
                <Input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-medium rounded-lg shadow-sm" />
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
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Weight Insight</h4>
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
          <div className="surface-card p-8 md:p-10 space-y-10 bg-background border-border/60 shadow-md relative overflow-hidden group">
            <Scale className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <User className="size-3" />
                    Your Ideal Weight Average
                  </div>
                  <div className="text-5xl md:text-6xl font-mono font-bold tracking-tighter tabular-nums text-health">
                    {results.average.toFixed(1)}<span className="text-xl md:text-2xl ml-2 font-sans font-normal opacity-40 uppercase">{unitText}</span>
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
                    <Heart className="size-3 text-health" />
                    Healthy BMI Range
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-health tabular-nums">
                    {results.bmiMin.toFixed(0)} - {results.bmiMax.toFixed(0)} <span className="text-[10px] opacity-40 uppercase tracking-widest font-sans font-bold">{unitText}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Ruler className="size-3" />
                    Reference Height
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                    {height} <span className="text-[10px] opacity-40 uppercase tracking-widest font-sans font-bold">{units === 'metric' ? 'cm' : 'in'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Calculation Methods</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { l: "Robinson", v: results.robinson, desc: "Medical Standard" },
                { l: "Miller", v: results.miller, desc: "Clinical Standard" },
                { l: "Devine", v: results.devine, desc: "Surgical Reference" },
                { l: "Hamwi", v: results.hamwi, desc: "Older Standard" },
              ].map((f) => (
                <div key={f.l} className="surface-card p-6 border-border/30 bg-background hover:border-foreground/20 transition-all group">
                  <div className="text-[9px] uppercase font-bold text-muted-foreground mb-3 tracking-widest group-hover:text-foreground transition-colors">
                    {f.l}
                  </div>
                  <div className="text-2xl font-mono font-medium tracking-tight tabular-nums">
                    {f.v.toFixed(1)}<span className="text-[10px] ml-1 opacity-40 font-sans uppercase">{unitText}</span>
                  </div>
                  <div className="text-[8px] font-bold text-muted-foreground/60 uppercase tracking-tighter mt-2 group-hover:text-health transition-colors">
                    {f.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expert Insights */}
          <div className="grid md:grid-cols-2 gap-6 pt-2">
            <div className="surface-card p-8 border-border/30 bg-secondary/5 relative overflow-hidden group">
               <Zap className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
               <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Thermometer className="size-3 text-health" /> Body Frame Matters
               </div>
               <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                 Your frame size (small, medium, or large) and how much muscle you have can change your ideal weight by about 10%.
               </p>
            </div>
            <div className="surface-card p-8 border-border/30 bg-secondary/5 relative overflow-hidden group">
               <Activity className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
               <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Gauge className="size-3 text-health" /> Why multiple methods?
               </div>
               <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                 Doctors use different formulas to estimate safe weights for medical treatments, so checking multiple gives a better average.
               </p>
            </div>
          </div>

          {/* Registry Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { l: "Lowest Safe BMI", v: "18.5", i: Activity },
               { l: "Highest Safe BMI", v: "24.9", i: Landmark },
               { l: "Base Height", v: "5'0\"", i: Ruler },
               { l: "Result Type", v: "Average", i: User }
             ].map((item, idx) => (
               <div key={idx} className="surface-card p-5 border-border/30 bg-background hover:border-foreground/20 transition-colors group">
                 <div className="flex items-center gap-2 mb-3">
                    <item.i className="size-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{item.l}</span>
                 </div>
                 <div className="text-lg font-mono font-medium tabular-nums leading-tight">
                    {item.v}
                 </div>
               </div>
             ))}
          </div>

        </div>
      </div>
    </CalculatorPage>
  );
};

export default IdealWeightCalculator;
