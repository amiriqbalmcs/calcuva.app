"use client";

import { useMemo, useState } from "react";
import {
  Share, CheckCircle2, Percent, Info, TrendingUp, TrendingDown,
  Landmark, BarChart3, PieChart, Activity, Zap, History, Target,
  Settings2, ChevronRight, Calculator, Scale, RefreshCcw, Watch,
  Copy, Ruler, Gauge, LayoutDashboard, Binary, Sparkles, Sigma
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculatorBySlug } from "@/lib/calculators";
import { formatNumber } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { SITE_DOMAIN } from "@/lib/constants";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("percentage-increase-calculator");

const PercentageCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;
  const [mode, setMode] = useUrlState<"of" | "diff" | "change">("m", "of");
  const [ofP, setOfP] = useUrlState<number>("p1", 20);
  const [ofV, setOfV] = useUrlState<number>("v1", 500);
  const [dx, setDx] = useUrlState<number>("p2", 50);
  const [dy, setDy] = useUrlState<number>("v2", 200);
  const [c1, setC1] = useUrlState<number>("v3", 100);
  const [c2, setC2] = useUrlState<number>("v4", 150);
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    if (mode === "of") return { val: (ofP / 100) * ofV, label: `Result of ${ofP}% from ${ofV}` };
    if (mode === "diff") return { val: (dx / (dy || 1)) * 100, label: `Percentage of ${dx} out of ${dy}` };
    if (mode === "change") return { val: ((c2 - c1) / Math.abs(c1 || 1)) * 100, label: `Percentage change from ${c1} to ${c2}` };
    return { val: 0, label: "" };
  }, [mode, ofP, ofV, dx, dy, c1, c2]);

  const handleCopy = () => {
    let text = `Result: ${results.val.toFixed(2)}${mode === 'of' ? '' : '%'}. Use this free calculator at ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">

        {/* Calculator Settings */}
        <div className="lg:col-span-4 space-y-6">
          <div className="surface-card p-6 md:p-8 space-y-10 bg-secondary/5 border-border/40 relative overflow-hidden group shadow-sm">
            <Settings2 className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />

            <div className="space-y-4 relative z-10">
              <div className="space-y-1">
                <h3 className="text-sm font-bold tracking-tight">Choose Type</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Select What to Calculate</p>
              </div>
              <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full">
                <TabsList className="grid grid-cols-3 h-11 bg-background/50 border border-border/40 p-1 rounded-xl">
                  <TabsTrigger value="of" className="rounded-lg text-[9px] font-bold uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm">Find Value</TabsTrigger>
                  <TabsTrigger value="diff" className="rounded-lg text-[9px] font-bold uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm">Find %</TabsTrigger>
                  <TabsTrigger value="change" className="rounded-lg text-[9px] font-bold uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm">Find Growth</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-8 relative z-10">
              {mode === "of" && (
                <>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Percentage (%)</Label>
                      <span className="text-[10px] font-bold">{ofP}%</span>
                    </div>
                    <Input type="number" value={ofP} onChange={(e) => setOfP(Number(e.target.value) || 0)} className="h-12 bg-background border-border/60 font-bold text-lg rounded-xl shadow-sm" />
                    <Slider value={[ofP]} min={0} max={200} step={0.1} onValueChange={([v]) => setOfP(v)} />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Amount</Label>
                      <span className="text-[10px] font-bold">{ofV}</span>
                    </div>
                    <Input type="number" value={ofV} onChange={(e) => setOfV(Number(e.target.value) || 0)} className="h-12 bg-background border-border/60 font-bold text-lg rounded-xl shadow-sm" />
                    <Slider value={[ofV]} min={0} max={10000} step={1} onValueChange={([v]) => setOfV(v)} />
                  </div>
                </>
              )}
              {mode === "diff" && (
                <>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Part Value</Label>
                      <span className="text-[10px] font-bold">{dx}</span>
                    </div>
                    <Input type="number" value={dx} onChange={(e) => setOfP(Number(e.target.value) || 0)} className="h-12 bg-background border-border/60 font-bold text-lg rounded-xl shadow-sm" />
                    <Slider value={[dx]} min={0} max={10000} step={1} onValueChange={([v]) => setDx(v)} />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Value</Label>
                      <span className="text-[10px] font-bold">{dy}</span>
                    </div>
                    <Input type="number" value={dy} onChange={(e) => setOfV(Number(e.target.value) || 0)} className="h-12 bg-background border-border/60 font-bold text-lg rounded-xl shadow-sm" />
                    <Slider value={[dy]} min={0} max={10000} step={1} onValueChange={([v]) => setDy(v)} />
                  </div>
                </>
              )}
              {mode === "change" && (
                <>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Starting Value</Label>
                      <span className="text-[10px] font-bold">{c1}</span>
                    </div>
                    <Input type="number" value={c1} onChange={(e) => setC1(Number(e.target.value) || 0)} className="h-12 bg-background border-border/60 font-bold text-lg rounded-xl shadow-sm" />
                    <Slider value={[c1]} min={0} max={10000} step={1} onValueChange={([v]) => setC1(v)} />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Ending Value</Label>
                      <span className="text-[10px] font-bold">{c2}</span>
                    </div>
                    <Input type="number" value={c2} onChange={(e) => setC2(Number(e.target.value) || 0)} className="h-12 bg-background border-border/60 font-bold text-lg rounded-xl shadow-sm" />
                    <Slider value={[c2]} min={0} max={10000} step={1} onValueChange={([v]) => setC2(v)} />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="surface-card p-6 border-border/30 bg-finance/5 text-finance relative overflow-hidden group shadow-sm">
            <Sparkles className="absolute -bottom-4 -right-4 size-20 opacity-5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1">
                {mode === 'change' && results.val < 0 ? <TrendingDown className="size-5" /> : <TrendingUp className="size-5" />}
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-finance/80">Calculation Result</h4>
                <p className="text-xs leading-relaxed font-medium">
                  {mode === "change"
                    ? (results.val >= 0 ? `The value has increased by ${results.val.toFixed(2)}% compared to the start.` : `The value has decreased by ${Math.abs(results.val).toFixed(2)}% from the start.`)
                    : "This shows the percentage relationship between the two numbers you entered."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8">

          {/* Executive Summary */}
          <div className="surface-card p-8 md:p-12 space-y-10 bg-background border-border/60 shadow-md relative overflow-hidden group transition-all duration-1000">
            <Percent className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Sigma className="size-3" />
                    {results.label}
                  </div>
                  <div className="text-6xl md:text-7xl font-mono font-bold tracking-tighter tabular-nums">
                    {mode === "of" ? formatNumber(results.val, 2) : `${formatNumber(results.val, 2)}%`}
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
                    <Zap className="size-3 text-health" />
                    Mathematical Multiplier
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-health tabular-nums">
                    {(mode === 'of' ? results.val / ofV : 1 + results.val / 100).toFixed(4)}<span className="text-[10px] opacity-40 uppercase tracking-widest font-sans font-bold">x</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <History className="size-3" />
                    Decimal Value
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                    {(results.val / 100).toFixed(4)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Precision Analytics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { l: "As a Decimal", v: (results.val / 100).toFixed(4), i: BarChart3 },
              { l: "Growth Rate", v: (1 + results.val / 100).toFixed(4), i: Target, unit: "x" },
              { l: "Status", v: "Verified", i: History },
              { l: "Engine", v: "Active", i: Zap }
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

          {/* Expert Strategy Cards */}
          <div className="grid md:grid-cols-2 gap-6 pt-2">
            <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group shadow-sm">
              <Landmark className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-500" />
              <div className="flex items-center gap-3 relative z-10">
                <Activity className="size-4 text-muted-foreground" />
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Money & Finance</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                Percentages help you track how much your savings, investments, or prices grow over time, making them essential for managing your money.
              </p>
            </div>
            <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group shadow-sm">
              <PieChart className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-500" />
              <div className="flex items-center gap-3 relative z-10">
                <Gauge className="size-4 text-muted-foreground" />
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Comparing Numbers</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                Using percentages makes it easy to compare different numbers and see which one is performing better or changing faster.
              </p>
            </div>
          </div>

        </div>
      </div>
    </CalculatorPage>
  );
};

export default PercentageCalculator;
