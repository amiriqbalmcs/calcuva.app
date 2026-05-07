"use client";

import { useState, useMemo } from "react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { HowToGuide } from "@/components/HowToGuide";
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
  Cpu,
  Copy,
  CheckCircle2
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

export const SolarPanelToKwCalculator = ({ 
  calc, 
  guideHtml, 
  faqs, 
  relatedArticles 
}: { 
  calc: CalcMeta;
  guideHtml?: string;
  faqs?: { q: string; a: string }[];
  relatedArticles?: any[];
}) => {
  const [panelQty, setPanelQty] = useState(10);
  const [panelWattage, setPanelWattage] = useState(550);
  const [copied, setCopied] = useState(false);

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

  const handleCopy = () => {
    const text = `Solar Array: ${results.totalKW.toFixed(2)}kW (${panelQty} panels x ${panelWattage}W) | Monthly Gen: ${results.monthlyKWh.toFixed(0)}kWh | Area: ${results.areaSqFt}sqft. Calculate yours at ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="w-full max-w-7xl mx-auto space-y-12 sm:px-6 lg:px-8">
        
        {/* Main Interface: Side-by-Side Results & Inputs */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Right Column: Results Dashboard */}
          <div className="lg:col-span-4 space-y-6 order-1 lg:order-2">
            <div className="space-y-6 sticky top-32">
              
              {/* Main Capacity Card */}
              <div className="surface-card p-10 space-y-8 bg-background border-border/60 shadow-xl relative overflow-hidden group rounded-3xl">
                <Zap className="absolute -top-6 -right-6 size-32 text-foreground/[0.03] -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
                
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Array Capacity</span>
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{results.systemClass}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
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
                  </div>

                  <div className="space-y-1">
                    <p className="text-6xl font-mono font-black leading-none tracking-tighter text-foreground">
                      {results.totalKW.toFixed(2)}<span className="text-xl font-sans opacity-20 ml-1">kW</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.3em]">Peak Power Potential</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/40 relative">
                    <div className="space-y-1">
                       <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Area Need</p>
                       <p className="text-xl font-mono font-bold text-foreground">{results.areaSqFt}<span className="text-[9px] opacity-40 ml-1">ft²</span></p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Panel Count</p>
                       <p className="text-xl font-mono font-bold text-primary">{panelQty}<span className="text-[9px] text-foreground opacity-40 ml-1 font-sans">Units</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Energy Production Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="surface-card p-6 bg-health/5 border-health/20 shadow-lg shadow-health/5 space-y-2 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-widest text-health/70">Daily</span>
                    <Sun className="size-4 text-health" />
                  </div>
                  <p className="text-2xl font-mono font-black text-health">
                    {results.dailyKWh.toFixed(1)}<span className="text-[10px] font-sans opacity-40 ml-1">kWh</span>
                  </p>
                </div>

                <div className="surface-card p-6 bg-signal/5 border-signal/20 shadow-lg shadow-signal/5 space-y-2 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-widest text-signal/70">Monthly</span>
                    <CalendarDays className="size-4 text-signal" />
                  </div>
                  <p className="text-2xl font-mono font-black text-signal">
                    {results.monthlyKWh.toFixed(0)}<span className="text-[10px] font-sans opacity-40 ml-1">kWh</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

        {/* Main Panel (Inputs) */}
        <div className="lg:col-span-8 space-y-6 order-2 lg:order-1">
          <div className="surface-card p-8 space-y-10 bg-secondary/5 border-border/40 overflow-hidden rounded-3xl">
            <div className="flex items-center gap-4">
               <div className="size-12 rounded-2xl bg-foreground/5 flex items-center justify-center">
                  <Layers className="size-6 text-foreground/60" />
               </div>
               <div className="space-y-1">
                  <h3 className="text-lg font-bold tracking-tight">Array Configuration</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Define your panel specifications</p>
               </div>
            </div>

            {/* Panel Quantity */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-bold tracking-tight uppercase tracking-wider">Number of Panels</Label>
                  <p className="text-[10px] text-muted-foreground font-medium">Total physical modules</p>
                </div>
                <div className="flex items-center gap-3">
                  <Input 
                    type="number" 
                    value={panelQty} 
                    onChange={(e) => setPanelQty(Number(e.target.value))}
                    className="w-28 h-14 text-center font-mono text-2xl font-black bg-background border-border/40 rounded-2xl focus:border-primary transition-all"
                  />
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
                    className="h-10 px-6 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all"
                  >
                    {q} Panels
                  </Button>
                ))}
              </div>
            </div>

            <div className="h-px bg-border/20" />

            {/* Panel Wattage */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-bold tracking-tight uppercase tracking-wider">Panel Wattage (Wp)</Label>
                  <p className="text-[10px] text-muted-foreground font-medium">Power rating per panel</p>
                </div>
                <div className="flex items-center gap-3">
                  <Input 
                    type="number" 
                    value={panelWattage} 
                    onChange={(e) => setPanelWattage(Number(e.target.value))}
                    className="w-28 h-14 text-center font-mono text-2xl font-black bg-background border-border/40 rounded-2xl focus:border-primary transition-all"
                  />
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
                    className="h-10 px-6 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all"
                  >
                    {p.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="surface-card p-8 bg-background border-border/60 shadow-sm space-y-6 rounded-3xl">
             <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-xl bg-secondary/50 flex items-center justify-center">
                  <Ruler className="size-5 text-foreground/60" />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider">Installation Space Guide</h4>
                  <p className="text-[10px] text-muted-foreground">Approximate roof area requirements</p>
                </div>
             </div>
             
             <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                     <span className="text-muted-foreground font-medium">Standard Square Feet</span>
                     <span className="font-bold">{results.areaSqFt} ft²</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                     <span className="text-muted-foreground font-medium">Approx. Marla (Residential)</span>
                     <span className="font-bold">{(results.areaSqFt / 225).toFixed(2)} Marla</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                     <div 
                       className="h-full bg-primary transition-all duration-1000" 
                       style={{ width: `${Math.min((results.areaSqFt / 1000) * 100, 100)}%` }} 
                     />
                  </div>
                </div>

                <div className="p-5 bg-primary/5 border border-primary/20 rounded-2xl flex gap-4">
                  <TrendingUp className="size-5 text-primary shrink-0 mt-1" />
                  <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                    In 2026, **N-Type TopCon** panels offer the best roof-space-to-wattage ratio for residential projects in Pakistan.
                  </p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div id="how-to-use" className="pt-8 border-t border-border/40">
            <div className="mb-6">
              <h3 className="text-lg font-bold tracking-tight">How to Use Solar Panel to kW Calculator</h3>
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

export default SolarPanelToKwCalculator;
