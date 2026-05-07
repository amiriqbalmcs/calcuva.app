"use client";

import { useMemo, useState } from "react";
import { 
  Zap, TrendingUp, BarChart3, Clock, 
  ArrowRight, Info, AlertTriangle, 
  Download, Share2, Copy, CheckCircle2,
  HelpCircle, Lightbulb, UserCheck, Bot, Briefcase
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HowToGuide } from "@/components/HowToGuide";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("ai-agent-efficiency-roi-calculator")!;

const AiEfficiencyRoi = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [laborHourlyRate, setLaborHourlyRate] = useState<number>(45);
  const [hoursSavedPerWeek, setHoursSavedPerWeek] = useState<number>(10);
  const [monthlyApiCost, setMonthlyApiCost] = useState<number>(85);
  const [teamSize, setTeamSize] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    const weeklyLaborSavings = laborHourlyRate * hoursSavedPerWeek * teamSize;
    const monthlyLaborSavings = weeklyLaborSavings * 4.33;
    const netMonthlyProfit = monthlyLaborSavings - monthlyApiCost;
    const roiPercentage = (netMonthlyProfit / monthlyApiCost) * 100;
    const annualSavings = netMonthlyProfit * 12;

    return {
      monthlyLaborSavings,
      netMonthlyProfit,
      roiPercentage,
      annualSavings,
      breakevenTokens: monthlyApiCost / 0.005 // Approx tokens per dollar for 2026 models
    };
  }, [laborHourlyRate, hoursSavedPerWeek, monthlyApiCost, teamSize]);

  const handleCopy = () => {
    const text = `AI ROI Report: My AI agents save $${Math.round(results.netMonthlyProfit).toLocaleString()} monthly with a ${Math.round(results.roiPercentage)}% ROI. Calculate yours at ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!calc) return null;

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto">
        
        {/* Sidebar Panel (Summary/Results) */}
        <div className="lg:col-span-4 space-y-6 order-1 lg:order-2">
          <div className="surface-card p-10 bg-background border-border/60 shadow-xl space-y-10 relative overflow-hidden rounded-2xl">
             <div className="absolute top-0 right-0 size-32 bg-health/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

             <div className="space-y-6 relative border-b border-border/40 pb-10">
                 <div className="flex items-center justify-between">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Net Monthly ROI</div>
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
                <div className="text-6xl font-mono font-bold tracking-tighter text-foreground">
                   ${Math.round(results.netMonthlyProfit).toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-health/10 text-health text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp className="size-3" /> {Math.round(results.roiPercentage)}% Return
                  </div>
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex justify-between items-end text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                   <span>Monthly Cost</span>
                   <span className="text-destructive">-${monthlyApiCost}</span>
                </div>
                <div className="flex justify-between items-end text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                   <span>Annual Profit</span>
                   <span className="text-health font-mono font-black">${Math.round(results.annualSavings).toLocaleString()}</span>
                </div>
             </div>

             <div className="p-6 bg-secondary/30 rounded-2xl border border-border/40 space-y-4">
                <div className="flex items-center gap-2 text-foreground/60">
                   <BarChart3 className="size-4" />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">Team Scalability</span>
                </div>
                <p className="text-[9px] text-muted-foreground leading-relaxed">
                   Your AI efficiency is currently producing a <strong>{results.roiPercentage > 500 ? 'High' : 'Moderate'}</strong> impact. For a team of {teamSize}, AI acts as a digital force multiplier.
                </p>
             </div>

             <p className="text-[9px] text-muted-foreground leading-relaxed text-center font-medium opacity-60">
               *Calculation compares human labor replacement value against direct API/Subscription costs.
             </p>
          </div>

          <div className="surface-card p-6 bg-primary/5 border-primary/20 flex gap-4 items-start rounded-2xl">
            <Lightbulb className="size-5 text-primary shrink-0 mt-1" />
            <div className="space-y-1">
              <p className="text-[11px] font-black uppercase text-primary tracking-widest">Business Tip</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                High-end models like <strong>Claude 4.7 Opus</strong> offer 30% higher reasoning efficiency for complex coding tasks.
              </p>
            </div>
          </div>
        </div>

        {/* Main Panel (Inputs) */}
        <div className="lg:col-span-8 space-y-6 order-2 lg:order-1">
          <div className="surface-card bg-secondary/5 border-border/40 overflow-hidden shadow-sm rounded-2xl">
            <div className="p-8 border-b border-border/40 bg-background flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-secondary flex items-center justify-center">
                   <Bot className="size-6 text-foreground" />
                </div>
                <div className="space-y-0.5">
                   <h3 className="text-lg font-bold tracking-tight text-foreground uppercase">Efficiency Parameters</h3>
                   <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Productivity ROI Benchmarking 2026</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 space-y-10">
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Human Labor Rate ($/hr)</Label>
                  <div className="relative group">
                    <Input
                      type="number"
                      value={laborHourlyRate || ""}
                      onChange={(e) => setLaborHourlyRate(Number(e.target.value) || 0)}
                      className="h-20 bg-background border-border/60 font-mono text-4xl font-bold rounded-2xl pl-12 focus:ring-4 ring-primary/5 transition-all"
                      placeholder="45"
                    />
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 text-muted-foreground/20 font-mono text-xl font-bold">$</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Hours Saved / Week (per member)</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={hoursSavedPerWeek || ""}
                      onChange={(e) => setHoursSavedPerWeek(Number(e.target.value) || 0)}
                      className="h-20 bg-background border-border/60 font-mono text-3xl font-bold rounded-2xl pl-12 focus:ring-4 ring-primary/5 transition-all"
                      placeholder="10"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground/30 font-mono text-sm font-bold">hrs</div>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-8 pt-4 border-t border-border/40">
                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    Monthly AI Tool/API Cost
                    <HelpCircle className="size-3 text-muted-foreground cursor-help" />
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={monthlyApiCost || ""}
                      onChange={(e) => setMonthlyApiCost(Number(e.target.value) || 0)}
                      className="h-14 bg-background border-border/60 font-mono text-xl font-bold rounded-2xl pl-12"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 font-mono text-xs font-bold uppercase">$</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Team Size Affected</Label>
                  <div className="flex items-center gap-4 pt-2">
                    <input 
                      type="range" 
                      min="1" 
                      max="50" 
                      value={teamSize} 
                      onChange={(e) => setTeamSize(Number(e.target.value))}
                      className="flex-1 accent-foreground"
                    />
                    <span className="text-xs font-mono font-bold w-10">{teamSize}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-foreground/5 border-t border-border/40 grid sm:grid-cols-2 gap-8">
               <div className="p-6 bg-background border border-border/40 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="size-3.5" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary">Monthly Time Reclaimed</span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-foreground">{Math.round(hoursSavedPerWeek * 4.33 * teamSize)} Hours</div>
                  <p className="text-[9px] text-muted-foreground font-bold">Total team-wide productivity gain</p>
               </div>
               <div className="p-6 bg-background border border-border/40 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Zap className="size-3.5" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-health">Labor Value Saved</span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-health">${Math.round(results.monthlyLaborSavings).toLocaleString()}</div>
                  <p className="text-[9px] text-muted-foreground font-bold">Reclaimed payroll value per month</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {calc.howTo && (
        <div id="how-to-use" className="mt-12 pt-12 border-t border-border/40">
          <HowToGuide 
            steps={calc.howTo!.steps} 
            proTip={calc.howTo!.proTip} 
            variant="horizontal"
          />
        </div>
      )}
    </CalculatorPage>
  );
};

export default AiEfficiencyRoi;
