"use client";

import { useMemo, useState } from "react";
import {
  Activity, TrendingUp, Info, BookOpen, Target, 
  ChevronRight, Calculator, Scale, RefreshCcw, 
  Sparkles, Globe, Copy, Award, AlertCircle, HeartPulse, Droplet, CheckCircle2
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { HowToGuide } from "@/components/HowToGuide";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("blood-sugar-hba1c-converter")!;

const BloodSugarConverter = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [glucose, setGlucose] = useState<number>(126);
  const [unit, setUnit] = useState<"mgdl" | "mmol">("mgdl");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    // Standard Formula: HbA1c = (Average Glucose + 46.7) / 28.7
    // mmol/L to mg/dL conversion: mmol * 18.0182
    const mgdl = unit === "mmol" ? glucose * 18.0182 : glucose;
    const hba1c = (mgdl + 46.7) / 28.7;
    
    let risk = "Normal";
    let color = "text-health";
    if (hba1c >= 6.5) { risk = "Diabetic Range"; color = "text-destructive"; }
    else if (hba1c >= 5.7) { risk = "Pre-diabetic"; color = "text-amber-500"; }

    return { hba1c, risk, color, mgdl };
  }, [glucose, unit]);

  const handleCopy = () => {
    const text = `Blood Sugar Analysis: ${glucose} ${unit === 'mgdl' ? 'mg/dL' : 'mmol/L'} Average | Estimated HbA1c: ${result.hba1c.toFixed(1)}% | Status: ${result.risk}. Convert at ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!calc) return null;

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="w-full max-w-7xl mx-auto space-y-12 sm:px-6 lg:px-8">
        
        {/* Main Interface: Side-by-Side Results & Inputs */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Right Column: Results Dashboard */}
          <div className="lg:col-span-4 space-y-6 order-1 lg:order-2">
            <div className="surface-card p-10 bg-background border-border/60 shadow-xl space-y-10 sticky top-32 overflow-hidden rounded-2xl">
               <div className="absolute top-0 right-0 size-32 bg-red-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

               <div className="space-y-6 relative border-b border-border/40 pb-10">
                   <div className="flex items-center justify-between">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Estimated HbA1c</div>
                      <button 
                         onClick={handleCopy}
                         className={cn(
                            "p-2 rounded-lg transition-all border shadow-sm",
                            copied ? "bg-red-600 text-white border-red-700" : "bg-background text-foreground border-border hover:bg-secondary"
                         )}
                      >
                         {copied ? <CheckCircle2 className="size-3.5" /> : <Copy className="size-3.5" />}
                      </button>
                   </div>
                  <div className={cn("text-8xl font-mono font-bold tracking-tighter transition-colors", result.color)}>
                     {result.hba1c.toFixed(1)}<span className="text-3xl ml-1 opacity-20">%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                       result.hba1c >= 5.7 ? "bg-red-500/10 text-red-600 dark:text-red-400" : "bg-health/10 text-health"
                    )}>
                      <Activity className="size-3" /> {result.risk}
                    </div>
                  </div>
               </div>

                <div className="space-y-8 relative">
                  <div className="p-6 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-500/20 space-y-4">
                     <div className="flex items-center gap-2 text-red-700/60 dark:text-red-400/60">
                        <TrendingUp className="size-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Clinical Indicators</span>
                     </div>
                     <div className="space-y-4">
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[9px] font-bold uppercase text-red-800 dark:text-red-400">
                              <span>Health Risk Level</span>
                              <span>{result.hba1c.toFixed(1)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-red-100 dark:bg-red-950 rounded-full overflow-hidden flex">
                              <div className="h-full bg-health w-[57%]" />
                              <div className="h-full bg-amber-500 w-[8%]" />
                              <div className="h-full bg-red-600 w-[35%]" />
                          </div>
                        </div>
                     </div>
                  </div>

                  <div className="p-6 bg-slate-900 text-white rounded-2xl flex gap-4 shadow-xl">
                     <HeartPulse className="size-5 text-red-400 shrink-0" />
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest">Medical Insight</p>
                        <p className="text-[9px] text-slate-300 leading-relaxed font-medium">
                          {result.hba1c >= 6.5 
                            ? "This result is in the diabetic range. Consult a physician for a formal lab test."
                            : "Your result is in the healthy range. Maintain balanced nutrition to sustain metabolic health."}
                        </p>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Left Column: Inputs Panel */}
          <div className="lg:col-span-8 space-y-6 order-2 lg:order-1">
            <div className="surface-card bg-red-500/5 dark:bg-red-500/10 border-red-500/20 overflow-hidden shadow-sm rounded-2xl">
              <div className="p-8 border-b border-red-500/10 dark:border-red-500/20 bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center">
                    <Droplet className="size-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-lg font-bold tracking-tight text-foreground uppercase">Glucose Input</h3>
                    <p className="text-[10px] text-red-600/60 dark:text-red-400/60 uppercase tracking-widest font-bold">Enter your 3-month average blood sugar</p>
                  </div>
                </div>

                <div className="flex bg-secondary/10 p-1.5 rounded-2xl border border-border/40">
                   <button 
                      onClick={() => setUnit("mgdl")}
                      className={cn("px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all", 
                         unit === "mgdl" ? "bg-background shadow-lg text-foreground" : "text-muted-foreground opacity-50")}>mg/dL</button>
                   <button 
                      onClick={() => setUnit("mmol")}
                      className={cn("px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all", 
                         unit === "mmol" ? "bg-background shadow-lg text-foreground" : "text-muted-foreground opacity-50")}>mmol/L</button>
                </div>
              </div>
              
              <div className="p-12 space-y-10">
                 <div className="relative group max-w-md mx-auto">
                    <Input
                       type="number"
                       value={glucose || ""}
                       onChange={(e) => setGlucose(Number(e.target.value) || 0)}
                       className="h-32 bg-background border-border/60 font-mono text-6xl font-bold rounded-2xl shadow-sm text-center tabular-nums focus:ring-4 ring-red-500/5 transition-all"
                    />
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-black text-red-600/40 uppercase tracking-[0.3em]">
                       Average Level
                    </div>
                 </div>
              </div>

              <div className="p-8 bg-red-500/5 dark:bg-red-500/10 border-t border-red-500/10 dark:border-red-500/20 grid sm:grid-cols-2 gap-6">
                 <div className="flex gap-4 items-center">
                    <div className="size-10 rounded-xl bg-background dark:bg-secondary border border-red-100 dark:border-red-500/20 flex items-center justify-center">
                      <Scale className="size-5 text-red-500 dark:text-red-400" />
                    </div>
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-red-600/70 dark:text-red-400/70">Equivalent mg/dL</div>
                      <div className="text-xl font-mono font-bold text-red-800 dark:text-red-300">{Math.round(result.mgdl)}</div>
                    </div>
                 </div>
                 <div className="flex gap-4 items-center">
                    <div className="size-10 rounded-xl bg-background dark:bg-secondary border border-red-100 dark:border-red-500/20 flex items-center justify-center">
                      <Target className="size-5 text-red-500 dark:text-red-400" />
                    </div>
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-red-600/70 dark:text-red-400/70">Health Score</div>
                      <div className="text-xl font-mono font-bold text-red-800 dark:text-red-300">{result.hba1c < 5.7 ? "Excellent" : result.hba1c < 6.5 ? "Fair" : "At Risk"}</div>
                    </div>
                 </div>
              </div>
            </div>

            <div className="surface-card p-8 bg-background border-border/60 shadow-sm space-y-6 rounded-2xl">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Sparkles className="size-4 text-red-600" /> Scientific Insights
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-500/20 space-y-2">
                  <p className="text-[11px] font-black text-red-900 dark:text-red-400 uppercase">HbA1c Logic</p>
                  <p className="text-[10px] text-red-800/60 dark:text-red-400/60 leading-relaxed font-medium">HbA1c measures the percentage of hemoglobin coated with sugar, reflecting your average levels over 90 days.</p>
                </div>
                <div className="p-5 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-500/20 space-y-2">
                  <p className="text-[11px] font-black text-red-900 dark:text-red-400 uppercase">Metabolic Health</p>
                  <p className="text-[10px] text-red-800/60 dark:text-red-400/60 leading-relaxed font-medium">Consistent average glucose is a key indicator of long-term cardiovascular and metabolic wellness.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How-To Section */}
        {calc.howTo && (
          <div id="how-to-use" className="mt-12 pt-12 border-t border-border/40">
            <HowToGuide 
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

export default BloodSugarConverter;
