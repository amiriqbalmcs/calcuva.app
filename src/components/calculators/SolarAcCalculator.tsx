"use client";

import { useState, useMemo } from "react";
import { 
  Sun, Zap, Wind, Snowflake, Info, ArrowRightLeft, 
  ShieldCheck, Gauge, Layers, TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ResultStat } from "../ResultStat";
import { CalculatorPage } from "../CalculatorPage";
import { HowToGuide } from "../HowToGuide";
import { calculatorBySlug } from "@/lib/calculators";

type Mode = "ac-to-solar" | "solar-to-ac";
type Tonnage = "1.0" | "1.5" | "2.0";
type AcType = "inverter" | "fixed";

const calc = calculatorBySlug("solar-ac-requirement-calculator")!;

export default function SolarAcCalculator({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) {
  const [mode, setMode] = useState<Mode>("ac-to-solar");
  
  // AC to Solar State
  const [tonnage, setTonnage] = useState<Tonnage>("1.5");
  const [acType, setAcType] = useState<AcType>("inverter");
  const [hours, setHours] = useState(8);
  const [acCount, setAcCount] = useState(1);

  // Solar to AC State
  const [solarKw, setSolarKw] = useState(5);

  const panelWatts = 580; // Standard 2026 Panel
  const peakSunHours = 4.5;
  const safetyFactor = 1.2;

  const acWatts = {
    "1.0": 1200,
    "1.5": 1800,
    "2.0": 2400
  };

  const results = useMemo(() => {
    if (mode === "ac-to-solar") {
      const baseWatts = acWatts[tonnage] * acCount;
      const runningFactor = acType === "inverter" ? 0.7 : 1.0;
      const peakLoad = baseWatts * safetyFactor;
      
      const requiredKw = (peakLoad / 1000);
      const panelsNeeded = Math.ceil(peakLoad / panelWatts);
      const dailyUnits = (baseWatts * runningFactor * hours) / 1000;

      return {
        requiredKw: requiredKw.toFixed(1),
        panelsNeeded,
        dailyUnits: dailyUnits.toFixed(1),
        monthlyUnits: (dailyUnits * 30).toFixed(0)
      };
    } else {
      // How many ACs can run on X kW
      const availableWatts = solarKw * 1000;
      const inverter15Ton = acWatts["1.5"] * 0.7 * safetyFactor;
      const count = (availableWatts / inverter15Ton);
      
      return {
        acCount: count < 1 ? "0" : Math.floor(count).toString(),
        totalGeneration: (solarKw * peakSunHours).toFixed(1),
        reliability: count > 1.5 ? "High" : "Moderate"
      };
    }
  }, [mode, tonnage, acType, hours, acCount, solarKw]);

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="w-full max-w-7xl mx-auto space-y-12 sm:px-6 lg:px-8">
        
        {/* Mode Switcher - Premium Toggle */}
        <div className="flex p-1.5 bg-secondary/30 backdrop-blur-xl border border-border/40 rounded-2xl w-fit mx-auto shadow-sm">
          <button
            onClick={() => setMode("ac-to-solar")}
            className={cn(
              "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
              mode === "ac-to-solar" 
                ? "bg-foreground text-background shadow-lg scale-105 z-10" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Sun className="size-3.5" /> Solar for my AC
          </button>
          <button
            onClick={() => setMode("solar-to-ac")}
            className={cn(
              "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
              mode === "solar-to-ac" 
                ? "bg-foreground text-background shadow-lg scale-105 z-10" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ArrowRightLeft className="size-3.5" /> ACs on my Solar
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Inputs (col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="surface-card p-8 md:p-10 space-y-10 bg-secondary/5 border-border/40 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
                <Zap className="size-48 rotate-12" />
              </div>

              <div className="relative space-y-10">
                {mode === "ac-to-solar" ? (
                  <div key="ac-to-solar" className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                          <Gauge className="size-3.5 text-signal" /> AC Tonnage (Size)
                        </label>
                        <div className="flex gap-2">
                          {(["1.0", "1.5", "2.0"] as Tonnage[]).map((t) => (
                            <button
                              key={t}
                              onClick={() => setTonnage(t)}
                              className={cn(
                                "flex-1 py-4 rounded-2xl border-2 font-bold transition-all text-sm",
                                tonnage === t 
                                  ? "bg-foreground text-background border-foreground shadow-lg" 
                                  : "bg-background border-border/40 hover:border-foreground/20"
                              )}
                            >
                              {t} Ton
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                          <Zap className="size-3.5 text-signal" /> Technology Type
                        </label>
                        <div className="flex gap-2">
                          {(["inverter", "fixed"] as AcType[]).map((type) => (
                            <button
                              key={type}
                              onClick={() => setAcType(type)}
                              className={cn(
                                "flex-1 py-4 rounded-2xl border-2 font-bold transition-all capitalize text-sm",
                                acType === type 
                                  ? "bg-foreground text-background border-foreground shadow-lg" 
                                  : "bg-background border-border/40 hover:border-foreground/20"
                              )}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                          <Layers className="size-3.5 text-signal" /> Number of ACs
                        </label>
                        <div className="flex items-center gap-6">
                          <input 
                            type="range" min="1" max="10" step="1"
                            value={acCount}
                            onChange={(e) => setAcCount(parseInt(e.target.value))}
                            className="flex-1 accent-foreground h-1.5 bg-secondary rounded-full appearance-none cursor-pointer"
                          />
                          <span className="font-mono font-bold text-3xl text-foreground min-w-[2ch]">{acCount}</span>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                          <Sun className="size-3.5 text-signal" /> Solar Hours/Day
                        </label>
                        <div className="flex items-center gap-6">
                          <input 
                            type="range" min="1" max="12" step="1"
                            value={hours}
                            onChange={(e) => setHours(parseInt(e.target.value))}
                            className="flex-1 accent-foreground h-1.5 bg-secondary rounded-full appearance-none cursor-pointer"
                          />
                          <span className="font-mono font-bold text-3xl text-foreground min-w-[3ch]">{hours}h</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key="solar-to-ac" className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="space-y-6">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                        <Sun className="size-4 text-signal" /> Your Solar System Size (kW)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={solarKw}
                          onChange={(e) => setSolarKw(parseFloat(e.target.value) || 0)}
                          className="w-full bg-background border-2 border-border/40 focus:border-foreground rounded-3xl p-8 text-4xl font-bold font-mono outline-none transition-all pr-24 shadow-sm"
                        />
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 font-mono font-bold text-muted-foreground/30 text-2xl">KW</div>
                      </div>
                      <p className="text-[11px] text-muted-foreground italic font-medium px-2">
                        Common sizes: 5kW for small homes, 10kW for medium-sized homes.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 bg-signal/5 border border-signal/10 rounded-2xl flex items-start gap-4">
                <Info className="size-5 text-signal mt-0.5 shrink-0" />
                <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                  We assume 4.5 peak sun hours and factor in 20% system loss for wiring and dust, typical of high-quality solar setups.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Results Dashboard (col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="surface-card p-8 md:p-10 space-y-10 bg-background border-border/60 shadow-2xl relative overflow-hidden group rounded-3xl">
              <Sun className="absolute -top-6 -right-6 size-32 text-foreground/[0.03] -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
              
              <div className="space-y-10 relative z-10">
                <div className="text-center space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">System Verdict</p>
                  
                  {mode === "ac-to-solar" ? (
                    <div className="space-y-8">
                      <div className="space-y-1">
                        <div className="text-6xl font-mono font-bold tracking-tighter text-foreground leading-none">
                          {results.requiredKw} <span className="text-xl opacity-30 uppercase tracking-widest font-sans font-black">kW</span>
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Required Capacity</p>
                      </div>

                      <div className="pt-8 border-t border-white/40 space-y-4 text-left">
                        <div className="flex justify-between items-center px-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Solar Panels</span>
                          <span className="font-mono font-bold text-foreground bg-secondary/50 px-3 py-1 rounded-lg">{results.panelsNeeded} Panels</span>
                        </div>
                        <div className="flex justify-between items-center px-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Roof Space</span>
                          <span className="font-mono font-bold text-foreground bg-secondary/50 px-3 py-1 rounded-lg">{(results.panelsNeeded * 2.3).toFixed(1)} m²</span>
                        </div>
                        <div className="flex justify-between items-center px-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Monthly Generation</span>
                          <span className="font-mono font-bold text-signal">{results.monthlyUnits} kWh</span>
                        </div>
                      </div>

                      {/* Dynamic Smart Insight */}
                      <div className="mt-8 p-4 bg-foreground/5 rounded-2xl border border-foreground/10 space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/60">
                          <Info className="size-3" /> System Insight
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                          {acType === "fixed" 
                            ? "Non-inverter ACs require a 3kW+ surge buffer. Ensure your inverter is rated for at least 5kW to avoid tripping."
                            : results.requiredKw > 6
                              ? "A system this size is ideal for 3-phase meters and can comfortably run your entire home including ACs."
                              : "This inverter-ready setup is highly stable and will maximize your daily solar savings."}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <div className="space-y-1">
                        <div className="text-6xl font-mono font-bold tracking-tighter text-foreground leading-none">
                          {results.acCount} <span className="text-xl opacity-30 uppercase tracking-widest font-sans font-black">ACs</span>
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Running Capacity</p>
                      </div>

                      <div className="pt-8 border-t border-border/40 space-y-4 text-left">
                        <div className="flex justify-between items-center px-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Reliability</span>
                          <span className="font-mono font-bold text-signal">{results.reliability}</span>
                        </div>
                        <div className="flex justify-between items-center px-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Daily Gen</span>
                          <span className="font-mono font-bold text-foreground bg-secondary/50 px-3 py-1 rounded-lg">{results.totalGeneration} kWh</span>
                        </div>
                      </div>

                      {/* Dynamic Smart Insight */}
                      <div className="mt-8 p-4 bg-foreground/5 rounded-2xl border border-foreground/10 space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/60">
                          <Info className="size-3" /> System Insight
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                          {solarKw < 3 
                            ? "Small systems may struggle with 1.5 ton startup loads. Keep other heavy appliances off while the AC starts."
                            : solarKw >= 10 
                              ? "Excellent capacity. You can run multiple ACs and still have enough for EV charging or batteries."
                              : "Perfect mid-range system. Use 'Net Metering' to offset your nighttime AC costs with day credits."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="surface-card p-6 bg-emerald-500/5 border-emerald-500/10 rounded-2xl">
              <div className="flex items-center gap-3 text-emerald-600 mb-3">
                <TrendingUp className="size-4" />
                <span className="text-[10px] font-black uppercase tracking-widest font-mono">Efficiency Tip</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                Setting your AC at <span className="text-emerald-600 font-bold">26 Celsius</span> can reduce your solar system requirement by up to <span className="text-emerald-600 font-bold">25%</span> compared to 18 Celsius.
              </p>
            </div>
          </div>
        </div>

        {/* How to Use Section */}
        <div id="how-to-use" className="pt-12 border-t border-border/40">
          <div className="mb-8">
            <h3 className="text-xl font-bold tracking-tight">How to Use Solar for AC Calculator</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold opacity-60">Step-by-Step System Guide</p>
          </div>
          <HowToGuide
            steps={calc.howTo!.steps}
            proTip={calc.howTo!.proTip}
            variant="horizontal"
          />
        </div>
      </div>
    </CalculatorPage>
  );
}
