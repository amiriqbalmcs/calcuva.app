"use client";

import { useState, useMemo } from "react";
import { Baby, Calendar, Heart, Info, Clock, Thermometer, Footprints, Sparkles } from "lucide-react";
import CalculatorPage from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ResultStat from "@/components/ResultStat";
import { cn } from "@/lib/utils";

interface PregnancyWeekCalculatorProps {
  calc: any;
  guideHtml?: string;
}

export default function PregnancyWeekCalculator({ calc, guideHtml }: PregnancyWeekCalculatorProps) {
  const [lmp, setLmp] = useState<string>(new Date().toISOString().split('T')[0]);

  const results = useMemo(() => {
    const lastPeriod = new Date(lmp);
    const today = new Date();
    
    // Difference in time
    const diffTime = today.getTime() - lastPeriod.getTime();
    
    // Difference in days
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0 || diffDays > 300) return null;

    const currentWeek = Math.floor(diffDays / 7);
    const currentDays = diffDays % 7;
    
    // Naegele's Rule: LMP + 280 days
    const dueDate = new Date(lastPeriod.getTime() + (280 * 1000 * 60 * 60 * 24));
    
    // Trimester
    let trimester = 1;
    if (currentWeek >= 13 && currentWeek < 27) trimester = 2;
    if (currentWeek >= 27) trimester = 3;

    // Millestones based on week
    const milestones = [
      { week: 4, label: "Implantation Complete" },
      { week: 8, label: "Major Organs Developing" },
      { week: 12, label: "Heartbeat Audible via Doppler" },
      { week: 16, label: "Baby can grasp & squint" },
      { week: 20, label: "Anatomy Scan (Midpoint)" },
      { week: 24, label: "Viability Milestone" },
      { week: 28, label: "Eyes open & blink" },
      { week: 32, label: "Rapid Weight Gain" },
      { week: 37, label: "Early Term" },
      { week: 40, label: "Estimated Due Date" },
    ];

    const upcomingMilestone = milestones.find(m => m.week > currentWeek);

    return {
      currentWeek,
      currentDays,
      trimester,
      dueDate,
      daysToDueDate: 280 - diffDays,
      percentComplete: (diffDays / 280) * 100,
      upcomingMilestone
    };
  }, [lmp]);

  const formatDate = (date: Date) => 
    date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-8">
          <div className="surface-card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="size-10 rounded-xl bg-health/10 flex items-center justify-center text-health shadow-inner">
                <Baby className="size-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">Pregnancy Status</h2>
                <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest font-bold">Timeline Calculation</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="lmp">First Day of Last Period (LMP)</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="lmp"
                    type="date"
                    value={lmp}
                    onChange={(e) => setLmp(e.target.value)}
                    className="pl-9 h-12 bg-background border-border rounded-xl font-medium"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground italic">Standard dating starts from the first day of your last cycle.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          {!results ? (
            <div className="surface-card p-12 flex flex-col items-center justify-center text-center border-dashed opacity-50">
               <Sparkles className="size-12 mb-4 text-muted-foreground" />
               <p className="text-sm font-medium">Please enter a valid date within the last 9 months.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <ResultStat
                   label="Current Progress"
                   value={`${results.currentWeek} Weeks, ${results.currentDays} Days`}
                   description={`Trimester ${results.trimester}`}
                   className="bg-health/5 border-health/20"
                   icon={Clock}
                   valueClassName="text-health text-3xl"
                 />
                 <ResultStat
                   label="Estimated Due Date"
                   value={formatDate(results.dueDate)}
                   description={`${results.daysToDueDate} Days Remaining`}
                   className="bg-health/5 border-health/10"
                   icon={Heart}
                   valueClassName="text-health"
                 />
              </div>

              <div className="surface-card p-8 bg-gradient-to-br from-health/5 to-transparent relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Footprints className="size-24 text-health" />
                 </div>
                 
                 <div className="flex items-center gap-3 mb-8">
                    <TrendingUp className="size-4 text-health" />
                    <h3 className="text-xs font-bold uppercase tracking-widest font-mono">Pregnancy Milestone Progress</h3>
                 </div>

                 <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-end mb-2">
                       <span className="text-sm font-bold text-foreground">{results.percentComplete.toFixed(1)}% Complete</span>
                       <span className="text-[10px] font-bold text-muted-foreground uppercase">Target: 40 Weeks</span>
                    </div>
                    <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                       <div 
                         className="bg-health h-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(var(--health),0.3)]"
                         style={{ width: `${results.percentComplete}%` }}
                       />
                    </div>
                    
                    <div className="mt-10 grid grid-cols-1 gap-4">
                       <div className="p-4 bg-background border border-border/50 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="size-10 rounded-full bg-health/10 flex items-center justify-center text-health">
                                <Thermometer className="size-5" />
                             </div>
                             <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Next Major Phase</p>
                                <p className="text-sm font-bold">{results.upcomingMilestone?.label || "Birth"}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Week</p>
                             <p className="text-sm font-mono font-bold">{results.upcomingMilestone?.week || 40}</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </>
          )}

          <div className="p-4 bg-secondary/10 rounded-2xl border border-border/50">
             <div className="flex gap-4">
                <Info className="size-5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Calculated using **Naegele's Rule** assuming a 28-day cycle. Only 4% of babies are born on their exact due date. This tool is for informational purposes and does not replace medical advice from your OB-GYN.
                </p>
             </div>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
}
