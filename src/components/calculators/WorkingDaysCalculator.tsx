"use client";

import { useMemo, useState } from "react";
import { format, differenceInCalendarDays, eachDayOfInterval, isWeekend } from "date-fns";
import { 
  Share, CheckCircle2, Briefcase, Info, Calendar, Clock, History, 
  Zap, ArrowRight, Target, Activity, Globe, Ruler, Gauge, Sparkles, 
  LayoutDashboard, Settings2, ChevronRight, Calculator, Scale, 
  RefreshCcw, Watch, Copy, Landmark, Binary
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { calculatorBySlug } from "@/lib/calculators";
import { useUrlState } from "@/hooks/useUrlState";
import { SITE_DOMAIN } from "@/lib/constants";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("business-working-days-calculator");

const WorkingDaysCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;
  const [start, setStart] = useUrlState<string>("sd", "2026-01-01");
  const [end, setEnd] = useUrlState<string>("ed", "2026-02-01");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    try {
      const s = new Date(start);
      const e = new Date(end);
      if (e < s) return null;
      const total = differenceInCalendarDays(e, s);
      const interval = eachDayOfInterval({ start: s, end: e });
      const working = interval.filter(d => !isWeekend(d)).length;
      const weekends = interval.length - working;
      
      let insight = "";
      const ratio = (working / (total || 1)) * 100;
      if (ratio < 70) insight = "Low Availability: You have many weekends in this period, which might slow down your project.";
      else if (total > 30) insight = "Long Project: For tasks over 30 days, remember to check for any public holidays.";
      else insight = "Good Schedule: Your project timeline has a healthy balance of working days.";

      return { working, total, weekends, insight, ratio };
    } catch { return null; }
  }, [start, end]);

  const handleCopy = () => {
    let text = `Work Project: ${result?.working} Working Days (${result?.total} Total Days). Check yours at ${SITE_DOMAIN}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        
        {/* Project Dates */}
        <div className="lg:col-span-4 space-y-6">
          <div className="surface-card p-6 md:p-8 space-y-10 bg-secondary/5 border-border/40 relative overflow-hidden group shadow-sm">
            <Settings2 className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
            
            <div className="space-y-1 relative z-10">
              <h3 className="text-sm font-bold tracking-tight">Project Dates</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Set Start and End Dates</p>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Start Date */}
              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Start Date</Label>
                <div className="relative group">
                  <Input 
                    type="date" 
                    value={start} 
                    onChange={(e) => setStart(e.target.value)} 
                    className="h-12 bg-background border-border/60 focus:border-foreground/20 transition-all font-bold text-lg rounded-xl shadow-sm" 
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30 pointer-events-none" />
                </div>
              </div>

              <div className="flex justify-center py-2 opacity-20">
                <ArrowRight className="size-5 rotate-90 lg:rotate-0" />
              </div>

              {/* End Date */}
              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">End Date</Label>
                <div className="relative group">
                  <Input 
                    type="date" 
                    value={end} 
                    onChange={(e) => setEnd(e.target.value)} 
                    className="h-12 bg-background border-border/60 focus:border-foreground/20 transition-all font-bold text-lg rounded-xl shadow-sm" 
                  />
                  <Target className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="surface-card p-6 border-border/30 bg-finance/5 text-finance relative overflow-hidden group shadow-sm">
            <Sparkles className="absolute -bottom-4 -right-4 size-20 opacity-5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1">
                <Zap className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-finance/80">Project Summary</h4>
                <p className="text-xs leading-relaxed font-medium">
                  {result?.insight}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Executive Summary */}
          {result ? (
            <div className="surface-card p-8 md:p-12 space-y-8 bg-background border-border/60 shadow-md relative overflow-hidden group">
              <Briefcase className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />
              
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Total Working Days</span>
                    <div className="text-6xl md:text-8xl font-mono font-medium tracking-tighter tabular-nums pt-4">
                      {result.working}
                      <span className="text-xs md:text-sm ml-4 font-bold text-muted-foreground uppercase tracking-[0.3em] opacity-40">Working Days</span>
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
                
                <div className="flex flex-wrap items-center gap-6 pt-10 border-t border-border/40">
                  <div className="flex items-center gap-1.5 px-4 py-1.5 bg-foreground text-background rounded-lg text-[10px] font-bold uppercase tracking-tight shadow-md">
                    <Calendar className="size-3" />
                    <span>Calendar Days: {result.total} Days</span>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
                    Work Percentage: {result.ratio.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="surface-card p-24 flex flex-col items-center justify-center text-center bg-secondary/5 border-dashed border-2 border-border/40 rounded-3xl">
               <RefreshCcw className="size-16 text-muted-foreground/20 mb-6 animate-spin-slow" />
               <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40">Pick your start and end dates to see results</p>
            </div>
          )}

          {/* Distribution Visualization */}
          {result && (
            <div className="surface-card p-8 bg-secondary/5 border-border/40 space-y-8 relative overflow-hidden group shadow-sm">
              <div className="flex items-center gap-3 relative z-10">
                <LayoutDashboard className="size-4 text-muted-foreground/60" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest">Work vs. Weekend</h3>
              </div>
              
              <div className="space-y-6 relative z-10">
                <div className="flex h-12 rounded-2xl overflow-hidden shadow-sm border border-border/30">
                  <div 
                    className="bg-foreground text-background flex flex-col items-center justify-center transition-all duration-1000 ease-out border-r border-background/10"
                    style={{ width: `${result.ratio}%` }}
                  >
                    <span className="text-[9px] font-bold uppercase tracking-tighter">{result.ratio.toFixed(0)}%</span>
                  </div>
                  <div 
                    className="bg-secondary/40 flex flex-col items-center justify-center transition-all duration-1000 ease-out"
                    style={{ width: `${100 - result.ratio}%` }}
                  >
                    <span className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">{(100 - result.ratio).toFixed(0)}%</span>
                  </div>
                </div>
                
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground px-1">
                  <div className="flex items-center gap-2"><div className="size-2 rounded-full bg-foreground" /> Working Days</div>
                  <div className="flex items-center gap-2"><div className="size-2 rounded-full bg-secondary" /> Weekend Days</div>
                </div>
              </div>
            </div>
          )}

          {/* Precision Analytics Grid */}
          {result && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                 { l: "Weekends", v: result.weekends, i: History, unit: "Days" },
                 { l: "Work Hours", v: result.working * 8, i: Clock, unit: "H" },
                 { l: "Productivity", v: result.ratio.toFixed(1), i: Target, unit: "%" },
                 { l: "Status", v: "Verified", i: Activity }
               ].map((item, idx) => (
                 <div key={idx} className="surface-card p-6 border-border/30 bg-background hover:border-foreground/20 transition-all group shadow-sm">
                   <div className="flex items-center gap-2 mb-3">
                      <item.i className="size-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">{item.l}</span>
                   </div>
                   <div className="text-xl font-mono font-bold tabular-nums leading-tight">
                      {item.v}
                      {item.unit && <span className="text-[10px] ml-1 opacity-40 uppercase">{item.unit}</span>}
                   </div>
                 </div>
               ))}
            </div>
          )}

          {/* Expert Strategy Cards */}
          <div className="grid md:grid-cols-2 gap-6 pt-2">
             <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group shadow-sm">
                <Landmark className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-500" />
                <div className="flex items-center gap-3 relative z-10">
                  <Scale className="size-4 text-muted-foreground" />
                  <h4 className="text-[10px] font-bold uppercase tracking-wider">Business Rules</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                  We count Monday to Friday as working days, following standard business rules used by most companies worldwide.
                </p>
             </div>
             <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group shadow-sm">
                <Globe className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-500" />
                <div className="flex items-center gap-3 relative z-10">
                  <History className="size-4 text-muted-foreground" />
                  <h4 className="text-[10px] font-bold uppercase tracking-wider">Public Holidays</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                  Remember to subtract any local public holidays from your total to get a perfectly accurate count for your specific area.
                </p>
             </div>
          </div>

        </div>
      </div>
    </CalculatorPage>
  );
};

export default WorkingDaysCalculator;
