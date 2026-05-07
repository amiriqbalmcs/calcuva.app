"use client";

import { useMemo, useState } from "react";
import { 
  Globe, Trees, Wind, Droplets, 
  ArrowRight, Info, AlertTriangle, 
  Download, Share2, Copy, CheckCircle2,
  HelpCircle, Lightbulb, Waves, Anchor, Trash2
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HowToGuide } from "@/components/HowToGuide";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("plastic-to-oxygen-impact-map")!;

const PlasticImpactMap = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [bottlesSaved, setBottlesSaved] = useState<number>(100);
  const [bagsSaved, setBagsSaved] = useState<number>(200);
  const [utensilsSaved, setUtensilsSaved] = useState<number>(50);
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    // 2026 Sustainability Equivalency Logic
    // 1 Plastic Bottle saved = ~0.08 kg of CO2 prevented
    // 1 Tree produces ~118kg of Oxygen/yr and sequesters ~22kg of CO2/yr.
    
    const totalPlasticWeight = (bottlesSaved * 0.02) + (bagsSaved * 0.005) + (utensilsSaved * 0.01); // kg
    const co2Prevented = totalPlasticWeight * 3.5; // Roughly 3.5kg CO2 per 1kg plastic production
    
    // Impact translation
    const oxygenHoursProduced = (co2Prevented / 22) * (365 * 24); // Equivalent "Tree Hours" of work
    const oceanAreaProtected = totalPlasticWeight * 12.5; // Estimated sq meters of ocean surface kept clear of microplastics
    const treeEquivalent = co2Prevented / 22;

    return {
      totalPlasticWeight,
      co2Prevented,
      oxygenHoursProduced,
      oceanAreaProtected,
      treeEquivalent,
      marineLifeSaved: Math.floor(totalPlasticWeight * 2.5) // Symbolic "Creatures Impacted"
    };
  }, [bottlesSaved, bagsSaved, utensilsSaved]);

  const handleCopy = () => {
    const text = `My Plastic-to-Oxygen Impact: By saving ${bottlesSaved} bottles, I've protected ${results.oceanAreaProtected.toFixed(1)} sq meters of ocean. Map your impact at ${window.location.href}`;
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
               <div className="absolute top-0 right-0 size-32 bg-cyan-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

               <div className="space-y-6 relative border-b border-border/40 pb-10">
                   <div className="flex items-center justify-between">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Total Impact Score</div>
                      <button 
                         onClick={handleCopy}
                         className={cn(
                            "p-2 rounded-lg transition-all border shadow-sm",
                            copied ? "bg-cyan-600 text-white border-cyan-700" : "bg-background text-foreground border-border hover:bg-secondary"
                         )}
                      >
                         {copied ? <CheckCircle2 className="size-3.5" /> : <Copy className="size-3.5" />}
                      </button>
                   </div>
                  <div className="text-6xl font-mono font-bold tracking-tighter text-cyan-700 dark:text-cyan-400 text-foreground">
                     {Math.round(results.oxygenHoursProduced).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <Wind className="size-3" /> Oxygen Hours
                    </div>
                  </div>
               </div>

               <div className="space-y-6 relative">
                  <div className="flex items-center gap-4 p-5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-500/20 shadow-sm">
                     <Anchor className="size-6 text-cyan-600 dark:text-cyan-400 shrink-0" />
                     <div className="space-y-0.5">
                        <p className="text-[10px] font-black text-cyan-900 dark:text-cyan-300 uppercase">Marine Conservation</p>
                        <p className="text-[9px] text-cyan-800/60 dark:text-cyan-400/60 leading-relaxed font-medium">You have prevented approximately {results.marineLifeSaved} marine creatures from ingesting microplastics.</p>
                     </div>
                  </div>

                  <div className="p-6 bg-foreground text-background dark:bg-cyan-950 dark:text-cyan-400 rounded-3xl space-y-3 shadow-xl">
                     <div className="flex items-center gap-2 text-cyan-300">
                        <Globe className="size-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">The 2026 Vision</span>
                     </div>
                     <p className="text-[10px] leading-relaxed font-medium opacity-80">
                       By diversion alone, small daily changes can equate to the oxygen production of a 20-year-old forest within just 12 months of consistent habit.
                     </p>
                  </div>
               </div>
            </div>
          </div>

          {/* Left Column: Inputs Panel */}
          <div className="lg:col-span-8 space-y-6 order-2 lg:order-1">
            <div className="surface-card bg-cyan-500/5 dark:bg-cyan-500/10 border-cyan-500/20 overflow-hidden shadow-sm rounded-3xl">
              <div className="p-8 border-b border-cyan-500/10 dark:border-cyan-500/20 bg-background flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/20 flex items-center justify-center">
                    <Trash2 className="size-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-lg font-bold tracking-tight text-foreground uppercase">Zero-Waste Tracker</h3>
                    <p className="text-[10px] text-cyan-600/60 dark:text-cyan-400/60 uppercase tracking-widest font-bold">2026 Plastic Diversion Metrics</p>
                  </div>
                </div>
              </div>
              
              <div className="p-8 space-y-8">
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Plastic Bottles</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={bottlesSaved || ""}
                        onChange={(e) => setBottlesSaved(Number(e.target.value) || 0)}
                        className="h-16 bg-background border-border/60 font-mono text-2xl font-bold rounded-2xl pl-10 focus:ring-4 ring-cyan-500/5 transition-all text-foreground"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/30">🥤</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Plastic Bags</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={bagsSaved || ""}
                        onChange={(e) => setBagsSaved(Number(e.target.value) || 0)}
                        className="h-16 bg-background border-border/60 font-mono text-2xl font-bold rounded-2xl pl-10 focus:ring-4 ring-cyan-500/5 transition-all text-foreground"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/30">🛍️</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Utensils/Straws</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={utensilsSaved || ""}
                        onChange={(e) => setUtensilsSaved(Number(e.target.value) || 0)}
                        className="h-16 bg-background border-border/60 font-mono text-2xl font-bold rounded-2xl pl-10 focus:ring-4 ring-cyan-500/5 transition-all text-foreground"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/30">🍴</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-cyan-500/5 dark:bg-cyan-950/20 border-t border-cyan-500/10 dark:border-cyan-500/20 grid sm:grid-cols-2 gap-8">
                 <div className="p-6 bg-background dark:bg-cyan-900/20 border border-cyan-100 dark:border-cyan-500/20 rounded-3xl space-y-2 shadow-sm">
                    <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
                      <Trees className="size-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Planting Power</span>
                    </div>
                    <div className="text-3xl font-mono font-bold text-foreground">{results.treeEquivalent.toFixed(2)}</div>
                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Equivalent Trees Planted</p>
                 </div>
                 <div className="p-6 bg-background dark:bg-cyan-900/20 border border-cyan-100 dark:border-cyan-500/20 rounded-3xl space-y-2 shadow-sm">
                    <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
                      <Waves className="size-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Ocean Impact</span>
                    </div>
                    <div className="text-3xl font-mono font-bold text-foreground">{results.oceanAreaProtected.toFixed(1)}m²</div>
                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Marine Surface Protected</p>
                 </div>
              </div>
            </div>

            <div className="surface-card p-8 bg-background border-border/60 shadow-sm space-y-6 rounded-3xl">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Lightbulb className="size-4 text-cyan-600" /> Sustainability Insights
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-500/20 space-y-2">
                  <p className="text-[11px] font-black text-cyan-900 dark:text-cyan-300 uppercase">Plastic Lifecycle</p>
                  <p className="text-[10px] text-cyan-800/60 dark:text-cyan-400/60 leading-relaxed font-medium">Over 90% of a plastic bottle's carbon footprint comes from the energy-intensive production process.</p>
                </div>
                <div className="p-5 rounded-3xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-500/20 space-y-2">
                  <p className="text-[11px] font-black text-cyan-900 dark:text-cyan-300 uppercase">Oxygen Correlation</p>
                  <p className="text-[10px] text-cyan-800/60 dark:text-cyan-400/60 leading-relaxed font-medium">Preventing CO2 emissions is functionally equivalent to supporting the metabolic work of mature trees.</p>
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

export default PlasticImpactMap;
