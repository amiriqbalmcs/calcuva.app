"use client";

import { useMemo, useState } from "react";
import {
   Sun, Zap, Trash2, Plus,
   Settings2, Battery, Info,
   BarChart3, Calculator,
   Smartphone, Tv, Wind,
   Lightbulb, Refrigerator, Droplets,
   ArrowRight, ShieldCheck, Timer,
   Gauge, Coffee, Laptop, Monitor,
   Gamepad, Wifi, Video, Fan, Copy, CheckCircle2, Layers, TrendingUp
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { HowToGuide } from "@/components/HowToGuide";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("solar-system-requirement-calculator")!;

interface Appliance {
   id: string;
   name: string;
   wattage: number;
   quantity: number;
   hours: number;
}

const DEFAULT_APPLIANCES: Appliance[] = [
   { id: "1", name: "Ceiling Fan", wattage: 75, quantity: 4, hours: 12 },
   { id: "2", name: "LED Bulbs", wattage: 12, quantity: 10, hours: 6 },
   { id: "3", name: "LED TV", wattage: 120, quantity: 1, hours: 5 },
   { id: "4", name: "Refrigerator", wattage: 350, quantity: 1, hours: 24 },
   { id: "5", name: "AC (1.5 Ton Inverter)", wattage: 1800, quantity: 1, hours: 8 },
];

const PRESETS = [
   { name: "Fan", wattage: 75, icon: Fan, hours: 12 },
   { name: "LED Bulb", wattage: 12, icon: Lightbulb, hours: 6 },
   { name: "AC 1.5T", wattage: 1800, icon: Wind, hours: 8 },
   { name: "Fridge", wattage: 350, icon: Refrigerator, hours: 24 },
   { name: "Deep Freezer", wattage: 450, icon: Refrigerator, hours: 12 },
   { name: "Water Pump", wattage: 1000, icon: Droplets, hours: 0.5 },
   { name: "Electric Iron", wattage: 1000, icon: Zap, hours: 0.5 },
   { name: "Electric Kettle", wattage: 2000, icon: Coffee, hours: 0.2 },
   { name: "Laptop", wattage: 65, icon: Laptop, hours: 8 },
   { name: "Desktop PC", wattage: 300, icon: Monitor, hours: 6 },
   { name: "Gaming Console", wattage: 200, icon: Gamepad, hours: 3 },
   { name: "WiFi Router", wattage: 15, icon: Wifi, hours: 24 },
   { name: "CCTV System", wattage: 50, icon: Video, hours: 24 },
];

const SolarRequirementCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
   const [appliances, setAppliances] = useState<Appliance[]>(DEFAULT_APPLIANCES);
   const [peakSunHours, setPeakSunHours] = useState<number>(5.5);
   const [systemEfficiency, setSystemEfficiency] = useState<number>(80);
   const [copied, setCopied] = useState(false);

   const addAppliance = (preset?: typeof PRESETS[0]) => {
      const newApp: Appliance = {
         id: Math.random().toString(36).substr(2, 9),
         name: preset?.name || "New Appliance",
         wattage: preset?.wattage || 100,
         quantity: 1,
         hours: preset?.hours || 5,
      };
      setAppliances([...appliances, newApp]);
   };

   const updateAppliance = (id: string, field: keyof Appliance, value: string | number) => {
      setAppliances(appliances.map(app =>
         app.id === id ? { ...app, [field]: value } : app
      ));
   };

   const removeAppliance = (id: string) => {
      setAppliances(appliances.filter(app => app.id !== id));
   };

   const results = useMemo(() => {
      const totalWattage = appliances.reduce((sum, app) => sum + (app.wattage * app.quantity), 0);
      const dailyKWh = appliances.reduce((sum, app) => sum + (app.wattage * app.quantity * app.hours), 0) / 1000;

      const requiredKW = dailyKWh / (peakSunHours * (systemEfficiency / 100));
      const suggestedSize = requiredKW <= 3 ? 3 : requiredKW <= 5 ? 5 : requiredKW <= 10 ? 10 : Math.ceil(requiredKW / 5) * 5;

      return {
         totalWattage,
         dailyKWh,
         requiredKW,
         suggestedSize
      };
   }, [appliances, peakSunHours, systemEfficiency]);

   const handleCopy = () => {
      const text = `Solar Load Analysis: ${results.requiredKW.toFixed(1)}kW Recommended | Daily Load: ${results.dailyKWh.toFixed(2)}kWh | Peak Load: ${(results.totalWattage / 1000).toFixed(2)}kW. Calculate your load at ${window.location.href}`;
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
                  <div className="surface-card p-8 md:p-10 space-y-10 bg-background border-border/60 shadow-xl relative overflow-hidden group rounded-2xl">
                     <Zap className="absolute -top-6 -right-6 size-32 text-foreground/[0.03] -rotate-12 transition-transform group-hover:rotate-0 duration-700" />

                     <div className="space-y-8 relative z-10 text-center">
                        <div className="space-y-2">
                           <div className="flex items-center justify-between">
                              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Recommended Capacity</p>
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
                              {results.requiredKW.toFixed(1)} <span className="text-xl opacity-40 uppercase tracking-widest font-sans font-bold">kW</span>
                           </div>
                        </div>

                        <div className="pt-8 border-t border-border/40 space-y-4">
                           <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Suggested Size</p>
                           <div className="px-6 py-4 bg-foreground text-background rounded-2xl font-bold text-2xl shadow-xl shadow-black/10">
                              {results.suggestedSize}kW System
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Highlighted Results Section */}
                  <div className="space-y-4 relative z-10">
                     <div className="surface-card p-6 bg-health/5 border-health/20 shadow-lg shadow-health/5 space-y-2 rounded-2xl">
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-black uppercase tracking-widest text-health/70">Daily Gen</span>
                           <Sun className="size-4 text-health" />
                        </div>
                        <p className="text-3xl font-mono font-black text-health leading-none">
                           {results.dailyKWh.toFixed(2)}<span className="text-sm uppercase ml-1 opacity-60">kWh</span>
                        </p>
                     </div>

                     <div className="surface-card p-6 bg-signal/5 border-signal/20 shadow-lg shadow-signal/5 space-y-2 rounded-2xl">
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-black uppercase tracking-widest text-signal/70">Panels</span>
                           <Layers className="size-4 text-signal" />
                        </div>
                        <p className="text-3xl font-mono font-black text-signal leading-none">
                           {Math.ceil(results.requiredKW * 1000 / 550)}<span className="text-sm uppercase ml-1 opacity-60">Units</span>
                        </p>
                        <p className="text-[9px] text-signal/60 font-bold uppercase">550W Module Basis</p>
                     </div>
                  </div>
               </div>

               {/* Main Panel (Inputs) */}
               <div className="lg:col-span-8 space-y-6 order-2 lg:order-1">
                  <div className="surface-card p-8 space-y-10 bg-secondary/5 border-border/40 overflow-hidden rounded-2xl">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="size-12 rounded-2xl bg-foreground/5 flex items-center justify-center">
                              <Calculator className="size-6 text-foreground/60" />
                           </div>
                           <div className="space-y-1">
                              <h3 className="text-lg font-bold tracking-tight">Load Inventory</h3>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Build your house load profile</p>
                           </div>
                        </div>
                     </div>

                     <div className="flex flex-wrap gap-2 pb-6 border-b border-border/20">
                        {PRESETS.map(p => {
                           const Icon = p.icon;
                           return (
                              <Button key={p.name} variant="outline" size="sm" onClick={() => addAppliance(p)} className="h-10 px-4 text-[9px] font-bold uppercase tracking-widest rounded-xl flex items-center gap-2 hover:bg-secondary/40 transition-colors">
                                 <Icon className="size-3.5" /> {p.name}
                              </Button>
                           );
                        })}
                     </div>

                     {/* Responsive Load List */}
                     <div className="space-y-4">
                        {/* Header (Desktop Only) */}
                        <div className="hidden md:grid grid-cols-[1fr_100px_80px_80px_100px_40px] gap-4 px-4 pb-2 border-b border-border/40">
                           <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Appliance</div>
                           <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Watts</div>
                           <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Qty</div>
                           <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Hours</div>
                           <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Total</div>
                           <div></div>
                        </div>

                        <div className="divide-y md:divide-y-0 divide-border/20 md:space-y-2">
                           {appliances.map((app) => (
                              <div key={app.id} className="group py-6 md:py-0 md:grid grid-cols-[1fr_100px_80px_80px_100px_40px] gap-4 items-center md:px-4 md:h-16 hover:bg-secondary/5 transition-colors rounded-2xl">
                                 {/* Name - Mobile Header */}
                                 <div className="mb-4 md:mb-0">
                                    <Label className="md:hidden text-[9px] font-bold uppercase text-muted-foreground mb-1 block">Appliance Name</Label>
                                    <Input
                                       value={app.name}
                                       onChange={(e) => updateAppliance(app.id, "name", e.target.value)}
                                       className="h-12 md:h-8 font-bold bg-transparent border-none md:border-b md:border-transparent md:focus:border-border focus:ring-0 p-0 text-sm md:text-xs"
                                    />
                                 </div>

                                 {/* Mobile Input Grid */}
                                 <div className="grid grid-cols-3 md:contents gap-4">
                                    <div className="space-y-2 md:space-y-0">
                                       <Label className="md:hidden text-[9px] font-bold uppercase text-muted-foreground block">Watts</Label>
                                       <Input
                                          type="number"
                                          value={app.wattage}
                                          onChange={(e) => updateAppliance(app.id, "wattage", Number(e.target.value))}
                                          className="h-12 md:h-9 text-center font-mono font-bold bg-background md:bg-transparent border-border/60 md:border-none rounded-xl md:rounded-none text-sm md:text-xs"
                                       />
                                    </div>
                                    <div className="space-y-2 md:space-y-0">
                                       <Label className="md:hidden text-[9px] font-bold uppercase text-muted-foreground block">Qty</Label>
                                       <Input
                                          type="number"
                                          value={app.quantity}
                                          onChange={(e) => updateAppliance(app.id, "quantity", Number(e.target.value))}
                                          className="h-12 md:h-9 text-center font-mono font-bold bg-background md:bg-transparent border-border/60 md:border-none rounded-xl md:rounded-none text-sm md:text-xs"
                                       />
                                    </div>
                                    <div className="space-y-2 md:space-y-0">
                                       <Label className="md:hidden text-[9px] font-bold uppercase text-muted-foreground block">Hours</Label>
                                       <Input
                                          type="number"
                                          value={app.hours}
                                          onChange={(e) => updateAppliance(app.id, "hours", Number(e.target.value))}
                                          className="h-12 md:h-9 text-center font-mono font-bold bg-background md:bg-transparent border-border/60 md:border-none rounded-xl md:rounded-none text-sm md:text-xs"
                                       />
                                    </div>
                                 </div>

                                 {/* Total & Delete */}
                                 <div className="mt-4 md:mt-0 flex items-center justify-between md:contents">
                                    <div className="md:text-right">
                                       <Label className="md:hidden text-[9px] font-bold uppercase text-muted-foreground block mb-1">Row Total</Label>
                                       <span className="font-mono font-bold text-sm md:text-xs text-foreground">
                                          {((app.wattage * app.quantity * app.hours) / 1000).toFixed(2)}<span className="ml-1 opacity-40 text-[10px]">kWh</span>
                                       </span>
                                    </div>
                                    <div className="md:text-right">
                                       <button
                                          onClick={() => removeAppliance(app.id)}
                                          className="p-3 md:p-1 text-muted-foreground/30 hover:text-destructive transition-colors md:opacity-0 group-hover:opacity-100"
                                       >
                                          <Trash2 className="size-5 md:size-4" />
                                       </button>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     <Button onClick={() => addAppliance()} variant="outline" className="w-full h-14 border-dashed border-2 text-[10px] font-bold uppercase tracking-widest gap-2 rounded-2xl hover:bg-secondary/40">
                        <Plus className="size-5" /> Add Custom Item
                     </Button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                     <div className="surface-card p-8 space-y-6 bg-secondary/5 border-border/40 rounded-2xl">
                        <div className="flex items-center gap-3">
                           <Sun className="size-4 text-signal" />
                           <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Peak Sun Hours</Label>
                        </div>
                        <div className="flex items-center gap-6">
                           <input type="range" min="3" max="7" step="0.5" value={peakSunHours} onChange={(e) => setPeakSunHours(Number(e.target.value))} className="flex-1 accent-foreground h-1.5 bg-secondary rounded-full appearance-none cursor-pointer" />
                           <span className="font-mono font-bold text-2xl min-w-[3ch]">{peakSunHours}h</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground italic">Pakistan Average: 5.5 hours per day</p>
                     </div>
                     <div className="surface-card p-8 space-y-6 bg-secondary/5 border-border/40 rounded-2xl">
                        <div className="flex items-center gap-3">
                           <Settings2 className="size-4 text-health" />
                           <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Efficiency</Label>
                        </div>
                        <div className="flex items-center gap-6">
                           <input type="range" min="50" max="95" step="5" value={systemEfficiency} onChange={(e) => setSystemEfficiency(Number(e.target.value))} className="flex-1 accent-foreground h-1.5 bg-secondary rounded-full appearance-none cursor-pointer" />
                           <span className="font-mono font-bold text-2xl min-w-[3ch]">{systemEfficiency}%</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground italic">Accounts for inverter and cable losses</p>
                     </div>
                  </div>
               </div>
            </div>

            <div id="how-to-use" className="pt-8 border-t border-border/40">
               <div className="mb-6">
                  <h3 className="text-lg font-bold tracking-tight">How to Use Solar System Requirement Calculator</h3>
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

export default SolarRequirementCalculator;
