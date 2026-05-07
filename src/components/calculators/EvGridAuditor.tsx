"use client";

import { useMemo, useState } from "react";
import { 
  Zap, Battery, Car, Gauge, 
  ArrowRight, Info, AlertTriangle, 
  Download, Share2, Copy, CheckCircle2,
  HelpCircle, Lightbulb, MapPin, Factory, Cloud
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HowToGuide } from "@/components/HowToGuide";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("ev-grid-cleanliness-auditor")!;

const EvGridAuditor = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [monthlyMileage, setMonthlyMileage] = useState<number>(1000); // km
  const [evEfficiency, setEvEfficiency] = useState<number>(6); // km per kWh
  const [chargingSource, setChargingSource] = useState<"grid" | "solar" | "mixed">("grid");
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    // 2026 Pakistan Grid Carbon Intensity logic (Estimated)
    // Average Grid = 450g CO2 per kWh (mix of coal, gas, hydro, solar)
    // Solar = 0g CO2 (during day)
    
    const energyUsed = monthlyMileage / evEfficiency; // kWh
    let carbonIntensity = 450; // g/kWh
    
    if (chargingSource === "solar") carbonIntensity = 20; // Lifecycle footprint only
    if (chargingSource === "mixed") carbonIntensity = 235;

    const totalCarbon = (energyUsed * carbonIntensity) / 1000; // kg CO2
    const petrolComparison = (monthlyMileage / 12) * 2.3; // 12km/L avg petrol car, 2.3kg CO2 per L
    
    const savingsPercentage = ((petrolComparison - totalCarbon) / petrolComparison) * 100;
    const greenScore = Math.max(0, 100 - (carbonIntensity / 6));

    return {
      energyUsed,
      totalCarbon,
      petrolComparison,
      savingsPercentage,
      greenScore,
      treesNeeded: Math.ceil(totalCarbon / 22)
    };
  }, [monthlyMileage, evEfficiency, chargingSource]);

  const handleCopy = () => {
    const text = `EV Grid Auditor 2026: My EV has a Green Score of ${results.greenScore.toFixed(0)}%. I'm saving ${results.savingsPercentage.toFixed(0)}% CO2 vs petrol. Audit your car at ${window.location.href}`;
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
            <div className="surface-card p-10 bg-background border-border/60 shadow-xl space-y-10 sticky top-32 overflow-hidden rounded-3xl">
               <div className="absolute top-0 right-0 size-32 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

               <div className="space-y-6 relative border-b border-border/40 pb-10">
                   <div className="flex items-center justify-between">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">True Green Score</div>
                      <button 
                         onClick={handleCopy}
                         className={cn(
                            "p-2 rounded-lg transition-all border shadow-sm",
                            copied ? "bg-orange-600 text-white border-orange-700" : "bg-background text-foreground border-border hover:bg-secondary"
                         )}
                      >
                         {copied ? <CheckCircle2 className="size-3.5" /> : <Copy className="size-3.5" />}
                      </button>
                   </div>
                  <div className="text-6xl font-mono font-bold tracking-tighter text-orange-700 dark:text-orange-400">
                     {results.greenScore.toFixed(0)}%
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <Car className="size-3" /> Clean Miles
                    </div>
                  </div>
               </div>

                <div className="space-y-8 relative">
                  <div className="p-6 rounded-3xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-500/20 space-y-4">
                     <div className="flex items-center gap-2 text-orange-700/60 dark:text-orange-400/60">
                        <Cloud className="size-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Carbon Reduction</span>
                     </div>
                     <div className="space-y-4">
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[9px] font-bold uppercase text-orange-800 dark:text-orange-400">
                              <span>CO2 Saved vs Petrol</span>
                              <span>{results.savingsPercentage.toFixed(1)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-orange-100 dark:bg-orange-950 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-orange-500 transition-all duration-1000 ease-out" 
                                style={{ width: `${Math.min(100, results.savingsPercentage)}%` }} 
                              />
                          </div>
                        </div>
                     </div>
                  </div>

                  <div className="p-6 bg-slate-900 text-white rounded-2xl flex gap-4 shadow-xl">
                     <Gauge className="size-5 text-orange-400 shrink-0" />
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest">2026 Audit</p>
                        <p className="text-[9px] text-slate-300 leading-relaxed font-medium">
                          Your "True Green" score depends on when you charge. Charging at night in 2026 still relies on higher coal-mix than daytime solar-surplus charging.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Left Column: Inputs Panel */}
          <div className="lg:col-span-8 space-y-6 order-2 lg:order-1">
            <div className="surface-card bg-orange-500/5 dark:bg-orange-500/10 border-orange-500/20 overflow-hidden shadow-sm rounded-3xl">
              <div className="p-8 border-b border-orange-500/10 dark:border-orange-500/20 bg-background flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center">
                    <Battery className="size-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-lg font-bold tracking-tight text-foreground uppercase">True Green Auditor</h3>
                    <p className="text-[10px] text-orange-600/60 dark:text-orange-400/60 uppercase tracking-widest font-bold">2026 Grid Intensity Analysis</p>
                  </div>
                </div>
              </div>
              
              <div className="p-8 space-y-10">
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Monthly Mileage (KM)</Label>
                    <div className="relative group">
                      <Input
                        type="number"
                        value={monthlyMileage || ""}
                        onChange={(e) => setMonthlyMileage(Number(e.target.value) || 0)}
                        className="h-20 bg-background border-border/60 font-mono text-4xl font-bold rounded-3xl pl-12 focus:ring-4 ring-orange-500/5 transition-all"
                        placeholder="1000"
                      />
                      <div className="absolute right-8 top-1/2 -translate-y-1/2 text-muted-foreground/20 font-mono text-xl font-bold">KM</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">EV Efficiency (KM/kWh)</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={evEfficiency || ""}
                        onChange={(e) => setEvEfficiency(Number(e.target.value) || 0)}
                        className="h-20 bg-background border-border/60 font-mono text-3xl font-bold rounded-3xl pl-12 focus:ring-4 ring-orange-500/5 transition-all"
                        placeholder="6"
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground/30 font-mono text-sm font-bold">⚡</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border/40">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Primary Charging Source</Label>
                  <div className="flex gap-2">
                    {[
                      { id: "grid", label: "National Grid", sub: "Mixed Source", icon: Factory },
                      { id: "mixed", label: "Mixed Day/Night", sub: "Solar + Grid", icon: Zap },
                      { id: "solar", label: "100% Solar", sub: "Daytime Charge", icon: Lightbulb }
                    ].map((src) => (
                      <button 
                        key={src.id}
                        onClick={() => setChargingSource(src.id as any)}
                        className={cn(
                          "flex-1 p-4 rounded-2xl text-[10px] font-bold uppercase transition-all border flex flex-col items-center gap-2 text-center",
                          chargingSource === src.id ? "bg-orange-600 text-white border-orange-700 shadow-lg shadow-orange-500/20" : "bg-background text-muted-foreground border-border hover:bg-secondary"
                        )}
                      >
                        <src.icon className="size-4" />
                        <span>{src.label}</span>
                        <span className="text-[8px] opacity-60 lowercase font-normal leading-none italic">{src.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 bg-orange-500/5 dark:bg-orange-500/10 border-t border-orange-500/10 dark:border-orange-500/20 grid sm:grid-cols-3 gap-6">
                 <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-orange-600/70 dark:text-orange-400/70">Grid Energy Used</span>
                    <div className="text-xl font-mono font-bold text-orange-800 dark:text-orange-300">{Math.round(results.energyUsed)} kWh</div>
                 </div>
                 <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-orange-600/70 dark:text-orange-400/70">Petrol CO2 Equivalent</span>
                    <div className="text-xl font-mono font-bold text-orange-800 dark:text-orange-300">{Math.round(results.petrolComparison)} kg</div>
                 </div>
                 <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-orange-600/70 dark:text-orange-400/70">Offset Trees Needed</span>
                    <div className="text-xl font-mono font-bold text-orange-800 dark:text-orange-300">{results.treesNeeded} Trees</div>
                 </div>
              </div>
            </div>

            <div className="surface-card p-8 bg-background border-border/60 shadow-sm space-y-6 rounded-3xl">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Lightbulb className="size-4 text-orange-600" /> Auditor Insights
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-500/20 space-y-2">
                  <p className="text-[11px] font-black text-orange-900 dark:text-orange-400 uppercase">Efficiency Matters</p>
                  <p className="text-[10px] text-orange-800/60 dark:text-orange-400/60 leading-relaxed font-medium">For every 1 km/kWh improvement in efficiency, you reduce your grid dependency by ~15%.</p>
                </div>
                <div className="p-5 rounded-3xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-500/20 space-y-2">
                  <p className="text-[11px] font-black text-orange-900 dark:text-orange-400 uppercase">Solar Impact</p>
                  <p className="text-[10px] text-orange-800/60 dark:text-orange-400/60 leading-relaxed font-medium">Charging directly from solar bypasses grid losses and eliminates tailpipe emissions entirely.</p>
                </div>
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

export default EvGridAuditor;
