"use client";

import { useMemo, useState } from "react";
import { format, addHours, parse } from "date-fns";
import { 
  Share, CheckCircle2, Clock, Info, Zap, Settings2, 
  Copy, LayoutDashboard, ChevronRight, Timer, History, 
  Flame, Battery, Waves, Activity, Target, Landmark
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { HowToGuide } from "@/components/HowToGuide";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculatorBySlug } from "@/lib/calculators";
import { useUrlState } from "@/hooks/useUrlState";
import { SITE_DOMAIN } from "@/lib/constants";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("intermittent-fasting-calculator")!;

const PROTOCOLS = {
  "16-8": { fast: 16, eat: 8, label: "16:8 (LeanGains)", color: "bg-health" },
  "18-6": { fast: 18, eat: 6, label: "18:6 (Advanced)", color: "bg-health" },
  "20-4": { fast: 20, eat: 4, label: "20:4 (Warrior Diet)", color: "bg-health" },
  "23-1": { fast: 23, eat: 1, label: "OMAD (One Meal a Day)", color: "bg-health" },
};

const FastingCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [lastMeal, setLastMeal] = useUrlState<string>("lm", "20:00");
  const [protocol, setProtocol] = useUrlState<keyof typeof PROTOCOLS>("p", "16-8");
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    try {
      const startTime = parse(lastMeal, "HH:mm", new Date());
      const p = PROTOCOLS[protocol];
      const fastEnds = addHours(startTime, p.fast);
      const eatEnds = addHours(fastEnds, p.eat);
      
      let insight = "";
      if (p.fast >= 20) insight = "Long Fasts: Fasts longer than 20 hours can maximize fat burning and cellular repair.";
      else if (p.fast >= 16) insight = "16-Hour Fasts: 16 hours is a great sweet spot for helping your body burn fat.";
      else insight = "Standard Fasts: This is a great standard fasting window that can help improve sleep and digestion.";

      return { 
        fastStart: format(startTime, "h:mm aa"), 
        fastEnd: format(fastEnds, "h:mm aa"), 
        eatEnd: format(eatEnds, "h:mm aa"), 
        fastHours: p.fast, 
        eatHours: p.eat, 
        insight 
      };
    } catch { return null; }
  }, [lastMeal, protocol]);

  const handleCopy = () => {
    if (!results) return;
    let text = `Fasting Protocol ${protocol}: Window ends at ${results.fastEnd}. Resume feeding until ${results.eatEnd}. Optimize yours at ${window.location.href}`;
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
            <Timer className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
            
            <div className="space-y-1 relative z-10">
              <h3 className="text-sm font-bold tracking-tight">Fasting Protocol</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Schedule</p>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Protocol Selection */}
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Fasting Window</Label>
                <Select value={protocol} onValueChange={(v) => setProtocol(v as any)}>
                  <SelectTrigger className="h-11 bg-background border-border/60 font-medium text-xs uppercase tracking-widest rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/40">
                    {Object.entries(PROTOCOLS).map(([k, v]) => (
                      <SelectItem key={k} value={k} className="text-[10px] font-bold uppercase">{v.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Start Time */}
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Last Meal Time</Label>
                <div className="relative group">
                   <Clock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                   <Input type="time" value={lastMeal} onChange={(e) => setLastMeal(e.target.value)} className="h-11 pl-12 bg-background border-border/60 font-bold rounded-lg shadow-sm" />
                </div>
              </div>
            </div>
          </div>

          <div className="surface-card p-6 border-border/30 bg-health/5 relative overflow-hidden group">
            <Info className="absolute -bottom-4 -right-4 size-20 text-health/5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1 text-health">
                <Zap className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Fasting Tip</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {results?.insight}
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
          {results && (
            <>
              {/* Executive Summary */}
              <div className="surface-card p-8 md:p-10 space-y-10 bg-background border-border/60 shadow-md relative overflow-hidden group">
                <Waves className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        <Timer className="size-3" />
                        Fast Ends At
                      </div>
                      <div className="text-6xl md:text-7xl font-mono font-bold tracking-tighter tabular-nums text-health">
                        {results.fastEnd}
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
                        Fasting Period
                      </div>
                      <div className="text-3xl md:text-4xl font-mono font-bold text-health tabular-nums">
                        {results.fastHours}<span className="text-[10px] opacity-40 uppercase tracking-widest font-sans font-bold">Hours</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        <Activity className="size-3" />
                        Eating Window
                      </div>
                      <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                        {results.fastEnd} <span className="text-[10px] opacity-40 uppercase tracking-widest font-sans font-bold">— {results.eatEnd}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cycle Visual */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Daily Fasting Rhythm</h4>
                <div className="surface-card p-8 bg-secondary/5 border-border/40">
                  <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-4 opacity-60">
                    <span>{results.fastStart}</span>
                    <span>24-Hour Cycle</span>
                    <span>{results.fastStart}</span>
                  </div>
                  <div className="h-14 w-full bg-secondary/20 rounded-2xl overflow-hidden flex border border-border/20 shadow-inner group">
                    <div 
                      className="bg-health/80 group-hover:bg-health transition-all flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-tighter"
                      style={{ width: `${(results.fastHours / 24) * 100}%` }}
                    >
                      <History className="size-3 mr-2 hidden md:block" /> {results.fastHours}h Fasting
                    </div>
                    <div 
                      className="bg-foreground/5 group-hover:bg-foreground/10 transition-all flex items-center justify-center text-[10px] font-bold text-foreground uppercase tracking-tighter"
                      style={{ width: `${(results.eatHours / 24) * 100}%` }}
                    >
                      <Battery className="size-3 mr-2 hidden md:block" /> {results.eatHours}h Eating
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { l: "Blood Sugar Drops", v: "12-16", i: Zap, unit: "Hrs" },
                  { l: "Fat Burning Starts", v: "16-18", i: Flame, unit: "Hrs" },
                  { l: "Cellular Repair", v: "20-24", i: Target, unit: "Hrs" },
                  { l: "Growth Hormone", v: "24+", i: Landmark, unit: "Hrs" },
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

              {/* Expert Summary Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="surface-card p-6 flex items-center gap-6 bg-secondary/5 border-border/30">
                  <div className="size-16 rounded-2xl bg-background border border-border/40 flex items-center justify-center shrink-0 shadow-sm">
                    <Waves className="size-8 text-muted-foreground/40" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[10px] uppercase tracking-widest mb-1">Stay Hydrated</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      Drink plenty of water, black coffee, or plain tea during your fast to stay hydrated and keep hunger away.
                    </p>
                  </div>
                </div>
                <div className="surface-card p-6 flex items-center gap-6 bg-secondary/5 border-border/30">
                  <div className="size-16 rounded-2xl bg-background border border-border/40 flex items-center justify-center shrink-0 shadow-sm">
                    <Activity className="size-8 text-muted-foreground/40" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[10px] uppercase tracking-widest mb-1">Breaking Your Fast</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      Break your fast with a balanced meal of protein and fiber to avoid an energy crash and keep you full longer.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </CalculatorPage>
  );
};

export default FastingCalculator;
