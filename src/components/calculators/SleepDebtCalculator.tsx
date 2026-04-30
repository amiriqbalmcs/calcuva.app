"use client";

import { useMemo, useState } from "react";
import {
  Moon, Sun, TrendingUp, Info, BookOpen, Target, 
  ChevronRight, Calculator, Scale, RefreshCcw, Activity,
  Sparkles, Globe, Copy, Award, AlertCircle, Clock, Timer
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("sleep-debt-calculator");

const SleepDebtCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;

  const [targetHours, setTargetHours] = useState<number>(8);
  const [dailySleep, setDailySleep] = useState<number[]>([7, 6, 8, 5, 7, 9, 8]); // 7 days

  const result = useMemo(() => {
    const totalActual = dailySleep.reduce((s, h) => s + h, 0);
    const totalNeeded = targetHours * 7;
    const debt = totalNeeded - totalActual;
    const average = totalActual / 7;

    let status = "Healthy";
    if (debt > 10) status = "Severe Deficit";
    else if (debt > 5) status = "Moderate Debt";
    else if (debt < 0) status = "Fully Rested";

    return { debt, totalActual, average, status };
  }, [dailySleep, targetHours]);

  const updateSleep = (idx: number, val: number) => {
    const newSleep = [...dailySleep];
    newSleep[idx] = Math.min(24, Math.max(0, val));
    setDailySleep(newSleep);
  };

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        <div className="lg:col-span-8 space-y-6">
          <div className="surface-card bg-secondary/5 border-border/40 overflow-hidden group shadow-sm">
            <div className="p-6 md:p-8 border-b border-border/40 flex items-center justify-between bg-background relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-foreground" />
              <div className="flex items-center gap-3 relative z-10">
                <Clock className="size-5 text-muted-foreground/60" />
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold tracking-tight">Weekly Sleep Log</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Log your actual hours per night</p>
                </div>
              </div>
              <div className="flex items-center gap-4 px-4 py-2 bg-secondary/10 rounded-xl border border-border/40">
                 <Label className="text-[10px] font-bold uppercase tracking-wider">Goal</Label>
                 <Input 
                    type="number" 
                    value={targetHours} 
                    onChange={(e) => setTargetHours(Number(e.target.value) || 0)}
                    className="w-12 h-8 bg-background border-border/60 text-center font-bold p-0 text-xs rounded-lg"
                 />
              </div>
            </div>

            <div className="p-8 grid grid-cols-2 md:grid-cols-7 gap-4">
               {days.map((day, i) => (
                  <div key={day} className="space-y-3">
                     <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground text-center">{day}</div>
                     <div className="relative">
                        <Input
                           type="number"
                           step="0.5"
                           value={dailySleep[i]}
                           onChange={(e) => updateSleep(i, Number(e.target.value) || 0)}
                           className="h-16 bg-background border-border/60 font-mono text-xl font-bold rounded-2xl shadow-sm text-center tabular-nums focus:ring-foreground transition-all"
                        />
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                           <div className={cn("size-1 rounded-full", dailySleep[i] >= targetHours ? "bg-health" : "bg-destructive/40")} />
                        </div>
                     </div>
                  </div>
               ))}
            </div>
          </div>

          <div className="surface-card p-6 border-border/30 bg-foreground/5 relative overflow-hidden group">
            <Sparkles className="absolute -bottom-4 -right-4 size-24 text-foreground/5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1 text-foreground/60">
                <Info className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Circadian Recovery</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  "Sleep Debt" is the difference between the sleep you need and the sleep you actually get. Recovery usually takes 2-3 nights of extra sleep, not just one long session.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="surface-card p-8 bg-background border-border/60 shadow-md relative overflow-hidden group">
             <div className="space-y-10 relative z-10">
                <div className="space-y-2">
                   <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                      <Timer className="size-3" /> Cumulative Sleep Debt
                   </div>
                   <div className={cn("text-7xl font-mono font-bold tracking-tighter tabular-nums transition-colors", 
                      result.debt > 10 ? "text-destructive" : result.debt > 0 ? "text-foreground" : "text-health"
                   )}>
                      {result.debt.toFixed(1)}<span className="text-2xl ml-1 opacity-20">hrs</span>
                   </div>
                </div>

                <div className="space-y-6 pt-8 border-t border-border/40">
                   <div className="flex justify-between items-end">
                      <div className="space-y-1">
                         <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Avg Sleep / Night</div>
                         <div className="text-2xl font-bold tracking-tight text-foreground">{result.average.toFixed(1)}h</div>
                      </div>
                      <div className="space-y-1 text-right">
                         <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Status</div>
                         <div className={cn("text-xs font-black uppercase tracking-widest", 
                            result.debt > 5 ? "text-destructive" : "text-health"
                         )}>{result.status}</div>
                      </div>
                   </div>

                   <div className="p-5 rounded-2xl bg-foreground/5 border border-border/30 space-y-3">
                      <div className="flex items-center gap-2 text-foreground/60">
                         <Activity className="size-4" />
                         <span className="text-[10px] font-bold uppercase tracking-widest">Recovery Recommendation</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed font-medium italic">
                         {result.debt > 0 
                           ? `Aim to add ${Math.min(2, result.debt / 3).toFixed(1)} hours of extra sleep to your next 3 nights to clear this debt.`
                           : "You are fully rested! Maintaining this consistency will improve cognitive focus and metabolic health."}
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
};

export default SleepDebtCalculator;
