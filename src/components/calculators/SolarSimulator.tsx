"use client";

import { useMemo, useState } from "react";
import { 
  Sun, Zap, TrendingUp, Landmark, 
  ArrowRight, ShieldCheck, Battery, 
  Lightbulb, Coins, History, BarChart3,
  Calendar, Info, AlertTriangle, Download, Share2
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("solar-roi-simulator-pakistan");

const SolarSimulator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;

  const [systemSize, setSystemSize] = useState<number>(10);
  const [unitRate, setUnitRate] = useState<number>(55);
  const [systemCost, setSystemCost] = useState<number>(1200000);
  const [selfConsumption, setSelfConsumption] = useState<number>(60); // % of generated power used directly

  const results = useMemo(() => {
    // Basic Physics for Pakistan: Avg 5.5 peak hours, 20% system efficiency loss
    const dailyGeneration = systemSize * 5.5 * 0.8; 
    const monthlyGeneration = dailyGeneration * 30;
    const annualGeneration = monthlyGeneration * 12;

    const selfUsedUnits = monthlyGeneration * (selfConsumption / 100);
    const exportedUnits = monthlyGeneration - selfUsedUnits;

    // Financials (Export rate is usually lower than import rate in Pakistan, approx Rs. 20-25)
    const exportRate = 22; 
    const monthlySavings = (selfUsedUnits * unitRate) + (exportedUnits * exportRate);
    const annualSavings = monthlySavings * 12;

    const paybackYears = systemCost / annualSavings;
    const paybackMonths = Math.ceil(paybackYears * 12);

    return {
      dailyGeneration,
      monthlyGeneration,
      annualGeneration,
      monthlySavings,
      annualSavings,
      paybackYears,
      paybackMonths,
      selfUsedUnits,
      exportedUnits
    };
  }, [systemSize, unitRate, systemCost, selfConsumption]);

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        <div className="lg:col-span-8 space-y-6">
          <div className="surface-card bg-secondary/5 border-border/40 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-border/40 bg-background flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-secondary flex items-center justify-center">
                     <Sun className="size-6 text-foreground" />
                  </div>
                  <div className="space-y-0.5">
                     <h3 className="text-lg font-bold tracking-tight text-foreground uppercase">System Configuration</h3>
                     <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Simulate your solar potential for 2026</p>
                  </div>
               </div>
            </div>
            
            <div className="p-8 space-y-10">
               <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">System Size (kW)</Label>
                     <div className="relative group">
                        <Input
                        type="number"
                        value={systemSize || ""}
                        onChange={(e) => setSystemSize(Number(e.target.value) || 0)}
                        className="h-20 bg-background border-border/60 font-mono text-4xl font-bold rounded-3xl pl-20 focus:ring-4 ring-primary/5 transition-all"
                        placeholder="0"
                        />
                        <div className="absolute left-8 top-1/2 -translate-y-1/2 text-muted-foreground/20 font-mono text-xl font-bold">kW</div>
                     </div>
                     <div className="flex gap-2">
                        {[5, 10, 15, 20].map((size) => (
                           <button 
                              key={size}
                              onClick={() => setSystemSize(size)}
                              className={cn("px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all", 
                                 systemSize === size ? "bg-foreground text-background" : "bg-secondary/40 text-muted-foreground hover:bg-secondary")
                              }
                           >{size}kW</button>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-4">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Unit Rate (Import)</Label>
                     <div className="relative">
                        <Input
                        type="number"
                        value={unitRate || ""}
                        onChange={(e) => setUnitRate(Number(e.target.value) || 0)}
                        className="h-20 bg-background border-border/60 font-mono text-3xl font-bold rounded-3xl pl-16 opacity-60 focus:opacity-100 transition-opacity"
                        placeholder="0"
                        />
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/30 font-mono text-sm font-bold">Rs.</div>
                     </div>
                     <p className="text-[9px] text-muted-foreground uppercase font-bold italic tracking-tighter">Avg 2026 tariff: Rs. 55-65/unit</p>
                  </div>
               </div>

               <div className="grid sm:grid-cols-2 gap-8 pt-4 border-t border-border/40">
                  <div className="space-y-3">
                     <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total System Cost (PKR)</Label>
                     <div className="relative">
                        <Input
                        type="number"
                        value={systemCost || ""}
                        onChange={(e) => setSystemCost(Number(e.target.value) || 0)}
                        className="h-14 bg-background border-border/60 font-mono text-xl font-bold rounded-2xl pl-12"
                        placeholder="0"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 font-mono text-xs font-bold uppercase">Rs.</div>
                     </div>
                  </div>
                  <div className="space-y-3">
                     <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Day-Time Self Consumption</Label>
                     <div className="flex items-center gap-4 pt-2">
                        <input 
                           type="range" 
                           min="0" 
                           max="100" 
                           value={selfConsumption} 
                           onChange={(e) => setSelfConsumption(Number(e.target.value))}
                           className="flex-1 accent-foreground"
                        />
                        <span className="text-xs font-mono font-bold w-10">{selfConsumption}%</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-8 bg-foreground/5 border-t border-border/40 grid sm:grid-cols-3 gap-8">
               <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                     <Zap className="size-3.5" />
                     <span className="text-[9px] font-black uppercase tracking-widest">Daily Generation</span>
                  </div>
                  <div className="text-xl font-mono font-bold">{results?.dailyGeneration.toFixed(1)} Units</div>
               </div>
               <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                     <History className="size-3.5" />
                     <span className="text-[9px] font-black uppercase tracking-widest">Monthly Export</span>
                  </div>
                  <div className="text-xl font-mono font-bold">{Math.round(results?.exportedUnits)} Units</div>
               </div>
               <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                     <TrendingUp className="size-3.5" />
                     <span className="text-[9px] font-black uppercase tracking-widest">Annual Savings</span>
                  </div>
                  <div className="text-xl font-mono font-bold text-health">Rs. {Math.round(results?.annualSavings).toLocaleString()}</div>
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="surface-card p-10 bg-background border-border/60 shadow-xl space-y-10 sticky top-28 overflow-hidden">
             <div className="absolute top-0 right-0 size-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

             <div className="space-y-6 relative border-b border-border/40 pb-10">
                <div className="flex items-center justify-between">
                   <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">System Payback</div>
                   <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-health/10 text-health text-[9px] font-black uppercase tracking-tighter">
                      ROI TARGET
                   </div>
                </div>
                <div className="text-6xl font-mono font-bold tracking-tighter text-foreground">
                   {results?.paybackYears.toFixed(1)}<span className="text-xl ml-1">Years</span>
                </div>
                <div className="text-[11px] text-muted-foreground font-black uppercase tracking-widest flex items-center gap-2">
                   <Calendar className="size-3" /> Approx. {results?.paybackMonths} Months
                </div>
             </div>

                <div className="space-y-3 relative">
                   {/* MONTHLY SAVING CARD */}
                   <div className="surface-card p-4 bg-health/5 border-health/20 shadow-lg shadow-health/5 space-y-1.5 transition-all hover:scale-[1.02] border-2">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black uppercase tracking-widest text-health">Monthly Saving</span>
                         <TrendingUp className="size-4 text-health" />
                      </div>
                      <p className="text-2xl font-mono font-black text-health leading-none">
                         Rs.{Math.round(results?.monthlySavings || 0).toLocaleString()}
                      </p>
                      <p className="text-[9px] text-health/60 font-bold uppercase tracking-tight">Projected utility bill reduction</p>
                   </div>
 
                   {/* MONTHLY GEN CARD */}
                   <div className="surface-card p-4 bg-secondary/10 border-border/40 shadow-lg space-y-1.5 transition-all hover:scale-[1.02] border-2">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Monthly Gen</span>
                         <Zap className="size-4 text-muted-foreground/40" />
                      </div>
                      <p className="text-2xl font-mono font-black text-foreground leading-none">
                         {Math.round(results?.monthlyGeneration)} Units
                      </p>
                      <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tight">Estimated energy production</p>
                   </div>
                </div>

                <div className="p-6 rounded-3xl bg-secondary/30 border border-border/60 space-y-4">
                   <div className="flex items-center gap-2 text-foreground/60">
                      <BarChart3 className="size-4" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Efficiency Breakdown</span>
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                         <span>Self Consumed</span>
                         <span>{selfConsumption}%</span>
                      </div>
                      <div className="h-2 w-full bg-background rounded-full overflow-hidden border border-border/40">
                         <div 
                           className="h-full bg-primary transition-all duration-1000 ease-out" 
                           style={{ width: `${selfConsumption}%` }} 
                         />
                      </div>
                   </div>
                </div>
                
                <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl flex gap-4">
                   <Info className="size-5 text-primary shrink-0" />
                   <div className="space-y-1">
                      <p className="text-[10px] text-foreground font-bold uppercase">ROI Projection</p>
                      <p className="text-[9px] text-muted-foreground leading-relaxed font-medium">
                         Payback assumes fixed tariff rates. If electricity prices increase, your payback period will reduce accordingly.
                      </p>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </CalculatorPage>
  );
};

export default SolarSimulator;
