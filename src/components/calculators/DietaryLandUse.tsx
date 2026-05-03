"use client";

import { useMemo, useState } from "react";
import { 
  Leaf, Trees, Globe, Wind, 
  ArrowRight, Info, AlertTriangle, 
  Download, Share2, Copy, CheckCircle2,
  HelpCircle, Lightbulb, MapPin, Sprout
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("dietary-land-use-restoration");

const DietaryLandUse = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;

  const [beefMeals, setBeefMeals] = useState<number>(4); // Per week
  const [chickenMeals, setChickenMeals] = useState<number>(10);
  const [dairyIntensity, setDairyIntensity] = useState<"high" | "moderate" | "low">("moderate");
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    // 2026 Biodiversity Impact Logic
    // 1kg of Beef requires ~326 sq meters of land (Global avg)
    // 1kg of Chicken requires ~12 sq meters
    // Logic: Converting 1 beef meal to plant-based saves ~25 sq meters of land weekly.
    
    const beefLandWeekly = beefMeals * 25; // Estimate 1 meal = 250g beef = 60sqm land
    const chickenLandWeekly = chickenMeals * 4;
    let dairyFactor = 1.0;
    if (dairyIntensity === "high") dairyFactor = 1.5;
    if (dairyIntensity === "low") dairyFactor = 0.5;

    const totalLandUsedMonthly = (beefLandWeekly + chickenLandWeekly) * 4.34 * dairyFactor;
    const totalLandUsedAnnually = totalLandUsedMonthly * 12;
    
    // Restoration potential (if shifted to plant-rich diet)
    const restorationPotential = totalLandUsedAnnually * 0.8; // 80% can be restored to forest/wildland
    const biodiversitySupport = Math.floor(restorationPotential / 5); // 1 species support per 5sqm restored

    return {
      totalLandUsedAnnually,
      restorationPotential,
      biodiversitySupport,
      forestEquivalent: restorationPotential / 500 // 500sqm = small micro-forest
    };
  }, [beefMeals, chickenMeals, dairyIntensity]);

  const handleCopy = () => {
    const text = `My Dietary Footprint: My current diet requires ${results.totalLandUsedAnnually.toFixed(0)}m² of land annually. Shifting could restore ${results.restorationPotential.toFixed(0)}m² of forest. Restore the planet at ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        <div className="lg:col-span-8 space-y-6">
          <div className="surface-card bg-lime-500/5 dark:bg-lime-500/10 border-lime-500/20 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-lime-500/10 dark:border-lime-500/20 bg-background flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-lime-500/10 dark:bg-lime-500/20 flex items-center justify-center">
                  <Sprout className="size-6 text-lime-600 dark:text-lime-400" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-lg font-bold tracking-tight text-foreground uppercase">Biodiversity Auditor</h3>
                  <p className="text-[10px] text-lime-600/60 dark:text-lime-400/60 uppercase tracking-widest font-bold">2026 Land Use Metrics</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 space-y-10">
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Beef Meals / Week</Label>
                  <div className="relative group">
                    <Input
                      type="number"
                      value={beefMeals || ""}
                      onChange={(e) => setBeefMeals(Number(e.target.value) || 0)}
                      className="h-20 bg-background border-border/60 font-mono text-4xl font-bold rounded-3xl pl-12 focus:ring-4 ring-lime-500/5 transition-all"
                      placeholder="4"
                    />
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 text-muted-foreground/20 font-mono text-xl font-bold">🥩</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Chicken/Poultry Meals / Week</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={chickenMeals || ""}
                      onChange={(e) => setChickenMeals(Number(e.target.value) || 0)}
                      className="h-20 bg-background border-border/60 font-mono text-3xl font-bold rounded-3xl pl-12 focus:ring-4 ring-lime-500/5 transition-all"
                      placeholder="10"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground/30 font-mono text-sm font-bold">🍗</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/40">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Dairy & Eggs Consumption</Label>
                <div className="flex gap-2">
                  {[
                    { id: "low", label: "Plant-Focused", sub: "Minimal Dairy", icon: Leaf },
                    { id: "moderate", label: "Balanced", sub: "Standard Mix", icon: Sprout },
                    { id: "high", label: "High Protein", sub: "Heavy Dairy/Eggs", icon: Trees }
                  ].map((lvl) => (
                    <button 
                      key={lvl.id}
                      onClick={() => setDairyIntensity(lvl.id as any)}
                      className={cn(
                        "flex-1 p-4 rounded-2xl text-[10px] font-bold uppercase transition-all border flex flex-col items-center gap-2 text-center",
                        dairyIntensity === lvl.id ? "bg-lime-600 text-white border-lime-700 shadow-lg shadow-lime-500/20" : "bg-background text-muted-foreground border-border hover:bg-secondary"
                      )}
                    >
                      <lvl.icon className="size-4" />
                      <span>{lvl.label}</span>
                      <span className="text-[8px] opacity-60 lowercase font-normal leading-none italic">{lvl.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 bg-lime-500/5 dark:bg-lime-500/10 border-t border-lime-500/10 dark:border-lime-500/20 grid sm:grid-cols-2 gap-6">
               <div className="flex gap-4 items-center">
                  <div className="size-10 rounded-xl bg-background dark:bg-secondary border border-lime-100 dark:border-lime-500/20 flex items-center justify-center">
                    <MapPin className="size-5 text-lime-500 dark:text-lime-400" />
                  </div>
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-lime-600/70 dark:text-lime-400/70">Current Land Footprint</div>
                    <div className="text-xl font-mono font-bold text-lime-800 dark:text-lime-300">{Math.round(results.totalLandUsedAnnually).toLocaleString()} m²</div>
                  </div>
               </div>
               <div className="flex gap-4 items-center">
                  <div className="size-10 rounded-xl bg-background dark:bg-secondary border border-lime-100 dark:border-lime-500/20 flex items-center justify-center">
                    <Sprout className="size-5 text-lime-500 dark:text-lime-400" />
                  </div>
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-lime-600/70 dark:text-lime-400/70">Restoration Potential</div>
                    <div className="text-xl font-mono font-bold text-lime-800 dark:text-lime-300">{Math.round(results.restorationPotential).toLocaleString()} m²</div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="surface-card p-10 bg-background border-border/60 shadow-xl space-y-10 sticky top-28 overflow-hidden">
             <div className="absolute top-0 right-0 size-32 bg-lime-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

             <div className="space-y-6 relative border-b border-border/40 pb-10">
                 <div className="flex items-center justify-between">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Biodiversity Support</div>
                    <button 
                       onClick={handleCopy}
                       className={cn(
                          "p-2 rounded-lg transition-all border shadow-sm",
                          copied ? "bg-lime-600 text-white border-lime-700" : "bg-background text-foreground border-border hover:bg-secondary"
                       )}
                    >
                       {copied ? <CheckCircle2 className="size-3.5" /> : <Copy className="size-3.5" />}
                    </button>
                 </div>
                <div className="text-6xl font-mono font-bold tracking-tighter text-lime-700 dark:text-lime-400">
                   {results.biodiversitySupport.toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-lime-100 dark:bg-lime-500/20 text-lime-700 dark:text-lime-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Leaf className="size-3" /> Species Supported
                  </div>
                </div>
             </div>

              <div className="space-y-8 relative">
                <div className="p-6 rounded-3xl bg-lime-50/50 dark:bg-lime-500/5 border border-lime-100 dark:border-lime-500/20 space-y-4">
                   <div className="flex items-center gap-2 text-lime-700/60 dark:text-lime-400/60">
                      <Trees className="size-4" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Forest Restoration</span>
                   </div>
                   <div className="space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px] font-bold uppercase text-lime-800 dark:text-lime-300">
                            <span>Forest Areas Restorable</span>
                            <span>{results.forestEquivalent.toFixed(1)} Forests</span>
                        </div>
                        <div className="h-1.5 w-full bg-lime-100 dark:bg-lime-900/30 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-lime-500 transition-all duration-1000 ease-out" 
                              style={{ width: `${Math.min(100, results.forestEquivalent * 10)}%` }} 
                            />
                        </div>
                      </div>
                   </div>
                </div>

                <div className="p-6 bg-slate-900 text-white rounded-2xl flex gap-4">
                   <Globe className="size-5 text-lime-400 shrink-0" />
                   <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest">2026 Fact</p>
                      <p className="text-[9px] text-slate-300 leading-relaxed font-medium">
                        Shifting just 2 beef meals per week to plant-based in 2026 releases more land for wildlife than the average suburban garden size.
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

export default DietaryLandUse;
