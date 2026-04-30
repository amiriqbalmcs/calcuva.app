"use client";

import { useState, useMemo } from "react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { CalcMeta } from "@/lib/calculators";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Sun, 
  CalendarDays, 
  Layers, 
  Ruler, 
  ArrowRight,
  TrendingUp,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";

const PANEL_PRESETS = [
  { label: "540W", value: 540 },
  { label: "550W", value: 550 },
  { label: "580W", value: 580 },
  { label: "600W", value: 600 },
  { label: "650W", value: 650 },
];

const QTY_PRESETS = [6, 8, 10, 12, 16, 20];

export const SolarPanelToKwCalculator = ({ calc }: { calc: CalcMeta }) => {
  const [panelQty, setPanelQty] = useState(10);
  const [panelWattage, setPanelWattage] = useState(550);

  const results = useMemo(() => {
    const totalWatts = panelQty * panelWattage;
    const totalKW = totalWatts / 1000;
    
    // Pakistani average: 4.2 peak sun hours per day
    const dailyKWh = totalKW * 4.2;
    const monthlyKWh = dailyKWh * 30;
    
    // Space: ~25 sq ft per panel
    const areaSqFt = panelQty * 24;
    
    let systemClass = "Micro System";
    if (totalKW >= 15) systemClass = "Industrial/Commercial";
    else if (totalKW >= 10) systemClass = "Large Residential";
    else if (totalKW >= 5) systemClass = "Standard Home";
    else if (totalKW >= 3) systemClass = "Small Home";

    return {
      totalKW,
      dailyKWh,
      monthlyKWh,
      areaSqFt,
      systemClass
    };
  }, [panelQty, panelWattage]);

  return (
    <CalculatorPage calc={calc}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        
        {/* Input Configuration */}
        <div className="lg:col-span-7 space-y-6">
          <div className="surface-card p-8 space-y-10 bg-secondary/5 border-border/40 relative overflow-hidden">
            
            {/* Panel Quantity */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-bold tracking-tight">Number of Panels</Label>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">How many units in your array?</p>
                </div>
                <div className="flex items-center gap-3">
                  <Input 
                    type="number" 
                    value={panelQty} 
                    onChange={(e) => setPanelQty(Number(e.target.value))}
                    className="w-24 h-12 text-center font-mono text-lg font-black bg-background border-2 border-border/40 rounded-xl focus:border-primary transition-all"
                  />
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Units</span>
                </div>
              </div>

              <Slider 
                value={[panelQty]} 
                onValueChange={([val]) => setPanelQty(val)}
                max={60}
                min={1}
                step={1}
                className="py-4"
              />

              <div className="flex flex-wrap gap-2">
                {QTY_PRESETS.map(q => (
                  <Button 
                    key={q} 
                    variant={panelQty === q ? "default" : "outline"}
                    onClick={() => setPanelQty(q)}
                    className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all"
                  >
                    {q} Panels
                  </Button>
                ))}
              </div>
            </div>

            <div className="h-px bg-border/20" />

            {/* Panel Wattage */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-bold tracking-tight">Panel Wattage (Wp)</Label>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Wattage per individual panel</p>
                </div>
                <div className="flex items-center gap-3">
                  <Input 
                    type="number" 
                    value={panelWattage} 
                    onChange={(e) => setPanelWattage(Number(e.target.value))}
                    className="w-24 h-12 text-center font-mono text-lg font-black bg-background border-2 border-border/40 rounded-xl focus:border-primary transition-all"
                  />
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Watts</span>
                </div>
              </div>

              <Slider 
                value={[panelWattage]} 
                onValueChange={([val]) => setPanelWattage(val)}
                max={750}
                min={100}
                step={5}
                className="py-4"
              />

              <div className="flex flex-wrap gap-2">
                {PANEL_PRESETS.map(p => (
                  <Button 
                    key={p.value} 
                    variant={panelWattage === p.value ? "default" : "outline"}
                    onClick={() => setPanelWattage(p.value)}
                    className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all"
                  >
                    {p.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="surface-card p-6 bg-primary/5 border-primary/20 space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <TrendingUp className="size-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Market Insight</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              In 2026, **580W and 600W N-Type TopCon** panels are the most efficient choices for Pakistani residential projects, offering better performance in high temperatures compared to older 540W modules.
            </p>
          </div>
        </div>

        {/* Results Analysis */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-4 relative z-10">
            
            {/* Main Capacity Card */}
            <div className="p-8 bg-zinc-950 text-white rounded-3xl shadow-2xl space-y-6 overflow-hidden relative group border border-white/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[80px] -mr-16 -mt-16 group-hover:bg-primary/30 transition-all duration-500" />
              
              <div className="flex items-center justify-between relative">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Total Array Capacity</span>
                  <div className="flex items-center gap-2">
                    <Zap className="size-4 text-primary fill-primary" />
                    <span className="text-xs font-bold text-primary uppercase">{results.systemClass}</span>
                  </div>
                </div>
                <div className="size-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Cpu className="size-5 text-white/50" />
                </div>
              </div>

              <div className="space-y-1 relative">
                <p className="text-7xl font-mono font-black leading-none tracking-tighter text-white">
                  {results.totalKW.toFixed(2)}<span className="text-2xl font-sans opacity-20 ml-2">kW</span>
                </p>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em]">Direct Peak Power Potential</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10 relative">
                <div className="space-y-1">
                   <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Array Area</p>
                   <p className="text-xl font-mono font-bold text-white">{results.areaSqFt} <span className="text-[10px] opacity-40">SqFt</span></p>
                </div>
                <div className="space-y-1">
                   <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Total Watts</p>
                   <p className="text-xl font-mono font-bold text-primary">{(results.totalKW * 1000).toLocaleString()}<span className="text-[10px] text-white opacity-40 ml-1 font-sans">W</span></p>
                </div>
              </div>
            </div>

            {/* Energy Production Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="surface-card p-6 bg-health/5 border-health/20 shadow-lg shadow-health/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-widest text-health/70">Daily Avg</span>
                  <Sun className="size-4 text-health" />
                </div>
                <p className="text-3xl font-mono font-black text-health">
                  {results.dailyKWh.toFixed(1)} <span className="text-xs font-sans opacity-40">kWh</span>
                </p>
                <p className="text-[8px] text-health/60 font-bold uppercase">Estimated daily generation</p>
              </div>

              <div className="surface-card p-6 bg-signal/5 border-signal/20 shadow-lg shadow-signal/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-widest text-signal/70">Monthly Avg</span>
                  <CalendarDays className="size-4 text-signal" />
                </div>
                <p className="text-3xl font-mono font-black text-signal">
                  {results.monthlyKWh.toFixed(0)} <span className="text-xs font-sans opacity-40">kWh</span>
                </p>
                <p className="text-[8px] text-signal/60 font-bold uppercase">Monthly grid offsets</p>
              </div>
            </div>

            <div className="surface-card p-8 bg-secondary/5 border-border/40 space-y-6">
               <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-background border border-border flex items-center justify-center">
                    <Ruler className="size-4 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">Installation Space Guide</h4>
                    <p className="text-[10px] text-muted-foreground">Approximate roof area needed</p>
                  </div>
               </div>
               
               <div className="space-y-3">
                 <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Standard Square Feet</span>
                    <span className="font-bold">{results.areaSqFt} ft²</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Approx. Marla (Residential)</span>
                    <span className="font-bold">{(results.areaSqFt / 225).toFixed(2)} Marla</span>
                 </div>
                 <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000" 
                      style={{ width: `${Math.min((results.areaSqFt / 1000) * 100, 100)}%` }} 
                    />
                 </div>
               </div>
            </div>
          </div>
        </div>

      </div>
    </CalculatorPage>
  );
};

export default SolarPanelToKwCalculator;
