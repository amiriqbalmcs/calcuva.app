"use client";

import { useMemo, useState } from "react";
import {
  Activity, TrendingUp, Info, BookOpen, Target, 
  ChevronRight, Calculator, Scale, RefreshCcw, 
  Sparkles, Globe, Copy, Award, AlertCircle, HeartPulse, Droplet, CheckCircle2
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("blood-sugar-hba1c-converter");

const BloodSugarConverter = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;

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

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        <div className="lg:col-span-7 space-y-6">
          <div className="surface-card bg-secondary/5 border-border/40 overflow-hidden group shadow-sm">
            <div className="p-6 md:p-8 border-b border-border/40 flex items-center justify-between bg-background relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-foreground" />
              <div className="flex items-center gap-3 relative z-10">
                <HeartPulse className="size-5 text-muted-foreground/60" />
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold tracking-tight">Glucose Input</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Enter your 3-month average blood sugar</p>
                </div>
              </div>
              <div className="flex bg-secondary/10 p-1 rounded-xl border border-border/40">
                 <button 
                    onClick={() => setUnit("mgdl")}
                    className={cn("px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all", 
                       unit === "mgdl" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground opacity-50")}>mg/dL</button>
                 <button 
                    onClick={() => setUnit("mmol")}
                    className={cn("px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all", 
                       unit === "mmol" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground opacity-50")}>mmol/L</button>
              </div>
            </div>

            <div className="p-10 space-y-8">
               <div className="relative group">
                  <Input
                     type="number"
                     value={glucose}
                     onChange={(e) => setGlucose(Number(e.target.value) || 0)}
                     className="h-24 bg-background border-border/60 font-mono text-5xl font-bold rounded-3xl shadow-sm text-center tabular-nums focus:ring-foreground transition-all"
                  />
                  <div className="absolute top-4 right-8 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">
                     Average Level
                  </div>
               </div>
            </div>
          </div>

          <div className="surface-card p-6 border-border/30 bg-foreground/5 relative overflow-hidden group">
            <Sparkles className="absolute -bottom-4 -right-4 size-24 text-foreground/5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1 text-foreground/60">
                <Info className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Clinical Definition</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  HbA1c measures the percentage of your hemoglobin that is coated with sugar. It reflects your average blood sugar levels over the past 2-3 months.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="surface-card p-8 bg-background border-border/60 shadow-md relative overflow-hidden group">
             <div className="space-y-10 relative z-10">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                          <Droplet className="size-3" /> Estimated HbA1c
                       </div>
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
                   <div className={cn("text-8xl font-mono font-bold tracking-tighter tabular-nums transition-colors", result.color)}>
                      {result.hba1c.toFixed(1)}<span className="text-3xl ml-1 opacity-20">%</span>
                   </div>
                </div>

                <div className="space-y-6 pt-8 border-t border-border/40">
                   <div className="flex justify-between items-center">
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Classification</div>
                      <div className={cn("text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border", 
                         result.hba1c >= 6.5 ? "bg-destructive/5 border-destructive/20" : "bg-health/5 border-health/20"
                      )}>{result.risk}</div>
                   </div>

                   <div className="p-6 rounded-2xl bg-foreground/5 border border-border/30 space-y-4">
                      <div className="space-y-2">
                         <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                            <span>Diagnostic Range</span>
                            <span>{result.hba1c.toFixed(1)}%</span>
                         </div>
                         <div className="h-2 w-full bg-secondary/30 rounded-full overflow-hidden flex">
                            <div className="h-full bg-health w-[57%]" />
                            <div className="h-full bg-amber-500 w-[8%]" />
                            <div className="h-full bg-destructive w-[35%]" />
                         </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
                         {result.hba1c >= 6.5 
                           ? "This result is in the diabetic range. Please consult a healthcare professional for a formal lab test and diagnosis."
                           : "Your result is in the healthy range. Maintain a balanced diet and regular exercise to sustain metabolic health."}
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
};

export default BloodSugarConverter;
