"use client";

import { useMemo, useState } from "react";
import {
  Waves, Droplets, Wind, Globe,
  ArrowRight, Info, AlertTriangle,
  Download, Share2, Copy, CheckCircle2,
  HelpCircle, Lightbulb, Shirt, Trash2
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { HowToGuide } from "@/components/HowToGuide";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("microplastic-ocean-protection")!;

const MicroplasticProtection = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [loadsPerWeek, setLoadsPerWeek] = useState<number>(5);
  const [washTemp, setWashTemp] = useState<number>(40); // Celsius
  const [fabricType, setFabricType] = useState<"synthetic" | "natural" | "mixed">("mixed");
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    // 2026 Ocean Protection Metrics
    // 1 Load of synthetic clothes can release ~700,000 microplastic fibers.
    // Reducing temp from 40C to 30C reduces shedding by ~30%.

    let baseShedding = 700000;
    if (fabricType === "natural") baseShedding = 50000;
    if (fabricType === "mixed") baseShedding = 350000;

    const tempFactor = washTemp > 30 ? 1 + (washTemp - 30) * 0.03 : 1;
    const weeklyShedding = loadsPerWeek * baseShedding * tempFactor;
    const annualShedding = weeklyShedding * 52;

    // Savings calculation (compared to high temp/synthetic baseline)
    const baselineAnnual = 5 * 700000 * 1.3 * 52;
    const particlesSaved = Math.max(0, baselineAnnual - annualShedding);

    // Impact translation
    const planktonImpacted = Math.floor(annualShedding / 100); // 1 plankton per 100 fibers
    const oceanLitersProtected = particlesSaved * 10; // Symbolic volume

    return {
      annualShedding,
      particlesSaved,
      planktonImpacted,
      oceanLitersProtected,
      fiberWeightSaved: (particlesSaved * 0.00000001).toFixed(4) // kg estimate
    };
  }, [loadsPerWeek, washTemp, fabricType]);

  const handleCopy = () => {
    const text = `Ocean Protection 2026: By optimizing my laundry, I've prevented ${results.particlesSaved.toLocaleString()} microplastic fibers from entering the ocean annually. Check your impact at ${window.location.href}`;
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
              <div className="absolute top-0 right-0 size-32 bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

              <div className="space-y-6 relative border-b border-border/40 pb-10">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Fibers Prevented</div>
                  <button
                    onClick={handleCopy}
                    className={cn(
                      "p-2 rounded-lg transition-all border shadow-sm",
                      copied ? "bg-indigo-600 text-white border-indigo-700" : "bg-background text-foreground border-border hover:bg-secondary"
                    )}
                  >
                    {copied ? <CheckCircle2 className="size-3.5" /> : <Copy className="size-3.5" />}
                  </button>
                </div>
                <div className="text-6xl font-mono font-bold tracking-tighter text-indigo-700 dark:text-indigo-400">
                  {results.particlesSaved > 1000000 ? (results.particlesSaved / 1000000).toFixed(1) + "M" : results.particlesSaved.toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Waves className="size-3" /> Ocean Safe
                  </div>
                </div>
              </div>

              <div className="space-y-8 relative">
                <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-500/20 space-y-4">
                  <div className="flex items-center gap-2 text-indigo-700/60 dark:text-indigo-400/60">
                    <Wind className="size-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Eco Protection</span>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[9px] font-bold uppercase text-indigo-800 dark:text-indigo-400">
                        <span>Ocean Volume Protected</span>
                        <span>{results.oceanLitersProtected.toLocaleString()}L</span>
                      </div>
                      <div className="h-1.5 w-full bg-indigo-100 dark:bg-indigo-900/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 transition-all duration-1000 ease-out"
                          style={{ width: `${Math.min(100, (results.particlesSaved / 10000000) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-900 text-white rounded-2xl flex gap-4 shadow-2xl">
                  <Lightbulb className="size-5 text-indigo-300 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest">Laundry Tip</p>
                    <p className="text-[9px] text-slate-300 leading-relaxed font-medium">
                      Using a cold wash (20-30°C) and a guppy-bag in 2026 can reduce your total microplastic output by up to 80% per load.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Left Column: Inputs Panel */}
          <div className="lg:col-span-8 space-y-6 order-2 lg:order-1">
            <div className="surface-card bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-500/20 overflow-hidden shadow-sm rounded-2xl">
              <div className="p-8 border-b border-indigo-500/10 dark:border-indigo-500/20 bg-background flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center">
                    <Shirt className="size-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-lg font-bold tracking-tight text-foreground uppercase">Laundry Protection</h3>
                    <p className="text-[10px] text-indigo-600/60 dark:text-indigo-400/60 uppercase tracking-widest font-bold">2026 Ocean Health Metrics</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-10">
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Laundry Loads / Week</Label>
                    <div className="relative group">
                      <Input
                        type="number"
                        value={loadsPerWeek || ""}
                        onChange={(e) => setLoadsPerWeek(Number(e.target.value) || 0)}
                        className="h-20 bg-background border-border/60 font-mono text-4xl font-bold rounded-2xl pl-12 focus:ring-4 ring-indigo-500/5 transition-all"
                        placeholder="5"
                      />
                      <div className="absolute right-8 top-1/2 -translate-y-1/2 text-muted-foreground/20 font-mono text-xl font-bold">🔄</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Fabric Composition</Label>
                    <div className="flex flex-col gap-2">
                      {[
                        { id: "synthetic", label: "Synthetic", sub: "Polyester/Nylon", icon: Trash2 },
                        { id: "mixed", label: "Mixed Fibers", sub: "Standard Wash", icon: Shirt },
                        { id: "natural", label: "100% Natural", sub: "Cotton/Linen", icon: Wind }
                      ].map((fab) => (
                        <button
                          key={fab.id}
                          onClick={() => setFabricType(fab.id as any)}
                          className={cn(
                            "w-full px-5 py-3 rounded-2xl text-left border transition-all flex items-center justify-between",
                            fabricType === fab.id ? "bg-indigo-600 text-white border-indigo-700 shadow-lg shadow-indigo-500/20" : "bg-background text-muted-foreground border-border hover:bg-secondary"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <fab.icon className="size-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{fab.label}</span>
                          </div>
                          <span className="text-[9px] opacity-60 font-medium italic">{fab.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border/40">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center justify-between">
                    Washing Temperature (Celsius)
                    <span className="text-indigo-600 font-mono text-xs">{washTemp}°C</span>
                  </Label>
                  <div className="pt-2">
                    <input
                      type="range"
                      min="20"
                      max="90"
                      step="10"
                      value={washTemp}
                      onChange={(e) => setWashTemp(Number(e.target.value))}
                      className="w-full h-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-[8px] font-black text-muted-foreground mt-2 uppercase tracking-widest">
                      <span>Cold (20°)</span>
                      <span>Eco (30-40°)</span>
                      <span>Hot (60°+)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-indigo-500/5 dark:bg-indigo-500/10 border-t border-indigo-500/10 dark:border-indigo-500/20 grid sm:grid-cols-2 gap-6">
                <div className="flex gap-4 items-center">
                  <div className="size-10 rounded-xl bg-background dark:bg-secondary border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center">
                    <Waves className="size-5 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-indigo-600/70 dark:text-indigo-400/70">Annual Fiber Shedding</div>
                    <div className="text-xl font-mono font-bold text-indigo-800 dark:text-indigo-300">{results.annualShedding.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="size-10 rounded-xl bg-background dark:bg-secondary border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center">
                    <Droplets className="size-5 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-indigo-600/70 dark:text-indigo-400/70">Plankton Life Impacted</div>
                    <div className="text-xl font-mono font-bold text-indigo-800 dark:text-indigo-300">{results.planktonImpacted.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="surface-card p-8 bg-background border-border/60 shadow-sm space-y-6 rounded-2xl">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Lightbulb className="size-4 text-indigo-600" /> Conservation Insights
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-500/20 space-y-2">
                  <p className="text-[11px] font-black text-indigo-900 dark:text-indigo-400 uppercase">Shedding Baseline</p>
                  <p className="text-[10px] text-orange-800/60 dark:text-orange-400/60 leading-relaxed font-medium">A single synthetic load can release more microplastics than 50 loads of natural fiber clothing.</p>
                </div>
                <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-500/20 space-y-2">
                  <p className="text-[11px] font-black text-indigo-900 dark:text-indigo-400 uppercase">Marine Life</p>
                  <p className="text-[10px] text-orange-800/60 dark:text-orange-400/60 leading-relaxed font-medium">Microfibers are often mistaken for food by plankton, disrupting the entire marine food web.</p>
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

export default MicroplasticProtection;
