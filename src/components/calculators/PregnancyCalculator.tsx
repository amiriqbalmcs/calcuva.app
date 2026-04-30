"use client";

import { useMemo, useState } from "react";
import { 
  Share, CheckCircle2, Baby, Info, Heart, Calendar, 
  Clock, Activity, Zap, Ruler, Sparkles, Flower2, 
  Settings2, Copy, LayoutDashboard, ChevronRight, 
  Waves, Flame, Siren, Gauge, Target, History, Landmark, User
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { calculatorBySlug } from "@/lib/calculators";
import { useUrlState } from "@/hooks/useUrlState";
import { SITE_DOMAIN } from "@/lib/constants";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("pregnancy-ovulation-calculator")!;
const fmtDate = (d: Date) => d.toLocaleDateString(undefined, { weekday: "short", month: "long", day: "numeric", year: "numeric" });

const PregnancyCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [lmp, setLmp] = useUrlState<string>("d", "2026-01-01");
  const [cycle, setCycle] = useUrlState<number>("cy", 28);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const lmpDate = new Date(lmp);
    if (isNaN(lmpDate.getTime())) return null;
    const dueDate = new Date(lmpDate.getTime() + 280 * 24 * 60 * 60 * 1000);
    const conception = new Date(lmpDate.getTime() + (cycle - 14) * 24 * 60 * 60 * 1000);
    const ovulation = conception;
    const now = new Date();
    const daysSinceLmp = Math.floor((now.getTime() - lmpDate.getTime()) / (24 * 60 * 60 * 1000));
    const weeks = Math.floor(daysSinceLmp / 7);
    const days = daysSinceLmp % 7;
    const trimester = weeks < 13 ? 1 : weeks < 27 ? 2 : 3;
    const daysToDue = Math.ceil((dueDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    
    let insight = "";
    if (trimester === 1) insight = "First Trimester: Your baby's organs are forming. Make sure to take your prenatal vitamins and get plenty of rest.";
    else if (trimester === 2) insight = "Second Trimester: You might start feeling your baby move, and many women find they have more energy during this time.";
    else insight = "Third Trimester: Your baby is getting ready for birth. Start planning your delivery and pay attention to your baby's movements.";

    return { dueDate, conception, ovulation, weeks, days, trimester, daysToDue, daysSinceLmp, insight };
  }, [lmp, cycle]);

  const handleCopy = () => {
    if (!result) return;
    let text = `Estimated Due Date: ${fmtDate(result.dueDate)}. Progress: ${result.weeks}w ${result.days}d. Gestational tracking at ${window.location.href}`;
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
            <Baby className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
            
            <div className="space-y-1 relative z-10">
              <h3 className="text-sm font-bold tracking-tight">Pregnancy Details</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Start Date</p>
            </div>

            <div className="space-y-8 relative z-10">
              {/* LMP Date */}
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Last Period (LMP)</Label>
                <div className="relative group">
                   <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                   <Input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} className="h-11 pl-12 bg-background border-border/60 font-bold rounded-lg shadow-sm" />
                </div>
              </div>

              {/* Cycle Length */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Cycle Period</Label>
                  <span className="text-[10px] font-bold text-health">{cycle} Days</span>
                </div>
                <Slider value={[cycle]} min={20} max={45} step={1} onValueChange={([v]) => setCycle(v)} />
                <Input type="number" value={cycle} onChange={(e) => setCycle(Number(e.target.value) || 28)} className="h-11 bg-background border-border/60 font-medium rounded-lg shadow-sm" />
              </div>
            </div>
          </div>

          <div className="surface-card p-6 border-border/30 bg-health/5 relative overflow-hidden group">
            <Info className="absolute -bottom-4 -right-4 size-20 text-health/5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1 text-health">
                <Sparkles className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Pregnancy Tip</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {result?.insight}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8">
          {result && (
            <>
              {/* Executive Summary */}
              <div className="surface-card p-8 md:p-10 space-y-10 bg-background border-border/60 shadow-md relative overflow-hidden group">
                <Waves className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        <Baby className="size-3" />
                        Estimated Due Date
                      </div>
                      <div className="text-4xl md:text-5xl font-mono font-bold tracking-tighter tabular-nums text-health">
                        {fmtDate(result.dueDate)}
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
                        <History className="size-3 text-health" />
                        Current Progress
                      </div>
                      <div className="text-3xl md:text-4xl font-mono font-bold text-health tabular-nums">
                        {result.weeks}<span className="text-[10px] opacity-40 uppercase tracking-widest font-sans font-bold">w</span> {result.days}<span className="text-[10px] opacity-40 uppercase tracking-widest font-sans font-bold">d</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        <Activity className="size-3" />
                        Trimester Phase
                      </div>
                      <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                        T{result.trimester} <span className="text-[10px] opacity-40 uppercase tracking-widest font-sans font-bold">— {result.daysToDue} Days Left</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Visual */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Pregnancy Timeline</h4>
                <div className="surface-card p-8 bg-secondary/5 border-border/40 relative group">
                  <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-4 opacity-60 font-mono">
                    <span>W0</span><span>W13</span><span>W27</span><span>W40</span>
                  </div>
                  <div className="h-4 w-full bg-secondary/20 rounded-full overflow-hidden border border-border/10 relative shadow-inner">
                    <div 
                      className="h-full bg-health/80 group-hover:bg-health transition-all duration-1000 shadow-[0_0_15px_rgba(var(--health),0.2)]"
                      style={{ width: `${Math.min(100, Math.max(0, (result.daysSinceLmp / 280) * 100))}%` }}
                    />
                  </div>
                  <div className="mt-4 flex justify-between items-center px-1">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">First Trimester</span>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">Second Trimester</span>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">Third Trimester</span>
                  </div>
                </div>
              </div>

              {/* Event Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { l: "Conception", v: result.conception.toLocaleDateString(), i: Sparkles },
                  { l: "Ovulation", v: result.ovulation.toLocaleDateString(), i: Zap },
                  { l: "Trimester", v: result.trimester, i: Landmark, unit: "PHASE" },
                  { l: "Due Date", v: result.dueDate.toLocaleDateString(), i: Target },
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

              {/* Clinical Insights */}
              <div className="grid md:grid-cols-2 gap-6 pt-2">
                <div className="surface-card p-8 border-border/30 bg-secondary/5 relative overflow-hidden group">
                   <Target className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
                   <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                     <Landmark className="size-3 text-health" /> How This Works
                   </div>
                   <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                     This calculator uses the standard medical formula (Naegele's Rule) to estimate your due date based on a 28-day cycle.
                   </p>
                </div>
                <div className="surface-card p-8 border-border/30 bg-secondary/5 relative overflow-hidden group">
                   <Activity className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
                   <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                     <Gauge className="size-3 text-health" /> Ultrasound Accuracy
                   </div>
                   <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                     While this gives a good estimate, an ultrasound from your doctor is the most accurate way to know how far along you are.
                   </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </CalculatorPage>
  );
};

export default PregnancyCalculator;
