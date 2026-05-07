"use client";

import { useMemo, useState } from "react";
import {
   Battery, Zap, Timer,
   Settings2, Info, BarChart3,
   AlertTriangle, History,
   ShieldCheck, ArrowRight, Sun,
   Layers, Gauge, Copy, CheckCircle2
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HowToGuide } from "@/components/HowToGuide";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("solar-battery-backup-calculator")!;

const MODULE_PRESETS = [
   { name: "3.5 kWh", value: 3.5 },
   { name: "5.0 kWh", value: 5.0 },
   { name: "10.0 kWh", value: 10.0 },
];

const SolarBatteryCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
   const [inputType, setInputType] = useState<"kwh" | "ah">("kwh");
   const [capacityKWh, setCapacityKWh] = useState<number>(5);
   const [batteryAh, setBatteryAh] = useState<number>(100);
   const [batteryQty, setBatteryQty] = useState<number>(4);
   const [voltage, setVoltage] = useState<number>(12); // Per battery
   const [loadWatts, setLoadWatts] = useState<number>(1000);
   const [batteryType, setBatteryType] = useState<"lithium" | "tubular" | "lead-acid">("lithium");
   const [copied, setCopied] = useState(false);

   const results = useMemo(() => {
      const dod = batteryType === "lithium" ? 0.9 : 0.5;
      const efficiency = 0.9;

      let totalEnergyWh = 0;
      if (inputType === "kwh") {
         totalEnergyWh = capacityKWh * 1000;
      } else {
         totalEnergyWh = batteryAh * batteryQty * voltage;
      }

      const runtimeHours = loadWatts > 0 ? (totalEnergyWh * dod * efficiency) / loadWatts : 0;
      const runtimeMinutes = Math.round((runtimeHours % 1) * 60);

      return {
         runtimeHours: Math.floor(runtimeHours),
         runtimeMinutes,
         totalEnergyKWh: totalEnergyWh / 1000,
         usableEnergyKWh: (totalEnergyWh * dod * efficiency) / 1000,
         dodPercentage: dod * 100
      };
   }, [inputType, capacityKWh, batteryAh, batteryQty, voltage, loadWatts, batteryType]);

   const handleCopy = () => {
      const text = `Solar Battery Backup: ${results.runtimeHours}h ${results.runtimeMinutes}m runtime | Load: ${loadWatts}W | Total Capacity: ${results.totalEnergyKWh.toFixed(1)}kWh. Calculate your backup at ${window.location.href}`;
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
                  <div className="surface-card p-10 bg-background border-border/60 shadow-xl space-y-10 overflow-hidden rounded-2xl">
                     <Timer className="absolute -top-6 -right-6 size-32 text-foreground/[0.03] -rotate-12 transition-transform group-hover:rotate-0 duration-700" />

                     <div className="space-y-8 relative z-10">
                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Backup Runtime</p>
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
                           <div className="text-6xl font-mono font-bold tracking-tighter text-foreground leading-none">
                              {results.runtimeHours}<span className="text-xl ml-1 text-muted-foreground/30 uppercase font-black">h</span>
                              <span className="mx-2 text-2xl opacity-20">:</span>
                              {results.runtimeMinutes}<span className="text-xl ml-1 text-muted-foreground/30 uppercase font-black">m</span>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/40">
                           <div className="space-y-1">
                              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Rated Energy</p>
                              <p className="text-xl font-mono font-bold">{results.totalEnergyKWh.toFixed(1)}<span className="text-[9px] ml-1 opacity-40">kWh</span></p>
                           </div>
                           <div className="space-y-1 border-l border-border/40 pl-4">
                              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Usable</p>
                              <p className="text-xl font-mono font-bold text-health">{results.usableEnergyKWh.toFixed(1)}<span className="text-[9px] ml-1 opacity-40">kWh</span></p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="surface-card p-6 border-border/30 bg-signal/5 relative overflow-hidden group rounded-2xl">
                     <Info className="absolute -bottom-4 -right-4 size-20 text-signal/5 group-hover:rotate-12 transition-transform duration-700" />
                     <div className="flex gap-4 items-start relative z-10">
                        <div className="mt-1 text-signal">
                           <AlertTriangle className="size-5" />
                        </div>
                        <div className="space-y-1">
                           <h4 className="text-[10px] font-bold uppercase tracking-wider text-signal">Engineering Tip</h4>
                           <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                              Avoid discharging Lead-Acid batteries below 50% as it significantly reduces their lifespan. Lithium batteries are much more resilient.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Main Panel (Inputs) */}
               <div className="lg:col-span-8 space-y-6 order-2 lg:order-1">
                  <div className="surface-card p-8 bg-secondary/5 border-border/40 overflow-hidden shadow-sm rounded-2xl">
                     <div className="flex items-center gap-4 mb-8">
                        <div className="size-12 rounded-2xl bg-foreground/5 flex items-center justify-center">
                           <Battery className="size-6 text-foreground/60" />
                        </div>
                        <div className="space-y-1">
                           <h3 className="text-lg font-bold tracking-tight">Storage System</h3>
                           <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Battery Bank Configuration</p>
                        </div>
                     </div>

                     <div className="space-y-10">
                        <div className="flex bg-background border border-border/60 p-1 rounded-2xl h-12 max-w-md">
                           <button onClick={() => setInputType("kwh")} className={cn("flex-1 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all", inputType === 'kwh' ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary/40")}>kWh Modules</button>
                           <button onClick={() => setInputType("ah")} className={cn("flex-1 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all", inputType === 'ah' ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary/40")}>Ah Batteries</button>
                        </div>

                        {inputType === "kwh" ? (
                           <div className="space-y-6">
                              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Capacity (kWh)</Label>
                              <div className="grid grid-cols-3 gap-3">
                                 {MODULE_PRESETS.map(p => (
                                    <button key={p.name} onClick={() => setCapacityKWh(p.value)} className={cn("py-3 text-[10px] font-bold uppercase border rounded-xl transition-all", capacityKWh === p.value ? "bg-foreground text-background border-foreground" : "bg-background text-muted-foreground border-border/60 hover:bg-secondary/40")}>
                                       {p.name}
                                    </button>
                                 ))}
                              </div>
                              <Input type="number" value={capacityKWh} onChange={(e) => setCapacityKWh(Number(e.target.value) || 0)} className="h-16 bg-background border-border/60 font-mono text-3xl font-bold rounded-2xl shadow-sm" />
                           </div>
                        ) : (
                           <div className="space-y-6">
                              <div className="grid sm:grid-cols-2 gap-6">
                                 <div className="space-y-3">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Unit Capacity (Ah)</Label>
                                    <Input type="number" value={batteryAh} onChange={(e) => setBatteryAh(Number(e.target.value) || 0)} className="h-16 bg-background border-border/60 font-mono text-3xl font-bold rounded-2xl shadow-sm" />
                                 </div>
                                 <div className="space-y-3">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Quantity</Label>
                                    <Input type="number" value={batteryQty} onChange={(e) => setBatteryQty(Number(e.target.value) || 0)} className="h-16 bg-background border-border/60 font-mono text-3xl font-bold rounded-2xl shadow-sm" />
                                 </div>
                              </div>
                              <div className="space-y-3">
                                 <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Nominal Voltage (V)</Label>
                                 <Select value={String(voltage)} onValueChange={(v) => setVoltage(Number(v))}>
                                    <SelectTrigger className="h-16 bg-background border-border/60 font-mono text-2xl font-bold rounded-2xl shadow-sm px-6">
                                       <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                       <SelectItem value="12">12V System</SelectItem>
                                       <SelectItem value="24">24V System</SelectItem>
                                       <SelectItem value="48">48V System</SelectItem>
                                    </SelectContent>
                                 </Select>
                              </div>
                           </div>
                        )}

                        <div className="space-y-6 pt-6 border-t border-border/40">
                           <div className="flex justify-between items-center">
                              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Continuous Load (Watts)</Label>
                              <span className="text-xl font-mono font-bold text-foreground">{loadWatts}W</span>
                           </div>
                           <Input type="number" value={loadWatts} onChange={(e) => setLoadWatts(Number(e.target.value) || 0)} className="h-16 bg-background border-border/60 font-mono text-3xl font-bold rounded-2xl shadow-sm" />
                           <div className="flex flex-wrap gap-2">
                              {[500, 1000, 2000, 3000].map(w => (
                                 <button key={w} onClick={() => setLoadWatts(w)} className="px-4 py-2 rounded-xl bg-secondary/40 text-[10px] font-bold uppercase hover:bg-secondary transition-colors">{w}W</button>
                              ))}
                           </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-border/40">
                           <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Battery Chemistry (DoD Profile)</Label>
                           <Select value={batteryType} onValueChange={(v) => setBatteryType(v as any)}>
                              <SelectTrigger className="h-16 bg-background border-border/60 font-bold text-[11px] uppercase tracking-widest rounded-2xl shadow-sm px-6">
                                 <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="lithium">Lithium Iron Phosphate (90% DoD)</SelectItem>
                                 <SelectItem value="tubular">Tubular Lead Acid (50% DoD)</SelectItem>
                                 <SelectItem value="lead-acid">Standard Lead Acid (40% DoD)</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>
                     </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                     <div className="surface-card p-8 border-border/30 bg-secondary/5 space-y-4 rounded-2xl">
                        <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                           <Gauge className="size-4 text-signal" /> Load Impact
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                           At a constant load of {loadWatts}W, your battery bank is discharging at {((loadWatts / (results.totalEnergyKWh * 1000)) * 100).toFixed(1)}% of its total capacity per hour.
                        </p>
                     </div>
                     <div className="surface-card p-8 border-border/30 bg-secondary/5 space-y-4 rounded-2xl">
                        <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                           <ShieldCheck className="size-4 text-health" /> System Safety
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                           We've accounted for a 10% inverter overhead in our calculations to ensure you get a realistic estimate of your backup time.
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            <div id="how-to-use" className="pt-8 border-t border-border/40">
               <div className="mb-6">
                  <h3 className="text-lg font-bold tracking-tight">How to Use Solar Battery Backup Calculator</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold opacity-60">Step-by-Step Guide</p>
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
};

export default SolarBatteryCalculator;
