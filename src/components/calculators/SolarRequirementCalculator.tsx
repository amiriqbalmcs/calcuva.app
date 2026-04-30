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
  Gamepad, Wifi, Video, Fan
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("solar-system-requirement-calculator");

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
  if (!calc) return null;

  const [appliances, setAppliances] = useState<Appliance[]>(DEFAULT_APPLIANCES);
  const [peakSunHours, setPeakSunHours] = useState<number>(5.5);
  const [systemEfficiency, setSystemEfficiency] = useState<number>(80);

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

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        
        {/* Inputs */}
        <div className="lg:col-span-8 space-y-6">
          <div className="surface-card p-6 md:p-8 space-y-8 bg-secondary/5 border-border/40 relative overflow-hidden">
             <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <h3 className="text-sm font-bold tracking-tight">Appliance Load Inventory</h3>
                   <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Build your house load profile</p>
                </div>
             </div>

             <div className="flex flex-wrap gap-2 pb-4 border-b border-border/20">
                {PRESETS.map(p => {
                   const Icon = p.icon;
                   return (
                      <Button key={p.name} variant="outline" size="sm" onClick={() => addAppliance(p)} className="h-9 text-[9px] font-bold uppercase tracking-widest rounded-xl flex items-center gap-2">
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
                      <div key={app.id} className="group py-6 md:py-0 md:grid grid-cols-[1fr_100px_80px_80px_100px_40px] gap-4 items-center md:px-4 md:h-16 hover:bg-secondary/5 transition-colors rounded-xl">
                         {/* Name - Mobile Header */}
                         <div className="mb-4 md:mb-0">
                            <Label className="md:hidden text-[9px] font-bold uppercase text-muted-foreground mb-1 block">Appliance Name</Label>
                            <Input 
                               value={app.name} 
                               onChange={(e) => updateAppliance(app.id, "name", e.target.value)} 
                               className="h-10 md:h-8 font-bold bg-transparent border-none md:border-b md:border-transparent md:focus:border-border focus:ring-0 p-0 text-sm md:text-xs" 
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
                                  className="h-10 md:h-9 text-center font-mono font-bold bg-background md:bg-transparent border-border/60 md:border-none rounded-xl md:rounded-none text-sm md:text-xs" 
                               />
                            </div>
                            <div className="space-y-2 md:space-y-0">
                               <Label className="md:hidden text-[9px] font-bold uppercase text-muted-foreground block">Qty</Label>
                               <Input 
                                  type="number" 
                                  value={app.quantity} 
                                  onChange={(e) => updateAppliance(app.id, "quantity", Number(e.target.value))} 
                                  className="h-10 md:h-9 text-center font-mono font-bold bg-background md:bg-transparent border-border/60 md:border-none rounded-xl md:rounded-none text-sm md:text-xs" 
                               />
                            </div>
                            <div className="space-y-2 md:space-y-0">
                               <Label className="md:hidden text-[9px] font-bold uppercase text-muted-foreground block">Hours</Label>
                               <Input 
                                  type="number" 
                                  value={app.hours} 
                                  onChange={(e) => updateAppliance(app.id, "hours", Number(e.target.value))} 
                                  className="h-10 md:h-9 text-center font-mono font-bold bg-background md:bg-transparent border-border/60 md:border-none rounded-xl md:rounded-none text-sm md:text-xs" 
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
                                  className="p-2 md:p-1 text-muted-foreground/30 hover:text-destructive transition-colors md:opacity-0 group-hover:opacity-100"
                               >
                                  <Trash2 className="size-4 md:size-3.5" />
                               </button>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
             
             <Button onClick={() => addAppliance()} variant="outline" className="w-full h-12 border-dashed border-2 text-[10px] font-bold uppercase tracking-widest gap-2 rounded-xl">
                <Plus className="size-4" /> Add Custom Item
             </Button>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
             <div className="surface-card p-8 space-y-6 bg-secondary/5 border-border/40">
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
             <div className="surface-card p-8 space-y-6 bg-secondary/5 border-border/40">
                <div className="flex items-center gap-3">
                   <Settings2 className="size-4 text-health" />
                   <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">System Efficiency</Label>
                </div>
                <div className="flex items-center gap-6">
                   <input type="range" min="50" max="95" step="5" value={systemEfficiency} onChange={(e) => setSystemEfficiency(Number(e.target.value))} className="flex-1 accent-foreground h-1.5 bg-secondary rounded-full appearance-none cursor-pointer" />
                   <span className="font-mono font-bold text-2xl min-w-[3ch]">{systemEfficiency}%</span>
                </div>
                <p className="text-[10px] text-muted-foreground italic">Accounts for inverter and cable losses</p>
             </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-4 space-y-6">
           <div className="surface-card p-8 md:p-10 space-y-10 bg-background border-border/60 shadow-md relative overflow-hidden group text-center">
              <Zap className="absolute -top-6 -right-6 size-32 text-foreground/[0.03] -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
              
              <div className="space-y-8 relative z-10 text-center">
                 <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Recommended Solar Capacity</p>
                    <div className="text-6xl md:text-7xl font-mono font-bold tracking-tighter text-foreground leading-none">
                       {results.requiredKW.toFixed(1)} <span className="text-xl md:text-2xl opacity-40 uppercase tracking-widest font-sans font-bold">kW</span>
                    </div>
                 </div>
                 
                 <div className="pt-8 border-t border-border/40 space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Suggested System Size</p>
                    <div className="px-6 py-4 bg-foreground text-background rounded-2xl font-bold text-2xl shadow-xl shadow-black/10">
                       {results.suggestedSize}kW System
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-4 relative z-10">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4 px-2">System Specifications</div>
              
              <div className="space-y-3">
                 <div className="flex justify-between items-center p-5 rounded-2xl bg-health/5 border border-health/10 transition-all hover:scale-[1.02]">
                    <div className="space-y-1">
                       <span className="text-[11px] font-black uppercase tracking-widest text-health/70 block">Daily Generation</span>
                       <span className="text-[9px] text-health/60 font-bold uppercase tracking-tight">Est. Production</span>
                    </div>
                    <span className="text-2xl font-mono font-black text-health">{results.dailyKWh.toFixed(2)} <span className="text-[10px] uppercase opacity-60">kWh</span></span>
                 </div>

                 <div className="flex justify-between items-center p-5 rounded-2xl bg-secondary/30 border border-border/40 transition-all hover:scale-[1.02]">
                    <div className="space-y-1">
                       <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground block">Panel Count</span>
                       <span className="text-[9px] text-muted-foreground/60 font-bold uppercase tracking-tight">550W Tier-1 Mono</span>
                    </div>
                    <span className="text-2xl font-mono font-black text-foreground">{Math.ceil(results.requiredKW * 1000 / 550)} <span className="text-[10px] uppercase opacity-60">Units</span></span>
                 </div>

                 <div className="flex justify-between items-center p-5 rounded-2xl bg-secondary/30 border border-border/40 transition-all hover:scale-[1.02]">
                    <div className="space-y-1">
                       <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground block">Space Required</span>
                       <span className="text-[9px] text-muted-foreground/60 font-bold uppercase tracking-tight">Approx. Rooftop Area</span>
                    </div>
                    <span className="text-2xl font-mono font-black text-foreground">{Math.ceil(results.requiredKW * 80)} <span className="text-[10px] uppercase opacity-60">Sq.Ft</span></span>
                 </div>

                 <div className="flex justify-between items-center p-5 rounded-2xl bg-signal/5 border border-signal/10 transition-all hover:scale-[1.02]">
                    <div className="space-y-1">
                       <span className="text-[11px] font-black uppercase tracking-widest text-signal/70 block">Active Peak Load</span>
                       <span className="text-[9px] text-signal/60 font-bold uppercase tracking-tight">Total Power Draw</span>
                    </div>
                    <span className="text-2xl font-mono font-black text-signal">{(results.totalWattage / 1000).toFixed(2)} <span className="text-[10px] uppercase opacity-60">kW</span></span>
                 </div>
              </div>
           </div>

           <div className="surface-card p-8 bg-secondary/5 border-border/40 space-y-4">
              <div className="flex items-center gap-2 text-health">
                 <ShieldCheck className="size-4" />
                 <span className="text-[10px] font-bold uppercase tracking-wider">Expert Recommendation</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                 For Pakistani households, we recommend a hybrid system if you face power outages. Ensure you use Tier-1 Bifacial panels for maximum efficiency in 2026.
              </p>
           </div>
        </div>

      </div>
    </CalculatorPage>
  );
};

export default SolarRequirementCalculator;
