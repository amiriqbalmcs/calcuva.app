"use client";

import { useState, useMemo } from "react";
import {
  Baby, Calendar, Heart, Info, Clock, Thermometer,
  Footprints, Sparkles, Share, CheckCircle2, TrendingUp,
  History, Activity, Zap, Ruler, Settings2, Copy,
  LayoutDashboard, ChevronRight, Waves, Flame, Siren,
  Gauge, Target, User
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { calculatorBySlug } from "@/lib/calculators";
import { SITE_DOMAIN } from "@/lib/constants";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("pregnancy-week-calculator")!;

const PregnancyWeekCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [lmp, setLmp] = useState<string>(new Date().toISOString().split('T')[0]);
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    const lastPeriod = new Date(lmp);
    const today = new Date();
    if (isNaN(lastPeriod.getTime())) return null;

    const diffTime = today.getTime() - lastPeriod.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0 || diffDays > 300) return null;

    const currentWeek = Math.floor(diffDays / 7);
    const currentDays = diffDays % 7;
    const dueDate = new Date(lastPeriod.getTime() + (280 * 1000 * 60 * 60 * 24));

    let trimester = 1;
    if (currentWeek >= 13 && currentWeek < 27) trimester = 2;
    if (currentWeek >= 27) trimester = 3;

    const milestones = [
      { week: 4, label: "Implantation Complete" },
      { week: 8, label: "Major Organs Developing" },
      { week: 12, label: "Heartbeat Audible via Doppler" },
      { week: 16, label: "Manual Grasp Reflex Begins" },
      { week: 20, label: "Midpoint Anatomy Scan" },
      { week: 24, label: "Viability Threshold" },
      { week: 28, label: "Visual Sensory Activation" },
      { week: 32, label: "Rapid Mass Accumulation" },
      { week: 37, label: "Early Term Maturity" },
      { week: 40, label: "Estimated Delivery" },
    ];

    const upcomingMilestone = milestones.find(m => m.week > currentWeek);
    return { currentWeek, currentDays, trimester, dueDate, daysToDueDate: 280 - diffDays, percentComplete: (diffDays / 280) * 100, upcomingMilestone, diffDays };
  }, [lmp]);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const handleCopy = () => {
    if (!results) return;
    let text = `Current Gestational Age: ${results.currentWeek}w ${results.currentDays}d. Estimated Due Date: ${formatDate(results.dueDate)}. Track at ${window.location.href}`;
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
              <h3 className="text-sm font-bold tracking-tight">Your Pregnancy</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Dates</p>
            </div>

            <div className="space-y-8 relative z-10">
              {/* LMP Date */}
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Last Period (LMP)</Label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                  <Input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} className="h-11 pl-12 bg-background border-border/60 font-bold rounded-lg shadow-sm" />
                </div>
                <p className="text-[10px] text-muted-foreground font-medium px-1">Used for estimated delivery window assessment.</p>
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
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Medical Note</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  This provides a standard estimate. Every pregnancy is different, so your actual due date may vary.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8">
          {results ? (
            <>
              {/* Executive Summary */}
              <div className="surface-card p-8 md:p-10 space-y-10 bg-background border-border/60 shadow-md relative overflow-hidden group">
                <Waves className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        <Baby className="size-3" />
                        Current Gestational Age
                      </div>
                      <div className="text-5xl md:text-6xl font-mono font-bold tracking-tighter tabular-nums text-health">
                        {results.currentWeek}<span className="text-xl md:text-2xl ml-1 font-sans font-normal opacity-40 uppercase">w</span> {results.currentDays}<span className="text-xl md:text-2xl ml-1 font-sans font-normal opacity-40 uppercase">d</span>
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
                        Days Remaining
                      </div>
                      <div className="text-3xl md:text-4xl font-mono font-bold text-health tabular-nums">
                        {results.daysToDueDate} <span className="text-[10px] opacity-40 uppercase tracking-widest font-sans font-bold">Days</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        <Calendar className="size-3" />
                        Estimated Delivery
                      </div>
                      <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                        {formatDate(results.dueDate)}
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
                    <span>Start</span><span>T1</span><span>T2</span><span>T3</span><span>Due</span>
                  </div>
                  <div className="h-4 w-full bg-secondary/20 rounded-full overflow-hidden border border-border/10 relative shadow-inner">
                    <div
                      className="h-full bg-health/80 group-hover:bg-health transition-all duration-1000 shadow-[0_0_15px_rgba(var(--health),0.2)]"
                      style={{ width: `${results.percentComplete}%` }}
                    />
                  </div>
                  <div className="mt-4 flex justify-between items-center px-1">
                    <span className="text-[10px] font-bold text-foreground">{results.percentComplete.toFixed(1)}% Journey Complete</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono tracking-widest">40 Weeks Total</span>
                  </div>
                </div>
              </div>

              {/* Milestone Card */}
              <div className="surface-card p-8 border-border/30 bg-background hover:border-health/20 transition-all group overflow-hidden relative">
                <Sparkles className="absolute -top-4 -right-4 size-24 text-health/5 group-hover:rotate-12 transition-transform duration-700" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="size-16 rounded-2xl bg-health/10 flex items-center justify-center text-health shadow-inner group-hover:scale-110 transition-transform duration-500">
                      <Target className="size-8" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Next Big Milestone</p>
                      <p className="text-xl font-bold text-foreground">{results.upcomingMilestone?.label || "Baby arrives!"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 opacity-60">Week</p>
                    <p className="text-3xl font-mono font-bold text-health">{results.upcomingMilestone?.week || 40}</p>
                  </div>
                </div>
              </div>

              {/* Vital Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { l: "Trimester", v: results.trimester, i: Activity, unit: "PHASE" },
                  { l: "Days Pregnant", v: results.diffDays, i: History, unit: "Days" },
                  { l: "Completion", v: results.percentComplete.toFixed(1), i: Zap, unit: "%" },
                  { l: "Status", v: results.currentWeek >= 37 ? "Term" : "Growth", i: Baby }
                ].map((item, idx) => (
                  <div key={idx} className="surface-card p-5 border-border/30 bg-background hover:border-foreground/20 transition-colors group">
                    <div className="flex items-center gap-2 mb-3">
                      <item.i className="size-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{item.l}</span>
                    </div>
                    <div className="text-lg font-mono font-medium tabular-nums leading-tight">
                      {item.v}
                      {item.unit && <span className="text-[10px] ml-1 opacity-40 uppercase">{item.unit}</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recovery Roadmap / Expert Tips */}
              <div className="grid md:grid-cols-2 gap-6 pt-2">
                <div className="surface-card p-8 border-border/30 bg-secondary/5 relative overflow-hidden group">
                  <Heart className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                    <History className="size-3 text-health" /> Due Date Note
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    Your due date is just an estimate! Only about 5% of babies are actually born exactly on their due date.
                  </p>
                </div>
                <div className="surface-card p-8 border-border/30 bg-secondary/5 relative overflow-hidden group">
                  <Activity className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Gauge className="size-3 text-health" /> Baby's Growth
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    Every baby grows at their own pace. Your doctor will track your baby's specific growth during your checkups.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="surface-card p-32 flex flex-col items-center justify-center text-center bg-secondary/5 border-dashed border-border/60">
              <Activity className="size-12 text-muted-foreground/20 mb-6 animate-pulse" />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40 max-w-xs leading-loose">
                Synchronizing biological parameters... Please enter LMP.
              </p>
            </div>
          )}
        </div>
      </div>
    </CalculatorPage>
  );
};

export default PregnancyWeekCalculator;
