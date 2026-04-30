"use client";

import { useMemo, useState } from "react";
import { 
  Zap, Info, TrendingDown, Receipt, 
  ShieldCheck, AlertTriangle, PieChart,
  Lightbulb, Activity, Scale, Banknote,
  LayoutGrid, MousePointer2
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("electricity-bill-predictor-pakistan");

const PROTECTED_SLABS = [
  { limit: 100, rate: 13.48 },
  { limit: 200, rate: 18.95 },
];

const UNPROTECTED_SLABS = [
  { limit: 100, rate: 28.50 },
  { limit: 200, rate: 32.10 },
  { limit: 300, rate: 38.40 },
  { limit: 400, rate: 44.20 },
  { limit: 500, rate: 48.00 },
  { limit: 600, rate: 51.50 },
  { limit: 700, rate: 54.80 },
  { limit: Infinity, rate: 62.50 },
];

const TAX_CONSTANTS = {
  FPA_RATE: 4.50, // Average Fuel Price Adjustment 2026
  FINANCING_SURCHARGE: 3.23,
  ED_RATE: 0.015, // Electricity Duty
  GST_RATE: 0.18, // 18% GST
  PTV_FEE: 35,
};

const ElectricityPredictor = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;

  const [units, setUnits] = useState<number>(350);
  const [isProtected, setIsProtected] = useState<boolean>(false);

  const results = useMemo(() => {
    let energyCost = 0;
    let remainingUnits = units;
    const slabs = isProtected && units <= 200 ? PROTECTED_SLABS : UNPROTECTED_SLABS;

    let previousLimit = 0;
    for (const slab of slabs) {
      const unitsInSlab = Math.min(remainingUnits, slab.limit - previousLimit);
      if (unitsInSlab <= 0) break;
      energyCost += unitsInSlab * slab.rate;
      remainingUnits -= unitsInSlab;
      previousLimit = slab.limit;
    }

    const fpa = units * TAX_CONSTANTS.FPA_RATE;
    const surcharge = units * TAX_CONSTANTS.FINANCING_SURCHARGE;
    const electricityDuty = energyCost * TAX_CONSTANTS.ED_RATE;
    
    const subtotal = energyCost + fpa + surcharge + electricityDuty;
    const gst = subtotal * TAX_CONSTANTS.GST_RATE;
    const total = subtotal + gst + TAX_CONSTANTS.PTV_FEE;

    return {
      energyCost,
      fpa,
      surcharge,
      electricityDuty,
      gst,
      total,
      avgRate: units > 0 ? total / units : 0
    };
  }, [units, isProtected]);

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        <div className="lg:col-span-8 space-y-6">
          <div className="surface-card bg-secondary/5 border-border/40 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-border/40 bg-background flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-secondary flex items-center justify-center">
                     <Zap className="size-6 text-foreground" />
                  </div>
                  <div className="space-y-0.5">
                     <h3 className="text-lg font-bold tracking-tight text-foreground uppercase">Usage Simulator</h3>
                     <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">2026 NEPRA Tariff Calibration</p>
                  </div>
               </div>
            </div>
            
            <div className="p-8 space-y-12">
               {/* STEP 1: UNITS */}
               <div className="space-y-6">
                  <div className="flex items-center gap-2">
                     <div className="size-6 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] font-black">1</div>
                     <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Units Consumed (kWh)</Label>
                  </div>
                  <div className="relative group">
                     <Input
                        type="number"
                        value={units || ""}
                        onChange={(e) => setUnits(Number(e.target.value) || 0)}
                        className="h-20 bg-background border-border/60 font-mono text-5xl font-bold rounded-3xl pr-20 focus:ring-4 ring-primary/5 transition-all"
                        placeholder="0"
                     />
                     <div className="absolute right-8 top-1/2 -translate-y-1/2 text-muted-foreground/20 font-mono text-xl font-bold">kWh</div>
                  </div>
               </div>

               {/* STEP 2: CATEGORY */}
               <div className="space-y-6 pt-6 border-t border-border/40">
                  <div className="flex items-center gap-2">
                     <div className="size-6 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] font-black">2</div>
                     <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Consumer Category</Label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <button 
                        onClick={() => setIsProtected(true)}
                        className={cn("p-6 border rounded-3xl transition-all text-left group relative overflow-hidden", 
                           (isProtected && units <= 200) ? "bg-primary/5 border-primary/40 shadow-sm" : "bg-background border-border/60 hover:border-foreground/20")
                        }
                     >
                        <div className="space-y-1 relative z-10">
                           <p className={cn("text-xs font-black uppercase tracking-tight", (isProtected && units <= 200) ? "text-foreground" : "text-muted-foreground")}>Protected</p>
                           <p className="text-[10px] text-muted-foreground font-medium uppercase">Consistent &lt;200 units for 6 months</p>
                        </div>
                        {(isProtected && units <= 200) && (
                           <div className="absolute top-0 right-0 p-3">
                              <ShieldCheck className="size-4 text-primary" />
                           </div>
                        )}
                     </button>
                     <button 
                        onClick={() => setIsProtected(false)}
                        className={cn("p-6 border rounded-3xl transition-all text-left group relative overflow-hidden", 
                           (!isProtected || units > 200) ? "bg-primary/5 border-primary/40 shadow-sm" : "bg-background border-border/60 hover:border-foreground/20")
                        }
                     >
                        <div className="space-y-1 relative z-10">
                           <p className={cn("text-xs font-black uppercase tracking-tight", (!isProtected || units > 200) ? "text-foreground" : "text-muted-foreground")}>Unprotected</p>
                           <p className="text-[10px] text-muted-foreground font-medium uppercase">Standard Residential Consumer</p>
                        </div>
                        {(!isProtected || units > 200) && (
                           <div className="absolute top-0 right-0 p-3">
                              <ShieldCheck className="size-4 text-primary" />
                           </div>
                        )}
                     </button>
                  </div>
                  {isProtected && units > 200 && (
                     <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/20 flex items-center gap-3">
                        <AlertTriangle className="size-4 text-destructive" />
                        <p className="text-[9px] text-destructive uppercase font-bold tracking-tight">Warning: Protected status is automatically lost if monthly consumption exceeds 200 units.</p>
                     </div>
                  )}
               </div>

               <div className="p-6 bg-foreground/[0.02] border border-border/40 rounded-3xl flex gap-4">
                  <Info className="size-5 text-muted-foreground shrink-0 mt-1" />
                  <div className="space-y-1">
                     <p className="text-[11px] font-bold text-foreground uppercase tracking-tight">Verified 2026 Logic</p>
                     <p className="text-[10px] text-muted-foreground leading-relaxed font-medium uppercase">
                        Current prediction assumes FPA of Rs. {TAX_CONSTANTS.FPA_RATE.toFixed(2)} and GST of 18%. Actual bills may vary by DISCO (LESCO, K-Electric, FESCO, etc.).
                     </p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="surface-card p-10 bg-background border-border/60 shadow-xl space-y-10 sticky top-28 overflow-hidden">
             <div className="absolute top-0 right-0 size-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

             <div className="space-y-6 relative border-b border-border/40 pb-10">
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Estimated Bill</div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-health/10 text-health text-[9px] font-black uppercase tracking-tighter">
                         TOTAL PAYABLE
                      </div>
                   </div>
                   <div className="text-6xl font-mono font-bold tracking-tighter text-foreground">
                      Rs.{Math.round(results?.total || 0).toLocaleString()}
                   </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border/40">
                   <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Effective Unit Rate</div>
                   <div className="text-4xl font-mono font-bold tracking-tighter text-health">
                      Rs.{results?.avgRate.toFixed(2)}
                   </div>
                </div>
                
                <div className="text-[11px] text-muted-foreground font-black uppercase tracking-widest flex items-center gap-2">
                   <Receipt className="size-3" /> Pakistan Rupees (PKR)
                </div>
             </div>

             <div className="space-y-8 relative">
                <div className="space-y-5">
                   <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                      <span>Base Cost</span>
                      <span className="text-foreground font-mono">Rs.{Math.round(results?.energyCost || 0).toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                      <span>FPA (Estimated)</span>
                      <span className="text-foreground font-mono">Rs.{Math.round(results?.fpa || 0).toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                      <span>GST (18%)</span>
                      <span className="text-destructive font-mono">+Rs.{Math.round(results?.gst || 0).toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                      <span>Surcharges/ED</span>
                      <span className="text-destructive font-mono">+Rs.{Math.round((results?.surcharge || 0) + (results?.electricityDuty || 0)).toLocaleString()}</span>
                   </div>
                </div>

                <div className="p-6 rounded-3xl bg-secondary/30 border border-border/60 space-y-4">
                   <div className="flex items-center gap-2 text-foreground/60">
                      <PieChart className="size-4" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Bill Composition</span>
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                         <span>Energy Efficiency</span>
                         <span>{((results.energyCost / results.total) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-2 w-full bg-background rounded-full overflow-hidden border border-border/40">
                         <div 
                           className="h-full bg-primary transition-all duration-1000 ease-out" 
                           style={{ width: `${(results.energyCost / results.total) * 100}%` }} 
                         />
                      </div>
                   </div>
                </div>
                
                <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl flex gap-4">
                   <Lightbulb className="size-5 text-primary shrink-0" />
                   <div className="space-y-1">
                      <p className="text-[10px] text-foreground font-bold uppercase">Slab Tip</p>
                      <p className="text-[9px] text-muted-foreground leading-relaxed font-medium">
                         Your {isProtected ? "Protected" : "Unprotected"} rate for {units} units averages **Rs.{results.avgRate.toFixed(1)}/unit**. Staying under 200 units saves significant tax.
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

export default ElectricityPredictor;
