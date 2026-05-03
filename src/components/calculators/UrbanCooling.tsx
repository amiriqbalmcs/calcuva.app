"use client";

import { useMemo, useState } from "react";
import { 
  Trees, ThermometerSun, Wind, Droplets, 
  ArrowRight, Info, AlertTriangle, 
  Download, Share2, Copy, CheckCircle2,
  HelpCircle, Lightbulb, MapPin, Leaf, Snowflake
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("urban-cooling-tree-multiplier");

const UrbanCooling = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;

  const [plotSize, setPlotSize] = useState<number>(10); // Marla
  const [currentTreeCount, setCurrentTreeCount] = useState<number>(0);
  const [houseDirection, setHouseDirection] = useState<"south" | "west" | "other">("west");
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    // 1 Marla is approx 272 sqft. 
    // Logic: A mature indigenous tree (Neem) can provide cooling equivalent to 10 room-sized ACs.
    // In urban settings, 1 tree per 2 marlas provides significant localized cooling (~1.5-2°C reduction).
    
    const recommendedTrees = Math.ceil(plotSize / 2);
    const gap = Math.max(0, recommendedTrees - currentTreeCount);
    
    // Impact estimation for 2026 climate
    const coolingPotential = Math.min(4.5, (currentTreeCount / recommendedTrees) * 3 + (houseDirection === "west" ? 0.5 : 0));
    const annualCarbonSequestration = currentTreeCount * 22; // kg per year
    const waterRechargeValue = currentTreeCount * 1500; // liters per year

    return {
      recommendedTrees,
      gap,
      coolingPotential,
      annualCarbonSequestration,
      waterRechargeValue,
      acSavingPercentage: Math.min(25, currentTreeCount * 5)
    };
  }, [plotSize, currentTreeCount, houseDirection]);

  const handleCopy = () => {
    const text = `Urban Cooling 2026: My ${plotSize} Marla home can be ${results.coolingPotential.toFixed(1)}°C cooler with ${results.recommendedTrees} trees. Calculate your local impact at ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        <div className="lg:col-span-8 space-y-6">
          <div className="surface-card bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-emerald-500/10 dark:border-emerald-500/20 bg-background flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                  <Trees className="size-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-lg font-bold tracking-tight text-foreground uppercase">Property & Canopy</h3>
                  <p className="text-[10px] text-emerald-600/60 dark:text-emerald-400/60 uppercase tracking-widest font-bold">2026 Urban Heat Mitigation</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 space-y-10">
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Plot Size (Marla)</Label>
                  <div className="relative group">
                    <Input
                      type="number"
                      value={plotSize || ""}
                      onChange={(e) => setPlotSize(Number(e.target.value) || 0)}
                      className="h-20 bg-background border-border/60 font-mono text-4xl font-bold rounded-3xl pl-12 focus:ring-4 ring-emerald-500/5 transition-all"
                      placeholder="10"
                    />
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 text-muted-foreground/20 font-mono text-xl font-bold">M</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Trees Already Planted</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={currentTreeCount || ""}
                      onChange={(e) => setCurrentTreeCount(Number(e.target.value) || 0)}
                      className="h-20 bg-background border-border/60 font-mono text-3xl font-bold rounded-3xl pl-12 focus:ring-4 ring-emerald-500/5 transition-all"
                      placeholder="0"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground/30 font-mono text-sm font-bold">🌳</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/40">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">House Facing (Sunset Side)</Label>
                <div className="flex gap-2">
                  {[
                    { id: "west", label: "West (Max Heat)", icon: ThermometerSun },
                    { id: "south", label: "South (High Sun)", icon: Wind },
                    { id: "other", label: "North/East", icon: Leaf }
                  ].map((dir) => (
                    <button 
                      key={dir.id}
                      onClick={() => setHouseDirection(dir.id as any)}
                      className={cn(
                        "flex-1 p-4 rounded-2xl text-[10px] font-bold uppercase transition-all border flex flex-col items-center gap-2",
                        houseDirection === dir.id ? "bg-emerald-600 text-white border-emerald-700" : "bg-background text-muted-foreground border-border hover:bg-secondary"
                      )}
                    >
                      <dir.icon className="size-4" />
                      {dir.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 bg-emerald-500/5 dark:bg-emerald-500/10 border-t border-emerald-500/10 dark:border-emerald-500/20 grid sm:grid-cols-3 gap-6">
               <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600/70 dark:text-emerald-400/70">Ideal Tree Count</span>
                  <div className="text-xl font-mono font-bold text-emerald-800 dark:text-emerald-300">{results.recommendedTrees} Trees</div>
               </div>
               <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600/70 dark:text-emerald-400/70">AC Bill Saving</span>
                  <div className="text-xl font-mono font-bold text-emerald-800 dark:text-emerald-300">~{results.acSavingPercentage}%</div>
               </div>
               <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600/70 dark:text-emerald-400/70">Water Recharge</span>
                  <div className="text-xl font-mono font-bold text-emerald-800 dark:text-emerald-300">{results.waterRechargeValue.toLocaleString()}L / yr</div>
               </div>
            </div>
          </div>

          <div className="surface-card p-8 bg-background border-border/60 shadow-sm space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Lightbulb className="size-4 text-emerald-600" /> Recommended Indigenous Species (2026)
            </h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-500/20 flex gap-4">
                <div className="size-10 rounded-xl bg-background dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center shrink-0">🌿</div>
                <div className="space-y-1">
                  <p className="text-[11px] font-black text-emerald-900 dark:text-emerald-400 uppercase">Neem (Azadirachta indica)</p>
                  <p className="text-[10px] text-emerald-800/60 dark:text-emerald-400/60 leading-relaxed font-medium">Best for shade and natural air purification. Highly resilient to 2026 heatwaves.</p>
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-500/20 flex gap-4">
                <div className="size-10 rounded-xl bg-background dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center shrink-0">🌼</div>
                <div className="space-y-1">
                  <p className="text-[11px] font-black text-emerald-900 dark:text-emerald-400 uppercase">Amaltas (Golden Shower)</p>
                  <p className="text-[10px] text-emerald-800/60 dark:text-emerald-400/60 leading-relaxed font-medium">Perfect for urban aesthetic and localized cooling. Requires low water once mature.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="surface-card p-10 bg-background border-border/60 shadow-xl space-y-10 sticky top-28 overflow-hidden">
             <div className="absolute top-0 right-0 size-32 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

             <div className="space-y-6 relative border-b border-border/40 pb-10">
                 <div className="flex items-center justify-between">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Cooling Potential</div>
                    <button 
                       onClick={handleCopy}
                       className={cn(
                          "p-2 rounded-lg transition-all border shadow-sm",
                          copied ? "bg-emerald-600 text-white border-emerald-700" : "bg-background text-foreground border-border hover:bg-secondary"
                       )}
                    >
                       {copied ? <CheckCircle2 className="size-3.5" /> : <Copy className="size-3.5" />}
                    </button>
                 </div>
                <div className="text-6xl font-mono font-bold tracking-tighter text-emerald-700 dark:text-emerald-400">
                   -{results.coolingPotential.toFixed(1)}°C
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Snowflake className="size-3" /> Natural Aircon
                  </div>
                </div>
             </div>

             <div className="space-y-8 relative">
                <div className="p-6 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-500/20 space-y-4">
                   <div className="flex items-center gap-2 text-emerald-700/60 dark:text-emerald-400/60">
                      <Leaf className="size-4" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Carbon Impact</span>
                   </div>
                   <div className="space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px] font-bold uppercase text-emerald-800 dark:text-emerald-400">
                            <span>CO2 Sequestration</span>
                            <span>{results.annualCarbonSequestration}kg / yr</span>
                        </div>
                        <div className="h-1.5 w-full bg-emerald-100 dark:bg-emerald-950 rounded-full overflow-hidden">
                            <div 
                               className="h-full bg-emerald-500 transition-all duration-1000 ease-out" 
                               style={{ width: `${Math.min(100, (currentTreeCount / results.recommendedTrees) * 100)}%` }} 
                            />
                        </div>
                      </div>
                   </div>
                </div>

                <div className="p-6 bg-blue-50/30 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-500/20 rounded-2xl flex gap-4">
                   <Droplets className="size-5 text-blue-500 shrink-0" />
                   <div className="space-y-1">
                      <p className="text-[10px] text-blue-900 dark:text-blue-400 font-bold uppercase tracking-widest">Groundwater Bonus</p>
                      <p className="text-[9px] text-blue-800/70 dark:text-blue-400/70 leading-relaxed font-medium">
                        Your trees will recharge {results.waterRechargeValue.toLocaleString()} liters of rain water back into the Earth annually.
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

export default UrbanCooling;
