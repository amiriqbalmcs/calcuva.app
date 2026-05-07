"use client";

import { useMemo, useState } from "react";
import {
  Trees, ThermometerSun, Wind, Droplets,
  ArrowRight, Info, AlertTriangle,
  Download, Share2, Copy, CheckCircle2,
  HelpCircle, Lightbulb, MapPin, Leaf, Snowflake, TrendingUp
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { HowToGuide } from "@/components/HowToGuide";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("urban-cooling-tree-multiplier")!;

const UrbanCooling = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
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

  if (!calc) return null;

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="w-full max-w-7xl mx-auto space-y-12 sm:px-6 lg:px-8">

        {/* Main Interface: Side-by-Side Results & Inputs */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* Right Column: Results Dashboard */}
          <div className="lg:col-span-4 space-y-6 order-1 lg:order-2">
            <div className="surface-card p-10 bg-background border-border/60 shadow-xl space-y-10 sticky top-32 overflow-hidden rounded-2xl">
              <div className="absolute top-0 right-0 size-32 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

              <div className="space-y-6 relative border-b border-border/40 pb-10">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-foreground">Cooling Potential</div>
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
                <div className="text-6xl font-mono font-bold tracking-tighter text-emerald-700 dark:text-emerald-400 leading-none text-foreground">
                  -{results.coolingPotential.toFixed(1)}°C
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Snowflake className="size-3.5" /> Natural Aircon
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-500/20 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-700/60 dark:text-emerald-400/60">
                    <Leaf className="size-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Eco Impact</span>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[9px] font-bold uppercase text-emerald-800 dark:text-emerald-400">
                        <span>CO2 Reduction</span>
                        <span>{results.annualCarbonSequestration}kg / yr</span>
                      </div>
                      <div className="h-2 w-full bg-emerald-100 dark:bg-emerald-950 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                          style={{ width: `${Math.min(100, (currentTreeCount / results.recommendedTrees) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-blue-50/30 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-500/20 rounded-2xl flex gap-4">
                  <Droplets className="size-5 text-blue-500 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-[10px] text-blue-900 dark:text-blue-400 font-bold uppercase tracking-widest">Water Recharge</p>
                    <p className="text-[9px] text-blue-800/70 dark:text-blue-400/70 leading-relaxed font-medium">
                      Recharges {results.waterRechargeValue.toLocaleString()}L back into ground annually.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Left Column: Inputs Panel */}
          <div className="lg:col-span-8 space-y-6 order-2 lg:order-1">
            <div className="surface-card bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 overflow-hidden shadow-sm rounded-2xl">
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

              <div className="p-8 space-y-12">
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Plot Size (Marla)</Label>
                    <div className="relative group">
                      <Input
                        type="number"
                        value={plotSize || ""}
                        onChange={(e) => setPlotSize(Number(e.target.value) || 0)}
                        className="h-20 bg-background border-border/60 font-mono text-4xl font-bold rounded-2xl pl-12 focus:ring-4 ring-emerald-500/5 transition-all text-foreground"
                        placeholder="10"
                      />
                      <div className="absolute right-8 top-1/2 -translate-y-1/2 text-muted-foreground/20 font-mono text-xl font-bold">M</div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Existing Trees</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={currentTreeCount || ""}
                        onChange={(e) => setCurrentTreeCount(Number(e.target.value) || 0)}
                        className="h-20 bg-background border-border/60 font-mono text-4xl font-bold rounded-2xl pl-12 focus:ring-4 ring-emerald-500/5 transition-all text-foreground"
                        placeholder="0"
                      />
                      <div className="absolute right-8 top-1/2 -translate-y-1/2 text-muted-foreground/30 font-mono text-2xl font-bold">🌳</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-8 border-t border-border/40 text-foreground">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">House Facing (Sunset Side Exposure)</Label>
                  <div className="flex flex-wrap sm:flex-nowrap gap-3">
                    {[
                      { id: "west", label: "West Side", icon: ThermometerSun, detail: "Max Heat" },
                      { id: "south", label: "South Side", icon: Wind, detail: "High Sun" },
                      { id: "other", label: "North/East", icon: Leaf, detail: "Balanced" }
                    ].map((dir) => (
                      <button
                        key={dir.id}
                        onClick={() => setHouseDirection(dir.id as any)}
                        className={cn(
                          "flex-1 min-w-[120px] p-6 rounded-2xl text-[10px] font-bold uppercase transition-all border flex flex-col items-center gap-3",
                          houseDirection === dir.id ? "bg-emerald-600 text-white border-emerald-700 shadow-lg shadow-emerald-600/20" : "bg-background text-muted-foreground border-border hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                        )}
                      >
                        <dir.icon className="size-6" />
                        <div className="text-center">
                          <div>{dir.label}</div>
                          <div className="text-[8px] opacity-60 font-normal">{dir.detail}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 bg-emerald-500/5 dark:bg-emerald-500/10 border-t border-emerald-500/10 dark:border-emerald-500/20 grid sm:grid-cols-3 gap-8 text-foreground">
                <div className="space-y-2 text-center sm:text-left">
                  <div className="flex items-center gap-2 text-emerald-600/70 dark:text-emerald-400/70">
                    <MapPin className="size-4" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Ideal Count</span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-emerald-800 dark:text-emerald-300">{results.recommendedTrees} Units</div>
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <div className="flex items-center gap-2 text-emerald-600/70 dark:text-emerald-400/70">
                    <TrendingUp className="size-4" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Bill Savings</span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-emerald-800 dark:text-emerald-300">~{results.acSavingPercentage}% ROI</div>
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <div className="flex items-center gap-2 text-emerald-600/70 dark:text-emerald-400/70">
                    <Droplets className="size-4" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Annual Recharge</span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-emerald-800 dark:text-emerald-300">{results.waterRechargeValue.toLocaleString()}L</div>
                </div>
              </div>
            </div>

            <div className="surface-card p-10 bg-background border-border/60 shadow-sm space-y-8 rounded-2xl text-foreground">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold uppercase tracking-wider flex items-center gap-3">
                  <Lightbulb className="size-5 text-emerald-600" /> Species Recommendations
                </h4>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-500/20 flex gap-5 group hover:border-emerald-500/40 transition-colors">
                  <div className="size-12 rounded-xl bg-background dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center shrink-0 text-2xl shadow-sm group-hover:scale-110 transition-transform">🌿</div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-black text-emerald-900 dark:text-emerald-400 uppercase tracking-tight">Neem (Azadirachta indica)</p>
                    <p className="text-[11px] text-emerald-800/60 dark:text-emerald-400/60 leading-relaxed font-medium">Best for deep shade and localized humidity. Resilient to severe heatwaves.</p>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-500/20 flex gap-5 group hover:border-emerald-500/40 transition-colors">
                  <div className="size-12 rounded-xl bg-background dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center shrink-0 text-2xl shadow-sm group-hover:scale-110 transition-transform">🌼</div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-black text-emerald-900 dark:text-emerald-400 uppercase tracking-tight">Amaltas (Golden Shower)</p>
                    <p className="text-[11px] text-emerald-800/60 dark:text-emerald-400/60 leading-relaxed font-medium">Indigenous aesthetic with low water requirement. Ideal for urban street fronts.</p>
                  </div>
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

export default UrbanCooling;
