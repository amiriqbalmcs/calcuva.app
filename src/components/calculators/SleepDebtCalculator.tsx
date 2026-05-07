"use client";

import { useMemo, useState } from "react";
import {
  Moon, Sun, TrendingUp, Info, BookOpen, Target,
  ChevronRight, Calculator, Scale, RefreshCcw, Activity,
  Sparkles, Globe, Copy, Award, AlertCircle, Clock, Timer, CheckCircle2
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { HowToGuide } from "@/components/HowToGuide";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("sleep-debt-calculator")!;

const SleepDebtCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [targetHours, setTargetHours] = useState<number>(8);
  const [dailySleep, setDailySleep] = useState<number[]>([7, 6, 8, 5, 7, 9, 8]); // 7 days
  const [copied, setCopied] = useState(false);

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

  const handleCopy = () => {
    const text = `Sleep Debt Analysis: ${result.debt.toFixed(1)} hrs cumulative debt | Average ${result.average.toFixed(1)}h/night | Status: ${result.status}. Analyze your sleep at ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateSleep = (idx: number, val: number) => {
    const newSleep = [...dailySleep];
    newSleep[idx] = Math.min(24, Math.max(0, val));
    setDailySleep(newSleep);
  };

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  if (!calc) return null;

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="w-full max-w-6xl mx-auto space-y-12 px-4 sm:px-6">

        {/* Main Interface */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* Results Dashboard (Right on Desktop, Top on Mobile) */}
          <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
            <div className="surface-card p-8 bg-background border-border/60 shadow-sm space-y-8 sticky top-32">
              <div className="space-y-6 border-b border-border/40 pb-8">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Sleep Debt Summary</div>
                  <button
                    onClick={handleCopy}
                    className={cn(
                      "p-2 rounded-lg transition-all border shadow-sm",
                      copied ? "bg-foreground text-background border-foreground" : "bg-background text-foreground border-border hover:bg-secondary"
                    )}
                  >
                    {copied ? <CheckCircle2 className="size-3.5" /> : <Copy className="size-3.5" />}
                  </button>
                </div>
                <div className={cn("text-6xl font-mono font-bold tracking-tighter transition-colors",
                  result.debt > 0 ? "text-destructive" : "text-health"
                )}>
                  {result.debt.toFixed(1)}<span className="text-xl ml-1 opacity-40 italic">hrs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2",
                    result.debt > 5 ? "bg-destructive/5 text-destructive" : "bg-health/5 text-health"
                  )}>
                    <Activity className="size-3" /> {result.status}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-secondary/10 border border-border/40 space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Average Sleep</span>
                    <div className="text-lg font-mono font-bold">{result.average.toFixed(1)}h</div>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/10 border border-border/40 space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Total Actual</span>
                    <div className="text-lg font-mono font-bold">{result.totalActual}h</div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-foreground/5 border border-border/30 flex gap-4">
                  <Info className="size-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest">Recovery Advice</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                      {result.debt > 0
                        ? `Try to add ${Math.min(2, result.debt / 3).toFixed(1)} hours of extra sleep to your next few nights.`
                        : "You are fully rested! Consistency is key for long-term health."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inputs Panel (Left on Desktop, Bottom on Mobile) */}
          <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
            <div className="surface-card bg-background border-border/40 overflow-hidden shadow-sm">
              <div className="p-6 md:p-8 border-b border-border/40 bg-secondary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <Clock className="size-5 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold tracking-tight uppercase">Weekly Sleep Log</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Log actual hours per night</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 min-w-[180px]">
                  <div className="flex justify-between items-center px-1">
                    <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Goal</Label>
                    <span className="text-xs font-mono font-bold text-foreground">{targetHours}h</span>
                  </div>
                  <Slider
                    value={[targetHours]}
                    onValueChange={(vals) => setTargetHours(vals[0])}
                    max={12}
                    min={4}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                  {days.map((day, i) => (
                    <div key={day} className="space-y-3">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">{day}</div>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.5"
                          value={dailySleep[i] || ""}
                          onChange={(e) => updateSleep(i, Number(e.target.value) || 0)}
                          className="h-12 bg-background border-border/60 font-mono text-lg font-bold rounded-xl shadow-sm text-center focus:ring-2 ring-foreground/5 transition-all"
                        />
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                          <div className={cn("size-1 rounded-full", dailySleep[i] >= targetHours ? "bg-health" : "bg-destructive/30")} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="surface-card p-6 bg-secondary/5 border-border/30 relative overflow-hidden group">
              <div className="flex gap-4 items-start relative z-10">
                <Sparkles className="size-5 text-muted-foreground/60 shrink-0 mt-1" />
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider">Circadian Insights</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                    Consistency is as important as quantity. Try to wake up at the same time every day, even on weekends, to regulate your internal clock.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How-To Section */}
        {calc.howTo && (
          <div id="how-to-use" className="mt-12 pt-12 border-t border-border/40">
            <HowToGuide
              id="how-to-use"
              steps={calc.howTo!.steps}
              proTip={calc.howTo!.proTip}
              variant="horizontal"
            />
          </div>
        )}
      </div>
    </CalculatorPage>
  );
};

export default SleepDebtCalculator;
