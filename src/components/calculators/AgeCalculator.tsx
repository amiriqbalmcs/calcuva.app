"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Share, CheckCircle2, Calendar, Info, Timer, Hourglass, History,
  Sparkles, User, Heart, Target, Activity, Zap, Globe, Landmark,
  Gauge, Ruler, Copy, Settings2, LayoutDashboard, ChevronRight,
  Calculator, Scale, RefreshCcw, Watch
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { HowToGuide } from "@/components/HowToGuide";
import { calculatorBySlug } from "@/lib/calculators";
import { formatNumber } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { SITE_DOMAIN } from "@/lib/constants";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("age-calculator")!;

const AgeCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [birth, setBirth] = useUrlState<string>("b", "1995-06-15");
  const [target, setTarget] = useUrlState<string>("t", new Date().toISOString().split('T')[0]);
  const [now, setNow] = useState(new Date());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  if (!calc) return null;

  const result = useMemo(() => {
    const b = new Date(birth);
    const t = new Date(target);
    if (isNaN(b.getTime()) || isNaN(t.getTime()) || t < b) return null;

    let years = t.getFullYear() - b.getFullYear();
    let months = t.getMonth() - b.getMonth();
    let days = t.getDate() - b.getDate();
    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(t.getFullYear(), t.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    const totalMs = t.getTime() - b.getTime();
    const totalDays = Math.floor(totalMs / 86400000);
    const totalHours = Math.floor(totalMs / 3600000);
    const totalMinutes = Math.floor(totalMs / 60000);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    const nextBday = new Date(now.getFullYear(), b.getMonth(), b.getDate());
    if (nextBday < now) nextBday.setFullYear(now.getFullYear() + 1);
    const daysToBday = Math.ceil((nextBday.getTime() - now.getTime()) / 86400000);
    const liveMs = Math.max(0, now.getTime() - b.getTime());
    const liveSeconds = Math.floor(liveMs / 1000);

    let insight = "";
    if (daysToBday === 0) insight = "Happy Birthday! Today marks the start of a brand new year in your life.";
    else if (daysToBday < 14) insight = "Your birthday is coming up! Your next big day is in less than 2 weeks.";
    else if (totalDays > 10000) insight = "Life Experience: You have lived over 10,000 days. That is a wonderful journey so far.";
    else insight = "Time Tracker: You have lived over 500,000 minutes. Every new second is a fresh start.";

    return { years, months, days, totalDays, totalHours, totalMinutes, totalWeeks, totalMonths, daysToBday, liveSeconds, insight };
  }, [birth, target, now]);

  const handleCopy = () => {
    let text = `My Age: ${result?.years} years, ${result?.months} months, ${result?.days} days. Calculate yours at ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">

        {/* Input Panel */}
        <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <div className="surface-card p-6 md:p-8 space-y-10 bg-secondary/5 border-border/40 relative overflow-hidden group shadow-sm">
            <Settings2 className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />

            <div className="space-y-1 relative z-10">
              <h3 className="text-sm font-bold tracking-tight">Your Dates</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Enter Your Information</p>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Date of Birth */}
              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Date of Birth</Label>
                <div className="relative group">
                  <Input
                    type="date"
                    value={birth}
                    onChange={(e) => setBirth(e.target.value)}
                    className="h-12 bg-background border-border/60 focus:border-foreground/20 transition-all font-bold text-lg rounded-xl shadow-sm"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30 pointer-events-none" />
                </div>
              </div>

              {/* Reference Date */}
              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Calculate Age At</Label>
                <div className="relative group">
                  <Input
                    type="date"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="h-12 bg-background border-border/60 focus:border-foreground/20 transition-all font-bold text-lg rounded-xl shadow-sm"
                  />
                  <Target className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30 pointer-events-none" />
                </div>
              </div>

              {/* Live Counter */}
              <div className="p-6 rounded-2xl bg-foreground/5 border border-border/40 space-y-4 relative overflow-hidden group/live">
                <div className="flex items-center justify-between relative z-10">
                  <div className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Live Age Tracker</div>
                  <Heart className="size-3 text-red-500 animate-pulse" />
                </div>
                <div className="text-2xl font-mono font-bold tabular-nums tracking-tighter relative z-10">
                  {result?.liveSeconds.toLocaleString()}
                  <span className="text-[10px] ml-2 opacity-40 uppercase tracking-widest font-sans font-bold">Seconds Lived</span>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover/live:scale-125 transition-transform duration-1000">
                  <Watch className="size-16" />
                </div>
              </div>
            </div>
          </div>

          <div className="surface-card p-6 border-border/30 bg-health/5 text-health relative overflow-hidden group shadow-sm">
            <Sparkles className="absolute -bottom-4 -right-4 size-20 opacity-5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1">
                <Activity className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-health/80">Birthday Insights</h4>
                <p className="text-xs leading-relaxed font-medium">
                  {result?.insight}
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
          {result ? (
            <div className="surface-card p-8 md:p-10 space-y-10 bg-background border-border/60 shadow-md relative overflow-hidden group">
              <User className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      <Calendar className="size-3" />
                      Your Age Today
                    </div>
                    <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl md:text-6xl font-mono font-bold tracking-tighter tabular-nums">{result.years}</span>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-40">Years</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl md:text-4xl font-mono font-bold tracking-tighter tabular-nums">{result.months}</span>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-40">Months</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl md:text-4xl font-mono font-bold tracking-tighter tabular-nums">{result.days}</span>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-40">Days</span>
                      </div>
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
                      <Target className="size-3 text-health" />
                      Next Birthday
                    </div>
                    <div className="text-3xl md:text-4xl font-mono font-bold text-health tabular-nums">
                      {result.daysToBday} <span className="text-[10px] opacity-40 uppercase tracking-widest font-sans font-bold">Days Left</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      <History className="size-3" />
                      Total Days Lived
                    </div>
                    <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                      {formatNumber(result.totalDays)} <span className="text-[10px] opacity-40 uppercase tracking-widest font-sans font-bold">Days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="surface-card p-24 flex flex-col items-center justify-center text-center bg-secondary/5 border-dashed border-2 border-border/40 rounded-2xl">
              <Hourglass className="size-16 text-muted-foreground/20 mb-6 animate-pulse" />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40">Enter a valid birth date to see your results</p>
            </div>
          )}

          {/* Temporal Grid */}
          {result && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { l: "Total Months", v: formatNumber(result.totalMonths), i: History },
                { l: "Total Weeks", v: formatNumber(result.totalWeeks), i: Hourglass },
                { l: "Total Hours", v: formatNumber(result.totalHours), i: Timer },
                { l: "Total Minutes", v: formatNumber(result.totalMinutes), i: RefreshCcw }
              ].map((item, idx) => (
                <div key={idx} className="surface-card p-6 border-border/30 bg-background hover:border-foreground/20 transition-all group shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <item.i className="size-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">{item.l}</span>
                  </div>
                  <div className="text-xl font-mono font-bold tabular-nums leading-tight">
                    {item.v}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Expert Insight Cards */}
          <div className="grid md:grid-cols-2 gap-6 pt-2">
            <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group shadow-sm">
              <Landmark className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-500" />
              <div className="flex items-center gap-3 relative z-10">
                <History className="size-4 text-muted-foreground" />
                <h4 className="text-[10px] font-bold uppercase tracking-wider">What This Means</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                Time is your most valuable asset. Tracking it exactly helps you appreciate every moment and plan your future better.
              </p>
            </div>
            <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group shadow-sm">
              <Zap className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-500" />
              <div className="flex items-center gap-3 relative z-10">
                <Gauge className="size-4 text-muted-foreground" />
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Life Milestones</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                Knowing your exact age at any point is important for legal, health, and professional planning throughout your life.
              </p>
            </div>
          </div>

        </div>
      </div>
    </CalculatorPage>
  );
};

export default AgeCalculator;
