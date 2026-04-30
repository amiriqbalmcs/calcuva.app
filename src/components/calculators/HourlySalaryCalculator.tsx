"use client";

import { useMemo, useState } from "react";
import { 
  Share, CheckCircle2, TrendingUp, Info, Wallet, Landmark, 
  Clock, Calendar, Briefcase, Timer, History, Zap, Copy, 
  LayoutDashboard, Calculator, Settings2, Banknote, 
  ShieldCheck, ChevronRight, Target, Activity, Ruler, Sparkles
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { calculatorBySlug } from "@/lib/calculators";
import { formatCurrency, formatNumber } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { useCurrency } from "@/context/CurrencyContext";
import { SITE_DOMAIN } from "@/lib/constants";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("hourly-to-salary-calculator");

const HourlySalaryCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;
  const { currency } = useCurrency();
  const [hourly, setHourly] = useUrlState<number>("h", 40);
  const [hoursPerDay, setHoursPerDay] = useUrlState<number>("hd", 8);
  const [daysPerWeek, setDaysPerWeek] = useUrlState<number>("dw", 5);
  const [weeksPerYear, setWeeksPerYear] = useUrlState<number>("wy", 52);
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    const daily = hourly * hoursPerDay;
    const weekly = daily * daysPerWeek;
    const monthly = (weekly * weeksPerYear) / 12;
    const annual = weekly * weeksPerYear;
    const totalHours = hoursPerDay * daysPerWeek * weeksPerYear;

    return { daily, weekly, monthly, annual, totalHours };
  }, [hourly, hoursPerDay, daysPerWeek, weeksPerYear]);

  const handleCopy = () => {
    let text = `Annual Salary Equivalent: ${formatCurrency(results.annual, currency.code)} (${formatCurrency(hourly, currency.code)}/hr). Audit at ${window.location.href}`;
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
              <h3 className="text-sm font-bold tracking-tight">Work Schedule</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Your Working Hours</p>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Hourly Rate */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Hourly Rate</Label>
                  <span className="text-[10px] font-bold text-finance">{formatCurrency(hourly, currency.code)}</span>
                </div>
                <div className="relative group">
                  <Input 
                    type="number" 
                    value={hourly} 
                    onChange={(e) => setHourly(Number(e.target.value) || 0)} 
                    className="h-12 bg-background border-border/60 focus:border-foreground/20 transition-all font-bold text-lg rounded-xl pr-12 shadow-sm"
                  />
                  <Banknote className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30" />
                </div>
                <Slider value={[hourly]} min={7} max={1000} step={0.5} onValueChange={([v]) => setHourly(v)} />
              </div>

              {/* Grid Inputs */}
              <div className="space-y-6 pt-4 border-t border-border/40">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <span>Hours per Day</span>
                    <span className="text-foreground">{hoursPerDay}h</span>
                  </div>
                  <Slider value={[hoursPerDay]} min={1} max={24} step={0.5} onValueChange={([v]) => setHoursPerDay(v)} />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <span>Days per Week</span>
                    <span className="text-foreground">{daysPerWeek}d</span>
                  </div>
                  <Slider value={[daysPerWeek]} min={1} max={7} step={1} onValueChange={([v]) => setDaysPerWeek(v)} />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <span>Weeks per Year</span>
                    <span className="text-foreground">{weeksPerYear}w</span>
                  </div>
                  <Slider value={[weeksPerYear]} min={1} max={52} step={1} onValueChange={([v]) => setWeeksPerYear(v)} />
                </div>
              </div>
            </div>
          </div>

          {/* Insight Panel */}
          <div className="surface-card p-6 border-border/30 bg-health/5 text-health relative overflow-hidden group">
            <ShieldCheck className="absolute -bottom-4 -right-4 size-20 opacity-5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1">
                <Clock className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Pay Summary</h4>
                <p className="text-xs opacity-80 leading-relaxed font-medium">
                  At {formatCurrency(hourly, currency.code)}/hr, you earn {formatCurrency(results.daily, currency.code)} per day. 
                  Your total annual commitment is {formatNumber(results.totalHours)} hours of work.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Executive Summary */}
          <div className="surface-card p-8 md:p-10 space-y-10 bg-background border-border/60 shadow-md relative overflow-hidden group">
            <Briefcase className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Landmark className="size-3" />
                    Your Annual Salary
                  </div>
                  <div className="text-5xl md:text-6xl font-mono font-bold tracking-tighter tabular-nums text-finance">
                    {formatCurrency(results.annual, currency.code)}
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
                    <Wallet className="size-3 text-health" />
                    Monthly Pay
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-health tabular-nums">
                    {formatCurrency(results.monthly, currency.code)}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Timer className="size-3" />
                    Weekly Pay
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                    {formatCurrency(results.weekly, currency.code)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Integration Matrix */}
          <div className="surface-card p-10 bg-secondary/5 border-border/30 relative overflow-hidden group shadow-sm">
             <Sparkles className="absolute -top-4 -right-4 size-48 text-muted-foreground/5 opacity-40 group-hover:rotate-12 transition-transform duration-1000" />
             <div className="flex items-center gap-3 mb-10 relative z-10">
               <div className="size-8 rounded-lg bg-foreground text-background flex items-center justify-center shadow-lg">
                 <LayoutDashboard className="size-4" />
               </div>
               <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Estimated Earnings</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
               {[
                 { l: "Daily (8h)", v: results.daily, i: Timer },
                 { l: "Bi-Weekly", v: results.weekly * 2, i: Calendar },
                 { l: "Total Hours", v: results.totalHours, i: History, unit: "h" },
                 { l: "Full-Time %", v: ((hoursPerDay * daysPerWeek) / 40 * 100).toFixed(1), i: Activity, unit: "%" }
               ].map((item, idx) => (
                 <div key={idx} className="bg-background border border-border/40 p-6 rounded-2xl group/item hover:border-foreground/20 transition-all shadow-sm">
                   <div className="flex items-center gap-2 mb-3">
                      <item.i className="size-3 text-muted-foreground group-hover/item:text-foreground transition-colors" />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">{item.l}</span>
                   </div>
                   <div className="text-lg font-mono font-bold tabular-nums leading-tight">
                      {typeof item.v === 'number' && item.unit !== '%' && item.unit !== 'h' ? formatCurrency(item.v, currency.code) : item.v}
                      {item.unit && <span className="text-[10px] ml-1 opacity-40 uppercase">{item.unit}</span>}
                   </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Professional Contexts */}
          <div className="grid md:grid-cols-2 gap-6 pt-4">
             <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group shadow-sm">
                <Landmark className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:-rotate-12 transition-transform duration-500" />
                <div className="flex items-center gap-3 relative z-10">
                  <ShieldCheck className="size-4 text-muted-foreground" />
                  <h4 className="text-[10px] font-bold uppercase tracking-wider">Note on Taxes</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed relative z-10 font-medium">
                  This is your gross income before taxes and fees. Your actual take-home pay will vary based on your local tax rate.
                </p>
             </div>
             <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group shadow-sm">
                <Calendar className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:-rotate-12 transition-transform duration-500" />
                <div className="flex items-center gap-3 relative z-10">
                  <Timer className="size-4 text-muted-foreground" />
                  <h4 className="text-[10px] font-bold uppercase tracking-wider">Holidays & Vacations</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed relative z-10 font-medium">
                  To account for unpaid leave or public holidays, adjust "Weeks per Year" to 50 (standard 2-week vacation) for a more realistic annual projection.
                </p>
             </div>
          </div>

        </div>
      </div>
    </CalculatorPage>
  );
};

export default HourlySalaryCalculator;
