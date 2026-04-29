"use client";

import { useMemo, useState } from "react";
import { 
  Share, CheckCircle2, AlertTriangle, Beer, Info, Clock, 
  Activity, Target, Zap, Ruler, ShieldAlert, Settings2, 
  History, Landmark, Globe, Copy, LayoutDashboard, ChevronRight, Gauge, 
  User, Waves, Flame, Siren
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculatorBySlug } from "@/lib/calculators";
import { useUrlState } from "@/hooks/useUrlState";
import { SITE_DOMAIN } from "@/lib/constants";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("blood-alcohol-content-calculator");

const BacCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;
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
    
    let status: 'safe' | 'warning' | 'critical' = 'safe';
    let insight = "";
    if (finalBac > 0.15) {
      status = 'critical';
      insight = "Severe Intoxication: Physical control and consciousness are at high risk. Medical intervention may be required.";
    } else if (finalBac >= 0.08) {
      status = 'critical';
      insight = "Legal Overlimit (USA): Coordination and judgment are significantly impaired. Operating machinery is illegal.";
    } else if (finalBac > 0.02) {
      status = 'warning';
      insight = "Moderate Impairment: Mood is elevated, but reaction times are slowing. Driving safety is compromised.";
    } else {
      status = 'safe';
      insight = "Minimal Alcohol: You are likely within safe bounds, though individual sensitivity varies significantly.";
    }

    return { bac: finalBac, insight, status };
  }, [weight, sex, drinks, hours]);

  const timeToZero = result.bac / 0.015;

  const handleCopy = () => {
    let text = `Estimated BAC: ${result.bac.toFixed(3)}%. Time to sobriety: ${timeToZero.toFixed(1)}h. Analyze safety at ${SITE_DOMAIN}`;
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
            <Beer className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
            
            <div className="space-y-1 relative z-10">
              <h3 className="text-sm font-bold tracking-tight">Your Details</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Body Information</p>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Weight */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Body Weight (kg)</Label>
                  <span className="text-[10px] font-bold text-health">{weight} kg</span>
                </div>
                <Slider value={[weight]} min={40} max={200} step={1} onValueChange={([v]) => setWeight(v)} />
              </div>

              {/* Sex Selection */}
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Biological Sex</Label>
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

              {/* Consumption */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Standard Drinks</Label>
                  <span className="text-[10px] font-bold text-health">{drinks} Units</span>
                </div>
                <Slider value={[drinks]} min={0} max={15} step={1} onValueChange={([v]) => setDrinks(v)} />
              </div>

              {/* Time */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Duration (hrs)</Label>
                  <span className="text-[10px] font-bold text-health">{hours} h</span>
                </div>
                <Slider value={[hours]} min={0} max={24} step={0.5} onValueChange={([v]) => setHours(v)} />
              </div>
            </div>
          </div>

          <div className={cn(
            "surface-card p-6 border-border/30 relative overflow-hidden group",
            result.status === 'critical' ? "bg-destructive/5 text-destructive" : "bg-health/5 text-health"
          )}>
            <ShieldAlert className={cn("absolute -bottom-4 -right-4 size-20 opacity-5 group-hover:rotate-12 transition-transform duration-700")} />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1">
                {result.status === 'critical' ? <Siren className="size-5" /> : <Activity className="size-5" />}
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Safety Check</h4>
                <p className="text-xs opacity-80 leading-relaxed font-medium">
                  {result.insight}
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
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Estimated Blood Alcohol</span>
                  <div className={cn(
                    "text-6xl md:text-7xl font-mono font-medium tracking-tighter tabular-nums transition-colors",
                    result.status === 'critical' ? "text-destructive" : result.status === 'warning' ? "text-amber-500" : "text-health"
                  )}>
                    {result.bac.toFixed(3)}<span className="text-2xl md:text-3xl ml-2 font-sans font-normal opacity-40 uppercase">%</span>
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
                <div className="flex items-center gap-1.5 px-4 py-1.5 bg-foreground text-background rounded-lg text-[10px] font-bold uppercase tracking-tight">
                  <Clock className="size-3" />
                  <span>Clears In: {timeToZero.toFixed(1)} Hours</span>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
                  Metabolism Rate: 0.015% / Hr
                </div>
              </div>
            </div>
          </div>

          {/* Visual Scale */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Blood Alcohol Scale</h4>
            <div className="surface-card p-8 bg-secondary/5 border-border/40 overflow-hidden relative">
              <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest text-muted-foreground mb-4 opacity-60">
                <span>0.00% (Sober)</span>
                <span>0.08% (Legal Limit)</span>
                <span>0.20%+ (Critical)</span>
              </div>
              <div className="h-6 w-full bg-secondary/20 rounded-full overflow-hidden flex border border-border/20 relative">
                <div className="h-full bg-health/40 w-[10%]" />
                <div className="h-full bg-amber-500/40 w-[30%]" />
                <div className="h-full bg-destructive/40 w-[60%]" />
                
                {/* Needle */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-foreground shadow-lg transition-all duration-1000 ease-out z-20"
                  style={{ left: `${Math.min(100, (result.bac / 0.2) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Formula Context */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { l: "Gender Constant", v: sex === 'male' ? "0.68" : "0.55", i: Landmark },
              { l: "Alcohol Density", v: "0.789", i: Waves, unit: "g/ml" },
              { l: "Standard Drink", v: "14", i: Target, unit: "g" },
              { l: "Elimination Rate", v: "0.015", i: History, unit: "%/h" },
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

          {/* Warnings */}
          <div className="surface-card p-6 bg-destructive/5 border-destructive/20 flex gap-4 items-start">
            <ShieldAlert className="size-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-destructive mb-1">Please Note</h4>
              <p className="text-[11px] text-destructive/80 leading-relaxed font-medium">
                This tool provides a mathematical estimate based on the Widmark formula and should not be used to determine fitness to drive. Individual alcohol absorption and metabolism rates vary significantly based on hydration, food intake, and physiology. 
                <span className="font-bold block mt-1 underline">Never drive after consuming alcohol.</span>
              </p>
            </div>
          </div>

        </div>
      </div>
    </CalculatorPage>
  );
};

export default BacCalculator;
