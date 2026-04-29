"use client";

import { useMemo, useState } from "react";
import { format, addDays, subDays, isWeekend, getDayOfYear, getISOWeek } from "date-fns";
import { 
  Share, CheckCircle2, CalendarDays, Info, Briefcase, Calendar, 
  Clock, ArrowRight, ArrowLeft, Zap, Target, History, Activity,
  Settings2, ChevronRight, Calculator, Scale, RefreshCcw, Watch,
  Copy, Ruler, Gauge, LayoutDashboard, Binary, Sparkles, Landmark
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { calculatorBySlug } from "@/lib/calculators";
import { useUrlState } from "@/hooks/useUrlState";
import { SITE_DOMAIN } from "@/lib/constants";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("date-plus-minus-calculator");

const DatePlusMinusCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;
  const [date, setDate] = useUrlState<string>("sd", "2026-01-01");
  const [amount, setAmount] = useUrlState<number>("n", 30);
  const [mode, setMode] = useUrlState<"add" | "sub">("m", "add");
  const [skipWeekends, setSkipWeekends] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    try {
      let current = new Date(date);
      if (isNaN(current.getTime())) return null;

      if (!skipWeekends) {
        current = mode === "add" ? addDays(current, amount) : subDays(current, amount);
      } else {
        let count = 0;
        while (count < amount) {
          current = mode === "add" ? addDays(current, 1) : subDays(current, 1);
          if (!isWeekend(current)) count++;
        }
      }
      
      let insight = "";
      if (skipWeekends) insight = "Working Days: This counts only Monday to Friday, perfect for planning work deadlines.";
      else if (amount >= 30) insight = "Total Days: This counts every single day on the calendar, including weekends.";
      else insight = "Simple Count: A quick way to find a date in the near future or past.";

      return { 
        dateString: format(current, "EEEE, MMMM do, yyyy"), 
        weekday: format(current, "EEEE"), 
        week: getISOWeek(current), 
        dayOfYear: getDayOfYear(current), 
        isWeekend: isWeekend(current),
        insight 
      };
    } catch { return null; }
  }, [date, amount, mode, skipWeekends]);

  const handleCopy = () => {
    let text = `Calculated Date: ${result?.dateString}. Find yours at ${SITE_DOMAIN}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        
        {/* Date Settings */}
        <div className="lg:col-span-4 space-y-6">
          <div className="surface-card p-6 md:p-8 space-y-10 bg-secondary/5 border-border/40 relative overflow-hidden group shadow-sm">
            <Settings2 className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
            
            <div className="space-y-4 relative z-10">
              <div className="space-y-1">
                <h3 className="text-sm font-bold tracking-tight">Calculator Options</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Add or Subtract Days</p>
              </div>
              <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full">
                <TabsList className="grid grid-cols-2 h-11 bg-background/50 border border-border/40 p-1 rounded-xl">
                  <TabsTrigger value="add" className="rounded-lg text-[9px] font-bold uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm">Add Days (+)</TabsTrigger>
                  <TabsTrigger value="sub" className="rounded-lg text-[9px] font-bold uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm">Subtract Days (-)</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Starting Point */}
              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Starting Date</Label>
                <div className="relative group">
                  <Input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    className="h-12 bg-background border-border/60 focus:border-foreground/20 transition-all font-bold text-lg rounded-xl shadow-sm" 
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30 pointer-events-none" />
                </div>
              </div>

              {/* Number of Days */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Number of Days</Label>
                  <span className="text-[10px] font-bold">{amount} Days</span>
                </div>
                <Input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(Number(e.target.value) || 0)} 
                  className="h-12 bg-background border-border/60 font-bold text-lg rounded-xl shadow-sm" 
                />
                <Slider value={[amount]} min={0} max={1000} step={1} onValueChange={([v]) => setAmount(v)} />
                <div className="flex flex-wrap gap-2">
                  {[7, 14, 30, 90, 365].map(v => (
                    <button 
                      key={v} 
                      onClick={() => setAmount(v)} 
                      className="px-3 py-1.5 rounded-lg bg-background border border-border/40 text-[9px] font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-all"
                    >
                      {v}D
                    </button>
                  ))}
                </div>
              </div>

              {/* Weekend Setting */}
              <div className="pt-6 border-t border-border/40 flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Weekend Setting</Label>
                  <p className="text-[10px] text-muted-foreground font-medium italic opacity-60">Skip Weekends (Mon-Fri Only)</p>
                </div>
                <Switch checked={skipWeekends} onCheckedChange={setSkipWeekends} />
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
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-finance/80">Timeline Details</h4>
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
              <CalendarDays className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />
              
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      {mode === "add" ? "Future Date" : "Past Date"}
                    </span>
                    <div className="text-4xl md:text-5xl font-mono font-medium tracking-tighter pt-4">
                      {result.dateString}
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
                    <Activity className="size-3" />
                    <span>Status: {result.isWeekend ? "Weekend" : "Working Day"}</span>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Change: {amount} Days {mode === 'add' ? 'Added' : 'Subtracted'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="surface-card p-24 flex flex-col items-center justify-center text-center bg-secondary/5 border-dashed border-2 border-border/40 rounded-3xl">
               <RefreshCcw className="size-16 text-muted-foreground/20 mb-6 animate-spin-slow" />
               <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40">Pick a starting date to begin</p>
            </div>
          )}

          {/* Precision Analytics Grid */}
          {result && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                 { l: "Weekday", v: result.weekday, i: Activity },
                 { l: "Week Number", v: result.week, i: Target, unit: "" },
                 { l: "Year Progress", v: ((result.dayOfYear / 365) * 100).toFixed(1), i: History, unit: "%" },
                 { l: "Day of Year", v: result.dayOfYear, i: Clock }
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
                <Briefcase className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-500" />
                <div className="flex items-center gap-3 relative z-10">
                  <Landmark className="size-4 text-muted-foreground" />
                  <h4 className="text-[10px] font-bold uppercase tracking-wider">Work Planning</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                  Skipping weekends helps you set realistic deadlines for business projects and work tasks that only happen during the week.
                </p>
             </div>
             <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group shadow-sm">
                <Calendar className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-500" />
                <div className="flex items-center gap-3 relative z-10">
                  <Scale className="size-4 text-muted-foreground" />
                  <h4 className="text-[10px] font-bold uppercase tracking-wider">Calendar Rules</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                  Our calculator handles leap years and different month lengths automatically, so your results are always perfectly accurate.
                </p>
             </div>
          </div>

        </div>
      </div>
    </CalculatorPage>
  );
};

export default DatePlusMinusCalculator;
